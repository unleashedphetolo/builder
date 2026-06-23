import templateConfig from "../template.config";
import { templateAssets } from "../assets/template.assets";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function sectionType(section = {}) {
  return (
    section?.content?._editor_section_type ||
    section?.content?.editor_section_type ||
    section?.content?.section_type ||
    section?.section_type ||
    section?.type ||
    section?.section_key ||
    section?.key ||
    ""
  );
}

function normalizeType(value = "") {
  return String(value).trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function findSection(sections = [], candidates = []) {
  const normalizedCandidates = candidates.map(normalizeType);
  return (sections || []).find((section) =>
    normalizedCandidates.includes(normalizeType(sectionType(section))),
  );
}

function mergeSection(section, fallback, sectionTypeName) {
  const content = isObject(section?.content) ? section.content : {};
  const safeType = sectionTypeName || sectionType(section) || content.editor_section_type;

  return {
    ...(section || {}),
    section_type: safeType,
    section_key: section?.section_key || safeType,
    content: {
      ...(fallback || {}),
      ...content,
      _editor_section_type: content._editor_section_type || content.editor_section_type || safeType,
      editor_section_type: content.editor_section_type || safeType,
      section_type: content.section_type || safeType,
    },
  };
}

function setting(settings, keys = [], fallback = "") {
  for (const key of keys) {
    if (settings?.[key]) return settings[key];
    if (settings?.organization?.[key]) return settings.organization[key];
    if (settings?.organisation?.[key]) return settings.organisation[key];
  }
  return fallback;
}

const fallbackContent = {
  profile: {
    full_name: templateConfig.defaults.site_name,
    professional_title: templateConfig.defaults.tagline,
    bio:
      "I help learners build confidence, improve subject understanding and develop strong study habits through structured lessons, clear communication and supportive guidance. This portfolio presents teaching experience, qualifications, services and learner support work in a trusted professional format.",
    image_url: templateAssets.profileImage,
    highlights: [
      "Curriculum-aligned teaching",
      "Learner-centred support",
      "Assessment and progress tracking",
      "Parent and learner communication",
    ],
  },
  skills: {
    section_title: "Teaching Skills",
    subtitle: "Classroom, tutoring and learner support strengths for trusted education services.",
    items: [
      { title: "Lesson Planning", level: "Advanced", body: "Structured lessons aligned with learning outcomes and assessment goals." },
      { title: "Learner Support", level: "Advanced", body: "Patient explanation, revision support and individual learning guidance." },
      { title: "Assessment Preparation", level: "Professional", body: "Tests, assignments, exam readiness and progress review." },
      { title: "Parent Communication", level: "Professional", body: "Clear updates, learning feedback and practical recommendations." },
    ],
  },
  projects: {
    section_title: "Teaching Portfolio",
    subtitle: "Examples of teaching work, learner support and classroom resources.",
    items: [
      {
        title: "Exam Preparation Programme",
        body: "A focused revision programme with practice tasks, progress checks and learner confidence support.",
        image_url: templateAssets.projectImage,
        link: "#",
      },
      {
        title: "Digital Lesson Resources",
        body: "A collection of printable and digital resources designed to make lessons clearer and more engaging.",
        image_url: templateAssets.heroImage,
        link: "#",
      },
      {
        title: "Learner Progress Tracker",
        body: "A simple tracking system for monitoring attendance, tasks, assessments and improvement areas.",
        image_url: templateAssets.resumeImage,
        link: "#",
      },
    ],
  },
  experience: {
    section_title: "Teaching Experience",
    subtitle: "A professional teaching journey focused on learner progress and trust.",
    items: [
      { title: "Educator / Tutor", company: "Independent Teaching Practice", period: "2025 - Present", body: "Provides structured lessons, learner support, revision planning and clear progress communication." },
      { title: "Academic Support Assistant", company: "School / Learning Centre", period: "2024 - 2025", body: "Supported classroom activities, learner guidance, assessment preparation and resource development." },
      { title: "Professional Development", company: "Ongoing Learning", period: "Ongoing", body: "Continues to strengthen teaching methods, digital learning tools and learner support strategies." },
    ],
  },
  qualifications: {
    section_title: "Education & Qualifications",
    subtitle: "Academic and professional credentials that help learners and parents trust the service.",
    items: [
      { icon: "🎓", title: "Teaching Qualification", institution: "Recognised Education Institution", period: "Completed", body: "Formal training in teaching practice, learning support and classroom preparation." },
      { icon: "📘", title: "Subject Specialisation", institution: "Academic Institution", period: "Completed", body: "Focused subject knowledge for delivering clear lessons and assessment guidance." },
      { icon: "🏅", title: "Continuous Professional Development", institution: "Education Workshops", period: "Ongoing", body: "Ongoing development in teaching methods, learner engagement and digital education tools." },
    ],
  },
  services: {
    section_title: "Education Services",
    subtitle: "Professional teaching and learner support services for families, learners and institutions.",
    items: [
      { icon: "📚", title: "Private Tutoring", body: "One-on-one or small group lessons for subject understanding and academic confidence." },
      { icon: "📝", title: "Exam Preparation", body: "Revision planning, practice questions, study structure and assessment readiness." },
      { icon: "🎯", title: "Learning Support", body: "Homework support, progress tracking and personalised improvement plans." },
    ],
  },
  testimonials: {
    section_title: "Parent & Learner Confidence",
    subtitle: "Proof points that can be replaced with real testimonials.",
    items: [
      { title: "Patient", body: "Lessons are explained clearly and at the learner’s pace." },
      { title: "Prepared", body: "Sessions are structured, organised and focused on progress." },
      { title: "Supportive", body: "Learners receive encouragement, practical guidance and clear next steps." },
    ],
  },
};

export function getPortfolioData({ settings = {}, sections = [] }) {
  const profileSection = mergeSection(
    findSection(sections, ["portfolio_personal_profile", "personal_profile"]),
    fallbackContent.profile,
    "portfolio_personal_profile",
  );
  const skillsSection = mergeSection(
    findSection(sections, ["portfolio_skills", "skills"]),
    fallbackContent.skills,
    "portfolio_skills",
  );
  const projectsSection = mergeSection(
    findSection(sections, ["portfolio_projects", "projects"]),
    fallbackContent.projects,
    "portfolio_projects",
  );
  const experienceSection = mergeSection(
    findSection(sections, ["portfolio_experience", "experience"]),
    fallbackContent.experience,
    "portfolio_experience",
  );
  const qualificationsSection = mergeSection(
    findSection(sections, ["portfolio_qualifications", "qualifications", "education"]),
    fallbackContent.qualifications,
    "portfolio_qualifications",
  );

  const siteName = setting(settings, ["site_name", "name", "organization_name"], templateConfig.defaults.site_name);
  const tagline = setting(settings, ["tagline", "slogan"], templateConfig.defaults.tagline);
  const email = setting(settings, ["email", "official_email"], templateConfig.defaults.email);
  const phone = setting(settings, ["phone", "official_phone"], templateConfig.defaults.phone);
  const location = setting(settings, ["location", "address"], templateConfig.defaults.location);

  return {
    defaultPageKey: "home",
    siteName,
    tagline,
    email,
    phone,
    location,
    resumeUrl: settings.resume_url || settings.resumeUrl || (templateConfig.defaults.resume_url && templateConfig.defaults.resume_url !== "#" ? templateConfig.defaults.resume_url : templateAssets.resumeFile) || "#",
    logoUrl: settings.logo_url || templateAssets.fallbackLogo,
    heroSlides: settings.hero_slides_overridden ? settings.hero_slides : templateAssets.heroSlides,
    assets: templateAssets,
    socialLinks: {
      ...(templateConfig.defaults.social_links || {}),
      ...(settings.social_links || {}),
    },
    socialDisplay: {
      ...(templateConfig.defaults.social_display || {}),
      ...(settings.social_display || {}),
    },
    sections: {
      profile: profileSection,
      skills: skillsSection,
      projects: projectsSection,
      experience: experienceSection,
      qualifications: qualificationsSection,
      services: { section_type: "portfolio_services", section_key: "portfolio_services", content: fallbackContent.services },
      testimonials: { section_type: "portfolio_testimonials", section_key: "portfolio_testimonials", content: fallbackContent.testimonials },
    },
  };
}
