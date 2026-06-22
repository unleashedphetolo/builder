import { useEffect, useMemo, useRef, useState } from "react";
import BuilderNavbar from "./BuilderNavbar";
import BuilderFooter from "./BuilderFooter";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./BuilderCanvas";
import BuilderSectionEditor from "./section-editor/BuilderSectionEditor";
import TemplateSelector from "./TemplateSelector";
import "../styles/builder.css";

import { supabase } from "../supabase/client";
import { DEFAULT_TEMPLATES } from "../templates/registry";
import {
  ensureSiteForOrg,
  seedSiteFromTemplate,
  syncSitePagesForTemplate,
  loadSitePages,
  loadSiteSettings,
  updateSiteSettings,
  loadSiteNav,
  updateSitePage,
  updatePageContentField,
  updatePageSortOrder,
  updateSiteTemplateOnly,
  updatePageVisibilityEverywhere,
  updateTopbarVisibility,
  normalizePageSlug,
  loadPageSections,
  updateSiteSection,
  createSiteSectionFromEditorRequest,
  reorderPageSections,
} from "./siteService";


function normalizeSectionLookupKey(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[\s/-]+/g, "_");
}

function getSectionLookupKey(section = {}) {
  return (
    section?.section_key ||
    section?.key ||
    section?.content?._section_key ||
    section?.content?.__section_key ||
    section?.content?.section_key ||
    section?.content?.editor_section_type ||
    section?.content?._editor_section_type ||
    ""
  );
}

function getSectionLookupType(section = {}) {
  return (
    section?.content?._editor_section_type ||
    section?.content?.editor_section_type ||
    section?.content?.section_type ||
    section?.section_type ||
    section?.type ||
    getSectionLookupKey(section) ||
    ""
  );
}

function getSectionLookupPageSlug(section = {}) {
  return normalizeSectionLookupKey(
    section?.page_slug ||
      section?.slug ||
      section?.content?.page_slug ||
      section?.content?._page_slug ||
      "",
  );
}

function buildSectionStatePayload(section = {}, request = {}) {
  const sectionKey =
    request.sectionKey ||
    request.section_key ||
    getSectionLookupKey(section) ||
    request.sectionType ||
    request.section_type ||
    "";

  const sectionType =
    request.editorSectionType ||
    request.editor_section_type ||
    request.sectionType ||
    request.section_type ||
    getSectionLookupType(section) ||
    "";

  return {
    open: true,
    editorType: "section",
    sectionId: section.id,
    sectionKey,
    sectionType,
    editorSectionType: sectionType,
    sidebarPanel: "sections",
  };
}



function isPlainSectionContent(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneSectionValue(value) {
  if (value === undefined || value === null) return value;

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function isMissingSectionContentValue(value, fallbackValue) {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0 && Array.isArray(fallbackValue);
  if (isPlainSectionContent(value)) {
    return (
      Object.keys(value).length === 0 &&
      isPlainSectionContent(fallbackValue)
    );
  }

  return String(value).trim() === "" && String(fallbackValue ?? "").trim() !== "";
}

function mergeSectionContentWithFallback(fallbackContent = {}, currentContent = {}) {
  const fallback = isPlainSectionContent(fallbackContent)
    ? cloneSectionValue(fallbackContent)
    : {};
  const current = isPlainSectionContent(currentContent)
    ? cloneSectionValue(currentContent)
    : {};

  const merged = {
    ...fallback,
    ...current,
  };

  Object.entries(fallback).forEach(([key, fallbackValue]) => {
    const currentValue = current[key];

    if (isMissingSectionContentValue(currentValue, fallbackValue)) {
      merged[key] = cloneSectionValue(fallbackValue);
      return;
    }

    if (
      Array.isArray(fallbackValue) &&
      Array.isArray(currentValue) &&
      fallbackValue.some((item) => isPlainSectionContent(item)) &&
      currentValue.some((item) => isPlainSectionContent(item))
    ) {
      merged[key] = currentValue.map((item, index) => {
        if (!isPlainSectionContent(item)) return item;

        const fallbackItem =
          isPlainSectionContent(fallbackValue[index])
            ? fallbackValue[index]
            : isPlainSectionContent(fallbackValue[0])
              ? fallbackValue[0]
              : {};

        return mergeSectionContentWithFallback(fallbackItem, item);
      });
      return;
    }

    if (
      isPlainSectionContent(fallbackValue) &&
      isPlainSectionContent(currentValue)
    ) {
      merged[key] = mergeSectionContentWithFallback(fallbackValue, currentValue);
    }
  });

  return merged;
}

function hasSectionContentChanged(firstValue = {}, secondValue = {}) {
  try {
    return JSON.stringify(firstValue || {}) !== JSON.stringify(secondValue || {});
  } catch {
    return true;
  }
}

function NoTemplateSelected({ onChooseTemplate }) {
  return (
    <main
      className="builder-canvas no-template-selected-canvas"
      style={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.04), rgba(37,99,235,0.06))",
      }}
    >
      <section
        style={{
          width: "min(720px, 100%)",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "24px",
          padding: "34px",
          boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
          textAlign: "center",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(37,99,235,0.1)",
            color: "#2563eb",
            fontSize: "30px",
            fontWeight: "900",
          }}
        >
          🧩
        </div>

        <h1
          style={{
            margin: "0",
            color: "#0f172a",
            fontSize: "28px",
            lineHeight: "1.2",
            fontWeight: "850",
          }}
        >
          Choose a website template to start building
        </h1>

        <p
          style={{
            margin: "12px auto 0",
            maxWidth: "560px",
            color: "#64748b",
            fontSize: "15px",
            lineHeight: "1.7",
          }}
        >
          Select a professional template first. After that, you can edit pages,
          content, colors, logo, social media, topbar and website details.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px",
            margin: "24px 0",
            textAlign: "left",
          }}
        >
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "14px",
              background: "#f8fafc",
            }}
          >
            <strong style={{ color: "#0f172a", fontSize: "13px" }}>
              1. Pick template
            </strong>
            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "12px",
              }}
            >
              Choose school, business or portfolio structure.
            </p>
          </div>

          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "14px",
              background: "#f8fafc",
            }}
          >
            <strong style={{ color: "#0f172a", fontSize: "13px" }}>
              2. Edit content
            </strong>
            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "12px",
              }}
            >
              Update pages, name, logo, colors and contact details.
            </p>
          </div>

          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "14px",
              background: "#f8fafc",
            }}
          >
            <strong style={{ color: "#0f172a", fontSize: "13px" }}>
              3. Preview & publish
            </strong>
            <p
              style={{
                margin: "6px 0 0",
                color: "#64748b",
                fontSize: "12px",
              }}
            >
              Preview the website before publishing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChooseTemplate}
          style={{
            border: "0",
            borderRadius: "14px",
            padding: "13px 20px",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 12px 28px rgba(37,99,235,0.28)",
          }}
        >
          Choose Template
        </button>
      </section>
    </main>
  );
}

