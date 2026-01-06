import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getProfile } from "../api/auth";
import "./ui.css";

export default function Login() {
  const nav = useNavigate();
  const [aadhar, setAadhar] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await loginUser({ aadhar: Number(aadhar), password });
      localStorage.setItem("token", res.data.token);

      const prof = await getProfile();
      localStorage.setItem("profile", JSON.stringify(prof.data.user));

      if (prof.data.user.role === "admin") nav("/admin");
      else nav("/dashboard");
    } catch (err) {
      setMsg(err?.response?.data?.error || err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <form className="form" onSubmit={submit}>
        <input
          placeholder="Aadhar Number"
          value={aadhar}
          onChange={(e) => setAadhar(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {msg && <div className="alert">{msg}</div>}
      </form>
    </div>
  );
}
