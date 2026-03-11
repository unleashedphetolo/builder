import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
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
  notices: "Notices",
  news: "News",
  events: "Events",
};

function prettify(seg) {
  if (!seg) return "";
  if (LABELS[seg]) return LABELS[seg];
  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

export default function Breadcrumbs({ className = "", settings = {} }) {
  const location = useLocation();
  const params = useParams();

  const siteId = settings?.site_id || params?.siteId || "";

  const crumbs = useMemo(() => {
    const pathname = location.pathname || "";
    const afterSite = pathname.replace(`/site/${siteId}`, "") || "/";
    const cleanPath = afterSite === "" ? "/" : afterSite;

    const segments = cleanPath.split("/").filter(Boolean);

    if (segments.length === 0) return [];

    return [
      { label: "Home", href: buildSiteHref(siteId, "/") },
      ...segments.map((seg, idx) => {
        const path = "/" + segments.slice(0, idx + 1).join("/");
        return {
          label: prettify(seg),
          href: buildSiteHref(siteId, path),
        };
      }),
    ];
  }, [location.pathname, siteId]);

  if (crumbs.length === 0) return null;

  return (
    <nav className={`bc ${className}`} aria-label="Breadcrumb">
      <ol className="bc-list">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;

          return (
            <li className="bc-item" key={c.href}>
              {isLast ? (
                <span className="bc-current" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <>
                  <a className="bc-link" href={c.href}>
                    {c.label}
                  </a>
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