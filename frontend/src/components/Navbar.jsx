// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/global.css";

const NAV_LINKS = [
  { label: "Home",     to: "/" },
  { label: "Search",   to: "/search" },
  { label: "Services", to: "/services" },
  { label: "About",    to: "/about" },
  { label: "Contact",  to: "/contact" },
];

export default function Navbar() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const location = useLocation();

  /* Close mobile menu on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* Add shadow when user scrolls */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "var(--navbar-height)",
          background: "var(--color-surface)",
          borderBottom: `1px solid ${scrolled ? "var(--color-border)" : "transparent"}`,
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
          transition: "box-shadow var(--transition-normal), border-color var(--transition-normal)",
        }}
      >
        <div
          className="container"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-lg)",
          }}
        >
          {/* ── Logo ── */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
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
              {/* Wrench + gear icon (inline SVG) */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", color: "var(--color-text)", letterSpacing: "-0.02em" }}>
              Garage<span style={{ color: "var(--color-primary)" }}>Finder</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.93rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                    background: isActive ? "var(--color-primary-light)" : "transparent",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-primary)";
                      e.currentTarget.style.background = "var(--color-primary-light)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-text-secondary)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Auth Buttons ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }} className="desktop-nav">
            <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register Garage</Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              display: "none",
              width: 40,
              height: 40,
              borderRadius: "var(--radius-sm)",
              background: menuOpen ? "var(--color-primary-light)" : "transparent",
              alignItems: "center",
              justifyContent: "center",
              transition: "background var(--transition-fast)",
              flexShrink: 0,
            }}
          >
            {menuOpen ? (
              /* X icon */
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6"  y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              /* Hamburger icon */
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            paddingTop: "var(--navbar-height)",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15,23,42,0.45)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Drawer panel */}
          <nav
            style={{
              position: "absolute",
              top: "var(--navbar-height)",
              left: 0,
              right: 0,
              background: "var(--color-surface)",
              borderBottom: "1px solid var(--color-border)",
              padding: "var(--space-md) var(--space-md) var(--space-lg)",
              animation: "fadeUp 0.2s ease both",
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: "block",
                    padding: "12px var(--space-md)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "1rem",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--color-primary)" : "var(--color-text)",
                    background: isActive ? "var(--color-primary-light)" : "transparent",
                    marginBottom: 4,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "var(--space-md)", paddingTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              <Link to="/login"    className="btn btn-outline" style={{ width: "100%" }}>Log In</Link>
              <Link to="/register" className="btn btn-primary"  style={{ width: "100%" }}>Register Garage</Link>
            </div>
          </nav>
        </div>
      )}

      {/* ── Responsive CSS for Navbar ── */}
      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {/* Spacer so content isn't hidden behind fixed navbar */}
      <div style={{ height: "var(--navbar-height)" }} />
    </>
  );
}