
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">BlogSpace</Link>

      <nav>
        <NavLink to="/">Home</NavLink>

        {user && <NavLink to="/my-blogs">My Blogs</NavLink>}

        {user?.role === "admin" && (
          <NavLink to="/admin">Admin</NavLink>
        )}

        {user ? (
          <>
            <span className="user-label">{user.name}</span>
            <button className="button button-small" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
