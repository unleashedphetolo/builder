import React from "react";
import Card from "../../components/common/Card";

export default function CodeOfConduct() {
  const pdfFile = "/docs/code-of-conduct.pdf";

  return (
    <section className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
      <h2 className="section-title">Learner Code of Conduct</h2>

      <Card>
        <div style={{ lineHeight: 1.7, maxWidth: 900 }}>

          <p>
            The Learner Code of Conduct of <strong>M.O.M Sebone Secondary School </strong>
            sets out the standards of behaviour expected from every learner.
            These rules are designed to create a safe, disciplined, and respectful
            environment that supports effective teaching and learning.
          </p>

          <h3>1. Respect and Behaviour</h3>
          <p>
            Learners must treat teachers, staff members, fellow learners,
            and visitors with respect and dignity at all times. Bullying,
            discrimination, harassment, or any form of violence is strictly prohibited.
          </p>

          <h3>2. Attendance</h3>
          <p>
            Regular attendance is essential for academic success. Learners
            must attend school daily, arrive on time, and participate fully
            in all learning activities unless a valid reason is provided.
          </p>

          <h3>3. School Uniform</h3>
          <p>
            Learners are required to wear the correct school uniform at all
            times during school hours and official school activities. The
            uniform must be clean, neat, and worn in accordance with school policy.
          </p>

          <h3>4. Academic Responsibility</h3>
          <p>
            Learners are expected to complete all assignments, homework,
            and assessments honestly and on time. Cheating, plagiarism,
            or academic dishonesty will not be tolerated.
          </p>

          <h3>5. Safety and School Property</h3>
          <p>
            Learners must respect school property and maintain a clean
            environment. Any damage to school facilities or equipment may
            result in disciplinary action.
          </p>

          <h3>6. Discipline</h3>
          <p>
            Failure to comply with school rules may result in disciplinary
            action in accordance with the school's disciplinary procedures
            and national education regulations.
          </p>

          <p>
            Parents and guardians are encouraged to review this policy
            together with learners to ensure that all expectations are
            clearly understood.
          </p>

          {/* Buttons */}
          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            
            <a
              href={pdfFile}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: "#2a1b6b",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              View Full Document
            </a>

            <a
              href={pdfFile}
              download
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: "#0b3b8f",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Download Code of Conduct (PDF)
            </a>

          </div>

        </div>
      </Card>
    </section>
  );
}