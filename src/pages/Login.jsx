import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/learn";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("demo@vistalk.org");
    setPassword("password123");
    setError(null);
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="section-eyebrow">WELCOME BACK</span>
          <h1>Sign In</h1>
          <p>Sign in to sync your progress across devices.</p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="auth-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="auth-submit-btn"
          >
            {submitting ? "Signing In..." : "Sign In to Account"}
          </button>
        </form>

        <div className="demo-login-box">
          <p>Testing the application?</p>
          <button
            type="button"
            className="demo-fill-btn"
            onClick={handleDemoFill}
          >
            Fill Demo Credentials (Alex Morgan)
          </button>
        </div>

        <div className="auth-switch-footer">
          <p>
            Don't have an account yet?{" "}
            <Link to="/signup" className="auth-switch-link">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
