import React from "react";
import SectionHeader from "../common/SectionHeader";

export default function TeamSection({ content, settings }) {
  const items = Array.isArray(content.items) ? content.items : [];
  const fallbackImages = settings.media?.teamImages || [];

  return (
    <section className="business-section business-team-section">
      <div className="business-container">
        <SectionHeader eyebrow="Leadership" title={content.section_title || "Meet the Team"} subtitle={content.subtitle || content.description} />
        <div className="business-team-grid">
          {items.map((item, index) => {
            const image = item.image_url || fallbackImages[index % Math.max(fallbackImages.length, 1)] || "";
            return (
              <article className="business-team-card" key={item.id || `${item.name}-${index}`}>
                {image ? <img className="business-avatar-img" src={image} alt={item.name || "Team member"} /> : <div className="business-avatar">{String(item.name || "T").slice(0, 1)}</div>}
                <h3>{item.name}</h3>
                <span>{item.role}</span>
                <p>{item.bio}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
