import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import useSignRecognition from "../hooks/useSignRecognition";
import {
  getItemsByCategory,
  getItem,
  ALPHABETS_DATA,
  NUMBERS_DATA,
} from "../data/learningData";

function Practice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "alphabets";
  const signParam = searchParams.get("sign");

  const { isLearned, masterSign } = useProgress();

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
    return (
      nextUnlearned ||
      categoryItems[0] ||
      (categoryParam === "numbers" ? NUMBERS_DATA[0] : ALPHABETS_DATA[0])
    );
  }, [categoryParam, signParam, categoryItems, isLearned]);

  const targetSymbol = (targetSign.symbol || targetSign.id || "A").toUpperCase();

  const targetIndex = useMemo(() => {
    return categoryItems.findIndex(
      (it) => String(it.id).toLowerCase() === String(targetSign.id).toLowerCase()
    );
  }, [categoryItems, targetSign]);

  const alreadyMastered = isLearned(categoryParam, targetSign.id);

  // Hook up real-time ML sign recognition with category routing (alphabets vs numbers)
  const {
    videoRef,
    isCameraActive,
    isMirrored,
    setIsMirrored,
    cameraError,
    toggleCamera,
    isServerOnline,
    prediction,
    isPredicting,
    captureAndPredict,
  } = useSignRecognition(targetSign, categoryParam);

  // Verification state
  const [verificationResult, setVerificationResult] = useState(null);

  // Reset verification when switching signs
  useEffect(() => {
    setVerificationResult(null);
  }, [targetSign.id, categoryParam]);

  // Transition to next sign
  const handleNextSign = () => {
    setVerificationResult(null);
    const nextIdx = (targetIndex + 1) % categoryItems.length;
    const nextItem = categoryItems[nextIdx];
    setSearchParams({ category: categoryParam, sign: nextItem.id });
  };

  // Transition to previous sign
  const handlePrevSign = () => {
    setVerificationResult(null);
    const prevIdx = (targetIndex - 1 + categoryItems.length) % categoryItems.length;
    const prevItem = categoryItems[prevIdx];
    setSearchParams({ category: categoryParam, sign: prevItem.id });
  };

  // Trigger verification and award +10 XP
  const handleVerifySign = async () => {
    if (isCameraActive) {
      await captureAndPredict();
    }

    const { newlyMastered, xpEarned } = masterSign(
      categoryParam,
      targetSign.id,
      targetSign.title
    );

    setVerificationResult({
      success: true,
      newlyMastered,
      xpEarned,
      predictedLetter: prediction?.letter || targetSymbol,
      confidence: prediction?.confidence || 100,
    });
  };

  // Reference image source
  const referenceImageSrc =
    targetSign.mediaUrl ||
    (categoryParam === "numbers"
      ? `/reference_signs/numbers/${targetSymbol}.jpg`
      : `/reference_signs/${targetSymbol}.jpg`);

  const modelLabel =
    categoryParam === "numbers"
      ? "Trained ISL Numbers Model Active (MobileNetV3-Small • 0–9)"
      : "Trained ISL Alphabet Model Active (MobileNetV3-Small • A–Z)";

  return (
    <main className="game-practice-page">
      {/* Top Bar with Roadmap Link, Target Selector & XP Status */}
      <header className="practice-top-banner">
        <Link
          to={categoryParam === "alphabets" ? "/learn/alphabets" : `/learn/${categoryParam}`}
          className="practice-back-btn"
        >
          ← Back to Roadmap
        </Link>

        <div className="practice-nav-controls">
          <button
            type="button"
            className="sign-nav-arrow-btn"
            onClick={handlePrevSign}
            title="Previous Sign"
          >
            ‹
          </button>
          
          <div className="practice-target-indicator">
            <span className="target-label">TARGET:</span>
            <strong>{targetSign.title}</strong>
          </div>

          <button
            type="button"
            className="sign-nav-arrow-btn"
            onClick={handleNextSign}
            title="Next Sign"
          >
            ›
          </button>
        </div>

        <span className="practice-xp-tag">
          {alreadyMastered ? "✓ Mastered" : "+10 XP upon mastery"}
        </span>
      </header>

      {/* Main Practice Stage: Target Reference <-> Camera Mirror */}
      <div className="practice-stage-grid">
        {/* Left: The Target Sign Reference Card */}
        <div className="practice-target-card">
          <div className="target-card-top">
            <span className="target-pill">DEMONSTRATION & GUIDE</span>
            {alreadyMastered && <span className="mastered-dot-tag">✓ Mastered</span>}
          </div>

          {/* Authentic Sign Reference Image Showcase */}
          <div className="target-reference-visual-box">
            <img
              src={referenceImageSrc}
              alt={`ISL Hand Gesture Demonstration for ${targetSign.title}`}
              className="target-reference-photo"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = "flex";
                }
              }}
            />
            <div className="target-symbol-fallback" style={{ display: "none" }}>
              <span>{targetSymbol}</span>
            </div>
            <div className="target-badge-overlay">
              <span className="target-letter-badge">{targetSymbol}</span>
            </div>
          </div>

          <div className="target-details">
            <h2>{targetSign.title}</h2>
            <p className="target-instruction">{targetSign.postureGuidance}</p>
            {targetSign.practiceTip && (
              <p className="target-tip">💡 <strong>Tip:</strong> {targetSign.practiceTip}</p>
            )}
          </div>
        </div>

        {/* Right: Live Camera Mirror & Real-Time AI Inference */}
        <div className="practice-camera-card">
          <div className="camera-card-top">
            <div className="camera-status">
              <span className={`status-bulb ${isCameraActive ? "live" : ""}`}></span>
              <span>
                {isCameraActive
                  ? isServerOnline
                    ? "Camera Live • AI Model Active"
                    : "Camera Live (ML Server Offline)"
                  : "Camera Off"}
              </span>
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
                  onLoadedMetadata={(e) => {
                    e.target.play().catch(() => {});
                  }}
                  className={`live-video ${isMirrored ? "mirrored" : ""}`}
                />
                
                {/* Hand target boundary silhouette */}
                <div className="camera-hand-silhouette">
                  <span>Show sign here</span>
                </div>

                {/* Real-Time AI Prediction HUD Overlay */}
                {prediction ? (
                  <div className={`ai-prediction-hud ${prediction.isMatch ? "hud-match" : "hud-detecting"}`}>
                    <div className="hud-main-badge">
                      <span className="hud-dot"></span>
                      <span className="hud-letter">
                        {prediction.isMatch
                          ? `✓ Sign '${prediction.letter}' Matched!`
                          : `Detected: '${prediction.letter}'`}
                      </span>
                      <span className="hud-conf">{prediction.confidence}%</span>
                    </div>

                    {prediction.topPredictions && prediction.topPredictions.length > 1 && (
                      <div className="hud-top-candidates">
                        {prediction.topPredictions.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className={`candidate-chip ${
                              item.letter.toUpperCase() === targetSymbol
                                ? "chip-target"
                                : ""
                            }`}
                          >
                            {item.letter}: {item.confidence}%
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="ai-prediction-hud hud-waiting">
                    <span className="hud-dot pulse"></span>
                    <span>Analyzing hand posture with {categoryParam === "numbers" ? "Numbers" : "Alphabet"} Model...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="camera-activate-prompt">
                <span className="camera-big-icon">📷</span>
                <h3>Practice with Camera</h3>
                <p>Follow the demonstration on the left and show your sign to the camera.</p>
                <button
                  type="button"
                  className="hero-button"
                  onClick={toggleCamera}
                >
                  Start Practice Camera
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
                  <h4>Great Job! Sign Verified ({verificationResult.confidence}%)</h4>
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
                className={`practice-verify-btn ${
                  prediction?.isMatch ? "verify-btn-match" : ""
                }`}
                onClick={handleVerifySign}
              >
                {prediction?.isMatch
                  ? `✨ Confirm Match: ${prediction.letter} (${prediction.confidence}%) ✨`
                  : alreadyMastered
                  ? "Verify Sign Practice ✓"
                  : "Verify Sign (+10 XP) ✓"}
              </button>
              
              <div className="model-integration-indicator">
                <span className={`indicator-light ${isServerOnline ? "online" : "offline"}`}></span>
                <span>
                  {isServerOnline
                    ? modelLabel
                    : "Local ML Server Offline (run `python3 ml/server.py`)"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Practice;
