import React from "react";
import "../../styles/sponsors.css";

const sponsors = [
  {
    id: 1,
    name: "Department of Basic Education",
    logo: "/images/dbe.png",
    link: "https://www.education.gov.za/",
  },
  {
    id: 2,
    name: "Local Municipality",
    logo: "/images/municipality.png",
    link: "https://www.joburg.org.za/",
  },
  {
    id: 3,
    name: "Community Development Trust",
    logo: "/images/community.png",
    link: "https://www.gov.za/",
  },
  {
    id: 4,
    name: "Sebone Alumni Association",
    logo: "/images/alumni.png",
    link: "#",
  },
];

export default function Sponsors({ settings = {} }) {
  return (
    <section className="sponsors-section">
      <div className="container">
        <h2 className="section-title">Our Partners & Supporters</h2>

        <p className="sponsors-intro">
          M.O.M Sebone Secondary School appreciates the continued support of our
          partners, community stakeholders, and organisations that contribute to
          learner development and school growth.
        </p>

        <div className="sponsors-grid">
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.id}
              href={sponsor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-card"
            >
              <img src={sponsor.logo} alt={sponsor.name} />
              <p>{sponsor.name}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}