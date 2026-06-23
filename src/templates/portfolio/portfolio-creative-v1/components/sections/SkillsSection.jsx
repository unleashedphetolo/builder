import React from "react";
import EditablePortfolioSection from "../common/EditablePortfolioSection";
import SectionHeader from "../common/SectionHeader";

export default function SkillsSection({ data, builderMode = false }) {
  const section = data.sections.skills;
  const content = section.content;

  return (
    <EditablePortfolioSection builderMode={builderMode} section={section} sectionType="portfolio_skills" label="Skills" className="portfolio-section portfolio-skills-section">
      <div className="portfolio-container">
        <SectionHeader eyebrow="Skills" title={content.section_title} subtitle={content.subtitle} align="center" />
        <div className="portfolio-grid portfolio-grid--4">
          {(content.items || []).map((item, index) => (
            <article className="portfolio-card portfolio-skill-card" key={`${item.title}-${index}`}>
              <span>{item.level || "Professional"}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </EditablePortfolioSection>
  );
}
