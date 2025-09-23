import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";
import FileList from "./components/FileList";
import { ScanResult, formatFileSize } from "./types/file";

function App() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function selectFolder() {
    try {
      setError("");
      // Use Tauri's native folder picker dialog
      const selectedPath = await open({
        directory: true,
        multiple: false,
      });

      if (!selectedPath || typeof selectedPath !== 'string') return;

      setSelectedPath(selectedPath);
      setIsLoading(true);

      // Call our Rust backend function
      const result = await invoke<ScanResult>("scan_directory", { path: selectedPath });
      setScanResult(result);
    } catch (err) {
      setError(err as string);
      setScanResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function openFolder() {
    if (selectedPath) {
      // Convert file path to file:// URL for opening in file manager
      const fileUrl = `file://${selectedPath}`;
      await openUrl(fileUrl);
    }
  }

  return (
    <main className="container">
      <h1>🗂️ Smart File Organizer</h1>
      <p>Analyze and organize your files with ease</p>

      <div className="controls">
        <div className="folder-section">
          <button onClick={selectFolder} disabled={isLoading}>
            {isLoading ? "Scanning..." : "📁 Select Folder"}
          </button>

          {selectedPath && (
            <div className="selected-path">
              <span>📂 {selectedPath}</span>
              <button onClick={openFolder} className="open-button">
                🔗 Open
              </button>
            </div>
          )}
        </div>

        {scanResult && (
          <div className="scan-summary">
            <div className="summary-item">
              <strong>Total Files:</strong> {scanResult.total_count}
            </div>
            <div className="summary-item">
              <strong>Total Size:</strong> {formatFileSize(scanResult.total_size)}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          ❌ Error: {error}
        </div>
      )}

      <FileList
        files={scanResult?.files || []}
        isLoading={isLoading}
      />
    </main>
  );
}

export default App;
