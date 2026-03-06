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
  topbar: true,
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

function mergeSchoolFeatures(features) {
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

function buildLink(routePrefix, path) {
  if (!path) return routePrefix;
  if (path === "/") return `${routePrefix}/`;
  return `${routePrefix}${path}`;
}

export default function Topbar({
  settings = {},
  socialLinks = {},
  socialDisplay = {},
  topbarLinks = [],
}) {
  const f = mergeSchoolFeatures(settings?.features);
  const links = mergeSocialLinks(socialLinks || settings?.social_links);
  const display = normalizeSocialDisplay(socialDisplay || settings?.social_display);

  const phone = settings?.phone || "+27 00 000 0000";
  const email = settings?.email || "info@school.co.za";
  const routePrefix = getRoutePrefix(settings);

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
            {topbarLinks?.length > 0 ? (
              topbarLinks.map((item, idx) => {
                const href = item?.href || "#";
                const isExternal = href.startsWith("http");

                return isExternal ? (
                  <a
                    key={`${item?.label || "link"}-${idx}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.label || "Link"}
                  </a>
                ) : (
                  <a
                    key={`${item?.label || "link"}-${idx}`}
                    href={href}
                  >
                    {item?.label || "Link"}
                  </a>
                );
              })
            ) : (
              <>
                {f.news && <a href={buildLink(routePrefix, "/news")}>News</a>}
                {f.resources && (
                  <a href={buildLink(routePrefix, "/resources/subject-choices")}>
                    Resources
                  </a>
                )}
                {f.resources && (
                  <a href={buildLink(routePrefix, "/calendar")}>Calendar</a>
                )}
                {f.notices && (
                  <a href={buildLink(routePrefix, "/notices")}>Notice Board</a>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="right">
          {display.topbar ? (
            <div className="social" aria-label="Social media links">
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

          <div
            className="auth-links"
            style={{ fontSize: "12px", display: "flex" }}
          >
            <a href={buildLink(routePrefix, "/admissions")}>Apply Now</a>
          </div>
        </div>
      </div>
    </div>
  );
}