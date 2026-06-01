import { useEffect, useId, useMemo, useRef, useState } from "react";
import "../../styles/builder-sections-panel.css";

const EMPTY_SECTIONS = Object.freeze([]);

const FILTERS = [
  { key: "all", label: "All" },
  { key: "visible", label: "On" },
  { key: "hidden", label: "Off" },
];

const SECTION_DEFINITIONS = [
  {
    group: "Media",
    icon: "▧",
    fallback: "Hero / Banner",
    keys: [
      "hero",
      "hero_slideshow",
      "slideshow",
      "banner",
      "cover",
      "masthead",
    ],
  },
  {
    group: "Content",
    icon: "▤",
    fallback: "Notices & Updates",
    keys: [
      "notice",
      "notices",
      "notice_board",
      "noticeboard",
      "announcements",
      "updates",
      "bulletin",
      "alerts",
      "news_updates",
    ],
  },
  {
    group: "Content",
    icon: "◎",
    fallback: "About Us",
    keys: [
      "about",
      "about_section",
      "aboutsection",
      "vision",
      "vision_mission",
      "mission_values",
      "our_story",
      "who_we_are",
      "company_profile",
      "business_profile",
      "farm_profile",
    ],
  },
  {
    group: "Content",
    icon: "♙",
    fallback: "Leadership Message",
    keys: [
      "principal",
      "principal_message",
      "principalmessage",
      "leadership_message",
      "ceo_message",
      "director_message",
      "founder_message",
      "owner_message",
      "welcome_message",
    ],
  },
  {
    group: "Conversion",
    icon: "✓",
    fallback: "Admissions / Applications",
    keys: [
      "admission",
      "admissions",
      "application",
      "enrolment",
      "enrollment",
      "registration",
    ],
  },
  {
    group: "Content",
    icon: "▦",
    fallback: "Events & Calendar",
    keys: [
      "calendar",
      "school_calendar",
      "schoolcalendar",
      "events",
      "upcoming_events",
      "event_schedule",
    ],
  },
  {
    group: "Content",
    icon: "★",
    fallback: "Awards & Recognition",
    keys: [
      "wall_of_fame",
      "walloffame",
      "fame",
      "awards",
      "achievements",
      "recognition",
      "certifications",
      "accreditations",
    ],
  },
  {
    group: "Content",
    icon: "◈",
    fallback: "Partners & Clients",
    keys: [
      "partners",
      "partner",
      "sponsors",
      "supporters",
      "clients",
      "client_logos",
      "trusted_by",
      "suppliers",
    ],
  },
  {
    group: "Media",
    icon: "▦",
    fallback: "Gallery",
    keys: [
      "gallery",
      "gallery_preview",
      "gallerypreview",
      "photos",
      "image_gallery",
      "showcase_gallery",
    ],
  },
  {
    group: "Content",
    icon: "⌘",
    fallback: "Services & Solutions",
    keys: [
      "services",
      "service_list",
      "solutions",
      "capabilities",
      "what_we_do",
      "programmes",
      "programs",
      "specialities",
    ],
  },
  {
    group: "Portfolio",
    icon: "▣",
    fallback: "Projects & Portfolio",
    keys: [
      "projects",
      "project",
      "portfolio",
      "case_studies",
      "completed_projects",
      "developments",
      "recent_work",
      "our_work",
    ],
  },
  {
    group: "Commerce",
    icon: "◇",
    fallback: "Products & Offerings",
    keys: [
      "products",
      "product_catalog",
      "catalog",
      "catalogue",
      "produce",
      "crops",
      "livestock",
      "harvest",
      "inventory",
    ],
  },
  {
    group: "Content",
    icon: "♟",
    fallback: "Team",
    keys: ["team", "our_team", "leadership", "staff", "experts", "management"],
  },
  {
    group: "Content",
    icon: "❝",
    fallback: "Testimonials",
    keys: [
      "testimonials",
      "testimonial",
      "reviews",
      "success_stories",
      "client_feedback",
    ],
  },
  {
    group: "Content",
    icon: "#",
    fallback: "Key Figures",
    keys: ["stats", "statistics", "figures", "numbers", "metrics", "impact", "highlights"],
  },
  {
    group: "Conversion",
    icon: "→",
    fallback: "Call to Action",
    keys: [
      "cta",
      "call_to_action",
      "promotion",
      "quote_request",
      "get_started",
    ],
  },
  {
    group: "Contact",
    icon: "⌂",
    fallback: "Contact & Locations",
    keys: [
      "contact",
      "contact_us",
      "contact_details",
      "location",
      "locations",
      "branches",
    ],
  },
  {
    group: "Content",
    icon: "?",
    fallback: "Frequently Asked Questions",
    keys: ["faq", "faqs", "frequently_asked_questions", "questions"],
  },
  {
    group: "Commerce",
    icon: "¤",
    fallback: "Pricing & Packages",
    keys: ["pricing", "plans", "packages", "subscriptions", "rates"],
  },
  {
    group: "Content",
    icon: "⋯",
    fallback: "Process / Timeline",
    keys: ["process", "steps", "how_it_works", "workflow", "timeline"],
  },
];

