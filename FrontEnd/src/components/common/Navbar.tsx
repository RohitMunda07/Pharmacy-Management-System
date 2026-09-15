import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/login");
  }

  return (
    <aside className={`navbar ${menuOpen ? "nav-open" : ""}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <div className="brand-row">
          <div className="brand" style={{ marginBottom: 0 }}>
            <span className="brand-mark">P</span>
            <span>PharmaFlow</span>
          </div>

          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/inventory" onClick={() => setMenuOpen(false)}>
            Inventory
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/customers" onClick={() => setMenuOpen(false)}>
            Customers
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/sales" onClick={() => setMenuOpen(false)}>
            Sales
          </NavLink>
        </nav>

        <div className={`nav-user ${menuOpen ? "open" : ""}`}>
          <span className="user-chip">
            <div>
              <span style={{ display: "block", fontSize: "0.9rem" }}>{user?.name}</span>
              <span style={{ display: "block", fontSize: "0.75rem", opacity: 0.8 }}>{user?.role}</span>
            </div>
          </span>
          <button type="button" className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
