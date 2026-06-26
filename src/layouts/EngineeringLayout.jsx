import { lazy, Suspense, useMemo } from "react";

const engineeringTemplateModules = import.meta.glob(
  "../templates/engineering/*/App.{js,jsx}",
);

const ENGINEERING_TEMPLATE_KEYS = [
  "engineering-consulting-v1",
  "engineering-civil-v1",
  "engineering-mechanical-v1",
  "engineering-electrical-v1",
  "engineering-structural-v1",
  "engineering-industrial-v1",
  "engineering-automation-v1",
  "engineering-energy-v1",
  "engineering-environmental-v1",
  "engineering-telecom-v1"
];

const ENGINEERING_DEFAULT_TEMPLATE = "engineering-consulting-v1";

const getEngineeringTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || ENGINEERING_DEFAULT_TEMPLATE;
  const exactPath = `../templates/engineering/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/engineering/${normalizedKey}/App.js`;

  return (
    engineeringTemplateModules[exactPath] ||
    engineeringTemplateModules[exactJsPath] ||
    engineeringTemplateModules[
      `../templates/engineering/${ENGINEERING_DEFAULT_TEMPLATE}/App.jsx`
    ] ||
    engineeringTemplateModules[
      `../templates/engineering/${ENGINEERING_DEFAULT_TEMPLATE}/App.js`
    ]
  );
};

const normalizeEngineeringSettings = ({
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
    layout_key: "engineering",
    organization: safeOrganization,
    page,
    sections: sections || safeSettings.sections || {},
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),

    engineering_config:
      safeSettings.engineering_config ||
      safeSettings.template_config?.engineering ||
      safeSettings.templateConfig?.engineering ||
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
        "hello@engineeringgroup.co.za",
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

export default function EngineeringLayout({
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
    ENGINEERING_DEFAULT_TEMPLATE;

  const safeTemplateKey = ENGINEERING_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : ENGINEERING_DEFAULT_TEMPLATE;

  const importer = getEngineeringTemplateImporter(safeTemplateKey);

  const EngineeringTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeEngineeringSettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
      }),
    [settings, organization, page, sections, builderMode, previewMode],
  );

  if (!EngineeringTemplate) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        Engineering template could not be loaded.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          Loading engineering template...
        </div>
      }
    >
      <EngineeringTemplate
        {...rest}
        settings={normalizedSettings}
        organization={normalizedSettings.organization}
        page={page}
        sections={normalizedSettings.sections}
        builderMode={builderMode}
        previewMode={previewMode}
      >
        {children}
      </EngineeringTemplate>
    </Suspense>
  );
}
