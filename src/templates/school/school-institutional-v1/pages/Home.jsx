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

function GenericSectionRenderer({ section }) {
  const c = section?.content || {};

  switch (section?.type) {
    case "hero":
      return (
        <section className="builder-fallback-section">
          <h1>{c.title || "Hero title"}</h1>
          <p>{c.subtitle || "Hero subtitle"}</p>
        </section>
      );

    case "announcements":
    case "notices":
      return (
        <section className="builder-fallback-section">
          <h2>{c.title || "Notice Board"}</h2>
          <p>{c.subtitle || "Latest updates"}</p>
        </section>
      );

    case "about":
    case "gallery":
    case "featured":
    case "contact":
    case "admissions":
    case "calendar":
    case "news":
    case "resources":
    case "staff":
    case "facilities":
    case "activities":
    case "governance":
    case "events":
    case "robotics":
    case "digital-library":
    default:
      return (
        <section className="builder-fallback-section">
          <h2>{c.title || section?.type || "Section"}</h2>
          <p>{c.subtitle || ""}</p>
        </section>
      );
  }
}

function LiveSectionMap({ sections = [] }) {
  return (
    <>
      {sections.map((section) => (
        <div
          key={section.id}
          data-builder-section-id={section.id}
          data-builder-section-type={section.type}
          className="builder-section-anchor"
        >
          <GenericSectionRenderer section={section} />
        </div>
      ))}
    </>
  );
}

export default function Home({ sections = [], builderMode = false, settings = {} }) {
  const hasLiveSections = Array.isArray(sections) && sections.length > 0;

  if (hasLiveSections) {
    return <LiveSectionMap sections={sections} />;
  }

  return (
    <>
      <Hero settings={settings}/>
      <NoticeBoard settings={settings}/>
      <div className="container">
        <AboutSection settings={settings}/>
        <GalleryPreview settings={settings}/>
      </div>
      <PrincipalMessage settings={settings} />
      <Admissions settings={settings}/>
      <SchoolCalendar settings={settings}/>
      <WallOfFame settings={settings}/>
      <Sponsors settings={settings}/>
    </>
  );
}