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
  AGRICULTURE_IMAGE_PACKS,
  AGRICULTURE_PRESETS,
  AGRICULTURE_SOCIAL_DEFAULTS,
  AGRICULTURE_THEMES,
} from "./agriculturePresets";
import { normalizeAgricultureContent } from "./agricultureFallbacks";
import "./agriculture-shared.css";

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Markets" },
  { key: "operations", label: "Farm Process" },
  { key: "contact", label: "Contact" },
];


const AGRICULTURE_PAGE_KEYS = new Set(NAV_ITEMS.map((item) => item.key));


const AGRICULTURE_SOCIAL_ICONS = {
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

const AGRICULTURE_SOCIAL_STYLE_DEFAULTS = {
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

const AGRICULTURE_SOCIAL_PRESET_FALLBACKS = {
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
  website: "https://agricultureenterprise.co.za",
  email: "mailto:info@agri-enterprise.co.za",
  phone: "tel:+27000000000",
};

const AGRICULTURE_SOCIAL_ORDER = [
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

const AGRICULTURE_BRAND_ICONS = {
  farm: FaWarehouse,
  organic: FaStore,
  agritech: FaChartLine,
  livestock: FaHome,
  greenhouse: FaBuilding,
  winery: FaGlobe,
  irrigation: FaRoute,
  cooperative: FaUsers,
  export: FaGlobe,
  equipment: FaHardHat,
};

const AGRICULTURE_SNAPSHOT_ICONS = {
  farm: [FaWarehouse, FaClipboardCheck, FaClock, FaCheckCircle],
  organic: [FaStore, FaUsers, FaClipboardCheck, FaCheckCircle],
  agritech: [FaChartLine, FaFingerprint, FaCrosshairs, FaCheckCircle],
  livestock: [FaHome, FaUsers, FaClipboardCheck, FaCheckCircle],
  greenhouse: [FaBuilding, FaChartLine, FaClock, FaCheckCircle],
  winery: [FaGlobe, FaStore, FaCalendarAlt, FaCheckCircle],
  irrigation: [FaRoute, FaCrosshairs, FaHardHat, FaCheckCircle],
  cooperative: [FaUsers, FaWarehouse, FaStore, FaCheckCircle],
  export: [FaGlobe, FaRoute, FaFileAlt, FaCheckCircle],
  equipment: [FaHardHat, FaWarehouse, FaHeadset, FaCheckCircle],
};

const AGRICULTURE_PROCESS_ICONS = {
  farm: [FaClipboardCheck, FaWarehouse, FaRoute, FaCheckCircle],
  organic: [FaClipboardCheck, FaStore, FaUsers, FaCheckCircle],
  agritech: [FaFingerprint, FaChartLine, FaHeadset, FaCheckCircle],
  livestock: [FaClipboardCheck, FaHome, FaUsers, FaCheckCircle],
  greenhouse: [FaBuilding, FaChartLine, FaClipboardCheck, FaCheckCircle],
  winery: [FaCalendarAlt, FaStore, FaGlobe, FaCheckCircle],
  irrigation: [FaCrosshairs, FaRoute, FaHardHat, FaCheckCircle],
  cooperative: [FaUsers, FaWarehouse, FaClipboardCheck, FaCheckCircle],
  export: [FaFileAlt, FaRoute, FaGlobe, FaCheckCircle],
  equipment: [FaHardHat, FaHeadset, FaWarehouse, FaCheckCircle],
};

const AGRICULTURE_TOP_SCROLL_ICONS = {
  farm: FaWarehouse,
  organic: FaStore,
  agritech: FaChartLine,
  livestock: FaHome,
  greenhouse: FaBuilding,
  winery: FaGlobe,
  irrigation: FaRoute,
  cooperative: FaUsers,
  export: FaGlobe,
  equipment: FaHardHat,
};

const SERVICE_ICON_RULES = [
  [["crop", "farm", "field", "plant"], FaWarehouse],
  [["organic", "produce", "fresh", "market"], FaStore],
  [["technology", "digital", "sensor", "data", "platform"], FaChartLine],
  [["livestock", "cattle", "poultry", "animal"], FaHome],
  [["greenhouse", "tunnel", "climate", "nursery"], FaBuilding],
  [["vineyard", "wine", "estate", "tasting"], FaGlobe],
  [["irrigation", "water", "pump", "borehole"], FaRoute],
  [["cooperative", "members", "community"], FaUsers],
  [["export", "cold chain", "compliance"], FaGlobe],
  [["equipment", "machinery", "tractor", "service"], FaHardHat],
  [["quote", "booking", "visit"], FaCalendarAlt],
  [["certification", "quality", "traceability"], FaClipboardCheck],
];

const INDUSTRY_ICON_RULES = [
  [["retail", "market", "stores"], FaStore],
  [["wholesale", "buyers", "processors"], FaWarehouse],
  [["export", "regional", "international"], FaGlobe],
  [["farmers", "growers", "cooperative"], FaUsers],
  [["restaurants", "hospitality"], FaBuilding],
  [["logistics", "distribution"], FaRoute],
  [["technology", "agritech"], FaChartLine],
  [["estate", "vineyard"], FaGlobe],
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
  const icons = AGRICULTURE_SNAPSHOT_ICONS[preset.structure] || AGRICULTURE_SNAPSHOT_ICONS.farm;
  return icons[index % icons.length] || FaCheckCircle;
};

const getProcessIcon = (preset, index) => {
  const icons = AGRICULTURE_PROCESS_ICONS[preset.structure] || AGRICULTURE_PROCESS_ICONS.farm;
  return icons[index % icons.length] || FaClipboardCheck;
};

const getSavedAgricultureConfig = (settings, preset) => {
  const saved = settings.agriculture_config || settings.template_config?.agriculture || settings.templateConfig?.agriculture || {};

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
  const baseTheme = AGRICULTURE_THEMES[config.theme] || AGRICULTURE_THEMES.farm;
  const accent = config.accent || baseTheme.accent;

  return {
    "--agriculture-primary": baseTheme.primary,
    "--agriculture-secondary": baseTheme.secondary,
    "--agriculture-accent": accent,
    "--agriculture-accent-2": baseTheme.accent2,
    "--agriculture-surface": baseTheme.surface,
    "--agriculture-card": baseTheme.card,
    "--agriculture-text": baseTheme.text,
    "--agriculture-muted": baseTheme.muted,
    "--agriculture-line": baseTheme.line,
  };
};

const getImagePack = (config) => AGRICULTURE_IMAGE_PACKS[config.imagePack] || AGRICULTURE_IMAGE_PACKS.farm;

const normalizeAgriculturePageKey = (value) => {
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

  return AGRICULTURE_PAGE_KEYS.has(firstSegment) ? firstSegment : "home";
};

const pageKeyFromPage = (page) => {
  if (!page) return "home";

  if (typeof page === "string") {
    return normalizeAgriculturePageKey(page);
  }

  return normalizeAgriculturePageKey(
    page.slug || page.href || page.path || page.key || page.page_key || page.id || "home",
  );
};

const scrollPageTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const scrollToAgricultureGallery = () => {
  if (typeof window === "undefined") return;

  window.setTimeout(() => {
    const target = document.getElementById("agriculture-gallery");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 80);
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
      ...AGRICULTURE_SOCIAL_ORDER,
    ]),
  ).filter((key) => AGRICULTURE_SOCIAL_ICONS[key]);
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
      const baseItem = AGRICULTURE_SOCIAL_STYLE_DEFAULTS[key] || {};
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
      data.url = savedItem.url || presetItem.url || contactUrl || AGRICULTURE_SOCIAL_PRESET_FALLBACKS[key] || baseItem.url || "";

      if (data.enabled === false || !data.url) return null;

      return {
        ...data,
        Icon: AGRICULTURE_SOCIAL_ICONS[key],
        color: getSocialIconColor(data),
      };
    })
    .filter(Boolean);
};

