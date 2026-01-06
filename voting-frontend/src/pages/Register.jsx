import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import "./ui.css";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    address: "",
    aadhar: "",
    password: "",
    role: "voter",
    adminKey: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await registerUser({
        ...form,
        age: Number(form.age),
        aadhar: Number(form.aadhar),
      });

      setMsg("Registered successfully. Please login.");
      setTimeout(() => nav("/login"), 800);
    } catch (err) {
      setMsg(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <p className="muted">Age must be 18+</p>

      <form className="form" onSubmit={submit}>
        <div className="grid2">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={onChange}
            required
          />

          <input
            name="email"
            placeholder="Email (for notifications)"
            value={form.email}
            onChange={onChange}
          />
          <input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={onChange}
          />

          <input
            name="aadhar"
            placeholder="Aadhar Number"
            value={form.aadhar}
            onChange={onChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />

          {/* ✅ Role dropdown */}
          <select name="role" value={form.role} onChange={onChange}>
            <option value="voter">Voter</option>
            <option value="admin">Admin</option>
          </select>

          {/* ✅ Admin key only if admin selected */}
          {form.role === "admin" ? (
            <input
              name="adminKey"
              placeholder="Admin Signup Key"
              value={form.adminKey}
              onChange={onChange}
              required
            />
          ) : (
            <div /> // keeps grid alignment
          )}
        </div>

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={onChange}
          required
          rows={3}
        />

        <button className="btn" disabled={loading}>
          {loading ? "Registering..." : "Create Account"}
        </button>

        {msg && <div className="alert">{msg}</div>}
      </form>
    </div>
  );
}
