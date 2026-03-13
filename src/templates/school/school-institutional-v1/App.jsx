import React, { useEffect, useState } from "react";

import Topbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ScrollTopButton from "./components/common/ScrollTopButton";

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

import "./index.css";
import "./App.css";

const PAGE_COMPONENTS = {
  "/": Home,

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
  "/contact": Contact,
  "/digital-library": DigitalLibrary,
  "/schoolcalendar": SchoolCalendar,
  "/calendar/events": AllEvents,
};

/* ---------- FALLBACK PAGE ---------- */

function DefaultPageFallback({ sections = [] }) {
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

/* ---------- APP ---------- */

export default function App(props) {
  const {
    settings,
    navItems,
    page,
    sections = [],
    builderMode = false,
  } = props || {};

  const [currentSlug, setCurrentSlug] = useState(page?.slug || "/");

  /* ---------- NORMALIZE SLUG ---------- */

  const slug =
    currentSlug && currentSlug.startsWith("/")
      ? currentSlug
      : `/${currentSlug || ""}`;

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

  const pageContent =
    PageComponent === DefaultPageFallback ? (
      <DefaultPageFallback sections={sections} />
    ) : (
      <PageComponent
        sections={sections}
        builderMode={builderMode}
        settings={settings}
      />
    );

  /* ---------- RENDER ---------- */

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
        navigateTo={(slug) => {
          window.dispatchEvent(
            new CustomEvent("builder:navigate", { detail: slug })
          );
        }}
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