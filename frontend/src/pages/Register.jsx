// src/pages/Register.jsx
// Route: /register
// Customer-only registration — name, email, password, confirm password
// Requires: react-router-dom, global.css

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────
const WrenchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
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

const EyeIcon = ({ off }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.21 3.35 2 2 0 0 1 3.18 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
  </svg>
);

// ─── Password Strength Meter ──────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const checks = [
    { label: "At least 8 characters",     pass: password.length >= 8 },
    { label: "Contains a number",          pass: /\d/.test(password) },
    { label: "Contains a letter",          pass: /[a-zA-Z]/.test(password) },
    { label: "Contains special character", pass: /[^a-zA-Z0-9]/.test(password) },
  ];

  const score   = checks.filter(c => c.pass).length;
  const labels  = ["", "Weak", "Fair", "Good", "Strong"];
  const colors  = ["#E2E8F0", "#EF4444", "#F59E0B", "#3B82F6", "#059669"];
  const color   = colors[score];
  const label   = labels[score];

  if (!password) return null;

  return (
    <div style={{ marginTop: 10, marginBottom: 4 }}>
      {/* Strength bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 7 }}>
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              flex: 1, height: 4, borderRadius: 999,
              background: i <= score ? color : "#E2E8F0",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Password strength</span>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: color }}>{label}</span>
      </div>

      {/* Checklist */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
              background: c.pass ? "#D1FAE5" : "#F1F5F9",
              border: `1.5px solid ${c.pass ? "#059669" : "#E2E8F0"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#059669",
              transition: "all 0.2s",
            }}>
              {c.pass && <CheckIcon />}
            </div>
            <span style={{ fontSize: "0.73rem", color: c.pass ? "#059669" : "#94A3B8", fontWeight: c.pass ? 600 : 400, transition: "color 0.2s" }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Reusable Input Field ─────────────────────────────────────────────────────
function Field({ label, id, type = "text", placeholder, value, onChange, icon, error, rightSlot, optional }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <label htmlFor={id} style={{ fontSize: "0.83rem", fontWeight: 700, color: "#374151" }}>
          {label}
        </label>
        {optional && (
          <span style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 500 }}>Optional</span>
        )}
      </div>
      <div style={{ position: "relative" }}>
        
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
            padding: "12px 44px 12px 42px",
            borderRadius: 11,
            border: `1.5px solid ${error ? "#EF4444" : focused ? "#1D4ED8" : "#E2E8F0"}`,
            background: error ? "#FEF2F2" : focused ? "#FAFBFF" : "#F8FAFC",
            fontSize: "0.92rem",
            color: "#0F172A",
            outline: "none",
            transition: "all 0.18s",
            fontFamily: "var(--font-body)",
            boxShadow: focused ? "0 0 0 3px rgba(29,78,216,0.08)" : "none",
          }}
        />
        {rightSlot && (
          <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p style={{ fontSize: "0.77rem", color: "#EF4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/>
            <line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Benefit card (left panel) ────────────────────────────────────────────────
function BenefitItem({ emoji, title, desc, delay }) {
  return (
    <div style={{
      display: "flex", gap: 13, alignItems: "flex-start",
      animation: `fadeUp 0.4s ${delay}s both`,
    }}>
     
      <div>
        <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem", marginBottom: 2 }}>{title}</div>
        <div style={{ color: "#64748B", fontSize: "0.82rem", lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Register() {
  const navigate = useNavigate();

  // Form state
  const [fullName,    setFullName]    = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!fullName.trim())
      e.fullName = "Full name is required.";
    else if (fullName.trim().length < 3)
      e.fullName = "Name must be at least 3 characters.";

    if (!email)
      e.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Enter a valid email address.";

    if (phone && !/^(\+94|0)[0-9]{9}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Sri Lankan phone number.";

    if (!password)
      e.password = "Password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";

    if (!confirmPass)
      e.confirmPass = "Please confirm your password.";
    else if (password !== confirmPass)
      e.confirmPass = "Passwords do not match.";

    if (!agreed)
      e.agreed = "You must agree to the Terms & Privacy Policy.";

    return e;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    // TODO: Replace with real API call
    // await axios.post("/api/auth/register", { fullName, email, phone, password, role: "customer" });
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/"), 1800);
  };

  const clearErr = (key) => setErrors(e => ({ ...e, [key]: "" }));

  // ── Left panel benefits ─────────────────────────────────────────────────────
  const BENEFITS = [
    { emoji: "🔍", title: "Find Garages Instantly",    desc: "Search by vehicle type, service, and district across Sri Lanka.", delay: 0.05 },
    { emoji: "⭐", title: "Verified Reviews",           desc: "Read real customer ratings before choosing a garage.",            delay: 0.12 },
    { emoji: "📞", title: "One-Tap Contact",            desc: "Call or get directions to any garage with a single tap.",        delay: 0.19 },
    { emoji: "🆓", title: "Always Free for Customers", desc: "No subscription, no hidden fees — ever.",                        delay: 0.26 },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F0F4F8" }}>

      {/* ══════════ LEFT PANEL ══════════ */}
      <div
        className="reg-panel"
        style={{
          width: "40%",
          background: "linear-gradient(155deg, #0F172A 0%, #1E3A8A 52%, #1D4ED8 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "44px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blobs */}
        <div style={{ position:"absolute", top:-80, right:-60, width:280, height:280, borderRadius:"50%", background:"rgba(29,78,216,0.2)", filter:"blur(55px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-50, left:-40, width:240, height:240, borderRadius:"50%", background:"rgba(5,150,105,0.13)", filter:"blur(50px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"38%", right:"8%",  width:160, height:160, borderRadius:"50%", background:"rgba(234,88,12,0.08)", filter:"blur(38px)", pointerEvents:"none" }}/>


        {/* Middle content */}
        <div style={{ position:"relative", zIndex:1 }}>
          {/* Label */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.09)", border:"1px solid rgba(255,255,255,0.14)", color:"#93C5FD", padding:"5px 14px", borderRadius:999, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:18 }}>
             Free Customer Account
          </div>

          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem, 2.8vw, 2.1rem)", fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:10, letterSpacing:"-0.02em" }}>
            Join Sri Lanka's Largest<br/>Garage Network
          </h2>
          <p style={{ color:"#94A3B8", fontSize:"0.9rem", lineHeight:1.7, marginBottom:32, maxWidth:320 }}>
            Create your free account in under 60 seconds and start finding trusted garages near you.
          </p>

          {/* Benefits */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            {BENEFITS.map(b => <BenefitItem key={b.title} {...b} />)}
          </div>
        </div>

        {/* Bottom stat strip */}
        <div style={{ position:"relative", zIndex:1, borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:22, display:"flex", gap:28 }}>
          {[
            { value:"500+",  label:"Garages" },
            { value:"25",    label:"Districts" },
            { value:"50K+",  label:"Users" },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:"1.25rem", color:"#fff", lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:"0.75rem", color:"#64748B", marginTop:2, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes fadeUp {
            from { opacity:0; transform:translateY(14px); }
            to   { opacity:1; transform:translateY(0); }
          }
          @keyframes spin { to { transform:rotate(360deg); } }
          @keyframes progressBar { from{width:0%} to{width:100%} }
          @keyframes scaleIn {
            from { opacity:0; transform:scale(0.85); }
            to   { opacity:1; transform:scale(1); }
          }
        `}</style>
      </div>

      {/* ══════════ RIGHT PANEL — FORM ══════════ */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"36px 24px", overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:460, animation:"fadeUp 0.45s 0.1s both" }}>

          {/* ── SUCCESS STATE ── */}
          {success ? (
            <div style={{
              background:"#fff", borderRadius:22, border:"1px solid #E2E8F0",
              boxShadow:"0 4px 28px rgba(15,23,42,0.08)",
              padding:"52px 40px", textAlign:"center",
              animation:"scaleIn 0.35s ease both",
            }}>
              {/* Animated check */}
              <div style={{ width:76, height:76, borderRadius:"50%", background:"linear-gradient(135deg,#D1FAE5,#A7F3D0)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", boxShadow:"0 8px 24px rgba(5,150,105,0.2)" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"1.45rem", fontWeight:800, color:"#0F172A", marginBottom:8 }}>
                Account Created! 🎉
              </h2>
              <p style={{ color:"#64748B", fontSize:"0.9rem", lineHeight:1.7, marginBottom:24, maxWidth:300, marginInline:"auto" }}>
                Welcome to GarageFinder, <strong style={{ color:"#0F172A" }}>{fullName.split(" ")[0]}</strong>! You can now find garages near you.
              </p>
              {/* Progress bar */}
              <div style={{ height:4, background:"#F1F5F9", borderRadius:999, overflow:"hidden" }}>
                <div style={{ height:"100%", background:"linear-gradient(90deg,#1D4ED8,#059669)", borderRadius:999, animation:"progressBar 1.8s linear forwards" }}/>
              </div>
              <p style={{ fontSize:"0.75rem", color:"#94A3B8", marginTop:10 }}>Redirecting to home…</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom:24 }}>
                <h1 style={{ fontFamily:"var(--font-display)", fontSize:"1.7rem", fontWeight:800, color:"#0F172A", marginBottom:4, letterSpacing:"-0.02em" }}>
                  Create your account
                </h1>
                <p style={{ fontSize:"0.87rem", color:"#64748B" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color:"#1D4ED8", fontWeight:700, textDecoration:"none" }}>
                    Sign in →
                  </Link>
                </p>
              </div>

              {/* ── FORM CARD ── */}
              <div style={{
                background:"#fff", borderRadius:22,
                border:"1px solid #E2E8F0",
                boxShadow:"0 4px 24px rgba(15,23,42,0.07)",
                padding:"32px 34px",
              }}>
                <form onSubmit={handleSubmit} noValidate>

                  {/* Full Name */}
                  <Field
                    label="Full Name"
                    id="name"
                    type="text"
                    placeholder="Kasun Perera"
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); clearErr("fullName"); }}
                    icon={<UserIcon />}
                    error={errors.fullName}
                  />

                  {/* Email */}
                  <Field
                    label="Email Address"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); clearErr("email"); }}
                    icon={<MailIcon />}
                    error={errors.email}
                  />

                  {/* Phone (optional) */}
                  <Field
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); clearErr("phone"); }}
                    icon={<PhoneIcon />}
                    error={errors.phone}
                    optional
                  />

                  {/* Password */}
                  <Field
                    label="Password"
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); clearErr("password"); }}
                    icon={<LockIcon />}
                    error={errors.password}
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPass(s => !s)}
                        style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8", display:"flex", padding:2 }}
                        aria-label="Toggle password visibility"
                      >
                        <EyeIcon off={showPass} />
                      </button>
                    }
                  />

                  {/* Password strength */}
                  <div style={{ marginTop:-8, marginBottom:16 }}>
                    <PasswordStrength password={password} />
                  </div>

                  {/* Confirm Password */}
                  <Field
                    label="Confirm Password"
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={confirmPass}
                    onChange={e => { setConfirmPass(e.target.value); clearErr("confirmPass"); }}
                    icon={<LockIcon />}
                    error={errors.confirmPass}
                    rightSlot={
                      <>
                        {/* Match indicator */}
                        {confirmPass && password && (
                          <span style={{ marginRight:6, color: confirmPass === password ? "#059669" : "#EF4444", display:"flex" }}>
                            {confirmPass === password ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            )}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowConfirm(s => !s)}
                          style={{ background:"none", border:"none", cursor:"pointer", color:"#94A3B8", display:"flex", padding:2 }}
                          aria-label="Toggle confirm password visibility"
                        >
                          <EyeIcon off={showConfirm} />
                        </button>
                      </>
                    }
                  />

                  {/* Terms checkbox */}
                  <div style={{ marginBottom:22, marginTop:4 }}>
                    <label style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}>
                      <div
                        onClick={() => { setAgreed(a => !a); clearErr("agreed"); }}
                        style={{
                          width:18, height:18, borderRadius:5, flexShrink:0, marginTop:1,
                          border:`2px solid ${errors.agreed ? "#EF4444" : agreed ? "#1D4ED8" : "#CBD5E1"}`,
                          background: agreed ? "#1D4ED8" : "#fff",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          transition:"all 0.15s",
                        }}
                      >
                        {agreed && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize:"0.82rem", color:"#475569", lineHeight:1.5 }}>
                        I agree to the{" "}
                        <Link to="/terms"   style={{ color:"#1D4ED8", fontWeight:700, textDecoration:"none" }}>Terms of Service</Link>
                        {" "}and{" "}
                        <Link to="/privacy" style={{ color:"#1D4ED8", fontWeight:700, textDecoration:"none" }}>Privacy Policy</Link>.
                        Your data is safe and never sold.
                      </span>
                    </label>
                    {errors.agreed && (
                      <p style={{ fontSize:"0.77rem", color:"#EF4444", marginTop:5, marginLeft:28 }}>{errors.agreed}</p>
                    )}
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width:"100%", padding:"13px",
                      borderRadius:12, border:"none",
                      background: loading ? "#93C5FD" : "#1D4ED8",
                      color:"#fff", fontSize:"0.97rem", fontWeight:700,
                      cursor: loading ? "not-allowed" : "pointer",
                      fontFamily:"var(--font-body)",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      transition:"all 0.2s",
                      boxShadow: loading ? "none" : "0 4px 20px rgba(29,78,216,0.28)",
                      letterSpacing:"0.01em",
                    }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity="0.92"; e.currentTarget.style.transform="translateY(-1px)"; }}}
                    onMouseLeave={e => { e.currentTarget.style.opacity="1"; e.currentTarget.style.transform="translateY(0)"; }}
                  >
                    {loading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation:"spin 0.8s linear infinite" }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        Creating your account…
                      </>
                    ) : (
                      "Create Free Account"
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
                  <div style={{ flex:1, height:1, background:"#F1F5F9" }}/>
                  <span style={{ fontSize:"0.75rem", color:"#94A3B8", fontWeight:600 }}>or sign up with</span>
                  <div style={{ flex:1, height:1, background:"#F1F5F9" }}/>
                </div>

                {/* Google */}
                <button
                  type="button"
                  style={{
                    width:"100%", padding:"11px", borderRadius:11,
                    border:"1.5px solid #E2E8F0", background:"#fff",
                    color:"#374151", fontSize:"0.87rem", fontWeight:700,
                    cursor:"pointer", fontFamily:"var(--font-body)",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                    transition:"all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background="#F8FAFC"; e.currentTarget.style.borderColor="#CBD5E1"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.borderColor="#E2E8F0"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              {/* Garage owner CTA */}
              <div style={{
                marginTop:20, padding:"16px 20px",
                borderRadius:14, border:"1.5px solid #E2E8F0",
                background:"#fff", display:"flex", alignItems:"center",
                justifyContent:"space-between", gap:12, flexWrap:"wrap",
                boxShadow:"0 1px 6px rgba(15,23,42,0.04)",
              }}>
                <div>
                  <p style={{ fontSize:"0.83rem", fontWeight:700, color:"#0F172A", marginBottom:2 }}>Own a garage?</p>
                  <p style={{ fontSize:"0.78rem", color:"#64748B" }}>Register your business and reach more customers.</p>
                </div>
                <Link
                  to="/register/garage"
                  style={{
                    display:"inline-flex", alignItems:"center", gap:6,
                    padding:"8px 16px", borderRadius:9,
                    background:"#EA580C", color:"#fff",
                    fontSize:"0.82rem", fontWeight:700,
                    textDecoration:"none", whiteSpace:"nowrap",
                    transition:"all 0.15s",
                    flexShrink:0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="#C2410C"}
                  onMouseLeave={e => e.currentTarget.style.background="#EA580C"}
                >
                   Register Garage
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ══════════ RESPONSIVE ══════════ */}
      <style>{`
        @media (max-width: 860px) {
          .reg-panel { display: none !important; }
        }
        @media (max-width: 480px) {
          div[style*="padding: 32px 34px"] {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}