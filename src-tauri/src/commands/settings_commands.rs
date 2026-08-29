use crate::error::AppError;
use crate::settings::{AppSettings, SettingsRepository};

#[tauri::command]
pub fn get_app_settings() -> AppSettings {
    let repo = SettingsRepository::new();
    repo.load()
}

#[tauri::command]
pub fn save_app_settings(settings: AppSettings) -> Result<(), AppError> {
    let repo = SettingsRepository::new();
    repo.save(&settings)
}
