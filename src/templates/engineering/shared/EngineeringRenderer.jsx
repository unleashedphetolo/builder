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
  ENGINEERING_IMAGE_PACKS,
  ENGINEERING_PRESETS,
  ENGINEERING_SOCIAL_DEFAULTS,
  ENGINEERING_THEMES,
} from "./engineeringPresets";
import { normalizeEngineeringContent } from "./engineeringFallbacks";
import "./engineering-shared.css";

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Sectors" },
  { key: "operations", label: "Delivery Method" },
  { key: "contact", label: "Contact" },
];


const ENGINEERING_PAGE_KEYS = new Set(NAV_ITEMS.map((item) => item.key));


const ENGINEERING_HERO_VARIANT_ALIASES = {
  "systems-console": "engineering-command",
  "bridge-analysis": "infrastructure-studio",
  "mechanical-assembly": "mechanical-lab",
  "electrical-grid": "power-grid",
  "structural-blueprint": "blueprint-review",
  "industrial-control": "operations-control",
  "automation-network": "controls-network",
  "energy-distribution": "energy-dashboard",
  "environmental-model": "environmental-model",
  "telecom-topology": "telecom-topology",
};

const resolveEngineeringHeroVariant = (variant) =>
  ENGINEERING_HERO_VARIANT_ALIASES[variant] || variant;


