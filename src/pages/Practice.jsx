import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import useSignRecognition from "../hooks/useSignRecognition";
import {
  getItemsByCategory,
  getItem,
  ALPHABETS_DATA,
} from "../data/learningData";

function Practice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "alphabets";
  const signParam = searchParams.get("sign");

  const { isLearned, masterSign } = useProgress();

  const {
    videoRef,
    isCameraActive,
    isMirrored,
    setIsMirrored,
    cameraError,
    toggleCamera,
  } = useSignRecognition();

  // Category items
  const categoryItems = useMemo(() => {
    return getItemsByCategory(categoryParam);
  }, [categoryParam]);

  // Target sign: default to passed sign or the first unlearned sign
  const targetSign = useMemo(() => {
    if (signParam) {
      const found = getItem(categoryParam, signParam);
      if (found) return found;
    }
    const nextUnlearned = categoryItems.find((it) => !isLearned(categoryParam, it.id));
    return nextUnlearned || categoryItems[0] || ALPHABETS_DATA[0];
  }, [categoryParam, signParam, categoryItems, isLearned]);

  const targetIndex = useMemo(() => {
    return categoryItems.findIndex(
      (it) => String(it.id).toLowerCase() === String(targetSign.id).toLowerCase()
    );
  }, [categoryItems, targetSign]);

  const alreadyMastered = isLearned(categoryParam, targetSign.id);

  // Verification state (scaffolded for Phase 2 MediaPipe integration)
  const [verificationResult, setVerificationResult] = useState(null);

  // Transition to next sign
  const handleNextSign = () => {
    setVerificationResult(null);
    const nextIdx = (targetIndex + 1) % categoryItems.length;
    const nextItem = categoryItems[nextIdx];
    setSearchParams({ category: categoryParam, sign: nextItem.id });
  };

  // Phase 2 Ready Verification Slot:
  // In Task 2, this function will be triggered automatically when the MediaPipe + ML
  // classifier detects the correct hand landmark posture with >85% confidence.
  const handleVerifySign = () => {
    const { newlyMastered, xpEarned } = masterSign(
      categoryParam,
      targetSign.id,
      targetSign.title
    );

    setVerificationResult({
      success: true,
      newlyMastered,
      xpEarned,
    });
  };

  return (
    <main className="game-practice-page">
      {/* Top Bar with Roadmap Link & Target Status */}
      <header className="practice-top-banner">
        <Link
          to={categoryParam === "alphabets" ? "/learn/alphabets" : `/learn/${categoryParam}`}
          className="practice-back-btn"
        >
          ← Back to Roadmap
        </Link>

        <div className="practice-target-indicator">
          <span className="target-label">TARGET:</span>
          <strong>{targetSign.title}</strong>
        </div>

        <span className="practice-xp-tag">
          {alreadyMastered ? "✓ Mastered" : "+10 XP upon mastery"}
        </span>
      </header>

      {/* Main Practice Stage: Target Reference <-> Camera Mirror */}
      <div className="practice-stage-grid">
        {/* Left: The Target Sign to Mirror */}
        <div className="practice-target-card">
          <div className="target-card-top">
            <span className="target-pill">REFERENCE SIGN</span>
            {alreadyMastered && <span className="mastered-dot-tag">✓ Mastered</span>}
          </div>

          <div className="target-symbol-showcase">
            <span className="target-symbol-char">{targetSign.symbol}</span>
          </div>

          <div className="target-details">
            <h2>{targetSign.title}</h2>
            <p className="target-instruction">{targetSign.postureGuidance}</p>
            {targetSign.practiceTip && (
              <p className="target-tip">💡 {targetSign.practiceTip}</p>
            )}
          </div>
        </div>

        {/* Right: Live Camera Mirror */}
        <div className="practice-camera-card">
          <div className="camera-card-top">
            <div className="camera-status">
              <span className={`status-bulb ${isCameraActive ? "live" : ""}`}></span>
              <span>{isCameraActive ? "Camera Mirror Live" : "Camera Off"}</span>
            </div>

            {isCameraActive && (
              <button
                type="button"
                className="mirror-flip-btn"
                onClick={() => setIsMirrored(!isMirrored)}
              >
                {isMirrored ? "↔ Mirror On" : "↔ Normal"}
              </button>
            )}
          </div>

          <div className="camera-screen-box">
            {cameraError ? (
              <div className="camera-error-prompt">
                <span>⚠️</span>
                <p>{cameraError}</p>
                <button type="button" className="hero-button" onClick={toggleCamera}>
                  Enable Camera
                </button>
              </div>
            ) : isCameraActive ? (
              <div className="camera-video-wrapper">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`live-video ${isMirrored ? "mirrored" : ""}`}
                />
                <div className="camera-hand-silhouette">
                  <span>Show sign here</span>
                </div>
              </div>
            ) : (
              <div className="camera-activate-prompt">
                <span className="camera-big-icon">📷</span>
                <h3>Practice with Camera</h3>
                <p>Use your webcam mirror to match the hand posture in real-time.</p>
                <button
                  type="button"
                  className="hero-button"
                  onClick={toggleCamera}
                >
                  Start Camera Mirror
                </button>
              </div>
            )}
          </div>

          {/* Verification & Reward Stage */}
          {verificationResult ? (
            <div className="practice-success-banner">
              <div className="success-content">
                <span className="success-check-icon">✓</span>
                <div>
                  <h4>Great Job! Sign Verified</h4>
                  <p>
                    {verificationResult.newlyMastered
                      ? "+10 XP added to your learning journey!"
                      : "Sign posture practiced! (Already in mastered list)"}
                  </p>
                </div>
              </div>

              <div className="success-actions">
                <button
                  type="button"
                  className="next-sign-cta-btn"
                  onClick={handleNextSign}
                >
                  Next Sign →
                </button>
                <Link
                  to={categoryParam === "alphabets" ? "/learn/alphabets" : `/learn/${categoryParam}`}
                  className="back-roadmap-link"
                >
                  Back to Roadmap
                </Link>
              </div>
            </div>
          ) : (
            <div className="practice-verify-action-box">
              <button
                type="button"
                className="practice-verify-btn"
                onClick={handleVerifySign}
              >
                {alreadyMastered ? "Verify Sign Practice ✓" : "Verify Sign (+10 XP) ✓"}
              </button>
              <small className="phase2-disclaimer">
                Task 2 MediaPipe integration will automate recognition via real-time camera tracking.
              </small>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Practice;
