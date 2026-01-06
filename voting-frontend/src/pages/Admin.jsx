import { useEffect, useState } from "react";
import { getCandidates, createCandidate, updateCandidate, deleteCandidate } from "../api/candidates";
import { getProfile } from "../api/auth";
import "./ui.css";

export default function Admin() {
  const [profile, setProfile] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ name: "", party: "", age: "" });

  const load = async () => {
    const profRes = await getProfile();
    setProfile(profRes.data.user);

    const candRes = await getCandidates();
    setCandidates(candRes.data);
  };

  useEffect(() => {
    load().catch(() => setMsg("Admin access required"));
  }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const add = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await createCandidate({ ...form, age: Number(form.age) });
      setForm({ name: "", party: "", age: "" });
      setMsg("✅ Candidate added");
      await load();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Failed to add candidate");
    }
  };

  const editParty = async (id) => {
    const party = prompt("Enter new party name:");
    if (!party) return;
    try {
      await updateCandidate(id, { party });
      await load();
    } catch {
      setMsg("Failed to update");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this candidate?")) return;
    try {
      await deleteCandidate(id);
      await load();
    } catch {
      setMsg("Failed to delete");
    }
  };

  if (profile && profile.role !== "admin") {
    return (
      <div className="container">
        <div className="alert">You are not an admin.</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      {msg && <div className="alert">{msg}</div>}

      <form className="form" onSubmit={add}>
        <h3>Add Candidate</h3>
        <div className="grid2">
          <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
          <input name="party" placeholder="Party" value={form.party} onChange={onChange} required />
          <input name="age" placeholder="Age" value={form.age} onChange={onChange} required />
        </div>
        <button className="btn">Add</button>
      </form>

      <h3 style={{ marginTop: "2rem" }}>Candidates</h3>
      <div className="grid3">
        {candidates.map((c) => (
          <div className="card" key={c.id}>
            <h3 className="card-title">{c.name}</h3>
            <p className="muted">Party: <b>{c.party}</b></p>
            <p className="muted">Votes: <b>{c.voteCount}</b></p>
            <div className="row">
              <button className="btn btn-outline" onClick={() => editParty(c.id)}>Edit</button>
              <button className="btn btn-ghost" onClick={() => remove(c.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
