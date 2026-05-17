// src/pages/GarageRegister.jsx
// Route: /register/garage
// Multi-section single-page form for garage owners


import { useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";


// ─── Constants ────────────────────────────────────────────────────────────────
const DISTRICTS = [
  "Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya",
  "Galle","Matara","Hambantota","Jaffna","Kilinochchi","Mannar",
  "Vavuniya","Mullaitivu","Batticaloa","Ampara","Trincomalee",
  "Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla",
  "Moneragala","Ratnapura","Kegalle",
];

const SERVICES = [
  { id: "oil",        label: "Oil Change",       emoji: "🛢️" },
  { id: "engine",     label: "Engine Repair",    emoji: "🔧" },
  { id: "battery",    label: "Battery Service",  emoji: "🔋" },
  { id: "ac",         label: "AC Repair",        emoji: "❄️" },
  { id: "alignment",  label: "Wheel Alignment",  emoji: "⚙️" },
  { id: "painting",   label: "Painting",         emoji: "🎨" },
  { id: "washing",    label: "Washing",          emoji: "🚿" },
  { id: "diagnostics",label: "Diagnostics",      emoji: "🔍" },
  { id: "tyre",       label: "Tyre Service",     emoji: "🛞" },
  { id: "brake",      label: "Brake Repair",     emoji: "🛑" },
  { id: "towing",     label: "Towing",           emoji: "🚗" },
  { id: "electrical", label: "Electrical",       emoji: "⚡" },
];

const VEHICLES = [
  { id: "car",   label: "Car",              emoji: "🚗" },
  { id: "bike",  label: "Bike",             emoji: "🏍️" },
  { id: "van",   label: "Van",              emoji: "🚐" },
  { id: "suv",   label: "SUV",              emoji: "🚙" },
  { id: "truck", label: "Truck",            emoji: "🚛" },
  { id: "ev",    label: "Electric Vehicle", emoji: "⚡" },
  { id: "bus",   label: "Bus",              emoji: "🚌" },
  { id: "three", label: "Three-Wheeler",    emoji: "🛺" },
];

const SECTIONS = [
  { id: "basic",    label: "Basic Info",     icon: "🏪" },
  { id: "services", label: "Services",       icon: "🔧" },
  { id: "vehicles", label: "Vehicle Types",  icon: "🚗" },
  { id: "hours",    label: "Working Hours",  icon: "🕐" },
  { id: "photos",   label: "Photos",         icon: "📸" },
];

const MAX_PHOTOS = 10;

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const CheckIcon   = () => <Icon><polyline points="20 6 9 17 4 12"/></Icon>;
const UploadIcon  = () => <Icon size={32}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></Icon>;
const XIcon       = () => <Icon size={14}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>;
const InfoIcon    = () => <Icon size={14}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Icon>;
const WrenchSVG   = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

// ─── Reusable Field ───────────────────────────────────────────────────────────
function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label style={{
          display: "block", fontSize: "0.83rem", fontWeight: 700,
          color: "#374151", marginBottom: 7, letterSpacing: "0.01em",
        }}>
          {label}
          {required && <span style={{ color: "#EA580C", marginLeft: 3 }}>*</span>}
        </label>
      )}
      {children}
      {error && (
        <p style={{ fontSize: "0.77rem", color: "#EF4444", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#EF4444"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="white" strokeWidth="2"/></svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ fontSize: "0.77rem", color: "#94A3B8", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <InfoIcon /> {hint}
        </p>
      )}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", error, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "12px 14px", borderRadius: 11,
        border: `1.5px solid ${error ? "#EF4444" : focused ? "#1D4ED8" : "#E2E8F0"}`,
        background: error ? "#FEF2F2" : focused ? "#FAFBFF" : "#F8FAFC",
        fontSize: "0.93rem", color: "#0F172A", outline: "none",
        transition: "all 0.18s", fontFamily: "var(--font-body)",
        boxShadow: focused ? "0 0 0 3px rgba(29,78,216,0.08)" : "none",
      }}
      {...rest}
    />
  );
}

