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

// Contextual example word mapping for A-Z and 0-9
const EXAMPLE_WORDS = {
  A: "Apple",
  B: "Book",
  C: "Cat",
  D: "Dog",
  E: "Eagle",
  F: "Flower",
  G: "Garden",
  H: "Heart",
  I: "Island",
  J: "Joy",
  K: "Kindness",
  L: "Light",
  M: "Moon",
  N: "Nature",
  O: "Ocean",
  P: "Peace",
  Q: "Quiet",
  R: "River",
  S: "Sun",
  T: "Tree",
  U: "Unity",
  V: "Voice",
  W: "Water",
  X: "X-ray",
  Y: "Youth",
  Z: "Zenith",
  "0": "Zero",
  "1": "One",
  "2": "Two",
  "3": "Three",
  "4": "Four",
  "5": "Five",
  "6": "Six",
  "7": "Seven",
  "8": "Eight",
  "9": "Nine",
};

function Practice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "alphabets";
  const signParam = searchParams.get("sign");

  const { isLearned, masterSign, getCategoryProgress } = useProgress();

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
  const exampleWord = EXAMPLE_WORDS[targetSymbol] || targetSign.title;

  const targetIndex = useMemo(() => {
    return categoryItems.findIndex(
      (it) => String(it.id).toLowerCase() === String(targetSign.id).toLowerCase()
    );
  }, [categoryItems, targetSign]);

  const alreadyMastered = isLearned(categoryParam, targetSign.id);
  const categoryProgress = getCategoryProgress(categoryParam);

  // Hook up real-time ML sign recognition with category routing
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

  // Audio pronunciation
  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const text =
        categoryParam === "alphabets"
          ? `${targetSymbol}, as in ${exampleWord}`
          : `Number ${targetSymbol}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Category switch
  const handleCategorySwitch = (newCategory) => {
    setVerificationResult(null);
    const defaultSign = newCategory === "numbers" ? "0" : "A";
    setSearchParams({ category: newCategory, sign: defaultSign });
  };

  // Sign direct selection
  const handleSelectSign = (signId) => {
    setVerificationResult(null);
    setSearchParams({ category: categoryParam, sign: signId });
  };

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
      confidence: prediction?.confidence || 95,
    });
  };

  // Reference image source
  const referenceImageSrc =
    targetSign.mediaUrl ||
    (categoryParam === "numbers"
      ? `/reference_signs/numbers/${targetSymbol}.jpg`
      : `/reference_signs/${targetSymbol}.jpg`);

  const isMatch = prediction?.isMatch || verificationResult?.success;
  const displayConfidence = prediction?.confidence || (verificationResult ? verificationResult.confidence : 0);
  const displayLetter = prediction?.letter || (isCameraActive ? "-" : targetSymbol);

  return (
    <main className="practice-editorial-page">
      {/* ====================================================
          1. EDITORIAL HEADER WITH BOTANICAL ARTWORK
          ==================================================== */}
      <header className="practice-hero-header">
        <div className="practice-hero-text">
          <span className="practice-eyebrow">PRACTICE AND IMPROVE</span>
          <h1 className="practice-title">Let's Practice Together</h1>
          <p className="practice-description">
            Use your camera to practice ISL signs. Get real-time feedback and improve with each attempt!
          </p>
        </div>

        <div className="practice-hero-art" aria-hidden="true">
          <div className="practice-hero-blob"></div>
          {/* Botanical leaf branch with rays */}
          <svg className="practice-hero-leaf-svg" width="90" height="90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 90 Q 50 50, 75 15" />
            <path d="M75 15 C 50 15, 50 40, 68 45 Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M55 50 C 78 42, 82 66, 65 72 Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M40 75 C 20 65, 18 90, 36 94 Z" fill="currentColor" fillOpacity="0.25" />
          </svg>
          <svg className="practice-hero-rays-svg" width="36" height="24" viewBox="0 0 36 24" fill="none" stroke="var(--color-warm-yellow)" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="2" x2="18" y2="8" />
            <line x1="8" y1="6" x2="11" y2="12" />
            <line x1="28" y1="6" x2="25" y2="12" />
          </svg>
          <span className="practice-hero-script">
            Better<br />Signs<br />Brighter<br />Conversations
          </span>
        </div>
      </header>

      {/* ====================================================
          2. THREE-COLUMN PRACTICE STAGE
          ==================================================== */}
      <div className="practice-main-stage-grid">
        {/* ----------------------------------------------------
            LEFT COLUMN: SIGN / CATEGORY SELECTOR
            ---------------------------------------------------- */}
        <aside className="practice-selector-panel" aria-label="Sign Selector">
          {/* Alphabets / Numbers Toggle Pills */}
          <div className="category-pill-toggle">
            <button
              type="button"
              className={`category-toggle-btn ${categoryParam === "alphabets" ? "active" : ""}`}
              onClick={() => handleCategorySwitch("alphabets")}
            >
              Alphabets
            </button>
            <button
              type="button"
              className={`category-toggle-btn ${categoryParam === "numbers" ? "active" : ""}`}
              onClick={() => handleCategorySwitch("numbers")}
            >
              Numbers
            </button>
          </div>

          <div className="selector-section-title">
            <span>{categoryParam === "alphabets" ? "Select a letter" : "Select a number"}</span>
          </div>

          {/* Letter / Number Grid Tiles */}
          <div className={`sign-grid-tiles ${categoryParam === "numbers" ? "numbers-tiles" : "alphabets-tiles"}`}>
            {categoryItems.map((item) => {
              const symbol = (item.symbol || item.id).toUpperCase();
              const isSelected = String(item.id).toLowerCase() === String(targetSign.id).toLowerCase();
              const isItemMastered = isLearned(categoryParam, item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sign-tile-btn ${isSelected ? "selected" : ""} ${isItemMastered ? "mastered" : ""}`}
                  onClick={() => handleSelectSign(item.id)}
                  title={`${item.title} ${isItemMastered ? "(Mastered)" : ""}`}
                >
                  <span className="sign-tile-char">{symbol}</span>
                  {isItemMastered && !isSelected && <span className="sign-tile-dot"></span>}
                </button>
              );
            })}
          </div>

          {/* Botanical Sticker Note */}
          <div className="selector-bottom-sticker">
            <svg width="24" height="34" viewBox="0 0 30 45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 40 Q 15 20, 25 5" />
              <path d="M25 5 C 10 5, 10 20, 20 22 Z" fill="currentColor" fillOpacity="0.25" />
              <path d="M12 25 C 24 20, 26 35, 18 38 Z" fill="currentColor" fillOpacity="0.25" />
            </svg>
            <span className="selector-sticker-text">
              Small practice<br />leads to big change.
            </span>
          </div>
        </aside>

        {/* ----------------------------------------------------
            CENTER COLUMN: CAMERA VIEWPORT & HUD CONTROLS
            ---------------------------------------------------- */}
        <section className="practice-camera-viewport-card" aria-label="Practice Camera Viewport">
          <div className="camera-viewport-container">
            {/* Top HUD Status Bar */}
            <div className="camera-top-hud">
              <div className="camera-status-pill">
                <span className={`status-indicator-dot ${isCameraActive ? "live" : ""}`}></span>
                <span>{isCameraActive ? "Camera On" : "Camera Off"}</span>
              </div>

              {isCameraActive && (
                <button
                  type="button"
                  className="camera-settings-btn"
                  onClick={() => setIsMirrored(!isMirrored)}
                  title={isMirrored ? "Mirror mode active" : "Normal mode active"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Video Viewport Area */}
            <div className="camera-screen-surface">
              {cameraError ? (
                <div className="camera-screen-prompt">
                  <span className="prompt-icon">⚠️</span>
                  <h3>Camera Access Required</h3>
                  <p>{cameraError}</p>
                  <button type="button" className="camera-cta-btn" onClick={toggleCamera}>
                    Enable Camera
                  </button>
                </div>
              ) : isCameraActive ? (
                <div className="live-video-frame">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(e) => {
                      e.target.play().catch(() => {});
                    }}
                    className={`webcam-stream ${isMirrored ? "mirrored" : ""}`}
                  />

                  {/* Hand Placement Framing Guide & Center Silhouette */}
                  <div className="camera-hand-guide-overlay" aria-hidden="true">
                    <div className="hand-guide-bounding-box">
                      {/* 4 Precision Corner Framing Brackets */}
                      <div className="corner-bracket corner-tl"></div>
                      <div className="corner-bracket corner-tr"></div>
                      <div className="corner-bracket corner-bl"></div>
                      <div className="corner-bracket corner-br"></div>

                      {/* Gentle Center Hand Silhouette */}
                      <div className="hand-silhouette-guide">
                        <svg
                          className="hand-silhouette-svg"
                          viewBox="0 0 100 120"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M35 110 L35 75 C35 75, 20 65, 18 52 C16 42, 26 38, 30 46 L38 60 L38 24 C38 18, 46 18, 46 24 L46 54 L48 18 C48 12, 56 12, 56 18 L56 54 L58 22 C58 16, 66 16, 66 22 L66 58 L68 32 C68 26, 76 28, 76 35 L76 72 C76 90, 68 110, 60 110 Z" />
                        </svg>
                        <span className="hand-guide-caption">Align hand here</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Center Floating Prompt Pill */}
                  <div className="camera-floating-prompt-pill">
                    <span>
                      {prediction?.isMatch
                        ? `✓ Sign '${prediction.letter}' Matched!`
                        : isPredicting
                        ? `Analyzing posture for ${targetSymbol}...`
                        : "Show the sign clearly inside the frame"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="camera-screen-prompt">
                  <div className="prompt-camera-icon-wrap">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <h3>Show Your Sign</h3>
                  <p>Follow the demonstration on the right and position your hand in the camera frame.</p>
                  <button type="button" className="camera-cta-btn" onClick={toggleCamera}>
                    Start Camera
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Previous / Start Practice / Next Navigation Bar */}
          <div className="practice-action-nav-row">
            <button
              type="button"
              className="practice-nav-pill-btn prev-btn"
              onClick={handlePrevSign}
              disabled={targetIndex === 0}
            >
              ← Previous
            </button>

            <button
              type="button"
              className={`practice-main-action-btn ${isMatch ? "btn-matched" : ""}`}
              onClick={isCameraActive ? handleVerifySign : toggleCamera}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <span>
                {verificationResult
                  ? "✓ Verified (+10 XP)"
                  : isCameraActive
                  ? isMatch
                    ? "Confirm Match (+10 XP)"
                    : "Verify My Sign"
                  : "Start Practice"}
              </span>
            </button>

            <button
              type="button"
              className="practice-nav-pill-btn next-btn"
              onClick={handleNextSign}
              disabled={targetIndex === categoryItems.length - 1}
            >
              Next →
            </button>
          </div>

          <span className="practice-under-caption">
            Make sure your hand is well within the frame
          </span>
        </section>

        {/* ----------------------------------------------------
            RIGHT COLUMN: STACKED CURRENT SIGN, PREDICTION & PROGRESS
            ---------------------------------------------------- */}
        <aside className="practice-right-column" aria-label="Practice Feedback & Progress">
          {/* Card 1: Current Sign Reference Card */}
          <article className="practice-side-card current-sign-card">
            <div className="side-card-header">
              <h3>Current Sign</h3>
            </div>

            <div className="current-sign-body">
              {/* Reference Sign Photo Showcase */}
              <div className="current-sign-photo-frame">
                <img
                  src={referenceImageSrc}
                  alt={`ISL Hand Gesture for ${targetSign.title}`}
                  className="current-sign-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = "flex";
                    }
                  }}
                />
                <div className="current-sign-fallback" style={{ display: "none" }}>
                  <span>{targetSymbol}</span>
                </div>
              </div>

              {/* Character, Phonetic Context & Audio Speaker */}
              <div className="current-sign-info-col">
                <button
                  type="button"
                  className="speaker-audio-btn"
                  onClick={handleSpeak}
                  title="Play pronunciation"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                </button>

                <div className="current-sign-char-display">
                  <span className="sign-char-title">{targetSymbol}</span>
                  <span className="sign-char-context">
                    {categoryParam === "alphabets" ? `as in ${exampleWord}` : `Number ${targetSymbol}`}
                  </span>
                </div>

                {/* Mini Arrow Controls */}
                <div className="current-sign-mini-arrows">
                  <button
                    type="button"
                    className="mini-nav-arrow"
                    onClick={handlePrevSign}
                    disabled={targetIndex === 0}
                    title="Previous"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="mini-nav-arrow"
                    onClick={handleNextSign}
                    disabled={targetIndex === categoryItems.length - 1}
                    title="Next"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* Card 2: Prediction HUD Card */}
          <article className="practice-side-card prediction-card">
            <div className="side-card-header">
              <h3>Prediction</h3>
              <div className="live-status-chip">
                <span className={`live-dot ${isCameraActive ? "pulse" : ""}`}></span>
                <span>Live</span>
              </div>
            </div>

            <div className="prediction-metric-row">
              <span className="prediction-detected-char">{displayLetter}</span>
              <div className="confidence-meter-col">
                <div className="confidence-text-row">
                  <span className="confidence-pct-num">{displayConfidence}%</span>
                  <span className="confidence-label">confidence</span>
                </div>
                <div className="confidence-track">
                  <div
                    className="confidence-fill"
                    style={{ width: `${Math.min(100, Math.max(0, displayConfidence))}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Prediction Feedback Box */}
            <div className={`prediction-feedback-banner ${isMatch ? "feedback-success" : "feedback-neutral"}`}>
              {isMatch ? (
                <>
                  <div className="feedback-check-circle">✓</div>
                  <div className="feedback-text-wrap">
                    <strong>Great job!</strong>
                    <span>That's correct!</span>
                  </div>
                  <svg className="feedback-accent-rays" width="24" height="20" viewBox="0 0 24 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="2" x2="12" y2="6" />
                    <line x1="4" y1="8" x2="8" y2="10" />
                    <line x1="20" y1="8" x2="16" y2="10" />
                  </svg>
                </>
              ) : isCameraActive ? (
                <>
                  <div className="feedback-hint-circle">✋</div>
                  <div className="feedback-text-wrap">
                    <strong>Keep holding steady</strong>
                    <span>Form sign for '{targetSymbol}'</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="feedback-hint-circle">📷</div>
                  <div className="feedback-text-wrap">
                    <strong>Camera ready</strong>
                    <span>Start practice to test</span>
                  </div>
                </>
              )}
            </div>

            {/* Real Top 5 Model Predictions Panel */}
            <div className="top5-predictions-panel">
              <div className="top5-header">
                <span className="top5-title">Top 5 Predictions</span>
                {isCameraActive && (
                  <span className="top5-live-pill">Live</span>
                )}
              </div>
              <div className="top5-list">
                {(prediction?.topPredictions && prediction.topPredictions.length > 0
                  ? prediction.topPredictions.slice(0, 5)
                  : [
                      { letter: targetSymbol, confidence: isCameraActive ? 0 : 0 },
                      { letter: "-", confidence: 0 },
                      { letter: "-", confidence: 0 },
                      { letter: "-", confidence: 0 },
                      { letter: "-", confidence: 0 },
                    ]
                ).map((item, idx) => {
                  const itemLetter = String(item.letter || "-").toUpperCase();
                  const isTarget = Boolean(itemLetter && itemLetter !== "-" && itemLetter === targetSymbol);
                  const conf = Math.round(item.confidence || 0);

                  return (
                    <div
                      key={idx}
                      className={`top5-item ${isTarget ? "top5-target-match" : ""} ${idx === 0 && conf > 0 ? "top5-rank-leader" : ""}`}
                    >
                      <div className="top5-item-left">
                        <span className="top5-rank-badge">#{idx + 1}</span>
                        <span className="top5-char">{itemLetter}</span>
                        {isTarget && <span className="top5-target-pill">Target</span>}
                      </div>
                      <div className="top5-item-right">
                        <div className="top5-bar-bg">
                          <div
                            className={`top5-bar-fill ${isTarget ? "bar-target" : ""}`}
                            style={{ width: `${Math.min(100, Math.max(0, conf))}%` }}
                          ></div>
                        </div>
                        <span className="top5-conf-num">{conf}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </article>

          {/* Card 3: Your Progress Card */}
          <article className="practice-side-card progress-card">
            <div className="side-card-header">
              <h3>Your Progress</h3>
              <span className="progress-fraction-tag">
                {categoryProgress.count} / {categoryProgress.total}
              </span>
            </div>

            {/* Dots Progress Strip */}
            <div className="progress-dots-strip-wrap">
              <div className="progress-dots-row">
                {categoryItems.map((item, idx) => {
                  const isItemMastered = isLearned(categoryParam, item.id);
                  const isCurrent = idx === targetIndex;

                  return (
                    <span
                      key={item.id}
                      className={`progress-mini-dot ${isItemMastered ? "dot-mastered" : ""} ${isCurrent ? "dot-current" : ""}`}
                      title={`${item.title} ${isItemMastered ? "(Mastered)" : ""}`}
                    ></span>
                  );
                })}
              </div>
              <Link to="/progress" className="progress-forward-link" title="View Full Progress">
                ›
              </Link>
            </div>
          </article>
        </aside>
      </div>

      {/* ====================================================
          3. BOTTOM PRACTICE TIPS STRIP
          ==================================================== */}
      <footer className="practice-bottom-tips-bar" aria-label="Practice Tips">
        <div className="tips-column-item tip-header-col">
          <div className="tip-icon-circle tip-bulb-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
            </svg>
          </div>
          <div className="tip-text-block">
            <strong>Practice Tips</strong>
            <span>Keep these in mind for better results!</span>
          </div>
        </div>

        <div className="tips-column-item">
          <div className="tip-icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          </div>
          <div className="tip-text-block">
            <strong>Good Lighting</strong>
            <span>Be in a well-lit area</span>
          </div>
        </div>

        <div className="tips-column-item">
          <div className="tip-icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="tip-text-block">
            <strong>Clear Background</strong>
            <span>Avoid clutter</span>
          </div>
        </div>

        <div className="tips-column-item">
          <div className="tip-icon-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="tip-text-block">
            <strong>Keep Your Hand in Frame</strong>
            <span>Make sure it's visible</span>
          </div>
        </div>

        {/* Botanical leaf watermark */}
        <div className="tips-leaf-watermark" aria-hidden="true">
          <svg width="60" height="60" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 70 Q 35 35, 60 10" />
            <path d="M60 10 C 40 10, 40 30, 52 35 Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M42 42 C 60 38, 62 55, 50 60 Z" fill="currentColor" fillOpacity="0.15" />
          </svg>
        </div>
      </footer>
    </main>
  );
}

export default Practice;
