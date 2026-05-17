// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

// ─── Data ────────────────────────────────────────────────────────────────────

const VEHICLE_TYPES = ["All Vehicles", "Car", "Van", "Bus", "Bike", "Three-Wheeler", "Truck", "SUV", "Electric Vehicle"];
const SERVICE_TYPES = ["All Services", "Engine Repair", "Oil Change", "Battery Service", "Tyre Service", "AC Repair", "Electrical Repair", "Painting", "Washing", "Towing", "Brake Repair", "Diagnostics"];
const DISTRICTS     = ["All Districts", "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya"];

const SERVICE_CARDS = [
  { label: "Engine Repair",     color: "#DBEAFE", accent: "#1D4ED8" },
  { label: "Oil Change",        color: "#DBEAFE", accent: "#1D4ED8"   },
  {  label: "Battery Service",   color: "#DBEAFE", accent: "#1D4ED8"  },
  { label: "Tyre Service",      color: "#DBEAFE", accent: "#1D4ED8"  },
  {  label: "AC Repair",         color: "#DBEAFE", accent: "#1D4ED8" },
  {  label: "Electrical Repair", color: "#DBEAFE", accent: "#1D4ED8"  },
  { label: "Painting",         color: "#DBEAFE", accent: "#1D4ED8"  },
  { label: "Washing",           color: "#DBEAFE", accent: "#1D4ED8"  },
  {  label: "Towing",            color: "#DBEAFE", accent: "#1D4ED8"  },
  {label: "Diagnostics",       color: "#DBEAFE", accent: "#1D4ED8"  },
  { label: "Brake Repair",      color: "#DBEAFE", accent: "#1D4ED8"  },
  { label: "Full Service",     color: "#DBEAFE", accent: "#1D4ED8"  },
];

const FEATURED_GARAGES = [
  {
    id: 1,
    name: "City Auto Care",
    district: "Colombo",
    address: "45 Baseline Rd, Colombo 09",
    rating: 4.8,
    reviews: 124,
    services: ["Engine Repair", "Oil Change", "AC Repair"],
    vehicles: ["Car", "Van", "SUV"],
    phone: "+94 77 123 4567",
    badge: "Top Rated",
    badgeColor: "badge-blue",
    open: true,
  },
  {
    id: 2,
    name: "Lanka Motor Works",
    district: "Gampaha",
    address: "12 Kandy Rd, Gampaha",
    rating: 4.6,
    reviews: 89,
    services: ["Tyre Service", "Brake Repair", "Electrical Repair"],
    vehicles: ["Car", "Truck", "Bus"],
    phone: "+94 76 987 6543",
    badge: "Verified",
    badgeColor: "badge-green",
    open: true,
  },
  {
    id: 3,
    name: "EV Tech Solutions",
    district: "Colombo",
    address: "88 Havelock Rd, Colombo 05",
    rating: 4.9,
    reviews: 57,
    services: ["Diagnostics", "Electrical Repair", "Battery Service"],
    vehicles: ["Electric Vehicle", "Car"],
    phone: "+94 71 555 0011",
    badge: "EV Specialist",
    badgeColor: "badge-orange",
    open: false,
  },
];

const STEPS = [
  {
    step: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: "Search Your Service",
    desc: "Select your vehicle type, required service, and your district to find the right garage.",
  },
  {
    step: "02",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: "Find Nearby Garages",
    desc: "Browse verified garages near you with ratings, photos, services, and contact details.",
  },
  {
    step: "03",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.21 3.35 2 2 0 0 1 3.18 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
      </svg>
    ),
    title: "Contact & Get Served",
    desc: "Call the garage directly, get directions on the map, and drive in for your service.",
  },
];

const STATS = [
  { value: "500+",  label: "Registered Garages",  color: "var(--color-primary)" },
  { value: "25",    label: "Districts Covered",    color: "var(--color-success)" },
  { value: "50K+",  label: "Happy Customers",      color: "var(--color-accent)"  },
  { value: "12",    label: "Service Categories",   color: "var(--color-primary)" },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#F59E0B" : "#CBD5E1" }}>★</span>
      ))}
    </span>
  );
}

