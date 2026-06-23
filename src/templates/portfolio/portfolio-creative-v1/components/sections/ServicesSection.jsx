import React from "react";
import SectionHeader from "../common/SectionHeader";

export default function ServicesSection({ data }) {
  const content = data.sections.services.content;
  return (
    <section className="portfolio-section portfolio-services-section">
      <div className="portfolio-container">
        <SectionHeader eyebrow="Services" title={content.section_title} subtitle={content.subtitle} align="center" />
        <div className="portfolio-grid portfolio-grid--3">
          {(content.items || []).map((item, index) => (
            <article className="portfolio-card portfolio-service-card" key={`${item.title}-${index}`}>
              <span className="portfolio-service-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
