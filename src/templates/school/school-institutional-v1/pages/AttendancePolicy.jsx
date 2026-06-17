import React from "react";
import BuilderSectionTarget from "../../../../builder/BuilderSectionTarget";
import Card from "./../components/common/Card";
import "../styles/policy.css";

const DEFAULT_META_ITEMS = [
  "Policy Type: Learner Conduct",
  "Applies to: All Grades",
  "Status: Active",
];

const DEFAULT_ATTENDANCE_EXPECTATIONS = [
  "Learners must attend school every official school day unless excused for a valid reason.",
  "Learners must arrive on time and be prepared for learning (uniform, stationery, and books).",
  "Attendance is recorded daily (and per period where applicable).",
  "Repeated absences or late-coming may lead to intervention and disciplinary steps.",
];

const DEFAULT_LATE_ARRIVAL_ITEMS = [
  "Report to the designated late-coming point/office on arrival.",
  "Late-coming is recorded and may require a slip/pass to enter class.",
  "Repeated late-coming triggers parent contact and intervention.",
];

const DEFAULT_ACCEPTABLE_REASONS = [
  "Medical appointment (proof required)",
  "Public transport delays (when consistent and verifiable)",
  "Family emergency (parent/guardian confirmation required)",
];

const DEFAULT_ABSENCE_ITEMS = [
  "Parents/guardians must inform the school as soon as possible when a learner will be absent.",
  "A written note or proof must be provided upon return to school.",
  "Medical certificates are required for extended illness or repeated health-related absences.",
  "Unreported absences may be recorded as unexcused and can trigger intervention.",
];

const DEFAULT_CATCH_UP_ITEMS = [
  "It is the learner’s responsibility to request and complete missed classwork.",
  "Teachers will guide learners on what was missed and the deadline for catch-up work.",
  "Make-up tasks/tests are granted at the school’s discretion and may require proof of absence.",
  "Repeated missed assessments may affect promotion requirements.",
];

const DEFAULT_INTERVENTION_STEPS = [
  {
    id: "early-warning",
    title: "Early Warning",
    body:
      "Educator/grade head identifies patterns of lateness/absence and records concerns.",
  },
  {
    id: "parent-contact",
    title: "Parent/Guardian Contact",
    body:
      "School contacts parent/guardian to discuss causes and agree on corrective actions.",
  },
  {
    id: "support-plan",
    title: "Support Plan",
    body:
      "Where needed, a learner support plan may be implemented (counselling, referrals, monitoring).",
  },
  {
    id: "disciplinary-steps",
    title: "Disciplinary Steps",
    body:
      "Continued non-compliance may lead to disciplinary action in line with the school code of conduct.",
  },
];

const DEFAULT_ROLES = [
  {
    id: "learners",
    title: "Learners",
    items: [
      "Attend daily and arrive on time.",
      "Bring required materials and maintain discipline.",
      "Catch up missed work promptly.",
    ],
  },
  {
    id: "parents",
    title: "Parents/Guardians",
    items: [
      "Ensure learners arrive on time.",
      "Report absences promptly and provide proof.",
      "Respond to school communication and attend meetings when required.",
    ],
  },
  {
    id: "school",
    title: "School",
    items: [
      "Record attendance accurately.",
      "Communicate concerns and apply interventions.",
      "Support learners to improve attendance.",
    ],
  },
];

function contentArray(value, fallback) {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}

