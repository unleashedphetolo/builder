import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import CalendarWidget from "../../components/common/CalendarWidget";
import Card from "../../components/common/Card";

export default function SchoolCalendar({ section = null, content = {}, builderMode = false }) {
  const pageContent = (
    <section className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <h2 className="section-title">{content?.section_title || content?.title || "School Calendar"}</h2>
      <Card>
        <p style={{ opacity: 0.9, marginBottom: 12 }}>
          {content?.subtitle ||
            "This is your calendar placeholder. Replace the items inside CalendarWidget or connect it to real events later."}
        </p>
        <CalendarWidget />
      </Card>
    </section>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_calendar"
      label={content?.section_title || content?.title || "School Calendar"}
      templateCategory="school"
      templateKey="school-institutional-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
