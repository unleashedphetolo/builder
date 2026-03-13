import { useEffect, useMemo, useState } from "react";
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

  const currentPage = useMemo(
    () => pages.find((p) => p.id === currentPageId) || null,
    [pages, currentPageId],
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
  Template selection
  =============================
  */

  const handleTemplateSelect = async (tpl) => {
    setTemplateError("");

    const layoutKey = tpl?.layout_key || "school";
    const templateKey = tpl?.template_key;

    if (!templateKey) {
      setTemplateError("Template key missing.");
      return;
    }

    const ensured = await ensureSiteForOrg({
      layoutKey,
      templateKey,
    });

    if (!ensured) {
      setTemplateError(
        "Could not create site. Check organization_id and RLS policies.",
      );
      return;
    }

    const res = await seedSiteFromTemplate({
      siteId: ensured.id,
      layoutKey,
      templateKey,
    });

    if (!res?.ok) {
      setTemplateError(res?.error?.message || "Template install failed.");
      return;
    }

    setSiteId(ensured.id);
    setLayoutKey(layoutKey);
    setTemplateKey(templateKey);
    setShowTemplateSelector(false);

    const st = await loadSiteSettings(ensured.id);
    setSiteSettings(st);

    const nav = await loadSiteNav(ensured.id);
    setNavItems(nav);

    const p = await loadSitePages(ensured.id);
    setPages(p);
    setCurrentPageId(p?.[0]?.id || null);
  };

  /*
  =============================
  Settings editing
  =============================
  */

  const onUpdateSettings = async (patch) => {
    if (!siteId) return;

    const updated = await updateSiteSettings(siteId, patch);
    if (updated) setSiteSettings(updated);
  };

  /*
  =============================
  Page editing
  =============================
  */

  const onUpdatePage = async (patch) => {
    if (!currentPage) return;

    const updated = await updateSitePage(currentPage.id, patch);

    if (!updated) return;

    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const onUpdatePageContent = async (field, value) => {
    if (!currentPage) return;

    const updated = await updatePageContentField({
      pageId: currentPage.id,
      field,
      value,
      current: currentPage,
    });

    if (!updated) return;

    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
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
          defaultLayout={layoutKey}
          onSelect={handleTemplateSelect}
          error={templateError}
        />
      )}

      <BuilderNavbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onPreview={() => window.open(`/#/site/${siteId || ""}`, "_blank")}
        onPublish={() => console.log("Publish: connect CDN refresh")}
        onChangeTemplate={() => setShowTemplateSelector(true)}
        saveStatus="All changes saved"
      />

      <div className="builder-body">
        {sidebarOpen && (
          <BuilderSidebar
            pages={pages}
            currentPage={currentPageId}
            currentPageData={currentPage}
            setCurrentPage={setCurrentPageId}
            siteSettings={siteSettings}
            onUpdateSettings={onUpdateSettings}
            onUpdatePage={onUpdatePage}
            onUpdatePageContent={onUpdatePageContent}
          />
        )}

        <BuilderCanvas siteId={siteId} page={currentPage} />
      </div>
      <BuilderFooter />
    </div>
  );
}
