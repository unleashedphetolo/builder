import { lazy, Suspense, useMemo } from "react";

const securityTemplateModules = import.meta.glob(
  "../templates/security/*/App.{js,jsx}",
);

const SECURITY_TEMPLATE_KEYS = [
  "security-guarding-v1",
  "security-surveillance-v1",
  "security-executive-v1",
  "security-event-v1",
  "security-mobile-patrol-v1",
  "security-alarm-response-v1",
  "security-industrial-v1",
  "security-estate-v1",
  "security-systems-v1",
  "security-retail-hospitality-v1",
];

const SECURITY_DEFAULT_TEMPLATE = "security-guarding-v1";

const getSecurityTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || SECURITY_DEFAULT_TEMPLATE;
  const exactPath = `../templates/security/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/security/${normalizedKey}/App.js`;

  return (
    securityTemplateModules[exactPath] ||
    securityTemplateModules[exactJsPath] ||
    securityTemplateModules[`../templates/security/${SECURITY_DEFAULT_TEMPLATE}/App.jsx`] ||
    securityTemplateModules[`../templates/security/${SECURITY_DEFAULT_TEMPLATE}/App.js`]
  );
};

const normalizeSecuritySettings = ({
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
    layout_key: "security",
    organization: safeOrganization,
    page,
    sections: sections || safeSettings.sections || {},
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),
    security_config:
      safeSettings.security_config ||
      safeSettings.template_config?.security ||
      safeSettings.templateConfig?.security ||
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
        "info@securitycompany.co.za",
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

export default function SecurityLayout({
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
    SECURITY_DEFAULT_TEMPLATE;

  const safeTemplateKey = SECURITY_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : SECURITY_DEFAULT_TEMPLATE;

  const importer = getSecurityTemplateImporter(safeTemplateKey);

  const SecurityTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeSecuritySettings({
        settings,
        organization,
        page,
        sections,
        builderMode,
        previewMode,
      }),
    [settings, organization, page, sections, builderMode, previewMode],
  );

  if (!SecurityTemplate) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
        Security template could not be loaded.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
          Loading security template...
        </div>
      }
    >
      <SecurityTemplate
        {...rest}
        settings={normalizedSettings}
        organization={normalizedSettings.organization}
        page={page}
        sections={normalizedSettings.sections}
        builderMode={builderMode}
        previewMode={previewMode}
      >
        {children}
      </SecurityTemplate>
    </Suspense>
  );
}
