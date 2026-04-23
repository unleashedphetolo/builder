import React, { useMemo, useState } from "react";
import "../styles/builderSidebar.css";
import "../styles/panels.css";

import SiteDetailsPanel from "./panels/SiteDetailsPanel";
import SocialPanel from "./panels/SocialPanel";
import AnnouncementsPanel from "./panels/AnnouncementsPanel";
import TemplatePanel from "./panels/TemplatePanel";
import ThemePanel from "./panels/ThemePanel";
import ColorsPanel from "./panels/ColorsPanel";
import PagesPanel from "./panels/PagesPanel";
import AnalyticsPanel from "./panels/AnalyticsPanel";

export default function BuilderSidebar({
  siteId,
  layoutKey,
  templateKey,
  templates = [],
  pages = [],
  navItems = [],
  currentPage,
  currentPageData,
  setCurrentPage,
  siteSettings,
  onUpdateSettings,
  onUpdateTheme,
  onUpdateColors,
  onUpdateAnnouncements,
  onUpdateSocialMedia,
  onChangeTemplate,
  onUpdatePage,
  onUpdateAnyPage,
  onUpdatePageContent,
  onUpdateAnyPageContent,
}) {
  const [activeTab, setActiveTab] = useState("announcements");

  const tabs = useMemo(
    () => [
      { key: "announcements", label: "Announcements" },
      { key: "site", label: "Site Details" },
      { key: "social", label: "Social Media" },
      { key: "templates", label: "Website Template" },
      { key: "themes", label: "Website Themes" },
      { key: "colors", label: "Website Colors" },
      { key: "pages", label: "Pages" },
      { key: "analytics", label: "Analytics" },
    ],
    [],
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? "active" : ""}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="sidebar-content">
        {activeTab === "announcements" && (
          <AnnouncementsPanel
            siteSettings={siteSettings}
            onUpdateAnnouncements={onUpdateAnnouncements}
          />
        )}

        {activeTab === "site" && (
          <SiteDetailsPanel
            siteSettings={siteSettings}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        {activeTab === "social" && (
          <SocialPanel
            siteSettings={siteSettings}
            onUpdateSocialMedia={onUpdateSocialMedia}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        {activeTab === "templates" && (
          <TemplatePanel
            layoutKey={layoutKey}
            templateKey={templateKey}
            templates={templates}
            onChangeTemplate={onChangeTemplate}
          />
        )}

        {activeTab === "themes" && (
          <ThemePanel
            siteSettings={siteSettings}
            onUpdateTheme={onUpdateTheme}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        {activeTab === "colors" && (
          <ColorsPanel
            siteSettings={siteSettings}
            onUpdateColors={onUpdateColors}
            onUpdateSettings={onUpdateSettings}
          />
        )}

        {activeTab === "pages" && (
          <PagesPanel
            siteId={siteId}
            pages={pages}
            navItems={navItems}
            currentPage={currentPage}
            currentPageData={currentPageData}
            setCurrentPage={setCurrentPage}
            onUpdatePage={onUpdatePage}
            onUpdateAnyPage={onUpdateAnyPage}
            onUpdatePageContent={onUpdatePageContent}
            onUpdateAnyPageContent={onUpdateAnyPageContent}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsPanel
            siteId={siteId}
            siteSettings={siteSettings}
            pages={pages}
            navItems={navItems}
          />
        )}
      </div>
    </aside>
  );
}