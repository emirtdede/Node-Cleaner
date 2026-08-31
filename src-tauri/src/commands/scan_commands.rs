use std::process::Command;
use std::sync::Mutex;
use tauri::ipc::Channel;
use tauri::State;

use crate::error::AppError;
use crate::platform::{get_known_dev_locations, KnownLocation};
use crate::scanner::cancellation::CancellationToken;
use crate::scanner::models::{ScanEvent, ScanRequest, ScanSummary};
use crate::scanner::run_scan;

pub struct ScanState {
    pub current_token: Mutex<Option<CancellationToken>>,
}

impl ScanState {
    pub fn new() -> Self {
        Self {
            current_token: Mutex::new(None),
        }
    }
}

impl Default for ScanState {
    fn default() -> Self {
        Self::new()
    }
}

#[tauri::command]
pub async fn start_scan(
    request: ScanRequest,
    on_event: Channel<ScanEvent>,
    state: State<'_, ScanState>,
) -> Result<ScanSummary, AppError> {
    let token = CancellationToken::new();
    {
        let mut current = state.current_token.lock().unwrap();
        if let Some(old) = current.take() {
            old.cancel();
        }
        *current = Some(token.clone());
    }

    let scan_id = format!("scan-{}", std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_millis());

    let event_sink = move |event: ScanEvent| {
        let _ = on_event.send(event);
    };

    run_scan(request, scan_id, token, event_sink).await
}

#[tauri::command]
pub async fn cancel_scan(state: State<'_, ScanState>) -> Result<(), AppError> {
    let mut current = state.current_token.lock().unwrap();
    if let Some(token) = current.take() {
        token.cancel();
    }
    Ok(())
}

#[tauri::command]
pub fn get_known_locations() -> Vec<KnownLocation> {
    get_known_dev_locations()
}

#[tauri::command]
pub fn open_path_in_explorer(path: String) -> Result<(), AppError> {
    let p = std::path::Path::new(&path);
    if !p.exists() {
        return Err(AppError::PathNotFound(path));
    }

    // If path is a file, select it in explorer, if directory, open the directory
    if p.is_dir() {
        Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| AppError::Unknown(e.to_string()))?;
    } else {
        Command::new("explorer")
            .arg(format!("/select,{}", path))
            .spawn()
            .map_err(|e| AppError::Unknown(e.to_string()))?;
    }

    Ok(())
}

#[tauri::command]
pub fn open_url(url: String) -> Result<(), AppError> {
    if !url.starts_with("http://") && !url.starts_with("https://") && !url.starts_with("mailto:") {
        return Err(AppError::Unknown("Geçersiz URL protokolü".to_string()));
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("rundll32")
            .args(["url.dll,FileProtocolHandler", &url])
            .spawn()
            .map_err(|e| AppError::Unknown(e.to_string()))?;
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&url)
            .spawn()
            .map_err(|e| AppError::Unknown(e.to_string()))?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&url)
            .spawn()
            .map_err(|e| AppError::Unknown(e.to_string()))?;
    }

    Ok(())
}

