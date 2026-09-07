import { useParams, Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { getItem, getAdjacentItems, getCategoryConfig } from "../data/learningData";
import SignVisual from "../components/SignVisual";
import NotFound from "./NotFound";

function SingleLesson() {
  const { category, id } = useParams();
  const config = getCategoryConfig(category);
  const item = getItem(category, id);
  const { previous, next } = getAdjacentItems(category, id);

  const { isLearned, toggleLearned } = useProgress();

  if (!config || !item) {
    return <NotFound />;
  }

  const learned = isLearned(category, item.id);

  const handleToggle = () => {
    toggleLearned(category, item.id);
  };

  return (
    <main className="single-lesson-layout">
      {/* Top Breadcrumb */}
      <nav className="lesson-top-nav">
        <Link to={config.path} className="breadcrumb-link">
          ← Back to {config.title}
        </Link>
        <span className="lesson-badge-category">{config.title.toUpperCase()}</span>
      </nav>

      <div className="single-lesson-card-wrapper">
        {/* 1. Visual Card */}
        <div className="lesson-visual-col">
          <SignVisual
            symbol={item.symbol}
            title={item.title}
            category={category}
            isLearned={learned}
          />
        </div>

        {/* 2-5. Title, Guidance, Tip & Action */}
        <div className="lesson-content-col">
          <div className="lesson-title-area">
            <span className="lesson-small-label">{config.title.toUpperCase()}</span>
            <h1>{item.title}</h1>
          </div>

          <div className="lesson-instruction-text">
            <p>{item.postureGuidance}</p>
          </div>

          {item.practiceTip && (
            <div className="lesson-tip-pill">
              <span>💡 {item.practiceTip}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="lesson-actions-area">
            <button
              type="button"
              className={`primary-learn-btn ${learned ? "is-learned" : ""}`}
              onClick={handleToggle}
            >
              {learned ? "✓ Mastered" : "Mark as Learned"}
            </button>

            <Link
              to={`/practice?category=${category}&sign=${encodeURIComponent(item.id)}`}
              className="secondary-practice-link"
            >
              Practice in Camera Mirror →
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Previous / Next Navigation */}
      <footer className="single-lesson-footer">
        {previous ? (
          <Link to={`/learn/${category}/${previous.id}`} className="footer-nav-btn prev">
            ← {previous.title}
          </Link>
        ) : (
          <span className="footer-nav-btn disabled"></span>
        )}

        <Link to={config.path} className="footer-overview-link">
          All {config.title}
        </Link>

        {next ? (
          <Link to={`/learn/${category}/${next.id}`} className="footer-nav-btn next">
            {next.title} →
          </Link>
        ) : (
          <span className="footer-nav-btn disabled"></span>
        )}
      </footer>
    </main>
  );
}

export default SingleLesson;
