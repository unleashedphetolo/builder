import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../../components/common/Card";
import "../../styles/history.css";

const HIGHLIGHTS = [
  {
    title: "Academic Focus",
    text: "Strong teaching culture, discipline, and learner support across all grades.",
  },
  {
    title: "Learner Development",
    text: "Sports, culture, and leadership programmes that build confidence and character.",
  },
  {
    title: "Community Partnership",
    text: "Working closely with parents, local stakeholders, and the School Governing Body.",
  },
  {
    title: "Future-Ready",
    text: "Continuous improvement through innovation, technology, and learner-centred growth.",
  },
];

const TIMELINE = [
  {
    year: "1990",
    title: "School Established",
    text: "Founded to serve the growing demand for quality secondary education.",
  },
  {
    year: "2002",
    title: "Facilities Expanded",
    text: "Additional classrooms and improved learning infrastructure introduced.",
  },
  {
    year: "2012",
    title: "Learner Support Strengthened",
    text: "Guidance, academic support, and school systems improved.",
  },
  {
    year: "2020",
    title: "Modernisation",
    text: "Improved school operations and stronger academic focus for consistency.",
  },
  {
    year: "Today",
    title: "Building Excellence",
    text: "A renewed commitment to results, discipline, and learner development.",
  },
];

const PRINCIPALS = [
  {
    name: "P. Mathibe",
    years: "2021 – Present",
    image: "/images/principals/mathibe.jpg",
  },
  {
    name: "M. Dlamini",
    years: "2010 – 2020",
    image: "/images/principals/dlamini.jpg",
  },
  {
    name: "T. Nkosi",
    years: "1996 – 2009",
    image: "/images/principals/nkosi.jpg",
  },
];

const GALLERY = [
  { src: "/images/school/history-1.jpg", alt: "School campus view" },
  { src: "/images/school/history-2.jpg", alt: "Learners in activity" },
  { src: "/images/school/history-3.jpg", alt: "School event moment" },
];

const BADGES = [
  "Discipline",
  "Academic Excellence",
  "Leadership",
  "Community",
];

const STATS = [
  { id: "established", value: "1990", label: "Established" },
  { id: "grades", value: "8–12", label: "Grades" },
  { id: "community", value: "Sebone", label: "Community" },
];

