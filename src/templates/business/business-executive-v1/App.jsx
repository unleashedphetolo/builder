import React, { useEffect, useMemo, useState } from "react";
import { templateConfig } from "./template.config";
import { mergeSettings, normalizeSlug, resolveCurrentPage } from "./utils/templateData";
import { getSectionsForPage } from "./utils/sections";
import Topbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Insights from "./pages/Insights";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ScrollTopButton from "./components/common/ScrollTopButton";

import "./styles/base.css";
import "./styles/layout/topbar.css";
import "./styles/layout/navbar.css";
import "./styles/layout/footer.css";
import "./styles/sections/hero.css";
import "./styles/sections/sections.css";
import "./styles/pages/home.css";
import "./styles/pages/about.css";
import "./styles/pages/services.css";
import "./styles/pages/portfolio.css";
import "./styles/pages/insights.css";
import "./styles/pages/contact.css";
import "./styles/responsive/responsive.css";
import "./styles/scroll-top.css";

const PAGE_COMPONENTS = {
  "/": Home,
  "/about": About,
  "/services": Services,
  "/portfolio": Portfolio,
  "/insights": Insights,
  "/contact": Contact,
};

export default function App({
  settings = {},
  navItems = [],
  page = {},
  sections = [],
  builderMode = false,
  previewMode = false,
  templatePreviewMode = false,
  miniPreview = false,
  navigateTo,
  children,
}) {
  const safeSettings = useMemo(() => mergeSettings(settings), [settings]);
  const [activeSlug, setActiveSlug] = useState(() => normalizeSlug(page?.slug || page?.path || "/"));

  const navigateToSlug = (nextSlug = "/") => {
    const cleanSlug = normalizeSlug(nextSlug || "/");
    setActiveSlug(cleanSlug);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      window.dispatchEvent(
        new CustomEvent("builder:navigate", {
          detail: cleanSlug,
        }),
      );

      window.dispatchEvent(
        new CustomEvent("site:navigate", {
          detail: cleanSlug,
        }),
      );

      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          { type: "builder:navigate", slug: cleanSlug, detail: cleanSlug },
          "*",
        );
        window.parent.postMessage(
          { type: "site:navigate", slug: cleanSlug, detail: cleanSlug },
          "*",
        );
        window.parent.postMessage(
          { type: "navigate", slug: cleanSlug, detail: cleanSlug },
          "*",
        );
      }
    }
  };

  useEffect(() => {
    function handleMessage(event) {
      const payload = event?.data || {};
      if (
        payload?.type === "navigate" ||
        payload?.type === "builder:navigate" ||
        payload?.type === "site:navigate"
      ) {
        setActiveSlug(normalizeSlug(payload.slug || payload.detail || "/"));
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    function handleBuilderNavigate(event) {
      setActiveSlug(normalizeSlug(event.detail || "/"));
    }

    window.addEventListener("builder:navigate", handleBuilderNavigate);
    window.addEventListener("site:navigate", handleBuilderNavigate);

    return () => {
      window.removeEventListener("builder:navigate", handleBuilderNavigate);
      window.removeEventListener("site:navigate", handleBuilderNavigate);
    };
  }, []);

  useEffect(() => {
    if (page?.slug || page?.path || page?.route || page?.page_slug) {
      setActiveSlug(normalizeSlug(page.slug || page.path || page.route || page.page_slug));
    }
  }, [page?.slug, page?.path, page?.route, page?.page_slug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [activeSlug]);

  const handleNavigate = (nextSlug = "/") => {
    navigateToSlug(nextSlug);
    if (typeof navigateTo === "function") {
      navigateTo(nextSlug);
    }
  };

  const currentPage = useMemo(
    () =>
      resolveCurrentPage(
        { ...(page || {}), slug: activeSlug },
        templateConfig.pages,
        safeSettings,
      ),
    [page, activeSlug, safeSettings],
  );
  const currentSlug = normalizeSlug(currentPage?.slug || activeSlug || "/");
  const PageComponent = PAGE_COMPONENTS[currentSlug] || NotFound;
  const pageSections = getSectionsForPage({
    allSections: sections,
    configPage: currentPage,
    currentSlug,
  });

  const rootStyle = {
    "--primary": safeSettings.primary_color || "#123c7c",
    "--secondary": safeSettings.secondary_color || "#0f172a",
    "--accent": safeSettings.accent_color || "#f59e0b",
    "--background": safeSettings.background_color || "#f8fafc",
    "--font": safeSettings.font_family || 'Inter, "Segoe UI", Arial, sans-serif',
  };

  return (
    <div
      className={`business-executive-template ${previewMode ? "is-preview" : ""} ${templatePreviewMode ? "is-template-preview" : ""} ${miniPreview ? "is-mini-preview" : ""}`}
      style={rootStyle}
    >
      <Topbar settings={safeSettings} navigateTo={handleNavigate} builderMode={builderMode} />
      <Navbar
        settings={safeSettings}
        navItems={navItems}
        pages={templateConfig.pages}
        currentSlug={currentSlug}
        navigateTo={handleNavigate}
        builderMode={builderMode}
      />
      <PageComponent
        settings={safeSettings}
        page={currentPage}
        sections={pageSections}
        navigateTo={handleNavigate}
        builderMode={builderMode}
        templateKey={templateConfig.templateKey}
      />
      {children}
      <Footer
        settings={safeSettings}
        navItems={navItems}
        pages={templateConfig.pages}
        navigateTo={handleNavigate}
        builderMode={builderMode}
      />
      <ScrollTopButton />
    </div>
  );
}
