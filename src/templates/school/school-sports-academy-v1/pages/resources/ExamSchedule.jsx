import React, { useMemo, useState } from "react";
import BuilderSectionTarget from "../../../../../builder/BuilderSectionTarget";
import Card from "../../components/common/Card";
import "../../styles/exam-schedule.css";

const FALLBACK_EXAMS = [
  {
    id: "exam-grade12-english-p1",
    grade: "Grade 12",
    subject: "English Home Language",
    paper: "Paper 1",
    date: "2026-11-02",
    time: "09:00",
    end_time: "12:00",
    venue: "Main Hall",
    duration: "3 hours",
    status: "Scheduled",
  },
  {
    id: "exam-grade12-mathematics-p1",
    grade: "Grade 12",
    subject: "Mathematics",
    paper: "Paper 1",
    date: "2026-11-04",
    time: "09:00",
    end_time: "12:00",
    venue: "Main Hall",
    duration: "3 hours",
    status: "Scheduled",
  },
  {
    id: "exam-grade12-life-sciences-p1",
    grade: "Grade 12",
    subject: "Life Sciences",
    paper: "Paper 1",
    date: "2026-11-06",
    time: "09:00",
    end_time: "11:30",
    venue: "Main Hall",
    duration: "2 h 30 min",
    status: "Scheduled",
  },
  {
    id: "exam-grade11-mathematics-p1",
    grade: "Grade 11",
    subject: "Mathematics",
    paper: "Paper 1",
    date: "2026-11-09",
    time: "09:00",
    end_time: "12:00",
    venue: "Room B12",
    duration: "3 hours",
    status: "Scheduled",
  },
  {
    id: "exam-grade11-physical-sciences-p1",
    grade: "Grade 11",
    subject: "Physical Sciences",
    paper: "Paper 1",
    date: "2026-11-11",
    time: "09:00",
    end_time: "12:00",
    venue: "Science Block",
    duration: "3 hours",
    status: "Scheduled",
  },
  {
    id: "exam-grade10-geography-p1",
    grade: "Grade 10",
    subject: "Geography",
    paper: "Paper 1",
    date: "2026-11-12",
    time: "09:00",
    end_time: "11:30",
    venue: "Room C04",
    duration: "2 h 30 min",
    status: "Scheduled",
  },
  {
    id: "exam-grade9-mathematics",
    grade: "Grade 9",
    subject: "Mathematics",
    paper: "Final Assessment",
    date: "2026-11-16",
    time: "09:00",
    end_time: "11:00",
    venue: "Room A08",
    duration: "2 hours",
    status: "Scheduled",
  },
  {
    id: "exam-grade8-natural-sciences",
    grade: "Grade 8",
    subject: "Natural Sciences",
    paper: "Final Assessment",
    date: "2026-11-18",
    time: "09:00",
    end_time: "10:30",
    venue: "Room A03",
    duration: "1 h 30 min",
    status: "Scheduled",
  },
];

function getDateValue(item = {}) {
  return String(item.date || item.startAt || item.start || "").split("T")[0];
}

function getTimeValue(item = {}) {
  const explicitTime = item.time || item.start_time;

  if (explicitTime) return String(explicitTime);

  const timestamp = item.startAt || item.start || "";
  const timePart = String(timestamp).split("T")[1] || "";

  return timePart.slice(0, 5);
}

function normalizeExam(item = {}, index = 0) {
  return {
    id: item.id || `exam-${index + 1}`,
    grade: item.grade || "All Grades",
    subject: item.subject || item.title || "Examination",
    paper: item.paper || item.assessment || "",
    date: getDateValue(item),
    time: getTimeValue(item),
    end_time: item.end_time || item.endTime || "",
    venue: item.venue || item.location || "To be confirmed",
    duration: item.duration || "",
    status: item.status || "Scheduled",
  };
}

