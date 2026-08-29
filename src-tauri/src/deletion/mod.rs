pub mod guard;
pub mod permanent;
pub mod recycle_bin;

#[cfg(test)]
mod tests;

use std::path::Path;
use serde::{Deserialize, Serialize};

pub use guard::validate_deletion_target;
pub use permanent::PermanentDeleteService;
pub use recycle_bin::RecycleBinService;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum DeleteMode {
    RecycleBin,
    Permanent,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeletionPathResult {
    pub path: String,
    pub success: bool,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DeletionReport {
    pub mode: DeleteMode,
    pub total_requested: u64,
    pub success_count: u64,
    pub error_count: u64,
    pub reclaimed_bytes: u64,
    pub results: Vec<DeletionPathResult>,
}

pub struct DeletionCoordinator {
    recycle_service: RecycleBinService,
    permanent_service: PermanentDeleteService,
}

impl DeletionCoordinator {
    pub fn new() -> Self {
        Self {
            recycle_service: RecycleBinService::new(),
            permanent_service: PermanentDeleteService::new(),
        }
    }

    pub fn delete_batch<F>(
        &self,
        paths: &[String],
        mode: DeleteMode,
        mut get_size_for_path: F,
    ) -> DeletionReport
    where
        F: FnMut(&str) -> Option<u64>,
    {
        let total_requested = paths.len() as u64;
        let mut success_count = 0u64;
        let mut error_count = 0u64;
        let mut reclaimed_bytes = 0u64;
        let mut results = Vec::with_capacity(paths.len());

        for raw_path_str in paths {
            let path = Path::new(raw_path_str);
            let size = get_size_for_path(raw_path_str).unwrap_or(0);

            let op_result = match mode {
                DeleteMode::RecycleBin => self.recycle_service.recycle(path),
                DeleteMode::Permanent => self.permanent_service.delete(path),
            };

            match op_result {
                Ok(_canonical) => {
                    success_count += 1;
                    reclaimed_bytes = reclaimed_bytes.saturating_add(size);
                    results.push(DeletionPathResult {
                        path: raw_path_str.clone(),
                        success: true,
                        error: None,
                    });
                }
                Err(err) => {
                    error_count += 1;
                    results.push(DeletionPathResult {
                        path: raw_path_str.clone(),
                        success: false,
                        error: Some(err.to_string()),
                    });
                }
            }
        }

        DeletionReport {
            mode,
            total_requested,
            success_count,
            error_count,
            reclaimed_bytes,
            results,
        }
    }
}

impl Default for DeletionCoordinator {
    fn default() -> Self {
        Self::new()
    }
}
