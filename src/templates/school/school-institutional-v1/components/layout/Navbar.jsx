import React, { useEffect, useMemo, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import "../../styles/navbar.css";
import logos from "../../assets/sebone.jpeg";

const DEFAULT_FEATURES = {
  about: true,
  digitalLibrary: false,
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
  return `#/site/${siteId || ""}${clean}`;
}

export default function Navbar({ settings = {}, navItems = [], navigateTo }) {
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

  const dbNavItems = useMemo(() => {
    return Array.isArray(navItems)
      ? navItems
          .filter(
            (item) =>
              item && item.is_visible !== false && item.location !== "footer",
          )
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      : [];
  }, [navItems]);

  const menus = useMemo(
    () => ({
      about: [
        { to: buildSiteHref(siteId, "/about/who-we-are"), label: "Who We Are" },
        {
          to: buildSiteHref(siteId, "/about/vision-mission"),
          label: "Vision & Mission",
        },
        { to: buildSiteHref(siteId, "/staff"), label: "Staff Members" },
        { to: buildSiteHref(siteId, "/sgb"), label: "SGB" },
        { to: buildSiteHref(siteId, "/facilities"), label: "Facilities" },
        { to: buildSiteHref(siteId, "/about/history"), label: "Our History" },
      ],
      activities: [
        {
          to: buildSiteHref(siteId, "/activities/academics"),
          label: "Academics",
        },
        {
          to: buildSiteHref(siteId, "/activities/sports"),
          label: "Sports & Recreation",
        },
        {
          to: buildSiteHref(siteId, "/activities/culture"),
          label: "Culture & Activities",
        },
        {
          to: buildSiteHref(siteId, "/activities/facilities"),
          label: "Campus Facilities",
        },
      ],
      resources: [
        {
          to: buildSiteHref(siteId, "/resources/subject-choices"),
          label: "Subject Choices",
        },
        {
          to: buildSiteHref(siteId, "/resources/term-plan"),
          label: "Term Plan",
        },
        {
          to: buildSiteHref(siteId, "/resources/exam-schedule"),
          label: "Exam Schedule",
        },
        {
          to: buildSiteHref(siteId, "/resources/code-of-conduct"),
          label: "Code of Conduct",
        },
        {
          to: buildSiteHref(siteId, "/resources/stationary-list"),
          label: "Stationary List",
        },
        { to: buildSiteHref(siteId, "/resources/calendar"), label: "Calendar" },
      ],
      news: [
        { to: buildSiteHref(siteId, "/news"), label: "Newsletters" },
        {
          to: buildSiteHref(siteId, "/schoolcalendar"),
          label: "School Calendar",
        },
      ],
      admissions: [
        {
          to: buildSiteHref(siteId, "/admissions/howtoapply"),
          label: "How to Apply",
        },
        {
          to: buildSiteHref(siteId, "/admissions/requirements"),
          label: "Entry Requirements",
        },
        { to: buildSiteHref(siteId, "/admissions/apply"), label: "Apply Now" },
      ],
    }),
    [siteId],
  );

  const toggleDropdown = (key) => {
    setDropdown((cur) => (cur === key ? null : key));
  };

  const Drop = ({ id, label, items, href }) => (
    <div
      className="dropdown parent"
      onMouseEnter={() => setDropdown(id)}
      onMouseLeave={() => setDropdown(null)}
    >
      <button
        type="button"
        className="drop-btn"
        onClick={() => {
          if (window.innerWidth <= 880) {
            toggleDropdown(id);
          } else if (href) {
            const slug = href.replace(`#/site/${siteId}`, "") || "/";
            navigateTo?.(slug);
          }
        }}
        aria-expanded={dropdown === id}
      >
        {label} <IoChevronDown />
      </button>

      <div className={`drop-menu ${dropdown === id ? "show" : ""}`}>
        {items.map((it) => (
          <a
            key={`${it.to}-${it.label}`}
            href={it.to}
            onClick={(e) => {
              e.preventDefault();
              const slug = it.to.replace(`#/site/${siteId}`, "") || "/";
              navigateTo?.(slug);
              setOpen(false); // CLOSE HAMBURGER MENU
            }}
          >
            {it.label}
          </a>
        ))}
      </div>
    </div>
  );

  const dbNavMap = useMemo(() => {
    const map = {};
    dbNavItems.forEach((item) => {
      const key = (item.label || "").trim().toLowerCase();
      if (key) map[key] = item;
    });
    return map;
  }, [dbNavItems]);

  const topNav = useMemo(() => {
    const items = [];

    const getDbHref = (label, fallbackPath) => {
      const found = dbNavMap[label.toLowerCase()];
      if (found?.href) return buildSiteHref(siteId, found.href);
      return buildSiteHref(siteId, fallbackPath);
    };

    items.push({
      type: "link",
      key: "home",
      label: "Home",
      href: getDbHref("Home", "/"),
    });

    if (features.about) {
      items.push({
        type: "drop",
        key: "about",
        label: "About Us",
        href: getDbHref("About", "/about"),
        menu: menus.about,
      });
    }

    // if (features.digitalLibrary) {
    //   items.push({
    //     type: "link",
    //     key: "digital-library",
    //     label: "Digital Library",
    //     href: getDbHref("Digital Library", "/digital-library"),
    //   });
    // }

    if (features.activities) {
      items.push({
        type: "drop",
        key: "activities",
        label: "Activities",
        href: getDbHref("Activities", "/activities"),
        menu: menus.activities,
      });
    }

    if (features.resources) {
      items.push({
        type: "drop",
        key: "resources",
        label: "Resources",
        href: getDbHref("Resources", "/resources"),
        menu: menus.resources,
      });
    }

    if (features.news) {
      items.push({
        type: "drop",
        key: "news",
        label: "News",
        href: getDbHref("News", "/news"),
        menu: menus.news,
      });
    }

    if (features.admissions) {
      items.push({
        type: "drop",
        key: "admissions",
        label: "Admissions",
        href: getDbHref("Admissions", "/admissions"),
        menu: menus.admissions,
      });
    }

    if (features.gallery) {
      items.push({
        type: "link",
        key: "gallery",
        label: "Gallery",
        href: getDbHref("Gallery", "/gallery"),
      });
    }

    if (features.robotics) {
      items.push({
        type: "link",
        key: "robotics",
        label: "Robotics Club",
        href: getDbHref("Robotics Club", "/robotics"),
      });
    }

    if (features.contact) {
      items.push({
        type: "link",
        key: "contact",
        label: "Contact",
        href: getDbHref("Contact", "/contact"),
      });
    }

    return items;
  }, [dbNavMap, features, menus, siteId]);

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <div className="logo-section">
          <a
            href={buildSiteHref(siteId, "/")}
            className="logo-link"
            aria-label="Go to home"
            onClick={(e) => {
              e.preventDefault();
              navigateTo?.("/");
            }}
          >
            <img src={logoUrl} alt="School logo" className="logo-image" />
            <div className="logo-text">
              <h1 className="brand-name">{schoolName}</h1>
              <p className="slogan">{tagline}</p>
            </div>
          </a>
        </div>

        <nav
          className={`nav-links ${open ? "open" : ""}`}
          aria-label="Main navigation"
        >
          {topNav.map((item) =>
            item.type === "drop" ? (
              <Drop
                key={item.key}
                id={item.key}
                label={item.label}
                href={item.href}
                items={item.menu}
              />
            ) : (
              <a
                key={item.key}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const slug = item.href.replace(`#/site/${siteId}`, "") || "/";
                  navigateTo?.(slug);
                  setOpen(false); // CLOSE HAMBURGER MENU
                }}
              >
                {item.label}
              </a>
            ),
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
