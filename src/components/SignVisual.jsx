/**
 * SignVisual Component
 * 
 * Clean, focused visual representation of manual signs.
 * Provides a prominent visual anchor with clean asset slots ready
 * for verified video/3D landmark integration in Task 2.
 */

export function SignVisual({
  symbol,
  title,
  size = "lg",
  isLearned = false,
  mediaUrl = null,
}) {
  if (size === "sm") {
    return (
      <div className={`sign-visual-sm ${isLearned ? "is-learned" : ""}`}>
        <span className="sign-symbol-text">{symbol}</span>
        {isLearned && <span className="learned-dot" title="Completed">✓</span>}
      </div>
    );
  }

  if (size === "card") {
    return (
      <div className={`sign-visual-card ${isLearned ? "is-learned" : ""}`}>
        <div className="card-symbol-badge">
          <span className="symbol-char">{symbol}</span>
        </div>
        {isLearned && (
          <div className="card-learned-badge">
            <span>✓</span>
          </div>
        )}
      </div>
    );
  }

  // Large focused lesson display
  return (
    <div className={`sign-focus-card ${isLearned ? "is-learned" : ""}`}>
      {isLearned && (
        <div className="sign-mastered-indicator">
          <span>✓ Mastered</span>
        </div>
      )}

      {mediaUrl ? (
        <div className="sign-media-container">
          <img src={mediaUrl} alt={`Sign demonstration for ${title || symbol}`} />
        </div>
      ) : (
        <div className="sign-hero-badge">
          <span className="sign-hero-char">{symbol}</span>
        </div>
      )}

      <span className="sign-caption">Manual Sign Posture</span>
    </div>
  );
}

export default SignVisual;
