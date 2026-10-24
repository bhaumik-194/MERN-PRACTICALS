
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Preparing your workspace...</p>
      </div>
    );
  }

  if (user && localStorage.getItem("dms_token")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="auth-layout">
      <section className="auth-brand-panel">
        <div className="brand-mark">D</div>
        <p className="eyebrow">DOCUMENT MANAGEMENT</p>
        <h1>Your files.<br />One organized workspace.</h1>
        <p className="auth-brand-description">
          Securely manage, organize, and access your documents
          from one simple workspace.
        </p>
      </section>

      <section className="auth-form-panel">
        <Outlet />
      </section>
    </main>
  );
}
