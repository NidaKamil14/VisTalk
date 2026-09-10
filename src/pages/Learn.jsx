import { useState } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { ALPHABETS_DATA, NUMBERS_DATA } from "../data/learningData";

function Learn() {
  const { isLearned, getCategoryProgress } = useProgress();
  const [expandedSection, setExpandedSection] = useState(null); // "alphabets" | "numbers" | null

  const alphabetProgress = getCategoryProgress("alphabets");
  const numbersProgress = getCategoryProgress("numbers");

  // Find next unlearned alphabet
  const nextAlphabet =
    ALPHABETS_DATA.find((item) => !isLearned("alphabets", item.id)) ||
    ALPHABETS_DATA[0];

  // Find next unlearned number
  const nextNumber =
    NUMBERS_DATA.find((item) => !isLearned("numbers", item.id)) ||
    NUMBERS_DATA[0];

  return (
    <main className="learn-journey-page">
      {/* ====================================================
          1. EDITORIAL HEADER & SIGN-LANGUAGE HEART
          ==================================================== */}
      <header className="learn-header-container">
        {/* Left: Editorial Titles & Copy */}
        <div className="learn-header-left">
          <div className="learn-eyebrow-track">
            <span className="learn-eyebrow-text">YOUR LEARNING JOURNEY</span>
          </div>

          <h1 className="learn-journey-title">
            Learn at Your Own Pace{" "}
            <span className="learn-title-heart" aria-hidden="true">♡</span>
          </h1>

          <p className="learn-journey-description">
            Explore Indian Sign Language (ISL) step by step. Choose a section below and start learning!
          </p>
        </div>

        {/* Right: Continuous One-Line Sign-Language Heart & Handwritten Notes */}
        <div className="learn-header-right" aria-hidden="true">
          <div className="heart-hands-backdrop-blob"></div>

          {/* Radiating Accent Rays */}
          <svg
            className="hands-radiating-rays"
            width="42"
            height="26"
            viewBox="0 0 42 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="21" y1="2" x2="21" y2="8" />
            <line x1="10" y1="6" x2="13" y2="12" />
            <line x1="32" y1="6" x2="29" y2="12" />
          </svg>

          {/* Handwritten Note (Left of Hands) */}
          <div className="hands-handwritten-note note-left">
            <span>New<br />Signs<br />Brighter<br />Conversations <span className="hand-heart-sym">♡</span></span>
          </div>

          {/* One-Line Continuous Sign-Language Heart SVG Illustration */}
          <div className="heart-hands-svg-frame">
            <svg
              className="heart-hands-svg"
              viewBox="0 0 260 160"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Continuous left hand contour */}
              <path
                className="heart-hand-path path-left"
                d="M42 136 C 54 116, 68 100, 94 90 C 110 84, 126 88, 130 102 C 124 70, 110 38, 94 34 C 85 31, 76 43, 86 64 C 96 82, 106 100, 112 114"
              />
              <path
                className="heart-hand-path path-left-fingers"
                d="M60 142 C 72 124, 88 114, 110 118 C 120 110, 124 96, 116 84 C 110 74, 102 78, 96 90"
              />
              <path
                className="heart-hand-path"
                d="M78 147 C 90 134, 108 130, 126 134"
              />
              <path
                className="heart-hand-path"
                d="M96 152 C 108 144, 120 142, 128 148"
              />

              {/* Continuous right hand contour */}
              <path
                className="heart-hand-path path-right"
                d="M218 136 C 206 116, 192 100, 166 90 C 150 84, 134 88, 130 102 C 136 70, 150 38, 166 34 C 175 31, 184 43, 174 64 C 164 82, 154 100, 148 114"
              />
              <path
                className="heart-hand-path path-right-fingers"
                d="M200 142 C 188 124, 172 114, 150 118 C 140 110, 136 96, 144 84 C 150 74, 158 78, 164 90"
              />
              <path
                className="heart-hand-path"
                d="M182 147 C 170 134, 152 130, 134 134"
              />
              <path
                className="heart-hand-path"
                d="M164 152 C 152 144, 140 142, 132 148"
              />

              {/* Central Heart Shape Gesture */}
              <path
                className="heart-hand-center-gesture"
                d="M130 70 C 122 50, 104 50, 104 68 C 104 86, 130 110, 130 110 C 130 110, 156 86, 156 68 C 156 50, 138 50, 130 70 Z"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Handwritten Note (Right of Hands) */}
          <div className="hands-handwritten-note note-right">
            <span>Different<br />Hands<br />Brighter<br />Futures <span className="hand-heart-sym">♡</span></span>
          </div>
        </div>
      </header>

      {/* ====================================================
          2. THE WINDING ROADMAP HERO SECTION
          ==================================================== */}
      <section className="learn-roadmap-hero-stage" aria-label="Learning Roadmap">
        <div className="roadmap-stage-inner">
          {/* Organic Winding SVG Roadmap Path Line */}
          <div className="roadmap-winding-path-svg-wrap" aria-hidden="true">
            <svg
              className="roadmap-ribbon-svg"
              viewBox="0 0 1140 260"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Soft ambient under-glow shadow */}
              <path
                className="roadmap-ribbon-glow"
                d="M 30 190 Q 140 210, 240 150 T 480 150 T 730 150 T 980 150 L 1100 180"
                strokeWidth="32"
                strokeLinecap="round"
              />
              {/* Outer soft path base ribbon */}
              <path
                className="roadmap-ribbon-base"
                d="M 30 190 Q 140 210, 240 150 T 480 150 T 730 150 T 980 150 L 1100 180"
                strokeWidth="22"
                strokeLinecap="round"
              />
              {/* Flowing animated inner dashed trail */}
              <path
                className="roadmap-ribbon-dashed"
                d="M 30 190 Q 140 210, 240 150 T 480 150 T 730 150 T 980 150 L 1100 180"
                strokeWidth="3.5"
                strokeDasharray="8 10"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Left Start Wooden Signpost (with gentle natural sway) */}
          <div className="roadmap-start-signpost">
            <div className="signpost-wood-plank sign-sway-left">
              <div className="plank-nail-head"></div>
              <span className="plank-sub">Start</span>
              <span className="plank-main">Your Journey</span>
              <span className="plank-arrow">→</span>
            </div>
            <div className="signpost-pole"></div>
            {/* Small base botanical sprout */}
            <svg className="signpost-sprout-svg sprout-sway-left" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22v-8" />
              <path d="M12 14c-4-4-8-2-8 4 4 0 6-2 8-4z" fill="currentColor" fillOpacity="0.25" />
              <path d="M12 14c4-4 8-2 8 4-4 0-6-2-8-4z" fill="currentColor" fillOpacity="0.25" />
            </svg>
          </div>

          {/* Milestones Flow Container */}
          <div className="roadmap-milestones-row">
            {/* ----------------------------------------------------
                MILESTONE 1: LEARN ALPHABETS (01)
                ---------------------------------------------------- */}
            <div className="milestone-column-item col-alphabets">
              <article className="milestone-roadmap-card card-alphabets">
                <div className="card-top-identity">
                  <div className="milestone-symbol-badge badge-alphabets">
                    <span>Aa</span>
                  </div>
                  <div className="milestone-header-text">
                    <Link
                      to={`/learn/alphabets/${nextAlphabet.id}`}
                      className="milestone-link-title"
                    >
                      <h3>Learn Alphabets</h3>
                      <span className="card-arrow-inline">→</span>
                    </Link>
                  </div>
                </div>

                <p className="milestone-description">
                  Master A–Z in ISL with clear visuals and examples.
                </p>

                {/* Subtle Wavy Watermark Behind */}
                <svg
                  className="milestone-card-watermark watermark-wave-shape"
                  viewBox="0 0 100 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M10 60 Q 30 15, 50 45 T 90 20" />
                </svg>

                {/* Progress Strip */}
                <div className="milestone-progress-row">
                  <span className="milestone-progress-label">
                    {alphabetProgress.count} / {alphabetProgress.total} Mastered
                  </span>
                </div>

                {/* Card Bottom Quick Actions */}
                <div className="milestone-card-actions">
                  <Link
                    to={`/learn/alphabets/${nextAlphabet.id}`}
                    className="milestone-action-btn btn-alphabets"
                  >
                    <span>{alphabetProgress.count === 0 ? "Start Lessons" : "Continue"}</span>
                    <span className="action-arrow">→</span>
                  </Link>
                  <button
                    type="button"
                    className="milestone-toggle-grid-btn"
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === "alphabets" ? null : "alphabets"
                      )
                    }
                  >
                    {expandedSection === "alphabets" ? "Hide A–Z ▴" : "View A–Z ›"}
                  </button>
                </div>

                {/* Expandable Alphabet Quick Grid */}
                {expandedSection === "alphabets" && (
                  <div className="milestone-expanded-drawer">
                    <div className="drawer-sub-header">
                      <span>Select any letter to learn:</span>
                    </div>
                    <div className="drawer-chips-grid">
                      {ALPHABETS_DATA.map((item) => {
                        const mastered = isLearned("alphabets", item.id);
                        return (
                          <Link
                            key={item.id}
                            to={`/learn/alphabets/${item.id}`}
                            className={`drawer-chip ${mastered ? "mastered" : ""}`}
                            title={`${item.title} - ${mastered ? "Mastered" : "Learn"}`}
                          >
                            <span className="chip-char">{item.symbol}</span>
                            {mastered && <span className="chip-tick">✓</span>}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>

              {/* Numbered Milestone Circle 1 (Anchored on the path) */}
              <div className="roadmap-path-node-anchor">
                <div className="milestone-node-circle circle-alphabets">
                  <span>1</span>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                MILESTONE 2: LEARN NUMBERS (02)
                ---------------------------------------------------- */}
            <div className="milestone-column-item col-numbers">
              <article className="milestone-roadmap-card card-numbers">
                <div className="card-top-identity">
                  <div className="milestone-symbol-badge badge-numbers">
                    <span>123</span>
                  </div>
                  <div className="milestone-header-text">
                    <Link
                      to={`/learn/numbers/${nextNumber.id}`}
                      className="milestone-link-title"
                    >
                      <h3>Learn Numbers</h3>
                      <span className="card-arrow-inline">→</span>
                    </Link>
                  </div>
                </div>

                <p className="milestone-description">
                  Explore numbers with easy-to-follow signs.
                </p>

                {/* Subtle Flower Watermark Behind */}
                <svg
                  className="milestone-card-watermark watermark-flower-shape"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M50 20 C50 35, 35 50, 20 50 C35 50, 50 65, 50 80 C50 65, 65 50, 80 50 C65 50, 50 35, 50 20 Z" />
                </svg>

                {/* Progress Strip */}
                <div className="milestone-progress-row">
                  <span className="milestone-progress-label">
                    {numbersProgress.count} / {numbersProgress.total} Mastered
                  </span>
                </div>

                {/* Card Bottom Quick Actions */}
                <div className="milestone-card-actions">
                  <Link
                    to={`/learn/numbers/${nextNumber.id}`}
                    className="milestone-action-btn btn-numbers"
                  >
                    <span>{numbersProgress.count === 0 ? "Start Numbers" : "Continue"}</span>
                    <span className="action-arrow">→</span>
                  </Link>
                  <button
                    type="button"
                    className="milestone-toggle-grid-btn"
                    onClick={() =>
                      setExpandedSection(
                        expandedSection === "numbers" ? null : "numbers"
                      )
                    }
                  >
                    {expandedSection === "numbers" ? "Hide 0–9 ▴" : "View 0–9 ›"}
                  </button>
                </div>

                {/* Expandable Numbers Quick Grid */}
                {expandedSection === "numbers" && (
                  <div className="milestone-expanded-drawer">
                    <div className="drawer-sub-header">
                      <span>Select any digit to learn:</span>
                    </div>
                    <div className="drawer-chips-grid numbers-grid">
                      {NUMBERS_DATA.map((item) => {
                        const mastered = isLearned("numbers", item.id);
                        return (
                          <Link
                            key={item.id}
                            to={`/learn/numbers/${item.id}`}
                            className={`drawer-chip ${mastered ? "mastered" : ""}`}
                            title={`${item.title} - ${mastered ? "Mastered" : "Learn"}`}
                          >
                            <span className="chip-char">{item.symbol}</span>
                            {mastered && <span className="chip-tick">✓</span>}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>

              {/* Numbered Milestone Circle 2 (Anchored on the path) */}
              <div className="roadmap-path-node-anchor">
                <div className="milestone-node-circle circle-numbers">
                  <span>2</span>
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                MILESTONE 3: MORE TO COME (03 - EXACT SCOPE)
                ---------------------------------------------------- */}
            <div className="milestone-column-item col-coming-soon">
              <article className="milestone-roadmap-card card-coming-soon">
                <div className="card-top-identity">
                  <div className="milestone-symbol-badge badge-coming-soon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="milestone-header-text">
                    <h3>More to Come</h3>
                  </div>
                </div>

                <p className="milestone-description">
                  Stay tuned for more learning content!
                </p>

                {/* Subtle Leaf Branch Watermark Behind */}
                <svg
                  className="milestone-card-watermark watermark-leaf-shape"
                  viewBox="0 0 80 80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M20 70 Q 40 40, 65 15" />
                  <path d="M65 15 C 45 15, 45 35, 60 40 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M48 45 C 68 40, 72 60, 56 64 Z" fill="currentColor" fillOpacity="0.2" />
                </svg>

                {/* Coming Soon Pill Button */}
                <div className="coming-soon-btn-wrap">
                  <span className="coming-soon-soft-pill">Coming Soon</span>
                </div>
              </article>

              {/* Numbered Milestone Circle 3 (Anchored on the path) */}
              <div className="roadmap-path-node-anchor">
                <div className="milestone-node-circle circle-coming-soon">
                  <span>3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Finish Wooden Signpost (with gentle natural sway) */}
          <div className="roadmap-finish-hill" aria-hidden="true">
            <div className="finish-signpost-plank sign-sway-right">
              <div className="plank-nail-head"></div>
              <span className="finish-plank-text">A More<br />Inclusive<br />World <span className="finish-heart-sym">♥</span></span>
            </div>
            <div className="finish-signpost-pole"></div>
            {/* Small base botanical sprout */}
            <svg className="finish-sprout-svg sprout-sway-right" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22v-8" />
              <path d="M12 14c-4-4-8-2-8 4 4 0 6-2 8-4z" fill="currentColor" fillOpacity="0.25" />
              <path d="M12 14c4-4 8-2 8 4-4 0-6-2-8-4z" fill="currentColor" fillOpacity="0.25" />
            </svg>
          </div>
        </div>
      </section>

      {/* ====================================================
          3. BOTTOM INSPIRATIONAL BANNER (REFINED & CLEAN)
          ==================================================== */}
      <section className="learn-bottom-banner" aria-label="Inspirational Note">
        <div className="banner-inner-card">
          {/* Subtle Integrated Botanical Motif Watermark */}
          <svg
            className="banner-integrated-watermark"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M20 100 Q 60 60, 90 20" />
            <path d="M90 20 C 65 20, 65 45, 82 50 Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M68 55 C 90 50, 95 72, 78 78 Z" fill="currentColor" fillOpacity="0.15" />
          </svg>

          {/* Left: Headline Quote */}
          <div className="banner-quote-col">
            <p className="banner-quote-text">
              Every sign you learn builds a kinder, more connected world.{" "}
              <span className="banner-heart-accent">♡</span>
            </p>
          </div>

          <div className="banner-vertical-divider" aria-hidden="true"></div>

          {/* Middle: 3 Micro Value Pillars */}
          <div className="banner-pillars-cluster">
            <div className="banner-pillar-item">
              <div className="pillar-icon-box">
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
              <div className="pillar-text">
                <strong>Learn</strong>
                <span>at your own pace</span>
              </div>
            </div>

            <div className="banner-pillar-item">
              <div className="pillar-icon-box">
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
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="pillar-text">
                <strong>Build</strong>
                <span>real skills</span>
              </div>
            </div>

            <div className="banner-pillar-item">
              <div className="pillar-icon-box">
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
              <div className="pillar-text">
                <strong>Be part of</strong>
                <span>a more inclusive community</span>
              </div>
            </div>
          </div>

          <div className="banner-vertical-divider" aria-hidden="true"></div>

          {/* Right: Handwritten Accent */}
          <div className="banner-handwritten-col">
            <span className="banner-hand-script">
              More<br />Kindness<br />More<br />Inclusion <span className="banner-script-heart">♡</span>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Learn;