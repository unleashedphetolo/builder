import { lazy, Suspense, useMemo } from "react";

const restaurantTemplateModules = import.meta.glob(
  "../templates/restaurant/*/App.{js,jsx}",
);

const RESTAURANT_TEMPLATE_KEYS = [
  "restaurant-fine-dining-v1",
  "restaurant-steakhouse-v1",
  "restaurant-seafood-v1",
  "restaurant-cafe-bakery-v1",
  "restaurant-pizza-v1",
  "restaurant-sushi-v1",
  "restaurant-kota-house-v1",
  "restaurant-afro-fusion-v1",
  "restaurant-burger-grill-v1",
  "restaurant-vegan-v1",
  "restaurant-family-bistro-v1",
  "restaurant-rooftop-bar-v1"
];

const RESTAURANT_DEFAULT_TEMPLATE = "restaurant-fine-dining-v1";

const getRestaurantTemplateImporter = (templateKey) => {
  const normalizedKey = templateKey || RESTAURANT_DEFAULT_TEMPLATE;
  const exactJsxPath = `../templates/restaurant/${normalizedKey}/App.jsx`;
  const exactJsPath = `../templates/restaurant/${normalizedKey}/App.js`;
  const defaultJsxPath = `../templates/restaurant/${RESTAURANT_DEFAULT_TEMPLATE}/App.jsx`;
  const defaultJsPath = `../templates/restaurant/${RESTAURANT_DEFAULT_TEMPLATE}/App.js`;

  return (
    restaurantTemplateModules[exactJsxPath] ||
    restaurantTemplateModules[exactJsPath] ||
    restaurantTemplateModules[defaultJsxPath] ||
    restaurantTemplateModules[defaultJsPath]
  );
};

const normalizeRestaurantSettings = ({ settings, organization, page, sections, builderMode, previewMode, templateKey }) => {
  const safeSettings = settings || {};
  const safeOrganization = organization || safeSettings.organization || {};
  const safeSections = sections || safeSettings.sections || {};
  const safeSocialLinks = safeSettings.social_links || safeSettings.socialLinks || safeOrganization.social_links || {};
  const safeContact = {
    email: safeSettings.official_email || safeSettings.email || safeOrganization.email || "bookings@restaurant.co.za",
    phone: safeSettings.official_phone || safeSettings.phone || safeOrganization.phone || "+27 11 000 0000",
    address: safeSettings.address || safeOrganization.address || "Johannesburg, South Africa",
    ...(safeSettings.contact || {}),
  };

  return {
    ...safeSettings,
    layout_key: "restaurant",
    template_key: templateKey,
    selected_template_key: templateKey,
    organization: safeOrganization,
    page,
    sections: safeSections,
    builderMode: Boolean(builderMode),
    previewMode: Boolean(previewMode),
    restaurant_config: safeSettings.restaurant_config || safeSettings.template_config?.restaurant || safeSettings.templateConfig?.restaurant || {},
    social_links: safeSocialLinks,
    socialLinks: safeSocialLinks,
    contact: safeContact,
  };
};

export default function RestaurantLayout({
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
    RESTAURANT_DEFAULT_TEMPLATE;

  const safeTemplateKey = RESTAURANT_TEMPLATE_KEYS.includes(resolvedTemplateKey)
    ? resolvedTemplateKey
    : RESTAURANT_DEFAULT_TEMPLATE;

  const importer = getRestaurantTemplateImporter(safeTemplateKey);
  const RestaurantTemplate = useMemo(() => importer ? lazy(importer) : null, [importer]);

  const normalizedSettings = useMemo(
    () => normalizeRestaurantSettings({ settings, organization, page, sections, builderMode, previewMode, templateKey: safeTemplateKey }),
    [settings, organization, page, sections, builderMode, previewMode, safeTemplateKey],
  );

  if (!RestaurantTemplate) {
    return <div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Restaurant template could not be loaded.</div>;
  }

  return (
    <Suspense fallback={<div style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>Loading restaurant template...</div>}>
      <RestaurantTemplate
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
      </RestaurantTemplate>
    </Suspense>
  );
}
