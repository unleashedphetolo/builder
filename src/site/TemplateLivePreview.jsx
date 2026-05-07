import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

import SchoolLayout from "../layouts/SchoolLayout";
import BusinessLayout from "../layouts/BusinessLayout";
import PortfolioLayout from "../layouts/PortfolioLayout";

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

function buildNavItems({ pages = [] }) {
  return pages
    .filter((page) => page?.enabled !== false && page?.nav)
    .map((page, index) => ({
      id: `preview-nav-${index}`,
      site_id: "template-preview",
      location: page.nav.location || "header",
      label: page.nav.label || page.title,
      href: normalizePageSlug(page.slug),
      page_id: `preview-page-${index}`,
      parent_id: null,
      position: page.nav.position ?? index,
      is_external: false,
      is_visible: true,
      meta: page.nav.meta || {},
    }));
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
    features: defaults.features || {},
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

  const sharedProps = {
    site,
    settings,
    navItems: buildNavItems({ pages }),
    page,
    sections: buildSections({ page: activePage, pageIndex }),
    builderMode: true,
    templatePreviewMode: true,
    miniPreview: isMini,
  };

  if (layoutKey === "business") {
    return <BusinessLayout {...sharedProps} />;
  }

  if (layoutKey === "portfolio") {
    return <PortfolioLayout {...sharedProps} />;
  }

  return <SchoolLayout {...sharedProps} />;
}