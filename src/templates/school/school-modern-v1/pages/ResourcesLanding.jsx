import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

const RESOURCE_CARDS = [
  {
    id: "subject-choices",
    title: "Subject Choices",
    body: "Guidance on subject selection and academic pathways.",
    href: "/resources/subject-choices",
  },
  {
    id: "term-plan",
    title: "Term Plan",
    body: "Official academic calendar and term activities.",
    href: "/resources/term-plan",
  },
  {
    id: "exam-schedule",
    title: "Exam Schedule",
    body: "Examination dates and assessment planning.",
    href: "/resources/exam-schedule",
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    body: "Learner behaviour guidelines and discipline policy.",
    href: "/resources/code-of-conduct",
  },
  {
    id: "stationary-list",
    title: "Stationary List",
    body: "Required stationery items per grade.",
    href: "/resources/stationary-list",
  },
  {
    id: "school-calendar",
    title: "School Calendar",
    body: "Important academic and school activity dates.",
    href: "/resources/calendar",
  },
];

export default function ResourcesLanding({
  section = null,
  content = {},
  builderMode = false,
}) {
  const resources =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : RESOURCE_CARDS;

  const pageContent = (
    <section
      className="container"
      style={{ paddingTop: 10, paddingBottom: 40 }}
    >
      <h2 className="section-title">
        {content?.section_title || "Resources"}
      </h2>

      <p style={{ opacity: 0.85, maxWidth: 900, marginBottom: 18 }}>
        {content?.subtitle ||
          "Important academic documents, learner support materials, school policies, and official information for learners and parents."}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {resources.map((item, index) => (
          <Card key={item.id || item.title || `resource-${index}`}>
            <h3>{item.title || ""}</h3>
            <p style={{ opacity: 0.85, marginBottom: 12 }}>
              {item.body || item.description || ""}
            </p>
            <Button to={item.href || item.link || "#"} variant="outline">
              {item.button_label || "View"}
            </Button>
          </Card>
        ))}
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
      label={content?.section_title || "Resources"}
      templateCategory="school"
      templateKey="school-modern-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