function SelectedTemplateLoading({
  layoutKey,
  templateKey,
  progress = 12,
  loadingText = "Preparing your selected website...",
}) {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress || 0)));

  return (
    <main
      className="builder-canvas selected-template-loading-canvas"
      style={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.04), rgba(37,99,235,0.06))",
      }}
    >
      <section
        style={{
          width: "min(660px, 100%)",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "24px",
          padding: "30px",
          boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
          textAlign: "center",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "20px",
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(37,99,235,0.1)",
            color: "#2563eb",
            fontSize: "24px",
            fontWeight: "900",
          }}
        >
          {safeProgress >= 100 ? "✓" : "↻"}
        </div>

        <div
          style={{
            display: "inline-flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
            padding: "7px 12px",
            borderRadius: "999px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            color: "#1d4ed8",
            fontSize: "12px",
            fontWeight: "850",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Selected template
        </div>

        <h1
          style={{
            margin: "16px 0 0",
            color: "#0f172a",
            fontSize: "26px",
            lineHeight: "1.2",
            fontWeight: "850",
          }}
        >
          Preparing your selected website
        </h1>

        <p
          style={{
            margin: "10px auto 0",
            maxWidth: "500px",
            color: "#64748b",
            fontSize: "14px",
            lineHeight: "1.7",
          }}
        >
          {loadingText}
        </p>

        <div
          style={{
            marginTop: "22px",
            padding: "16px",
            borderRadius: "18px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                color: "#0f172a",
                fontSize: "13px",
                fontWeight: "850",
              }}
            >
              Loading builder workspace
            </span>

            <span
              style={{
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "900",
              }}
            >
              {safeProgress}%
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              borderRadius: "999px",
              overflow: "hidden",
              background: "#e2e8f0",
            }}
          >
            <div
              style={{
                width: `${safeProgress}%`,
                height: "100%",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #2563eb, #22c55e, #06b6d4)",
                transition: "width 280ms ease",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "8px",
              marginTop: "14px",
            }}
          >
            <div
              style={{
                padding: "10px",
                borderRadius: "14px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong style={{ color: "#0f172a", fontSize: "12px" }}>
                Website
              </strong>
              <p
                style={{
                  margin: "5px 0 0",
                  color: safeProgress >= 25 ? "#16a34a" : "#64748b",
                  fontSize: "11px",
                  fontWeight: "800",
                }}
              >
                {safeProgress >= 25 ? "Ready" : "Checking"}
              </p>
            </div>

            <div
              style={{
                padding: "10px",
                borderRadius: "14px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong style={{ color: "#0f172a", fontSize: "12px" }}>
                Pages
              </strong>
              <p
                style={{
                  margin: "5px 0 0",
                  color: safeProgress >= 65 ? "#16a34a" : "#64748b",
                  fontSize: "11px",
                  fontWeight: "800",
                }}
              >
                {safeProgress >= 65 ? "Synced" : "Loading"}
              </p>
            </div>

            <div
              style={{
                padding: "10px",
                borderRadius: "14px",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
              }}
            >
              <strong style={{ color: "#0f172a", fontSize: "12px" }}>
                Preview
              </strong>
              <p
                style={{
                  margin: "5px 0 0",
                  color: safeProgress >= 92 ? "#16a34a" : "#64748b",
                  fontSize: "11px",
                  fontWeight: "800",
                }}
              >
                {safeProgress >= 92 ? "Opening" : "Preparing"}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "12px",
            marginTop: "16px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "14px",
              background: "#ffffff",
            }}
          >
            <strong style={{ color: "#0f172a", fontSize: "13px" }}>
              Category
            </strong>
            <p
              style={{
                margin: "6px 0 0",
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "800",
                textTransform: "capitalize",
              }}
            >
              {layoutKey || "Loading..."}
            </p>
          </div>

          <div
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "14px",
              background: "#ffffff",
            }}
          >
            <strong style={{ color: "#0f172a", fontSize: "13px" }}>
              Template
            </strong>
            <p
              style={{
                margin: "6px 0 0",
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: "800",
                wordBreak: "break-word",
              }}
            >
              {templateKey || "Loading..."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Builder() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth > 1024 : true,
  );

  const [siteId, setSiteId] = useState(null);
  const [layoutKey, setLayoutKey] = useState(null);
  const [templateKey, setTemplateKey] = useState(null);

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const [pages, setPages] = useState([]);
  const [pagesLoaded, setPagesLoaded] = useState(false);
  const [bootingBuilder, setBootingBuilder] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(8);
  const [currentPageId, setCurrentPageId] = useState(null);

  const [siteSettings, setSiteSettings] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [navItems, setNavItems] = useState([]);

  /*
  =============================
  Visual section editing
  =============================
  These states control the enterprise right-side editor for normal website
  sections such as Notice Board, Principal Message, Admissions, Calendar,
  Wall of Fame and Partners.
  */
  const [sections, setSections] = useState([]);
  const [sectionsLoaded, setSectionsLoaded] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [sectionEditorOpen, setSectionEditorOpen] = useState(false);

  const [templateError, setTemplateError] = useState("");

  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [saveStatus, setSaveStatus] = useState("All changes saved");

  const isRestoringRef = useRef(false);
  const hasBootstrappedHistoryRef = useRef(false);
  const settingsSaveTimeoutRef = useRef(null);
  const socialSaveTimeoutRef = useRef(null);

  const hasSelectedTemplate = Boolean(siteId && layoutKey && templateKey);

  const currentPage = useMemo(
    () => pages.find((p) => p.id === currentPageId) || null,
    [pages, currentPageId],
  );

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId) || null,
    [sections, selectedSectionId],
  );

  const hasUsablePages =
    Array.isArray(pages) && pages.length > 0 && Boolean(currentPage);

  const isPreparingSelectedTemplate =
    hasSelectedTemplate && (!pagesLoaded || !hasUsablePages);

  const isLoadingWorkspace = bootingBuilder || isPreparingSelectedTemplate;

  const shouldShowTemplateGuide = !bootingBuilder && !hasSelectedTemplate;

  const loadingText = bootingBuilder
    ? "Checking your account, organization and saved website template."
    : "Loading your saved category, template pages, navigation and live preview.";

  const availableTemplates = useMemo(() => {
    return DEFAULT_TEMPLATES.filter((tpl) => {
      if (!layoutKey) return true;
      return (tpl?.layout_key || "school") === layoutKey;
    });
  }, [layoutKey]);

  const builderSnapshot = useMemo(
    () => ({
      siteSettings,
      organization,
      pages,
      navItems,
      sections,
      selectedSectionId,
      currentPageId,
      layoutKey,
      templateKey,
    }),
    [
      siteSettings,
      organization,
      pages,
      navItems,
      sections,
      selectedSectionId,
      currentPageId,
      layoutKey,
      templateKey,
    ],
  );

  const emitLiveSettingsUpdate = (nextSettings) => {
    window.dispatchEvent(
      new CustomEvent("builder:settings-updated", {
        detail: nextSettings,
      }),
    );

    window.dispatchEvent(
      new CustomEvent("site-settings-updated", {
        detail: nextSettings,
      }),
    );

    window.postMessage(
      {
        type: "builder:settings-updated",
        settings: nextSettings,
      },
      "*",
    );

    window.postMessage(
      {
        type: "site-settings-updated",
        settings: nextSettings,
      },
      "*",
    );
  };

  const emitLiveNavUpdate = (nextNavItems) => {
    window.dispatchEvent(
      new CustomEvent("builder:nav-updated", {
        detail: nextNavItems || [],
      }),
    );

    window.dispatchEvent(
      new CustomEvent("site-nav-updated", {
        detail: nextNavItems || [],
      }),
    );

    window.postMessage(
      {
        type: "builder:nav-updated",
        navItems: nextNavItems || [],
      },
      "*",
    );

    window.postMessage(
      {
        type: "site-nav-updated",
        navItems: nextNavItems || [],
      },
      "*",
    );
  };

  const emitLiveSectionsUpdate = (nextSections) => {
    const safeSections = Array.isArray(nextSections) ? nextSections : [];

    window.dispatchEvent(
      new CustomEvent("builder:sections-updated", {
        detail: safeSections,
      }),
    );

    window.dispatchEvent(
      new CustomEvent("site-sections-updated", {
        detail: safeSections,
      }),
    );

    window.postMessage(
      {
        type: "builder:sections-updated",
        sections: safeSections,
      },
      "*",
    );

    window.postMessage(
      {
        type: "site-sections-updated",
        sections: safeSections,
      },
      "*",
    );
  };

  /*
  =============================
  Enterprise loading progress
  =============================
  */

  useEffect(() => {
    if (!isLoadingWorkspace) {
      setLoadingProgress(100);
      return;
    }

    setLoadingProgress((prev) => {
      if (prev < 10) return 10;
      return Math.min(prev, 92);
    });

    const interval = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 28) return prev + 6;
        if (prev < 55) return prev + 4;
        if (prev < 78) return prev + 3;
        if (prev < 92) return prev + 1;
        return 92;
      });
    }, 220);

    return () => window.clearInterval(interval);
  }, [isLoadingWorkspace, layoutKey, templateKey]);

  /*
  =============================
  Boot builder
  =============================
  */

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setBootingBuilder(true);
        setLoadingProgress(12);

        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        if (!mounted) return;

        if (!user) {
          setPagesLoaded(true);
          setShowTemplateSelector(false);
          return;
        }

        setLoadingProgress(25);

        const { data: profileData, error: profileErr } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (profileErr) {
          console.error("Builder boot profile error:", profileErr);
          setPagesLoaded(true);
          setShowTemplateSelector(false);
          return;
        }

        const orgId = profileData?.organization_id || null;

        if (!orgId) {
          setPagesLoaded(true);
          setShowTemplateSelector(false);
          return;
        }

        const { data: orgData, error: orgErr } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", orgId)
          .maybeSingle();

        if (!mounted) return;

        if (orgErr) {
          console.error("Builder boot organization error:", orgErr);
        } else {
          setOrganization(orgData || null);
        }

        setLoadingProgress(40);

        const { data: existingSite, error: siteErr } = await supabase
          .from("sites")
          .select("*")
          .eq("organization_id", orgId)
          .order("updated_at", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!mounted) return;

        if (siteErr) {
          console.error("Builder boot site error:", siteErr);
          setPagesLoaded(true);
          setShowTemplateSelector(false);
          return;
        }

        if (!existingSite) {
          setPagesLoaded(true);
          setShowTemplateSelector(false);
          return;
        }

        setSiteId(existingSite.id);
        setLayoutKey(existingSite.layout_key || null);
        setTemplateKey(existingSite.template_key || null);
        setLoadingProgress(55);

        if (!existingSite.template_key) {
          setPagesLoaded(true);
          setShowTemplateSelector(false);
          return;
        }

        setShowTemplateSelector(false);
      } finally {
        if (mounted) {
          setBootingBuilder(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  =============================
  Load site settings
  =============================
  */

  useEffect(() => {
    if (!siteId) return;

    let mounted = true;

    (async () => {
      const st = await loadSiteSettings(siteId);
      if (!mounted) return;

      setSiteSettings(st);
      emitLiveSettingsUpdate(st);

      setLoadingProgress((prev) => Math.max(prev, 62));

      const nav = await loadSiteNav(siteId);
      if (!mounted) return;

      setNavItems(nav);
      emitLiveNavUpdate(nav);

      setLoadingProgress((prev) => Math.max(prev, 70));
    })();

    return () => {
      mounted = false;
    };
  }, [siteId]);

  /*
  =============================
  Load pages / prepare selected template
  =============================
  */

  useEffect(() => {
    if (!siteId) {
      setPagesLoaded(false);
      return;
    }

    let mounted = true;

    (async () => {
      setPagesLoaded(false);
      setLoadingProgress((prev) => Math.max(prev, 72));

      let p = await loadSitePages(siteId);

      if ((!Array.isArray(p) || p.length === 0) && layoutKey && templateKey) {
        setSaveStatus("Preparing selected template...");
        setLoadingProgress((prev) => Math.max(prev, 78));

        const syncResult = await syncSitePagesForTemplate({
          siteId,
          layoutKey,
          templateKey,
        });

        if (syncResult?.ok) {
          const syncedNav = syncResult.navItems?.length
            ? syncResult.navItems
            : await loadSiteNav(siteId);

          if (mounted) {
            setNavItems(syncedNav);
            emitLiveNavUpdate(syncedNav);
          }

          p = syncResult.pages?.length
            ? syncResult.pages
            : await loadSitePages(siteId);

          setSaveStatus("Selected template ready");
          setLoadingProgress((prev) => Math.max(prev, 88));
        } else {
          setSaveStatus("Selected template needs setup");
        }
      }

      if (!mounted) return;

      setPages(Array.isArray(p) ? p : []);

      setCurrentPageId((prev) => {
        if (prev && Array.isArray(p) && p.some((page) => page.id === prev)) {
          return prev;
        }

        const firstVisiblePage =
          Array.isArray(p) &&
          p.find(
            (page) => page.is_visible !== false && page.is_published !== false,
          );

        return firstVisiblePage?.id || p?.[0]?.id || null;
      });

      setLoadingProgress(100);
      setPagesLoaded(true);
    })();

    return () => {
      mounted = false;
    };
  }, [siteId, layoutKey, templateKey]);

  /*
  =============================
  Load editable sections for the current page
  =============================
  Builder view intentionally loads visible and hidden sections so a hidden
  section can be switched back on from the Sections panel.
  */

  const applyLoadedSections = (nextSections = []) => {
    const safeSections = Array.isArray(nextSections) ? nextSections : [];

    setSections(safeSections);
    emitLiveSectionsUpdate(safeSections);

    setSelectedSectionId((previousId) => {
      if (
        previousId &&
        safeSections.some((section) => section.id === previousId)
      ) {
        return previousId;
      }

      setSectionEditorOpen(false);
      return null;
    });

    return safeSections;
  };

  const onRefreshSections = async () => {
    if (!siteId || !currentPageId) {
      applyLoadedSections([]);
      setSectionsLoaded(true);
      return [];
    }

    setSectionsLoaded(false);

    const nextSections = await loadPageSections({
      siteId,
      pageId: currentPageId,
      includeHidden: true,
    });

    const appliedSections = applyLoadedSections(nextSections);
    setSectionsLoaded(true);

    return appliedSections;
  };

  useEffect(() => {
    if (!siteId || !currentPageId) {
      setSections([]);
      setSectionsLoaded(false);
      setSelectedSectionId(null);
      setSectionEditorOpen(false);
      emitLiveSectionsUpdate([]);
      return;
    }

    let mounted = true;

    (async () => {
      setSectionsLoaded(false);

      /*
        Builder view intentionally requests hidden sections as well, so a
        section switched Off can still be shown again from the Sections panel.
      */
      const nextSections = await loadPageSections({
        siteId,
        pageId: currentPageId,
        includeHidden: true,
      });

      if (!mounted) return;

      applyLoadedSections(nextSections);
      setSectionsLoaded(true);
    })();

    return () => {
      mounted = false;
    };
  }, [siteId, currentPageId]);

  /*
  =============================
  Open a section editor from the live website canvas
  =============================
  BuilderSectionTarget sends this request from any template section. Logo
  and hero media editing remain managed by BuilderMediaEditor.
  */

  useEffect(() => {
    const openRequestedSection = async (request = {}) => {
      const requestedId =
        request.sectionId || request.section_id || request.id || null;
      const requestedKey =
        request.sectionKey || request.section_key || request.key || "";
      const requestedType =
        request.editorSectionType ||
        request.editor_section_type ||
        request.sectionType ||
        request.section_type ||
        request.type ||
        "";

      const requestedPageSlug = normalizeSectionLookupKey(
        request.pageSlug || request.page_slug || request.content?.page_slug || "",
      );

      const normalizedRequestedKey = normalizeSectionLookupKey(
        requestedKey || requestedType,
      );
      const normalizedRequestedType = normalizeSectionLookupKey(requestedType);

      let matchingSection =
        sections.find((section) => requestedId && section.id === requestedId) ||
        sections.find(
          (section) =>
            normalizedRequestedKey &&
            normalizeSectionLookupKey(getSectionLookupKey(section)) ===
              normalizedRequestedKey,
        ) ||
        sections.find(
          (section) =>
            normalizedRequestedType &&
            normalizeSectionLookupKey(getSectionLookupType(section)) ===
              normalizedRequestedType,
        ) ||
        sections.find(
          (section) =>
            requestedPageSlug &&
            getSectionLookupPageSlug(section) === requestedPageSlug &&
            normalizedRequestedType &&
            normalizeSectionLookupKey(getSectionLookupType(section)) ===
              normalizedRequestedType,
        );

      /*
        Some school-modern-v1 inner pages can render an editor target before the
        database has a real site_sections row for that page. In that case the
        request has a section type/key/content but no id. Create the missing row
        immediately, then open the normal editor using the saved row id.
      */
      if (!matchingSection?.id && siteId && currentPageId && normalizedRequestedType) {
        setSaveStatus("Preparing section editor...");

        const createdSection = await createSiteSectionFromEditorRequest({
          siteId,
          pageId: currentPageId,
          request,
          position: sections.length,
        });

        if (createdSection?.id) {
          matchingSection = createdSection;

          setSections((previousSections) => {
            const exists = previousSections.some(
              (section) => section.id === createdSection.id,
            );

            const nextSections = exists
              ? previousSections.map((section) =>
                  section.id === createdSection.id ? createdSection : section,
                )
              : [...previousSections, createdSection].sort(
                  (first, second) =>
                    Number(first.position || 0) - Number(second.position || 0),
                );

            emitLiveSectionsUpdate(nextSections);
            return nextSections;
          });

          setSectionsLoaded(true);
          setSaveStatus("Section editor ready");
        }
      }


      if (
        matchingSection?.id &&
        request?.content &&
        typeof request.content === "object" &&
        !Array.isArray(request.content)
      ) {
        const requestFallbackContent =
          request.content.__editor_fallback_content &&
          typeof request.content.__editor_fallback_content === "object" &&
          !Array.isArray(request.content.__editor_fallback_content)
            ? {
                ...request.content.__editor_fallback_content,
                ...request.content,
              }
            : request.content;

        const mergedContent = mergeSectionContentWithFallback(
          requestFallbackContent,
          matchingSection.content || {},
        );

        if (hasSectionContentChanged(mergedContent, matchingSection.content || {})) {
          const optimisticSection = {
            ...matchingSection,
            content: mergedContent,
          };

          matchingSection = optimisticSection;

          setSections((previousSections) => {
            const nextSections = previousSections.map((section) =>
              section.id === optimisticSection.id ? optimisticSection : section,
            );

            emitLiveSectionsUpdate(nextSections);
            return nextSections;
          });

          const savedMergedSection = await updateSiteSection({
            siteId,
            sectionId: optimisticSection.id,
            patch: {
              content: mergedContent,
            },
          });

          if (savedMergedSection?.id) {
            matchingSection = savedMergedSection;

            setSections((previousSections) => {
              const nextSections = previousSections.map((section) =>
                section.id === savedMergedSection.id ? savedMergedSection : section,
              );

              emitLiveSectionsUpdate(nextSections);
              return nextSections;
            });
          }
        }
      }

      if (!matchingSection?.id) {
        setSaveStatus("Could not open section editor");
        return;
      }

      setSelectedSectionId(matchingSection.id);
      setSectionEditorOpen(true);
      setSidebarOpen(true);

      const statePayload = buildSectionStatePayload(matchingSection, request);

      window.dispatchEvent(
        new CustomEvent("builder:section-editor-state", {
          detail: statePayload,
        }),
      );

      window.postMessage(
        {
          type: "builder:section-editor-state",
          ...statePayload,
        },
        "*",
      );

      window.dispatchEvent(
        new CustomEvent("builder:close-media-editor", {
          detail: {
            source: "section-editor",
            sectionId: matchingSection.id,
          },
        }),
      );

      window.postMessage(
        {
          type: "builder:close-media-editor",
          source: "section-editor",
          sectionId: matchingSection.id,
        },
        "*",
      );
    };

    const closeSelectedSection = () => {
      setSectionEditorOpen(false);
      setSelectedSectionId(null);

      window.dispatchEvent(
        new CustomEvent("builder:section-editor-state", {
          detail: {
            open: false,
            editorType: "section",
            sidebarPanel: "sections",
          },
        }),
      );

      window.postMessage(
        {
          type: "builder:section-editor-state",
          open: false,
          editorType: "section",
          sidebarPanel: "sections",
        },
        "*",
      );
    };

    const handleOpenSectionEditor = (event) => {
      openRequestedSection(event?.detail || {});
    };

    const handleCloseSectionEditor = () => {
      closeSelectedSection();
    };

    const handleSectionEditorMessage = (event) => {
      if (event.origin && event.origin !== window.location.origin) return;

      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;

      if (
        payload.type === "builder:open-section-editor" ||
        payload.type === "builder:edit-section"
      ) {
        openRequestedSection(payload);
      }

      if (payload.type === "builder:close-section-editor") {
        closeSelectedSection();
      }
    };

    window.addEventListener(
      "builder:open-section-editor",
      handleOpenSectionEditor,
    );
    window.addEventListener("builder:edit-section", handleOpenSectionEditor);
    window.addEventListener(
      "builder:close-section-editor",
      handleCloseSectionEditor,
    );
    window.addEventListener("message", handleSectionEditorMessage);

    return () => {
      window.removeEventListener(
        "builder:open-section-editor",
        handleOpenSectionEditor,
      );
      window.removeEventListener(
        "builder:edit-section",
        handleOpenSectionEditor,
      );
      window.removeEventListener(
        "builder:close-section-editor",
        handleCloseSectionEditor,
      );
      window.removeEventListener("message", handleSectionEditorMessage);
    };
  }, [currentPageId, sections, siteId]);

  /*
  =============================
  Keep only one right-side editor open
  =============================
  If a logo, hero or another media editor opens, close the normal section
  editor so the workspace remains clean and stable.
  */

  useEffect(() => {
    const closeForMediaEditor = (payload = {}) => {
      if (payload.open !== true) return;

      setSectionEditorOpen(false);
      setSelectedSectionId(null);
    };

    const handleMediaEditorState = (event) => {
      closeForMediaEditor(event?.detail || {});
    };

    const handleMediaEditorMessage = (event) => {
      if (event.origin && event.origin !== window.location.origin) return;

      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;
      if (payload.type !== "builder:media-editor-state") return;

      closeForMediaEditor(payload);
    };

    window.addEventListener(
      "builder:media-editor-state",
      handleMediaEditorState,
    );
    window.addEventListener("message", handleMediaEditorMessage);

    return () => {
      window.removeEventListener(
        "builder:media-editor-state",
        handleMediaEditorState,
      );
      window.removeEventListener("message", handleMediaEditorMessage);
    };
  }, []);

  /*
  =============================
  Listen for page navigation
  =============================
  */

  useEffect(() => {
    function handleNavigation(e) {
      const slug = normalizePageSlug(e.detail || "/");

      const match = pages.find((p) => {
        return normalizePageSlug(p.slug || "/") === slug;
      });

      if (match) {
        setCurrentPageId(match.id);
      }
    }

    window.addEventListener("builder:navigate", handleNavigation);

    return () =>
      window.removeEventListener("builder:navigate", handleNavigation);
  }, [pages]);

  // =============================
  // Listen for sidebar close events
  // =============================
  useEffect(() => {
    function handleCloseSidebar() {
      setSidebarOpen(true);
    }

    window.addEventListener("builder:close-sidebar", handleCloseSidebar);

    return () => {
      window.removeEventListener("builder:close-sidebar", handleCloseSidebar);
    };
  }, []);

  /*
  =============================
  Sync URL slug → current page
  =============================
  */

  useEffect(() => {
    function syncPageFromUrl() {
      const hash = window.location.hash || "";
      const cleanHash = hash.replace(/^#/, "").split("?")[0];
      const parts = cleanHash.split("/").filter(Boolean);

      if (parts[0] !== "site") return;

      const slugParts = parts.slice(2);
      const slug = normalizePageSlug(slugParts.join("/") || "/");

      const match = pages.find((p) => {
        return normalizePageSlug(p.slug || "/") === slug;
      });

      if (match) {
        setCurrentPageId(match.id);
      }
    }

    window.addEventListener("hashchange", syncPageFromUrl);

    syncPageFromUrl();

    return () => window.removeEventListener("hashchange", syncPageFromUrl);
  }, [pages]);

  /*
  =============================
  History bootstrap
  =============================
  */

  useEffect(() => {
    if (!siteId) return;
    if (!siteSettings) return;
    if (!Array.isArray(pages)) return;
    if (!Array.isArray(navItems)) return;
    if (hasBootstrappedHistoryRef.current) return;

    setHistoryStack([JSON.parse(JSON.stringify(builderSnapshot))]);
    setRedoStack([]);
    hasBootstrappedHistoryRef.current = true;
  }, [siteId, siteSettings, pages, navItems, builderSnapshot]);

  /*
  =============================
  Track changes for undo / redo
  =============================
  */

  useEffect(() => {
    if (!hasBootstrappedHistoryRef.current) return;
    if (isRestoringRef.current) return;

    setHistoryStack((prev) => {
      const last = prev[prev.length - 1];
      const nextSerialized = JSON.stringify(builderSnapshot);
      const lastSerialized = JSON.stringify(last);

      if (nextSerialized === lastSerialized) {
        return prev;
      }

      return [...prev, JSON.parse(nextSerialized)];
    });

    setRedoStack([]);
  }, [builderSnapshot]);

  useEffect(() => {
    return () => {
      if (settingsSaveTimeoutRef.current) {
        clearTimeout(settingsSaveTimeoutRef.current);
      }
      if (socialSaveTimeoutRef.current) {
        clearTimeout(socialSaveTimeoutRef.current);
      }
    };
  }, []);

  const applySnapshotToState = (snapshot) => {
    if (!snapshot) return;

    isRestoringRef.current = true;

    setSiteSettings(snapshot.siteSettings || null);
    setOrganization(snapshot.organization || null);
    setPages(snapshot.pages || []);
    setNavItems(snapshot.navItems || []);
    setSections(snapshot.sections || []);
    setSelectedSectionId(snapshot.selectedSectionId || null);
    setSectionEditorOpen(false);
    setCurrentPageId(snapshot.currentPageId || null);
    setLayoutKey(snapshot.layoutKey || null);
    setTemplateKey(snapshot.templateKey || null);

    emitLiveSettingsUpdate(snapshot.siteSettings || null);
    emitLiveNavUpdate(snapshot.navItems || []);
    emitLiveSectionsUpdate(snapshot.sections || []);

    setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  };

  const handleUndo = () => {
    if (historyStack.length <= 1) return;

    const previousSnapshot = historyStack[historyStack.length - 2];
    const currentSnapshot = historyStack[historyStack.length - 1];

    setRedoStack((prev) => [currentSnapshot, ...prev]);
    setHistoryStack((prev) => prev.slice(0, -1));
    applySnapshotToState(previousSnapshot);
    setSaveStatus("Previous change restored");
  };

  const handleRedo = () => {
    if (!redoStack.length) return;

    const redoSnapshot = redoStack[0];

    setRedoStack((prev) => prev.slice(1));
    setHistoryStack((prev) => [...prev, redoSnapshot]);
    applySnapshotToState(redoSnapshot);
    setSaveStatus("Change restored");
  };

  /*
  =============================
  Template selection
  =============================
  */

  const handleTemplateSelect = async (tpl) => {
    setTemplateError("");

    const nextLayoutKey = tpl?.layout_key || layoutKey;
    const nextTemplateKey = tpl?.template_key;

    if (!nextLayoutKey || !nextTemplateKey) {
      setTemplateError("Template key missing.");
      return;
    }

    const hasExistingWebsiteData =
      !!siteId && Array.isArray(pages) && pages.length > 0;

    if (hasExistingWebsiteData) {
      setSaveStatus("Changing template...");
      setLoadingProgress(20);

      const updatedSite = await updateSiteTemplateOnly({
        siteId,
        layoutKey: nextLayoutKey,
        templateKey: nextTemplateKey,
      });

      if (!updatedSite) {
        setTemplateError(
          "Template could not be saved. Check the sites table update rule or duplicate layout constraint.",
        );
        setSaveStatus("Template change failed");
        return;
      }

      setLoadingProgress(45);

      const syncResult = await syncSitePagesForTemplate({
        siteId,
        layoutKey: nextLayoutKey,
        templateKey: nextTemplateKey,
      });

      if (!syncResult?.ok) {
        setTemplateError(
          syncResult?.error?.message ||
            "Template pages could not be synced. Website data was not deleted.",
        );
        setSaveStatus("Template page sync failed");
        return;
      }

      setLayoutKey(updatedSite.layout_key || nextLayoutKey);
      setTemplateKey(updatedSite.template_key || nextTemplateKey);
      setShowTemplateSelector(false);

      const st = await loadSiteSettings(siteId);
      setSiteSettings(st);
      emitLiveSettingsUpdate(st);

      setLoadingProgress(70);

      const nav = syncResult.navItems?.length
        ? syncResult.navItems
        : await loadSiteNav(siteId);
      setNavItems(nav);
      emitLiveNavUpdate(nav);

      const p = syncResult.pages?.length
        ? syncResult.pages
        : await loadSitePages(siteId);
      setPages(p);
      setPagesLoaded(true);
      setLoadingProgress(100);

      setCurrentPageId((prev) => {
        if (prev && p.some((page) => page.id === prev)) return prev;
        return p?.[0]?.id || null;
      });

      setSaveStatus("Template changed. Website data preserved");
      return;
    }

    setLoadingProgress(20);

    const ensured = await ensureSiteForOrg({
      layoutKey: nextLayoutKey,
      templateKey: nextTemplateKey,
    });

    if (!ensured) {
      setTemplateError(
        "Could not create site. Check organization_id and RLS policies.",
      );
      return;
    }

    setLoadingProgress(45);

    const res = await seedSiteFromTemplate({
      siteId: ensured.id,
      layoutKey: nextLayoutKey,
      templateKey: nextTemplateKey,
    });

    if (!res?.ok) {
      setTemplateError(res?.error?.message || "Template install failed.");
      return;
    }

    setSiteId(ensured.id);
    setLayoutKey(nextLayoutKey);
    setTemplateKey(nextTemplateKey);
    setShowTemplateSelector(false);

    const st = await loadSiteSettings(ensured.id);
    setSiteSettings(st);
    emitLiveSettingsUpdate(st);

    setLoadingProgress(70);

    const nav = await loadSiteNav(ensured.id);
    setNavItems(nav);
    emitLiveNavUpdate(nav);

    const p = await loadSitePages(ensured.id);
    setPages(p);
    setPagesLoaded(true);
    setCurrentPageId(p?.[0]?.id || null);
    setLoadingProgress(100);

    setSaveStatus("Template applied");
  };

  const handleTemplateChangeFromSidebar = async (templateKeyToUse) => {
    const tpl = DEFAULT_TEMPLATES.find(
      (item) => item.template_key === templateKeyToUse,
    );

    if (!tpl) {
      setTemplateError("Selected template not found.");
      return;
    }

    await handleTemplateSelect(tpl);
  };

  /*
  =============================
  Settings editing
  =============================
  */

  const onUpdateSettings = async (patch) => {
    if (!siteId) return;

    const nextSettings = {
      ...(siteSettings || {}),
      ...patch,
    };

    setSiteSettings(nextSettings);
    emitLiveSettingsUpdate(nextSettings);
    setSaveStatus("Saving changes...");

    if (settingsSaveTimeoutRef.current) {
      clearTimeout(settingsSaveTimeoutRef.current);
    }

    settingsSaveTimeoutRef.current = setTimeout(async () => {
      const updated = await updateSiteSettings(siteId, patch);

      if (updated) {
        setSiteSettings((prev) => {
          const merged = {
            ...(prev || {}),
            ...updated,
          };
          emitLiveSettingsUpdate(merged);
          return merged;
        });
        setSaveStatus("All changes saved");
      }
    }, 250);
  };

  /*
  =============================
  Save visual editor updates permanently
  =============================
  BuilderMediaEditor is mounted inside the visible template target, such as
  the navbar logo or hero slideshow. It sends a builder:update-settings patch
  to this outer builder when Save Changes is clicked.

  This is the missing permanent-save bridge:
  live preview update -> existing onUpdateSettings -> site_settings database.
  */

  useEffect(() => {
    const handleVisualEditorSettingsUpdate = (event) => {
      if (event.origin && event.origin !== window.location.origin) return;

      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;
      if (payload.type !== "builder:update-settings") return;

      const patch = payload.patch;

      if (!patch || typeof patch !== "object" || Array.isArray(patch)) return;
      if (!Object.keys(patch).length) return;

      onUpdateSettings(patch);
    };

    window.addEventListener("message", handleVisualEditorSettingsUpdate);

    return () => {
      window.removeEventListener("message", handleVisualEditorSettingsUpdate);
    };
  }, [siteId, siteSettings]);

  const onUpdateOrganization = async (patch = {}) => {
    if (!organization?.id) {
      setSaveStatus("Organization not found");
      return;
    }

    const allowedKeys = [
      "address_line1",
      "city",
      "province",
      "postal_code",
      "country",
    ];

    const allowedPatch = allowedKeys.reduce((acc, key) => {
      if (Object.prototype.hasOwnProperty.call(patch, key)) {
        acc[key] = patch[key] || "";
      }

      return acc;
    }, {});

    if (!Object.keys(allowedPatch).length) {
      return;
    }

    const nextOrganization = {
      ...(organization || {}),
      ...allowedPatch,
    };

    const nextSettings = {
      ...(siteSettings || {}),
      ...allowedPatch,
    };

    setOrganization(nextOrganization);
    setSiteSettings(nextSettings);
    emitLiveSettingsUpdate(nextSettings);
    setSaveStatus("Saving organization address...");

    const { data, error } = await supabase
      .from("organizations")
      .update(allowedPatch)
      .eq("id", organization.id)
      .select("*")
      .single();

    if (error) {
      console.error("onUpdateOrganization error:", error);
      setSaveStatus("Organization address update failed");
      return;
    }

    const mergedSettings = {
      ...(siteSettings || {}),
      address_line1: data?.address_line1 || "",
      city: data?.city || "",
      province: data?.province || "",
      postal_code: data?.postal_code || "",
      country: data?.country || "",
    };

    setOrganization(data || nextOrganization);
    setSiteSettings(mergedSettings);
    emitLiveSettingsUpdate(mergedSettings);
    setSaveStatus("Organization address saved");
  };

  const onUpdateTheme = async (patch) => {
    if (!siteId) return;

    const nextSettings = {
      ...(siteSettings || {}),
      ...patch,
    };

    setSiteSettings(nextSettings);
    emitLiveSettingsUpdate(nextSettings);
    setSaveStatus("Saving theme...");

    const updated = await updateSiteSettings(siteId, patch);

    if (updated) {
      setSiteSettings((prev) => {
        const merged = {
          ...(prev || {}),
          ...updated,
        };
        emitLiveSettingsUpdate(merged);
        return merged;
      });
      setSaveStatus("Theme updated");
    }
  };

  const onUpdateColors = async (patch) => {
    if (!siteId) return;

    const nextSettings = {
      ...(siteSettings || {}),
      ...patch,
    };

    setSiteSettings(nextSettings);
    emitLiveSettingsUpdate(nextSettings);
    setSaveStatus("Saving colors...");

    const updated = await updateSiteSettings(siteId, patch);

    if (updated) {
      setSiteSettings((prev) => {
        const merged = {
          ...(prev || {}),
          ...updated,
        };
        emitLiveSettingsUpdate(merged);
        return merged;
      });
      setSaveStatus("Colors updated");
    }
  };

  const onUpdateAnnouncements = async (announcements) => {
    if (!siteId) return;

    const nextSettings = {
      ...(siteSettings || {}),
      announcements,
    };

    setSiteSettings(nextSettings);
    emitLiveSettingsUpdate(nextSettings);
    setSaveStatus("Saving announcements...");

    const updated = await updateSiteSettings(siteId, {
      announcements,
    });

    if (updated) {
      setSiteSettings((prev) => {
        const merged = {
          ...(prev || {}),
          ...updated,
        };
        emitLiveSettingsUpdate(merged);
        return merged;
      });
      setSaveStatus("Announcements updated");
    }
  };

  const onUpdateSocialMedia = async (socialPatch) => {
    if (!siteId) return;

    const currentLinks = siteSettings?.social_links || {};
    const currentDisplay = siteSettings?.social_display || {};

    const { topbar, footer, order, ...platforms } = socialPatch;

    const nextLinks = {
      ...currentLinks,
      ...platforms,
    };

    const nextDisplay = {
      ...currentDisplay,
      ...(typeof topbar === "boolean" ? { topbar } : {}),
      ...(typeof footer === "boolean" ? { footer } : {}),
      ...(Array.isArray(order) ? { order } : {}),
    };

    const nextSettings = {
      ...(siteSettings || {}),
      social_links: nextLinks,
      social_display: nextDisplay,
    };

    setSiteSettings(nextSettings);
    emitLiveSettingsUpdate(nextSettings);
    setSaveStatus("Saving social media...");

    if (socialSaveTimeoutRef.current) {
      clearTimeout(socialSaveTimeoutRef.current);
    }

    socialSaveTimeoutRef.current = setTimeout(async () => {
      const updated = await updateSiteSettings(siteId, {
        social_links: nextLinks,
        social_display: nextDisplay,
      });

      if (updated) {
        setSiteSettings((prev) => {
          const merged = {
            ...(prev || {}),
            ...updated,
            social_links: nextLinks,
            social_display: nextDisplay,
          };
          emitLiveSettingsUpdate(merged);
          return merged;
        });
        setSaveStatus("Social media updated");
      }
    }, 120);
  };

  /*
  =============================
  Section editing
  =============================
  */

  const handleSelectSection = (sectionOrId) => {
    const sectionId =
      typeof sectionOrId === "object" ? sectionOrId?.id : sectionOrId;

    const requestedKey =
      typeof sectionOrId === "object"
        ? normalizeSectionLookupKey(
            sectionOrId?.sectionKey ||
              sectionOrId?.section_key ||
              sectionOrId?.key ||
              getSectionLookupKey(sectionOrId),
          )
        : "";

    const requestedType =
      typeof sectionOrId === "object"
        ? normalizeSectionLookupKey(
            sectionOrId?.editorSectionType ||
              sectionOrId?.editor_section_type ||
              sectionOrId?.sectionType ||
              sectionOrId?.section_type ||
              sectionOrId?.type ||
              getSectionLookupType(sectionOrId),
          )
        : "";

    const section =
      sections.find((item) => item.id === sectionId) ||
      sections.find(
        (item) =>
          requestedKey &&
          normalizeSectionLookupKey(getSectionLookupKey(item)) === requestedKey,
      ) ||
      sections.find(
        (item) =>
          requestedType &&
          normalizeSectionLookupKey(getSectionLookupType(item)) === requestedType,
      );

    if (!section?.id) return;

    setSelectedSectionId(section.id);
    setSectionEditorOpen(true);
    setSidebarOpen(true);

    const statePayload = buildSectionStatePayload(section, sectionOrId || {});

    window.dispatchEvent(
      new CustomEvent("builder:section-editor-state", {
        detail: statePayload,
      }),
    );

    window.postMessage(
      {
        type: "builder:section-editor-state",
        ...statePayload,
      },
      "*",
    );

    window.dispatchEvent(
      new CustomEvent("builder:close-media-editor", {
        detail: {
          source: "section-editor",
          sectionId: section.id,
        },
      }),
    );
  };

  const handleCloseSectionEditor = () => {
    setSectionEditorOpen(false);
    setSelectedSectionId(null);

    window.dispatchEvent(
      new CustomEvent("builder:section-editor-state", {
        detail: {
          open: false,
          editorType: "section",
          sidebarPanel: "sections",
        },
      }),
    );

    window.postMessage(
      {
        type: "builder:section-editor-state",
        open: false,
        editorType: "section",
        sidebarPanel: "sections",
      },
      "*",
    );
  };

  const onUpdateSection = async (sectionId, patch = {}) => {
    if (!siteId || !sectionId) return null;

    const safeKeys = [
      "content",
      "visible",
      "style",
      "animation",
      "position",
      "is_locked",
    ];

    const safePatch = safeKeys.reduce((result, key) => {
      if (Object.prototype.hasOwnProperty.call(patch, key)) {
        result[key] = patch[key];
      }

      return result;
    }, {});

    if (!Object.keys(safePatch).length) return null;

    setSaveStatus("Saving section...");

    const updatedSection = await updateSiteSection({
      siteId,
      sectionId,
      patch: safePatch,
    });

    if (!updatedSection) {
      setSaveStatus("Section update failed");
      return null;
    }

    setSections((previousSections) => {
      const nextSections = previousSections.map((section) =>
        section.id === updatedSection.id ? updatedSection : section,
      );

      emitLiveSectionsUpdate(nextSections);
      return nextSections;
    });

    setSelectedSectionId(updatedSection.id);
    setSaveStatus("Section updated");

    return updatedSection;
  };

  const onUpdateSectionVisibility = async (sectionId, visible) => {
    const updatedSection = await onUpdateSection(sectionId, {
      visible: visible !== false,
    });

    if (updatedSection) {
      setSaveStatus(
        updatedSection.visible !== false
          ? "Section is now On"
          : "Section is now Off",
      );
    }

    return updatedSection;
  };

  const onReorderSections = async (sectionIds = []) => {
    if (
      !siteId ||
      !currentPageId ||
      !Array.isArray(sectionIds) ||
      !sectionIds.length
    ) {
      return false;
    }

    setSaveStatus("Saving section order...");

    const currentSections = Array.isArray(sections) ? sections : [];
    const sectionById = new Map(
      currentSections.map((section) => [section.id, section]),
    );

    const reorderedSections = sectionIds
      .map((sectionId, position) => {
        const section = sectionById.get(sectionId);
        return section ? { ...section, position } : null;
      })
      .filter(Boolean);

    const untouchedSections = currentSections.filter(
      (section) => !sectionIds.includes(section.id),
    );

    const optimisticSections = [
      ...reorderedSections,
      ...untouchedSections,
    ].sort((first, second) => (first.position ?? 0) - (second.position ?? 0));

    setSections(optimisticSections);
    emitLiveSectionsUpdate(optimisticSections);

    const savedSections = await reorderPageSections({
      siteId,
      pageId: currentPageId,
      sectionIds,
    });

    if (!savedSections) {
      await onRefreshSections();
      setSaveStatus("Section order update failed");
      return false;
    }

    const finalSections = Array.isArray(savedSections)
      ? savedSections
      : optimisticSections;

    setSections(finalSections);
    emitLiveSectionsUpdate(finalSections);
    setSaveStatus("Section order updated");

    return true;
  };

  /*
  =============================
  Page editing
  =============================
  */

  const handleSelectPage = (pageId) => {
    setCurrentPageId(pageId);

    const selectedPage = pages.find((p) => p.id === pageId);

    if (selectedPage?.slug) {
      window.dispatchEvent(
        new CustomEvent("builder:navigate", {
          detail: normalizePageSlug(selectedPage.slug),
        }),
      );
    }
  };

  const onReorderPages = async (pageIds = []) => {
    if (!siteId || !Array.isArray(pageIds) || !pageIds.length) return;

    setSaveStatus("Saving page order...");

    setPages((prev) => {
      const byId = new Map(prev.map((page) => [page.id, page]));
      const reordered = pageIds
        .map((id, index) => {
          const page = byId.get(id);
          return page ? { ...page, sort_order: index } : null;
        })
        .filter(Boolean);

      const untouched = prev.filter((page) => !pageIds.includes(page.id));

      return [...reordered, ...untouched].sort((a, b) => {
        const aOrder = a.sort_order ?? 0;
        const bOrder = b.sort_order ?? 0;
        return aOrder - bOrder;
      });
    });

    setNavItems((prev) => {
      const next = prev.map((item) => {
        const index = pageIds.indexOf(item.page_id);
        if (index === -1) return item;
        return { ...item, position: index };
      });

      emitLiveNavUpdate(next);
      return next;
    });

    await updatePageSortOrder({ siteId, pageIds });

    const nav = await loadSiteNav(siteId);
    setNavItems(nav);
    emitLiveNavUpdate(nav);

    setSaveStatus("Page order updated");
  };

  const onUpdatePage = async (patch) => {
    if (!currentPage) return;

    setSaveStatus("Saving page...");

    const updated = await updateSitePage(currentPage.id, patch);

    if (!updated) return;

    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    const nav = await loadSiteNav(siteId);
    setNavItems(nav);
    emitLiveNavUpdate(nav);

    setSaveStatus("Page updated");
  };

  const onUpdateAnyPage = async (pageId, patch) => {
    if (!pageId) return;

    setSaveStatus("Saving page...");

    const isVisibilityChange =
      Object.prototype.hasOwnProperty.call(patch || {}, "is_visible") ||
      Object.prototype.hasOwnProperty.call(patch || {}, "is_published");

    if (isVisibilityChange && siteId) {
      const nextVisible =
        patch?.is_visible !== undefined
          ? patch.is_visible
          : patch?.is_published !== undefined
            ? patch.is_published
            : true;

      const result = await updatePageVisibilityEverywhere({
        siteId,
        pageId,
        visible: nextVisible,
      });

      if (!result?.page) {
        setSaveStatus("Page update failed");
        return;
      }

      const p = await loadSitePages(siteId);
      setPages(p);

      const nav = await loadSiteNav(siteId);
      setNavItems(nav);
      emitLiveNavUpdate(nav);

      if (currentPageId === pageId && nextVisible === false) {
        const firstVisiblePage =
          p.find(
            (page) =>
              page.id !== pageId &&
              page.is_visible !== false &&
              page.is_published !== false,
          ) || p.find((page) => page.id !== pageId);

        if (firstVisiblePage?.id) {
          setCurrentPageId(firstVisiblePage.id);
          window.dispatchEvent(
            new CustomEvent("builder:navigate", {
              detail: normalizePageSlug(firstVisiblePage.slug),
            }),
          );
        }
      }

      setSaveStatus(nextVisible ? "Page is now On" : "Page is now Off");
      return;
    }

    const updated = await updateSitePage(pageId, patch);

    if (!updated) return;

    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

    const nav = await loadSiteNav(siteId);
    setNavItems(nav);
    emitLiveNavUpdate(nav);

    setSaveStatus("Page updated");
  };

  const onUpdateTopbar = async (visible) => {
    if (!siteId) return;

    setSaveStatus("Saving topbar visibility...");

    const updated = await updateTopbarVisibility({
      siteId,
      visible,
    });

    if (!updated) {
      setSaveStatus("Topbar update failed");
      return;
    }

    const merged = {
      ...(siteSettings || {}),
      ...updated,
    };

    setSiteSettings(merged);
    emitLiveSettingsUpdate(merged);

    setSaveStatus(visible ? "Topbar is now On" : "Topbar is now Off");
  };

  const onUpdatePageContent = async (field, value) => {
    if (!currentPage) return;

    setSaveStatus("Saving page content...");

    const updated = await updatePageContentField({
      pageId: currentPage.id,
      field,
      value,
      current: currentPage,
    });

    if (!updated) return;

    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSaveStatus("Page content updated");
  };

  const onUpdateAnyPageContent = async (pageId, field, value) => {
    const page = pages.find((p) => p.id === pageId);

    if (!page) return;

    setSaveStatus("Saving page content...");

    const updated = await updatePageContentField({
      pageId,
      field,
      value,
      current: page,
    });

    if (!updated) return;

    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSaveStatus("Page content updated");
  };

  /*
  =============================
  Publish / preview
  =============================
  */

  const handlePreview = () => {
    if (!siteId) {
      setSaveStatus("Choose a template first");
      setShowTemplateSelector(true);
      return;
    }

    window.open(`/#/site/${siteId || ""}?preview=1&t=${Date.now()}`, "_blank");
  };

  const handlePublish = () => {
    if (!siteId || !templateKey) {
      setSaveStatus("Choose a template before publishing");
      setShowTemplateSelector(true);
      return;
    }

    console.log("Publish: connect CDN refresh");
    setSaveStatus("Publish triggered");
  };

  /*
  =============================
  UI
  =============================
  */

  return (
    <div className="builder-container">
      {showTemplateSelector && (
        <TemplateSelector
          templates={DEFAULT_TEMPLATES}
          selectedLayoutKey={layoutKey}
          selectedTemplateKey={templateKey}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
          error={templateError}
        />
      )}

      <BuilderNavbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onPreview={handlePreview}
        onPublish={handlePublish}
        onChangeTemplate={() => setShowTemplateSelector(true)}
        saveStatus={saveStatus}
      />

      <div className="builder-body">
        {sidebarOpen && (
          <BuilderSidebar
            siteId={siteId}
            layoutKey={layoutKey}
            templateKey={templateKey}
            templates={
              availableTemplates.length ? availableTemplates : DEFAULT_TEMPLATES
            }
            pages={pages}
            navItems={navItems}
            currentPage={currentPageId}
            currentPageData={currentPage}
            setCurrentPage={handleSelectPage}
            siteSettings={siteSettings}
            organization={organization}
            onUpdateSettings={onUpdateSettings}
            onUpdateOrganization={onUpdateOrganization}
            onUpdateTheme={onUpdateTheme}
            onUpdateColors={onUpdateColors}
            onUpdateAnnouncements={onUpdateAnnouncements}
            onUpdateSocialMedia={onUpdateSocialMedia}
            onChangeTemplate={handleTemplateChangeFromSidebar}
            onUpdatePage={onUpdatePage}
            onUpdateAnyPage={onUpdateAnyPage}
            onUpdatePageContent={onUpdatePageContent}
            onUpdateAnyPageContent={onUpdateAnyPageContent}
            onReorderPages={onReorderPages}
            onUpdateTopbar={onUpdateTopbar}
            sections={sections}
            sectionsLoaded={sectionsLoaded}
            selectedSectionId={selectedSectionId}
            onSelectSection={handleSelectSection}
            onUpdateSectionVisibility={onUpdateSectionVisibility}
            onReorderSections={onReorderSections}
            onRefreshSections={onRefreshSections}
          />
        )}

        {bootingBuilder || isPreparingSelectedTemplate ? (
          <SelectedTemplateLoading
            layoutKey={layoutKey}
            templateKey={templateKey}
            progress={loadingProgress}
            loadingText={loadingText}
          />
        ) : shouldShowTemplateGuide ? (
          <NoTemplateSelected
            onChooseTemplate={() => setShowTemplateSelector(true)}
          />
        ) : (
          <>
            <BuilderCanvas
              siteId={siteId}
              page={currentPage}
              sections={sections}
              selectedSectionId={selectedSectionId}
              sectionEditorOpen={sectionEditorOpen}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyStack.length > 1}
              canRedo={redoStack.length > 0}
            />

            <BuilderSectionEditor
              enabled={Boolean(sectionEditorOpen && selectedSection)}
              section={selectedSection}
              page={currentPage}
              settings={siteSettings || {}}
              onClose={handleCloseSectionEditor}
              onSave={onUpdateSection}
              onUpdateVisibility={onUpdateSectionVisibility}
            />
          </>
        )}
      </div>

      <BuilderFooter
        onPreview={handlePreview}
        onPublish={handlePublish}
        onChangeTemplate={() => setShowTemplateSelector(true)}
      />
    </div>
  );
}
