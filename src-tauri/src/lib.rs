pub mod commands;
pub mod deletion;
pub mod error;
pub mod platform;
pub mod scanner;
pub mod settings;

use commands::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            use tauri::Manager;
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.show();
                let _ = win.unminimize();
                let _ = win.set_focus();
            }
        }))
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                use tauri::Manager;
                window.app_handle().exit(0);
            }
        })
        .setup(|app| {
            use tauri::Manager;
            let windows = app.webview_windows();
            println!("[Node Cleaner] Webview Windows Count: {}", windows.len());
            for (key, win) in &windows {
                println!("[Node Cleaner] Window: {}", key);
                let _ = win.show();
                let _ = win.set_focus();
            }
            if windows.is_empty() {
                println!("[Node Cleaner] Creating main window manually...");
                let win = tauri::WebviewWindowBuilder::new(
                    app,
                    "main",
                    tauri::WebviewUrl::default(),
                )
                .title("Node Cleaner")
                .inner_size(1180.0, 760.0)
                .min_inner_size(980.0, 640.0)
                .center()
                .build()?;
                let _ = win.show();
                let _ = win.set_focus();
            }
            println!("[Node Cleaner] Setup completed successfully.");
            Ok(())
        })
        .manage(commands::scan_commands::ScanState::new())
        .invoke_handler(tauri::generate_handler![
            start_scan,
            cancel_scan,
            get_known_locations,
            open_path_in_explorer,
            open_url,
            delete_node_modules,
            get_app_settings,
            save_app_settings
        ])
        .run(tauri::generate_context!())
        .expect("Node Cleaner başlatılırken hata oluştu");
}
