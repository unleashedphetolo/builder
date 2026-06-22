import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import EventsList from "../components/home/EventsList";

export default function Events({ section = null, content = {}, builderMode = false }) {
  const pageContent = (
    <div className="container" style={{ paddingTop: 28 }}>
      <h2 className="section-title">{content?.section_title || content?.title || "School Calendar & Events"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <EventsList />
      </div>
    </div>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_all_events"
      label={content?.section_title || content?.title || "School Calendar & Events"}
      templateCategory="school"
      templateKey="school-sports-academy-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
