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
  const [hoveredTab, setHoveredTab] = useState("announcements");
  const [openedTab, setOpenedTab] = useState(null);

  const tabs = useMemo(
    () => [
      {
        key: "announcements",
        label: "Notices & Updates",
        icon: "📢",
        subtitle: "Manage updates, notices and alerts",
      },
      {
        key: "site",
        label: "Site Details",
        icon: "🏢",
        subtitle: "Identity, logo, contact and branding",
      },
      {
        key: "social",
        label: "Social Media",
        icon: "🔗",
        subtitle: "Topbar, footer and social links",
      },
      {
        key: "templates",
        label: "Website Template",
        icon: "🧩",
        subtitle: "Switch structure for this website category",
      },
      {
        key: "themes",
        label: "Website Themes",
        icon: "🎨",
        subtitle: "Change visual style and theme mode",
      },
      {
        key: "colors",
        label: "Website Colors",
        icon: "🖌️",
        subtitle: "Primary, secondary and background colors",
      },
      {
        key: "pages",
        label: "Pages",
        icon: "📄",
        subtitle: "Manage pages and navigation structure",
      },
      {
        key: "analytics",
        label: "Analytics",
        icon: "📊",
        subtitle: "Traffic, trends and performance overview",
      },
    ],
    [],
  );

  const currentTab = useMemo(() => {
    return tabs.find((tab) => tab.key === activeTab) || tabs[0];
  }, [tabs, activeTab]);

  const previewTab = useMemo(() => {
    const keyToUse = openedTab || hoveredTab || activeTab;
    return tabs.find((tab) => tab.key === keyToUse) || tabs[0];
  }, [tabs, openedTab, hoveredTab, activeTab]);

  const handleOpenTab = (tabKey) => {
    setActiveTab(tabKey);
    setOpenedTab(tabKey);
  };

  const handleBack = () => {
    setOpenedTab(null);
  };

  const renderPanelContent = (tabKey) => {
    if (tabKey === "announcements") {
      return (
        <AnnouncementsPanel
          siteSettings={siteSettings}
          onUpdateAnnouncements={onUpdateAnnouncements}
        />
      );
    }

    if (tabKey === "site") {
      return (
        <SiteDetailsPanel
          siteSettings={siteSettings}
          onUpdateSettings={onUpdateSettings}
        />
      );
    }

    if (tabKey === "social") {
      return (
        <SocialPanel
          siteSettings={siteSettings}
          onUpdateSocialMedia={onUpdateSocialMedia}
          onUpdateSettings={onUpdateSettings}
        />
      );
    }

    if (tabKey === "templates") {
      return (
        <TemplatePanel
          layoutKey={layoutKey}
          templateKey={templateKey}
          templates={templates}
          onChangeTemplate={onChangeTemplate}
        />
      );
    }

    if (tabKey === "themes") {
      return (
        <ThemePanel
          siteSettings={siteSettings}
          onUpdateTheme={onUpdateTheme}
          onUpdateSettings={onUpdateSettings}
        />
      );
    }

    if (tabKey === "colors") {
      return (
        <ColorsPanel
          siteSettings={siteSettings}
          onUpdateColors={onUpdateColors}
          onUpdateSettings={onUpdateSettings}
        />
      );
    }

    if (tabKey === "pages") {
      return (
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
      );
    }

    if (tabKey === "analytics") {
      return (
        <AnalyticsPanel
          siteId={siteId}
          siteSettings={siteSettings}
          pages={pages}
          navItems={navItems}
        />
      );
    }

    return null;
  };

  const renderPreviewItems = (tabKey) => {
    if (tabKey === "announcements") {
      return (
        <>
          <div className="sidebar-preview-item">Editable notice board</div>
          <div className="sidebar-preview-item">Website updates</div>
          <div className="sidebar-preview-item">Post and manage alerts</div>
        </>
      );
    }

    if (tabKey === "site") {
      return (
        <>
          <div className="sidebar-preview-item">Site name and slogan</div>
          <div className="sidebar-preview-item">Logo and contact details</div>
          <div className="sidebar-preview-item">Institution profile settings</div>
        </>
      );
    }

    if (tabKey === "social") {
      return (
        <>
          <div className="sidebar-preview-item">Topbar and footer display</div>
          <div className="sidebar-preview-item">Platform links and visibility</div>
          <div className="sidebar-preview-item">Original or mono icon style</div>
        </>
      );
    }

    if (tabKey === "templates") {
      return (
        <>
          <div className="sidebar-preview-item">Category-based templates</div>
          <div className="sidebar-preview-item">Switch structure safely</div>
          <div className="sidebar-preview-item">Curated institutional layouts</div>
        </>
      );
    }

    if (tabKey === "themes") {
      return (
        <>
          <div className="sidebar-preview-item">Planet theme styles</div>
          <div className="sidebar-preview-item">Light and dark mode</div>
          <div className="sidebar-preview-item">Instant visual changes</div>
        </>
      );
    }

    if (tabKey === "colors") {
      return (
        <>
          <div className="sidebar-preview-item">Primary color</div>
          <div className="sidebar-preview-item">Secondary color</div>
          <div className="sidebar-preview-item">Background color</div>
        </>
      );
    }

    if (tabKey === "pages") {
      return (
        <>
          <div className="sidebar-preview-item">Pages and navigation</div>
          <div className="sidebar-preview-item">Parent and child pages</div>
          <div className="sidebar-preview-item">Open and edit page details</div>
        </>
      );
    }

    if (tabKey === "analytics") {
      return (
        <>
          <div className="sidebar-preview-item">Daily to yearly traffic</div>
          <div className="sidebar-preview-item">Performance trends</div>
          <div className="sidebar-preview-item">Growth overview</div>
        </>
      );
    }

    return null;
  };

  return (
    <aside className={`sidebar sidebar-shell ${openedTab ? "panel-open" : ""}`}>
      <div className="sidebar-rail">
        <div className="sidebar-rail-top">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const isOpen = openedTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                className={`sidebar-rail-button ${
                  isActive || isOpen ? "active" : ""
                }`}
                onMouseEnter={() => setHoveredTab(tab.key)}
                onFocus={() => setHoveredTab(tab.key)}
                onClick={() => handleOpenTab(tab.key)}
                title={tab.label}
                aria-label={tab.label}
              >
                <span className="sidebar-rail-icon">{tab.icon}</span>
                <span className="sidebar-rail-label">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!openedTab && (
        <div className="sidebar-preview-panel">
          <div className="sidebar-preview-header">
            <div className="sidebar-preview-header-main">
              <span className="sidebar-preview-icon">{previewTab.icon}</span>
              <div>
                <h3>{previewTab.label}</h3>
                <p>{previewTab.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              className="sidebar-open-button"
              onClick={() => handleOpenTab(previewTab.key)}
            >
              Open
            </button>
          </div>

          <div className="sidebar-preview-body">
            {renderPreviewItems(previewTab.key)}
          </div>
        </div>
      )}

      {openedTab && (
        <div className="sidebar-modal-panel">
          <div className="sidebar-modal-header">
            <button
              type="button"
              className="sidebar-back-button"
              onClick={handleBack}
            >
              ← Back
            </button>

            <div className="sidebar-modal-title-wrap">
              <span className="sidebar-preview-icon">{currentTab.icon}</span>
              <div>
                <h3>{currentTab.label}</h3>
                <p>{currentTab.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="sidebar-content sidebar-modal-content">
            {renderPanelContent(openedTab)}
          </div>
        </div>
      )}
    </aside>
  );
}