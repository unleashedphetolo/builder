import { Link } from "react-router-dom";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import "../../styles/portfolioLayout.css";

export default function PortfolioLayout({ children, settings, navItems }) {
  const st = settings || {};
  const display = st.social_display || {};
  const socials = st.social_links || {};

  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--primary", st.primary_color || "#a855f7");
    root.style.setProperty("--secondary", st.secondary_color || "#0b1220");
    root.style.setProperty("--accent", st.accent_color || "#f97316");
    root.style.setProperty("--font", st.font_family || "Inter");
  }

  const headerNav = (navItems || []).filter((n) => n.location === "header" && n.is_visible !== false);

  return (
    <div className="portfolio-layout" style={{ fontFamily: "var(--font)" }}>
      {display.topbar !== false && (
        <div className="school-topbar" style={{ background: "var(--secondary)" }}>
          <div className="topbar-left">
            <span>{st.site_name || "Portfolio"}</span>
          </div>
          <div className="topbar-right">
            {(display.linkedin ?? true) && (
              <a href={socials.linkedin || "#"} className="social-icon" onClick={(e)=>!socials.linkedin&&e.preventDefault()}>
                <FaLinkedinIn />
              </a>
            )}
            {(display.github ?? true) && (
              <a href={socials.github || "#"} className="social-icon" onClick={(e)=>!socials.github&&e.preventDefault()}>
                <FaGithub />
              </a>
            )}
          </div>
        </div>
      )}

      <header className="portfolio-navbar">
        <h2>{st.site_name || "Portfolio"}</h2>
        <nav>
          {(headerNav.length ? headerNav : [{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Contact", href: "/contact" }]).map(
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
        <footer className="portfolio-footer">
          <p>{st.footer_text || "© Portfolio."}</p>
        </footer>
      )}
    </div>
  );
}
