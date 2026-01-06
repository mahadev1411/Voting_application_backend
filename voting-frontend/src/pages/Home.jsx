import { Link } from "react-router-dom";
import "./ui.css";

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Online Voting System</h1>
        <p className="muted">
          Secure voting with JWT authentication. Register, login, vote once, and view results.
        </p>

        <div className="row">
          <Link className="btn" to="/login">Login</Link>
          <Link className="btn btn-outline" to="/register">Register</Link>
          <Link className="btn btn-ghost" to="/results">View Results</Link>
        </div>
      </div>
    </div>
  );
}
