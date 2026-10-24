
import { useRef, useState } from "react";
import { FileUp, X, UploadCloud } from "lucide-react";
import documentService from "../services/documentService";

export default function UploadModal({ onClose, onUploaded }) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleFileChange(event) {
    const selected = event.target.files?.[0];

    setError("");

    if (!selected) {
      setFile(null);
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setFile(null);
      setError("File size must be 10 MB or less.");
      event.target.value = "";
      return;
    }

    setFile(selected);
  }

  async function handleUpload(event) {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      await documentService.uploadDocument(file);
      await onUploaded?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Upload failed. Please check the file and try again."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !uploading) onClose();
      }}
    >
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="upload-title">Upload document</h2>
            <p>Add a file to your workspace.</p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={uploading}
            aria-label="Close upload dialog"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpload}>
          <button
            type="button"
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <UploadCloud size={32} />
            <strong>{file ? file.name : "Choose a file to upload"}</strong>
            <span>
              {file
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                : "Click here to browse · Maximum 10 MB"}
            </span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            hidden
          />

          {error && (
            <div className="form-alert" role="alert">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={uploading || !file}
            >
              <FileUp size={17} />
              {uploading ? "Uploading..." : "Upload document"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
