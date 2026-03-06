import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTenant } from "../../../site/TenantContext";
import { mergeSchoolFeatures } from "../../../site/featureDefaults";

import ScrollToTop from "./components/layout/ScrollToTop";
import Topbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import AboutLanding from "./pages/About";
import AdmissionsLanding from "./pages/Admissions";
import SchoolLifeLanding from "./pages/SchoolLife";
import DigitalLibrary from "./pages/DigitalLibrary";
import ResourcesLanding from "./pages/ResourcesLanding";

import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Staff from "./pages/Staff";
import Facilities from "./pages/Facilities";
import RoboticsClub from "./pages/RoboticsClub";
import Contact from "./pages/Contact";

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

import Apply from "./pages/admissions/Apply";
import Requirements from "./pages/admissions/Requirements";
import HowToApply from "./pages/admissions/HowToApply";

import Notices from "./pages/Notices";
import SGB from "./components/governance/SGB";
import StudentDailyBulletin from "./pages/StudentDailyBulletin";
import AttendancePolicy from "./pages/AttendancePolicy";
import AllEvents from "./pages/AllEvents";
import ScrollTopButton from "./components/common/ScrollTopButton";

// Styles (keep them inside /site route; best viewed via iframe in the builder)
import "./index.css";
import "./App.css";

function NotFound() {
  return (
    <section className="container" style={{ padding: "3rem 0" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: ".5rem" }}>Page not found</h1>
      <p style={{ opacity: 0.85, marginBottom: "1rem" }}>
        The page you are looking for doesn’t exist, or the link has changed.
      </p>
      <a href="/#/site/" style={{ color: "#0b5cff", fontWeight: 700 }}>
        Go back home
      </a>
    </section>
  );
}

export default function InstitutionalSchoolSite() {
  const { settings } = useTenant();
  const f = mergeSchoolFeatures(settings?.features);

  const IfOn = (flag, element) => (flag ? element : <Navigate to="/site/" replace />);

  return (
    <>
      <ScrollToTop />
      <Topbar />
      <Navbar />

      <main>
        <Routes>
          <Route path="/site/" element={<Home />} />
          <Route path="/site" element={<Home />} />

          {/* About */}
          <Route path="/site/about" element={IfOn(f.about, <AboutLanding />)} />
          <Route path="/site/about/who-we-are" element={IfOn(f.about, <WhoWeAre />)} />
          <Route path="/site/about/vision-mission" element={IfOn(f.about, <VisionMission />)} />
          <Route path="/site/about/history" element={IfOn(f.about, <History />)} />

          {/* Staff / Governance / Facilities */}
          <Route path="/site/staff" element={IfOn(f.staff, <Staff />)} />
          <Route path="/site/sgb" element={IfOn(f.governance, <SGB />)} />
          <Route path="/site/facilities" element={IfOn(f.facilities, <Facilities />)} />

          {/* Activities */}
          <Route path="/site/activities" element={IfOn(f.activities, <SchoolLifeLanding />)} />
          <Route path="/site/activities/academics" element={IfOn(f.activities, <LifeAcademics />)} />
          <Route path="/site/activities/sports" element={IfOn(f.activities, <LifeSports />)} />
          <Route path="/site/activities/culture" element={IfOn(f.activities, <LifeCulture />)} />
          <Route path="/site/activities/facilities" element={IfOn(f.activities, <LifeFacilities />)} />

          {/* Resources */}
          <Route path="/site/resources" element={IfOn(f.resources, <ResourcesLanding />)} />
          <Route path="/site/resources/subject-choices" element={IfOn(f.resources, <SubjectChoices />)} />
          <Route path="/site/resources/term-plan" element={IfOn(f.resources, <TermPlan />)} />
          <Route path="/site/resources/exam-schedule" element={IfOn(f.resources, <ExamSchedule />)} />
          <Route path="/site/resources/code-of-conduct" element={IfOn(f.resources, <CodeOfConduct />)} />
          <Route path="/site/resources/stationary-list" element={IfOn(f.resources, <StationaryList />)} />
          <Route path="/site/resources/calendar" element={IfOn(f.resources, <SchoolCalendar />)} />

          <Route path="/site/bulletin" element={IfOn(f.bulletin, <StudentDailyBulletin />)} />
          <Route path="/site/attendance" element={IfOn(f.attendancePolicy, <AttendancePolicy />)} />
          <Route path="/site/calendar/events" element={IfOn(f.events, <AllEvents />)} />

          {/* Admissions */}
          <Route path="/site/admissions" element={IfOn(f.admissions, <AdmissionsLanding />)} />
          <Route path="/site/admissions/apply" element={IfOn(f.admissions, <Apply />)} />
          <Route path="/site/admissions/requirements" element={IfOn(f.admissions, <Requirements />)} />
          <Route path="/site/admissions/howtoapply" element={IfOn(f.admissions, <HowToApply />)} />

          {/* Core */}
          <Route path="/site/digital-library" element={IfOn(f.digitalLibrary, <DigitalLibrary />)} />
          <Route path="/site/schoolcalendar" element={IfOn(f.events, <SchoolCalendar />)} />
          <Route path="/site/news" element={IfOn(f.news, <News />)} />
          <Route path="/site/gallery" element={IfOn(f.gallery, <Gallery />)} />
          <Route path="/site/robotics" element={IfOn(f.robotics, <RoboticsClub />)} />
          <Route path="/site/contact" element={IfOn(f.contact, <Contact />)} />
          <Route path="/site/notices" element={IfOn(f.notices, <Notices />)} />

          {/* Back-compat for old links */}
          <Route path="/site/quicklinks" element={<Navigate to="/site/" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <ScrollTopButton />
    </>
  );
}
