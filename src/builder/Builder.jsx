import { useEffect, useMemo, useRef, useState } from "react";
import BuilderNavbar from "./BuilderNavbar";
import BuilderFooter from "./BuilderFooter";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./BuilderCanvas";
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
} from "./siteService";

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
                background:
                  "linear-gradient(90deg, #2563eb, #22c55e, #06b6d4)",
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
  const [navItems, setNavItems] = useState([]);

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

  const hasUsablePages =
    Array.isArray(pages) && pages.length > 0 && Boolean(currentPage);

  const isPreparingSelectedTemplate =
    hasSelectedTemplate && (!pagesLoaded || !hasUsablePages);

  const isLoadingWorkspace = bootingBuilder || isPreparingSelectedTemplate;

  const shouldShowTemplateGuide =
    !bootingBuilder && pagesLoaded && (!hasSelectedTemplate || !hasUsablePages);

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
      pages,
      navItems,
      currentPageId,
      layoutKey,
      templateKey,
    }),
    [siteSettings, pages, navItems, currentPageId, layoutKey, templateKey],
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
          setShowTemplateSelector(true);
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
          setShowTemplateSelector(true);
          return;
        }

        const orgId = profileData?.organization_id || null;

        if (!orgId) {
          setShowTemplateSelector(true);
          return;
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
          setShowTemplateSelector(true);
          return;
        }

        if (!existingSite) {
          setShowTemplateSelector(true);
          return;
        }

        setSiteId(existingSite.id);
        setLayoutKey(existingSite.layout_key || null);
        setTemplateKey(existingSite.template_key || null);
        setLoadingProgress(55);

        if (!existingSite.template_key) {
          setShowTemplateSelector(true);
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

      if (
        (!Array.isArray(p) || p.length === 0) &&
        layoutKey &&
        templateKey
      ) {
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
            (page) =>
              page.is_visible !== false && page.is_published !== false,
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
      setSidebarOpen(false);
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
    setPages(snapshot.pages || []);
    setNavItems(snapshot.navItems || []);
    setCurrentPageId(snapshot.currentPageId || null);
    setLayoutKey(snapshot.layoutKey || null);
    setTemplateKey(snapshot.templateKey || null);

    emitLiveSettingsUpdate(snapshot.siteSettings || null);
    emitLiveNavUpdate(snapshot.navItems || []);

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
            onUpdateSettings={onUpdateSettings}
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
          <BuilderCanvas
            siteId={siteId}
            page={currentPage}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyStack.length > 1}
            canRedo={redoStack.length > 0}
          />
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