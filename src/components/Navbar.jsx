import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";

function Navbar() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { getOverallProgress } = useProgress();
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
        <Link to="/" className="logo-link" onClick={closeMobile}>
          <span className="logo">VisTalk</span>
        </Link>

        {/* Main Desktop Links */}
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

        {/* Right Account & Gamified XP Action */}
        <div className="nav-actions">
          {/* XP Pill */}
          <Link to="/progress" className="nav-xp-pill" title="Your total progression XP">
            <span className="xp-sparkle">⚡</span>
            <span className="xp-amount">{xp || 0} XP</span>
          </Link>

          {isAuthenticated && currentUser ? (
            <div className="user-profile-menu">
              <Link to="/progress" className="user-badge" title="View profile">
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
              Learn (Roadmap)
            </NavLink>
            <NavLink to="/practice" onClick={closeMobile} className="mobile-link">
              Practice
            </NavLink>
            <NavLink to="/progress" onClick={closeMobile} className="mobile-link">
              Progress ({xp || 0} XP)
            </NavLink>
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
      )}
    </header>
  );
}

export default Navbar;