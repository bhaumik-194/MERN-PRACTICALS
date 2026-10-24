
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Files,
  HardDrive,
  Clock3,
  ArrowRight,
  FileText,
  RefreshCw,
} from "lucide-react";

import StatCard from "../components/StatCard";
import dashboardService from "../services/dashboardService";
import documentService from "../services/documentService";
import { formatDate, formatFileSize } from "../utils/formatters";

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const [dashboardResult, documentsResult] = await Promise.all([
        dashboardService.getDashboard(),
        documentService.getDocuments({ limit: 5 }),
      ]);

      setDashboard(dashboardResult.dashboard ?? dashboardResult.data ?? dashboardResult);
      const documentData =
        documentsResult.documents ??
        documentsResult.data?.documents ??
        documentsResult.data ??
        [];

      setDocuments(Array.isArray(documentData) ? documentData.slice(0, 5) : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = dashboard?.stats ?? dashboard ?? {};

  const totalDocuments =
    stats.totalDocuments ?? stats.documentCount ?? stats.total ?? 0;

  const storageUsed =
    stats.storageUsed ?? stats.totalStorage ?? stats.storageUsedBytes ?? 0;

  const recentCount =
    stats.recentUploads ?? stats.recentDocuments ?? documents.length;

  return (
    <div className="dashboard-page">
      <section className="welcome-banner">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h2>Everything in its right place.</h2>
          <p>
            Keep your important files organized and accessible from one place.
          </p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/documents")}
        >
          <Files size={18} />
          Manage documents
        </button>
      </section>

      {error && (
        <div className="form-alert dashboard-alert" role="alert">
          <span>{error}</span>
          <button type="button" className="text-button" onClick={loadDashboard}>
            <RefreshCw size={15} /> Retry
          </button>
        </div>
      )}

      <section className="stats-grid" aria-label="Document statistics">
        <StatCard
          title="Total Documents"
          value={loading ? "…" : totalDocuments}
          description="Files in your workspace"
          icon={Files}
          tone="blue"
        />
        <StatCard
          title="Storage Used"
          value={
            loading
              ? "…"
              : typeof storageUsed === "string"
                ? storageUsed
                : formatFileSize(storageUsed)
          }
          description="Space occupied by your files"
          icon={HardDrive}
          tone="purple"
        />
        <StatCard
          title="Recent Uploads"
          value={loading ? "…" : recentCount}
          description="Recently added documents"
          icon={Clock3}
          tone="orange"
        />
      </section>

      <section className="dashboard-panel">
        <div className="panel-header">
          <div>
            <h2>Recent documents</h2>
            <p>Your latest files and uploads</p>
          </div>

          <button
            type="button"
            className="text-button"
            onClick={() => navigate("/documents")}
          >
            View all <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner" />
            <p>Loading your documents…</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText size={28} />
            </div>
            <h3>No documents yet</h3>
            <p>Upload your first document to get started.</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate("/documents")}
            >
              Open documents
            </button>
          </div>
        ) : (
          <div className="documents-table-wrapper">
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document._id ?? document.id}>
                    <td>
                      <div className="document-name-cell">
                        <span className="file-type-icon">
                          <FileText size={18} />
                        </span>
                        <span>{document.originalName ?? document.name ?? "Untitled document"}</span>
                      </div>
                    </td>
                    <td>{formatFileSize(document.size ?? 0)}</td>
                    <td>{formatDate(document.createdAt ?? document.uploadedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
