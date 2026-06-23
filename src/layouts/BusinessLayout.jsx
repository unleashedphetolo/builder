import React, { Suspense, lazy, useMemo } from "react";

const businessTemplates = import.meta.glob("../templates/business/*/App.{js,jsx}");

/*
  Create lazy template components once at module level.
  This keeps the same dynamic-template loading behaviour as SchoolLayout,
  while avoiding the creation of a new lazy component during render.
*/
const businessTemplateComponents = Object.fromEntries(
  Object.entries(businessTemplates).map(([path, importer]) => [
    path,
    lazy(importer),
  ]),
);

function resolveTemplateComponent(templateKey) {
  const candidates = [
    `../templates/business/${templateKey}/App.jsx`,
    `../templates/business/${templateKey}/App.js`,

    // Enterprise business fallbacks
    "../templates/business/business-executive-v1/App.jsx",
    "../templates/business/business-executive-v1/App.js",
    "../templates/business/business-agency-v1/App.jsx",
    "../templates/business/business-agency-v1/App.js",
    "../templates/business/business-consulting-v1/App.jsx",
    "../templates/business/business-consulting-v1/App.js",
    "../templates/business/business-finance-v1/App.jsx",
    "../templates/business/business-finance-v1/App.js",
  ];

  for (const key of candidates) {
    if (businessTemplateComponents[key]) return businessTemplateComponents[key];
  }

  const firstAvailable = Object.values(businessTemplateComponents)[0];

  if (!firstAvailable) {
    console.error("No business templates found.");
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
    layout_key: "business",
    template_key: settings?.template_key || "business-executive-v1",
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
      hero_slides: true,
      social_links: true,
      ...(settings?.features || {}),
    },
  };
}

function MissingTemplate({ templateKey }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginTop: 0 }}>Business template not found</h2>
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
      fallback={<div style={{ padding: 24 }}>Loading business template...</div>}
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

export default function BusinessLayout({
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