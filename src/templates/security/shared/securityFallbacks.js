import { SECURITY_TEMPLATE_CONTENT } from "./securityPresets";

export const BASE_SECURITY_FALLBACKS = {
  businessName: "Sentinel Protection Services",
  tagline: "Professional security solutions for people, property and operations.",
  motto: "Prepared. Present. Professional.",
  heroTitle: "Reliable security services built for modern organisations.",
  heroSubtitle: "We provide guarding, patrols, access control, CCTV monitoring, event security and risk support with disciplined teams and responsive operations.",
  heroCta: "Request Security Assessment",
  heroSecondaryCta: "View Services",
  aboutTitle: "Trusted protection with operational discipline.",
  aboutText: "Our security teams are trained to protect personnel, assets and premises while maintaining a professional client-facing standard.",
  vision: "To become a trusted security partner for organisations that need reliable protection and accountable service delivery.",
  mission: "To deliver professional, responsive and visible security services that reduce risk and improve safety for every client site.",
  values: ["Integrity", "Vigilance", "Discipline", "Accountability"],
  services: [],
  solutions: [],
  industries: [],
  features: [],
  packages: [],
  stats: [["24/7", "Operational readiness"], ["100%", "Site-focused deployment"], ["Rapid", "Incident escalation"], ["Clear", "Client reporting"]],
  process: ["Assess the site and client risks", "Design a security plan and deployment structure", "Deploy trained teams and control procedures", "Monitor, report and improve continuously"],
  testimonials: [
    { quote: "The team improved our gate control, visitor process and after-hours site visibility.", author: "Operations Manager" },
    { quote: "Professional officers, clear reporting and reliable communication with management.", author: "Facilities Coordinator" },
  ],
  contactTitle: "Speak to our security operations team.",
  contactIntro: "Tell us what type of security support you need and our team will respond with the recommended next step.",
};

export const getSecurityField = (settings, keys, fallback) => {
  const safeKeys = Array.isArray(keys) ? keys : [keys];

  for (const key of safeKeys) {
    const parts = String(key).split(".");
    let current = settings;

    for (const part of parts) {
      if (!current || typeof current !== "object") {
        current = undefined;
        break;
      }
      current = current[part];
    }

    if (current !== undefined && current !== null && current !== "") {
      return current;
    }
  }

  return fallback;
};

const pickArray = (value, fallback) => Array.isArray(value) && value.length > 0 ? value : fallback;
const pickObject = (value, fallback) => value && typeof value === "object" && !Array.isArray(value) ? value : fallback;

export const normalizeSecurityContent = (settings = {}, preset = {}) => {
  const organization = settings.organization || {};
  const templateContent = SECURITY_TEMPLATE_CONTENT[preset.contentKey] || {};
  const fallback = { ...BASE_SECURITY_FALLBACKS, ...templateContent };
  const contact = pickObject(settings.contact, {});

  const services = getSecurityField(settings, ["services", "sections.services.items", "sections.services"], fallback.services);
  const solutions = getSecurityField(settings, ["solutions", "sections.solutions.items", "sections.solutions"], fallback.solutions);
  const industries = getSecurityField(settings, ["industries", "sections.industries.items", "sections.industries"], fallback.industries);

  return {
    businessName: getSecurityField(settings, ["website_name", "business_name", "organization.name", "name"], organization.name || fallback.businessName),
    tagline: getSecurityField(settings, ["tagline", "slogan", "organization.tagline"], fallback.tagline),
    motto: getSecurityField(settings, ["motto"], fallback.motto),
    heroTitle: getSecurityField(settings, ["hero.title", "hero_title", "sections.hero.title"], fallback.heroTitle),
    heroSubtitle: getSecurityField(settings, ["hero.subtitle", "hero_subtitle", "sections.hero.subtitle"], fallback.heroSubtitle),
    heroCta: getSecurityField(settings, ["hero.cta", "hero_cta"], fallback.heroCta),
    heroSecondaryCta: getSecurityField(settings, ["hero.secondary_cta", "hero_secondary_cta"], fallback.heroSecondaryCta),
    aboutTitle: getSecurityField(settings, ["about.title", "about_title", "sections.about.title"], fallback.aboutTitle),
    aboutText: getSecurityField(settings, ["about.text", "about_text", "sections.about.text"], fallback.aboutText),
    vision: getSecurityField(settings, ["vision"], fallback.vision),
    mission: getSecurityField(settings, ["mission"], fallback.mission),
    values: pickArray(getSecurityField(settings, ["values"], fallback.values), fallback.values),
    services: pickArray(services, fallback.services),
    solutions: pickArray(solutions, fallback.solutions),
    industries: pickArray(industries, fallback.industries),
    features: pickArray(getSecurityField(settings, ["features"], fallback.features), fallback.features),
    packages: pickArray(getSecurityField(settings, ["packages"], fallback.packages), fallback.packages),
    stats: pickArray(getSecurityField(settings, ["stats"], fallback.stats), fallback.stats),
    process: pickArray(getSecurityField(settings, ["process"], fallback.process), fallback.process),
    testimonials: pickArray(getSecurityField(settings, ["testimonials"], fallback.testimonials), fallback.testimonials),
    contactTitle: getSecurityField(settings, ["contact.title", "contact_title"], fallback.contactTitle),
    contactIntro: getSecurityField(settings, ["contact.intro", "contact_intro"], fallback.contactIntro),
    contact: {
      email: contact.email || settings.official_email || settings.email || organization.email || "info@securitycompany.co.za",
      phone: contact.phone || settings.official_phone || settings.phone || organization.phone || "+27 11 000 0000",
      address: contact.address || settings.address || organization.address || "Johannesburg, South Africa",
      hours: contact.hours || settings.office_hours || "Monday to Friday, 08:00 - 17:00. Emergency support by arrangement.",
      mapQuery: contact.mapQuery || contact.address || settings.address || organization.address || "Johannesburg South Africa security company",
    },
    socialLinks: settings.social_links || settings.socialLinks || {},
  };
};
