use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::sync::mpsc;
use walkdir::WalkDir;

use crate::scanner::cancellation::CancellationToken;
use crate::scanner::models::ScanProgress;

pub struct MeasurementEngine {
    cancellation_token: CancellationToken,
    concurrency_limit: usize,
}

impl MeasurementEngine {
    pub fn new(cancellation_token: CancellationToken) -> Self {
        let cpu_count = std::thread::available_parallelism()
            .map(|n| n.get())
            .unwrap_or(4);
        // PRD Section 12.2: min(4, max(2, cpu / 2))
        let concurrency = (cpu_count / 2).clamp(2, 4);

        Self {
            cancellation_token,
            concurrency_limit: concurrency,
        }
    }

    pub fn with_concurrency(mut self, limit: usize) -> Self {
        self.concurrency_limit = limit.max(1);
        self
    }

    pub async fn measure_entries<M, P>(
        &self,
        entries: Vec<(String, PathBuf)>, // (id, path)
        total_discovered: u64,
        directories_visited: u64,
        mut on_measured: M,
        mut on_progress: P,
    ) where
        M: FnMut(String, u64),
        P: FnMut(ScanProgress),
    {
        let (tx, mut rx) = mpsc::channel::<(String, u64)>(100);
        let semaphore = Arc::new(tokio::sync::Semaphore::new(self.concurrency_limit));

        let token = self.cancellation_token.clone();
        let entries_count = entries.len();

        for (id, path) in entries {
            if token.is_cancelled() {
                break;
            }

            let sem = semaphore.clone();
            let tx_clone = tx.clone();
            let token_clone = token.clone();

            tokio::spawn(async move {
                let _permit = match sem.acquire().await {
                    Ok(p) => p,
                    Err(_) => return,
                };

                if token_clone.is_cancelled() {
                    return;
                }

                let size = tokio::task::spawn_blocking(move || {
                    calculate_dir_size(&path, &token_clone)
                })
                .await
                .unwrap_or(0);

                let _ = tx_clone.send((id, size)).await;
            });
        }

        // Drop original sender so channel closes when all workers finish
        drop(tx);

        let mut entries_measured = 0u64;
        let mut bytes_measured = 0u64;
        let mut last_progress_report = std::time::Instant::now();

        while let Some((id, size)) = rx.recv().await {
            entries_measured += 1;
            bytes_measured = bytes_measured.saturating_add(size);

            on_measured(id, size);

            if last_progress_report.elapsed().as_millis() >= 100 || entries_measured == entries_count as u64 {
                on_progress(ScanProgress {
                    phase: "measuring".to_string(),
                    directories_visited,
                    entries_found: total_discovered,
                    entries_measured,
                    bytes_measured,
                    current_path: None,
                });
                last_progress_report = std::time::Instant::now();
            }
        }
    }
}

pub fn calculate_dir_size(dir_path: &Path, cancellation_token: &CancellationToken) -> u64 {
    if !dir_path.is_dir() {
        return 0;
    }

    let mut total_bytes = 0u64;

    let walker = WalkDir::new(dir_path)
        .follow_links(false)
        .into_iter()
        .filter_entry(|e| !e.file_type().is_symlink());

    for entry in walker {
        if cancellation_token.is_cancelled() {
            break;
        }

        match entry {
            Ok(entry) => {
                if entry.file_type().is_file() {
                    if let Ok(metadata) = entry.metadata() {
                        total_bytes = total_bytes.saturating_add(metadata.len());
                    }
                }
            }
            Err(_) => {
                // Non-fatal, continue measuring other files
            }
        }
    }

    total_bytes
}
