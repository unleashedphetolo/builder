import React from "react";
import Topbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ScrollTopButton from "./components/common/ScrollTopButton";

import Home from "./pages/Home";
import "./index.css";
import "./App.css";

function DefaultPageFallback({ sections = [] }) {
  return (
    <>
      {sections.map((section) => (
        <div
          key={section.id}
          data-builder-section-id={section.id}
          data-builder-section-type={section.type}
          className="builder-section-anchor"
        >
          <section className="builder-fallback-section">
            <h2>{section?.content?.title || section?.type || "Section"}</h2>
            <p>{section?.content?.subtitle || ""}</p>
          </section>
        </div>
      ))}
    </>
  );
}

export default function App(props) {
  const {
    settings,
    navItems,
    page,
    sections = [],
    builderMode = false,
  } = props || {};

  const slug = page?.slug || "/";

  let pageContent = null;

  if (slug === "/") {
    pageContent = (
  <Home
    sections={sections}
    builderMode={builderMode}
    settings={settings}
  />
);
  } else {
    pageContent = <DefaultPageFallback sections={sections} />;
  }

  return (
    <div className="school-institutional-v1-root">
      <ScrollToTop />

      <Topbar
        settings={settings}
        socialLinks={settings?.social_links}
        socialDisplay={settings?.social_display}
        topbarLinks={settings?.topbar_links || []}
      />

      <Navbar
        settings={settings}
        navItems={navItems}
      />

      <main data-builder-page-root={builderMode ? "1" : "0"}>
        {pageContent}
      </main>

      <Footer
        settings={settings}
        socialLinks={settings?.social_links}
        socialDisplay={settings?.social_display}
        footerLinks={settings?.footer_links || []}
      />

      <ScrollTopButton />
    </div>
  );
}