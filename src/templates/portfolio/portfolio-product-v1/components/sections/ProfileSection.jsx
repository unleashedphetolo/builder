import React from "react";
import EditablePortfolioSection from "../common/EditablePortfolioSection";
import SectionHeader from "../common/SectionHeader";

export default function ProfileSection({ data, builderMode = false }) {
  const section = data.sections.profile;
  const content = section.content;

  return (
    <EditablePortfolioSection builderMode={builderMode} section={section} sectionType="portfolio_personal_profile" label="Personal Profile" className="portfolio-section portfolio-profile-section">
      <div className="portfolio-container portfolio-split">
        <div>
          <SectionHeader eyebrow="About" title={content.full_name} subtitle={content.bio} />
          <div className="portfolio-highlight-list">
            {(content.highlights || []).map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
        <div className="portfolio-profile-card">
          <img src={content.image_url || data.assets.profileImage} alt="" />
          <h3>{content.professional_title}</h3>
          <p>{data.location}</p>
        </div>
      </div>
    </EditablePortfolioSection>
  );
}
