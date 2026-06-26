import { useEffect, useMemo, useState } from "react";
import {
  FaArrowUp,
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaGithub,
  FaGlobe,
  FaMediumM,
  FaPinterestP,
  FaRedditAlien,
  FaSnapchatGhost,
  FaSpotify,
  FaTelegramPlane,
  FaTwitch,
  FaBell,
  FaBuilding,
  FaAmbulance,
  FaBaby,
  FaBrain,
  FaClinicMedical,
  FaHeartbeat,
  FaHospital,
  FaMicroscope,
  FaNotesMedical,
  FaPills,
  FaStethoscope,
  FaTooth,
  FaUserMd,
  FaXRay,
  FaCalendarAlt,
  FaCarSide,
  FaChartLine,
  FaCheckCircle,
  FaClipboardCheck,
  FaClock,
  FaCrosshairs,
  FaEnvelope,
  FaFacebookF,
  FaFileAlt,
  FaFingerprint,
  FaHardHat,
  FaHeadset,
  FaHome,
  FaIdBadge,
  FaInstagram,
  FaLinkedinIn,
  FaLock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRoute,
  FaSchool,
  FaShieldAlt,
  FaStore,
  FaTiktok,
  FaUserShield,
  FaUsers,
  FaVideo,
  FaWarehouse,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";
import ulterspaceLogo from "../../../assets/logo.gif";
import {
  CONSTRUCTION_IMAGE_PACKS,
  CONSTRUCTION_PRESETS,
  CONSTRUCTION_SOCIAL_DEFAULTS,
  CONSTRUCTION_THEMES,
} from "./constructionPresets";
import { normalizeConstructionContent } from "./constructionFallbacks";
import "./construction-shared.css";

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Sectors" },
  { key: "operations", label: "Project Process" },
  { key: "contact", label: "Contact" },
];


const CONSTRUCTION_PAGE_KEYS = new Set(NAV_ITEMS.map((item) => item.key));


const CONSTRUCTION_HERO_VARIANT_ALIASES = {
  "contractor-command": "care-split",
  "infrastructure-grid": "smile-panel",
  "blueprint-studio": "consultant-card",
  "residential-showcase": "recovery-flow",
  "commercial-tower": "wellness-retreat",
  "renovation-before-after": "family-care",
  "roofing-elevation": "hospital-network",
  "engineering-control": "lab-dashboard",
  "materials-yard": "calm-space",
  "pmo-dashboard": "build-supply",
  "agri-supply": "build-supply",
};

const resolveConstructionHeroVariant = (variant) =>
  CONSTRUCTION_HERO_VARIANT_ALIASES[variant] || variant;


const CONSTRUCTION_SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  x: FaXTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
  threads: FaThreads,
  telegram: FaTelegramPlane,
  snapchat: FaSnapchatGhost,
  pinterest: FaPinterestP,
  discord: FaDiscord,
  github: FaGithub,
  behance: FaBehance,
  dribbble: FaDribbble,
  medium: FaMediumM,
  reddit: FaRedditAlien,
  twitch: FaTwitch,
  spotify: FaSpotify,
  website: FaGlobe,
  email: FaEnvelope,
  phone: FaPhoneAlt,
};

const CONSTRUCTION_SOCIAL_STYLE_DEFAULTS = {
  facebook: { label: "Facebook", enabled: false, url: "", colorMode: "original", originalColor: "#1877f2", monoColor: "#ffffff", color: "#1877f2" },
  instagram: { label: "Instagram", enabled: false, url: "", colorMode: "original", originalColor: "#e4405f", monoColor: "#ffffff", color: "#e4405f" },
  x: { label: "X", enabled: false, url: "", colorMode: "original", originalColor: "#ffffff", monoColor: "#ffffff", color: "#ffffff" },
  youtube: { label: "YouTube", enabled: false, url: "", colorMode: "original", originalColor: "#ff0000", monoColor: "#ffffff", color: "#ff0000" },
  tiktok: { label: "TikTok", enabled: false, url: "", colorMode: "original", originalColor: "#ffffff", monoColor: "#ffffff", color: "#ffffff" },
  linkedin: { label: "LinkedIn", enabled: false, url: "", colorMode: "original", originalColor: "#0a66c2", monoColor: "#ffffff", color: "#0a66c2" },
  whatsapp: { label: "WhatsApp", enabled: false, url: "", colorMode: "original", originalColor: "#25d366", monoColor: "#ffffff", color: "#25d366" },
  threads: { label: "Threads", enabled: false, url: "", colorMode: "original", originalColor: "#ffffff", monoColor: "#ffffff", color: "#ffffff" },
  telegram: { label: "Telegram", enabled: false, url: "", colorMode: "original", originalColor: "#26a5e4", monoColor: "#ffffff", color: "#26a5e4" },
  snapchat: { label: "Snapchat", enabled: false, url: "", colorMode: "original", originalColor: "#fffc00", monoColor: "#ffffff", color: "#fffc00" },
  pinterest: { label: "Pinterest", enabled: false, url: "", colorMode: "original", originalColor: "#e60023", monoColor: "#ffffff", color: "#e60023" },
  discord: { label: "Discord", enabled: false, url: "", colorMode: "original", originalColor: "#5865f2", monoColor: "#ffffff", color: "#5865f2" },
  github: { label: "GitHub", enabled: false, url: "", colorMode: "original", originalColor: "#ffffff", monoColor: "#ffffff", color: "#ffffff" },
  behance: { label: "Behance", enabled: false, url: "", colorMode: "original", originalColor: "#1769ff", monoColor: "#ffffff", color: "#1769ff" },
  dribbble: { label: "Dribbble", enabled: false, url: "", colorMode: "original", originalColor: "#ea4c89", monoColor: "#ffffff", color: "#ea4c89" },
  medium: { label: "Medium", enabled: false, url: "", colorMode: "original", originalColor: "#ffffff", monoColor: "#ffffff", color: "#ffffff" },
  reddit: { label: "Reddit", enabled: false, url: "", colorMode: "original", originalColor: "#ff4500", monoColor: "#ffffff", color: "#ff4500" },
  twitch: { label: "Twitch", enabled: false, url: "", colorMode: "original", originalColor: "#9146ff", monoColor: "#ffffff", color: "#9146ff" },
  spotify: { label: "Spotify", enabled: false, url: "", colorMode: "original", originalColor: "#1db954", monoColor: "#ffffff", color: "#1db954" },
  website: { label: "Website", enabled: false, url: "", colorMode: "original", originalColor: "#2563eb", monoColor: "#ffffff", color: "#2563eb" },
  email: { label: "Email", enabled: false, url: "", colorMode: "mono", originalColor: "#ffffff", monoColor: "#ffffff", color: "#ffffff" },
  phone: { label: "Phone", enabled: false, url: "", colorMode: "mono", originalColor: "#ffffff", monoColor: "#ffffff", color: "#ffffff" },
};

