import React from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../common/Card";
import "../../styles/sgb.css";

const SGB_MEMBERS = [
  {
    name: "T. Lukes",
    role: "Chairperson",
    img: "/images/sgb/chairperson.jpg",
  },
  {
    name: "R. Molefe",
    role: "Deputy Chairperson",
    img: "/images/sgb/deputy.jpg",
  },
  {
    name: "L. Nkosi",
    role: "Secretary",
    img: "/images/sgb/secretary.jpg",
  },
  {
    name: "M. Van Rooyen",
    role: "Treasurer",
    img: "/images/sgb/treasurer.jpg",
  },
];

const RESPONSIBILITIES = [
  "Develop and approve school policies",
  "Support the leadership of the school",
  "Promote parent and community participation",
  "Ensure responsible financial governance",
  "Promote discipline, safety and learner development",
];

function SGBCard({ person }) {
  return (
    <Card className="sgb-card">
      <div className="sgb-image-wrap">
        <img
          src={person.image_url || person.img || ""}
          alt={person.name || ""}
          className="sgb-image"
          onError={(e) => {
            e.currentTarget.src = "/images/teachers.jpeg";
          }}
        />
      </div>

      <div className="sgb-meta">
        <h3 className="sgb-name">{person.name || ""}</h3>
        <p className="sgb-role">{person.role || ""}</p>
      </div>
    </Card>
  );
}

export default function SGB({
  section = null,
  content = {},
  builderMode = false,
}) {
  const members =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : SGB_MEMBERS;

  const responsibilities =
    Array.isArray(content?.responsibilities) &&
    content.responsibilities.length > 0
      ? content.responsibilities
      : RESPONSIBILITIES;

  const sectionContent = (
    <section className="sgb-section container">
      <div className="sgb-header">
        <h2>{content?.section_title || "School Governing Body (SGB)"}</h2>

        <p>
          {content?.subtitle ||
            "The School Governing Body supports governance, accountability, community engagement and policy oversight to ensure that M.O.M Sebone Secondary School continues to deliver quality education and responsible leadership."}
        </p>
      </div>

      {/* Members */}
      <div className="sgb-grid">
        {members.map((member, index) => (
          <SGBCard
            key={member.id || member.name || `sgb-member-${index}`}
            person={member}
          />
        ))}
      </div>

      {/* Responsibilities */}
      <div className="sgb-info">
        <Card>
          <h3>{content?.responsibilities_title || "SGB Responsibilities"}</h3>

          <ul className="sgb-list">
            {responsibilities.map((responsibility, index) => (
              <li key={`${responsibility}-${index}`}>{responsibility}</li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );

  if (!section) {
    return sectionContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_sgb"
      label={content?.section_title || "School Governing Body (SGB)"}
      templateCategory="school"
      templateKey="school-primary-school-v1"
    >
      {sectionContent}
    </BuilderSectionTarget>
  );
}
