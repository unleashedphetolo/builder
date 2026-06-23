import { templateSocialDisplay, templateSocialLinks } from "../assets/template.assets";

export const DEFAULT_SOCIAL_ORDER = [
  "facebook",
  "instagram",
  "x",
  "youtube",
  "tiktok",
  "linkedin",
  "whatsapp",
  "threads",
  "telegram",
  "snapchat",
  "pinterest",
  "discord",
  "github",
  "behance",
  "dribbble",
  "medium",
  "reddit",
  "twitch",
  "spotify",
  "website",
  "email",
  "phone",
];

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function uniqueOrder(value) {
  const savedOrder = Array.isArray(value)
    ? value.filter(
        (platform, index, list) =>
          typeof platform === "string" &&
          platform.trim() &&
          list.indexOf(platform) === index,
      )
    : [];

  const missingDefaults = DEFAULT_SOCIAL_ORDER.filter(
    (platform) => !savedOrder.includes(platform),
  );

  return [...savedOrder, ...missingDefaults];
}

export function getSocialEntry(socialLinks = {}, key = "") {
  const defaults = templateSocialLinks?.[key] || {};
  const raw = socialLinks?.[key];

  if (isObject(raw)) {
    return {
      ...defaults,
      ...raw,
      url: raw.url !== undefined ? raw.url : defaults.url || "",
      enabled: raw.enabled !== undefined ? raw.enabled : defaults.enabled === true,
    };
  }

  if (typeof raw === "string") {
    return { ...defaults, url: raw || defaults.url || "", enabled: Boolean(raw) || defaults.enabled === true };
  }

  return { ...defaults, url: defaults.url || "", enabled: defaults.enabled === true };
}

export function getVisibleSocialItems(settings = {}) {
  const display = {
    ...(templateSocialDisplay || {}),
    ...(settings.social_display || {}),
  };
  const links = {
    ...(templateSocialLinks || {}),
    ...(settings.social_links || {}),
  };
  const order = uniqueOrder(display.order);

  return order
    .map((key) => {
      const entry = getSocialEntry(links, key);
      const href = entry.url || "#";
      const enabled = entry.enabled === true;
      return { key, href, enabled, label: entry.label || key };
    })
    .filter((item) => item.enabled);
}
