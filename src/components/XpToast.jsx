import { useProgress } from "../context/ProgressContext";

export function XpToast() {
  const { xpCelebration } = useProgress();

  if (!xpCelebration) return null;

  return (
    <div className="xp-celebration-toast" role="status" aria-live="polite">
      <div className="xp-toast-content">
        <span className="xp-icon">✨</span>
        <div className="xp-text-group">
          <strong>+{xpCelebration.amount} XP</strong>
          {xpCelebration.label && (
            <small>{xpCelebration.label} Mastered!</small>
          )}
        </div>
      </div>
    </div>
  );
}

export default XpToast;
