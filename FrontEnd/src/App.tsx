import "./App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Topbar from "./components/common/Topbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Home from "./pages/Home";
import Register from "./pages/Register";

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  // Hide the navbar on public routes (landing/login/register)
  const publicPaths = ["/", "/login", "/register"];
  // normalize pathname (strip trailing slashes)
  const rawPath = location.pathname || "/";
  const normalizedPath = rawPath.replace(/\/+$/, "") || "/";
  const isPublic = publicPaths.some((p) => {
    const np = p.replace(/\/+$/, "") || "/";
    return normalizedPath === np || normalizedPath.startsWith(np + "/");
  });

  const showNavbar = !!user && !isPublic;
  const showTopbar = !showNavbar && normalizedPath !== "/" && normalizedPath !== "/login" && normalizedPath !== "/register";
  const containerClass = showNavbar ? "app-shell" : showTopbar ? "app-shell topbar-shell" : "app-shell";

  return (
    <div className={containerClass}>
      {showNavbar && <Navbar />}
      {showTopbar && <Topbar />}
      <main style={{ flex: 1, width: "100%" }}>{children}</main>
    </div>
  );
}

function RootRedirect() {
  const { user } = useAuth();
  // If logged in go to dashboard, otherwise show Home (landing)
  return <Navigate to={user ? "/dashboard" : "/"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  );
}
