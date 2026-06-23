import { templateConfig } from "../template.config";
import { normalizeSlug } from "./nav";

export { normalizeSlug };

export function mergeSettings(settings = {}) {
  const defaults = templateConfig?.defaults || {};

  return {
    ...defaults,
    ...(settings || {}),
    social_links: {
      ...(defaults.social_links || {}),
      ...(settings?.social_links || {}),
    },
    social_display: {
      ...(defaults.social_display || {}),
      ...(settings?.social_display || {}),
    },
    features: {
      ...(defaults.features || {}),
      ...(settings?.features || {}),
    },
    media: {
      ...(defaults.media || {}),
      ...(settings?.media || {}),
    },
    hero_slides: Array.isArray(settings?.hero_slides)
      ? settings.hero_slides
      : Array.isArray(defaults.hero_slides)
        ? defaults.hero_slides
        : [],
    hero_slideshow_settings: {
      ...(defaults.hero_slideshow_settings || {}),
      ...(settings?.hero_slideshow_settings || {}),
    },
  };
}

export function getWindowSlug(siteId) {
  if (typeof window === "undefined") return "/";
  let pathname = window.location.pathname || "/";

  if (siteId && pathname.startsWith(`/site/${siteId}`)) {
    pathname = pathname.replace(`/site/${siteId}`, "") || "/";
  }

  return normalizeSlug(pathname);
}

export function resolveCurrentPage(page = {}, pages = [], settings = {}) {
  const slug = normalizeSlug(
    page?.slug ||
      page?.path ||
      page?.route ||
      page?.page_slug ||
      getWindowSlug(settings?.site_id),
  );

  return (
    (pages || []).find((item) => normalizeSlug(item.slug) === slug) ||
    (pages || []).find((item) => normalizeSlug(item.slug) === "/") ||
    { slug, title: page?.title || "Business Page", sections: [] }
  );
}
