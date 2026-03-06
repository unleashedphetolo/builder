import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import "../../styles/schoolLayout.css";

const FALLBACKS = {
  site_name: "Your School",
  tagline: "Excellence in Learning",
  email: "info@yourschool.co.za",
  phone: "+27 00 000 0000",
  address_line1: "123 School Street",
  city: "Your City",
  province: "Your Province",
  primary_color: "#1e40af",
  secondary_color: "#0f172a",
};

const ICONS = {
  facebook: FaFacebookF,
  x: FaXTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
};

export default function SchoolLayout({ children, settings, navItems }) {
  const st = { ...FALLBACKS, ...(settings || {}) };
  const socials = st.social_links || {};
  const display = st.social_display || {};

  // Apply theme vars (for preview inside builder)
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--primary", st.primary_color || FALLBACKS.primary_color);
    root.style.setProperty("--secondary", st.secondary_color || FALLBACKS.secondary_color);
    root.style.setProperty("--accent", st.accent_color || "#f59e0b");
    root.style.setProperty("--font", st.font_family || "Inter");
  }

  const headerNav = (navItems || []).filter((n) => n.location === "header" && n.is_visible !== false);

  return (
    <div className="school-layout" style={{ fontFamily: "var(--font)" }}>
      {/* TOPBAR */}
      {display.topbar !== false && (
        <div className="school-topbar">
          <div className="topbar-left">
            <span>{st.email || FALLBACKS.email}</span>
            <span className="sep">•</span>
            <span>{st.phone || FALLBACKS.phone}</span>
            <span className="sep">•</span>
            <span>
              {(st.address_line1 || FALLBACKS.address_line1) + ", " + (st.city || FALLBACKS.city)}
            </span>
          </div>

          <div className="topbar-right">
            {Object.keys(ICONS).map((key) => {
              const Icon = ICONS[key];
              const visible = display?.[key] ?? true; // visible until disabled
              if (!visible) return null;
              const href = socials?.[key] || "#";
              return (
                <a
                  key={key}
                  href={href}
                  target={href === "#" ? undefined : "_blank"}
                  rel="noreferrer"
                  className="social-icon"
                  title={key}
                  onClick={(e) => href === "#" && e.preventDefault()}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="school-header">
        <div className="brand">
          <div className="logo-box">
            {st.logo_url ? (
              <img src={st.logo_url} alt="logo" />
            ) : (
              <div className="logo-fallback">{(st.site_name || FALLBACKS.site_name).slice(0, 1)}</div>
            )}
          </div>
          <div className="brand-text">
            <h1>{st.site_name || FALLBACKS.site_name}</h1>
            <p>{st.tagline || FALLBACKS.tagline}</p>
          </div>
        </div>

        <nav className="school-nav">
          {(headerNav.length ? headerNav : defaultSchoolNav()).map((item) => (
            <Link key={item.href || item.label} to={item.href === "/" ? `/site/${st.site_id || ""}` : `/site/${st.site_id || ""}${item.href || ""}`}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="school-main">{children}</main>

      {/* FOOTER */}
      {display.footer !== false && (
        <footer className="school-footer">
          <div className="footer-grid">
            <div>
              <h4>{st.site_name || FALLBACKS.site_name}</h4>
              <p style={{ opacity: 0.9 }}>{st.footer_text || "© Your School. All rights reserved."}</p>
            </div>

            <div>
              <h4>Contact</h4>
              <p>{st.email || FALLBACKS.email}</p>
              <p>{st.phone || FALLBACKS.phone}</p>
              <p>
                {(st.address_line1 || FALLBACKS.address_line1) +
                  ", " +
                  (st.city || FALLBACKS.city) +
                  ", " +
                  (st.province || FALLBACKS.province)}
              </p>
            </div>

            <div>
              <h4>Follow</h4>
              <div className="footer-socials">
                {Object.keys(ICONS).map((key) => {
                  const Icon = ICONS[key];
                  const visible = display?.[key] ?? true;
                  if (!visible) return null;
                  const href = socials?.[key] || "#";
                  return (
                    <a
                      key={key}
                      href={href}
                      target={href === "#" ? undefined : "_blank"}
                      rel="noreferrer"
                      className="social-icon"
                      title={key}
                      onClick={(e) => href === "#" && e.preventDefault()}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function defaultSchoolNav() {
  return [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Admissions", href: "/admissions" },
    { label: "News", href: "/news" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];
}
