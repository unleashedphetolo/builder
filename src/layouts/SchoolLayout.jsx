import React, { Suspense, lazy, useMemo } from "react";

const schoolTemplates = import.meta.glob("../templates/school/*/App.{js,jsx}");

function resolveTemplateImporter(templateKey) {
  const candidates = [
    `../templates/school/${templateKey}/App.jsx`,
    `../templates/school/${templateKey}/App.js`,
    "../templates/school/school-institutional-v1/App.jsx",
    "../templates/school/school-institutional-v1/App.js",
  ];

  for (const key of candidates) {
    if (schoolTemplates[key]) return schoolTemplates[key];
  }

  const firstAvailable = Object.values(schoolTemplates)[0];

  if (!firstAvailable) {
    console.error("No school templates found.");
    return null;
  }

  return firstAvailable;
}

function normalizeNavItems(navItems = []) {
  if (!Array.isArray(navItems)) return [];
  return navItems
    .filter((item) => item && item.is_visible !== false)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
}

function normalizeSettings(settings = {}) {
  return {
    ...(settings || {}),
    layout_key: "school",
    template_key: settings?.template_key || "school-institutional-v1",
    site_id: settings?.site_id || null,
    social_links: settings?.social_links || {},
    social_display: settings?.social_display || {},
    topbar_links: Array.isArray(settings?.topbar_links)
      ? settings.topbar_links
      : [],
    footer_links: Array.isArray(settings?.footer_links)
      ? settings.footer_links
      : [],
    features: settings?.features || {},
  };
}

function MissingTemplate({ templateKey }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>School template not found</h2>
      <p style={{ color: "#475569" }}>
        Could not load template: <strong>{templateKey}</strong>
      </p>
    </div>
  );
}

function TemplateLoader({
  importer,
  settings,
  navItems,
  page,
  sections,
  builderMode,
  children,
}) {
  const Template = useMemo(() => lazy(importer), [importer]);

  return (
    <Suspense
      fallback={<div style={{ padding: 24 }}>Loading school template...</div>}
    >
      <Template
        settings={settings}
        navItems={navItems}
        page={page}
        sections={sections}
        builderMode={builderMode}
      >
        {children}
      </Template>
    </Suspense>
  );
}

export default function SchoolLayout({
  settings,
  navItems,
  page,
  sections,
  builderMode = false,
  children,
}) {
  const safeSettings = useMemo(() => normalizeSettings(settings), [settings]);
  const safeNavItems = useMemo(() => normalizeNavItems(navItems), [navItems]);

  const importer = useMemo(
    () => resolveTemplateImporter(safeSettings.template_key),
    [safeSettings.template_key],
  );

  if (!importer) {
    return <MissingTemplate templateKey={safeSettings.template_key} />;
  }

  return (
    <TemplateLoader
      importer={importer}
      settings={safeSettings}
      navItems={safeNavItems}
      page={page}
      sections={sections}
      builderMode={builderMode}
    >
      {children}
    </TemplateLoader>
  );
}
