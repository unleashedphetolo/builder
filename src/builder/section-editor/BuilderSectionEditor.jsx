import { useEffect, useId, useMemo, useRef, useState } from "react";
import { supabase } from "../../supabase/client";
import "../../styles/builder-section-editor.css";
import { getEditorComponent, resolveRegistrySectionType } from "./editorRegistry";

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

const TYPOGRAPHY_OPTIONS = [
  { value: "inherit", label: "Use Template Default" },
  { value: "system", label: "Clean System Sans" },
  { value: "serif", label: "Formal Serif" },
  { value: "rounded", label: "Friendly Rounded" },
  { value: "display", label: "Modern Display" },
];

const TYPE_SCALE_OPTIONS = [
  { value: "default", label: "Template Default" },
  { value: "compact", label: "Compact" },
  { value: "comfortable", label: "Comfortable" },
  { value: "feature", label: "Feature" },
];

const SECTION_FONT_SIZE_OPTIONS = [
  { value: "", label: "Template Default" },
  { value: "14", label: "Compact / 14px" },
  { value: "16", label: "Standard / 16px" },
  { value: "18", label: "Comfortable / 18px" },
  { value: "20", label: "Large / 20px" },
];

const SECTION_HEADING_SIZE_OPTIONS = [
  { value: "", label: "Template Default" },
  { value: "28", label: "Balanced / 28px" },
  { value: "32", label: "Professional / 32px" },
  { value: "40", label: "Feature / 40px" },
  { value: "48", label: "Hero / 48px" },
];