function Select({ value, onChange, children, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "12px 36px 12px 14px", borderRadius: 11,
        border: `1.5px solid ${error ? "#EF4444" : focused ? "#1D4ED8" : "#E2E8F0"}`,
        background: error ? "#FEF2F2" : "#F8FAFC",
        fontSize: "0.93rem", color: value ? "#0F172A" : "#94A3B8",
        outline: "none", cursor: "pointer", fontFamily: "var(--font-body)",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
        boxShadow: focused ? "0 0 0 3px rgba(29,78,216,0.08)" : "none",
        transition: "all 0.18s",
      }}
    >
      {children}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4, error }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "12px 14px", borderRadius: 11, resize: "vertical",
        border: `1.5px solid ${error ? "#EF4444" : focused ? "#1D4ED8" : "#E2E8F0"}`,
        background: error ? "#FEF2F2" : focused ? "#FAFBFF" : "#F8FAFC",
        fontSize: "0.93rem", color: "#0F172A", outline: "none",
        transition: "all 0.18s", fontFamily: "var(--font-body)", lineHeight: 1.6,
        boxShadow: focused ? "0 0 0 3px rgba(29,78,216,0.08)" : "none",
      }}
    />
  );
}

// Section card wrapper
function SectionCard({ id, icon, title, subtitle, children, sectionRef }) {
  return (
    <div
      id={id}
      ref={sectionRef}
      style={{
        background: "#fff", borderRadius: 20,
        border: "1px solid #E2E8F0",
        boxShadow: "0 2px 16px rgba(15,23,42,0.05)",
        marginBottom: 24, overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div style={{
        padding: "20px 28px 18px",
        borderBottom: "1px solid #F1F5F9",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
          border: "1px solid #BFDBFE",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.15rem", flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: 1 }}>{title}</h3>
          {subtitle && <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ padding: "24px 28px" }}>{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GarageRegister() {
  const navigate  = useNavigate();
  const fileInput = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // ── Form state ──
  const [form, setForm] = useState({
    garageName: "", ownerName: "", phone: "", email: "",
    district: "", address: "", description: "",
    openTime: "08:00", closeTime: "18:00",
    workingDays: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
  });
  const [services,  setServices]  = useState([]);
  const [vehicles,  setVehicles]  = useState([]);
  const [photos,    setPhotos]    = useState([]); // { file, preview, id }
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  // ── Helpers ──
  const setField = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const toggleService = (id) =>
    setServices(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const toggleVehicle = (id) =>
    setVehicles(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);

  const toggleDay = (day) =>
    setForm(f => ({ ...f, workingDays: { ...f.workingDays, [day]: !f.workingDays[day] } }));

  // ── Photo handling ──
  const addPhotos = useCallback((files) => {
    const remaining = MAX_PHOTOS - photos.length;
    const newFiles  = Array.from(files).slice(0, remaining).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos(p => [...p, ...newFiles]);
    setErrors(e => ({ ...e, photos: "" }));
  }, [photos.length]);

  const removePhoto = (id) => {
    setPhotos(p => {
      const removed = p.find(x => x.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return p.filter(x => x.id !== id);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files) addPhotos(e.dataTransfer.files);
  };

  // ── Validation ──
  const validate = () => {
    const e = {};
    if (!form.garageName.trim())  e.garageName = "Garage name is required.";
    if (!form.ownerName.trim())   e.ownerName  = "Owner name is required.";
    if (!form.phone.trim())       e.phone      = "Phone number is required.";
    else if (!/^(\+94|0)[0-9]{9}$/.test(form.phone.replace(/\s/g, "")))
                                  e.phone      = "Enter a valid Sri Lankan phone number.";
    if (!form.email.trim())       e.email      = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
                                  e.email      = "Enter a valid email address.";
    if (!form.district)           e.district   = "Please select your district.";
    if (!form.address.trim())     e.address    = "Address is required.";
    if (services.length === 0)    e.services   = "Select at least one service.";
    if (vehicles.length === 0)    e.vehicles   = "Select at least one vehicle type.";
    return e;
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length) {
      // Scroll to first error
      const firstErrKey = Object.keys(errs)[0];
      const el = document.getElementById(firstErrKey);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    // TODO: Replace with real API call
    // const formData = new FormData();
    // Object.entries(form).forEach(([k, v]) => formData.append(k, typeof v === "object" ? JSON.stringify(v) : v));
    // services.forEach(s => formData.append("services", s));
    // vehicles.forEach(v => formData.append("vehicles", v));
    // photos.forEach(p => formData.append("photos", p.file));
    // await axios.post("/api/garages", formData, { headers: { "Content-Type": "multipart/form-data" } });
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
  };

  const completedSections = [
    form.garageName && form.ownerName && form.phone && form.email && form.district && form.address,
    services.length > 0,
    vehicles.length > 0,
    true, // hours always valid
    photos.length > 0,
  ].filter(Boolean).length;

  const progressPct = Math.round((completedSections / SECTIONS.length) * 100);

  // ─── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (success) {
    return (
      <>
       
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#F0F4F8" }}>
          <div style={{
            background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0",
            boxShadow: "0 8px 40px rgba(15,23,42,0.1)",
            padding: "60px 48px", textAlign: "center", maxWidth: 480, width: "100%",
            animation: "scaleIn 0.35s ease both",
          }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(5,150,105,0.2)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>
              Garage Registered! 🎉
            </h2>
            <p style={{ color: "#64748B", fontSize: "0.93rem", lineHeight: 1.7, marginBottom: 10 }}>
              <strong style={{ color: "#0F172A" }}>{form.garageName}</strong> has been submitted for review. Our team will verify and approve your listing within <strong>24–48 hours</strong>.
            </p>
            <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 20px", marginBottom: 28, border: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  ["District", form.district],
                  ["Services", `${services.length} services selected`],
                  ["Vehicle Types", `${vehicles.length} types selected`],
                  ["Photos", `${photos.length} photo${photos.length !== 1 ? "s" : ""} uploaded`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.83rem" }}>
                    <span style={{ color: "#94A3B8" }}>{k}</span>
                    <span style={{ fontWeight: 700, color: "#334155" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
              <button
                onClick={() => navigate("/")}
                style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "#1D4ED8", color: "#fff", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)" }}
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/login")}
                style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "transparent", color: "#475569", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
        <style>{`@keyframes scaleIn { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }`}</style>
      </>
    );
  }

  // ─── MAIN FORM ─────────────────────────────────────────────────────────────
  return (
    <>
     

      <div style={{ background: "#F0F4F8", minHeight: "100vh", paddingBottom: 60 }}>

        {/* ── Page Header ── */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 55%, #1D4ED8 100%)",
          padding: "44px 24px 56px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(29,78,216,0.18)", filter: "blur(50px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "15%", width: 200, height: 200, borderRadius: "50%", background: "rgba(5,150,105,0.1)", filter: "blur(40px)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1, textAlign: "center" }}>
            {/* Badge pills */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
              {[
                { label: " Free Listing",          bg: "rgba(5,150,105,0.2)",  color: "#6EE7B7" },
                { label: " Easy Registration",     bg: "rgba(5,150,105,0.2)",  color: "#6EE7B7" },
                { label: " Verified by our team", bg: "rgba(5,150,105,0.2)",  color: "#6EE7B7"},
              ].map(b => (
                <span key={b.label} style={{ fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: b.bg, color: b.color, border: "1px solid rgba(255,255,255,0.1)" }}>
                  {b.label}
                </span>
              ))}
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Register Your Garage
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "clamp(0.9rem, 2vw, 1rem)", maxWidth: 440, marginInline: "auto", lineHeight: 1.7 }}>
              Join Sri Lanka's trusted vehicle service platform and reach thousands of customers near you.
            </p>

            {/* Progress bar */}
            <div style={{ maxWidth: 420, margin: "28px auto 0", background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, #60A5FA)", borderRadius: 999, transition: "width 0.4s ease" }} />
            </div>
            <p style={{ color: "#64748B", fontSize: "0.78rem", marginTop: 6 }}>
              {progressPct}% complete — {completedSections} of {SECTIONS.length} sections done
            </p>
          </div>

          {/* Wave */}
          <div style={{ position: "absolute", bottom: -1, left: 0, right: 0 }}>
            <svg viewBox="0 0 1440 28" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
              <path d="M0 28C360 8 720 0 1080 0C1260 0 1380 6 1440 28H0Z" fill="#F0F4F8"/>
            </svg>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 0", display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, alignItems: "start" }} className="gr-layout">

          {/* ════ LEFT — Nav sidebar ════ */}
          <aside className="gr-sidebar" style={{ position: "sticky", top: 82 }}>
            <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "16px 14px", marginBottom: 16 }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 10, paddingLeft: 6 }}>Form Sections</p>
              {SECTIONS.map((sec, i) => {
                const done = [
                  form.garageName && form.ownerName && form.phone && form.email && form.district && form.address,
                  services.length > 0,
                  vehicles.length > 0,
                  true,
                  photos.length > 0,
                ][i];
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={e => { e.preventDefault(); document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); setActiveSection(sec.id); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "9px 10px", borderRadius: 10,
                      background: activeSection === sec.id ? "#EFF6FF" : "transparent",
                      border: `1.5px solid ${activeSection === sec.id ? "#BFDBFE" : "transparent"}`,
                      textDecoration: "none", marginBottom: 4,
                      transition: "all 0.15s", cursor: "pointer",
                    }}
                    onMouseEnter={e => { if (activeSection !== sec.id) e.currentTarget.style.background = "#F8FAFC"; }}
                    onMouseLeave={e => { if (activeSection !== sec.id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                      background: done ? "#D1FAE5" : "#F1F5F9",
                      border: `2px solid ${done ? "#059669" : "#E2E8F0"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.65rem", color: done ? "#059669" : "#94A3B8",
                      transition: "all 0.2s",
                    }}>
                      {done ? <CheckIcon /> : <span style={{ fontWeight: 800 }}>{i + 1}</span>}
                    </div>
                    <span style={{ fontSize: "0.83rem", fontWeight: activeSection === sec.id ? 700 : 500, color: activeSection === sec.id ? "#1D4ED8" : "#475569" }}>
                      {sec.label}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Help card */}
            <div style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)", borderRadius: 16, border: "1px solid #BFDBFE", padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <WrenchSVG />
              </div>
              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1E3A8A", marginBottom: 4 }}>Need Help?</p>
              <p style={{ fontSize: "0.78rem", color: "#3B82F6", lineHeight: 1.5, marginBottom: 10 }}>
                Our team is ready to assist you with your registration.
              </p>
              <a href="tel:+94112345678" style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1D4ED8", textDecoration: "none" }}>
                📞 +94 11 234 5678
              </a>
            </div>
          </aside>

          {/* ════ RIGHT — Form ════ */}
          <form onSubmit={handleSubmit} noValidate>

            {/* ── 1. Basic Information ── */}
            <SectionCard id="basic"  title="Basic Information" subtitle="Your garage's identity on the platform">
              <div className="gr-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <Field label="Garage Name" required error={errors.garageName}>
                  <Input id="garageName" value={form.garageName} onChange={e => setField("garageName", e.target.value)} placeholder="e.g. City Auto Care Center" error={errors.garageName} />
                </Field>
                <Field label="Owner Name" required error={errors.ownerName}>
                  <Input id="ownerName" value={form.ownerName} onChange={e => setField("ownerName", e.target.value)} placeholder="e.g. Kamal Perera" error={errors.ownerName} />
                </Field>
                <Field label="Phone Number" required error={errors.phone} hint="e.g. +94 77 123 4567 or 077 123 4567">
                  <Input id="phone" type="tel" value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="+94 77 123 4567" error={errors.phone} />
                </Field>
                <Field label="Email Address" required error={errors.email}>
                  <Input id="email" type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="garage@gmail.com" error={errors.email} />
                </Field>
                <Field label="District" required error={errors.district}>
                  <Select id="district" value={form.district} onChange={e => setField("district", e.target.value)} error={errors.district}>
                    <option value="">— Select District —</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </Field>
                <Field label="Address" required error={errors.address}>
                  <Input id="address" value={form.address} onChange={e => setField("address", e.target.value)} placeholder="Street, City" error={errors.address} />
                </Field>
              </div>
              <Field label="Garage Description" hint="Describe your garage, specialties, experience — helps customers trust you more.">
                <Textarea value={form.description} onChange={e => setField("description", e.target.value)} placeholder="e.g. We are a family-run garage with 15 years of experience in multi-brand vehicle servicing. Fully equipped with modern diagnostic tools..." rows={4} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                  <span style={{ fontSize: "0.75rem", color: form.description.length > 500 ? "#EA580C" : "#94A3B8" }}>
                    {form.description.length}/600
                  </span>
                </div>
              </Field>
            </SectionCard>

            {/* ── 2. Services ── */}
            <SectionCard id="services" title="Services Provided" subtitle="Select all services your garage offers">
              {errors.services && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.83rem", color: "#EF4444", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/></svg>
                  {errors.services}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                {SERVICES.map(svc => {
                  const active = services.includes(svc.id);
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => { toggleService(svc.id); setErrors(e => ({ ...e, services: "" })); }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 7, padding: "14px 10px", borderRadius: 13, cursor: "pointer",
                        border: `2px solid ${active ? "#1D4ED8" : "#E2E8F0"}`,
                        background: active ? "#EFF6FF" : "#F8FAFC",
                        transition: "all 0.18s", position: "relative",
                        fontFamily: "var(--font-body)",
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "#93C5FD"; e.currentTarget.style.background = "#F0F9FF"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.transform = "translateY(0)"; } }}
                    >
                      {active && (
                        <div style={{ position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: "50%", background: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      )}
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: active ? "#1D4ED8" : "#475569", textAlign: "center", lineHeight: 1.3 }}>{svc.label}</span>
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: 12 }}>
                {services.length} service{services.length !== 1 ? "s" : ""} selected
              </p>
            </SectionCard>

            {/* ── 3. Vehicle Types ── */}
            <SectionCard id="vehicles"  title="Supported Vehicle Types" subtitle="Which vehicles does your garage service?">
              {errors.vehicles && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: "0.83rem", color: "#EF4444", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2"/></svg>
                  {errors.vehicles}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 12 }}>
                {VEHICLES.map(veh => {
                  const active = vehicles.includes(veh.id);
                  return (
                    <button
                      key={veh.id}
                      type="button"
                      onClick={() => { toggleVehicle(veh.id); setErrors(e => ({ ...e, vehicles: "" })); }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 8, padding: "18px 10px", borderRadius: 14, cursor: "pointer",
                        border: `2px solid ${active ? "#059669" : "#E2E8F0"}`,
                        background: active ? "#D1FAE5" : "#F8FAFC",
                        transition: "all 0.2s", position: "relative",
                        fontFamily: "var(--font-body)",
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "#6EE7B7"; e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(5,150,105,0.1)"; } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; } }}
                    >
                      {active && (
                        <div style={{ position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: "50%", background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                      )}
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: active ? "#065F46" : "#475569", textAlign: "center" }}>{veh.label}</span>
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: "0.78rem", color: "#94A3B8", marginTop: 12 }}>
                {vehicles.length} vehicle type{vehicles.length !== 1 ? "s" : ""} selected
              </p>
            </SectionCard>

            {/* ── 4. Working Hours ── */}
            <SectionCard id="hours" title="Working Hours" subtitle="Let customers know when you're open">
              {/* Days */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: "0.83rem", fontWeight: 700, color: "#374151", marginBottom: 10 }}>Working Days</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { key: "mon", label: "Mon" }, { key: "tue", label: "Tue" },
                    { key: "wed", label: "Wed" }, { key: "thu", label: "Thu" },
                    { key: "fri", label: "Fri" }, { key: "sat", label: "Sat" },
                    { key: "sun", label: "Sun" },
                  ].map(day => {
                    const on = form.workingDays[day.key];
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleDay(day.key)}
                        style={{
                          width: 52, height: 44, borderRadius: 10,
                          border: `2px solid ${on ? "#1D4ED8" : "#E2E8F0"}`,
                          background: on ? "#1D4ED8" : "#F8FAFC",
                          color: on ? "#fff" : "#64748B",
                          fontSize: "0.8rem", fontWeight: 700,
                          cursor: "pointer", transition: "all 0.15s",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time pickers */}
              <div className="gr-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                <Field label="Opening Time">
                  <Input
                    type="time"
                    value={form.openTime}
                    onChange={e => setField("openTime", e.target.value)}
                  />
                </Field>
                <Field label="Closing Time">
                  <Input
                    type="time"
                    value={form.closeTime}
                    onChange={e => setField("closeTime", e.target.value)}
                  />
                </Field>
              </div>

              {/* Preview */}
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "12px 16px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "1rem" }}>🕐</span>
                <div>
                  <span style={{ fontSize: "0.83rem", fontWeight: 700, color: "#0F172A" }}>
                    {form.openTime} – {form.closeTime}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#94A3B8", marginLeft: 8 }}>
                    · {Object.entries(form.workingDays).filter(([,v]) => v).length} days/week
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* ── 5. Photos ── */}
            <SectionCard id="photos" title="Garage Photos" subtitle="Upload photos of your garage, equipment, and team (up to 10)">
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => photos.length < MAX_PHOTOS && fileInput.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "#1D4ED8" : photos.length >= MAX_PHOTOS ? "#CBD5E1" : "#BFDBFE"}`,
                  borderRadius: 16,
                  padding: "36px 24px",
                  textAlign: "center",
                  background: dragOver ? "#EFF6FF" : photos.length >= MAX_PHOTOS ? "#F8FAFC" : "#FAFBFF",
                  cursor: photos.length < MAX_PHOTOS ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  marginBottom: 20,
                }}
              >
                <div style={{ color: dragOver ? "#1D4ED8" : "#94A3B8", marginBottom: 10, display: "flex", justifyContent: "center" }}>
                  <UploadIcon />
                </div>
                <p style={{ fontWeight: 700, color: "#334155", fontSize: "0.95rem", marginBottom: 4 }}>
                  {photos.length >= MAX_PHOTOS
                    ? "Maximum photos reached"
                    : dragOver ? "Drop photos here!" : "Drag & drop photos here"}
                </p>
                <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginBottom: 14 }}>
                  or click to browse · JPG, PNG, WEBP · Max 5MB each
                </p>
                {photos.length < MAX_PHOTOS && (
                  <span style={{ display: "inline-block", padding: "8px 20px", borderRadius: 9, background: "#1D4ED8", color: "#fff", fontSize: "0.83rem", fontWeight: 700 }}>
                    Choose Photos
                  </span>
                )}

                {/* Counter */}
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <div style={{ flex: 1, maxWidth: 160, height: 5, background: "#E2E8F0", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(photos.length / MAX_PHOTOS) * 100}%`, background: photos.length >= MAX_PHOTOS ? "#059669" : "#1D4ED8", borderRadius: 999, transition: "width 0.3s" }} />
                  </div>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: photos.length >= MAX_PHOTOS ? "#059669" : "#64748B" }}>
                    {photos.length} / {MAX_PHOTOS} photos
                  </span>
                </div>

                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={e => { if (e.target.files) addPhotos(e.target.files); e.target.value = ""; }}
                />
              </div>

              {/* Photo grid */}
              {photos.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
                  {photos.map((photo, idx) => (
                    <div key={photo.id} style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "1", border: "2px solid #E2E8F0", background: "#F1F5F9" }}>
                      <img src={photo.preview} alt={`Upload ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      {/* Index badge */}
                      <div style={{ position: "absolute", bottom: 5, left: 5, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>
                        {idx + 1}
                      </div>
                      {/* Remove btn */}
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        style={{
                          position: "absolute", top: 5, right: 5,
                          width: 22, height: 22, borderRadius: "50%",
                          background: "rgba(239,68,68,0.9)", border: "none",
                          color: "#fff", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      >
                        <XIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* ── Submit ── */}
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", boxShadow: "0 2px 16px rgba(15,23,42,0.05)", padding: "28px" }}>
              {/* Summary */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 24 }}>
                {[
                  { label: "Services",      value: services.length,  unit: "selected",  color: "#1D4ED8", bg: "#EFF6FF" },
                  { label: "Vehicle Types", value: vehicles.length,  unit: "selected",  color: "#059669", bg: "#D1FAE5" },
                  { label: "Photos",        value: photos.length,    unit: "uploaded",  color: "#EA580C", bg: "#FFF7ED" },
                ].map(s => (
                  <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "12px 14px", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: "0.72rem", color: s.color, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{s.unit}</div>
                  </div>
                ))}
              </div>

              {/* Terms */}
              <p style={{ fontSize: "0.8rem", color: "#94A3B8", textAlign: "center", marginBottom: 18, lineHeight: 1.6 }}>
                By registering, you agree to our{" "}
                <Link to="/terms" style={{ color: "#1D4ED8", fontWeight: 700 }}>Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" style={{ color: "#1D4ED8", fontWeight: 700 }}>Privacy Policy</Link>.
                Your listing will be reviewed within 24–48 hours.
              </p>

              {/* Big submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "15px", borderRadius: 13, border: "none",
                  background: loading ? "#93C5FD" : "linear-gradient(135deg, #1D4ED8 )",
                  color: "#fff", fontSize: "1.05rem", fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-body)", letterSpacing: "0.01em",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  transition: "all 0.2s",
                  boxShadow: loading ? "none" : "0 6px 24px rgba(29,78,216,0.28)",
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.opacity = "0.93"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {loading ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Submitting Registration…
                  </>
                ) : (
                  <> Register Garage — It's Free</>
                )}
              </button>

              <p style={{ textAlign: "center", marginTop: 14, fontSize: "0.8rem", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                <span>✅ Free listing</span>
                <span>·</span>
                <span>✅ No credit card needed</span>
                <span>·</span>
                <span>✅ Cancel anytime</span>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* ── Responsive CSS ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }

        /* Collapse sidebar on tablet */
        @media (max-width: 860px) {
          .gr-layout  { grid-template-columns: 1fr !important; }
          .gr-sidebar { display: none !important; }
        }

        /* Single column inputs on mobile */
        @media (max-width: 560px) {
          .gr-two-col { grid-template-columns: 1fr !important; }
          div[style*="padding: 24px 28px"] { padding: 18px 16px !important; }
          div[style*="padding: 28px"] { padding: 20px 16px !important; }
        }
      `}</style>

    
    </>
  );
}