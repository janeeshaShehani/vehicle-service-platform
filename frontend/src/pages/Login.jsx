// src/pages/Login.jsx
// Route: /login
// Two roles: Customer login + Garage Owner login
// Requires: react-router-dom, global.css

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/global.css";

// ─── Icons ───────────────────────────────────────────────────────────────────
const EyeIcon = ({ off }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {off ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    )}
  </svg>
);

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const WrenchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const GarageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, id, type = "text", placeholder, value, onChange, icon, error, rightSlot, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: "0.83rem", fontWeight: 700, color: "#374151", marginBottom: 6, letterSpacing: "0.01em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {/* Left icon */}
        <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: focused ? "#1D4ED8" : "#94A3B8", pointerEvents: "none", transition: "color 0.15s", display: "flex" }}>
          {icon}
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={id}
          style={{
            width: "100%",
            padding: `12px 44px 12px 42px`,
            borderRadius: 11,
            border: `1.5px solid ${error ? "#EF4444" : focused ? "#1D4ED8" : "#E2E8F0"}`,
            background: error ? "#FEF2F2" : focused ? "#FAFBFF" : "#F8FAFC",
            fontSize: "0.93rem",
            color: "#0F172A",
            outline: "none",
            transition: "all 0.18s",
            fontFamily: "var(--font-body)",
            boxShadow: focused ? "0 0 0 3px rgba(29,78,216,0.08)" : "none",
          }}
        />
        {/* Right slot (show/hide password) */}
        {rightSlot && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p style={{ fontSize: "0.78rem", color: "#EF4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2"/></svg>
          {error}
        </p>
      )}
      {hint && !error && <p style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();

  const [role,        setRole]        = useState("customer"); // "customer" | "garage"
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [remember,    setRemember]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [errors,      setErrors]      = useState({});
  const [submitted,   setSubmitted]   = useState(false);

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!email)                          e.email    = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email  = "Enter a valid email address.";
    if (!password)                       e.password = "Password is required.";
    else if (password.length < 6)        e.password = "Password must be at least 6 characters.";
    return e;
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    // TODO: replace with real API call
    // const res = await axios.post("/api/auth/login", { email, password, role });
    // localStorage.setItem("token", res.data.token);
    await new Promise(r => setTimeout(r, 1400)); // simulate API
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      navigate(role === "garage" ? "/dashboard" : "/");
    }, 1200);
  };

  // ── Features list for panel ──
  const FEATURES = [
    "Find garages near you instantly",
    "Filter by vehicle type & service",
    "View verified ratings & reviews",
    "Contact garages with one tap",
  ];

  const GARAGE_FEATURES = [
    "Manage your garage profile",
    "Reach thousands of vehicle owners",
    "Track reviews and ratings",
    "First month subscription free",
  ];

  const features = role === "garage" ? GARAGE_FEATURES : FEATURES;

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F0F4F8" }}>

      {/* ══════════ LEFT PANEL ══════════ */}
      <div
        className="login-panel"
        style={{
          width: "42%",
          background: "linear-gradient(160deg, #0F172A 0%, #1E3A8A 55%, #1D4ED8 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(29,78,216,0.2)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(5,150,105,0.12)", filter: "blur(50px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: 180, height: 180, borderRadius: "50%", background: "rgba(234,88,12,0.08)", filter: "blur(40px)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08))", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <WrenchIcon />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "#fff", letterSpacing: "-0.02em" }}>
              Garage<span style={{ color: "#60A5FA" }}>Finder</span>
            </span>
          </Link>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#93C5FD", padding: "5px 14px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>
            {role === "garage" ? "🔧 Garage Portal" : "🚗 Customer Portal"}
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 12, letterSpacing: "-0.02em" }}>
            {role === "garage"
              ? "Grow Your Garage Business"
              : "Welcome Back to GarageFinder"}
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: 32, maxWidth: 340 }}>
            {role === "garage"
              ? "Manage your profile, reach more customers, and grow your vehicle service business across Sri Lanka."
              : "Find trusted garages near you. Search by vehicle type, service, and district — all in one place."}
          </p>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, animation: `fadeUp 0.4s ${i * 0.08}s both` }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(5,150,105,0.2)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34D399", flexShrink: 0 }}>
                  <CheckCircleIcon />
                </div>
                <span style={{ color: "#CBD5E1", fontSize: "0.88rem", fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24 }}>
          <p style={{ color: "#64748B", fontSize: "0.82rem", lineHeight: 1.6 }}>
            Sri Lanka's #1 vehicle service discovery platform.<br />
            Trusted by <strong style={{ color: "#93C5FD" }}>50,000+</strong> vehicle owners.
          </p>
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity:0; transform:translateY(12px); }
            to   { opacity:1; transform:translateY(0); }
          }
        `}</style>
      </div>

      {/* ══════════ RIGHT PANEL — FORM ══════════ */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 440, animation: "fadeUp 0.45s 0.1s both" }}>

          {/* Role switcher tabs */}
          <div style={{ display: "flex", background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 5, marginBottom: 32, boxShadow: "0 2px 10px rgba(15,23,42,0.05)" }}>
            {[
              { key: "customer", label: "Customer",      icon: <UserIcon /> },
              { key: "garage",   label: "Garage Owner",  icon: <GarageIcon /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setRole(tab.key); setErrors({}); }}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
                  fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 700,
                  background: role === tab.key ? "#1D4ED8" : "transparent",
                  color: role === tab.key ? "#fff" : "#64748B",
                  transition: "all 0.2s",
                  boxShadow: role === tab.key ? "0 2px 10px rgba(29,78,216,0.25)" : "none",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(15,23,42,0.07)", padding: "36px 36px 32px" }}>

            {/* Success state */}
            {submitted ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Login Successful!</h3>
                <p style={{ color: "#64748B", fontSize: "0.88rem" }}>Redirecting you now…</p>
                <div style={{ marginTop: 20, height: 4, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#059669", borderRadius: 999, animation: "progressBar 1.2s linear forwards" }} />
                </div>
                <style>{`@keyframes progressBar { from{width:0%} to{width:100%} }`}</style>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 28 }}>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.55rem", fontWeight: 800, color: "#0F172A", marginBottom: 4, letterSpacing: "-0.02em" }}>
                    {role === "garage" ? "Garage Owner Login" : "Sign In"}
                  </h1>
                  <p style={{ fontSize: "0.88rem", color: "#64748B" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#1D4ED8", fontWeight: 700, textDecoration: "none" }}>
                      Create one free →
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Email */}
                  <Field
                    label="Email Address"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrors(err => ({ ...err, email: "" })); }}
                    icon={<MailIcon />}
                    error={errors.email}
                  />

                  {/* Password */}
                  <Field
                    label="Password"
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(err => ({ ...err, password: "" })); }}
                    icon={<LockIcon />}
                    error={errors.password}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPass(s => !s)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 2 }}
                        aria-label={showPass ? "Hide password" : "Show password"}
                      >
                        <EyeIcon off={showPass} />
                      </button>
                    }
                  />

                  {/* Remember + Forgot */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <div
                        onClick={() => setRemember(r => !r)}
                        style={{
                          width: 18, height: 18, borderRadius: 5,
                          border: `2px solid ${remember ? "#1D4ED8" : "#CBD5E1"}`,
                          background: remember ? "#1D4ED8" : "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s", flexShrink: 0,
                        }}
                      >
                        {remember && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: "0.83rem", color: "#475569", fontWeight: 500 }}>Remember me</span>
                    </label>
                    <Link to="/forgot-password" style={{ fontSize: "0.83rem", color: "#1D4ED8", fontWeight: 600, textDecoration: "none" }}>
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%", padding: "13px",
                      borderRadius: 12, border: "none",
                      background: loading ? "#93C5FD" : "#1D4ED8",
                      color: "#fff", fontSize: "0.97rem", fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "var(--font-body)",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "all 0.2s",
                      boxShadow: loading ? "none" : "0 4px 16px rgba(29,78,216,0.25)",
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#1E3A8A"; }}
                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#1D4ED8"; }}
                  >
                    {loading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Signing in…
                      </>
                    ) : (
                      `Sign In as ${role === "garage" ? "Garage Owner" : "Customer"}`
                    )}
                  </button>

                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
                  <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600 }}>or continue with</span>
                  <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
                </div>

                {/* Google SSO (UI only) */}
                <button
                  type="button"
                  style={{
                    width: "100%", padding: "11px", borderRadius: 11,
                    border: "1.5px solid #E2E8F0", background: "#fff",
                    color: "#374151", fontSize: "0.88rem", fontWeight: 700,
                    cursor: "pointer", fontFamily: "var(--font-body)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                  {/* Google "G" */}
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}
          </div>

          {/* Bottom link */}
          {!submitted && (
            <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.82rem", color: "#94A3B8" }}>
              New garage owner?{" "}
              <Link to="/register" style={{ color: "#1D4ED8", fontWeight: 700, textDecoration: "none" }}>
                Register your garage — it's free
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ══════════ RESPONSIVE ══════════ */}
      <style>{`
        @media (max-width: 860px) {
          .login-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}