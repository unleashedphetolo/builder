import React from "react";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Breadcrumbs from "../components/common/Breadcrumbs";

export default function ResourcesLanding() {
  return (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
      <Breadcrumbs />
      <h2 className="section-title">Resources</h2>

      <p style={{ opacity: 0.85, maxWidth: 900, marginBottom: 18 }}>
        Important academic documents, learner support materials, school policies, and official
        information for learners and parents.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        <Card>
          <h3>Subject Choices</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Guidance on subject selection and academic pathways.
          </p>
          <Button to="/site/resources/subject-choices" variant="outline">View</Button>
        </Card>

        <Card>
          <h3>Term Plan</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Official academic calendar and term activities.
          </p>
          <Button to="/site/resources/term-plan" variant="outline">View</Button>
        </Card>

        <Card>
          <h3>Exam Schedule</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Examination dates and assessment planning.
          </p>
          <Button to="/site/resources/exam-schedule" variant="outline">View</Button>
        </Card>

        <Card>
          <h3>Code of Conduct</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Learner behaviour guidelines and discipline policy.
          </p>
          <Button to="/site/resources/code-of-conduct" variant="outline">View</Button>
        </Card>

        <Card>
          <h3>Stationary List</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Required stationery items per grade.
          </p>
          <Button to="/site/resources/stationary-list" variant="outline">View</Button>
        </Card>

        <Card>
          <h3>School Calendar</h3>
          <p style={{ opacity: 0.85, marginBottom: 12 }}>
            Important academic and school activity dates.
          </p>
          <Button to="/site/resources/calendar" variant="outline">View</Button>
        </Card>
      </div>
    </section>
  );
}