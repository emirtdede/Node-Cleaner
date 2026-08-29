use std::fs;
use std::path::{Path, PathBuf};
use crate::error::AppError;

pub fn validate_deletion_target(target: &Path) -> Result<PathBuf, AppError> {
    // 1. Basic path validation
    if !target.exists() {
        return Err(AppError::PathNotFound(target.to_string_lossy().to_string()));
    }

    if !target.is_dir() {
        return Err(AppError::UnsafeDeleteTarget(format!(
            "Hedef bir klasör değil: {}",
            target.to_string_lossy()
        )));
    }

    // 2. Canonicalize
    let canonical = match fs::canonicalize(target) {
        Ok(p) => p,
        Err(e) => return Err(AppError::InvalidPath(format!("Canonicalize başarısız: {}", e))),
    };

    // Strip Windows extended prefix `\\?\` for checks if present
    let path_str = canonical.to_string_lossy();
    let clean_str = if path_str.starts_with(r"\\?\") {
        &path_str[4..]
    } else {
        &path_str
    };
    let clean_path = Path::new(clean_str);

    // 3. SEC-DEL-001: Exact basename must be "node_modules"
    let file_name = clean_path
        .file_name()
        .map(|n| n.to_string_lossy())
        .ok_or_else(|| {
            AppError::UnsafeDeleteTarget("Geçersiz dosya adı component'i.".to_string())
        })?;

    if !file_name.eq_ignore_ascii_case("node_modules") {
        return Err(AppError::UnsafeDeleteTarget(format!(
            "Hedef klasörün adı tam olarak 'node_modules' olmalıdır. Alınan: {}",
            file_name
        )));
    }

    // 4. SEC-DEL-005: Root & System Path Guard
    let components: Vec<_> = clean_path.components().collect();
    if components.len() < 3 {
        // e.g. C:\node_modules is rejected as unsafe suspicious root
        return Err(AppError::UnsafeDeleteTarget(format!(
            "Yol güvenlik derinliği yetersiz: {}",
            clean_str
        )));
    }

    // Check system directory roots across any drive letter (c:, d:, e:, etc.)
    let forbidden_names = [
        "windows",
        "program files",
        "program files (x86)",
        "programdata",
        "system volume information",
        "$recycle.bin",
        "recovery",
        "msocache",
    ];

    for comp in &components {
        let comp_str = comp.as_os_str().to_string_lossy().to_lowercase();
        for forbidden in &forbidden_names {
            if comp_str == *forbidden {
                return Err(AppError::UnsafeDeleteTarget(format!(
                    "Sistem dizini altındaki klasörler silinemez: {}",
                    clean_str
                )));
            }
        }
    }

    // User profile root check (e.g. C:\Users\emir\node_modules where parent is user root)
    if let Ok(user_profile) = std::env::var("USERPROFILE") {
        let user_prof_lower = user_profile.to_lowercase();
        if clean_path.parent().map(|p| p.to_string_lossy().to_lowercase()) == Some(user_prof_lower) {
            return Err(AppError::UnsafeDeleteTarget(
                "Kullanıcı profil kök dizinindeki node_modules doğrudan silinemez.".to_string(),
            ));
        }
    }

    Ok(canonical)
}
