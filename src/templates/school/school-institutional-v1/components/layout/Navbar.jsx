import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import BuilderMediaEditor from "../../../../../builder/BuilderMediaEditor";
import "../../styles/navbar.css";
import logos from "../../assets/institutional.png";

const DEFAULT_FEATURES = {
  about: true,
  digitalLibrary: false,
  activities: true,
  resources: true,
  news: true,
  admissions: true,
  gallery: true,
  robotics: true,
  contact: true,
};

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `#/site/${siteId || ""}${clean}`;
}

function normalizeSlug(slug = "/") {
  const raw = String(slug || "/").trim();

  const cleanRaw = raw
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  if (!cleanRaw || cleanRaw.toLowerCase() === "home") return "/";

  return `/${cleanRaw}`;
}

function hrefToSlug(href = "", siteId = "") {
  if (!href) return "/";
  if (String(href).startsWith("http")) return href;

  const withoutHash = String(href).replace(/^#/, "");
  const sitePrefix = `/site/${siteId || ""}`;

  if (withoutHash.startsWith(sitePrefix)) {
    return normalizeSlug(withoutHash.replace(sitePrefix, "") || "/");
  }

  return normalizeSlug(withoutHash);
}

export default function Navbar({
  settings = {},
  navItems = [],
  navigateTo,
  builderMode = false,
}) {
  const logoSectionRef = useRef(null);

  const [liveSettings, setLiveSettings] = useState(settings || {});
  const [liveNavItems, setLiveNavItems] = useState(navItems || []);
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
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
      setLiveSettings((prev) => ({
        ...(prev || {}),
        ...(incoming || {}),
        features: {
          ...((prev && prev.features) || {}),
          ...((incoming && incoming.features) || {}),
        },
      }));
    };

    const updateLiveNav = (incoming = []) => {
      if (Array.isArray(incoming)) {
        setLiveNavItems(incoming);
      }
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
        updateLiveNav(
          payload.navItems || payload.items || payload.payload || [],
        );
      }
    };

    window.addEventListener("builder:settings-updated", handleSettingsUpdate);
    window.addEventListener("site-settings-updated", handleSettingsUpdate);
    window.addEventListener("builder:nav-updated", handleNavUpdate);
    window.addEventListener("site-nav-updated", handleNavUpdate);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener(
        "builder:settings-updated",
        handleSettingsUpdate,
      );
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
      window.removeEventListener(
        "builder:media-editor-state",
        handleEditorState,
      );
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
      window.removeEventListener(
        "builder:open-media-editor",
        handleOpenMediaEditor,
      );
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

  const features = {
    ...DEFAULT_FEATURES,
    ...(liveSettings?.features || {}),
  };

  const logoUrl = liveSettings?.logo_url || logos;
  const schoolName = liveSettings?.site_name || "School";
  const tagline = liveSettings?.tagline || "Secondary School";
  const siteId = liveSettings?.site_id || "";

  const handleLogoSave = (patch = {}) => {
    if (!Object.prototype.hasOwnProperty.call(patch, "logo_url")) return;

    setLiveSettings((previous) => ({
      ...(previous || {}),
      logo_url: patch.logo_url || "",
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

  const headerNavItems = useMemo(() => {
    return Array.isArray(liveNavItems)
      ? liveNavItems
          .filter((item) => item && (item.location || "header") === "header")
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      : [];
  }, [liveNavItems]);

  const visibleHeaderNavItems = useMemo(() => {
    return headerNavItems.filter((item) => item.is_visible !== false);
  }, [headerNavItems]);

  const visibleNavByLabel = useMemo(() => {
    const map = new Map();

    visibleHeaderNavItems.forEach((item) => {
      const key = String(item.label || "")
        .trim()
        .toLowerCase();

      if (key) {
        map.set(key, item);
      }
    });

    return map;
  }, [visibleHeaderNavItems]);

  const visibleNavBySlug = useMemo(() => {
    const map = new Map();

    visibleHeaderNavItems.forEach((item) => {
      const slug = hrefToSlug(item.href || "/", siteId);

      if (slug) {
        map.set(slug, item);
      }
    });

    return map;
  }, [visibleHeaderNavItems, siteId]);

  const allNavByLabel = useMemo(() => {
    const map = new Map();

    headerNavItems.forEach((item) => {
      const key = String(item.label || "")
        .trim()
        .toLowerCase();

      if (key) {
        map.set(key, item);
      }
    });

    return map;
  }, [headerNavItems]);

  const allNavBySlug = useMemo(() => {
    const map = new Map();

    headerNavItems.forEach((item) => {
      const slug = hrefToSlug(item.href || "/", siteId);

      if (slug) {
        map.set(slug, item);
      }
    });

    return map;
  }, [headerNavItems, siteId]);

  const isVisibleNavTarget = (label, fallbackPath) => {
    const labelKey = String(label || "")
      .trim()
      .toLowerCase();

    const slugKey = normalizeSlug(fallbackPath || "/");

    const found = allNavByLabel.get(labelKey) || allNavBySlug.get(slugKey);

    if (!found) return false;

    return found.is_visible !== false;
  };

  const getDbHref = (label, fallbackPath) => {
    const labelKey = String(label || "")
      .trim()
      .toLowerCase();

    const slugKey = normalizeSlug(fallbackPath || "/");

    const found =
      visibleNavByLabel.get(labelKey) || visibleNavBySlug.get(slugKey);

    if (found?.href) {
      return buildSiteHref(siteId, found.href);
    }

    return buildSiteHref(siteId, fallbackPath);
  };

  const filterMenuItems = (items = []) => {
    return items.filter((item) => {
      const slug = hrefToSlug(item.to, siteId);
      return isVisibleNavTarget(item.label, slug);
    });
  };

  const menus = useMemo(
    () => ({
      about: [
        {
          to: buildSiteHref(siteId, "/about/who-we-are"),
          label: "Who We Are",
        },
        {
          to: buildSiteHref(siteId, "/about/vision-mission"),
          label: "Vision & Mission",
        },
        { to: buildSiteHref(siteId, "/staff"), label: "Staff Members" },
        { to: buildSiteHref(siteId, "/sgb"), label: "SGB" },
        { to: buildSiteHref(siteId, "/facilities"), label: "Facilities" },
        {
          to: buildSiteHref(siteId, "/about/history"),
          label: "Our History",
        },
      ],
      activities: [
        {
          to: buildSiteHref(siteId, "/activities/academics"),
          label: "Academics",
        },
        {
          to: buildSiteHref(siteId, "/activities/sports"),
          label: "Sports & Recreation",
        },
        {
          to: buildSiteHref(siteId, "/activities/culture"),
          label: "Culture & Activities",
        },
        {
          to: buildSiteHref(siteId, "/activities/facilities"),
          label: "Campus Facilities",
        },
      ],
      resources: [
        {
          to: buildSiteHref(siteId, "/resources/subject-choices"),
          label: "Subject Choices",
        },
        {
          to: buildSiteHref(siteId, "/resources/term-plan"),
          label: "Term Plan",
        },
        {
          to: buildSiteHref(siteId, "/resources/exam-schedule"),
          label: "Exam Schedule",
        },
        {
          to: buildSiteHref(siteId, "/resources/code-of-conduct"),
          label: "Code of Conduct",
        },
        {
          to: buildSiteHref(siteId, "/resources/stationary-list"),
          label: "Stationary List",
        },
        {
          to: buildSiteHref(siteId, "/resources/calendar"),
          label: "Calendar",
        },
      ],
      news: [
        { to: buildSiteHref(siteId, "/news"), label: "Newsletters" },
        {
          to: buildSiteHref(siteId, "/schoolcalendar"),
          label: "School Calendar",
        },
      ],
      admissions: [
        {
          to: buildSiteHref(siteId, "/admissions/howtoapply"),
          label: "How to Apply",
        },
        {
          to: buildSiteHref(siteId, "/admissions/requirements"),
          label: "Entry Requirements",
        },
        {
          to: buildSiteHref(siteId, "/admissions/apply"),
          label: "Apply Now",
        },
      ],
    }),
    [siteId],
  );

  const toggleDropdown = (key) => {
    setDropdown((cur) => (cur === key ? null : key));
  };

  const Drop = ({ id, label, items, href }) => (
    <div
      className="dropdown parent"
      onMouseEnter={() => setDropdown(id)}
      onMouseLeave={() => setDropdown(null)}
    >
      <button
        type="button"
        className="drop-btn"
        onClick={() => {
          if (window.innerWidth <= 880) {
            toggleDropdown(id);
          } else if (href) {
            const slug = href.replace(`#/site/${siteId}`, "") || "/";
            navigateTo?.(slug);
          }
        }}
        aria-expanded={dropdown === id}
      >
        {label} <IoChevronDown />
      </button>

      <div className={`drop-menu ${dropdown === id ? "show" : ""}`}>
        {items.map((it) => (
          <a
            key={`${it.to}-${it.label}`}
            href={it.to}
            onClick={(e) => {
              e.preventDefault();
              const slug = it.to.replace(`#/site/${siteId}`, "") || "/";
              navigateTo?.(slug);
              setOpen(false);
            }}
          >
            {it.label}
          </a>
        ))}
      </div>
    </div>
  );

  const topNav = useMemo(() => {
    const items = [];

    if (isVisibleNavTarget("Home", "/")) {
      items.push({
        type: "link",
        key: "home",
        label: "Home",
        href: getDbHref("Home", "/"),
      });
    }

    const aboutMenu = filterMenuItems(menus.about);

    if (
      features.about &&
      isVisibleNavTarget("About", "/about") &&
      aboutMenu.length
    ) {
      items.push({
        type: "drop",
        key: "about",
        label: "About Us",
        href: getDbHref("About", "/about"),
        menu: aboutMenu,
      });
    }

    const activitiesMenu = filterMenuItems(menus.activities);

    if (
      features.activities &&
      isVisibleNavTarget("Activities", "/activities") &&
      activitiesMenu.length
    ) {
      items.push({
        type: "drop",
        key: "activities",
        label: "Activities",
        href: getDbHref("Activities", "/activities"),
        menu: activitiesMenu,
      });
    }

    const resourcesMenu = filterMenuItems(menus.resources);

    if (
      features.resources &&
      isVisibleNavTarget("Resources", "/resources") &&
      resourcesMenu.length
    ) {
      items.push({
        type: "drop",
        key: "resources",
        label: "Resources",
        href: getDbHref("Resources", "/resources"),
        menu: resourcesMenu,
      });
    }

    const newsMenu = filterMenuItems(menus.news);

    if (
      features.news &&
      isVisibleNavTarget("News", "/news") &&
      newsMenu.length
    ) {
      items.push({
        type: "drop",
        key: "news",
        label: "News",
        href: getDbHref("News", "/news"),
        menu: newsMenu,
      });
    }

    const admissionsMenu = filterMenuItems(menus.admissions);

    if (
      features.admissions &&
      isVisibleNavTarget("Admissions", "/admissions") &&
      admissionsMenu.length
    ) {
      items.push({
        type: "drop",
        key: "admissions",
        label: "Admissions",
        href: getDbHref("Admissions", "/admissions"),
        menu: admissionsMenu,
      });
    }

    if (features.gallery && isVisibleNavTarget("Gallery", "/gallery")) {
      items.push({
        type: "link",
        key: "gallery",
        label: "Gallery",
        href: getDbHref("Gallery", "/gallery"),
      });
    }

    if (features.robotics && isVisibleNavTarget("Robotics Club", "/robotics")) {
      items.push({
        type: "link",
        key: "robotics",
        label: "Robotics Club",
        href: getDbHref("Robotics Club", "/robotics"),
      });
    }

    if (features.contact && isVisibleNavTarget("Contact", "/contact")) {
      items.push({
        type: "link",
        key: "contact",
        label: "Contact",
        href: getDbHref("Contact", "/contact"),
      });
    }

    return items;
  }, [
    features,
    menus,
    siteId,
    allNavByLabel,
    allNavBySlug,
    visibleNavByLabel,
    visibleNavBySlug,
  ]);

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <div
          ref={logoSectionRef}
          className={`logo-section ${
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
            triggerTitle="Edit website logo"
            onSave={handleLogoSave}
          >
            <a
              href={buildSiteHref(siteId, "/")}
              className="logo-link"
              aria-label="Go to home"
              onClick={(e) => {
                if (builderMode && logoSelected) {
                  e.preventDefault();
                  return;
                }

                e.preventDefault();
                navigateTo?.("/");
              }}
            >
              <span
                className={`builder-logo-target ${
                  builderMode && logoSelected ? "is-selected" : ""
                }`}
                onClick={handleLogoTargetClick}
              >
                <img
                  src={logoUrl}
                  alt={`${schoolName} logo`}
                  className="logo-image"
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

              <div className="logo-text">
                <h1 className="brand-name">{schoolName}</h1>
                <p className="slogan">{tagline}</p>
              </div>
            </a>
          </BuilderMediaEditor>
        </div>

        <nav
          className={`nav-links ${open ? "open" : ""}`}
          aria-label="Main navigation"
        >
          {topNav.map((item) =>
            item.type === "drop" ? (
              <Drop
                key={item.key}
                id={item.key}
                label={item.label}
                href={item.href}
                items={item.menu}
              />
            ) : (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const slug = item.href.replace(`#/site/${siteId}`, "") || "/";
                  navigateTo?.(slug);
                  setOpen(false);
                }}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <button
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="toggle menu"
          aria-expanded={open}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
