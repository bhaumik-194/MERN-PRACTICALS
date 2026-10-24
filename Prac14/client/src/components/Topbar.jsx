
import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const pageDetails = {
  "/dashboard": {
    title: "Dashboard",
    description: "Your workspace at a glance",
  },
  "/documents": {
    title: "Documents",
    description: "Manage and organize your files",
  },
  "/profile": {
    title: "My Profile",
    description: "Manage your account information",
  },
};

export default function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const page =
    pageDetails[location.pathname] || pageDetails["/dashboard"];

  return (
    <header className="topbar">
      <div className="topbar-heading">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search documents..."
            aria-label="Search documents"
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                event.currentTarget.value.trim()
              ) {
                window.location.href =
                  `/documents?search=${encodeURIComponent(
                    event.currentTarget.value.trim()
                  )}`;
              }
            }}
          />
        </div>

        <button
          type="button"
          className="icon-button"
          aria-label="Notifications"
          title="Notifications are not implemented yet"
        >
          <Bell size={19} />
        </button>

        <div className="topbar-avatar" title={user?.name || "User"}>
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
