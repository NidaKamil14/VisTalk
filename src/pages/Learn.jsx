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
    const idx = items.findIndex((it) => !isLearned(activeCategory.id, it.id));
    return idx !== -1 ? idx : items.length - 1;
  }, [items, activeCategory.id, isLearned]);

  const handlePathChange = (catId) => {
    setSearchParams({ path: catId });
  };

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
              {catProg.count > 0 && (
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
          <h1>{activeCategory.title} Roadmap</h1>
        </div>

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
      </header>

      {/* 3. The Visual Stepping Game Roadmap */}
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
    </main>
  );
}

export default Learn;