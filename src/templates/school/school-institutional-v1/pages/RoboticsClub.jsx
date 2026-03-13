import React from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Breadcrumbs from "../components/common/Breadcrumbs";

export default function RoboticsClub() {

  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
      <Breadcrumbs />

      <h2 className="section-title">Sebone Robotics Club</h2>

      <p style={{ opacity: 0.85, maxWidth: 900, marginBottom: 18 }}>
        The Robotics Club develops problem-solving, teamwork and engineering skills through hands-on projects,
        coding and competitions.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <Card>
          <h3>What You Learn</h3>
          <ul style={{ marginTop: 8, paddingLeft: 18, opacity: 0.9 }}>
            <li>Basic electronics & sensors</li>
            <li>Programming logic & control</li>
            <li>Design thinking & teamwork</li>
            <li>Competition preparation</li>
          </ul>
        </Card>

        <Card>
          <h3>Projects</h3>
          <p style={{ opacity: 0.85 }}>
            Build line-followers, obstacle robots, mini automation systems, and creative prototypes.
          </p>
        </Card>

        <Card>
          <h3>Competitions</h3>
          <p style={{ opacity: 0.85 }}>
            Represent the school and learn confidence through challenges, presentations and teamwork.
          </p>
        </Card>
      </div>

      <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>

        <Button
          onClick={() => navigate("/contact")}
          variant="primary"
        >
          Join the club
        </Button>

        <Button
          onClick={() => navigate("/gallery")}
          variant="outline"
        >
          See school gallery
        </Button>

      </div>
    </section>
  );
}