import { lazy, Suspense, useMemo } from "react";

const realEstateTemplateModules = import.meta.glob(
  "../templates/real-estate/*/App.{js,jsx}",
);

const REAL_ESTATE_TEMPLATE_KEYS = [
  "realestate-luxury-estates-v1",
  "realestate-urban-apartments-v1",
  "realestate-coastal-villas-v1",
  "realestate-commercial-property-v1",
  "realestate-rental-agency-v1",
  "realestate-developer-v1",
  "realestate-land-farms-v1",
  "realestate-student-accommodation-v1",
  "realestate-holiday-stays-v1",
  "realestate-affordable-homes-v1",
  "realestate-auction-investment-v1",
  "realestate-smart-homes-v1"
];

const REAL_ESTATE_DEFAULT_TEMPLATE = "realestate-luxury-estates-v1";

const getRealEstateTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || REAL_ESTATE_DEFAULT_TEMPLATE;
  const exactJsxPath = `../templates/real-estate/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/real-estate/${normalizedKey}/App.js`;
  const defaultJsxPath = `../templates/real-estate/${REAL_ESTATE_DEFAULT_TEMPLATE}/App.jsx`;
  const defaultJsPath = `../templates/real-estate/${REAL_ESTATE_DEFAULT_TEMPLATE}/App.js`;

  return (
    realEstateTemplateModules[exactJsxPath] ||
    realEstateTemplateModules[exactJsPath] ||
    realEstateTemplateModules[defaultJsxPath] ||
    realEstateTemplateModules[defaultJsPath]
  );
};

const normalizeRealEstateSettings = ({ settings, organization, page, sections, builderMode, previewMode, templateKey }) => {
  const safeSettings = settings || {};
  const safeOrganization = organization || safeSettings.organization || {};
  const safeSections = sections || safeSettings.sections || {};
  const safeSocialLinks = safeSettings.social_links || safeSettings.socialLinks || safeOrganization.social_links || {};
  const safeContact = {
    email: safeSettings.official_email || safeSettings.email || safeOrganization.email || "property@realestate.co.za",
    phone: safeSettings.official_phone || safeSettings.phone || safeOrganization.phone || "+27 11 000 0000",
    address: safeSettings.address || safeOrganization.address || "Johannesburg, South Africa",
    ...(safeSettings.contact || {}),
  };

  return {
    ...safeSettings,
    layout_key: "real-estate",
    template_key: templateKey,
    selected_template_key: templateKey,
    organization: safeOrganization,
    page,
    sections: safeSections,
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),
    real_estate_config:
      safeSettings.real_estate_config ||
      safeSettings.template_config?.real_estate ||
      safeSettings.templateConfig?.realEstate ||
      {},
    template_config: {
      ...(safeSettings.template_config || {}),
      real_estate:
        safeSettings.real_estate_config ||
        safeSettings.template_config?.real_estate ||
        safeSettings.templateConfig?.realEstate ||
        {},
    },
    social_links: safeSocialLinks,
    socialLinks: safeSocialLinks,
    contact: safeContact,
  };
};

export default function RealEstateLayout({
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
    REAL_ESTATE_DEFAULT_TEMPLATE;

  const safeTemplateKey = REAL_ESTATE_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : REAL_ESTATE_DEFAULT_TEMPLATE;

  const importer = getRealEstateTemplateImporter(safeTemplateKey);

  const RealEstateTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeRealEstateSettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
        templateKey: safeTemplateKey,
      }),
    [settings, organization, page, sections, builderMode, previewMode, safeTemplateKey],
  );

  if (!RealEstateTemplate) {
    return <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Real estate template could not be loaded.</div>;
  }

  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Loading real estate template...</div>}>
      <RealEstateTemplate
        {...rest}
        settings={normalizedSettings}
        organization={normalizedSettings.organization}
        page={page}
        sections={normalizedSettings.sections}
        builderMode={builderMode}
        previewMode={previewMode}
        templateKey={safeTemplateKey}
        template_key={safeTemplateKey}
        selectedTemplateKey={safeTemplateKey}
      >
        {children}
      </RealEstateTemplate>
    </Suspense>
  );
}
