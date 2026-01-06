import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/session";

export default function AutoLogout({ minutes = 2 }) {
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const ms = minutes * 60 * 1000;
    const timer = setTimeout(() => {
      logout();
      nav("/login");
      alert(`Session expired. Logged out after ${minutes} minutes.`);
    }, ms);

    return () => clearTimeout(timer);
  }, [minutes, nav]);

  return null;
}
