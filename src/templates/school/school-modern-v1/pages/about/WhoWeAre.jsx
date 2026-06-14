import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../../components/common/Card";
import "../../styles/who-we-are.css";

const DEFAULT_PILLS = [
  "Learner Support",
  "Academic Excellence",
  "Discipline & Values",
];

const DEFAULT_STATS = [
  {
    id: "grades",
    value: "8–12",
    label: "Grades Offered",
  },
  {
    id: "community",
    value: "Community",
    label: "Partnership & Involvement",
  },
];

const DEFAULT_CARDS = [
  {
    id: "community",
    title: "Our Community",
    body:
      "We are a learner-centred secondary school committed to discipline, respect, and academic achievement—supported by teachers, parents, and community partners.",
    items: [
      "Safe, supportive learning environment",
      "Strong parent and community participation",
      "Respect, accountability, and growth",
    ],
  },
  {
    id: "leadership",
    title: "Our Leadership",
    body:
      "Our leadership promotes quality teaching, structured learner support, and transparent collaboration with parents and stakeholders.",
    items: [
      "Academic planning and performance monitoring",
      "Clear communication and accountability",
      "Support for educators and learners",
    ],
  },
  {
    id: "belief",
    title: "What We Believe",
    body:
      "Every learner can succeed with the right guidance, consistent effort, and a safe environment that builds confidence and character.",
    items: [
      "High expectations with learner support",
      "Values-driven behaviour and discipline",
      "Opportunities in academics, sport, and culture",
    ],
  },
];

export default function WhoWeAre({
  settings = {},
  content = {},
  section = null,
  builderMode = false,
}) {
  const schoolName =
    content?.school_name || settings?.school_name || "Modern Academy";

  const schoolImage =
    content?.image_url || "/images/school/school.jpg";

  const leftImage =
    content?.left_image_url || schoolImage;

  const rightImage =
    content?.right_image_url || schoolImage;

  const pills =
    Array.isArray(content?.pills) && content.pills.length > 0
      ? content.pills
      : DEFAULT_PILLS;

  const stats =
    Array.isArray(content?.stats) && content.stats.length > 0
      ? content.stats
      : DEFAULT_STATS;

  const cards =
    Array.isArray(content?.cards) && content.cards.length > 0
      ? content.cards
      : DEFAULT_CARDS;

  const pageContent = (
    <main className="wwa container">
      {/* Hero */}
      <header className="wwa-hero">
        <div className="wwa-hero-left">
          {/* School image */}
          <img
            src={leftImage}
            alt={content?.image_alt || schoolName}
            className="wwa-left-img"
            onError={(e) => (e.currentTarget.src = "/images/teachers.jpeg")}
          />

          <h1 className="wwa-title">
            {content?.section_title || "Who We Are"}
          </h1>

          <p className="wwa-subtitle">
            {content?.body ||
              content?.subtitle ||
              `${schoolName} is a learner-centred institution committed to academic excellence, discipline, and holistic development—supported by educators, parents, and community partners.`}
          </p>

          <div className="wwa-meta">
            {pills.map((pill, index) => (
              <span className="wwa-pill" key={`${pill}-${index}`}>
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="wwa-hero-right" aria-hidden="true">
          <img
            src={rightImage}
            alt={content?.image_alt || schoolName}
            className="wwa-hero-img"
            onError={(e) => (e.currentTarget.src = "/images/teachers.jpeg")}
          />
          <div className="wwa-badge">
            {content?.badge_label || "Official School Profile"}
          </div>

          {stats.map((stat, index) => (
            <div
              className="wwa-stat"
              key={stat.id || `${stat.label || "stat"}-${index}`}
            >
              <div className="wwa-stat-num">{stat.value || ""}</div>
              <div className="wwa-stat-label">{stat.label || ""}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Cards */}
      <section className="wwa-grid">
        {cards.map((card, index) => (
          <Card key={card.id || `${card.title || "card"}-${index}`}>
            <h2 className="wwa-card-title">{card.title || ""}</h2>
            <p className="wwa-text">{card.body || ""}</p>

            {Array.isArray(card.items) && card.items.length > 0 && (
              <ul className="wwa-list">
                {card.items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`}>{item}</li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </section>

      {/* Statement */}
      <section className="wwa-footer">
        <div className="wwa-callout">
          <h3 className="wwa-callout-title">
            {content?.commitment_title || "Our Commitment"}
          </h3>
          <p className="wwa-callout-text">
            {content?.commitment_body ||
              "We are committed to developing responsible, confident learners who are prepared for further education, training, and active citizenship."}
          </p>
        </div>
      </section>
    </main>
  );

  if (!section) {
    return pageContent;
  }

  if (!builderMode && section.visible === false) {
    return null;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="about_section"
      label="Who We Are"
      templateCategory="school"
      templateKey="school-modern-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
