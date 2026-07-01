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
import { SCHOOL_TEMPLATE_REGISTRY } from "./school/school.registry";
import { TECHNOLOGY_TEMPLATE_REGISTRY } from "./technology/technology.registry";
import { ECOMMERCE_TEMPLATE_REGISTRY } from "./ecommerce/ecommerce.registry";
import { REAL_ESTATE_TEMPLATE_REGISTRY } from "./real-estate/real-estate.registry";
import { ACCOMMODATION_TEMPLATE_REGISTRY } from "./accommodation/accommodation.registry";
import { RESTAURANT_TEMPLATE_REGISTRY } from "./restaurant/restaurant.registry";
import { BEAUTY_TEMPLATE_REGISTRY } from "./beauty/beauty.registry";


const LEGAL_TEMPLATE_REGISTRY = [];
const RELIGION_TEMPLATE_REGISTRY = [];
const CULTURE_TEMPLATE_REGISTRY = [];
const ENTERTAINMENT_TEMPLATE_REGISTRY = [];
const SPORTS_TEMPLATE_REGISTRY = [];
const NONPROFIT_TEMPLATE_REGISTRY = [];

export const DEFAULT_TEMPLATES = [
  /* =========================
     TEMPLATES
     ========================= */
  ...SCHOOL_TEMPLATE_REGISTRY,

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
