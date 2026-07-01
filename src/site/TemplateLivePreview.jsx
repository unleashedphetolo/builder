import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import SchoolLayout from "../layouts/SchoolLayout";
import BusinessLayout from "../layouts/BusinessLayout";
import PortfolioLayout from "../layouts/PortfolioLayout";
import SecurityLayout from "../layouts/SecurityLayout";
import HealthLayout from "../layouts/HealthLayout";
import AgricultureLayout from "../layouts/AgricultureLayout";
import ConstructionLayout from "../layouts/ConstructionLayout";
import EngineeringLayout from "../layouts/EngineeringLayout";
import TechnologyLayout from "../layouts/TechnologyLayout";
import EcommerceLayout from "../layouts/EcommerceLayout";


const templateConfigs = import.meta.glob(
  "../templates/*/*/template.config.{js,jsx}",
  { eager: true },
);

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

function normalizePageSlug(slug = "/") {
  const raw = String(slug || "/").trim();

  const cleanRaw = raw
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  if (!cleanRaw || cleanRaw.toLowerCase() === "home") return "/";

  return `/${cleanRaw}`;
}

function titleFromSlug(slug = "/") {
  const clean = normalizePageSlug(slug);

  if (clean === "/") return "Home";

  const last = clean.split("/").filter(Boolean).pop() || "Page";

  return last
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizePreviewLink(link = {}, fallbackLocation = "header", index = 0) {
  const href = link.href || link.slug || "/";

  return {
    label: link.label || link.title || titleFromSlug(href),
    href: String(href).startsWith("http") ? href : normalizePageSlug(href),
    location: link.location || fallbackLocation,
    position: link.position ?? index,
    enabled: link.enabled !== false,
    is_external:
      link.is_external === true || String(href || "").startsWith("http"),
    meta: link.meta || {},
  };
}

function makeNavItem({
  id,
  siteId = "template-preview",
  location = "header",
  label,
  href = "/",
  pageId = null,
  position = 0,
  isExternal = false,
  isVisible = true,
  meta = {},
}) {
  return {
    id,
    site_id: siteId,
    location,
    label,
    href: isExternal ? href : normalizePageSlug(href),
    page_id: pageId,
    parent_id: null,
    position,
    is_external: isExternal,
    is_visible: isVisible !== false,
    meta,
  };
}

function dedupeNavItems(items = []) {
  const seen = new Set();
  const output = [];

  items.forEach((item) => {
    if (!item?.href || !item?.location) return;

    const key = `${item.location}:${item.href}:${item.label || ""}`;

    if (seen.has(key)) return;

    seen.add(key);
    output.push(item);
  });

  return output.sort((a, b) => {
    const locationCompare = String(a.location || "").localeCompare(
      String(b.location || ""),
    );

    if (locationCompare !== 0) return locationCompare;

    return (a.position ?? 0) - (b.position ?? 0);
  });
}

function buildNavItems({ pages = [], defaults = {} }) {
  const enabledPages = Array.isArray(pages)
    ? pages.filter((page) => page?.enabled !== false)
    : [];

  const pageIdBySlug = new Map();

  enabledPages.forEach((page, index) => {
    pageIdBySlug.set(normalizePageSlug(page.slug || "/"), `preview-page-${index}`);
  });

  const navRows = [];

  enabledPages.forEach((page, index) => {
    const cleanSlug = normalizePageSlug(page.slug || "/");
    const nav = page.nav || {};

    navRows.push(
      makeNavItem({
        id: `preview-nav-page-${index}`,
        location: nav.location || "header",
        label: nav.label || page.title || titleFromSlug(cleanSlug),
        href: cleanSlug,
        pageId: `preview-page-${index}`,
        position: nav.position ?? page.position ?? page.sort_order ?? index,
        isExternal: false,
        isVisible: page.enabled !== false && nav.enabled !== false,
        meta: nav.meta || {
          template_page_key:
            page.template_page_key ||
            page.key ||
            cleanSlug.replace(/^\/+/, "").replace(/\//g, "-") ||
            "home",
          auto_generated_preview: true,
        },
      }),
    );
  });

  const parentGroups = [
    {
      label: "About",
      href: "/about",
      matchPrefix: "/about/",
      position: 10,
    },
    {
      label: "Activities",
      href: "/activities",
      matchPrefix: "/activities/",
      position: 20,
    },
    {
      label: "Resources",
      href: "/resources",
      matchPrefix: "/resources/",
      position: 30,
    },
    {
      label: "News",
      href: "/news",
      matchPrefix: "/news/",
      position: 40,
    },
    {
      label: "Admissions",
      href: "/admissions",
      matchPrefix: "/admissions/",
      position: 50,
    },
  ];

  parentGroups.forEach((group, index) => {
    const alreadyExists = navRows.some(
      (item) =>
        item.location === "header" &&
        normalizePageSlug(item.href) === normalizePageSlug(group.href),
    );

    const hasChildren = enabledPages.some((page) =>
      normalizePageSlug(page.slug || "/").startsWith(group.matchPrefix),
    );

    if (!alreadyExists && hasChildren) {
      navRows.push(
        makeNavItem({
          id: `preview-nav-parent-${index}`,
          location: "header",
          label: group.label,
          href: group.href,
          pageId: pageIdBySlug.get(normalizePageSlug(group.href)) || null,
          position: group.position,
          isExternal: false,
          isVisible: true,
          meta: {
            auto_generated_preview_parent: true,
          },
        }),
      );
    }
  });

  const topbarLinks = Array.isArray(defaults.topbar_links)
    ? defaults.topbar_links
    : [];

  const footerLinks = Array.isArray(defaults.footer_links)
    ? defaults.footer_links
    : [];

  topbarLinks.forEach((link, index) => {
    const safeLink = normalizePreviewLink(link, "topbar", index);
    const pageId = pageIdBySlug.get(normalizePageSlug(safeLink.href)) || null;

    navRows.push(
      makeNavItem({
        id: `preview-nav-topbar-${index}`,
        location: "topbar",
        label: safeLink.label,
        href: safeLink.href,
        pageId,
        position: safeLink.position,
        isExternal: safeLink.is_external,
        isVisible: safeLink.enabled !== false,
        meta: safeLink.meta,
      }),
    );
  });

  footerLinks.forEach((link, index) => {
    const safeLink = normalizePreviewLink(link, "footer", index);
    const pageId = pageIdBySlug.get(normalizePageSlug(safeLink.href)) || null;

    navRows.push(
      makeNavItem({
        id: `preview-nav-footer-${index}`,
        location: "footer",
        label: safeLink.label,
        href: safeLink.href,
        pageId,
        position: safeLink.position,
        isExternal: safeLink.is_external,
        isVisible: safeLink.enabled !== false,
        meta: safeLink.meta,
      }),
    );
  });

  return dedupeNavItems(navRows);
}

function buildSections({ page, pageIndex }) {
  return (Array.isArray(page?.sections) ? page.sections : []).map(
    (section, index) => ({
      id: `preview-section-${pageIndex}-${index}`,
      site_id: "template-preview",
      page_id: `preview-page-${pageIndex}`,
      type: section.type,
      content: section.content || {},
      position: index,
      visible: section.visible !== false,
      is_locked: section.is_locked === true,
      style: section.style || {},
      animation: section.animation || {},
      revision: 1,
    }),
  );
}

export default function TemplateLivePreview() {
  const { layoutKey = "school", templateKey = "", "*": wildcardSlug } =
    useParams();

  const location = useLocation();

  const config = useMemo(() => {
    return resolveTemplateConfig(layoutKey, templateKey);
  }, [layoutKey, templateKey]);

  const pageSlug = useMemo(() => {
    return normalizePageSlug(wildcardSlug || "/");
  }, [wildcardSlug]);

  const isMini = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get("mini") === "1";
  }, [location.search]);

  const isFullPreview = useMemo(() => {
    const search = new URLSearchParams(location.search);
    return search.get("preview") === "1";
  }, [location.search]);

  if (!config) {
    return (
      <div style={{ padding: 24, fontFamily: "Inter, sans-serif" }}>
        Template preview not found.
      </div>
    );
  }

  const defaults = config.defaults || {};
  const pages = Array.isArray(config.pages)
    ? config.pages.filter((page) => page?.enabled !== false)
    : [];

  const pageIndex = Math.max(
    0,
    pages.findIndex((page) => normalizePageSlug(page.slug) === pageSlug),
  );

  const activePage = pages[pageIndex] || pages[0] || {
    title: "Preview",
    slug: "/",
    sections: [],
  };

  const site = {
    id: "template-preview",
    organization_id: "template-preview",
    layout_key: layoutKey,
    template_key: templateKey,
    is_published: true,
    slug: "template-preview",
  };

  const settings = {
    ...defaults,
    site_id: "template-preview",
    template_key: templateKey,
    site_name: defaults.site_name || "Website Preview",
    tagline: defaults.tagline || "Live template preview",
    primary_color: defaults.primary_color || "#1e40af",
    secondary_color: defaults.secondary_color || "#0f172a",
    accent_color: defaults.accent_color || "#f59e0b",
    font_family: defaults.font_family || "Inter, sans-serif",
    social_links: defaults.social_links || {},
    social_display: defaults.social_display || {},
    topbar_links: Array.isArray(defaults.topbar_links)
      ? defaults.topbar_links
      : [],
    footer_links: Array.isArray(defaults.footer_links)
      ? defaults.footer_links
      : [],
    hero_slides: Array.isArray(defaults.hero_slides)
      ? defaults.hero_slides
      : [],
    features: {
      topbar: true,
      ...(defaults.features || {}),
    },
  };

  const page = {
    id: `preview-page-${pageIndex}`,
    site_id: "template-preview",
    slug: normalizePageSlug(activePage.slug),
    title: activePage.title || "Preview",
    content: activePage.content || {},
    is_visible: true,
    is_published: true,
    sort_order: pageIndex,
    template_page_key:
      activePage.template_page_key ||
      activePage.key ||
      normalizePageSlug(activePage.slug).replace(/^\/+/, "") ||
      "home",
    seo: activePage.seo || {},
  };

  const navItems = buildNavItems({
    pages,
    defaults,
  });

  const navigateTo = (slug = "/") => {
    const cleanSlug = normalizePageSlug(slug);
    const path = cleanSlug === "/" ? "" : cleanSlug;
    const mode = isMini ? "mini=1" : isFullPreview ? "preview=1" : "preview=1";

    window.location.hash = `/template-preview/${layoutKey}/${templateKey}${path}?${mode}`;
  };

  const sharedProps = {
    site,
    settings,
    navItems,
    page,
    sections: buildSections({ page: activePage, pageIndex }),
    // builderMode: true,
    builderMode: false,
    templatePreviewMode: true,
    miniPreview: isMini,
    previewMode: isFullPreview,
    navigateTo,
  };

  if (layoutKey === "business") {
    return <BusinessLayout {...sharedProps} />;
  }

  if (layoutKey === "portfolio") {
    return <PortfolioLayout {...sharedProps} />;
  }

  if (layoutKey === "security") {
      return <SecurityLayout {...sharedProps} />;
    }

    if (layoutKey === "health") {
      return <HealthLayout {...sharedProps} />;
    }

    if (layoutKey === "agriculture") {
      return <AgricultureLayout {...sharedProps} />;
    }

      if (layoutKey === "construction") {
        return <ConstructionLayout {...sharedProps} />;
      }

      if (layoutKey === "engineering") {
        return <EngineeringLayout {...sharedProps} />;
      }

      if (layoutKey === "technology") {
        return <TechnologyLayout {...sharedProps} />;
      }

      if (layoutKey === "ecommerce") {
        return <EcommerceLayout {...sharedProps} />;
      }

  return <SchoolLayout {...sharedProps} />;
}