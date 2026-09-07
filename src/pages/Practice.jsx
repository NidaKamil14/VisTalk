import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import useSignRecognition from "../hooks/useSignRecognition";
import {
  CATEGORIES,
  getItemsByCategory,
  getItem,
  ALPHABETS_DATA,
} from "../data/learningData";

function Practice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "alphabets";
  const initialSign = searchParams.get("sign") || "A";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSignId, setSelectedSignId] = useState(initialSign);

  const { isLearned, toggleLearned } = useProgress();
  const {
    videoRef,
    isCameraActive,
    isMirrored,
    setIsMirrored,
    cameraError,
    toggleCamera,
  } = useSignRecognition();

  // Retrieve current category items and selected sign
  const currentCategoryItems = useMemo(() => {
    return getItemsByCategory(selectedCategory);
  }, [selectedCategory]);

  const currentItem = useMemo(() => {
    const found = getItem(selectedCategory, selectedSignId);
    return found || currentCategoryItems[0] || ALPHABETS_DATA[0];
  }, [selectedCategory, selectedSignId, currentCategoryItems]);

  const currentIndex = useMemo(() => {
    return currentCategoryItems.findIndex(
      (item) => String(item.id).toLowerCase() === String(currentItem.id).toLowerCase()
    );
  }, [currentCategoryItems, currentItem]);

  const isCurrentLearned = isLearned(selectedCategory, currentItem.id);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const items = getItemsByCategory(catId);
    if (items.length > 0) {
      setSelectedSignId(items[0].id);
      setSearchParams({ category: catId, sign: items[0].id });
    }
  };

  const handleSignSelect = (e) => {
    const newId = e.target.value;
    setSelectedSignId(newId);
    setSearchParams({ category: selectedCategory, sign: newId });
  };

  const handleNextSign = () => {
    const nextIdx = (currentIndex + 1) % currentCategoryItems.length;
    const nextItem = currentCategoryItems[nextIdx];
    setSelectedSignId(nextItem.id);
    setSearchParams({ category: selectedCategory, sign: nextItem.id });
  };

  const handlePrevSign = () => {
    const prevIdx =
      currentIndex === 0 ? currentCategoryItems.length - 1 : currentIndex - 1;
    const prevItem = currentCategoryItems[prevIdx];
    setSelectedSignId(prevItem.id);
    setSearchParams({ category: selectedCategory, sign: prevItem.id });
  };

  return (
    <main className="practice-activity-page">
      <header className="practice-activity-header">
        <span className="section-eyebrow">PRACTICE STUDIO</span>
        <h1>Mirror & Practice</h1>
        <p>Align your hand position with the reference sign using your webcam mirror.</p>

        {/* Minimal Category & Sign Selector Toolbar */}
        <div className="practice-toolbar">
          <div className="practice-cat-selector">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`toolbar-cat-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.title}
              </button>
            ))}
          </div>

          <div className="practice-sign-stepper">
            <button
              type="button"
              className="stepper-btn"
              onClick={handlePrevSign}
              title="Previous sign"
            >
              ←
            </button>

            <select
              value={currentItem.id}
              onChange={handleSignSelect}
              className="practice-sign-dropdown"
              aria-label="Select sign to practice"
            >
              {currentCategoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} {isLearned(selectedCategory, item.id) ? "✓" : ""}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="stepper-btn"
              onClick={handleNextSign}
              title="Next sign"
            >
              →
            </button>
          </div>
        </div>
      </header>

      {/* Main Activity Canvas: Reference <-> Camera */}
      <div className="practice-canvas-grid">
        {/* Left: Sign Reference Card */}
        <div className="practice-reference-frame">
          <div className="frame-top-tag">
            <span>REFERENCE SIGN</span>
            {isCurrentLearned && <span className="frame-mastered-tag">✓ Mastered</span>}
          </div>

          <div className="frame-symbol-box">
            <span className="frame-symbol">{currentItem.symbol}</span>
          </div>

          <div className="frame-body">
            <h2>{currentItem.title}</h2>
            <p className="frame-instruction">{currentItem.postureGuidance}</p>
            {currentItem.practiceTip && (
              <p className="frame-tip">💡 {currentItem.practiceTip}</p>
            )}
          </div>

          <div className="frame-actions">
            <button
              type="button"
              className={`primary-learn-btn ${isCurrentLearned ? "is-learned" : ""}`}
              onClick={() => toggleLearned(selectedCategory, currentItem.id)}
            >
              {isCurrentLearned ? "✓ Mastered (Click to Undo)" : "Mark as Mastered"}
            </button>

            <Link
              to={
                selectedCategory === "alphabets"
                  ? `/learn/alphabets/${currentItem.id}`
                  : `/learn/${selectedCategory}/${currentItem.id}`
              }
              className="frame-lesson-link"
            >
              View Lesson Details →
            </Link>
          </div>
        </div>

        {/* Right: Live Camera Mirror */}
        <div className="practice-camera-frame">
          <div className="camera-frame-top">
            <div className="camera-live-pill">
              <span className={`live-dot ${isCameraActive ? "on" : ""}`}></span>
              <span>{isCameraActive ? "Camera Live" : "Camera Idle"}</span>
            </div>

            {isCameraActive && (
              <button
                type="button"
                className="camera-tool-btn"
                onClick={() => setIsMirrored(!isMirrored)}
              >
                {isMirrored ? "↔ Mirror On" : "↔ Normal"}
              </button>
            )}
          </div>

          <div className="camera-lens-surface">
            {cameraError ? (
              <div className="camera-error-message">
                <span>⚠️</span>
                <p>{cameraError}</p>
                <button type="button" className="hero-button" onClick={toggleCamera}>
                  Retry Camera
                </button>
              </div>
            ) : isCameraActive ? (
              <div className="video-display-box">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`camera-stream ${isMirrored ? "mirrored" : ""}`}
                />
                <div className="camera-silhouette-guide">
                  <span>Hand Position</span>
                </div>
              </div>
            ) : (
              <div className="camera-start-screen">
                <span className="camera-start-icon">📹</span>
                <h3>Practice Mirror</h3>
                <p>Start your camera to verify your hand placement in real-time.</p>
                <button type="button" className="hero-button" onClick={toggleCamera}>
                  Start Camera Mirror
                </button>
              </div>
            )}
          </div>

          {isCameraActive && (
            <div className="camera-frame-controls">
              <button
                type="button"
                className="camera-stop-btn"
                onClick={toggleCamera}
              >
                Turn Off Camera
              </button>
            </div>
          )}

          <div className="phase2-mini-note">
            <span>⚡ Camera mirror active • MediaPipe AI pipeline ready for Phase 2</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Practice;
