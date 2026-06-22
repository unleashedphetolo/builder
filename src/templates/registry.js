// Local template registry (fallback if DB tables are empty)
// The DB can later drive this via `templates` + `template_marketplace`.
// Each template now includes a `template_path` pointing to its folder.

export const DEFAULT_TEMPLATES = [
  /* =========================
     SCHOOL TEMPLATES
     ========================= */

  {
    layout_key: "school",
    template_key: "school-modern-v1",
    template_path: "templates/school/school-modern-v1",
    name: "Modern Academy",
    description:
      "Clean modern academy design with premium hero, admissions, announcements, resources, gallery and responsive pages.",
    tags: ["modern", "academy", "school"],
    preview_image: "/template-previews/school-modern-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-institutional-v1",
    template_path: "templates/school/school-institutional-v1",
    name: "Institutional Classic",
    description:
      "Formal institutional school design with governance, admissions, resources, notices, staff and contact pages.",
    tags: ["institutional", "classic", "school"],
    preview_image: "/template-previews/school-institutional-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-prestige-v1",
    template_path: "templates/school/school-prestige-v1",
    name: "Prestige Campus",
    description:
      "Premium campus-style school design with strong academic branding and enterprise responsive pages.",
    tags: ["prestige", "campus", "black-gold", "enterprise"],
    preview_image: "/template-previews/school-prestige-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-evergreen-v1",
    template_path: "templates/school/school-evergreen-v1",
    name: "Evergreen Academy",
    description:
      "Premium green school design with floating campus styling, strong hero section and responsive pages.",
    tags: ["green", "evergreen", "enterprise", "school"],
    preview_image: "/template-previews/school-evergreen-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-heritage-tartan-v1",
    template_path: "templates/school/school-heritage-tartan-v1",
    name: "Heritage Tartan",
    description:
      "Heritage school design with green, gold and tartan-inspired accents for traditional academic presentation.",
    tags: ["heritage", "tartan", "green", "gold", "school"],
    preview_image: "/template-previews/school-heritage-tartan-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-academic-tweed-v1",
    template_path: "templates/school/school-academic-tweed-v1",
    name: "Academic Tweed",
    description:
      "Classic academic school design with warm earthy tweed-style texture, formal cards and premium page styling.",
    tags: ["academic", "tweed", "classic", "school"],
    preview_image: "/template-previews/school-academic-tweed-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-technical-school-v1",
    template_path: "templates/school/school-technical-school-v1",
    name: "Technical School",
    description:
      "Technical and innovation-focused school design with navy, steel and gold styling for practical learning institutions.",
    tags: ["technical", "innovation", "navy", "school"],
    preview_image: "/template-previews/school-technical-school-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-sports-academy-v1",
    template_path: "templates/school/school-sports-academy-v1",
    name: "Sports Academy",
    description:
      "Bold sports school design with energetic red and dark accents for athletics, achievement and learner activities.",
    tags: ["sports", "academy", "red", "school"],
    preview_image: "/template-previews/school-sports-academy-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-primary-school-v1",
    template_path: "templates/school/school-primary-school-v1",
    name: "Primary School",
    description:
      "Friendly primary school design with soft green, rounded cards and welcoming responsive pages.",
    tags: ["primary", "friendly", "green", "school"],
    preview_image: "/template-previews/school-primary-school-v1.png",
  },

  {
    layout_key: "school",
    template_key: "school-boarding-school-v1",
    template_path: "templates/school/school-boarding-school-v1",
    name: "Boarding School",
    description:
      "Formal boarding school design with navy, gold and strong residential-school page styling.",
    tags: ["boarding", "navy", "gold", "school"],
    preview_image: "/template-previews/school-boarding-school-v1.png",
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