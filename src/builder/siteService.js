import { supabase } from "../supabase/client";

/**
 * Template auto-loader
 * ---------------------------------------------------------
 * Expected template files:
 *   src/templates/<layoutKey>/<templateKey>/template.config.js
 *   src/templates/<layoutKey>/<templateKey>/template.config.jsx
 */
const templateConfigs = import.meta.glob(
  "../templates/*/*/template.config.{js,jsx}",
  { eager: true },
);

// ---------- Helpers ----------

const TEMPLATE_PLACEHOLDERS = new Set([
  "school name",
  "your school",
  "your website",
  "website preview",
  "info@yourschool.co.za",
  "info@school.co.za",
  "+27 00 000 0000",
  "123 education st",
  "johannesburg",
  "gauteng",
  "0000",
  "south africa",
]);

function isUsefulValue(value) {
  if (value === null || value === undefined) return false;

  const clean = String(value).trim();
  if (!clean) return false;

  return !TEMPLATE_PLACEHOLDERS.has(clean.toLowerCase());
}

function pickFirstUseful(...values) {
  for (const value of values) {
    if (isUsefulValue(value)) return value;
  }

  return null;
}

function preferExistingOrOrg(existingValue, orgValue, fallbackValue = null) {
  if (isUsefulValue(existingValue)) return existingValue;
  if (isUsefulValue(orgValue)) return orgValue;
  return existingValue || fallbackValue || null;
}

function getOrgName(org = {}) {
  return pickFirstUseful(
    org.name,
    org.organization_name,
    org.school_name,
    org.company_name,
    org.title,
  );
}

function getOrgEmail(org = {}) {
  return pickFirstUseful(
    org.email,
    org.official_email,
    org.contact_email,
    org.admin_email,
  );
}

function getOrgPhone(org = {}) {
  return pickFirstUseful(
    org.phone,
    org.official_phone,
    org.contact_phone,
    org.telephone,
    org.mobile,
  );
}

function getOrgAddressLine1(org = {}) {
  return pickFirstUseful(
    org.address_line1,
    org.address,
    org.physical_address,
    org.street_address,
    org.location,
  );
}

function getOrgCity(org = {}) {
  return pickFirstUseful(org.city, org.town, org.municipality);
}

function getOrgProvince(org = {}) {
  return pickFirstUseful(org.province, org.state, org.region);
}

function getOrgPostalCode(org = {}) {
  return pickFirstUseful(org.postal_code, org.zip_code, org.postcode);
}

function getOrgCountry(org = {}) {
  return pickFirstUseful(org.country);
}

function applyOrganizationFallbackToSettings(settings = {}, organization = {}) {
  if (!settings) return settings;

  const orgName = getOrgName(organization);
  const orgEmail = getOrgEmail(organization);
  const orgPhone = getOrgPhone(organization);
  const orgAddress = getOrgAddressLine1(organization);
  const orgCity = getOrgCity(organization);
  const orgProvince = getOrgProvince(organization);
  const orgPostalCode = getOrgPostalCode(organization);
  const orgCountry = getOrgCountry(organization);

  return {
    ...settings,

    site_name: preferExistingOrOrg(settings.site_name, orgName, settings.site_name),
    name: preferExistingOrOrg(settings.name, orgName, settings.name),

    email: preferExistingOrOrg(settings.email, orgEmail, settings.email),
    phone: preferExistingOrOrg(settings.phone, orgPhone, settings.phone),

    address_line1: preferExistingOrOrg(
      settings.address_line1,
      orgAddress,
      settings.address_line1,
    ),

    city: preferExistingOrOrg(settings.city, orgCity, settings.city),

    province: preferExistingOrOrg(
      settings.province,
      orgProvince,
      settings.province,
    ),

    postal_code: preferExistingOrOrg(
      settings.postal_code,
      orgPostalCode,
      settings.postal_code,
    ),

    country: preferExistingOrOrg(settings.country, orgCountry, settings.country),

    footer_text:
      isUsefulValue(settings.footer_text) && settings.footer_text !== "© Your Website. All rights reserved."
        ? settings.footer_text
        : orgName
          ? `© ${orgName}. All rights reserved.`
          : settings.footer_text,
  };
}

async function getCurrentOrgId() {
  const { data: authData, error: authErr } = await supabase.auth.getUser();
  const user = authData?.user;

  if (authErr) {
    console.error("getCurrentOrgId auth error:", authErr);
    return null;
  }

  if (!user) {
    console.error("getCurrentOrgId: no logged in user");
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("getCurrentOrgId profile error:", error);
    return null;
  }

  return data?.organization_id || null;
}

async function getOrganizationById(organizationId) {
  if (!organizationId) return null;

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", organizationId)
    .maybeSingle();

  if (error) {
    console.error("getOrganizationById error:", error);
    return null;
  }

  return data || null;
}

async function getOrganizationForSite(siteId) {
  if (!siteId) return null;

  const { data: site, error } = await supabase
    .from("sites")
    .select("organization_id")
    .eq("id", siteId)
    .maybeSingle();

  if (error) {
    console.error("getOrganizationForSite site error:", error);
    return null;
  }

  return getOrganizationById(site?.organization_id || null);
}