const CONSTRUCTION_SOCIAL_PRESET_FALLBACKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  x: "https://x.com",
  youtube: "https://youtube.com",
  tiktok: "https://tiktok.com",
  linkedin: "https://linkedin.com",
  whatsapp: "https://wa.me/27000000000",
  threads: "https://threads.net",
  telegram: "https://t.me/yourusername",
  snapchat: "https://snapchat.com",
  pinterest: "https://pinterest.com",
  discord: "https://discord.com",
  github: "https://github.com",
  behance: "https://behance.net",
  dribbble: "https://dribbble.com",
  medium: "https://medium.com",
  reddit: "https://reddit.com",
  twitch: "https://twitch.tv",
  spotify: "https://open.spotify.com",
  website: "https://constructionenterprise.co.za",
  email: "mailto:projects@constructiongroup.co.za",
  phone: "tel:+27000000000",
};

const CONSTRUCTION_SOCIAL_ORDER = [
  "facebook",
  "instagram",
  "x",
  "youtube",
  "tiktok",
  "linkedin",
  "whatsapp",
  "threads",
  "telegram",
  "snapchat",
  "pinterest",
  "discord",
  "github",
  "behance",
  "dribbble",
  "medium",
  "reddit",
  "twitch",
  "spotify",
  "website",
  "email",
  "phone",
];

const CONSTRUCTION_BRAND_ICONS = {
  general: FaHardHat,
  civil: FaRoute,
  architecture: FaBuilding,
  residential: FaHome,
  commercial: FaWarehouse,
  renovation: FaClipboardCheck,
  roofing: FaBuilding,
  engineering: FaChartLine,
  materials: FaWarehouse,
  management: FaUsers,
};

const CONSTRUCTION_SNAPSHOT_ICONS = {
  general: [FaHardHat, FaClipboardCheck, FaClock, FaCheckCircle],
  civil: [FaRoute, FaHardHat, FaFileAlt, FaCheckCircle],
  architecture: [FaBuilding, FaCrosshairs, FaClipboardCheck, FaCheckCircle],
  residential: [FaHome, FaUsers, FaClipboardCheck, FaCheckCircle],
  commercial: [FaWarehouse, FaBuilding, FaClock, FaCheckCircle],
  renovation: [FaClipboardCheck, FaHome, FaHeadset, FaCheckCircle],
  roofing: [FaBuilding, FaHardHat, FaCrosshairs, FaCheckCircle],
  engineering: [FaChartLine, FaFileAlt, FaHardHat, FaCheckCircle],
  materials: [FaWarehouse, FaRoute, FaHeadset, FaCheckCircle],
  management: [FaUsers, FaClipboardCheck, FaChartLine, FaCheckCircle],
};

const CONSTRUCTION_PROCESS_ICONS = {
  general: [FaClipboardCheck, FaHardHat, FaClock, FaCheckCircle],
  civil: [FaFileAlt, FaRoute, FaHardHat, FaCheckCircle],
  architecture: [FaCrosshairs, FaBuilding, FaClipboardCheck, FaCheckCircle],
  residential: [FaHome, FaUsers, FaHardHat, FaCheckCircle],
  commercial: [FaWarehouse, FaFileAlt, FaClock, FaCheckCircle],
  renovation: [FaClipboardCheck, FaHome, FaHeadset, FaCheckCircle],
  roofing: [FaCrosshairs, FaBuilding, FaHardHat, FaCheckCircle],
  engineering: [FaFileAlt, FaChartLine, FaHardHat, FaCheckCircle],
  materials: [FaWarehouse, FaRoute, FaHeadset, FaCheckCircle],
  management: [FaUsers, FaClipboardCheck, FaChartLine, FaCheckCircle],
};

const CONSTRUCTION_TOP_SCROLL_ICONS = {
  general: FaHardHat,
  civil: FaRoute,
  architecture: FaBuilding,
  residential: FaHome,
  commercial: FaWarehouse,
  renovation: FaClipboardCheck,
  roofing: FaBuilding,
  engineering: FaChartLine,
  materials: FaWarehouse,
  management: FaUsers,
};

const SERVICE_ICON_RULES = [
  [["construction", "building", "site", "contractor"], FaHardHat],
  [["civil", "road", "infrastructure", "earthworks"], FaRoute],
  [["architecture", "design", "blueprint", "plan"], FaBuilding],
  [["residential", "home", "housing", "estate"], FaHome],
  [["commercial", "office", "retail", "warehouse"], FaWarehouse],
  [["renovation", "remodel", "fit-out", "upgrade"], FaClipboardCheck],
  [["roof", "steel", "cladding", "structure"], FaBuilding],
  [["engineering", "quantity", "survey", "quality"], FaChartLine],
  [["materials", "plant", "equipment", "supply"], FaWarehouse],
  [["management", "programme", "risk", "coordination"], FaUsers],
  [["quote", "tender", "estimate"], FaFileAlt],
  [["inspection", "compliance", "handover"], FaClipboardCheck],
];

