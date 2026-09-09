import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";

function Hero() {
  const { getOverallProgress } = useProgress();
  const { xp, count } = getOverallProgress();

  return (
    <section className="hero-visual-driven">
      {/* Returning User Progress Badge (if any) */}
      {count > 0 && (
        <div className="hero-returning-banner">
          <span className="returning-pill">
            ⚡ {xp} XP Earned • {count} signs mastered
          </span>
        </div>
      )}

      {/* The Visual IS the Hero */}
      <div className="hero-center-illustration">
        <div className="illustration-ambient-aura"></div>
        <div className="hero-hand-sign-card">
          <div className="hand-sign-graphic">
            <span className="sign-emoji">👋</span>
          </div>
          <div className="hand-sign-tag">
            <span className="sign-name">Welcome</span>
            <small>Foundational ISL</small>
          </div>
        </div>
      </div>

      {/* Concise, Understated Copy */}
      <div className="hero-compact-copy">
        <h1>Learn Sign Language.</h1>
        <p>Visual, step-by-step manual sign learning.</p>

        <div className="hero-single-cta-wrap">
          <Link to="/learn" className="hero-main-cta">
            Start Learning →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;