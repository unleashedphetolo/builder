import { useEffect, useMemo, useState } from "react";
import BuilderNavbar from "./BuilderNavbar";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./BuilderCanvas";
import BuilderRightPanel from "./BuilderRightPanel";
import TemplateSelector from "./TemplateSelector";
import "../styles/builder.css";

import { supabase } from "../supabase/client";
import { DEFAULT_TEMPLATES } from "../templates/registry";
import {
  ensureSiteForOrg,
  seedSiteFromTemplate,
  loadSitePages,
  loadPageSections,
  loadSiteSettings,
  updateSiteSettings,
  loadSiteNav,
  updateSectionField,
  deleteSectionById,
  addSectionToPage,
} from "./siteService";

/**
 * Builder (GoDaddy/Wix-style)
 * - Select Category (layout_key) -> choose template
 * - Creates a site row (sites) and seeds pages/sections/settings
 * - Edits per page via site_pages + site_sections
 */
export default function Builder() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [siteId, setSiteId] = useState(null);
  const [layoutKey, setLayoutKey] = useState("school");
  const [templateKey, setTemplateKey] = useState(null);

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);

  const [siteSettings, setSiteSettings] = useState(null);
  const [navItems, setNavItems] = useState([]);

  const [templateError, setTemplateError] = useState("");

  const currentPage = useMemo(
    () => pages.find((p) => p.id === currentPageId) || null,
    [pages, currentPageId]
  );

  // Boot: ensure we have a site (or prompt template selection)
  useEffect(() => {
    (async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        setShowTemplateSelector(true);
        return;
      }

      const ensured = await ensureSiteForOrg({ layoutKey: "school" });
      if (!ensured) {
        setShowTemplateSelector(true);
        return;
      }

      // If site exists but is not seeded, prompt template
      if (!ensured.template_key) {
        setShowTemplateSelector(true);
        return;
      }

      setSiteId(ensured.id);
      setLayoutKey(ensured.layout_key);
      setTemplateKey(ensured.template_key);
    })();
  }, [])

  // Load settings + nav when site changes
  useEffect(() => {
    if (!siteId) return;
    (async () => {
      const st = await loadSiteSettings(siteId);
      setSiteSettings(st);
      const nav = await loadSiteNav(siteId);
      setNavItems(nav);
    })();
  }, [siteId]);
;

  // Load pages when site changes
  useEffect(() => {
    if (!siteId) return;
    (async () => {
      const p = await loadSitePages(siteId);
      setPages(p);
      if (p.length) setCurrentPageId((prev) => prev || p[0].id);
    })();
  }, [siteId]);

  // Load sections when page changes
  useEffect(() => {
    if (!siteId || !currentPageId) return;
    (async () => {
      const s = await loadPageSections({ siteId, pageId: currentPageId });
      setSections(s);
      setSelectedSection(null);
    })();
  }, [siteId, currentPageId]);

  const handleTemplateSelect = async (tpl) => {
    setTemplateError("");
    // tpl = { layout_key, template_key }
    const ensured = await ensureSiteForOrg({ layoutKey: tpl.layout_key });
    if (!ensured) {
      setTemplateError("Could not create a site for your organization. Ensure your profile has an organization_id.");
      return;
    }

    const res = await seedSiteFromTemplate({
      siteId: ensured.id,
      layoutKey: tpl.layout_key,
      templateKey: tpl.template_key,
    });

    if (!res?.ok) {
      setTemplateError(
        res?.error?.message ||
          "Template install failed. Check RLS policies for sites/site_settings/site_pages/site_sections/site_nav_items."
      );
      return;
    }

    setSiteId(ensured.id);
    setLayoutKey(tpl.layout_key);
    setTemplateKey(tpl.template_key);
    setShowTemplateSelector(false);

    const st = await loadSiteSettings(ensured.id);
    setSiteSettings(st);
    const nav = await loadSiteNav(ensured.id);
    setNavItems(nav);
  };

  const onUpdateSettings = async (patch) => {
    if (!siteId) return;
    const updated = await updateSiteSettings(siteId, patch);
    if (updated) setSiteSettings(updated);
  };

  const onAddSection = async (type) => {
    if (!siteId || !currentPageId) return;
    const created = await addSectionToPage({
      siteId,
      pageId: currentPageId,
      type,
      position: sections.length,
    });
    if (created) setSections((prev) => [...prev, created]);
  };

  const onUpdateSection = async (field, value) => {
    if (!selectedSection) return;
    const updated = await updateSectionField({
      id: selectedSection.id,
      field,
      value,
      current: selectedSection,
    });
    if (!updated) return;
    setSelectedSection(updated);
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const onDeleteSection = async (id) => {
    await deleteSectionById(id);
    setSections((prev) => prev.filter((s) => s.id !== id));
    if (selectedSection?.id === id) setSelectedSection(null);
  };

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
        onPreview={() => window.open(`/site/${siteId || ""}`, "_blank")}
        onPublish={() => console.log("Publish: wire to refresh cache")}
        onChangeTemplate={() => setShowTemplateSelector(true)}
        saveStatus="All changes saved"
      />

      <div className="builder-body">
        {sidebarOpen && (
          <BuilderSidebar
            pages={pages}
            currentPage={currentPageId}
            setCurrentPage={setCurrentPageId}
            addSection={onAddSection}
            siteSettings={siteSettings}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        <BuilderCanvas
          siteId={siteId}
          layoutKey={layoutKey}
          templateKey={templateKey}
          page={currentPage}
          sections={sections}
          setSections={setSections}
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
          onUpdateInline={onUpdateSection}
          siteSettings={siteSettings}
          navItems={navItems}
        />

        <BuilderRightPanel
          selectedSection={selectedSection}
          updateSection={onUpdateSection}
          deleteSection={onDeleteSection}
        />
      </div>
    </div>
  );
}
