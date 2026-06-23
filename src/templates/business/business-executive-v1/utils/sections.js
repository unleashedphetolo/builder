export function normalizeType(type = "") {
  return String(type || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
}

export function sectionContent(section = {}) {
  return section?.content && typeof section.content === "object" ? section.content : {};
}

function cleanSlug(value = "/") {
  const raw = String(value || "/")
    .trim()
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  if (!raw || raw.toLowerCase() === "home") return "/";
  return `/${raw}`;
}

function getSectionPageCandidates(section = {}) {
  return [
    section.page_slug,
    section.pageSlug,
    section.page_path,
    section.pagePath,
    section.page,
    section.slug,
  ].filter(Boolean);
}

function sectionExplicitlyBelongsToSlug(section = {}, slug = "/") {
  const candidates = getSectionPageCandidates(section);
  if (!candidates.length) return false;

  const targetSlug = cleanSlug(slug);

  return candidates.some((value) => cleanSlug(value) === targetSlug);
}

function sectionKey(section = {}) {
  return String(section.section_key || section.key || section.id || "").trim();
}

function sortSections(sections = []) {
  return [...sections].sort(
    (a, b) => (a.position ?? a.sort_order ?? 0) - (b.position ?? b.sort_order ?? 0),
  );
}

export function getSectionsForPage({ allSections = [], configPage, currentSlug = "/" }) {
  const runtimeSections = Array.isArray(allSections)
    ? allSections.filter((section) => section && section.visible !== false)
    : [];

  const configSections = Array.isArray(configPage?.sections)
    ? configPage.sections
    : [];

  const configKeys = new Set(configSections.map(sectionKey).filter(Boolean));

  const matchingRuntimeSections = runtimeSections.filter((section) =>
    sectionExplicitlyBelongsToSlug(section, currentSlug),
  );

  if (matchingRuntimeSections.length) {
    return sortSections(matchingRuntimeSections);
  }

  /*
    If the builder sends saved sections for the active inner page without a
    page_slug, keep them when their keys match that page's template sections.
    This preserves editing while preventing Home sections from appearing on
    About/Services/Portfolio/Insights/Contact.
  */
  const keyedRuntimeSections = runtimeSections.filter((section) => {
    const key = sectionKey(section);
    return key && configKeys.has(key);
  });

  if (keyedRuntimeSections.length) {
    return sortSections(keyedRuntimeSections);
  }

  /*
    If the builder sends untagged runtime sections, those normally belong to the
    active home preview. For inner pages, use the template page fallback sections
    so page links show full page-specific content instead of only changing title.
  */
  if (cleanSlug(currentSlug) === "/" && runtimeSections.length) {
    return sortSections(runtimeSections);
  }

  return configSections;
}
