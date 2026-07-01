import { lazy, Suspense, useMemo } from "react";

const technologyTemplateModules = import.meta.glob(
  "../templates/technology/*/App.{js,jsx}",
);

const TECHNOLOGY_TEMPLATE_KEYS = [
  "tech-internet-cafe-v1",
  "tech-software-studio-v1",
  "tech-computer-repair-v1",
  "tech-hardware-store-v1",
  "tech-appliances-v1",
  "tech-network-cctv-v1",
  "tech-mobile-device-v1",
  "tech-cloud-systems-v1",
  "tech-cyber-data-v1",
  "tech-ai-automation-v1",
];

const TECHNOLOGY_DEFAULT_TEMPLATE = "tech-internet-cafe-v1";

const getTechnologyTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || TECHNOLOGY_DEFAULT_TEMPLATE;

  const exactJsxPath = `../templates/technology/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/technology/${normalizedKey}/App.js`;

  const defaultJsxPath = `../templates/technology/${TECHNOLOGY_DEFAULT_TEMPLATE}/App.jsx`;
  const defaultJsPath = `../templates/technology/${TECHNOLOGY_DEFAULT_TEMPLATE}/App.js`;

  return (
    technologyTemplateModules[exactJsxPath] ||
    technologyTemplateModules[exactJsPath] ||
    technologyTemplateModules[defaultJsxPath] ||
    technologyTemplateModules[defaultJsPath]
  );
};

const normalizeTechnologySettings = ({
  settings,
  organization,
  page,
  sections,
  builderMode,
  previewMode,
  templateKey,
}) => {
  const safeSettings = settings || {};
  const safeOrganization = organization || safeSettings.organization || {};

  const safeSections = sections || safeSettings.sections || {};

  const safeSocialLinks =
    safeSettings.social_links ||
    safeSettings.socialLinks ||
    safeOrganization.social_links ||
    {};

  const safeContact = {
    email:
      safeSettings.official_email ||
      safeSettings.email ||
      safeOrganization.email ||
      "hello@technology.co.za",
    phone:
      safeSettings.official_phone ||
      safeSettings.phone ||
      safeOrganization.phone ||
      "+27 11 000 0000",
    address:
      safeSettings.address ||
      safeOrganization.address ||
      "Johannesburg, South Africa",
    ...(safeSettings.contact || {}),
  };

  return {
    ...safeSettings,

    layout_key: "technology",
    template_key: templateKey,
    selected_template_key: templateKey,

    organization: safeOrganization,
    page,
    sections: safeSections,

    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),

    technology_config:
      safeSettings.technology_config ||
      safeSettings.template_config?.technology ||
      safeSettings.templateConfig?.technology ||
      {},

    template_config: {
      ...(safeSettings.template_config || {}),
      technology:
        safeSettings.technology_config ||
        safeSettings.template_config?.technology ||
        safeSettings.templateConfig?.technology ||
        {},
    },

    social_links: safeSocialLinks,
    socialLinks: safeSocialLinks,

    contact: safeContact,

    quote_cart: {
      enabled: true,
      email:
        safeContact.email ||
        safeSettings.quote_email ||
        safeOrganization.email ||
        "hello@technology.co.za",
      subject:
        safeSettings.quote_subject ||
        "New technology service / product quote request",
      ...(safeSettings.quote_cart || {}),
    },
  };
};

export default function TechnologyLayout({
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
    TECHNOLOGY_DEFAULT_TEMPLATE;

  const safeTemplateKey = TECHNOLOGY_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : TECHNOLOGY_DEFAULT_TEMPLATE;

  const importer = getTechnologyTemplateImporter(safeTemplateKey);

  const TechnologyTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeTechnologySettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
        templateKey: safeTemplateKey,
      }),
    [
      settings,
      organization,
      page,
      sections,
      builderMode,
      previewMode,
      safeTemplateKey,
    ],
  );

  if (!TechnologyTemplate) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        Technology template could not be loaded.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          Loading technology template...
        </div>
      }
    >
      <TechnologyTemplate
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
      </TechnologyTemplate>
    </Suspense>
  );
}