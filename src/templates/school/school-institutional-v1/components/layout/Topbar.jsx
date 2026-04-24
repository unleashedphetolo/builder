import React, { useEffect, useMemo, useState } from "react";
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

  const topLinks = Array.isArray(liveSettings?.topbar_links)
    ? liveSettings.topbar_links
    : [];

  const phone = liveSettings?.phone || "+27 00 000 0000";
  const email = liveSettings?.email || "info@school.co.za";
  const siteId = liveSettings?.site_id || "";

  const getIconColor = (data = {}) => {
    const mode = data.colorMode || "original";

    if (mode === "mono") {
      return data.monoColor || "#ffffff";
    }

    return data.originalColor || data.color || "#ffffff";
  };

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
              {(Array.isArray(social.order) ? social.order : Object.keys(ICONS)).map((key) => {
                const Icon = ICONS[key];
                if (!Icon) return null;

                const data = {
                  ...(DEFAULT_SOCIAL[key] || {}),
                  ...(social[key] || {}),
                };

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
                    <Icon style={{ color: getIconColor(data) }} />
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