import React, { useEffect, useState } from "react";

import Topbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ScrollTopButton from "./components/common/ScrollTopButton";
import SiteAnnouncementPopup from "./components/common/SiteAnnouncementPopup";
import BuilderSectionTarget from "../../../builder/BuilderSectionTarget";

import SGB from "./components/governance/SGB";
import AboutLanding from "./pages/About";
import AdmissionsLanding from "./pages/Admissions";
import SchoolLifeLanding from "./pages/SchoolLife";
import ResourcesLanding from "./pages/ResourcesLanding";
import DigitalLibrary from "./pages/DigitalLibrary";
import News from "./pages/News";
import Notices from "./pages/Notices";
import Gallery from "./pages/Gallery";
import Staff from "./pages/Staff";
import Facilities from "./pages/Facilities";
import RoboticsClub from "./pages/RoboticsClub";
import Contact from "./pages/Contact";
import AttendancePolicy from "./pages/AttendancePolicy";

import WhoWeAre from "./pages/about/WhoWeAre";
import VisionMission from "./pages/about/VisionMission";
import History from "./pages/about/History";

import LifeAcademics from "./pages/activities/Academics";
import LifeSports from "./pages/activities/Sports";
import LifeCulture from "./pages/activities/Culture";
import LifeFacilities from "./pages/activities/Facilities";

import SubjectChoices from "./pages/resources/SubjectChoices";
import TermPlan from "./pages/resources/TermPlan";
import ExamSchedule from "./pages/resources/ExamSchedule";
import CodeOfConduct from "./pages/resources/CodeOfConduct";
import StationaryList from "./pages/resources/StationaryList";
import SchoolCalendar from "./pages/SchoolCalendar";
import AllEvents from "./pages/AllEvents";

import Apply from "./pages/admissions/Apply";
import Requirements from "./pages/admissions/Requirements";
import HowToApply from "./pages/admissions/HowToApply";

import Home from "./pages/Home";
import WallOfFame from "./components/home/WallOfFame";
import Sponsors from "./components/home/Sponsors";
import Breadcrumbs from "./components/common/Breadcrumbs";

import "./index.css";
import "./App.css";
import "./styles/announcements.css";
import "./styles/template-theme-bridge.css";
import "./styles/modern-school-design.css";
import "./styles/school-modern-enterprise-polish.css";
import StudentDailyBulletin from "./pages/StudentDailyBulletin";

const PAGE_COMPONENTS = {
  "/": Home,

  /*
    Home-area records remain previewable from the builder Pages panel while
    their actual content sections are rendered by Home.jsx.
  */
  "/home/hero": Home,
  "/home/about-section": Home,
  "/home/gallery-preview": Home,
  "/home/principal-message": Home,
  "/home/quick-links": Home,
  "/home/latest-news": Home,
  "/home/events": Home,
  "/home/school-stats": Home,

  "/about": AboutLanding,
  "/about/who-we-are": WhoWeAre,
  "/about/vision-mission": VisionMission,
  "/about/history": History,

  "/staff": Staff,
  "/sgb": SGB,
  "/facilities": Facilities,
  "/attendance": AttendancePolicy,

  "/activities": SchoolLifeLanding,
  "/activities/academics": LifeAcademics,
  "/activities/sports": LifeSports,
  "/activities/culture": LifeCulture,
  "/activities/facilities": LifeFacilities,

  "/resources": ResourcesLanding,
  "/resources/subject-choices": SubjectChoices,
  "/resources/term-plan": TermPlan,
  "/resources/exam-schedule": ExamSchedule,
  "/resources/code-of-conduct": CodeOfConduct,
  "/resources/stationary-list": StationaryList,
  "/resources/calendar": SchoolCalendar,

  "/admissions": AdmissionsLanding,
  "/admissions/apply": Apply,
  "/admissions/requirements": Requirements,
  "/admissions/howtoapply": HowToApply,

  "/news": News,
  "/notices": Notices,
  "/gallery": Gallery,
  "/robotics": RoboticsClub,
  "/wall-of-fame": WallOfFame,
  "/sponsors": Sponsors,
  "/contact": Contact,
  "/digital-library": DigitalLibrary,
  "/bulletin": StudentDailyBulletin,
  "/schoolcalendar": SchoolCalendar,
  "/calendar/events": AllEvents,
};


