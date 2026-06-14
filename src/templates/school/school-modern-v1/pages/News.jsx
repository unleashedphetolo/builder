import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import LatestNews from "../components/home/LatestNews";

export default function News({
  settings = {},
  section = null,
  content = {},
  builderMode = false,
}) {
  const pageContent = (
    <div className="container" style={{ paddingTop: 10 }}>
      <h2 className="section-title">
        {content?.section_title || "Latest News"}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <LatestNews
          settings={settings}
          content={content}
        />
      </div>
    </div>
  );

  if (!section) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="latest_news"
      label={content?.section_title || "Latest News"}
      templateCategory="school"
      templateKey="school-modern-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
