// Local template registry (fallback if DB tables are empty)
// The DB can later drive this via `templates` + `template_marketplace`.
// Each template now includes a `template_path` pointing to its folder.

export const DEFAULT_TEMPLATES = [
  /* =========================
     SCHOOL TEMPLATES
     ========================= */

  {
    layout_key: "school",
    template_key: "school-institutional-v1",
    template_path: "templates/school/school-institutional-v1",
    name: "Institutional School (Sebone-style)",
    description:
      "Full multi-page school website: topbar social links, notices, news, gallery, admissions, staff and contact.",
    tags: ["multi-page", "institutional", "news", "gallery"],
    preview_image: "/template-previews/school-institutional.png",
  },

  {
    layout_key: "school",
    template_key: "school-modern-v1",
    template_path: "templates/school/school-modern-v1",
    name: "Modern Academy",
    description:
      "Clean academic design with hero slider, featured programs, announcements and quick links.",
    tags: ["clean", "modern", "announcements"],
    preview_image: "/template-previews/school-modern.png",
  },

  /* =========================
     BUSINESS TEMPLATES
     ========================= */

  {
    layout_key: "business",
    template_key: "business-executive-v1",
    template_path: "templates/business/business-executive-v1",
    name: "Executive Business",
    description:
      "Corporate homepage with services, testimonials, CTA, pricing and contact sections.",
    tags: ["corporate", "executive", "services"],
    preview_image: "/template-previews/business-executive.png",
  },

  {
    layout_key: "business",
    template_key: "business-agency-v1",
    template_path: "templates/business/business-agency-v1",
    name: "Agency Pro",
    description:
      "High-conversion agency site with portfolio, case studies, team and lead capture.",
    tags: ["agency", "portfolio", "lead"],
    preview_image: "/template-previews/business-agency.png",
  },

  /* =========================
     PORTFOLIO TEMPLATES
     ========================= */

  {
    layout_key: "portfolio",
    template_key: "portfolio-clean-v1",
    template_path: "templates/portfolio/portfolio-clean-v1",
    name: "Clean Portfolio",
    description:
      "Personal portfolio with projects, skills, resume, services and contact.",
    tags: ["projects", "resume", "clean"],
    preview_image: "/template-previews/portfolio-clean.png",
  },

  {
    layout_key: "portfolio",
    template_key: "portfolio-creative-v1",
    template_path: "templates/portfolio/portfolio-creative-v1",
    name: "Creative Portfolio",
    description:
      "Bold creative layout with animated sections, gallery grid and testimonials.",
    tags: ["creative", "gallery", "animated"],
    preview_image: "/template-previews/portfolio-creative.png",
  },
];