import { lazy, Suspense, useMemo } from "react";

const portfolioTemplateModules = import.meta.glob(
  "../templates/portfolio/*/App.{js,jsx}",
);

const PORTFOLIO_TEMPLATE_KEYS = [
  "portfolio-developer-v1",
  "portfolio-clean-v1",
  "portfolio-creative-v1",
  "portfolio-consultant-v1",
  "portfolio-product-v1",
  "portfolio-educator-v1",
  "portfolio-photographer-v1",
  "portfolio-architect-v1",
  "portfolio-freelancer-v1",
  "portfolio-cybersecurity-v1",
];

const PORTFOLIO_DEFAULT_TEMPLATE = "portfolio-developer-v1";

const getPortfolioTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || PORTFOLIO_DEFAULT_TEMPLATE;
  const exactPath = `../templates/portfolio/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/portfolio/${normalizedKey}/App.js`;

  return (
    portfolioTemplateModules[exactPath] ||
    portfolioTemplateModules[exactJsPath] ||
    portfolioTemplateModules[
      `../templates/portfolio/${PORTFOLIO_DEFAULT_TEMPLATE}/App.jsx`
    ] ||
    portfolioTemplateModules[
      `../templates/portfolio/${PORTFOLIO_DEFAULT_TEMPLATE}/App.js`
    ]
  );
};

const normalizePortfolioSettings = ({
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
    layout_key: "portfolio",
    organization: safeOrganization,
    page,
    sections: sections || safeSettings.sections || {},
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),

    portfolio_config:
      safeSettings.portfolio_config ||
      safeSettings.template_config?.portfolio ||
      safeSettings.templateConfig?.portfolio ||
      {},

    social_links:
      safeSettings.social_links ||
      safeSettings.socialLinks ||
      safeOrganization.social_links ||
      {},

    contact: {
      email:
        safeSettings.official_email ||
        safeSettings.email ||
        safeOrganization.email ||
        "hello@portfolio.co.za",
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
    },
  };
};

export default function PortfolioLayout({
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
    PORTFOLIO_DEFAULT_TEMPLATE;

  const safeTemplateKey = PORTFOLIO_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : PORTFOLIO_DEFAULT_TEMPLATE;

  const importer = getPortfolioTemplateImporter(safeTemplateKey);

  const PortfolioTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizePortfolioSettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
      }),
    [settings, organization, page, sections, builderMode, previewMode],
  );

  if (!PortfolioTemplate) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        Portfolio template could not be loaded.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          Loading portfolio template...
        </div>
      }
    >
      <PortfolioTemplate
        {...rest}
        settings={normalizedSettings}
        organization={normalizedSettings.organization}
        page={page}
        sections={normalizedSettings.sections}
        builderMode={builderMode}
        previewMode={previewMode}
      >
        {children}
      </PortfolioTemplate>
    </Suspense>
  );
}