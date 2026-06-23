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
      "I help organisations and clients turn ideas into reliable digital experiences, clear strategies and measurable results. This portfolio is built to present real work, trusted services, experience and contact details in a professional way.",
    image_url: templateAssets.profileImage,
    highlights: [
      "Client-focused delivery",
      "Professional communication",
      "Reliable project execution",
      "Clean, measurable outcomes",
    ],
  },
  skills: {
    section_title: "Core Skills",
    subtitle: "A focused mix of technical, creative and professional strengths.",
    items: [
      { title: "Project Delivery", level: "Advanced", body: "Planning, execution, quality checks and handover." },
      { title: "Digital Systems", level: "Advanced", body: "Modern websites, platforms, automations and integrations." },
      { title: "Client Communication", level: "Professional", body: "Clear updates, expectations and support." },
      { title: "Problem Solving", level: "Advanced", body: "Practical thinking for business and user needs." },
    ],
  },
  projects: {
    section_title: "Featured Projects",
    subtitle: "Selected work that demonstrates quality, planning and execution.",
    items: [
      {
        title: "Client Website Platform",
        body: "A responsive multi-page website designed to help a client present services, enquiries and trust signals clearly.",
        image_url: templateAssets.projectImage,
        link: "#",
      },
      {
        title: "Operations Dashboard",
        body: "A clean dashboard concept for tracking key metrics, requests, approvals and daily work progress.",
        image_url: templateAssets.heroImage,
        link: "#",
      },
      {
        title: "Digital Brand System",
        body: "A visual and content system prepared to make the brand feel consistent across pages and campaigns.",
        image_url: templateAssets.resumeImage,
        link: "#",
      },
    ],
  },
  experience: {
    section_title: "Experience & Resume",
    subtitle: "A practical career story built around outcomes, reliability and growth.",
    items: [
      { title: "Lead Portfolio Project", company: "Independent Work", period: "2025 - Present", body: "Delivered digital portfolio and website work with a focus on structure, responsiveness and client trust." },
      { title: "Client Support & Delivery", company: "Freelance / Contract", period: "2024 - 2025", body: "Supported client requirements, project updates, implementation and quality review." },
      { title: "Skills Development", company: "Professional Growth", period: "Ongoing", body: "Continued learning in digital tools, user experience, communication and business presentation." },
    ],
  },
  qualifications: {
    section_title: "Qualifications & Credentials",
    subtitle: "Education, certifications and professional learning that support trusted delivery.",
    items: [
      { icon: "🎓", title: "Relevant Degree or Diploma", institution: "Recognised Institution", period: "Completed", body: "A formal qualification aligned with the professional services and experience shown in this portfolio." },
      { icon: "📜", title: "Professional Certification", institution: "Industry Training Provider", period: "Current", body: "Practical certification focused on quality delivery, modern tools and client-ready outcomes." },
      { icon: "🏅", title: "Continuous Professional Development", institution: "Ongoing Learning", period: "Ongoing", body: "Regular skills development to stay current, reliable and effective for clients." },
    ],
  },
  services: {
    section_title: "Services",
    subtitle: "Professional services that can be adapted in the builder.",
    items: [
      { icon: "▣", title: "Website & Portfolio Setup", body: "Responsive websites, landing pages and personal brand portfolios." },
      { icon: "◈", title: "Digital Strategy", body: "Planning content, structure, conversion paths and trust signals." },
      { icon: "◇", title: "Project Support", body: "Support with implementation, documentation and launch readiness." },
    ],
  },
  testimonials: {
    section_title: "Client Confidence",
    subtitle: "Fallback proof points that can be replaced with real testimonials.",
    items: [
      { title: "Reliable", body: "Clear communication and dependable delivery throughout the project." },
      { title: "Professional", body: "A polished presentation that makes the work easier to trust." },
      { title: "Practical", body: "Focused on what clients and visitors need to understand quickly." },
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
