import { Link } from "react-router-dom";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div className="brand-name">PharmaFlow</div>
        </div>

        <nav className="top-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </div>
    </header>
  );
}
