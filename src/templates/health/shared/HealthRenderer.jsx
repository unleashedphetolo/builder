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
  HEALTH_IMAGE_PACKS,
  HEALTH_PRESETS,
  HEALTH_SOCIAL_DEFAULTS,
  HEALTH_THEMES,
} from "./healthPresets";
import { normalizeHealthContent } from "./healthFallbacks";
import "./health-shared.css";

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Patients" },
  { key: "operations", label: "Care Process" },
  { key: "contact", label: "Contact" },
];


const HEALTH_PAGE_KEYS = new Set(NAV_ITEMS.map((item) => item.key));


const HEALTH_SOCIAL_ICONS = {
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

const HEALTH_SOCIAL_STYLE_DEFAULTS = {
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

const HEALTH_SOCIAL_PRESET_FALLBACKS = {
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
  website: "https://healthpractice.co.za",
  email: "mailto:info@healthpractice.co.za",
  phone: "tel:+27000000000",
};

const HEALTH_SOCIAL_ORDER = [
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

const HEALTH_BRAND_ICONS = {
  clinic: FaClinicMedical,
  dental: FaTooth,
  specialist: FaUserMd,
  physio: FaHeartbeat,
  wellness: FaHeartbeat,
  pediatric: FaBaby,
  hospital: FaHospital,
  diagnostics: FaMicroscope,
  mental: FaBrain,
  pharmacy: FaPills,
};

const HEALTH_SNAPSHOT_ICONS = {
  clinic: [FaClinicMedical, FaStethoscope, FaClock, FaCheckCircle],
  dental: [FaTooth, FaUserMd, FaCalendarAlt, FaCheckCircle],
  specialist: [FaUserMd, FaNotesMedical, FaHeartbeat, FaCheckCircle],
  physio: [FaHeartbeat, FaRoute, FaClipboardCheck, FaCheckCircle],
  wellness: [FaHeartbeat, FaUsers, FaCalendarAlt, FaCheckCircle],
  pediatric: [FaBaby, FaUsers, FaClock, FaCheckCircle],
  hospital: [FaHospital, FaAmbulance, FaHeadset, FaCheckCircle],
  diagnostics: [FaMicroscope, FaXRay, FaFileAlt, FaCheckCircle],
  mental: [FaBrain, FaUsers, FaClock, FaCheckCircle],
  pharmacy: [FaPills, FaClinicMedical, FaWhatsapp, FaCheckCircle],
};

const HEALTH_PROCESS_ICONS = {
  clinic: [FaClipboardCheck, FaStethoscope, FaNotesMedical, FaCheckCircle],
  dental: [FaCalendarAlt, FaTooth, FaNotesMedical, FaCheckCircle],
  specialist: [FaFileAlt, FaUserMd, FaHeartbeat, FaNotesMedical],
  physio: [FaClipboardCheck, FaHeartbeat, FaRoute, FaCheckCircle],
  wellness: [FaCalendarAlt, FaHeartbeat, FaUsers, FaCheckCircle],
  pediatric: [FaClipboardCheck, FaBaby, FaUsers, FaCheckCircle],
  hospital: [FaHeadset, FaHospital, FaAmbulance, FaFileAlt],
  diagnostics: [FaFileAlt, FaMicroscope, FaXRay, FaNotesMedical],
  mental: [FaClipboardCheck, FaBrain, FaUsers, FaCheckCircle],
  pharmacy: [FaPills, FaClipboardCheck, FaWhatsapp, FaCheckCircle],
};

const HEALTH_TOP_SCROLL_ICONS = {
  clinic: FaClinicMedical,
  dental: FaTooth,
  specialist: FaUserMd,
  physio: FaHeartbeat,
  wellness: FaHeartbeat,
  pediatric: FaBaby,
  hospital: FaHospital,
  diagnostics: FaMicroscope,
  mental: FaBrain,
  pharmacy: FaPills,
};

const SERVICE_ICON_RULES = [
  [["doctor", "consultation", "clinic", "primary"], FaStethoscope],
  [["dental", "teeth", "smile", "oral"], FaTooth],
  [["specialist", "referral", "medical"], FaUserMd],
  [["physio", "rehab", "recovery", "injury"], FaHeartbeat],
  [["wellness", "nutrition", "lifestyle", "preventive"], FaHeartbeat],
  [["child", "paediatric", "family", "baby"], FaBaby],
  [["emergency", "hospital", "department"], FaHospital],
  [["lab", "test", "diagnostic", "x-ray", "scan"], FaMicroscope],
  [["mental", "therapy", "counselling", "support"], FaBrain],
  [["pharmacy", "medicine", "script", "medication"], FaPills],
  [["appointment", "booking", "patient"], FaCalendarAlt],
  [["report", "record", "results"], FaNotesMedical],
];

const INDUSTRY_ICON_RULES = [
  [["families", "children", "parents"], FaBaby],
  [["adults", "professionals", "general"], FaUsers],
  [["corporate", "workplace", "employee"], FaBuilding],
  [["athletes", "sports", "active"], FaHeartbeat],
  [["elderly", "senior", "chronic"], FaUserMd],
  [["urgent", "emergency"], FaAmbulance],
  [["laboratory", "diagnostics"], FaMicroscope],
  [["community", "walk-in"], FaClinicMedical],
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
  const icons = HEALTH_SNAPSHOT_ICONS[preset.structure] || HEALTH_SNAPSHOT_ICONS.clinic;
  return icons[index % icons.length] || FaCheckCircle;
};

const getProcessIcon = (preset, index) => {
  const icons = HEALTH_PROCESS_ICONS[preset.structure] || HEALTH_PROCESS_ICONS.clinic;
  return icons[index % icons.length] || FaClipboardCheck;
};

const getSavedHealthConfig = (settings, preset) => {
  const saved = settings.health_config || settings.template_config?.health || settings.templateConfig?.health || {};

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
  const baseTheme = HEALTH_THEMES[config.theme] || HEALTH_THEMES.clinic;
  const accent = config.accent || baseTheme.accent;

  return {
    "--health-primary": baseTheme.primary,
    "--health-secondary": baseTheme.secondary,
    "--health-accent": accent,
    "--health-accent-2": baseTheme.accent2,
    "--health-surface": baseTheme.surface,
    "--health-card": baseTheme.card,
    "--health-text": baseTheme.text,
    "--health-muted": baseTheme.muted,
    "--health-line": baseTheme.line,
  };
};

const getImagePack = (config) => HEALTH_IMAGE_PACKS[config.imagePack] || HEALTH_IMAGE_PACKS.clinic;

const normalizeHealthPageKey = (value) => {
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

  return HEALTH_PAGE_KEYS.has(firstSegment) ? firstSegment : "home";
};

const pageKeyFromPage = (page) => {
  if (!page) return "home";

  if (typeof page === "string") {
    return normalizeHealthPageKey(page);
  }

  return normalizeHealthPageKey(
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
      ...HEALTH_SOCIAL_ORDER,
    ]),
  ).filter((key) => HEALTH_SOCIAL_ICONS[key]);
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
      const baseItem = HEALTH_SOCIAL_STYLE_DEFAULTS[key] || {};
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
      data.url = savedItem.url || presetItem.url || contactUrl || HEALTH_SOCIAL_PRESET_FALLBACKS[key] || baseItem.url || "";

      if (data.enabled === false || !data.url) return null;

      return {
        ...data,
        Icon: HEALTH_SOCIAL_ICONS[key],
        color: getSocialIconColor(data),
      };
    })
    .filter(Boolean);
};

