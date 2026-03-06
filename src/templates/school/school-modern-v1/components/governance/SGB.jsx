import React from "react";
import Card from "../common/Card";
import "../../styles/sgb.css";
import Breadcrumbs from "../common/Breadcrumbs";

const SGB_MEMBERS = [
  {
    name: "T. Khumalo",
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
    name: "M. Dube",
    role: "Treasurer",
    img: "/images/sgb/treasurer.jpg",
  },
];

function SGBCard({ person }) {
  return (
    <Card className="sgb-card">
      <div className="sgb-image-wrap">
        <img
          src={person.img}
          alt={person.name}
          className="sgb-image"
          onError={(e) => {
            e.currentTarget.src = "/images/teachers.jpeg";
          }}
        />
      </div>

      <div className="sgb-meta">
        <h3 className="sgb-name">{person.name}</h3>
        <p className="sgb-role">{person.role}</p>
      </div>
    </Card>
  );
}

export default function SGB() {
  return (
    <section className="sgb-section container">
      <Breadcrumbs />
      <div className="sgb-header">
        <h2>School Governing Body (SGB)</h2>

        <p>
          The School Governing Body supports governance, accountability,
          community engagement and policy oversight to ensure that
          M.O.M Sebone Secondary School continues to deliver quality
          education and responsible leadership.
        </p>
      </div>

      {/* Members */}
      <div className="sgb-grid">
        {SGB_MEMBERS.map((member) => (
          <SGBCard key={member.name} person={member} />
        ))}
      </div>

      {/* Responsibilities */}
      <div className="sgb-info">
        <Card>
          <h3>SGB Responsibilities</h3>

          <ul className="sgb-list">
            <li>Develop and approve school policies</li>
            <li>Support the leadership of the school</li>
            <li>Promote parent and community participation</li>
            <li>Ensure responsible financial governance</li>
            <li>Promote discipline, safety and learner development</li>
          </ul>
        </Card>
      </div>
    </section>
  );
}