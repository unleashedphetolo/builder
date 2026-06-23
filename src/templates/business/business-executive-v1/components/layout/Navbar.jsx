import React, { useEffect, useRef, useState } from "react";
import BusinessLink from "../common/BusinessLink";
import { normalizeNavItemsFromPages } from "../../utils/nav";
import BuilderMediaEditor from "../../../../../builder/BuilderMediaEditor";
import fallbackLogo from "../../assets/business-logo.svg";

function getLogoUrl(settings = {}) {
  return (
    settings.logo_url ||
    settings.logoUrl ||
    settings.logo ||
    settings.logo_image ||
    settings.logoImage ||
    settings.brand_logo ||
    settings.brandLogo ||
    settings.business_logo ||
    settings.company_logo ||
    settings.media?.logo_url ||
    settings.media?.logoImage ||
    settings.media?.brandLogo ||
    fallbackLogo
  );
}

export default function Navbar({
  settings,
  navItems = [],
  pages = [],
  currentSlug = "/",
  navigateTo,
  builderMode,
}) {
  const logoSectionRef = useRef(null);
  const [liveSettings, setLiveSettings] = useState(settings || {});
  const [liveNavItems, setLiveNavItems] = useState(
    Array.isArray(navItems) ? navItems : [],
  );
  const [open, setOpen] = useState(false);
  const [logoSelected, setLogoSelected] = useState(false);
  const [logoEditorOpen, setLogoEditorOpen] = useState(false);

  useEffect(() => {
    setLiveSettings(settings || {});
  }, [settings]);

  useEffect(() => {
    setLiveNavItems(Array.isArray(navItems) ? navItems : []);
  }, [navItems]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!builderMode) {
      setLogoSelected(false);
      setLogoEditorOpen(false);
    }
  }, [builderMode]);

  useEffect(() => {
    const mergeLiveSettings = (incoming = {}) => {
      setLiveSettings((previous) => ({
        ...(previous || {}),
        ...(incoming || {}),
        media: {
          ...((previous && previous.media) || {}),
          ...((incoming && incoming.media) || {}),
        },
        features: {
          ...((previous && previous.features) || {}),
          ...((incoming && incoming.features) || {}),
        },
      }));
    };

    const updateLiveNav = (incoming = []) => {
      if (Array.isArray(incoming)) setLiveNavItems(incoming);
    };

    const handleSettingsUpdate = (event) => {
      mergeLiveSettings(event?.detail || {});
    };

    const handleNavUpdate = (event) => {
      updateLiveNav(event?.detail || []);
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
        updateLiveNav(payload.navItems || payload.items || payload.payload || []);
      }
    };

    window.addEventListener("builder:settings-updated", handleSettingsUpdate);
    window.addEventListener("site-settings-updated", handleSettingsUpdate);
    window.addEventListener("builder:nav-updated", handleNavUpdate);
    window.addEventListener("site-nav-updated", handleNavUpdate);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("builder:settings-updated", handleSettingsUpdate);
      window.removeEventListener("site-settings-updated", handleSettingsUpdate);
      window.removeEventListener("builder:nav-updated", handleNavUpdate);
      window.removeEventListener("site-nav-updated", handleNavUpdate);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!builderMode) return undefined;

    const applyEditorState = (detail = {}) => {
      if (typeof detail.open !== "boolean") return;

      const isLogoEditor =
        detail.editorType === "logo" || detail.label === "Edit Logo";

      if (isLogoEditor) {
        setLogoEditorOpen(detail.open);
        setLogoSelected(detail.open);
        return;
      }

      if (detail.open === true) {
        setLogoSelected(false);
        setLogoEditorOpen(false);
      }
    };

    const handleEditorState = (event) => {
      applyEditorState(event?.detail || {});
    };

    const handleEditorMessage = (event) => {
      const payload = event?.data;
      if (!payload || typeof payload !== "object") return;
      if (payload.type !== "builder:media-editor-state") return;

      applyEditorState(payload);
    };

    window.addEventListener("builder:media-editor-state", handleEditorState);
    window.addEventListener("message", handleEditorMessage);

    return () => {
      window.removeEventListener("builder:media-editor-state", handleEditorState);
      window.removeEventListener("message", handleEditorMessage);
    };
  }, [builderMode]);

  useEffect(() => {
    if (!builderMode) return undefined;

    const openLogoEditor = () => {
      setLogoSelected(true);

      window.requestAnimationFrame(() => {
        const editLogoButton = logoSectionRef.current?.querySelector(
          ".navbar-logo-edit-button",
        );

        editLogoButton?.click();
      });
    };

    const handleOpenMediaEditor = (event) => {
      const detail = event?.detail || {};
      if (detail.editorType !== "logo") return;

      openLogoEditor();
    };

    const handleOpenMediaEditorMessage = (event) => {
      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;
      if (payload.type !== "builder:open-media-editor") return;
      if (payload.editorType !== "logo") return;

      openLogoEditor();
    };

    window.addEventListener("builder:open-media-editor", handleOpenMediaEditor);
    window.addEventListener("message", handleOpenMediaEditorMessage);

    return () => {
      window.removeEventListener("builder:open-media-editor", handleOpenMediaEditor);
      window.removeEventListener("message", handleOpenMediaEditorMessage);
    };
  }, [builderMode]);

  useEffect(() => {
    if (!builderMode || !logoSelected || logoEditorOpen) return undefined;

    const handleOutsidePointerDown = (event) => {
      if (!logoSectionRef.current?.contains(event.target)) {
        setLogoSelected(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [builderMode, logoSelected, logoEditorOpen]);

  const links = normalizeNavItemsFromPages({
    navItems: liveNavItems,
    pages,
    location: "header",
  });

  const closeMenu = () => setOpen(false);
  const logoUrl = getLogoUrl(liveSettings);
  const businessName =
    liveSettings.site_name ||
    liveSettings.business_name ||
    liveSettings.company_name ||
    "Executive Business";
  const tagline =
    liveSettings.tagline ||
    liveSettings.motto ||
    "Corporate growth, governance and delivery";

  const handleLogoSave = (patch = {}) => {
    if (!Object.prototype.hasOwnProperty.call(patch, "logo_url")) return;

    setLiveSettings((previous) => ({
      ...(previous || {}),
      logo_url: patch.logo_url || "",
      media: {
        ...((previous && previous.media) || {}),
        logo_url: patch.logo_url || "",
      },
    }));
  };

  const handleLogoTargetClick = (event) => {
    if (!builderMode) return;

    event.preventDefault();
    event.stopPropagation();

    setLogoSelected(true);

    const editLogoButton = logoSectionRef.current?.querySelector(
      ".navbar-logo-edit-button",
    );

    editLogoButton?.click();
  };

  return (
    <header className="business-navbar">
      <div className="business-container business-navbar__inner">
        <div
          ref={logoSectionRef}
          className={`business-logo-section ${
            builderMode ? "builder-logo-editable" : ""
          } ${builderMode && logoSelected ? "logo-editor-selected" : ""}`}
        >
          <BuilderMediaEditor
            enabled={builderMode}
            type="logo"
            label="Edit Logo"
            value={logoUrl}
            settings={liveSettings}
            triggerLabel="Edit Logo"
            triggerClassName="navbar-logo-edit-button"
            triggerTitle="Edit business logo"
            onSave={handleLogoSave}
          >
            <BusinessLink
              settings={liveSettings}
              navigateTo={navigateTo}
              builderMode={builderMode}
              href="/"
              className="business-brand"
              onClick={(event) => {
                if (builderMode && logoSelected) {
                  event.preventDefault();
                  return;
                }

                closeMenu();
              }}
            >
              <span
                className={`business-brand__mark builder-logo-target ${
                  builderMode && logoSelected ? "is-selected" : ""
                }`}
                onClick={handleLogoTargetClick}
              >
                <img
                  src={logoUrl}
                  alt={`${businessName} logo`}
                  className="business-logo-image logo-image"
                />

                {builderMode && logoSelected && (
                  <>
                    <span className="builder-logo-handle handle-tl" />
                    <span className="builder-logo-handle handle-tr" />
                    <span className="builder-logo-handle handle-bl" />
                    <span className="builder-logo-handle handle-br" />
                  </>
                )}
              </span>

              <span className="business-brand__copy">
                <strong>{businessName}</strong>
                <small>{tagline}</small>
              </span>
            </BusinessLink>
          </BuilderMediaEditor>
        </div>

        <button
          type="button"
          className={`business-menu-toggle ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`business-nav-links ${open ? "is-open" : ""}`}
          aria-label="Business navigation"
        >
          {links.map((item) => {
            const href = item.href || item.path || item.slug || "/";
            const active =
              currentSlug === href || (href !== "/" && currentSlug.startsWith(href));

            return (
              <BusinessLink
                key={`${item.label}-${href}`}
                settings={liveSettings}
                navigateTo={navigateTo}
                builderMode={builderMode}
                href={href}
                className={`business-nav-link ${active ? "is-active" : ""}`}
                onClick={closeMenu}
              >
                {item.label}
              </BusinessLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
