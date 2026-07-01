import { lazy, Suspense, useMemo } from "react";

const ecommerceTemplateModules = import.meta.glob(
  "../templates/ecommerce/*/App.{js,jsx}",
);

const ECOMMERCE_TEMPLATE_KEYS = [
  "commerce-luxury-fashion-v1",
  "commerce-electronics-v1",
  "commerce-grocery-v1",
  "commerce-furniture-v1",
  "commerce-beauty-v1",
  "commerce-sneakers-v1",
  "commerce-auto-parts-v1",
  "commerce-baby-kids-v1",
  "commerce-books-stationery-v1",
  "commerce-digital-products-v1",
  "commerce-perfume-v1",
  "commerce-spectacles-v1",
];

const ECOMMERCE_DEFAULT_TEMPLATE = "commerce-luxury-fashion-v1";

const getEcommerceTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || ECOMMERCE_DEFAULT_TEMPLATE;
  const exactJsxPath = `../templates/ecommerce/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/ecommerce/${normalizedKey}/App.js`;
  const defaultJsxPath = `../templates/ecommerce/${ECOMMERCE_DEFAULT_TEMPLATE}/App.jsx`;
  const defaultJsPath = `../templates/ecommerce/${ECOMMERCE_DEFAULT_TEMPLATE}/App.js`;

  return (
    ecommerceTemplateModules[exactJsxPath] ||
    ecommerceTemplateModules[exactJsPath] ||
    ecommerceTemplateModules[defaultJsxPath] ||
    ecommerceTemplateModules[defaultJsPath]
  );
};

const normalizeEcommerceSettings = ({ settings, organization, page, sections, builderMode, previewMode, templateKey }) => {
  const safeSettings = settings || {};
  const safeOrganization = organization || safeSettings.organization || {};
  const safeSections = sections || safeSettings.sections || {};
  const safeSocialLinks = safeSettings.social_links || safeSettings.socialLinks || safeOrganization.social_links || {};
  const safeContact = {
    email: safeSettings.official_email || safeSettings.email || safeOrganization.email || "orders@ecommerce.co.za",
    phone: safeSettings.official_phone || safeSettings.phone || safeOrganization.phone || "+27 11 000 0000",
    address: safeSettings.address || safeOrganization.address || "Johannesburg, South Africa",
    ...(safeSettings.contact || {}),
  };

  return {
    ...safeSettings,
    layout_key: "ecommerce",
    template_key: templateKey,
    selected_template_key: templateKey,
    organization: safeOrganization,
    page,
    sections: safeSections,
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),
    ecommerce_config:
      safeSettings.ecommerce_config ||
      safeSettings.template_config?.ecommerce ||
      safeSettings.templateConfig?.ecommerce ||
      {},
    template_config: {
      ...(safeSettings.template_config || {}),
      ecommerce:
        safeSettings.ecommerce_config ||
        safeSettings.template_config?.ecommerce ||
        safeSettings.templateConfig?.ecommerce ||
        {},
    },
    social_links: safeSocialLinks,
    socialLinks: safeSocialLinks,
    contact: safeContact,
    order_cart: {
      enabled: true,
      email: safeContact.email,
      subject: safeSettings.order_subject || "New ecommerce order request",
      ...(safeSettings.order_cart || {}),
    },
  };
};

export default function EcommerceLayout({
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
    ECOMMERCE_DEFAULT_TEMPLATE;

  const safeTemplateKey = ECOMMERCE_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : ECOMMERCE_DEFAULT_TEMPLATE;

  const importer = getEcommerceTemplateImporter(safeTemplateKey);

  const EcommerceTemplate = useMemo(() => {
    return importer ? lazy(importer) : null;
  }, [importer]);

  const normalizedSettings = useMemo(
    () =>
      normalizeEcommerceSettings({
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

  if (!EcommerceTemplate) {
    return <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Ecommerce template could not be loaded.</div>;
  }

  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Loading ecommerce template...</div>}>
      <EcommerceTemplate
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
      </EcommerceTemplate>
    </Suspense>
  );
}
