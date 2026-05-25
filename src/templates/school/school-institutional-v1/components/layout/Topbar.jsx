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
import { FiRefreshCw } from "react-icons/fi";
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

function normalizeHref(href = "/") {
  if (!href) return "/";
  if (String(href).startsWith("http")) return href;

  const clean = String(href)
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  if (!clean || clean.toLowerCase() === "home") return "/";

  return `/${clean}`;
}

export default function Topbar({
  settings = {},
  navItems = [],
  socialLinks,
  socialDisplay,
  topbarLinks = [],
  navigateTo,
}) {
  const [liveSettings, setLiveSettings] = useState(settings || {});
  const [liveNavItems, setLiveNavItems] = useState(navItems || []);

  useEffect(() => {
    setLiveSettings(settings || {});
  }, [settings]);

  useEffect(() => {
    setLiveNavItems(Array.isArray(navItems) ? navItems : []);
  }, [navItems]);

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
        features: {
          ...((prev && prev.features) || {}),
          ...((incoming && incoming.features) || {}),
        },
      }));
    };

    const handleCustomSettingsUpdate = (event) => {
      mergeLiveSettings(event?.detail || {});
    };

    const handleNavUpdate = (event) => {
      const incoming = event?.detail || [];

      if (Array.isArray(incoming)) {
        setLiveNavItems(incoming);
      }
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

      if (
        payload.type === "builder:nav-updated" ||
        payload.type === "site-nav-updated"
      ) {
        const incoming =
          payload.navItems || payload.items || payload.payload || [];

        if (Array.isArray(incoming)) {
          setLiveNavItems(incoming);
        }
      }
    };

    window.addEventListener(
      "builder:settings-updated",
      handleCustomSettingsUpdate,
    );
    window.addEventListener(
      "site-settings-updated",
      handleCustomSettingsUpdate,
    );
    window.addEventListener("builder:nav-updated", handleNavUpdate);
    window.addEventListener("site-nav-updated", handleNavUpdate);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener(
        "builder:settings-updated",
        handleCustomSettingsUpdate,
      );
      window.removeEventListener(
        "site-settings-updated",
        handleCustomSettingsUpdate,
      );
      window.removeEventListener("builder:nav-updated", handleNavUpdate);
      window.removeEventListener("site-nav-updated", handleNavUpdate);
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

  const topbarEnabled = liveSettings?.features?.topbar !== false;

  const resolvedSocialLinks =
    socialLinks || liveSettings?.social_links || liveSettings?.social || {};
  const resolvedSocialDisplay =
    socialDisplay || liveSettings?.social_display || {};

  const social = useMemo(
    () => ({
      ...DEFAULT_SOCIAL,
      ...resolvedSocialLinks,
      topbar: resolvedSocialDisplay.topbar ?? DEFAULT_SOCIAL.topbar,
      footer: resolvedSocialDisplay.footer ?? DEFAULT_SOCIAL.footer,
      order: Array.isArray(resolvedSocialDisplay.order)
        ? resolvedSocialDisplay.order
        : DEFAULT_SOCIAL.order,
    }),
    [resolvedSocialLinks, resolvedSocialDisplay],
  );

  const allTopbarNavItems = useMemo(() => {
    return (Array.isArray(liveNavItems) ? liveNavItems : [])
      .filter((item) => item?.location === "topbar")
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }, [liveNavItems]);

  const isLinkVisibleByPage = (href = "/") => {
    const cleanHref = normalizeHref(href);

    if (String(cleanHref).startsWith("http")) {
      return true;
    }

    const matched = (Array.isArray(liveNavItems) ? liveNavItems : []).find(
      (item) => {
        if (!item?.href) return false;
        return normalizeHref(item.href) === cleanHref;
      },
    );

    if (!matched) return false;

    return matched.is_visible !== false;
  };

  const navTopLinks = useMemo(() => {
    return allTopbarNavItems
      .filter((item) => item?.is_visible !== false)
      .map((item) => ({
        label: item.label,
        href: item.href || "/",
        is_external: item.is_external === true,
      }));
  }, [allTopbarNavItems]);

  const fallbackTopLinks = useMemo(() => {
    const links = Array.isArray(topbarLinks)
      ? topbarLinks
      : Array.isArray(liveSettings?.topbar_links)
        ? liveSettings.topbar_links
        : [];

    return links
      .filter((item) => item?.enabled !== false)
      .filter((item) => isLinkVisibleByPage(item?.href || "/"))
      .map((item) => ({
        label: item.label || item.title,
        href: item.href || "/",
        is_external:
          item.is_external === true ||
          String(item.href || "").startsWith("http"),
      }));
  }, [topbarLinks, liveSettings?.topbar_links, liveNavItems]);

  const topLinks = allTopbarNavItems.length ? navTopLinks : fallbackTopLinks;

  const phone = liveSettings?.phone || "+27 00 000 0000";
  const email = liveSettings?.email || "info@school.co.za";
  const siteId = liveSettings?.site_id || "";

  const applyNowVisible = isLinkVisibleByPage("/admissions/apply");

  const getIconColor = (data = {}) => {
    const mode = data.colorMode || "original";

    if (mode === "mono") {
      return data.monoColor || "#ffffff";
    }

    return data.originalColor || data.color || "#ffffff";
  };

  const goTo = (href) => {
    if (String(href || "").startsWith("http")) return;

    const cleanSlug = normalizeHref(href);
    const fullHref = buildSiteHref(siteId, cleanSlug);

    if (navigateTo) {
      navigateTo(cleanSlug);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: cleanSlug }),
    );

    window.location.hash = fullHref.replace(/^#/, "");
  };

  if (!topbarEnabled) {
    return null;
  }

  return (
    <div className="topbar" role="banner" aria-label="Top information bar">
      <div className="container topbar-inner">
        <div className="left">
          <button
            type="button"
            className="brand-small"
            aria-label="Refresh page"
            onClick={() => window.location.reload()}
            style={{
              width: "20px",
              height: "20px",
              border: "none",
              background: "transparent",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <FiRefreshCw
              className="brand-icon"
              style={{
                width: "100%",
                height: "100%",
                color: "#948f8f",
                display: "block",
              }}
            />
          </button>

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
              if (!item?.label) return null;

              const href = item.is_external
                ? item.href
                : buildSiteHref(siteId, item.href);

              return (
                <a
                  key={`${item.label}-${item.href}-${index}`}
                  href={href}
                  target={item.is_external ? "_blank" : undefined}
                  rel={item.is_external ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (item.is_external) return;

                    e.preventDefault();
                    goTo(item.href);
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
              {(Array.isArray(social.order)
                ? social.order
                : Object.keys(ICONS)
              ).map((key) => {
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

          {applyNowVisible && (
            <div
              className="auth-links"
              style={{ fontSize: "12px", display: "flex" }}
            >
              <a
                href={buildSiteHref(siteId, "/admissions/apply")}
                onClick={(e) => {
                  e.preventDefault();
                  goTo("/admissions/apply");
                }}
              >
                Apply Now
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}