import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <div className="brand" style={{ marginBottom: "2rem" }}>
          <span className="brand-mark">P</span>
          <span>PharmaFlow</span>
        </div>

        <nav className="nav-links">
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/inventory">
            Inventory
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/customers">
            Customers
          </NavLink>
          <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/sales">
            Sales
          </NavLink>
        </nav>

        <div className="nav-user">
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
