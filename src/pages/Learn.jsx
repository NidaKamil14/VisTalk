import { useMemo } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import {
  CATEGORIES,
  getItemsByCategory,
  getCategoryConfig,
} from "../data/learningData";

function Learn() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: routeCategory } = useParams();

  const activeCategoryId =
    routeCategory || searchParams.get("path") || "alphabets";

  const { isLearned, isUnlocked, getCategoryProgress } = useProgress();

  const activeCategory =
    getCategoryConfig(activeCategoryId) || CATEGORIES[0];
  const items = useMemo(
    () => getItemsByCategory(activeCategory.id),
    [activeCategory.id]
  );

  const { count, total, percentage } = getCategoryProgress(activeCategory.id);

  // Identify the current active (next unlearned) node index
  const activeNodeIndex = useMemo(() => {
    if (!items.length) return 0;
    const idx = items.findIndex((it) => !isLearned(activeCategory.id, it.id));
    return idx !== -1 ? idx : items.length - 1;
  }, [items, activeCategory.id, isLearned]);

  const handlePathChange = (catId) => {
    setSearchParams({ path: catId });
  };

  const isComingSoon = activeCategory.id === "coming_soon";

  return (
    <main className="roadmap-page">
      {/* 1. Learning Path Switcher */}
      <nav className="roadmap-path-nav" aria-label="Learning Paths">
        {CATEGORIES.map((cat) => {
          const catProg = getCategoryProgress(cat.id);
          const isSelected = cat.id === activeCategory.id;

          return (
            <button
              key={cat.id}
              type="button"
              className={`path-pill-btn ${isSelected ? "selected" : ""}`}
              onClick={() => handlePathChange(cat.id)}
            >
              <span className="path-icon">{cat.icon}</span>
              <span className="path-name">{cat.title}</span>
              {cat.id !== "coming_soon" && catProg.count > 0 && (
                <span className="path-micro-prog">
                  {catProg.count}/{catProg.total}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* 2. Roadmap Journey Header */}
      <header className="roadmap-header">
        <div className="roadmap-header-left">
          <span className="section-eyebrow">{activeCategory.level} JOURNEY</span>
          <h1>{activeCategory.title} {isComingSoon ? "Preview" : "Roadmap"}</h1>
        </div>

        {!isComingSoon ? (
          <div className="roadmap-stats-pill">
            <span className="stats-metric">
              <strong>{count}</strong> / {total} Mastered
            </span>
            <div className="roadmap-mini-track">
              <div
                className="roadmap-mini-fill"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="roadmap-stats-pill coming-soon-pill">
            <span className="stats-metric">✨ In Active Research</span>
          </div>
        )}
      </header>

      {/* 3. The Visual Stepping Game Roadmap or Coming Soon Showcase */}
      {isComingSoon ? (
        <section className="coming-soon-showcase-box">
          <div className="coming-soon-hero-card">
            <div className="coming-soon-badge-icon">🚀</div>
            <h2>Future VisTalk Expansion</h2>
            <p className="coming-soon-lead">
              Our core ISL static recognition models for <strong>A–Z Alphabets</strong> and <strong>0–9 Numbers</strong> are live in the MVP.
              We are actively developing future interactive modules for Indian Sign Language:
            </p>

            <div className="future-modules-grid">
              <div className="future-module-item">
                <span className="future-mod-icon">💬</span>
                <h3>Everyday Words</h3>
                <p>High-frequency conversational vocabulary: greetings, family members, emotions, and daily essentials.</p>
                <span className="future-mod-tag">Phase 2 Planned</span>
              </div>

              <div className="future-module-item">
                <span className="future-mod-icon">🤝</span>
                <h3>Common Phrases</h3>
                <p>Multi-sign conversational expressions, questions, and natural Indian Sign Language grammar patterns.</p>
                <span className="future-mod-tag">Phase 2 Planned</span>
              </div>

              <div className="future-module-item">
                <span className="future-mod-icon">🎥</span>
                <h3>Dynamic Video Recognition</h3>
                <p>Temporal sign motion tracking powered by MediaPipe landmarks and sequential neural architectures.</p>
                <span className="future-mod-tag">In Research</span>
              </div>
            </div>

            <div className="coming-soon-actions">
              <button
                type="button"
                className="hero-button"
                onClick={() => handlePathChange("alphabets")}
              >
                Practice Alphabets (A–Z) →
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => handlePathChange("numbers")}
              >
                Practice Numbers (0–9) →
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="roadmap-canvas">
          <div className="roadmap-nodes-container">
            {items.map((item, index) => {
              const completed = isLearned(activeCategory.id, item.id);
              const unlocked = isUnlocked(activeCategory.id, item.id);
              const isCurrent = index === activeNodeIndex && !completed;

              // Winding offset pattern for Duolingo-like path layout
              const offsetStep = index % 4;
              const offsetClass =
                offsetStep === 0
                  ? "pos-center"
                  : offsetStep === 1
                  ? "pos-right"
                  : offsetStep === 2
                  ? "pos-center"
                  : "pos-left";

              return (
                <div
                  key={item.id}
                  className={`roadmap-node-row ${offsetClass}`}
                >
                  {/* Milestone banner every 6 items */}
                  {index > 0 && index % 6 === 0 && (
                    <div className="roadmap-milestone-checkpoint">
                      <span className="milestone-icon">🏆</span>
                      <span>Milestone Checkpoint</span>
                    </div>
                  )}

                  {/* Node Button / Anchor */}
                  {unlocked ? (
                    <Link
                      to={
                        activeCategory.id === "alphabets"
                          ? `/learn/alphabets/${item.id}`
                          : `/learn/${activeCategory.id}/${item.id}`
                      }
                      className={`roadmap-node ${completed ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                      title={`${item.title} - ${completed ? "Mastered (Click to review)" : "Click to learn"}`}
                    >
                      {isCurrent && (
                        <div className="node-floating-action">
                          <span>START</span>
                        </div>
                      )}

                      <div className="node-circle">
                        {completed ? (
                          <span className="node-check">✓</span>
                        ) : (
                          <span className="node-char">{item.symbol}</span>
                        )}
                      </div>

                      <span className="node-label">{item.title}</span>
                    </Link>
                  ) : (
                    <div
                      className="roadmap-node locked"
                      title="Complete previous signs to unlock"
                    >
                      <div className="node-circle">
                        <span className="node-lock">🔒</span>
                      </div>
                      <span className="node-label">{item.title}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

export default Learn;