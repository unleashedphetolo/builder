import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import "../../styles/life-academics.css";

const ACADEMIC_SECTIONS = [
  {
    title: "Curriculum Excellence",
    text: "Our curriculum is aligned with the National Curriculum Statement (CAPS) and is delivered by qualified educators committed to academic excellence and learner development.",
  },
  {
    title: "Subject Support & Enrichment",
    text: "We provide structured extra lessons, revision sessions, study groups, and targeted intervention programmes to support learner progress and performance improvement.",
  },
  {
    title: "Assessment & Examination Culture",
    text: "Learners benefit from continuous assessment, structured feedback, term tests, and formal examinations that prepare them effectively for Grade 12 final assessments.",
  },
  {
    title: "STEM & Digital Learning",
    text: "Our academic programme integrates science, technology, mathematics, and digital literacy to equip learners with 21st-century skills.",
  },
  {
    title: "Career Guidance & Subject Choices",
    text: "We assist learners in selecting subjects aligned with their strengths, interests, and future career aspirations, ensuring informed academic decisions.",
  },
  {
    title: "Academic Performance Monitoring",
    text: "Learner progress is monitored throughout the year through data-driven performance tracking and structured parental engagement.",
  },
];

export default function LifeAcademics({
  section = null,
  content = {},
  builderMode = false,
}) {
  const academicSections =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : ACADEMIC_SECTIONS;

  const pageContent = (
    <main className="la container">
      {/* Hero Section */}
      <header className="la-hero">
        <div className="la-hero-grid">
          {/* Left: Text */}
          <div className="la-hero-copy">
            <h1 className="la-title">
              {content?.section_title || "Academic Programme"}
            </h1>
            <p className="la-subtitle">
              {content?.subtitle ||
                "M.O.M Sebone Secondary School is committed to maintaining high academic standards, fostering discipline, and preparing learners for tertiary education and responsible citizenship."}
            </p>
          </div>

          {/* Right: Academic Image (from gallery22.jpg) */}
          <div className="la-hero-media" aria-hidden="true">
            <img
              src={content?.image_url || "/images/gallery22.jpg"}
              alt={content?.image_alt || "Classroom Activity"}
              className="la-hero-img"
              onError={(e) => (e.currentTarget.src = "/images/gallery1.jpg")}
            />
          </div>
        </div>
      </header>

      {/* Academic Grid */}
      <section className="la-grid">
        {academicSections.map((item, index) => (
          <div
            key={item.id || item.title || `academic-section-${index}`}
            className="la-card"
          >
            <h3 className="la-card-title">{item.title || ""}</h3>
            <p className="la-card-text">
              {item.body || item.text || ""}
            </p>
          </div>
        ))}
      </section>

      {/* Academic Commitment */}
      <section className="la-commitment">
        <div className="la-commitment-box">
          <h3 className="la-commitment-title">
            {content?.commitment_title || "Our Academic Commitment"}
          </h3>
          <p className="la-commitment-text">
            {content?.commitment_body ||
              "We strive to cultivate disciplined, confident, and high-performing learners through structured teaching, academic support, and strong school–parent partnerships."}
          </p>
        </div>
      </section>
    </main>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_academics"
      label={content?.section_title || "Academic Programme"}
      templateCategory="school"
      templateKey="school-institutional-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
