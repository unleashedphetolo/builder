import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import "../../styles/life-culture.css";

const CULTURE_SECTIONS = [
  {
    title: "Leadership Development",
    text: "Learner leadership programmes promote responsibility, accountability, and disciplined representation of the school.",
  },
  {
    title: "Clubs & Societies",
    text: "Academic and creative clubs provide opportunities for innovation, teamwork, and skill development beyond the classroom.",
  },
  {
    title: "Cultural Activities",
    text: "Drama, music, debate, and heritage events foster confidence, expression, and appreciation of diversity.",
  },
  {
    title: "School Events",
    text: "Assemblies, award ceremonies, and special celebrations strengthen unity, pride, and school identity.",
  },
];

export default function LifeCulture({
  section = null,
  content = {},
  builderMode = false,
}) {
  const cultureSections =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : CULTURE_SECTIONS;

  const pageContent = (
    <main className="lc container">
      {/* Hero Section */}
      <header className="lc-hero">
        <div className="lc-hero-grid">
          {/* Left Text */}
          <div className="lc-hero-copy">
            <h1 className="lc-title">
              {content?.section_title || "Culture & Activities"}
            </h1>
            <p className="lc-subtitle">
              {content?.subtitle ||
                "Our cultural and co-curricular programmes build confident, responsible learners through leadership, creativity, and community participation."}
            </p>
          </div>

          {/* Right Image (from gallery4.jpg) */}
          <div className="lc-hero-media" aria-hidden="true">
            <img
              src={content?.image_url || "/images/gallery4.jpg"}
              alt={content?.image_alt || "School Culture Activities"}
              className="lc-hero-img"
              onError={(e) =>
                (e.currentTarget.src = "/images/gallery5.jpg")
              }
            />
          </div>
        </div>
      </header>

      {/* Culture Grid */}
      <section className="lc-grid">
        {cultureSections.map((item, index) => (
          <div
            key={item.id || item.title || `culture-section-${index}`}
            className="lc-card"
          >
            <h3 className="lc-card-title">{item.title || ""}</h3>
            <p className="lc-card-text">
              {item.body || item.text || ""}
            </p>
          </div>
        ))}
      </section>
    </main>
  );

  if (!section) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="services"
      label={content?.section_title || "Culture & Activities"}
      templateCategory="school"
      templateKey="school-modern-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
