import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";

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

function normalizeSectionType(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
}

function findSection(sections = [], acceptedTypes = []) {
  const matchingTypes = new Set(acceptedTypes.map(normalizeSectionType));

  return (
    (Array.isArray(sections) ? sections : []).find((section) =>
      matchingTypes.has(
        normalizeSectionType(section?.type || section?.section_type),
      ),
    ) || null
  );
}

function sectionContent(section) {
  return section?.content && typeof section.content === "object"
    ? section.content
    : {};
}

function canRenderSection(showFromNavigation, section, builderMode) {
  if (!showFromNavigation) return false;
  if (!section) return true;

  return builderMode || section.visible !== false;
}

function EditableSection({
  section,
  sectionType,
  label,
  builderMode,
  children,
}) {
  if (!section) {
    return children;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType={sectionType}
      label={label}
      templateCategory="school"
      templateKey="school-sports-academy-v1"
    >
      {children}
    </BuilderSectionTarget>
  );
}

export default function Home({
  settings = {},
  navItems = [],
  sections = [],
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

  const noticeSection = findSection(sections, [
    "notice_board",
    "notices",
    "announcements",
  ]);

  const aboutSection = findSection(sections, [
    "about_section",
    "about",
    "vision_mission",
  ]);

  const gallerySection = findSection(sections, [
    "gallery",
    "gallery_preview",
  ]);

  const principalSection = findSection(sections, [
    "principal_message",
    "principal",
  ]);

  const admissionsSection = findSection(sections, [
    "admissions",
    "admission",
  ]);

  const calendarSection = findSection(sections, [
    "calendar",
    "school_calendar",
    "events",
  ]);

  const wallOfFameSection = findSection(sections, [
    "wall_of_fame",
    "recognition",
    "awards",
  ]);

  const sponsorsSection = findSection(sections, [
    "partners",
    "sponsors",
    "supporters",
  ]);

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

      {canRenderSection(showNotices, noticeSection, builderMode) && (
        <EditableSection
          section={noticeSection}
          sectionType="notice_board"
          label="Notice Board"
          builderMode={builderMode}
        >
          <NoticeBoard
            settings={settings}
            navItems={navItems}
            content={sectionContent(noticeSection)}
          />
        </EditableSection>
      )}

      <div className="container">
        {canRenderSection(showAboutSection, aboutSection, builderMode) && (
          <EditableSection
            section={aboutSection}
            sectionType="about_section"
            label="Vision, Mission & Values"
            builderMode={builderMode}
          >
            <AboutSection
              settings={settings}
              navItems={navItems}
              content={sectionContent(aboutSection)}
            />
          </EditableSection>
        )}

        {canRenderSection(showGalleryPreview, gallerySection, builderMode) && (
          <EditableSection
            section={gallerySection}
            sectionType="gallery"
            label="Gallery Preview"
            builderMode={builderMode}
          >
            <GalleryPreview
              settings={settings}
              navItems={navItems}
              content={sectionContent(gallerySection)}
            />
          </EditableSection>
        )}
      </div>

      {canRenderSection(showPrincipalMessage, principalSection, builderMode) && (
        <EditableSection
          section={principalSection}
          sectionType="principal_message"
          label="Principal's Message"
          builderMode={builderMode}
        >
          <PrincipalMessage
            settings={settings}
            navItems={navItems}
            content={sectionContent(principalSection)}
          />
        </EditableSection>
      )}

      {canRenderSection(showAdmissions, admissionsSection, builderMode) && (
        <EditableSection
          section={admissionsSection}
          sectionType="admissions"
          label="Admissions"
          builderMode={builderMode}
        >
          <Admissions
            settings={settings}
            navItems={navItems}
            content={sectionContent(admissionsSection)}
          />
        </EditableSection>
      )}

      {canRenderSection(showCalendar, calendarSection, builderMode) && (
        <EditableSection
          section={calendarSection}
          sectionType="calendar"
          label="School Calendar"
          builderMode={builderMode}
        >
          <SchoolCalendar
            settings={settings}
            navItems={navItems}
            content={sectionContent(calendarSection)}
          />
        </EditableSection>
      )}

      {canRenderSection(showWallOfFame, wallOfFameSection, builderMode) && (
        <EditableSection
          section={wallOfFameSection}
          sectionType="wall_of_fame"
          label="Academic Wall of Fame"
          builderMode={builderMode}
        >
          <WallOfFame
            settings={settings}
            navItems={navItems}
            content={sectionContent(wallOfFameSection)}
          />
        </EditableSection>
      )}

      {canRenderSection(showSponsors, sponsorsSection, builderMode) && (
        <EditableSection
          section={sponsorsSection}
          sectionType="partners"
          label="Partners & Supporters"
          builderMode={builderMode}
        >
          <Sponsors
            settings={settings}
            navItems={navItems}
            content={sectionContent(sponsorsSection)}
          />
        </EditableSection>
      )}
    </>
  );
}
