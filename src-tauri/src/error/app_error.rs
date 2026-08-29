use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "code", content = "message")]
pub enum AppError {
    InvalidPath(String),
    AccessDenied(String),
    PathNotFound(String),
    ScanCancelled(String),
    ScanFailed(String),
    UnsafeDeleteTarget(String),
    RecycleBinFailed(String),
    PermanentDeleteFailed(String),
    SettingsReadFailed(String),
    SettingsWriteFailed(String),
    PlatformUnsupported(String),
    Unknown(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::InvalidPath(msg) => write!(f, "Geçersiz dosya yolu: {}", msg),
            AppError::AccessDenied(msg) => write!(f, "Erişim engellendi: {}", msg),
            AppError::PathNotFound(msg) => write!(f, "Yol bulunamadı: {}", msg),
            AppError::ScanCancelled(msg) => write!(f, "Tarama iptal edildi: {}", msg),
            AppError::ScanFailed(msg) => write!(f, "Tarama başarısız oldu: {}", msg),
            AppError::UnsafeDeleteTarget(msg) => write!(f, "Güvensiz silme hedefi: {}", msg),
            AppError::RecycleBinFailed(msg) => write!(f, "Çöp kutusuna taşıma başarısız: {}", msg),
            AppError::PermanentDeleteFailed(msg) => write!(f, "Kalıcı silme başarısız: {}", msg),
            AppError::SettingsReadFailed(msg) => write!(f, "Ayar okuma hatası: {}", msg),
            AppError::SettingsWriteFailed(msg) => write!(f, "Ayar yazma hatası: {}", msg),
            AppError::PlatformUnsupported(msg) => write!(f, "Platform desteklenmiyor: {}", msg),
            AppError::Unknown(msg) => write!(f, "Bilinmeyen hata: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        match err.kind() {
            std::io::ErrorKind::PermissionDenied => AppError::AccessDenied(err.to_string()),
            std::io::ErrorKind::NotFound => AppError::PathNotFound(err.to_string()),
            _ => AppError::Unknown(err.to_string()),
        }
    }
}
