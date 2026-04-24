import React from "react";
import "../../styles/topbar.css";
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

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `#/site/${siteId || ""}${clean}`;
}

export default function Topbar({ settings = {} }) {

  const DEFAULT_SOCIAL = {
  facebook: { enabled: true, url: "https://facebook.com", color: "#1877f2" },
  instagram: { enabled: true, url: "https://instagram.com", color: "#e4405f" },
  tiktok: { enabled: true, url: "https://tiktok.com", color: "#ffffff" },
  linkedin: { enabled: true, url: "https://linkedin.com", color: "#0a66c2" },
  x: { enabled: true, url: "https://x.com", color: "#ffffff" },
  youtube: { enabled: true, url: "https://youtube.com", color: "#ff0000" },
  whatsapp: { enabled: true, url: "https://wa.me/", color: "#25d366" },

  topbar: true,
  footer: true,
};

const social = { ...DEFAULT_SOCIAL, ...(settings?.social || {}) };
  const topLinks = Array.isArray(settings?.topbar_links)
    ? settings.topbar_links
    : [];

  const phone = settings?.phone || "+27 00 000 0000";
  const email = settings?.email || "info@school.co.za";
  const siteId = settings?.site_id || "";

  /* instant navigation helper (same as Navbar/Footer) */
  const navigateTo = (href) => {
    const slug = href.replace(`#/site/${siteId}`, "") || "/";
    window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
  };

  return (
    <div className="topbar" role="banner" aria-label="Top information bar">
      <div className="container topbar-inner">
        <div className="left">
          <div
            className="brand-small"
            aria-hidden="true"
            style={{ width: "25px", height: "25px" }}
          >
            <img
              src="/images/Education.jpg"
              alt="South African Education Logo"
              className="brand-icon"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                borderRadius: "4px",
              }}
            />
          </div>

          <div className="contact">
            <a className="phone" href={`tel:${phone}`} aria-label="Call school">
              ☎ {phone}
            </a>
            <span className="sep">|</span>
            <a
              className="email"
              href={`mailto:${email}`}
              aria-label="Email school"
            >
              ✉️ {email}
            </a>
          </div>
        </div>

        <div className="center">
          <nav className="top-links">
            {topLinks.map((item, index) => {
              if (item.enabled === false) return null;

              const href = buildSiteHref(siteId, item.href);

              return (
                <a
                  key={index}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(href);
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="right">
          {social.topbar ? (
            <div className="social">
              {Object.keys(ICONS).map((key) => {
                const Icon = ICONS[key];
                const data = social[key] || DEFAULT_SOCIAL[key];

                if (!data.enabled) return null;

                return (
                  <a
                    key={key}
                    href={data.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icons"
                    onClick={(e) => !data.url && e.preventDefault()}
                  >
                    <Icon style={{ color: data.color || "#000" }} />
                  </a>
                );
              })}
            </div>
          ) : null}

          <div
            className="auth-links"
            style={{ fontSize: "12px", display: "flex" }}
          >
            <a
              href={buildSiteHref(siteId, "/admissions/apply")}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(buildSiteHref(siteId, "/admissions/apply"));
              }}
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
