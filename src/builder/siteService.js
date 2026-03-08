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

function buildAbsoluteHref(href = "") {
  if (!href) return "/";
  if (href.startsWith("http")) return href;
  return href.startsWith("/") ? href : `/${href}`;
}

function normalizeDefaults(defaults = {}) {
  return {
    ...defaults,
    social_links: defaults?.social_links || {},
    social_display: defaults?.social_display || {},
    topbar_links: Array.isArray(defaults?.topbar_links) ? defaults.topbar_links : [],
    footer_links: Array.isArray(defaults?.footer_links) ? defaults.footer_links : [],
    features: defaults?.features || {},
    hero_slides: Array.isArray(defaults?.hero_slides) ? defaults.hero_slides : [],
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

export async function updateSitePage(pageId, patch) {
  if (!pageId) return null;

  const { data, error } = await supabase
    .from("site_pages")
    .update(patch)
    .eq("id", pageId)
    .select("*")
    .single();

  if (error) {
    console.error("updateSitePage error", error);
    return null;
  }

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

export async function ensureSiteForOrg({ layoutKey, templateKey }) {
  const orgId = await getCurrentOrgId();

  if (!orgId) {
    console.error("ensureSiteForOrg: no organization_id found for current user");
    return null;
  }

  const safeLayoutKey = layoutKey || "school";
  const safeTemplateKey =
    templateKey ||
    (safeLayoutKey === "business"
      ? "business-executive-v1"
      : safeLayoutKey === "portfolio"
      ? "portfolio-clean-v1"
      : "school-institutional-v1");

  const { data: existing, error: exErr } = await supabase
    .from("sites")
    .select("*")
    .eq("organization_id", orgId)
    .eq("layout_key", safeLayoutKey)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (exErr) {
    console.error("ensureSiteForOrg select error:", exErr);
    return null;
  }

  if (existing) {
    if (
      existing.template_key !== safeTemplateKey ||
      existing.layout_key !== safeLayoutKey
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

    const pageRows = enabledPages.map((page) => ({
      site_id: siteId,
      slug: page.slug,
      title: page.title,
      is_published: page.enabled !== false,
      seo: page.seo || {},
      layout_override: null,
    }));

    const { data: createdPages, error: pagesErr } = await supabase
      .from("site_pages")
      .insert(pageRows)
      .select("*");

    if (pagesErr) throw pagesErr;

    const pageBySlug = Object.fromEntries(
      createdPages.map((page) => [page.slug, page])
    );

    // 4) create site_sections from template pages[].sections
    const sectionRows = enabledPages.flatMap((page) => {
      const dbPage = pageBySlug[page.slug];
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
      .map((page) => {
        const dbPage = pageBySlug[page.slug];
        return {
          site_id: siteId,
          location: page.nav.location || "header",
          label: page.nav.label || page.title,
          href: buildAbsoluteHref(page.slug),
          page_id: dbPage?.id || null,
          parent_id: null,
          position: page.nav.position ?? 0,
          is_external: false,
          is_visible: true,
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