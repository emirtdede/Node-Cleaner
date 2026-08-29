use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;
use crate::error::AppError;
use crate::deletion::guard::validate_deletion_target;

pub struct PermanentDeleteService;

impl PermanentDeleteService {
    pub fn new() -> Self {
        Self
    }

    pub fn delete(&self, raw_path: &Path) -> Result<PathBuf, AppError> {
        let canonical = validate_deletion_target(raw_path)?;

        // Strip read-only flags inside folder to prevent Windows PermissionDenied errors
        make_writable_recursively(&canonical);

        fs::remove_dir_all(&canonical).map_err(|e| {
            AppError::PermanentDeleteFailed(format!(
                "Kalıcı silme işlemi tamamlanamadı ({}): {}",
                canonical.display(),
                e
            ))
        })?;

        Ok(canonical)
    }
}

impl Default for PermanentDeleteService {
    fn default() -> Self {
        Self::new()
    }
}

fn make_writable_recursively(dir_path: &Path) {
    for entry in WalkDir::new(dir_path).into_iter().filter_map(|e| e.ok()) {
        if let Ok(metadata) = entry.metadata() {
            let mut permissions = metadata.permissions();
            if permissions.readonly() {
                #[allow(clippy::permissions_set_readonly_false)]
                permissions.set_readonly(false);
                let _ = fs::set_permissions(entry.path(), permissions);
            }
        }
    }
}
