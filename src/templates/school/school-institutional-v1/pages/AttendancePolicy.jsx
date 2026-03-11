import React from "react";
import Card from "./../components/common/Card";
import "../styles/policy.css";
import Breadcrumbs from "../components/common/Breadcrumbs";

export default function AttendancePolicy({ settings = {} }) {
  const phone = settings?.phone || "011 023 9428";
  const email = settings?.email || "sebone@gmail.com";

  return (
    <main className="policy-page container">
      <Breadcrumbs settings={settings} />

      <header className="policy-hero">
        <h1 className="policy-title">Attendance Policy</h1>
        <p className="policy-subtitle">
          This policy explains attendance expectations, late-coming procedures,
          absence reporting, and academic accountability for learners at
          M.O.M Sebone Secondary School.
        </p>

        <div className="policy-meta">
          <span className="pill">Policy Type: Learner Conduct</span>
          <span className="pill">Applies to: All Grades</span>
          <span className="pill">Status: Active</span>
        </div>
      </header>

      <section className="policy-section">
        <h2 className="policy-h2">1. Purpose</h2>
        <Card>
          <p>
            Regular attendance is essential for learner performance, discipline,
            and successful completion of curriculum requirements. This policy
            sets out clear procedures to support punctuality, monitor attendance,
            and ensure effective communication between the school and parents/guardians.
          </p>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">2. Attendance Expectations</h2>
        <Card>
          <ul className="policy-list">
            <li>Learners must attend school every official school day unless excused for a valid reason.</li>
            <li>Learners must arrive on time and be prepared for learning (uniform, stationery, and books).</li>
            <li>Attendance is recorded daily (and per period where applicable).</li>
            <li>Repeated absences or late-coming may lead to intervention and disciplinary steps.</li>
          </ul>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">3. Late-Coming Procedure</h2>
        <Card>
          <p className="policy-text">
            Learners who arrive late disrupt teaching and learning. Late-coming is recorded and monitored.
          </p>

          <div className="policy-grid">
            <div className="policy-box">
              <h3 className="policy-h3">3.1 When a learner is late</h3>
              <ul className="policy-list compact">
                <li>Report to the designated late-coming point/office on arrival.</li>
                <li>Late-coming is recorded and may require a slip/pass to enter class.</li>
                <li>Repeated late-coming triggers parent contact and intervention.</li>
              </ul>
            </div>

            <div className="policy-box">
              <h3 className="policy-h3">3.2 Acceptable reasons</h3>
              <ul className="policy-list compact">
                <li>Medical appointment (proof required)</li>
                <li>Public transport delays (when consistent and verifiable)</li>
                <li>Family emergency (parent/guardian confirmation required)</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">4. Absences & Reporting</h2>
        <Card>
          <ul className="policy-list">
            <li>Parents/guardians must inform the school as soon as possible when a learner will be absent.</li>
            <li>A written note or proof must be provided upon return to school.</li>
            <li>Medical certificates are required for extended illness or repeated health-related absences.</li>
            <li>Unreported absences may be recorded as unexcused and can trigger intervention.</li>
          </ul>

          <div className="policy-callout">
            <strong>Important:</strong> If a learner is absent on the day of a test/exam,
            the school may require valid proof before a make-up assessment is considered.
          </div>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">5. Catch-Up Work & Assessments</h2>
        <Card>
          <ul className="policy-list">
            <li>It is the learner’s responsibility to request and complete missed classwork.</li>
            <li>Teachers will guide learners on what was missed and the deadline for catch-up work.</li>
            <li>Make-up tasks/tests are granted at the school’s discretion and may require proof of absence.</li>
            <li>Repeated missed assessments may affect promotion requirements.</li>
          </ul>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">6. Monitoring & Intervention</h2>
        <Card>
          <div className="policy-steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-body">
                <h3 className="policy-h3">Early Warning</h3>
                <p>Educator/grade head identifies patterns of lateness/absence and records concerns.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-num">2</div>
              <div className="step-body">
                <h3 className="policy-h3">Parent/Guardian Contact</h3>
                <p>School contacts parent/guardian to discuss causes and agree on corrective actions.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-num">3</div>
              <div className="step-body">
                <h3 className="policy-h3">Support Plan</h3>
                <p>Where needed, a learner support plan may be implemented (counselling, referrals, monitoring).</p>
              </div>
            </div>

            <div className="step">
              <div className="step-num">4</div>
              <div className="step-body">
                <h3 className="policy-h3">Disciplinary Steps</h3>
                <p>Continued non-compliance may lead to disciplinary action in line with the school code of conduct.</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">7. Roles & Responsibilities</h2>
        <Card>
          <div className="policy-grid">
            <div className="policy-box">
              <h3 className="policy-h3">Learners</h3>
              <ul className="policy-list compact">
                <li>Attend daily and arrive on time.</li>
                <li>Bring required materials and maintain discipline.</li>
                <li>Catch up missed work promptly.</li>
              </ul>
            </div>

            <div className="policy-box">
              <h3 className="policy-h3">Parents/Guardians</h3>
              <ul className="policy-list compact">
                <li>Ensure learners arrive on time.</li>
                <li>Report absences promptly and provide proof.</li>
                <li>Respond to school communication and attend meetings when required.</li>
              </ul>
            </div>

            <div className="policy-box">
              <h3 className="policy-h3">School</h3>
              <ul className="policy-list compact">
                <li>Record attendance accurately.</li>
                <li>Communicate concerns and apply interventions.</li>
                <li>Support learners to improve attendance.</li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">8. Contact</h2>
        <Card>
          <p className="policy-text">
            For attendance enquiries, please contact the school office:
          </p>
          <div className="policy-contact">
            <a href={`tel:${phone}`}>☎ {phone}</a>
            <span className="dot">•</span>
            <a href={`mailto:${email}`}>✉ {email}</a>
          </div>
        </Card>
      </section>

      <footer className="policy-footer">
        <p>
          This page is a website version of the policy. The school’s official signed policy document remains the primary reference.
        </p>
      </footer>
    </main>
  );
}