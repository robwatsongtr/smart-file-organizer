# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart File Organizer is a desktop application built with Tauri + React + TypeScript. It provides file analysis and organization capabilities through a clean, cross-platform interface.

**Tech Stack:**
- Frontend: React 19 + TypeScript + Vite
- Backend: Rust (Tauri 2.0)
- Build Tool: Vite
- Package Manager: npm

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (opens desktop app)
npm run tauri dev

# Build for production
npm run tauri build

# Frontend-only development
npm run dev

# Build frontend only
npm run build

# Type checking
npx tsc --noEmit

# Preview built frontend
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── FileList.tsx     # File listing component
│   └── FileList.css     # Styles for file list
├── types/               # TypeScript type definitions
│   └── file.ts          # File-related types and utilities
├── App.tsx              # Main React component
└── App.css              # Main styles

src-tauri/
├── src/
│   ├── lib.rs           # Main Rust backend logic
│   └── main.rs          # Entry point
├── Cargo.toml           # Rust dependencies
└── tauri.conf.json      # Tauri configuration
```

## Architecture

### Frontend (React/TypeScript)
- **App.tsx**: Main component handling folder selection and displaying scan results
- **FileList.tsx**: Displays file information in a table format with icons
- **types/file.ts**: TypeScript interfaces matching Rust structs for type safety

### Backend (Rust)
- **scan_directory command**: Scans directories and returns file metadata
- **FileInfo struct**: Contains file name, path, size, type, extension, and modification date
- **ScanResult struct**: Aggregates scan results with file list and summary statistics

### Key Rust Concepts Used
- **Result<T, E>**: Type-safe error handling (instead of exceptions)
- **Option<T>**: Null-safe types (no null pointer exceptions)
- **Serde**: Automatic serialization/deserialization for frontend communication
- **Iterators**: Functional programming patterns for data processing
- **Pattern matching**: Safe destructuring with `match` expressions

## File Type Detection

The app categorizes files based on extensions with appropriate icons:
- Documents: txt, md, pdf
- Code: js, ts, jsx, tsx, html, css, json
- Images: png, jpg, jpeg, gif, svg
- Archives: zip, tar, gz
- Media: mp3, mp4, mov, avi

## Current Features

1. **Directory Scanning**: Recursively scan directories for file information
2. **File Listing**: Display files with name, type, size, and modification date
3. **Summary Statistics**: Show total file count and combined size
4. **File Type Icons**: Visual indicators for different file types
5. **Folder Organization**: Directories listed first, then files
6. **Path Display**: Show selected directory path with option to open in system file manager
7. **Error Handling**: User-friendly error messages for invalid paths
8. **Dark Mode Support**: Automatic dark/light theme based on system preference

## Development Notes

### Tauri Command Registration
New Rust functions must be registered in `src-tauri/src/lib.rs`:
```rust
.invoke_handler(tauri::generate_handler![greet, scan_directory, new_command])
```

### Type Safety
TypeScript types in `src/types/file.ts` must match Rust structs in `src-tauri/src/lib.rs` for proper serialization.

### Adding Dependencies
- Frontend: `npm install package-name`
- Backend: Add to `src-tauri/Cargo.toml` dependencies section

### File System Permissions
Tauri requires explicit permission configuration for file system access. Current permissions allow reading directories specified by the user.

## Future Enhancements

Potential features to implement:
- Native folder picker dialog (replace text prompt)
- File organization rules and automation
- Duplicate file detection
- File size visualization
- Search and filtering capabilities
- Bulk file operations
- Configuration persistence