const SECTION_FONT_WEIGHT_OPTIONS = [
  { value: "", label: "Template Default" },
  { value: "400", label: "Regular" },
  { value: "450", label: "Comfortable" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
];

const LINK_STYLE_OPTIONS = [
  { value: "template", label: "Template Default" },
  { value: "button", label: "Button" },
  { value: "outline", label: "Outline Button" },
  { value: "text", label: "Text Link" },
  { value: "card", label: "Card Link" },
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
      "school_apply_online",
      "school_admissions_apply",
      "school_apply",
      "apply_online",
      "admissions_apply",
    ])
  ) {
    return "admissions";
  }

  if (
    isSectionType(normalized, [
      "school_how_to_apply",
      "how_to_apply",
      "howtoapply",
      "admissions_how_to_apply",
    ])
  ) {
    return "admissions";
  }

  if (
    isSectionType(normalized, [
      "school_entry_requirements",
      "entry_requirements",
      "admission_requirements",
      "admissions_requirements",
      "requirements",
    ])
  ) {
    return "admissions";
  }

  if (
    isSectionType(normalized, [
      "school_admissions_landing",
      "admissions_landing",
      "school_admissions",
    ])
  ) {
    return "admissions";
  }

  if (isSectionType(normalized, ["school_who_we_are", "school_about_who_we_are"])) {
    return "who_we_are";
  }

  if (
    isSectionType(normalized, [
      "school_vision_mission",
      "vision_mission_values",
      "school_vision",
      "school_mission",
    ])
  ) {
    return "about";
  }

  if (isSectionType(normalized, ["school_staff", "school_team"])) {
    return "team";
  }

  if (isSectionType(normalized, ["school_sgb", "school_governing_body", "governance_sgb"])) {
    return "team";
  }

  if (
    isSectionType(normalized, [
      "school_calendar",
      "school_events",
      "school_all_events",
      "school_term_plan",
      "school_exam_schedule",
    ])
  ) {
    return "calendar";
  }

  if (isSectionType(normalized, ["school_digital_library", "digital_library", "library_resources"])) {
    return "services";
  }

  if (
    isSectionType(normalized, [
      "school_notices",
      "school_daily_bulletin",
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
      "school_news",
      "school_events",
      "latest_news",
      "news",
      "news_listing",
      "school_news",
      "school_all_events",
      "articles",
    ])
  ) {
    return "news";
  }

  if (
    isSectionType(normalized, [
      "policy",
      "policies",
      "code_of_conduct",
      "school_code_of_conduct",
      "attendance_policy",
      "school_attendance_policy",
      "school_policy",
    ])
  ) {
    return "policy";
  }

  if (
    isSectionType(normalized, [
      "quick_links",
      "links",
      "resource_links",
      "useful_links",
    ])
  ) {
    return "links";
  }

  if (
    isSectionType(normalized, [
      "who_we_are",
      "who_we_are_page",
      "school_profile",
      "institution_profile",
    ])
  ) {
    return "who_we_are";
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
      "school_wall_of_fame",
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
      "school_sponsors",
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
      "school_gallery",
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
      "school_academics",
      "school_sports",
      "school_culture",
      "school_activities",
      "school_resources",
      "school_subject_choices",
      "school_stationary_list",
      "school_robotics",
      "school_facilities",
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
      "school_contact",
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

function resolveEditorSectionKind(section = EMPTY_SECTION, page = EMPTY_PAGE) {
  const classified = classifySection(section?.type);
  const content = isObject(section?.content) ? section.content : {};
  const pageSlug = normalizeType(page?.slug || "");

  const isWhoWeArePage =
    pageSlug === "_about_who_we_are" ||
    pageSlug === "about_who_we_are" ||
    String(page?.slug || "").toLowerCase() === "/about/who-we-are";

  const hasWhoWeAreContent =
    "commitment_title" in content ||
    "commitment_body" in content ||
    "badge_label" in content ||
    "pills" in content ||
    "left_image_url" in content ||
    "right_image_url" in content;

  if ((classified === "about" || classified === "generic") && (isWhoWeArePage || hasWhoWeAreContent)) {
    return "who_we_are";
  }

  return classified;
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
    news: "Latest News",
    policy: "Policy Document",
    links: "Quick Links",
    about: "About Us",
    who_we_are: "Who We Are",
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

function firstNonEmptyCollection(existing = {}, keys = [], fallback = []) {
  for (const key of keys) {
    if (Array.isArray(existing?.[key]) && existing[key].length > 0) {
      return normalizeCollection(existing[key], fallback);
    }
  }

  return normalizeCollection(fallback, []);
}

function defaultContentFor(
  section = EMPTY_SECTION,
  settings = EMPTY_SETTINGS,
  page = EMPTY_PAGE,
) {
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

  if (kind === "who_we_are") {
    const schoolName =
      existing.school_name || settings?.school_name || "Institutional School";

    const schoolImage =
      existing.image_url || "/images/school/school.jpg";

    const introduction =
      existing.body ||
      existing.subtitle ||
      `${schoolName} is a learner-centred institution committed to academic excellence, discipline, and holistic development—supported by educators, parents, and community partners.`;

    return {
      ...existing,
      section_title: existing.section_title || "Who We Are",
      subtitle: existing.subtitle || introduction,
      body: introduction,
      school_name: existing.school_name || "",
      image_url: schoolImage,
      left_image_url: existing.left_image_url || schoolImage,
      right_image_url: existing.right_image_url || schoolImage,
      image_alt: existing.image_alt || schoolName,
      badge_label: existing.badge_label || "Official School Profile",
      commitment_title: existing.commitment_title || "Our Commitment",
      commitment_body:
        existing.commitment_body ||
        "We are committed to developing responsible, confident learners who are prepared for further education, training, and active citizenship.",
      pills: firstNonEmptyCollection(existing, ["pills", "tags", "highlights"], [
        "Learner Support",
        "Academic Excellence",
        "Discipline & Values",
      ]),
      stats: firstNonEmptyCollection(existing, ["stats", "figures"], [
        {
          id: "grades",
          value: "8–12",
          label: "Grades Offered",
        },
        {
          id: "community",
          value: "Community",
          label: "Partnership & Involvement",
        },
      ]),
      cards: firstNonEmptyCollection(existing, ["cards"], [
        {
          id: "community",
          title: "Our Community",
          body:
            "We are a learner-centred secondary school committed to discipline, respect, and academic achievement—supported by teachers, parents, and community partners.",
          items: [
            "Safe, supportive learning environment",
            "Strong parent and community participation",
            "Respect, accountability, and growth",
          ],
        },
        {
          id: "leadership",
          title: "Our Leadership",
          body:
            "Our leadership promotes quality teaching, structured learner support, and transparent collaboration with parents and stakeholders.",
          items: [
            "Academic planning and performance monitoring",
            "Clear communication and accountability",
            "Support for educators and learners",
          ],
        },
        {
          id: "belief",
          title: "What We Believe",
          body:
            "Every learner can succeed with the right guidance, consistent effort, and a safe environment that builds confidence and character.",
          items: [
            "High expectations with learner support",
            "Values-driven behaviour and discipline",
            "Opportunities in academics, sport, and culture",
          ],
        },
      ]),
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
    const pageSlug = String(page?.slug || "").trim().toLowerCase();
    const organization = settings?.organization || {};
    const schoolName =
      safeText(settings?.site_name) ||
      safeText(settings?.organization_name) ||
      safeText(organization?.name) ||
      safeText(settings?.name) ||
      "the school";

    const isHowToApplyPage =
      pageSlug === "/admissions/howtoapply" ||
      pageSlug === "/admissions/how-to-apply" ||
      "online_steps" in existing ||
      "manual_steps" in existing;

    const isRequirementsPage =
      pageSlug === "/admissions/requirements" ||
      ("required_documents" in existing &&
        !("online_steps" in existing) &&
        !("manual_steps" in existing));

    const isApplyPage =
      pageSlug === "/admissions/apply" ||
      "form_title" in existing ||
      "manual_form_label" in existing;

    if (isHowToApplyPage) {
      return {
        ...existing,
        section_title: existing.section_title || "How to Apply",
        subtitle:
          existing.subtitle ||
          `Apply to ${schoolName} using the online application or submit a manual form at the school. Please ensure all supporting documents are certified where required.`,
        primary_badge: existing.primary_badge || "Admissions",
        secondary_badge: existing.secondary_badge || "Grade 8–12",
        apply_button_label: existing.apply_button_label || "Apply Online",
        hero_download_label:
          existing.hero_download_label || "Download Manual Form (PDF)",
        help_button_label: existing.help_button_label || "Need Help?",
        form_url: existing.form_url || existing.pdf_url || "",
        online_title: existing.online_title || "Option A: Apply Online",
        online_description:
          existing.online_description ||
          "Complete the online form and upload the required documents. You will receive an application reference number.",
        online_start_label:
          existing.online_start_label || "Start Online Application",
        requirements_button_label:
          existing.requirements_button_label || "View Requirements",
        manual_title: existing.manual_title || "Option B: Manual Application",
        manual_description:
          existing.manual_description ||
          "Download the manual application form, complete it and submit it at the school office with certified copies.",
        manual_download_label:
          existing.manual_download_label || "Download Manual Form",
        contact_button_label:
          existing.contact_button_label || "Contact the School",
        documents_title:
          existing.documents_title || "Required Documents Summary",
        documents_description:
          existing.documents_description ||
          "The documents below are typically required. Please confirm on the Entry Requirements page for the latest list.",
        footer_note:
          existing.footer_note ||
          "For official confirmation of placement and deadlines, please contact the Administration Office.",
        online_steps: firstNonEmptyCollection(existing, ["online_steps"], [
          "Fill in learner details and parent/guardian details.",
          "Provide previous school information if applicable.",
          "Upload required documents in PDF, JPG, or PNG format.",
          "Review and submit your application.",
        ]),
        manual_steps: firstNonEmptyCollection(existing, ["manual_steps"], [
          "Download and print the form.",
          "Complete clearly in block letters.",
          "Attach certified supporting documents.",
          "Submit to the Administration Office during school hours.",
        ]),
        required_documents: firstNonEmptyCollection(
          existing,
          ["required_documents"],
          [
            "Certified copy of learner Birth Certificate / ID",
            "Certified copy of parent/guardian ID",
            "Latest school report",
            "Proof of address",
            "Transfer letter if applicable",
            "Immunisation card / clinic card if applicable",
          ],
        ),
      };
    }

    if (isRequirementsPage) {
      return {
        ...existing,
        section_title: existing.section_title || "Entry Requirements",
        introduction:
          existing.introduction ||
          `${schoolName} welcomes applications from learners who are committed to academic excellence, discipline, and positive participation in school life. Admission is subject to available space and compliance with the school's admission policy.`,
        documents_title: existing.documents_title || "Required Documents",
        documents_description:
          existing.documents_description ||
          "All applications must include the following certified documents:",
        grades_title: existing.grades_title || "Grade Admissions",
        grades_description:
          existing.grades_description ||
          "Applications are primarily accepted for Grade 8, which is the entry level for the school. Applications for higher grades, Grades 9–12, may be considered depending on space availability.",
        process_title: existing.process_title || "Application Process",
        notes_title: existing.notes_title || "Important Notes",
        apply_button_label: existing.apply_button_label || "Apply Online",
        download_button_label:
          existing.download_button_label || "Manual Application PDF",
        view_button_label: existing.view_button_label || "View Form",
        form_url: existing.form_url || existing.pdf_url || "",
        footer_note:
          existing.footer_note ||
          "You can apply online, or download the manual form, complete it, and submit it to the school office with the required certified documents.",
        required_documents: firstNonEmptyCollection(
          existing,
          ["required_documents"],
          [
            "Certified copy of learner's birth certificate or ID",
            "Certified copy of parent/guardian ID",
            "Latest school report",
            "Proof of residential address",
            "Transfer letter from previous school if applicable",
            "Immunisation card if available",
          ],
        ),
        application_process: firstNonEmptyCollection(
          existing,
          ["application_process"],
          [
            "Complete the official school application form.",
            "Submit all required supporting documents.",
            "Applications may be submitted online or at the school office.",
            "Parents will be contacted once the application has been reviewed.",
          ],
        ),
        important_notes: firstNonEmptyCollection(existing, ["important_notes"], [
          "All documents must be certified.",
          "Incomplete applications may not be processed.",
          "Submission of an application does not guarantee admission.",
          "Admission decisions are subject to the school's capacity.",
        ]),
      };
    }

    if (isApplyPage) {
      return {
        ...existing,
        section_title: existing.section_title || "Online Application",
        form_title: existing.form_title || "Online Application",
        form_subtitle:
          existing.form_subtitle ||
          "Complete the form below and upload required documents. Fields marked",
        required_fields_label:
          existing.required_fields_label || "are mandatory.",
        manual_form_url:
          existing.manual_form_url || "/docs/admission-form.pdf",
        manual_form_label:
          existing.manual_form_label || "Download Manual Form",
        help_href: existing.help_href || "/contact",
        help_label: existing.help_label || "Need Help?",
        progress_title: existing.progress_title || "Application Progress",
        uploads_tip_title: existing.uploads_tip_title || "Tip",
        uploads_tip_text:
          existing.uploads_tip_text ||
          "If you cannot upload documents, you may submit the manual form in person with certified copies.",
        submit_note:
          existing.submit_note ||
          "By submitting, your application will be sent to the Administration Office for review.",
        help_text:
          existing.help_text ||
          "If you experience any difficulty, contact the school office or submit your manual application form with certified copies.",
      };
    }

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
      process: firstNonEmptyCollection(existing, ["process"], [
        {
          id: "download",
          title: "Download",
          body: "Get the official admission form (PDF).",
        },
        {
          id: "complete",
          title: "Complete",
          body:
            "Fill guardian details and attach required documents (ID, proof of residence, reports).",
        },
        {
          id: "submit",
          title: "Submit",
          body:
            "Upload online or hand-deliver to the school office during working hours.",
        },
        {
          id: "await",
          title: "Await",
          body:
            "You will receive confirmation via email or SMS about assessment and intake.",
        },
      ]),
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

  if (kind === "news") {
    return {
      section_title: existing.section_title || "Latest News",
      subtitle:
        existing.subtitle ||
        "Latest stories and achievements from our community.",
      ...existing,
      items: firstCollection(existing, ["items", "articles", "stories", "news"]),
    };
  }

  if (kind === "policy") {
    return {
      section_title: existing.section_title || "Policy",
      introduction: existing.introduction || existing.description || "",
      closing_text: existing.closing_text || existing.footer_note || "",
      pdf_url: existing.pdf_url || "",
      view_button_label: existing.view_button_label || "View Full Document",
      download_button_label: existing.download_button_label || "Download PDF",
      ...existing,
      rules: firstCollection(existing, ["rules", "items", "sections"]),
    };
  }

  if (kind === "links") {
    return {
      section_title: existing.section_title || "Quick Links",
      subtitle: existing.subtitle || "",
      ...existing,
      items: firstCollection(existing, ["items", "links"]),
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
    headingColor: existing.headingColor || existing.heading_color || "",
    accentColor: existing.accentColor || existing.accent_color || "",
    linkColor: existing.linkColor || existing.link_color || "",
    borderRadius: Number(existing.borderRadius ?? existing.border_radius ?? 16),
    maxWidth: existing.maxWidth || existing.max_width || "default",
    typography: existing.typography || existing.fontFamily || "inherit",
    headingTypography: existing.headingTypography || existing.heading_font_family || "inherit",
    fontSize: existing.fontSize || existing.font_size || "",
    headingFontSize: existing.headingFontSize || existing.heading_font_size || "",
    fontWeight: existing.fontWeight || existing.font_weight || "",
    headingFontWeight: existing.headingFontWeight || existing.heading_font_weight || "",
    typeScale: existing.typeScale || existing.type_scale || "default",
    lineHeight: existing.lineHeight || existing.line_height || "default",
    linkStyle: existing.linkStyle || existing.link_style || "template",
    buttonStyle: existing.buttonStyle || existing.button_style || "template",
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

function LinkField({ label, value, onChange, placeholder = "/page or https://...", hint = "Use an internal path like /contact, an email link, a phone link, or a full website URL." }) {
  const inputId = useId();
  const fieldId = `bse-link-${safeText(label, "link")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-${inputId.replace(/:/g, "")}`;
  const cleanValue = String(value || "").trim();
  const canOpen = Boolean(cleanValue && /^(https?:|mailto:|tel:|\/|#)/i.test(cleanValue));

  return (
    <label className="bse-field" htmlFor={fieldId}>
      <span className="bse-field-label">{label}</span>
      <div className="bse-two-column">
        <input
          id={fieldId}
          className="bse-input"
          type="text"
          value={value || ""}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="bse-link-button"
          disabled={!canOpen}
          onClick={(event) => {
            event.preventDefault();
            if (canOpen) window.open(cleanValue, "_blank", "noopener,noreferrer");
          }}
        >
          Open Link
        </button>
      </div>
      {hint && <small className="bse-field-hint">{hint}</small>}
    </label>
  );
}

function LocalDateTimeField({ label, value, onChange, hint = "Use the picker for a local date and time, or keep the template text format if the page displays it that way." }) {
  const inputId = useId();
  const fieldId = `bse-datetime-${safeText(label, "date")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-${inputId.replace(/:/g, "")}`;
  const pickerValue = toLocalDateTimeInputValue(value);

  return (
    <label className="bse-field" htmlFor={fieldId}>
      <span className="bse-field-label">{label}</span>
      <div className="bse-two-column">
        <input
          id={fieldId}
          className="bse-input"
          type="datetime-local"
          value={pickerValue}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="bse-link-button"
          onClick={(event) => {
            event.preventDefault();
            onChange(currentLocalDateTimeValue());
          }}
        >
          Use Local Now
        </button>
      </div>
      {!pickerValue && value && (
        <input
          className="bse-input"
          type="text"
          value={value || ""}
          placeholder="18 March 2026 or 2026-06-18T08:00"
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && <small className="bse-field-hint">{hint}</small>}
    </label>
  );
}


function toDateInputValue(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const isoDate = raw.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (isoDate) return isoDate[1];

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDateFromInput(value = "") {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return raw;

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function LocalDateField({ label, value, onChange, hint = "Use the date picker for a full display date, for example Tue, Nov 25, 2025." }) {
  const inputId = useId();
  const fieldId = `bse-date-${safeText(label, "date")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-${inputId.replace(/:/g, "")}`;
  const pickerValue = toDateInputValue(value);

  return (
    <label className="bse-field" htmlFor={fieldId}>
      <span className="bse-field-label">{label}</span>
      <input
        id={fieldId}
        className="bse-input"
        type="date"
        value={pickerValue}
        onChange={(event) => onChange(formatDisplayDateFromInput(event.target.value))}
      />
      {!pickerValue && value && (
        <input
          className="bse-input"
          type="text"
          value={value || ""}
          placeholder="Tue, Nov 25, 2025"
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

function splitTextList(value = "") {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function TextListField({
  label,
  items = [],
  onChange,
  placeholder = "One item per line",
  hint = "",
  rows = 5,
}) {
  return (
    <label className="bse-field">
      <span className="bse-field-label">{label}</span>
      <textarea
        className="bse-textarea"
        rows={rows}
        value={Array.isArray(items) ? items.join("\n") : ""}
        placeholder={placeholder}
        onChange={(event) => onChange(splitTextList(event.target.value))}
      />
      {hint && <small className="bse-field-hint">{hint}</small>}
    </label>
  );
}

function ItemField({ definition, value, onChange }) {
  if (definition.type === "datetime-local") {
    return (
      <div className="bse-item-field">
        <LocalDateTimeField
          label={definition.label}
          value={value || ""}
          onChange={onChange}
          hint={definition.hint || "Local date/time picker for this template field."}
        />
      </div>
    );
  }

  if (definition.type === "date") {
    return (
      <div className="bse-item-field">
        <LocalDateField
          label={definition.label}
          value={value || ""}
          onChange={onChange}
          hint={definition.hint || "Use the date picker for a full display date, for example Tue, Nov 25, 2025."}
        />
      </div>
    );
  }

  if (definition.type === "link" || definition.type === "media-link") {
    return (
      <div className="bse-item-field">
        <LinkField
          label={definition.label}
          value={value || ""}
          placeholder={definition.placeholder || "/page or https://..."}
          hint={
            definition.type === "media-link"
              ? "Paste a media/document URL, or use the Media tab to upload/select the asset."
              : definition.hint
          }
          onChange={onChange}
        />
      </div>
    );
  }

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

  if (definition.type === "list") {
    return (
      <label className="bse-item-field">
        <span>{definition.label}</span>
        <textarea
          className="bse-textarea"
          rows={definition.rows || 3}
          value={Array.isArray(value) ? value.join("\n") : ""}
          placeholder={definition.placeholder || "One item per line"}
          onChange={(event) => onChange(splitTextList(event.target.value))}
        />
      </label>
    );
  }

  if (definition.type === "checkbox") {
    return (
      <label className="bse-toggle-row">
        <span>
          <strong>{definition.label}</strong>
          {definition.hint && <small>{definition.hint}</small>}
        </span>
        <span className={`bse-switch ${value === true ? "is-on" : ""}`}>
          <input
            type="checkbox"
            checked={value === true}
            onChange={(event) => onChange(event.target.checked)}
          />
          <span aria-hidden="true" />
        </span>
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
      itemIndex === index ? setItemValueWithAliasSync(item, field, value) : item,
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


const SYSTEM_DYNAMIC_CONTENT_KEYS = new Set([
  "__section_key",
  "_section_key",
  "section_key",
  "editor_section_type",
  "_editor_section_type",
  "section_type",
  "page_slug",
  "_page_slug",
  "template_key",
  "template_category",
  "__editor_field_order",
  "__editor_field_labels",
  "__editor_fallback_content",
  "_editor_field_order",
  "_editor_field_labels",
  "_editor_fallback_content",
  "editor_field_order",
  "editor_field_labels",
  "editor_fallback_content",
  "editorFieldOrder",
  "editorFieldLabels",
  "editorFallbackContent",
  "field_order",
  "field_labels",
  "fallback_content",
]);

const HEADER_DYNAMIC_CONTENT_KEYS = new Set([
  "section_title",
  "subtitle",
]);

function formatDynamicLabel(key = "") {
  return String(key || "")
    .replace(/^_+/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isLongDynamicKey(key = "") {
  const normalized = normalizeType(key);

  return [
    "body",
    "description",
    "text",
    "summary",
    "subtitle",
    "introduction",
    "note",
    "footer_note",
    "closing_text",
    "supporting_text",
    "profile_note",
    "commitment_body",
    "projects_body",
    "competitions_body",
    "content",
  ].some((part) => normalized.includes(part));
}

function isLinkDynamicKey(key = "") {
  const normalized = normalizeType(key);

  return (
    normalized.endsWith("href") ||
    normalized.endsWith("url") ||
    normalized.includes("link") ||
    normalized.includes("button_href") ||
    normalized.includes("form_url") ||
    normalized.includes("pdf_url") ||
    normalized.includes("document_url") ||
    normalized.includes("manual_form_url")
  );
}

function isMediaDynamicKey(key = "") {
  const normalized = normalizeType(key);

  return [
    "image",
    "image_url",
    "img",
    "logo",
    "logo_url",
    "photo",
    "photo_url",
    "hero_image",
    "background_image",
    "thumbnail",
    "thumbnail_url",
    "cover",
    "cover_image",
    "pdf",
    "pdf_url",
    "document",
    "document_url",
    "file_url",
    "manual_form_url",
  ].includes(normalized);
}

function isLocalDateTimeDynamicKey(key = "") {
  const normalized = normalizeType(key);

  /*
    Local date/time controls are only used for intentional schedule fields.
    Plain template fields such as "date" remain text unless they are stored in
    an ISO date-only format and can safely use a date picker.
  */
  return (
    normalized === "start_at" ||
    normalized === "startat" ||
    normalized === "end_at" ||
    normalized === "endat" ||
    normalized === "published_at" ||
    normalized === "publishedat" ||
    normalized === "scheduled_at" ||
    normalized === "scheduledat" ||
    normalized === "event_at" ||
    normalized === "eventat" ||
    normalized.includes("date_time") ||
    normalized.includes("datetime")
  );
}

function isDateOnlyDynamicKey(key = "", value = "") {
  const normalized = normalizeType(key);
  const raw = String(value || "").trim();
  const dateKeys = [
    "date",
    "event_date",
    "start_date",
    "end_date",
    "due_date",
    "published_date",
    "scheduled_date",
  ];

  if (!dateKeys.includes(normalized)) return false;
  if (!raw) return true;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return true;
  if (/^[A-Za-z]{3},\s+[A-Za-z]{3}\s+\d{1,2},\s+\d{4}$/.test(raw)) return true;
  if (/^[A-Za-z]+\s+\d{1,2},\s+\d{4}$/.test(raw)) return true;
  if (/^[A-Za-z]{3,9}\s+\d{4}$/.test(raw)) return true;

  const parsed = new Date(raw);
  return !Number.isNaN(parsed.getTime());
}

function isTimeOnlyDynamicKey(key = "", value = "") {
  const normalized = normalizeType(key);
  const raw = String(value || "").trim();
  const isTime = /^\d{2}:\d{2}(:\d{2})?$/.test(raw);

  return (
    isTime &&
    [
      "time",
      "start_time",
      "end_time",
      "opening_time",
      "closing_time",
      "arrival_time",
    ].includes(normalized)
  );
}

function toLocalDateTimeInputValue(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const directMatch = raw.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  if (directMatch) return `${directMatch[1]}T${directMatch[2]}`;

  const dateOnlyMatch = raw.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (dateOnlyMatch) return `${dateOnlyMatch[1]}T08:00`;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";

  const timezoneOffset = parsed.getTimezoneOffset() * 60000;
  return new Date(parsed.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function currentLocalDateTimeValue() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

function currentLocalDateValue() {
  return currentLocalDateTimeValue().slice(0, 10);
}

function currentLocalTimeValue() {
  return currentLocalDateTimeValue().slice(11, 16);
}


const CONTENT_ALIAS_FIELD_KEYS = [
  "content",
  "body",
  "description",
  "summary",
  "text",
  "message",
  "items",
];

function normalizedItemValueSignature(items = [], key = "") {
  return (Array.isArray(items) ? items : [])
    .map((item) => {
      if (!isObject(item)) return "";
      const value = item[key];
      if (Array.isArray(value) || isObject(value)) return "";
      return String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
    })
    .join("||");
}

function normalizedScalarContentSignature(content = {}, key = "") {
  if (!isObject(content)) return "";

  const value = content[key];
  if (Array.isArray(value) || isObject(value)) return "";

  return String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function preferredContentAliasKey(keys = []) {
  const normalizedKeys = keys.map((key) => normalizeType(key));

  if (
    normalizedKeys.includes("grade") &&
    normalizedKeys.includes("subject") &&
    normalizedKeys.includes("items")
  ) {
    return "items";
  }

  if (
    (normalizedKeys.includes("category") || normalizedKeys.includes("image_alt")) &&
    normalizedKeys.includes("summary")
  ) {
    return "summary";
  }

  return CONTENT_ALIAS_FIELD_KEYS.find((key) => normalizedKeys.includes(key)) || "body";
}

function removeDuplicatedContentAliasFields(fieldKeys = [], items = []) {
  const aliasKeys = fieldKeys.filter((key) =>
    CONTENT_ALIAS_FIELD_KEYS.includes(normalizeType(key)),
  );

  if (aliasKeys.length < 2) return fieldKeys;

  const signatureGroups = aliasKeys.reduce((groups, key) => {
    const signature = normalizedItemValueSignature(items, key);
    if (!signature || signature.split("||").every((part) => !part)) return groups;
    groups[signature] = [...(groups[signature] || []), key];
    return groups;
  }, {});

  const hiddenKeys = new Set();

  Object.values(signatureGroups).forEach((groupKeys) => {
    if (!Array.isArray(groupKeys) || groupKeys.length < 2) return;

    const preferred = preferredContentAliasKey(fieldKeys);
    const keepKey = groupKeys.includes(preferred) ? preferred : groupKeys[0];

    groupKeys.forEach((key) => {
      if (key !== keepKey) hiddenKeys.add(key);
    });
  });

  if (!hiddenKeys.size) return fieldKeys;
  return fieldKeys.filter((key) => !hiddenKeys.has(key));
}

function removeDuplicatedScalarContentAliasFields(fieldKeys = [], content = {}) {
  const aliasKeys = fieldKeys.filter((key) =>
    CONTENT_ALIAS_FIELD_KEYS.includes(normalizeType(key)),
  );

  if (aliasKeys.length < 2) return fieldKeys;

  const signatureGroups = aliasKeys.reduce((groups, key) => {
    const signature = normalizedScalarContentSignature(content, key);
    if (!signature) return groups;
    groups[signature] = [...(groups[signature] || []), key];
    return groups;
  }, {});

  const hiddenKeys = new Set();

  Object.values(signatureGroups).forEach((groupKeys) => {
    if (!Array.isArray(groupKeys) || groupKeys.length < 2) return;

    const preferred = preferredContentAliasKey(fieldKeys);
    const keepKey = groupKeys.includes(preferred) ? preferred : groupKeys[0];

    groupKeys.forEach((key) => {
      if (key !== keepKey) hiddenKeys.add(key);
    });
  });

  if (!hiddenKeys.size) return fieldKeys;
  return fieldKeys.filter((key) => !hiddenKeys.has(key));
}

function isContentAliasKey(key = "") {
  return CONTENT_ALIAS_FIELD_KEYS.includes(normalizeType(key));
}

function setContentValueWithAliasSync(content = {}, path = "", value) {
  const key = String(path || "");
  const next = setAtPath(content, key, value);

  if (!key || key.includes(".") || !isContentAliasKey(key) || !isObject(content)) {
    return next;
  }

  const originalSignature = normalizedScalarContentSignature(content, key);
  if (!originalSignature) return next;

  Object.keys(content).forEach((candidateKey) => {
    if (candidateKey === key || !isContentAliasKey(candidateKey)) return;
    if (normalizedScalarContentSignature(content, candidateKey) === originalSignature) {
      next[candidateKey] = value;
    }
  });

  return next;
}

function setItemValueWithAliasSync(item = {}, field = "", value) {
  const next = { ...item, [field]: value };

  if (!isContentAliasKey(field) || !isObject(item)) {
    return next;
  }

  const originalSignature = normalizedScalarContentSignature(item, field);
  if (!originalSignature) return next;

  Object.keys(item).forEach((candidateKey) => {
    if (candidateKey === field || !isContentAliasKey(candidateKey)) return;
    if (normalizedScalarContentSignature(item, candidateKey) === originalSignature) {
      next[candidateKey] = value;
    }
  });

  return next;
}

function orderDynamicItemFieldKeys(fieldKeys = []) {
  const normalizedMap = fieldKeys.reduce((result, key) => {
    result[normalizeType(key)] = key;
    return result;
  }, {});
  const hasKeys = (keys = []) => keys.every((key) => normalizedMap[normalizeType(key)]);
  const applyOrder = (preferredOrder = []) => {
    const used = new Set();
    const ordered = [];

    preferredOrder.forEach((key) => {
      const originalKey = normalizedMap[normalizeType(key)];
      if (!originalKey || used.has(originalKey)) return;
      ordered.push(originalKey);
      used.add(originalKey);
    });

    fieldKeys.forEach((key) => {
      if (!used.has(key)) ordered.push(key);
    });

    return ordered;
  };

  if (hasKeys(["eyebrow", "title"]) && hasKeys(["body"]) && hasKeys(["values"])) {
    return applyOrder(["eyebrow", "title", "body", "values"]);
  }

  if (hasKeys(["grade", "subject", "items"])) {
    return applyOrder(["grade", "subject", "items"]);
  }

  if (hasKeys(["title", "startAt"])) {
    return applyOrder([
      "title",
      "startAt",
      "endAt",
      "publishedAt",
      "location",
      "category",
      "status",
    ]);
  }

  if (hasKeys(["title", "date", "category", "content"])) {
    return applyOrder(["date", "title", "category", "urgent", "content"]);
  }

  if (hasKeys(["title", "summary", "category"])) {
    return applyOrder([
      "title",
      "summary",
      "category",
      "date",
      "image_url",
      "image_alt",
      "href",
      "url",
    ]);
  }

  if (hasKeys(["title", "body", "image_url"])) {
    return applyOrder(["title", "body", "image_url", "img", "image_alt"]);
  }

  if (hasKeys(["title", "icon", "items"])) {
    return applyOrder(["title", "icon", "items"]);
  }

  const scheduleRank = {
    title: 0,
    name: 0,
    label: 0,
    startat: 1,
    start_at: 1,
    endat: 2,
    end_at: 2,
    publishedat: 3,
    published_at: 3,
  };

  return [...fieldKeys].sort((a, b) => {
    const aRank = scheduleRank[normalizeType(a)];
    const bRank = scheduleRank[normalizeType(b)];

    if (aRank === undefined && bRank === undefined) return 0;
    if (aRank === undefined) return 1;
    if (bRank === undefined) return -1;
    return aRank - bRank;
  });
}

function inputTypeForDynamicKey(key = "", value) {
  if (typeof value === "number") return "number";
  if (isLocalDateTimeDynamicKey(key)) return "datetime-local";
  if (isDateOnlyDynamicKey(key, value)) return "date";
  if (isTimeOnlyDynamicKey(key, value)) return "time";
  if (isLinkDynamicKey(key) && !isMediaDynamicKey(key)) return "link";
  if (isMediaDynamicKey(key)) return "media-link";
  return isLongDynamicKey(key) ? "textarea" : "text";
}

function inferDynamicItemFields(items = [], fallbackItems = []) {
  const fieldKeys = [];
  const templateItems = Array.isArray(fallbackItems) ? fallbackItems.filter((item) => isObject(item)) : [];
  const currentItems = Array.isArray(items) ? items.filter((item) => isObject(item)) : [];
  const sourceItems = templateItems.length ? templateItems : currentItems;
  const fieldSources = templateItems.length
    ? [...templateItems.slice(0, 6), ...currentItems.slice(0, 6)]
    : currentItems.slice(0, 6);

  fieldSources.forEach((item) => {
    if (!isObject(item)) return;

    Object.keys(item).forEach((key) => {
      if (key === "id" || SYSTEM_DYNAMIC_CONTENT_KEYS.has(key)) return;
      if (!fieldKeys.includes(key)) fieldKeys.push(key);
    });
  });

  const cleanedFieldKeys = removeDuplicatedContentAliasFields(
    fieldKeys,
    fieldSources.length ? fieldSources : items,
  );
  const orderedFieldKeys = orderDynamicItemFieldKeys(cleanedFieldKeys);

  if (!orderedFieldKeys.length) {
    orderedFieldKeys.push("title", "body");
  }

  return orderedFieldKeys.map((key) => {
    const sampleValue =
      fieldSources
        .map((item) => (isObject(item) ? item[key] : undefined))
        .find((value) => value !== undefined && value !== null) ??
      (Array.isArray(sourceItems) ? sourceItems : [])
        .map((item) => (isObject(item) ? item[key] : undefined))
        .find((value) => value !== undefined && value !== null) ??
      "";

    if (Array.isArray(sampleValue)) {
      return {
        key,
        label: formatDynamicLabel(key),
        type: "list",
        rows: 4,
      };
    }

    if (isObject(sampleValue)) {
      return {
        key,
        label: formatDynamicLabel(key),
        type: "json",
        rows: 5,
      };
    }

    if (typeof sampleValue === "boolean") {
      return {
        key,
        label: formatDynamicLabel(key),
        type: "checkbox",
      };
    }

    const inputType = inputTypeForDynamicKey(key, sampleValue);

    return {
      key,
      label: formatDynamicLabel(key),
      type: inputType === "text" ? undefined : inputType,
      rows: inputType === "textarea" ? 3 : undefined,
    };
  });
}

function createDynamicItemFromFields(fields = [], prefix = "item") {
  return {
    id: createKey(prefix),
    ...fields.reduce((result, field) => {
      if (field.type === "list") {
        result[field.key] = [];
        return result;
      }

      if (field.type === "json") {
        result[field.key] = {};
        return result;
      }

      if (field.type === "checkbox") {
        result[field.key] = false;
        return result;
      }

      if (field.type === "datetime-local") {
        result[field.key] = currentLocalDateTimeValue();
        return result;
      }

      if (field.type === "date") {
        result[field.key] = currentLocalDateValue();
        return result;
      }

      if (field.type === "time") {
        result[field.key] = currentLocalTimeValue();
        return result;
      }

      result[field.key] = "";
      return result;
    }, {}),
  };
}



const EXACT_SCHOOL_TEMPLATE_FALLBACKS = {
  school_facilities: {
    section_title: "School Facilities",
    subtitle:
      "Our facilities are designed to provide a safe, structured, and resource-rich environment that supports both academic and extracurricular excellence.",
    items: [
      {
        id: "facility-learning-spaces",
        title: "Learning Spaces",
        body:
          "Modern classrooms, science laboratories, and structured learning spaces designed to support academic excellence and focused instruction.",
        image_url: "/images/facilities/classrooms.jpg",
        img: "/images/facilities/classrooms.jpg",
      },
      {
        id: "facility-library-resource-centre",
        title: "Library & Resource Centre",
        body:
          "A dedicated space for reading, research, and digital learning access, supporting independent study and curriculum enrichment.",
        image_url: "/images/facilities/library.jpg",
      },
      {
        id: "facility-science-computer-labs",
        title: "Science & Computer Labs",
        body:
          "Fully equipped laboratories for Physical Sciences, Life Sciences, and Information Technology.",
        image_url: "/images/facilities/computer-lab.jpg",
      },
      {
        id: "facility-sport-recreation",
        title: "Sport & Recreation",
        body:
          "Soccer field, athletics space, and courts that promote discipline, teamwork, and physical development.",
        image_url: "/images/facilities/sports.jpg",
      },
      {
        id: "facility-administration-block",
        title: "Administration Block",
        body:
          "Professional administrative offices ensuring effective school management and learner support services.",
        image_url: "/images/facilities/admin.jpg",
      },
      {
        id: "facility-multipurpose-hall",
        title: "Assembly & Multi-Purpose Hall",
        body:
          "A venue for assemblies, examinations, cultural activities, and important school events.",
        image_url: "/images/facilities/hall.jpg",
      },
    ],
  },
  school_activity_facilities: {
    section_title: "Campus Facilities",
    subtitle:
      "{site_name} provides facilities that support academic excellence, discipline, learner wellbeing, and participation in sport and culture.",
    primary_button_label: "Full Facilities Page",
    primary_button_href: "/facilities",
    secondary_button_label: "View Photos",
    secondary_button_href: "/gallery",
    image_url: "/images/school/school.jpg",
    image_alt: "School Campus",
    feature_groups: [
      {
        id: "academic",
        title: "Academic Facilities",
        icon: "🎓",
        items: [
          "Spacious, well-equipped classrooms",
          "Science laboratories (Physical Sciences & Life Sciences)",
          "Computer laboratory with internet access",
          "Library and study resource centre",
          "Mathematics support and enrichment",
        ],
      },
      {
        id: "sports",
        title: "Sports & Recreation",
        icon: "🏟️",
        items: [
          "Soccer and athletics field",
          "Netball and basketball courts",
          "Multi-purpose sports ground",
          "Indoor hall for assemblies and events",
        ],
      },
      {
        id: "support",
        title: "Learner Support Areas",
        icon: "🛡️",
        items: [
          "Administration block",
          "Guidance and counselling support",
          "Staff room and meeting facilities",
          "Secure school premises and controlled access",
        ],
      },
    ],
    gallery_label: "# Preview",
    gallery_title: "Facilities Photo Preview",
    gallery_subtitle: "Replace these images with your real facility photos.",
    gallery_button_label: "Open Gallery →",
    gallery_note:
      "Tip: put images in public/images/facilities/ and keep the same names.",
    gallery: [
      {
        id: "facility-preview-classrooms",
        title: "Classrooms",
        image_url: "/images/facilities/classrooms.jpg",
        img: "/images/facilities/classrooms.jpg",
      },
      {
        id: "facility-preview-science-lab",
        title: "Science Lab",
        image_url: "/images/facilities/science-lab.jpg",
        img: "/images/facilities/science-lab.jpg",
      },
      {
        id: "facility-preview-computer-lab",
        title: "Computer Lab",
        image_url: "/images/facilities/computer-lab.jpg",
        img: "/images/facilities/computer-lab.jpg",
      },
      {
        id: "facility-preview-sports",
        title: "Sports Grounds",
        image_url: "/images/facilities/sports.jpg",
        img: "/images/facilities/sports.jpg",
      },
    ],
  },
  school_daily_bulletin: {
    section_title: "Student Daily Bulletin",
    subtitle:
      "Official daily announcements for learners at M.O.M Sebone Secondary School.",
    search_placeholder: "Search bulletin...",
    empty_message: "No announcements matched your search.",
    footer_note:
      "For urgent announcements, learners should confirm details with the school office or their class teacher.",
    items: [
      {
        id: "bulletin-mathematics-extra-classes",
        date: "18 March 2026",
        title: "Mathematics Extra Classes",
        category: "Academics",
        urgent: false,
        content:
          "Grade 12 learners will attend Mathematics extra classes from 14:30 – 16:00 in Room 12.",
      },
      {
        id: "bulletin-school-assembly-reminder",
        date: "18 March 2026",
        title: "School Assembly Reminder",
        category: "General",
        urgent: true,
        content:
          "All learners must report to the assembly ground at 07:30 sharp in full school uniform.",
      },
      {
        id: "bulletin-soccer-trials",
        date: "17 March 2026",
        title: "Soccer Trials",
        category: "Sports",
        urgent: false,
        content:
          "Soccer trials will take place at 15:00 on the main field. Bring training kit.",
      },
      {
        id: "bulletin-life-sciences-practical",
        date: "17 March 2026",
        title: "Life Sciences Practical",
        category: "Academics",
        urgent: false,
        content:
          "Grade 11 learners must bring lab coats for the Life Sciences practical session.",
      },
    ],
  },
  school_attendance_policy: {
    section_title: "Attendance Policy",
    subtitle:
      "This policy explains attendance expectations, late-coming procedures, absence reporting, and academic accountability for learners at M.O.M Sebone Secondary School.",
    school_name: "M.O.M Sebone Secondary School",
    phone: "011 023 9428",
    email: "sebone@gmail.com",
    meta_items: [
      "Policy Type: Learner Conduct",
      "Applies to: All Grades",
      "Status: Active",
    ],
    purpose_title: "1. Purpose",
    purpose_body:
      "Regular attendance is essential for learner performance, discipline, and successful completion of curriculum requirements. This policy sets out clear procedures to support punctuality, monitor attendance, and ensure effective communication between the school and parents/guardians.",
    attendance_title: "2. Attendance Expectations",
    attendance_expectations: [
      "Learners must attend school every official school day unless excused for a valid reason.",
      "Learners must arrive on time and be prepared for learning (uniform, stationery, and books).",
      "Attendance is recorded daily (and per period where applicable).",
      "Repeated absences or late-coming may lead to intervention and disciplinary steps.",
    ],
    late_coming_title: "3. Late-Coming Procedure",
    late_coming_body:
      "Learners who arrive late disrupt teaching and learning. Late-coming is recorded and monitored.",
    late_arrival_title: "3.1 When a learner is late",
    late_arrival_items: [
      "Report to the designated late-coming point/office on arrival.",
      "Late-coming is recorded and may require a slip/pass to enter class.",
      "Repeated late-coming triggers parent contact and intervention.",
    ],
    acceptable_reasons_title: "3.2 Acceptable reasons",
    acceptable_reasons: [
      "Medical appointment (proof required)",
      "Public transport delays (when consistent and verifiable)",
      "Family emergency (parent/guardian confirmation required)",
    ],
    absences_title: "4. Absences & Reporting",
    absence_items: [
      "Parents/guardians must inform the school as soon as possible when a learner will be absent.",
      "A written note or proof must be provided upon return to school.",
      "Medical certificates are required for extended illness or repeated health-related absences.",
      "Unreported absences may be recorded as unexcused and can trigger intervention.",
    ],
    absence_callout_label: "Important:",
    absence_callout:
      "If a learner is absent on the day of a test/exam, the school may require valid proof before a make-up assessment is considered.",
    catch_up_title: "5. Catch-Up Work & Assessments",
    catch_up_items: [
      "It is the learner’s responsibility to request and complete missed classwork.",
      "Teachers will guide learners on what was missed and the deadline for catch-up work.",
      "Make-up tasks/tests are granted at the school’s discretion and may require proof of absence.",
      "Repeated missed assessments may affect promotion requirements.",
    ],
    intervention_title: "6. Monitoring & Intervention",
    intervention_steps: [
      {
        id: "early-warning",
        title: "Early Warning",
        body:
          "Educator/grade head identifies patterns of lateness/absence and records concerns.",
      },
      {
        id: "parent-contact",
        title: "Parent/Guardian Contact",
        body:
          "School contacts parent/guardian to discuss causes and agree on corrective actions.",
      },
      {
        id: "support-plan",
        title: "Support Plan",
        body:
          "Where needed, a learner support plan may be implemented (counselling, referrals, monitoring).",
      },
      {
        id: "disciplinary-steps",
        title: "Disciplinary Steps",
        body:
          "Continued non-compliance may lead to disciplinary action in line with the school code of conduct.",
      },
    ],
    roles_title: "7. Roles & Responsibilities",
    roles: [
      {
        id: "learners",
        title: "Learners",
        items: [
          "Attend daily and arrive on time.",
          "Bring required materials and maintain discipline.",
          "Catch up missed work promptly.",
        ],
      },
      {
        id: "parents",
        title: "Parents/Guardians",
        items: [
          "Ensure learners arrive on time.",
          "Report absences promptly and provide proof.",
          "Respond to school communication and attend meetings when required.",
        ],
      },
      {
        id: "school",
        title: "School",
        items: [
          "Record attendance accurately.",
          "Communicate concerns and apply interventions.",
          "Support learners to improve attendance.",
        ],
      },
    ],
    contact_title: "8. Contact",
    contact_body:
      "For attendance enquiries, please contact the school office:",
    footer_note:
      "This page is a website version of the policy. The school’s official signed policy document remains the primary reference.",
  },
};

function normalizeEditorSlug(value = "") {
  const clean = String(value || "/").trim().toLowerCase();
  if (!clean || clean === "_") return "/";
  return `/${clean.replace(/^\/+|\/+$/g, "")}`;
}

function getExactSchoolTemplateFallback(section = EMPTY_SECTION, page = EMPTY_PAGE) {
  const content = isObject(section?.content) ? section.content : {};
  const normalizedType = normalizeType(
    section?.type ||
      section?.section_type ||
      content?._editor_section_type ||
      content?.editor_section_type ||
      content?.section_type ||
      section?.editor_section_type ||
      section?.editorSectionType ||
      "",
  );
  const normalizedKey = normalizeType(
    section?.key ||
      section?.section_key ||
      section?.sectionKey ||
      content?.__section_key ||
      content?._section_key ||
      content?.section_key ||
      section?.id ||
      "",
  );
  const pageSlug = normalizeEditorSlug(
    page?.slug || section?.page_slug || section?.pageSlug || content?.page_slug || content?._page_slug || "",
  );

  if (
    normalizedType === "school_daily_bulletin" ||
    normalizedKey.includes("daily_bulletin") ||
    normalizedKey.includes("bulletin") ||
    pageSlug === "/bulletin" ||
    pageSlug.endsWith("/bulletin") ||
    pageSlug === "/student-daily-bulletin" ||
    pageSlug.endsWith("/student-daily-bulletin")
  ) {
    return EXACT_SCHOOL_TEMPLATE_FALLBACKS.school_daily_bulletin;
  }

  if (
    normalizedType === "school_attendance_policy" ||
    normalizedKey.includes("attendance") ||
    pageSlug === "/attendance" ||
    pageSlug.endsWith("/attendance")
  ) {
    return EXACT_SCHOOL_TEMPLATE_FALLBACKS.school_attendance_policy;
  }

  if (
    normalizedType === "school_activity_facilities" ||
    pageSlug === "/activities/facilities" ||
    pageSlug.endsWith("/activities/facilities") ||
    normalizedKey.includes("activity_facilities") ||
    normalizedKey.includes("campus_facilities")
  ) {
    return EXACT_SCHOOL_TEMPLATE_FALLBACKS.school_activity_facilities;
  }

  if (
    normalizedType === "school_facilities" ||
    pageSlug === "/facilities" ||
    pageSlug.endsWith("/facilities") ||
    normalizedKey.includes("facilities")
  ) {
    return EXACT_SCHOOL_TEMPLATE_FALLBACKS.school_facilities;
  }

  return null;
}

function createEditorFieldLabels(order = []) {
  return (Array.isArray(order) ? order : []).reduce((labels, key) => {
    labels[key] = formatDynamicLabel(key);
    return labels;
  }, {});
}

function hydrateContentWithExactSchoolFallback(section = EMPTY_SECTION, page = EMPTY_PAGE, content = {}) {
  const fallback = getExactSchoolTemplateFallback(section, page);
  if (!fallback) return content;

  const order = Object.keys(fallback).filter((key) => !SYSTEM_DYNAMIC_CONTENT_KEYS.has(key));
  const merged = mergeDraftFallbackContent(fallback, content);

  return {
    ...merged,
    // Exact school pages must keep the current template's own editor order.
    // Old saved metadata may exist from earlier builder versions, but it must
    // not reintroduce duplicate fields or reorder Attendance Policy/Bulletin/Facilities.
    __editor_field_order: order,
    __editor_field_labels: createEditorFieldLabels(order),
    __editor_fallback_content: clone(fallback),
  };
}

const FORCE_TEMPLATE_ORDER_EDITOR_TYPES = new Set([
  "school_academics",
  "school_activity_facilities",
  "school_facilities",
  "school_stationary_list",
  "school_exam_schedule",
  "school_entry_requirements",
  "school_code_of_conduct",
  "school_contact",
  "school_subject_choices",
  "school_daily_bulletin",
  "school_attendance_policy",
]);

function shouldForceTemplateOrderEditor(registrySectionType = "", draftContent = {}) {
  const normalizedType = normalizeType(registrySectionType);

  return (
    FORCE_TEMPLATE_ORDER_EDITOR_TYPES.has(normalizedType) ||
    (Array.isArray(draftContent?.__editor_field_order) &&
      draftContent.__editor_field_order.length > 0 &&
      Boolean(draftContent?.__editor_fallback_content))
  );
}

function shouldUseDynamicTemplateContentEditor({
  registrySectionType = "",
  registeredEditor = null,
  draftContent = {},
} = {}) {
  if (
    registeredEditor &&
    !shouldForceTemplateOrderEditor(registrySectionType, draftContent)
  ) return false;

  const normalizedType = normalizeType(registrySectionType);
  const hasTemplateFallbackMetadata =
    Array.isArray(draftContent?.__editor_field_order) &&
    draftContent.__editor_field_order.length > 0 &&
    Boolean(draftContent?.__editor_fallback_content);

  if (!normalizedType.startsWith("school_") && !hasTemplateFallbackMetadata) return false;

  return Object.keys(draftContent || {}).some(
    (key) =>
      !SYSTEM_DYNAMIC_CONTENT_KEYS.has(key) &&
      !HEADER_DYNAMIC_CONTENT_KEYS.has(key),
  );
}


function mergeDraftFallbackContent(fallbackContent = {}, currentContent = {}) {
  const fallback = isObject(fallbackContent) ? clone(fallbackContent) : {};
  const current = isObject(currentContent) ? clone(currentContent) : {};

  const merged = {
    ...fallback,
    ...current,
  };

  Object.entries(fallback).forEach(([key, fallbackValue]) => {
    const currentValue = current[key];

    const isMissing =
      currentValue === undefined ||
      currentValue === null ||
      (Array.isArray(currentValue) &&
        currentValue.length === 0 &&
        Array.isArray(fallbackValue)) ||
      (isObject(currentValue) &&
        Object.keys(currentValue).length === 0 &&
        isObject(fallbackValue)) ||
      (String(currentValue ?? "").trim() === "" &&
        String(fallbackValue ?? "").trim() !== "");

    if (isMissing) {
      merged[key] = clone(fallbackValue);
      return;
    }

    if (
      Array.isArray(fallbackValue) &&
      Array.isArray(currentValue) &&
      fallbackValue.some((item) => isObject(item)) &&
      currentValue.some((item) => isObject(item))
    ) {
      merged[key] = currentValue.map((item, index) => {
        if (!isObject(item)) return item;

        const fallbackItem =
          isObject(fallbackValue[index])
            ? fallbackValue[index]
            : isObject(fallbackValue[0])
              ? fallbackValue[0]
              : {};

        return mergeDraftFallbackContent(fallbackItem, item);
      });
      return;
    }

    if (isObject(fallbackValue) && isObject(currentValue)) {
      merged[key] = mergeDraftFallbackContent(fallbackValue, currentValue);
    }
  });

  return merged;
}

function hydrateContentWithEditorFallback(content = {}) {
  const fallback =
    content?.__editor_fallback_content &&
    isObject(content.__editor_fallback_content)
      ? content.__editor_fallback_content
      : null;

  if (!fallback) return content;

  return mergeDraftFallbackContent(fallback, content);
}

const ENTRY_REQUIREMENTS_GRADE_DESCRIPTION =
  "Applications are primarily accepted for Grade 8, which is the entry level for the school. Applications for higher grades, Grades 9–12, may be considered depending on space availability.";

function isEntryRequirementsEditorContent(content = {}, registrySectionType = "") {
  if (!isObject(content)) return false;

  const normalizedType = normalizeType(registrySectionType);

  return (
    normalizedType === "school_entry_requirements" ||
    (Object.prototype.hasOwnProperty.call(content, "grades_title") &&
      Object.prototype.hasOwnProperty.call(content, "process_title")) ||
    (Object.prototype.hasOwnProperty.call(content, "required_documents") &&
      Object.prototype.hasOwnProperty.call(content, "application_process") &&
      Object.prototype.hasOwnProperty.call(content, "important_notes"))
  );
}

function insertAfterField(order = [], afterKey = "", keyToInsert = "") {
  const cleanOrder = Array.isArray(order) ? order.filter(Boolean) : [];

  if (!keyToInsert || cleanOrder.includes(keyToInsert)) return cleanOrder;

  const insertIndex = cleanOrder.indexOf(afterKey);
  const nextOrder = [...cleanOrder];

  nextOrder.splice(insertIndex >= 0 ? insertIndex + 1 : nextOrder.length, 0, keyToInsert);
  return nextOrder;
}

function ensureEntryRequirementsGradeDescriptionEditorFields(
  content = {},
  registrySectionType = "",
) {
  if (!isEntryRequirementsEditorContent(content, registrySectionType)) return content;

  const next = { ...content };

  if (!String(next.grades_description || "").trim()) {
    next.grades_description = ENTRY_REQUIREMENTS_GRADE_DESCRIPTION;
  }

  if (Array.isArray(next.__editor_field_order)) {
    next.__editor_field_order = insertAfterField(
      next.__editor_field_order,
      "grades_title",
      "grades_description",
    );
  }

  if (isObject(next.__editor_field_labels)) {
    next.__editor_field_labels = {
      ...next.__editor_field_labels,
      grades_description:
        next.__editor_field_labels.grades_description ||
        "Grade Admissions Description",
    };
  }

  if (isObject(next.__editor_fallback_content)) {
    next.__editor_fallback_content = {
      ...next.__editor_fallback_content,
      grades_description:
        next.__editor_fallback_content.grades_description ||
        ENTRY_REQUIREMENTS_GRADE_DESCRIPTION,
    };
  }

  return next;
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

  const sectionKind = resolveEditorSectionKind(section, page);
  const registrySectionType = resolveRegistrySectionType(section, page);
  const RegisteredContentEditor = getEditorComponent({
    templateCategory: section?.templateCategory || section?.template_category || "school",
    sectionType: registrySectionType,
    pageSlug: page?.slug || "",
    content: section?.content || {},
  });
  const sectionName =
    sectionKind === "who_we_are" ? "Who We Are" : sectionDisplayName(section);

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
    const editorSourceSection =
      resolveEditorSectionKind(sourceSection, page) === "who_we_are"
        ? { ...sourceSection, type: "who_we_are" }
        : sourceSection;
    const content = ensureEntryRequirementsGradeDescriptionEditorFields(
      hydrateContentWithExactSchoolFallback(
        editorSourceSection,
        page,
        hydrateContentWithEditorFallback(defaultContentFor(editorSourceSection, settings, page)),
      ),
      registrySectionType,
    );
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
    setDraftContent((previous) => setContentValueWithAliasSync(previous, path, value));
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
      setError("Select an image or document field first, then choose a media asset.");
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


  const renderDynamicTemplateContentTab = () => {
    const hasTemplateOrder =
      Array.isArray(draftContent?.__editor_field_order) &&
      draftContent.__editor_field_order.length > 0;
    const fallbackContent = isObject(draftContent?.__editor_fallback_content)
      ? draftContent.__editor_fallback_content
      : {};
    const fallbackKeys = Object.keys(fallbackContent || {}).filter(
      (key) =>
        key &&
        Object.prototype.hasOwnProperty.call(draftContent, key) &&
        !SYSTEM_DYNAMIC_CONTENT_KEYS.has(key),
    );
    const hasFallbackKeys = fallbackKeys.length > 0;
    const orderedKeys = hasTemplateOrder
      ? draftContent.__editor_field_order.filter(
          (key) =>
            key &&
            Object.prototype.hasOwnProperty.call(draftContent, key) &&
            !SYSTEM_DYNAMIC_CONTENT_KEYS.has(key),
        )
      : hasFallbackKeys
        ? fallbackKeys
        : [];

    const remainingKeys = hasTemplateOrder || hasFallbackKeys
      ? []
      : Object.keys(draftContent || {}).filter(
          (key) => !SYSTEM_DYNAMIC_CONTENT_KEYS.has(key),
        );

    const dynamicKeys = removeDuplicatedScalarContentAliasFields(
      [...orderedKeys, ...remainingKeys],
      draftContent,
    );

    return (
      <>
        <div className="bse-panel-intro">
          <h3>Template Fields</h3>
          <p>
            These fields are aligned to this page template only. The editor keeps
            the original template order, restores missing fallback values, and
            hides internal metadata fields.
          </p>
        </div>

        {!dynamicKeys.length && (
          <p className="bse-empty-note">
            No editable template fields were found for this section.
          </p>
        )}

        {dynamicKeys.map((key) => {
          const value = draftContent[key];
          const fallbackValue = fallbackContent[key];
          const label = draftContent?.__editor_field_labels?.[key] || formatDynamicLabel(key);
          const inputType = inputTypeForDynamicKey(key, value);

          if (Array.isArray(value)) {
            if (value.every((item) => typeof item === "string")) {
              return (
                <TextListField
                  key={key}
                  label={label}
                  items={value}
                  onChange={(items) => updateContent(key, items)}
                />
              );
            }

            if (value.every((item) => isObject(item))) {
              const fields = inferDynamicItemFields(value, fallbackValue);

              return (
                <ItemCollection
                  key={key}
                  title={label}
                  items={value}
                  emptyText={`${label.toLowerCase()} is not configured.`}
                  addLabel={`Add ${label.replace(/s$/, "")}`}
                  createItem={() => createDynamicItemFromFields(fields, key)}
                  fields={fields}
                  onChange={(items) => updateContent(key, items)}
                />
              );
            }

            return (
              <ContentField
                key={key}
                label={label}
                type="textarea"
                rows={5}
                value={value.join("\n")}
                onChange={(nextValue) => updateContent(key, splitTextList(nextValue))}
              />
            );
          }

          if (isObject(value)) {
            return (
              <ContentField
                key={key}
                label={label}
                type="textarea"
                rows={6}
                value={JSON.stringify(value, null, 2)}
                onChange={(nextValue) => {
                  try {
                    updateContent(key, JSON.parse(nextValue || "{}"));
                  } catch {
                    updateContent(key, nextValue);
                  }
                }}
              />
            );
          }

          if (inputType === "datetime-local") {
            return (
              <LocalDateTimeField
                key={key}
                label={label}
                value={value || ""}
                onChange={(nextValue) => updateContent(key, nextValue)}
              />
            );
          }

          if (inputType === "date") {
            return (
              <LocalDateField
                key={key}
                label={label}
                value={value || ""}
                onChange={(nextValue) => updateContent(key, nextValue)}
              />
            );
          }

          if (inputType === "link" || inputType === "media-link") {
            return (
              <LinkField
                key={key}
                label={label}
                value={value || ""}
                placeholder={inputType === "media-link" ? "Paste or upload media/document URL" : "/page or https://..."}
                hint={
                  inputType === "media-link"
                    ? "Use the Media tab to upload/select the file, or paste an existing asset URL."
                    : undefined
                }
                onChange={(nextValue) => updateContent(key, nextValue)}
              />
            );
          }

          return (
            <ContentField
              key={key}
              label={label}
              type={inputType === "textarea" ? "textarea" : "text"}
              rows={inputType === "textarea" ? 3 : undefined}
              value={value || ""}
              onChange={(nextValue) => updateContent(key, nextValue)}
            />
          );
        })}
      </>
    );
  };

  const renderContentTab = () => {
    if (
      shouldUseDynamicTemplateContentEditor({
        registrySectionType,
        registeredEditor: RegisteredContentEditor,
        draftContent,
      })
    ) {
      return renderDynamicTemplateContentTab();
    }

    if (RegisteredContentEditor) {
      return (
        <RegisteredContentEditor
          draftContent={draftContent}
          updateContent={updateContent}
          section={section}
          page={page}
          settings={settings}
        />
      );
    }

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
            <ContentField
              label="Search Placeholder"
              value={draftContent.search_placeholder || ""}
              placeholder="Search notices..."
              onChange={(value) => updateContent("search_placeholder", value)}
            />
            <ContentField
              label="Badge Label"
              value={draftContent.badge_label || ""}
              placeholder="Official Notice Board"
              onChange={(value) => updateContent("badge_label", value)}
            />
          </div>

          <ContentField
            label="Footer Note"
            type="textarea"
            rows={2}
            value={draftContent.footer_note || ""}
            placeholder="Optional confirmation note displayed below notices."
            onChange={(value) => updateContent("footer_note", value)}
          />

          <ItemCollection
            title="Notice Items"
            items={draftContent.items || []}
            emptyText="No notice items yet."
            addLabel="Add Notice Item"
            createItem={() => ({
              id: createKey("notice"),
              title: "New Notice",
              startAt: "",
              endAt: "",
              publishedAt: "",
              location: "",
              category: "",
              status: "Active",
            })}
            fields={[
              { key: "title", label: "Title", placeholder: "Notice title" },
              { key: "startAt", label: "Start Date & Time", type: "datetime-local" },
              { key: "endAt", label: "End Date & Time", type: "datetime-local" },
              { key: "publishedAt", label: "Published Date & Time", type: "datetime-local" },
              { key: "location", label: "Location", placeholder: "Venue or location" },
              { key: "category", label: "Category", placeholder: "Announcement" },
              { key: "status", label: "Status", placeholder: "Active" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "news") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="News Stories"
            items={draftContent.items || []}
            emptyText="No news stories configured."
            addLabel="Add News Story"
            createItem={() => ({
              id: createKey("news"),
              title: "New Story",
              image_url: "",
              image_alt: "",
              date: "",
              category: "School News",
              summary: "",
              body: "",
              link: "",
              button_label: "Read More",
            })}
            fields={[
              { key: "title", label: "Story Title", placeholder: "News title" },
              { key: "date", label: "Published Date", type: "date", placeholder: "Tue, Nov 25, 2025" },
              { key: "category", label: "Category", placeholder: "School News" },
              { key: "summary", label: "Card Summary", type: "textarea", rows: 2 },
              { key: "body", label: "Article Content", type: "textarea", rows: 4 },
              { key: "image_url", label: "Image URL", placeholder: "https://..." },
              { key: "image_alt", label: "Alternative Text", placeholder: "Describe the image" },
              { key: "link", label: "Optional Link", placeholder: "/news/article" },
              { key: "button_label", label: "Button Label", placeholder: "Read More" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "who_we_are") {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Introduction"
            type="textarea"
            rows={4}
            value={draftContent.body || draftContent.subtitle || ""}
            placeholder="Describe the school and its community."
            onChange={(value) => updateContent("body", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="School Name Override"
              value={draftContent.school_name || ""}
              placeholder="Leave empty to use saved school name"
              onChange={(value) => updateContent("school_name", value)}
            />
            <ContentField
              label="Profile Badge"
              value={draftContent.badge_label || ""}
              placeholder="Official School Profile"
              onChange={(value) => updateContent("badge_label", value)}
            />
          </div>

          <TextListField
            label="Profile Pills"
            items={draftContent.pills || []}
            onChange={(value) => updateContent("pills", value)}
            placeholder="One label per line"
            hint="Displayed under the Who We Are introduction."
          />

          <ItemCollection
            title="Profile Statistics"
            items={draftContent.stats || []}
            emptyText="No profile statistics configured."
            addLabel="Add Statistic"
            createItem={() => ({
              id: createKey("stat"),
              value: "0",
              label: "New Statistic",
            })}
            fields={[
              { key: "value", label: "Value", placeholder: "8–12" },
              { key: "label", label: "Label", placeholder: "Grades Offered" },
            ]}
            onChange={(items) => updateContent("stats", items)}
          />

          <ItemCollection
            title="Who We Are Cards"
            items={draftContent.cards || []}
            emptyText="No profile cards configured."
            addLabel="Add Profile Card"
            createItem={() => ({
              id: createKey("card"),
              title: "New Card",
              body: "",
              items: [],
            })}
            fields={[
              { key: "title", label: "Title", placeholder: "Our Community" },
              { key: "body", label: "Content", type: "textarea", rows: 4 },
              {
                key: "items",
                label: "Bullet Items",
                type: "list",
                rows: 4,
                placeholder: "One item per line",
              },
            ]}
            onChange={(items) => updateContent("cards", items)}
          />

          <ContentField
            label="Commitment Heading"
            value={draftContent.commitment_title || ""}
            placeholder="Our Commitment"
            onChange={(value) => updateContent("commitment_title", value)}
          />
          <ContentField
            label="Commitment Content"
            type="textarea"
            rows={4}
            value={draftContent.commitment_body || ""}
            onChange={(value) => updateContent("commitment_body", value)}
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
              {
                key: "values",
                label: "Values / Bullet Items",
                type: "list",
                rows: 4,
                placeholder: "One value per line",
              },
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

    if (
      sectionKind === "admissions" &&
      ("online_steps" in draftContent || "manual_steps" in draftContent)
    ) {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="Primary Badge"
              value={draftContent.primary_badge || ""}
              onChange={(value) => updateContent("primary_badge", value)}
            />
            <ContentField
              label="Secondary Badge"
              value={draftContent.secondary_badge || ""}
              onChange={(value) => updateContent("secondary_badge", value)}
            />
            <ContentField
              label="Apply Button"
              value={draftContent.apply_button_label || ""}
              onChange={(value) => updateContent("apply_button_label", value)}
            />
            <ContentField
              label="Download Button"
              value={draftContent.hero_download_label || ""}
              onChange={(value) => updateContent("hero_download_label", value)}
            />
            <ContentField
              label="Help Button"
              value={draftContent.help_button_label || ""}
              onChange={(value) => updateContent("help_button_label", value)}
            />
            <ContentField
              label="Manual Form PDF / Link"
              value={draftContent.form_url || ""}
              placeholder="Upload in Media or paste PDF/document link"
              onChange={(value) => updateContent("form_url", value)}
            />
          </div>

          <ContentField
            label="Online Application Heading"
            value={draftContent.online_title || ""}
            onChange={(value) => updateContent("online_title", value)}
          />
          <ContentField
            label="Online Application Description"
            type="textarea"
            rows={3}
            value={draftContent.online_description || ""}
            onChange={(value) => updateContent("online_description", value)}
          />
          <TextListField
            label="Online Application Steps"
            items={draftContent.online_steps || []}
            onChange={(value) => updateContent("online_steps", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Start Online Application Button"
              value={draftContent.online_start_label || ""}
              onChange={(value) => updateContent("online_start_label", value)}
            />
            <ContentField
              label="View Requirements Button"
              value={draftContent.requirements_button_label || ""}
              onChange={(value) =>
                updateContent("requirements_button_label", value)
              }
            />
          </div>

          <ContentField
            label="Manual Application Heading"
            value={draftContent.manual_title || ""}
            onChange={(value) => updateContent("manual_title", value)}
          />
          <ContentField
            label="Manual Application Description"
            type="textarea"
            rows={3}
            value={draftContent.manual_description || ""}
            onChange={(value) => updateContent("manual_description", value)}
          />
          <TextListField
            label="Manual Application Steps"
            items={draftContent.manual_steps || []}
            onChange={(value) => updateContent("manual_steps", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Download Manual Form Button"
              value={draftContent.manual_download_label || ""}
              onChange={(value) => updateContent("manual_download_label", value)}
            />
            <ContentField
              label="Contact the School Button"
              value={draftContent.contact_button_label || ""}
              onChange={(value) => updateContent("contact_button_label", value)}
            />
          </div>

          <ContentField
            label="Documents Heading"
            value={draftContent.documents_title || ""}
            onChange={(value) => updateContent("documents_title", value)}
          />
          <ContentField
            label="Documents Description"
            type="textarea"
            rows={3}
            value={draftContent.documents_description || ""}
            onChange={(value) => updateContent("documents_description", value)}
          />
          <TextListField
            label="Required Documents"
            items={draftContent.required_documents || []}
            onChange={(value) => updateContent("required_documents", value)}
          />
          <ContentField
            label="Footer Note"
            type="textarea"
            rows={2}
            value={draftContent.footer_note || ""}
            onChange={(value) => updateContent("footer_note", value)}
          />
        </>
      );
    }

    if (
      sectionKind === "admissions" &&
      "required_documents" in draftContent
    ) {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Introduction"
            type="textarea"
            rows={4}
            value={draftContent.introduction || ""}
            placeholder="Leave empty to keep the school-name based introduction."
            onChange={(value) => updateContent("introduction", value)}
          />

          <ContentField
            label="Documents Heading"
            value={draftContent.documents_title || ""}
            onChange={(value) => updateContent("documents_title", value)}
          />
          <ContentField
            label="Documents Description"
            type="textarea"
            rows={2}
            value={draftContent.documents_description || ""}
            onChange={(value) => updateContent("documents_description", value)}
          />
          <TextListField
            label="Required Documents"
            items={draftContent.required_documents || []}
            onChange={(value) => updateContent("required_documents", value)}
          />

          <ContentField
            label="Grade Admissions Heading"
            value={draftContent.grades_title || ""}
            onChange={(value) => updateContent("grades_title", value)}
          />
          <ContentField
            label="Grade Admissions Description"
            type="textarea"
            rows={3}
            value={draftContent.grades_description || ""}
            onChange={(value) => updateContent("grades_description", value)}
          />

          <ContentField
            label="Application Process Heading"
            value={draftContent.process_title || ""}
            onChange={(value) => updateContent("process_title", value)}
          />
          <TextListField
            label="Application Process"
            items={draftContent.application_process || []}
            onChange={(value) => updateContent("application_process", value)}
          />

          <ContentField
            label="Important Notes Heading"
            value={draftContent.notes_title || ""}
            onChange={(value) => updateContent("notes_title", value)}
          />
          <TextListField
            label="Important Notes"
            items={draftContent.important_notes || []}
            onChange={(value) => updateContent("important_notes", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Apply Online Button"
              value={draftContent.apply_button_label || ""}
              onChange={(value) => updateContent("apply_button_label", value)}
            />
            <ContentField
              label="Manual Application PDF Button"
              value={draftContent.download_button_label || ""}
              onChange={(value) =>
                updateContent("download_button_label", value)
              }
            />
            <ContentField
              label="View Form Button"
              value={draftContent.view_button_label || ""}
              onChange={(value) => updateContent("view_button_label", value)}
            />
            <ContentField
              label="Application Form PDF / Link"
              value={draftContent.form_url || ""}
              placeholder="Upload in Media or paste PDF/document link"
              onChange={(value) => updateContent("form_url", value)}
            />
          </div>

          <ContentField
            label="Footer Note"
            type="textarea"
            rows={2}
            value={draftContent.footer_note || ""}
            onChange={(value) => updateContent("footer_note", value)}
          />
        </>
      );
    }

    if (
      sectionKind === "admissions" &&
      ("form_title" in draftContent || "manual_form_label" in draftContent)
    ) {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Form Heading"
            value={draftContent.form_title || ""}
            onChange={(value) => updateContent("form_title", value)}
          />
          <ContentField
            label="Form Introduction"
            type="textarea"
            rows={3}
            value={draftContent.form_subtitle || ""}
            onChange={(value) => updateContent("form_subtitle", value)}
          />
          <ContentField
            label="Required Fields Text"
            value={draftContent.required_fields_label || ""}
            onChange={(value) => updateContent("required_fields_label", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="Manual Form Label"
              value={draftContent.manual_form_label || ""}
              onChange={(value) => updateContent("manual_form_label", value)}
            />
            <ContentField
              label="Manual Form PDF / Link"
              value={draftContent.manual_form_url || ""}
              placeholder="Upload in Media or paste PDF/document link"
              onChange={(value) => updateContent("manual_form_url", value)}
            />
            <ContentField
              label="Help Label"
              value={draftContent.help_label || ""}
              onChange={(value) => updateContent("help_label", value)}
            />
            <ContentField
              label="Help Link"
              value={draftContent.help_href || ""}
              onChange={(value) => updateContent("help_href", value)}
            />
            <ContentField
              label="Progress Heading"
              value={draftContent.progress_title || ""}
              onChange={(value) => updateContent("progress_title", value)}
            />
            <ContentField
              label="Upload Tip Heading"
              value={draftContent.uploads_tip_title || ""}
              onChange={(value) => updateContent("uploads_tip_title", value)}
            />
          </div>

          <ContentField
            label="Upload Tip Content"
            type="textarea"
            rows={3}
            value={draftContent.uploads_tip_text || ""}
            onChange={(value) => updateContent("uploads_tip_text", value)}
          />
          <ContentField
            label="Submission Note"
            type="textarea"
            rows={3}
            value={draftContent.submit_note || ""}
            onChange={(value) => updateContent("submit_note", value)}
          />
          <ContentField
            label="Help Text"
            type="textarea"
            rows={3}
            value={draftContent.help_text || ""}
            onChange={(value) => updateContent("help_text", value)}
          />
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
            title="Admission Process"
            items={draftContent.process || []}
            emptyText="No process steps added."
            addLabel="Add Process Step"
            createItem={() => ({
              id: createKey("admission-step"),
              title: "New Step",
              body: "",
            })}
            fields={[
              { key: "title", label: "Step Title", placeholder: "Apply" },
              { key: "body", label: "Description", type: "textarea", rows: 2 },
            ]}
            onChange={(items) => updateContent("process", items)}
          />

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
            <ContentField
              label="Search Placeholder"
              value={draftContent.search_placeholder || ""}
              onChange={(value) => updateContent("search_placeholder", value)}
            />
            <ContentField
              label="Empty Results Message"
              value={draftContent.empty_message || ""}
              onChange={(value) => updateContent("empty_message", value)}
            />
          </div>

          <ContentField
            label="Footer Note"
            type="textarea"
            rows={2}
            value={draftContent.footer_note || ""}
            onChange={(value) => updateContent("footer_note", value)}
          />

          <ItemCollection
            title="Upcoming Events"
            items={draftContent.items || []}
            emptyText="No events configured."
            addLabel="Add Event"
            createItem={() => ({
              id: createKey("event"),
              title: "New Event",
              startAt: "",
              endAt: "",
              location: "",
              category: "Event",
            })}
            fields={[
              { key: "title", label: "Event", placeholder: "New Event" },
              { key: "startAt", label: "Start Date & Time", type: "datetime-local" },
              { key: "endAt", label: "End Date & Time", type: "datetime-local" },
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
              gallery: [],
              link: "",
            })}
            fields={[
              { key: "title", label: "Title", placeholder: "Award or certification" },
              { key: "description", label: "Description", type: "textarea", rows: 2 },
              { key: "year", label: "Year", placeholder: "2026" },
              { key: "image_url", label: "Cover Image URL", placeholder: "https://..." },
              {
                key: "gallery",
                label: "Preview Image URLs",
                type: "list",
                rows: 3,
                placeholder: "One image URL per line",
              },
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
              title: "New Image",
              image_url: "",
              image_alt: "",
              caption: "",
              link: "",
            })}
            fields={[
              { key: "title", label: "Title", placeholder: "ACADEMICS" },
              { key: "image_url", label: "Image URL", placeholder: "https://..." },
              { key: "image_alt", label: "Alternative Text", placeholder: "Describe the image" },
              { key: "caption", label: "Caption", placeholder: "Optional caption" },
              { key: "link", label: "Link", placeholder: "/activities/academics" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (sectionKind === "policy") {
      return (
        <>
          <ContentField
            label="Section Title"
            value={draftContent.section_title || ""}
            onChange={(value) => updateContent("section_title", value)}
          />
          <ContentField
            label="Introduction"
            type="textarea"
            rows={4}
            value={draftContent.introduction || ""}
            onChange={(value) => updateContent("introduction", value)}
          />

          <ItemCollection
            title="Policy Rules"
            items={draftContent.rules || []}
            emptyText="No policy rules configured."
            addLabel="Add Rule"
            createItem={() => ({
              id: createKey("rule"),
              title: "New Rule",
              body: "",
            })}
            fields={[
              { key: "title", label: "Heading", placeholder: "Rule heading" },
              { key: "body", label: "Content", type: "textarea", rows: 4 },
            ]}
            onChange={(rules) => updateContent("rules", rules)}
          />

          <ContentField
            label="Closing Text"
            type="textarea"
            rows={3}
            value={draftContent.closing_text || ""}
            onChange={(value) => updateContent("closing_text", value)}
          />

          <div className="bse-two-column">
            <ContentField
              label="PDF URL"
              value={draftContent.pdf_url || ""}
              onChange={(value) => updateContent("pdf_url", value)}
            />
            <ContentField
              label="View Button Label"
              value={draftContent.view_button_label || ""}
              onChange={(value) => updateContent("view_button_label", value)}
            />
            <ContentField
              label="Download Button Label"
              value={draftContent.download_button_label || ""}
              onChange={(value) => updateContent("download_button_label", value)}
            />
          </div>
        </>
      );
    }

    if (sectionKind === "links") {
      return (
        <>
          {contentHeaderFields}

          <ItemCollection
            title="Quick Links"
            items={draftContent.items || []}
            emptyText="No links configured."
            addLabel="Add Link"
            createItem={() => ({
              id: createKey("link"),
              label: "New Link",
              href: "/",
              description: "",
            })}
            fields={[
              { key: "label", label: "Label", placeholder: "Link label" },
              { key: "href", label: "Destination", placeholder: "/resources" },
              { key: "description", label: "Description", type: "textarea", rows: 2 },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (
      sectionKind === "services" &&
      ("learning_items" in draftContent || "projects_title" in draftContent)
    ) {
      return (
        <>
          {contentHeaderFields}

          <ContentField
            label="Learning Card Heading"
            value={draftContent.learning_title || ""}
            onChange={(value) => updateContent("learning_title", value)}
          />
          <TextListField
            label="What Learners Learn"
            items={draftContent.learning_items || []}
            onChange={(value) => updateContent("learning_items", value)}
          />

          <ContentField
            label="Projects Heading"
            value={draftContent.projects_title || ""}
            onChange={(value) => updateContent("projects_title", value)}
          />
          <ContentField
            label="Projects Content"
            type="textarea"
            rows={3}
            value={draftContent.projects_body || ""}
            onChange={(value) => updateContent("projects_body", value)}
          />

          <ContentField
            label="Competitions Heading"
            value={draftContent.competitions_title || ""}
            onChange={(value) => updateContent("competitions_title", value)}
          />
          <ContentField
            label="Competitions Content"
            type="textarea"
            rows={3}
            value={draftContent.competitions_body || ""}
            onChange={(value) => updateContent("competitions_body", value)}
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

    if (
      sectionKind === "services" &&
      ("subject_groups" in draftContent || "portal_title" in draftContent)
    ) {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="Search Placeholder"
              value={draftContent.search_placeholder || ""}
              onChange={(value) => updateContent("search_placeholder", value)}
            />
            <ContentField
              label="Clear Filters Label"
              value={draftContent.clear_button_label || ""}
              onChange={(value) => updateContent("clear_button_label", value)}
            />
          </div>

          <ContentField
            label="NSC Portal Heading"
            value={draftContent.portal_title || ""}
            onChange={(value) => updateContent("portal_title", value)}
          />
          <ContentField
            label="NSC Portal Description"
            type="textarea"
            rows={3}
            value={draftContent.portal_body || ""}
            onChange={(value) => updateContent("portal_body", value)}
          />

          <ItemCollection
            title="Library Documents"
            items={draftContent.items || []}
            emptyText="No documents uploaded."
            addLabel="Add Library Document"
            createItem={() => ({
              id: createKey("resource"),
              title: "New Resource",
              grade: "12",
              term: "",
              subject: "",
              type: "Notes",
              year: String(new Date().getFullYear()),
              province: "National",
              pdf: "",
            })}
            fields={[
              { key: "title", label: "Document Title", placeholder: "Learning resource" },
              { key: "grade", label: "Grade", placeholder: "12" },
              { key: "term", label: "Term", placeholder: "Term 1" },
              { key: "subject", label: "Subject", placeholder: "Mathematics" },
              { key: "type", label: "Document Type", placeholder: "Exam / Memo / Notes" },
              { key: "year", label: "Year", placeholder: "2026" },
              { key: "province", label: "Province", placeholder: "National" },
              { key: "pdf", label: "PDF URL", placeholder: "/pdfs/resource.pdf" },
            ]}
            onChange={(items) => updateContent("items", items)}
          />
        </>
      );
    }

    if (
      sectionKind === "services" &&
      Array.isArray(draftContent.items) &&
      draftContent.items.some((item) => "grade" in item && "subject" in item && "items" in item)
    ) {
      return (
        <>
          {contentHeaderFields}

          <div className="bse-two-column">
            <ContentField
              label="PDF URL"
              value={draftContent.pdf_url || ""}
              onChange={(value) => updateContent("pdf_url", value)}
            />
            <ContentField
              label="Download Button Label"
              value={draftContent.download_button_label || ""}
              onChange={(value) => updateContent("download_button_label", value)}
            />
          </div>

          <ItemCollection
            title="Stationery Rows"
            items={draftContent.items || []}
            emptyText="No stationery requirements configured."
            addLabel="Add Requirement"
            createItem={() => ({
              id: createKey("stationery"),
              grade: "Grade 8",
              subject: "All Subjects",
              items: "",
            })}
            fields={[
              { key: "grade", label: "Grade", placeholder: "Grade 8" },
              { key: "subject", label: "Subject", placeholder: "All Subjects" },
              { key: "items", label: "Required Stationery", type: "textarea", rows: 3 },
            ]}
            onChange={(items) => updateContent("items", items)}
          />

          <ContentField
            label="Footer Note"
            type="textarea"
            rows={2}
            value={draftContent.footer_note || ""}
            onChange={(value) => updateContent("footer_note", value)}
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
    const targets = [];

    const addTarget = (path, label, kind = "image") => {
      if (!path || targets.some((target) => target.path === path)) return;

      targets.push({
        path,
        label: label || "Section Media",
        kind,
      });
    };

    const addItemImageTargets = (items = [], pathKey = "image_url", fallbackLabel = "Item Image") => {
      (Array.isArray(items) ? items : []).forEach((item, index) => {
        addTarget(
          `items.${index}.${pathKey}`,
          item?.title || item?.name || `${fallbackLabel} ${index + 1}`,
          "image",
        );
      });
    };

    if (sectionKind === "who_we_are") {
      addTarget("left_image_url", "Who We Are Left Image", "image");
      addTarget("right_image_url", "Who We Are Feature Image", "image");
    }

    if (sectionKind === "principal") {
      addTarget("image_url", "Principal Photo", "image");
    }

    if (sectionKind === "leadership") {
      addTarget("image_url", "Leadership Photo", "image");
    }

    if (sectionKind === "admissions") {
      if (
        "hero_image" in draftContent ||
        !("manual_form_url" in draftContent) &&
          !("form_url" in draftContent) &&
          !("pdf_url" in draftContent)
      ) {
        addTarget("hero_image", "Admissions Image", "image");
      }

      if ("manual_form_url" in draftContent) {
        addTarget("manual_form_url", "Manual Application PDF", "document");
      }

      if ("form_url" in draftContent) {
        addTarget("form_url", "Application Form PDF", "document");
      }

      if ("pdf_url" in draftContent) {
        addTarget("pdf_url", "Admissions PDF Document", "document");
      }

      if (
        "secondary_button_href" in draftContent &&
        /download|form|pdf/i.test(
          `${draftContent.secondary_button_label || ""} ${draftContent.secondary_button_href || ""}`,
        )
      ) {
        addTarget("secondary_button_href", "Download Button PDF / Link", "document");
      }
    }

    if (sectionKind === "calendar") {
      addTarget("pdf_url", "Calendar PDF Document", "document");
    }

    if (sectionKind === "policy") {
      addTarget("pdf_url", "Policy PDF Document", "document");
    }

    if (sectionKind === "cta") {
      addTarget("background_image", "Call-to-Action Background", "image");
    }

    if (sectionKind === "news") {
      addItemImageTargets(draftContent.items, "image_url", "News Image");
    }

    if (sectionKind === "gallery") {
      addItemImageTargets(draftContent.items, "image_url", "Gallery Image");
    }

    if (
      sectionKind === "services" &&
      ("subject_groups" in draftContent || "portal_title" in draftContent)
    ) {
      (draftContent.items || []).forEach((item, index) => {
        addTarget(
          `items.${index}.pdf`,
          item?.title || `Library Document ${index + 1}`,
          "document",
        );
      });
    }

    if (sectionKind === "recognition") {
      addItemImageTargets(draftContent.items, "image_url", "Recognition Image");

      (draftContent.items || []).forEach((item, itemIndex) => {
        (Array.isArray(item?.gallery) ? item.gallery : []).forEach(
          (_, galleryIndex) => {
            addTarget(
              `items.${itemIndex}.gallery.${galleryIndex}`,
              `${item?.title || "Recognition"} Preview Image ${galleryIndex + 1}`,
              "image",
            );
          },
        );
      });
    }

    if (["projects", "products", "services", "team", "testimonials"].includes(sectionKind)) {
      addItemImageTargets(draftContent.items, "image_url", "Item Image");
    }

    if (sectionKind === "partners") {
      (draftContent.items || []).forEach((item, index) => {
        addTarget(
          `items.${index}.logo`,
          item?.name || `Organisation Logo ${index + 1}`,
          "image",
        );
      });
    }

    /*
      Discover compatible saved fields on other current or future pages.
      This keeps page buttons/documents and image fields usable without
      requiring a new hard-coded editor branch for every template page.
    */
    const visitContent = (value, path = "") => {
      if (Array.isArray(value)) {
        value.forEach((entry, index) => visitContent(entry, `${path}.${index}`));
        return;
      }

      if (!isObject(value)) return;

      Object.entries(value).forEach(([key, nestedValue]) => {
        if (SYSTEM_DYNAMIC_CONTENT_KEYS.has(key)) return;

        const nextPath = path ? `${path}.${key}` : key;
        const normalizedKey = normalizeType(key);

        if (
          typeof nestedValue === "string" &&
          [
            "image",
            "image_url",
            "logo",
            "logo_url",
            "photo",
            "photo_url",
            "cover",
            "cover_image",
            "thumbnail",
            "thumbnail_url",
            "hero_image",
            "background_image",
            "left_image_url",
            "right_image_url",
            "principal_image",
          ].includes(normalizedKey)
        ) {
          addTarget(
            nextPath,
            normalizedKey.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
            "image",
          );
        }

        if (
          typeof nestedValue === "string" &&
          [
            "pdf",
            "pdf_url",
            "document",
            "document_url",
            "file_url",
            "manual_form_url",
            "application_form_url",
            "admissions_form_url",
            "download_pdf_url",
            "download_document_url",
          ].includes(normalizedKey)
        ) {
          addTarget(
            nextPath,
            normalizedKey.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
            "document",
          );
        }

        if (Array.isArray(nestedValue) || isObject(nestedValue)) {
          visitContent(nestedValue, nextPath);
        }
      });
    };

    visitContent(draftContent);

    if (!targets.length) {
      addTarget("image_url", "Section Image", "image");
    }

    return targets;
  }, [sectionKind, draftContent]);

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
                    ? "Paste PDF or document URL"
                    : target.kind === "video"
                      ? "Paste video URL"
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
                {uploading && selected
                  ? "Uploading..."
                  : `Upload ${target.kind === "document" ? "PDF / Document" : target.kind === "video" ? "Video" : "Image"}`}
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

      <div className="bse-readonly-card">
        <span>Current Page</span>
        <strong>{pageTitle}</strong>
        <span>Current Section</span>
        <strong>{sectionName}</strong>
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

      <div className="bse-divider" />

      <div className="bse-panel-intro">
        <h3>Colour & Typography</h3>
        <p>
          Section-level brand controls for this exact page block. Leave values
          on template default when you want the original design to stay unchanged.
        </p>
      </div>

      <div className="bse-two-column">
        <ContentField
          label="Background Colour"
          type="color"
          value={draftStyle.backgroundColor || "#ffffff"}
          onChange={(value) => updateStyle("backgroundColor", value)}
        />
        <ContentField
          label="Text Colour"
          type="color"
          value={draftStyle.textColor || "#111827"}
          onChange={(value) => updateStyle("textColor", value)}
        />
        <ContentField
          label="Heading Colour"
          type="color"
          value={draftStyle.headingColor || "#0f172a"}
          onChange={(value) => updateStyle("headingColor", value)}
        />
        <ContentField
          label="Accent Colour"
          type="color"
          value={draftStyle.accentColor || "#2563eb"}
          onChange={(value) => updateStyle("accentColor", value)}
        />
        <ContentField
          label="Link Colour"
          type="color"
          value={draftStyle.linkColor || draftStyle.accentColor || "#2563eb"}
          onChange={(value) => updateStyle("linkColor", value)}
        />
      </div>

      <div className="bse-two-column">
        <label className="bse-field">
          <span className="bse-field-label">Body Typography</span>
          <select
            className="bse-select"
            value={draftStyle.typography || "inherit"}
            onChange={(event) => updateStyle("typography", event.target.value)}
          >
            {TYPOGRAPHY_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="bse-field">
          <span className="bse-field-label">Heading Typography</span>
          <select
            className="bse-select"
            value={draftStyle.headingTypography || "inherit"}
            onChange={(event) => updateStyle("headingTypography", event.target.value)}
          >
            {TYPOGRAPHY_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="bse-field">
          <span className="bse-field-label">Body Font Size</span>
          <select
            className="bse-select"
            value={String(draftStyle.fontSize || "")}
            onChange={(event) => updateStyle("fontSize", event.target.value)}
          >
            {SECTION_FONT_SIZE_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="bse-field">
          <span className="bse-field-label">Heading Font Size</span>
          <select
            className="bse-select"
            value={String(draftStyle.headingFontSize || "")}
            onChange={(event) => updateStyle("headingFontSize", event.target.value)}
          >
            {SECTION_HEADING_SIZE_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="bse-field">
          <span className="bse-field-label">Body Font Weight</span>
          <select
            className="bse-select"
            value={String(draftStyle.fontWeight || "")}
            onChange={(event) => updateStyle("fontWeight", event.target.value)}
          >
            {SECTION_FONT_WEIGHT_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="bse-field">
          <span className="bse-field-label">Heading Font Weight</span>
          <select
            className="bse-select"
            value={String(draftStyle.headingFontWeight || "")}
            onChange={(event) => updateStyle("headingFontWeight", event.target.value)}
          >
            {SECTION_FONT_WEIGHT_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="bse-field">
          <span className="bse-field-label">Type Scale</span>
          <select
            className="bse-select"
            value={draftStyle.typeScale || "default"}
            onChange={(event) => updateStyle("typeScale", event.target.value)}
          >
            {TYPE_SCALE_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="bse-field">
          <span className="bse-field-label">Link / Button Style</span>
          <select
            className="bse-select"
            value={draftStyle.linkStyle || "template"}
            onChange={(event) => updateStyle("linkStyle", event.target.value)}
          >
            {LINK_STYLE_OPTIONS.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
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
