import { useEffect, useState } from "react";
import { getResult } from "../api/candidates";
import "./ui.css";

export default function Results() {
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getResult()
      .then((res) => setData(res.data))
      .catch((err) => setMsg(err?.response?.data?.message || "Failed to load results"));
  }, []);

  return (
    <div className="container">
      <h2>Election Results</h2>

      {msg && <div className="alert">{msg}</div>}

      {data && (
        <div className="card">
          <h3 className="card-title">{data.message}</h3>

          {data.winner && (
            <div className="resultBox">
              <p><b>Name:</b> {data.winner.name}</p>
              <p><b>Party:</b> {data.winner.party}</p>
              <p><b>Votes:</b> {data.winner.votes}</p>
            </div>
          )}

          {data.winners && (
            <div className="resultBox">
              {data.winners.map((w, i) => (
                <div key={i} className="resultItem">
                  <p><b>{w.name}</b> ({w.party}) - {w.votes} votes</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
