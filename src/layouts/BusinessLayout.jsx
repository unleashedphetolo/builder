import { lazy, Suspense, useMemo } from "react";

const businessTemplateModules = import.meta.glob(
  "../templates/business/*/App.{js,jsx}",
);

const BUSINESS_TEMPLATE_KEYS = [
  "business-corporate-v1",
  "business-consulting-v1",
  "business-agency-v1",
  "business-finance-v1",
  "business-executive-v1",
  "business-saas-v1",
  "business-logistics-v1",
  "business-real-estate-v1",
  "business-healthcare-v1",
  "business-legal-v1",
];

const BUSINESS_DEFAULT_TEMPLATE = "business-corporate-v1";

const getBusinessTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || BUSINESS_DEFAULT_TEMPLATE;
  const exactPath = `../templates/business/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/business/${normalizedKey}/App.js`;

  return (
    businessTemplateModules[exactPath] ||
    businessTemplateModules[exactJsPath] ||
    businessTemplateModules[
      `../templates/business/${BUSINESS_DEFAULT_TEMPLATE}/App.jsx`
    ] ||
    businessTemplateModules[
      `../templates/business/${BUSINESS_DEFAULT_TEMPLATE}/App.js`
    ]
  );
};

const normalizeBusinessSettings = ({
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
    layout_key: "business",
    organization: safeOrganization,
    page,
    sections: sections || safeSettings.sections || {},
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),

    business_config:
      safeSettings.business_config ||
      safeSettings.template_config?.business ||
      safeSettings.templateConfig?.business ||
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
        "hello@business.co.za",
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

export default function BusinessLayout({
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
    BUSINESS_DEFAULT_TEMPLATE;

  const safeTemplateKey = BUSINESS_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : BUSINESS_DEFAULT_TEMPLATE;

  const importer = getBusinessTemplateImporter(safeTemplateKey);

  const BusinessTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeBusinessSettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
      }),
    [settings, organization, page, sections, builderMode, previewMode],
  );

  if (!BusinessTemplate) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        Business template could not be loaded.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          Loading business template...
        </div>
      }
    >
      <BusinessTemplate
        {...rest}
        settings={normalizedSettings}
        organization={normalizedSettings.organization}
        page={page}
        sections={normalizedSettings.sections}
        builderMode={builderMode}
        previewMode={previewMode}
      >
        {children}
      </BusinessTemplate>
    </Suspense>
  );
}