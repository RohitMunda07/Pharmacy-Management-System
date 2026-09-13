import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("admin@pharmacy.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-card">
      <div className="login-brand">
        <div className="brand-mark">P</div>
        <div>
          <h2>PharmaFlow</h2>
        </div>
      </div>

      <p className="eyebrow">Sign in to your pharmacy dashboard</p>
      {error && <p className="form-error">{error}</p>}

      <div className="input-stack">
        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="admin@pharmacy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      <button type="submit" className="btn primary" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <div style={{ marginTop: 12, fontSize: "0.9rem" }}>
        Don't have an account? <a href="/register">Register</a>
      </div>

      <div className="demo-box">
        Demo login: <strong>admin@pharmacy.com</strong> / <strong>Admin@123</strong>
      </div>
    </form>
  );
}
