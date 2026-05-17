// src/pages/SearchResults.jsx
// Route: /search
// Reads URL params: ?vehicle=Car&service=Engine+Repair&district=Colombo
// Requires: Navbar, Footer, global.css, react-router-dom

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
// ─── Constants ───────────────────────────────────────────────────────────────

const VEHICLE_TYPES = ["Car", "Van", "Bus", "Bike", "Three-Wheeler", "Truck", "SUV", "Electric Vehicle"];
const SERVICE_TYPES = ["Engine Repair", "Oil Change", "Battery Service", "Tyre Service", "AC Repair", "Electrical Repair", "Painting", "Washing", "Towing", "Brake Repair", "Diagnostics", "Full Service"];
const DISTRICTS     = ["Colombo", "Gampaha", "Kandy", "Galle", "Matara", "Kurunegala", "Ratnapura", "Badulla", "Anuradhapura", "Jaffna", "Trincomalee", "Batticaloa"];
const SORT_OPTIONS  = [
  { value: "rating",   label: "Top Rated"   },
  { value: "newest",   label: "Newest"       },
  { value: "reviews",  label: "Most Reviewed"},
  { value: "name",     label: "Name A–Z"     },
];

// ─── Mock garage data (replace with API call) ─────────────────────────────────
const ALL_GARAGES = [
  { id: 1,  name: "City Auto Care Center",    district: "Colombo",   address: "45 Baseline Rd, Colombo 09",      rating: 4.8, reviews: 124, services: ["Engine Repair","Oil Change","AC Repair","Diagnostics"],           vehicles: ["Car","SUV","Van"],                phone: "+94 77 123 4567", isOpen: true,  verified: true,  badge: "Top Rated",   photo: "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&q=75" },
  { id: 2,  name: "Lanka Motor Works",        district: "Gampaha",   address: "12 Kandy Rd, Gampaha",             rating: 4.6, reviews: 89,  services: ["Tyre Service","Brake Repair","Electrical Repair","Oil Change"],  vehicles: ["Car","Truck","Bus"],              phone: "+94 76 987 6543", isOpen: true,  verified: true,  badge: "Verified",    photo: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=75" },
  { id: 3,  name: "EV Tech Solutions",        district: "Colombo",   address: "88 Havelock Rd, Colombo 05",       rating: 4.9, reviews: 57,  services: ["Diagnostics","Electrical Repair","Battery Service","Full Service"],vehicles: ["Electric Vehicle","Car"],         phone: "+94 71 555 0011", isOpen: false, verified: true,  badge: "EV Specialist",photo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=75" },
  { id: 4,  name: "Kandy Auto Services",      district: "Kandy",     address: "33 Peradeniya Rd, Kandy",          rating: 4.4, reviews: 203, services: ["Engine Repair","Oil Change","Washing","Painting"],               vehicles: ["Car","Van","Three-Wheeler"],      phone: "+94 81 220 1234", isOpen: true,  verified: false, badge: null,          photo: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=75" },
  { id: 5,  name: "Galle Road Garage",        district: "Colombo",   address: "210 Galle Rd, Colombo 03",         rating: 4.3, reviews: 76,  services: ["Towing","Brake Repair","Tyre Service","Washing"],                vehicles: ["Car","SUV","Bike"],               phone: "+94 77 888 2233", isOpen: true,  verified: true,  badge: "Verified",    photo: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=75" },
  { id: 6,  name: "Nugegoda Motors",          district: "Colombo",   address: "5 High Level Rd, Nugegoda",        rating: 4.7, reviews: 145, services: ["Engine Repair","AC Repair","Full Service","Diagnostics"],         vehicles: ["Car","Van","SUV"],                phone: "+94 11 280 5566", isOpen: false, verified: true,  badge: "Top Rated",   photo: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=75" },
  { id: 7,  name: "Matara Service Point",     district: "Matara",    address: "78 Main St, Matara",               rating: 4.1, reviews: 38,  services: ["Oil Change","Tyre Service","Battery Service"],                   vehicles: ["Car","Bike","Three-Wheeler"],     phone: "+94 41 222 9988", isOpen: true,  verified: false, badge: null,          photo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=75" },
  { id: 8,  name: "Kurunegala Auto Hub",      district: "Kurunegala",address: "22 Colombo Rd, Kurunegala",        rating: 4.5, reviews: 91,  services: ["Engine Repair","Electrical Repair","Painting","Full Service"],   vehicles: ["Car","Truck","Bus","Van"],        phone: "+94 37 222 7766", isOpen: true,  verified: true,  badge: "Verified",    photo: "https://images.unsplash.com/photo-1596359894966-f1b0ed28f497?w=600&q=75" },
  { id: 9,  name: "Negombo Fast Lube",        district: "Gampaha",   address: "14 Sea St, Negombo",               rating: 4.2, reviews: 52,  services: ["Oil Change","Washing","Tyre Service"],                          vehicles: ["Car","Van"],                     phone: "+94 31 223 4455", isOpen: true,  verified: false, badge: null,          photo: "https://images.unsplash.com/photo-1551522435-a13afa10f103?w=600&q=75" },
  { id: 10, name: "Premium Car Care Galle",   district: "Galle",     address: "3 Fort Rd, Galle",                 rating: 4.6, reviews: 67,  services: ["Full Service","AC Repair","Diagnostics","Painting"],            vehicles: ["Car","SUV"],                     phone: "+94 91 224 3311", isOpen: false, verified: true,  badge: "Verified",    photo: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&q=75" },
  { id: 11, name: "Jaffna Motors",            district: "Jaffna",    address: "60 Hospital Rd, Jaffna",           rating: 4.3, reviews: 29,  services: ["Engine Repair","Brake Repair","Oil Change"],                    vehicles: ["Car","Bike","Three-Wheeler"],     phone: "+94 21 222 8877", isOpen: true,  verified: false, badge: null,          photo: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=75" },
  { id: 12, name: "Colombo EV & Hybrid Hub",  district: "Colombo",   address: "120 Union Pl, Colombo 02",         rating: 4.9, reviews: 44,  services: ["Battery Service","Diagnostics","Electrical Repair","Full Service"],vehicles: ["Electric Vehicle","Car","SUV"],  phone: "+94 77 999 0000", isOpen: true,  verified: true,  badge: "EV Specialist",photo: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=75" },
];

const RESULTS_PER_PAGE = 6;

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = "currentColor", sw = "2", fill = "none", lc = "round", lj = "round" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap={lc} strokeLinejoin={lj} style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  pin:      ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"],
  phone:    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12 19.79 19.79 0 0 1 1.21 3.35 2 2 0 0 1 3.18 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z",
  filter:   ["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"],
  x:        ["M18 6L6 18", "M6 6l12 12"],
  chevDown: "M6 9l6 6 6-6",
  chevUp:   "M18 15l-6-6-6 6",
  chevR:    "M9 18l6-6-6-6",
  star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  sort:     ["M3 6h18", "M6 12h12", "M9 18h6"],
  grid:     ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M3 14h7v7H3z", "M14 14h7v7h-7z"],
  list:     ["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"],
  check:    "M20 6L9 17l-5-5",
  reset:    "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
  nav:      "M3 11l19-9-9 19-2-8-8-2z",
  close:    ["M18 6L6 18", "M6 6l12 12"],
  warning:  ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#F59E0B" : "#E2E8F0"} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  );
}

// Skeleton loader card
function SkeletonCard() {
  return (
    <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 10px rgba(15,23,42,0.04)" }}>
      <div style={{ height: 190, background: "linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
      <div style={{ padding: "18px 20px" }}>
        {[80,60,100,40].map((w,i) => (
          <div key={i} style={{ height: 12, width: `${w}%`, background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", borderRadius: 6, marginBottom: 10 }} />
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[1,2].map(i => (
            <div key={i} style={{ flex: 1, height: 36, background: "linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", borderRadius: 9 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Garage result card
function GarageCard({ garage, view, navigate }) {
  const [imgErr, setImgErr] = useState(false);
  const isList = view === "list";

  const badgeColor = {
    "Top Rated":    { bg: "#EFF6FF", color: "#1D4ED8" },
    "Verified":     { bg: "#D1FAE5", color: "#065F46" },
    "EV Specialist":{ bg: "#FFF7ED", color: "#C2410C" },
  };

  return (
    <div
      onClick={() => navigate(`/garage/${garage.id}`)}
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #E2E8F0",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
        cursor: "pointer",
        transition: "all 0.22s",
        display: isList ? "flex" : "block",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 10px 36px rgba(29,78,216,0.13)";
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.borderColor = "#BFDBFE";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,23,42,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#E2E8F0";
      }}
    >
      {/* Image */}
      <div style={{
        position: "relative",
        width: isList ? 220 : "100%",
        height: isList ? "100%" : 190,
        minHeight: isList ? 160 : undefined,
        flexShrink: 0,
        overflow: "hidden",
        background: "#F1F5F9",
      }}>
        {!imgErr ? (
          <img
            src={garage.photo}
            alt={garage.name}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🔧</div>
        )}
        {/* Open / closed badge */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          display: "flex", alignItems: "center", gap: 5,
          background: garage.isOpen ? "rgba(5,150,105,0.92)" : "rgba(220,38,38,0.88)",
          color: "#fff", fontSize: "0.72rem", fontWeight: 700,
          padding: "4px 10px", borderRadius: 999,
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.9 }} />
          {garage.isOpen ? "Open" : "Closed"}
        </div>
        {/* Verified check */}
        {garage.verified && (
          <div style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: "50%", background: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            <Icon d={ICONS.check} size={13} sw="2.5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px", flex: 1, minWidth: 0 }}>
        {/* Badge + name */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700,
            color: "#0F172A", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {garage.name}
          </h3>
          {garage.badge && (
            <span style={{
              ...badgeColor[garage.badge],
              fontSize: "0.72rem", fontWeight: 700,
              padding: "3px 9px", borderRadius: 999,
              whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {garage.badge}
            </span>
          )}
        </div>

        {/* Address */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5, color: "#64748B", fontSize: "0.82rem", marginBottom: 10 }}>
          <span style={{ color: "#94A3B8", marginTop: 2 }}><Icon d={ICONS.pin} size={13} /></span>
          {garage.address}
        </div>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
          <Stars rating={garage.rating} />
          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0F172A" }}>{garage.rating}</span>
          <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>({garage.reviews} reviews)</span>
        </div>

        {/* Service tags — show max 3 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {garage.services.slice(0, 3).map(s => (
            <span key={s} style={{ fontSize: "0.72rem", fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: "#F1F5F9", color: "#475569" }}>{s}</span>
          ))}
          {garage.services.length > 3 && (
            <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: "#EFF6FF", color: "#1D4ED8" }}>+{garage.services.length - 3} more</span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
          <a
            href={`tel:${garage.phone}`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 0", borderRadius: 10,
              background: "#1D4ED8", color: "#fff",
              fontSize: "0.82rem", fontWeight: 700,
              textDecoration: "none", transition: "all 0.15s",
              border: "none",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1E3A8A"}
            onMouseLeave={e => e.currentTarget.style.background = "#1D4ED8"}
          >
            <Icon d={ICONS.phone} size={13} /> Call
          </a>
          <Link
            to={`/garage/${garage.id}`}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "9px 0", borderRadius: 10,
              background: "transparent", color: "#1D4ED8",
              fontSize: "0.82rem", fontWeight: 700,
              border: "1.5px solid #1D4ED8",
              textDecoration: "none", transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#EFF6FF"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// Filter section group
function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: open ? 16 : 0, marginBottom: 16 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "none", border: "none", cursor: "pointer", padding: "0 0 12px",
          fontFamily: "var(--font-display)", fontSize: "0.88rem", fontWeight: 700,
          color: "#0F172A",
        }}
      >
        {title}
        <span style={{ color: "#94A3B8", transition: "transform 0.2s", display: "flex" }}>
          <Icon d={open ? ICONS.chevUp : ICONS.chevDown} size={15} />
        </span>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// Checkbox pill
function CheckPill({ label, checked, onChange, count }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "7px 10px", borderRadius: 9, cursor: "pointer",
      background: checked ? "#EFF6FF" : "transparent",
      border: `1.5px solid ${checked ? "#BFDBFE" : "transparent"}`,
      transition: "all 0.15s", marginBottom: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 17, height: 17, borderRadius: 5,
          border: `2px solid ${checked ? "#1D4ED8" : "#CBD5E1"}`,
          background: checked ? "#1D4ED8" : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.15s",
        }}>
          {checked && <Icon d={ICONS.check} size={10} sw="3" stroke="#fff" />}
        </div>
        <span style={{ fontSize: "0.85rem", fontWeight: checked ? 600 : 400, color: checked ? "#1D4ED8" : "#334155" }}>{label}</span>
      </div>
      {count !== undefined && (
        <span style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 600 }}>{count}</span>
      )}
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: "none" }} />
    </label>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Filter state (synced with URL) ──
  const [query,        setQuery]        = useState(searchParams.get("q")        || "");
  const [selVehicles,  setSelVehicles]  = useState(() => searchParams.getAll("vehicle"));
  const [selServices,  setSelServices]  = useState(() => searchParams.getAll("service"));
  const [selDistricts, setSelDistricts] = useState(() => searchParams.getAll("district"));
  const [minRating,    setMinRating]    = useState(Number(searchParams.get("rating")) || 0);
  const [openOnly,     setOpenOnly]     = useState(searchParams.get("open") === "true");
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get("verified") === "true");

  // ── UI state ──
  const [sortBy,       setSortBy]       = useState(searchParams.get("sort") || "rating");
  const [viewMode,     setViewMode]     = useState("grid"); // "grid" | "list"
  const [currentPage,  setCurrentPage]  = useState(1);
  const [loading,      setLoading]      = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);

  // ── Simulate loading on filter change ──
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [selVehicles, selServices, selDistricts, minRating, openOnly, verifiedOnly, sortBy, query]);

  // ── Sync URL params ──
  useEffect(() => {
    const p = new URLSearchParams();
    if (query)        p.set("q", query);
    selVehicles.forEach(v  => p.append("vehicle",  v));
    selServices.forEach(s  => p.append("service",  s));
    selDistricts.forEach(d => p.append("district", d));
    if (minRating > 0)   p.set("rating",   minRating);
    if (openOnly)        p.set("open",     "true");
    if (verifiedOnly)    p.set("verified", "true");
    if (sortBy !== "rating") p.set("sort", sortBy);
    setSearchParams(p, { replace: true });
    setCurrentPage(1);
  }, [query, selVehicles, selServices, selDistricts, minRating, openOnly, verifiedOnly, sortBy]);

  // ── Filter logic ──
  const filtered = ALL_GARAGES.filter(g => {
    if (query && !g.name.toLowerCase().includes(query.toLowerCase()) && !g.address.toLowerCase().includes(query.toLowerCase())) return false;
    if (selVehicles.length  && !selVehicles.some(v  => g.vehicles.includes(v)))  return false;
    if (selServices.length  && !selServices.some(s  => g.services.includes(s)))  return false;
    if (selDistricts.length && !selDistricts.includes(g.district))               return false;
    if (minRating > 0 && g.rating < minRating)                                   return false;
    if (openOnly     && !g.isOpen)                                               return false;
    if (verifiedOnly && !g.verified)                                             return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating")  return b.rating  - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    if (sortBy === "newest")  return b.id       - a.id;
    if (sortBy === "name")    return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / RESULTS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE);

  // ── Toggle helpers ──
  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const activeFilterCount =
    selVehicles.length + selServices.length + selDistricts.length +
    (minRating > 0 ? 1 : 0) + (openOnly ? 1 : 0) + (verifiedOnly ? 1 : 0);

  const resetFilters = () => {
    setSelVehicles([]); setSelServices([]); setSelDistricts([]);
    setMinRating(0); setOpenOnly(false); setVerifiedOnly(false); setQuery("");
  };

  // Count helpers
  const countFor = (arr, key, val) => ALL_GARAGES.filter(g => g[key].includes(val)).length;

  // ── Sidebar content (shared between desktop + drawer) ──
  const SidebarContent = () => (
    <div>
      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          style={{
            display: "flex", alignItems: "center", gap: 6, width: "100%",
            padding: "9px 12px", marginBottom: 16, borderRadius: 10,
            background: "#FEF2F2", border: "1px solid #FECACA",
            color: "#DC2626", fontSize: "0.83rem", fontWeight: 700,
            cursor: "pointer", fontFamily: "var(--font-body)",
          }}
        >
          <Icon d={ICONS.reset} size={14} /> Clear All Filters
          <span style={{ marginLeft: "auto", background: "#DC2626", color: "#fff", fontSize: "0.7rem", fontWeight: 800, padding: "1px 7px", borderRadius: 999 }}>{activeFilterCount}</span>
        </button>
      )}

      {/* Open Now */}
      <FilterGroup title="Availability">
        <CheckPill label="Open Now"      checked={openOnly}     onChange={() => setOpenOnly(o => !o)} />
        <CheckPill label="Verified Only" checked={verifiedOnly} onChange={() => setVerifiedOnly(v => !v)} />
      </FilterGroup>

      {/* Rating */}
      <FilterGroup title="Minimum Rating">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[0, 3, 3.5, 4, 4.5].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              style={{
                padding: "5px 12px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 700,
                border: `1.5px solid ${minRating === r ? "#1D4ED8" : "#E2E8F0"}`,
                background: minRating === r ? "#EFF6FF" : "#F8FAFC",
                color: minRating === r ? "#1D4ED8" : "#64748B",
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "var(--font-body)",
              }}
            >
              {r === 0 ? "Any" : `${r}★+`}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Districts */}
      <FilterGroup title="District">
        <div style={{ maxHeight: 220, overflowY: "auto" }}>
          {DISTRICTS.map(d => (
            <CheckPill
              key={d} label={d}
              checked={selDistricts.includes(d)}
              onChange={() => toggle(selDistricts, setSelDistricts, d)}
              count={ALL_GARAGES.filter(g => g.district === d).length}
            />
          ))}
        </div>
      </FilterGroup>

      {/* Vehicle Types */}
      <FilterGroup title="Vehicle Type">
        {VEHICLE_TYPES.map(v => (
          <CheckPill
            key={v} label={v}
            checked={selVehicles.includes(v)}
            onChange={() => toggle(selVehicles, setSelVehicles, v)}
            count={countFor(ALL_GARAGES, "vehicles", v)}
          />
        ))}
      </FilterGroup>

      {/* Services */}
      <FilterGroup title="Service Type" defaultOpen={false}>
        <div style={{ maxHeight: 240, overflowY: "auto" }}>
          {SERVICE_TYPES.map(s => (
            <CheckPill
              key={s} label={s}
              checked={selServices.includes(s)}
              onChange={() => toggle(selServices, setSelServices, s)}
              count={countFor(ALL_GARAGES, "services", s)}
            />
          ))}
        </div>
      </FilterGroup>
    </div>
  );

  return (
    <>

      {/* ══════════ SEARCH HERO BAR ══════════ */}
      <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #1D4ED8 100%)", padding: "28px 24px 36px", position: "relative", overflow: "hidden" }}>
        {/* BG blobs */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(29,78,216,0.2)", filter: "blur(40px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.78rem", color: "#60A5FA", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Search Results
          </p>

          {/* Main search input */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
              <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }}>
                <Icon d={ICONS.search} size={18} />
              </div>
              <input
                type="text"
                placeholder="Search garage name or location…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: "100%", padding: "13px 16px 13px 44px",
                  borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.1)", color: "#fff",
                  fontSize: "0.95rem", outline: "none",
                  backdropFilter: "blur(8px)",
                  fontFamily: "var(--font-body)",
                  transition: "border-color 0.2s",
                }}
                onFocus={e  => e.target.style.borderColor = "rgba(255,255,255,0.5)"}
                onBlur={e   => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
              />
            </div>

            {/* Active filter pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[...selVehicles, ...selServices, ...selDistricts].map(tag => (
                <span key={tag} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.15)", color: "#fff",
                  fontSize: "0.8rem", fontWeight: 600,
                  padding: "6px 12px", borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.25)",
                }}>
                  {tag}
                  <button onClick={() => {
                    setSelVehicles(a => a.filter(x => x !== tag));
                    setSelServices(a => a.filter(x => x !== tag));
                    setSelDistricts(a => a.filter(x => x !== tag));
                  }} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", padding: 0, opacity: 0.7 }}>
                    <Icon d={ICONS.x} size={12} sw="2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
            <path d="M0 24C360 8 720 0 1080 0C1260 0 1380 4 1440 24H0Z" fill="#F0F4F8"/>
          </svg>
        </div>
      </div>

      {/* ══════════ MAIN LAYOUT ══════════ */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 24px 72px", display: "grid", gridTemplateColumns: "268px 1fr", gap: 24, alignItems: "start" }} className="sr-layout">

        {/* ════ FILTER SIDEBAR (desktop) ════ */}
        <aside className="sr-sidebar" style={{ position: "sticky", top: 82 }}>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", boxShadow: "0 2px 12px rgba(15,23,42,0.05)", padding: "20px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "#0F172A" }}>Filters</span>
              {activeFilterCount > 0 && (
                <span style={{ background: "#1D4ED8", color: "#fff", fontSize: "0.72rem", fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>
                  {activeFilterCount} active
                </span>
              )}
            </div>
            <SidebarContent />
          </div>
        </aside>

        {/* ════ RESULTS PANEL ════ */}
        <div>
          {/* Sort + view toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 10,
            background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0",
            padding: "12px 18px", marginBottom: 18,
            boxShadow: "0 1px 6px rgba(15,23,42,0.04)",
          }}>
            <div style={{ fontSize: "0.9rem", color: "#475569", fontWeight: 500 }}>
              {loading ? (
                <span style={{ color: "#94A3B8" }}>Searching…</span>
              ) : (
                <><strong style={{ color: "#0F172A" }}>{filtered.length}</strong> garage{filtered.length !== 1 ? "s" : ""} found</>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Sort */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: "0.82rem", color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon d={ICONS.sort} size={14} /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    padding: "6px 28px 6px 10px", borderRadius: 8,
                    border: "1.5px solid #E2E8F0", background: "#F8FAFC",
                    fontSize: "0.83rem", fontWeight: 600, color: "#334155",
                    cursor: "pointer", outline: "none",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* View toggle */}
              <div style={{ display: "flex", border: "1.5px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
                {["grid", "list"].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    title={`${mode} view`}
                    style={{
                      padding: "6px 10px", border: "none", cursor: "pointer",
                      background: viewMode === mode ? "#EFF6FF" : "#fff",
                      color: viewMode === mode ? "#1D4ED8" : "#94A3B8",
                      transition: "all 0.15s", display: "flex",
                    }}
                  >
                    <Icon d={mode === "grid" ? ICONS.grid : ICONS.list} size={16} />
                  </button>
                ))}
              </div>

              {/* Mobile filter button */}
              <button
                className="sr-filter-btn"
                onClick={() => setDrawerOpen(true)}
                style={{
                  display: "none", alignItems: "center", gap: 6,
                  padding: "7px 13px", borderRadius: 9,
                  background: activeFilterCount > 0 ? "#1D4ED8" : "#F8FAFC",
                  color: activeFilterCount > 0 ? "#fff" : "#334155",
                  border: "1.5px solid #E2E8F0", fontSize: "0.83rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "var(--font-body)",
                }}
              >
                <Icon d={ICONS.filter} size={15} />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>
          </div>

          {/* ── Results grid / list ── */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: viewMode === "list" ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            /* ── Empty state ── */
            <div style={{
              background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0",
              padding: "64px 32px", textAlign: "center",
              boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
            }}>
              <div style={{ fontSize: "4rem", marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
                No Garages Found
              </h3>
              <p style={{ color: "#64748B", fontSize: "0.95rem", maxWidth: 380, margin: "0 auto 24px", lineHeight: 1.7 }}>
                We couldn't find any garages matching your current filters. Try adjusting or clearing some filters to see more results.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={resetFilters}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 22px", borderRadius: 10,
                    background: "#1D4ED8", color: "#fff",
                    fontSize: "0.88rem", fontWeight: 700,
                    border: "none", cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  <Icon d={ICONS.reset} size={14} /> Clear All Filters
                </button>
                <button
                  onClick={() => navigate("/")}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 22px", borderRadius: 10,
                    background: "#F8FAFC", color: "#334155",
                    fontSize: "0.88rem", fontWeight: 700,
                    border: "1.5px solid #E2E8F0", cursor: "pointer",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Back to Home
                </button>
              </div>

              {/* Suggestion chips */}
              <div style={{ marginTop: 28 }}>
                <p style={{ fontSize: "0.82rem", color: "#94A3B8", marginBottom: 10 }}>Try these popular searches:</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {["Colombo", "Engine Repair", "Car", "Oil Change"].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (DISTRICTS.includes(tag)) setSelDistricts([tag]);
                        else if (VEHICLE_TYPES.includes(tag)) setSelVehicles([tag]);
                        else setSelServices([tag]);
                      }}
                      style={{
                        padding: "6px 14px", borderRadius: 999,
                        background: "#EFF6FF", color: "#1D4ED8",
                        fontSize: "0.82rem", fontWeight: 600,
                        border: "1px solid #BFDBFE", cursor: "pointer",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: viewMode === "list" ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 18,
              }}>
                {paginated.map(garage => (
                  <GarageCard key={garage.id} garage={garage} view={viewMode} navigate={navigate} />
                ))}
              </div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 32 }}>
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 14px", borderRadius: 9,
                      border: "1.5px solid #E2E8F0", background: "#fff",
                      color: currentPage === 1 ? "#CBD5E1" : "#334155",
                      fontSize: "0.85rem", fontWeight: 600, cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", gap: 5,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pg = i + 1;
                    const isActive = pg === currentPage;
                    if (totalPages > 7 && pg !== 1 && pg !== totalPages && Math.abs(pg - currentPage) > 2) {
                      if (pg === 2 || pg === totalPages - 1) return <span key={pg} style={{ color: "#94A3B8", padding: "0 4px" }}>…</span>;
                      return null;
                    }
                    return (
                      <button
                        key={pg}
                        onClick={() => { setCurrentPage(pg); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        style={{
                          width: 38, height: 38, borderRadius: 9,
                          border: `1.5px solid ${isActive ? "#1D4ED8" : "#E2E8F0"}`,
                          background: isActive ? "#1D4ED8" : "#fff",
                          color: isActive ? "#fff" : "#334155",
                          fontSize: "0.88rem", fontWeight: isActive ? 700 : 500,
                          cursor: "pointer", transition: "all 0.15s",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {pg}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 14px", borderRadius: 9,
                      border: "1.5px solid #E2E8F0", background: "#fff",
                      color: currentPage === totalPages ? "#CBD5E1" : "#334155",
                      fontSize: "0.85rem", fontWeight: 600,
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", gap: 5,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ══════════ MOBILE FILTER DRAWER ══════════ */}
      {drawerOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1200 }}>
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)" }}
          />
          {/* Panel */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "#fff", borderRadius: "20px 20px 0 0",
            maxHeight: "88vh", overflowY: "auto",
            animation: "slideUp 0.25s ease",
            padding: "0 0 32px",
          }}>
            {/* Handle */}
            <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 8px" }}>
              <div style={{ width: 40, height: 4, borderRadius: 999, background: "#E2E8F0" }} />
            </div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 20px 16px", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#0F172A" }}>
                Filters {activeFilterCount > 0 && <span style={{ color: "#1D4ED8" }}>({activeFilterCount})</span>}
              </span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px", cursor: "pointer", display: "flex", color: "#475569" }}>
                <Icon d={ICONS.x} size={18} />
              </button>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <SidebarContent />
            </div>
            <div style={{ padding: "0 20px" }}>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#1D4ED8", color: "#fff", fontSize: "0.95rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ RESPONSIVE CSS ══════════ */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%,100% { transform:scale(1); opacity:1; }
          50%      { transform:scale(1.5); opacity:0.5; }
        }

        /* Tablet: collapse sidebar */
        @media (max-width: 900px) {
          .sr-layout   { grid-template-columns: 1fr !important; }
          .sr-sidebar  { display: none !important; }
          .sr-filter-btn { display: flex !important; }
        }

        /* Mobile */
        @media (max-width: 540px) {
          .sr-layout { padding-inline: 14px !important; }
        }

        /* Scrollbar in filter */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 999px; }
      `}</style>

    </>
  );
}