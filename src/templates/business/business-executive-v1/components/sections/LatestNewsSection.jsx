import React from "react";
import SectionHeader from "../common/SectionHeader";

export default function LatestNewsSection({ content }) {
  const items = Array.isArray(content.items) ? content.items : [];

  return (
    <section className="business-section business-insights-section">
      <div className="business-container">
        <SectionHeader eyebrow={content.eyebrow || "Insights"} title={content.section_title || "Latest Insights"} subtitle={content.subtitle || content.description} />
        <div className="business-news-grid">
          {items.map((item, index) => (
            <article className="business-news-card" key={item.id || `${item.title}-${index}`}>
              <span>{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.body || item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
