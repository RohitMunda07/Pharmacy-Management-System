import RegisterForm from "../components/auth/RegisterForm";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="login-shell">
      <div className="hero" style={{ maxWidth: 980, margin: "0 auto" }}>
        <div
          className="hero-illustration"
          style={{
            background: "linear-gradient(135deg,#0f2622,#0b2f2b)",
            color: "#fff",
            borderRadius: "14px 0 0 14px",
            padding: 28,
            boxShadow: "inset 0 -40px 80px rgba(0,0,0,0.08)",
            position: "relative",
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div style={{ position: "absolute", top: 14, left: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <div className="brand-mark" style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#176b57,#0d4f40)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>P</div>
            <div style={{ fontWeight: 800, color: "#fff" }}>PharmaFlow</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px 20px" }}>
            <h2 style={{ margin: 0, fontSize: "1.8rem" }}>Create account</h2>
            <p style={{ marginTop: 10, color: "rgba(255,255,255,0.85)", maxWidth: 300 }}>
              Create your account and start managing inventory, teams, and stock health with confidence.
            </p>
          </div>
        </div>

        <div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
