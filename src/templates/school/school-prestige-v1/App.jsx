import React, { useEffect, useState } from "react";

import Topbar from "./components/layout/Topbar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ScrollTopButton from "./components/common/ScrollTopButton";
import SiteAnnouncementPopup from "./components/common/SiteAnnouncementPopup";
import BuilderSectionTarget from "../../../builder/BuilderSectionTarget";
import { templateConfig } from "./template.config";

import SGB from "./components/governance/SGB";
import AboutLanding from "./pages/About";
import AdmissionsLanding from "./pages/Admissions";
import SchoolLifeLanding from "./pages/SchoolLife";
import ResourcesLanding from "./pages/ResourcesLanding";
import DigitalLibrary from "./pages/DigitalLibrary";
import News from "./pages/News";
import Notices from "./pages/Notices";
import Gallery from "./pages/Gallery";
import Staff from "./pages/Staff";
import Facilities from "./pages/Facilities";
import RoboticsClub from "./pages/RoboticsClub";
import Contact from "./pages/Contact";
import AttendancePolicy from "./pages/AttendancePolicy";

import WhoWeAre from "./pages/about/WhoWeAre";
import VisionMission from "./pages/about/VisionMission";
import History from "./pages/about/History";

import LifeAcademics from "./pages/activities/Academics";
import LifeSports from "./pages/activities/Sports";
import LifeCulture from "./pages/activities/Culture";
import LifeFacilities from "./pages/activities/Facilities";

import SubjectChoices from "./pages/resources/SubjectChoices";
import TermPlan from "./pages/resources/TermPlan";
import ExamSchedule from "./pages/resources/ExamSchedule";
import CodeOfConduct from "./pages/resources/CodeOfConduct";
import StationaryList from "./pages/resources/StationaryList";
import SchoolCalendar from "./pages/SchoolCalendar";
import AllEvents from "./pages/AllEvents";

import Apply from "./pages/admissions/Apply";
import Requirements from "./pages/admissions/Requirements";
import HowToApply from "./pages/admissions/HowToApply";

import Home from "./pages/Home";
import WallOfFame from "./components/home/WallOfFame";
import Sponsors from "./components/home/Sponsors";
import Breadcrumbs from "./components/common/Breadcrumbs";

import "./index.css";
import "./App.css";
import "./styles/announcements.css";
import "./styles/template-theme-bridge.css";
import StudentDailyBulletin from "./pages/StudentDailyBulletin";

const PAGE_COMPONENTS = {
  "/": Home,

  /*
    Home-area records remain previewable from the builder Pages panel while
    their actual content sections are rendered by Home.jsx.
  */
  "/home/hero": Home,
  "/home/about-section": Home,
  "/home/gallery-preview": Home,
  "/home/principal-message": Home,
  "/home/quick-links": Home,
  "/home/latest-news": Home,
  "/home/events": Home,
  "/home/school-stats": Home,

  "/about": AboutLanding,
  "/about/who-we-are": WhoWeAre,
  "/about/vision-mission": VisionMission,
  "/about/history": History,

  "/staff": Staff,
  "/sgb": SGB,
  "/facilities": Facilities,
  "/attendance": AttendancePolicy,

  "/activities": SchoolLifeLanding,
  "/activities/academics": LifeAcademics,
  "/activities/sports": LifeSports,
  "/activities/culture": LifeCulture,
  "/activities/facilities": LifeFacilities,

  "/resources": ResourcesLanding,
  "/resources/subject-choices": SubjectChoices,
  "/resources/term-plan": TermPlan,
  "/resources/exam-schedule": ExamSchedule,
  "/resources/code-of-conduct": CodeOfConduct,
  "/resources/stationary-list": StationaryList,
  "/resources/calendar": SchoolCalendar,

  "/admissions": AdmissionsLanding,
  "/admissions/apply": Apply,
  "/admissions/requirements": Requirements,
  "/admissions/howtoapply": HowToApply,

  "/news": News,
  "/notices": Notices,
  "/gallery": Gallery,
  "/robotics": RoboticsClub,
  "/wall-of-fame": WallOfFame,
  "/sponsors": Sponsors,
  "/contact": Contact,
  "/digital-library": DigitalLibrary,
  "/bulletin": StudentDailyBulletin,
  "/schoolcalendar": SchoolCalendar,
  "/calendar/events": AllEvents,
};