function normalizeKey(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_")
    .replace(/_+/g, "_");
}

function toTitle(value = "") {
  return String(value || "")
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getSectionType(section = {}) {
  return (
    section?.type ||
    section?.section_type ||
    section?.key ||
    section?.section_key ||
    "section"
  );
}

function getDefinition(section = {}) {
  const type = normalizeKey(getSectionType(section));

  return (
    SECTION_DEFINITIONS.find((definition) => definition.keys.includes(type)) || {
      group: "Content",
      icon: "□",
      fallback: toTitle(type) || "Website Section",
      keys: [],
    }
  );
}

function getSectionTitle(section = {}) {
  const definition = getDefinition(section);

  return (
    section?.content?.section_title ||
    section?.content?.title ||
    section?.title ||
    section?.name ||
    definition.fallback
  );
}

function getSectionSubtitle(section = {}) {
  const definition = getDefinition(section);
  const type = normalizeKey(getSectionType(section));

  const explicitText =
    section?.content?.subtitle ||
    section?.content?.description ||
    section?.description;

  if (explicitText) return explicitText;

  return `${definition.group} · ${toTitle(type) || "Section"}`;
}

function getSectionPosition(section = {}, fallback = 0) {
  const position = section?.position ?? section?.sort_order ?? section?.order;

  return Number.isFinite(Number(position)) ? Number(position) : fallback;
}

function isVisible(section = {}) {
  return section?.visible !== false && section?.is_visible !== false;
}

function buildOrderedSections(sections = []) {
  return [...sections].sort((first, second) => {
    const firstPosition = getSectionPosition(first, 0);
    const secondPosition = getSectionPosition(second, 0);

    if (firstPosition !== secondPosition) {
      return firstPosition - secondPosition;
    }

    return String(getSectionTitle(first)).localeCompare(
      String(getSectionTitle(second)),
    );
  });
}

function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

function SectionStatus({ visible }) {
  return (
    <span className={`bsp-status ${visible ? "is-on" : "is-off"}`}>
      <span aria-hidden="true" />
      {visible ? "On" : "Off"}
    </span>
  );
}

function VisibilitySwitch({ checked, disabled, label, onChange }) {
  return (
    <label
      className={`bsp-switch ${checked ? "is-on" : ""} ${
        disabled ? "is-disabled" : ""
      }`}
      aria-label={label}
      onClick={(event) => event.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span aria-hidden="true" />
    </label>
  );
}

function RowAction({
  children,
  title,
  onClick,
  disabled = false,
  danger = false,
}) {
  return (
    <button
      type="button"
      className={`bsp-row-action ${danger ? "is-danger" : ""}`}
      title={title}
      aria-label={title}
      onClick={(event) => {
        stopEvent(event);
        onClick?.();
      }}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function SectionsPanel({
  sections = EMPTY_SECTIONS,
  sectionsLoaded = true,
  selectedSectionId = null,
  currentPageData = null,
  page = currentPageData,
  onSelectSection,
  onUpdateSectionVisibility,
  onReorderSections,
  onDuplicateSection,
  onDeleteSection,
  onAddSection,
  onRefresh,
  disabled = false,
  title = "Sections",
  description = "Select a section to edit its content, media and settings.",
}) {
  const searchId = useId();
  const noticeTimerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [pendingSectionId, setPendingSectionId] = useState(null);
  const [pendingAction, setPendingAction] = useState("");
  const [notice, setNotice] = useState(null);

  const orderedSections = useMemo(
    () =>
      buildOrderedSections(
        Array.isArray(sections) ? sections.filter(Boolean) : EMPTY_SECTIONS,
      ),
    [sections],
  );

  const counts = useMemo(
    () => ({
      all: orderedSections.length,
      visible: orderedSections.filter((section) => isVisible(section)).length,
      hidden: orderedSections.filter((section) => !isVisible(section)).length,
    }),
    [orderedSections],
  );

  const filteredSections = useMemo(() => {
    const normalQuery = normalizeKey(query);

    return orderedSections.filter((section) => {
      const visible = isVisible(section);

      if (filter === "visible" && !visible) return false;
      if (filter === "hidden" && visible) return false;

      if (!normalQuery) return true;

      const definition = getDefinition(section);
      const searchableValue = normalizeKey(
        [
          getSectionTitle(section),
          getSectionSubtitle(section),
          getSectionType(section),
          definition.group,
        ].join(" "),
      );

      return searchableValue.includes(normalQuery);
    });
  }, [orderedSections, query, filter]);

  const pageTitle =
    page?.title || page?.name || page?.label || page?.slug || "Current Page";

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const showNotice = (message, type = "success") => {
    setNotice({ message, type });

    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }

    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null);
    }, 3200);
  };

  const selectSection = (section) => {
    if (disabled || !section?.id || typeof onSelectSection !== "function") {
      return;
    }

    onSelectSection(section.id);
  };

  const updateVisibility = async (section, nextVisible) => {
    if (
      disabled ||
      !section?.id ||
      typeof onUpdateSectionVisibility !== "function"
    ) {
      return;
    }

    setPendingSectionId(section.id);
    setPendingAction("visibility");
    setNotice(null);

    try {
      const updated = await onUpdateSectionVisibility(section.id, nextVisible);

      if (!updated) {
        showNotice("Visibility could not be saved.", "error");
        return;
      }

      showNotice(
        nextVisible
          ? `${getSectionTitle(section)} is now visible.`
          : `${getSectionTitle(section)} is now hidden.`,
      );
    } catch (error) {
      console.error("SectionsPanel visibility update error:", error);
      showNotice("Visibility update failed.", "error");
    } finally {
      setPendingSectionId(null);
      setPendingAction("");
    }
  };

  const moveSection = async (section, direction) => {
    if (
      disabled ||
      !section?.id ||
      typeof onReorderSections !== "function"
    ) {
      return;
    }

    const currentIndex = orderedSections.findIndex(
      (item) => item.id === section.id,
    );
    const targetIndex = currentIndex + direction;

    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= orderedSections.length
    ) {
      return;
    }

    const reordered = [...orderedSections];
    const [moving] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moving);

    setPendingSectionId(section.id);
    setPendingAction("order");

    try {
      const result = await onReorderSections(
        reordered.map((item) => item.id),
      );

      if (result === false) {
        showNotice("Section order could not be saved.", "error");
        return;
      }

      showNotice("Section order updated.");
    } catch (error) {
      console.error("SectionsPanel reorder error:", error);
      showNotice("Section order update failed.", "error");
    } finally {
      setPendingSectionId(null);
      setPendingAction("");
    }
  };

  const duplicateSection = async (section) => {
    if (
      disabled ||
      !section?.id ||
      typeof onDuplicateSection !== "function"
    ) {
      return;
    }

    setPendingSectionId(section.id);
    setPendingAction("duplicate");

    try {
      const duplicated = await onDuplicateSection(section);

      if (!duplicated) {
        showNotice("Section could not be duplicated.", "error");
        return;
      }

      showNotice("Section duplicated.");
    } catch (error) {
      console.error("SectionsPanel duplicate error:", error);
      showNotice("Section duplication failed.", "error");
    } finally {
      setPendingSectionId(null);
      setPendingAction("");
    }
  };

  const deleteSection = async (section) => {
    if (
      disabled ||
      !section?.id ||
      typeof onDeleteSection !== "function"
    ) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${getSectionTitle(section)}" from this page?`,
    );

    if (!shouldDelete) return;

    setPendingSectionId(section.id);
    setPendingAction("delete");

    try {
      const deleted = await onDeleteSection(section.id);

      if (!deleted) {
        showNotice("Section could not be deleted.", "error");
        return;
      }

      showNotice("Section deleted.");
    } catch (error) {
      console.error("SectionsPanel delete error:", error);
      showNotice("Section deletion failed.", "error");
    } finally {
      setPendingSectionId(null);
      setPendingAction("");
    }
  };

  const hasAdvancedActions =
    typeof onReorderSections === "function" ||
    typeof onDuplicateSection === "function" ||
    typeof onDeleteSection === "function";

  return (
    <section className="bsp-root" aria-label={`${title} panel`}>
      <header className="bsp-header">
        <div className="bsp-header-main">
          <span className="bsp-header-eyebrow">Current Page</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        {typeof onRefresh === "function" && (
          <button
            type="button"
            className="bsp-refresh-button"
            onClick={onRefresh}
            title="Refresh sections"
            aria-label="Refresh sections"
            disabled={disabled || pendingSectionId !== null}
          >
            ↻
          </button>
        )}
      </header>

      <div className="bsp-page-card" title={String(pageTitle)}>
        <span aria-hidden="true">▤</span>
        <div>
          <small>Editing page</small>
          <strong>{pageTitle}</strong>
        </div>
        <b>{counts.all}</b>
      </div>

      <label className="bsp-search" htmlFor={searchId}>
        <span aria-hidden="true">⌕</span>
        <input
          id={searchId}
          type="search"
          value={query}
          placeholder="Search sections..."
          onChange={(event) => setQuery(event.target.value)}
          disabled={disabled}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </label>

      <nav className="bsp-filters" aria-label="Filter sections">
        {FILTERS.map((option) => (
          <button
            type="button"
            key={option.key}
            className={filter === option.key ? "is-active" : ""}
            onClick={() => setFilter(option.key)}
            disabled={disabled}
          >
            {option.label}
            <span>{counts[option.key]}</span>
          </button>
        ))}
      </nav>

      {notice && (
        <div
          className={`bsp-notice ${notice.type === "error" ? "is-error" : ""}`}
          role="status"
        >
          {notice.message}
        </div>
      )}

      <div className="bsp-scroll">
        {!sectionsLoaded && (
          <div className="bsp-loading" aria-label="Loading sections">
            {[1, 2, 3, 4].map((item) => (
              <div className="bsp-skeleton" key={item}>
                <span />
                <div>
                  <i />
                  <i />
                </div>
              </div>
            ))}
          </div>
        )}

        {sectionsLoaded && !orderedSections.length && (
          <div className="bsp-empty">
            <span aria-hidden="true">▤</span>
            <h3>No sections on this page</h3>
            <p>
              Sections added by the selected template will appear here for
              visual editing.
            </p>

            {typeof onAddSection === "function" && (
              <button
                type="button"
                className="bsp-primary-action"
                onClick={onAddSection}
                disabled={disabled}
              >
                + Add Section
              </button>
            )}
          </div>
        )}

        {sectionsLoaded && orderedSections.length > 0 && !filteredSections.length && (
          <div className="bsp-empty is-search">
            <span aria-hidden="true">⌕</span>
            <h3>No matching sections</h3>
            <p>Try another search term or show all sections.</p>
            <button
              type="button"
              className="bsp-secondary-action"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {sectionsLoaded && filteredSections.length > 0 && (
          <div className="bsp-list" role="list" aria-label="Page sections">
            {filteredSections.map((section) => {
              const definition = getDefinition(section);
              const sectionVisible = isVisible(section);
              const selected = selectedSectionId === section.id;
              const busy = pendingSectionId === section.id;
              const orderedIndex = orderedSections.findIndex(
                (item) => item.id === section.id,
              );

              return (
                <article
                  key={section.id || `${getSectionType(section)}-${orderedIndex}`}
                  className={`bsp-row ${selected ? "is-selected" : ""} ${
                    sectionVisible ? "" : "is-hidden"
                  } ${busy ? "is-busy" : ""}`}
                  role="listitem"
                >
                  <button
                    type="button"
                    className="bsp-select-button"
                    onClick={() => selectSection(section)}
                    disabled={disabled || !section.id}
                    aria-current={selected ? "true" : undefined}
                    aria-label={`Edit ${getSectionTitle(section)}`}
                  >
                    <span className="bsp-icon" aria-hidden="true">
                      {definition.icon}
                    </span>

                    <span className="bsp-copy">
                      <strong>{getSectionTitle(section)}</strong>
                      <small>
                        {definition.group} · {toTitle(getSectionType(section))}
                      </small>
                    </span>

                    {selected && (
                      <span className="bsp-selected-label">Editing</span>
                    )}
                  </button>

                  <div className="bsp-row-footer">
                    <SectionStatus visible={sectionVisible} />

                    <VisibilitySwitch
                      checked={sectionVisible}
                      disabled={
                        disabled ||
                        busy ||
                        typeof onUpdateSectionVisibility !== "function"
                      }
                      label={`Show ${getSectionTitle(section)} on website`}
                      onChange={(checked) =>
                        updateVisibility(section, checked)
                      }
                    />

                    {hasAdvancedActions && (
                      <div className="bsp-row-actions">
                        {typeof onReorderSections === "function" && (
                          <>
                            <RowAction
                              title="Move section up"
                              disabled={busy || orderedIndex === 0}
                              onClick={() => moveSection(section, -1)}
                            >
                              ↑
                            </RowAction>
                            <RowAction
                              title="Move section down"
                              disabled={
                                busy ||
                                orderedIndex === orderedSections.length - 1
                              }
                              onClick={() => moveSection(section, 1)}
                            >
                              ↓
                            </RowAction>
                          </>
                        )}

                        {typeof onDuplicateSection === "function" && (
                          <RowAction
                            title="Duplicate section"
                            disabled={busy}
                            onClick={() => duplicateSection(section)}
                          >
                            ⧉
                          </RowAction>
                        )}

                        {typeof onDeleteSection === "function" && (
                          <RowAction
                            title="Delete section"
                            disabled={busy}
                            danger
                            onClick={() => deleteSection(section)}
                          >
                            ×
                          </RowAction>
                        )}
                      </div>
                    )}

                    {busy && (
                      <span className="bsp-working">
                        {pendingAction === "visibility" ? "Saving" : "Working"}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <footer className="bsp-footer">
        {typeof onAddSection === "function" ? (
          <button
            type="button"
            className="bsp-primary-action"
            onClick={onAddSection}
            disabled={disabled || pendingSectionId !== null}
          >
            + Add Section
          </button>
        ) : (
          <p>
            Select a section to open its enterprise editor on the right.
          </p>
        )}
      </footer>
    </section>
  );
}
