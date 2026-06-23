export const defaultNavItems = [
  { label: "Home", href: "/", pageKey: "home" },
  { label: "About", href: "/about", pageKey: "about" },
  { label: "Services", href: "/services", pageKey: "services" },
  { label: "Projects", href: "/projects", pageKey: "projects" },
  { label: "Resume", href: "/resume", pageKey: "resume" },
  { label: "Contact", href: "/contact", pageKey: "contact" },
];

export function normalizeHref(href = "/") {
  const clean = String(href || "/").trim();
  if (!clean || clean === "home") return "/";
  if (clean.startsWith("http") || clean.startsWith("mailto:") || clean.startsWith("tel:")) return clean;
  return clean.startsWith("/") ? clean : `/${clean}`;
}

export function resolveNavItems(navItems = []) {
  const headerItems = Array.isArray(navItems)
    ? navItems.filter((item) => item && item.is_visible !== false && (!item.location || item.location === "header"))
    : [];

  if (!headerItems.length) return defaultNavItems;

  return headerItems.map((item) => ({
    label: item.label || item.title || "Link",
    href: normalizeHref(item.href || item.path || item.url || item.slug || "/"),
    pageKey: item.page_key || item.key,
  }));
}
