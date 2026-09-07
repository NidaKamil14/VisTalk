import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="clean-footer">
      <div className="clean-footer-inner">
        <div className="clean-footer-brand">
          <Link to="/" className="footer-logo">VisTalk</Link>
          <p>Intentional visual sign language learning.</p>
        </div>

        <nav className="clean-footer-links">
          <Link to="/">Home</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/practice">Practice</Link>
          <Link to="/progress">Progress</Link>
        </nav>

        <div className="clean-footer-copy">
          <p>© {new Date().getFullYear()} VisTalk</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
