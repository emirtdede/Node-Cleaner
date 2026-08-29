#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    std::panic::set_hook(Box::new(|info| {
        let msg = format!("PANIC: {}\nLocation: {:?}", info, info.location());
        let _ = std::fs::write("C:\\Users\\emir\\Desktop\\node_cleaner\\crash.log", &msg);
    }));
    node_cleaner_lib::run();
}
