import schoolEditorRegistry from "./categories/school/schoolEditorRegistry";
import businessEditorRegistry from "./categories/business/businessEditorRegistry";
import portfolioEditorRegistry from "./categories/portfolio/portfolioEditorRegistry";
import agricultureEditorRegistry from "./categories/agriculture/agricultureEditorRegistry";
import technologyEditorRegistry from "./categories/technology/technologyEditorRegistry";
import constructionEditorRegistry from "./categories/construction/constructionEditorRegistry";

import GalleryEditor from "./shared/editors/GalleryEditor";
import PartnersEditor from "./shared/editors/PartnersEditor";
import NewsEditor from "./shared/editors/NewsEditor";
import ContactEditor from "./shared/editors/ContactEditor";
import StatsEditor from "./shared/editors/StatsEditor";
import CtaEditor from "./shared/editors/CtaEditor";

function normalizeKey(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[\s/-]+/g, "_");
}

function normalizeSlug(value = "") {
  const clean = String(value || "/").trim().toLowerCase();
  if (!clean || clean === "_") return "/";
  return `/${clean.replace(/^\/+|\/+$/g, "")}`;
}

function isObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function hasAnyKey(content = {}, keys = []) {
  if (!isObject(content)) return false;
  return keys.some((key) => Object.prototype.hasOwnProperty.call(content, key));
}

function exactSchoolSectionTypeFromSlug(slug = "") {
  const cleanSlug = normalizeSlug(slug);

  const map = {
    "/about": "school_about_landing",
    "/facilities": "school_facilities",
    "/attendance": "school_attendance_policy",
    "/activities": "school_activities",
    "/activities/academics": "school_academics",
    "/activities/sports": "school_sports",
    "/activities/culture": "school_culture",
    "/activities/facilities": "school_activity_facilities",
    "/resources": "school_resources",
    "/resources/subject-choices": "school_subject_choices",
    "/resources/term-plan": "school_term_plan",
    "/resources/exam-schedule": "school_exam_schedule",
    "/resources/code-of-conduct": "school_code_of_conduct",
    "/resources/stationary-list": "school_stationary_list",
    "/robotics": "school_robotics",
    "/admissions": "school_admissions_landing",
    "/admissions/apply": "school_apply_online",
    "/admissions/howtoapply": "school_how_to_apply",
    "/admissions/how-to-apply": "school_how_to_apply",
    "/admissions/requirements": "school_entry_requirements",
    "/about/who-we-are": "school_who_we_are",
    "/about/vision-mission": "school_vision_mission",
    "/about/history": "school_history",
    "/staff": "school_staff",
    "/sgb": "school_sgb",
    "/governance/sgb": "school_sgb",
    "/digital-library": "school_digital_library",
    "/resources/digital-library": "school_digital_library",
    "/schoolcalendar": "school_calendar",
    "/school-calendar": "school_calendar",
    "/resources/calendar": "school_calendar",
    "/notices": "school_notices",
    "/bulletin": "school_daily_bulletin",
    "/student-daily-bulletin": "school_daily_bulletin",
    "/gallery": "school_gallery",
    "/contact": "school_contact",
    "/news": "school_news",
    "/events": "school_all_events",
    "/all-events": "school_all_events",
    "/calendar/events": "school_all_events",
    "/wall-of-fame": "school_wall_of_fame",
    "/sponsors": "school_sponsors",
  };

  return map[cleanSlug] || "";
}

function exactSchoolSectionTypeFromContent(content = {}) {
  if (!isObject(content)) return "";

  if (
    hasAnyKey(content, [
      "manual_form_label",
      "manual_form_url",
      "form_title",
      "form_subtitle",
      "required_fields_label",
      "upload_title",
    ])
  ) {
    return "school_apply_online";
  }

  if (
    hasAnyKey(content, [
      "online_steps",
      "manual_steps",
      "hero_download_label",
      "apply_button_label",
      "help_button_label",
    ])
  ) {
    return "school_how_to_apply";
  }

  if (
    hasAnyKey(content, [
      "required_documents",
      "documents_title",
      "grades_title",
      "grades_description",
      "process_title",
      "closing_date",
    ])
  ) {
    return "school_entry_requirements";
  }

  if (
    hasAnyKey(content, [
      "commitment_title",
      "commitment_body",
      "badge_label",
      "pills",
      "left_image_url",
      "right_image_url",
    ])
  ) {
    return "school_who_we_are";
  }

  if (
    hasAnyKey(content, [
      "vision_title",
      "vision_body",
      "mission_title",
      "mission_body",
      "values_title",
      "values",
    ])
  ) {
    return "school_vision_mission";
  }

  if (hasAnyKey(content, ["staff_members", "staff", "departments"])) {
    return "school_staff";
  }

  if (hasAnyKey(content, ["sgb_members", "committee_members", "governance_members"])) {
    return "school_sgb";
  }

  if (hasAnyKey(content, ["resources", "documents", "library_items", "ebooks"])) {
    return "school_digital_library";
  }

  if (hasAnyKey(content, ["calendar_items", "events", "term_dates", "pdf_url"])) {
    return "school_calendar";
  }

  return "";
}

export function resolveRegistrySectionType(section = {}, page = {}) {
  const content = isObject(section?.content) ? section.content : {};

  const explicit =
    section?.section_key ||
    section?.key ||
    content.__section_key ||
    content.section_key ||
    content.editor_section_type ||
    section?.section_type ||
    section?.type ||
    "";

  const exactExplicit = normalizeKey(explicit);

  if (exactExplicit.startsWith("school_")) return exactExplicit;

  const contentType = exactSchoolSectionTypeFromContent(content);
  if (contentType) return contentType;

  const slugType = exactSchoolSectionTypeFromSlug(page?.slug || "");
  if (slugType) return slugType;

  return exactExplicit;
}

export const sharedEditorRegistry = {
  gallery: GalleryEditor,
  gallery_preview: GalleryEditor,
  school_gallery: GalleryEditor,
  partners: PartnersEditor,
  sponsors: PartnersEditor,
  school_sponsors: PartnersEditor,
  latest_news: NewsEditor,
  news: NewsEditor,
  school_news: NewsEditor,
  contact: ContactEditor,
  school_contact: ContactEditor,
  stats: StatsEditor,
  statistics: StatsEditor,
  cta: CtaEditor,
  call_to_action: CtaEditor,
};

export const categoryEditorRegistry = {
  school: schoolEditorRegistry,
  business: businessEditorRegistry,
  portfolio: portfolioEditorRegistry,
  agriculture: agricultureEditorRegistry,
  technology: technologyEditorRegistry,
  construction: constructionEditorRegistry,
};

export function getEditorComponent({
  templateCategory = "",
  sectionType = "",
  pageSlug = "",
  content = {},
} = {}) {
  const categoryKey = normalizeKey(templateCategory || "school");
  const sectionKey = normalizeKey(
    sectionType ||
      resolveRegistrySectionType({
        type: sectionType,
        content,
      }, { slug: pageSlug }),
  );

  return (
    categoryEditorRegistry[categoryKey]?.[sectionKey] ||
    sharedEditorRegistry[sectionKey] ||
    null
  );
}

export default {
  shared: sharedEditorRegistry,
  categories: categoryEditorRegistry,
  getEditorComponent,
  resolveRegistrySectionType,
};