const ENGINEERING_SOCIAL_ICONS = {
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

const ENGINEERING_SOCIAL_STYLE_DEFAULTS = {
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

const ENGINEERING_SOCIAL_PRESET_FALLBACKS = {
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
  website: "https://engineeringenterprise.co.za",
  email: "mailto:projects@engineeringgroup.co.za",
  phone: "tel:+27000000000",
};

const ENGINEERING_SOCIAL_ORDER = [
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

const ENGINEERING_GALLERY_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80",
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=80",
];

function getGalleryImageFallback(index = 0) {
  return ENGINEERING_GALLERY_FALLBACK_IMAGES[index % ENGINEERING_GALLERY_FALLBACK_IMAGES.length];
}

function getCleanGalleryImages(images = {}) {
  const gallery = Array.isArray(images.gallery) ? images.gallery : [];
  const candidates = [...gallery, images.about, images.page, images.hero, ...ENGINEERING_GALLERY_FALLBACK_IMAGES];
  const seen = new Set();

  return candidates
    .filter((image) => typeof image === "string" && image.trim())
    .filter((image) => {
      if (seen.has(image)) return false;
      seen.add(image);
      return true;
    })
    .slice(0, 8);
}


const ENGINEERING_BRAND_ICONS = {
  consulting: FaChartLine,
  civil: FaRoute,
  mechanical: FaCrosshairs,
  electrical: FaBell,
  structural: FaBuilding,
  industrial: FaWarehouse,
  automation: FaFingerprint,
  energy: FaChartLine,
  environmental: FaSchool,
  telecom: FaVideo,
};

const ENGINEERING_SNAPSHOT_ICONS = {
  consulting: [FaChartLine, FaFileAlt, FaClipboardCheck, FaCheckCircle],
  civil: [FaRoute, FaBuilding, FaFileAlt, FaCheckCircle],
  mechanical: [FaCrosshairs, FaClipboardCheck, FaClock, FaCheckCircle],
  electrical: [FaBell, FaLock, FaFileAlt, FaCheckCircle],
  structural: [FaBuilding, FaCrosshairs, FaClipboardCheck, FaCheckCircle],
  industrial: [FaWarehouse, FaChartLine, FaUsers, FaCheckCircle],
  automation: [FaFingerprint, FaLock, FaChartLine, FaCheckCircle],
  energy: [FaChartLine, FaCheckCircle, FaFileAlt, FaClock],
  environmental: [FaSchool, FaCheckCircle, FaFileAlt, FaUsers],
  telecom: [FaVideo, FaRoute, FaChartLine, FaCheckCircle],
};

const ENGINEERING_PROCESS_ICONS = {
  consulting: [FaClipboardCheck, FaFileAlt, FaChartLine, FaCheckCircle],
  civil: [FaFileAlt, FaRoute, FaBuilding, FaCheckCircle],
  mechanical: [FaCrosshairs, FaClipboardCheck, FaClock, FaCheckCircle],
  electrical: [FaBell, FaLock, FaClipboardCheck, FaCheckCircle],
  structural: [FaBuilding, FaCrosshairs, FaFileAlt, FaCheckCircle],
  industrial: [FaWarehouse, FaUsers, FaChartLine, FaCheckCircle],
  automation: [FaFingerprint, FaLock, FaChartLine, FaCheckCircle],
  energy: [FaChartLine, FaFileAlt, FaClock, FaCheckCircle],
  environmental: [FaSchool, FaFileAlt, FaCheckCircle, FaUsers],
  telecom: [FaVideo, FaRoute, FaFileAlt, FaCheckCircle],
};

const ENGINEERING_TOP_SCROLL_ICONS = {
  consulting: FaArrowUp,
  civil: FaArrowUp,
  mechanical: FaArrowUp,
  electrical: FaArrowUp,
  structural: FaArrowUp,
  industrial: FaArrowUp,
  automation: FaArrowUp,
  energy: FaArrowUp,
  environmental: FaArrowUp,
  telecom: FaArrowUp,
};

const SERVICE_ICON_RULES = [
  [["consulting", "advisory", "feasibility", "assurance"], FaChartLine],
  [["civil", "road", "stormwater", "infrastructure"], FaRoute],
  [["mechanical", "equipment", "plant", "reliability"], FaCrosshairs],
  [["electrical", "power", "load", "panel"], FaBell],
  [["structural", "building", "steel", "concrete"], FaBuilding],
  [["industrial", "workflow", "process", "lean"], FaWarehouse],
  [["automation", "plc", "scada", "control"], FaFingerprint],
  [["energy", "solar", "backup", "audit"], FaChartLine],
  [["environmental", "water", "waste", "compliance"], FaSchool],
  [["telecom", "network", "fibre", "wireless"], FaVideo],
  [["design", "review", "analysis"], FaFileAlt],
  [["commission", "implementation", "handover"], FaClipboardCheck],
];

const INDUSTRY_ICON_RULES = [
  [["industrial", "manufacturing", "plant"], FaWarehouse],
  [["developer", "building", "property"], FaBuilding],
  [["utilities", "municipal", "public"], FaRoute],
  [["energy", "power", "renewable"], FaChartLine],
  [["technology", "telecom", "network"], FaVideo],
  [["environmental", "water", "waste"], FaSchool],
  [["operators", "facilities"], FaUsers],
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
  const icons = ENGINEERING_SNAPSHOT_ICONS[preset.structure] || ENGINEERING_SNAPSHOT_ICONS.engineering;
  return icons[index % icons.length] || FaCheckCircle;
};

const getProcessIcon = (preset, index) => {
  const icons = ENGINEERING_PROCESS_ICONS[preset.structure] || ENGINEERING_PROCESS_ICONS.engineering;
  return icons[index % icons.length] || FaClipboardCheck;
};

const getSavedEngineeringConfig = (settings, preset) => {
  const saved = settings.engineering_config || settings.template_config?.engineering || settings.templateConfig?.engineering || {};

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
  const baseTheme = ENGINEERING_THEMES[config.theme] || ENGINEERING_THEMES.engineering;
  const accent = config.accent || baseTheme.accent;

  return {
    "--engineering-primary": baseTheme.primary,
    "--engineering-secondary": baseTheme.secondary,
    "--engineering-accent": accent,
    "--engineering-accent-2": baseTheme.accent2,
    "--engineering-surface": baseTheme.surface,
    "--engineering-card": baseTheme.card,
    "--engineering-text": baseTheme.text,
    "--engineering-muted": baseTheme.muted,
    "--engineering-line": baseTheme.line,
  };
};

const getImagePack = (config) => ENGINEERING_IMAGE_PACKS[config.imagePack] || ENGINEERING_IMAGE_PACKS.general;

const normalizeEngineeringPageKey = (value) => {
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

  return ENGINEERING_PAGE_KEYS.has(firstSegment) ? firstSegment : "home";
};

const pageKeyFromPage = (page) => {
  if (!page) return "home";

  if (typeof page === "string") {
    return normalizeEngineeringPageKey(page);
  }

  return normalizeEngineeringPageKey(
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
      ...ENGINEERING_SOCIAL_ORDER,
    ]),
  ).filter((key) => ENGINEERING_SOCIAL_ICONS[key]);
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
      const baseItem = ENGINEERING_SOCIAL_STYLE_DEFAULTS[key] || {};
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
      data.url = savedItem.url || presetItem.url || contactUrl || ENGINEERING_SOCIAL_PRESET_FALLBACKS[key] || baseItem.url || "";

      if (data.enabled === false || !data.url) return null;

      return {
        ...data,
        Icon: ENGINEERING_SOCIAL_ICONS[key],
        color: getSocialIconColor(data),
      };
    })
    .filter(Boolean);
};

