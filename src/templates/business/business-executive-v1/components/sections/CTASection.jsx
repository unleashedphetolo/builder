import React from "react";
import BusinessLink from "../common/BusinessLink";

export default function CTASection({ content, settings, navigateTo, builderMode }) {
  const bg = content.background_image || settings.media?.ctaImage;

  return (
    <section className="business-section business-cta-section">
      <div className="business-container">
        <div className="business-cta" style={bg ? { backgroundImage: `linear-gradient(135deg, rgba(15,23,42,.88), rgba(18,60,124,.82)), url(${bg})` } : undefined}>
          <span className="business-eyebrow">{content.eyebrow || "Next Step"}</span>
          <h2>{content.heading || content.section_title}</h2>
          <p>{content.description || content.body}</p>
          <div className="business-actions">
            {content.primary_button_label ? (
              <BusinessLink settings={settings} navigateTo={navigateTo} builderMode={builderMode} href={content.primary_button_href || "/contact"} className="business-btn business-btn--primary">
                {content.primary_button_label}
              </BusinessLink>
            ) : null}
            {content.secondary_button_label ? (
              <BusinessLink settings={settings} navigateTo={navigateTo} builderMode={builderMode} href={content.secondary_button_href || "/services"} className="business-btn business-btn--secondary">
                {content.secondary_button_label}
              </BusinessLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
