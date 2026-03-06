import { supabase } from "../supabase/client";

// ---------- Helpers ----------
async function getCurrentOrgId() {
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data?.organization_id || null;
}

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
      : "school-sebone-v1");

  // Find existing site for this org + layout
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
    // If an old row somehow has no template_key, patch it
    if (!existing.template_key) {
      const { data: patched, error: patchErr } = await supabase
        .from("sites")
        .update({ template_key: safeTemplateKey })
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
    console.log("ensureSiteForOrg error:", JSON.stringify(error, null, 2), error);
    return null;
  }

  return created;
}

export async function seedSiteFromTemplate({ siteId, layoutKey, templateKey }) {
  try {
    // 0) clean any nav items FIRST (nav may FK to pages)
    await supabase.from("site_nav_items").delete().eq("site_id", siteId);

    // 1) update sites template
    const { error: updErr } = await supabase
      .from("sites")
      .update({ template_key: templateKey, layout_key: layoutKey })
      .eq("id", siteId);
    if (updErr) throw updErr;

    // 2) ensure site_settings exists
    const { data: settings, error: stSelErr } = await supabase
      .from("site_settings")
      .select("id")
      .eq("site_id", siteId)
      .maybeSingle();

    if (stSelErr) throw stSelErr;

    if (!settings) {
      const { error: stInsErr } = await supabase.from("site_settings").insert({
        site_id: siteId,
        site_name: "Your School Name",
        tagline: "Excellence in Learning",
        motto: "Discipline • Respect • Success",
        primary_color: "#1e40af",
        secondary_color: "#0f172a",
        accent_color: "#f59e0b",
        font_family: "Inter",
        social_links: {
          facebook: "https://facebook.com",
          x: "https://x.com",
          instagram: "https://instagram.com",
          youtube: "https://youtube.com",
          tiktok: "https://tiktok.com",
          linkedin: "https://linkedin.com",
          whatsapp: "https://wa.me/",
        },
        social_display: {
          facebook: true,
          x: true,
          instagram: true,
          youtube: true,
          tiktok: true,
          linkedin: true,
          whatsapp: true,
          topbar: true,
          footer: true,
        },
        topbar_links: [],
        footer_links: [],
        footer_text: "© Your School. All rights reserved.",
      });
      if (stInsErr) throw stInsErr;
    }

    // 3) wipe sections then pages
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

    // 4) create default pages
    const pages = getDefaultPages(layoutKey);
    const { data: createdPages, error: pagesErr } = await supabase
      .from("site_pages")
      .insert(
        pages.map((p) => ({
          site_id: siteId,
          slug: p.slug,
          title: p.title,
          is_published: true,
          seo: p.seo || {},
          layout_override: null,
        }))
      )
      .select("*");

    if (pagesErr) throw pagesErr;

    // 5) seed sections per page
    const bySlug = Object.fromEntries(createdPages.map((p) => [p.slug, p]));
    const sections = getDefaultSections(layoutKey, templateKey, bySlug);
    if (sections.length) {
      const { error: secInsErr } = await supabase.from("site_sections").insert(sections);
      if (secInsErr) throw secInsErr;
    }

    // 6) seed nav items
    const navItems = pages
      .filter((p) => ["/", "/about", "/admissions", "/news", "/gallery", "/contact"].includes(p.slug))
      .map((p, idx) => ({
        site_id: siteId,
        location: "header",
        label: p.title,
        href: p.slug,
        page_id: bySlug[p.slug]?.id || null,
        parent_id: null,
        position: idx,
        is_external: false,
        is_visible: true,
        meta: {},
      }));
    if (navItems.length) {
      const { error: navErr } = await supabase.from("site_nav_items").insert(navItems);
      if (navErr) throw navErr;
    }

    return { ok: true };
  } catch (e) {
    console.error("seedSiteFromTemplate failed", e);
    return { ok: false, error: e };
  }
}

