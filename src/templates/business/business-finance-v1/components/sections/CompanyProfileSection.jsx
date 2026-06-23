import React from "react";
import SectionHeader from "../common/SectionHeader";
import { getMedia } from "../../utils/media";

export default function CompanyProfileSection({ content, settings }) {
  const image = content.image_url || content.logo_url || getMedia(settings, "companyImage");

  return (
    <section className="business-section business-company-section">
      <div className="business-container business-split">
        <div>
          <SectionHeader
            eyebrow={content.eyebrow || content.industry || "Company Profile"}
            title={content.heading || content.company_name || content.section_title}
            subtitle={content.description || content.body}
          />
          <div className="business-meta-grid">
            <div><strong>{content.founded || "Established"}</strong><span>Founded</span></div>
            <div><strong>{content.industry || "Business"}</strong><span>Industry</span></div>
          </div>
        </div>
        <article className="business-feature-card business-feature-card--media">
          {image ? <img src={image} alt={content.company_name || "Company"} /> : null}
          <span>{content.logo_url ? "Company Identity" : "Enterprise Standard"}</span>
          <h3>{content.company_name || settings.site_name || "Your Business"}</h3>
          <p>{content.summary || "A professional presence designed to build trust and turn visitors into enquiries."}</p>
        </article>
      </div>
    </section>
  );
}
