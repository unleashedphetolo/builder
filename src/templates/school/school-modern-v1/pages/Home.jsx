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

export default function Home() {
  return (
    <>
      <Hero />
      <NoticeBoard />
      <div className="container">
        <AboutSection />
        <GalleryPreview />
      </div>
      <PrincipalMessage />
      <Admissions />
      <SchoolCalendar />
      <WallOfFame />
      <Sponsors />
    </>
  );
}
