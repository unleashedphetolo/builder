import { lazy, Suspense, useMemo } from "react";

const healthTemplateModules = import.meta.glob(
  "../templates/health/*/App.{js,jsx}",
);

const HEALTH_TEMPLATE_KEYS = [
  "health-clinic-v1",
  "health-dental-v1",
  "health-specialist-v1",
  "health-physio-v1",
  "health-wellness-v1",
  "health-pediatric-v1",
  "health-hospital-v1",
  "health-diagnostics-v1",
  "health-mental-wellness-v1",
  "health-pharmacy-v1",
];

const HEALTH_DEFAULT_TEMPLATE = "health-clinic-v1";

const getHealthTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || HEALTH_DEFAULT_TEMPLATE;
  const exactPath = `../templates/health/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/health/${normalizedKey}/App.js`;

  return (
    healthTemplateModules[exactPath] ||
    healthTemplateModules[exactJsPath] ||
    healthTemplateModules[
      `../templates/health/${HEALTH_DEFAULT_TEMPLATE}/App.jsx`
    ] ||
    healthTemplateModules[
      `../templates/health/${HEALTH_DEFAULT_TEMPLATE}/App.js`
    ]
  );
};

const normalizeHealthSettings = ({
  settings,
  organization,
  page,
  sections,
  builderMode,
  previewMode,
}) => {
  const safeSettings = settings || {};
  const safeOrganization = organization || safeSettings.organization || {};

  return {
    ...safeSettings,
    layout_key: "health",
    organization: safeOrganization,
    page,
    sections: sections || safeSettings.sections || {},
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),

    health_config:
      safeSettings.health_config ||
      safeSettings.template_config?.health ||
      safeSettings.templateConfig?.health ||
      {},

    social_links:
      safeSettings.social_links ||
      safeSettings.socialLinks ||
      safeOrganization.social_links ||
      {},

    social_display:
      safeSettings.social_display ||
      safeSettings.socialDisplay ||
      safeOrganization.social_display ||
      {},

    contact: {
      email:
        safeSettings.official_email ||
        safeSettings.email ||
        safeOrganization.email ||
        "info@healthpractice.co.za",
      phone:
        safeSettings.official_phone ||
        safeSettings.phone ||
        safeOrganization.phone ||
        "+27 11 000 0000",
      address:
        safeSettings.address ||
        safeOrganization.address ||
        "Johannesburg, South Africa",
      mapEmbedUrl:
        safeSettings.map_embed_url ||
        safeSettings.mapEmbedUrl ||
        safeOrganization.map_embed_url ||
        safeOrganization.mapEmbedUrl ||
        "https://www.google.com/maps?q=Johannesburg%2C%20South%20Africa&output=embed",
      ...(safeSettings.contact || {}),
    },
  };
};

export default function HealthLayout({
  settings,
  organization,
  templateKey,
  template_key,
  selectedTemplateKey,
  page,
  sections,
  builderMode,
  previewMode,
  children,
  ...rest
}) {
  const resolvedTemplateKey =
    templateKey ||
    template_key ||
    selectedTemplateKey ||
    settings?.template_key ||
    settings?.selected_template_key ||
    HEALTH_DEFAULT_TEMPLATE;

  const safeTemplateKey = HEALTH_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : HEALTH_DEFAULT_TEMPLATE;

  const importer = getHealthTemplateImporter(safeTemplateKey);

  const HealthTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeHealthSettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
      }),
    [settings, organization, page, sections, builderMode, previewMode],
  );

  if (!HealthTemplate) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        Health template could not be loaded.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          Loading health template...
        </div>
      }
    >
      <HealthTemplate
        {...rest}
        settings={normalizedSettings}
        organization={normalizedSettings.organization}
        page={page}
        sections={normalizedSettings.sections}
        builderMode={builderMode}
        previewMode={previewMode}
      >
        {children}
      </HealthTemplate>
    </Suspense>
  );
}