function EngineeringTopbar({ content, preset }) {
  const showSocials = content.socialDisplay?.topbar !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        ENGINEERING_SOCIAL_DEFAULTS[preset.contentKey] || ENGINEERING_SOCIAL_DEFAULTS.engineering,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <div className="engineering-topbar">
      <div className="engineering-topbar-left">
        <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
        <span className="engineering-topbar-sep">|</span>
        <a href={`mailto:${content.contact.email}`}><FaEnvelope /> {content.contact.email}</a>
        <span className="engineering-topbar-hours"><FaClock /> {content.contact.hours}</span>
      </div>
      {showSocials && socials.length > 0 && (
        <div className="engineering-topbar-social" aria-label="Social media links">
          {socials.map(({ key, label, url, Icon, color }) => (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="engineering-social-icons"
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

function EngineeringNavbar({ content, config, currentPage, onPageChange, preset }) {
  const [open, setOpen] = useState(false);
  const BrandIcon = ENGINEERING_BRAND_ICONS[preset.contentKey] || FaShieldAlt;
  const navVariant = config.navbarVariant || preset.navbarVariant || "boardroom";
  const navLabel = {
    general: "General Engineer",
    civil: "Civil Infrastructure",
    architecture: "Design & Engineer",
    residential: "Residential Engineers",
    commercial: "Commercial Works",
    renovation: "Renovation Studio",
    roofing: "Roofing & Steel",
    engineering: "Engineering Works",
    materials: "Materials & Plant",
    management: "Project Management",
  }[preset.structure] || "Engineering Capabilities";

  const handleNavigate = (pageKey) => {
    setOpen(false);
    onPageChange(pageKey);
  };

  return (
    <header className={`engineering-navbar engineering-navbar--${navVariant} engineering-navbar--structure-${preset.structure}`}>
      <button type="button" className="engineering-brand" onClick={() => handleNavigate("home")}>
        <span className="engineering-brand-mark"><BrandIcon /></span>
        <span className="engineering-brand-copy">
          <strong>{content.businessName}</strong>
          <small>{content.motto}</small>
        </span>
      </button>

      <button
        type="button"
        className={`engineering-menu-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="engineering-nav-center">
        <span className="engineering-nav-eyebrow">{navLabel}</span>
        <nav className={`engineering-nav-links ${open ? "is-open" : ""}`} aria-label="Engineering site navigation">
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

      <div className="engineering-nav-actions">
        <span className="engineering-nav-support">{content.contact.phone}</span>
        <button type="button" className="engineering-nav-cta" onClick={() => handleNavigate("contact")}>
          {content.heroCta || "Request Project Quote"}
        </button>
      </div>
    </header>
  );
}

function EngineeringHeroVisual({ content, images, activeSlide, config, preset, onPageChange }) {
  const variant = resolveEngineeringHeroVariant(config.heroVariant || preset.heroVariant || "care-split");
  const gallery = Array.isArray(images.gallery) && images.gallery.length ? images.gallery : [images.hero, images.about, images.page].filter(Boolean);
  const stats = content.stats.slice(0, 4);
  const services = content.services.slice(0, 4);
  const solutions = content.solutions.slice(0, 4);
  const process = content.process.slice(0, 4);
  const industries = content.industries.slice(0, 5);
  const packages = content.packages.slice(0, 3);
  const BrandIcon = ENGINEERING_BRAND_ICONS[preset.contentKey] || FaHardHat;

  if (variant === "engineering-command") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--engineering-command" aria-label="Engineering operations overview">
        <div className="engineering-care-split-header">
          <span className="engineering-panel-label"><FaHardHat /> Systems Command</span>
          <strong>{content.contact.hours}</strong>
          <p>{content.contactIntro}</p>
        </div>
        <div className="engineering-care-split-grid">
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

  if (variant === "infrastructure-studio") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--infrastructure-studio" aria-label="Engineering visual preview">
        <span className="engineering-panel-label"><FaBuilding /> Design Studio</span>
        <div className="engineering-smile-gallery">
          {gallery.slice(0, 2).map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" />
          ))}
        </div>
        <div className="engineering-smile-services">
          {services.slice(0, 3).map((service) => <span key={service.title}>{service.title}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "mechanical-lab") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--mechanical-lab" aria-label="Analysis desk card">
        <div className="engineering-specialist-card-main">
          <span className="engineering-panel-label"><FaFileAlt /> Analysis Desk</span>
          <strong>{content.businessName}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="engineering-specialist-stats">
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

  if (variant === "power-grid") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--power-grid" aria-label="Engineering programme track">
        <span className="engineering-panel-label"><FaClipboardCheck /> Engineering Stages</span>
        <div className="engineering-recovery-track">
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

  if (variant === "blueprint-review") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--blueprint-review" aria-label="Quality delivery preview">
        <div className="engineering-wellness-orbit">
          <span className="engineering-panel-label"><FaCheckCircle /> Verified Delivery</span>
          <strong>{content.tagline}</strong>
          <p>{content.vision}</p>
        </div>
        <div className="engineering-wellness-tags">
          {solutions.map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "operations-control") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--operations-control" aria-label="Client delivery card">
        <span className="engineering-panel-label"><FaHome /> Stakeholder Delivery</span>
        <div className="engineering-family-card">
          <img src={activeSlide?.image || images.hero} alt="" />
          <div>
            <strong>{content.businessName}</strong>
            <p>{content.heroSubtitle}</p>
          </div>
        </div>
        <div className="engineering-family-pills">
          {industries.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "controls-network") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--controls-network" aria-label="Operations command dashboard">
        <span className="engineering-panel-label"><FaChartLine /> Operations Command</span>
        <div className="engineering-hospital-grid">
          {stats.map(([value, label]) => (
            <article key={`${value}-${label}`}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <div className="engineering-hospital-alert">
          <FaChartLine />
          <p>{content.contact.hours}</p>
        </div>
      </aside>
    );
  }

  if (variant === "energy-dashboard") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--energy-dashboard" aria-label="Quality control dashboard">
        <span className="engineering-panel-label"><FaClipboardCheck /> Verification Lab</span>
        <div className="engineering-lab-window">
          <div className="engineering-window-dots"><span /><span /><span /></div>
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

  if (variant === "environmental-model") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--environmental-model" aria-label="Model review space">
        <div className="engineering-calm-card">
          <span className="engineering-panel-label"><FaBuilding /> Engineered Systems</span>
          <strong>{content.vision}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="engineering-calm-steps">
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

  if (variant === "telecom-topology") {
    return (
      <aside className="engineering-hero-visual engineering-hero-visual--telecom-topology" aria-label="Engineering delivery panel">
        <span className="engineering-panel-label"><FaWarehouse /> Resource Hub</span>
        <div className="engineering-resource-hub-grid">
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
    <aside className="engineering-hero-visual engineering-hero-visual--engineering-command" aria-label="Engineering highlights">
      <span className="engineering-panel-label"><BrandIcon /> Engineering Snapshot</span>
      <div className="engineering-care-split-grid">
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

function EngineeringHero({ content, images, config, preset, onPageChange }) {
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

  const handleHeroGalleryClick = () => {
    const galleryNode = document.querySelector(".engineering-gallery--enterprise");

    if (galleryNode) {
      galleryNode.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (typeof onPageChange === "function") {
      onPageChange("home");
    }
  };

  return (
    <section className={`engineering-hero engineering-hero--${variant} engineering-hero--structure-${preset.structure}`}>
      <div className="engineering-hero-media" aria-hidden="true">
        {activeSlide?.type === "video" && activeSlide.video ? (
          <video key={activeSlide.video} autoPlay muted loop playsInline poster={activeSlide.image}>
            <source src={activeSlide.video} type="video/mp4" />
          </video>
        ) : (
          <img src={activeSlide?.image || images.hero} alt="" />
        )}
        <span className="engineering-hero-overlay" />
      </div>

      <div className="engineering-hero-content">
        <span className="engineering-kicker">{preset.name}</span>
        <h1>{activeSlide?.title || content.heroTitle}</h1>
        <p>{activeSlide?.subtitle || content.heroSubtitle}</p>
        <div className="engineering-hero-actions">
          <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
          <button type="button" className="ghost" onClick={handleHeroGalleryClick}>View Project Gallery</button>
        </div>
      </div>

      <EngineeringHeroVisual
        content={content}
        images={images}
        activeSlide={activeSlide}
        config={config}
        preset={preset}
        onPageChange={onPageChange}
      />

      {slides.length > 1 && (
        <div className="engineering-slider-controls" aria-label="Hero slideshow controls">
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

function EngineeringPageHeader({ title, subtitle, images, preset }) {
  return (
    <section className="engineering-page-header">
      <img src={images.page} alt="" aria-hidden="true" />
      <span className="engineering-page-overlay" />
      <div>
        <span className="engineering-kicker">{preset.name}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function templateHeroAlreadyShowsStats(config = {}, preset = {}) {
  const variant = resolveEngineeringHeroVariant(
    config.heroVariant || preset.heroVariant || "",
  );

  return ["mechanical-lab", "controls-network"].includes(variant);
}

function TrustStrip({ content, preset }) {
  return (
    <section className="engineering-trust-strip">
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
    <section className={`engineering-section engineering-about engineering-about--${preset.structure}`}>
      <div className="engineering-section-copy">
        <span className="engineering-kicker">About The Company</span>
        <h2>{content.aboutTitle}</h2>
        <p>{content.aboutText}</p>
        <div className="engineering-feature-cloud">
          {content.features.slice(0, 6).map((feature) => <span key={feature}>{feature}</span>)}
        </div>
      </div>
      <div className="engineering-image-card">
        <img src={images.about} alt="Engineering operations" />
      </div>
    </section>
  );
}

function VisionMissionValues({ content, config }) {
  return (
    <section className={`engineering-vmv engineering-vmv--${config.vmvVariant}`}>
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
    <section className="engineering-section">
      <div className="engineering-section-heading">
        <span className="engineering-kicker">Engineering Capabilities</span>
        <h2>Professional engineering capabilities configured around discipline, risk, compliance and delivery stage.</h2>
        <p>Each service card can be edited through the same builder fields and fallback system.</p>
      </div>
      <div className={`engineering-cards engineering-cards--${config.cardVariant}`}>
        {content.services.map((service) => {
          const ServiceIcon = getServiceIcon(service.title, preset);

          return (
            <article key={service.title} className="engineering-card">
              <span className="engineering-card-index"><ServiceIcon /></span>
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
    <section className="engineering-section engineering-industries">
      <div className="engineering-section-heading">
        <span className="engineering-kicker">Industries</span>
        <h2>Built for real engineering clients, disciplines and technical operating environments.</h2>
      </div>
      <div className="engineering-industries-grid">
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
    <section className={`engineering-section engineering-packages engineering-packages--${preset.structure}`}>
      <div className="engineering-section-heading">
        <span className="engineering-kicker">Recommended Packages</span>
        <h2>Clear technical packages help clients understand what to request.</h2>
      </div>
      <div className="engineering-package-grid">
        {content.packages.map((item) => (
          <article key={item.title}>
            <FaClipboardCheck className="engineering-package-icon" />
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
    <section className={`engineering-section engineering-process engineering-process--${preset.structure}`}>
      <div className="engineering-section-heading">
        <span className="engineering-kicker">Operational Method</span>
        <h2>A professional engineering method from assessment to validation.</h2>
      </div>
      <div className="engineering-process-list">
        {content.process.map((item, index) => {
          const ProcessIcon = getProcessIcon(preset, index);

          return (
            <article key={item}>
              <span className="engineering-process-icon"><ProcessIcon /></span>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <p>{item}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SolutionsSection({ content, preset, onPageChange }) {
  const handleGalleryClick = () => {
    const galleryNode = document.querySelector(".engineering-gallery--enterprise");

    if (galleryNode) {
      galleryNode.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (typeof onPageChange === "function") {
      onPageChange("industries");
    }
  };

  return (
    <section className={`engineering-section engineering-solutions engineering-solutions--${preset.structure}`}>
      <div className="engineering-section-heading engineering-section-heading--with-action">
        <div>
          <span className="engineering-kicker">Solutions</span>
          <h2>Focused engineering support for technical decisions, reviews and delivery.</h2>
        </div>
        <button type="button" className="engineering-gallery-link-btn" onClick={handleGalleryClick}>
          View Project Gallery
        </button>
      </div>
      <div className="engineering-solution-list">
        {content.solutions.map((item, index) => (
          <article key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <FaCrosshairs className="engineering-solution-icon" />
            <strong>{item}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ images, content }) {
  const galleryImages = useMemo(() => getCleanGalleryImages(images), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);

  useEffect(() => {
    setActiveIndex(0);
    setZoomIndex(null);
  }, [galleryImages.join("|")]);

  if (!galleryImages.length) return null;

  const activeImage = galleryImages[activeIndex] || galleryImages[0];
  const zoomImage = zoomIndex === null ? null : galleryImages[zoomIndex] || galleryImages[0];
  const galleryTitle = content?.businessName
    ? `${content.businessName} project gallery`
    : "Engineering project gallery";

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  const showZoomPrevious = () => {
    setZoomIndex((current) => {
      const safeIndex = current ?? activeIndex;
      return safeIndex === 0 ? galleryImages.length - 1 : safeIndex - 1;
    });
  };

  const showZoomNext = () => {
    setZoomIndex((current) => {
      const safeIndex = current ?? activeIndex;
      return safeIndex === galleryImages.length - 1 ? 0 : safeIndex + 1;
    });
  };

  const handleImageError = (event, index) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = getGalleryImageFallback(index);
  };

  return (
    <section className="engineering-gallery engineering-gallery--enterprise" aria-label={galleryTitle}>
      <div className="engineering-section-heading engineering-gallery-heading">
        <span className="engineering-kicker">Project Gallery</span>
        <h2>Project visuals from real engineering service environments.</h2>
      </div>

      <div className="engineering-gallery-stage">
        <button
          type="button"
          className="engineering-gallery-arrow engineering-gallery-arrow--left"
          onClick={showPrevious}
          aria-label="Previous gallery image"
        >
          ‹
        </button>

        <figure className="engineering-gallery-featured">
          <button
            type="button"
            className="engineering-gallery-zoom-trigger"
            onClick={() => setZoomIndex(activeIndex)}
            aria-label={`Zoom gallery image ${activeIndex + 1}`}
          >
            <img
              src={activeImage}
              alt={`${galleryTitle} ${activeIndex + 1}`}
              onError={(event) => handleImageError(event, activeIndex)}
            />
            <span>Zoom</span>
          </button>
          <figcaption>
            <span>{String(activeIndex + 1).padStart(2, "0")}</span>
            <strong>{content?.tagline || "Engineering delivery visual"}</strong>
          </figcaption>
        </figure>

        <button
          type="button"
          className="engineering-gallery-arrow engineering-gallery-arrow--right"
          onClick={showNext}
          aria-label="Next gallery image"
        >
          ›
        </button>
      </div>

      <div className="engineering-gallery-thumbs" aria-label="Gallery thumbnails">
        {galleryImages.slice(0, 6).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={index === activeIndex ? "active" : ""}
            onClick={() => setActiveIndex(index)}
            onDoubleClick={() => setZoomIndex(index)}
            aria-label={`Show gallery image ${index + 1}`}
          >
            <img
              src={image}
              alt=""
              aria-hidden="true"
              onError={(event) => handleImageError(event, index)}
            />
          </button>
        ))}
      </div>

      {zoomImage && (
        <div className="engineering-gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image preview">
          <button
            type="button"
            className="engineering-gallery-lightbox-close"
            onClick={() => setZoomIndex(null)}
            aria-label="Close gallery preview"
          >
            ×
          </button>
          <button
            type="button"
            className="engineering-gallery-lightbox-arrow engineering-gallery-lightbox-arrow--left"
            onClick={showZoomPrevious}
            aria-label="Previous gallery image"
          >
            ‹
          </button>
          <img
            src={zoomImage}
            alt={`${galleryTitle} ${(zoomIndex ?? activeIndex) + 1}`}
            onError={(event) => handleImageError(event, zoomIndex ?? activeIndex)}
          />
          <button
            type="button"
            className="engineering-gallery-lightbox-arrow engineering-gallery-lightbox-arrow--right"
            onClick={showZoomNext}
            aria-label="Next gallery image"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

function TestimonialsSection({ content }) {
  const proofItems = Array.isArray(content.testimonials) && content.testimonials.length
    ? content.testimonials
    : content.services.slice(0, 2).map((service) => ({
        title: service.title,
        text: service.text,
      }));

  if (!proofItems.length) return null;

  return (
    <section className="engineering-testimonials engineering-proof-section" aria-label="Technical service proof points">
      <div className="engineering-section-heading">
        <span className="engineering-kicker">Service Proof</span>
        <h2>Practical engineering support connected to real service enquiries.</h2>
      </div>
      <div className="engineering-proof-grid">
        {proofItems.slice(0, 3).map((item, index) => (
          <article key={`${item.title || item.author || index}-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title || item.author || "Engineering service"}</h3>
            <p>{item.text || item.quote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactFormFields({ variant }) {
  const common = (
    <>
      <input name="name" placeholder="Name / technical contact" autoComplete="name" required />
      <input name="email" type="email" placeholder="Email address" autoComplete="email" required />
      <input name="phone" placeholder="Phone number" autoComplete="tel" required />
      <input name="company" placeholder="Company / organisation" autoComplete="organization" />
      <input name="project_location" placeholder="Project location / site" autoComplete="address-level2" />
    </>
  );

  if (variant === "consulting-assessment") {
    return (
      <>
        {common}
        <select name="assessment_type" defaultValue="" autoComplete="off">
          <option value="" disabled>Assessment required</option>
          <option>Feasibility study</option>
          <option>Design review</option>
          <option>Technical due diligence</option>
          <option>Project assurance</option>
        </select>
        <input name="decision_deadline" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Share discipline, decision needed, documents available and timeline" rows="5" />
      </>
    );
  }

  if (variant === "civil-feasibility") {
    return (
      <>
        {common}
        <select name="civil_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Civil engineering scope</option>
          <option>Roads / access</option>
          <option>Stormwater / drainage</option>
          <option>Bulk services</option>
          <option>Infrastructure feasibility</option>
        </select>
        <input name="erf_or_site" placeholder="Erf/site reference if available" autoComplete="off" />
        <textarea name="message" placeholder="Describe site, services needed, authority context and project stage" rows="5" />
      </>
    );
  }

  if (variant === "mechanical-design") {
    return (
      <>
        {common}
        <select name="mechanical_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Mechanical engineering need</option>
          <option>Equipment design</option>
          <option>Plant layout</option>
          <option>Reliability review</option>
          <option>Technical documentation</option>
        </select>
        <input name="equipment_type" placeholder="Equipment / system type" autoComplete="off" />
        <textarea name="message" placeholder="Share loads, duty, constraints, drawings and required output" rows="5" />
      </>
    );
  }

  if (variant === "electrical-audit") {
    return (
      <>
        {common}
        <select name="electrical_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Electrical scope</option>
          <option>Load assessment</option>
          <option>Reticulation design</option>
          <option>Backup power review</option>
          <option>Compliance audit</option>
        </select>
        <input name="supply_details" placeholder="Supply size / voltage if known" autoComplete="off" />
        <textarea name="message" placeholder="Share site type, current issues, available drawings and urgency" rows="5" />
      </>
    );
  }

  if (variant === "structural-review") {
    return (
      <>
        {common}
        <select name="structural_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Structural support required</option>
          <option>Inspection / assessment</option>
          <option>Design verification</option>
          <option>Alteration support</option>
          <option>Steel/concrete review</option>
        </select>
        <input name="building_type" placeholder="Building type / structure" autoComplete="off" />
        <textarea name="message" placeholder="Describe concern areas, proposed work, drawings/photos available and deadline" rows="5" />
      </>
    );
  }

  if (variant === "industrial-optimization") {
    return (
      <>
        {common}
        <select name="operation_goal" defaultValue="" autoComplete="off">
          <option value="" disabled>Operational improvement goal</option>
          <option>Workflow mapping</option>
          <option>Bottleneck analysis</option>
          <option>Layout optimisation</option>
          <option>KPI / performance system</option>
        </select>
        <input name="monthly_volume" placeholder="Approximate volume / throughput" autoComplete="off" />
        <textarea name="message" placeholder="Share process, pain points, capacity limits and desired outcome" rows="5" />
      </>
    );
  }

  if (variant === "automation-scada") {
    return (
      <>
        {common}
        <select name="automation_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Automation scope</option>
          <option>PLC / HMI</option>
          <option>SCADA</option>
          <option>Instrumentation</option>
          <option>Control panel / commissioning</option>
        </select>
        <input name="platform" placeholder="PLC/SCADA platform if known" autoComplete="off" />
        <textarea name="message" placeholder="Share process, signals, existing controls, downtime limits and commissioning timing" rows="5" />
      </>
    );
  }

  if (variant === "energy-study") {
    return (
      <>
        {common}
        <select name="energy_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Energy engineering scope</option>
          <option>Energy audit</option>
          <option>Solar / storage feasibility</option>
          <option>Backup power review</option>
          <option>Efficiency roadmap</option>
        </select>
        <input name="monthly_bill" placeholder="Approximate monthly electricity spend" autoComplete="off" />
        <textarea name="message" placeholder="Share site type, reliability issues, bills available and savings targets" rows="5" />
      </>
    );
  }

  if (variant === "environmental-compliance") {
    return (
      <>
        {common}
        <select name="environmental_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Environmental engineering scope</option>
          <option>Water / wastewater</option>
          <option>Waste system review</option>
          <option>Compliance gap analysis</option>
          <option>Remediation planning</option>
        </select>
        <input name="permit_context" placeholder="Permit/compliance context if known" autoComplete="off" />
        <textarea name="message" placeholder="Share site processes, concerns, reports available and required outcome" rows="5" />
      </>
    );
  }

  if (variant === "telecom-network") {
    return (
      <>
        {common}
        <select name="telecom_scope" defaultValue="" autoComplete="off">
          <option value="" disabled>Telecom engineering scope</option>
          <option>Coverage study</option>
          <option>Fibre route planning</option>
          <option>Wireless network design</option>
          <option>Field rollout support</option>
        </select>
        <input name="service_area" placeholder="Service area / coverage zone" autoComplete="off" />
        <textarea name="message" placeholder="Share location, network goal, existing infrastructure and timeline" rows="5" />
      </>
    );
  }

  return (
    <>
      {common}
      <select name="engineering_discipline" defaultValue="" autoComplete="off">
        <option value="" disabled>Engineering discipline</option>
        <option>Consulting / advisory</option>
        <option>Civil</option>
        <option>Mechanical</option>
        <option>Electrical</option>
        <option>Structural</option>
        <option>Industrial</option>
        <option>Automation</option>
        <option>Energy</option>
        <option>Environmental</option>
        <option>Telecom</option>
      </select>
      <textarea name="message" placeholder="Describe the engineering support, site/system, documents available and timeline" rows="5" />
    </>
  );
}

function ContactSection({ content, config }) {
  const email = content.contact.email || "projects@engineeringgroup.co.za";
  const subject = encodeURIComponent(`${content.businessName} enquiry`);
  const mapQuery = encodeURIComponent(content.contact.mapQuery || content.contact.address || "South Africa");

  return (
    <section className={`engineering-contact engineering-contact--${config.formVariant}`}>
      <div className="engineering-contact-copy">
        <span className="engineering-kicker">Contact</span>
        <h2>{content.contactTitle}</h2>
        <p>{content.contactIntro}</p>
        <div className="engineering-contact-details">
          <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
          <a href={`mailto:${email}`}><FaEnvelope /> {email}</a>
          <span><FaMapMarkerAlt /> {content.contact.address}</span>
          <span><FaClock /> {content.contact.hours}</span>
        </div>
      </div>
      <div className="engineering-contact-panel">
        <form className="engineering-contact-form" action={`mailto:${email}?subject=${subject}`} method="post" encType="text/plain">
          <ContactFormFields variant={config.formVariant} />
          <button type="submit">Send Engineering Enquiry</button>
        </form>
        <iframe
          className="engineering-map"
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
    <section className="engineering-cta-band">
      <div>
        <span className="engineering-kicker">Next Step</span>
        <h2>Ready to help clients contact your engineering enterprise?</h2>
        <p>{content.tagline}</p>
      </div>
      <button type="button" onClick={() => onPageChange("contact")}>Request Project Quote</button>
    </section>
  );
}

function EngineeringFooter({ content, config, onPageChange, preset }) {
  const showSocials = content.socialDisplay?.footer !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        ENGINEERING_SOCIAL_DEFAULTS[preset.contentKey] || ENGINEERING_SOCIAL_DEFAULTS.engineering,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <footer className={`engineering-footer engineering-footer--${config.footerVariant}`}>
      <div className="engineering-footer-main">
        <div>
          <strong>{content.businessName}</strong>
          <p>{content.tagline}</p>
          {showSocials && socials.length > 0 && (
            <div className="engineering-footer-social">
              {socials.map(({ key, label, url, Icon, color }) => (
                <a
                  key={key}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="engineering-social-icon"
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
      <div className="engineering-footer-bottom">
        <div className="engineering-copyright small">
          © {new Date().getFullYear()} {content.businessName}. All rights reserved.
        </div>

        <div className="engineering-powered-by">
          <span>Powered by</span>
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="engineering-ulterspace-link"
          >
            <img src={ulterspaceLogo} alt="Ulterspace Logo" className="engineering-ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ content, images, config, preset, onPageChange }) {
  const showTrustStrip = !templateHeroAlreadyShowsStats(config, preset);

  if (preset.structure === "corporate") {
    return (
      <>
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {showTrustStrip && <TrustStrip content={content} preset={preset} />}
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} />
        <IndustriesSection content={content} />
        <OperationsSection content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "consulting") {
    return (
      <>
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} onPageChange={onPageChange} />
        <ServicesSection content={content} config={config} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <GallerySection images={images} content={content} />
        <TestimonialsSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <CTASection content={content} onPageChange={onPageChange} />
      </>
    );
  }

  if (preset.structure === "agency") {
    return (
      <>
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} onPageChange={onPageChange} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <TestimonialsSection content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "finance") {
    return (
      <>
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {showTrustStrip && <TrustStrip content={content} preset={preset} />}
        <ServicesSection content={content} config={config} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <OperationsSection content={content} preset={preset} />
        <GallerySection images={images} content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "executive") {
    return (
      <>
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <GallerySection images={images} content={content} />
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
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} onPageChange={onPageChange} />
        <ServicesSection content={content} config={config} preset={preset} />
        {showTrustStrip && <TrustStrip content={content} preset={preset} />}
        <OperationsSection content={content} preset={preset} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "logistics") {
    return (
      <>
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {showTrustStrip && <TrustStrip content={content} preset={preset} />}
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
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} />
        <ServicesSection content={content} config={config} preset={preset} />
        <AboutSection content={content} images={images} preset={preset} />
        <IndustriesSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "engineeringcare") {
    return (
      <>
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {showTrustStrip && <TrustStrip content={content} preset={preset} />}
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
        <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} onPageChange={onPageChange} />
        <OperationsSection content={content} preset={preset} />
        <TestimonialsSection content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  return (
    <>
      <EngineeringHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      {showTrustStrip && <TrustStrip content={content} preset={preset} />}
      <AboutSection content={content} images={images} preset={preset} />
      <ServicesSection content={content} config={config} preset={preset} />
      <VisionMissionValues content={content} config={config} />
      <SolutionsSection content={content} preset={preset} onPageChange={onPageChange} />
      <IndustriesSection content={content} />
      <OperationsSection content={content} preset={preset} />
      <GallerySection images={images} content={content} />
      <TestimonialsSection content={content} />
      <ContactSection content={content} config={config} />
    </>
  );
}

function PageContent({ currentPage, content, images, config, preset, onPageChange }) {
  const title = NAV_ITEMS.find((item) => item.key === currentPage)?.label || "Engineering";

  if (currentPage === "home") {
    return <HomePage content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />;
  }

  return (
    <>
      <EngineeringPageHeader title={title} subtitle={content.tagline} images={images} preset={preset} />
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
          <SolutionsSection content={content} preset={preset} onPageChange={onPageChange} />
          <GallerySection images={images} content={content} />
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


function EngineeringScrollTopButton({ preset }) {
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
      className={`engineering-scroll-top engineering-scroll-top--${preset.structure} ${visible ? "is-visible" : ""}`}
      onClick={scrollPageTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <TopIcon />
    </button>
  );
}

export default function EngineeringRenderer({ settings = {}, preset = ENGINEERING_PRESETS["engineering-general-v1"], page }) {
  const content = useMemo(() => normalizeEngineeringContent(settings, preset), [settings, preset]);
  const config = useMemo(() => getSavedEngineeringConfig(settings, preset), [settings, preset]);
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
    <div className={`engineering-template engineering-shell--${preset.structure} engineering-template--${preset.template_key}`} style={makeThemeStyle(config)}>
      <EngineeringTopbar content={content} preset={preset} />
      <EngineeringNavbar content={content} config={config} currentPage={currentPage} onPageChange={onPageChange} preset={preset} />
      <main>
        <PageContent currentPage={currentPage} content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      </main>
      <EngineeringFooter content={content} config={config} onPageChange={onPageChange} preset={preset} />
      <EngineeringScrollTopButton preset={preset} />
    </div>
  );
}