const PAGE_SECTION_MATCHERS = {
  "/about": {
    sections: [
      {
        key: "about-introduction",
        type: "school_about_landing",
        title: "About Page Links",
        legacyTypes: ["about_section"],
        titleHints: ["about page links", "about", "who we are"],
      },
      {
        key: "about-values",
        type: "school_about_values",
        title: "Vision, Mission & Values",
        legacyTypes: ["about_section"],
        titleHints: ["vision", "mission", "values"],
      },
    ],
  },
  "/about/who-we-are": {
    sections: [
      {
        key: "who-we-are-introduction",
        type: "school_who_we_are",
        title: "Who We Are",
        legacyTypes: ["about_section"],
        titleHints: ["who we are", "our school", "identity"],
      },
    ],
  },
  "/about/vision-mission": {
    sections: [
      {
        key: "vision-mission-content",
        type: "school_vision_mission",
        title: "Vision & Mission",
        legacyTypes: ["about_section"],
        titleHints: ["vision", "mission", "values"],
      },
    ],
  },
  "/about/history": {
    sections: [
      {
        key: "school-history",
        type: "school_history",
        title: "Our History",
        legacyTypes: ["process", "timeline"],
        titleHints: ["history", "heritage", "journey"],
      },
    ],
  },
  "/staff": {
    sections: [
      {
        key: "staff-team",
        type: "school_staff",
        title: "Staff Members",
        legacyTypes: ["staff", "staff_team", "team"],
        titleHints: ["staff", "educators", "team"],
      },
      {
        key: "staff-sgb-team",
        type: "school_sgb",
        title: "School Governing Body",
        legacyTypes: ["sgb", "governance", "team", "school_governance"],
        titleHints: ["school governing body", "sgb", "governance"],
      },
    ],
  },
  "/sgb": {
    sections: [
      {
        key: "sgb-team",
        type: "school_sgb",
        title: "School Governing Body",
        legacyTypes: ["team", "sgb", "governance", "school_governance"],
        titleHints: ["school governing body", "sgb", "governance"],
      },
    ],
  },
  "/facilities": {
    sections: [
      {
        key: "facilities-overview",
        type: "school_facilities",
        title: "School Facilities",
        legacyTypes: ["services"],
        titleHints: ["facilities", "campus", "infrastructure"],
      },
    ],
  },
  "/attendance": {
    sections: [
      {
        key: "attendance-policy",
        type: "school_attendance_policy",
        title: "Attendance Policy",
        legacyTypes: ["policy"],
        titleHints: ["attendance", "punctuality"],
      },
    ],
  },
  "/activities": {
    sections: [
      {
        key: "activities-overview",
        type: "school_activities",
        title: "School Life & Activities",
        legacyTypes: ["services"],
        titleHints: ["activities", "school life", "clubs"],
      },
    ],
  },
  "/activities/academics": {
    sections: [
      {
        key: "academics-programmes",
        type: "school_academics",
        title: "Academic Programme",
        legacyTypes: ["services"],
        titleHints: ["academic programme", "academics", "curriculum"],
      },
    ],
  },
  "/activities/sports": {
    sections: [
      {
        key: "sports-programmes",
        type: "school_sports",
        title: "Sports & Recreation",
        legacyTypes: ["services"],
        titleHints: ["sports", "recreation", "athletics"],
      },
    ],
  },
  "/activities/culture": {
    sections: [
      {
        key: "culture-programmes",
        type: "school_culture",
        title: "Culture & Activities",
        legacyTypes: ["services"],
        titleHints: ["culture", "creative arts", "choir", "debate"],
      },
    ],
  },
  "/activities/facilities": {
    sections: [
      {
        key: "activity-facilities-gallery",
        type: "school_activity_facilities",
        title: "Campus Facilities",
        legacyTypes: ["gallery", "facilities"],
        titleHints: ["campus facilities", "facilities gallery"],
      },
    ],
  },
  "/resources": {
    sections: [
      {
        key: "resources-library",
        type: "school_resources",
        title: "Resources",
        legacyTypes: ["services", "resources"],
        titleHints: ["resources", "resource library"],
      },
    ],
  },
  "/resources/subject-choices": {
    sections: [
      {
        key: "subject-choices-content",
        type: "school_subject_choices",
        title: "Subject Choices",
        legacyTypes: ["process", "services"],
        titleHints: ["subject choices", "subject selection"],
      },
    ],
  },
  "/resources/term-plan": {
    sections: [
      {
        key: "term-plan-content",
        type: "school_term_plan",
        title: "Academic Term Plan",
        legacyTypes: ["calendar", "services"],
        titleHints: ["academic term plan", "term plan"],
      },
    ],
  },
  "/resources/exam-schedule": {
    sections: [
      {
        key: "exam-schedule-content",
        type: "school_exam_schedule",
        title: "Exam Schedule",
        legacyTypes: ["calendar", "services"],
        titleHints: ["exam schedule", "examination"],
      },
    ],
  },
  "/resources/code-of-conduct": {
    sections: [
      {
        key: "conduct-policy",
        type: "school_code_of_conduct",
        title: "Learner Code of Conduct",
        legacyTypes: ["policy"],
        titleHints: ["code of conduct", "learner code"],
      },
    ],
  },
  "/resources/stationary-list": {
    sections: [
      {
        key: "stationary-list-content",
        type: "school_stationary_list",
        title: "Stationery List",
        legacyTypes: ["services"],
        titleHints: ["stationery", "stationary", "school supplies"],
      },
    ],
  },
  "/resources/calendar": {
    sections: [
      {
        key: "resource-calendar",
        type: "school_calendar",
        title: "School Calendar",
        legacyTypes: ["calendar"],
        titleHints: ["school calendar", "calendar"],
      },
    ],
  },
  "/admissions": {
    sections: [
      {
        key: "admissions-main",
        type: "school_admissions_landing",
        title: "Admissions",
        legacyTypes: ["admissions"],
        titleHints: ["admissions", "apply"],
      },
    ],
  },
  "/admissions/apply": {
    sections: [
      {
        key: "application-introduction",
        type: "school_apply_online",
        title: "Online Application",
        legacyTypes: ["admissions"],
        titleHints: ["online application", "application"],
      },
    ],
  },
  "/admissions/requirements": {
    sections: [
      {
        key: "admission-requirements",
        type: "school_entry_requirements",
        title: "Entry Requirements",
        legacyTypes: ["admissions"],
        titleHints: ["entry requirements", "admission requirements"],
      },
    ],
  },
  "/admissions/howtoapply": {
    sections: [
      {
        key: "how-to-apply",
        type: "school_how_to_apply",
        title: "How to Apply",
        legacyTypes: ["admissions"],
        titleHints: ["how to apply", "application steps"],
      },
    ],
  },
  "/digital-library": {
    sections: [
      {
        key: "digital-library-content",
        type: "school_digital_library",
        title: "Digital Library",
        legacyTypes: ["library", "resources", "services"],
        titleHints: ["digital library", "library"],
      },
    ],
  },
  "/schoolcalendar": {
    sections: [
      {
        key: "school-calendar-main",
        type: "school_calendar",
        title: "School Calendar",
        legacyTypes: ["calendar"],
        titleHints: ["school calendar", "calendar"],
      },
    ],
  },
  "/calendar/events": {
    sections: [
      {
        key: "all-calendar-events",
        type: "school_all_events",
        title: "All Calendar Events",
        legacyTypes: ["calendar"],
        titleHints: ["all calendar events", "events"],
      },
    ],
  },
  "/news": {
    sections: [
      {
        key: "news-listing",
        type: "school_news",
        title: "Latest News",
        legacyTypes: ["latest_news", "news"],
        titleHints: ["latest news", "news"],
      },
    ],
  },
  "/notices": {
    sections: [
      {
        key: "notices-main",
        type: "school_notices",
        title: "School Notices",
        legacyTypes: ["notice_board"],
        titleHints: ["school notices", "notices", "notice board"],
      },
    ],
  },
  "/gallery": {
    sections: [
      {
        key: "gallery-main",
        type: "school_gallery",
        title: "Photo Gallery",
        legacyTypes: ["gallery"],
        titleHints: ["photo gallery", "gallery"],
      },
      {
        key: "gallery-wall-of-fame",
        type: "school_wall_of_fame",
        title: "Academic Wall of Fame",
        legacyTypes: ["wall_of_fame", "recognition", "awards"],
        titleHints: ["academic wall of fame", "wall of fame", "recognition"],
      },
    ],
  },
  "/robotics": {
    sections: [
      {
        key: "robotics-overview",
        type: "school_robotics",
        title: "Robotics Club",
        legacyTypes: ["services"],
        titleHints: ["robotics club", "robotics"],
      },
    ],
  },
  "/wall-of-fame": {
    sections: [
      {
        key: "recognition-main",
        type: "school_wall_of_fame",
        title: "Academic Wall of Fame",
        legacyTypes: ["wall_of_fame", "recognition", "awards"],
        titleHints: ["academic wall of fame", "wall of fame", "recognition"],
      },
    ],
  },
  "/sponsors": {
    sections: [
      {
        key: "sponsors-main",
        type: "school_sponsors",
        title: "Sponsors",
        legacyTypes: ["partners", "sponsors", "supporters"],
        titleHints: ["sponsors", "partners", "supporters"],
      },
    ],
  },
  "/contact": {
    sections: [
      {
        key: "contact-details",
        type: "school_contact",
        title: "Contact Us",
        legacyTypes: ["contact"],
        titleHints: ["contact us", "contact details", "contact"],
      },
    ],
  },
  "/bulletin": {
    sections: [
      {
        key: "daily-bulletin",
        type: "school_daily_bulletin",
        title: "Student Daily Bulletin",
        legacyTypes: ["notice_board"],
        titleHints: ["student daily bulletin", "daily bulletin", "bulletin"],
      },
    ],
  },
};

