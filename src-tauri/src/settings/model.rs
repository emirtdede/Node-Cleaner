use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct FavoriteItem {
    pub id: String,
    pub label: String,
    pub path: String,
    pub created_at: String,
    pub last_used_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SortConfig {
    pub field: String,
    pub direction: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub schema_version: u32,
    pub theme: String,
    pub reduce_motion: bool,
    pub favorites: Vec<FavoriteItem>,
    pub recent_locations: Vec<String>,
    pub last_scan_path: Option<String>,
    pub sort: SortConfig,
    #[serde(default)]
    pub language: Option<String>,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            schema_version: 1,
            theme: "dark-transparent".to_string(),
            reduce_motion: false,
            favorites: Vec::new(),
            recent_locations: Vec::new(),
            last_scan_path: None,
            sort: SortConfig {
                field: "size".to_string(),
                direction: "desc".to_string(),
            },
            language: None,
        }
    }
}
