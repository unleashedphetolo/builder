// Local template registry (fallback if DB tables are empty)
// The DB can later drive this via `templates` + `template_marketplace`.
// Each template now includes a `template_path` pointing to its folder.
import { SECURITY_TEMPLATE_REGISTRY } from "./security/security.registry";
import { PORTFOLIO_TEMPLATE_REGISTRY } from "./portfolio/portfolio.registry";
import { BUSINESS_TEMPLATE_REGISTRY } from "./business/business.registry";
import { HEALTH_TEMPLATE_REGISTRY } from "./health/health.registry";
import { AGRICULTURE_TEMPLATE_REGISTRY } from "./agriculture/agriculture.registry";
import { CONSTRUCTION_TEMPLATE_REGISTRY } from "./construction/construction.registry";
import { ENGINEERING_TEMPLATE_REGISTRY } from "./engineering/engineering.registry";

const TECHNOLOGY_TEMPLATE_REGISTRY = [];
const ECOMMERCE_TEMPLATE_REGISTRY = [];
const REAL_ESTATE_TEMPLATE_REGISTRY = [];
const ACCOMMODATION_TEMPLATE_REGISTRY = [];
const RESTAURANT_TEMPLATE_REGISTRY = [];
const BEAUTY_TEMPLATE_REGISTRY = [];
const LEGAL_TEMPLATE_REGISTRY = [];
const RELIGION_TEMPLATE_REGISTRY = [];
const CULTURE_TEMPLATE_REGISTRY = [];
const ENTERTAINMENT_TEMPLATE_REGISTRY = [];
const SPORTS_TEMPLATE_REGISTRY = [];
const NONPROFIT_TEMPLATE_REGISTRY = [];

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
     TEMPLATES
     ========================= */

  ...SECURITY_TEMPLATE_REGISTRY,

  ...BUSINESS_TEMPLATE_REGISTRY,

  ...PORTFOLIO_TEMPLATE_REGISTRY,

  ...HEALTH_TEMPLATE_REGISTRY,

  ...AGRICULTURE_TEMPLATE_REGISTRY,

  ...CONSTRUCTION_TEMPLATE_REGISTRY,

  ...ENGINEERING_TEMPLATE_REGISTRY,

  ...TECHNOLOGY_TEMPLATE_REGISTRY,

  ...ECOMMERCE_TEMPLATE_REGISTRY,

  ...REAL_ESTATE_TEMPLATE_REGISTRY,

  ...ACCOMMODATION_TEMPLATE_REGISTRY,

  ...RESTAURANT_TEMPLATE_REGISTRY,

  ...BEAUTY_TEMPLATE_REGISTRY,

  ...LEGAL_TEMPLATE_REGISTRY,

  ...RELIGION_TEMPLATE_REGISTRY,

  ...CULTURE_TEMPLATE_REGISTRY,

  ...ENTERTAINMENT_TEMPLATE_REGISTRY,

  ...SPORTS_TEMPLATE_REGISTRY,

  ...NONPROFIT_TEMPLATE_REGISTRY,
];