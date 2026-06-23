import React from "react";
import EditablePortfolioSection from "../common/EditablePortfolioSection";
import SectionHeader from "../common/SectionHeader";

export default function ExperienceSection({ data, builderMode = false }) {
  const section = data.sections.experience;
  const content = section.content;

  return (
    <EditablePortfolioSection builderMode={builderMode} section={section} sectionType="portfolio_experience" label="Experience" className="portfolio-section portfolio-experience-section">
      <div className="portfolio-container">
        <SectionHeader eyebrow="Resume" title={content.section_title} subtitle={content.subtitle} />
        <div className="portfolio-timeline">
          {(content.items || []).map((item, index) => (
            <article className="portfolio-card portfolio-timeline-item" key={`${item.title}-${index}`}>
              <span>{item.period}</span>
              <h3>{item.title}</h3>
              <strong>{item.company}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </EditablePortfolioSection>
  );
}
