import React, { useMemo, useState } from "react";
// import "../../styles/admissions.css";
import "../../styles/admissions-form.css";
import Button from "../../components/common/Button";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const GRADES = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const GENDERS = ["Female", "Male", "Prefer not to say"];
const RELATIONSHIPS = ["Mother", "Father", "Guardian", "Other"];
const HOME_LANGS = [
  "English",
  "Xitsonga",
  "Sepedi",
  "Setswana",
  "Afrikaans",
  "isiZulu",
  "isiXhosa",
  "Sesotho",
  "Tshivenda",
  "Other",
];
const TRANSPORT = ["Walking", "Parent/Guardian", "Taxi", "Bus", "Other"];

const steps = [
  { key: "learner", label: "Learner" },
  { key: "guardian", label: "Parent/Guardian" },
  { key: "school", label: "School Info" },
  { key: "docs", label: "Uploads" },
  { key: "review", label: "Review & Submit" },
];

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fileLabel(f) {
  if (!f) return "No file selected";
  const mb = (f.size / 1024 / 1024).toFixed(2);
  return `${f.name} • ${mb} MB`;
}

function requiredMissing(fields) {
  return fields.some((v) => !String(v ?? "").trim());
}

export default function Apply({ settings = {} }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex]?.key;

  const [form, setForm] = useState({
    // Learner
    learnerFirstName: "",
    learnerLastName: "",
    learnerDOB: "",
    learnerGender: "",
    learnerGrade: "",
    learnerIdOrBirth: "",
    learnerHomeLanguage: "",
    learnerNationality: "",
    learnerAddressLine1: "",
    learnerAddressCity: "",
    learnerAddressProvince: "",
    learnerAddressPostal: "",
    transport: "",
    medicalInfo: "",

    // Guardian
    guardianFullName: "",
    guardianRelationship: "",
    guardianIdNumber: "",
    guardianPhone: "",
    guardianAltPhone: "",
    guardianEmail: "",
    guardianEmployer: "",
    guardianWorkPhone: "",

    // School info
    prevSchoolName: "",
    prevSchoolGrade: "",
    prevSchoolProvince: "",
    prevSchoolReason: "",
    needsFinancialSupport: "No",
    hostels: "No",

    // Emergency
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",

    // Consent
    consentTruth: false,
    consentPolicy: false,
  });

  const [files, setFiles] = useState({
    learnerId: null, // required
    guardianId: null, // required
    latestReport: null, // required
    proofAddress: null, // required
    transferLetter: null, // optional
    other: null, // optional
  });

  const [submitting, setSubmitting] = useState(false);

  const progress = useMemo(() => {
    const pct = Math.round(((stepIndex + 1) / steps.length) * 100);
    return Math.min(100, Math.max(0, pct));
  }, [stepIndex]);

  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const validateCurrentStep = () => {
    if (step === "learner") {
      return !requiredMissing([
        form.learnerFirstName,
        form.learnerLastName,
        form.learnerDOB,
        form.learnerGender,
        form.learnerGrade,
        form.learnerIdOrBirth,
        form.learnerHomeLanguage,
        form.learnerAddressLine1,
        form.learnerAddressCity,
        form.learnerAddressProvince,
      ]);
    }

    if (step === "guardian") {
      return !requiredMissing([
        form.guardianFullName,
        form.guardianRelationship,
        form.guardianIdNumber,
        form.guardianPhone,
      ]);
    }

    if (step === "school") {
      return !requiredMissing([
        form.prevSchoolName,
        form.prevSchoolGrade,
        form.prevSchoolProvince,
        form.emergencyName,
        form.emergencyRelationship,
        form.emergencyPhone,
      ]);
    }

    if (step === "docs") {
      return (
        !!files.learnerId &&
        !!files.guardianId &&
        !!files.latestReport &&
        !!files.proofAddress
      );
    }

    if (step === "review") {
      return form.consentTruth && form.consentPolicy;
    }

    return true;
  };

  const next = () => {
    if (!validateCurrentStep()) {
      window.alert("Please complete the required fields for this step.");
      return;
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validateCurrentStep()) {
      window.alert("Please confirm the declarations before submitting.");
      return;
    }

    // NOTE: This demo just simulates submit.
    // You can connect this to your backend/Supabase after.
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 900));

      // Example payload (files would be uploaded separately)
      const payload = {
        ...form,
        files: Object.keys(files).reduce(
          (a, k) => ({ ...a, [k]: !!files[k] }),
          {},
        ),
      };
      console.log("APPLICATION SUBMITTED:", payload);

      window.alert(
        "Application submitted successfully. The school will contact you.",
      );
      setStepIndex(0);
      // Optionally reset:
      // window.location.href = "/admissions";
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="admissions container"
      style={{ paddingTop: 10, paddingBottom: 40 }}
    >
      <Breadcrumbs settings={settings} />
      {/* HERO */}
      <header className="admissions-hero">
        <div className="hero-left">
          <h1 className="hero-title">Online Application</h1>
          <p className="hero-sub">
            Complete the form below and upload required documents. Fields marked{" "}
            <span className="req">*</span> are mandatory.
          </p>
        </div>

        <div className="hero-cta">
          <a href="/docs/admission-form.pdf" download className="af-ghost-link">
            Download Manual Form
          </a>
          <Button
            style={{ fontSize: "medium" }}
            to="/contact"
            variant="outline"
          >
            Need Help?
          </Button>
        </div>
      </header>

      {/* FORM WRAP */}
      <section className="af-card">
        {/* Progress */}
        <div className="af-progress">
          <div className="af-progress-top">
            <div className="af-progress-title">Application Progress</div>
            <div className="af-progress-pct">{progress}%</div>
          </div>

          <div className="af-bar" aria-hidden="true">
            <div className="af-bar-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="af-steps" role="list" aria-label="Application steps">
            {steps.map((s, idx) => {
              const done = idx < stepIndex;
              const active = idx === stepIndex;
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`af-step ${done ? "done" : ""} ${active ? "active" : ""}`}
                  onClick={() => {
                    // allow back navigation only (keeps it safe)
                    if (idx <= stepIndex) setStepIndex(idx);
                  }}
                >
                  <span className="af-step-dot" aria-hidden="true">
                    {done ? "✓" : idx + 1}
                  </span>
                  <span className="af-step-label">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="af-body">
          {step === "learner" && (
            <>
              <h2 className="af-h2">Learner Details</h2>
              <p className="af-muted">
                Provide the learner’s official information as per documents.
              </p>

              <div className="af-grid">
                <Field label="First Name" required>
                  <input
                    value={form.learnerFirstName}
                    onChange={(e) => set("learnerFirstName", e.target.value)}
                  />
                </Field>

                <Field label="Last Name" required>
                  <input
                    value={form.learnerLastName}
                    onChange={(e) => set("learnerLastName", e.target.value)}
                  />
                </Field>

                <Field label="Date of Birth" required>
                  <input
                    type="date"
                    max={todayISO()}
                    value={form.learnerDOB}
                    onChange={(e) => set("learnerDOB", e.target.value)}
                  />
                </Field>

                <Field label="Gender" required>
                  <select
                    value={form.learnerGender}
                    onChange={(e) => set("learnerGender", e.target.value)}
                  >
                    <option value="">Select</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Applying for Grade" required>
                  <select
                    value={form.learnerGrade}
                    onChange={(e) => set("learnerGrade", e.target.value)}
                  >
                    <option value="">Select</option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Learner ID / Birth Certificate No." required>
                  <input
                    value={form.learnerIdOrBirth}
                    onChange={(e) => set("learnerIdOrBirth", e.target.value)}
                    placeholder="e.g. 0000000000000"
                  />
                </Field>

                <Field label="Home Language" required>
                  <select
                    value={form.learnerHomeLanguage}
                    onChange={(e) => set("learnerHomeLanguage", e.target.value)}
                  >
                    <option value="">Select</option>
                    {HOME_LANGS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Nationality">
                  <input
                    value={form.learnerNationality}
                    onChange={(e) => set("learnerNationality", e.target.value)}
                    placeholder="e.g. South African"
                  />
                </Field>

                <Field label="Address Line" required className="span-2">
                  <input
                    value={form.learnerAddressLine1}
                    onChange={(e) => set("learnerAddressLine1", e.target.value)}
                    placeholder="Street / Section / Extension"
                  />
                </Field>

                <Field label="City" required>
                  <input
                    value={form.learnerAddressCity}
                    onChange={(e) => set("learnerAddressCity", e.target.value)}
                  />
                </Field>

                <Field label="Province" required>
                  <input
                    value={form.learnerAddressProvince}
                    onChange={(e) =>
                      set("learnerAddressProvince", e.target.value)
                    }
                  />
                </Field>

                <Field label="Postal Code">
                  <input
                    value={form.learnerAddressPostal}
                    onChange={(e) =>
                      set("learnerAddressPostal", e.target.value)
                    }
                  />
                </Field>

                <Field label="Transport Method">
                  <select
                    value={form.transport}
                    onChange={(e) => set("transport", e.target.value)}
                  >
                    <option value="">Select</option>
                    {TRANSPORT.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Medical / Special Support (optional)"
                  className="span-2"
                >
                  <textarea
                    rows={3}
                    value={form.medicalInfo}
                    onChange={(e) => set("medicalInfo", e.target.value)}
                    placeholder="Allergies, medication, disabilities, learning support needs, etc."
                  />
                </Field>
              </div>
            </>
          )}

          {step === "guardian" && (
            <>
              <h2 className="af-h2">Parent / Guardian Details</h2>
              <p className="af-muted">
                Provide contact details for the primary guardian responsible for
                the learner.
              </p>

              <div className="af-grid">
                <Field label="Full Name" required>
                  <input
                    value={form.guardianFullName}
                    onChange={(e) => set("guardianFullName", e.target.value)}
                  />
                </Field>

                <Field label="Relationship" required>
                  <select
                    value={form.guardianRelationship}
                    onChange={(e) =>
                      set("guardianRelationship", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {RELATIONSHIPS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="ID Number" required>
                  <input
                    value={form.guardianIdNumber}
                    onChange={(e) => set("guardianIdNumber", e.target.value)}
                  />
                </Field>

                <Field label="Phone Number" required>
                  <input
                    value={form.guardianPhone}
                    onChange={(e) => set("guardianPhone", e.target.value)}
                    placeholder="e.g. 071 000 0000"
                  />
                </Field>

                <Field label="Alternative Phone">
                  <input
                    value={form.guardianAltPhone}
                    onChange={(e) => set("guardianAltPhone", e.target.value)}
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    type="email"
                    value={form.guardianEmail}
                    onChange={(e) => set("guardianEmail", e.target.value)}
                    placeholder="e.g. name@email.com"
                  />
                </Field>

                <Field label="Employer (optional)">
                  <input
                    value={form.guardianEmployer}
                    onChange={(e) => set("guardianEmployer", e.target.value)}
                  />
                </Field>

                <Field label="Work Phone (optional)">
                  <input
                    value={form.guardianWorkPhone}
                    onChange={(e) => set("guardianWorkPhone", e.target.value)}
                  />
                </Field>
              </div>
            </>
          )}

          {step === "school" && (
            <>
              <h2 className="af-h2">School Information & Emergency Contact</h2>
              <p className="af-muted">
                Provide previous school details and an emergency contact we can
                reach if needed.
              </p>

              <div className="af-grid">
                <Field label="Previous School Name" required className="span-2">
                  <input
                    value={form.prevSchoolName}
                    onChange={(e) => set("prevSchoolName", e.target.value)}
                  />
                </Field>

                <Field label="Current/Previous Grade" required>
                  <input
                    value={form.prevSchoolGrade}
                    onChange={(e) => set("prevSchoolGrade", e.target.value)}
                    placeholder="e.g. Grade 9"
                  />
                </Field>

                <Field label="Province" required>
                  <input
                    value={form.prevSchoolProvince}
                    onChange={(e) => set("prevSchoolProvince", e.target.value)}
                  />
                </Field>

                <Field
                  label="Reason for Transfer (optional)"
                  className="span-2"
                >
                  <textarea
                    rows={3}
                    value={form.prevSchoolReason}
                    onChange={(e) => set("prevSchoolReason", e.target.value)}
                  />
                </Field>

                <Field label="Needs Financial Support?">
                  <select
                    value={form.needsFinancialSupport}
                    onChange={(e) =>
                      set("needsFinancialSupport", e.target.value)
                    }
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </Field>

                <Field label="Hostel Required?">
                  <select
                    value={form.hostels}
                    onChange={(e) => set("hostels", e.target.value)}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </Field>

                <div className="af-divider span-2" />

                <Field label="Emergency Contact Name" required>
                  <input
                    value={form.emergencyName}
                    onChange={(e) => set("emergencyName", e.target.value)}
                  />
                </Field>

                <Field label="Relationship" required>
                  <input
                    value={form.emergencyRelationship}
                    onChange={(e) =>
                      set("emergencyRelationship", e.target.value)
                    }
                  />
                </Field>

                <Field label="Emergency Phone" required className="span-2">
                  <input
                    value={form.emergencyPhone}
                    onChange={(e) => set("emergencyPhone", e.target.value)}
                  />
                </Field>
              </div>
            </>
          )}

          {step === "docs" && (
            <>
              <h2 className="af-h2">Required Document Uploads</h2>
              <p className="af-muted">
                Upload clear photos or PDFs. Recommended: PDF or JPG/PNG. Keep
                files under a reasonable size.
              </p>

              <div className="af-grid">
                <UploadField
                  label="Learner ID / Birth Certificate"
                  required
                  hint="PDF/JPG/PNG"
                  file={files.learnerId}
                  onChange={(f) => setFiles((p) => ({ ...p, learnerId: f }))}
                />

                <UploadField
                  label="Parent/Guardian ID"
                  required
                  hint="PDF/JPG/PNG"
                  file={files.guardianId}
                  onChange={(f) => setFiles((p) => ({ ...p, guardianId: f }))}
                />

                <UploadField
                  label="Latest School Report"
                  required
                  hint="PDF preferred"
                  file={files.latestReport}
                  onChange={(f) => setFiles((p) => ({ ...p, latestReport: f }))}
                />

                <UploadField
                  label="Proof of Address"
                  required
                  hint="Municipal account / affidavit"
                  file={files.proofAddress}
                  onChange={(f) => setFiles((p) => ({ ...p, proofAddress: f }))}
                />

                <UploadField
                  label="Transfer Letter (if applicable)"
                  hint="Optional"
                  file={files.transferLetter}
                  onChange={(f) =>
                    setFiles((p) => ({ ...p, transferLetter: f }))
                  }
                />

                <UploadField
                  label="Other Supporting Document"
                  hint="Optional"
                  file={files.other}
                  onChange={(f) => setFiles((p) => ({ ...p, other: f }))}
                />
              </div>

              <div className="af-callout">
                <div className="af-callout-title">Tip</div>
                <div className="af-callout-text">
                  If you cannot upload documents, you may submit the manual form
                  in person with certified copies.
                </div>
              </div>
            </>
          )}

          {step === "review" && (
            <>
              <h2 className="af-h2">Review & Submit</h2>
              <p className="af-muted">
                Confirm that your information is correct before submitting.
              </p>

              <div className="af-review">
                <div className="af-review-col">
                  <div className="af-review-title">Learner</div>
                  <ReviewRow
                    k="Full Name"
                    v={`${form.learnerFirstName} ${form.learnerLastName}`}
                  />
                  <ReviewRow k="DOB" v={form.learnerDOB || "—"} />
                  <ReviewRow k="Gender" v={form.learnerGender || "—"} />
                  <ReviewRow k="Grade" v={form.learnerGrade || "—"} />
                  <ReviewRow
                    k="ID/Birth No."
                    v={form.learnerIdOrBirth || "—"}
                  />
                  <ReviewRow
                    k="Address"
                    v={`${form.learnerAddressLine1}, ${form.learnerAddressCity}, ${form.learnerAddressProvince}`}
                  />
                </div>

                <div className="af-review-col">
                  <div className="af-review-title">Parent/Guardian</div>
                  <ReviewRow k="Full Name" v={form.guardianFullName || "—"} />
                  <ReviewRow
                    k="Relationship"
                    v={form.guardianRelationship || "—"}
                  />
                  <ReviewRow k="Phone" v={form.guardianPhone || "—"} />
                  <ReviewRow k="Email" v={form.guardianEmail || "—"} />
                  <div className="af-review-title" style={{ marginTop: 14 }}>
                    Uploads
                  </div>
                  <ReviewRow
                    k="Learner Document"
                    v={files.learnerId ? "Attached" : "Missing"}
                  />
                  <ReviewRow
                    k="Guardian ID"
                    v={files.guardianId ? "Attached" : "Missing"}
                  />
                  <ReviewRow
                    k="Latest Report"
                    v={files.latestReport ? "Attached" : "Missing"}
                  />
                  <ReviewRow
                    k="Proof of Address"
                    v={files.proofAddress ? "Attached" : "Missing"}
                  />
                  <ReviewRow
                    k="Transfer Letter"
                    v={files.transferLetter ? "Attached" : "Not provided"}
                  />
                </div>
              </div>

              <div className="af-checks">
                <label className="af-check">
                  <input
                    type="checkbox"
                    checked={form.consentTruth}
                    onChange={(e) => set("consentTruth", e.target.checked)}
                  />
                  <span>
                    I confirm that the information provided is true and correct
                    to the best of my knowledge.
                    <span className="req"> *</span>
                  </span>
                </label>

                <label className="af-check">
                  <input
                    type="checkbox"
                    checked={form.consentPolicy}
                    onChange={(e) => set("consentPolicy", e.target.checked)}
                  />
                  <span>
                    I understand that submission does not guarantee placement
                    and that the school may request supporting documents for
                    verification.
                    <span className="req"> *</span>
                  </span>
                </label>
              </div>

              <div className="af-submit-note">
                By submitting, your application will be sent to the
                Administration Office for review.
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="af-footer">
          <button
            type="button"
            className="af-nav ghost"
            onClick={back}
            disabled={stepIndex === 0 || submitting}
          >
            Back
          </button>

          <div className="af-footer-right">
            <div
              className={`af-status ${validateCurrentStep() ? "ok" : "warn"}`}
            >
              {validateCurrentStep() ? "Step Complete" : "Incomplete"}
            </div>

            {stepIndex < steps.length - 1 ? (
              <button
                type="button"
                className="af-nav primary"
                onClick={next}
                disabled={submitting}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                className="af-nav primary"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>
      </section>

      <p className="af-help">
        If you experience any difficulty, contact the school office or submit
        your manual application form with certified copies.
      </p>
    </main>
  );
}

/* ---------- small helpers ---------- */

function Field({ label, required, children, className }) {
  return (
    <div className={`af-field ${className || ""}`}>
      <div className="af-label">
        {label} {required ? <span className="req">*</span> : null}
      </div>
      {children}
    </div>
  );
}

function UploadField({ label, required, hint, file, onChange }) {
  return (
    <div className="af-upload">
      <div className="af-upload-top">
        <div className="af-label">
          {label} {required ? <span className="req">*</span> : null}
        </div>
        <div className="af-hint">{hint}</div>
      </div>

      <label className="af-upload-box">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => onChange?.(e.target.files?.[0] || null)}
        />
        <div className="af-upload-text">
          <div className="af-upload-main">Choose file</div>
          <div className="af-upload-sub">{fileLabel(file)}</div>
        </div>
      </label>
    </div>
  );
}

function ReviewRow({ k, v }) {
  return (
    <div className="af-row">
      <div className="af-k">{k}</div>
      <div className="af-v">{v}</div>
    </div>
  );
}
