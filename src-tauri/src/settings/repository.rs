use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};
use crate::error::AppError;
use crate::settings::model::AppSettings;

pub struct SettingsRepository {
    config_path: PathBuf,
}

impl SettingsRepository {
    pub fn new() -> Self {
        let base_dir = dirs_or_fallback();
        let app_dir = base_dir.join("node-cleaner");
        let _ = fs::create_dir_all(&app_dir);
        let config_path = app_dir.join("config.json");

        Self { config_path }
    }

    pub fn with_path(config_path: PathBuf) -> Self {
        if let Some(parent) = config_path.parent() {
            let _ = fs::create_dir_all(parent);
        }
        Self { config_path }
    }

    pub fn load(&self) -> AppSettings {
        if !self.config_path.exists() {
            return AppSettings::default();
        }

        let mut file = match File::open(&self.config_path) {
            Ok(f) => f,
            Err(_) => return AppSettings::default(),
        };

        let mut content = String::new();
        if file.read_to_string(&mut content).is_err() {
            return AppSettings::default();
        }

        match serde_json::from_str::<AppSettings>(&content) {
            Ok(mut settings) => {
                self.migrate_if_needed(&mut settings);
                settings
            }
            Err(_) => {
                // PRD Section 29: Corrupted JSON must not crash startup; fallback to default
                AppSettings::default()
            }
        }
    }

    pub fn save(&self, settings: &AppSettings) -> Result<(), AppError> {
        let parent = self
            .config_path
            .parent()
            .unwrap_or_else(|| Path::new("."));
        let _ = fs::create_dir_all(parent);

        let json_str = serde_json::to_string_pretty(settings)
            .map_err(|e| AppError::SettingsWriteFailed(e.to_string()))?;

        // PRD Section 29: Atomic Write (write to temp file, flush, rename/replace)
        let temp_path = parent.join(format!("config.tmp.{}", std::process::id()));

        {
            let mut temp_file = File::create(&temp_path)
                .map_err(|e| AppError::SettingsWriteFailed(format!("Temp dosya oluşturulamadı: {}", e)))?;
            temp_file
                .write_all(json_str.as_bytes())
                .map_err(|e| AppError::SettingsWriteFailed(format!("Temp dosyaya yazılamadı: {}", e)))?;
            temp_file
                .flush()
                .map_err(|e| AppError::SettingsWriteFailed(format!("Temp dosya flush başarısız: {}", e)))?;
        }

        // Rename temp to target
        fs::rename(&temp_path, &self.config_path)
            .or_else(|_| {
                // On Windows, rename might fail if destination exists in some scenarios, fallback to copy+remove
                let _ = fs::copy(&temp_path, &self.config_path);
                let _ = fs::remove_file(&temp_path);
                Ok::<(), std::io::Error>(())
            })
            .map_err(|e| AppError::SettingsWriteFailed(format!("Ayar dosyası değiştirilemedi: {}", e)))?;

        Ok(())
    }

    fn migrate_if_needed(&self, settings: &mut AppSettings) {
        if settings.schema_version == 0 {
            settings.schema_version = 1;
        }
        // Future migrations: v1 -> v2, etc.
    }
}

impl Default for SettingsRepository {
    fn default() -> Self {
        Self::new()
    }
}

fn dirs_or_fallback() -> PathBuf {
    if let Ok(appdata) = std::env::var("APPDATA") {
        return PathBuf::from(appdata);
    }
    if let Ok(userprofile) = std::env::var("USERPROFILE") {
        return PathBuf::from(userprofile).join(".config");
    }
    PathBuf::from(".")
}
