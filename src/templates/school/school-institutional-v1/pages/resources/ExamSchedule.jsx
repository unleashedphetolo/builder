import React from "react";
import Card from "../../components/common/Card";

export default function ExamSchedule() {
  return (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
      <h2 className="section-title">Exam Schedule</h2>
      <Card>
        <p style={{ opacity: 0.9 }}>
          Put the exam schedule here (per grade and per term). Add a PDF download link when ready.
        </p>
      </Card>
    </section>
  );
}