function GarageCard({ garage }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column" }}>
      {/* Card top color strip */}
      <div style={{ height: 6, background: "linear-gradient(90deg, var(--color-primary), var(--color-success))" }} />

      <div style={{ padding: "var(--space-lg)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-text)" }}>
            {garage.name}
          </h3>
          <span className={`badge ${garage.badgeColor}`}>{garage.badge}</span>
        </div>

        {/* Location */}
        <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", marginBottom: "var(--space-sm)", display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {garage.address}
        </p>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-md)" }}>
          <StarRating rating={garage.rating} />
          <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--color-text)" }}>{garage.rating}</span>
          <span style={{ fontSize: "0.82rem", color: "var(--color-muted)" }}>({garage.reviews} reviews)</span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.78rem",
              fontWeight: 600,
              color: garage.open ? "var(--color-success)" : "#EF4444",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: garage.open ? "var(--color-success)" : "#EF4444", display: "inline-block", animation: garage.open ? "pulse-dot 2s infinite" : "none" }} />
            {garage.open ? "Open Now" : "Closed"}
          </span>
        </div>

        {/* Services */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "var(--space-md)" }}>
          {garage.services.map((s) => (
            <span key={s} style={{ fontSize: "0.77rem", fontWeight: 500, padding: "3px 9px", borderRadius: "var(--radius-full)", background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
              {s}
            </span>
          ))}
        </div>

        {/* Vehicle types */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "var(--space-lg)" }}>
          {garage.vehicles.map((v) => (
            <span key={v} style={{ fontSize: "0.77rem", fontWeight: 500, padding: "3px 9px", borderRadius: "var(--radius-full)", background: "var(--color-success-light)", color: "var(--color-success)" }}>
              {v}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "var(--space-sm)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-md)" }}>
          <a
            href={`tel:${garage.phone}`}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.21 3.35 2 2 0 0 1 3.18 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
            </svg>
            Call
          </a>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>View Details</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const [vehicle,  setVehicle]  = useState("");
  const [service,  setService]  = useState("");
  const [district, setDistrict] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (vehicle  && vehicle  !== "All Vehicles") params.set("vehicle",  vehicle);
    if (service  && service  !== "All Services") params.set("service",  service);
    if (district && district !== "All Districts") params.set("district", district);
    navigate(`/search?${params.toString()}`);
  }

  const selectStyle = {
    width: "100%",
    padding: "12px var(--space-md)",
    border: "1.5px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    fontSize: "0.95rem",
    color: "var(--color-text)",
    background: "var(--color-surface)",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: "38px",
    transition: "border-color var(--transition-fast)",
  };

  return (
    <main>

      {/* ══════════ HERO SECTION ══════════ */}
      <section
        style={{
          background: "linear-gradient(150deg, #29344b 0%, #1E3A8A 55%, #202121 100%)",
          paddingTop:    "var(--space-3xl)",
          paddingBottom: "calc(var(--space-3xl) + 40px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background circles */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: 450, height: 450, borderRadius: "50%", background: "rgba(87, 90, 98, 0.15)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-80px",  width: 350, height: 350, borderRadius: "50%", background: "rgba(5,150,105,0.12)",  filter: "blur(50px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", left: "30%", width: 200, height: 200, borderRadius: "50%", background: "rgba(234,88,12,0.08)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>

          {/* Label pill */}
          <div className="animate-fade-up" style={{ marginBottom: "var(--space-lg)", display: "flex", justifyContent: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(146, 147, 151, 0.25)", border: "1px solid rgba(96,165,250,0.3)", color: "#93C5FD", padding: "6px 16px", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
              Sri Lanka's #1 Garage Finder
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-up-delay-1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 4vw, 4rem)",
              fontWeight: 800,
              color: "#fff",
              marginBottom: "var(--space-lg)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Find the Right Garage<br />
            <span style={{ color: "#60A5FA" }}>for Your Vehicle, </span>
            <span style={{ color: "#34D399" }}> Near You</span>
          </h1>

          <p
            className="animate-fade-up-delay-2"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", color: "#94A3B8", marginBottom: "var(--space-2xl)", maxWidth: 540, marginInline: "auto", lineHeight: 1.7 }}
          >
            Search verified garages by vehicle type, service, and district. Fast, reliable, and always near you.
          </p>

          {/* ── Search Card ── */}
          <div
            className="animate-fade-up-delay-3"
            style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-lg)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
              maxWidth: 820,
              marginInline: "auto",
            }}
          >
            <form onSubmit={handleSearch}>
              <div className="search-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "var(--space-md)", alignItems: "end" }}>

                {/* Vehicle Type */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Vehicle Type</label>
                  <select
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    style={selectStyle}
                    onFocus={(e)  => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e)   => e.target.style.borderColor = "var(--color-border)"}
                  >
                    {VEHICLE_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* Service Type */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Service Needed</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    style={selectStyle}
                    onFocus={(e)  => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e)   => e.target.style.borderColor = "var(--color-border)"}
                  >
                    {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    style={selectStyle}
                    onFocus={(e)  => e.target.style.borderColor = "var(--color-primary)"}
                    onBlur={(e)   => e.target.style.borderColor = "var(--color-border)"}
                  >
                    {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  style={{ whiteSpace: "nowrap", paddingInline: "var(--space-xl)" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Search
                </button>
              </div>
            </form>

            {/* Quick tags */}
            <div style={{ marginTop: "var(--space-md)", display: "flex", alignItems: "center", gap: "var(--space-sm)", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--color-muted)", fontWeight: 500 }}>Popular:</span>
              {["Oil Change – Colombo", "Engine Repair – Kandy", "EV Service – Colombo"].map((tag) => (
                <button
                  key={tag}
                  className="badge badge-blue"
                  style={{ cursor: "pointer", border: "none", fontSize: "0.8rem" }}
                  onClick={() => {
                    const parts = tag.split(" – ");
                    setService(parts[0]);
                    if (parts[1]) setDistrict(parts[1]);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Trust line */}
          <p className="animate-fade-up-delay-4" style={{ marginTop: "var(--space-lg)", fontSize: "0.85rem", color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)", flexWrap: "wrap" }}>
            <span>✅ Free to use</span>
            <span style={{ color: "#334155" }}>·</span>
            <span>✅ Verified garages</span>
            <span style={{ color: "#334155" }}>·</span>
            <span>✅ All districts in Sri Lanka</span>
          </p>
        </div>
      </section>

      

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
            <span className="section-label">Simple Process</span>
            <h2 className="section-title">How GarageFinder Works</h2>
            <div className="divider" style={{ marginInline: "auto" }} />
            <p className="section-subtitle" style={{ marginInline: "auto" }}>
              Find and contact a trusted garage in under a minute — no sign-up needed for customers.
            </p>
          </div>

          <div
            className="steps-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-xl)", position: "relative" }}
          >
            {/* Connector line (desktop only) */}
            <div
              className="steps-connector"
              style={{
                position: "absolute",
                top: 52,
                left: "calc(16.67% + 24px)",
                right: "calc(16.67% + 24px)",
                height: 2,
                background: "linear-gradient(90deg, var(--color-primary), var(--color-success))",
                zIndex: 0,
              }}
            />

            {STEPS.map((step, i) => (
              <div key={step.step} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                {/* Icon circle */}
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: i === 0 ? "var(--color-primary)" : i === 1 ? "var(--color-success)" : "var(--color-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginInline: "auto",
                    marginBottom: "var(--space-lg)",
                    color: "#fff",
                    boxShadow: `0 8px 24px ${i === 0 ? "rgba(29,78,216,0.25)" : i === 1 ? "rgba(5,150,105,0.25)" : "rgba(234,88,12,0.25)"}`,
                    border: "4px solid var(--color-bg)",
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-muted)", letterSpacing: "0.12em", marginBottom: 6 }}>
                  STEP {step.step}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, marginBottom: "var(--space-sm)" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.93rem", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SERVICE CATEGORIES ══════════ */}
      <section className="section" style={{ background: "var(--color-surface)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--space-md)", marginBottom: "var(--space-2xl)" }}>
            <div>
              <span className="section-label">What We Cover</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Service Categories</h2>
            </div>
            <button className="btn btn-outline btn-sm">Browse All Services</button>
          </div>

          <div
            className="services-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "var(--space-md)" }}
          >
            {SERVICE_CARDS.map(({  label, color, accent }) => (
              <button
                key={label}
                style={{
                  background: color,
                  border: "1.5px solid transparent",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-lg) var(--space-md)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all var(--transition-normal)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--space-sm)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${accent}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => navigate(`/search?service=${encodeURIComponent(label)}`)}
              >
                <span style={{ fontSize: "2rem", lineHeight: 1 }}></span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: accent, lineHeight: 1.3 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURED GARAGES ══════════ */}
      <section className="section" style={{ background: "var(--color-bg)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "var(--space-md)", marginBottom: "var(--space-2xl)" }}>
            <div>
              <span className="section-label">Top Picks</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Featured Garages</h2>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate("/search")}>View All Garages</button>
          </div>

          <div
            className="garages-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-lg)" }}
          >
            {FEATURED_GARAGES.map((garage) => (
              <GarageCard key={garage.id} garage={garage} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ GARAGE OWNER CTA ══════════ */}
      <section className="section" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#BFDBFE", padding: "4px 14px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "var(--space-md)" }}>
            For Garage Owners
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "#fff", marginBottom: "var(--space-md)", lineHeight: 1.15 }}>
            Grow Your Garage Business<br />with GarageFinder
          </h2>
          <p style={{ fontSize: "1.05rem", color: "#BFDBFE", marginBottom: "var(--space-xl)", maxWidth: 520, marginInline: "auto", lineHeight: 1.7 }}>
            List your garage for free. Reach thousands of vehicle owners in your district. First month subscription free.
          </p>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="btn btn-lg"
              style={{ background: "#fff", color: "var(--color-primary)", fontWeight: 700 }}
              onClick={() => navigate("/register")}
            >
              Register Your Garage — Free
            </button>
            <button className="btn btn-lg btn-outline" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }} onClick={() => navigate("/about")}>
              Learn More
            </button>
          </div>
          <p style={{ marginTop: "var(--space-lg)", fontSize: "0.85rem", color: "#93C5FD" }}>
            ✓ No setup fee &nbsp;·&nbsp; ✓ First month free &nbsp;·&nbsp; ✓ Cancel anytime
          </p>
        </div>
      </section>

     <style>{`
  @media (max-width: 700px) {
    .search-grid {
      grid-template-columns: 1fr !important;
    }
  }

  /* Stats */
  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }

    .stats-grid > div:nth-child(2) {
      border-right: none !important;
    }

    .stats-grid > div:nth-child(1),
    .stats-grid > div:nth-child(2) {
      border-bottom: 1px solid var(--color-border);
    }
  }

  /* Steps */
  @media (max-width: 760px) {
    .steps-grid {
      grid-template-columns: 1fr !important;
    }
    .steps-connector {
      display: none !important;
    }
  }

  /* Services */
  @media (max-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(4, 1fr) !important;
    }
  }

  @media (max-width: 640px) {
    .services-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }

  @media (max-width: 400px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  /* Garages */
  @media (max-width: 900px) {
    .garages-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }

  @media (max-width: 560px) {
    .garages-grid {
      grid-template-columns: 1fr !important;
    }
  }
`}</style>
    </main>
  );
}