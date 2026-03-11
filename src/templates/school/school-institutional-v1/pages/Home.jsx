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

export default function Home({ settings = {} }) {
  return (
    <>
      <Hero settings={settings} />
      <NoticeBoard settings={settings} />
      <div className="container">
        <AboutSection settings={settings} />
        <GalleryPreview settings={settings} />
      </div>
      <PrincipalMessage settings={settings} />
      <Admissions settings={settings} />
      <SchoolCalendar settings={settings} />
      <WallOfFame settings={settings} />
      <Sponsors settings={settings} />
    </>
  );
}