import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "../../styles/businessLayout.css";

const ICONS = { facebook: FaFacebookF, x: FaXTwitter, instagram: FaInstagram, youtube: FaYoutube, linkedin: FaLinkedinIn };

export default function BusinessLayout({ children, settings, navItems }) {
  const st = settings || {};
  const display = st.social_display || {};
  const socials = st.social_links || {};

  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--primary", st.primary_color || "#0ea5e9");
    root.style.setProperty("--secondary", st.secondary_color || "#0b1220");
    root.style.setProperty("--accent", st.accent_color || "#22c55e");
    root.style.setProperty("--font", st.font_family || "Inter");
  }

  const headerNav = (navItems || []).filter((n) => n.location === "header" && n.is_visible !== false);

  return (
    <div className="business-layout" style={{ fontFamily: "var(--font)" }}>
      {display.topbar !== false && (
        <div className="school-topbar" style={{ background: "var(--secondary)" }}>
          <div className="topbar-left">
            <span>{st.email || "info@company.com"}</span>
            <span className="sep">•</span>
            <span>{st.phone || "+27 00 000 0000"}</span>
          </div>
          <div className="topbar-right">
            {Object.keys(ICONS).map((key) => {
              const Icon = ICONS[key];
              const visible = display?.[key] ?? true;
              if (!visible) return null;
              const href = socials?.[key] || "#";
              return (
                <a key={key} href={href} className="social-icon" onClick={(e)=>href==="#"&&e.preventDefault()}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>
      )}

      <header className="business-navbar">
        <h2>{st.site_name || "Corporate"}</h2>
        <nav>
          {(headerNav.length ? headerNav : [{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Contact", href: "/contact" }]).map(
            (item) => (
              <Link key={item.href || item.label} to={(settings?.site_id && item.href && item.href !== "/") ? `/site/${settings.site_id}${item.href}` : (settings?.site_id ? `/site/${settings.site_id}` : (item.href || "/"))}>
                {item.label}
              </Link>
            )
          )}
        </nav>
      </header>

      <main>{children}</main>

      {display.footer !== false && (
        <footer className="business-footer">
          <div>
            <h4>{st.site_name || "Corporate"}</h4>
            <p>{st.footer_text || "© Company. All rights reserved."}</p>
          </div>
        </footer>
      )}
    </div>
  );
}
