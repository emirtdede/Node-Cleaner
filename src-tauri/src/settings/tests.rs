#[cfg(test)]
mod tests {
    use crate::settings::*;
    use std::fs::File;
    use std::io::Write;
    use tempfile::tempdir;

    #[test]
    fn test_settings_default_on_non_existent() {
        let temp = tempdir().unwrap();
        let config_path = temp.path().join("config.json");
        let repo = SettingsRepository::with_path(config_path);

        let settings = repo.load();
        assert_eq!(settings.schema_version, 1);
        assert_eq!(settings.theme, "dark-transparent");
        assert!(!settings.reduce_motion);
    }

    #[test]
    fn test_settings_save_and_load_roundtrip() {
        let temp = tempdir().unwrap();
        let config_path = temp.path().join("config.json");
        let repo = SettingsRepository::with_path(config_path);

        let mut settings = AppSettings::default();
        settings.theme = "white".to_string();
        settings.reduce_motion = true;
        settings.favorites.push(FavoriteItem {
            id: "fav-1".to_string(),
            label: "My Code".to_string(),
            path: "C:\\Code".to_string(),
            created_at: "2026-08-28T00:00:00Z".to_string(),
            last_used_at: None,
        });

        repo.save(&settings).expect("Failed to save settings");

        let loaded = repo.load();
        assert_eq!(loaded.theme, "white");
        assert!(loaded.reduce_motion);
        assert_eq!(loaded.favorites.len(), 1);
        assert_eq!(loaded.favorites[0].label, "My Code");
    }

    #[test]
    fn test_settings_corrupt_json_fallback() {
        let temp = tempdir().unwrap();
        let config_path = temp.path().join("config.json");
        {
            let mut file = File::create(&config_path).unwrap();
            file.write_all(b"{ this is invalid JSON garbage ---").unwrap();
        }

        let repo = SettingsRepository::with_path(config_path);
        let settings = repo.load();

        // Must gracefully return default settings
        assert_eq!(settings.schema_version, 1);
        assert_eq!(settings.theme, "dark-transparent");
    }
}
