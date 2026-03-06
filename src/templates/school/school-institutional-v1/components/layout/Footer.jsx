import React from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";
import logoz from "../../assets/sebone.jpeg";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const ICONS = {
  facebook: FaFacebookF,
  x: FaXTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
};

const DEFAULT_FEATURES = {
  activities: true,
  admissions: true,
  resources: true,
  digitalLibrary: true,
  bulletin: true,
  attendancePolicy: true,
  staff: true,
  governance: true,
  facilities: true,
  contact: true,
  events: true,
};

const DEFAULT_SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  x: "https://x.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  tiktok: "https://tiktok.com",
  linkedin: "https://linkedin.com",
  whatsapp: "https://wa.me/",
};

const DEFAULT_SOCIAL_DISPLAY = {
  facebook: true,
  x: true,
  instagram: true,
  youtube: true,
  tiktok: true,
  linkedin: true,
  whatsapp: true,
  topbar: true,
  footer: true,
};

const groups = [
  {
    title: "Learners",
    items: [
      { name: "Calendars", path: "/resources/calendar" },
      { name: "Term dates", path: "/resources/term-plan" },
      { name: "Student Daily Bulletin", path: "/bulletin" },
      { name: "Subject Choices", path: "/resources/subject-choices" },
      { name: "Past Matric Papers", path: "/digital-library" },
      {
        name: "Matric Results",
        path: "https://www.education.gov.za/MatricResults/ExamResults.aspx",
        external: true,
      },
    ],
  },
  {
    title: "Staff",
    items: [
      { name: "Staff Members", path: "/staff" },
      { name: "SGB", path: "/sgb" },
      { name: "Term dates", path: "/resources/term-plan" },
      { name: "Attendance Policy", path: "/attendance" },
    ],
  },
  {
    title: "Parents",
    items: [
      { name: "Admissions", path: "/admissions" },
      { name: "Term dates", path: "/resources/term-plan" },
      { name: "School Calendar", path: "/schoolcalendar" },
      { name: "Stationary requirements", path: "/resources/stationary-list" },
      { name: "Contact us", path: "/contact" },
    ],
  },
  {
    title: "Activities",
    items: [
      { name: "Academics", path: "/activities/academics" },
      { name: "Sports & Recreation", path: "/activities/sports" },
      { name: "Culture & Activities", path: "/activities/culture" },
      { name: "Campus Facilities", path: "/activities/facilities" },
    ],
  },
];

function mergeFeatures(features) {
  return {
    ...DEFAULT_FEATURES,
    ...(features || {}),
  };
}

function mergeSocialLinks(links) {
  return {
    ...DEFAULT_SOCIAL_LINKS,
    ...(links || {}),
  };
}

function normalizeSocialDisplay(display) {
  return {
    ...DEFAULT_SOCIAL_DISPLAY,
    ...(display || {}),
  };
}

function getRoutePrefix(settings) {
  if (settings?.site_id) return `/site/${settings.site_id}`;
  return "/site";
}

export default function Footer({
  settings = {},
  socialLinks = {},
  socialDisplay = {},
  footerLinks = [],
}) {
  const f = mergeFeatures(settings?.features);
  const links = mergeSocialLinks(socialLinks || settings?.social_links);
  const display = normalizeSocialDisplay(socialDisplay || settings?.social_display);

  const logoUrl = settings?.logo_url || logoz;
  const schoolName = settings?.site_name || "School";
  const phone = settings?.phone || "";
  const email = settings?.email || "";
  const slogan = settings?.tagline || "Nurturing Excellence • Inspiring Tomorrow";
  const motto = settings?.motto || "";
  const year = new Date().getFullYear();
  const routePrefix = getRoutePrefix(settings);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderInternalLink = (path) => {
    const to = `${routePrefix}${path}`;
    return to;
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top container">
        <div className="brand">
          <div className="logoz" aria-hidden="true">
            <img src={logoUrl || logoz} alt="School logo" className="logo-image" />
          </div>

          <div className="brand-text">
            <div className="school-name">{schoolName}</div>
            <div className="slogan">{slogan}</div>
            {motto ? <div className="slogan" style={{ opacity: 0.9 }}>{motto}</div> : null}

            <div className="contact small">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  aria-label="Call school"
                  style={{ textDecoration: "none", color: "#2a1b6b" }}
                >
                  ☎ {phone}
                </a>
              ) : null}

              {phone && email ? <span className="sep">|</span> : null}

              {email ? (
                <a
                  href={`mailto:${email}`}
                  aria-label="Email school"
                  style={{ textDecoration: "none", color: "#2a1b6b" }}
                >
                  {email}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <nav className="footer-links">
          {groups
            .filter((g) => {
              if (g.title === "Activities") return f.activities;
              if (g.title === "Parents") return f.admissions || f.contact;
              return true;
            })
            .map((group) => (
              <div key={group.title} className="link-group">
                <h4>{group.title}</h4>

                <ul>
                  {group.items
                    .filter((item) => {
                      const p = item.path;

                      if (p.includes("digital-library")) return f.digitalLibrary;
                      if (p.includes("/admissions")) return f.admissions;
                      if (p.includes("/bulletin")) return f.bulletin;
                      if (p.includes("/attendance")) return f.attendancePolicy;
                      if (p.includes("/activities")) return f.activities;
                      if (p.includes("/resources")) return f.resources;
                      if (p.includes("/staff")) return f.staff;
                      if (p.includes("/sgb")) return f.governance;
                      if (p.includes("/facilities")) return f.facilities;
                      if (p.includes("/contact")) return f.contact;
                      if (p.includes("/schoolcalendar")) return f.events;

                      return true;
                    })
                    .map((item) => (
                      <li key={item.name}>
                        {item.external ? (
                          <a href={item.path} target="_blank" rel="noopener noreferrer">
                            {item.name}
                          </a>
                        ) : (
                          <Link to={renderInternalLink(item.path)} onClick={scrollTop}>
                            {item.name}
                          </Link>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </nav>
      </div>

      {footerLinks?.length ? (
        <div className="footer-top container" style={{ paddingTop: 0 }}>
          <nav className="footer-links">
            <div className="link-group">
              <h4>Quick Links</h4>
              <ul>
                {footerLinks.map((item, idx) => (
                  <li key={`${item?.label || "link"}-${idx}`}>
                    {item?.href?.startsWith("http") ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.label || "Link"}
                      </a>
                    ) : (
                      <Link to={item?.href || "#"} onClick={scrollTop}>
                        {item?.label || "Link"}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      ) : null}

      <div className="footer-bottom container">
        <div className="copyright small">
          © {year} {schoolName}. All rights reserved.
        </div>

        {display.footer ? (
          <div className="social">
            <span className="small">Follow us</span>

            {Object.keys(ICONS).map((key) => {
              const Icon = ICONS[key];
              const visible = display?.[key] ?? true;

              if (!visible) return null;

              const href = links?.[key] || "#";

              return (
                <a
                  key={key}
                  href={href}
                  target={href === "#" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="social-icon"
                  title={key}
                  onClick={(e) => href === "#" && e.preventDefault()}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        ) : null}

        <div className="powered-by">
          <span>Powered by</span>{" "}
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="ulterspace-link"
          >
            <img src="/ult2.gif" alt="Ulterspace Logo" className="ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>
      </div>
    </footer>
  );
}