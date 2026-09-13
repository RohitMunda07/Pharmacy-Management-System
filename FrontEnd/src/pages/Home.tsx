import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="landing-shell">
      <style>{`
        .landing-shell {
          --ink: #10221d;
          --muted: #66756f;
          --line: rgba(16, 34, 29, .10);
          --surface: rgba(255,255,255,.82);
          --accent: #176b57;
          --accent-2: #dff4e9;
          min-height: 100vh;
          color: var(--ink);
          overflow: hidden;
          background:
            radial-gradient(circle at 8% 12%, rgba(80, 178, 142, .18), transparent 28%),
            radial-gradient(circle at 88% 8%, rgba(255, 206, 110, .20), transparent 25%),
            linear-gradient(135deg, #f8fbf9 0%, #eef6f2 52%, #f9fbfa 100%);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .landing-shell *, .landing-shell *::before, .landing-shell *::after { box-sizing: border-box; }
        .landing-shell a { text-decoration: none; }

        .landing-header {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          position: relative;
          z-index: 10;
        }

        .landing-brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -.04em;
        }

        .landing-brand i {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: white;
          background: linear-gradient(145deg, #21856b, #0d4f40);
          box-shadow: 0 10px 24px rgba(23, 107, 87, .25);
          font-size: 20px;
        }

        .landing-actions { display: flex; align-items: center; gap: 10px; }
        .landing-user { color: var(--muted); font-size: 14px; margin-right: 4px; }

        .btn {
          border: 1px solid transparent;
          min-height: 44px;
          padding: 0 18px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 750;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease, border-color .2s ease;
        }
        .btn:hover { transform: translateY(-2px); }
        .btn-primary {
          color: white;
          background: #176b57;
          box-shadow: 0 10px 22px rgba(23,107,87,.18);
        }
        .btn-primary:hover { background: #105844; box-shadow: 0 14px 28px rgba(23,107,87,.25); }
        .btn-secondary {
          color: var(--ink);
          background: rgba(255,255,255,.68);
          border-color: var(--line);
          box-shadow: 0 6px 18px rgba(16,34,29,.04);
        }
        .btn-secondary:hover { background: rgba(255,255,255,.95); border-color: rgba(16,34,29,.18); }
        .btn-large { min-height: 52px; padding: 0 23px; border-radius: 14px; font-size: 15px; }

        .landing-hero {
          width: min(1180px, calc(100% - 40px));
          min-height: calc(100vh - 82px);
          margin: 0 auto;
          padding: 58px 0 86px;
          display: grid;
          grid-template-columns: minmax(0, 1.03fr) minmax(390px, .97fr);
          align-items: center;
          gap: 76px;
          position: relative;
        }

        .landing-copy { position: relative; z-index: 2; max-width: 680px; }
        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 11px;
          border: 1px solid rgba(23,107,87,.12);
          border-radius: 999px;
          color: #176b57;
          background: rgba(223,244,233,.72);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .09em;
          text-transform: uppercase;
        }
        .eyebrow::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #35a47e; box-shadow: 0 0 0 5px rgba(53,164,126,.12); }

        .landing-copy h1 {
          margin: 22px 0 20px;
          max-width: 720px;
          font-size: clamp(44px, 5.2vw, 72px);
          line-height: .99;
          letter-spacing: -.065em;
          font-weight: 850;
        }
        .landing-copy h1 span { color: #176b57; }
        .landing-copy > p {
          max-width: 610px;
          margin: 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.75;
        }
        .cta-row { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 31px; }

        .metrics-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          max-width: 640px;
          margin-top: 46px;
          padding-top: 25px;
          border-top: 1px solid var(--line);
        }
        .metrics-row > div { padding-right: 20px; }
        .metrics-row > div + div { padding-left: 20px; border-left: 1px solid var(--line); }
        .metrics-row strong { display: block; font-size: 25px; letter-spacing: -.04em; }
        .metrics-row span { display: block; margin-top: 5px; color: var(--muted); font-size: 12px; line-height: 1.45; }

        .landing-visual { position: relative; min-height: 530px; display: grid; place-items: center; }
        .visual-glow {
          position: absolute;
          width: 410px;
          height: 410px;
          border-radius: 50%;
          background: rgba(43, 145, 112, .14);
          filter: blur(8px);
        }
        .landing-card {
          width: min(100%, 480px);
          position: relative;
          z-index: 2;
          padding: 17px;
          border: 1px solid rgba(255,255,255,.78);
          border-radius: 26px;
          background: rgba(255,255,255,.63);
          box-shadow: 0 35px 80px rgba(24,57,47,.15), inset 0 1px 0 rgba(255,255,255,.9);
          backdrop-filter: blur(22px);
          transform: rotate(1.2deg);
        }
        .dashboard-topbar { display:flex; justify-content:space-between; align-items:center; padding: 7px 9px 16px; }
        .dashboard-title { font-size: 13px; font-weight: 800; }
        .window-dots { display:flex; gap:5px; }
        .window-dots i { width:7px; height:7px; border-radius:50%; background:#cad4cf; }

        .mini-panel {
          padding: 23px;
          border: 1px solid rgba(16,34,29,.08);
          border-radius: 19px;
          background: rgba(255,255,255,.84);
          box-shadow: 0 10px 25px rgba(16,34,29,.05);
        }
        .mini-panel + .mini-panel { margin-top: 12px; }
        .health-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
        .mini-panel p { margin:0; color:#718079; font-size:12px; font-weight:700; }
        .mini-panel h3 { margin:7px 0 0; font-size:38px; letter-spacing:-.06em; }
        .health-badge { padding:7px 9px; border-radius:9px; color:#176b57; background:#e4f6ec; font-size:11px; font-weight:800; }
        .chart { height:100px; margin-top:20px; display:flex; align-items:end; gap:7px; }
        .chart span { flex:1; min-width:8px; border-radius:7px 7px 3px 3px; background: linear-gradient(180deg,#55bd93,#176b57); opacity:.9; }
        .chart span:nth-child(1){height:44%}.chart span:nth-child(2){height:58%}.chart span:nth-child(3){height:50%}.chart span:nth-child(4){height:72%}.chart span:nth-child(5){height:63%}.chart span:nth-child(6){height:82%}.chart span:nth-child(7){height:74%}.chart span:nth-child(8){height:94%}.chart span:nth-child(9){height:87%}.chart span:nth-child(10){height:100%}

        .mini-row { display:grid; grid-template-columns:1fr auto; gap:15px; align-items:center; padding:12px 0; font-size:13px; }
        .mini-row + .mini-row { border-top:1px solid var(--line); }
        .mini-row span { color:#74817c; }
        .mini-row strong { font-size:12px; }
        .status-good { color:#176b57; }
        .status-warn { color:#a66a11; }

        .floating-card {
          position:absolute;
          z-index:3;
          right:-23px;
          bottom:54px;
          width:185px;
          padding:15px;
          border:1px solid rgba(255,255,255,.8);
          border-radius:17px;
          background:rgba(255,255,255,.86);
          box-shadow:0 18px 40px rgba(25,56,47,.14);
          backdrop-filter:blur(18px);
          transform:rotate(-5deg);
        }
        .floating-label { color:#7a8781; font-size:10px; font-weight:700; }
        .floating-number { margin-top:4px; font-size:22px; font-weight:850; letter-spacing:-.05em; }
        .progress { height:6px; margin-top:10px; overflow:hidden; border-radius:99px; background:#e7eeea; }
        .progress i { display:block; width:78%; height:100%; border-radius:inherit; background:#2d9b76; }

        .decor { position:absolute; border-radius:50%; border:1px solid rgba(23,107,87,.09); pointer-events:none; }
        .decor.one { width:220px; height:220px; right:-90px; top:7%; }
        .decor.two { width:330px; height:330px; left:-210px; bottom:2%; }

        @media (max-width: 900px) {
          .landing-header { min-height: 72px; }
          .landing-hero { grid-template-columns: 1fr; gap: 30px; padding-top: 42px; }
          .landing-copy { max-width: 760px; }
          .landing-visual { min-height: 480px; }
        }
        @media (max-width: 620px) {
          .landing-header, .landing-hero { width: min(100% - 28px, 1180px); }
          .landing-actions .landing-user, .landing-actions .btn-secondary { display:none; }
          .landing-copy h1 { font-size: clamp(40px, 12vw, 58px); }
          .landing-copy > p { font-size: 15px; line-height: 1.65; }
          .metrics-row { gap: 0; margin-top: 35px; }
          .metrics-row > div { padding-right: 10px; }
          .metrics-row > div + div { padding-left: 10px; }
          .metrics-row strong { font-size:20px; }
          .metrics-row span { font-size:10px; }
          .landing-visual { min-height: 420px; }
          .landing-card { transform:none; }
          .floating-card { right:-5px; bottom:20px; }
        }
      `}</style>

      <span className="decor one" aria-hidden="true" />
      <span className="decor two" aria-hidden="true" />

      <header className="landing-header">
        <div className="landing-brand">
          <div className="brand-mark">P</div>
          <span>PharmaFlow</span>
        </div>

        {isAuthenticated ? (
          <div className="landing-actions">
            <span className="landing-user">Hi, {user?.name || 'there'}</span>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Open App <i className="ti ti-arrow-up-right" aria-hidden="true" />
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="landing-actions">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Create account</Link>
          </div>
        )}
      </header>

      <main className="landing-hero">
        <section className="landing-copy">
          <span className="eyebrow">Warehouse operations</span>
          <h1>Know your stock. <span>Move smarter.</span></h1>
          <p>
            PharmaFlow brings inventory, stock health, and warehouse activity into one clear workspace—so your team can spend less time searching and more time getting work done.
          </p>

          <div className="cta-row">
            <Link to="/register" className="btn btn-primary btn-large">
              Get started <i className="ti ti-arrow-right" aria-hidden="true" />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">Sign in</Link>
          </div>

          <div className="metrics-row">
            <div><strong>96%</strong><span>On-time inventory updates</span></div>
            <div><strong>2.4×</strong><span>Faster stock checks</span></div>
            <div><strong>24/7</strong><span>Warehouse visibility</span></div>
          </div>
        </section>

        <section className="landing-visual" aria-label="PharmaFlow inventory dashboard preview">
          <div className="visual-glow" aria-hidden="true" />

          <aside className="landing-card">
            <div className="dashboard-topbar">
              <span className="dashboard-title">Inventory overview</span>
              <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
            </div>

            <div className="mini-panel">
              <div className="health-head">
                <div>
                  <p>Inventory health</p>
                  <h3>87.4%</h3>
                </div>
                <span className="health-badge">+8.2%</span>
              </div>
              <div className="chart" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, index) => <span key={index} />)}
              </div>
            </div>

            <div className="mini-panel">
              <div className="mini-row"><span>Stock status</span><strong className="status-good">Healthy</strong></div>
              <div className="mini-row"><span>Low stock alerts</span><strong className="status-warn">12 items</strong></div>
              <div className="mini-row"><span>Pending dispatch</span><strong>8 orders</strong></div>
            </div>
          </aside>

          <div className="floating-card">
            <span className="floating-label">Warehouse capacity</span>
            <div className="floating-number">78% used</div>
            <div className="progress"><i /></div>
          </div>
        </section>
      </main>
    </div>
  );
}
