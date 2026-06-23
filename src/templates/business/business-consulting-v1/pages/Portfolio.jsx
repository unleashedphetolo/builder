import React from "react";
import PageHeader from "../components/common/PageHeader";
import SectionRenderer from "../components/sections/SectionRenderer";

export default function Portfolio({ settings, page, sections, navigateTo, builderMode, templateKey }) {
  return (
    <>
      <PageHeader page={page} />
      <main className="business-page business-page--portfolio">
        {sections.map((section) => (
          <SectionRenderer key={section.section_key || section.id} section={section} settings={settings} navigateTo={navigateTo} builderMode={builderMode} templateKey={templateKey} />
        ))}
      </main>
    </>
  );
}
