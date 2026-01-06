import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const profile = JSON.parse(localStorage.getItem("profile"));

  if (!token) return <Navigate to="/login" replace />;

  if (adminOnly && profile?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
