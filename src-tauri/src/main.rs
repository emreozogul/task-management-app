// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod db;
use db::{create_tables, establish_connection, insert_task, Task};
use tauri::command;

#[command]
fn add_task(task: Task) -> Result<(), String> {
    let conn = establish_connection().map_err(|e| e.to_string())?;
    create_tables(&conn).map_err(|e| e.to_string())?;
    insert_task(&conn, &task).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_task])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
