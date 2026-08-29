use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KnownLocation {
    pub id: String,
    pub path: String,
    pub label: String,
    pub source: String,
}

pub fn get_known_dev_locations() -> Vec<KnownLocation> {
    let mut locations = Vec::new();

    let user_profile = match std::env::var("USERPROFILE") {
        Ok(p) => PathBuf::from(p),
        Err(_) => return locations,
    };

    // 1. Desktop
    let desktop = user_profile.join("Desktop");
    if desktop.is_dir() {
        locations.push(KnownLocation {
            id: "loc-desktop".to_string(),
            path: desktop.to_string_lossy().to_string(),
            label: "Masaüstü".to_string(),
            source: "default".to_string(),
        });
    }

    // 2. Documents
    let docs = user_profile.join("Documents");
    if docs.is_dir() {
        locations.push(KnownLocation {
            id: "loc-documents".to_string(),
            path: docs.to_string_lossy().to_string(),
            label: "Belgeler".to_string(),
            source: "default".to_string(),
        });
    }

    // 3. Common Dev folders under UserProfile
    let candidates = [
        ("Projects", "Projeler"),
        ("Code", "Kod (Code)"),
        ("Dev", "Geliştirme (Dev)"),
        ("Development", "Development"),
        ("source\\repos", "Visual Studio Repos"),
        ("workspace", "Workspace"),
        ("workspaces", "Workspaces"),
    ];

    for (subpath, label) in &candidates {
        let full = user_profile.join(subpath);
        if full.is_dir() {
            locations.push(KnownLocation {
                id: format!("loc-{}", subpath.replace('\\', "-")),
                path: full.to_string_lossy().to_string(),
                label: label.to_string(),
                source: "default".to_string(),
            });
        }
    }

    // 4. Drive root common dev folders (e.g. C:\Projects, D:\Projects)
    let drive_candidates = [
        r"C:\Projects",
        r"C:\Code",
        r"C:\Dev",
        r"D:\Projects",
        r"D:\Code",
        r"D:\Dev",
    ];

    for path_str in &drive_candidates {
        let p = Path::new(path_str);
        if p.is_dir() {
            let label = p.file_name().unwrap_or_default().to_string_lossy().to_string();
            locations.push(KnownLocation {
                id: format!("loc-drive-{}", path_str.replace([':', '\\'], "-")),
                path: path_str.to_string(),
                label: format!("{} ({})", label, &path_str[..2]),
                source: "default".to_string(),
            });
        }
    }

    locations
}
