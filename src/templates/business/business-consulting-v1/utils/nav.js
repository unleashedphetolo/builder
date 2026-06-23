export function normalizeSlug(slug = "/") {
  const raw = String(slug || "/")
    .trim()
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/site\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "");

  if (!raw || raw.toLowerCase() === "home") return "/";
  return `/${raw}`;
}

export function isExternalUrl(href = "") {
  const value = String(href || "");
  return value.startsWith("http") || value.startsWith("mailto:") || value.startsWith("tel:");
}

export function buildSiteLink(settings = {}, href = "/") {
  if (isExternalUrl(href)) return href;
  const cleanHref = normalizeSlug(href || "/");
  if (!settings?.site_id) return cleanHref;
  return cleanHref === "/" ? `/site/${settings.site_id}` : `/site/${settings.site_id}${cleanHref}`;
}

export function emitBusinessPreviewNavigation(href = "/") {
  const slug = normalizeSlug(href || "/");

  window.dispatchEvent(new CustomEvent("builder:navigate", { detail: slug }));
  window.dispatchEvent(new CustomEvent("site:navigate", { detail: slug }));

  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "builder:navigate", slug, detail: slug }, "*");
    window.parent.postMessage({ type: "site:navigate", slug, detail: slug }, "*");
    window.parent.postMessage({ type: "navigate", slug, detail: slug }, "*");
  }
}

export function normalizeNavItemsFromPages({ navItems = [], pages = [], location = "header" }) {
  const safeNav = Array.isArray(navItems)
    ? navItems
        .filter((item) => item && item.is_visible !== false && (item.location || "header") === location)
        .map((item) => ({
          label: item.label || item.title || "Page",
          href: item.href || item.path || item.slug || "/",
          position: item.position ?? 0,
        }))
    : [];

  if (safeNav.length) {
    return safeNav.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  }

  return (pages || [])
    .filter((page) => page && page.enabled !== false && (page.nav?.location || "header") === location)
    .sort((a, b) => (a.nav?.position ?? 0) - (b.nav?.position ?? 0))
    .map((page) => ({
      label: page.nav?.label || page.title || "Page",
      href: page.slug || "/",
      position: page.nav?.position ?? 0,
    }));
}
