import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import "../styles/facilities.css";

const FACILITIES = [
  {
    title: "Learning Spaces",
    description:
      "Modern classrooms, science laboratories, and structured learning spaces designed to support academic excellence and focused instruction.",
    image: "/images/facilities/classrooms.jpg",
  },
  {
    title: "Library & Resource Centre",
    description:
      "A dedicated space for reading, research, and digital learning access, supporting independent study and curriculum enrichment.",
    image: "/images/facilities/library.jpg",
  },
  {
    title: "Science & Computer Labs",
    description:
      "Fully equipped laboratories for Physical Sciences, Life Sciences, and Information Technology.",
    image: "/images/facilities/computer-lab.jpg",
  },
  {
    title: "Sport & Recreation",
    description:
      "Soccer field, athletics space, and courts that promote discipline, teamwork, and physical development.",
    image: "/images/facilities/sports.jpg",
  },
  {
    title: "Administration Block",
    description:
      "Professional administrative offices ensuring effective school management and learner support services.",
    image: "/images/facilities/admin.jpg",
  },
  {
    title: "Assembly & Multi-Purpose Hall",
    description:
      "A venue for assemblies, examinations, cultural activities, and important school events.",
    image: "/images/facilities/hall.jpg",
  },
];

export default function Facilities({
  section = null,
  content = {},
  builderMode = false,
}) {
  const facilities =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : FACILITIES;

  const pageContent = (
    <main className="fac container">
      {/* Hero */}
      <header className="fac-hero">
        <div>
          <h1 className="fac-title">
            {content?.section_title || "School Facilities"}
          </h1>
          <p className="fac-subtitle">
            {content?.subtitle ||
              "Our facilities are designed to provide a safe, structured, and resource-rich environment that supports both academic and extracurricular excellence."}
          </p>
        </div>
      </header>

      {/* Grid */}
      <section className="fac-grid">
        {facilities.map((item, index) => (
          <div
            key={item.id || item.title || `facility-${index}`}
            className="fac-card"
          >
            <div className="fac-img-wrap">
              <img
                src={item.image_url || item.image || ""}
                alt={item.title || ""}
                onError={(e) =>
                  (e.currentTarget.src = "/images/teachers.jpeg")
                }
              />
            </div>

            <div className="fac-card-body">
              <h3 className="fac-card-title">{item.title || ""}</h3>
              <p className="fac-card-text">
                {item.body || item.description || ""}
              </p>
            </div>
          </div>
        ))}
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
      sectionType="school_facilities"
      label={content?.section_title || "School Facilities"}
      templateCategory="school"
      templateKey="school-evergreen-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