function resolveTemplateConfig(layoutKey, templateKey) {
  const candidates = [
    `../templates/${layoutKey}/${templateKey}/template.config.js`,
    `../templates/${layoutKey}/${templateKey}/template.config.jsx`,
  ];

  for (const path of candidates) {
    if (templateConfigs[path]) {
      const mod = templateConfigs[path];
      return mod?.templateConfig || mod?.default || null;
    }
  }

  return null;
}

export function normalizePageSlug(slug = "/") {
  const raw = String(slug || "/").trim();

  const cleanRaw = raw
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  if (!cleanRaw || cleanRaw.toLowerCase() === "home") return "/";

  return `/${cleanRaw}`;
}

function buildAbsoluteHref(href = "") {
  if (!href) return "/";
  if (href.startsWith("http")) return href;

  return normalizePageSlug(href);
}

function normalizeDefaults(defaults = {}) {
  return {
    ...defaults,
    social_links: defaults?.social_links || {},
    social_display: defaults?.social_display || {},
    topbar_links: Array.isArray(defaults?.topbar_links)
      ? defaults.topbar_links
      : [],
    footer_links: Array.isArray(defaults?.footer_links)
      ? defaults.footer_links
      : [],
    features: {
      topbar: true,
      ...(defaults?.features || {}),
    },
    hero_slides: Array.isArray(defaults?.hero_slides)
      ? defaults.hero_slides
      : [],
  };
}

function mapDefaultsToSiteSettings(siteId, defaults = {}, organization = {}) {
  const safe = normalizeDefaults(defaults);

  const orgName = getOrgName(organization);
  const orgEmail = getOrgEmail(organization);
  const orgPhone = getOrgPhone(organization);
  const orgAddress = getOrgAddressLine1(organization);
  const orgCity = getOrgCity(organization);
  const orgProvince = getOrgProvince(organization);
  const orgPostalCode = getOrgPostalCode(organization);
  const orgCountry = getOrgCountry(organization);

  return {
    site_id: siteId,

    site_name: orgName || safe.site_name || null,
    tagline: safe.tagline || null,
    motto: safe.motto || null,

    logo_url: safe.logo_url || null,
    favicon_url: safe.favicon_url || null,

    email: orgEmail || safe.email || null,
    phone: orgPhone || safe.phone || null,
    address_line1: orgAddress || safe.address_line1 || null,
    city: orgCity || safe.city || null,
    province: orgProvince || safe.province || null,
    postal_code: orgPostalCode || safe.postal_code || null,
    country: orgCountry || safe.country || null,

    primary_color: safe.primary_color || "#1e40af",
    secondary_color: safe.secondary_color || "#0f172a",
    accent_color: safe.accent_color || "#f59e0b",
    font_family: safe.font_family || "Inter, sans-serif",

    social_links: safe.social_links,
    social_display: safe.social_display,
    topbar_links: safe.topbar_links,
    footer_links: safe.footer_links,
    footer_text: orgName
      ? `© ${orgName}. All rights reserved.`
      : safe.footer_text || "© Your Website. All rights reserved.",

    hero_slides: safe.hero_slides,
    hero_slides_overridden: false,
    features: safe.features,
  };
}

function buildDefaultSectionsForPage({ siteId, pageId, sections = [] }) {
  return sections.map((section, index) => ({
    site_id: siteId,
    page_id: pageId,
    type: section.type,
    content: section.content || {},
    position: index,
    visible: section.visible !== false,
    is_locked: section.is_locked === true,
    style: section.style || {},
    animation: section.animation || {},
    updated_by: null,
    revision: 1,
    library_id: null,
  }));
}