function HealthTopbar({ content, preset }) {
  const showSocials = content.socialDisplay?.topbar !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        HEALTH_SOCIAL_DEFAULTS[preset.contentKey] || HEALTH_SOCIAL_DEFAULTS.clinic,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <div className="health-topbar">
      <div className="health-topbar-left">
        <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
        <span className="health-topbar-sep">|</span>
        <a href={`mailto:${content.contact.email}`}><FaEnvelope /> {content.contact.email}</a>
        <span className="health-topbar-hours"><FaClock /> {content.contact.hours}</span>
      </div>
      {showSocials && socials.length > 0 && (
        <div className="health-topbar-social" aria-label="Social media links">
          {socials.map(({ key, label, url, Icon, color }) => (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="health-social-icons"
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

function HealthNavbar({ content, config, currentPage, onPageChange, preset }) {
  const [open, setOpen] = useState(false);
  const BrandIcon = HEALTH_BRAND_ICONS[preset.contentKey] || FaShieldAlt;
  const navVariant = config.navbarVariant || preset.navbarVariant || "boardroom";
  const navLabel = {
    corporate: "Enterprise Services",
    consulting: "Strategy Desk",
    agency: "Growth Studio",
    finance: "Capital Advisory",
    executive: "Private Office",
    saas: "Cloud Platform",
    logistics: "Route Control",
    realestate: "Property Group",
    healthcare: "Care Desk",
    legal: "Legal Chambers",
  }[preset.structure] || "Health Services";

  const handleNavigate = (pageKey) => {
    setOpen(false);
    onPageChange(pageKey);
  };

  return (
    <header className={`health-navbar health-navbar--${navVariant} health-navbar--structure-${preset.structure}`}>
      <button type="button" className="health-brand" onClick={() => handleNavigate("home")}>
        <span className="health-brand-mark"><BrandIcon /></span>
        <span className="health-brand-copy">
          <strong>{content.businessName}</strong>
          <small>{content.motto}</small>
        </span>
      </button>

      <button
        type="button"
        className={`health-menu-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="health-nav-center">
        <span className="health-nav-eyebrow">{navLabel}</span>
        <nav className={`health-nav-links ${open ? "is-open" : ""}`} aria-label="Health site navigation">
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

      <div className="health-nav-actions">
        <span className="health-nav-support">{content.contact.phone}</span>
        <button type="button" className="health-nav-cta" onClick={() => handleNavigate("contact")}>
          {content.heroCta || "Book Appointment"}
        </button>
      </div>
    </header>
  );
}

function HealthHeroVisual({ content, images, activeSlide, config, preset, onPageChange }) {
  const variant = config.heroVariant || preset.heroVariant || "care-split";
  const gallery = Array.isArray(images.gallery) && images.gallery.length ? images.gallery : [images.hero, images.about, images.page].filter(Boolean);
  const stats = content.stats.slice(0, 4);
  const services = content.services.slice(0, 4);
  const solutions = content.solutions.slice(0, 4);
  const process = content.process.slice(0, 4);
  const industries = content.industries.slice(0, 5);
  const packages = content.packages.slice(0, 3);
  const BrandIcon = HEALTH_BRAND_ICONS[preset.contentKey] || FaClinicMedical;

  if (variant === "care-split") {
    return (
      <aside className="health-hero-visual health-hero-visual--care-split" aria-label="Clinic appointment overview">
        <div className="health-care-split-header">
          <span className="health-panel-label"><FaStethoscope /> Clinic Desk</span>
          <strong>{content.contact.hours}</strong>
          <p>{content.contactIntro}</p>
        </div>
        <div className="health-care-split-grid">
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
      <aside className="health-hero-visual health-hero-visual--smile-panel" aria-label="Dental care preview">
        <span className="health-panel-label"><FaTooth /> Smile Studio</span>
        <div className="health-smile-gallery">
          {gallery.slice(0, 2).map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" />
          ))}
        </div>
        <div className="health-smile-services">
          {services.slice(0, 3).map((service) => <span key={service.title}>{service.title}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "consultant-card") {
    return (
      <aside className="health-hero-visual health-hero-visual--consultant-card" aria-label="Specialist referral card">
        <div className="health-specialist-card-main">
          <span className="health-panel-label"><FaUserMd /> Specialist Referral</span>
          <strong>{content.businessName}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="health-specialist-stats">
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
      <aside className="health-hero-visual health-hero-visual--recovery-flow" aria-label="Recovery pathway">
        <span className="health-panel-label"><FaHeartbeat /> Recovery Pathway</span>
        <div className="health-recovery-track">
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
      <aside className="health-hero-visual health-hero-visual--wellness-retreat" aria-label="Wellness programme preview">
        <div className="health-wellness-orbit">
          <span className="health-panel-label"><FaHeartbeat /> Wellness Circle</span>
          <strong>{content.tagline}</strong>
          <p>{content.vision}</p>
        </div>
        <div className="health-wellness-tags">
          {solutions.map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "family-care") {
    return (
      <aside className="health-hero-visual health-hero-visual--family-care" aria-label="Family care card">
        <span className="health-panel-label"><FaBaby /> Family Care</span>
        <div className="health-family-card">
          <img src={activeSlide?.image || images.hero} alt="" />
          <div>
            <strong>{content.businessName}</strong>
            <p>{content.heroSubtitle}</p>
          </div>
        </div>
        <div className="health-family-pills">
          {industries.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "hospital-network") {
    return (
      <aside className="health-hero-visual health-hero-visual--hospital-network" aria-label="Hospital network dashboard">
        <span className="health-panel-label"><FaHospital /> Hospital Command</span>
        <div className="health-hospital-grid">
          {stats.map(([value, label]) => (
            <article key={`${value}-${label}`}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <div className="health-hospital-alert">
          <FaAmbulance />
          <p>{content.contact.hours}</p>
        </div>
      </aside>
    );
  }

  if (variant === "lab-dashboard") {
    return (
      <aside className="health-hero-visual health-hero-visual--lab-dashboard" aria-label="Diagnostics laboratory dashboard">
        <span className="health-panel-label"><FaMicroscope /> Diagnostics Console</span>
        <div className="health-lab-window">
          <div className="health-window-dots"><span /><span /><span /></div>
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
      <aside className="health-hero-visual health-hero-visual--calm-space" aria-label="Mental wellness space">
        <div className="health-calm-card">
          <span className="health-panel-label"><FaBrain /> Calm Space</span>
          <strong>{content.vision}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="health-calm-steps">
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

  if (variant === "pharmacy-access") {
    return (
      <aside className="health-hero-visual health-hero-visual--pharmacy-access" aria-label="Pharmacy access panel">
        <span className="health-panel-label"><FaPills /> Pharmacy Access</span>
        <div className="health-pharmacy-grid">
          {packages.map((item) => (
            <article key={item.title}>
              <FaNotesMedical />
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
    <aside className="health-hero-visual health-hero-visual--care-split" aria-label="Health highlights">
      <span className="health-panel-label"><BrandIcon /> Health Snapshot</span>
      <div className="health-care-split-grid">
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

function HealthHero({ content, images, config, preset, onPageChange }) {
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
    <section className={`health-hero health-hero--${variant} health-hero--structure-${preset.structure}`}>
      <div className="health-hero-media" aria-hidden="true">
        {activeSlide?.type === "video" && activeSlide.video ? (
          <video key={activeSlide.video} autoPlay muted loop playsInline poster={activeSlide.image}>
            <source src={activeSlide.video} type="video/mp4" />
          </video>
        ) : (
          <img src={activeSlide?.image || images.hero} alt="" />
        )}
        <span className="health-hero-overlay" />
      </div>

      <div className="health-hero-content">
        <span className="health-kicker">{preset.name}</span>
        <h1>{activeSlide?.title || content.heroTitle}</h1>
        <p>{activeSlide?.subtitle || content.heroSubtitle}</p>
        <div className="health-hero-actions">
          <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
          <button type="button" className="ghost" onClick={() => onPageChange("services")}>{content.heroSecondaryCta}</button>
        </div>
      </div>

      <HealthHeroVisual
        content={content}
        images={images}
        activeSlide={activeSlide}
        config={config}
        preset={preset}
        onPageChange={onPageChange}
      />

      {slides.length > 1 && (
        <div className="health-slider-controls" aria-label="Hero slideshow controls">
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

function HealthPageHeader({ title, subtitle, images, preset }) {
  return (
    <section className="health-page-header">
      <img src={images.page} alt="" aria-hidden="true" />
      <span className="health-page-overlay" />
      <div>
        <span className="health-kicker">{preset.name}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function TrustStrip({ content, preset }) {
  return (
    <section className="health-trust-strip">
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
    <section className={`health-section health-about health-about--${preset.structure}`}>
      <div className="health-section-copy">
        <span className="health-kicker">About The Company</span>
        <h2>{content.aboutTitle}</h2>
        <p>{content.aboutText}</p>
        <div className="health-feature-cloud">
          {content.features.slice(0, 6).map((feature) => <span key={feature}>{feature}</span>)}
        </div>
      </div>
      <div className="health-image-card">
        <img src={images.about} alt="Health operations" />
      </div>
    </section>
  );
}

function VisionMissionValues({ content, config }) {
  return (
    <section className={`health-vmv health-vmv--${config.vmvVariant}`}>
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
    <section className="health-section">
      <div className="health-section-heading">
        <span className="health-kicker">Health Services</span>
        <h2>Professional services configured around the client’s goals, sector and growth stage.</h2>
        <p>Each service card can be edited through the same builder fields and fallback system.</p>
      </div>
      <div className={`health-cards health-cards--${config.cardVariant}`}>
        {content.services.map((service) => {
          const ServiceIcon = getServiceIcon(service.title, preset);

          return (
            <article key={service.title} className="health-card">
              <span className="health-card-index"><ServiceIcon /></span>
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
    <section className="health-section health-industries">
      <div className="health-section-heading">
        <span className="health-kicker">Industries</span>
        <h2>Built for real health clients and different operating environments.</h2>
      </div>
      <div className="health-industries-grid">
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
    <section className={`health-section health-packages health-packages--${preset.structure}`}>
      <div className="health-section-heading">
        <span className="health-kicker">Recommended Packages</span>
        <h2>Clear packages help customers understand what to request.</h2>
      </div>
      <div className="health-package-grid">
        {content.packages.map((item) => (
          <article key={item.title}>
            <FaClipboardCheck className="health-package-icon" />
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
    <section className={`health-section health-process health-process--${preset.structure}`}>
      <div className="health-section-heading">
        <span className="health-kicker">Operational Method</span>
        <h2>A professional process from assessment to reporting.</h2>
      </div>
      <div className="health-process-list">
        {content.process.map((item, index) => {
          const ProcessIcon = getProcessIcon(preset, index);

          return (
            <article key={item}>
              <span className="health-process-icon"><ProcessIcon /></span>
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
    <section className={`health-section health-solutions health-solutions--${preset.structure}`}>
      <div className="health-section-heading">
        <span className="health-kicker">Solutions</span>
        <h2>Focused solutions for the most common health requests.</h2>
      </div>
      <div className="health-solution-list">
        {content.solutions.map((item, index) => (
          <article key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <FaCrosshairs className="health-solution-icon" />
            <strong>{item}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ images }) {
  return (
    <section className="health-gallery">
      {images.gallery.map((image, index) => (
        <img key={`${image}-${index}`} src={image} alt="Health company visual" />
      ))}
    </section>
  );
}

function TestimonialsSection({ content }) {
  return (
    <section className="health-testimonials">
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
      <input name="name" placeholder="Patient / contact name" autoComplete="name" required />
      <input name="email" type="email" placeholder="Email address" autoComplete="email" required />
      <input name="phone" placeholder="Phone number" autoComplete="tel" required />
      <input name="suburb" placeholder="Suburb / area" autoComplete="address-level2" />
    </>
  );

  if (variant === "dental-booking") {
    return (
      <>
        {common}
        <select name="treatment" defaultValue="" autoComplete="off">
          <option value="" disabled>Treatment needed</option>
          <option>Dental check-up</option>
          <option>Cleaning and whitening</option>
          <option>Tooth pain / emergency</option>
          <option>Cosmetic dentistry</option>
        </select>
        <input name="preferred_date" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Tell us about your dental concern or preferred appointment time" rows="5" />
      </>
    );
  }

  if (variant === "specialist-referral") {
    return (
      <>
        {common}
        <input name="referring_doctor" placeholder="Referring doctor / practice" autoComplete="organization" />
        <select name="specialist_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Specialist service</option>
          <option>First specialist consultation</option>
          <option>Follow-up review</option>
          <option>Second opinion</option>
          <option>Report / results discussion</option>
        </select>
        <textarea name="message" placeholder="Share a brief non-urgent summary of the referral or enquiry" rows="5" />
      </>
    );
  }

  if (variant === "physio-assessment") {
    return (
      <>
        {common}
        <select name="injury_area" defaultValue="" autoComplete="off">
          <option value="" disabled>Support needed</option>
          <option>Sports injury</option>
          <option>Back / neck pain</option>
          <option>Post-operative rehab</option>
          <option>Mobility and recovery plan</option>
        </select>
        <input name="preferred_date" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Describe the injury, pain area or recovery goal" rows="5" />
      </>
    );
  }

  if (variant === "wellness-consult") {
    return (
      <>
        {common}
        <select name="wellness_goal" defaultValue="" autoComplete="off">
          <option value="" disabled>Wellness goal</option>
          <option>Preventive health check</option>
          <option>Nutrition and lifestyle support</option>
          <option>Corporate wellness programme</option>
          <option>Stress and energy management</option>
        </select>
        <input name="preferred_contact" placeholder="Preferred contact method" autoComplete="off" />
        <textarea name="message" placeholder="Tell us what you want to improve or understand" rows="5" />
      </>
    );
  }

  if (variant === "child-appointment") {
    return (
      <>
        {common}
        <input name="child_age" placeholder="Child age" autoComplete="off" />
        <select name="child_service" defaultValue="" autoComplete="off">
          <option value="" disabled>Child appointment type</option>
          <option>General check-up</option>
          <option>Immunisation enquiry</option>
          <option>Developmental concern</option>
          <option>Follow-up visit</option>
        </select>
        <textarea name="message" placeholder="Share the reason for the appointment and preferred time" rows="5" />
      </>
    );
  }

  if (variant === "hospital-intake") {
    return (
      <>
        {common}
        <select name="department" defaultValue="" autoComplete="off">
          <option value="" disabled>Department / enquiry</option>
          <option>Outpatient appointment</option>
          <option>Specialist department</option>
          <option>Admissions enquiry</option>
          <option>Emergency information</option>
        </select>
        <input name="medical_aid" placeholder="Medical aid / payment method" autoComplete="off" />
        <textarea name="message" placeholder="Tell us which department or service you need" rows="5" />
      </>
    );
  }

  if (variant === "lab-request") {
    return (
      <>
        {common}
        <select name="test_type" defaultValue="" autoComplete="off">
          <option value="" disabled>Test / diagnostic service</option>
          <option>Blood tests</option>
          <option>X-ray / imaging</option>
          <option>Corporate screening</option>
          <option>Results follow-up</option>
        </select>
        <input name="referral_number" placeholder="Referral / request number if available" autoComplete="off" />
        <textarea name="message" placeholder="Describe the diagnostic request or collection needs" rows="5" />
      </>
    );
  }

  if (variant === "therapy-request") {
    return (
      <>
        {common}
        <select name="support_type" defaultValue="" autoComplete="off">
          <option value="" disabled>Support needed</option>
          <option>Individual counselling</option>
          <option>Family support</option>
          <option>Workplace wellness</option>
          <option>Initial private enquiry</option>
        </select>
        <input name="preferred_session" placeholder="Preferred session time" autoComplete="off" />
        <textarea name="message" placeholder="Share a brief non-urgent note about the support you are looking for" rows="5" />
      </>
    );
  }

  if (variant === "pharmacy-order") {
    return (
      <>
        {common}
        <select name="pharmacy_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Pharmacy service</option>
          <option>Prescription enquiry</option>
          <option>Medication availability</option>
          <option>Delivery / collection</option>
          <option>Clinic service</option>
        </select>
        <input name="collection_time" placeholder="Preferred collection / delivery time" autoComplete="off" />
        <textarea name="message" placeholder="Do not include sensitive medical details. Tell us what service you need." rows="5" />
      </>
    );
  }

  return (
    <>
      {common}
      <input name="preferred_date" type="date" autoComplete="off" />
      <select name="appointment_type" defaultValue="" autoComplete="off">
        <option value="" disabled>Appointment type</option>
        <option>General consultation</option>
        <option>Follow-up appointment</option>
        <option>New patient enquiry</option>
        <option>Practice service question</option>
      </select>
      <textarea name="message" placeholder="Briefly tell us what support you need" rows="5" />
    </>
  );
}

function ContactSection({ content, config }) {
  const email = content.contact.email || "info@healthpractice.co.za";
  const subject = encodeURIComponent(`${content.businessName} enquiry`);
  const mapQuery = encodeURIComponent(content.contact.mapQuery || content.contact.address || "South Africa");

  return (
    <section className={`health-contact health-contact--${config.formVariant}`}>
      <div className="health-contact-copy">
        <span className="health-kicker">Contact</span>
        <h2>{content.contactTitle}</h2>
        <p>{content.contactIntro}</p>
        <div className="health-contact-details">
          <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
          <a href={`mailto:${email}`}><FaEnvelope /> {email}</a>
          <span><FaMapMarkerAlt /> {content.contact.address}</span>
          <span><FaClock /> {content.contact.hours}</span>
        </div>
      </div>
      <div className="health-contact-panel">
        <form className="health-contact-form" action={`mailto:${email}?subject=${subject}`} method="post" encType="text/plain">
          <ContactFormFields variant={config.formVariant} />
          <button type="submit">Send Health Enquiry</button>
        </form>
        <iframe
          className="health-map"
          title="Health location map"
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
    <section className="health-cta-band">
      <div>
        <span className="health-kicker">Next Step</span>
        <h2>Ready to help patients contact your healthcare practice?</h2>
        <p>{content.tagline}</p>
      </div>
      <button type="button" onClick={() => onPageChange("contact")}>Book Appointment</button>
    </section>
  );
}

function HealthFooter({ content, config, onPageChange, preset }) {
  const showSocials = content.socialDisplay?.footer !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        HEALTH_SOCIAL_DEFAULTS[preset.contentKey] || HEALTH_SOCIAL_DEFAULTS.clinic,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <footer className={`health-footer health-footer--${config.footerVariant}`}>
      <div className="health-footer-main">
        <div>
          <strong>{content.businessName}</strong>
          <p>{content.tagline}</p>
          {showSocials && socials.length > 0 && (
            <div className="health-footer-social">
              {socials.map(({ key, label, url, Icon, color }) => (
                <a
                  key={key}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="health-social-icon"
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
      <div className="health-footer-bottom">
        <div className="health-copyright small">
          © {new Date().getFullYear()} {content.businessName}. All rights reserved.
        </div>

        <div className="health-powered-by">
          <span>Powered by</span>
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="health-ulterspace-link"
          >
            <img src={ulterspaceLogo} alt="Ulterspace Logo" className="health-ulterspace-logo" />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} />
        <ServicesSection content={content} config={config} preset={preset} />
        <AboutSection content={content} images={images} preset={preset} />
        <IndustriesSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "healthcare") {
    return (
      <>
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
      <HealthHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
  const title = NAV_ITEMS.find((item) => item.key === currentPage)?.label || "Health";

  if (currentPage === "home") {
    return <HomePage content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />;
  }

  return (
    <>
      <HealthPageHeader title={title} subtitle={content.tagline} images={images} preset={preset} />
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


function HealthScrollTopButton({ preset }) {
  const [visible, setVisible] = useState(false);
  const TopIcon = HEALTH_TOP_SCROLL_ICONS[preset.structure] || FaArrowUp;

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
      className={`health-scroll-top health-scroll-top--${preset.structure} ${visible ? "is-visible" : ""}`}
      onClick={scrollPageTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <TopIcon />
    </button>
  );
}

export default function HealthRenderer({ settings = {}, preset = HEALTH_PRESETS["health-clinic-v1"], page }) {
  const content = useMemo(() => normalizeHealthContent(settings, preset), [settings, preset]);
  const config = useMemo(() => getSavedHealthConfig(settings, preset), [settings, preset]);
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
    <div className={`health-template health-shell--${preset.structure} health-template--${preset.template_key}`} style={makeThemeStyle(config)}>
      <HealthTopbar content={content} preset={preset} />
      <HealthNavbar content={content} config={config} currentPage={currentPage} onPageChange={onPageChange} preset={preset} />
      <main>
        <PageContent currentPage={currentPage} content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      </main>
      <HealthFooter content={content} config={config} onPageChange={onPageChange} preset={preset} />
      <HealthScrollTopButton preset={preset} />
    </div>
  );
}
