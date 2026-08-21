import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">VisTalk</div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/practice">Practice</Link>
        <Link to="/progress">Progress</Link>
      </div>

      <button className="nav-button">Get Started</button>
    </nav>
  );
}

export default Navbar;