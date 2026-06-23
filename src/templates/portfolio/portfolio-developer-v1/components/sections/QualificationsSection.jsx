import React from "react";
import EditablePortfolioSection from "../common/EditablePortfolioSection";
import SectionHeader from "../common/SectionHeader";

export default function QualificationsSection({ data, builderMode = false }) {
  const section = data.sections.qualifications;
  const content = section.content;

  return (
    <EditablePortfolioSection
      builderMode={builderMode}
      section={section}
      sectionType="portfolio_qualifications"
      label="Qualifications"
      className="portfolio-section portfolio-qualifications-section"
    >
      <div className="portfolio-container">
        <SectionHeader
          eyebrow="Credentials"
          title={content.section_title}
          subtitle={content.subtitle}
        />

        <div className="portfolio-grid portfolio-grid--3 portfolio-qualifications-grid">
          {(content.items || []).map((item, index) => (
            <article
              className="portfolio-card portfolio-qualification-card"
              key={`${item.title}-${index}`}
            >
              <span className="portfolio-qualification-icon" aria-hidden="true">
                {item.icon || "✓"}
              </span>
              <h3>{item.title}</h3>
              <strong>{item.institution}</strong>
              <small>{item.period}</small>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </EditablePortfolioSection>
  );
}
