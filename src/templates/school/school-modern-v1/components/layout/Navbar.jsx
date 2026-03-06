import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";
import "../../styles/navbar.css";
import logos from "../../assets/sebone.jpeg";

const DEFAULT_FEATURES = {
  about: true,
  activities: true,
  resources: true,
  news: true,
  admissions: true,
  gallery: true,
  robotics: true,
  contact: true,
  digitalLibrary: true,
};

function mergeSchoolFeatures(features) {
  return {
    ...DEFAULT_FEATURES,
    ...(features || {}),
  };
}

function getRoutePrefix(settings) {
  if (settings?.site_id) return `/site/${settings.site_id}`;
  return "/site";
}

function buildLink(routePrefix, path) {
  if (!path) return routePrefix;
  if (path === "/") return `${routePrefix}/`;
  return `${routePrefix}${path}`;
}

export default function Navbar({ settings = {}, navItems = [] }) {
  const f = mergeSchoolFeatures(settings?.features);
  const logoUrl = settings?.logo_url || logos;
  const schoolName = settings?.site_name || "School";
  const tagline = settings?.tagline || "Secondary School";
  const routePrefix = getRoutePrefix(settings);

  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const loc = useLocation();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setDropdown(null);
  }, [loc.pathname]);

  const isActive = (path) => {
    const fullPath = buildLink(routePrefix, path);
    return loc.pathname === fullPath;
  };

  const menus = useMemo(
    () => ({
      about: [
        { to: buildLink(routePrefix, "/about"), label: "Who We Are" },
        { to: buildLink(routePrefix, "/about"), label: "Vision & Mission" },
        { to: buildLink(routePrefix, "/staff"), label: "Staff Members" },
        { to: buildLink(routePrefix, "/sgb"), label: "SGB" },
        { to: buildLink(routePrefix, "/facilities"), label: "Facilities" },
        { to: buildLink(routePrefix, "/about"), label: "Our History" },
      ],
      activities: [
        { to: buildLink(routePrefix, "/activities/academics"), label: "Academics" },
        { to: buildLink(routePrefix, "/activities/sports"), label: "Sports & Recreation" },
        { to: buildLink(routePrefix, "/activities/culture"), label: "Culture & Activities" },
        { to: buildLink(routePrefix, "/activities/facilities"), label: "Campus Facilities" },
      ],
      resources: [
        { to: buildLink(routePrefix, "/resources/subject-choices"), label: "Subject Choices" },
        { to: buildLink(routePrefix, "/resources/term-plan"), label: "Term Plan" },
        { to: buildLink(routePrefix, "/resources/exam-schedule"), label: "Exam Schedule" },
        { to: buildLink(routePrefix, "/resources/code-of-conduct"), label: "Code of Conduct" },
        { to: buildLink(routePrefix, "/resources/stationary-list"), label: "Stationary List" },
        { to: buildLink(routePrefix, "/calendar"), label: "Calendar" },
      ],
      news: [
        { to: buildLink(routePrefix, "/news"), label: "Newsletters" },
        { to: buildLink(routePrefix, "/schoolcalendar"), label: "School Calendar" },
      ],
      admissions: [
        { to: buildLink(routePrefix, "/admissions"), label: "How to Apply" },
        { to: buildLink(routePrefix, "/admissions"), label: "Entry Requirements" },
        { to: buildLink(routePrefix, "/admissions"), label: "Apply Now" },
      ],
    }),
    [routePrefix]
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
          <Link key={`${it.to}-${it.label}`} to={it.to}>
            {it.label}
          </Link>
        ))}
      </div>
    </div>
  );

  const visibleNavItems = Array.isArray(navItems)
    ? navItems
        .filter((item) => item && item.is_visible !== false && item.location !== "footer")
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    : [];

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <div className="logo-section">
          <Link to={buildLink(routePrefix, "/")} className="logo-link" aria-label="Go to home">
            <img src={logoUrl} alt={`${schoolName} logo`} className="logo-image" />
            <div className="logo-text">
              <h1 className="brand-name">{schoolName}</h1>
              <p className="slogan">{tagline}</p>
            </div>
          </Link>
        </div>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main navigation">
          {visibleNavItems.length > 0 ? (
            visibleNavItems.map((item) => (
              <Link
                key={item.id}
                className={isActive(item.href || "/") ? "active" : ""}
                to={buildLink(routePrefix, item.href || "/")}
              >
                {item.label}
              </Link>
            ))
          ) : (
            <>
              <Link className={isActive("/") ? "active" : ""} to={buildLink(routePrefix, "/")}>
                Home
              </Link>

              {f.about && <Drop id="about" label="About Us" items={menus.about} />}

              {f.digitalLibrary && (
                <Link
                  className={isActive("/digital-library") ? "active" : ""}
                  to={buildLink(routePrefix, "/digital-library")}
                >
                  Digital Library
                </Link>
              )}

              {f.activities && <Drop id="activities" label="Activities" items={menus.activities} />}
              {f.resources && <Drop id="resources" label="Resources" items={menus.resources} />}
              {f.news && <Drop id="news" label="News" items={menus.news} />}
              {f.admissions && <Drop id="adm" label="Admissions" items={menus.admissions} />}

              {f.gallery && (
                <Link
                  className={isActive("/gallery") ? "active" : ""}
                  to={buildLink(routePrefix, "/gallery")}
                >
                  Gallery
                </Link>
              )}

              {f.robotics && (
                <Link
                  className={isActive("/robotics") ? "active" : ""}
                  to={buildLink(routePrefix, "/robotics")}
                >
                  Robotics Club
                </Link>
              )}

              {f.contact && (
                <Link
                  className={isActive("/contact") ? "active" : ""}
                  to={buildLink(routePrefix, "/contact")}
                >
                  Contact
                </Link>
              )}
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