import { useParams, Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { getItem, getAdjacentItems } from "../data/learningData";
import SignVisual from "../components/SignVisual";

function LetterLesson() {
  const { letter } = useParams();
  const currentLetter = (letter || "A").toUpperCase();

  const item = getItem("alphabets", currentLetter);
  const { previous, next } = getAdjacentItems("alphabets", currentLetter);

  const { isLearned, masterSign, toggleLearned } = useProgress();
  const learned = isLearned("alphabets", currentLetter);

  const handleMaster = () => {
    if (!learned) {
      masterSign("alphabets", currentLetter, `Letter ${currentLetter}`);
    } else {
      toggleLearned("alphabets", currentLetter, `Letter ${currentLetter}`);
    }
  };

  return (
    <main className="game-lesson-page">
      {/* Top Roadmap Breadcrumb */}
      <nav className="game-lesson-topbar">
        <Link to="/learn/alphabets" className="game-back-btn">
          ← Back to Roadmap
        </Link>
        <span className="game-level-tag">ALPHABET ROADMAP</span>
      </nav>

      {/* The Visual Dominates the Page */}
      <div className="game-lesson-visual-centerpiece">
        <div className="game-sign-display-card">
          <SignVisual
            symbol={currentLetter}
            title={`Letter ${currentLetter}`}
            category="alphabets"
            isLearned={learned}
          />
          {learned && (
            <div className="sign-xp-awarded-pill">
              <span>✓ +10 XP Mastered</span>
            </div>
          )}
        </div>

        {/* Minimal 1-sentence guidance */}
        <div className="game-lesson-text">
          <h1>Letter {currentLetter}</h1>
          <p className="lesson-one-liner">
            {item ? item.postureGuidance : "Form the manual sign with your hand facing forward."}
          </p>
          {item?.practiceTip && (
            <div className="lesson-subtle-tip">
              <span>💡 {item.practiceTip}</span>
            </div>
          )}
        </div>

        {/* Primary Actions: Practice This Sign & Mark Complete */}
        <div className="game-lesson-actions">
          <Link
            to={`/practice?category=alphabets&sign=${currentLetter}`}
            className="game-primary-practice-btn"
          >
            Practice This Sign 📹 →
          </Link>

          <button
            type="button"
            className={`game-secondary-complete-btn ${learned ? "is-mastered" : ""}`}
            onClick={handleMaster}
          >
            {learned ? "✓ Mastered (+10 XP)" : "Mark Complete (+10 XP) ✓"}
          </button>
        </div>
      </div>

      {/* Sequential Previous / Next */}
      <footer className="game-lesson-stepper">
        {previous ? (
          <Link to={`/learn/alphabets/${previous.id}`} className="stepper-link prev">
            ← Letter {previous.id}
          </Link>
        ) : (
          <span className="stepper-link disabled"></span>
        )}

        <Link to="/learn/alphabets" className="stepper-link roadmap">
          Roadmap
        </Link>

        {next ? (
          <Link to={`/learn/alphabets/${next.id}`} className="stepper-link next">
            Letter {next.id} →
          </Link>
        ) : (
          <span className="stepper-link disabled"></span>
        )}
      </footer>
    </main>
  );
}

export default LetterLesson;