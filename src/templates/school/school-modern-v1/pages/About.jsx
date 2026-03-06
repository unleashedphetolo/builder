import React from "react";
import { Link } from "react-router-dom";
import AboutSection from "../components/home/AboutSection";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Breadcrumbs from "../components/common/Breadcrumbs";

export default function AboutLanding() {
  return (
    <div className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
      <Breadcrumbs />
      <h2 className="section-title">About M.O.M Sebone Secondary School</h2>

      <AboutSection />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        <Card>
          <h3 style={{ marginBottom: 8 }}>Who We Are</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Our identity, community, leadership and what makes Sebone a trusted school.
          </p>
          <Button to="/site/about/who-we-are" variant="outline">Read more</Button>
        </Card>

        <Card>
          <h3 style={{ marginBottom: 8 }}>Vision & Mission</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            The purpose that guides how we teach, lead and grow learners.
          </p>
          <Button to="/site/about/vision-mission" variant="outline">Read more</Button>
        </Card>

        <Card>
          <h3 style={{ marginBottom: 8 }}>Our History</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            The journey of our school and how we built a culture of excellence.
          </p>
          <Button to="/site/about/history" variant="outline">Read more</Button>
        </Card>
      </div>

      <div style={{ marginTop: 20 }}>
        <p style={{ opacity: 0.85 }}>
          Looking for staff and governance? Visit <Link to="/site/staff">Staff</Link> and <Link to="/site/sgb">SGB</Link>.
        </p>
      </div>
    </div>
  );
}
