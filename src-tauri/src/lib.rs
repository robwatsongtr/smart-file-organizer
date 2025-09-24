use std::fs;
use std::path::Path;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

// Practice module for learning exercises
mod practice;

// This is like a struct in C/C++, but with additional Rust features
// The derives automatically implement serialization for JSON communication with frontend
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub file_type: String,
    pub extension: Option<String>,
    pub modified: DateTime<Utc>,
    pub is_directory: bool,
}

// Rust uses Result<T, E> for error handling instead of exceptions
// This is similar to returning error codes in C, but type-safe
#[derive(Debug, Serialize)]
pub struct ScanResult {
    pub files: Vec<FileInfo>,
    pub total_count: usize,
    pub total_size: u64,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// The #[tauri::command] attribute makes this function callable from the frontend
// &str is a string slice (like const char* in C, but safer)
// Result<T, String> means this function can either return T or an error message
#[tauri::command]
fn scan_directory(path: &str) -> Result<ScanResult, String> {
    // In Rust, we use ? operator for error propagation
    // This is like checking if(error) return error; in C
    let dir_path = Path::new(path);

    if !dir_path.exists() {
        return Err("Directory does not exist".to_string());
    }

    if !dir_path.is_dir() {
        return Err("Path is not a directory".to_string());
    }

    // Vec<T> is Rust's growable array (like std::vector in C++)
    let mut files = Vec::new();
    let mut total_size = 0u64;

    // read_dir returns an iterator - Rust's powerful iteration system
    // The ? operator propagates any IO errors up to our Result return type
    let entries = fs::read_dir(dir_path)
        .map_err(|e| format!("Failed to read directory: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let path = entry.path();

        // Rust has powerful pattern matching with match expressions
        let metadata = match entry.metadata() {
            Ok(meta) => meta,
            Err(_) => continue, // Skip files we can't read metadata for
        };

        let file_name = path.file_name()
            .and_then(|name| name.to_str())
            .unwrap_or("Unknown")
            .to_string();

        // Option<T> is Rust's way of handling nullable values (no null pointers!)
        let extension = path.extension()
            .and_then(|ext| ext.to_str())
            .map(|s| s.to_lowercase());

        let file_type = if metadata.is_dir() {
            "Directory".to_string()
        } else {
            extension.clone().unwrap_or_else(|| "File".to_string())
        };

        let size = metadata.len();
        total_size += size;

        // Convert system time to UTC datetime
        let modified = metadata.modified()
            .map_err(|e| format!("Failed to get modification time: {}", e))?
            .into();

        let file_info = FileInfo {
            name: file_name,
            path: path.to_string_lossy().to_string(), // Handle non-UTF8 paths gracefully
            size,
            file_type,
            extension,
            modified,
            is_directory: metadata.is_dir(),
        };

        files.push(file_info);
    }

    // Sort files by name (case-insensitive)
    files.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));

    Ok(ScanResult {
        total_count: files.len(),
        total_size,
        files,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        // Register our new command so the frontend can call it
        .invoke_handler(tauri::generate_handler![greet, scan_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
