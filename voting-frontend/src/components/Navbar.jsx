import { Link, useNavigate } from "react-router-dom";
import { logout as doLogout } from "../api/session";

export default function Navbar() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const profile = JSON.parse(localStorage.getItem("profile") || "null");
  const isAdmin = profile?.role === "admin";

  const logout = () => {
    doLogout();
    nav("/login");
  };

  return (
    <div className="nav">
      <div className="nav-brand">VotingApp</div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {/* ✅ Results only for admin */}
        {token && isAdmin && <Link to="/results">Results</Link>}

        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <button className="btn btn-ghost" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
