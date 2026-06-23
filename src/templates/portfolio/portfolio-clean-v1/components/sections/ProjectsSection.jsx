import React from "react";
import EditablePortfolioSection from "../common/EditablePortfolioSection";
import SectionHeader from "../common/SectionHeader";

export default function ProjectsSection({ data, builderMode = false }) {
  const section = data.sections.projects;
  const content = section.content;

  return (
    <EditablePortfolioSection builderMode={builderMode} section={section} sectionType="portfolio_projects" label="Projects" className="portfolio-section portfolio-projects-section">
      <div className="portfolio-container">
        <SectionHeader eyebrow="Selected Work" title={content.section_title} subtitle={content.subtitle} />
        <div className="portfolio-grid portfolio-grid--3">
          {(content.items || []).map((item, index) => (
            <article className="portfolio-card portfolio-project-card" key={`${item.title}-${index}`}>
              <img src={item.image_url || data.assets.projectImage} alt="" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                {item.link ? <a href={item.link}>View project</a> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </EditablePortfolioSection>
  );
}
