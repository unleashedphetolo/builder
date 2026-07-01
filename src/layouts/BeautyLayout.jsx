import { lazy, Suspense, useMemo } from "react";

const beautyTemplateModules = import.meta.glob(
  "../templates/beauty/*/App.{js,jsx}",
);

const BEAUTY_TEMPLATE_KEYS = [
  "beauty-luxury-salon-v1",
  "beauty-spa-wellness-v1",
  "beauty-nail-studio-v1",
  "beauty-barber-grooming-v1",
  "beauty-makeup-bridal-v1",
  "beauty-skincare-clinic-v1",
  "beauty-lash-brow-v1",
  "beauty-hair-extensions-v1",
  "beauty-wellness-retreat-v1",
  "beauty-products-store-v1",
  "beauty-medspa-aesthetics-v1",
  "beauty-afro-hair-v1"
];

const BEAUTY_DEFAULT_TEMPLATE = "beauty-luxury-salon-v1";

const getBeautyTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || BEAUTY_DEFAULT_TEMPLATE;
  const exactJsxPath = `../templates/beauty/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/beauty/${normalizedKey}/App.js`;
  const defaultJsxPath = `../templates/beauty/${BEAUTY_DEFAULT_TEMPLATE}/App.jsx`;
  const defaultJsPath = `../templates/beauty/${BEAUTY_DEFAULT_TEMPLATE}/App.js`;

  return (
    beautyTemplateModules[exactJsxPath] ||
    beautyTemplateModules[exactJsPath] ||
    beautyTemplateModules[defaultJsxPath] ||
    beautyTemplateModules[defaultJsPath]
  );
};

const normalizeBeautySettings = ({ settings, organization, page, sections, builderMode, previewMode, templateKey }) => {
  const safeSettings = settings || {};
  const safeOrganization = organization || safeSettings.organization || {};
  const safeSections = sections || safeSettings.sections || {};
  const safeSocialLinks = safeSettings.social_links || safeSettings.socialLinks || safeOrganization.social_links || {};
  const safeContact = {
    email: safeSettings.official_email || safeSettings.email || safeOrganization.email || "bookings@beautystudio.co.za",
    phone: safeSettings.official_phone || safeSettings.phone || safeOrganization.phone || "+27 11 000 0000",
    address: safeSettings.address || safeOrganization.address || "Johannesburg, South Africa",
    ...(safeSettings.contact || {}),
  };

  return {
    ...safeSettings,
    layout_key: "beauty",
    template_key: templateKey,
    selected_template_key: templateKey,
    organization: safeOrganization,
    page,
    sections: safeSections,
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),
    beauty_config: safeSettings.beauty_config || safeSettings.template_config?.beauty || safeSettings.templateConfig?.beauty || {},
    social_links: safeSocialLinks,
    socialLinks: safeSocialLinks,
    contact: safeContact,
  };
};

export default function BeautyLayout({
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
    BEAUTY_DEFAULT_TEMPLATE;

  const safeTemplateKey = BEAUTY_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : BEAUTY_DEFAULT_TEMPLATE;

  const importer = getBeautyTemplateImporter(safeTemplateKey);
  const BeautyTemplate = useMemo(() => importer ? lazy(importer) : null, [importer]);

  const normalizedSettings = useMemo(
    () => normalizeBeautySettings({ settings, organization, page, sections, builderMode, previewMode, templateKey: safeTemplateKey }),
    [settings, organization, page, sections, builderMode, previewMode, safeTemplateKey],
  );

  if (!BeautyTemplate) {
    return <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Beauty template could not be loaded.</div>;
  }

  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Loading beauty template...</div>}>
      <BeautyTemplate
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
      </BeautyTemplate>
    </Suspense>
  );
}
