import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <p className="hero-tag">PAGE NOT FOUND • 404</p>
        <h1>Looking for a Sign?</h1>
        <p className="not-found-description">
          The page or lesson you are looking for does not exist or may have been moved.
          Let's guide you back to the active curriculum.
        </p>
        <div className="not-found-actions">
          <Link to="/learn" className="hero-button">
            Go to Curriculum →
          </Link>
          <Link to="/" className="hero-button-outline">
            Return to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
