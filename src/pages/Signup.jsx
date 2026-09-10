import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Signup() {
  const { signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

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

  const handleGoogleSignup = async () => {
    setError(null);
    setGoogleSubmitting(true);

    try {
      // Standard simulated Google OAuth signup flow
      const googleName = name.trim() || "Google Learner";
      const googleEmail = email.trim() || `learner_${Date.now()}@gmail.com`;
      await signup(googleName, googleEmail, "google_oauth_secure_pass");
      navigate("/learn");
    } catch (err) {
      setError(err.message || "Google authentication failed. Please try again.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <main className="signup-split-page">
      {/* ====================================================
          TOP BAR (LOGO & SWITCHER)
          ==================================================== */}
      <header className="signup-top-bar">
        {/* Top-Left Brand Logo */}
        <Link to="/" className="signup-brand-logo" aria-label="VisTalk Home">
          <div className="signup-logo-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          <div className="signup-logo-text">
            <span className="brand-name">VisTalk</span>
            <span className="brand-tagline">Signs Connect Us</span>
          </div>
        </Link>

        {/* Top-Right Theme Toggle & Login Link */}
        <div className="signup-top-actions">
          <button
            type="button"
            className="theme-toggle-switch-pill"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            <span className={`toggle-icon-sun ${theme === "light" ? "active" : ""}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </span>
            <span className="toggle-switch-slider">
              <span className={`toggle-thumb ${theme === "dark" ? "dark" : "light"}`}></span>
            </span>
            <span className={`toggle-icon-moon ${theme === "dark" ? "active" : ""}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
          </button>

          <div className="login-switch-text">
            <span>Already have an account?</span>
            <Link to="/login" className="login-direct-link">
              Log in <span className="arrow-inline">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ====================================================
          TWO-COLUMN HERO & SIGNUP STAGE
          ==================================================== */}
      <div className="signup-stage-container">
        {/* ----------------------------------------------------
            LEFT COLUMN: VISUAL ARTWORK & INSPIRATIONAL HEADLINE
            ---------------------------------------------------- */}
        <section className="signup-left-hero" aria-label="Join VisTalk">
          <div className="signup-hero-copy">
            <h1 className="signup-hero-heading">Join VisTalk</h1>
            <p className="signup-hero-subheading">
              Be a part of a more inclusive tomorrow.<br />
              Learn. Practice. Grow.
            </p>
          </div>

          {/* Exact Provided Artwork Showcase */}
          <div className="signup-illustration-frame">
            <img
              src="/signup_illustration.png"
              alt="Hands communicating in sign language - Join VisTalk"
              className="signup-hands-artwork"
              onError={(e) => {
                // Fallback to reference asset if needed
                e.target.src = "/signup_hands_hero.png";
              }}
            />
          </div>

          {/* Bottom-Left Subtle Motto */}
          <div className="signup-bottom-motto" aria-hidden="true">
            <span className="motto-eyebrow">SAME SIGNS.</span>
            <span className="motto-title">BRIGHTER TOMORROWS.</span>
            <div className="motto-dash"></div>
          </div>
        </section>

        {/* ----------------------------------------------------
            RIGHT COLUMN: REFINED SIGNUP FORM CARD
            ---------------------------------------------------- */}
        <section className="signup-right-panel" aria-label="Signup Form">
          <article className="signup-form-card">
            {/* Form Header */}
            <div className="form-card-header">
              <span className="form-eyebrow">CREATE YOUR ACCOUNT</span>
              <h2 className="form-heading">Welcome to VisTalk</h2>
              <p className="form-subtitle">Let's build a more inclusive world, together.</p>
            </div>

            {/* Google Authentication Button */}
            <div className="social-auth-row">
              <button
                type="button"
                className="social-google-btn"
                onClick={handleGoogleSignup}
                disabled={googleSubmitting || submitting}
              >
                {/* Official Google Multicolor G Icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" className="google-icon-svg">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {googleSubmitting ? "Connecting to Google..." : "Continue with Google"}
                </span>
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="auth-or-divider" aria-hidden="true">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="signup-error-banner" role="alert">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="signup-input-form">
              {/* Full Name */}
              <div className="signup-input-group">
                <label htmlFor="signup-name" className="input-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Full Name</span>
                </label>
                <div className="input-field-wrapper">
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="signup-text-input"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="signup-input-group">
                <label htmlFor="signup-email" className="input-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>Email Address</span>
                </label>
                <div className="input-field-wrapper">
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="signup-text-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="signup-input-group">
                <label htmlFor="signup-password" className="input-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Password</span>
                </label>
                <div className="input-field-wrapper password-field">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="signup-text-input"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      /* Eye Open Icon */
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      /* Eye Off Icon */
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting || googleSubmitting}
                className="signup-submit-btn"
              >
                <span>{submitting ? "Creating Account..." : "Create Account"}</span>
                <span className="btn-arrow">→</span>
              </button>

              {/* Terms & Privacy */}
              <p className="signup-terms-text">
                By signing up, you agree to our{" "}
                <a href="#terms" onClick={(e) => e.preventDefault()} className="terms-link">Terms of Service</a> and{" "}
                <a href="#privacy" onClick={(e) => e.preventDefault()} className="terms-link">Privacy Policy</a>.
              </p>

              {/* Switch to Login */}
              <div className="form-bottom-switch">
                <span>Already have an account? </span>
                <Link to="/login" className="terms-link">
                  Log in →
                </Link>
              </div>
            </form>

            {/* Bottom Card Inspirational Badge */}
            <div className="signup-bottom-badge">
              <div className="badge-heart-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="badge-text-col">
                <span className="badge-quote-line">More Learners.</span>
                <span className="badge-quote-sub">A Kinder Tomorrow.</span>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default Signup;

