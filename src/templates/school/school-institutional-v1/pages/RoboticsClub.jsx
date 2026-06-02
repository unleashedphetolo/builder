import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const DEFAULT_LEARNING_ITEMS = [
  "Basic electronics & sensors",
  "Programming logic & control",
  "Design thinking & teamwork",
  "Competition preparation",
];

export default function RoboticsClub({
  section = null,
  content = {},
  builderMode = false,
}) {
  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug }),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const learningItems =
    Array.isArray(content?.learning_items) && content.learning_items.length > 0
      ? content.learning_items
      : DEFAULT_LEARNING_ITEMS;

  const pageContent = (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
      <h2 className="section-title">
        {content?.section_title || "Robotics Club"}
      </h2>

      <p style={{ opacity: 0.85, maxWidth: 900, marginBottom: 18 }}>
        {content?.subtitle ||
          "The Robotics Club develops problem-solving, teamwork and engineering skills through hands-on projects, coding and competitions."}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <Card>
          <h3>{content?.learning_title || "What You Learn"}</h3>
          <ul style={{ marginTop: 8, paddingLeft: 18, opacity: 0.9 }}>
            {learningItems.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3>{content?.projects_title || "Projects"}</h3>
          <p style={{ opacity: 0.85 }}>
            {content?.projects_body ||
              "Build line-followers, obstacle robots, mini automation systems, and creative prototypes."}
          </p>
        </Card>

        <Card>
          <h3>{content?.competitions_title || "Competitions"}</h3>
          <p style={{ opacity: 0.85 }}>
            {content?.competitions_body ||
              "Represent the school and learn confidence through challenges, presentations and teamwork."}
          </p>
        </Card>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button
          onClick={() => navigate(content?.primary_button_href || "/contact")}
          variant="primary"
        >
          {content?.primary_button_label || "Join the club"}
        </Button>

        <Button
          onClick={() => navigate(content?.secondary_button_href || "/gallery")}
          variant="outline"
        >
          {content?.secondary_button_label || "See school gallery"}
        </Button>
      </div>
    </section>
  );

  if (!section) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="services"
      label={content?.section_title || "Robotics Club"}
      templateCategory="school"
      templateKey="school-institutional-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
