import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { CATEGORIES, getItem } from "../data/learningData";

function Progress() {
  const { currentUser, isAuthenticated } = useAuth();
  const { progress, getStats, resetProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  const { overall, categoryStats, xp, streakDays } = getStats();

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  // Collect all mastered signs across categories
  const masteredList = [];
  CATEGORIES.forEach((cat) => {
    const ids = progress[cat.id] || [];
    ids.forEach((id) => {
      const item = getItem(cat.id, id);
      if (item) {
        masteredList.push({ ...item, categoryId: cat.id });
      }
    });
  });

  return (
    <main className="game-progress-page">
      <header className="game-progress-header">
        <span className="section-eyebrow">YOUR JOURNEY</span>
        <h1>
          {isAuthenticated && currentUser
            ? `${currentUser.name.split(" ")[0]}'s Learning Stats`
            : "Your Learning Stats"}
        </h1>
        <p>Visual breakdown of your sign language fluency and mastery.</p>
      </header>

      {/* Visual Gamified KPI Hero */}
      <section className="progress-trophy-banner">
        <div className="trophy-badge-box">
          <span className="trophy-emoji">⚡</span>
          <div className="trophy-details">
            <span className="trophy-label">TOTAL REWARD XP</span>
            <h2>{xp} XP</h2>
            <small>Earned strictly through verified sign mastery</small>
          </div>
        </div>

        <div className="trophy-stats-split">
          <div className="split-metric">
            <span className="metric-num">{overall.count}</span>
            <span className="metric-tag">Signs Mastered</span>
          </div>
          <div className="split-divider"></div>
          <div className="split-metric">
            <span className="metric-num">{streakDays}</span>
            <span className="metric-tag">Days Streak</span>
          </div>
          <div className="split-divider"></div>
          <div className="split-metric">
            <span className="metric-num">{overall.percentage}%</span>
            <span className="metric-tag">Fluency</span>
          </div>
        </div>
      </section>

      {/* Visual Category Gauges */}
      <section className="progress-category-gauges">
        <h2>Curriculum Paths</h2>
        <div className="category-gauges-grid">
          {categoryStats.map((cat) => (
            <div className="gauge-card" key={cat.id}>
              <div className="gauge-header">
                <span className="gauge-name">{cat.title}</span>
                <span className="gauge-count">
                  {cat.count} / {cat.total}
                </span>
              </div>
              <div className="gauge-track">
                <div
                  className="gauge-fill"
                  style={{ width: `${cat.percentage}%` }}
                ></div>
              </div>
              <div className="gauge-footer">
                <small>{cat.percentage}% complete</small>
                <Link to={`/learn/${cat.id}`} className="gauge-link">
                  Open Roadmap →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mastered Signs Badge Gallery */}
      <section className="progress-mastered-gallery">
        <h2>Mastered Signs Collection ({masteredList.length})</h2>

        {masteredList.length === 0 ? (
          <div className="empty-collection-box">
            <p>You haven't mastered any signs yet.</p>
            <Link to="/learn" className="hero-button">
              Start Level 1 on Roadmap →
            </Link>
          </div>
        ) : (
          <div className="mastered-pills-row">
            {masteredList.map((item) => (
              <Link
                key={`${item.categoryId}-${item.id}`}
                to={
                  item.categoryId === "alphabets"
                    ? `/learn/alphabets/${item.id}`
                    : `/learn/${item.categoryId}/${item.id}`
                }
                className="mastered-sign-pill"
                title={`Review ${item.title}`}
              >
                <span className="pill-glyph">{item.symbol}</span>
                <span className="pill-title">{item.title}</span>
                <span className="pill-award">✓</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Subtle Reset History Settings */}
      <footer className="progress-reset-zone">
        {confirmReset ? (
          <div className="confirm-reset-row">
            <span>Are you sure? This resets all earned XP and progress.</span>
            <button type="button" className="btn-confirm-yes" onClick={handleReset}>
              Yes, Reset
            </button>
            <button
              type="button"
              className="btn-confirm-cancel"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-reset-link"
            onClick={() => setConfirmReset(true)}
          >
            Reset Progress
          </button>
        )}
      </footer>
    </main>
  );
}

export default Progress;
