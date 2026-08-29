use crate::deletion::{DeleteMode, DeletionCoordinator, DeletionReport};
use crate::error::AppError;

#[tauri::command]
pub async fn delete_node_modules(
    paths: Vec<String>,
    mode: DeleteMode,
) -> Result<DeletionReport, AppError> {
    let coordinator = DeletionCoordinator::new();

    // Spawn on blocking thread pool since filesystem deletion and COM operations can be blocking
    let report = tokio::task::spawn_blocking(move || {
        coordinator.delete_batch(&paths, mode, |_| None)
    })
    .await
    .map_err(|e| AppError::Unknown(e.to_string()))?;

    Ok(report)
}
