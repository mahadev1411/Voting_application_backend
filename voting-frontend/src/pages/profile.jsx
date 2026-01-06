import { useEffect, useState } from "react";
import { getProfile, changePassword } from "../api/auth";
import "./ui.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await getProfile();
    setUser(res.data.user);
    localStorage.setItem("profile", JSON.stringify(res.data.user));
  };

  useEffect(() => {
    load().catch(() => setMsg("Failed to load profile"));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await changePassword({ currPassword, newPassword });
      setCurrPassword("");
      setNewPassword("");
      setMsg("✅ Password updated successfully");
    } catch (err) {
      setMsg(err?.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Profile</h2>

      {msg && <div className="alert">{msg}</div>}

      {user && (
        <div className="card">
          <h3 className="card-title">{user.name}</h3>
          <p className="muted"><b>Role:</b> {user.role}</p>
          <p className="muted"><b>Age:</b> {user.age}</p>
          <p className="muted"><b>Email:</b> {user.email || "-"}</p>
          <p className="muted"><b>Mobile:</b> {user.mobile || "-"}</p>
          <p className="muted"><b>Address:</b> {user.address}</p>
          <p className="muted"><b>Aadhar:</b> {user.aadhar}</p>
          <p className="muted"><b>Voted:</b> {user.isVoted ? "Yes" : "No"}</p>
        </div>
      )}

      <form className="form" onSubmit={submit} style={{ marginTop: "1.25rem" }}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          value={currPassword}
          onChange={(e) => setCurrPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="btn" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
