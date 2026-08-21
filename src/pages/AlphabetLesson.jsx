import { Link } from "react-router-dom";
function AlphabetLesson() {
  return (
    <main className="lesson-page">
      <div className="lesson-header">
        <p className="hero-tag">LESSON 01 • BEGINNER</p>

        <h1>Sign Language Alphabets</h1>

        <p>
          Learn the signs for each letter of the alphabet
          and build your foundation step by step.
        </p>
      </div>

      <div className="alphabet-grid">
        {Array.from({ length: 26 }, (_, index) => {
          const letter = String.fromCharCode(65 + index);

          return (
            <Link
  to={`/learn/alphabets/${letter}`}
  className="letter-card"
  key={letter}
>
  <div className="letter-placeholder">
    {letter}
  </div>

  <h2>{letter}</h2>

  <span>Learn Sign →</span>
</Link>
          );
        })}
      </div>
    </main>
  );
}

export default AlphabetLesson;