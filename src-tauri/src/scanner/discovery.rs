use std::path::Path;
use walkdir::WalkDir;

use crate::error::AppError;
use crate::scanner::cancellation::CancellationToken;
use crate::scanner::metadata::extract_project_metadata;
use crate::scanner::models::{EntryStatus, NodeModuleEntry, ScanProgress};

pub struct DiscoveryEngine {
    cancellation_token: CancellationToken,
}

impl DiscoveryEngine {
    pub fn new(cancellation_token: CancellationToken) -> Self {
        Self { cancellation_token }
    }

    pub fn discover<F, P>(
        &self,
        root_path: &Path,
        exclusions: &[String],
        mut on_candidate: F,
        mut on_progress: P,
    ) -> Result<Vec<NodeModuleEntry>, AppError>
    where
        F: FnMut(NodeModuleEntry),
        P: FnMut(ScanProgress),
    {
        if !root_path.exists() {
            return Err(AppError::PathNotFound(root_path.to_string_lossy().to_string()));
        }

        let mut entries = Vec::new();
        let mut directories_visited = 0u64;
        let mut entries_found = 0u64;
        let mut last_progress_report = std::time::Instant::now();

        // Standard exclusions
        let default_exclusions = [
            "$recycle.bin",
            "system volume information",
            ".git",
            ".svn",
            ".hg",
        ];

        let walker = WalkDir::new(root_path)
            .follow_links(false)
            .same_file_system(true)
            .into_iter()
            .filter_entry(|entry| {
                let file_name = entry.file_name().to_string_lossy().to_lowercase();

                // Check exclusions
                if default_exclusions.iter().any(|&ex| file_name == ex) {
                    return false;
                }
                if exclusions.iter().any(|ex| file_name == ex.to_lowercase()) {
                    return false;
                }

                // If this entry is reparse point / symlink, don't follow
                if entry.file_type().is_symlink() {
                    return false;
                }

                true
            });

        let mut it = walker;

        while let Some(result) = it.next() {
            if self.cancellation_token.is_cancelled() {
                return Err(AppError::ScanCancelled("Tarama kullanıcı tarafından iptal edildi.".to_string()));
            }

            match result {
                Ok(dir_entry) => {
                    if dir_entry.file_type().is_dir() {
                        directories_visited += 1;

                        let file_name = dir_entry.file_name().to_string_lossy();
                        if file_name.eq_ignore_ascii_case("node_modules") {
                            // FR-008: Do NOT descend into children of node_modules
                            it.skip_current_dir();

                            let nm_path = dir_entry.path().to_path_buf();
                            let project_path = nm_path
                                .parent()
                                .unwrap_or(&nm_path)
                                .to_path_buf();

                            let meta = extract_project_metadata(&nm_path);

                            let id = generate_stable_id(&nm_path);

                            let entry = NodeModuleEntry {
                                id,
                                node_modules_path: nm_path.to_string_lossy().to_string(),
                                project_path: project_path.to_string_lossy().to_string(),
                                project_name: meta.project_name,
                                root_project_path: meta.root_project_path,
                                root_project_name: meta.root_project_name,
                                package_manager: meta.package_manager,
                                size_bytes: None,
                                modified_at: meta.modified_at,
                                package_json_found: meta.package_json_found,
                                lockfile: meta.lockfile,
                                status: EntryStatus::Measuring,
                                error_code: None,
                            };

                            entries_found += 1;
                            on_candidate(entry.clone());
                            entries.push(entry);
                        }

                        // Throttle progress update ~100ms
                        if last_progress_report.elapsed().as_millis() >= 100 {
                            on_progress(ScanProgress {
                                phase: "discovering".to_string(),
                                directories_visited,
                                entries_found,
                                entries_measured: 0,
                                bytes_measured: 0,
                                current_path: Some(dir_entry.path().to_string_lossy().to_string()),
                            });
                            last_progress_report = std::time::Instant::now();
                        }
                    }
                }
                Err(_err) => {
                    // Non-fatal error (Access Denied, broken symlink, locked folder)
                    // Continue scanning without crashing
                }
            }
        }

        // Final discovery progress
        on_progress(ScanProgress {
            phase: "discovering".to_string(),
            directories_visited,
            entries_found,
            entries_measured: 0,
            bytes_measured: 0,
            current_path: None,
        });

        Ok(entries)
    }
}

fn generate_stable_id(path: &Path) -> String {
    use std::collections::hash_map::DefaultHasher;
    use std::hash::{Hash, Hasher};

    let mut hasher = DefaultHasher::new();
    path.to_string_lossy().to_lowercase().hash(&mut hasher);
    format!("nm-{:x}", hasher.finish())
}
