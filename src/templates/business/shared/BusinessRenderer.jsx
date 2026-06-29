import { useEffect, useMemo, useState } from "react";
import {
  FaArrowUp,
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaTimes,
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
  BUSINESS_IMAGE_PACKS,
  BUSINESS_PRESETS,
  BUSINESS_SOCIAL_DEFAULTS,
  BUSINESS_THEMES,
} from "./businessPresets";
import { normalizeBusinessContent } from "./businessFallbacks";
import "./business-shared.css";

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Sectors" },
  { key: "operations", label: "Process" },
  { key: "contact", label: "Contact" },
];


const BUSINESS_PAGE_KEYS = new Set([...NAV_ITEMS.map((item) => item.key), "gallery"]);


const BUSINESS_SOCIAL_ICONS = {
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

const BUSINESS_SOCIAL_STYLE_DEFAULTS = {
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

const BUSINESS_SOCIAL_PRESET_FALLBACKS = {
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
  website: "https://example.com",
  email: "mailto:info@businesscompany.co.za",
  phone: "tel:+27000000000",
};

const BUSINESS_SOCIAL_ORDER = [
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

const BUSINESS_BRAND_ICONS = {
  corporate: FaBuilding,
  consulting: FaChartLine,
  agency: FaUsers,
  finance: FaFileAlt,
  executive: FaIdBadge,
  saas: FaGlobe,
  logistics: FaWarehouse,
  realestate: FaHome,
  healthcare: FaHeadset,
  legal: FaClipboardCheck,
};

const BUSINESS_SNAPSHOT_ICONS = {
  corporate: [FaBuilding, FaChartLine, FaUsers, FaCheckCircle],
  consulting: [FaChartLine, FaClipboardCheck, FaUsers, FaFileAlt],
  agency: [FaUsers, FaGlobe, FaChartLine, FaCheckCircle],
  finance: [FaFileAlt, FaChartLine, FaBuilding, FaCheckCircle],
  executive: [FaIdBadge, FaBuilding, FaUsers, FaCheckCircle],
  saas: [FaGlobe, FaChartLine, FaHeadset, FaCheckCircle],
  logistics: [FaWarehouse, FaRoute, FaClock, FaCheckCircle],
  realestate: [FaHome, FaBuilding, FaMapMarkerAlt, FaCheckCircle],
  healthcare: [FaHeadset, FaUsers, FaClock, FaCheckCircle],
  legal: [FaClipboardCheck, FaFileAlt, FaBuilding, FaCheckCircle],
};

const BUSINESS_PROCESS_ICONS = {
  corporate: [FaClipboardCheck, FaChartLine, FaUsers, FaFileAlt],
  consulting: [FaClipboardCheck, FaChartLine, FaUsers, FaFileAlt],
  agency: [FaGlobe, FaUsers, FaChartLine, FaFileAlt],
  finance: [FaFileAlt, FaChartLine, FaClipboardCheck, FaCheckCircle],
  executive: [FaIdBadge, FaClipboardCheck, FaUsers, FaCheckCircle],
  saas: [FaGlobe, FaHeadset, FaChartLine, FaCheckCircle],
  logistics: [FaRoute, FaWarehouse, FaClock, FaFileAlt],
  realestate: [FaHome, FaMapMarkerAlt, FaUsers, FaFileAlt],
  healthcare: [FaHeadset, FaClipboardCheck, FaClock, FaCheckCircle],
  legal: [FaClipboardCheck, FaFileAlt, FaUsers, FaCheckCircle],
};

const BUSINESS_TOP_SCROLL_ICONS = {
  corporate: FaBuilding,
  consulting: FaChartLine,
  agency: FaGlobe,
  finance: FaFileAlt,
  executive: FaIdBadge,
  saas: FaGlobe,
  logistics: FaRoute,
  realestate: FaHome,
  healthcare: FaHeadset,
  legal: FaClipboardCheck,
};

const SERVICE_ICON_RULES = [
  [["strategy", "consulting", "advisory", "growth"], FaChartLine],
  [["marketing", "brand", "campaign", "creative"], FaGlobe],
  [["finance", "tax", "accounting", "capital", "wealth"], FaFileAlt],
  [["software", "platform", "automation", "digital", "data"], FaGlobe],
  [["logistics", "delivery", "warehouse", "supply", "route"], FaWarehouse],
  [["property", "real estate", "development", "leasing"], FaHome],
  [["health", "care", "clinic", "wellness", "patient"], FaHeadset],
  [["legal", "law", "contract", "compliance"], FaClipboardCheck],
  [["support", "service", "client"], FaHeadset],
  [["team", "people", "talent", "training"], FaUsers],
  [["operations", "process", "management"], FaClipboardCheck],
];

const INDUSTRY_ICON_RULES = [
  [["corporate", "office", "enterprise", "business"], FaBuilding],
  [["retail", "shop", "mall", "store"], FaStore],
  [["industrial", "warehouse", "logistics", "manufacturing"], FaWarehouse],
  [["property", "real estate", "residential", "estate"], FaHome],
  [["school", "education", "academy", "training"], FaSchool],
  [["health", "clinic", "medical", "wellness"], FaHeadset],
  [["event", "conference", "venue"], FaCalendarAlt],
  [["technology", "software", "startup"], FaGlobe],
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
  const icons = BUSINESS_SNAPSHOT_ICONS[preset.structure] || BUSINESS_SNAPSHOT_ICONS.corporate;
  return icons[index % icons.length] || FaCheckCircle;
};

const getProcessIcon = (preset, index) => {
  const icons = BUSINESS_PROCESS_ICONS[preset.structure] || BUSINESS_PROCESS_ICONS.corporate;
  return icons[index % icons.length] || FaClipboardCheck;
};

const getSavedBusinessConfig = (settings, preset) => {
  const saved = settings.business_config || settings.template_config?.business || settings.templateConfig?.business || {};

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
  const baseTheme = BUSINESS_THEMES[config.theme] || BUSINESS_THEMES.corporate;
  const accent = config.accent || baseTheme.accent;

  return {
    "--business-primary": baseTheme.primary,
    "--business-secondary": baseTheme.secondary,
    "--business-accent": accent,
    "--business-accent-2": baseTheme.accent2,
    "--business-surface": baseTheme.surface,
    "--business-card": baseTheme.card,
    "--business-text": baseTheme.text,
    "--business-muted": baseTheme.muted,
    "--business-line": baseTheme.line,
  };
};

const getImagePack = (config) => BUSINESS_IMAGE_PACKS[config.imagePack] || BUSINESS_IMAGE_PACKS.corporate;

const normalizeBusinessPageKey = (value) => {
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

  return BUSINESS_PAGE_KEYS.has(firstSegment) ? firstSegment : "home";
};

const pageKeyFromPage = (page) => {
  if (!page) return "home";

  if (typeof page === "string") {
    return normalizeBusinessPageKey(page);
  }

  return normalizeBusinessPageKey(
    page.slug || page.href || page.path || page.key || page.page_key || page.id || "home",
  );
};

const scrollPageTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const scrollToBusinessGallery = () => {
  if (typeof window === "undefined") return;

  window.setTimeout(() => {
    const target = document.getElementById("business-gallery");

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
      ...BUSINESS_SOCIAL_ORDER,
    ]),
  ).filter((key) => BUSINESS_SOCIAL_ICONS[key]);
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
      const baseItem = BUSINESS_SOCIAL_STYLE_DEFAULTS[key] || {};
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
      data.url = savedItem.url || presetItem.url || contactUrl || BUSINESS_SOCIAL_PRESET_FALLBACKS[key] || baseItem.url || "";

      if (data.enabled === false || !data.url) return null;

      return {
        ...data,
        Icon: BUSINESS_SOCIAL_ICONS[key],
        color: getSocialIconColor(data),
      };
    })
    .filter(Boolean);
};