function slugToPageClass(slug = "/") {
  const clean = String(slug || "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return clean ? `school-page--${clean}` : "school-page--home";
}

/* ---------- FALLBACK PAGE ---------- */

function DefaultPageFallback({ sections = [], builderMode = false }) {
  if (!sections.length) {
    return (
      <section className="builder-empty-page">
        <h2>Page Coming Soon</h2>
      </section>
    );
  }

  return (
    <>
      {sections.map((section) => (
        <BuilderSectionTarget
          key={section.id || section.section_key}
          builderMode={builderMode}
          section={section}
          sectionType={section.type}
          label={
            section?.content?.section_title ||
            section?.content?.title ||
            section?.type ||
            "Section"
          }
          templateCategory="school"
          templateKey="school-modern-v1"
          className="builder-section-anchor"
        >
          <section className="builder-fallback-section">
            <h2>
              {section?.content?.section_title ||
                section?.content?.title ||
                section?.type ||
                "Section"}
            </h2>
            <p>{section?.content?.subtitle || ""}</p>
          </section>
        </BuilderSectionTarget>
      ))}
    </>
  );
}

/* ---------- APP ---------- */

export default function App(props) {
  const {
    settings = {},
    navItems = [],
    page,
    sections = [],
    builderMode = false,
    previewMode = false,
  } = props || {};

  const [currentSlug, setCurrentSlug] = useState(page?.slug || "/");

  /* ---------- NORMALIZE SLUG ---------- */

  const slug =
    currentSlug && currentSlug.startsWith("/")
      ? currentSlug
      : `/${currentSlug || ""}`;

  const navigateTo = (nextSlug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", {
        detail: nextSlug || "/",
      }),
    );
  };

  /* ---------- LISTEN: iframe navigation ---------- */

  useEffect(() => {
    function handleMessage(e) {
      if (e.data?.type === "navigate") {
        const nextSlug = e.data.slug || "/";
        setCurrentSlug(nextSlug);
      }
    }

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  /* ---------- LISTEN: builder navigation ---------- */

  useEffect(() => {
    function handleBuilderNavigate(e) {
      const nextSlug = e.detail || "/";
      setCurrentSlug(nextSlug);
    }

    window.addEventListener("builder:navigate", handleBuilderNavigate);

    return () =>
      window.removeEventListener("builder:navigate", handleBuilderNavigate);
  }, []);

  /* ---------- SYNC WITH PAGE PROP ---------- */

  useEffect(() => {
    if (page?.slug) {
      setCurrentSlug(page.slug);
    }
  }, [page?.slug]);

  /* ---------- PAGE COMPONENT ---------- */

  const PageComponent = PAGE_COMPONENTS[slug] || DefaultPageFallback;
  const pageClassName = `school-modern-main ${slugToPageClass(slug)}`;

  /*
    In builder mode, hidden sections remain available so the Sections panel can
    turn them back on. On the public website, hidden sections are not rendered.
  */
  const renderableSections = builderMode
    ? sections
    : sections.filter((section) => section?.visible !== false);

  const primarySection = renderableSections[0] || null;

  const pageContent =
    PageComponent === DefaultPageFallback ? (
      <DefaultPageFallback
        sections={renderableSections}
        builderMode={builderMode}
      />
    ) : (
      <PageComponent
        section={primarySection}
        content={primarySection?.content || {}}
        sections={renderableSections}
        builderMode={builderMode}
        previewMode={previewMode}
        settings={settings}
        navItems={navItems}
      />
    );

  /* ---------- RENDER ---------- */

  return (
    <div className="school-modern-v1-root">
      <ScrollToTop />

      <Topbar
        settings={settings}
        navItems={navItems}
        socialLinks={settings?.social_links}
        socialDisplay={settings?.social_display}
        topbarLinks={settings?.topbar_links || []}
        navigateTo={navigateTo}
        currentSlug={slug}
        builderMode={builderMode}
        previewMode={previewMode}
      />

      <Navbar
        settings={settings}
        navItems={navItems}
        navigateTo={navigateTo}
        builderMode={builderMode}
        previewMode={previewMode}
      />

      <main
        className={pageClassName}
        data-page-slug={slug}
        data-builder-page-root={builderMode ? "1" : "0"}
      >
        {/* Breadcrumbs */}
        {slug !== "/" && <Breadcrumbs slug={slug} />}

        {pageContent}
      </main>

      <Footer
        settings={settings}
        navItems={navItems}
        socialLinks={settings?.social_links}
        socialDisplay={settings?.social_display}
        footerLinks={settings?.footer_links || []}
        navigateTo={navigateTo}
        builderMode={builderMode}
        previewMode={previewMode}
      />

      <SiteAnnouncementPopup
        settings={settings}
        currentSlug={slug}
        navigateTo={navigateTo}
      />

      <ScrollTopButton />
    </div>
  );
}