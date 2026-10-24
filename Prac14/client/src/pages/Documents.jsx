
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FileUp, Search, RefreshCw } from "lucide-react";

import useDocuments from "../hooks/useDocuments";
import DocumentTable from "../components/DocumentTable";
import UploadModal from "../components/UploadModal";
import documentService from "../services/documentService";

export default function Documents() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showUpload, setShowUpload] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { documents, loading, error, refresh } = useDocuments();

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return documents;

    return documents.filter((document) => {
      const name =
        document.originalName ??
        document.name ??
        document.filename ??
        "";

      return name.toLowerCase().includes(query);
    });
  }, [documents, search]);

  async function handleDownload(document) {
    setActionError("");

    try {
      const id = document._id ?? document.id;
      const blob = await documentService.downloadDocument(id);

      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");

      link.href = url;
      link.download =
        document.originalName ??
        document.name ??
        document.filename ??
        "document";

      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Unable to download this document."
      );
    }
  }

  async function handleRename(document, newName) {
  setActionError("");

  try {
    const id = document._id ?? document.id;

    await documentService.renameDocument(id, {
      originalName: newName,
    });

    await refresh();
  } catch (err) {
    setActionError(
      err.response?.data?.message || "Unable to rename this document."
    );
    throw err;
  }
}

  async function handleDelete(document) {
    const name =
      document.originalName ??
      document.name ??
      document.filename ??
      "this document";

    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    setActionError("");
    setActionLoading(true);

    try {
      const id = document._id ?? document.id;
      await documentService.deleteDocument(id);
      refresh();
    } catch (err) {
      setActionError(
        err.response?.data?.message || "Unable to delete this document."
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="documents-page">
      <section className="page-intro">
        <div>
          <h2>Your documents</h2>
          <p>Upload, find, and manage your workspace files.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowUpload(true)}
        >
          <FileUp size={18} />
          Upload document
        </button>
      </section>

      <section className="dashboard-panel">
        <div className="documents-toolbar">
          <div className="documents-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search by document name..."
              aria-label="Search documents by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={refresh}
            disabled={loading || actionLoading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {actionError && (
          <div className="form-alert" role="alert">
            {actionError}
          </div>
        )}

        {error ? (
          <div className="empty-state">
            <h3>Couldn't load documents</h3>
            <p>{error}</p>
            <button type="button" className="primary-button" onClick={refresh}>
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="empty-state">
            <div className="loading-spinner" />
            <p>Loading documents...</p>
          </div>
        ) : (
          <>
            <div className="table-summary">
              Showing {filteredDocuments.length} of {documents.length} documents
            </div>

            <DocumentTable
              documents={filteredDocuments}
              onDownload={handleDownload}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          </>
        )}
      </section>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={refresh}
        />
      )}
    </div>
  );
}