function getTemplatePageKey(page = {}) {
  const slug = normalizePageSlug(page.slug || "/");

  return (
    page.template_page_key ||
    page.key ||
    page.id ||
    page.page_key ||
    slug.replace(/^\/+/, "").replace(/\//g, "-") ||
    "home"
  );
}

function hasUsefulContent(content) {
  if (!content) return false;
  if (typeof content !== "object") return true;
  return Object.keys(content).length > 0;
}

function getReusablePageContent(existingPage, templatePage) {
  if (hasUsefulContent(existingPage?.content)) {
    return existingPage.content;
  }

  return templatePage?.content || {};
}

function getReusableSectionContent(existingSection, templateSection) {
  if (hasUsefulContent(existingSection?.content)) {
    return existingSection.content;
  }

  return templateSection?.content || {};
}

function getTemplateSectionKey(section = {}, fallbackIndex = 0) {
  return (
    section.section_key ||
    section.key ||
    section.id ||
    `${section.type || "section"}-${fallbackIndex}`
  );
}

function normalizeTemplateLink(link = {}, fallbackLocation = "header", index = 0) {
  return {
    label: link.label || link.title || `Link ${index + 1}`,
    href: buildAbsoluteHref(link.href || link.slug || "/"),
    location: link.location || fallbackLocation,
    position: link.position ?? index,
    enabled: link.enabled !== false,
    is_external:
      link.is_external === true || String(link.href || "").startsWith("http"),
    meta: link.meta || {},
  };
}

function findPageByHref(pagesBySlug, href = "") {
  if (!href || String(href).startsWith("http")) return null;
  return pagesBySlug.get(normalizePageSlug(href)) || null;
}

function buildNavPatchFromLink({
  siteId,
  link,
  location,
  index,
  page = null,
}) {
  const safeLink = normalizeTemplateLink(link, location, index);
  const href = buildAbsoluteHref(safeLink.href);

  return {
    site_id: siteId,
    location: safeLink.location || location,
    label: safeLink.label,
    href,
    page_id: page?.id || null,
    parent_id: null,
    position: safeLink.position ?? index,
    is_external: safeLink.is_external || String(href).startsWith("http"),
    is_visible: safeLink.enabled !== false,
    meta: safeLink.meta || {},
  };
}

async function hideRowsByIds(table, ids = [], patch = {}) {
  if (!ids.length) return true;

  const { error } = await supabase.from(table).update(patch).in("id", ids);

  if (error) {
    console.error(`hideRowsByIds ${table} error:`, error);
    return false;
  }

  return true;
}

async function upsertNavItem({ existingNavItems = [], navPatch }) {
  if (!navPatch?.site_id || !navPatch?.location || !navPatch?.href) {
    return null;
  }

  const matchedNav =
    existingNavItems.find(
      (item) =>
        navPatch.page_id &&
        item.page_id === navPatch.page_id &&
        item.location === navPatch.location,
    ) ||
    existingNavItems.find(
      (item) =>
        item.href === navPatch.href && item.location === navPatch.location,
    ) ||
    existingNavItems.find(
      (item) =>
        item.label === navPatch.label &&
        item.location === navPatch.location &&
        item.href === navPatch.href,
    );

  if (matchedNav?.id) {
    const { data, error } = await supabase
      .from("site_nav_items")
      .update(navPatch)
      .eq("id", matchedNav.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("site_nav_items")
    .insert(navPatch)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

async function syncTemplateNavItems({
  siteId,
  templatePages = [],
  defaults = {},
  existingNavItems = [],
  activePagesByTemplateKey,
  activePagesBySlug,
}) {
  const activeNavIds = new Set();

  /*
    Recommended clean builder rule:
    Every template page must have a matching site_nav_items row.

    This lets PagesPanel only show:
    - Topbar
    - Pages

    Then:
    Page Off -> site_pages off + all connected site_nav_items off
    Page On  -> site_pages on + all connected site_nav_items on
  */
  for (let index = 0; index < templatePages.length; index += 1) {
    const templatePage = templatePages[index];

    const cleanSlug = normalizePageSlug(templatePage.slug || "/");
    const templatePageKey = getTemplatePageKey(templatePage);
    const activePage =
      activePagesByTemplateKey.get(templatePageKey) ||
      activePagesBySlug.get(cleanSlug);

    if (!activePage?.id) continue;

    const nav = templatePage.nav || {};

    const navPatch = {
      site_id: siteId,
      location: nav.location || "header",
      label: nav.label || templatePage.title || "Untitled page",
      href: buildAbsoluteHref(cleanSlug),
      page_id: activePage.id,
      parent_id: null,
      position: nav.position ?? templatePage.position ?? index,
      is_external: false,
      is_visible: templatePage.enabled !== false,
      meta: nav.meta || {
        template_page_key: templatePageKey,
        auto_generated: true,
      },
    };

    const savedNav = await upsertNavItem({
      existingNavItems,
      navPatch,
    });

    if (savedNav?.id) {
      activeNavIds.add(savedNav.id);
      existingNavItems.push(savedNav);
    }
  }

  const linkGroups = [
    {
      location: "topbar",
      links: Array.isArray(defaults.topbar_links) ? defaults.topbar_links : [],
    },
    {
      location: "footer",
      links: Array.isArray(defaults.footer_links) ? defaults.footer_links : [],
    },
  ];

  for (const group of linkGroups) {
    for (let index = 0; index < group.links.length; index += 1) {
      const link = normalizeTemplateLink(
        group.links[index],
        group.location,
        index,
      );

      const page = findPageByHref(activePagesBySlug, link.href);

      const navPatch = buildNavPatchFromLink({
        siteId,
        link,
        location: group.location,
        index,
        page,
      });

      const nav = await upsertNavItem({ existingNavItems, navPatch });

      if (nav?.id) {
        activeNavIds.add(nav.id);
        existingNavItems.push(nav);
      }
    }
  }

  return activeNavIds;
}

export async function updateLinkedNavItemForPage({
  siteId,
  pageId,
  patch = {},
  page = null,
}) {
  if (!pageId) return null;

  const navPatch = {};

  if (Object.prototype.hasOwnProperty.call(patch, "title")) {
    navPatch.label = patch.title || page?.title || "Untitled page";
  }

  if (Object.prototype.hasOwnProperty.call(patch, "slug")) {
    navPatch.href = buildAbsoluteHref(patch.slug || page?.slug || "/");
  }

  if (
    Object.prototype.hasOwnProperty.call(patch, "is_visible") ||
    Object.prototype.hasOwnProperty.call(patch, "is_published")
  ) {
    const nextVisible =
      patch.is_visible !== undefined
        ? patch.is_visible
        : patch.is_published !== undefined
          ? patch.is_published
          : true;

    navPatch.is_visible = nextVisible !== false;
  }

  if (!Object.keys(navPatch).length) return null;

  let query = supabase
    .from("site_nav_items")
    .update(navPatch)
    .eq("page_id", pageId);

  if (siteId) {
    query = query.eq("site_id", siteId);
  }

  const { data, error } = await query.select("*");

  if (error) {
    console.error("updateLinkedNavItemForPage error", error);
    return null;
  }

  return data || [];
}

export async function updatePageVisibilityEverywhere({
  siteId,
  pageId,
  visible,
}) {
  if (!siteId || !pageId) return null;

  const nextVisible = visible !== false;

  const { data: updatedPage, error: pageErr } = await supabase
    .from("site_pages")
    .update({
      is_visible: nextVisible,
      is_published: nextVisible,
    })
    .eq("site_id", siteId)
    .eq("id", pageId)
    .select("*")
    .single();

  if (pageErr) {
    console.error("updatePageVisibilityEverywhere page error:", pageErr);
    return null;
  }

  const { data: updatedNavItems, error: navErr } = await supabase
    .from("site_nav_items")
    .update({
      is_visible: nextVisible,
    })
    .eq("site_id", siteId)
    .eq("page_id", pageId)
    .select("*");

  if (navErr) {
    console.error("updatePageVisibilityEverywhere nav error:", navErr);
    return {
      page: updatedPage,
      navItems: [],
    };
  }

  return {
    page: updatedPage,
    navItems: updatedNavItems || [],
  };
}

export async function updateNavItemVisibility({ siteId, navItemId, visible }) {
  if (!siteId || !navItemId) return null;

  const { data, error } = await supabase
    .from("site_nav_items")
    .update({ is_visible: visible !== false })
    .eq("site_id", siteId)
    .eq("id", navItemId)
    .select("*")
    .single();

  if (error) {
    console.error("updateNavItemVisibility error:", error);
    return null;
  }

  return data;
}

export async function updateTopbarVisibility({ siteId, visible }) {
  if (!siteId) return null;

  const currentSettings = await loadSiteSettings(siteId);
  const currentFeatures = currentSettings?.features || {};

  const nextFeatures = {
    ...currentFeatures,
    topbar: visible !== false,
  };

  const updated = await updateSiteSettings(siteId, {
    features: nextFeatures,
  });

  return updated;
}

export async function updatePageSortOrder(args, maybePageIds) {
  const siteId = typeof args === "object" ? args?.siteId : args;
  const pageIds = Array.isArray(args)
    ? args
    : Array.isArray(maybePageIds)
      ? maybePageIds
      : Array.isArray(args?.pageIds)
        ? args.pageIds
        : [];

  if (!siteId || !pageIds.length) return false;

  await Promise.all(
    pageIds.map((pageId, index) =>
      supabase
        .from("site_pages")
        .update({ sort_order: index })
        .eq("site_id", siteId)
        .eq("id", pageId),
    ),
  );

  await Promise.all(
    pageIds.map((pageId, index) =>
      supabase
        .from("site_nav_items")
        .update({ position: index })
        .eq("site_id", siteId)
        .eq("page_id", pageId),
    ),
  );

  return true;
}

export async function updateSitePage(pageId, patch) {
  if (!pageId) return null;

  const safePatch = { ...(patch || {}) };

  if (Object.prototype.hasOwnProperty.call(safePatch, "slug")) {
    safePatch.slug = normalizePageSlug(safePatch.slug);
  }

  const { data, error } = await supabase
    .from("site_pages")
    .update(safePatch)
    .eq("id", pageId)
    .select("*")
    .single();

  if (error) {
    console.error("updateSitePage error", error);
    return null;
  }

  await updateLinkedNavItemForPage({
    siteId: data?.site_id,
    pageId,
    patch: safePatch,
    page: data,
  });

  return data;
}

export async function updatePageContentField({ pageId, field, value, current }) {
  if (!pageId || !field) return null;

  const nextContent = {
    ...(current?.content || {}),
    [field]: value,
  };

  const { data, error } = await supabase
    .from("site_pages")
    .update({ content: nextContent })
    .eq("id", pageId)
    .select("*")
    .single();

  if (error) {
    console.error("updatePageContentField error", error);
    return null;
  }

  return data;
}

// ---------- Main site functions ----------

export async function ensureSiteForOrg({ layoutKey, templateKey } = {}) {
  const orgId = await getCurrentOrgId();

  if (!orgId) {
    console.error("ensureSiteForOrg: no organization_id found for current user");
    return null;
  }

  const safeLayoutKey = layoutKey || null;
  const safeTemplateKey = templateKey || null;

  const { data: existing, error: exErr } = await supabase
    .from("sites")
    .select("*")
    .eq("organization_id", orgId)
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (exErr) {
    console.error("ensureSiteForOrg select error:", exErr);
    return null;
  }

  if (existing) {
    if (
      safeLayoutKey &&
      safeTemplateKey &&
      (existing.template_key !== safeTemplateKey ||
        existing.layout_key !== safeLayoutKey)
    ) {
      const { data: patched, error: patchErr } = await supabase
        .from("sites")
        .update({
          layout_key: safeLayoutKey,
          template_key: safeTemplateKey,
        })
        .eq("id", existing.id)
        .select("*")
        .single();

      if (patchErr) {
        console.error("ensureSiteForOrg patch existing error:", patchErr);
        return existing;
      }

      return patched;
    }

    return existing;
  }

  if (!safeLayoutKey || !safeTemplateKey) {
    console.error(
      "ensureSiteForOrg: no existing site and no template selected yet",
    );
    return null;
  }

  const payload = {
    organization_id: orgId,
    layout_key: safeLayoutKey,
    template_key: safeTemplateKey,
    is_published: false,
    slug: "home",
  };

  const { data: created, error } = await supabase
    .from("sites")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    console.error("ensureSiteForOrg insert error:", error);
    return null;
  }

  return created;
}

export async function updateSiteTemplateOnly({ siteId, layoutKey, templateKey }) {
  if (!siteId || !layoutKey || !templateKey) return null;

  const { data, error } = await supabase
    .from("sites")
    .update({
      layout_key: layoutKey,
      template_key: templateKey,
    })
    .eq("id", siteId)
    .select("*")
    .single();

  if (error) {
    console.error("updateSiteTemplateOnly error:", error);
    return null;
  }

  return data;
}

export async function syncSitePagesForTemplate({
  siteId,
  layoutKey,
  templateKey,
}) {
  try {
    if (!siteId || !layoutKey || !templateKey) {
      throw new Error("Missing siteId, layoutKey or templateKey.");
    }

    const config = resolveTemplateConfig(layoutKey, templateKey);

    if (!config) {
      throw new Error(
        `Template config not found for ${layoutKey}/${templateKey}`,
      );
    }

    const defaults = normalizeDefaults(config.defaults);
    const templatePages = Array.isArray(config.pages)
      ? config.pages.filter((page) => page?.enabled !== false)
      : [];

    if (!templatePages.length) {
      return {
        ok: true,
        config,
        pages: [],
        navItems: [],
      };
    }

    const [
      { data: existingPages, error: pagesErr },
      { data: existingSections, error: sectionsErr },
      { data: existingNavItems, error: navErr },
    ] = await Promise.all([
      supabase.from("site_pages").select("*").eq("site_id", siteId),
      supabase.from("site_sections").select("*").eq("site_id", siteId),
      supabase.from("site_nav_items").select("*").eq("site_id", siteId),
    ]);

    if (pagesErr) throw pagesErr;
    if (sectionsErr) throw sectionsErr;
    if (navErr) throw navErr;

    const pagesBySlug = new Map();
    const pagesByTemplateKey = new Map();

    (existingPages || []).forEach((page) => {
      pagesBySlug.set(normalizePageSlug(page.slug || "/"), page);

      if (page.template_page_key) {
        pagesByTemplateKey.set(page.template_page_key, page);
      }
    });

    const activePageIds = new Set();
    const activePagesByTemplateKey = new Map();
    const activePagesBySlug = new Map();

    for (const templatePage of templatePages) {
      const cleanSlug = normalizePageSlug(templatePage.slug || "/");
      const templatePageKey = getTemplatePageKey(templatePage);
      const sortOrder =
        templatePage.sort_order ??
        templatePage.position ??
        templatePage.nav?.position ??
        templatePages.indexOf(templatePage);

      const matchedPage =
        pagesByTemplateKey.get(templatePageKey) || pagesBySlug.get(cleanSlug);

      if (matchedPage?.id) {
        const pagePatch = {
          slug: cleanSlug,
          title: templatePage.title || matchedPage.title || "Untitled page",
          is_published: true,
          is_visible: true,
          sort_order: sortOrder,
          template_page_key: templatePageKey,
          seo: templatePage.seo || matchedPage.seo || {},
          layout_override: null,
        };

        if (!hasUsefulContent(matchedPage.content)) {
          pagePatch.content = getReusablePageContent(matchedPage, templatePage);
        }

        const { data: updatedPage, error: updatePageErr } = await supabase
          .from("site_pages")
          .update(pagePatch)
          .eq("id", matchedPage.id)
          .select("*")
          .single();

        if (updatePageErr) throw updatePageErr;

        activePageIds.add(updatedPage.id);
        activePagesByTemplateKey.set(templatePageKey, updatedPage);
        activePagesBySlug.set(cleanSlug, updatedPage);
        pagesBySlug.set(cleanSlug, updatedPage);
        pagesByTemplateKey.set(templatePageKey, updatedPage);
      } else {
        const pagePayload = {
          site_id: siteId,
          slug: cleanSlug,
          title: templatePage.title || "Untitled page",
          content: templatePage.content || {},
          is_published: true,
          is_visible: true,
          sort_order: sortOrder,
          template_page_key: templatePageKey,
          seo: templatePage.seo || {},
          layout_override: null,
        };

        const { data: createdPage, error: createPageErr } = await supabase
          .from("site_pages")
          .insert(pagePayload)
          .select("*")
          .single();

        if (createPageErr) throw createPageErr;

        activePageIds.add(createdPage.id);
        activePagesByTemplateKey.set(templatePageKey, createdPage);
        activePagesBySlug.set(cleanSlug, createdPage);
        pagesBySlug.set(cleanSlug, createdPage);
        pagesByTemplateKey.set(templatePageKey, createdPage);
      }
    }

    const oldPageIdsToHide = (existingPages || [])
      .filter((page) => !activePageIds.has(page.id))
      .map((page) => page.id);

    await hideRowsByIds("site_pages", oldPageIdsToHide, {
      is_visible: false,
      is_published: false,
    });

    const sectionsByPageId = new Map();

    (existingSections || []).forEach((section) => {
      if (!sectionsByPageId.has(section.page_id)) {
        sectionsByPageId.set(section.page_id, []);
      }

      sectionsByPageId.get(section.page_id).push(section);
    });

    for (const templatePage of templatePages) {
      const templatePageKey = getTemplatePageKey(templatePage);
      const activePage = activePagesByTemplateKey.get(templatePageKey);

      if (!activePage?.id) continue;

      const templateSections = Array.isArray(templatePage.sections)
        ? templatePage.sections
        : [];

      const existingForPage = sectionsByPageId.get(activePage.id) || [];
      const usedSectionIds = new Set();

      for (let index = 0; index < templateSections.length; index += 1) {
        const templateSection = templateSections[index];
        const templateSectionKey = getTemplateSectionKey(
          templateSection,
          index,
        );

        const matchedSection = existingForPage.find((section) => {
          if (usedSectionIds.has(section.id)) return false;

          const existingKey = getTemplateSectionKey(section, index);

          return (
            existingKey === templateSectionKey ||
            section.type === templateSection.type
          );
        });

        if (matchedSection?.id) {
          const sectionPatch = {
            type: templateSection.type,
            position: index,
            visible: templateSection.visible !== false,
            is_locked: templateSection.is_locked === true,
            style: templateSection.style || matchedSection.style || {},
            animation:
              templateSection.animation || matchedSection.animation || {},
            revision: (matchedSection.revision || 1) + 1,
          };

          if (!hasUsefulContent(matchedSection.content)) {
            sectionPatch.content = templateSection.content || {};
          }

          const { error: updateSectionErr } = await supabase
            .from("site_sections")
            .update(sectionPatch)
            .eq("id", matchedSection.id);

          if (updateSectionErr) throw updateSectionErr;

          usedSectionIds.add(matchedSection.id);
        } else {
          const sectionPayload = {
            site_id: siteId,
            page_id: activePage.id,
            type: templateSection.type,
            content: getReusableSectionContent(null, templateSection),
            position: index,
            visible: templateSection.visible !== false,
            is_locked: templateSection.is_locked === true,
            style: templateSection.style || {},
            animation: templateSection.animation || {},
            updated_by: null,
            revision: 1,
            library_id: null,
          };

          const { error: insertSectionErr } = await supabase
            .from("site_sections")
            .insert(sectionPayload);

          if (insertSectionErr) throw insertSectionErr;
        }
      }

      const sectionsToHide = existingForPage
        .filter((section) => !usedSectionIds.has(section.id))
        .map((section) => section.id);

      await hideRowsByIds("site_sections", sectionsToHide, {
        visible: false,
      });
    }

    const activeNavIds = await syncTemplateNavItems({
      siteId,
      templatePages,
      defaults,
      existingNavItems: [...(existingNavItems || [])],
      activePagesByTemplateKey,
      activePagesBySlug,
    });

    const oldNavIdsToHide = (existingNavItems || [])
      .filter((item) => !activeNavIds.has(item.id))
      .map((item) => item.id);

    await hideRowsByIds("site_nav_items", oldNavIdsToHide, {
      is_visible: false,
    });

    const [{ data: syncedPages, error: syncedPagesErr }, { data: syncedNav }] =
      await Promise.all([
        supabase
          .from("site_pages")
          .select("*")
          .eq("site_id", siteId)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),

        supabase
          .from("site_nav_items")
          .select("*")
          .eq("site_id", siteId)
          .order("location", { ascending: true })
          .order("position", { ascending: true }),
      ]);

    if (syncedPagesErr) throw syncedPagesErr;

    return {
      ok: true,
      config,
      pages: syncedPages || [],
      navItems: syncedNav || [],
    };
  } catch (e) {
    console.error("syncSitePagesForTemplate failed", e);
    return {
      ok: false,
      error: e,
      pages: [],
      navItems: [],
    };
  }
}

export async function seedSiteFromTemplate({ siteId, layoutKey, templateKey }) {
  try {
    const config = resolveTemplateConfig(layoutKey, templateKey);

    if (!config) {
      throw new Error(
        `Template config not found for ${layoutKey}/${templateKey}`,
      );
    }

    const defaults = normalizeDefaults(config.defaults);
    const pages = Array.isArray(config.pages) ? config.pages : [];
    const organization = await getOrganizationForSite(siteId);

    const { error: siteUpdErr } = await supabase
      .from("sites")
      .update({
        layout_key: layoutKey,
        template_key: templateKey,
      })
      .eq("id", siteId);

    if (siteUpdErr) throw siteUpdErr;

    const { error: delNavErr } = await supabase
      .from("site_nav_items")
      .delete()
      .eq("site_id", siteId);
    if (delNavErr) throw delNavErr;

    const { error: delSecErr } = await supabase
      .from("site_sections")
      .delete()
      .eq("site_id", siteId);
    if (delSecErr) throw delSecErr;

    const { error: delPagesErr } = await supabase
      .from("site_pages")
      .delete()
      .eq("site_id", siteId);
    if (delPagesErr) throw delPagesErr;

    const settingsPayload = mapDefaultsToSiteSettings(
      siteId,
      defaults,
      organization,
    );

    const { data: existingSettings, error: stSelErr } = await supabase
      .from("site_settings")
      .select("id")
      .eq("site_id", siteId)
      .maybeSingle();

    if (stSelErr) throw stSelErr;

    if (existingSettings?.id) {
      const { error: stUpdErr } = await supabase
        .from("site_settings")
        .update(settingsPayload)
        .eq("site_id", siteId);

      if (stUpdErr) throw stUpdErr;
    } else {
      const { error: stInsErr } = await supabase
        .from("site_settings")
        .insert(settingsPayload);

      if (stInsErr) throw stInsErr;
    }

    const enabledPages = pages.filter((p) => p?.enabled !== false);

    const pageRows = enabledPages.map((page, index) => ({
      site_id: siteId,
      slug: normalizePageSlug(page.slug),
      title: page.title,
      content: page.content || {},
      is_published: page.enabled !== false,
      is_visible: page.enabled !== false,
      sort_order: page.sort_order ?? page.position ?? page.nav?.position ?? index,
      template_page_key: getTemplatePageKey(page),
      seo: page.seo || {},
      layout_override: null,
    }));

    const { data: createdPages, error: pagesErr } = await supabase
      .from("site_pages")
      .insert(pageRows)
      .select("*");

    if (pagesErr) throw pagesErr;

    const pageBySlug = new Map(
      createdPages.map((page) => [normalizePageSlug(page.slug), page]),
    );

    const pageByTemplateKey = new Map(
      createdPages.map((page) => [page.template_page_key, page]),
    );

    const sectionRows = enabledPages.flatMap((page) => {
      const dbPage = pageBySlug.get(normalizePageSlug(page.slug));
      if (!dbPage) return [];
      return buildDefaultSectionsForPage({
        siteId,
        pageId: dbPage.id,
        sections: Array.isArray(page.sections) ? page.sections : [],
      });
    });

    if (sectionRows.length) {
      const { error: secInsErr } = await supabase
        .from("site_sections")
        .insert(sectionRows);

      if (secInsErr) throw secInsErr;
    }

    const existingNavItems = [];
    await syncTemplateNavItems({
      siteId,
      templatePages: enabledPages,
      defaults,
      existingNavItems,
      activePagesByTemplateKey: pageByTemplateKey,
      activePagesBySlug: pageBySlug,
    });

    return { ok: true, config };
  } catch (e) {
    console.error("seedSiteFromTemplate failed", e);
    return { ok: false, error: e };
  }
}

// ---------- Reading ----------

// Builder use: loads all pages, including Off pages.
// Public visibility is handled in SitePage.jsx.
export async function loadSitePages(siteId) {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("site_id", siteId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("loadSitePages error", error);
    return [];
  }

  return data || [];
}

// Optional public helper if you later want visible-only pages from the service.
export async function loadVisibleSitePages(siteId) {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("site_id", siteId)
    .neq("is_visible", false)
    .neq("is_published", false)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("loadVisibleSitePages error", error);
    return [];
  }

  return data || [];
}

export async function loadPageSections({ siteId, pageId }) {
  const { data, error } = await supabase
    .from("site_sections")
    .select("*")
    .eq("site_id", siteId)
    .eq("page_id", pageId)
    .eq("visible", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("loadPageSections error", error);
    return [];
  }

  return data || [];
}

export async function loadSiteSettings(siteId) {
  if (!siteId) return null;

  const [{ data, error }, organization] = await Promise.all([
    supabase
      .from("site_settings")
      .select("*")
      .eq("site_id", siteId)
      .maybeSingle(),
    getOrganizationForSite(siteId),
  ]);

  if (error) {
    console.error("loadSiteSettings error", error);
    return null;
  }

  return applyOrganizationFallbackToSettings(data || null, organization || {});
}

// Builder use: loads all nav items, including Off links.
// Navbar/Topbar/Footer should filter is_visible when rendering.
export async function loadSiteNav(siteId) {
  if (!siteId) return [];

  const { data, error } = await supabase
    .from("site_nav_items")
    .select("*")
    .eq("site_id", siteId)
    .order("location", { ascending: true })
    .order("position", { ascending: true });

  if (error) {
    console.error("loadSiteNav error", error);
    return [];
  }

  return data || [];
}

// Optional public helper if you later want visible-only nav from the service.
export async function loadVisibleSiteNav(siteId) {
  if (!siteId) return [];

  const { data, error } = await supabase
    .from("site_nav_items")
    .select("*")
    .eq("site_id", siteId)
    .neq("is_visible", false)
    .order("location", { ascending: true })
    .order("position", { ascending: true });

  if (error) {
    console.error("loadVisibleSiteNav error", error);
    return [];
  }

  return data || [];
}

// ---------- Section editing ----------

export async function persistSectionOrder(updatedSections) {
  await Promise.all(
    updatedSections.map((s) =>
      supabase
        .from("site_sections")
        .update({ position: s.position })
        .eq("id", s.id),
    ),
  );
}

export async function addSectionToPage({ siteId, pageId, type, position }) {
  const section = {
    site_id: siteId,
    page_id: pageId,
    type,
    content: defaultSectionContent(type),
    position,
    visible: true,
    is_locked: false,
    style: {},
    animation: {},
    updated_by: null,
    revision: 1,
    library_id: null,
  };

  const { data, error } = await supabase
    .from("site_sections")
    .insert(section)
    .select("*")
    .single();

  if (error) {
    console.error("addSectionToPage error", error);
    return null;
  }

  return data;
}

export async function updateSectionField({ id, field, value, current }) {
  const [root, key] = field.split(".");
  if (!key) return null;

  const next = {
    ...current,
    [root]: {
      ...(current?.[root] || {}),
      [key]: value,
    },
  };

  const payload = {
    [root]: next[root],
  };

  const { data, error } = await supabase
    .from("site_sections")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("updateSectionField error", error);
    return null;
  }

  return data;
}

