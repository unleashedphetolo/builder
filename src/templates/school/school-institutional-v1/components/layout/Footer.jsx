import React, { useEffect, useMemo, useState } from "react";
import "../../styles/footer.css";
import logoz from "../../assets/institutional.png";
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

const DEFAULT_SOCIAL = {
  facebook: {
    enabled: true,
    url: "https://facebook.com",
    colorMode: "original",
    originalColor: "#1877f2",
    monoColor: "#ffffff",
    color: "#1877f2",
  },
  instagram: {
    enabled: true,
    url: "https://instagram.com",
    colorMode: "original",
    originalColor: "#e4405f",
    monoColor: "#ffffff",
    color: "#e4405f",
  },
  tiktok: {
    enabled: true,
    url: "https://tiktok.com",
    colorMode: "original",
    originalColor: "#ffffff",
    monoColor: "#ffffff",
    color: "#ffffff",
  },
  linkedin: {
    enabled: true,
    url: "https://linkedin.com",
    colorMode: "original",
    originalColor: "#0a66c2",
    monoColor: "#ffffff",
    color: "#0a66c2",
  },
  x: {
    enabled: true,
    url: "https://x.com",
    colorMode: "original",
    originalColor: "#ffffff",
    monoColor: "#ffffff",
    color: "#ffffff",
  },
  youtube: {
    enabled: true,
    url: "https://youtube.com",
    colorMode: "original",
    originalColor: "#ff0000",
    monoColor: "#ffffff",
    color: "#ff0000",
  },
  whatsapp: {
    enabled: true,
    url: "https://wa.me/",
    colorMode: "original",
    originalColor: "#25d366",
    monoColor: "#ffffff",
    color: "#25d366",
  },

  topbar: true,
  footer: true,
  order: [
    "facebook",
    "instagram",
    "tiktok",
    "linkedin",
    "x",
    "youtube",
    "whatsapp",
  ],
};

const DEFAULT_FEATURES = {
  activities: true,
  admissions: true,
  contact: true,
  digitalLibrary: true,
};

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `#/site/${siteId || ""}${clean}`;
}