const HOME_PAGE_SLUGS = new Set([
  "/",
  "/home/hero",
  "/home/about-section",
  "/home/gallery-preview",
  "/home/principal-message",
  "/home/quick-links",
  "/home/latest-news",
  "/home/events",
  "/home/school-stats",
]);

const EDITOR_METADATA_KEYS = new Set([
  "__section_key",
  "_section_key",
  "section_key",
  "editor_section_type",
  "_editor_section_type",
  "section_type",
  "page_slug",
  "_page_slug",
  "__editor_field_order",
  "__editor_field_labels",
  "__editor_fallback_content",
  "editor_field_order",
  "editor_field_labels",
  "editor_fallback_content",
]);

function normalizeMatcherValue(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function normalizeMatcherSlug(value = "/") {
  const raw = String(value || "/").trim();
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/+$/g, "") || "/";
}

function cloneFallbackValue(value) {
  if (value === undefined || value === null) return value;

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function isPlainFallbackObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isMissingContentValue(value, fallbackValue) {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0 && Array.isArray(fallbackValue);
  if (isPlainFallbackObject(value)) {
    return Object.keys(value).length === 0 && isPlainFallbackObject(fallbackValue);
  }

  return String(value).trim() === "" && String(fallbackValue ?? "").trim() !== "";
}

function mergeContentWithTemplateFallback(templateContent = {}, currentContent = {}) {
  const fallback = isPlainFallbackObject(templateContent) ? cloneFallbackValue(templateContent) : {};
  const current = isPlainFallbackObject(currentContent) ? cloneFallbackValue(currentContent) : {};

  const merged = {
    ...fallback,
    ...current,
  };

  Object.entries(fallback).forEach(([key, fallbackValue]) => {
    const currentValue = current[key];

    if (isMissingContentValue(currentValue, fallbackValue)) {
      merged[key] = cloneFallbackValue(fallbackValue);
      return;
    }

    if (isPlainFallbackObject(fallbackValue) && isPlainFallbackObject(currentValue)) {
      merged[key] = mergeContentWithTemplateFallback(fallbackValue, currentValue);
    }
  });

  return merged;
}

function getSectionKey(section = {}) {
  return (
    section?.section_key ||
    section?.key ||
    section?.content?.section_key ||
    section?.content?._section_key ||
    section?.content?.__section_key ||
    section?.content?.key ||
    ""
  );
}

function getSectionType(section = {}) {
  return (
    section?.content?._editor_section_type ||
    section?.content?.editor_section_type ||
    section?.content?.section_type ||
    section?.section_type ||
    section?.type ||
    ""
  );
}

function getSectionPageSlug(section = {}) {
  return normalizeMatcherSlug(
    section?.page_slug ||
      section?.slug ||
      section?.content?.page_slug ||
      section?.content?._page_slug ||
      "",
  );
}

function getSectionTitle(section = {}) {
  return String(
    section?.content?.section_title ||
      section?.content?.title ||
      section?.content?.page_title ||
      section?.title ||
      "",
  ).toLowerCase();
}

function getTemplatePageConfig(slug = "/") {
  const normalizedSlug = normalizeMatcherSlug(slug);

  return (
    (Array.isArray(templateConfig?.pages) ? templateConfig.pages : []).find(
      (pageConfig) => normalizeMatcherSlug(pageConfig?.slug || "/") === normalizedSlug,
    ) || null
  );
}

function getTemplateSectionConfig(definition = {}, slug = "/") {
  const pageConfig = getTemplatePageConfig(slug);
  const pageSections = Array.isArray(pageConfig?.sections)
    ? pageConfig.sections
    : [];

  const allSections = (Array.isArray(templateConfig?.pages)
    ? templateConfig.pages
    : []
  ).flatMap((pageConfigItem) =>
    Array.isArray(pageConfigItem?.sections)
      ? pageConfigItem.sections.map((sectionConfig) => ({
          ...sectionConfig,
          __template_page_slug: normalizeMatcherSlug(pageConfigItem?.slug || "/"),
        }))
      : [],
  );

  const templateSections = [...pageSections, ...allSections];

  const definitionKey = normalizeMatcherValue(definition?.key);
  const definitionType = normalizeMatcherValue(definition?.type);

  return (
    templateSections.find((templateSection) => {
      const templateKey = normalizeMatcherValue(
        templateSection?.section_key ||
          templateSection?.key ||
          templateSection?.id ||
          templateSection?.content?.section_key ||
          templateSection?.content?._section_key,
      );

      return definitionKey && templateKey === definitionKey;
    }) ||
    templateSections.find((templateSection) => {
      const templateType = normalizeMatcherValue(templateSection?.type);

      return definitionType && templateType === definitionType;
    }) ||
    null
  );
}

function getTemplateFallbackContent(definition = {}, slug = "/") {
  const templateSection = getTemplateSectionConfig(definition, slug);

  return isPlainFallbackObject(templateSection?.content)
    ? cloneFallbackValue(templateSection.content)
    : {};
}

function getTemplateFallbackStyle(definition = {}, slug = "/") {
  const templateSection = getTemplateSectionConfig(definition, slug);

  return isPlainFallbackObject(templateSection?.style)
    ? cloneFallbackValue(templateSection.style)
    : {};
}

function getTemplateFallbackAnimation(definition = {}, slug = "/") {
  const templateSection = getTemplateSectionConfig(definition, slug);

  return isPlainFallbackObject(templateSection?.animation)
    ? cloneFallbackValue(templateSection.animation)
    : {};
}

function getEditorFieldOrderFromTemplate(definition = {}, slug = "/") {
  const templateSection = getTemplateSectionConfig(definition, slug);
  const templateContent = isPlainFallbackObject(templateSection?.content)
    ? templateSection.content
    : {};

  return Object.keys(templateContent).filter(
    (key) => !EDITOR_METADATA_KEYS.has(key),
  );
}

function getEditorFieldLabelsFromOrder(order = []) {
  return (Array.isArray(order) ? order : []).reduce((labels, key) => {
    labels[key] = String(key || "")
      .replace(/^_+/, "")
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
    return labels;
  }, {});
}

function getEditorMetadata(definition = {}, slug = "/", fallbackContent = {}) {
  const order = getEditorFieldOrderFromTemplate(definition, slug);
  const safeOrder = order.length
    ? order
    : Object.keys(fallbackContent || {}).filter(
        (key) => !EDITOR_METADATA_KEYS.has(key),
      );

  const safeFallback = cloneFallbackValue(
    Object.keys(fallbackContent || {}).reduce((result, key) => {
      if (!EDITOR_METADATA_KEYS.has(key)) {
        result[key] = fallbackContent[key];
      }
      return result;
    }, {}),
  );

  return {
    __editor_field_order: safeOrder,
    __editor_field_labels: getEditorFieldLabelsFromOrder(safeOrder),
    __editor_fallback_content: safeFallback,
  };
}

function applyEditorFriendlyAliases(content = {}, definition = {}) {
  const next =
    content && typeof content === "object" && !Array.isArray(content)
      ? cloneFallbackValue(content)
      : {};

  const type = normalizeMatcherValue(definition?.type);

  if (type === "school_exam_schedule" && Array.isArray(next.items)) {
    next.items = next.items.map((item, index) => ({
      id: item.id || `exam-${index + 1}`,
      grade: item.grade || "All Grades",
      subject: item.subject || item.title || "Examination",
      paper: item.paper || item.assessment || "",
      date: item.date || "",
      time: item.time || item.start_time || "",
      end_time: item.end_time || item.endTime || "",
      venue: item.venue || item.location || "To be confirmed",
      duration: item.duration || "",
      status: item.status || "Scheduled",
    }));
  }

  if (type === "school_stationary_list" && Array.isArray(next.items)) {
    next.items = next.items.map((item, index) => ({
      id: item.id || `stationery-${index + 1}`,
      grade: item.grade || "",
      subject: item.subject || "",
      items: item.items || item.body || item.description || "",
    }));
  }

  if (type === "school_code_of_conduct" && Array.isArray(next.rules)) {
    next.rules = next.rules.map((item, index) => ({
      id: item.id || `rule-${index + 1}`,
      title: item.title || `Rule ${index + 1}`,
      body: item.body || item.description || item.text || "",
    }));
  }

  if (type === "school_academics" && Array.isArray(next.items)) {
    next.items = next.items.map((item, index) => ({
      id: item.id || `academic-${index + 1}`,
      title: item.title || "",
      body: item.body || item.text || item.description || "",
    }));
  }

  if (
    (type === "school_facilities" || type === "school_activity_facilities") &&
    Array.isArray(next.feature_groups)
  ) {
    next.feature_groups = next.feature_groups.map((group, index) => ({
      id: group.id || `feature-group-${index + 1}`,
      title: group.title || "",
      icon: group.icon || "",
      items: Array.isArray(group.items) ? group.items : [],
    }));
  }

  if (type === "school_subject_choices") {
    if (Array.isArray(next.streams)) {
      next.streams = next.streams.map((stream, index) => ({
        id: stream.id || `stream-${index + 1}`,
        title: stream.title || "",
        summary: stream.summary || stream.body || stream.description || "",
        subjects: Array.isArray(stream.subjects) ? stream.subjects : [],
        note: stream.note || "",
      }));
    }

    if (Array.isArray(next.electives)) {
      next.electives = next.electives.map((item, index) => ({
        id: item.id || `elective-${index + 1}`,
        name: item.name || item.title || "",
        desc: item.desc || item.body || item.description || "",
      }));
    }

    if (Array.isArray(next.downloads)) {
      next.downloads = next.downloads.map((item, index) => ({
        id: item.id || `download-${index + 1}`,
        label: item.label || item.title || "",
        href: item.href || item.url || item.pdf_url || "",
      }));
    }
  }

  if (type === "school_contact") {
    next.heading = next.heading || "Get in Touch";
    next.body =
      next.body ||
      "Contact our school for admissions, learner support and general enquiries.";
    next.email = next.email || "info@yourschool.co.za";
    next.phone = next.phone || "+27 00 000 0000";
    next.address_line1 = next.address_line1 || "123 Education St";
    next.city = next.city || "Johannesburg";
    next.province = next.province || "Gauteng";
    next.country = next.country || "South Africa";
  }


  if (type === "school_daily_bulletin") {
    next.footer_note =
      next.footer_note ||
      "For urgent announcements, learners should confirm details with the school office or their class teacher.";

    if (Array.isArray(next.items)) {
      next.items = next.items.map((item, index) => ({
        id: item.id || `bulletin-${index + 1}`,
        date: item.date || item.publishedAt || "",
        title: item.title || "",
        category: item.category || "General",
        urgent: item.urgent === true,
        content: item.content || item.body || item.message || "",
      }));
    }
  }

  if (type === "school_attendance_policy") {
    next.meta_items = Array.isArray(next.meta_items) ? next.meta_items : [];
    next.attendance_expectations = Array.isArray(next.attendance_expectations)
      ? next.attendance_expectations
      : [];
    next.late_arrival_items = Array.isArray(next.late_arrival_items)
      ? next.late_arrival_items
      : [];
    next.acceptable_reasons = Array.isArray(next.acceptable_reasons)
      ? next.acceptable_reasons
      : [];
    next.absence_items = Array.isArray(next.absence_items)
      ? next.absence_items
      : [];
    next.catch_up_items = Array.isArray(next.catch_up_items)
      ? next.catch_up_items
      : [];

    if (Array.isArray(next.intervention_steps)) {
      next.intervention_steps = next.intervention_steps.map((item, index) => ({
        id: item.id || `intervention-${index + 1}`,
        title: item.title || `Step ${index + 1}`,
        body: item.body || item.description || item.text || "",
        description: item.description || item.body || item.text || "",
      }));
    }

    if (Array.isArray(next.roles)) {
      next.roles = next.roles.map((role, index) => ({
        id: role.id || `role-${index + 1}`,
        title: role.title || "",
        items: Array.isArray(role.items) ? role.items : [],
      }));
    }
  }

  if (
    (type === "school_facilities" || type === "school_activity_facilities") &&
    Array.isArray(next.items)
  ) {
    next.items = next.items.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;

      const image = item.image_url || item.image || item.img || "";

      return {
        id: item.id || `facility-${index + 1}`,
        ...item,
        image_url: image,
        image: item.image || image,
        body: item.body || item.description || item.text || "",
        description: item.description || item.body || item.text || "",
      };
    });
  }

  if (Array.isArray(next.items)) {
    next.items = next.items.map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return item;

      const image =
        item.img ||
        item.image_url ||
        item.photo_url ||
        item.photo ||
        item.image ||
        "";

      const body =
        item.body ||
        item.description ||
        item.text ||
        item.summary ||
        item.items ||
        "";

      return {
        id: item.id || `${definition?.key || "item"}-${index + 1}`,
        ...item,
        ...(image
          ? {
              img: image,
              image_url: item.image_url || image,
            }
          : {}),
        ...(body
          ? {
              body,
              description: item.description || body,
              text: item.text || body,
            }
          : {}),
      };
    });
  }

  if (Array.isArray(next.timeline)) {
    next.timeline = next.timeline.map((item, index) => ({
      id: item.id || `timeline-${index + 1}`,
      ...item,
      step: item.step || item.year || String(index + 1),
      description: item.description || item.body || item.text || "",
      body: item.body || item.description || item.text || "",
      text: item.text || item.description || item.body || "",
    }));
  }

  if (Array.isArray(next.gallery)) {
    next.gallery = next.gallery.map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `gallery-${index + 1}`,
          title: `Gallery Image ${index + 1}`,
          src: item,
          image_url: item,
          alt: `Gallery Image ${index + 1}`,
        };
      }

      if (!item || typeof item !== "object" || Array.isArray(item)) return item;

      const image = item.image_url || item.src || item.image || item.img || "";

      return {
        id: item.id || `gallery-${index + 1}`,
        ...item,
        ...(image ? { image_url: image, src: item.src || image } : {}),
      };
    });
  }

  return next;
}

