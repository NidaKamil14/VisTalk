import { useParams, Link } from "react-router-dom";

function LetterLesson() {
  const { letter } = useParams();

  const currentLetter = letter.toUpperCase();

  const currentIndex = currentLetter.charCodeAt(0) - 65;

  const previousLetter =
    currentIndex > 0
      ? String.fromCharCode(65 + currentIndex - 1)
      : null;

  const nextLetter =
    currentIndex < 25
      ? String.fromCharCode(65 + currentIndex + 1)
      : null;

  return (
    <main className="letter-lesson-page">

      <div className="letter-lesson-header">
        <p className="hero-tag">
          ALPHABETS • BEGINNER
        </p>

        <h1>
          Learn the sign for{" "}
          <span>{currentLetter}</span>
        </h1>

        <p>
          Watch the sign carefully and practice the hand
          position at your own pace.
        </p>
      </div>

      <div className="sign-learning-area">

        <div className="sign-display">
          <div className="sign-placeholder">
            {currentLetter}
          </div>

          <p>Sign demonstration will appear here.</p>
        </div>

        <div className="sign-info">

          <p className="lesson-label">
            LETTER {currentLetter}
          </p>

          <h2>{currentLetter}</h2>

          <p className="sign-description">
            Observe the hand position carefully. Practice
            the sign a few times before moving to the next
            letter.
          </p>

          <button className="learned-button">
            Mark as Learned
          </button>

        </div>

      </div>

      <div className="lesson-navigation">

        {previousLetter ? (
          <Link to={`/learn/alphabets/${previousLetter}`}>
            ← Previous
          </Link>
        ) : (
          <span></span>
        )}

        <Link to="/learn/alphabets">
          All Alphabets
        </Link>

        {nextLetter ? (
          <Link to={`/learn/alphabets/${nextLetter}`}>
            Next →
          </Link>
        ) : (
          <span></span>
        )}

      </div>

    </main>
  );
}

export default LetterLesson;