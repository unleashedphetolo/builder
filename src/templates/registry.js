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
      "Corporate homepage with hero slideshow, services, testimonials, CTA, pricing, contact and full builder media/social support.",
    tags: ["corporate", "executive", "services", "slideshow", "social"],
    preview_image: "/template-previews/business-executive.png",
  },

  {
    layout_key: "business",
    template_key: "business-agency-v1",
    template_path: "templates/business/business-agency-v1",
    name: "Agency Pro",
    description:
      "High-conversion agency site with hero slideshow, portfolio, case studies, team, lead capture and full builder media/social support.",
    tags: ["agency", "portfolio", "lead", "slideshow", "social"],
    preview_image: "/template-previews/business-agency.png",
  },

  {
    layout_key: "business",
    template_key: "business-consulting-v1",
    template_path: "templates/business/business-consulting-v1",
    name: "Consulting Firm",
    description:
      "Professional consulting website with hero slideshow, credibility sections, services, leadership, insights and enquiries.",
    tags: ["consulting", "professional", "strategy", "slideshow", "social"],
    preview_image: "/template-previews/business-consulting.png",
  },

  {
    layout_key: "business",
    template_key: "business-finance-v1",
    template_path: "templates/business/business-finance-v1",
    name: "Finance Capital",
    description:
      "Premium finance and advisory website with hero slideshow, trust sections, service packages, client proof and lead capture.",
    tags: ["finance", "advisory", "premium", "slideshow", "social"],
    preview_image: "/template-previews/business-finance.png",
  },

  /* =========================
     PORTFOLIO TEMPLATES
     ========================= */

  {
    layout_key: "portfolio",
    template_key: "portfolio-developer-v1",
    template_path: "templates/portfolio/portfolio-developer-v1",
    name: "Software Developer Pro",
    description:
      "Enterprise software developer portfolio with projects, stack, experience, resume, services and contact.",
    tags: ["software", "developer", "projects", "resume", "technical"],
    preview_image: "/template-previews/portfolio-developer.png",
  },

  {
    layout_key: "portfolio",
    template_key: "portfolio-clean-v1",
    template_path: "templates/portfolio/portfolio-clean-v1",
    name: "Clean Professional",
    description:
      "Clean personal brand portfolio with profile, projects, skills, services, resume and contact.",
    tags: ["clean", "professional", "resume", "projects"],
    preview_image: "/template-previews/portfolio-clean.png",
  },

  {
    layout_key: "portfolio",
    template_key: "portfolio-creative-v1",
    template_path: "templates/portfolio/portfolio-creative-v1",
    name: "Creative Studio",
    description:
      "Bold creative portfolio with gallery-focused projects, visual services, testimonials and contact.",
    tags: ["creative", "gallery", "visual", "portfolio"],
    preview_image: "/template-previews/portfolio-creative.png",
  },

  {
    layout_key: "portfolio",
    template_key: "portfolio-consultant-v1",
    template_path: "templates/portfolio/portfolio-consultant-v1",
    name: "Consultant Profile",
    description:
      "Trusted consultant portfolio with advisory services, proof of work, experience and lead capture.",
    tags: ["consultant", "advisory", "services", "trusted"],
    preview_image: "/template-previews/portfolio-consultant.png",
  },

  {
    layout_key: "portfolio",
    template_key: "portfolio-product-v1",
    template_path: "templates/portfolio/portfolio-product-v1",
    name: "Product Designer Pro",
    description:
      "Premium product/UI designer portfolio with case studies, design systems, skills, services and contact.",
    tags: ["product", "designer", "case-studies", "ui-ux"],
    preview_image: "/template-previews/portfolio-product.png",
  },

  {
    layout_key: "portfolio",
    template_key: "portfolio-educator-v1",
    template_path: "templates/portfolio/portfolio-educator-v1",
    name: "Educator Portfolio Pro",
    description: "Professional teacher portfolio with teaching services, learner support, qualifications, resources, experience and contact.",
    tags: ["teacher", "educator", "tutoring", "qualifications", "resume"],
    preview_image: "/template-previews/portfolio-educator.png",
  },

];