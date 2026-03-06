import React from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Breadcrumbs from "../components/common/Breadcrumbs";

export default function SchoolLifeLanding() {
  return (
    <section className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <Breadcrumbs />
      <h2 className="section-title">Activities</h2>
      <p style={{ opacity: 0.85, maxWidth: 900, marginBottom: 18 }}>
        Activities at school builds confident learners through academics, sport, culture and a safe campus environment.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <Card>
          <h3>Academics</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Study support, subject guidance, and learning culture that drives strong results.
          </p>
          <Button to="/site/activities/academics" variant="outline">Explore</Button>
        </Card>

        <Card>
          <h3>Sports & Recreation</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Healthy competition, teamwork and fitness for learners.
          </p>
          <Button to="/site/activities/sports" variant="outline">Explore</Button>
        </Card>

        <Card>
          <h3>Culture & Activities</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Leadership, arts, clubs and activities that develop well-rounded learners.
          </p>
          <Button to="/site/activities/culture" variant="outline">Explore</Button>
        </Card>

        <Card>
          <h3>Campus Facilities</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            The spaces and resources that support learning and growth.
          </p>
          <Button to="/site/activities/facilities" variant="outline">Explore</Button>
        </Card>
      </div>
    </section>
  );
}
