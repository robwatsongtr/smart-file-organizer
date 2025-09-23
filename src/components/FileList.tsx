import React from 'react';
import { FileInfo, formatFileSize, formatDate } from '../types/file';
import './FileList.css';

interface FileListProps {
  files: FileInfo[];
  isLoading: boolean;
}

const FileList: React.FC<FileListProps> = ({ files, isLoading }) => {
  if (isLoading) {
    return <div className="file-list-loading">Scanning directory...</div>;
  }

  if (files.length === 0) {
    return <div className="file-list-empty">No files found or no directory selected</div>;
  }

  // Separate directories and files for better organization
  const directories = files.filter(file => file.is_directory);
  const regularFiles = files.filter(file => !file.is_directory);

  return (
    <div className="file-list">
      <div className="file-list-header">
        <div className="file-count">
          {directories.length} directories, {regularFiles.length} files
        </div>
      </div>

      <div className="file-list-content">
        <table className="file-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Size</th>
              <th>Modified</th>
            </tr>
          </thead>
          <tbody>
            {/* Render directories first */}
            {directories.map((file, index) => (
              <FileRow key={`dir-${index}`} file={file} />
            ))}
            {/* Then render files */}
            {regularFiles.map((file, index) => (
              <FileRow key={`file-${index}`} file={file} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface FileRowProps {
  file: FileInfo;
}

const FileRow: React.FC<FileRowProps> = ({ file }) => {
  return (
    <tr className={`file-row ${file.is_directory ? 'directory' : 'file'}`}>
      <td className="file-name">
        <span className="file-icon">
          {file.is_directory ? '📁' : getFileIcon(file.extension)}
        </span>
        {file.name}
      </td>
      <td className="file-type">{file.file_type}</td>
      <td className="file-size">
        {file.is_directory ? '-' : formatFileSize(file.size)}
      </td>
      <td className="file-modified">{formatDate(file.modified)}</td>
    </tr>
  );
};

// Simple icon mapping based on file extensions
function getFileIcon(extension?: string): string {
  if (!extension) return '📄';

  const iconMap: Record<string, string> = {
    'txt': '📄',
    'md': '📝',
    'js': '⚡',
    'ts': '🔷',
    'jsx': '⚛️',
    'tsx': '⚛️',
    'html': '🌐',
    'css': '🎨',
    'json': '📋',
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'pdf': '📕',
    'zip': '📦',
    'tar': '📦',
    'gz': '📦',
    'mp3': '🎵',
    'mp4': '🎬',
    'mov': '🎬',
    'avi': '🎬',
  };

  return iconMap[extension.toLowerCase()] || '📄';
}

export default FileList;