
import { useAuth } from "../context/AuthContext";
import { Mail, ShieldCheck, UserRound } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const initial = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      <section className="page-intro">
        <div>
          <h2>Account settings</h2>
          <p>View your personal information and account details.</p>
        </div>
      </section>

      <section className="dashboard-panel profile-panel">
        <div className="profile-banner">
          <div className="profile-avatar">{initial}</div>
          <div>
            <h2>{user?.name || "User"}</h2>
            <p>{user?.email || "No email available"}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail-row">
            <span className="profile-detail-icon">
              <UserRound size={19} />
            </span>
            <div>
              <span className="profile-detail-label">Full name</span>
              <strong>{user?.name || "—"}</strong>
            </div>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-icon">
              <Mail size={19} />
            </span>
            <div>
              <span className="profile-detail-label">Email address</span>
              <strong>{user?.email || "—"}</strong>
            </div>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-icon">
              <ShieldCheck size={19} />
            </span>
            <div>
              <span className="profile-detail-label">Account role</span>
              <strong>{user?.role || "user"}</strong>
            </div>
          </div>
        </div>

        <p className="profile-note">
          Your account information is read from your authenticated session.
          Profile editing is not enabled yet.
        </p>
      </section>
    </div>
  );
}