function BusinessTopbar({ content, preset }) {
  const showSocials = content.socialDisplay?.topbar !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        BUSINESS_SOCIAL_DEFAULTS[preset.contentKey] || BUSINESS_SOCIAL_DEFAULTS.corporate,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <div className="business-topbar">
      <div className="business-topbar-left">
        <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
        <span className="business-topbar-sep">|</span>
        <a href={`mailto:${content.contact.email}`}><FaEnvelope /> {content.contact.email}</a>
        <span className="business-topbar-hours"><FaClock /> {content.contact.hours}</span>
      </div>
      {showSocials && socials.length > 0 && (
        <div className="business-topbar-social" aria-label="Social media links">
          {socials.map(({ key, label, url, Icon, color }) => (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="business-social-icons"
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

function BusinessNavbar({ content, config, currentPage, onPageChange, preset }) {
  const [open, setOpen] = useState(false);
  const BrandIcon = BUSINESS_BRAND_ICONS[preset.contentKey] || FaShieldAlt;
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
  }[preset.structure] || "Business Services";

  const handleNavigate = (pageKey) => {
    setOpen(false);
    onPageChange(pageKey);
  };

  return (
    <header className={`business-navbar business-navbar--${navVariant} business-navbar--structure-${preset.structure}`}>
      <button type="button" className="business-brand" onClick={() => handleNavigate("home")}>
        <span className="business-brand-mark"><BrandIcon /></span>
        <span className="business-brand-copy">
          <strong>{content.businessName}</strong>
          <small>{content.motto}</small>
        </span>
      </button>

      <button
        type="button"
        className={`business-menu-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="business-nav-center">
        <span className="business-nav-eyebrow">{navLabel}</span>
        <nav className={`business-nav-links ${open ? "is-open" : ""}`} aria-label="Business site navigation">
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

      <div className="business-nav-actions">
        <span className="business-nav-support">{content.contact.phone}</span>
        <button type="button" className="business-nav-cta" onClick={() => handleNavigate("contact")}>
          {content.heroCta || "Request Proposal"}
        </button>
      </div>
    </header>
  );
}

function BusinessHeroVisual({ content, images, activeSlide, config, preset, onPageChange }) {
  const variant = config.heroVariant || preset.heroVariant || "boardroom-split";
  const gallery = Array.isArray(images.gallery) && images.gallery.length ? images.gallery : [images.hero, images.about, images.page].filter(Boolean);
  const stats = content.stats.slice(0, 4);
  const services = content.services.slice(0, 3);
  const solutions = content.solutions.slice(0, 4);
  const process = content.process.slice(0, 4);
  const industries = content.industries.slice(0, 4);
  const packages = content.packages.slice(0, 3);
  const BrandIcon = BUSINESS_BRAND_ICONS[preset.contentKey] || FaBuilding;

  if (variant === "advisor-panel") {
    return (
      <aside className="business-hero-visual business-hero-visual--advisor-panel" aria-label="Advisory overview">
        <span className="business-panel-label"><FaChartLine /> Advisory Map</span>
        <div className="business-advisor-brief">
          <strong>{content.vision}</strong>
          <p>{content.mission}</p>
        </div>
        <div className="business-hero-timeline">
          {process.map((item, index) => (
            <article key={item}>
              <span>0{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  if (variant === "campaign-mosaic") {
    return (
      <aside className="business-hero-visual business-hero-visual--campaign-mosaic" aria-label="Campaign studio preview">
        <span className="business-panel-label"><FaGlobe /> Campaign Studio</span>
        <div className="business-mosaic-grid">
          {gallery.slice(0, 3).map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt="" />
          ))}
        </div>
        <div className="business-floating-tags">
          {solutions.map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "capital-dashboard") {
    return (
      <aside className="business-hero-visual business-hero-visual--capital-dashboard" aria-label="Finance dashboard preview">
        <span className="business-panel-label"><FaFileAlt /> Finance Console</span>
        <div className="business-ledger-card">
          <strong>{content.businessName}</strong>
          <p>{content.motto}</p>
        </div>
        <div className="business-metric-ledger">
          {stats.map(([value, label]) => (
            <article key={`${value}-${label}`}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  if (variant === "executive-suite") {
    return (
      <aside className="business-hero-visual business-hero-visual--executive-suite" aria-label="Executive suite preview">
        <div className="business-executive-card">
          <span className="business-panel-label"><FaIdBadge /> Executive Office</span>
          <strong>{content.businessName}</strong>
          <p>{content.tagline}</p>
          <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
        </div>
        <div className="business-executive-values">
          {content.values.slice(0, 4).map((value) => <span key={value}>{value}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "product-cloud") {
    return (
      <aside className="business-hero-visual business-hero-visual--product-cloud" aria-label="Product platform preview">
        <span className="business-panel-label"><FaGlobe /> Product Workspace</span>
        <div className="business-product-window">
          <div className="business-window-dots"><span /><span /><span /></div>
          {content.features.slice(0, 5).map((feature) => <p key={feature}>{feature}</p>)}
        </div>
        <div className="business-integration-cloud">
          {solutions.map((item) => <span key={item}>{item}</span>)}
        </div>
      </aside>
    );
  }

  if (variant === "route-command") {
    return (
      <aside className="business-hero-visual business-hero-visual--route-command" aria-label="Route control preview">
        <span className="business-panel-label"><FaRoute /> Route Command</span>
        <div className="business-route-line">
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

  if (variant === "property-showcase") {
    return (
      <aside className="business-hero-visual business-hero-visual--property-showcase" aria-label="Property showcase">
        <img src={activeSlide?.image || images.hero} alt="" />
        <div className="business-property-card">
          <span className="business-panel-label"><FaHome /> Property Portfolio</span>
          {packages.map((item) => <p key={item.title}>{item.title}</p>)}
        </div>
      </aside>
    );
  }

  if (variant === "care-trust") {
    return (
      <aside className="business-hero-visual business-hero-visual--care-trust" aria-label="Appointment card">
        <span className="business-panel-label"><FaHeadset /> Appointment Desk</span>
        <strong>{content.contact.hours}</strong>
        <p>{content.contactIntro}</p>
        <div className="business-care-services">
          {services.map((service) => <span key={service.title}>{service.title}</span>)}
        </div>
        <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
      </aside>
    );
  }

  if (variant === "legal-authority") {
    return (
      <aside className="business-hero-visual business-hero-visual--legal-authority" aria-label="Legal authority panel">
        <span className="business-panel-label"><FaClipboardCheck /> Practice Docket</span>
        <div className="business-docket-list">
          {industries.map((item, index) => (
            <article key={item}>
              <span>Case {String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="business-hero-visual business-hero-visual--boardroom-split" aria-label="Business highlights">
      <span className="business-panel-label"><BrandIcon /> Business Snapshot</span>
      <div className="business-boardroom-grid">
        {stats.map(([value, label], statIndex) => {
          const SnapshotIcon = getSnapshotIcon(preset, statIndex);

          return (
            <article key={`${value}-${label}`}>
              <SnapshotIcon className="business-snapshot-icon" />
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          );
        })}
      </div>
    </aside>
  );
}

function BusinessHero({ content, images, config, preset, onPageChange }) {
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
    <section className={`business-hero business-hero--${variant} business-hero--structure-${preset.structure}`}>
      <div className="business-hero-media" aria-hidden="true">
        {activeSlide?.type === "video" && activeSlide.video ? (
          <video key={activeSlide.video} autoPlay muted loop playsInline poster={activeSlide.image}>
            <source src={activeSlide.video} type="video/mp4" />
          </video>
        ) : (
          <img src={activeSlide?.image || images.hero} alt="" />
        )}
        <span className="business-hero-overlay" />
      </div>

      <div className="business-hero-content">
        <span className="business-kicker">{preset.name}</span>
        <h1>{activeSlide?.title || content.heroTitle}</h1>
        <p>{activeSlide?.subtitle || content.heroSubtitle}</p>
        <div className="business-hero-actions">
          <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
          <button type="button" className="ghost" onClick={() => onPageChange("gallery")}>View Business Gallery</button>
        </div>
      </div>

      <BusinessHeroVisual
        content={content}
        images={images}
        activeSlide={activeSlide}
        config={config}
        preset={preset}
        onPageChange={onPageChange}
      />

      {slides.length > 1 && (
        <div className="business-slider-controls" aria-label="Hero slideshow controls">
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

function BusinessPageHeader({ title, subtitle, images, preset }) {
  return (
    <section className="business-page-header">
      <img src={images.page} alt="" aria-hidden="true" />
      <span className="business-page-overlay" />
      <div>
        <span className="business-kicker">{preset.name}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function TrustStrip({ content, preset }) {
  return (
    <section className="business-trust-strip">
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


const DUPLICATE_TRUST_STRIP_HERO_VARIANTS = new Set(["boardroom-split", "capital-dashboard"]);

function shouldShowTrustStrip(preset, config = {}) {
  const variant = config?.heroVariant || preset?.heroVariant || "";
  return !DUPLICATE_TRUST_STRIP_HERO_VARIANTS.has(variant);
}

function AboutSection({ content, images, preset }) {
  return (
    <section className={`business-section business-about business-about--${preset.structure}`}>
      <div className="business-section-copy">
        <span className="business-kicker">About The Company</span>
        <h2>{content.aboutTitle}</h2>
        <p>{content.aboutText}</p>
        <div className="business-feature-cloud">
          {content.features.slice(0, 6).map((feature) => <span key={feature}>{feature}</span>)}
        </div>
      </div>
      <div className="business-image-card">
        <img src={images.about} alt="Business operations" />
      </div>
    </section>
  );
}

function VisionMissionValues({ content, config }) {
  return (
    <section className={`business-vmv business-vmv--${config.vmvVariant}`}>
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
    <section className="business-section">
      <div className="business-section-heading">
        <span className="business-kicker">Business Services</span>
        <h2>Professional services configured around the client’s goals, sector and growth stage.</h2>
        <p>Each service card can be edited through the same builder fields and fallback system.</p>
      </div>
      <div className={`business-cards business-cards--${config.cardVariant}`}>
        {content.services.map((service) => {
          const ServiceIcon = getServiceIcon(service.title, preset);

          return (
            <article key={service.title} className="business-card">
              <span className="business-card-index"><ServiceIcon /></span>
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
    <section className="business-section business-industries">
      <div className="business-section-heading">
        <span className="business-kicker">Industries</span>
        <h2>Built for real business clients and different operating environments.</h2>
      </div>
      <div className="business-industries-grid">
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
    <section className={`business-section business-packages business-packages--${preset.structure}`}>
      <div className="business-section-heading">
        <span className="business-kicker">Recommended Packages</span>
        <h2>Clear packages help customers understand what to request.</h2>
      </div>
      <div className="business-package-grid">
        {content.packages.map((item) => (
          <article key={item.title}>
            <FaClipboardCheck className="business-package-icon" />
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
    <section className={`business-section business-process business-process--${preset.structure}`}>
      <div className="business-section-heading">
        <span className="business-kicker">Operational Method</span>
        <h2>A professional process from assessment to reporting.</h2>
      </div>
      <div className="business-process-list">
        {content.process.map((item, index) => {
          const ProcessIcon = getProcessIcon(preset, index);

          return (
            <article key={item}>
              <span className="business-process-icon"><ProcessIcon /></span>
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
    <section className={`business-section business-solutions business-solutions--${preset.structure}`}>
      <div className="business-section-heading">
        <span className="business-kicker">Solutions</span>
        <h2>Focused solutions for the most common business requests.</h2>
      </div>
      <div className="business-solution-list">
        {content.solutions.map((item, index) => (
          <article key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <FaCrosshairs className="business-solution-icon" />
            <strong>{item}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function getBusinessGalleryImages(images = {}) {
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
}

function GallerySection({ images, content, preset }) {
  const galleryImages = getBusinessGalleryImages(images);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  const activeImage = galleryImages[activeIndex] || galleryImages[0];
  const zoomImage = zoomIndex === null ? null : galleryImages[zoomIndex] || galleryImages[0];
  const galleryTitle = content?.businessName || preset?.name || "Business Gallery";

  const move = (direction) => {
    setActiveIndex((current) => {
      if (!galleryImages.length) return 0;
      if (direction === "prev") return current === 0 ? galleryImages.length - 1 : current - 1;
      return current === galleryImages.length - 1 ? 0 : current + 1;
    });
  };

  const moveZoom = (direction) => {
    setZoomIndex((current) => {
      const safeIndex = current ?? activeIndex;
      if (!galleryImages.length) return 0;
      if (direction === "prev") return safeIndex === 0 ? galleryImages.length - 1 : safeIndex - 1;
      return safeIndex === galleryImages.length - 1 ? 0 : safeIndex + 1;
    });
  };

  useEffect(() => {
    if (zoomIndex === null || typeof window === "undefined") return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") setZoomIndex(null);
      if (event.key === "ArrowLeft") moveZoom("prev");
      if (event.key === "ArrowRight") moveZoom("next");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zoomIndex, galleryImages.length]);

  if (!galleryImages.length) return null;

  return (
    <section id="business-gallery" className={`business-section business-gallery-section business-gallery-section--${preset?.structure || "corporate"}`}>
      <div className="business-section-heading business-section-heading--action">
        <div>
          <span className="business-kicker">Business Gallery</span>
          <h2>{galleryTitle} visuals and service presentation.</h2>
          <p>Browse workspace visuals, client service moments and business presentation images.</p>
        </div>
      </div>

      <div className="business-gallery-board">
        <button type="button" className="business-gallery-chevron business-gallery-chevron--left" onClick={() => move("prev")} aria-label="Previous gallery image">
          <FaChevronLeft />
        </button>

        <button
          type="button"
          className="business-gallery-feature"
          onClick={() => setZoomIndex(activeIndex)}
          aria-label="Zoom selected gallery image"
        >
          <img src={activeImage} alt={`${galleryTitle} visual`} />
          <span><FaSearchPlus /> Zoom image</span>
        </button>

        <button type="button" className="business-gallery-chevron business-gallery-chevron--right" onClick={() => move("next")} aria-label="Next gallery image">
          <FaChevronRight />
        </button>
      </div>

      <div className="business-gallery-thumbs" aria-label="Gallery thumbnails">
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
        <div className="business-lightbox" role="dialog" aria-modal="true" aria-label="Business image preview">
          <button type="button" className="business-lightbox-backdrop" onClick={() => setZoomIndex(null)} aria-label="Close image preview" />
          <div className="business-lightbox-stage">
            <button type="button" className="business-lightbox-close" onClick={() => setZoomIndex(null)} aria-label="Close image preview"><FaTimes /></button>
            <button type="button" className="business-lightbox-nav business-lightbox-nav--left" onClick={() => moveZoom("prev")} aria-label="Previous image"><FaChevronLeft /></button>
            <img src={zoomImage} alt="Business gallery zoom" />
            <button type="button" className="business-lightbox-nav business-lightbox-nav--right" onClick={() => moveZoom("next")} aria-label="Next image"><FaChevronRight /></button>
          </div>
        </div>
      )}
    </section>
  );
}

function TestimonialsSection({ content }) {
  return (
    <section className="business-testimonials">
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
      <input name="name" placeholder="Full name" autoComplete="name" required />
      <input name="company" placeholder="Company / organisation" autoComplete="organization" />
      <input name="email" type="email" placeholder="Email address" autoComplete="email" required />
      <input name="phone" placeholder="Phone number" autoComplete="tel" required />
    </>
  );

  if (variant === "consulting-brief") {
    return (
      <>
        {common}
        <select name="consulting_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Consulting requirement</option>
          <option>Strategy review</option>
          <option>Operations improvement</option>
          <option>Market expansion</option>
          <option>Transformation roadmap</option>
        </select>
        <input name="timeline" placeholder="Preferred timeline" autoComplete="off" />
        <textarea name="message" placeholder="Tell us about the business challenge and desired outcome" rows="5" />
      </>
    );
  }

  if (variant === "campaign-start") {
    return (
      <>
        {common}
        <select name="campaign_type" defaultValue="" autoComplete="off">
          <option value="" disabled>Project type</option>
          <option>Brand identity</option>
          <option>Website / landing page</option>
          <option>Social media campaign</option>
          <option>Lead-generation funnel</option>
        </select>
        <input name="budget_range" placeholder="Budget range" autoComplete="off" />
        <textarea name="message" placeholder="Describe the campaign, audience and launch date" rows="5" />
      </>
    );
  }

  if (variant === "finance-consultation") {
    return (
      <>
        {common}
        <select name="finance_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Finance support needed</option>
          <option>Accounting / tax support</option>
          <option>Funding readiness</option>
          <option>Financial planning</option>
          <option>Business valuation</option>
        </select>
        <input name="business_stage" placeholder="Business stage / annual turnover" autoComplete="off" />
        <textarea name="message" placeholder="Share what financial support you need" rows="5" />
      </>
    );
  }

  if (variant === "executive-intake") {
    return (
      <>
        {common}
        <input name="role" placeholder="Your role / decision maker" autoComplete="organization-title" />
        <select name="executive_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Executive requirement</option>
          <option>Partnership discussion</option>
          <option>Board advisory</option>
          <option>Corporate service enquiry</option>
          <option>Confidential business request</option>
        </select>
        <textarea name="message" placeholder="Share a short professional summary of your enquiry" rows="5" />
      </>
    );
  }

  if (variant === "demo-request") {
    return (
      <>
        {common}
        <input name="team_size" placeholder="Team size / users" autoComplete="off" />
        <select name="demo_interest" defaultValue="" autoComplete="off">
          <option value="" disabled>Demo interest</option>
          <option>Product demo</option>
          <option>Pricing discussion</option>
          <option>Integration support</option>
          <option>Enterprise rollout</option>
        </select>
        <textarea name="message" placeholder="Tell us about your workflow, systems and goals" rows="5" />
      </>
    );
  }

  if (variant === "shipment-plan") {
    return (
      <>
        {common}
        <input name="origin" placeholder="Pickup / origin location" autoComplete="address-level2" />
        <input name="destination" placeholder="Delivery / destination location" autoComplete="address-level2" />
        <input name="freight_type" placeholder="Freight type / volume" autoComplete="off" />
        <textarea name="message" placeholder="Describe the route, schedule, warehousing or delivery needs" rows="5" />
      </>
    );
  }

  if (variant === "property-enquiry") {
    return (
      <>
        {common}
        <select name="property_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Property requirement</option>
          <option>Buy / lease property</option>
          <option>Sell / value property</option>
          <option>Property management</option>
          <option>Development / investment</option>
        </select>
        <input name="location" placeholder="Preferred area / suburb" autoComplete="address-level2" />
        <textarea name="message" placeholder="Tell us about the property, budget and timing" rows="5" />
      </>
    );
  }

  if (variant === "appointment-request") {
    return (
      <>
        {common}
        <input name="preferred_date" type="date" autoComplete="off" />
        <select name="appointment_type" defaultValue="" autoComplete="off">
          <option value="" disabled>Appointment type</option>
          <option>General consultation</option>
          <option>Follow-up appointment</option>
          <option>Corporate wellness enquiry</option>
          <option>Practice service question</option>
        </select>
        <textarea name="message" placeholder="Briefly tell us what support you need" rows="5" />
      </>
    );
  }

  if (variant === "legal-consultation") {
    return (
      <>
        {common}
        <select name="legal_need" defaultValue="" autoComplete="off">
          <option value="" disabled>Legal support needed</option>
          <option>Contract review</option>
          <option>Business compliance</option>
          <option>Company advisory</option>
          <option>Dispute / risk review</option>
        </select>
        <input name="preferred_contact" placeholder="Preferred contact method" autoComplete="off" />
        <textarea name="message" placeholder="Share a short non-confidential summary of your matter" rows="5" />
      </>
    );
  }

  return (
    <>
      {common}
      <input name="service_needed" placeholder="Service needed" autoComplete="off" />
      <input name="project_timeline" placeholder="Timeline / preferred start date" autoComplete="off" />
      <textarea name="message" placeholder="Tell us about your business, goals and what you need" rows="5" />
    </>
  );
}

function ContactSection({ content, config }) {
  const email = content.contact.email || "info@businesscompany.co.za";
  const subject = encodeURIComponent(`${content.businessName} enquiry`);
  const mapQuery = encodeURIComponent(content.contact.mapQuery || content.contact.address || "South Africa");

  return (
    <section className={`business-contact business-contact--${config.formVariant}`}>
      <div className="business-contact-copy">
        <span className="business-kicker">Contact</span>
        <h2>{content.contactTitle}</h2>
        <p>{content.contactIntro}</p>
        <div className="business-contact-details">
          <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
          <a href={`mailto:${email}`}><FaEnvelope /> {email}</a>
          <span><FaMapMarkerAlt /> {content.contact.address}</span>
          <span><FaClock /> {content.contact.hours}</span>
        </div>
      </div>
      <div className="business-contact-panel">
        <form className="business-contact-form" action={`mailto:${email}?subject=${subject}`} method="post" encType="text/plain">
          <ContactFormFields variant={config.formVariant} />
          <button type="submit">Send Business Enquiry</button>
        </form>
        <iframe
          className="business-map"
          title="Business location map"
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
    <section className="business-cta-band">
      <div>
        <span className="business-kicker">Next Step</span>
        <h2>Ready to turn this into a real business company website?</h2>
        <p>{content.tagline}</p>
      </div>
      <button type="button" onClick={() => onPageChange("contact")}>Request Proposal</button>
    </section>
  );
}

function BusinessFooter({ content, config, onPageChange, preset }) {
  const showSocials = content.socialDisplay?.footer !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        BUSINESS_SOCIAL_DEFAULTS[preset.contentKey] || BUSINESS_SOCIAL_DEFAULTS.corporate,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <footer className={`business-footer business-footer--${config.footerVariant}`}>
      <div className="business-footer-main">
        <div>
          <strong>{content.businessName}</strong>
          <p>{content.tagline}</p>
          {showSocials && socials.length > 0 && (
            <div className="business-footer-social">
              {socials.map(({ key, label, url, Icon, color }) => (
                <a
                  key={key}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="business-social-icon"
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
      <div className="business-footer-bottom">
        <div className="business-copyright small">
          © {new Date().getFullYear()} {content.businessName}. All rights reserved.
        </div>

        <div className="business-powered-by">
          <span>Powered by</span>
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="business-ulterspace-link"
          >
            <img src={ulterspaceLogo} alt="Ulterspace Logo" className="business-ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function BusinessHeroWithGallery({ content, images, config, preset, onPageChange }) {
  return (
    <>
      <BusinessHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      <GallerySection images={images} content={content} preset={preset} />
    </>
  );
}

function HomePage({ content, images, config, preset, onPageChange }) {
  if (preset.structure === "corporate") {
    return (
      <>
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {shouldShowTrustStrip(preset, config) && <TrustStrip content={content} preset={preset} />}
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
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <CTASection content={content} onPageChange={onPageChange} />
      </>
    );
  }

  if (preset.structure === "agency") {
    return (
      <>
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "finance") {
    return (
      <>
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {shouldShowTrustStrip(preset, config) && <TrustStrip content={content} preset={preset} />}
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
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <ServicesSection content={content} config={config} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <OperationsSection content={content} preset={preset} />
        <CTASection content={content} onPageChange={onPageChange} />
      </>
    );
  }

  if (preset.structure === "saas") {
    return (
      <>
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        {shouldShowTrustStrip(preset, config) && <TrustStrip content={content} preset={preset} />}
        <OperationsSection content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "logistics") {
    return (
      <>
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {shouldShowTrustStrip(preset, config) && <TrustStrip content={content} preset={preset} />}
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
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
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
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        {shouldShowTrustStrip(preset, config) && <TrustStrip content={content} preset={preset} />}
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "legal") {
    return (
      <>
        <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  return (
    <>
      <BusinessHeroWithGallery content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      {shouldShowTrustStrip(preset, config) && <TrustStrip content={content} preset={preset} />}
      <AboutSection content={content} images={images} preset={preset} />
      <ServicesSection content={content} config={config} preset={preset} />
      <VisionMissionValues content={content} config={config} />
      <SolutionsSection content={content} preset={preset} />
      <IndustriesSection content={content} />
      <OperationsSection content={content} preset={preset} />
      <ContactSection content={content} config={config} />
    </>
  );
}

function PageContent({ currentPage, content, images, config, preset, onPageChange }) {
  const title = NAV_ITEMS.find((item) => item.key === currentPage)?.label || "Business";

  if (currentPage === "home") {
    return <HomePage content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />;
  }

  if (currentPage === "gallery") {
    return (
      <>
        <BusinessPageHeader title="Business Gallery" subtitle={content.tagline} images={images} preset={preset} />
        <GallerySection images={images} content={content} preset={preset} />
      </>
    );
  }

  return (
    <>
      <BusinessPageHeader title={title} subtitle={content.tagline} images={images} preset={preset} />
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
          <GallerySection images={images} content={content} preset={preset} />
        </>
      )}
      {currentPage === "operations" && (
        <>
          <OperationsSection content={content} preset={preset} />
          {shouldShowTrustStrip(preset, config) && <TrustStrip content={content} preset={preset} />}
          <VisionMissionValues content={content} config={config} />
        </>
      )}
      {currentPage === "contact" && <ContactSection content={content} config={config} />}
    </>
  );
}


function BusinessScrollTopButton({ preset }) {
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
      className={`business-scroll-top business-scroll-top--${preset.structure} ${visible ? "is-visible" : ""}`}
      onClick={scrollPageTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <TopIcon />
    </button>
  );
}

export default function BusinessRenderer({ settings = {}, preset = BUSINESS_PRESETS["business-corporate-v1"], page }) {
  const content = useMemo(() => normalizeBusinessContent(settings, preset), [settings, preset]);
  const config = useMemo(() => getSavedBusinessConfig(settings, preset), [settings, preset]);
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
      scrollToBusinessGallery();
      return;
    }

    setInternalPage(nextPage);
    scrollPageTop();
  };

  return (
    <div className={`business-template business-shell--${preset.structure} business-template--${preset.template_key}`} style={makeThemeStyle(config)}>
      <BusinessTopbar content={content} preset={preset} />
      <BusinessNavbar content={content} config={config} currentPage={currentPage} onPageChange={onPageChange} preset={preset} />
      <main>
        <PageContent currentPage={currentPage} content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      </main>
      <BusinessFooter content={content} config={config} onPageChange={onPageChange} preset={preset} />
      <BusinessScrollTopButton preset={preset} />
    </div>
  );
}