export async function deleteSectionById(id) {
  const { error } = await supabase
    .from("site_sections")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteSectionById error", error);
  }
}

// ---------- Settings editing ----------

export async function updateSiteSettings(siteId, patch) {
  if (!siteId) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .update(patch)
    .eq("site_id", siteId)
    .select("*")
    .single();

  if (error) {
    console.error("updateSiteSettings error", error);
    return null;
  }

  const organization = await getOrganizationForSite(siteId);
  return applyOrganizationFallbackToSettings(data, organization || {});
}

// ---------- Defaults for manually added sections ----------

function defaultSectionContent(type) {
  const map = {
    hero: {
      title: "Hero Title",
      subtitle: "Hero subtitle",
      image: "",
      primaryText: "Learn More",
      primaryHref: "#",
      secondaryText: "Contact",
      secondaryHref: "#",
    },
    about: {
      title: "About",
      subtitle: "Tell your story",
      body: "Add your content here.",
    },
    gallery: {
      title: "Gallery",
      subtitle: "Add your images",
      images: ["", "", "", ""],
    },
    contact: {
      title: "Contact",
      subtitle: "Email / phone / address",
      email: "",
      phone: "",
      address: "",
    },
    cta: {
      title: "Call to Action",
      subtitle: "Encourage action",
    },
    services: {
      title: "Services",
      subtitle: "What you offer",
    },
    pricing: {
      title: "Pricing",
      subtitle: "Your plans",
    },
    projects: {
      title: "Projects",
      subtitle: "Your work",
    },
    resume: {
      title: "Resume",
      subtitle: "Experience",
    },
    announcements: {
      title: "Announcements",
      subtitle: "Latest updates",
      items: [],
    },
    "quick-links": {
      title: "Quick Links",
      subtitle: "Useful links",
      items: [],
    },
    featured: {
      title: "Featured",
      subtitle: "Highlights",
      items: [],
    },
    staff: {
      title: "Staff Members",
      subtitle: "Meet our team",
    },
    governance: {
      title: "Governance",
      subtitle: "Leadership",
    },
    facilities: {
      title: "Facilities",
      subtitle: "Our campus",
    },
    activities: {
      title: "Activities",
      subtitle: "School life",
    },
    resources: {
      title: "Resources",
      subtitle: "Downloads and support",
    },
    admissions: {
      title: "Admissions",
      subtitle: "How to apply",
    },
    news: {
      title: "News",
      subtitle: "Latest updates",
    },
    notices: {
      title: "Notices",
      subtitle: "Important notices",
    },
    events: {
      title: "Events",
      subtitle: "Upcoming events",
    },
    calendar: {
      title: "Calendar",
      subtitle: "Important dates",
    },
    attendance: {
      title: "Attendance Policy",
      subtitle: "Attendance expectations",
    },
    bulletin: {
      title: "Student Daily Bulletin",
      subtitle: "Daily updates",
    },
    "digital-library": {
      title: "Digital Library",
      subtitle: "Online resources",
    },
    robotics: {
      title: "Robotics Club",
      subtitle: "Technology and innovation",
    },
  };

  return map[type] || { title: "Section", subtitle: "Edit content" };
}