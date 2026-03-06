import React from "react";
import { Link } from "react-router-dom";
import "../../styles/requirements.css";
import Card from "../../components/common/Card";
import Breadcrumbs from "../../components/common/Breadcrumbs";

export default function Requirements() {
  return (
    <main className="container requirements-page">
      <Breadcrumbs />
      <h2 className="section-title">Entry Requirements</h2>

      <Card>
        <div className="requirements-content">

          <p>
            M.O.M Sebone Secondary School welcomes applications from learners
            who are committed to academic excellence, discipline, and positive
            participation in school life. Admission is subject to available
            space and compliance with the school's admission policy.
          </p>

          <h3 className="requirements-heading">Required Documents</h3>
          <p>All applications must include the following certified documents:</p>

          <ul className="requirements-list">
            <li>Certified copy of learner's birth certificate or ID</li>
            <li>Certified copy of parent/guardian ID</li>
            <li>Latest school report</li>
            <li>Proof of residential address</li>
            <li>Transfer letter from previous school (if applicable)</li>
            <li>Immunisation card (if available)</li>
          </ul>

          <h3 className="requirements-heading">Grade Admissions</h3>

          <p>
            Applications are primarily accepted for <strong>Grade 8</strong>,
            which is the entry level for the school. Applications for higher
            grades (Grades 9–12) may be considered depending on space
            availability.
          </p>

          <h3 className="requirements-heading">Application Process</h3>

          <ul className="requirements-list">
            <li>Complete the official school application form.</li>
            <li>Submit all required supporting documents.</li>
            <li>Applications may be submitted online or at the school office.</li>
            <li>Parents will be contacted once the application has been reviewed.</li>
          </ul>

          <h3 className="requirements-heading">Important Notes</h3>

          <ul className="requirements-list">
            <li>All documents must be certified.</li>
            <li>Incomplete applications may not be processed.</li>
            <li>Submission of an application does not guarantee admission.</li>
            <li>Admission decisions are subject to the school's capacity.</li>
          </ul>

          {/* ACTION BUTTONS */}
          <div className="requirements-actions">

            <Link
              to="/site/admissions/apply"
              className="requirements-btn primary"
            >
              Apply Online
            </Link>

            <a
              href="/site/docs/admission-form.pdf"
              download
              className="requirements-btn navy"
            >
              Manual Application (PDF)
            </a>

            <a
              href="/site/docs/admission-form.pdf"
              target="_blank"
              rel="noreferrer"
              className="requirements-btn gray"
            >
              View Form
            </a>

          </div>

          <p className="requirements-note">
            You can apply online, or download the manual form, complete it, and
            submit it to the school office with the required certified
            documents.
          </p>

        </div>
      </Card>
    </main>
  );
}