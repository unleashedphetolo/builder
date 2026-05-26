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

function isVisibleByNav(navItems = [], paths = []) {
  const cleanPaths = paths.map((path) => normalizeHref(path));

  const matched = (Array.isArray(navItems) ? navItems : []).find((item) => {
    if (!item?.href) return false;

    const itemHref = normalizeHref(item.href);

    return cleanPaths.includes(itemHref);
  });

  if (!matched) return false;

  return matched.is_visible !== false;
}

export default function Home({ settings = {}, navItems = [] }) {
  const showAbout = isVisibleByNav(navItems, [
    "/about",
    "/about/who-we-are",
    "/about/vision-mission",
  ]);

  const showGallery = isVisibleByNav(navItems, ["/gallery"]);

  const showAdmissions = isVisibleByNav(navItems, [
    "/admissions",
    "/admissions/howtoapply",
    "/admissions/apply",
  ]);

  const showCalendar = isVisibleByNav(navItems, [
    "/schoolcalendar",
    "/resources/calendar",
  ]);

  const showWallOfFame = isVisibleByNav(navItems, [
    "/wall-of-fame",
    "/walloffame",
    "/fame",
  ]);

  return (
    <>
      <Hero settings={settings} />
      <NoticeBoard settings={settings} />

      <div className="container">
        {showAbout && <AboutSection settings={settings} />}
        {showGallery && <GalleryPreview settings={settings} />}
      </div>

      <PrincipalMessage settings={settings} />

      {showAdmissions && <Admissions settings={settings} />}
      {showCalendar && <SchoolCalendar settings={settings} />}
      {showWallOfFame && <WallOfFame settings={settings} />}

      <Sponsors settings={settings} />
    </>
  );
}