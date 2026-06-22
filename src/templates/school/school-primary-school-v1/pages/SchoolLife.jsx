import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const ACTIVITIES = [
  {
    id: "academics",
    title: "Academics",
    body:
      "Study support, subject guidance, and learning culture that drives strong results.",
    href: "/site/activities/academics",
  },
  {
    id: "sports",
    title: "Sports & Recreation",
    body: "Healthy competition, teamwork and fitness for learners.",
    href: "/site/activities/sports",
  },
  {
    id: "culture",
    title: "Culture & Activities",
    body:
      "Leadership, arts, clubs and activities that develop well-rounded learners.",
    href: "/site/activities/culture",
  },
  {
    id: "facilities",
    title: "Campus Facilities",
    body: "The spaces and resources that support learning and growth.",
    href: "/site/activities/facilities",
  },
];

function resolveActivityHref(href = "") {
  const clean = String(href || "").trim();

  if (!clean) return "#";

  if (
    clean.startsWith("/site/") ||
    /^(https?:\/\/|mailto:|tel:|#)/i.test(clean)
  ) {
    return clean;
  }

  if (clean.startsWith("/")) {
    return `/site${clean}`;
  }

  return clean;
}

export default function SchoolLifeLanding({
  section = null,
  content = {},
  builderMode = false,
}) {
  const activities =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : ACTIVITIES;

  const pageContent = (
    <section
      className="container"
      style={{ paddingTop: 28, paddingBottom: 40 }}
    >
      <h2 className="section-title">
        {content?.section_title || "Activities"}
      </h2>
      <p style={{ opacity: 0.85, maxWidth: 900, marginBottom: 18 }}>
        {content?.subtitle ||
          "Activities at school builds confident learners through academics, sport, culture and a safe campus environment."}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {activities.map((item, index) => (
          <Card key={item.id || item.title || `activity-${index}`}>
            <h3>{item.title || ""}</h3>
            <p style={{ opacity: 0.85, marginBottom: 12 }}>
              {item.body || item.description || ""}
            </p>
            <Button
              to={resolveActivityHref(item.href || item.link)}
              variant="outline"
            >
              {item.button_label || "Explore"}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_activities"
      label={content?.section_title || "Activities"}
      templateCategory="school"
      templateKey="school-primary-school-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