const INDUSTRY_ICON_RULES = [
  [["residential", "homeowners", "estates"], FaHome],
  [["commercial", "retail", "office"], FaBuilding],
  [["industrial", "warehouses", "logistics"], FaWarehouse],
  [["public", "municipal", "infrastructure"], FaRoute],
  [["developers", "property"], FaUsers],
  [["mining", "energy", "utilities"], FaHardHat],
  [["hospitality", "healthcare", "education"], FaBuilding],
  [["materials", "plant"], FaWarehouse],
];



const pickIconFromRules = (value, rules, fallbackIcon = FaShieldAlt) => {
  const searchValue = String(value || "").toLowerCase();
  const match = rules.find(([keywords]) =>
    keywords.some((keyword) => searchValue.includes(keyword)),
  );

  return match?.[1] || fallbackIcon;
};

const getServiceIcon = (title) =>
  pickIconFromRules(title, SERVICE_ICON_RULES, FaShieldAlt);

const getIndustryIcon = (title) =>
  pickIconFromRules(title, INDUSTRY_ICON_RULES, FaBuilding);

const getSnapshotIcon = (preset, index) => {
  const icons = CONSTRUCTION_SNAPSHOT_ICONS[preset.structure] || CONSTRUCTION_SNAPSHOT_ICONS.construction;
  return icons[index % icons.length] || FaCheckCircle;
};

const getProcessIcon = (preset, index) => {
  const icons = CONSTRUCTION_PROCESS_ICONS[preset.structure] || CONSTRUCTION_PROCESS_ICONS.construction;
  return icons[index % icons.length] || FaClipboardCheck;
};

const getSavedConstructionConfig = (settings, preset) => {
  const saved = settings.construction_config || settings.template_config?.construction || settings.templateConfig?.construction || {};

  return {
    theme: saved.theme || preset.theme,
    accent: saved.accent || "",
    imagePack: saved.imagePack || preset.imagePack,
    structure: saved.structure || preset.structure,
    navbarVariant: saved.navbarVariant || preset.navbarVariant,
    heroVariant: saved.heroVariant || preset.heroVariant,
    vmvVariant: saved.vmvVariant || preset.vmvVariant,
    cardVariant: saved.cardVariant || preset.cardVariant,
    footerVariant: saved.footerVariant || preset.footerVariant,
    formVariant: saved.formVariant || preset.formVariant,
    slides: Array.isArray(saved.slides) && saved.slides.length ? saved.slides : null,
  };
};

const makeThemeStyle = (config) => {
  const baseTheme = CONSTRUCTION_THEMES[config.theme] || CONSTRUCTION_THEMES.construction;
  const accent = config.accent || baseTheme.accent;

  return {
    "--construction-primary": baseTheme.primary,
    "--construction-secondary": baseTheme.secondary,
    "--construction-accent": accent,
    "--construction-accent-2": baseTheme.accent2,
    "--construction-surface": baseTheme.surface,
    "--construction-card": baseTheme.card,
    "--construction-text": baseTheme.text,
    "--construction-muted": baseTheme.muted,
    "--construction-line": baseTheme.line,
  };
};

const getImagePack = (config) => CONSTRUCTION_IMAGE_PACKS[config.imagePack] || CONSTRUCTION_IMAGE_PACKS.general;

