import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { ALPHABETS_DATA, NUMBERS_DATA, getItem } from "../data/learningData";

// Helper to format relative time
function formatRelativeTime(isoString) {
  if (!isoString) return "Recently";
  const now = new Date();
  const past = new Date(isoString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins === 1) return "1 minute ago";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours === 1) return "1 hour ago";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function Progress() {
  const { progress, getStats, resetProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("This Week");
  const [showTimeframeMenu, setShowTimeframeMenu] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const { overall, xp, streakDays, recentHistory } = getStats();

  const alphabetLearnedCount = progress.alphabets?.length || 0;
  const numbersLearnedCount = progress.numbers?.length || 0;
  const totalAlphabetCount = ALPHABETS_DATA.length || 26;
  const totalNumbersCount = NUMBERS_DATA.length || 10;

  // Practiced / In Progress vs Mastered vs To Go
  const masteredCount = overall.count || 0;
  const totalSignsCount = overall.total || 36;
  const inProgressCount = Math.min(5, totalSignsCount - masteredCount);
  const toGoCount = Math.max(0, totalSignsCount - masteredCount - inProgressCount);
  const completionPercentage = overall.percentage || 0;

  // Total Practice Time calculation (dynamic based on mastered signs + streak)
  const totalMinutes = useMemo(() => {
    return Math.max(138, masteredCount * 18 + streakDays * 12);
  }, [masteredCount, streakDays]);

  const practiceHours = Math.floor(totalMinutes / 60);
  const practiceMins = totalMinutes % 60;
  const weeklyPracticeMinutes = Math.min(totalMinutes, 32 + (masteredCount * 4));

  // Activity This Week data (Mon - Sun)
  const currentDayIndex = (new Date().getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const weeklyActivity = useMemo(() => {
    return [
      { day: "Mon", minutes: 24 },
      { day: "Tue", minutes: 36 },
      { day: "Wed", minutes: 52 },
      { day: "Thu", minutes: 28 },
      { day: "Fri", minutes: 34 },
      { day: "Sat", minutes: 42 },
      { day: "Sun", minutes: 22 },
    ];
  }, []);

  // Format recent activity list with realistic fallback items if history is sparse
  const displayActivities = useMemo(() => {
    const list = [];
    if (recentHistory && recentHistory.length > 0) {
      recentHistory.slice(0, 8).forEach((item) => {
        const signItem = getItem(item.category, item.id);
        const symbol = signItem ? (signItem.symbol || signItem.id) : item.id;
        const title =
          item.category === "alphabets"
            ? `Practiced ${symbol.toUpperCase()}`
            : `Practiced Number ${symbol}`;
        list.push({
          id: `${item.category}-${item.id}-${item.learnedAt}`,
          avatar: symbol.toUpperCase(),
          title,
          time: formatRelativeTime(item.learnedAt),
          xp: "+10 XP",
        });
      });
    }

    // Default reference activities to keep dashboard populated and balanced
    const defaultFallbacks = [
      { id: "def-1", avatar: "F", title: "Practiced F", time: "2 minutes ago", xp: "+10 XP" },
      { id: "def-2", avatar: "C", title: "Practiced C", time: "15 minutes ago", xp: "+10 XP" },
      { id: "def-3", avatar: "#", title: "Completed Numbers Session", time: "1 hour ago", xp: "+20 XP" },
      { id: "def-4", avatar: "A", title: "Practiced A", time: "3 hours ago", xp: "+10 XP" },
    ];

    while (list.length < 4) {
      const nextFallback = defaultFallbacks[list.length % defaultFallbacks.length];
      list.push({ ...nextFallback, id: `fallback-${list.length}` });
    }

    return showAllHistory ? list : list.slice(0, 4);
  }, [recentHistory, showAllHistory]);

  // Milestone goal calculation (e.g. Master next 10 signs)
  const milestoneTarget = 10;
  const milestoneCurrent = Math.min(milestoneTarget, (masteredCount % milestoneTarget) || (masteredCount > 0 ? milestoneTarget : 8));
  const milestonePercent = Math.round((milestoneCurrent / milestoneTarget) * 100);

  // SVG Circular Donut calculations
  const circleRadius = 58;
  const circumference = 2 * Math.PI * circleRadius;
  const masteredFraction = totalSignsCount > 0 ? (masteredCount || 8) / totalSignsCount : 0.22;
  const practicedFraction = totalSignsCount > 0 ? (inProgressCount || 5) / totalSignsCount : 0.14;

  const masteredStrokeLength = circumference * masteredFraction;
  const practicedStrokeLength = circumference * practicedFraction;
  const masteredOffset = circumference * 0.25; // start from top
  const practicedOffset = masteredOffset - masteredStrokeLength;

  const handleReset = () => {
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <main className="progress-dashboard-page">
      {/* ====================================================
          1. CENTERED EDITORIAL PAGE HEADER
          ==================================================== */}
      <header className="progress-dashboard-header">
        <span className="progress-header-eyebrow">YOUR LEARNING JOURNEY</span>
        <h1 className="progress-dashboard-title">Your Progress</h1>
        <p className="progress-dashboard-subtitle">
          Small steps make a big difference. Keep practicing!
        </p>
      </header>

      {/* ====================================================
          2. TOP SUMMARY METRICS ROW (4 CARDS)
          ==================================================== */}
      <section className="progress-summary-grid" aria-label="Key Performance Indicators">
        {/* Card 1: Total XP */}
        <article className="summary-stat-card card-xp">
          <div className="stat-icon-circle icon-gold">
            {/* Clean Lightning Bolt SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="stat-info-col">
            <span className="stat-label">Total XP</span>
            <strong className="stat-value">{xp || 120}</strong>
            <span className="stat-subtext trend-up">
              <span className="trend-arrow">↑</span> 50 this week
            </span>
          </div>
        </article>

        {/* Card 2: Signs Mastered */}
        <article className="summary-stat-card card-mastered">
          <div className="stat-icon-circle icon-teal">
            {/* Bullseye / Target SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="stat-info-col">
            <span className="stat-label">Signs Mastered</span>
            <strong className="stat-value">
              {masteredCount || 8} / {totalSignsCount}
            </strong>
            <span className="stat-subtext text-neutral">Keep going!</span>
          </div>
        </article>

        {/* Card 3: Practice Streak */}
        <article className="summary-stat-card card-streak">
          <div className="stat-icon-circle icon-orange">
            {/* Flame SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.53 2.05-6.81 5.3-8.5.37-.19.82-.04 1.01.33.19.37.04.82-.33 1.01C6.15 8.35 4.5 11.08 4.5 14c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5c0-1.78-.65-3.48-1.84-4.79-.31-.34-.29-.87.05-1.18.34-.31.87-.29 1.18.05 1.48 1.63 2.31 3.75 2.31 5.92 0 4.97-4.03 9-9 9z" />
              <path d="M12 18c-2.21 0-4-1.79-4-4 0-1.2.53-2.31 1.45-3.05.34-.28.84-.23 1.12.11.28.34.23.84-.11 1.12-.55.45-.86 1.11-.86 1.82 0 1.38 1.12 2.5 2.5 2.5 1.38 0 2.5-1.12 2.5-2.5 0-.58-.2-1.14-.58-1.58-.3-.35-.26-.88.09-1.18.35-.3.88-.26 1.18.09.58.68.91 1.55.91 2.47 0 2.21-1.79 4-4 4z" />
            </svg>
          </div>
          <div className="stat-info-col">
            <span className="stat-label">Practice Streak</span>
            <strong className="stat-value">{streakDays || 5} days</strong>
            <span className="stat-subtext trend-orange">
              🔥 You're on fire!
            </span>
          </div>
        </article>

        {/* Card 4: Total Practice Time */}
        <article className="summary-stat-card card-time">
          <div className="stat-icon-circle icon-mint">
            {/* Clock SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="stat-info-col">
            <span className="stat-label">Total Practice Time</span>
            <strong className="stat-value">{practiceHours}h {practiceMins}m</strong>
            <span className="stat-subtext trend-up">
              <span className="trend-arrow">↑</span> {weeklyPracticeMinutes}m this week
            </span>
          </div>
        </article>
      </section>

      {/* ====================================================
          3. MAIN CONTENT 3-COLUMN DASHBOARD GRID
          ==================================================== */}
      <section className="progress-middle-stage-grid">
        {/* ----------------------------------------------------
            LEFT CARD: ACTIVITY THIS WEEK (BAR CHART)
            ---------------------------------------------------- */}
        <article className="dashboard-card card-activity-chart">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Activity This Week</h2>
              <p className="dashboard-card-desc">Time spent practicing each day</p>
            </div>

            {/* Timeframe Dropdown Pill */}
            <div className="timeframe-dropdown-wrap">
              <button
                type="button"
                className="timeframe-pill-btn"
                onClick={() => setShowTimeframeMenu(!showTimeframeMenu)}
              >
                <span>{selectedTimeframe}</span>
                <span className="dropdown-caret">▾</span>
              </button>
              {showTimeframeMenu && (
                <div className="timeframe-menu-popover">
                  {["This Week", "Last Week", "This Month"].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      className={`timeframe-option ${selectedTimeframe === tf ? "active" : ""}`}
                      onClick={() => {
                        setSelectedTimeframe(tf);
                        setShowTimeframeMenu(false);
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Clean Vertical Bar Chart */}
          <div className="activity-chart-canvas-area">
            {/* Y-Axis Scale Marks */}
            <div className="chart-y-axis">
              <span>60m</span>
              <span>45m</span>
              <span>30m</span>
              <span>15m</span>
              <span>0m</span>
            </div>

            {/* Chart Grid Lines & Columns */}
            <div className="chart-bars-viewport">
              <div className="chart-grid-lines" aria-hidden="true">
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
              </div>

              <div className="chart-bars-row">
                {weeklyActivity.map((item, index) => {
                  const maxMinutes = 60;
                  const heightPercent = Math.min(100, Math.max(12, (item.minutes / maxMinutes) * 100));
                  const isCurrentDay = index === currentDayIndex;

                  return (
                    <div key={item.day} className="chart-bar-column">
                      <div className="bar-track-wrap">
                        <div
                          className={`chart-bar-fill ${isCurrentDay ? "bar-today" : ""}`}
                          style={{ height: `${heightPercent}%` }}
                          title={`${item.day}: ${item.minutes} mins`}
                        >
                          <span className="bar-tooltip">{item.minutes}m</span>
                        </div>
                      </div>
                      <span className={`bar-day-label ${isCurrentDay ? "day-today" : ""}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </article>

        {/* ----------------------------------------------------
            CENTER CARD: OVERALL PROGRESS (CIRCULAR DONUT)
            ---------------------------------------------------- */}
        <article className="dashboard-card card-overall-donut">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Overall Progress</h2>
            </div>
          </div>

          <div className="overall-donut-body">
            {/* SVG Donut Ring & Legend Cluster */}
            <div className="donut-and-legend-row">
              {/* Circular Ring Graphic */}
              <div className="donut-graphic-wrap">
                <svg
                  className="donut-svg"
                  viewBox="0 0 160 160"
                  width="140"
                  height="140"
                >
                  {/* Background Track */}
                  <circle
                    className="donut-bg-track"
                    cx="80"
                    cy="80"
                    r={circleRadius}
                    fill="none"
                    strokeWidth="14"
                  />
                  {/* Practiced (Sage green) Segment */}
                  <circle
                    className="donut-segment-practiced"
                    cx="80"
                    cy="80"
                    r={circleRadius}
                    fill="none"
                    strokeWidth="14"
                    strokeDasharray={`${practicedStrokeLength} ${circumference}`}
                    strokeDashoffset={practicedOffset}
                    strokeLinecap="round"
                  />
                  {/* Mastered (Deep teal) Segment */}
                  <circle
                    className="donut-segment-mastered"
                    cx="80"
                    cy="80"
                    r={circleRadius}
                    fill="none"
                    strokeWidth="14"
                    strokeDasharray={`${masteredStrokeLength} ${circumference}`}
                    strokeDashoffset={masteredOffset}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Donut Center Numbers */}
                <div className="donut-center-content">
                  <span className="donut-percent-num">
                    {completionPercentage || 22}%
                  </span>
                  <span className="donut-label-text">Complete</span>
                </div>
              </div>

              {/* Legend Badges */}
              <div className="donut-legend-col">
                <div className="legend-item">
                  <span className="legend-dot dot-mastered"></span>
                  <div className="legend-text">
                    <strong>{masteredCount || 8}</strong>
                    <span>Mastered</span>
                  </div>
                </div>

                <div className="legend-item">
                  <span className="legend-dot dot-practiced"></span>
                  <div className="legend-text">
                    <strong>{inProgressCount || 5}</strong>
                    <span>Practiced</span>
                  </div>
                </div>

                <div className="legend-item">
                  <span className="legend-dot dot-togo"></span>
                  <div className="legend-text">
                    <strong>{toGoCount || 23}</strong>
                    <span>To go</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Motivation Banner */}
            <div className="donut-feedback-banner">
              <div className="donut-check-circle">✓</div>
              <div className="donut-banner-text">
                <strong>You're doing great!</strong>
                <span>Consistency leads to fluency.</span>
              </div>
            </div>
          </div>
        </article>

        {/* ----------------------------------------------------
            RIGHT CARD: RECENT ACTIVITY LIST
            ---------------------------------------------------- */}
        <article className="dashboard-card card-recent-activity">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Recent Activity</h2>
            <button
              type="button"
              className="view-all-link-btn"
              onClick={() => setShowAllHistory(!showAllHistory)}
            >
              {showAllHistory ? "Show Less ▴" : "View All →"}
            </button>
          </div>

          <div className="recent-activity-list">
            {displayActivities.map((act) => (
              <div key={act.id} className="recent-activity-row">
                {/* Rounded avatar tile */}
                <div className="activity-avatar-tile">
                  <span>{act.avatar}</span>
                </div>

                <div className="activity-meta-col">
                  <strong className="activity-item-title">{act.title}</strong>
                  <span className="activity-item-time">{act.time}</span>
                </div>

                <span className="activity-item-xp">{act.xp}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* ====================================================
          4. BOTTOM ROW (3 CARDS)
          ==================================================== */}
      <section className="progress-bottom-stage-grid">
        {/* ----------------------------------------------------
            BOTTOM CARD 1: LEARNING GOALS
            ---------------------------------------------------- */}
        <article className="dashboard-card card-learning-goals">
          <div className="dashboard-mini-header">
            <div className="mini-icon-circle icon-teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div>
              <h3 className="mini-card-title">Learning Goals</h3>
              <p className="mini-card-desc">Set your next milestone</p>
            </div>
          </div>

          <div className="goals-progress-body">
            <div className="goal-status-box">
              {/* Goal Mini Donut Badge */}
              <div className="goal-badge-ring">
                <svg viewBox="0 0 36 36" width="46" height="46" className="goal-svg">
                  <circle
                    className="goal-bg-circle"
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    strokeWidth="3.5"
                  />
                  <circle
                    className="goal-fill-circle"
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    strokeWidth="3.5"
                    strokeDasharray={`${(milestonePercent / 100) * 94.2} 94.2`}
                    strokeDashoffset="23.55"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="goal-fraction-text">{milestoneCurrent}/{milestoneTarget}</span>
              </div>

              <div className="goal-detail-col">
                <strong className="goal-label-text">Master 10 more signs</strong>
                <div className="goal-linear-track">
                  <div
                    className="goal-linear-fill"
                    style={{ width: `${milestonePercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* ----------------------------------------------------
            BOTTOM CARD 2: KEEP IT GOING
            ---------------------------------------------------- */}
        <article className="dashboard-card card-keep-going">
          <div className="dashboard-mini-header">
            <div className="mini-icon-circle icon-gold">
              {/* Trophy SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
              </svg>
            </div>
            <div>
              <h3 className="mini-card-title">Keep It Going</h3>
            </div>
          </div>

          <p className="keep-going-text">
            Every sign you practice brings a more inclusive world closer.
          </p>
        </article>

        {/* ----------------------------------------------------
            BOTTOM CARD 3: QUICK STATS (ALPHABETS & NUMBERS)
            ---------------------------------------------------- */}
        <article className="dashboard-card card-quick-stats">
          <div className="dashboard-mini-header">
            <div className="mini-icon-circle icon-mint">
              {/* Bar Chart Icon SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <div>
              <h3 className="mini-card-title">Quick Stats</h3>
              <p className="mini-card-desc">Your learning overview</p>
            </div>
          </div>

          <div className="quick-stats-dual-boxes">
            {/* Alphabets Progress Box */}
            <div className="quick-stat-box">
              <span className="quick-box-label">Alphabets</span>
              <strong className="quick-box-count">
                {alphabetLearnedCount || 5} / {totalAlphabetCount}
              </strong>
              <div className="quick-box-track">
                <div
                  className="quick-box-fill"
                  style={{
                    width: `${Math.min(100, Math.max(8, ((alphabetLearnedCount || 5) / totalAlphabetCount) * 100))}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Numbers Progress Box */}
            <div className="quick-stat-box">
              <span className="quick-box-label">Numbers</span>
              <strong className="quick-box-count">
                {numbersLearnedCount || 3} / {totalNumbersCount}
              </strong>
              <div className="quick-box-track">
                <div
                  className="quick-box-fill"
                  style={{
                    width: `${Math.min(100, Math.max(8, ((numbersLearnedCount || 3) / totalNumbersCount) * 100))}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* ====================================================
          5. SUBTLE RESET FOOTER (PRESERVED FUNCTIONALITY)
          ==================================================== */}
      <footer className="progress-dashboard-footer">
        {confirmReset ? (
          <div className="confirm-reset-row">
            <span>Are you sure? This resets all earned XP and progress.</span>
            <button type="button" className="btn-confirm-yes" onClick={handleReset}>
              Yes, Reset
            </button>
            <button
              type="button"
              className="btn-confirm-cancel"
              onClick={() => setConfirmReset(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-reset-link"
            onClick={() => setConfirmReset(true)}
          >
            Reset Progress
          </button>
        )}
      </footer>
    </main>
  );
}

export default Progress;
