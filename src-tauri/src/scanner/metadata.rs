use std::fs;
use std::path::Path;
use serde_json::Value;
use std::time::SystemTime;
use crate::scanner::models::PackageManager;

pub struct ProjectMetadata {
    pub project_name: String,
    pub root_project_path: Option<String>,
    pub root_project_name: Option<String>,
    pub package_manager: PackageManager,
    pub package_json_found: bool,
    pub lockfile: Option<String>,
    pub modified_at: Option<String>,
}

pub fn extract_project_metadata(node_modules_path: &Path) -> ProjectMetadata {
    let project_path = node_modules_path.parent().unwrap_or(node_modules_path);

    let default_project_name = project_path
        .file_name()
        .map(|n| n.to_string_lossy().to_string())
        .unwrap_or_else(|| "Bilinmeyen Proje".to_string());

    let mut project_name = default_project_name.clone();
    let mut package_json_found = false;
    let mut detected_manager = PackageManager::Unknown;
    let mut lockfile_name: Option<String> = None;

    // 1. Read immediate package.json if present
    let package_json_path = project_path.join("package.json");
    if package_json_path.is_file() {
        package_json_found = true;
        if let Ok(content) = fs::read_to_string(&package_json_path) {
            if let Ok(json) = serde_json::from_str::<Value>(&content) {
                // Name
                if let Some(name) = json.get("name").and_then(|v| v.as_str()) {
                    let trimmed = name.trim();
                    if !trimmed.is_empty() {
                        project_name = trimmed.to_string();
                    }
                }

                // packageManager field
                if let Some(pm) = json.get("packageManager").and_then(|v| v.as_str()) {
                    let lower = pm.to_lowercase();
                    if lower.starts_with("pnpm") {
                        detected_manager = PackageManager::Pnpm;
                    } else if lower.starts_with("yarn") {
                        detected_manager = PackageManager::Yarn;
                    } else if lower.starts_with("bun") {
                        detected_manager = PackageManager::Bun;
                    } else if lower.starts_with("npm") {
                        detected_manager = PackageManager::Npm;
                    }
                }
            }
        }
    }

    // 2. Check local lockfiles in current project directory
    if detected_manager == PackageManager::Unknown {
        if project_path.join("pnpm-lock.yaml").is_file() {
            detected_manager = PackageManager::Pnpm;
            lockfile_name = Some("pnpm-lock.yaml".to_string());
        } else if project_path.join("yarn.lock").is_file() {
            detected_manager = PackageManager::Yarn;
            lockfile_name = Some("yarn.lock".to_string());
        } else if project_path.join("bun.lockb").is_file() {
            detected_manager = PackageManager::Bun;
            lockfile_name = Some("bun.lockb".to_string());
        } else if project_path.join("bun.lock").is_file() {
            detected_manager = PackageManager::Bun;
            lockfile_name = Some("bun.lock".to_string());
        } else if project_path.join("package-lock.json").is_file() {
            detected_manager = PackageManager::Npm;
            lockfile_name = Some("package-lock.json".to_string());
        }
    }

    // 3. Monorepo / Parent directory inspection (Search up to 4 levels)
    let mut root_project_path: Option<String> = None;
    let mut root_project_name: Option<String> = None;

    let mut current = project_path.parent();
    let mut depth = 0;

    while let Some(parent) = current {
        depth += 1;
        if depth > 4 {
            break;
        }

        // Stop if reaching filesystem root (e.g. "C:\" or "/")
        if parent.parent().is_none() {
            break;
        }

        let has_workspace_file = parent.join("pnpm-workspace.yaml").is_file()
            || parent.join("turbo.json").is_file()
            || parent.join("lerna.json").is_file()
            || parent.join("nx.json").is_file();

        let parent_pkg_json = parent.join("package.json");
        let has_workspace_pkg = if parent_pkg_json.is_file() {
            if let Ok(content) = fs::read_to_string(&parent_pkg_json) {
                if let Ok(json) = serde_json::from_str::<Value>(&content) {
                    json.get("workspaces").is_some()
                } else {
                    false
                }
            } else {
                false
            }
        } else {
            false
        };

        let has_root_lockfile = (parent.join("pnpm-lock.yaml").is_file()
            || parent.join("yarn.lock").is_file()
            || parent.join("bun.lockb").is_file()
            || parent.join("bun.lock").is_file()
            || parent.join("package-lock.json").is_file())
            && parent_pkg_json.is_file(); // Must also have package.json to be a project root

        if has_workspace_file || has_workspace_pkg || has_root_lockfile {
            // Found parent project root
            root_project_path = Some(parent.to_string_lossy().to_string());

            // Extract root project name
            let mut r_name = parent
                .file_name()
                .map(|n| n.to_string_lossy().to_string())
                .unwrap_or_else(|| "Monorepo Projesi".to_string());

            if parent_pkg_json.is_file() {
                if let Ok(content) = fs::read_to_string(&parent_pkg_json) {
                    if let Ok(json) = serde_json::from_str::<Value>(&content) {
                        if let Some(name) = json.get("name").and_then(|v| v.as_str()) {
                            let t = name.trim();
                            if !t.is_empty() {
                                r_name = t.to_string();
                            }
                        }
                    }
                }
            }
            root_project_name = Some(r_name);

            // Inherit package manager from monorepo root if unknown
            if detected_manager == PackageManager::Unknown {
                if parent.join("pnpm-workspace.yaml").is_file() || parent.join("pnpm-lock.yaml").is_file() {
                    detected_manager = PackageManager::Pnpm;
                    lockfile_name = Some("pnpm-lock.yaml".to_string());
                } else if parent.join("yarn.lock").is_file() {
                    detected_manager = PackageManager::Yarn;
                    lockfile_name = Some("yarn.lock".to_string());
                } else if parent.join("bun.lockb").is_file() {
                    detected_manager = PackageManager::Bun;
                    lockfile_name = Some("bun.lockb".to_string());
                } else if parent.join("bun.lock").is_file() {
                    detected_manager = PackageManager::Bun;
                    lockfile_name = Some("bun.lock".to_string());
                } else if parent.join("package-lock.json").is_file() {
                    detected_manager = PackageManager::Npm;
                    lockfile_name = Some("package-lock.json".to_string());
                }
            }

            break;
        }

        current = parent.parent();
    }

    // If no parent monorepo was identified, this project is its own root
    if root_project_path.is_none() {
        root_project_path = Some(project_path.to_string_lossy().to_string());
        root_project_name = Some(project_name.clone());
    }

    // 4. Modified time
    let modified_at = fs::metadata(node_modules_path)
        .ok()
        .and_then(|m| m.modified().ok())
        .map(system_time_to_iso);

    ProjectMetadata {
        project_name,
        root_project_path,
        root_project_name,
        package_manager: detected_manager,
        package_json_found,
        lockfile: lockfile_name,
        modified_at,
    }
}