function scoreSectionForDefinition(section, definition, slug) {
  if (!section || !definition) return -1;

  const sectionKey = normalizeMatcherValue(getSectionKey(section));
  const sectionType = normalizeMatcherValue(getSectionType(section));
  const pageSlug = getSectionPageSlug(section);
  const title = getSectionTitle(section);

  const definitionKey = normalizeMatcherValue(definition.key);
  const definitionType = normalizeMatcherValue(definition.type);
  const legacyTypes = (definition.legacyTypes || []).map(normalizeMatcherValue);
  const titleHints = (definition.titleHints || []).map((item) =>
    String(item || "").toLowerCase(),
  );

  if (definitionKey && sectionKey === definitionKey) return 120;
  if (definitionType && sectionType === definitionType) return 100;
  if (pageSlug === slug && pageSlug !== "/") return 80;

  if (
    legacyTypes.includes(sectionType) &&
    titleHints.some((hint) => hint && title.includes(hint))
  ) {
    return 60;
  }

  return -1;
}

function normalizeSectionForDefinition(section = {}, definition, slug, index = 0) {
  if (!definition) return section;

  const templateFallbackContent = getTemplateFallbackContent(definition, slug);
  const currentContent =
    section?.content && typeof section.content === "object"
      ? section.content
      : {};

  const mergedContent = applyEditorFriendlyAliases(
    mergeContentWithTemplateFallback(templateFallbackContent, currentContent),
    definition,
  );

  const fallbackStyle = getTemplateFallbackStyle(definition, slug);
  const fallbackAnimation = getTemplateFallbackAnimation(definition, slug);
  const editorMetadata = getEditorMetadata(definition, slug, templateFallbackContent);

  return {
    ...section,
    type: definition.type,
    section_type: definition.type,
    section_key: definition.key,
    key: definition.key,
    templateCategory: section?.templateCategory || section?.template_category || "school",
    template_category: section?.template_category || section?.templateCategory || "school",
    templateKey: section?.templateKey || section?.template_key || "school-prestige-v1",
    template_key: section?.template_key || section?.templateKey || "school-prestige-v1",
    position: Number.isFinite(Number(section?.position))
      ? Number(section.position)
      : index,
    visible: section?.visible !== false,
    style:
      section?.style && typeof section.style === "object"
        ? {
            ...fallbackStyle,
            ...section.style,
          }
        : fallbackStyle,
    animation:
      section?.animation && typeof section.animation === "object"
        ? {
            ...fallbackAnimation,
            ...section.animation,
          }
        : fallbackAnimation,
    content: {
      ...mergedContent,
      ...editorMetadata,
      __section_key: definition.key,
      section_key: definition.key,
      _section_key: definition.key,
      editor_section_type: definition.type,
      _editor_section_type: definition.type,
      section_type: definition.type,
      page_slug: slug,
      _page_slug: slug,
      section_title:
        mergedContent?.section_title ||
        mergedContent?.title ||
        templateFallbackContent?.section_title ||
        templateFallbackContent?.title ||
        definition.title ||
        "Section",
    },
  };
}

