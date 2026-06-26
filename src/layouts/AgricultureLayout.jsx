import { lazy, Suspense, useMemo } from "react";

const agricultureTemplateModules = import.meta.glob(
  "../templates/agriculture/*/App.{js,jsx}",
);

const AGRICULTURE_TEMPLATE_KEYS = [
  "agriculture-farm-v1",
  "agriculture-organic-v1",
  "agriculture-agritech-v1",
  "agriculture-livestock-v1",
  "agriculture-greenhouse-v1",
  "agriculture-winery-v1",
  "agriculture-irrigation-v1",
  "agriculture-cooperative-v1",
  "agriculture-export-v1",
  "agriculture-equipment-v1"
];

const AGRICULTURE_DEFAULT_TEMPLATE = "agriculture-farm-v1";

const getAgricultureTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || AGRICULTURE_DEFAULT_TEMPLATE;
  const exactPath = `../templates/agriculture/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/agriculture/${normalizedKey}/App.js`;

  return (
    agricultureTemplateModules[exactPath] ||
    agricultureTemplateModules[exactJsPath] ||
    agricultureTemplateModules[
      `../templates/agriculture/${AGRICULTURE_DEFAULT_TEMPLATE}/App.jsx`
    ] ||
    agricultureTemplateModules[
      `../templates/agriculture/${AGRICULTURE_DEFAULT_TEMPLATE}/App.js`
    ]
  );
};

const normalizeAgricultureSettings = ({
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
    layout_key: "agriculture",
    organization: safeOrganization,
    page,
    sections: sections || safeSettings.sections || {},
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),

    agriculture_config:
      safeSettings.agriculture_config ||
      safeSettings.template_config?.agriculture ||
      safeSettings.templateConfig?.agriculture ||
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
        "info@agri-enterprise.co.za",
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

export default function AgricultureLayout({
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
    AGRICULTURE_DEFAULT_TEMPLATE;

  const safeTemplateKey = AGRICULTURE_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : AGRICULTURE_DEFAULT_TEMPLATE;

  const importer = getAgricultureTemplateImporter(safeTemplateKey);

  const AgricultureTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeAgricultureSettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
      }),
    [settings, organization, page, sections, builderMode, previewMode],
  );

  if (!AgricultureTemplate) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        Agriculture template could not be loaded.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          Loading agriculture template...
        </div>
      }
    >
      <AgricultureTemplate
        {...rest}
        settings={normalizedSettings}
        organization={normalizedSettings.organization}
        page={page}
        sections={normalizedSettings.sections}
        builderMode={builderMode}
        previewMode={previewMode}
      >
        {children}
      </AgricultureTemplate>
    </Suspense>
  );
}
