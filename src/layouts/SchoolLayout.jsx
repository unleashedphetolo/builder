import React, { Suspense, lazy, useMemo } from "react";

const schoolTemplates = import.meta.glob("../templates/school/*/App.{js,jsx}");

/*
  Create lazy template components once at module level.
  This keeps the existing dynamic-template loading behaviour, while avoiding
  the creation of a new lazy component during a SchoolLayout render.
*/
const schoolTemplateComponents = Object.fromEntries(
  Object.entries(schoolTemplates).map(([path, importer]) => [
    path,
    lazy(importer),
  ]),
);

function resolveTemplateComponent(templateKey) {
  const candidates = [
    `../templates/school/${templateKey}/App.jsx`,
    `../templates/school/${templateKey}/App.js`,
    "../templates/school/school-institutional-v1/App.jsx",
    "../templates/school/school-institutional-v1/App.js",
  ];

  for (const key of candidates) {
    if (schoolTemplateComponents[key]) return schoolTemplateComponents[key];
  }

  const firstAvailable = Object.values(schoolTemplateComponents)[0];

  if (!firstAvailable) {
    console.error("No school templates found.");
    return null;
  }

  return firstAvailable;
}

function normalizeNavItems(navItems = []) {
  if (!Array.isArray(navItems)) return [];

  return navItems
    .filter(Boolean)
    .sort((a, b) => {
      const locationA = a.location || "";
      const locationB = b.location || "";

      if (locationA !== locationB) {
        return locationA.localeCompare(locationB);
      }

      return (a.position ?? 0) - (b.position ?? 0);
    });
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
    features: {
      topbar: true,
      ...(settings?.features || {}),
    },
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
  Template,
  settings,
  navItems,
  page,
  sections,
  builderMode,
  previewMode,
  children,
}) {
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
        previewMode={previewMode}
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
  previewMode = false,
  children,
}) {
  const safeSettings = useMemo(() => normalizeSettings(settings), [settings]);
  const safeNavItems = useMemo(() => normalizeNavItems(navItems), [navItems]);

  const Template = useMemo(
    () => resolveTemplateComponent(safeSettings.template_key),
    [safeSettings.template_key],
  );

  if (!Template) {
    return <MissingTemplate templateKey={safeSettings.template_key} />;
  }

  return (
    <TemplateLoader
      Template={Template}
      settings={safeSettings}
      navItems={safeNavItems}
      page={page}
      sections={sections}
      builderMode={builderMode}
      previewMode={previewMode}
    >
      {children}
    </TemplateLoader>
  );
}
