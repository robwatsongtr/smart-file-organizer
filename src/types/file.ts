// TypeScript types that match our Rust structs
// This ensures type safety between frontend and backend

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  file_type: string;
  extension?: string;
  modified: string; // ISO date string from Rust's DateTime
  is_directory: boolean;
}

export interface ScanResult {
  files: FileInfo[];
  total_count: number;
  total_size: number;
}

// Helper function to format file sizes in human-readable format
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

// Helper function to format dates
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}