function AgricultureTopbar({ content, preset }) {
  const showSocials = content.socialDisplay?.topbar !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        AGRICULTURE_SOCIAL_DEFAULTS[preset.contentKey] || AGRICULTURE_SOCIAL_DEFAULTS.farm,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <div className="agriculture-topbar">
      <div className="agriculture-topbar-left">
        <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
        <span className="agriculture-topbar-sep">|</span>
        <a href={`mailto:${content.contact.email}`}><FaEnvelope /> {content.contact.email}</a>
        <span className="agriculture-topbar-hours"><FaClock /> {content.contact.hours}</span>
      </div>
      {showSocials && socials.length > 0 && (
        <div className="agriculture-topbar-social" aria-label="Social media links">
          {socials.map(({ key, label, url, Icon, color }) => (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="agriculture-social-icons"
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

function AgricultureNavbar({ content, config, currentPage, onPageChange, preset }) {
  const [open, setOpen] = useState(false);
  const BrandIcon = AGRICULTURE_BRAND_ICONS[preset.contentKey] || FaShieldAlt;
  const navVariant = config.navbarVariant || preset.navbarVariant || "boardroom";
  const navLabel = {
    farm: "Farm Operations",
    organic: "Organic Produce",
    agritech: "AgriTech Platform",
    livestock: "Livestock Desk",
    greenhouse: "Greenhouse Control",
    winery: "Vineyard Estate",
    irrigation: "Irrigation Projects",
    cooperative: "Co-op Network",
    export: "Export Desk",
    equipment: "Equipment Support",
  }[preset.structure] || "Agriculture Services";

  const handleNavigate = (pageKey) => {
    setOpen(false);
    onPageChange(pageKey);
  };

  return (
    <header className={`agriculture-navbar agriculture-navbar--${navVariant} agriculture-navbar--structure-${preset.structure}`}>
      <button type="button" className="agriculture-brand" onClick={() => handleNavigate("home")}>
        <span className="agriculture-brand-mark"><BrandIcon /></span>
        <span className="agriculture-brand-copy">
          <strong>{content.businessName}</strong>
          <small>{content.motto}</small>
        </span>
      </button>

      <button
        type="button"
        className={`agriculture-menu-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="agriculture-nav-center">
        <span className="agriculture-nav-eyebrow">{navLabel}</span>
        <nav className={`agriculture-nav-links ${open ? "is-open" : ""}`} aria-label="Agriculture site navigation">
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

      <div className="agriculture-nav-actions">
        <span className="agriculture-nav-support">{content.contact.phone}</span>
        <button type="button" className="agriculture-nav-cta" onClick={() => handleNavigate("contact")}>
          {content.heroCta || "Request Quote"}
        </button>
      </div>
    </header>
  );
}

function AgricultureHeroVisual({ content, images, activeSlide, config, preset, onPageChange }) {
  const variant = config.heroVariant || preset.heroVariant || "care-split";
  const gallery = Array.isArray(images.gallery) && images.gallery.length ? images.gallery : [images.hero, images.about, images.page].filter(Boolean);
  const stats = content.stats.slice(0, 4);
  const services = content.services.slice(0, 4);
  const solutions = content.solutions.slice(0, 4);
  const process = content.process.slice(0, 4);
  const industries = content.industries.slice(0, 5);
  const packages = content.packages.slice(0, 3);
  const BrandIcon = AGRICULTURE_BRAND_ICONS[preset.contentKey] || FaClinicMedical;

  if (variant === "care-split") {
    return (
      <aside className="agriculture-hero-visual agriculture-hero-visual--care-split" aria-label="Farm operations overview">
        <div className="agriculture-care-split-header">
          <span className="agriculture-panel-label"><FaStethoscope /> Farm Operations</span>
          <strong>{content.contact.hours}</strong>
          <p>{content.contactIntro}</p>
        </div>
        <div className="agriculture-care-split-grid">
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
      <aside className="agriculture-hero-visual agriculture-hero-visual--smile-panel" aria-label="Fresh produce preview">
        <span className="agriculture-panel-label"><FaTooth /> Harvest Studio</span>
        <div className="agriculture-smile-gallery">
          {gallery.slice(0, 2).map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" />
          ))}
        </div>
        <div className="agriculture-smile-services">
          {services.slice(0, 3).map((service) => <span key={service.title}>{service.title}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "consultant-card") {
    return (
      <aside className="agriculture-hero-visual agriculture-hero-visual--consultant-card" aria-label="Specialist referral card">
        <div className="agriculture-specialist-card-main">
          <span className="agriculture-panel-label"><FaUserMd /> Agronomy Desk</span>
          <strong>{content.businessName}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="agriculture-specialist-stats">
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
      <aside className="agriculture-hero-visual agriculture-hero-visual--recovery-flow" aria-label="Recovery pathway">
        <span className="agriculture-panel-label"><FaHeartbeat /> Field Workflow</span>
        <div className="agriculture-recovery-track">
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
      <aside className="agriculture-hero-visual agriculture-hero-visual--wellness-retreat" aria-label="Wellness programme preview">
        <div className="agriculture-wellness-orbit">
          <span className="agriculture-panel-label"><FaHeartbeat /> Sustainable Growth</span>
          <strong>{content.tagline}</strong>
          <p>{content.vision}</p>
        </div>
        <div className="agriculture-wellness-tags">
          {solutions.map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "family-care") {
    return (
      <aside className="agriculture-hero-visual agriculture-hero-visual--family-care" aria-label="Family care card">
        <span className="agriculture-panel-label"><FaBaby /> Farm Community</span>
        <div className="agriculture-family-card">
          <img src={activeSlide?.image || images.hero} alt="" />
          <div>
            <strong>{content.businessName}</strong>
            <p>{content.heroSubtitle}</p>
          </div>
        </div>
        <div className="agriculture-family-pills">
          {industries.slice(0, 4).map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "hospital-network") {
    return (
      <aside className="agriculture-hero-visual agriculture-hero-visual--hospital-network" aria-label="Hospital network dashboard">
        <span className="agriculture-panel-label"><FaHospital /> Supply Command</span>
        <div className="agriculture-hospital-grid">
          {stats.map(([value, label]) => (
            <article key={`${value}-${label}`}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
        <div className="agriculture-hospital-alert">
          <FaAmbulance />
          <p>{content.contact.hours}</p>
        </div>
      </aside>
    );
  }

  if (variant === "lab-dashboard") {
    return (
      <aside className="agriculture-hero-visual agriculture-hero-visual--lab-dashboard" aria-label="Diagnostics laboratory dashboard">
        <span className="agriculture-panel-label"><FaMicroscope /> Quality Lab</span>
        <div className="agriculture-lab-window">
          <div className="agriculture-window-dots"><span /><span /><span /></div>
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
      <aside className="agriculture-hero-visual agriculture-hero-visual--calm-space" aria-label="Organic farm space">
        <div className="agriculture-calm-card">
          <span className="agriculture-panel-label"><FaBrain /> Organic Estate</span>
          <strong>{content.vision}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="agriculture-calm-steps">
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

  if (variant === "agri-supply") {
    return (
      <aside className="agriculture-hero-visual agriculture-hero-visual--agri-supply" aria-label="Agricultural supply panel">
        <span className="agriculture-panel-label"><FaWarehouse /> Agri Supply</span>
        <div className="agriculture-agri-supply-grid">
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
    <aside className="agriculture-hero-visual agriculture-hero-visual--care-split" aria-label="Agriculture highlights">
      <span className="agriculture-panel-label"><BrandIcon /> Agriculture Snapshot</span>
      <div className="agriculture-care-split-grid">
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

function AgricultureHero({ content, images, config, preset, onPageChange }) {
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
    <section className={`agriculture-hero agriculture-hero--${variant} agriculture-hero--structure-${preset.structure}`}>
      <div className="agriculture-hero-media" aria-hidden="true">
        {activeSlide?.type === "video" && activeSlide.video ? (
          <video key={activeSlide.video} autoPlay muted loop playsInline poster={activeSlide.image}>
            <source src={activeSlide.video} type="video/mp4" />
          </video>
        ) : (
          <img src={activeSlide?.image || images.hero} alt="" />
        )}
        <span className="agriculture-hero-overlay" />
      </div>

      <div className="agriculture-hero-content">
        <span className="agriculture-kicker">{preset.name}</span>
        <h1>{activeSlide?.title || content.heroTitle}</h1>
        <p>{activeSlide?.subtitle || content.heroSubtitle}</p>
        <div className="agriculture-hero-actions">
          <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
          <button type="button" className="ghost" onClick={() => onPageChange("gallery")}>View Project Gallery</button>
        </div>
      </div>

      <AgricultureHeroVisual
        content={content}
        images={images}
        activeSlide={activeSlide}
        config={config}
        preset={preset}
        onPageChange={onPageChange}
      />

      {slides.length > 1 && (
        <div className="agriculture-slider-controls" aria-label="Hero slideshow controls">
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

function AgriculturePageHeader({ title, subtitle, images, preset }) {
  return (
    <section className="agriculture-page-header">
      <img src={images.page} alt="" aria-hidden="true" />
      <span className="agriculture-page-overlay" />
      <div>
        <span className="agriculture-kicker">{preset.name}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function TrustStrip({ content, preset }) {
  return (
    <section className="agriculture-trust-strip">
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


const AGRICULTURE_HERO_VARIANTS_WITH_STATS_PANEL = new Set([
  "consultant-card",
  "hospital-network",
]);

function hasAgricultureHeroStatsPanel(config, preset) {
  const variant = config?.heroVariant || preset?.heroVariant || "";
  return AGRICULTURE_HERO_VARIANTS_WITH_STATS_PANEL.has(variant);
}

const AGRICULTURE_GENERIC_FEATURE_LABELS = new Set([
  "responsive navigation",
  "hero slideshow",
  "video slide support",
  "template-specific content",
  "autocomplete forms",
  "google map",
]);

const getAgricultureUsefulFeatureChips = (content = {}) => {
  const serviceTitles = Array.isArray(content.services)
    ? content.services.map((service) => service?.title).filter(Boolean)
    : [];
  const markets = Array.isArray(content.industries) ? content.industries.filter(Boolean) : [];
  const processItems = Array.isArray(content.process) ? content.process.filter(Boolean) : [];
  const fallbackFeatures = Array.isArray(content.features)
    ? content.features.filter((feature) => !AGRICULTURE_GENERIC_FEATURE_LABELS.has(String(feature || "").toLowerCase()))
    : [];

  return Array.from(
    new Set([
      ...serviceTitles.slice(0, 3),
      ...markets.slice(0, 2),
      ...processItems.slice(0, 2),
      ...fallbackFeatures,
    ].filter(Boolean)),
  ).slice(0, 6);
};

function AboutSection({ content, images, preset }) {
  const usefulFeatures = getAgricultureUsefulFeatureChips(content);

  return (
    <section className={`agriculture-section agriculture-about agriculture-about--${preset.structure}`}>
      <div className="agriculture-section-copy">
        <span className="agriculture-kicker">About The Company</span>
        <h2>{content.aboutTitle}</h2>
        <p>{content.aboutText}</p>
        <div className="agriculture-feature-cloud">
          {usefulFeatures.map((feature) => <span key={feature}>{feature}</span>)}
        </div>
      </div>
      <div className="agriculture-image-card">
        <img src={images.about} alt="Agriculture operations" />
      </div>
    </section>
  );
}

function VisionMissionValues({ content, config }) {
  return (
    <section className={`agriculture-vmv agriculture-vmv--${config.vmvVariant}`}>
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
    <section className="agriculture-section">
      <div className="agriculture-section-heading">
        <span className="agriculture-kicker">Agriculture Services</span>
        <h2>Professional services configured around the client’s goals, sector and growth stage.</h2>
        <p>Use these services to show real farm support, buyer enquiries and operational solutions.</p>
      </div>
      <div className={`agriculture-cards agriculture-cards--${config.cardVariant}`}>
        {content.services.map((service) => {
          const ServiceIcon = getServiceIcon(service.title, preset);

          return (
            <article key={service.title} className="agriculture-card">
              <span className="agriculture-card-index"><ServiceIcon /></span>
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
    <section className="agriculture-section agriculture-industries">
      <div className="agriculture-section-heading">
        <span className="agriculture-kicker">Industries</span>
        <h2>Built for real agriculture clients and different operating environments.</h2>
      </div>
      <div className="agriculture-industries-grid">
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
    <section className={`agriculture-section agriculture-packages agriculture-packages--${preset.structure}`}>
      <div className="agriculture-section-heading">
        <span className="agriculture-kicker">Recommended Packages</span>
        <h2>Clear packages help customers understand what to request.</h2>
      </div>
      <div className="agriculture-package-grid">
        {content.packages.map((item) => (
          <article key={item.title}>
            <FaClipboardCheck className="agriculture-package-icon" />
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
    <section className={`agriculture-section agriculture-process agriculture-process--${preset.structure}`}>
      <div className="agriculture-section-heading">
        <span className="agriculture-kicker">Operational Method</span>
        <h2>A professional process from assessment to reporting.</h2>
      </div>
      <div className="agriculture-process-list">
        {content.process.map((item, index) => {
          const ProcessIcon = getProcessIcon(preset, index);

          return (
            <article key={item}>
              <span className="agriculture-process-icon"><ProcessIcon /></span>
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
    <section className={`agriculture-section agriculture-solutions agriculture-solutions--${preset.structure}`}>
      <div className="agriculture-section-heading">
        <span className="agriculture-kicker">Solutions</span>
        <h2>Focused solutions for the most common agriculture requests.</h2>
      </div>
      <div className="agriculture-solution-list">
        {content.solutions.map((item, index) => (
          <article key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <FaCrosshairs className="agriculture-solution-icon" />
            <strong>{item}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ images, content }) {
  const galleryImages = useMemo(() => {
    const sourceImages = [
      ...(Array.isArray(images.gallery) ? images.gallery : []),
      images.hero,
      images.about,
      images.page,
    ];

    return sourceImages
      .filter(Boolean)
      .filter((image, index, list) => list.indexOf(image) === index)
      .slice(0, 8);
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);

  if (!galleryImages.length) return null;

  const activeImage = galleryImages[activeIndex] || galleryImages[0];
  const zoomImage = zoomIndex === null ? null : galleryImages[zoomIndex] || galleryImages[0];

  const move = (direction) => {
    setActiveIndex((current) => {
      if (direction === "prev") return current === 0 ? galleryImages.length - 1 : current - 1;
      return current === galleryImages.length - 1 ? 0 : current + 1;
    });
  };

  const moveZoom = (direction) => {
    setZoomIndex((current) => {
      const safeIndex = current ?? activeIndex;
      if (direction === "prev") return safeIndex === 0 ? galleryImages.length - 1 : safeIndex - 1;
      return safeIndex === galleryImages.length - 1 ? 0 : safeIndex + 1;
    });
  };

  return (
    <section id="agriculture-gallery" className="agriculture-section agriculture-gallery-section">
      <div className="agriculture-section-heading">
        <span className="agriculture-kicker">Project Gallery</span>
        <h2>{content?.businessName || "Agriculture"} visuals and farm presentation.</h2>
        <p>Browse farm visuals, produce, livestock and agriculture service images.</p>
      </div>

      <div className="agriculture-gallery-board">
        <button
          type="button"
          className="agriculture-gallery-chevron agriculture-gallery-chevron--left"
          onClick={() => move("prev")}
          aria-label="Previous gallery image"
        >
          ‹
        </button>

        <button
          type="button"
          className="agriculture-gallery-feature"
          onClick={() => setZoomIndex(activeIndex)}
          aria-label="Zoom selected gallery image"
        >
          <img src={activeImage} alt="Agriculture project visual" />
          <span>⌕ Zoom image</span>
        </button>

        <button
          type="button"
          className="agriculture-gallery-chevron agriculture-gallery-chevron--right"
          onClick={() => move("next")}
          aria-label="Next gallery image"
        >
          ›
        </button>
      </div>

      <div className="agriculture-gallery-thumbs" aria-label="Gallery thumbnails">
        {galleryImages.slice(0, 6).map((image, index) => (
          <button
            type="button"
            key={`${image}-${index}`}
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show gallery image ${index + 1}`}
          >
            <img src={image} alt="" />
          </button>
        ))}
      </div>

      {zoomImage && (
        <div className="agriculture-lightbox" role="dialog" aria-modal="true" aria-label="Agriculture image preview">
          <button type="button" className="agriculture-lightbox-backdrop" onClick={() => setZoomIndex(null)} aria-label="Close image preview" />
          <div className="agriculture-lightbox-stage">
            <button type="button" className="agriculture-lightbox-close" onClick={() => setZoomIndex(null)} aria-label="Close image preview">×</button>
            <button type="button" className="agriculture-lightbox-nav agriculture-lightbox-nav--left" onClick={() => moveZoom("prev")} aria-label="Previous image">‹</button>
            <img src={zoomImage} alt="Agriculture project zoom" />
            <button type="button" className="agriculture-lightbox-nav agriculture-lightbox-nav--right" onClick={() => moveZoom("next")} aria-label="Next image">›</button>
          </div>
        </div>
      )}
    </section>
  );
}

function TestimonialsSection({ content }) {
  const proofItems = content.services.slice(0, 2).map((service, index) => ({
    title: service.title,
    text: service.text,
    detail: content.process[index] || content.solutions[index] || content.industries[index] || "Clear agriculture enquiry path.",
  }));

  if (!proofItems.length) return null;

  return (
    <section className="agriculture-testimonials">
      {proofItems.map((item) => (
        <blockquote key={item.title}>
          <p>{item.text}</p>
          <cite>{item.title} · {item.detail}</cite>
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
      <input name="company" placeholder="Company / farm name" autoComplete="organization" />
      <input name="area" placeholder="Town / farm area" autoComplete="address-level2" />
    </>
  );

  if (variant === "organic-order") {
    return (
      <>
        {common}
        <select name="produce_needed" defaultValue="" autoComplete="off">
          <option value="" disabled>Produce needed</option>
          <option>Fresh vegetables</option>
          <option>Fruit supply</option>
          <option>Weekly box orders</option>
          <option>Restaurant / retail supply</option>
        </select>
        <input name="delivery_date" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Tell us quantities, delivery area and preferred supply frequency" rows="5" />
      </>
    );
  }

  if (variant === "agritech-demo") {
    return (
      <>
        {common}
        <input name="farm_size" placeholder="Farm size / hectares" autoComplete="off" />
        <select name="technology_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Technology need</option>
          <option>Farm management software</option>
          <option>Sensor / IoT monitoring</option>
          <option>Yield reporting dashboard</option>
          <option>Traceability and compliance</option>
        </select>
        <textarea name="message" placeholder="Describe your operation and what you want to improve" rows="5" />
      </>
    );
  }

  if (variant === "livestock-supply") {
    return (
      <>
        {common}
        <select name="livestock_service" defaultValue="" autoComplete="off">
          <option value="" disabled>Livestock enquiry</option>
          <option>Cattle supply</option>
          <option>Poultry supply</option>
          <option>Feedlot partnership</option>
          <option>Animal health programme</option>
        </select>
        <input name="quantity" placeholder="Quantity / herd size" autoComplete="off" />
        <textarea name="message" placeholder="Share destination, timing and supply requirements" rows="5" />
      </>
    );
  }

  if (variant === "greenhouse-produce") {
    return (
      <>
        {common}
        <select name="greenhouse_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Greenhouse enquiry</option>
          <option>Fresh produce supply</option>
          <option>Seedling / nursery request</option>
          <option>Hydroponic production support</option>
          <option>Climate-controlled project</option>
        </select>
        <input name="preferred_contact" placeholder="Preferred contact method" autoComplete="off" />
        <textarea name="message" placeholder="Tell us crop, quantity and delivery schedule" rows="5" />
      </>
    );
  }

  if (variant === "winery-booking") {
    return (
      <>
        {common}
        <select name="estate_enquiry" defaultValue="" autoComplete="off">
          <option value="" disabled>Estate enquiry</option>
          <option>Wine order</option>
          <option>Farm visit / tasting</option>
          <option>Event booking</option>
          <option>Retail partnership</option>
        </select>
        <input name="preferred_date" type="date" autoComplete="off" />
        <textarea name="message" placeholder="Share guest count, order needs or partnership details" rows="5" />
      </>
    );
  }

  if (variant === "irrigation-project") {
    return (
      <>
        {common}
        <select name="irrigation_service" defaultValue="" autoComplete="off">
          <option value="" disabled>Irrigation service</option>
          <option>System design</option>
          <option>Pump / borehole setup</option>
          <option>Drip irrigation upgrade</option>
          <option>Maintenance call-out</option>
        </select>
        <input name="site_size" placeholder="Site size / water source" autoComplete="off" />
        <textarea name="message" placeholder="Tell us about crop type, water source and project timing" rows="5" />
      </>
    );
  }

  if (variant === "cooperative-membership") {
    return (
      <>
        {common}
        <select name="cooperative_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Co-operative enquiry</option>
          <option>Join as grower</option>
          <option>Buyer partnership</option>
          <option>Storage and aggregation</option>
          <option>Training / extension support</option>
        </select>
        <input name="crop_or_product" placeholder="Crop / product type" autoComplete="off" />
        <textarea name="message" placeholder="Share your role, region and what support you need" rows="5" />
      </>
    );
  }

  if (variant === "export-quote") {
    return (
      <>
        {common}
        <select name="export_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Export enquiry</option>
          <option>Fresh produce export</option>
          <option>Cold-chain logistics</option>
          <option>Compliance documentation</option>
          <option>Buyer sourcing</option>
        </select>
        <input name="destination" placeholder="Destination market / port" autoComplete="country-name" />
        <textarea name="message" placeholder="Share product, volume, destination and timing" rows="5" />
      </>
    );
  }

  if (variant === "equipment-service") {
    return (
      <>
        {common}
        <select name="equipment_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Equipment need</option>
          <option>Machinery quote</option>
          <option>Repair / maintenance</option>
          <option>Parts enquiry</option>
          <option>Fleet support</option>
        </select>
        <input name="machine_model" placeholder="Machine model / part number if available" autoComplete="off" />
        <textarea name="message" placeholder="Describe the machine, issue or quotation request" rows="5" />
      </>
    );
  }

  return (
    <>
      {common}
      <input name="preferred_date" type="date" autoComplete="off" />
      <select name="enquiry_type" defaultValue="" autoComplete="off">
        <option value="" disabled>Enquiry type</option>
        <option>Produce supply</option>
        <option>Farm visit</option>
        <option>Wholesale / buyer enquiry</option>
        <option>Project quotation</option>
      </select>
      <textarea name="message" placeholder="Briefly tell us what you need, quantity and preferred timing" rows="5" />
    </>
  );
}

function ContactSection({ content, config }) {
  const email = content.contact.email || "info@agri-enterprise.co.za";
  const subject = encodeURIComponent(`${content.businessName} enquiry`);
  const mapQuery = encodeURIComponent(content.contact.mapQuery || content.contact.address || "South Africa");

  return (
    <section className={`agriculture-contact agriculture-contact--${config.formVariant}`}>
      <div className="agriculture-contact-copy">
        <span className="agriculture-kicker">Contact</span>
        <h2>{content.contactTitle}</h2>
        <p>{content.contactIntro}</p>
        <div className="agriculture-contact-details">
          <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
          <a href={`mailto:${email}`}><FaEnvelope /> {email}</a>
          <span><FaMapMarkerAlt /> {content.contact.address}</span>
          <span><FaClock /> {content.contact.hours}</span>
        </div>
      </div>
      <div className="agriculture-contact-panel">
        <form className="agriculture-contact-form" action={`mailto:${email}?subject=${subject}`} method="post" encType="text/plain">
          <ContactFormFields variant={config.formVariant} />
          <button type="submit">Send Agriculture Enquiry</button>
        </form>
        <iframe
          className="agriculture-map"
          title="Farm location map"
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
    <section className="agriculture-cta-band">
      <div>
        <span className="agriculture-kicker">Next Step</span>
        <h2>Ready to help clients contact your agriculture operation?</h2>
        <p>{content.tagline}</p>
      </div>
      <button type="button" onClick={() => onPageChange("contact")}>Request Quote</button>
    </section>
  );
}

function AgricultureFooter({ content, config, onPageChange, preset }) {
  const showSocials = content.socialDisplay?.footer !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        AGRICULTURE_SOCIAL_DEFAULTS[preset.contentKey] || AGRICULTURE_SOCIAL_DEFAULTS.farm,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <footer className={`agriculture-footer agriculture-footer--${config.footerVariant}`}>
      <div className="agriculture-footer-main">
        <div>
          <strong>{content.businessName}</strong>
          <p>{content.tagline}</p>
          {showSocials && socials.length > 0 && (
            <div className="agriculture-footer-social">
              {socials.map(({ key, label, url, Icon, color }) => (
                <a
                  key={key}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="agriculture-social-icon"
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
      <div className="agriculture-footer-bottom">
        <div className="agriculture-copyright small">
          © {new Date().getFullYear()} {content.businessName}. All rights reserved.
        </div>

        <div className="agriculture-powered-by">
          <span>Powered by</span>
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="agriculture-ulterspace-link"
          >
            <img src={ulterspaceLogo} alt="Ulterspace Logo" className="agriculture-ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ content, images, config, preset, onPageChange }) {
  const showHomeTrustStrip = !hasAgricultureHeroStatsPanel(config, preset);

  if (preset.structure === "corporate") {
    return (
      <>
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {showHomeTrustStrip && <TrustStrip content={content} preset={preset} />}
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <IndustriesSection content={content} />
        <OperationsSection content={content} preset={preset} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "consulting") {
    return (
      <>
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <TestimonialsSection content={content} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "finance") {
    return (
      <>
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {showHomeTrustStrip && <TrustStrip content={content} preset={preset} />}
        <ServicesSection content={content} config={config} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <OperationsSection content={content} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "executive") {
    return (
      <>
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        {showHomeTrustStrip && <TrustStrip content={content} preset={preset} />}
        <OperationsSection content={content} preset={preset} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "logistics") {
    return (
      <>
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {showHomeTrustStrip && <TrustStrip content={content} preset={preset} />}
        <OperationsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <IndustriesSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "realestate") {
    return (
      <>
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <ServicesSection content={content} config={config} preset={preset} />
        <AboutSection content={content} images={images} preset={preset} />
        <IndustriesSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "agriculturecare") {
    return (
      <>
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {showHomeTrustStrip && <TrustStrip content={content} preset={preset} />}
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <TestimonialsSection content={content} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "legal") {
    return (
      <>
        <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <TestimonialsSection content={content} />
        <GallerySection images={images} content={content} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  return (
    <>
      <AgricultureHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      {showHomeTrustStrip && <TrustStrip content={content} preset={preset} />}
      <AboutSection content={content} images={images} preset={preset} />
      <ServicesSection content={content} config={config} preset={preset} />
      <VisionMissionValues content={content} config={config} />
      <SolutionsSection content={content} preset={preset} />
      <IndustriesSection content={content} />
      <OperationsSection content={content} preset={preset} />
      <TestimonialsSection content={content} />
      <GallerySection images={images} content={content} />
      <ContactSection content={content} config={config} />
    </>
  );
}

function PageContent({ currentPage, content, images, config, preset, onPageChange }) {
  const title = NAV_ITEMS.find((item) => item.key === currentPage)?.label || "Agriculture";

  if (currentPage === "home") {
    return (
      <HomePage content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
    );
  }

  return (
    <>
      <AgriculturePageHeader title={title} subtitle={content.tagline} images={images} preset={preset} />
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


function AgricultureScrollTopButton({ preset }) {
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
      className={`agriculture-scroll-top agriculture-scroll-top--${preset.structure} ${visible ? "is-visible" : ""}`}
      onClick={scrollPageTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <TopIcon />
    </button>
  );
}

export default function AgricultureRenderer({ settings = {}, preset = AGRICULTURE_PRESETS["agriculture-farm-v1"], page }) {
  const content = useMemo(() => normalizeAgricultureContent(settings, preset), [settings, preset]);
  const config = useMemo(() => getSavedAgricultureConfig(settings, preset), [settings, preset]);
  const images = useMemo(() => getImagePack(config), [config]);
  const initialPage = pageKeyFromPage(page);
  const [internalPage, setInternalPage] = useState(initialPage || "home");
  const currentPage = internalPage;

  useEffect(() => {
    if (page) setInternalPage(initialPage || "home");
  }, [page, initialPage]);

  const onPageChange = (nextPage) => {
    if (nextPage === "gallery") {
      setInternalPage("home");
      scrollToAgricultureGallery();
      return;
    }

    setInternalPage(nextPage);
    scrollPageTop();
  };

  return (
    <div className={`agriculture-template agriculture-shell--${preset.structure} agriculture-template--${preset.template_key}`} style={makeThemeStyle(config)}>
      <AgricultureTopbar content={content} preset={preset} />
      <AgricultureNavbar content={content} config={config} currentPage={currentPage} onPageChange={onPageChange} preset={preset} />
      <main>
        <PageContent currentPage={currentPage} content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      </main>
      <AgricultureFooter content={content} config={config} onPageChange={onPageChange} preset={preset} />
      <AgricultureScrollTopButton preset={preset} />
    </div>
  );
}
