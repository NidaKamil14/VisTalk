import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="home-editorial-container">
      {/* ====================================================
          1. HERO SECTION (SPLIT STYLE)
          ==================================================== */}
      <section className="home-hero-split-section" aria-label="Hero Introduction">
        {/* LEFT COLUMN: Editorial Typography, Copy & CTAs */}
        <div className="hero-left-editorial">
          {/* Eyebrow / Label */}
          <div className="hero-eyebrow-track">
            <span className="eyebrow-text">LEARN • PRACTICE • CONNECT</span>
          </div>

          {/* Large Serif Display Headline */}
          <h1 className="hero-editorial-heading">
            A More<br />
            <span className="heading-inclusive-line">
              <span className="heading-word">Inclusive</span>
              <svg
                className="heading-warm-rays"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M12 2v3" />
                <path d="M19 5l-2.2 2.2" />
                <path d="M22 12h-3" />
                <path d="M19 19l-2.2-2.2" />
              </svg>
            </span><br />
            Tomorrow
          </h1>

          {/* Supporting Description */}
          <p className="hero-lead-description">
            VisTalk helps you learn and practice Indian Sign Language (ISL) through an interactive and engaging experience.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="hero-action-buttons">
            <Link to="/learn" className="hero-btn-primary">
              <span>Start Learning</span>
              <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>

            <Link to="/practice" className="hero-btn-secondary">
              <svg
                className="btn-camera-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <span>Try Practice</span>
            </Link>
          </div>

          {/* Community Social Proof Element */}
          <div className="hero-community-proof">
            <div className="community-avatar-stack">
              <img
                src="/avatar_1.jpg"
                alt="VisTalk Learner"
                className="comm-avatar avatar-1"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <img
                src="/avatar_2.jpg"
                alt="VisTalk Learner"
                className="comm-avatar avatar-2"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="comm-avatar avatar-fallback">
                <span>+</span>
              </div>
            </div>
            <p className="community-text">
              Join a growing community making communication kinder.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Hand / Sign Visual & Minimal Organic Floating Cards */}
        <div className="hero-right-visual" aria-hidden="true">
          <div className="hero-organic-stage">
            {/* Soft Organic Curved Background Blob */}
            <div className="organic-backdrop-shape"></div>

            {/* Subtle Gold Curved Accent Arc at Bottom-Left */}
            <svg
              className="organic-gold-arc"
              viewBox="0 0 120 120"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            >
              <path d="M10 70 A 55 55 0 0 0 75 115" />
            </svg>

            {/* Main Authentic ISL Hand Photograph */}
            <div className="main-hand-photo-frame">
              <img
                src="/hero_hand_sign.jpg"
                alt="Indian Sign Language I Love You Hand Gesture"
                className="hero-hand-image"
                onError={(e) => {
                  // Fallback to letter A if needed
                  e.target.src = "/reference_signs/A.jpg";
                }}
              />
            </div>

            {/* Floating Card 1 (Left): Learn Real Skills Real Impact */}
            <div className="hero-floating-badge badge-learn">
              <div className="badge-icon-box">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="badge-text-content">
                <strong>Learn</strong>
                <span>Real Skills</span>
                <span className="badge-highlight">Real Impact</span>
              </div>
            </div>

            {/* Floating Card 2 (Right): Small Steps Big Change */}
            <div className="hero-floating-badge badge-change">
              <div className="badge-icon-box">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12A10 10 0 0 1 12 2z" />
                  <path d="M12 7v10" />
                  <path d="M8 11l4-4 4 4" />
                </svg>
              </div>
              <div className="badge-text-content">
                <strong>Small</strong>
                <span>Steps</span>
                <span className="badge-highlight">Big Change</span>
              </div>
            </div>

            {/* Speech Bubble Tag (Top Right): Signs Speak too ♥ */}
            <div className="hero-speech-bubble">
              <span className="bubble-text">Signs<br />Speak<br />too <span className="bubble-heart">♥</span></span>
              <div className="bubble-tail"></div>
            </div>

            {/* Handwritten Annotation (Top Left): Different Hands Brighter Futures ♥ */}
            <div className="hero-handwritten-title">
              <span>Different<br />Hands<br />Brighter<br />Futures <span className="title-heart">♥</span></span>
            </div>

            {/* Delicate Accent Marks */}
            <svg
              className="accent-sparkle-top"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="12" y1="2" x2="12" y2="7" />
              <line x1="19" y1="5" x2="16" y2="8" />
              <line x1="5" y1="5" x2="8" y2="8" />
            </svg>

            <svg
              className="accent-curved-lines"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 15c4-4 8-4 12 0" />
              <path d="M6 19c3-3 6-3 9 0" />
            </svg>
          </div>
        </div>
      </section>

      {/* ====================================================
          2. THREE CORE FEATURES ("WHAT YOU CAN DO")
          ==================================================== */}
      <section className="home-features-section" aria-label="Core Features">
        <div className="features-section-header">
          <h2 className="features-main-title">What You Can Do</h2>
          <p className="features-sub-title">
            Simple tools. Real learning. A more inclusive you.
          </p>
        </div>

        <div className="features-three-grid">
          {/* Card 1: Learn */}
          <Link to="/learn" className="feature-card-item card-learn">
            <div className="feature-icon-wrapper icon-sage">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="9" y1="6" x2="15" y2="6" />
                <line x1="9" y1="10" x2="15" y2="10" />
              </svg>
            </div>

            <div className="feature-text-block">
              <h3>Learn</h3>
              <p>Explore ISL alphabets, words and phrases with clear visuals and examples.</p>
            </div>

            <div className="feature-arrow-btn arrow-sage" aria-hidden="true">
              <span>→</span>
            </div>

            {/* Organic Wavy Watermark Graphic */}
            <svg
              className="card-watermark-shape watermark-wave"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 80 Q 35 20, 50 60 T 85 30" />
            </svg>
          </Link>

          {/* Card 2: Practice */}
          <Link to="/practice" className="feature-card-item card-practice">
            <div className="feature-icon-wrapper icon-yellow">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>

            <div className="feature-text-block">
              <h3>Practice</h3>
              <p>Use your camera to practice signs and get real-time feedback.</p>
            </div>

            <div className="feature-arrow-btn arrow-yellow" aria-hidden="true">
              <span>→</span>
            </div>

            {/* Organic 4-Petal Flower Watermark Graphic */}
            <svg
              className="card-watermark-shape watermark-flower"
              viewBox="0 0 100 100"
              fill="currentColor"
            >
              <path d="M50 20 C50 35, 35 50, 20 50 C35 50, 50 65, 50 80 C50 65, 65 50, 80 50 C65 50, 50 35, 50 20 Z" />
            </svg>
          </Link>

          {/* Card 3: Track Progress */}
          <Link to="/progress" className="feature-card-item card-progress">
            <div className="feature-icon-wrapper icon-teal">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>

            <div className="feature-text-block">
              <h3>Track Progress</h3>
              <p>See how far you've come and stay motivated on your learning journey.</p>
            </div>

            <div className="feature-arrow-btn arrow-teal" aria-hidden="true">
              <span>→</span>
            </div>

            {/* Organic Rising Arrow Watermark Graphic */}
            <svg
              className="card-watermark-shape watermark-arrow"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 75 Q 40 70, 60 50 T 80 25" />
              <polyline points="65 25 80 25 80 40" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ====================================================
          3. BOTTOM BOTANICAL WAVE BANNER
          ==================================================== */}
      <section className="home-botanical-banner" aria-label="Inspirational Message">
        {/* Organic Background Landscape Waves */}
        <div className="botanical-wave-layer" aria-hidden="true">
          <svg
            className="wave-svg-backdrop"
            viewBox="0 0 1440 220"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              className="wave-path-back"
              d="M0 120 C 320 60, 680 180, 1080 100 C 1240 70, 1380 90, 1440 105 L 1440 220 L 0 220 Z"
            />
            <path
              className="wave-path-front"
              d="M0 150 C 260 100, 580 200, 940 130 C 1140 90, 1320 140, 1440 135 L 1440 220 L 0 220 Z"
            />
          </svg>
        </div>

        <div className="botanical-banner-content">
          {/* Left: Communication has no boundaries */}
          <div className="banner-left-message">
            <h3 className="banner-headline">
              Communication<br />
              has no boundaries.
            </h3>
            <div className="banner-gold-underline" aria-hidden="true"></div>
          </div>

          {/* Center: Let's build a world where everyone feels heard. ♥ */}
          <div className="banner-center-message">
            <p>
              Let's build a world where everyone feels heard.{" "}
              <span className="banner-heart-gold">♥</span>
            </p>
          </div>

          {/* Right: Botanical Leaf Element (Gentle Swaying Animation) + Handwritten Note */}
          <div className="banner-right-botanical">
            <div className="botanical-branch-wrap">
              <svg
                className="botanical-leaf-svg"
                viewBox="0 0 120 160"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Main curved stem */}
                <path d="M40 155 Q 65 100, 85 20" />
                {/* Leaf 1 (Top Left) */}
                <path d="M85 20 C 60 15, 60 40, 78 45 C 82 45, 84 35, 85 20 Z" fill="currentColor" fillOpacity="0.12" />
                {/* Leaf 2 (Right) */}
                <path d="M78 55 C 105 45, 110 70, 90 75 C 82 77, 80 65, 78 55 Z" fill="currentColor" fillOpacity="0.12" />
                {/* Leaf 3 (Left) */}
                <path d="M68 85 C 40 75, 38 100, 58 105 C 65 107, 67 95, 68 85 Z" fill="currentColor" fillOpacity="0.12" />
                {/* Leaf 4 (Right) */}
                <path d="M58 115 C 85 105, 90 130, 70 135 C 62 137, 60 125, 58 115 Z" fill="currentColor" fillOpacity="0.12" />
              </svg>
            </div>

            <div className="banner-handwritten-note">
              <span>More<br />Kindness<br />More<br />Inclusion <span className="hand-heart">♡</span></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;