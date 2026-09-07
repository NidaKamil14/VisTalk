import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      await signup(name, email, password);
      navigate("/learn");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="section-eyebrow">GET STARTED</span>
          <h1>Create Account</h1>
          <p>Save your learning progress and daily streak.</p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Lee"
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@example.com"
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="auth-submit-btn"
          >
            {submitting ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        <div className="auth-switch-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-switch-link">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Signup;
