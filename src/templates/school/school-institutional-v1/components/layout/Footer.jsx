import React from "react";
import "../../styles/footer.css";
import logoz from "../../assets/sebone.jpeg";
import logo from "../../../../../assets/logo.gif";

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
  contact: true,
  digitalLibrary: true,
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

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `#/site/${siteId || ""}${clean}`;
}

export default function Footer({ settings = {} }) {
  const features = {
    ...DEFAULT_FEATURES,
    ...(settings?.features || {}),
  };

  const links = {
    ...DEFAULT_SOCIAL_LINKS,
    ...(settings?.social_links || {}),
  };

  const socialDisplay = {
    ...DEFAULT_SOCIAL_DISPLAY,
    ...(settings?.social_display || {}),
  };

  const logoUrl = settings?.logo_url || logoz;
  const schoolName = settings?.site_name || "School";
  const phone = settings?.phone || "";
  const email = settings?.email || "";
  const slogan =
    settings?.tagline || "Nurturing Excellence • Inspiring Tomorrow";
  const motto = settings?.motto || "";
  const siteId = settings?.site_id || "";
  const year = new Date().getFullYear();

  /* ---------- instant navigation helper ---------- */

  const navigateTo = (href) => {
    const slug = href.replace(`#/site/${siteId}`, "") || "/";
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug })
    );
  };

  const groups = [
    {
      title: "Learners",
      items: [
        { name: "Calendars", path: buildSiteHref(siteId, "/resources/calendar") },
        { name: "Term dates", path: buildSiteHref(siteId, "/resources/term-plan") },
        { name: "Student Daily Bulletin", path: buildSiteHref(siteId, "/bulletin") },
        { name: "Subject Choices", path: buildSiteHref(siteId, "/resources/subject-choices") },
        { name: "Past Matric Papers", path: buildSiteHref(siteId, "/digital-library") },
      ],
    },
    {
      title: "Staff",
      items: [
        { name: "Staff Members", path: buildSiteHref(siteId, "/staff") },
        { name: "SGB", path: buildSiteHref(siteId, "/sgb") },
        { name: "Term dates", path: buildSiteHref(siteId, "/resources/term-plan") },
        { name: "Attendance Policy", path: buildSiteHref(siteId, "/attendance") },
      ],
    },
    {
      title: "Parents",
      items: [
        { name: "Admissions", path: buildSiteHref(siteId, "/admissions") },
        { name: "Term dates", path: buildSiteHref(siteId, "/resources/term-plan") },
        { name: "School Calendar", path: buildSiteHref(siteId, "/schoolcalendar") },
        { name: "Stationary requirements", path: buildSiteHref(siteId, "/resources/stationary-list") },
        { name: "Contact us", path: buildSiteHref(siteId, "/contact") },
      ],
    },
    {
      title: "Activities",
      items: [
        { name: "Academics", path: buildSiteHref(siteId, "/activities/academics") },
        { name: "Sports & Recreation", path: buildSiteHref(siteId, "/activities/sports") },
        { name: "Culture & Activities", path: buildSiteHref(siteId, "/activities/culture") },
        { name: "Campus Facilities", path: buildSiteHref(siteId, "/activities/facilities") },
      ],
    },
  ];

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top container">

        <div className="brand">
          <div className="logoz">
            <img src={logoUrl} alt="School logo" className="logo-image" />
          </div>

          <div className="brand-text">
            <div className="school-name">{schoolName}</div>
            <div className="slogan">{slogan}</div>

            {motto && (
              <div className="slogan" style={{ opacity: 0.9 }}>
                {motto}
              </div>
            )}

            <div className="contact small">
              {phone && (
                <a href={`tel:${phone}`} style={{ textDecoration: "none", color: "#2a1b6b" }}>
                  ☎ {phone}
                </a>
              )}

              {phone && email && <span className="sep">|</span>}

              {email && (
                <a href={`mailto:${email}`} style={{ textDecoration: "none", color: "#2a1b6b" }}>
                  {email}
                </a>
              )}
            </div>
          </div>
        </div>

        <nav className="footer-links">
          {groups
            .filter((g) => {
              if (g.title === "Activities") return features.activities;
              if (g.title === "Parents") return features.admissions || features.contact;
              return true;
            })
            .map((group) => (
              <div key={group.title} className="link-group">
                <h4>{group.title}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.path}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo(item.path);
                        }}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </nav>

      </div>

      <div className="footer-bottom container">

        <div className="copyright small">
          © {year} {schoolName}. All rights reserved.
        </div>

        {socialDisplay.footer && (
          <div className="social">
            <span className="small">Follow us</span>

            {Object.keys(ICONS).map((key) => {
              const Icon = ICONS[key];
              const visible = socialDisplay?.[key] ?? true;
              if (!visible) return null;

              const href = links[key] || "#";

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
        )}

        <div className="powered-by">
          <span>Powered by</span>

          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="ulterspace-link"
          >
            <img src={logo} alt="Ulterspace Logo" className="ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>

      </div>
    </footer>
  );
}