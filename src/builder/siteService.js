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
  { eager: true }
);

// ---------- Helpers ----------

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
    features: defaults?.features || {},
    hero_slides: Array.isArray(defaults?.hero_slides)
      ? defaults.hero_slides
      : [],
  };
}

function mapDefaultsToSiteSettings(siteId, defaults = {}) {
  const safe = normalizeDefaults(defaults);

  return {
    site_id: siteId,

    site_name: safe.site_name || null,
    tagline: safe.tagline || null,
    motto: safe.motto || null,

    logo_url: safe.logo_url || null,
    favicon_url: safe.favicon_url || null,

    email: safe.email || null,
    phone: safe.phone || null,
    address_line1: safe.address_line1 || null,
    city: safe.city || null,
    province: safe.province || null,
    postal_code: safe.postal_code || null,
    country: safe.country || null,

    primary_color: safe.primary_color || "#1e40af",
    secondary_color: safe.secondary_color || "#0f172a",
    accent_color: safe.accent_color || "#f59e0b",
    font_family: safe.font_family || "Inter, sans-serif",

    social_links: safe.social_links,
    social_display: safe.social_display,
    topbar_links: safe.topbar_links,
    footer_links: safe.footer_links,
    footer_text: safe.footer_text || "© Your Website. All rights reserved.",

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

async function hideRowsByIds(table, ids = [], patch = {}) {
  if (!ids.length) return true;

  const { error } = await supabase.from(table).update(patch).in("id", ids);

  if (error) {
    console.error(`hideRowsByIds ${table} error:`, error);
    return false;
  }

  return true;
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
        .eq("id", pageId)
    )
  );

  await Promise.all(
    pageIds.map((pageId, index) =>
      supabase
        .from("site_nav_items")
        .update({ position: index })
        .eq("site_id", siteId)
        .eq("page_id", pageId)
    )
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
      "ensureSiteForOrg: no existing site and no template selected yet"
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
        `Template config not found for ${layoutKey}/${templateKey}`
      );
    }

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
          pagePatch.content = templatePage.content || {};
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
          index
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

    const activeNavIds = new Set();

    for (let index = 0; index < templatePages.length; index += 1) {
      const templatePage = templatePages[index];

      if (!templatePage?.nav) continue;

      const cleanSlug = normalizePageSlug(templatePage.slug || "/");
      const templatePageKey = getTemplatePageKey(templatePage);
      const activePage =
        activePagesByTemplateKey.get(templatePageKey) ||
        activePagesBySlug.get(cleanSlug);

      if (!activePage?.id) continue;

      const href = buildAbsoluteHref(cleanSlug);
      const location = templatePage.nav.location || "header";

      const matchedNav =
        (existingNavItems || []).find(
          (item) => item.page_id === activePage.id && item.location === location
        ) ||
        (existingNavItems || []).find(
          (item) => item.href === href && item.location === location
        );

      const navPatch = {
        site_id: siteId,
        location,
        label: templatePage.nav.label || templatePage.title,
        href,
        page_id: activePage.id,
        parent_id: null,
        position:
          templatePage.nav.position ?? templatePage.position ?? index,
        is_external: false,
        is_visible: templatePage.enabled !== false,
        meta: templatePage.nav.meta || {},
      };

      if (matchedNav?.id) {
        const { data: updatedNav, error: updateNavErr } = await supabase
          .from("site_nav_items")
          .update(navPatch)
          .eq("id", matchedNav.id)
          .select("*")
          .single();

        if (updateNavErr) throw updateNavErr;

        activeNavIds.add(updatedNav.id);
      } else {
        const { data: createdNav, error: createNavErr } = await supabase
          .from("site_nav_items")
          .insert(navPatch)
          .select("*")
          .single();

        if (createNavErr) throw createNavErr;

        activeNavIds.add(createdNav.id);
      }
    }

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
          .eq("is_visible", true)
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),

        supabase
          .from("site_nav_items")
          .select("*")
          .eq("site_id", siteId)
          .eq("is_visible", true)
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
        `Template config not found for ${layoutKey}/${templateKey}`
      );
    }

    const defaults = normalizeDefaults(config.defaults);
    const pages = Array.isArray(config.pages) ? config.pages : [];

    // 0) update site first
    const { error: siteUpdErr } = await supabase
      .from("sites")
      .update({
        layout_key: layoutKey,
        template_key: templateKey,
      })
      .eq("id", siteId);

    if (siteUpdErr) throw siteUpdErr;

    // 1) wipe dependent data in correct order
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

    // 2) upsert site settings from template defaults
    const settingsPayload = mapDefaultsToSiteSettings(siteId, defaults);

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

    // 3) create site_pages
    const enabledPages = pages.filter((p) => p?.enabled !== false);

    const pageRows = enabledPages.map((page, index) => ({
      site_id: siteId,
      slug: normalizePageSlug(page.slug),
      title: page.title,
      content: page.content || {},
      is_published: page.enabled !== false,
      is_visible: page.enabled !== false,
      sort_order:
        page.sort_order ?? page.position ?? page.nav?.position ?? index,
      template_page_key: getTemplatePageKey(page),
      seo: page.seo || {},
      layout_override: null,
    }));

    const { data: createdPages, error: pagesErr } = await supabase
      .from("site_pages")
      .insert(pageRows)
      .select("*");

    if (pagesErr) throw pagesErr;

    const pageBySlug = Object.fromEntries(
      createdPages.map((page) => [normalizePageSlug(page.slug), page])
    );

    // 4) create site_sections from template pages[].sections
    const sectionRows = enabledPages.flatMap((page) => {
      const dbPage = pageBySlug[normalizePageSlug(page.slug)];
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

    // 5) create nav items from page nav config
    const navRows = enabledPages
      .filter((page) => page?.nav)
      .map((page, index) => {
        const cleanSlug = normalizePageSlug(page.slug);
        const dbPage = pageBySlug[cleanSlug];

        return {
          site_id: siteId,
          location: page.nav.location || "header",
          label: page.nav.label || page.title,
          href: buildAbsoluteHref(cleanSlug),
          page_id: dbPage?.id || null,
          parent_id: null,
          position: page.nav.position ?? page.position ?? index,
          is_external: false,
          is_visible: page.enabled !== false,
          meta: page.nav.meta || {},
        };
      });

    if (navRows.length) {
      const { error: navErr } = await supabase
        .from("site_nav_items")
        .insert(navRows);

      if (navErr) throw navErr;
    }

    return { ok: true, config };
  } catch (e) {
    console.error("seedSiteFromTemplate failed", e);
    return { ok: false, error: e };
  }
}

// ---------- Reading ----------

export async function loadSitePages(siteId) {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("site_id", siteId)
    .eq("is_visible", true)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("loadSitePages error", error);
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

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("site_id", siteId)
    .maybeSingle();

  if (error) {
    console.error("loadSiteSettings error", error);
    return null;
  }

  return data || null;
}

export async function loadSiteNav(siteId) {
  if (!siteId) return [];

  const { data, error } = await supabase
    .from("site_nav_items")
    .select("*")
    .eq("site_id", siteId)
    .eq("is_visible", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("loadSiteNav error", error);
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
        .eq("id", s.id)
    )
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

  return data;
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