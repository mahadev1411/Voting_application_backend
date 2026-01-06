

export default function CandidateCard({ c, disabled, onVote }) {
  return (
    <div className="card">
      <h3 className="card-title">{c.name}</h3>
      <p className="muted">Party: <b>{c.party}</b></p>
      <p className="muted">Votes: <b>{c.voteCount}</b></p>

      <button className="btn" disabled={disabled} onClick={onVote}>
        Vote
      </button>
    </div>
  );
}
