import { lazy, Suspense, useMemo } from "react";

const accommodationTemplateModules = import.meta.glob(
  "../templates/accommodation/*/App.{js,jsx}",
);

const ACCOMMODATION_TEMPLATE_KEYS = [
  "accommodation-luxury-hotel-v1",
  "accommodation-boutique-guesthouse-v1",
  "accommodation-safari-lodge-v1",
  "accommodation-beach-resort-v1",
  "accommodation-backpackers-hostel-v1",
  "accommodation-serviced-apartments-v1",
  "accommodation-student-residence-v1",
  "accommodation-bed-breakfast-v1",
  "accommodation-villa-rentals-v1",
  "accommodation-glamping-camping-v1",
  "accommodation-conference-lodge-v1",
  "accommodation-wellness-retreat-v1"
];

const ACCOMMODATION_DEFAULT_TEMPLATE = "accommodation-luxury-hotel-v1";

const getAccommodationTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || ACCOMMODATION_DEFAULT_TEMPLATE;
  const exactJsxPath = `../templates/accommodation/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/accommodation/${normalizedKey}/App.js`;
  const defaultJsxPath = `../templates/accommodation/${ACCOMMODATION_DEFAULT_TEMPLATE}/App.jsx`;
  const defaultJsPath = `../templates/accommodation/${ACCOMMODATION_DEFAULT_TEMPLATE}/App.js`;

  return (
    accommodationTemplateModules[exactJsxPath] ||
    accommodationTemplateModules[exactJsPath] ||
    accommodationTemplateModules[defaultJsxPath] ||
    accommodationTemplateModules[defaultJsPath]
  );
};

const normalizeAccommodationSettings = ({ settings, organization, page, sections, builderMode, previewMode, templateKey }) => {
  const safeSettings = settings || {};
  const safeOrganization = organization || safeSettings.organization || {};
  const safeSections = sections || safeSettings.sections || {};
  const safeSocialLinks = safeSettings.social_links || safeSettings.socialLinks || safeOrganization.social_links || {};
  const safeContact = {
    email: safeSettings.official_email || safeSettings.email || safeOrganization.email || "bookings@accommodation.co.za",
    phone: safeSettings.official_phone || safeSettings.phone || safeOrganization.phone || "+27 11 000 0000",
    address: safeSettings.address || safeOrganization.address || "Johannesburg, South Africa",
    ...(safeSettings.contact || {}),
  };

  return {
    ...safeSettings,
    layout_key: "accommodation",
    template_key: templateKey,
    selected_template_key: templateKey,
    organization: safeOrganization,
    page,
    sections: safeSections,
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),
    accommodation_config: safeSettings.accommodation_config || safeSettings.template_config?.accommodation || safeSettings.templateConfig?.accommodation || {},
    social_links: safeSocialLinks,
    socialLinks: safeSocialLinks,
    contact: safeContact,
  };
};

export default function AccommodationLayout({
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
    ACCOMMODATION_DEFAULT_TEMPLATE;

  const safeTemplateKey = ACCOMMODATION_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : ACCOMMODATION_DEFAULT_TEMPLATE;

  const importer = getAccommodationTemplateImporter(safeTemplateKey);
  const AccommodationTemplate = useMemo(() => importer ? lazy(importer) : null, [importer]);

  const normalizedSettings = useMemo(() => normalizeAccommodationSettings({ settings, organization, page, sections, builderMode, previewMode, templateKey: safeTemplateKey }), [settings, organization, page, sections, builderMode, previewMode, safeTemplateKey]);

  if (!AccommodationTemplate) {
    return <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Accommodation template could not be loaded.</div>;
  }

  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Loading accommodation template...</div>}>
      <AccommodationTemplate
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
      </AccommodationTemplate>
    </Suspense>
  );
}