export async function loadSitePages(siteId) {
  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function loadPageSections({ siteId, pageId }) {
  const { data, error } = await supabase
    .from("site_sections")
    .select("*")
    .eq("site_id", siteId)
    .eq("page_id", pageId)
    .order("position", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function persistSectionOrder(updatedSections) {
  // minimal: update only position
  await Promise.all(
    updatedSections.map((s) =>
      supabase.from("site_sections").update({ position: s.position }).eq("id", s.id)
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
  // field can be like "content.title" or "style.background"
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
  await supabase.from("site_sections").delete().eq("id", id);
}

// ---------- Seed definitions ----------

function getDefaultPages(layoutKey) {
  if (layoutKey === "business") {
    return [
      { slug: "/", title: "Home" },
      { slug: "/about", title: "About" },
      { slug: "/services", title: "Services" },
      { slug: "/pricing", title: "Pricing" },
      { slug: "/contact", title: "Contact" },
    ];
  }
  if (layoutKey === "portfolio") {
    return [
      { slug: "/", title: "Home" },
      { slug: "/projects", title: "Projects" },
      { slug: "/resume", title: "Resume" },
      { slug: "/contact", title: "Contact" },
    ];
  }

  // school (Sebone-style)
  return [
    { slug: "/", title: "Home" },
    { slug: "/about", title: "About" },
    { slug: "/admissions", title: "Admissions" },
    { slug: "/facilities", title: "Facilities" },
    { slug: "/staff", title: "Staff" },
    { slug: "/news", title: "News" },
    { slug: "/notices", title: "Notices" },
    { slug: "/events", title: "Events" },
    { slug: "/calendar", title: "Calendar" },
    { slug: "/gallery", title: "Gallery" },
    { slug: "/resources", title: "Resources" },
    { slug: "/contact", title: "Contact" },
  ];
}

function getDefaultSections(layoutKey, templateKey, bySlug) {
  const mk = (slug, list) =>
    list.map((s, idx) => ({
      site_id: bySlug[slug].site_id,
      page_id: bySlug[slug].id,
      type: s.type,
      content: s.content,
      position: idx,
      visible: true,
      is_locked: false,
      style: s.style || {},
      animation: {},
      updated_by: null,
      revision: 1,
      library_id: null,
    }));

  if (layoutKey === "business") {
    return [
      ...mk("/", [
        { type: "hero", content: { title: "Grow Your Business", subtitle: "Executive-ready website template" } },
        { type: "services", content: { title: "Services", subtitle: "What we do" } },
        { type: "cta", content: { title: "Request a Quote", subtitle: "Let’s talk" } },
      ]),
      ...mk("/about", [{ type: "about", content: { title: "About Us", subtitle: "Our mission and values" } }]),
      ...mk("/services", [{ type: "services", content: { title: "Services", subtitle: "Our solutions" } }]),
      ...mk("/pricing", [{ type: "pricing", content: { title: "Pricing", subtitle: "Simple plans" } }]),
      ...mk("/contact", [{ type: "contact", content: { title: "Contact", subtitle: "Get in touch" } }]),
    ].flat();
  }

  if (layoutKey === "portfolio") {
    return [
      ...mk("/", [
        { type: "hero", content: { title: "Hi, I’m Your Name", subtitle: "I build modern web experiences." } },
        { type: "projects", content: { title: "Projects", subtitle: "Selected work" } },
      ]),
      ...mk("/projects", [{ type: "projects", content: { title: "Projects", subtitle: "Portfolio grid" } }]),
      ...mk("/resume", [{ type: "resume", content: { title: "Resume", subtitle: "Experience & skills" } }]),
      ...mk("/contact", [{ type: "contact", content: { title: "Contact", subtitle: "Let’s collaborate" } }]),
    ].flat();
  }

  // school
  return [
    ...mk("/", [
      { type: "topbar", content: { title: "Welcome", subtitle: "Institutional template" } },
      { type: "hero", content: { title: "Welcome to Your School", subtitle: "Building bright futures" } },
      { type: "quick-links", content: { title: "Quick Links", subtitle: "Admissions • News • Calendar" } },
      { type: "announcements", content: { title: "Announcements", subtitle: "Latest school updates" } },
      { type: "featured", content: { title: "Featured", subtitle: "Programs & achievements" } },
      { type: "gallery", content: { title: "Gallery", subtitle: "School life moments" } },
      { type: "contact", content: { title: "Contact", subtitle: "Find us / call us" } },
    ]),
    ...mk("/about", [{ type: "about", content: { title: "About Our School", subtitle: "Mission, vision, values" } }]),
    ...mk("/admissions", [{ type: "admissions", content: { title: "Admissions", subtitle: "How to apply" } }]),
    ...mk("/facilities", [{ type: "facilities", content: { title: "Facilities", subtitle: "A safe learning environment" } }]),
    ...mk("/staff", [{ type: "staff", content: { title: "Staff", subtitle: "Meet our educators" } }]),
    ...mk("/news", [{ type: "news", content: { title: "News", subtitle: "Latest news" } }]),
    ...mk("/notices", [{ type: "notices", content: { title: "Notices", subtitle: "School notices" } }]),
    ...mk("/events", [{ type: "events", content: { title: "Events", subtitle: "Upcoming events" } }]),
    ...mk("/calendar", [{ type: "calendar", content: { title: "Calendar", subtitle: "Term calendar" } }]),
    ...mk("/gallery", [{ type: "gallery", content: { title: "Gallery", subtitle: "Photos & videos" } }]),
    ...mk("/resources", [{ type: "resources", content: { title: "Resources", subtitle: "Downloads & links" } }]),
    ...mk("/contact", [{ type: "contact", content: { title: "Contact", subtitle: "Get in touch" } }]),
  ].flat();
}

function defaultSectionContent(type) {
  const map = {
    hero: { title: "Hero Title", subtitle: "Hero subtitle" },
    about: { title: "About", subtitle: "Tell your story" },
    gallery: { title: "Gallery", subtitle: "Add your images" },
    contact: { title: "Contact", subtitle: "Email / phone / address" },
    cta: { title: "Call to Action", subtitle: "Encourage action" },
    services: { title: "Services", subtitle: "What you offer" },
    pricing: { title: "Pricing", subtitle: "Your plans" },
    projects: { title: "Projects", subtitle: "Your work" },
    resume: { title: "Resume", subtitle: "Experience" },
    announcements: { title: "Announcements", subtitle: "Latest updates" },
  };
  return map[type] || { title: "Section", subtitle: "Edit content" };
}


export async function loadSiteSettings(siteId) {
  if (!siteId) return null;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("site_id", siteId)
    .maybeSingle();
  if (error) return null;
  return data || null;
}

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

export async function loadSiteNav(siteId) {
  if (!siteId) return [];
  const { data, error } = await supabase
    .from("site_nav_items")
    .select("*")
    .eq("site_id", siteId)
    .order("position", { ascending: true });
  if (error) return [];
  return data || [];
}
