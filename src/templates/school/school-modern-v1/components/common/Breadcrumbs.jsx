import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/breadcrumbs.css";

const LABELS = {
  about: "About Us",
  "who-we-are": "Who We Are",
  "vision-mission": "Vision & Mission",
  history: "Our History",
  staff: "Staff Members",
  sgb: "SGB",
  facilities: "Facilities",

  activities: "Activities",
  academics: "Academics",
  sports: "Sports & Recreation",
  culture: "Culture & Activities",

  resources: "Resources",
  "subject-choices": "Subject Choices",
  "term-plan": "Term Plan",
  "exam-schedule": "Exam Schedule",
  "code-of-conduct": "Code of Conduct",
  "stationary-list": "Stationary List",
  calendar: "Calendar",

  admissions: "Admissions",
  apply: "Apply Now",
  howtoapply: "How to Apply",
  requirements: "Entry Requirements",

  schoolcalendar: "School Calendar",
  bulletin: "Student Daily Bulletin",
  contact: "Contact",
  gallery: "Gallery",
  robotics: "Robotics Club",
  "digital-library": "Digital Library",
};

function prettify(seg) {
  if (!seg) return "";
  if (LABELS[seg]) return LABELS[seg];
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs({ className = "" }) {
  const { pathname } = useLocation();

  const segments = pathname.split("/").filter(Boolean);

  // Hide on home page
  if (segments.length === 0) return null;

  const crumbs = [
    { label: "Home", to: "/site/" },
    ...segments.map((seg, idx) => {
      const to = "/" + segments.slice(0, idx + 1).join("/");
      return { label: prettify(seg), to };
    }),
  ];

  return (
    <nav className={`bc ${className}`} aria-label="Breadcrumb">
      <ol className="bc-list">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li className="bc-item" key={c.to}>
              {isLast ? (
                <span className="bc-current" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <>
                  <Link className="bc-link" to={c.to}>
                    {c.label}
                  </Link>
                  <span className="bc-sep" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}