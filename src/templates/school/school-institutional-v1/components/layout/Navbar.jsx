import React, { useEffect, useMemo, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import "../../styles/navbar.css";
import logos from "../../assets/sebone.jpeg";

const DEFAULT_FEATURES = {
  about: true,
  digitalLibrary: true,
  activities: true,
  resources: true,
  news: true,
  admissions: true,
  gallery: true,
  robotics: true,
  contact: true,
};

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

export default function Navbar({ settings = {}, navItems = [] }) {
  const features = {
    ...DEFAULT_FEATURES,
    ...(settings?.features || {}),
  };

  const logoUrl = settings?.logo_url || logos;
  const schoolName = settings?.site_name || "School";
  const tagline = settings?.tagline || "Secondary School";
  const siteId = settings?.site_id || "";

  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const visibleNavItems = useMemo(() => {
    return Array.isArray(navItems)
      ? navItems
          .filter((item) => item && item.is_visible !== false && item.location !== "footer")
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      : [];
  }, [navItems]);

  const menus = useMemo(
    () => ({
      about: [
        { to: buildSiteHref(siteId, "/about/who-we-are"), label: "Who We Are" },
        { to: buildSiteHref(siteId, "/about/vision-mission"), label: "Vision & Mission" },
        { to: buildSiteHref(siteId, "/staff"), label: "Staff Members" },
        { to: buildSiteHref(siteId, "/sgb"), label: "SGB" },
        { to: buildSiteHref(siteId, "/facilities"), label: "Facilities" },
        { to: buildSiteHref(siteId, "/about/history"), label: "Our History" },
      ],
      activities: [
        { to: buildSiteHref(siteId, "/activities/academics"), label: "Academics" },
        { to: buildSiteHref(siteId, "/activities/sports"), label: "Sports & Recreation" },
        { to: buildSiteHref(siteId, "/activities/culture"), label: "Culture & Activities" },
        { to: buildSiteHref(siteId, "/activities/facilities"), label: "Campus Facilities" },
      ],
      resources: [
        { to: buildSiteHref(siteId, "/resources/subject-choices"), label: "Subject Choices" },
        { to: buildSiteHref(siteId, "/resources/term-plan"), label: "Term Plan" },
        { to: buildSiteHref(siteId, "/resources/exam-schedule"), label: "Exam Schedule" },
        { to: buildSiteHref(siteId, "/resources/code-of-conduct"), label: "Code of Conduct" },
        { to: buildSiteHref(siteId, "/resources/stationary-list"), label: "Stationary List" },
        { to: buildSiteHref(siteId, "/resources/calendar"), label: "Calendar" },
      ],
      news: [
        { to: buildSiteHref(siteId, "/news"), label: "Newsletters" },
        { to: buildSiteHref(siteId, "/schoolcalendar"), label: "School Calendar" },
      ],
      admissions: [
        { to: buildSiteHref(siteId, "/admissions/howtoapply"), label: "How to Apply" },
        { to: buildSiteHref(siteId, "/admissions/requirements"), label: "Entry Requirements" },
        { to: buildSiteHref(siteId, "/admissions/apply"), label: "Apply Now" },
      ],
    }),
    [siteId]
  );

  const toggleDropdown = (key) => {
    setDropdown((cur) => (cur === key ? null : key));
  };

  const Drop = ({ id, label, items }) => (
    <div
      className="dropdown parent"
      onMouseEnter={() => setDropdown(id)}
      onMouseLeave={() => setDropdown(null)}
      onClick={() => toggleDropdown(id)}
    >
      <span className="drop-btn">
        {label} <IoChevronDown />
      </span>

      <div className={`drop-menu ${dropdown === id ? "show" : ""}`}>
        {items.map((it) => (
          <a key={`${it.to}-${it.label}`} href={it.to}>
            {it.label}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <div className="logo-section">
          <a href={buildSiteHref(siteId, "/")} className="logo-link" aria-label="Go to home">
            <img src={logoUrl} alt="School logo" className="logo-image" />
            <div className="logo-text">
              <h1 className="brand-name">{schoolName}</h1>
              <p className="slogan">{tagline}</p>
            </div>
          </a>
        </div>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main navigation">
          {visibleNavItems.length > 0 ? (
            visibleNavItems.map((item) => (
              <a key={item.id} href={buildSiteHref(siteId, item.href || "/")}>
                {item.label}
              </a>
            ))
          ) : (
            <>
              <a href={buildSiteHref(siteId, "/")}>Home</a>
              {features.about && <Drop id="about" label="About Us" items={menus.about} />}
              {features.digitalLibrary && (
                <a href={buildSiteHref(siteId, "/digital-library")}>Digital Library</a>
              )}
              {features.activities && (
                <Drop id="activities" label="Activities" items={menus.activities} />
              )}
              {features.resources && (
                <Drop id="resources" label="Resources" items={menus.resources} />
              )}
              {features.news && <Drop id="news" label="News" items={menus.news} />}
              {features.admissions && (
                <Drop id="adm" label="Admissions" items={menus.admissions} />
              )}
              {features.gallery && <a href={buildSiteHref(siteId, "/gallery")}>Gallery</a>}
              {features.robotics && (
                <a href={buildSiteHref(siteId, "/robotics")}>Robotics Club</a>
              )}
              {features.contact && <a href={buildSiteHref(siteId, "/contact")}>Contact</a>}
            </>
          )}
        </nav>

        <button
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="toggle menu"
          aria-expanded={open}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}