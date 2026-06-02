import { useEffect, useId, useMemo, useRef, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/builder-section-editor.css";

const SECTION_TABS = [
  { id: "content", label: "Content", icon: "▤" },
  { id: "media", label: "Media", icon: "▧" },
  { id: "settings", label: "Settings", icon: "⚙" },
  { id: "general", label: "General", icon: "◇" },
];

const LAYOUT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "cards", label: "Cards" },
  { value: "list", label: "List" },
  { value: "compact", label: "Compact" },
  { value: "feature", label: "Feature" },
];

const SPACING_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "normal", label: "Normal" },
  { value: "comfortable", label: "Comfortable" },
  { value: "spacious", label: "Spacious" },
];

const ALIGNMENT_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Centre" },
  { value: "right", label: "Right" },
];

const ANIMATION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade In" },
  { value: "rise", label: "Rise Up" },
  { value: "slide", label: "Slide In" },
  { value: "scale", label: "Scale In" },
];

const MEDIA_SOURCES = [
  {
    name: "Pexels",
    text: "Photos and videos",
    url: (query) =>
      `https://www.pexels.com/search/${encodeURIComponent(query || "website")}/`,
  },
  {
    name: "Pixabay",
    text: "Images and illustrations",
    url: (query) =>
      `https://pixabay.com/images/search/${encodeURIComponent(query || "website")}/`,
  },
  {
    name: "Unsplash",
    text: "Professional free photographs",
    url: (query) =>
      `https://unsplash.com/s/photos/${encodeURIComponent(query || "website")}`,
  },
];

