import React from "react";
import SectionHeader from "../common/SectionHeader";

export default function ClientsSection({ content }) {
  const items = Array.isArray(content.items) ? content.items : [];

  return (
    <section className="business-section business-clients-section">
      <div className="business-container">
        <SectionHeader eyebrow={content.eyebrow || "Trust"} title={content.section_title || "Clients & Testimonials"} subtitle={content.subtitle || content.description} />
        <div className="business-testimonial-grid">
          {items.map((item, index) => (
            <article className="business-testimonial" key={item.id || `${item.name}-${index}`}>
              {item.logo ? <img src={item.logo} alt={item.name || "Client"} /> : null}
              <p>{item.body || item.quote || "Trusted business partner with a professional delivery standard."}</p>
              <strong>{item.name}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
