function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tag">LEARN • CONNECT • COMMUNICATE</p>

        <h1>
          Learn Sign Language.
          <br />
          <span>Connect Without Words.</span>
        </h1>

        <p className="hero-description">
          VisTalk is your interactive sign language teacher,
          designed to make learning simple, visual, and fun.
        </p>

        <button className="hero-button">Start Learning</button>
      </div>

      <div className="hero-visual">
        <div className="hand-placeholder">
          <span>👋</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;