const normalizeConstructionPageKey = (value) => {
  const rawValue = typeof value === "string" ? value : "";
  const cleanValue = rawValue
    .replace(/^#/, "")
    .split("?")[0]
    .split("#")[0]
    .replace(/^site\/[^/]+\/?/, "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();

  if (!cleanValue || cleanValue === "home") return "home";

  const firstSegment = cleanValue.split("/")[0];

  return CONSTRUCTION_PAGE_KEYS.has(firstSegment) ? firstSegment : "home";
};

const pageKeyFromPage = (page) => {
  if (!page) return "home";

  if (typeof page === "string") {
    return normalizeConstructionPageKey(page);
  }

  return normalizeConstructionPageKey(
    page.slug || page.href || page.path || page.key || page.page_key || page.id || "home",
  );
};

const scrollPageTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const getSocialIconColor = (data = {}) => {
  const mode = data.colorMode || "original";

  if (mode === "mono") {
    return data.monoColor || "#ffffff";
  }

  return data.originalColor || data.color || "#ffffff";
};


const resolveSavedSocialData = (savedLinks, key) => {
  if (!savedLinks || typeof savedLinks !== "object") return {};

  const savedValue = savedLinks[key];

  if (savedValue === undefined || savedValue === null) return {};

  if (typeof savedValue === "string") {
    return { enabled: true, url: savedValue };
  }

  if (typeof savedValue === "object" && !Array.isArray(savedValue)) {
    return savedValue;
  }

  return {};
};

const hasSavedSocialData = (savedLinks, key) => {
  return Boolean(
    savedLinks &&
      typeof savedLinks === "object" &&
      Object.prototype.hasOwnProperty.call(savedLinks, key),
  );
};

const getContactSocialUrl = (key, contact = {}) => {
  if (key === "email") return contact.email ? `mailto:${contact.email}` : "";
  if (key === "phone") return contact.phone ? `tel:${contact.phone}` : "";
  if (key === "whatsapp") {
    const phone = String(contact.phone || "").replace(/[^0-9]/g, "");
    return phone ? `https://wa.me/${phone}` : "";
  }
  return "";
};

const getSocialKeys = (presetItems, savedLinks, socialDisplay) => {
  const displayOrder = Array.isArray(socialDisplay?.order) ? socialDisplay.order : [];
  const presetKeys = presetItems.map((item) => item.key).filter(Boolean);
  const savedKeys = savedLinks && typeof savedLinks === "object" ? Object.keys(savedLinks) : [];

  return Array.from(
    new Set([
      ...displayOrder,
      ...presetKeys,
      ...savedKeys,
      ...CONSTRUCTION_SOCIAL_ORDER,
    ]),
  ).filter((key) => CONSTRUCTION_SOCIAL_ICONS[key]);
};

const mergeSocialLinks = (
  defaultItems = [],
  savedLinks = {},
  contact = {},
  socialDisplay = {},
) => {
  const presetItems = Array.isArray(defaultItems) ? defaultItems : [];
  const keys = getSocialKeys(presetItems, savedLinks, socialDisplay);

  return keys
    .map((key) => {
      const presetItem = presetItems.find((item) => item.key === key) || {};
      const savedItem = resolveSavedSocialData(savedLinks, key);
      const baseItem = CONSTRUCTION_SOCIAL_STYLE_DEFAULTS[key] || {};
      const presetExists = Boolean(presetItem.key);
      const savedExists = hasSavedSocialData(savedLinks, key);

      if (!presetExists && !savedExists) return null;

      const data = {
        ...baseItem,
        ...(presetExists ? { enabled: true } : {}),
        ...presetItem,
        ...savedItem,
        key,
        label: savedItem.label || presetItem.label || baseItem.label || key,
      };

      const contactUrl = getContactSocialUrl(key, contact);
      data.url = savedItem.url || presetItem.url || contactUrl || CONSTRUCTION_SOCIAL_PRESET_FALLBACKS[key] || baseItem.url || "";

      if (data.enabled === false || !data.url) return null;

      return {
        ...data,
        Icon: CONSTRUCTION_SOCIAL_ICONS[key],
        color: getSocialIconColor(data),
      };
    })
    .filter(Boolean);
};

function ConstructionTopbar({ content, preset }) {
  const showSocials = content.socialDisplay?.topbar !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        CONSTRUCTION_SOCIAL_DEFAULTS[preset.contentKey] || CONSTRUCTION_SOCIAL_DEFAULTS.construction,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <div className="construction-topbar">
      <div className="construction-topbar-left">
        <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
        <span className="construction-topbar-sep">|</span>
        <a href={`mailto:${content.contact.email}`}><FaEnvelope /> {content.contact.email}</a>
        <span className="construction-topbar-hours"><FaClock /> {content.contact.hours}</span>
      </div>
      {showSocials && socials.length > 0 && (
        <div className="construction-topbar-social" aria-label="Social media links">
          {socials.map(({ key, label, url, Icon, color }) => (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="construction-social-icons"
              aria-label={label}
              onClick={(event) => !url && event.preventDefault()}
            >
              <Icon style={{ color }} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ConstructionNavbar({ content, config, currentPage, onPageChange, preset }) {
  const [open, setOpen] = useState(false);
  const BrandIcon = CONSTRUCTION_BRAND_ICONS[preset.contentKey] || FaShieldAlt;
  const navVariant = config.navbarVariant || preset.navbarVariant || "boardroom";
  const navLabel = {
    general: "General Contractor",
    civil: "Civil Infrastructure",
    architecture: "Design & Build",
    residential: "Residential Builds",
    commercial: "Commercial Works",
    renovation: "Renovation Studio",
    roofing: "Roofing & Steel",
    engineering: "Engineering Works",
    materials: "Materials & Plant",
    management: "Project Management",
  }[preset.structure] || "Construction Services";

  const handleNavigate = (pageKey) => {
    setOpen(false);
    onPageChange(pageKey);
  };

  return (
    <header className={`construction-navbar construction-navbar--${navVariant} construction-navbar--structure-${preset.structure}`}>
      <button type="button" className="construction-brand" onClick={() => handleNavigate("home")}>
        <span className="construction-brand-mark"><BrandIcon /></span>
        <span className="construction-brand-copy">
          <strong>{content.businessName}</strong>
          <small>{content.motto}</small>
        </span>
      </button>

      <button
        type="button"
        className={`construction-menu-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="construction-nav-center">
        <span className="construction-nav-eyebrow">{navLabel}</span>
        <nav className={`construction-nav-links ${open ? "is-open" : ""}`} aria-label="Construction site navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={currentPage === item.key ? "active" : ""}
              onClick={() => handleNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="construction-nav-actions">
        <span className="construction-nav-support">{content.contact.phone}</span>
        <button type="button" className="construction-nav-cta" onClick={() => handleNavigate("contact")}>
          {content.heroCta || "Request Project Quote"}
        </button>
      </div>
    </header>
  );
}

function ConstructionHeroVisual({ content, images, activeSlide, config, preset, onPageChange }) {
  const variant = resolveConstructionHeroVariant(config.heroVariant || preset.heroVariant || "care-split");
  const gallery = Array.isArray(images.gallery) && images.gallery.length ? images.gallery : [images.hero, images.about, images.page].filter(Boolean);
  const stats = content.stats.slice(0, 4);
  const services = content.services.slice(0, 4);
  const solutions = content.solutions.slice(0, 4);
  const process = content.process.slice(0, 4);
  const industries = content.industries.slice(0, 5);
  const packages = content.packages.slice(0, 3);
  const BrandIcon = CONSTRUCTION_BRAND_ICONS[preset.contentKey] || FaHardHat;

  if (variant === "care-split") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--care-split" aria-label="Construction operations overview">
        <div className="construction-care-split-header">
          <span className="construction-panel-label"><FaHardHat /> Project Command</span>
          <strong>{content.contact.hours}</strong>
          <p>{content.contactIntro}</p>
        </div>
        <div className="construction-care-split-grid">
          {services.slice(0, 3).map((service, index) => (
            <article key={service.title}>
              <span>0{index + 1}</span>
              <strong>{service.title}</strong>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
        <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
      </aside>
    );
  }

  if (variant === "smile-panel") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--smile-panel" aria-label="Project showcase preview">
        <span className="construction-panel-label"><FaBuilding /> Build Studio</span>
        <div className="construction-smile-gallery">
          {gallery.slice(0, 2).map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" />
          ))}
        </div>
        <div className="construction-smile-services">
          {services.slice(0, 3).map((service) => <span key={service.title}>{service.title}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "consultant-card") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--consultant-card" aria-label="Preconstruction desk card">
        <div className="construction-specialist-card-main">
          <span className="construction-panel-label"><FaFileAlt /> Preconstruction Desk</span>
          <strong>{content.businessName}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="construction-specialist-stats">
          {stats.map(([value, label]) => (
            <article key={`${value}-${label}`}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  if (variant === "recovery-flow") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--recovery-flow" aria-label="Construction programme track">
        <span className="construction-panel-label"><FaClipboardCheck /> Construction Stages</span>
        <div className="construction-recovery-track">
          {process.map((item, index) => (
            <article key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  if (variant === "wellness-retreat") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--wellness-retreat" aria-label="Quality delivery preview">
        <div className="construction-wellness-orbit">
          <span className="construction-panel-label"><FaCheckCircle /> Quality Delivery</span>
          <strong>{content.tagline}</strong>
          <p>{content.vision}</p>
        </div>
        <div className="construction-wellness-tags">
          {solutions.map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "family-care") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--family-care" aria-label="Client delivery card">
        <span className="construction-panel-label"><FaHome /> Client Delivery</span>
        <div className="construction-family-card">
          <img src={activeSlide?.image || images.hero} alt="" />
          <div>
            <strong>{content.businessName}</strong>
            <p>{content.heroSubtitle}</p>
          </div>
        </div>
        <div className="construction-family-pills">
          {industries.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "hospital-network") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--hospital-network" aria-label="Site command dashboard">
        <span className="construction-panel-label"><FaHardHat /> Site Command</span>
        <div className="construction-hospital-grid">
          {stats.map(([value, label]) => (
            <article key={`${value}-${label}`}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <div className="construction-hospital-alert">
          <FaHardHat />
          <p>{content.contact.hours}</p>
        </div>
      </aside>
    );
  }

  if (variant === "lab-dashboard") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--lab-dashboard" aria-label="Quality control dashboard">
        <span className="construction-panel-label"><FaClipboardCheck /> Quality Control</span>
        <div className="construction-lab-window">
          <div className="construction-window-dots"><span /><span /><span /></div>
          {services.slice(0, 4).map((service) => (
            <article key={service.title}>
              <FaCheckCircle />
              <div>
                <strong>{service.title}</strong>
                <p>{service.text}</p>
              </div>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  if (variant === "calm-space") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--calm-space" aria-label="Materials and delivery space">
        <div className="construction-calm-card">
          <span className="construction-panel-label"><FaBuilding /> Built Environment</span>
          <strong>{content.vision}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="construction-calm-steps">
          {process.slice(0, 3).map((item, index) => (
            <article key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  if (variant === "build-supply") {
    return (
      <aside className="construction-hero-visual construction-hero-visual--build-supply" aria-label="Construction supply panel">
        <span className="construction-panel-label"><FaWarehouse /> Materials Yard</span>
        <div className="construction-build-supply-grid">
          {packages.map((item) => (
            <article key={item.title}>
              <FaClipboardCheck />
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
      </aside>
    );
  }

  return (
    <aside className="construction-hero-visual construction-hero-visual--care-split" aria-label="Construction highlights">
      <span className="construction-panel-label"><BrandIcon /> Construction Snapshot</span>
      <div className="construction-care-split-grid">
        {stats.map(([value, label]) => (
          <article key={`${value}-${label}`}>
            <span>{value}</span>
            <strong>{label}</strong>
          </article>
        ))}
      </div>
    </aside>
  );
}

function ConstructionHero({ content, images, config, preset, onPageChange }) {
  const slides = config.slides || images.slides || [{ type: "image", title: content.heroTitle, subtitle: content.heroSubtitle, image: images.hero }];
  const [index, setIndex] = useState(0);
  const activeSlide = slides[index] || slides[0];
  const variant = config.heroVariant || preset.heroVariant || "boardroom-split";

  useEffect(() => {
    if (!slides.length || slides.length === 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6800);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const go = (direction) => {
    setIndex((current) => {
      if (direction === "prev") return current === 0 ? slides.length - 1 : current - 1;
      return (current + 1) % slides.length;
    });
  };

  return (
    <section className={`construction-hero construction-hero--${variant} construction-hero--structure-${preset.structure}`}>
      <div className="construction-hero-media" aria-hidden="true">
        {activeSlide?.type === "video" && activeSlide.video ? (
          <video key={activeSlide.video} autoPlay muted loop playsInline poster={activeSlide.image}>
            <source src={activeSlide.video} type="video/mp4" />
          </video>
        ) : (
          <img src={activeSlide?.image || images.hero} alt="" />
        )}
        <span className="construction-hero-overlay" />
      </div>

      <div className="construction-hero-content">
        <span className="construction-kicker">{preset.name}</span>
        <h1>{activeSlide?.title || content.heroTitle}</h1>
        <p>{activeSlide?.subtitle || content.heroSubtitle}</p>
        <div className="construction-hero-actions">
          <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
          <button type="button" className="ghost" onClick={() => onPageChange("services")}>{content.heroSecondaryCta}</button>
        </div>
      </div>

      <ConstructionHeroVisual
        content={content}
        images={images}
        activeSlide={activeSlide}
        config={config}
        preset={preset}
        onPageChange={onPageChange}
      />

      {slides.length > 1 && (
        <div className="construction-slider-controls" aria-label="Hero slideshow controls">
          <button type="button" onClick={() => go("prev")} aria-label="Previous slide">‹</button>
          <div>
            {slides.map((slide, dotIndex) => (
              <button
                type="button"
                key={`${slide.title}-${dotIndex}`}
                className={dotIndex === index ? "active" : ""}
                onClick={() => setIndex(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            ))}
          </div>
          <button type="button" onClick={() => go("next")} aria-label="Next slide">›</button>
        </div>
      )}
    </section>
  );
}

function ConstructionPageHeader({ title, subtitle, images, preset }) {
  return (
    <section className="construction-page-header">
      <img src={images.page} alt="" aria-hidden="true" />
      <span className="construction-page-overlay" />
      <div>
        <span className="construction-kicker">{preset.name}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function TrustStrip({ content, preset }) {
  return (
    <section className="construction-trust-strip">
      {content.stats.map(([value, label], statIndex) => {
        const SnapshotIcon = getSnapshotIcon(preset, statIndex);

        return (
          <article key={`${value}-${label}`}>
            <SnapshotIcon />
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        );
      })}
    </section>
  );
}

function AboutSection({ content, images, preset }) {
  return (
    <section className={`construction-section construction-about construction-about--${preset.structure}`}>
      <div className="construction-section-copy">
        <span className="construction-kicker">About The Company</span>
        <h2>{content.aboutTitle}</h2>
        <p>{content.aboutText}</p>
        <div className="construction-feature-cloud">
          {content.features.slice(0, 6).map((feature) => <span key={feature}>{feature}</span>)}
        </div>
      </div>
      <div className="construction-image-card">
        <img src={images.about} alt="Construction operations" />
      </div>
    </section>
  );
}

function VisionMissionValues({ content, config }) {
  return (
    <section className={`construction-vmv construction-vmv--${config.vmvVariant}`}>
      <article>
        <span>Vision</span>
        <p>{content.vision}</p>
      </article>
      <article>
        <span>Mission</span>
        <p>{content.mission}</p>
      </article>
      <article>
        <span>Values</span>
        <ul>{content.values.map((value) => <li key={value}>{value}</li>)}</ul>
      </article>
    </section>
  );
}

function ServicesSection({ content, config, preset }) {
  return (
    <section className="construction-section">
      <div className="construction-section-heading">
        <span className="construction-kicker">Construction Services</span>
        <h2>Professional services configured around the client’s goals, sector and growth stage.</h2>
        <p>Each service card can be edited through the same builder fields and fallback system.</p>
      </div>
      <div className={`construction-cards construction-cards--${config.cardVariant}`}>
        {content.services.map((service) => {
          const ServiceIcon = getServiceIcon(service.title, preset);

          return (
            <article key={service.title} className="construction-card">
              <span className="construction-card-index"><ServiceIcon /></span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function IndustriesSection({ content }) {
  return (
    <section className="construction-section construction-industries">
      <div className="construction-section-heading">
        <span className="construction-kicker">Industries</span>
        <h2>Built for real construction clients and different operating environments.</h2>
      </div>
      <div className="construction-industries-grid">
        {content.industries.map((item) => {
          const IndustryIcon = getIndustryIcon(item);

          return (
            <article key={item}>
              <IndustryIcon />
              <span>{item}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PackagesSection({ content, preset, onPageChange }) {
  return (
    <section className={`construction-section construction-packages construction-packages--${preset.structure}`}>
      <div className="construction-section-heading">
        <span className="construction-kicker">Recommended Packages</span>
        <h2>Clear packages help customers understand what to request.</h2>
      </div>
      <div className="construction-package-grid">
        {content.packages.map((item) => (
          <article key={item.title}>
            <FaClipboardCheck className="construction-package-icon" />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <button type="button" onClick={() => onPageChange("contact")}>Enquire About This</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function OperationsSection({ content, preset }) {
  return (
    <section className={`construction-section construction-process construction-process--${preset.structure}`}>
      <div className="construction-section-heading">
        <span className="construction-kicker">Operational Method</span>
        <h2>A professional process from assessment to reporting.</h2>
      </div>
      <div className="construction-process-list">
        {content.process.map((item, index) => {
          const ProcessIcon = getProcessIcon(preset, index);

          return (
            <article key={item}>
              <span className="construction-process-icon"><ProcessIcon /></span>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <p>{item}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SolutionsSection({ content, preset }) {
  return (
    <section className={`construction-section construction-solutions construction-solutions--${preset.structure}`}>
      <div className="construction-section-heading">
        <span className="construction-kicker">Solutions</span>
        <h2>Focused solutions for the most common construction requests.</h2>
      </div>
      <div className="construction-solution-list">
        {content.solutions.map((item, index) => (
          <article key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <FaCrosshairs className="construction-solution-icon" />
            <strong>{item}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ images }) {
  return (
    <section className="construction-gallery">
      {images.gallery.map((image, index) => (
        <img key={`${image}-${index}`} src={image} alt="Construction company visual" />
      ))}
    </section>
  );
}

function TestimonialsSection({ content }) {
  return (
    <section className="construction-testimonials">
      {content.testimonials.map((item) => (
        <blockquote key={item.quote}>
          <p>“{item.quote}”</p>
          <cite>{item.author}</cite>
        </blockquote>
      ))}
    </section>
  );
}

function ContactFormFields({ variant }) {
  const common = (
    <>
      <input name="name" placeholder="Name / contact person" autoComplete="name" required />
      <input name="email" type="email" placeholder="Email address" autoComplete="email" required />
      <input name="phone" placeholder="Phone number" autoComplete="tel" required />
      <input name="company" placeholder="Company / developer name" autoComplete="organization" />
      <input name="site_location" placeholder="Site location / suburb" autoComplete="address-level2" />
    </>
  );

  if (variant === "civil-tender") {
    return (
      <>
        {common}
        <select name="civil_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Civil works required</option>
          <option>Roadworks / paving</option>
          <option>Bulk earthworks</option>
          <option>Stormwater and drainage</option>
          <option>Infrastructure maintenance</option>
        </select>
        <input name="tender_deadline" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Share scope, tender timing, site access and documents available" rows="5" />
      </>
    );
  }

  if (variant === "design-build") {
    return (
      <>
        {common}
        <select name="design_stage" defaultValue="" autoComplete="off">
          <option value="" disabled>Project stage</option>
          <option>Concept / feasibility</option>
          <option>Architectural design</option>
          <option>Plans ready for pricing</option>
          <option>Design-and-build partner needed</option>
        </select>
        <input name="project_size" placeholder="Approximate size / m²" autoComplete="off" />
        <textarea name="message" placeholder="Describe your design vision, site and required delivery timeline" rows="5" />
      </>
    );
  }

  if (variant === "residential-build") {
    return (
      <>
        {common}
        <select name="home_service" defaultValue="" autoComplete="off">
          <option value="" disabled>Residential service</option>
          <option>New home build</option>
          <option>Townhouse / estate construction</option>
          <option>Extension or addition</option>
          <option>Luxury finish consultation</option>
        </select>
        <input name="preferred_start" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Tell us about bedrooms, finishes, plans and your preferred build timing" rows="5" />
      </>
    );
  }

  if (variant === "commercial-fitout") {
    return (
      <>
        {common}
        <select name="commercial_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Commercial scope</option>
          <option>Office fit-out</option>
          <option>Retail construction</option>
          <option>Warehouse / industrial build</option>
          <option>Tenant improvement</option>
        </select>
        <input name="handover_date" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Share floor area, current state, deadline and operational constraints" rows="5" />
      </>
    );
  }

  if (variant === "renovation-quote") {
    return (
      <>
        {common}
        <select name="renovation_type" defaultValue="" autoComplete="off">
          <option value="" disabled>Renovation type</option>
          <option>Kitchen / interior upgrade</option>
          <option>Bathroom remodel</option>
          <option>Full property refurbishment</option>
          <option>Insurance / damage repair</option>
        </select>
        <input name="property_type" placeholder="Property type" autoComplete="off" />
        <textarea name="message" placeholder="Describe what must be repaired, upgraded or remodelled" rows="5" />
      </>
    );
  }

  if (variant === "roofing-steel") {
    return (
      <>
        {common}
        <select name="roofing_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Roofing / steel need</option>
          <option>New roof installation</option>
          <option>Roof repair / waterproofing</option>
          <option>Structural steel</option>
          <option>Cladding / sheeting</option>
        </select>
        <input name="roof_area" placeholder="Approximate roof area / structure size" autoComplete="off" />
        <textarea name="message" placeholder="Share measurements, roof type, access and urgency" rows="5" />
      </>
    );
  }

  if (variant === "engineering-support") {
    return (
      <>
        {common}
        <select name="engineering_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Engineering support</option>
          <option>Structural assessment</option>
          <option>Quantity surveying</option>
          <option>Quality inspection</option>
          <option>Construction methodology review</option>
        </select>
        <input name="document_status" placeholder="Drawings / BOQ available?" autoComplete="off" />
        <textarea name="message" placeholder="Tell us what needs to be assessed, measured or verified" rows="5" />
      </>
    );
  }

  if (variant === "materials-plant") {
    return (
      <>
        {common}
        <select name="materials_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Materials / plant need</option>
          <option>Building materials quote</option>
          <option>Plant hire</option>
          <option>Concrete / aggregate supply</option>
          <option>Delivery logistics</option>
        </select>
        <input name="delivery_date" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Share quantities, delivery address, timing and site restrictions" rows="5" />
      </>
    );
  }

  if (variant === "project-management") {
    return (
      <>
        {common}
        <select name="management_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Management support</option>
          <option>Project planning</option>
          <option>Site coordination</option>
          <option>Cost and programme control</option>
          <option>Owner's representative</option>
        </select>
        <input name="project_value" placeholder="Approximate project value / budget" autoComplete="off" />
        <textarea name="message" placeholder="Share the project status, stakeholders and support required" rows="5" />
      </>
    );
  }

  return (
    <>
      {common}
      <input name="preferred_date" type="date" autoComplete="off" />
      <select name="project_type" defaultValue="" autoComplete="off">
        <option value="" disabled>Project type</option>
        <option>New construction</option>
        <option>Civil works</option>
        <option>Renovation / fit-out</option>
        <option>Materials / plant support</option>
      </select>
      <textarea name="message" placeholder="Briefly describe the scope, timeline, site and documents available" rows="5" />
    </>
  );
}

function ContactSection({ content, config }) {
  const email = content.contact.email || "projects@constructiongroup.co.za";
  const subject = encodeURIComponent(`${content.businessName} enquiry`);
  const mapQuery = encodeURIComponent(content.contact.mapQuery || content.contact.address || "South Africa");

  return (
    <section className={`construction-contact construction-contact--${config.formVariant}`}>
      <div className="construction-contact-copy">
        <span className="construction-kicker">Contact</span>
        <h2>{content.contactTitle}</h2>
        <p>{content.contactIntro}</p>
        <div className="construction-contact-details">
          <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
          <a href={`mailto:${email}`}><FaEnvelope /> {email}</a>
          <span><FaMapMarkerAlt /> {content.contact.address}</span>
          <span><FaClock /> {content.contact.hours}</span>
        </div>
      </div>
      <div className="construction-contact-panel">
        <form className="construction-contact-form" action={`mailto:${email}?subject=${subject}`} method="post" encType="text/plain">
          <ContactFormFields variant={config.formVariant} />
          <button type="submit">Send Construction Enquiry</button>
        </form>
        <iframe
          className="construction-map"
          title="Project office map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
        />
      </div>
    </section>
  );
}

function CTASection({ content, onPageChange }) {
  return (
    <section className="construction-cta-band">
      <div>
        <span className="construction-kicker">Next Step</span>
        <h2>Ready to help clients contact your construction enterprise?</h2>
        <p>{content.tagline}</p>
      </div>
      <button type="button" onClick={() => onPageChange("contact")}>Request Project Quote</button>
    </section>
  );
}

function ConstructionFooter({ content, config, onPageChange, preset }) {
  const showSocials = content.socialDisplay?.footer !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        CONSTRUCTION_SOCIAL_DEFAULTS[preset.contentKey] || CONSTRUCTION_SOCIAL_DEFAULTS.construction,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <footer className={`construction-footer construction-footer--${config.footerVariant}`}>
      <div className="construction-footer-main">
        <div>
          <strong>{content.businessName}</strong>
          <p>{content.tagline}</p>
          {showSocials && socials.length > 0 && (
            <div className="construction-footer-social">
              {socials.map(({ key, label, url, Icon, color }) => (
                <a
                  key={key}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="construction-social-icon"
                  aria-label={label}
                  onClick={(event) => !url && event.preventDefault()}
                >
                  <Icon style={{ color }} />
                </a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4>Pages</h4>
          {NAV_ITEMS.map((item) => (
            <button key={item.key} type="button" onClick={() => onPageChange(item.key)}>{item.label}</button>
          ))}
        </div>
        <div>
          <h4>Services</h4>
          {content.services.slice(0, 5).map((item) => <span key={item.title}>{item.title}</span>)}
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a>
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          <span>{content.contact.address}</span>
        </div>
      </div>
      <div className="construction-footer-bottom">
        <div className="construction-copyright small">
          © {new Date().getFullYear()} {content.businessName}. All rights reserved.
        </div>

        <div className="construction-powered-by">
          <span>Powered by</span>
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="construction-ulterspace-link"
          >
            <img src={ulterspaceLogo} alt="Ulterspace Logo" className="construction-ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ content, images, config, preset, onPageChange }) {
  if (preset.structure === "corporate") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <TrustStrip content={content} preset={preset} />
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <IndustriesSection content={content} />
        <OperationsSection content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "consulting") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <TestimonialsSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <CTASection content={content} onPageChange={onPageChange} />
      </>
    );
  }

  if (preset.structure === "agency") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <TestimonialsSection content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "finance") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <TrustStrip content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <OperationsSection content={content} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "executive") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <ServicesSection content={content} config={config} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <OperationsSection content={content} preset={preset} />
        <TestimonialsSection content={content} />
        <CTASection content={content} onPageChange={onPageChange} />
      </>
    );
  }

  if (preset.structure === "saas") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <TrustStrip content={content} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <GallerySection images={images} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "logistics") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <TrustStrip content={content} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <IndustriesSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "realestate") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} />
        <ServicesSection content={content} config={config} preset={preset} />
        <AboutSection content={content} images={images} preset={preset} />
        <IndustriesSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "constructioncare") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <TrustStrip content={content} preset={preset} />
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <TestimonialsSection content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "legal") {
    return (
      <>
        <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <TestimonialsSection content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  return (
    <>
      <ConstructionHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      <TrustStrip content={content} preset={preset} />
      <AboutSection content={content} images={images} preset={preset} />
      <ServicesSection content={content} config={config} preset={preset} />
      <VisionMissionValues content={content} config={config} />
      <SolutionsSection content={content} preset={preset} />
      <IndustriesSection content={content} />
      <OperationsSection content={content} preset={preset} />
      <TestimonialsSection content={content} />
      <ContactSection content={content} config={config} />
    </>
  );
}

function PageContent({ currentPage, content, images, config, preset, onPageChange }) {
  const title = NAV_ITEMS.find((item) => item.key === currentPage)?.label || "Construction";

  if (currentPage === "home") {
    return <HomePage content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />;
  }

  return (
    <>
      <ConstructionPageHeader title={title} subtitle={content.tagline} images={images} preset={preset} />
      {currentPage === "about" && (
        <>
          <AboutSection content={content} images={images} preset={preset} />
          <VisionMissionValues content={content} config={config} />
          <TestimonialsSection content={content} />
        </>
      )}
      {currentPage === "services" && (
        <>
          <ServicesSection content={content} config={config} preset={preset} />
          <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
          <CTASection content={content} onPageChange={onPageChange} />
        </>
      )}
      {currentPage === "industries" && (
        <>
          <IndustriesSection content={content} />
          <SolutionsSection content={content} preset={preset} />
          <GallerySection images={images} />
        </>
      )}
      {currentPage === "operations" && (
        <>
          <OperationsSection content={content} preset={preset} />
          <TrustStrip content={content} preset={preset} />
          <VisionMissionValues content={content} config={config} />
        </>
      )}
      {currentPage === "contact" && <ContactSection content={content} config={config} />}
    </>
  );
}


function ConstructionScrollTopButton({ preset }) {
  const [visible, setVisible] = useState(false);
  const TopIcon = FaArrowUp;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleScroll = () => {
      setVisible(window.scrollY > 420);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      className={`construction-scroll-top construction-scroll-top--${preset.structure} ${visible ? "is-visible" : ""}`}
      onClick={scrollPageTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <TopIcon />
    </button>
  );
}

export default function ConstructionRenderer({ settings = {}, preset = CONSTRUCTION_PRESETS["construction-general-v1"], page }) {
  const content = useMemo(() => normalizeConstructionContent(settings, preset), [settings, preset]);
  const config = useMemo(() => getSavedConstructionConfig(settings, preset), [settings, preset]);
  const images = useMemo(() => getImagePack(config), [config]);
  const initialPage = pageKeyFromPage(page);
  const [internalPage, setInternalPage] = useState(initialPage || "home");
  const currentPage = internalPage;

  useEffect(() => {
    if (page) setInternalPage(initialPage || "home");
  }, [page, initialPage]);

  const onPageChange = (nextPage) => {
    setInternalPage(nextPage);
    scrollPageTop();
  };

  return (
    <div className={`construction-template construction-shell--${preset.structure} construction-template--${preset.template_key}`} style={makeThemeStyle(config)}>
      <ConstructionTopbar content={content} preset={preset} />
      <ConstructionNavbar content={content} config={config} currentPage={currentPage} onPageChange={onPageChange} preset={preset} />
      <main>
        <PageContent currentPage={currentPage} content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      </main>
      <ConstructionFooter content={content} config={config} onPageChange={onPageChange} preset={preset} />
      <ConstructionScrollTopButton preset={preset} />
    </div>
  );
}