export default function History({
  section = null,
  content = {},
  builderMode = false,
}) {
  const highlights =
    Array.isArray(content?.highlights) && content.highlights.length > 0
      ? content.highlights
      : HIGHLIGHTS;

  const timeline =
    Array.isArray(content?.timeline) && content.timeline.length > 0
      ? content.timeline
      : Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : TIMELINE;

  const principals =
    Array.isArray(content?.principals) && content.principals.length > 0
      ? content.principals
      : PRINCIPALS;

  const gallery =
    Array.isArray(content?.gallery) && content.gallery.length > 0
      ? content.gallery
      : GALLERY;

  const badges =
    Array.isArray(content?.badges) && content.badges.length > 0
      ? content.badges
      : BADGES;

  const stats =
    Array.isArray(content?.stats) && content.stats.length > 0
      ? content.stats
      : STATS;

  const pageContent = (
    <main className="history-page container">
      {/* HERO */}
      <header className="history-hero">
        <div className="history-hero-left">
          <h2 className="section-title">
            {content?.section_title || "Our History"}
          </h2>
          <p className="history-subtitle">
            {content?.subtitle ||
              "M.O.M Sebone Secondary School is built on a foundation of discipline, respect, and academic progress — strengthened by community partnership and a commitment to preparing learners for the future."}
          </p>

          <div className="history-badges" aria-label="School values badges">
            {badges.map((badge, index) => (
              <span key={`${badge}-${index}`} className="history-badge">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="history-hero-right">
          <div className="history-hero-card">
            <div className="history-hero-label">
              {content?.profile_label || "Institutional Profile"}
            </div>

            <div className="history-stats">
              {stats.map((stat, index) => (
                <div
                  key={stat.id || `${stat.label || "history-stat"}-${index}`}
                  className="history-stat"
                >
                  <div className="history-stat-num">{stat.value || ""}</div>
                  <div className="history-stat-lbl">{stat.label || ""}</div>
                </div>
              ))}
            </div>

            <div className="history-hero-note">
              {content?.profile_note ||
                "Update numbers and details anytime to match your official records."}
            </div>
          </div>
        </div>
      </header>

      {/* HIGHLIGHTS */}
      <section className="history-section">
        <div className="history-section-head">
          <h3 className="history-h3">
            {content?.highlights_title || "Key Highlights"}
          </h3>
          <p className="history-muted">
            {content?.highlights_subtitle ||
              "The pillars that shaped the school’s identity and growth."}
          </p>
        </div>

        <div className="history-grid">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.id || `${highlight.title || "highlight"}-${index}`}
              className="history-mini-card"
            >
              <div className="history-mini-title">{highlight.title || ""}</div>
              <div className="history-mini-text">
                {highlight.text || highlight.body || ""}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="history-section">
        <div className="history-section-head">
          <h3 className="history-h3">
            {content?.timeline_title || "Milestones Timeline"}
          </h3>
          <p className="history-muted">
            {content?.timeline_subtitle ||
              "A structured view of progress and growth over time."}
          </p>
        </div>

        <Card>
          <div className="history-timeline">
            {timeline.map((item, index) => (
              <div
                key={item.id || `${item.year || ""}${item.title || ""}-${index}`}
                className="history-item"
              >
                <div className="history-dot" aria-hidden="true" />
                <div className="history-year">{item.year || ""}</div>
                <div className="history-content">
                  <div className="history-title">{item.title || ""}</div>
                  <div className="history-text">
                    {item.text || item.body || ""}
                  </div>
                </div>
                {index !== timeline.length - 1 && (
                  <div className="history-line" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* LEADERSHIP */}
      <section className="history-section">
        <div className="history-section-head">
          <h3 className="history-h3">
            {content?.leadership_title || "Leadership Over Time"}
          </h3>
          <p className="history-muted">
            {content?.leadership_subtitle ||
              "Add official leadership history as your records are confirmed."}
          </p>
        </div>

        <div className="history-leadership">
          {principals.map((principal, index) => (
            <div
              key={principal.id || `${principal.name || "principal"}-${index}`}
              className="history-leader"
            >
              <div className="history-leader-image">
                <img
                  src={principal.image || principal.image_url || ""}
                  alt={principal.name || ""}
                  onError={(event) => {
                    event.currentTarget.src = "/images/teachers.jpeg";
                  }}
                />
              </div>

              <div className="history-leader-name">
                {principal.name || ""}
              </div>

              <div className="history-leader-years">
                {principal.role || "Principal"} ({principal.years || ""})
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="history-section">
        <div className="history-section-head">
          <h3 className="history-h3">
            {content?.gallery_title || "Gallery"}
          </h3>
          <p className="history-muted">
            {content?.gallery_subtitle ||
              "Optional: add images to highlight school growth and achievements."}
          </p>
        </div>

        <div className="history-gallery">
          {gallery.map((image, index) => (
            <div
              key={image.id || image.src || image.image_url || `history-image-${index}`}
              className="history-photo"
            >
              <img
                src={image.src || image.image_url || ""}
                alt={image.alt || image.title || ""}
                onError={(event) => {
                  event.currentTarget.src = "/images/teachers.jpeg";
                }}
              />
            </div>
          ))}
        </div>

        <div className="history-footnote">
          {content?.gallery_footnote || (
            <>
              Tip: Put images in <code>public/images/school/</code> and keep
              filenames simple.
            </>
          )}
        </div>
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
      sectionType="process"
      label={content?.section_title || "Our History"}
      templateCategory="school"
      templateKey="school-institutional-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
