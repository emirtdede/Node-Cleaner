use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum PackageManager {
    Npm,
    Pnpm,
    Yarn,
    Bun,
    Unknown,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EntryStatus {
    Ready,
    Measuring,
    Error,
    Deleted,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NodeModuleEntry {
    pub id: String,
    pub node_modules_path: String,
    pub project_path: String,
    pub project_name: String,
    pub root_project_path: Option<String>,
    pub root_project_name: Option<String>,
    pub package_manager: PackageManager,
    pub size_bytes: Option<u64>,
    pub modified_at: Option<String>,
    pub package_json_found: boolean_compat::BoolCompat,
    pub lockfile: Option<String>,
    pub status: EntryStatus,
    pub error_code: Option<String>,
}

mod boolean_compat {
    pub type BoolCompat = bool;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanRequest {
    pub root_path: String,
    pub exclusions: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanProgress {
    pub phase: String, // "discovering" | "measuring"
    pub directories_visited: u64,
    pub entries_found: u64,
    pub entries_measured: u64,
    pub bytes_measured: u64,
    pub current_path: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanSummary {
    pub scan_id: String,
    pub root_path: String,
    pub total_entries: u64,
    pub total_bytes: u64,
    pub duration_ms: u64,
    pub errors_count: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ScanEvent {
    #[serde(rename = "started", rename_all = "camelCase")]
    Started { scan_id: String },
    #[serde(rename = "candidate", rename_all = "camelCase")]
    Candidate { entry: NodeModuleEntry },
    #[serde(rename = "measured", rename_all = "camelCase")]
    Measured { id: String, size_bytes: u64 },
    #[serde(rename = "progress", rename_all = "camelCase")]
    Progress { progress: ScanProgress },
    #[serde(rename = "warning", rename_all = "camelCase")]
    Warning { code: String, path: Option<String> },
    #[serde(rename = "completed", rename_all = "camelCase")]
    Completed { summary: ScanSummary },
    #[serde(rename = "cancelled", rename_all = "camelCase")]
    Cancelled { summary: ScanSummary },
    #[serde(rename = "failed", rename_all = "camelCase")]
    Failed { error: crate::error::AppError },
}
