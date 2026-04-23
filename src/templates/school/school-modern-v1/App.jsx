import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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

// import Events from "./pages/Events";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Staff from "./pages/Staff";
import Facilities from "./pages/Facilities";
import RoboticsClub from "./pages/RoboticsClub";
import Contact from "./pages/Contact";

// About sub-pages
import WhoWeAre from "./pages/about/WhoWeAre";
import VisionMission from "./pages/about/VisionMission";
import History from "./pages/about/History";

// School Life sub-pages
import LifeAcademics from "./pages/activities/Academics";
import LifeSports from "./pages/activities/Sports";
import LifeCulture from "./pages/activities/Culture";
import LifeFacilities from "./pages/activities/Facilities";

// Resources sub-pages
import SubjectChoices from "./pages/resources/SubjectChoices";
import TermPlan from "./pages/resources/TermPlan";
import ExamSchedule from "./pages/resources/ExamSchedule";
import CodeOfConduct from "./pages/resources/CodeOfConduct";
import StationaryList from "./pages/resources/StationaryList";
import SchoolCalendar from "./pages/SchoolCalendar";

// Admissions sub-pages
import Apply from "./pages/admissions/Apply";
import Requirements from "./pages/admissions/Requirements";
import Notices from "./pages/Notices";
import SGB from "./components/governance/SGB";
import StudentDailyBulletin from "./pages/StudentDailyBulletin";
import AttendancePolicy from "./pages/AttendancePolicy";
import AllEvents from "./pages/AllEvents";
import HowToApply from "./pages/admissions/HowToApply";
import ScrollTopButton from "./components/common/ScrollTopButton";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Topbar />
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* About */}
          <Route path="/about" element={<AboutLanding />} />
          <Route path="/about/who-we-are" element={<WhoWeAre />} />
          <Route path="/about/vision-mission" element={<VisionMission />} />
          <Route path="/about/history" element={<History />} />

          {/* Staff / Governance / Facilities */}
          <Route path="/staff" element={<Staff />} />
          <Route path="/sgb" element={<SGB />} />
          <Route path="/facilities" element={<Facilities />} />

          {/* Activities */}
          <Route path="/activities" element={<SchoolLifeLanding />} />
          <Route path="/activities/academics" element={<LifeAcademics />} />
          <Route path="/activities/sports" element={<LifeSports />} />
          <Route path="/activities/culture" element={<LifeCulture />} />
          <Route path="/activities/facilities" element={<LifeFacilities />} />

          {/* Resources */}
          <Route path="/resources" element={<ResourcesLanding />} />
          <Route
            path="/resources/subject-choices"
            element={<SubjectChoices />}
          />
          <Route path="/resources/term-plan" element={<TermPlan />} />
          <Route path="/resources/exam-schedule" element={<ExamSchedule />} />
          <Route
            path="/resources/code-of-conduct"
            element={<CodeOfConduct />}
          />
          <Route
            path="/resources/stationary-list"
            element={<StationaryList />}
          />
          <Route path="/resources/calendar" element={<SchoolCalendar />} />
          <Route path="/bulletin" element={<StudentDailyBulletin />} />
          <Route path="/attendance" element={<AttendancePolicy />} />
          <Route path="/calendar/events" element={<AllEvents />} />

          {/* Admissions */}
          <Route path="/admissions" element={<AdmissionsLanding />} />
          <Route path="/admissions/apply" element={<Apply />} />
          <Route path="/admissions/requirements" element={<Requirements />} />
          <Route path="/admissions/howtoapply" element={<HowToApply />} />

          {/* Core */}
          <Route path="/digital-library" element={<DigitalLibrary />} />
          {/* <Route path="/events" element={<Events />} /> */}
          <Route path="/schoolcalendar" element={<SchoolCalendar />} />
          <Route path="/news" element={<News />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/robotics" element={<RoboticsClub />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/notices" element={<Notices />} />

          {/* Back-compat for old links */}
          <Route path="/quicklinks" element={<Navigate to="/" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <ScrollTopButton />
    </Router>
  );
}

function NotFound() {
  return (
    <section className="container" style={{ padding: "3rem 0" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: ".5rem" }}>
        Page not found
      </h1>
      <p style={{ opacity: 0.85, marginBottom: "1rem" }}>
        The page you are looking for doesn’t exist, or the link has changed.
      </p>
      <a href="/" style={{ color: "#0b5cff", fontWeight: 700 }}>
        Go back home
      </a>
    </section>
  );
}

export default App;