export default function AttendancePolicy({
  settings = {},
  section = null,
  content = {},
  builderMode = false,
}) {
  const phone = content?.phone || settings?.phone || "011 023 9428";
  const email = content?.email || settings?.email || "sebone@gmail.com";

  const schoolName =
    content?.school_name ||
    settings?.schoolName ||
    settings?.school_name ||
    "M.O.M Sebone Secondary School";

  const metaItems = contentArray(content?.meta_items, DEFAULT_META_ITEMS);

  const attendanceExpectations = contentArray(
    content?.attendance_expectations,
    DEFAULT_ATTENDANCE_EXPECTATIONS,
  );

  const lateArrivalItems = contentArray(
    content?.late_arrival_items,
    DEFAULT_LATE_ARRIVAL_ITEMS,
  );

  const acceptableReasons = contentArray(
    content?.acceptable_reasons,
    DEFAULT_ACCEPTABLE_REASONS,
  );

  const absenceItems = contentArray(
    content?.absence_items,
    DEFAULT_ABSENCE_ITEMS,
  );

  const catchUpItems = contentArray(
    content?.catch_up_items,
    DEFAULT_CATCH_UP_ITEMS,
  );

  const interventionSteps = contentArray(
    content?.intervention_steps,
    DEFAULT_INTERVENTION_STEPS,
  );

  const roles = contentArray(content?.roles, DEFAULT_ROLES);

  const pageContent = (
    <main className="policy-page container">
      <header className="policy-hero">
        <h1 className="policy-title">
          {content?.section_title || "Attendance Policy"}
        </h1>
        <p className="policy-subtitle">
          {content?.subtitle ||
            `This policy explains attendance expectations, late-coming procedures, absence reporting, and academic accountability for learners at ${schoolName}.`}
        </p>

        <div className="policy-meta">
          {metaItems.map((item, index) => (
            <span key={`${item}-${index}`} className="pill">
              {item}
            </span>
          ))}
        </div>
      </header>

      <section className="policy-section">
        <h2 className="policy-h2">
          {content?.purpose_title || "1. Purpose"}
        </h2>
        <Card>
          <p>
            {content?.purpose_body ||
              content?.body ||
              "Regular attendance is essential for learner performance, discipline, and successful completion of curriculum requirements. This policy sets out clear procedures to support punctuality, monitor attendance, and ensure effective communication between the school and parents/guardians."}
          </p>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">
          {content?.attendance_title || "2. Attendance Expectations"}
        </h2>
        <Card>
          <ul className="policy-list">
            {attendanceExpectations.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">
          {content?.late_coming_title || "3. Late-Coming Procedure"}
        </h2>
        <Card>
          <p className="policy-text">
            {content?.late_coming_body ||
              "Learners who arrive late disrupt teaching and learning. Late-coming is recorded and monitored."}
          </p>

          <div className="policy-grid">
            <div className="policy-box">
              <h3 className="policy-h3">
                {content?.late_arrival_title || "3.1 When a learner is late"}
              </h3>
              <ul className="policy-list compact">
                {lateArrivalItems.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="policy-box">
              <h3 className="policy-h3">
                {content?.acceptable_reasons_title || "3.2 Acceptable reasons"}
              </h3>
              <ul className="policy-list compact">
                {acceptableReasons.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">
          {content?.absences_title || "4. Absences & Reporting"}
        </h2>
        <Card>
          <ul className="policy-list">
            {absenceItems.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>

          <div className="policy-callout">
            <strong>{content?.absence_callout_label || "Important:"}</strong>{" "}
            {content?.absence_callout ||
              "If a learner is absent on the day of a test/exam, the school may require valid proof before a make-up assessment is considered."}
          </div>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">
          {content?.catch_up_title || "5. Catch-Up Work & Assessments"}
        </h2>
        <Card>
          <ul className="policy-list">
            {catchUpItems.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">
          {content?.intervention_title || "6. Monitoring & Intervention"}
        </h2>
        <Card>
          <div className="policy-steps">
            {interventionSteps.map((step, index) => (
              <div
                key={step.id || `${step.title || "step"}-${index}`}
                className="step"
              >
                <div className="step-num">{index + 1}</div>
                <div className="step-body">
                  <h3 className="policy-h3">{step.title || ""}</h3>
                  <p>{step.body || step.text || ""}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">
          {content?.roles_title || "7. Roles & Responsibilities"}
        </h2>
        <Card>
          <div className="policy-grid">
            {roles.map((role, index) => (
              <div
                key={role.id || `${role.title || "role"}-${index}`}
                className="policy-box"
              >
                <h3 className="policy-h3">{role.title || ""}</h3>
                <ul className="policy-list compact">
                  {(Array.isArray(role.items) ? role.items : []).map(
                    (item, itemIndex) => (
                      <li key={`${item}-${itemIndex}`}>{item}</li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="policy-section">
        <h2 className="policy-h2">
          {content?.contact_title || "8. Contact"}
        </h2>
        <Card>
          <p className="policy-text">
            {content?.contact_body ||
              "For attendance enquiries, please contact the school office:"}
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
          {content?.footer_note ||
            "This page is a website version of the policy. The school’s official signed policy document remains the primary reference."}
        </p>
      </footer>
    </main>
  );

  if (!section && !builderMode) {
    return pageContent;
  }

  return (
    <BuilderSectionTarget
      builderMode={builderMode}
      section={section}
      sectionType="school_attendance_policy"
      label={content?.section_title || "Attendance Policy"}
      templateCategory="school"
      templateKey="school-institutional-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
