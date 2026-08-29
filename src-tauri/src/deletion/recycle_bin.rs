use std::path::{Path, PathBuf};
use crate::error::AppError;
use crate::deletion::guard::validate_deletion_target;

pub struct RecycleBinService;

impl RecycleBinService {
    pub fn new() -> Self {
        Self
    }

    pub fn recycle(&self, raw_path: &Path) -> Result<PathBuf, AppError> {
        let canonical = validate_deletion_target(raw_path)?;

        trash::delete(&canonical).map_err(|e| {
            AppError::RecycleBinFailed(format!(
                "Klasör çöp kutusuna taşınamadı ({}): {}",
                canonical.display(),
                e
            ))
        })?;

        Ok(canonical)
    }
}

impl Default for RecycleBinService {
    fn default() -> Self {
        Self::new()
    }
}
