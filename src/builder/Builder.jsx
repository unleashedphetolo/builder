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
  loadSitePages,
  loadSiteSettings,
  updateSiteSettings,
  loadSiteNav,
  updateSitePage,
  updatePageContentField,
} from "./siteService";

export default function Builder() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [siteId, setSiteId] = useState(null);
  const [layoutKey, setLayoutKey] = useState("school");
  const [templateKey, setTemplateKey] = useState(null);

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);

  const [siteSettings, setSiteSettings] = useState(null);
  const [navItems, setNavItems] = useState([]);

  const [templateError, setTemplateError] = useState("");

  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [saveStatus, setSaveStatus] = useState("All changes saved");

  const isRestoringRef = useRef(false);
  const hasBootstrappedHistoryRef = useRef(false);

  const currentPage = useMemo(
    () => pages.find((p) => p.id === currentPageId) || null,
    [pages, currentPageId],
  );

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

  /*
  =============================
  Boot builder
  =============================
  */

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        setShowTemplateSelector(true);
        return;
      }

      const ensured = await ensureSiteForOrg({
        layoutKey: "school",
      });

      if (!ensured) {
        setShowTemplateSelector(true);
        return;
      }

      if (!ensured.template_key) {
        setSiteId(ensured.id);
        setLayoutKey(ensured.layout_key || "school");
        setTemplateKey(null);
        setShowTemplateSelector(true);
        return;
      }

      setSiteId(ensured.id);
      setLayoutKey(ensured.layout_key || "school");
      setTemplateKey(ensured.template_key || null);
      setShowTemplateSelector(false);
    })();
  }, []);

  /*
  =============================
  Load site settings
  =============================
  */

  useEffect(() => {
    if (!siteId) return;

    (async () => {
      const st = await loadSiteSettings(siteId);
      setSiteSettings(st);

      const nav = await loadSiteNav(siteId);
      setNavItems(nav);
    })();
  }, [siteId]);

  /*
  =============================
  Load pages
  =============================
  */

  useEffect(() => {
    if (!siteId) return;

    (async () => {
      const p = await loadSitePages(siteId);
      setPages(p);

      if (p.length) {
        setCurrentPageId((prev) => prev || p[0].id);
      }
    })();
  }, [siteId]);

  /*
  =============================
  Listen for page navigation
  =============================
  */

  useEffect(() => {
    function handleNavigation(e) {
      const slug = e.detail || "/";

      const match = pages.find((p) => {
        const clean = (p.slug || "").replace(/^\/+/, "");
        const incoming = String(slug).replace(/^\/+/, "");
        return clean === incoming;
      });

      if (match) {
        setCurrentPageId(match.id);
      }
    }

    window.addEventListener("builder:navigate", handleNavigation);

    return () =>
      window.removeEventListener("builder:navigate", handleNavigation);
  }, [pages]);

  /*
  =============================
  Sync URL slug → current page
  =============================
  */

  useEffect(() => {
    function syncPageFromUrl() {
      const hash = window.location.hash || "";
      const parts = hash.split("/");

      // #/site/{siteId}/slug
      const slug = parts.slice(3).join("/") || "home";

      const match = pages.find((p) => {
        const pageSlug = (p.slug || "").replace(/^\/+/, "");
        return pageSlug === slug.replace(/^\/+/, "");
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

  const applySnapshotToState = (snapshot) => {
    if (!snapshot) return;

    isRestoringRef.current = true;

    setSiteSettings(snapshot.siteSettings || null);
    setPages(snapshot.pages || []);
    setNavItems(snapshot.navItems || []);
    setCurrentPageId(snapshot.currentPageId || null);
    setLayoutKey(snapshot.layoutKey || "school");
    setTemplateKey(snapshot.templateKey || null);

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

    const nextLayoutKey = tpl?.layout_key || "school";
    const nextTemplateKey = tpl?.template_key;

    if (!nextTemplateKey) {
      setTemplateError("Template key missing.");
      return;
    }

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

    const nav = await loadSiteNav(ensured.id);
    setNavItems(nav);

    const p = await loadSitePages(ensured.id);
    setPages(p);
    setCurrentPageId(p?.[0]?.id || null);

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

    setSaveStatus("Saving changes...");

    const updated = await updateSiteSettings(siteId, patch);

    if (updated) {
      setSiteSettings(updated);
      setSaveStatus("All changes saved");
    }
  };

  const onUpdateTheme = async (patch) => {
    if (!siteId) return;

    setSaveStatus("Saving theme...");

    const updated = await updateSiteSettings(siteId, patch);

    if (updated) {
      setSiteSettings(updated);
      setSaveStatus("Theme updated");
    }
  };

  const onUpdateColors = async (patch) => {
    if (!siteId) return;

    setSaveStatus("Saving colors...");

    const updated = await updateSiteSettings(siteId, patch);

    if (updated) {
      setSiteSettings(updated);
      setSaveStatus("Colors updated");
    }
  };

  const onUpdateAnnouncements = async (announcements) => {
    if (!siteId) return;

    setSaveStatus("Saving announcements...");

    const updated = await updateSiteSettings(siteId, {
      announcements,
    });

    if (updated) {
      setSiteSettings(updated);
      setSaveStatus("Announcements updated");
    }
  };

  const onUpdateSocialMedia = async (socialPatch) => {
    if (!siteId) return;

    setSaveStatus("Saving social media...");

    const currentSocial = {
      ...(siteSettings?.social || {}),
      ...(siteSettings?.social_media || {}),
    };

    const nextSocial = {
      ...currentSocial,
      ...socialPatch,
    };

    const updated = await updateSiteSettings(siteId, {
      social_media: nextSocial,
      social: nextSocial,
    });

    if (updated) {
      setSiteSettings((prev) => ({
        ...(prev || {}),
        ...updated,
        social_media: nextSocial,
        social: nextSocial,
      }));
      setSaveStatus("Social media updated");
    }
  };

  /*
  =============================
  Page editing
  =============================
  */

  const onUpdatePage = async (patch) => {
    if (!currentPage) return;

    setSaveStatus("Saving page...");

    const updated = await updateSitePage(currentPage.id, patch);

    if (!updated) return;

    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSaveStatus("Page updated");
  };

  const onUpdateAnyPage = async (pageId, patch) => {
    if (!pageId) return;

    setSaveStatus("Saving page...");

    const updated = await updateSitePage(pageId, patch);

    if (!updated) return;

    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSaveStatus("Page updated");
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
    window.open(`/#/site/${siteId || ""}`, "_blank");
  };

  const handlePublish = () => {
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
          templates={
            availableTemplates.length ? availableTemplates : DEFAULT_TEMPLATES
          }
          defaultLayout={layoutKey}
          onSelect={handleTemplateSelect}
          error={templateError}
        />
      )}

      <BuilderNavbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
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
            setCurrentPage={setCurrentPageId}
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
          />
        )}

        <BuilderCanvas
          siteId={siteId}
          page={currentPage}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyStack.length > 1}
          canRedo={redoStack.length > 0}
        />
      </div>

      <BuilderFooter />
    </div>
  );
}