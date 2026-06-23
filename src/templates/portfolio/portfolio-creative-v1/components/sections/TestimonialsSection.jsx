import React from "react";
import SectionHeader from "../common/SectionHeader";

export default function TestimonialsSection({ data }) {
  const content = data.sections.testimonials.content;
  return (
    <section className="portfolio-section portfolio-testimonials-section">
      <div className="portfolio-container">
        <SectionHeader eyebrow="Proof" title={content.section_title} subtitle={content.subtitle} />
        <div className="portfolio-grid portfolio-grid--3">
          {(content.items || []).map((item, index) => (
            <article className="portfolio-card" key={`${item.title}-${index}`}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
