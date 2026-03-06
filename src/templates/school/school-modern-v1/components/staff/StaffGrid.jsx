import React from "react";
import "../../styles/staff.css";

const STAFF = [
  { name: "P. MATHIBE", role: "Principal", img: "/images/staff/mathibe.jpg" },
  { name: "S. MOKOENA", role: "Deputy Principal", img: "/images/staff/teacher1.jpg" },
  { name: "N. NKOSI", role: "HOD: Sciences", img: "/images/staff/teacher2.jpg" },
  { name: "M. DLAMINI", role: "Educator", img: "/images/staff/teacher3.jpg" },
];

function StaffCard({ person }) {
  return (
    <div className="staff-card">
      <div className="staff-image-wrap">
        <img
          src={person.img}
          alt={person.name}
          className="staff-image"
          onError={(e) => {
            e.currentTarget.src = "/images/teachers.jpeg";
          }}
        />
      </div>

      <div className="staff-meta">
        <h3 className="staff-name">{person.name}</h3>
        <p className="staff-role">{person.role}</p>
      </div>
    </div>
  );
}

export default function StaffGrid() {
  return (
    <section className="staff-section container">
      <div className="staff-header">
        <h1 className="staff-title">School Leadership & Staff</h1>
        <p className="staff-subtitle">
          Dedicated educators and leaders committed to academic excellence,
          discipline and learner development at M.O.M Sebone Secondary School.
        </p>
      </div>

      <div className="staff-grid">
        {STAFF.map((p) => (
          <StaffCard key={p.name} person={p} />
        ))}
      </div>
    </section>
  );
}