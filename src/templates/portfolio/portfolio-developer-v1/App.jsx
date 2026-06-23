import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import templateConfig from "./template.config";
import { getPageComponent, getPageKey } from "./pages/pageMap";
import { getPortfolioData } from "./utils/templateData";
import BusinessLikeTopbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollTopButton from "./components/common/ScrollTopButton";

export default function PortfolioTemplateApp({
  settings = {},
  navItems = [],
  page = null,
  sections = [],
  builderMode = false,
  previewMode = false,
  children,
}) {
  const data = useMemo(
    () => getPortfolioData({ settings, page, sections, templateConfig }),
    [settings, page, sections],
  );

  const [activePageKey, setActivePageKey] = useState(() =>
    getPageKey(page, data.defaultPageKey),
  );

  useEffect(() => {
    setActivePageKey(getPageKey(page, data.defaultPageKey));
  }, [page, data.defaultPageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncPage = (event) => {
      const nextHref = event?.detail?.href || event?.detail?.pageKey || "";
      const nextPageKey = nextHref
        ? getPageKey({ slug: nextHref }, data.defaultPageKey)
        : getPageKey(page, data.defaultPageKey);

      setActivePageKey(nextPageKey);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", syncPage);
    window.addEventListener("hashchange", syncPage);
    window.addEventListener("portfolio:navigate", syncPage);

    return () => {
      window.removeEventListener("popstate", syncPage);
      window.removeEventListener("hashchange", syncPage);
      window.removeEventListener("portfolio:navigate", syncPage);
    };
  }, [page, data.defaultPageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [activePageKey]);

  const PageComponent = getPageComponent(activePageKey);

  return (
    <div className={`portfolio-template portfolio-template--${templateConfig.variant}`}>
      <BusinessLikeTopbar settings={settings} data={data} />
      <Navbar
        settings={settings}
        navItems={navItems}
        data={data}
        builderMode={builderMode}
      />

      <main>
        <PageComponent
          settings={settings}
          data={data}
          sections={sections}
          builderMode={builderMode}
          previewMode={previewMode}
        />
        {children}
      </main>

      <Footer settings={settings} data={data} />
      <ScrollTopButton />
    </div>
  );
}
