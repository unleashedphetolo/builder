import React from "react";
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
  if (LABELS[seg]) return LABELS[seg];

  return seg
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs({ slug = "/" }) {

  const segments = slug.split("/").filter(Boolean);

  let path = "";

  const crumbs = [{ label: "Home", slug: "/" }];

  segments.forEach((seg) => {
    path += `/${seg}`;

    crumbs.push({
      label: prettify(seg),
      slug: path,
    });
  });

  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug })
    );
  };

  return (
    <nav className="bc" aria-label="Breadcrumb">
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
                    href="#"
                    className="bc-link"
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