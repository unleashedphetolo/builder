import React from "react";
import SectionHeader from "../common/SectionHeader";

export default function StatsSection({ content }) {
  const items = Array.isArray(content.items) ? content.items : [];

  return (
    <section className="business-section business-stats-section">
      <div className="business-container">
        <SectionHeader eyebrow="Performance" title={content.section_title || "Numbers That Build Confidence"} subtitle={content.subtitle} />
        <div className="business-stats-grid">
          {items.map((item, index) => (
            <div className="business-stat" key={item.id || `${item.label}-${index}`}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
