
import {
  LayoutDashboard,
  Files,
  UserRound,
  FolderLock,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Documents", path: "/documents", icon: Files },
  { label: "My Profile", path: "/profile", icon: UserRound },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="sidebar-brand">
        <span className="brand-mark">
          <FolderLock size={22} />
        </span>
        <span>
          <strong>DocuSpace</strong>
          <small>Document Workspace</small>
        </span>
      </NavLink>

      <div className="sidebar-section-label">WORKSPACE</div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <strong>{user?.name || "User"}</strong>
            <small>{user?.email || "Signed in"}</small>
          </div>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