function createVirtualSection(definition, slug, index = 0) {
  const templateSection = getTemplateSectionConfig(definition, slug);
  const fallbackContent = getTemplateFallbackContent(definition, slug);

  return normalizeSectionForDefinition(
    {
      id: null,
      type: definition.type,
      section_type: definition.type,
      section_key: definition.key,
      key: definition.key,
      templateCategory: "school",
      template_category: "school",
      templateKey: "school-prestige-v1",
      template_key: "school-prestige-v1",
      position: Number.isFinite(Number(templateSection?.position))
        ? Number(templateSection.position)
        : index,
      visible: templateSection?.visible !== false,
      content: {
        ...fallbackContent,
        section_title:
          fallbackContent?.section_title ||
          fallbackContent?.title ||
          definition.title ||
          "Section",
      },
      style:
        templateSection?.style && typeof templateSection.style === "object"
          ? cloneFallbackValue(templateSection.style)
          : {},
      animation:
        templateSection?.animation && typeof templateSection.animation === "object"
          ? cloneFallbackValue(templateSection.animation)
          : {},
    },
    definition,
    slug,
    index,
  );
}

function getPageSections(allSections = [], slug = "/") {
  const normalizedSlug = normalizeMatcherSlug(slug);
  const safeSections = Array.isArray(allSections) ? allSections : [];

  if (HOME_PAGE_SLUGS.has(normalizedSlug)) {
    return safeSections;
  }

  const matcher = PAGE_SECTION_MATCHERS[normalizedSlug];

  if (!matcher?.sections?.length) {
    return safeSections;
  }

  const used = new Set();

  return matcher.sections.map((definition, index) => {
    let bestSection = null;
    let bestScore = -1;

    safeSections.forEach((section, sectionIndex) => {
      const sectionIdentity =
        section?.id ||
        getSectionKey(section) ||
        `${getSectionType(section)}-${sectionIndex}`;

      if (used.has(sectionIdentity)) return;

      const score = scoreSectionForDefinition(
        section,
        definition,
        normalizedSlug,
      );

      if (score > bestScore) {
        bestScore = score;
        bestSection = section;
      }
    });

    if (bestSection && bestScore > -1) {
      const sectionIdentity =
        bestSection?.id ||
        getSectionKey(bestSection) ||
        `${getSectionType(bestSection)}-${index}`;

      used.add(sectionIdentity);

      return normalizeSectionForDefinition(
        bestSection,
        definition,
        normalizedSlug,
        index,
      );
    }

    return createVirtualSection(definition, normalizedSlug, index);
  });
}

