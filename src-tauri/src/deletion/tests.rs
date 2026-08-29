#[cfg(test)]
mod tests {
    use crate::deletion::*;
    use crate::error::AppError;
    use std::fs::{self, File};
    use std::io::Write;
    use tempfile::tempdir;

    #[test]
    fn test_deletion_guard_exact_basename() {
        let temp = tempdir().unwrap();
        let proj = temp.path().join("my-app");
        let valid_nm = proj.join("node_modules");
        let invalid_nm = proj.join("node_modules_backup");

        fs::create_dir_all(&valid_nm).unwrap();
        fs::create_dir_all(&invalid_nm).unwrap();

        // Valid node_modules passes
        assert!(validate_deletion_target(&valid_nm).is_ok());

        // Invalid basename fails
        let invalid_res = validate_deletion_target(&invalid_nm);
        assert!(invalid_res.is_err());
        match invalid_res.unwrap_err() {
            AppError::UnsafeDeleteTarget(msg) => {
                assert!(msg.contains("tam olarak 'node_modules' olmalıdır"));
            }
            other => panic!("Unexpected error: {:?}", other),
        }

        // Project root fails
        let proj_res = validate_deletion_target(&proj);
        assert!(proj_res.is_err());
    }

    #[test]
    fn test_permanent_delete_flow() {
        let temp = tempdir().unwrap();
        let proj = temp.path().join("project-x");
        let nm = proj.join("node_modules");
        let sub = nm.join("some-pkg");
        fs::create_dir_all(&sub).unwrap();

        let mut file = File::create(sub.join("index.js")).unwrap();
        file.write_all(b"console.log('hello');").unwrap();

        assert!(nm.exists());

        let service = PermanentDeleteService::new();
        let result = service.delete(&nm);

        assert!(result.is_ok());
        assert!(!nm.exists());
        assert!(proj.exists()); // Project root itself must still exist!
    }

    #[test]
    fn test_batch_deletion_coordinator() {
        let temp = tempdir().unwrap();

        let proj1 = temp.path().join("p1");
        let nm1 = proj1.join("node_modules");
        fs::create_dir_all(&nm1).unwrap();

        let proj2 = temp.path().join("p2");
        let nm2 = proj2.join("node_modules");
        fs::create_dir_all(&nm2).unwrap();

        let invalid_path = temp.path().join("non_existent").join("node_modules");

        let coordinator = DeletionCoordinator::new();
        let paths = vec![
            nm1.to_string_lossy().to_string(),
            invalid_path.to_string_lossy().to_string(),
            nm2.to_string_lossy().to_string(),
        ];

        let report = coordinator.delete_batch(&paths, DeleteMode::Permanent, |_| Some(1000));

        assert_eq!(report.total_requested, 3);
        assert_eq!(report.success_count, 2);
        assert_eq!(report.error_count, 1);
        assert_eq!(report.reclaimed_bytes, 2000);

        assert!(!nm1.exists());
        assert!(!nm2.exists());
    }
}
