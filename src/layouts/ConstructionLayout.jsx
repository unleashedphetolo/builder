import { lazy, Suspense, useMemo } from "react";

const constructionTemplateModules = import.meta.glob(
  "../templates/construction/*/App.{js,jsx}",
);

const CONSTRUCTION_TEMPLATE_KEYS = [
  "construction-general-v1",
  "construction-civil-v1",
  "construction-architecture-v1",
  "construction-residential-v1",
  "construction-commercial-v1",
  "construction-renovation-v1",
  "construction-roofing-v1",
  "construction-engineering-v1",
  "construction-materials-v1",
  "construction-project-management-v1",
];

const CONSTRUCTION_DEFAULT_TEMPLATE = "construction-general-v1";

const getConstructionTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || CONSTRUCTION_DEFAULT_TEMPLATE;
  const exactPath = `../templates/construction/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/construction/${normalizedKey}/App.js`;

  return (
    constructionTemplateModules[exactPath] ||
    constructionTemplateModules[exactJsPath] ||
    constructionTemplateModules[
      `../templates/construction/${CONSTRUCTION_DEFAULT_TEMPLATE}/App.jsx`
    ] ||
    constructionTemplateModules[
      `../templates/construction/${CONSTRUCTION_DEFAULT_TEMPLATE}/App.js`
    ]
  );
};

const normalizeConstructionSettings = ({
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
    layout_key: "construction",
    organization: safeOrganization,
    page,
    sections: sections || safeSettings.sections || {},
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),

    construction_config:
      safeSettings.construction_config ||
      safeSettings.template_config?.construction ||
      safeSettings.templateConfig?.construction ||
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
        "info@constructioncompany.co.za",
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

export default function ConstructionLayout({
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
    CONSTRUCTION_DEFAULT_TEMPLATE;

  const safeTemplateKey = CONSTRUCTION_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : CONSTRUCTION_DEFAULT_TEMPLATE;

  const importer = getConstructionTemplateImporter(safeTemplateKey);

  const ConstructionTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeConstructionSettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
      }),
    [settings, organization, page, sections, builderMode, previewMode],
  );

  if (!ConstructionTemplate) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        Construction template could not be loaded.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          Loading construction template...
        </div>
      }
    >
      <ConstructionTemplate
        {...rest}
        settings={normalizedSettings}
        organization={normalizedSettings.organization}
        page={page}
        sections={normalizedSettings.sections}
        builderMode={builderMode}
        previewMode={previewMode}
      >
        {children}
      </ConstructionTemplate>
    </Suspense>
  );
}
