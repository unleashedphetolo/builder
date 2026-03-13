import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
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
  calendar: "Calendar",

  admissions: "Admissions",
  apply: "Apply Now",
  howtoapply: "How to Apply",
  requirements: "Entry Requirements",

  contact: "Contact",
  gallery: "Gallery",
  robotics: "Robotics Club",
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

export default function Breadcrumbs({ className = "" }) {
  const location = useLocation();

  const crumbs = useMemo(() => {

    const hash = location.hash || "";

    if (!hash.includes("/site/")) return [];

    const afterSite = hash.split("/site/")[1] || "";

    const parts = afterSite.split("/").filter(Boolean);

    // remove siteId
    const segments = parts.slice(1);

    if (!segments.length) return [];

    let path = "";

    const items = [
      {
        label: "Home",
        slug: "/",
      },
    ];

    segments.forEach((seg) => {
      path += `/${seg}`;

      items.push({
        label: prettify(seg),
        slug: path,
      });
    });

    return items;

  }, [location.hash]);

  if (!crumbs.length) return null;

  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className={`bc ${className}`} aria-label="Breadcrumb">
      <ol className="bc-list">

        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;

          return (
            <li key={c.slug} className="bc-item">

              {last ? (
                <span className="bc-current">{c.label}</span>
              ) : (
                <>
                  <a
                    className="bc-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(c.slug);
                    }}
                  >
                    {c.label}
                  </a>

                  <span className="bc-sep">/</span>
                </>
              )}

            </li>
          );
        })}

      </ol>
    </nav>
  );
}