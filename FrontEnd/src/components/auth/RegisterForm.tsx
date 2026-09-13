import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../../services/auth.service";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.register(name, email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-card">
      <div className="login-brand">
        <div className="brand-mark">P</div>
        <div>
          <h2>Register</h2>
        </div>
      </div>

      <p className="eyebrow">Create a new account</p>
      {error && <p className="form-error">{error}</p>}

      <div className="input-stack">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
      </div>

      <button type="submit" className="btn primary" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Creating..." : "Create account"}
      </button>

      <div style={{ marginTop: 12, fontSize: "0.9rem" }}>
        Already have an account? <a href="/login">Sign in</a>
      </div>
    </form>
  );
}
