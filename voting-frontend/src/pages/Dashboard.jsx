import { useEffect, useState } from "react";
import { getCandidates, voteCandidate } from "../api/candidates";
import { getProfile } from "../api/auth";
import CandidateCard from "../components/CandidateCard";
import "./ui.css";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [candRes, profRes] = await Promise.all([getCandidates(), getProfile()]);
    setCandidates(candRes.data);
    setProfile(profRes.data.user);
    localStorage.setItem("profile", JSON.stringify(profRes.data.user));
  };

  useEffect(() => {
    load().catch((e) => setMsg(e?.response?.data?.message || "Failed to load dashboard"));
  }, []);

  const vote = async (id) => {
    setMsg("");
    try {
      await voteCandidate(id);
      setMsg("✅ Vote submitted successfully!");
      await load();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Voting failed");
    }
  };

  const alreadyVoted = profile?.isVoted;

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {profile && (
        <div className="pill">
          Logged in as <b>{profile.name}</b> ({profile.role})
          {alreadyVoted ? (
            <span className="pill-badge">Already Voted</span>
          ) : (
            <span className="pill-badge ok">Eligible</span>
          )}
        </div>
      )}

      {msg && <div className="alert">{msg}</div>}

      <div className="grid3">
        {candidates.map((c) => (
          <CandidateCard
            key={c.id}
            c={c}
            disabled={alreadyVoted}
            onVote={() => vote(c.id)}
          />
        ))}
      </div>
    </div>
  );
}
