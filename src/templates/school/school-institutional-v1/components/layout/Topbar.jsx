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

const DEFAULT_FEATURES = {
  news: true,
  resources: true,
  notices: true,
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

const DEFAULT_SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  x: "https://x.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  tiktok: "https://tiktok.com",
  linkedin: "https://linkedin.com",
  whatsapp: "https://wa.me/",
};

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `#/site/${siteId || ""}${clean}`;
}

export default function Topbar({ settings = {} }) {
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

  const phone = settings?.phone || "+27 00 000 0000";
  const email = settings?.email || "info@school.co.za";
  const siteId = settings?.site_id || "";

  /* instant navigation helper (same as Navbar/Footer) */
  const navigateTo = (href) => {
    const slug = href.replace(`#/site/${siteId}`, "") || "/";
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug })
    );
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
          <nav className="top-links" aria-label="Top navigation">
            {features.news && (
              <a
                href={buildSiteHref(siteId, "/news")}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(buildSiteHref(siteId, "/news"));
                }}
              >
                News
              </a>
            )}

            {features.resources && (
              <a
                href={buildSiteHref(siteId, "/resources/subject-choices")}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(
                    buildSiteHref(siteId, "/resources/subject-choices")
                  );
                }}
              >
                Resources
              </a>
            )}

            {features.resources && (
              <a
                href={buildSiteHref(siteId, "/resources/calendar")}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(buildSiteHref(siteId, "/resources/calendar"));
                }}
              >
                Calendar
              </a>
            )}

            {features.notices && (
              <a
                href={buildSiteHref(siteId, "/notices")}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(buildSiteHref(siteId, "/notices"));
                }}
              >
                Notice Board
              </a>
            )}
          </nav>
        </div>

        <div className="right">
          {socialDisplay.topbar ? (
            <div className="social" aria-label="Social media links">
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
                    className="social-icons"
                    title={key}
                    onClick={(e) => href === "#" && e.preventDefault()}
                  >
                    <Icon />
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