function formatDate(dateValue = "") {
  if (!dateValue) return "To be confirmed";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimeRange(start = "", end = "") {
  if (!start) return "TBC";
  if (!end) return start;

  return `${start} – ${end}`;
}

function sortByDateAndTime(first, second) {
  const firstKey = `${first.date || "9999-12-31"}T${first.time || "23:59"}`;
  const secondKey = `${second.date || "9999-12-31"}T${second.time || "23:59"}`;

  return firstKey.localeCompare(secondKey);
}

function countUnique(items = [], key = "") {
  return new Set(items.map((item) => item[key]).filter(Boolean)).size;
}

export default function ExamSchedule({
  section = null,
  content = {},
  builderMode = false,
}) {
  const [gradeFilter, setGradeFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  const examItems = useMemo(() => {
    const sourceItems =
      Array.isArray(content?.items) && content.items.length > 0
        ? content.items
        : FALLBACK_EXAMS;

    return sourceItems.map(normalizeExam).sort(sortByDateAndTime);
  }, [content?.items]);

  const gradeOptions = useMemo(
    () =>
      [...new Set(examItems.map((item) => item.grade).filter(Boolean))].sort(),
    [examItems],
  );

  const filteredExams = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    return examItems.filter((item) => {
      const matchesGrade =
        gradeFilter === "all" || item.grade === gradeFilter;

      const matchesQuery =
        !query ||
        [item.subject, item.paper, item.venue, item.status]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesGrade && matchesQuery;
    });
  }, [examItems, gradeFilter, searchValue]);

  const firstExam = examItems[0];
  const lastExam = examItems[examItems.length - 1];
  const pdfPath = String(content?.pdf_url || "").trim();

  const pageContent = (
    <main className="exam-schedule-page container">
      <header className="exam-schedule-hero">
        <div className="exam-schedule-hero__copy">
          <span className="exam-schedule-kicker">
            {content?.kicker || "Academic Assessment"}
          </span>
          <h1 className="exam-schedule-title">
            {content?.section_title || "Exam Schedule"}
          </h1>
          <p className="exam-schedule-subtitle">
            {content?.subtitle ||
              "View examination dates, subjects, times and venues. Learners should arrive early with all required materials."}
          </p>
        </div>

        {pdfPath && (
          <div className="exam-schedule-actions">
            <a
              href={pdfPath}
              target="_blank"
              rel="noreferrer"
              className="exam-schedule-btn exam-schedule-btn--primary"
            >
              {content?.view_button_label || "View Official PDF"}
            </a>
            <a
              href={pdfPath}
              download
              className="exam-schedule-btn exam-schedule-btn--outline"
            >
              {content?.download_button_label || "Download Schedule"}
            </a>
          </div>
        )}
      </header>

      {/* <aside className="exam-schedule-notice" role="note">
        <strong>{content?.notice_title || "Important notice"}</strong>
        <p>
          {content?.notice_body ||
            "The timetable shown below contains sample dates for website setup. Replace it with the school-approved examination timetable before publishing."}
        </p>
      </aside> */}

      <section className="exam-schedule-summary" aria-label="Schedule overview">
        <div className="exam-schedule-stat">
          <span>Assessments</span>
          <strong>{examItems.length}</strong>
        </div>
        <div className="exam-schedule-stat">
          <span>Grades Covered</span>
          <strong>{countUnique(examItems, "grade")}</strong>
        </div>
        <div className="exam-schedule-stat">
          <span>First Date</span>
          <strong>{firstExam ? formatDate(firstExam.date) : "TBC"}</strong>
        </div>
        <div className="exam-schedule-stat">
          <span>Final Date</span>
          <strong>{lastExam ? formatDate(lastExam.date) : "TBC"}</strong>
        </div>
      </section>

      <Card>
        <div className="exam-schedule-card">
          <div className="exam-schedule-toolbar">
            <div>
              <h2>{content?.table_title || "Examination Timetable"}</h2>
              <p>
                {content?.table_subtitle ||
                  "Filter by grade or search by subject and venue."}
              </p>
            </div>

            <div className="exam-schedule-filters">
              <label className="exam-schedule-field">
                <span>Grade</span>
                <select
                  value={gradeFilter}
                  onChange={(event) => setGradeFilter(event.target.value)}
                >
                  <option value="all">All Grades</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </label>

              <label className="exam-schedule-field exam-schedule-field--search">
                <span>Search</span>
                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Subject or venue"
                />
              </label>
            </div>
          </div>

          <div
            className="exam-schedule-table-wrap"
            role="region"
            aria-label="Examination timetable"
          >
            <table className="exam-schedule-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Grade</th>
                  <th>Subject / Paper</th>
                  <th>Venue</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredExams.map((exam) => (
                  <tr key={exam.id}>
                    <td data-label="Date">
                      <strong>{formatDate(exam.date)}</strong>
                    </td>
                    <td data-label="Time">
                      {formatTimeRange(exam.time, exam.end_time)}
                    </td>
                    <td data-label="Grade">{exam.grade}</td>
                    <td data-label="Subject / Paper">
                      <div className="exam-schedule-subject">{exam.subject}</div>
                      {exam.paper && (
                        <div className="exam-schedule-paper">{exam.paper}</div>
                      )}
                    </td>
                    <td data-label="Venue">{exam.venue}</td>
                    <td data-label="Duration">{exam.duration || "—"}</td>
                    <td data-label="Status">
                      <span className="exam-schedule-status">
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredExams.length === 0 && (
                  <tr>
                    <td colSpan={7} className="exam-schedule-empty">
                      No examinations match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <footer className="exam-schedule-footer">
        <p>
          {content?.footer_note ||
            "Learners must confirm final dates with the school and report to the examination venue at least 30 minutes before the starting time."}
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
      sectionType="school_exam_schedule"
      label={content?.section_title || "Exam Schedule"}
      templateCategory="school"
      templateKey="school-sports-academy-v1"
    >
      {pageContent}
    </BuilderSectionTarget>
  );
}