fn system_time_to_iso(time: SystemTime) -> String {
    match time.duration_since(SystemTime::UNIX_EPOCH) {
        Ok(dur) => {
            let secs = dur.as_secs();
            // Format to UTC ISO 8601 string: YYYY-MM-DDTHH:MM:SSZ
            format_timestamp(secs)
        }
        Err(_) => "1970-01-01T00:00:00Z".to_string(),
    }
}

fn format_timestamp(secs: u64) -> String {
    let days = secs / 86400;
    let rem_secs = secs % 86400;
    let hours = rem_secs / 3600;
    let mins = (rem_secs % 3600) / 60;
    let s = rem_secs % 60;

    let (year, month, day) = days_to_date(days);
    format!(
        "{:04}-{:02}-{:02}T{:02}:{:02}:{:02}Z",
        year, month, day, hours, mins, s
    )
}

fn days_to_date(days_since_epoch: u64) -> (u32, u32, u32) {
    let z = days_since_epoch as i64 + 719468;
    let era = if z >= 0 { z } else { z - 146096 } / 146097;
    let doe = (z - era * 146097) as u32;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe as i64 + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if mp < 10 { mp + 3 } else { mp - 9 };
    let y = if m <= 2 { y + 1 } else { y };
    (y as u32, m, d)
}
