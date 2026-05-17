// src/components/Footer.jsx
import { Link } from "react-router-dom";
import "../styles/global.css";

const FOOTER_LINKS = {
  Platform: [
    { label: "Search Garages", to: "/search" },
    { label: "All Services",   to: "/services" },
    { label: "Register Garage", to: "/register" },
    { label: "Login",          to: "/login" },
  ],
  Services: [
    { label: "Engine Repair",    to: "/search?service=engine" },
    { label: "Oil Change",       to: "/search?service=oil" },
    { label: "AC Repair",        to: "/search?service=ac" },
    { label: "Tyre Service",     to: "/search?service=tyre" },
  ],
  Company: [
    { label: "About Us",   to: "/about" },
    { label: "Contact",    to: "/contact" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-text)",
        color: "#CBD5E1",
        paddingTop: "var(--space-3xl)",
        paddingBottom: "var(--space-xl)",
      }}
    >
      <div className="container">

        {/* ── Top Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr repeat(3, 1fr)",
            gap: "var(--space-2xl)",
            paddingBottom: "var(--space-2xl)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          className="footer-grid"
        >
          {/* Brand Column */}
          <div>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "var(--space-md)" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-success))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "#fff" }}>
                Garage<span style={{ color: "#60A5FA" }}>Finder</span>
              </span>
            </Link>

            <p style={{ fontSize: "0.93rem", lineHeight: 1.8, marginBottom: "var(--space-lg)", maxWidth: 260 }}>
              Sri Lanka's trusted platform to find nearby vehicle service centers and garages — fast, simple, reliable.
            </p>

            {/* Social Icons */}
            <div style={{ display: "flex", gap: "var(--space-sm)" }}>
              {[
                { label: "Facebook", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                { label: "Twitter/X", path: "M4 4l16 16M4 20 20 4" },
                { label: "Instagram", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4" },
              ].map(({ label, path }) => (
                <button
                  key={label}
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background var(--transition-fast)",
                    color: "#CBD5E1",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={path}/>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "var(--space-md)", letterSpacing: "0.02em" }}>
                {heading}
              </h4>
              <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      style={{ fontSize: "0.9rem", color: "#94A3B8", transition: "color var(--transition-fast)" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#94A3B8"}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "var(--space-md)",
            paddingTop: "var(--space-lg)",
          }}
        >
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
            © {new Date().getFullYear()} GarageFinder. All rights reserved. Built for Sri Lanka 🇱🇰
          </p>
          <div style={{ display: "flex", gap: "var(--space-lg)" }}>
            {["Privacy", "Terms", "Cookies"].map((label) => (
              <Link
                key={label}
                to={`/${label.toLowerCase()}`}
                style={{ fontSize: "0.85rem", color: "#64748B", transition: "color var(--transition-fast)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive footer grid */}
      <style>
        
        {` @media (max-width: 700px) {
            .footer-grid {
            grid-template-columns: 1fr;
            }
        }
            @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-xl) !important;
          }
        }
        `}

      </style>
      
    </footer>
  );
}