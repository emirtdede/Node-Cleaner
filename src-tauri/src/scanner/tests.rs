#[cfg(test)]
mod tests {
    use crate::scanner::*;
    use crate::error::AppError;
    use std::fs::{self, File};
    use std::io::Write;
    use tempfile::tempdir;

    #[test]
    fn test_cancellation_token() {
        let token = CancellationToken::new();
        assert!(!token.is_cancelled());

        token.cancel();
        assert!(token.is_cancelled());

        token.reset();
        assert!(!token.is_cancelled());
    }

    #[test]
    fn test_discovery_and_metadata_extraction() {
        let temp = tempdir().expect("Failed to create temp dir");
        let root = temp.path();

        // Project A: with package.json (pnpm)
        let proj_a = root.join("project-a");
        let proj_a_nm = proj_a.join("node_modules");
        let proj_a_nm_sub = proj_a_nm.join("nested-dep").join("node_modules");
        fs::create_dir_all(&proj_a_nm_sub).unwrap();

        let mut pkg_json_a = File::create(proj_a.join("package.json")).unwrap();
        writeln!(pkg_json_a, r#"{{"name": "@company/project-a", "packageManager": "pnpm@9.0.0"}}"#).unwrap();
        File::create(proj_a.join("pnpm-lock.yaml")).unwrap();

        // Dummy file in node_modules
        {
            let mut dummy = File::create(proj_a_nm.join("file.txt")).unwrap();
            dummy.write_all(b"hello world").unwrap();
            dummy.sync_all().unwrap();
        }

        // Project B: Yarn lock without packageManager string
        let proj_b = root.join("project-b");
        let proj_b_nm = proj_b.join("node_modules");
        fs::create_dir_all(&proj_b_nm).unwrap();
        let mut pkg_json_b = File::create(proj_b.join("package.json")).unwrap();
        writeln!(pkg_json_b, r#"{{"name": "project-b"}}"#).unwrap();
        File::create(proj_b.join("yarn.lock")).unwrap();

        // Project C: Bun lock
        let proj_c = root.join("project-c");
        let proj_c_nm = proj_c.join("node_modules");
        fs::create_dir_all(&proj_c_nm).unwrap();
        File::create(proj_c.join("bun.lockb")).unwrap();

        // Project D: No package.json
        let proj_d = root.join("project-d");
        let proj_d_nm = proj_d.join("node_modules");
        fs::create_dir_all(&proj_d_nm).unwrap();

        // Run discovery
        let token = CancellationToken::new();
        let discovery = DiscoveryEngine::new(token.clone());

        let mut candidates = Vec::new();
        let entries = discovery
            .discover(
                root,
                &[],
                |c| candidates.push(c),
                |_| {},
            )
            .expect("Discovery failed");

        // Must find exactly 4 projects (nested node_modules must NOT be emitted)
        assert_eq!(entries.len(), 4);
        assert_eq!(candidates.len(), 4);

        let find_a = entries.iter().find(|e| e.project_name == "@company/project-a").unwrap();
        assert_eq!(find_a.package_manager, PackageManager::Pnpm);
        assert!(find_a.package_json_found);

        let find_b = entries.iter().find(|e| e.project_name == "project-b").unwrap();
        assert_eq!(find_b.package_manager, PackageManager::Yarn);
        assert_eq!(find_b.lockfile.as_deref(), Some("yarn.lock"));

        let find_c = entries.iter().find(|e| e.project_name == "project-c").unwrap();
        assert_eq!(find_c.package_manager, PackageManager::Bun);
        assert!(!find_c.package_json_found);

        let find_d = entries.iter().find(|e| e.project_name == "project-d").unwrap();
        assert_eq!(find_d.package_manager, PackageManager::Unknown);
        assert!(!find_d.package_json_found);

        // Test size calculation
        let size = calculate_dir_size(&proj_a_nm, &token);
        assert!(size >= 11);
    }

    #[test]
    fn test_cancellation_during_discovery() {
        let temp = tempdir().unwrap();
        let root = temp.path();

        for i in 0..10 {
            let dir = root.join(format!("proj-{}", i)).join("node_modules");
            fs::create_dir_all(&dir).unwrap();
        }

        let token = CancellationToken::new();
        token.cancel(); // Cancel immediately

        let discovery = DiscoveryEngine::new(token);
        let result = discovery.discover(root, &[], |_| {}, |_| {});

        assert!(result.is_err());
        match result.unwrap_err() {
            AppError::ScanCancelled(_) => {}
            other => panic!("Expected ScanCancelled error, got {:?}", other),
        }
    }
}