const EMPTY_SECTION = Object.freeze({});
const EMPTY_PAGE = Object.freeze({});
const EMPTY_SETTINGS = Object.freeze({});

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone(value) {
  if (value === undefined || value === null) return value;

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function safeText(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function normalizeType(type = "") {
  return String(type || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function isSectionType(type, acceptedTypes = []) {
  return acceptedTypes.includes(normalizeType(type));
}

function classifySection(type = "") {
  const normalized = normalizeType(type);

  if (
    isSectionType(normalized, [
      "noticeboard",
      "notice_board",
      "notices",
      "notice",
      "bulletin",
      "announcements",
      "announcement",
      "alerts",
      "updates",
      "news_updates",
    ])
  ) {
    return "notices";
  }

  if (
    isSectionType(normalized, [
      "aboutsection",
      "about_section",
      "about",
      "vision_mission",
      "vision",
      "mission_values",
      "our_story",
      "company_profile",
      "business_profile",
      "farm_profile",
      "who_we_are",
    ])
  ) {
    return "about";
  }

  if (
    isSectionType(normalized, [
      "principalmessage",
      "principal_message",
      "principal",
      "head_message",
    ])
  ) {
    return "principal";
  }

  if (
    isSectionType(normalized, [
      "leadership_message",
      "ceo_message",
      "founder_message",
      "director_message",
      "owner_message",
      "welcome_message",
    ])
  ) {
    return "leadership";
  }

  if (
    isSectionType(normalized, [
      "admission",
      "admissions",
      "application",
      "enrolment",
      "enrollment",
    ])
  ) {
    return "admissions";
  }

  if (
    isSectionType(normalized, [
      "schoolcalendar",
      "school_calendar",
      "calendar",
      "events",
      "upcoming_events",
      "event_schedule",
    ])
  ) {
    return "calendar";
  }

  if (
    isSectionType(normalized, [
      "walloffame",
      "wall_of_fame",
      "fame",
      "awards",
      "achievements",
      "recognition",
      "certifications",
      "accreditations",
    ])
  ) {
    return "recognition";
  }

  if (
    isSectionType(normalized, [
      "sponsors",
      "partners",
      "supporters",
      "sponsor",
      "clients",
      "client_logos",
      "trusted_by",
      "suppliers",
    ])
  ) {
    return "partners";
  }

  if (
    isSectionType(normalized, [
      "gallery",
      "gallerypreview",
      "gallery_preview",
      "photos",
      "image_gallery",
      "showcase_gallery",
    ])
  ) {
    return "gallery";
  }

  if (
    isSectionType(normalized, [
      "services",
      "service_list",
      "solutions",
      "capabilities",
      "what_we_do",
      "programmes",
      "programs",
      "specialities",
    ])
  ) {
    return "services";
  }

  if (
    isSectionType(normalized, [
      "projects",
      "portfolio",
      "case_studies",
      "completed_projects",
      "developments",
      "recent_work",
      "our_work",
    ])
  ) {
    return "projects";
  }

  if (
    isSectionType(normalized, [
      "products",
      "product_catalog",
      "catalog",
      "catalogue",
      "produce",
      "crops",
      "livestock",
      "harvest",
      "inventory",
    ])
  ) {
    return "products";
  }

  if (
    isSectionType(normalized, [
      "team",
      "our_team",
      "leadership",
      "staff",
      "experts",
      "management",
    ])
  ) {
    return "team";
  }

  if (
    isSectionType(normalized, [
      "testimonials",
      "testimonial",
      "reviews",
      "success_stories",
      "client_feedback",
    ])
  ) {
    return "testimonials";
  }

  if (
    isSectionType(normalized, [
      "stats",
      "statistics",
      "figures",
      "numbers",
      "metrics",
      "impact",
      "highlights",
    ])
  ) {
    return "stats";
  }

  if (
    isSectionType(normalized, [
      "cta",
      "call_to_action",
      "banner",
      "promotion",
      "quote_request",
      "get_started",
    ])
  ) {
    return "cta";
  }

  if (
    isSectionType(normalized, [
      "contact",
      "contact_us",
      "contact_details",
      "location",
      "locations",
      "branches",
    ])
  ) {
    return "contact";
  }

  if (
    isSectionType(normalized, [
      "faq",
      "faqs",
      "frequently_asked_questions",
      "questions",
    ])
  ) {
    return "faq";
  }

  if (
    isSectionType(normalized, [
      "pricing",
      "plans",
      "packages",
      "subscriptions",
      "rates",
    ])
  ) {
    return "pricing";
  }

  if (
    isSectionType(normalized, [
      "process",
      "steps",
      "how_it_works",
      "workflow",
      "timeline",
    ])
  ) {
    return "process";
  }

  return "generic";
}

function sectionDisplayName(section = EMPTY_SECTION) {
  const type = classifySection(section?.type);
  const storedTitle =
    section?.content?.section_title ||
    section?.content?.title ||
    section?.name;

  if (storedTitle) return storedTitle;

  const labels = {
    notices: "Notices & Updates",
    about: "About Us",
    principal: "Principal's Message",
    leadership: "Leadership Message",
    admissions: "Admissions",
    calendar: "Events & Calendar",
    recognition: "Awards & Recognition",
    partners: "Partners & Clients",
    gallery: "Gallery",
    services: "Services",
    projects: "Projects & Portfolio",
    products: "Products & Offerings",
    team: "Our Team",
    testimonials: "Testimonials",
    stats: "Key Figures",
    cta: "Call to Action",
    contact: "Contact Us",
    faq: "Frequently Asked Questions",
    pricing: "Pricing & Packages",
    process: "How It Works",
    generic: "Website Section",
  };

  return labels[type] || "Website Section";
}

function createKey(prefix = "item") {
  const cryptoId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.round(Math.random() * 1000000)}`;

  return `${prefix}-${cryptoId}`;
}

function normalizeCollection(value, fallback = []) {
  return Array.isArray(value) ? clone(value) : clone(fallback);
}

function firstCollection(existing = {}, keys = [], fallback = []) {
  for (const key of keys) {
    if (Array.isArray(existing?.[key])) {
      return normalizeCollection(existing[key], fallback);
    }
  }

  return normalizeCollection(fallback, []);
}

function defaultContentFor(section = EMPTY_SECTION) {
  const existing = isObject(section?.content) ? clone(section.content) : {};
  const kind = classifySection(section?.type);
  const originalType = normalizeType(section?.type);

  if (kind === "notices") {
    return {
      section_title: existing.section_title || existing.title || "Notices & Updates",
      subtitle:
        existing.subtitle ||
        existing.description ||
        "Important announcements and upcoming highlights.",
      button_label: existing.button_label || "View All",
      button_href: existing.button_href || "/notices",
      layout: existing.layout || "cards",
      ...existing,
      items: firstCollection(existing, ["items", "notices", "announcements", "updates"]),
    };
  }

  if (kind === "about") {
    const isSchoolAbout = isSectionType(originalType, [
      "aboutsection",
      "about_section",
      "vision_mission",
      "vision",
      "mission_values",
    ]);

    return {
      section_title:
        existing.section_title ||
        (isSchoolAbout ? "About Our School" : "About Us"),
      subtitle: existing.subtitle || "",
      ...existing,
      cards: firstCollection(existing, ["cards", "values", "highlights"], [
        {
          id: createKey("card"),
          eyebrow: "VISION",
          title: "Our Vision",
          body: "",
        },
        {
          id: createKey("card"),
          eyebrow: "MISSION",
          title: "Our Mission",
          body: "",
        },
        {
          id: createKey("card"),
          eyebrow: "VALUES",
          title: "Our Values",
          body: "",
        },
      ]),
    };
  }

  if (kind === "principal") {
    return {
      section_title: existing.section_title || "Principal's Message",
      message: existing.message || existing.body || "",
      principal_name: existing.principal_name || existing.name || "",
      principal_role: existing.principal_role || existing.role || "Principal",
      image_url: existing.image_url || existing.image || "",
      image_alt: existing.image_alt || "Principal portrait",
      ...existing,
    };
  }

  if (kind === "leadership") {
    return {
      section_title: existing.section_title || "Leadership Message",
      message: existing.message || existing.body || "",
      author_name: existing.author_name || existing.name || "",
      author_role: existing.author_role || existing.role || "",
      image_url: existing.image_url || existing.image || "",
      image_alt: existing.image_alt || "Leadership portrait",
      ...existing,
    };
  }

  if (kind === "admissions") {
    return {
      section_title: existing.section_title || "Admissions",
      subtitle:
        existing.subtitle ||
        "Join a learning community that supports growth and achievement.",
      heading: existing.heading || "Start your application",
      description: existing.description || existing.body || "",
      eligibility: existing.eligibility || "",
      primary_button_label: existing.primary_button_label || "Start Application",
      primary_button_href: existing.primary_button_href || "/admissions/apply",
      secondary_button_label: existing.secondary_button_label || "Download Form",
      secondary_button_href:
        existing.secondary_button_href || "/docs/admission-form.pdf",
      hero_image: existing.hero_image || "",
      ...existing,
      stats: firstCollection(existing, ["stats", "figures"]),
    };
  }

  if (kind === "calendar") {
    return {
      section_title: existing.section_title || "Events & Calendar",
      subtitle:
        existing.subtitle ||
        "Important upcoming dates, activities and scheduled events.",
      view_all_label: existing.view_all_label || "View All Events",
      view_all_href: existing.view_all_href || "/events",
      download_label: existing.download_label || "Download PDF",
      pdf_url: existing.pdf_url || "",
      ...existing,
      items: firstCollection(existing, ["items", "events"]),
    };
  }

  if (kind === "recognition") {
    return {
      section_title: existing.section_title || "Awards & Recognition",
      subtitle:
        existing.subtitle ||
        "Celebrating outstanding performance, achievements and excellence.",
      ...existing,
      items: firstCollection(existing, [
        "items",
        "awards",
        "achievements",
        "certifications",
        "accreditations",
      ]),
    };
  }

  if (kind === "partners") {
    return {
      section_title: existing.section_title || "Partners & Clients",
      subtitle:
        existing.subtitle ||
        "Trusted organisations, clients and partners who support our work.",
      ...existing,
      items: firstCollection(existing, [
        "items",
        "sponsors",
        "partners",
        "clients",
        "suppliers",
      ]),
    };
  }

  if (kind === "gallery") {
    return {
      section_title: existing.section_title || "Gallery",
      subtitle: existing.subtitle || "",
      button_label: existing.button_label || "View Gallery",
      button_href: existing.button_href || "/gallery",
      ...existing,
      items: firstCollection(existing, ["items", "images", "photos"]),
    };
  }

  if (kind === "services") {
    return {
      section_title: existing.section_title || "Our Services",
      subtitle:
        existing.subtitle ||
        "Explore the solutions and services we provide.",
      button_label: existing.button_label || "",
      button_href: existing.button_href || "",
      ...existing,
      items: firstCollection(existing, ["items", "services", "solutions", "programmes"]),
    };
  }

  if (kind === "projects") {
    return {
      section_title: existing.section_title || "Our Projects",
      subtitle:
        existing.subtitle ||
        "Explore selected work, projects and completed developments.",
      button_label: existing.button_label || "View All Projects",
      button_href: existing.button_href || "/projects",
      ...existing,
      items: firstCollection(existing, ["items", "projects", "case_studies", "portfolio"]),
    };
  }

  if (kind === "products") {
    return {
      section_title: existing.section_title || "Products & Offerings",
      subtitle:
        existing.subtitle ||
        "Browse our products, produce and available offerings.",
      button_label: existing.button_label || "",
      button_href: existing.button_href || "",
      ...existing,
      items: firstCollection(existing, [
        "items",
        "products",
        "produce",
        "crops",
        "livestock",
        "catalog",
      ]),
    };
  }

  if (kind === "team") {
    return {
      section_title: existing.section_title || "Our Team",
      subtitle:
        existing.subtitle ||
        "Meet the people behind our organisation.",
      ...existing,
      items: firstCollection(existing, ["items", "members", "team", "staff"]),
    };
  }

  if (kind === "testimonials") {
    return {
      section_title: existing.section_title || "What People Say",
      subtitle: existing.subtitle || "",
      ...existing,
      items: firstCollection(existing, ["items", "testimonials", "reviews"]),
    };
  }

  if (kind === "stats") {
    return {
      section_title: existing.section_title || "Key Figures",
      subtitle: existing.subtitle || "",
      ...existing,
      items: firstCollection(existing, ["items", "stats", "figures", "metrics"]),
    };
  }

  if (kind === "cta") {
    return {
      section_title: existing.section_title || "Get Started",
      subtitle: existing.subtitle || "",
      heading: existing.heading || "",
      description: existing.description || existing.body || "",
      primary_button_label: existing.primary_button_label || "Contact Us",
      primary_button_href: existing.primary_button_href || "/contact",
      secondary_button_label: existing.secondary_button_label || "",
      secondary_button_href: existing.secondary_button_href || "",
      background_image: existing.background_image || "",
      ...existing,
    };
  }

  if (kind === "contact") {
    return {
      section_title: existing.section_title || "Contact Us",
      subtitle: existing.subtitle || "",
      description: existing.description || existing.body || "",
      phone: existing.phone || "",
      email: existing.email || "",
      address: existing.address || "",
      map_url: existing.map_url || "",
      button_label: existing.button_label || "Get in Touch",
      button_href: existing.button_href || "",
      ...existing,
      items: firstCollection(existing, ["items", "locations", "branches", "offices"]),
    };
  }

  if (kind === "faq") {
    return {
      section_title: existing.section_title || "Frequently Asked Questions",
      subtitle: existing.subtitle || "",
      ...existing,
      items: firstCollection(existing, ["items", "questions", "faqs"]),
    };
  }

  if (kind === "pricing") {
    return {
      section_title: existing.section_title || "Plans & Pricing",
      subtitle: existing.subtitle || "",
      ...existing,
      items: firstCollection(existing, ["items", "plans", "packages", "pricing"]),
    };
  }

  if (kind === "process") {
    return {
      section_title: existing.section_title || "How It Works",
      subtitle: existing.subtitle || "",
      ...existing,
      items: firstCollection(existing, ["items", "steps", "process", "timeline"]),
    };
  }

  return {
    section_title: existing.section_title || existing.title || section?.name || "Section",
    subtitle: existing.subtitle || existing.description || "",
    body: existing.body || "",
    image_url: existing.image_url || "",
    button_label: existing.button_label || "",
    button_href: existing.button_href || "",
    ...existing,
    items: firstCollection(existing, ["items"]),
  };
}

function defaultStyleFor(section = EMPTY_SECTION) {
  const existing = isObject(section?.style) ? clone(section.style) : {};

  return {
    layout: existing.layout || section?.content?.layout || "default",
    spacing: existing.spacing || "normal",
    alignment: existing.alignment || "left",
    columns: Number(existing.columns || 3),
    backgroundColor: existing.backgroundColor || existing.background_color || "",
    textColor: existing.textColor || existing.text_color || "",
    accentColor: existing.accentColor || existing.accent_color || "",
    borderRadius: Number(existing.borderRadius ?? existing.border_radius ?? 16),
    maxWidth: existing.maxWidth || existing.max_width || "default",
    ...existing,
  };
}

function defaultAnimationFor(section = EMPTY_SECTION) {
  const existing = isObject(section?.animation) ? clone(section.animation) : {};

  return {
    type: existing.type || "none",
    duration: Number(existing.duration ?? 400),
    delay: Number(existing.delay ?? 0),
    once: existing.once !== false,
    ...existing,
  };
}

function setAtPath(object, path, value) {
  const next = clone(object) || {};
  const keys = String(path).split(".");
  let pointer = next;

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;
    const nextKey = keys[index + 1];
    const isArrayIndex = /^\d+$/.test(nextKey || "");

    if (isLast) {
      pointer[key] = value;
      return;
    }

    if (pointer[key] === undefined || pointer[key] === null) {
      pointer[key] = isArrayIndex ? [] : {};
    }

    pointer = pointer[key];
  });

  return next;
}

function getAtPath(object, path, fallback = "") {
  const keys = String(path).split(".");
  let pointer = object;

  for (const key of keys) {
    if (pointer === undefined || pointer === null) return fallback;
    pointer = pointer[key];
  }

  return pointer ?? fallback;
}

function reorderItems(items, fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function serializeDraft({ content, visible, style, animation, locked }) {
  return JSON.stringify({
    content,
    visible,
    style,
    animation,
    locked,
  });
}

function mediaKindFromFile(file) {
  if (file?.type?.startsWith("image/")) return "image";
  if (file?.type?.startsWith("video/")) return "video";
  if (file?.type === "application/pdf") return "document";
  return "file";
}

function safeFileName(name = "asset") {
  return String(name || "asset")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function ContentField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  rows = 3,
  hint = "",
  maxLength,
}) {
  const inputId = useId();
  const fieldId = `bse-field-${safeText(label, "field")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-${inputId.replace(/:/g, "")}`;

  return (
    <label className="bse-field" htmlFor={fieldId}>
      <span className="bse-field-label">
        {label}
        {maxLength && (
          <small className="bse-character-count">
            {String(value || "").length} / {maxLength}
          </small>
        )}
      </span>

      {type === "textarea" ? (
        <textarea
          id={fieldId}
          className="bse-textarea"
          rows={rows}
          value={value || ""}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          id={fieldId}
          className="bse-input"
          type={type}
          value={value || ""}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {hint && <small className="bse-field-hint">{hint}</small>}
    </label>
  );
}

function ToggleRow({ title, text, checked, onChange, disabled = false }) {
  return (
    <label className={`bse-toggle-row ${disabled ? "is-disabled" : ""}`}>
      <span>
        <strong>{title}</strong>
        {text && <small>{text}</small>}
      </span>

      <span className={`bse-switch ${checked ? "is-on" : ""}`}>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span aria-hidden="true" />
      </span>
    </label>
  );
}

function ItemField({ definition, value, onChange }) {
  if (definition.type === "textarea") {
    return (
      <label className="bse-item-field">
        <span>{definition.label}</span>
        <textarea
          className="bse-textarea"
          rows={definition.rows || 2}
          value={value || ""}
          placeholder={definition.placeholder || ""}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  return (
    <label className="bse-item-field">
      <span>{definition.label}</span>
      <input
        className="bse-input"
        type={definition.type || "text"}
        value={value || ""}
        placeholder={definition.placeholder || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ItemCollection({
  title,
  items,
  fields,
  addLabel,
  emptyText,
  createItem,
  onChange,
}) {
  const updateItem = (index, field, value) => {
    const next = items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    );
    onChange(next);
  };

  const removeItem = (index) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <section className="bse-collection">
      <div className="bse-section-heading">
        <h3>{title}</h3>
        <span className="bse-count-pill">{items.length}</span>
      </div>

      {!items.length && <p className="bse-empty-note">{emptyText}</p>}

      <div className="bse-item-list">
        {items.map((item, index) => (
          <article className="bse-item-card" key={item.id || `${title}-${index}`}>
            <div className="bse-item-card-header">
              <span className="bse-drag-mark" aria-hidden="true">
                ⋮⋮
              </span>
              <strong>{item.title || item.name || item.label || `Item ${index + 1}`}</strong>

              <div className="bse-item-controls">
                <button
                  type="button"
                  className="bse-icon-button"
                  disabled={index === 0}
                  aria-label="Move item up"
                  onClick={() => onChange(reorderItems(items, index, index - 1))}
                >
                  ↑
                </button>

                <button
                  type="button"
                  className="bse-icon-button"
                  disabled={index === items.length - 1}
                  aria-label="Move item down"
                  onClick={() => onChange(reorderItems(items, index, index + 1))}
                >
                  ↓
                </button>

                <button
                  type="button"
                  className="bse-icon-button bse-danger"
                  aria-label="Delete item"
                  onClick={() => removeItem(index)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="bse-item-fields">
              {fields.map((field) => (
                <ItemField
                  key={field.key}
                  definition={field}
                  value={item[field.key]}
                  onChange={(value) => updateItem(index, field.key, value)}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="bse-add-item-button"
        onClick={() => onChange([...items, createItem()])}
      >
        <span aria-hidden="true">＋</span>
        {addLabel}
      </button>
    </section>
  );
}

function LayoutCards({ selected, onChange }) {
  return (
    <div className="bse-layout-options" role="radiogroup" aria-label="Layout style">
      {LAYOUT_OPTIONS.slice(0, 3).map((option) => (
        <button
          type="button"
          key={option.value}
          className={`bse-layout-card ${selected === option.value ? "is-selected" : ""}`}
          onClick={() => onChange(option.value)}
        >
          <span className={`bse-layout-preview bse-layout-${option.value}`}>
            <i />
            <i />
            <i />
          </span>
          <strong>{option.label}</strong>
        </button>
      ))}
    </div>
  );
}

function MediaLibrary({
  assets,
  loading,
  error,
  query,
  onChangeQuery,
  onRefresh,
  onSelect,
}) {
  const normalizedQuery = String(query || "").trim().toLowerCase();

  const visibleAssets = assets.filter((asset) => {
    if (!normalizedQuery) return true;

    return [asset?.name, asset?.alt, asset?.kind]
      .some((value) => String(value || "").toLowerCase().includes(normalizedQuery));
  });

  return (
    <section className="bse-library">
      <div className="bse-section-heading">
        <h3>Media Library</h3>

        <button type="button" className="bse-link-button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <input
        className="bse-input"
        value={query}
        onChange={(event) => onChangeQuery(event.target.value)}
        placeholder="Search your uploaded media"
      />

      {loading && <p className="bse-library-message">Loading media library...</p>}
      {error && <p className="bse-library-message is-error">{error}</p>}

      {!loading && !error && !visibleAssets.length && (
        <p className="bse-library-message">
          No uploaded media yet. Upload an image or paste a direct URL.
        </p>
      )}

      <div className="bse-library-grid">
        {visibleAssets.map((asset) => (
          <button
            type="button"
            className="bse-library-asset"
            key={asset.id || asset.url}
            onClick={() => onSelect(asset)}
          >
            {asset.kind === "image" || String(asset.url || "").match(/\.(png|jpe?g|webp|gif|svg)(\?|$)/i) ? (
              <img src={asset.url} alt={asset.alt || asset.name || ""} />
            ) : (
              <span className="bse-file-preview">
                {asset.kind === "video" ? "▶" : "▧"}
              </span>
            )}
            <span>{asset.name || "Media asset"}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function BuilderSectionEditor({
  enabled = false,
  section = EMPTY_SECTION,
  page = EMPTY_PAGE,
  settings = EMPTY_SETTINGS,
  onClose,
  onSave,
}) {
  const fileInputRef = useRef(null);
  const activeMediaTargetRef = useRef(null);

  const sectionKind = classifySection(section?.type);
  const sectionName = sectionDisplayName(section);

  const [activeTab, setActiveTab] = useState("content");
  const [draftContent, setDraftContent] = useState({});
  const [draftVisible, setDraftVisible] = useState(true);
  const [draftStyle, setDraftStyle] = useState({});
  const [draftAnimation, setDraftAnimation] = useState({});
  const [draftLocked, setDraftLocked] = useState(false);
  const [initialSnapshot, setInitialSnapshot] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [mediaAssets, setMediaAssets] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [mediaSearch, setMediaSearch] = useState("");
  const [activeMediaTarget, setActiveMediaTarget] = useState(null);

  const siteId = section?.site_id || settings?.site_id || "";
  const pageTitle = page?.title || "Current Page";

  const currentSnapshot = useMemo(
    () =>
      serializeDraft({
        content: draftContent,
        visible: draftVisible,
        style: draftStyle,
        animation: draftAnimation,
        locked: draftLocked,
      }),
    [draftContent, draftVisible, draftStyle, draftAnimation, draftLocked],
  );

  const isDirty = Boolean(initialSnapshot && currentSnapshot !== initialSnapshot);

  const hydrateDraft = (sourceSection = section) => {
    const content = defaultContentFor(sourceSection);
    const style = defaultStyleFor(sourceSection);
    const animation = defaultAnimationFor(sourceSection);
    const visible = sourceSection?.visible !== false;
    const locked = sourceSection?.is_locked === true;

    setDraftContent(content);
    setDraftStyle(style);
    setDraftAnimation(animation);
    setDraftVisible(visible);
    setDraftLocked(locked);
    setInitialSnapshot(
      serializeDraft({
        content,
        visible,
        style,
        animation,
        locked,
      }),
    );
  };

  useEffect(() => {
    if (!enabled || !section?.id) return undefined;

    hydrateDraft(section);
    setActiveTab("content");
    setSaving(false);
    setUploading(false);
    setNotice("");
    setError("");
    setMediaAssets([]);
    setMediaError("");
    setMediaSearch("");
    setActiveMediaTarget(null);

    const detail = {
      open: true,
      editorType: "section",
      sectionId: section.id,
      sectionType: section.type,
    };

    window.dispatchEvent(
      new CustomEvent("builder:section-editor-state", { detail }),
    );

    window.postMessage(
      {
        type: "builder:section-editor-state",
        ...detail,
      },
      "*",
    );

    return () => {
      const closedDetail = {
        open: false,
        editorType: "section",
        sectionId: section.id,
        sectionType: section.type,
      };

      window.dispatchEvent(
        new CustomEvent("builder:section-editor-state", {
          detail: closedDetail,
        }),
      );

      window.postMessage(
        {
          type: "builder:section-editor-state",
          ...closedDetail,
        },
        "*",
      );
    };
    // Reset only when opening a different selected section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, section?.id]);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !saving && !uploading) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, saving, uploading, isDirty]);

  const updateContent = (path, value) => {
    setDraftContent((previous) => setAtPath(previous, path, value));
    setNotice("");
    setError("");
  };

  const updateStyle = (key, value) => {
    setDraftStyle((previous) => ({ ...previous, [key]: value }));
    setNotice("");
    setError("");
  };

  const updateAnimation = (key, value) => {
    setDraftAnimation((previous) => ({ ...previous, [key]: value }));
    setNotice("");
    setError("");
  };

  const handleClose = () => {
    if (saving || uploading) return;

    if (isDirty) {
      const leave = window.confirm(
        "You have unsaved section changes. Close without saving?",
      );

      if (!leave) return;
    }

    onClose?.();
  };

  const saveChanges = async () => {
    if (!section?.id || typeof onSave !== "function") return;

    setSaving(true);
    setError("");
    setNotice("");

    const patch = {
      content: draftContent,
      visible: draftVisible,
      style: draftStyle,
      animation: draftAnimation,
      is_locked: draftLocked,
    };

    try {
      const updated = await onSave(section.id, patch);

      if (!updated) {
        setError("Section could not be saved. Please check access permissions and try again.");
        return;
      }

      hydrateDraft(updated);
      setNotice("All section changes saved.");
    } catch (saveError) {
      console.error("BuilderSectionEditor save error:", saveError);
      setError("Section update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const loadMediaAssets = async () => {
    if (!siteId) {
      setMediaAssets([]);
      setMediaError("A saved website is required before using the media library.");
      return;
    }

    setMediaLoading(true);
    setMediaError("");

    const { data, error: libraryError } = await supabase
      .from("site_media")
      .select("*")
      .eq("site_id", siteId)
      .order("created_at", { ascending: false })
      .limit(80);

    if (libraryError) {
      console.error("BuilderSectionEditor media library error:", libraryError);
      setMediaError("Media library could not be loaded.");
      setMediaLoading(false);
      return;
    }

    setMediaAssets(Array.isArray(data) ? data : []);
    setMediaLoading(false);
  };

  useEffect(() => {
    if (!enabled || activeTab !== "media") return undefined;

    loadMediaAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, activeTab, siteId]);

  const chooseTarget = (target) => {
    activeMediaTargetRef.current = target;
    setActiveMediaTarget(target);
  };

  const requestUpload = (target) => {
    chooseTarget(target);

    if (!fileInputRef.current) return;

    fileInputRef.current.accept =
      target.kind === "document"
        ? ".pdf,application/pdf"
        : target.kind === "video"
          ? "video/*"
          : "image/*";

    fileInputRef.current.click();
  };

  const applyAssetToTarget = (asset) => {
    const target = activeMediaTargetRef.current || activeMediaTarget;

    if (!target?.path || !asset?.url) {
      setError("Select an image field first, then choose a media asset.");
      return;
    }

    updateContent(target.path, asset.url);
    setNotice(`${asset.name || "Media asset"} selected. Save changes to publish it.`);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    const target = activeMediaTargetRef.current;

    if (!file || !target?.path || !siteId) {
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const kind = mediaKindFromFile(file);
      const extensionName = safeFileName(file.name || `asset-${Date.now()}`);
      const folder =
        target.kind === "document" ? "documents" : target.kind === "video" ? "videos" : "images";
      const storagePath = `${siteId}/sections/${normalizeType(section?.type || "section")}/${folder}/${Date.now()}-${extensionName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-media")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("site-media")
        .getPublicUrl(storagePath);

      const publicUrl = publicUrlData?.publicUrl || "";

      if (!publicUrl) {
        throw new Error("Media URL could not be generated.");
      }

      const { data: mediaRecord, error: recordError } = await supabase
        .from("site_media")
        .insert({
          site_id: siteId,
          bucket: "site-media",
          path: storagePath,
          url: publicUrl,
          name: file.name,
          alt: target.label || file.name,
          kind,
          meta: {
            section_id: section?.id || null,
            section_type: section?.type || null,
            mime_type: file.type || "",
            size_bytes: file.size || 0,
          },
        })
        .select("*")
        .single();

      if (recordError) {
        console.warn("Media uploaded but could not be indexed in site_media:", recordError);
      }

      updateContent(target.path, publicUrl);
      setMediaAssets((previous) => [
        mediaRecord || {
          id: createKey("asset"),
          site_id: siteId,
          url: publicUrl,
          name: file.name,
          kind,
        },
        ...previous,
      ]);
      setNotice("Media uploaded and selected. Save changes to publish it.");
    } catch (uploadError) {
      console.error("BuilderSectionEditor upload error:", uploadError);
      setError(uploadError?.message || "Media upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const contentHeaderFields = (
    <>
      <ContentField
        label="Section Title"
        value={draftContent.section_title || ""}
        maxLength={80}
        placeholder={sectionName}
        onChange={(value) => updateContent("section_title", value)}
      />

      {"subtitle" in draftContent && (
        <ContentField
          label="Subtitle / Description"
          type="textarea"
          rows={2}
          maxLength={240}
          value={draftContent.subtitle || ""}
          placeholder="Supporting description displayed in this section."
          onChange={(value) => updateContent("subtitle", value)}
        />
      )}
    </>
  );

  const renderContentTab = () => {
    if (sectionKind === "notices") {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="View All Label"
              value={draftContent.button_label || ""}
              onChange={(value) => updateContent("button_label", value)}
            />
            <ContentField
              label="View All Link"
              value={draftContent.button_href || ""}
              onChange={(value) => updateContent("button_href", value)}
            />
          </div>

          <ItemCollection
            title="Notice Items"
            items={draftContent.items || []}
            emptyText="No notice items yet."
            addLabel="Add Notice Item"
            createItem={() => ({
              id: createKey("notice"),
              title: "New Notice",
              publishedAt: "",
              startAt: "",
              endAt: "",
              location: "",
              category: "",
            })}
            fields={[
              { key: "title", label: "Title", placeholder: "Notice title" },
              { key: "publishedAt", label: "Published Date & Time", type: "datetime-local" },
              { key: "startAt", label: "Start Date & Time", type: "datetime-local" },
              { key: "endAt", label: "End Date & Time", type: "datetime-local" },
              { key: "location", label: "Location", placeholder: "Venue or location" },
              { key: "category", label: "Category", placeholder: "Announcement" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "about") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Information Cards"
            items={draftContent.cards || []}
            emptyText="No information cards configured."
            addLabel="Add Card"
            createItem={() => ({
              id: createKey("card"),
              eyebrow: "NEW",
              title: "New Card",
              body: "",
            })}
            fields={[
              { key: "eyebrow", label: "Small Label", placeholder: "VALUE" },
              { key: "title", label: "Title", placeholder: "Our Vision" },
              { key: "body", label: "Content", type: "textarea", rows: 4 },
            ]}
            onChange={(cards) => updateContent("cards", cards)}
          />
        </>
      );
    }

    if (sectionKind === "principal") {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Message"
            type="textarea"
            rows={7}
            value={draftContent.message || ""}
            placeholder="Write the principal's public message..."
            onChange={(value) => updateContent("message", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Principal Name"
              value={draftContent.principal_name || ""}
              placeholder="Principal's full name"
              onChange={(value) => updateContent("principal_name", value)}
            />
            <ContentField
              label="Role / Position"
              value={draftContent.principal_role || ""}
              placeholder="Principal"
              onChange={(value) => updateContent("principal_role", value)}
            />
          </div>
        </>
      );
    }

    if (sectionKind === "leadership") {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Message"
            type="textarea"
            rows={7}
            value={draftContent.message || ""}
            placeholder="Write a public leadership message..."
            onChange={(value) => updateContent("message", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Author Name"
              value={draftContent.author_name || ""}
              placeholder="Full name"
              onChange={(value) => updateContent("author_name", value)}
            />
            <ContentField
              label="Position"
              value={draftContent.author_role || ""}
              placeholder="Managing Director"
              onChange={(value) => updateContent("author_role", value)}
            />
          </div>
        </>
      );
    }

    if (sectionKind === "admissions") {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Main Heading"
            value={draftContent.heading || ""}
            onChange={(value) => updateContent("heading", value)}
          />

          <ContentField
            label="Admission Information"
            type="textarea"
            rows={5}
            value={draftContent.description || ""}
            onChange={(value) => updateContent("description", value)}
          />

          <ContentField
            label="Eligibility Note"
            type="textarea"
            rows={2}
            value={draftContent.eligibility || ""}
            onChange={(value) => updateContent("eligibility", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Primary Button"
              value={draftContent.primary_button_label || ""}
              onChange={(value) => updateContent("primary_button_label", value)}
            />
            <ContentField
              label="Primary Link"
              value={draftContent.primary_button_href || ""}
              onChange={(value) => updateContent("primary_button_href", value)}
            />
            <ContentField
              label="Secondary Button"
              value={draftContent.secondary_button_label || ""}
              onChange={(value) => updateContent("secondary_button_label", value)}
            />
            <ContentField
              label="Secondary Link"
              value={draftContent.secondary_button_href || ""}
              onChange={(value) => updateContent("secondary_button_href", value)}
            />
          </div>

          <ItemCollection
            title="Overview Statistics"
            items={draftContent.stats || []}
            emptyText="No statistics added."
            addLabel="Add Statistic"
            createItem={() => ({ id: createKey("stat"), label: "Statistic", value: "0" })}
            fields={[
              { key: "value", label: "Value", placeholder: "1990" },
              { key: "label", label: "Label", placeholder: "Established" },
            ]}
            onChange={(stats) => updateContent("stats", stats)}
          />
        </>
      );
    }

    if (sectionKind === "calendar") {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="View All Button"
              value={draftContent.view_all_label || ""}
              onChange={(value) => updateContent("view_all_label", value)}
            />
            <ContentField
              label="View All Link"
              value={draftContent.view_all_href || ""}
              onChange={(value) => updateContent("view_all_href", value)}
            />
            <ContentField
              label="PDF Button Label"
              value={draftContent.download_label || ""}
              onChange={(value) => updateContent("download_label", value)}
            />
            <ContentField
              label="PDF Link"
              value={draftContent.pdf_url || ""}
              onChange={(value) => updateContent("pdf_url", value)}
            />
          </div>

          <ItemCollection
            title="Upcoming Events"
            items={draftContent.items || []}
            emptyText="No events configured."
            addLabel="Add Event"
            createItem={() => ({
              id: createKey("event"),
              title: "New Event",
              startAt: "",
              location: "",
              category: "Event",
            })}
            fields={[
              { key: "title", label: "Event", placeholder: "New Event" },
              { key: "startAt", label: "Date & Time", type: "datetime-local" },
              { key: "location", label: "Location", placeholder: "Venue" },
              { key: "category", label: "Category", placeholder: "Event" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "recognition") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Awards, Achievements & Certifications"
            items={draftContent.items || []}
            emptyText="No recognition items added yet."
            addLabel="Add Recognition Item"
            createItem={() => ({
              id: createKey("recognition"),
              title: "New Achievement",
              description: "",
              year: String(new Date().getFullYear()),
              image_url: "",
              link: "",
            })}
            fields={[
              { key: "title", label: "Title", placeholder: "Award or certification" },
              { key: "description", label: "Description", type: "textarea", rows: 2 },
              { key: "year", label: "Year", placeholder: "2026" },
              { key: "image_url", label: "Image URL", placeholder: "https://..." },
              { key: "link", label: "Link", placeholder: "https://..." },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "partners") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Partners, Clients & Supporters"
            items={draftContent.items || []}
            emptyText="No organisations configured."
            addLabel="Add Organisation"
            createItem={() => ({
              id: createKey("partner"),
              name: "New Organisation",
              logo: "",
              link: "",
              description: "",
            })}
            fields={[
              { key: "name", label: "Name", placeholder: "Organisation name" },
              { key: "description", label: "Description", placeholder: "Optional description" },
              { key: "logo", label: "Logo URL", placeholder: "https://..." },
              { key: "link", label: "Website Link", placeholder: "https://..." },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "gallery") {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="Button Label"
              value={draftContent.button_label || ""}
              onChange={(value) => updateContent("button_label", value)}
            />
            <ContentField
              label="Button Link"
              value={draftContent.button_href || ""}
              onChange={(value) => updateContent("button_href", value)}
            />
          </div>

          <ItemCollection
            title="Gallery Images"
            items={draftContent.items || []}
            emptyText="No images selected."
            addLabel="Add Image"
            createItem={() => ({
              id: createKey("image"),
              image_url: "",
              alt: "",
              caption: "",
            })}
            fields={[
              { key: "image_url", label: "Image URL", placeholder: "https://..." },
              { key: "alt", label: "Alternative Text", placeholder: "Describe the image" },
              { key: "caption", label: "Caption", placeholder: "Optional caption" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "services") {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="Button Label"
              value={draftContent.button_label || ""}
              onChange={(value) => updateContent("button_label", value)}
            />
            <ContentField
              label="Button Link"
              value={draftContent.button_href || ""}
              onChange={(value) => updateContent("button_href", value)}
            />
          </div>

          <ItemCollection
            title="Services & Solutions"
            items={draftContent.items || []}
            emptyText="No services configured."
            addLabel="Add Service"
            createItem={() => ({
              id: createKey("service"),
              title: "New Service",
              description: "",
              icon: "",
              image_url: "",
              link: "",
            })}
            fields={[
              { key: "title", label: "Title", placeholder: "Service name" },
              { key: "description", label: "Description", type: "textarea", rows: 3 },
              { key: "icon", label: "Icon / Label", placeholder: "Optional icon name" },
              { key: "image_url", label: "Image URL", placeholder: "https://..." },
              { key: "link", label: "Link", placeholder: "/services/example" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "projects") {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="Button Label"
              value={draftContent.button_label || ""}
              onChange={(value) => updateContent("button_label", value)}
            />
            <ContentField
              label="Button Link"
              value={draftContent.button_href || ""}
              onChange={(value) => updateContent("button_href", value)}
            />
          </div>

          <ItemCollection
            title="Projects & Case Studies"
            items={draftContent.items || []}
            emptyText="No projects configured."
            addLabel="Add Project"
            createItem={() => ({
              id: createKey("project"),
              title: "New Project",
              category: "",
              description: "",
              image_url: "",
              link: "",
            })}
            fields={[
              { key: "title", label: "Project Title", placeholder: "Project name" },
              { key: "category", label: "Category", placeholder: "Commercial / Residential / Web Design" },
              { key: "description", label: "Description", type: "textarea", rows: 3 },
              { key: "image_url", label: "Image URL", placeholder: "https://..." },
              { key: "link", label: "Project Link", placeholder: "/projects/example" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "products") {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="Button Label"
              value={draftContent.button_label || ""}
              onChange={(value) => updateContent("button_label", value)}
            />
            <ContentField
              label="Button Link"
              value={draftContent.button_href || ""}
              onChange={(value) => updateContent("button_href", value)}
            />
          </div>

          <ItemCollection
            title="Products, Produce & Offerings"
            items={draftContent.items || []}
            emptyText="No items configured."
            addLabel="Add Offering"
            createItem={() => ({
              id: createKey("product"),
              name: "New Offering",
              category: "",
              description: "",
              price: "",
              availability: "",
              image_url: "",
              link: "",
            })}
            fields={[
              { key: "name", label: "Name", placeholder: "Product or crop name" },
              { key: "category", label: "Category", placeholder: "Produce / Service / Equipment" },
              { key: "description", label: "Description", type: "textarea", rows: 3 },
              { key: "price", label: "Price / Rate", placeholder: "Optional" },
              { key: "availability", label: "Availability", placeholder: "In season / Available" },
              { key: "image_url", label: "Image URL", placeholder: "https://..." },
              { key: "link", label: "Link", placeholder: "/products/example" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "team") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Team Members"
            items={draftContent.items || []}
            emptyText="No team members configured."
            addLabel="Add Team Member"
            createItem={() => ({
              id: createKey("team"),
              name: "New Member",
              role: "",
              bio: "",
              image_url: "",
              link: "",
            })}
            fields={[
              { key: "name", label: "Name", placeholder: "Full name" },
              { key: "role", label: "Role", placeholder: "Position or speciality" },
              { key: "bio", label: "Biography", type: "textarea", rows: 3 },
              { key: "image_url", label: "Photo URL", placeholder: "https://..." },
              { key: "link", label: "Profile Link", placeholder: "https://..." },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "testimonials") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Testimonials & Reviews"
            items={draftContent.items || []}
            emptyText="No testimonials configured."
            addLabel="Add Testimonial"
            createItem={() => ({
              id: createKey("testimonial"),
              quote: "",
              name: "Client Name",
              role: "",
              organisation: "",
              image_url: "",
            })}
            fields={[
              { key: "quote", label: "Quote", type: "textarea", rows: 4 },
              { key: "name", label: "Name", placeholder: "Client or customer name" },
              { key: "role", label: "Role", placeholder: "Optional role" },
              { key: "organisation", label: "Organisation", placeholder: "Optional organisation" },
              { key: "image_url", label: "Photo URL", placeholder: "https://..." },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "stats") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Figures & Metrics"
            items={draftContent.items || []}
            emptyText="No figures configured."
            addLabel="Add Figure"
            createItem={() => ({
              id: createKey("stat"),
              value: "0",
              label: "New Metric",
              description: "",
            })}
            fields={[
              { key: "value", label: "Value", placeholder: "250+" },
              { key: "label", label: "Label", placeholder: "Projects Completed" },
              { key: "description", label: "Description", placeholder: "Optional supporting detail" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "cta") {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Main Heading"
            value={draftContent.heading || ""}
            placeholder="Ready to get started?"
            onChange={(value) => updateContent("heading", value)}
          />

          <ContentField
            label="Description"
            type="textarea"
            rows={4}
            value={draftContent.description || ""}
            onChange={(value) => updateContent("description", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Primary Button"
              value={draftContent.primary_button_label || ""}
              onChange={(value) => updateContent("primary_button_label", value)}
            />
            <ContentField
              label="Primary Link"
              value={draftContent.primary_button_href || ""}
              onChange={(value) => updateContent("primary_button_href", value)}
            />
            <ContentField
              label="Secondary Button"
              value={draftContent.secondary_button_label || ""}
              onChange={(value) => updateContent("secondary_button_label", value)}
            />
            <ContentField
              label="Secondary Link"
              value={draftContent.secondary_button_href || ""}
              onChange={(value) => updateContent("secondary_button_href", value)}
            />
          </div>
        </>
      );
    }

    if (sectionKind === "contact") {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Description"
            type="textarea"
            rows={3}
            value={draftContent.description || ""}
            onChange={(value) => updateContent("description", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Email"
              type="email"
              value={draftContent.email || ""}
              onChange={(value) => updateContent("email", value)}
            />
            <ContentField
              label="Phone"
              value={draftContent.phone || ""}
              onChange={(value) => updateContent("phone", value)}
            />
          </div>

          <ContentField
            label="Address"
            type="textarea"
            rows={2}
            value={draftContent.address || ""}
            onChange={(value) => updateContent("address", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Button Label"
              value={draftContent.button_label || ""}
              onChange={(value) => updateContent("button_label", value)}
            />
            <ContentField
              label="Button Link"
              value={draftContent.button_href || ""}
              onChange={(value) => updateContent("button_href", value)}
            />
          </div>

          <ItemCollection
            title="Locations / Branches"
            items={draftContent.items || []}
            emptyText="No additional locations configured."
            addLabel="Add Location"
            createItem={() => ({
              id: createKey("location"),
              name: "New Location",
              address: "",
              phone: "",
              email: "",
            })}
            fields={[
              { key: "name", label: "Location Name", placeholder: "Head Office" },
              { key: "address", label: "Address", type: "textarea", rows: 2 },
              { key: "phone", label: "Phone", placeholder: "" },
              { key: "email", label: "Email", placeholder: "" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "faq") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Questions & Answers"
            items={draftContent.items || []}
            emptyText="No questions configured."
            addLabel="Add Question"
            createItem={() => ({
              id: createKey("faq"),
              question: "New Question",
              answer: "",
            })}
            fields={[
              { key: "question", label: "Question", placeholder: "Question" },
              { key: "answer", label: "Answer", type: "textarea", rows: 4 },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "pricing") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Plans & Packages"
            items={draftContent.items || []}
            emptyText="No plans configured."
            addLabel="Add Plan"
            createItem={() => ({
              id: createKey("plan"),
              name: "New Plan",
              price: "",
              period: "",
              description: "",
              button_label: "Get Started",
              button_href: "",
            })}
            fields={[
              { key: "name", label: "Plan Name", placeholder: "Standard" },
              { key: "price", label: "Price", placeholder: "R0" },
              { key: "period", label: "Period", placeholder: "per month" },
              { key: "description", label: "Description", type: "textarea", rows: 3 },
              { key: "button_label", label: "Button Label", placeholder: "Get Started" },
              { key: "button_href", label: "Button Link", placeholder: "/contact" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "process") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Steps / Timeline"
            items={draftContent.items || []}
            emptyText="No steps configured."
            addLabel="Add Step"
            createItem={() => ({
              id: createKey("step"),
              step: String((draftContent.items || []).length + 1),
              title: "New Step",
              description: "",
            })}
            fields={[
              { key: "step", label: "Step Number / Year", placeholder: "1" },
              { key: "title", label: "Title", placeholder: "Consultation" },
              { key: "description", label: "Description", type: "textarea", rows: 3 },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    return (
      <>
        {contentHeaderFields}

        <ContentField
          label="Content"
          type="textarea"
          rows={7}
          value={draftContent.body || ""}
          onChange={(value) => updateContent("body", value)}
        />

        <div className="bse-two-column">
          <ContentField
            label="Button Label"
            value={draftContent.button_label || ""}
            onChange={(value) => updateContent("button_label", value)}
          />
          <ContentField
            label="Button Link"
            value={draftContent.button_href || ""}
            onChange={(value) => updateContent("button_href", value)}
          />
        </div>
      </>
    );
  };

  const mediaTargets = useMemo(() => {
    if (sectionKind === "principal") {
      return [{ path: "image_url", label: "Principal Photo", kind: "image" }];
    }

    if (sectionKind === "leadership") {
      return [{ path: "image_url", label: "Leadership Photo", kind: "image" }];
    }

    if (sectionKind === "admissions") {
      return [{ path: "hero_image", label: "Admissions Image", kind: "image" }];
    }

    if (sectionKind === "calendar") {
      return [{ path: "pdf_url", label: "Calendar PDF Document", kind: "document" }];
    }

    if (sectionKind === "cta") {
      return [{ path: "background_image", label: "Call-to-Action Background", kind: "image" }];
    }

    if (sectionKind === "gallery") {
      return (draftContent.items || []).map((item, index) => ({
        path: `items.${index}.image_url`,
        label: item.caption || `Gallery Image ${index + 1}`,
        kind: "image",
      }));
    }

    if (["recognition", "projects", "products", "services", "team", "testimonials"].includes(sectionKind)) {
      return (draftContent.items || []).map((item, index) => ({
        path: `items.${index}.image_url`,
        label: item.title || item.name || `Item Image ${index + 1}`,
        kind: "image",
      }));
    }

    if (sectionKind === "partners") {
      return (draftContent.items || []).map((item, index) => ({
        path: `items.${index}.logo`,
        label: item.name || `Organisation Logo ${index + 1}`,
        kind: "image",
      }));
    }

    return [{ path: "image_url", label: "Section Image", kind: "image" }];
  }, [sectionKind, draftContent.items]);

  const renderMediaTab = () => (
    <>
      <div className="bse-panel-intro">
        <h3>Section Media</h3>
        <p>
          Upload or select reusable assets for this section. Uploaded media is
          stored in the website media library.
        </p>
      </div>

      <div className="bse-media-target-list">
        {mediaTargets.map((target) => {
          const currentValue = getAtPath(draftContent, target.path, "");
          const selected = activeMediaTarget?.path === target.path;

          return (
            <article
              key={target.path}
              className={`bse-media-target ${selected ? "is-selected" : ""}`}
            >
              <header>
                <strong>{target.label}</strong>
                <button
                  type="button"
                  className="bse-link-button"
                  onClick={() => chooseTarget(target)}
                >
                  {selected ? "Selected" : "Select"}
                </button>
              </header>

              {currentValue && target.kind === "image" && (
                <img
                  className="bse-media-preview"
                  src={currentValue}
                  alt={target.label}
                />
              )}

              <input
                className="bse-input"
                value={currentValue || ""}
                placeholder={
                  target.kind === "document"
                    ? "Paste PDF URL"
                    : "Paste image URL"
                }
                onFocus={() => chooseTarget(target)}
                onChange={(event) => {
                  chooseTarget(target);
                  updateContent(target.path, event.target.value);
                }}
              />

              <button
                type="button"
                className="bse-upload-button"
                disabled={uploading}
                onClick={() => requestUpload(target)}
              >
                {uploading && selected ? "Uploading..." : `Upload ${target.kind === "document" ? "Document" : "Image"}`}
              </button>
            </article>
          );
        })}
      </div>

      <MediaLibrary
        assets={mediaAssets}
        loading={mediaLoading}
        error={mediaError}
        query={mediaSearch}
        onChangeQuery={setMediaSearch}
        onRefresh={loadMediaAssets}
        onSelect={applyAssetToTarget}
      />

      <section className="bse-free-media">
        <h3>Find Free Media</h3>
        <p>Find an asset online, then upload it or paste its direct URL above.</p>

        <div className="bse-free-media-grid">
          {MEDIA_SOURCES.map((source) => (
            <a
              key={source.name}
              href={source.url(`${settings?.site_name || settings?.organization_name || "website"} ${sectionName}`)}
              target="_blank"
              rel="noreferrer"
            >
              <strong>{source.name}</strong>
              <span>{source.text}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );

  const renderSettingsTab = () => (
    <>
      <div className="bse-panel-intro">
        <h3>Section Settings</h3>
        <p>Control visibility and the presentation of this section.</p>
      </div>

      <ToggleRow
        title="Show Section"
        text="Display this section on the published website."
        checked={draftVisible}
        onChange={(value) => {
          setDraftVisible(value);
          setNotice("");
        }}
      />

      <p className="bse-setting-note">
        Visibility is saved together with your section changes when you select
        Save Changes.
      </p>

      <div className="bse-divider" />

      <label className="bse-field">
        <span className="bse-field-label">Layout Style</span>
        <LayoutCards
          selected={draftStyle.layout}
          onChange={(value) => updateStyle("layout", value)}
        />
      </label>

      <div className="bse-two-column">
        <label className="bse-field">
          <span className="bse-field-label">Spacing</span>
          <select
            className="bse-select"
            value={draftStyle.spacing}
            onChange={(event) => updateStyle("spacing", event.target.value)}
          >
            {SPACING_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="bse-field">
          <span className="bse-field-label">Text Alignment</span>
          <select
            className="bse-select"
            value={draftStyle.alignment}
            onChange={(event) => updateStyle("alignment", event.target.value)}
          >
            {ALIGNMENT_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="bse-two-column">
        <ContentField
          label="Background Colour"
          type="color"
          value={draftStyle.backgroundColor || "#ffffff"}
          onChange={(value) => updateStyle("backgroundColor", value)}
        />
        <ContentField
          label="Accent Colour"
          type="color"
          value={draftStyle.accentColor || "#2563eb"}
          onChange={(value) => updateStyle("accentColor", value)}
        />
      </div>

      <label className="bse-field">
        <span className="bse-field-label">
          Corner Radius
          <small className="bse-character-count">{draftStyle.borderRadius}px</small>
        </span>

        <input
          className="bse-range"
          type="range"
          min="0"
          max="40"
          value={draftStyle.borderRadius}
          onChange={(event) => updateStyle("borderRadius", Number(event.target.value))}
        />
      </label>
    </>
  );

  const renderGeneralTab = () => (
    <>
      <div className="bse-panel-intro">
        <h3>General</h3>
        <p>Accessibility, advanced identity and subtle motion settings.</p>
      </div>

      <div className="bse-readonly-card">
        <span>Section Type</span>
        <strong>{section?.type || "section"}</strong>
        <span>Page</span>
        <strong>{pageTitle}</strong>
      </div>

      <ContentField
        label="Anchor ID"
        value={draftContent.anchor_id || ""}
        placeholder="notice-board"
        hint="Optional link target for buttons and navigation."
        onChange={(value) => updateContent("anchor_id", value)}
      />

      <ContentField
        label="Accessibility Label"
        value={draftContent.aria_label || ""}
        placeholder={sectionName}
        hint="Helps visitors using screen readers."
        onChange={(value) => updateContent("aria_label", value)}
      />

      <div className="bse-divider" />

      <label className="bse-field">
        <span className="bse-field-label">Entrance Animation</span>
        <select
          className="bse-select"
          value={draftAnimation.type}
          onChange={(event) => updateAnimation("type", event.target.value)}
        >
          {ANIMATION_OPTIONS.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {draftAnimation.type !== "none" && (
        <div className="bse-two-column">
          <ContentField
            label="Duration (ms)"
            type="number"
            value={draftAnimation.duration}
            onChange={(value) => updateAnimation("duration", Number(value || 0))}
          />
          <ContentField
            label="Delay (ms)"
            type="number"
            value={draftAnimation.delay}
            onChange={(value) => updateAnimation("delay", Number(value || 0))}
          />
        </div>
      )}

      <ToggleRow
        title="Animate Once"
        text="Avoid repeating animation whenever the section re-enters the screen."
        checked={draftAnimation.once !== false}
        onChange={(value) => updateAnimation("once", value)}
        disabled={draftAnimation.type === "none"}
      />

      <ToggleRow
        title="Lock Section"
        text="Prevent accidental rearranging while editing the page."
        checked={draftLocked}
        onChange={setDraftLocked}
      />
    </>
  );

  if (!enabled || !section?.id) return null;

  return (
    <aside className="bse-root" aria-label={`Edit ${sectionName}`}>
      <header className="bse-header">
        <div className="bse-header-copy">
          <span>Edit Section</span>
          <h2>{sectionName}</h2>
          <small>{pageTitle}</small>
        </div>

        <button
          type="button"
          className="bse-close-button"
          onClick={handleClose}
          aria-label="Close section editor"
        >
          ×
        </button>
      </header>

      <nav className="bse-tabs" aria-label="Section editor tabs">
        {SECTION_TABS.map((tab) => (
          <button
            type="button"
            className={activeTab === tab.id ? "is-active" : ""}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="bse-scroll">
        {notice && <div className="bse-alert is-success">{notice}</div>}
        {error && <div className="bse-alert is-error">{error}</div>}

        {activeTab === "content" && renderContentTab()}
        {activeTab === "media" && renderMediaTab()}
        {activeTab === "settings" && renderSettingsTab()}
        {activeTab === "general" && renderGeneralTab()}
      </div>

      <footer className="bse-footer">
        <div className={`bse-save-status ${isDirty ? "has-changes" : ""}`}>
          {isDirty ? "Unsaved changes" : "Up to date"}
        </div>

        <div className="bse-footer-actions">
          <button
            type="button"
            className="bse-cancel-button"
            onClick={handleClose}
            disabled={saving || uploading}
          >
            Cancel
          </button>

          <button
            type="button"
            className="bse-save-button"
            onClick={saveChanges}
            disabled={saving || uploading || !isDirty}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </footer>

      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileUpload}
      />
    </aside>
  );
}
