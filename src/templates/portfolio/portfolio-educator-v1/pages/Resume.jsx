import React from "react";
import PageHeader from "../components/common/PageHeader";
import ExperienceSection from "../components/sections/ExperienceSection";
import SkillsSection from "../components/sections/SkillsSection";
import QualificationsSection from "../components/sections/QualificationsSection";

export default function Resume({ data, builderMode }) {
  return (
    <>
      <PageHeader
        title="Resume"
        subtitle="Experience, qualifications, skills and professional background presented clearly for clients and recruiters."
      />

      <section className="portfolio-section portfolio-resume-download-section">
        <div className="portfolio-container portfolio-resume-download-card">
          <div>
            <span className="portfolio-eyebrow">Resume Download</span>
            <h2>Download a professional resume</h2>
            <p>
              Use this button for a CV, resume or professional profile document.
              Replace the fallback file with the real uploaded resume in the builder.
            </p>
          </div>

          <a
            className="portfolio-btn portfolio-btn--primary portfolio-resume-download"
            href={data.resumeUrl}
            download
          >
            Download Resume
          </a>
        </div>
      </section>

      <ExperienceSection data={data} builderMode={builderMode} />
      <QualificationsSection data={data} builderMode={builderMode} />
      <SkillsSection data={data} builderMode={builderMode} />
    </>
  );
}
