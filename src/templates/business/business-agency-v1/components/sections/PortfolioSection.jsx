import React from "react";
import BusinessLink from "../common/BusinessLink";
import SectionHeader from "../common/SectionHeader";

export default function PortfolioSection({ content, settings, navigateTo, builderMode }) {
  const items = Array.isArray(content.items) ? content.items : [];
  const fallbackImages = settings.media?.portfolioImages || [];

  return (
    <section className="business-section business-portfolio-section">
      <div className="business-container">
        <SectionHeader eyebrow={content.eyebrow || "Portfolio"} title={content.section_title || "Selected Work"} subtitle={content.subtitle || content.description} />
        <div className="business-portfolio-grid">
          {items.map((item, index) => {
            const image = item.image_url || fallbackImages[index % Math.max(fallbackImages.length, 1)] || "";
            return (
              <article className="business-portfolio-card" key={item.id || `${item.title}-${index}`}>
                {image ? <img src={image} alt={item.image_alt || item.title || "Portfolio item"} /> : null}
                <div>
                  <h3>{item.title}</h3>
                  {item.body || item.description ? <p>{item.body || item.description}</p> : null}
                  {item.link ? <BusinessLink settings={settings} navigateTo={navigateTo} builderMode={builderMode} href={item.link}>View project</BusinessLink> : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
