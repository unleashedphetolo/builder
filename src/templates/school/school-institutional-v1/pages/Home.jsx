import React from "react";

import Hero from "../components/home/Hero";
import NoticeBoard from "../components/home/NoticeBoard";
import AboutSection from "../components/home/AboutSection";
import GalleryPreview from "../components/home/GalleryPreview";
import PrincipalMessage from "../components/home/PrincipalMessage";
import Admissions from "./Admissions";
import WallOfFame from "../components/home/WallOfFame";
import SchoolCalendar from "./SchoolCalendar";
import Sponsors from "../components/home/Sponsors";

function normalizeHref(href = "/") {
  if (!href) return "/";

  if (String(href).startsWith("http")) {
    return String(href);
  }

  const clean = String(href)
    .replace(/^#/, "")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  const withoutSitePrefix = clean.replace(/^site\/[^/]+\/?/, "");

  if (!withoutSitePrefix || withoutSitePrefix.toLowerCase() === "home") {
    return "/";
  }

  return `/${withoutSitePrefix.replace(/^\/+|\/+$/g, "")}`;
}

function isVisibleByNav(navItems = [], paths = [], fallbackVisible = true) {
  const cleanPaths = paths.map((path) => normalizeHref(path));

  const matches = (Array.isArray(navItems) ? navItems : []).filter((item) => {
    if (!item?.href) return false;

    const itemHref = normalizeHref(item.href);

    return cleanPaths.includes(itemHref);
  });

  if (!matches.length) return fallbackVisible;

  if (matches.some((item) => item.is_visible === false)) {
    return false;
  }

  return matches.some((item) => item.is_visible !== false);
}

export default function Home({
  settings = {},
  navItems = [],
  builderMode = false,
}) {
  const showHome = isVisibleByNav(navItems, ["/"]);

  const showHero = isVisibleByNav(navItems, ["/home/hero"]);

  const showNotices = isVisibleByNav(navItems, ["/notices"]);

  const showAboutSection = isVisibleByNav(navItems, ["/home/about-section"]);

  const showGalleryPreview = isVisibleByNav(navItems, [
    "/home/gallery-preview",
  ]);

  const showPrincipalMessage = isVisibleByNav(navItems, [
    "/home/principal-message",
    "/principal-message",
  ]);

  const showAdmissions = isVisibleByNav(navItems, ["/admissions"]);

  const showCalendar = isVisibleByNav(navItems, [
    "/schoolcalendar",
    "/resources/calendar",
  ]);

  const showWallOfFame = isVisibleByNav(navItems, ["/wall-of-fame"]);

  const showSponsors = isVisibleByNav(navItems, ["/sponsors"]);

  if (!showHome) {
    return null;
  }

  return (
    <>
      {showHero && (
        <Hero
          settings={settings}
          navItems={navItems}
          builderMode={builderMode}
        />
      )}

      {showNotices && (
        <NoticeBoard settings={settings} navItems={navItems} />
      )}

      <div className="container">
        {showAboutSection && (
          <AboutSection settings={settings} navItems={navItems} />
        )}

        {showGalleryPreview && (
          <GalleryPreview settings={settings} navItems={navItems} />
        )}
      </div>

      {showPrincipalMessage && (
        <PrincipalMessage settings={settings} navItems={navItems} />
      )}

      {showAdmissions && (
        <Admissions settings={settings} navItems={navItems} />
      )}

      {showCalendar && (
        <SchoolCalendar settings={settings} navItems={navItems} />
      )}

      {showWallOfFame && (
        <WallOfFame settings={settings} navItems={navItems} />
      )}

      {showSponsors && <Sponsors settings={settings} navItems={navItems} />}
    </>
  );
}