/**
 * SignVisual Component
 * 
 * Renders authentic ISL sign demonstration photos with symbol overlay,
 * posture guidance caption, and completion status.
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
        <div className="sign-media-box">
          <img
            src={mediaUrl}
            alt={`ISL sign demonstration for ${title || symbol}`}
            className="sign-demo-photo"
            onError={(e) => {
              e.target.style.display = "none";
              const fallback = e.target.parentElement.querySelector(".sign-hero-fallback");
              if (fallback) {
                fallback.style.display = "flex";
              }
            }}
          />
          <div className="sign-hero-fallback" style={{ display: "none" }}>
            <span className="sign-hero-char">{symbol}</span>
          </div>
          <div className="sign-badge-overlay">
            <span className="sign-badge-char">{symbol}</span>
          </div>
        </div>
      ) : (
        <div className="sign-hero-badge">
          <span className="sign-hero-char">{symbol}</span>
        </div>
      )}

      <span className="sign-caption">Authentic ISL Sign Posture</span>
    </div>
  );
}

export default SignVisual;
