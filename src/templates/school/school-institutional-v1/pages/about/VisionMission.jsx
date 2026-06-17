import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import AboutSection from "../../components/home/AboutSection";

export default function VisionMission({
  section = null,
  content = {},
  builderMode = false,
}) {
  const pageContent = (
    <section
      className="container"
      style={{ paddingTop: 10, paddingBottom: 40 }}
    >
      <h2 className="section-title">
        {content?.section_title || "Vision & Mission"}
      </h2>
      <AboutSection content={content} />
    </section>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_vision_mission"
      label={content?.section_title || "Vision & Mission"}
      templateCategory="school"
      templateKey="school-institutional-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
