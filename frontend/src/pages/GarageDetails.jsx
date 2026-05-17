// src/pages/GarageDetails.jsx
// Requires: react-router-dom, src/styles/global.css, Navbar, Footer already built
// Place this at route: /garage/:id

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";


// ─── Mock Data (replace with API call using useParams id) ─────────────────────
const GARAGE = {
  id: 1,
  name: "City Auto Care Center",
  tagline: "Colombo's Most Trusted Multi-Brand Service Center Since 2008",
  district: "Colombo 09",
  address: "45 Baseline Road, Colombo 09, Western Province",
  phone: "+94 77 123 4567",
  phone2: "+94 11 234 5678",
  email: "info@cityautocare.lk",
  website: "www.cityautocare.lk",
  rating: 4.8,
  reviewCount: 124,
  isOpen: true,
  openTime: "7:30 AM",
  closeTime: "7:00 PM",
  workingDays: "Mon – Sat",
  established: "2008",
  mapUrl: "https://maps.google.com",
  about: `City Auto Care Center is one of Colombo's most established multi-brand vehicle service centers, operating since 2008 with a team of over 20 certified technicians. We combine modern diagnostic equipment with old-school attention to detail — every vehicle is treated as if it belongs to one of our own.

Our 8,000 sq ft facility is equipped with the latest alignment rigs, AC recharging stations, computerized engine diagnostics, and a dedicated EV service bay. Whether you drive a daily commuter or a high-end import, we have the expertise and tools to get you back on the road — right the first time.`,
  services: [
    { name: "Engine Repair",      icon: "🔧", popular: true  },
    { name: "Oil Change",         icon: "🛢️", popular: true  },
    { name: "AC Repair",          icon: "❄️", popular: false },
    { name: "Battery Service",    icon: "🔋", popular: false },
    { name: "Tyre Service",       icon: "🛞", popular: true  },
    { name: "Brake Repair",       icon: "🛑", popular: false },
    { name: "Electrical Repair",  icon: "⚡", popular: false },
    { name: "Full Diagnostics",   icon: "🔍", popular: false },
    { name: "Wheel Alignment",    icon: "⚙️", popular: false },
    { name: "Vehicle Washing",    icon: "🚿", popular: false },
    { name: "Painting & Denting", icon: "🎨", popular: false },
    { name: "EV Service",         icon: "🚗", popular: true  },
  ],
  vehicles: [
    { name: "Car",              icon: "🚗" },
    { name: "SUV",              icon: "🚙" },
    { name: "Van",              icon: "🚐" },
    { name: "Truck",            icon: "🚛" },
    { name: "Electric Vehicle", icon: "⚡" },
    { name: "Bike",             icon: "🏍️" },
  ],
  brands: ["Toyota", "Honda", "Nissan", "Suzuki", "BMW", "Audi", "Hyundai", "Mitsubishi"],
  photos: [
    "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
    "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  ],
  reviews: [
    { id: 1, name: "Kasun Perera",    avatar: "KP", rating: 5, date: "2 weeks ago",  text: "Brought my Aqua in for engine diagnostics and an oil change. The team was honest about what needed fixing — no upselling. Done in 3 hours flat. Will definitely be back." },
    { id: 2, name: "Nimesha Silva",   avatar: "NS", rating: 5, date: "1 month ago",  text: "Best AC repair experience I've had. They recharged the system and found a leak the previous garage missed. Reasonable pricing and a very professional crew." },
    { id: 3, name: "Ruwan Fernando",  avatar: "RF", rating: 4, date: "1 month ago",  text: "Great service overall. Wheel alignment and tyre rotation done perfectly. Waiting area is clean and they have WiFi. Slight wait time on a Saturday but understandable." },
  ],
  features: ["CCTV Security", "Waiting Lounge", "Free WiFi", "Online Invoice", "Warranty on Parts", "EV Bay"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Stars({ rating, size = 15 }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#F59E0B" : "#E2E8F0"} style={{ flexShrink: 0 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
}

function Avatar({ initials, size = 40 }) {
  const colors = { K: "#1D4ED8", N: "#059669", R: "#EA580C", A: "#7C3AED", S: "#0284C7", F: "#DC2626" };
  const bg = colors[initials[0]] || "#1D4ED8";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.35, fontWeight: 700, fontFamily: "var(--font-display)", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

// ─── Icon Components ──────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.21 3.35 2 2 0 0 1 3.18 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const BookmarkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
  </svg>
);
const NavArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

// ─── Section Card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, children, action }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 18,
      border: "1px solid #E2E8F0",
      boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
      overflow: "hidden",
      marginBottom: 20,
    }}>
      {title && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px",
          borderBottom: "1px solid #F1F5F9",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "#0F172A" }}>
            {title}
          </h2>
          {action}
        </div>
      )}
      <div style={{ padding: title ? "20px 24px" : 0 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GarageDetails() {
  const navigate = useNavigate();
  const [activePhoto, setActivePhoto] = useState(0);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const g = GARAGE;

  // ── Inline style helpers ──
  const pill = (bg, color) => ({
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "5px 12px",
    borderRadius: 999,
    background: bg,
    color,
    fontSize: "0.8rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  });

  const iconBtn = (active) => ({
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 38, height: 38,
    borderRadius: 10,
    background: active ? "#EFF6FF" : "#F8FAFC",
    border: "1px solid #E2E8F0",
    color: active ? "#1D4ED8" : "#475569",
    cursor: "pointer",
    transition: "all 0.18s",
    flexShrink: 0,
  });

  const primaryBtn = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: "100%", padding: "13px 20px",
    borderRadius: 12, border: "none",
    background: "#1D4ED8", color: "#fff",
    fontSize: "0.95rem", fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
    letterSpacing: "0.01em",
  };

  const secondaryBtn = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: "100%", padding: "12px 20px",
    borderRadius: 12,
    border: "1.5px solid #1D4ED8",
    background: "transparent", color: "#1D4ED8",
    fontSize: "0.95rem", fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
  };

  const orangeBtn = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    width: "100%", padding: "12px 20px",
    borderRadius: 12, border: "none",
    background: "#EA580C", color: "#fff",
    fontSize: "0.95rem", fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "var(--font-body)",
  };

  const tabs = ["about", "services", "reviews"];

  return (
    <>

      {/* ── Breadcrumb ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "#64748B" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 0, fontSize: "0.82rem" }}>Home</button>
          <span style={{ color: "#CBD5E1" }}>›</span>
          <button onClick={() => navigate("/search")} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 0, fontSize: "0.82rem" }}>Garages</button>
          <span style={{ color: "#CBD5E1" }}>›</span>
          <button onClick={() => navigate("/search?district=Colombo")} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", padding: 0, fontSize: "0.82rem" }}>Colombo</button>
          <span style={{ color: "#CBD5E1" }}>›</span>
          <span style={{ color: "#1D4ED8", fontWeight: 600 }}>{g.name}</span>
        </div>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)",
        padding: "52px 24px 64px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 320, height: 320, borderRadius: "50%", background: "rgba(29,78,216,0.18)", filter: "blur(50px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "20%", width: 220, height: 220, borderRadius: "50%", background: "rgba(5,150,105,0.1)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#CBD5E1", padding: "7px 14px", borderRadius: 8, fontSize: "0.82rem", fontWeight: 500, cursor: "pointer", marginBottom: 28, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          >
            <ChevronLeft /> Back to results
          </button>

          <div className="hero-layout" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>

            {/* Left — info */}
            <div style={{ flex: 1, minWidth: 280 }}>
              {/* Badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                <span style={pill("rgba(5,150,105,0.2)", "#6EE7B7")}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399", display: "inline-block", animation: "pulseDot 2s infinite" }} />
                  Open Now
                </span>
                <span style={pill("rgba(234,88,12,0.2)", "#FED7AA")}>⭐ Top Rated</span>
                <span style={pill("rgba(255,255,255,0.12)", "#93C5FD")}>Verified ✓</span>
              </div>

              {/* Name */}
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.7rem, 4vw, 2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.02em" }}>
                {g.name}
              </h1>
              <p style={{ color: "#94A3B8", fontSize: "0.95rem", marginBottom: 22, maxWidth: 480 }}>{g.tagline}</p>

              {/* Meta row */}
              <div className="hero-meta" style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 28 }}>
                {[
                  { icon: <MapPinIcon />, text: g.address },
                  { icon: <ClockIcon />, text: `${g.workingDays}  ·  ${g.openTime} – ${g.closeTime}` },
                  { icon: <PhoneIcon />, text: g.phone },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: "#94A3B8", fontSize: "0.88rem" }}>
                    <span style={{ color: "#60A5FA", flexShrink: 0 }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom edge */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
            <path d="M0 32C240 10 480 0 720 0C960 0 1200 10 1440 32H0Z" fill="#F0F4F8"/>
          </svg>
        </div>
      </section>

      {/* ══════════ TABS (mobile) ══════════ */}
      <div className="mobile-tabs" style={{ display: "none", background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 16px", overflowX: "auto", gap: 0 }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "13px 20px", background: "none", border: "none", cursor: "pointer",
              fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap",
              color: activeTab === tab ? "#1D4ED8" : "#64748B",
              borderBottom: activeTab === tab ? "2px solid #1D4ED8" : "2px solid transparent",
              transition: "all 0.15s",
              textTransform: "capitalize",
              fontFamily: "var(--font-body)",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "32px 24px 60px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }} className="page-grid">

        {/* ════ LEFT COLUMN ════ */}
        <div className="left-col">

          {/* ── Photo Gallery ── */}
          <div style={{ marginBottom: 20, borderRadius: 18, overflow: "hidden", border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}>
            {/* Main photo */}
            <div style={{ position: "relative", height: 340, overflow: "hidden", background: "#0F172A" }}>
              <img
                src={g.photos[activePhoto]}
                alt={`${g.name} photo ${activePhoto + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s", display: "block" }}
              />
              {/* Photo counter */}
              <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "0.78rem", fontWeight: 600, padding: "4px 11px", borderRadius: 999, backdropFilter: "blur(4px)" }}>
                {activePhoto + 1} / {g.photos.length}
              </div>
              {/* Status overlay */}
              <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", gap: 8 }}>
                <span style={{ background: g.isOpen ? "#059669" : "#DC2626", color: "#fff", fontSize: "0.78rem", fontWeight: 700, padding: "4px 12px", borderRadius: 999 }}>
                  {g.isOpen ? "● Open Now" : "● Closed"}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", gap: 0, background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
              {g.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  style={{
                    flex: 1, height: 72, padding: 0, border: "none", cursor: "pointer",
                    borderRight: i < g.photos.length - 1 ? "1px solid #E2E8F0" : "none",
                    overflow: "hidden", position: "relative",
                    outline: activePhoto === i ? "3px solid #1D4ED8" : "none",
                    outlineOffset: -3,
                    transition: "all 0.15s",
                  }}
                >
                  <img src={photo} alt={`thumb ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: activePhoto === i ? 1 : 0.6, transition: "opacity 0.15s" }} />
                </button>
              ))}
            </div>
          </div>

          {/* ── About ── */}
          <SectionCard title="About This Garage">
            <p style={{ fontSize: "0.93rem", color: "#475569", lineHeight: 1.8, whiteSpace: "pre-line", marginBottom: 20 }}>
              {g.about}
            </p>

            

            
          </SectionCard>

          {/* ── Services ── */}
          <SectionCard
            title="Services Provided"
            action={<span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>{g.services.length} total</span>}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {g.services.map(svc => (
                <div
                  key={svc.name}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "8px 15px",
                    borderRadius: 10,
                    background: svc.popular ? "#EFF6FF" : "#F8FAFC",
                    border: `1.5px solid ${svc.popular ? "#BFDBFE" : "#E2E8F0"}`,
                    cursor: "pointer",
                    transition: "all 0.18s",
                    position: "relative",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = "#93C5FD"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = svc.popular ? "#EFF6FF" : "#F8FAFC"; e.currentTarget.style.borderColor = svc.popular ? "#BFDBFE" : "#E2E8F0"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: svc.popular ? "#1D4ED8" : "#334155" }}>{svc.name}</span>
                  {svc.popular && (
                    <span style={{ position: "absolute", top: -6, right: -4, background: "#EA580C", color: "#fff", fontSize: "0.6rem", fontWeight: 700, padding: "1px 6px", borderRadius: 999 }}>
                      HOT
                    </span>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── Vehicle Types ── */}
          <SectionCard title="Supported Vehicle Types">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 12, marginBottom: 20 }}>
              {g.vehicles.map(v => (
                <div
                  key={v.name}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
                    padding: "16px 10px",
                    borderRadius: 14,
                    background: "#F8FAFC",
                    border: "1.5px solid #E2E8F0",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "center",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = "#93C5FD"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(29,78,216,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#334155" }}>{v.name}</span>
                </div>
              ))}
            </div>

            {/* Supported brands */}
            <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Supported Brands</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {g.brands.map(brand => (
                  <span key={brand} style={{ background: "#F1F5F9", color: "#475569", fontSize: "0.82rem", fontWeight: 600, padding: "5px 12px", borderRadius: 999, border: "1px solid #E2E8F0" }}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ── Reviews ── */}
          <SectionCard
            title="Customer Reviews"
            action={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stars rating={g.rating} size={14} />
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0F172A" }}>{g.rating}</span>
                <span style={{ fontSize: "0.82rem", color: "#94A3B8" }}>({g.reviewCount})</span>
              </div>
            }
          >
            {/* Rating bars */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              {/* Bar chart */}
              <div>
                {[5,4,3,2,1].map(star => {
                  const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
                  return (
                    <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600, width: 6 }}>{star}</span>
                      <span style={{ color: "#F59E0B", fontSize: "0.72rem" }}>★</span>
                      <div style={{ flex: 1, height: 7, background: "#F1F5F9", borderRadius: 999, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: star >= 4 ? "#1D4ED8" : star === 3 ? "#F59E0B" : "#EF4444", borderRadius: 999, transition: "width 0.4s" }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "#94A3B8", width: 26 }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
              {/* Big rating */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#F8FAFC", borderRadius: 14, padding: 16 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{g.rating}</div>
                <Stars rating={g.rating} size={18} />
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", marginTop: 4 }}>{g.reviewCount} reviews</div>
              </div>
            </div>

            {/* Review cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {g.reviews.map(review => (
                <div
                  key={review.id}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    borderRadius: 14,
                    padding: "16px 18px",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = "#BFDBFE"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#F1F5F9"; }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <Avatar initials={review.avatar} size={38} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0F172A" }}>{review.name}</span>
                        <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>{review.date}</span>
                      </div>
                      <Stars rating={review.rating} size={13} />
                    </div>
                  </div>
                  <p style={{ fontSize: "0.88rem", color: "#475569", lineHeight: 1.7 }}>{review.text}</p>
                </div>
              ))}
            </div>

            <button style={{ marginTop: 16, width: "100%", padding: "11px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#F8FAFC", color: "#475569", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s", fontFamily: "var(--font-body)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.color = "#1D4ED8"; e.currentTarget.style.borderColor = "#BFDBFE"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
            >
              Load All {g.reviewCount} Reviews
            </button>
          </SectionCard>
        </div>

        {/* ════ RIGHT COLUMN — STICKY CONTACT CARD ════ */}
        <div className="right-col" style={{ position: "sticky", top: 82 }}>

          {/* ── Contact Card ── */}
          <div style={{
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 24px rgba(15,23,42,0.09)",
            overflow: "hidden",
            marginBottom: 16,
          }}>
            {/* Card header */}
            <div style={{ background: "linear-gradient(135deg, #1E3A8A, #1D4ED8)", padding: "20px 22px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#fff" }}>Contact Garage</span>
                <span style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(52,211,153,0.2)", color: "#6EE7B7", fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", display: "inline-block", animation: "pulseDot 2s infinite" }} />
                  Open
                </span>
              </div>
              <p style={{ color: "#93C5FD", fontSize: "0.82rem" }}>{g.workingDays} · {g.openTime} – {g.closeTime}</p>
            </div>

            <div style={{ padding: "20px 22px" }}>
              {/* Contact details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 20, border: "1px solid #F1F5F9", borderRadius: 12, overflow: "hidden" }}>
                {[
                  { icon: <PhoneIcon />,  label: "Primary",   value: g.phone,    href: `tel:${g.phone}`,        color: "#1D4ED8" },
                  { icon: <PhoneIcon />,  label: "Secondary", value: g.phone2,   href: `tel:${g.phone2}`,       color: "#1D4ED8" },
                  { icon: <MailIcon />,   label: "Email",     value: g.email,    href: `mailto:${g.email}`,     color: "#059669" },
                  { icon: <GlobeIcon />,  label: "Website",   value: g.website,  href: `https://${g.website}`,  color: "#7C3AED" },
                ].map((row, i) => (
                  <a
                    key={i}
                    href={row.href}
                    target={row.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px",
                      borderBottom: i < 3 ? "1px solid #F1F5F9" : "none",
                      textDecoration: "none",
                      background: "#fff",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <div style={{ width: 34, height: 34, borderRadius: 9, background: `${row.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: row.color, flexShrink: 0 }}>
                      {row.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: row.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href={`tel:${g.phone}`}
                  style={{ ...primaryBtn, textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1E3A8A"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#1D4ED8"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <PhoneIcon /> Call Now
                </a>
                <a
                  href={g.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...orangeBtn, textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#C2410C"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#EA580C"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <NavArrowIcon /> Get Directions
                </a>
                <a
                  href={`mailto:${g.email}`}
                  style={{ ...secondaryBtn, textDecoration: "none" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <MailIcon /> Send Email
                </a>
              </div>
            </div>
          </div>

          {/* ── Address Card ── */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(15,23,42,0.05)", overflow: "hidden", marginBottom: 16 }}>
            {/* Map placeholder */}
            <div style={{ height: 140, background: "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 50%, #D1FAE5 100%)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {/* Grid pattern */}
              <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
                <defs>
                  <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1D4ED8" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
              {/* Pin */}
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(29,78,216,0.4)", color: "#fff" }}>
                  <MapPinIcon />
                </div>
                <div style={{ background: "#fff", color: "#1D4ED8", fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  City Auto Care
                </div>
              </div>
            </div>

            <div style={{ padding: "14px 18px" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Location</div>
              <p style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.6, marginBottom: 12 }}>{g.address}</p>
              <a
                href={g.mapUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.83rem", fontWeight: 700, color: "#1D4ED8", textDecoration: "none" }}
              >
                Open in Google Maps →
              </a>
            </div>
          </div>

          {/* ── Working Hours Card ── */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(15,23,42,0.05)", padding: "16px 18px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.92rem", fontWeight: 700, color: "#0F172A", marginBottom: 12 }}>Working Hours</div>
            {[
              { day: "Monday – Friday", hours: "7:30 AM – 7:00 PM", active: true },
              { day: "Saturday",        hours: "8:00 AM – 5:00 PM", active: true },
              { day: "Sunday",          hours: "Closed",             active: false },
            ].map(row => (
              <div key={row.day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #F8FAFC" }}>
                <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>{row.day}</span>
                <span style={{ fontSize: "0.83rem", fontWeight: 700, color: row.active ? "#059669" : "#EF4444" }}>{row.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ RESPONSIVE CSS ══════════ */}
      <style>{`
        @keyframes pulseDot {
          0%,100% { transform:scale(1); opacity:1; }
          50%      { transform:scale(1.5); opacity:0.5; }
        }

        /* Two-column → single column */
        @media (max-width: 900px) {
          .page-grid {
            grid-template-columns: 1fr !important;
          }
          .right-col {
            position: static !important;
            order: -1;
          }
          .mobile-tabs {
            display: flex !important;
          }
        }

        /* Hero layout stacking */
        @media (max-width: 700px) {
          .hero-layout {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .hero-actions {
            align-self: flex-start !important;
            width: 100% !important;
          }
          .hero-meta {
            flex-direction: column !important;
            gap: 10px !important;
          }
        }

        /* Stats 3-col → 3 on mobile too (they're small) */
        @media (max-width: 480px) {
          .page-grid {
            padding-inline: 14px !important;
          }
        }

        /* Smooth hover for nav link */
        .nav-link { transition: color 0.15s, background 0.15s; }
      `}</style>

     
    </>
  );
}