import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProgress } from "../context/ProgressContext";
import { CATEGORIES, getItem } from "../data/learningData";

function Progress() {
  const { currentUser, isAuthenticated } = useAuth();
  const { progress, getStats, resetProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  const { overall, categoryStats, streakDays } = getStats();

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  // Collect all mastered items across categories for visual pills
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
    <main className="progress-clean-page">
      <header className="progress-clean-header">
        <span className="section-eyebrow">YOUR JOURNEY</span>
        <h1>
          {isAuthenticated && currentUser
            ? `${currentUser.name.split(" ")[0]}'s Progress`
            : "Your Learning Progress"}
        </h1>
        <p>Track your sign language fluency, daily practice streak, and mastered signs.</p>

        {!isAuthenticated && (
          <div className="guest-sync-card">
            <span>Progress is currently stored locally in this browser.</span>
            <Link to="/signup" className="guest-sync-link">
              Create account to sync →
            </Link>
          </div>
        )}
      </header>

      {/* Visual KPI Cards */}
      <section className="progress-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">TOTAL MASTERED</span>
          <div className="kpi-value">{overall.count}</div>
          <span className="kpi-foot">out of {overall.total} signs</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">FLUENCY</span>
          <div className="kpi-value">{overall.percentage}%</div>
          <div className="kpi-mini-track">
            <div className="kpi-mini-fill" style={{ width: `${overall.percentage}%` }}></div>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">PRACTICE STREAK</span>
          <div className="kpi-value">{streakDays} {streakDays === 1 ? "Day" : "Days"}</div>
          <span className="kpi-foot">Active daily learning</span>
        </div>
      </section>

      {/* Visual Category Bars */}
      <section className="progress-category-bars-section">
        <h2>Category Fluency</h2>
        <div className="category-bars-list">
          {categoryStats.map((cat) => (
            <div className="category-bar-row" key={cat.id}>
              <div className="bar-row-info">
                <span className="bar-cat-name">{cat.title}</span>
                <span className="bar-cat-count">
                  {cat.count} / {cat.total} ({cat.percentage}%)
                </span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${cat.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mastered Signs Badge Cloud */}
      <section className="mastered-cloud-section">
        <h2>Mastered Signs ({masteredList.length})</h2>

        {masteredList.length === 0 ? (
          <div className="empty-mastered-state">
            <p>You haven't marked any signs as learned yet.</p>
            <Link to="/learn" className="hero-button">
              Start Learning Now →
            </Link>
          </div>
        ) : (
          <div className="mastered-pills-cloud">
            {masteredList.map((item) => (
              <Link
                key={`${item.categoryId}-${item.id}`}
                to={
                  item.categoryId === "alphabets"
                    ? `/learn/alphabets/${item.id}`
                    : `/learn/${item.categoryId}/${item.id}`
                }
                className="mastered-pill-item"
              >
                <span className="pill-symbol">{item.symbol}</span>
                <span className="pill-name">{item.title}</span>
                <span className="pill-check">✓</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Minimal Footer Action / Reset */}
      <footer className="progress-clean-footer">
        {confirmReset ? (
          <div className="reset-confirm-box">
            <span>Reset all progress?</span>
            <button type="button" className="btn-confirm-yes" onClick={handleReset}>
              Yes, Reset
            </button>
            <button type="button" className="btn-confirm-cancel" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="btn-reset-ghost" onClick={() => setConfirmReset(true)}>
            Reset Progress
          </button>
        )}
      </footer>
    </main>
  );
}

export default Progress;
