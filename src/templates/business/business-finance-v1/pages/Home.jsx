import React from "react";
import HeroSlider from "../components/home/HeroSlider";
import SectionRenderer from "../components/sections/SectionRenderer";

export default function Home({ settings, sections, navigateTo, builderMode, templateKey }) {
  return (
    <>
      <HeroSlider settings={settings} navigateTo={navigateTo} builderMode={builderMode} />
      <main className="business-page business-page--home">
        {sections.map((section) => (
          <SectionRenderer key={section.section_key || section.id} section={section} settings={settings} navigateTo={navigateTo} builderMode={builderMode} templateKey={templateKey} />
        ))}
      </main>
    </>
  );
}