export default function Footer({ settings = {} }) {
  const [liveSettings, setLiveSettings] = useState(settings || {});

  useEffect(() => {
    setLiveSettings(settings || {});
  }, [settings]);

  useEffect(() => {
    const mergeLiveSettings = (incoming = {}) => {
      setLiveSettings((prev) => ({
        ...(prev || {}),
        ...(incoming || {}),
        social_links: {
          ...((prev && prev.social_links) || {}),
          ...((incoming && incoming.social_links) || {}),
        },
        social_display: {
          ...((prev && prev.social_display) || {}),
          ...((incoming && incoming.social_display) || {}),
        },
      }));
    };

    const handleCustomSettingsUpdate = (event) => {
      mergeLiveSettings(event?.detail || {});
    };

    const handleMessage = (event) => {
      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;

      if (
        payload.type === "builder:settings-updated" ||
        payload.type === "site-settings-updated"
      ) {
        mergeLiveSettings(payload.settings || payload.payload || {});
      }
    };

    window.addEventListener("builder:settings-updated", handleCustomSettingsUpdate);
    window.addEventListener("site-settings-updated", handleCustomSettingsUpdate);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("builder:settings-updated", handleCustomSettingsUpdate);
      window.removeEventListener("site-settings-updated", handleCustomSettingsUpdate);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const features = {
    ...DEFAULT_FEATURES,
    ...(liveSettings?.features || {}),
  };

  const socialLinks = liveSettings?.social_links || liveSettings?.social || {};
  const socialDisplay = liveSettings?.social_display || {};

  const social = useMemo(
    () => ({
      ...DEFAULT_SOCIAL,
      ...socialLinks,
      topbar: socialDisplay.topbar ?? DEFAULT_SOCIAL.topbar,
      footer: socialDisplay.footer ?? DEFAULT_SOCIAL.footer,
      order: Array.isArray(socialDisplay.order)
        ? socialDisplay.order
        : DEFAULT_SOCIAL.order,
    }),
    [socialLinks, socialDisplay],
  );

  const logoUrl = liveSettings?.logo_url || logoz;
  const schoolName = liveSettings?.site_name || "School";
  const phone = liveSettings?.phone || "";
  const email = liveSettings?.email || "";
  const slogan =
    liveSettings?.tagline || "Nurturing Excellence • Inspiring Tomorrow";
  const motto = liveSettings?.motto || "";
  const siteId = liveSettings?.site_id || "";
  const year = new Date().getFullYear();

  const getIconColor = (data = {}) => {
    const mode = data.colorMode || "original";

    if (mode === "mono") {
      return data.monoColor || "#ffffff";
    }

    return data.originalColor || data.color || "#ffffff";
  };

  /* ---------- instant navigation helper ---------- */

  const navigateTo = (href) => {
    const slug = href.replace(`#/site/${siteId}`, "") || "/";
    window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
  };

  const groups = [
    {
      title: "Learners",
      items: [
        {
          name: "Calendars",
          path: buildSiteHref(siteId, "/resources/calendar"),
        },
        {
          name: "Term dates",
          path: buildSiteHref(siteId, "/resources/term-plan"),
        },
        {
          name: "Student Daily Bulletin",
          path: buildSiteHref(siteId, "/bulletin"),
        },
        {
          name: "Subject Choices",
          path: buildSiteHref(siteId, "/resources/subject-choices"),
        },
        {
          name: "Past Matric Papers",
          path: buildSiteHref(siteId, "/digital-library"),
        },
      ],
    },
    {
      title: "Staff",
      items: [
        { name: "Staff Members", path: buildSiteHref(siteId, "/staff") },
        { name: "SGB", path: buildSiteHref(siteId, "/sgb") },
        {
          name: "Term dates",
          path: buildSiteHref(siteId, "/resources/term-plan"),
        },
        {
          name: "Attendance Policy",
          path: buildSiteHref(siteId, "/attendance"),
        },
      ],
    },
    {
      title: "Parents",
      items: [
        { name: "Admissions", path: buildSiteHref(siteId, "/admissions") },
        {
          name: "Term dates",
          path: buildSiteHref(siteId, "/resources/term-plan"),
        },
        {
          name: "School Calendar",
          path: buildSiteHref(siteId, "/schoolcalendar"),
        },
        {
          name: "Stationary requirements",
          path: buildSiteHref(siteId, "/resources/stationary-list"),
        },
        { name: "Contact us", path: buildSiteHref(siteId, "/contact") },
      ],
    },
    {
      title: "Activities",
      items: [
        {
          name: "Academics",
          path: buildSiteHref(siteId, "/activities/academics"),
        },
        {
          name: "Sports & Recreation",
          path: buildSiteHref(siteId, "/activities/sports"),
        },
        {
          name: "Culture & Activities",
          path: buildSiteHref(siteId, "/activities/culture"),
        },
        {
          name: "Campus Facilities",
          path: buildSiteHref(siteId, "/activities/facilities"),
        },
      ],
    },
  ];

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-top container">
        <div className="brand">
          <a
            href={buildSiteHref(siteId, "/")}
            className="logo-link"
            aria-label="Go to home"
            onClick={(e) => {
              e.preventDefault();
              navigateTo?.("/");
            }}
          >
            <div className="logoz">
              <img src={logoUrl} alt="School logo" className="logo-image" />
            </div>
          </a>
          <div className="brand-text">
            <div className="school-name">
              {schoolName} {slogan}
            </div>

            {motto && (
              <div className="slogan" style={{ opacity: 0.9 }}>
                {motto}
              </div>
            )}

            <div className="contact small">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  style={{ textDecoration: "none", color: "#2a1b6b" }}
                >
                  ☎ {phone}
                </a>
              )}

              {phone && email && <span className="sep">|</span>}

              {email && (
                <a
                  href={`mailto:${email}`}
                  style={{ textDecoration: "none", color: "#2a1b6b" }}
                >
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
              if (g.title === "Parents")
                return features.admissions || features.contact;
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

        {social.footer && (
          <div className="social">
            <span className="small">Follow us</span>

            {(Array.isArray(social.order) ? social.order : Object.keys(ICONS)).map((key) => {
              const Icon = ICONS[key];
              if (!Icon) return null;

              const data = {
                ...(DEFAULT_SOCIAL[key] || {}),
                ...(social[key] || {}),
              };

              if (!data?.enabled) return null;

              return (
                <a
                  key={key}
                  href={data.url || "#"}
                  onClick={(e) => !data.url && e.preventDefault()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                >
                  <Icon style={{ color: getIconColor(data) }} />
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