function getPrimarySection(pageSections = []) {
  return Array.isArray(pageSections) && pageSections.length > 0
    ? pageSections[0]
    : null;
}

function slugToPageClass(slug = "/") {
  const clean = String(slug || "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return clean ? `school-page--${clean}` : "school-page--home";
}

/* ---------- FALLBACK PAGE ---------- */

function DefaultPageFallback({ sections = [], builderMode = false }) {
  if (!sections.length) {
    return (
      <section className="builder-empty-page">
        <h2>Page Coming Soon</h2>
      </section>
    );
  }

  return (
    <>
      {sections.map((section) => (
        <BuilderSectionTarget
          key={section.id || section.section_key}
          builderMode={builderMode}
          section={section}
          sectionType={section.type}
          label={
            section?.content?.section_title ||
            section?.content?.title ||
            section?.type ||
            "Section"
          }
          templateCategory="school"
          templateKey="school-prestige-v1"
          className="builder-section-anchor"
        >
          <section className="builder-fallback-section">
            <h2>
              {section?.content?.section_title ||
                section?.content?.title ||
                section?.type ||
                "Section"}
            </h2>
            <p>{section?.content?.subtitle || ""}</p>
          </section>
        </BuilderSectionTarget>
      ))}
    </>
  );
}

/* ---------- APP ---------- */

export default function App(props) {
  const {
    settings = {},
    navItems = [],
    page,
    sections = [],
    builderMode = false,
    previewMode = false,
  } = props || {};

  const [currentSlug, setCurrentSlug] = useState(page?.slug || "/");

  /* ---------- NORMALIZE SLUG ---------- */

  const slug =
    currentSlug && currentSlug.startsWith("/")
      ? currentSlug
      : `/${currentSlug || ""}`;

  const navigateTo = (nextSlug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", {
        detail: nextSlug || "/",
      }),
    );
  };

  /* ---------- LISTEN: iframe navigation ---------- */

  useEffect(() => {
    function handleMessage(e) {
      if (e.data?.type === "navigate") {
        const nextSlug = e.data.slug || "/";
        setCurrentSlug(nextSlug);
      }
    }

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  /* ---------- LISTEN: builder navigation ---------- */

  useEffect(() => {
    function handleBuilderNavigate(e) {
      const nextSlug = e.detail || "/";
      setCurrentSlug(nextSlug);
    }

    window.addEventListener("builder:navigate", handleBuilderNavigate);

    return () =>
      window.removeEventListener("builder:navigate", handleBuilderNavigate);
  }, []);

  /* ---------- SYNC WITH PAGE PROP ---------- */

  useEffect(() => {
    if (page?.slug) {
      setCurrentSlug(page.slug);
    }
  }, [page?.slug]);

  /* ---------- PAGE COMPONENT ---------- */

  const PageComponent = PAGE_COMPONENTS[slug] || DefaultPageFallback;

  /*
    In builder mode, hidden sections remain available so the Sections panel can
    turn them back on. On the public website, hidden sections are not rendered.
  */
  const renderableSections = builderMode
    ? sections
    : sections.filter((section) => section?.visible !== false);

  const pageSections = getPageSections(renderableSections, slug);
  const primarySection = getPrimarySection(pageSections);

  const pageContent =
    PageComponent === DefaultPageFallback ? (
      <DefaultPageFallback
        sections={pageSections}
        builderMode={builderMode}
      />
    ) : (
      <PageComponent
        section={primarySection}
        content={primarySection?.content || {}}
        sections={pageSections}
        builderMode={builderMode}
        previewMode={previewMode}
        settings={settings}
        navItems={navItems}
      />
    );

  /* ---------- RENDER ---------- */

  return (
    <div className={`school-prestige-v1-root ${slug === "/" ? "prestige-home" : "prestige-inner"}`}> 
      <ScrollToTop />

      <Topbar
        settings={settings}
        navItems={navItems}
        socialLinks={settings?.social_links}
        socialDisplay={settings?.social_display}
        topbarLinks={settings?.topbar_links || []}
        navigateTo={navigateTo}
        currentSlug={slug}
        builderMode={builderMode}
        previewMode={previewMode}
      />

      <Navbar
        settings={settings}
        navItems={navItems}
        navigateTo={navigateTo}
        builderMode={builderMode}
        previewMode={previewMode}
      />

      <main data-builder-page-root={builderMode ? "1" : "0"}>
        {/* Breadcrumbs */}
        {slug !== "/" && <Breadcrumbs slug={slug} />}

        {pageContent}
      </main>

      <Footer
        settings={settings}
        navItems={navItems}
        socialLinks={settings?.social_links}
        socialDisplay={settings?.social_display}
        footerLinks={settings?.footer_links || []}
        navigateTo={navigateTo}
        builderMode={builderMode}
        previewMode={previewMode}
      />

      <SiteAnnouncementPopup
        settings={settings}
        currentSlug={slug}
        navigateTo={navigateTo}
      />

      <ScrollTopButton />
    </div>
  );
}