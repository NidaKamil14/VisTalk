import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { getOverallProgress } = useProgress();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { xp } = getOverallProgress();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" aria-label="Main Navigation">
        {/* Brand Logo with Hand Sign Icon & Tagline */}
        <Link to="/" className="logo-link" onClick={closeMobile}>
          <div className="logo-badge-icon">
            <svg
              width="24"
              height="24"
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
          <div className="logo-text-group">
            <span className="logo-title">VisTalk</span>
            <span className="logo-tagline">Signs Connect Us</span>
          </div>
        </Link>

        {/* Main Desktop Links with Refined Active Indicator */}
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/learn"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Learn
          </NavLink>
          <NavLink
            to="/practice"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Practice
          </NavLink>
          <NavLink
            to="/progress"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            Progress
          </NavLink>
        </div>

        {/* Right Account, Theme Toggle & Action Cluster */}
        <div className="nav-actions">
          {/* Refined Theme Toggle Pill with Sun / Track / Moon (Reference Style) */}
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

          {/* XP Pill */}
          <Link to="/progress" className="nav-xp-pill" title="Your total progression XP">
            <span className="xp-sparkle">⚡</span>
            <span className="xp-amount">{xp || 0} XP</span>
          </Link>

          {isAuthenticated && currentUser ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="user-badge" title="View Profile & Settings">
                <span className="user-avatar-initial">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : "U"}
                </span>
                <span className="user-display-name">{currentUser.name.split(" ")[0]}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="nav-secondary-button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-secondary-button">
                Sign In
              </Link>
              <Link to="/signup" className="nav-button">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`burger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
            <span className={`burger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
            <span className={`burger-bar ${mobileMenuOpen ? "open" : ""}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <div className="mobile-nav-links">
            <NavLink to="/" onClick={closeMobile} className="mobile-link" end>
              Home
            </NavLink>
            <NavLink to="/learn" onClick={closeMobile} className="mobile-link">
              Learn
            </NavLink>
            <NavLink to="/practice" onClick={closeMobile} className="mobile-link">
              Practice
            </NavLink>
            <NavLink to="/progress" onClick={closeMobile} className="mobile-link">
              Progress ({xp || 0} XP)
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/profile" onClick={closeMobile} className="mobile-link">
                Profile & Settings
              </NavLink>
            )}
          </div>

          <div className="mobile-drawer-footer">
            <div className="mobile-theme-row">
              <span>Theme: <strong>{theme === "dark" ? "Dark Mode" : "Light Mode"}</strong></span>
              <button
                type="button"
                className="theme-toggle-switch-pill mobile-switch"
                onClick={toggleTheme}
              >
                <span className="toggle-switch-slider">
                  <span className={`toggle-thumb ${theme === "dark" ? "dark" : "light"}`}></span>
                </span>
              </button>
            </div>

            <div className="mobile-auth-section">
              {isAuthenticated && currentUser ? (
                <div className="mobile-user-info">
                  <p>Signed in as <strong>{currentUser.name}</strong></p>
                  <button type="button" onClick={handleLogout} className="mobile-auth-btn signout">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-actions">
                  <Link to="/login" onClick={closeMobile} className="mobile-auth-btn login">
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={closeMobile} className="mobile-auth-btn signup">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;