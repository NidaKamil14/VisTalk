import { Link } from "react-router-dom";
function Learn() {
  const categories = [
    {
      number: "01",
      title: "Alphabets",
      description: "Master the signs for A to Z and build your foundation.",
      level: "Beginner",
    },
    {
      number: "02",
      title: "Numbers",
      description: "Learn numbers and simple counting signs.",
      level: "Beginner",
    },
    {
      number: "03",
      title: "Everyday Words",
      description: "Learn useful signs for daily conversations.",
      level: "Beginner",
    },
    {
      number: "04",
      title: "Common Phrases",
      description: "Put individual signs together to communicate.",
      level: "Intermediate",
    },
  ];

  return (
    <main className="learn-page">
      <section className="learn-hero">
        <div>
          <p className="hero-tag">YOUR LEARNING SPACE</p>

          <h1>
            Learn at your
            <br />
            <span>own pace.</span>
          </h1>

          <p className="learn-intro">
            Start with the basics, practice regularly, and gradually
            build your sign language vocabulary.
          </p>
        </div>

        <div className="learn-progress">
          <p>Your Progress</p>
          <h2>0%</h2>

          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>

          <span>Ready to begin your first lesson?</span>
        </div>
      </section>

      <section className="categories-section">
        <div className="section-heading">
          <div>
            <p className="hero-tag">EXPLORE LESSONS</p>
            <h2>Where would you like to start?</h2>
          </div>

          <p>
            Choose a topic and start learning one sign at a time.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-card" key={category.number}>
              <div className="card-top">
                <span>{category.number}</span>
                <small>{category.level}</small>
              </div>

              <h3>{category.title}</h3>

              <p>{category.description}</p>

              <Link to="/learn/alphabets">Explore →</Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Learn;