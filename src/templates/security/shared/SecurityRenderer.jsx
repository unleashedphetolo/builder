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
  SECURITY_IMAGE_PACKS,
  SECURITY_PRESETS,
  SECURITY_SOCIAL_DEFAULTS,
  SECURITY_THEMES,
} from "./securityPresets";
import { normalizeSecurityContent } from "./securityFallbacks";
import "./security-shared.css";

const NAV_ITEMS = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "industries", label: "Industries" },
  { key: "operations", label: "Operations" },
  { key: "contact", label: "Contact" },
];


const SECURITY_PAGE_KEYS = new Set([...NAV_ITEMS.map((item) => item.key), "gallery"]);


const SECURITY_SOCIAL_ICONS = {
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

const SECURITY_SOCIAL_STYLE_DEFAULTS = {
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

const SECURITY_SOCIAL_PRESET_FALLBACKS = {
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
  email: "mailto:info@securitycompany.co.za",
  phone: "tel:+27000000000",
};

const SECURITY_SOCIAL_ORDER = [
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

const SECURITY_BRAND_ICONS = {
  guarding: FaUserShield,
  surveillance: FaVideo,
  executive: FaIdBadge,
  event: FaUsers,
  patrol: FaRoute,
  alarm: FaBell,
  industrial: FaWarehouse,
  estate: FaHome,
  systems: FaLock,
  retail: FaStore,
};

const SECURITY_SNAPSHOT_ICONS = {
  guarding: [FaShieldAlt, FaClock, FaRoute, FaClipboardCheck],
  surveillance: [FaVideo, FaBell, FaFingerprint, FaChartLine],
  executive: [FaIdBadge, FaCarSide, FaLock, FaCheckCircle],
  event: [FaUsers, FaCalendarAlt, FaMapMarkerAlt, FaHeadset],
  patrol: [FaRoute, FaClock, FaMapMarkerAlt, FaClipboardCheck],
  alarm: [FaBell, FaHeadset, FaClock, FaCheckCircle],
  industrial: [FaWarehouse, FaHardHat, FaRoute, FaClipboardCheck],
  estate: [FaHome, FaIdBadge, FaRoute, FaUsers],
  systems: [FaVideo, FaLock, FaFingerprint, FaHeadset],
  retail: [FaStore, FaUsers, FaClipboardCheck, FaCheckCircle],
};

const SECURITY_PROCESS_ICONS = {
  guarding: [FaClipboardCheck, FaIdBadge, FaRoute, FaFileAlt],
  surveillance: [FaVideo, FaBell, FaFingerprint, FaHeadset],
  executive: [FaShieldAlt, FaCarSide, FaLock, FaCheckCircle],
  event: [FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaHeadset],
  patrol: [FaRoute, FaClock, FaMapMarkerAlt, FaFileAlt],
  alarm: [FaBell, FaHeadset, FaClock, FaFileAlt],
  industrial: [FaWarehouse, FaHardHat, FaIdBadge, FaClipboardCheck],
  estate: [FaHome, FaIdBadge, FaUsers, FaFileAlt],
  systems: [FaVideo, FaFingerprint, FaLock, FaHeadset],
  retail: [FaStore, FaUsers, FaClipboardCheck, FaHeadset],
};

const SECURITY_TOP_SCROLL_ICONS = {
  guarding: FaShieldAlt,
  surveillance: FaVideo,
  executive: FaIdBadge,
  event: FaUsers,
  patrol: FaRoute,
  alarm: FaBell,
  industrial: FaWarehouse,
  estate: FaHome,
  systems: FaLock,
  retail: FaStore,
};

const SERVICE_ICON_RULES = [
  [["cctv", "camera", "monitoring", "surveillance"], FaVideo],
  [["alarm", "alert"], FaBell],
  [["access", "visitor", "gate", "entry"], FaIdBadge],
  [["patrol", "perimeter", "route"], FaRoute],
  [["event", "crowd", "venue", "vip area"], FaUsers],
  [["executive", "vip", "transport", "secure"], FaCarSide],
  [["risk", "assessment", "advisory", "audit"], FaChartLine],
  [["incident", "report", "documentation"], FaFileAlt],
  [["estate", "residential", "home"], FaHome],
  [["school", "campus"], FaSchool],
  [["warehouse", "industrial"], FaWarehouse],
  [["retail", "commercial", "mall"], FaStore],
  [["construction", "site"], FaHardHat],
];

const INDUSTRY_ICON_RULES = [
  [["school", "campus", "academy"], FaSchool],
  [["estate", "residential", "home"], FaHome],
  [["warehouse", "industrial"], FaWarehouse],
  [["retail", "mall", "shop"], FaStore],
  [["construction", "site"], FaHardHat],
  [["office", "corporate", "business"], FaBuilding],
  [["event", "venue", "festival", "conference"], FaCalendarAlt],
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
  const icons = SECURITY_SNAPSHOT_ICONS[preset.structure] || SECURITY_SNAPSHOT_ICONS.guarding;
  return icons[index % icons.length] || FaCheckCircle;
};

const getProcessIcon = (preset, index) => {
  const icons = SECURITY_PROCESS_ICONS[preset.structure] || SECURITY_PROCESS_ICONS.guarding;
  return icons[index % icons.length] || FaClipboardCheck;
};

const getSavedSecurityConfig = (settings, preset) => {
  const saved = settings.security_config || settings.template_config?.security || settings.templateConfig?.security || {};

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
  const baseTheme = SECURITY_THEMES[config.theme] || SECURITY_THEMES.command;
  const accent = config.accent || baseTheme.accent;

  return {
    "--security-primary": baseTheme.primary,
    "--security-secondary": baseTheme.secondary,
    "--security-accent": accent,
    "--security-accent-2": baseTheme.accent2,
    "--security-surface": baseTheme.surface,
    "--security-card": baseTheme.card,
    "--security-text": baseTheme.text,
    "--security-muted": baseTheme.muted,
    "--security-line": baseTheme.line,
  };
};

const getImagePack = (config) => SECURITY_IMAGE_PACKS[config.imagePack] || SECURITY_IMAGE_PACKS.guarding;

const normalizeSecurityPageKey = (value) => {
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

  return SECURITY_PAGE_KEYS.has(firstSegment) ? firstSegment : "home";
};

const pageKeyFromPage = (page) => {
  if (!page) return "home";

  if (typeof page === "string") {
    return normalizeSecurityPageKey(page);
  }

  return normalizeSecurityPageKey(
    page.slug || page.href || page.path || page.key || page.page_key || page.id || "home",
  );
};

const scrollPageTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const scrollToSecurityGallery = () => {
  if (typeof window === "undefined") return;

  window.setTimeout(() => {
    const target = document.getElementById("security-gallery");

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
      ...SECURITY_SOCIAL_ORDER,
    ]),
  ).filter((key) => SECURITY_SOCIAL_ICONS[key]);
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
      const baseItem = SECURITY_SOCIAL_STYLE_DEFAULTS[key] || {};
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
      data.url = savedItem.url || presetItem.url || contactUrl || SECURITY_SOCIAL_PRESET_FALLBACKS[key] || baseItem.url || "";

      if (data.enabled === false || !data.url) return null;

      return {
        ...data,
        Icon: SECURITY_SOCIAL_ICONS[key],
        color: getSocialIconColor(data),
      };
    })
    .filter(Boolean);
};

function SecurityTopbar({ content, preset }) {
  const showSocials = content.socialDisplay?.topbar !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        SECURITY_SOCIAL_DEFAULTS[preset.contentKey] || SECURITY_SOCIAL_DEFAULTS.guarding,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <div className="security-topbar">
      <div className="security-topbar-left">
        <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
        <span className="security-topbar-sep">|</span>
        <a href={`mailto:${content.contact.email}`}><FaEnvelope /> {content.contact.email}</a>
        <span className="security-topbar-hours"><FaClock /> {content.contact.hours}</span>
      </div>
      {showSocials && socials.length > 0 && (
        <div className="security-topbar-social" aria-label="Social media links">
          {socials.map(({ key, label, url, Icon, color }) => (
            <a
              key={key}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="security-social-icons"
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

function SecurityNavbar({ content, config, currentPage, onPageChange, preset }) {
  const [open, setOpen] = useState(false);
  const BrandIcon = SECURITY_BRAND_ICONS[preset.contentKey] || FaShieldAlt;

  const handleNavigate = (pageKey) => {
    setOpen(false);
    onPageChange(pageKey);
  };

  return (
    <header className={`security-navbar security-navbar--${config.navbarVariant}`}>
      <button type="button" className="security-brand" onClick={() => handleNavigate("home")}>
        <span className="security-brand-mark"><BrandIcon /></span>
        <span className="security-brand-copy">
          <strong>{content.businessName}</strong>
          <small>{content.motto}</small>
        </span>
      </button>

      <button
        type="button"
        className={`security-menu-toggle ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`security-nav-links ${open ? "is-open" : ""}`} aria-label="Security site navigation">
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

      <button type="button" className="security-nav-cta" onClick={() => handleNavigate("contact")}>
        Request Quote
      </button>
    </header>
  );
}

function SecurityHero({ content, images, config, preset, onPageChange }) {
  const slides = config.slides || images.slides || [{ type: "image", title: content.heroTitle, subtitle: content.heroSubtitle, image: images.hero }];
  const [index, setIndex] = useState(0);
  const activeSlide = slides[index] || slides[0];

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
    <section className={`security-hero security-hero--${config.heroVariant}`}>
      <div className="security-hero-media" aria-hidden="true">
        {activeSlide?.type === "video" && activeSlide.video ? (
          <video key={activeSlide.video} autoPlay muted loop playsInline poster={activeSlide.image}>
            <source src={activeSlide.video} type="video/mp4" />
          </video>
        ) : (
          <img src={activeSlide?.image || images.hero} alt="" />
        )}
        <span className="security-hero-overlay" />
      </div>

      <div className="security-hero-content">
        <span className="security-kicker">{preset.name}</span>
        <h1>{activeSlide?.title || content.heroTitle}</h1>
        <p>{activeSlide?.subtitle || content.heroSubtitle}</p>
        <div className="security-hero-actions">
          <button type="button" onClick={() => onPageChange("contact")}>{content.heroCta}</button>
          <button type="button" className="ghost" onClick={() => onPageChange("gallery")}>View Security Gallery</button>
        </div>
      </div>

      <div className={`security-hero-panel security-hero-panel--${preset.structure}`} aria-label="Security highlights">
        <span className="security-panel-label"><FaChartLine /> Operations Snapshot</span>
        {content.stats.map(([value, label], statIndex) => {
          const SnapshotIcon = getSnapshotIcon(preset, statIndex);

          return (
            <article key={`${value}-${label}`}>
              <SnapshotIcon className="security-snapshot-icon" />
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          );
        })}
      </div>

      {slides.length > 1 && (
        <div className="security-slider-controls" aria-label="Hero slideshow controls">
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

function SecurityPageHeader({ title, subtitle, images, preset }) {
  return (
    <section className="security-page-header">
      <img src={images.page} alt="" aria-hidden="true" />
      <span className="security-page-overlay" />
      <div>
        <span className="security-kicker">{preset.name}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function TrustStrip({ content, preset }) {
  return (
    <section className="security-trust-strip">
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
    <section className={`security-section security-about security-about--${preset.structure}`}>
      <div className="security-section-copy">
        <span className="security-kicker">About The Company</span>
        <h2>{content.aboutTitle}</h2>
        <p>{content.aboutText}</p>
        <div className="security-feature-cloud">
          {content.features.slice(0, 6).map((feature) => <span key={feature}>{feature}</span>)}
        </div>
      </div>
      <div className="security-image-card">
        <img src={images.about} alt="Security operations" />
      </div>
    </section>
  );
}

function VisionMissionValues({ content, config }) {
  return (
    <section className={`security-vmv security-vmv--${config.vmvVariant}`}>
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
    <section className="security-section">
      <div className="security-section-heading">
        <span className="security-kicker">Security Services</span>
        <h2>Professional services configured around the client’s site, people and risk profile.</h2>
        <p>Each service card can be edited through the same builder fields and fallback system.</p>
      </div>
      <div className={`security-cards security-cards--${config.cardVariant}`}>
        {content.services.map((service) => {
          const ServiceIcon = getServiceIcon(service.title, preset);

          return (
            <article key={service.title} className="security-card">
              <span className="security-card-index"><ServiceIcon /></span>
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
    <section className="security-section security-industries">
      <div className="security-section-heading">
        <span className="security-kicker">Industries</span>
        <h2>Built for real security clients and different operating environments.</h2>
      </div>
      <div className="security-industries-grid">
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
    <section className={`security-section security-packages security-packages--${preset.structure}`}>
      <div className="security-section-heading">
        <span className="security-kicker">Recommended Packages</span>
        <h2>Clear packages help customers understand what to request.</h2>
      </div>
      <div className="security-package-grid">
        {content.packages.map((item) => (
          <article key={item.title}>
            <FaClipboardCheck className="security-package-icon" />
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
    <section className={`security-section security-process security-process--${preset.structure}`}>
      <div className="security-section-heading">
        <span className="security-kicker">Operational Method</span>
        <h2>A professional process from assessment to reporting.</h2>
      </div>
      <div className="security-process-list">
        {content.process.map((item, index) => {
          const ProcessIcon = getProcessIcon(preset, index);

          return (
            <article key={item}>
              <span className="security-process-icon"><ProcessIcon /></span>
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
    <section className={`security-section security-solutions security-solutions--${preset.structure}`}>
      <div className="security-section-heading">
        <span className="security-kicker">Solutions</span>
        <h2>Focused solutions for the most common security requests.</h2>
      </div>
      <div className="security-solution-list">
        {content.solutions.map((item, index) => (
          <article key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <FaCrosshairs className="security-solution-icon" />
            <strong>{item}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ images, content, preset }) {
  const galleryImages = [
    ...(Array.isArray(images.gallery) ? images.gallery : []),
    images.hero,
    images.about,
    images.page,
  ]
    .filter(Boolean)
    .filter((image, index, list) => list.indexOf(image) === index)
    .slice(0, 8);

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  const activeImage = galleryImages[activeIndex] || galleryImages[0];
  const zoomImage = zoomIndex === null ? null : galleryImages[zoomIndex] || galleryImages[0];
  const title = preset?.name || content?.businessName || "Security Gallery";

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

  if (!galleryImages.length) return null;

  return (
    <section id="security-gallery" className={`security-section security-gallery security-gallery--${preset?.structure || "guarding"}`}>
      <div className="security-section-heading security-section-heading--action">
        <div>
          <span className="security-kicker">Security Gallery</span>
          <h2>{title} visuals and operations presentation.</h2>
          <p>Browse site coverage, guarding operations, access control and security service visuals.</p>
        </div>
      </div>

      <div className="security-gallery-board">
        <button type="button" className="security-gallery-chevron security-gallery-chevron--left" onClick={() => move("prev")} aria-label="Previous gallery image">
          ‹
        </button>

        <button
          type="button"
          className="security-gallery-feature"
          onClick={() => setZoomIndex(activeIndex)}
          aria-label="Zoom selected security gallery image"
        >
          <img src={activeImage} alt={`${title} visual`} />
          <span>⌕ Zoom image</span>
        </button>

        <button type="button" className="security-gallery-chevron security-gallery-chevron--right" onClick={() => move("next")} aria-label="Next gallery image">
          ›
        </button>
      </div>

      <div className="security-gallery-thumbs" aria-label="Gallery thumbnails">
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
        <div className="security-lightbox" role="dialog" aria-modal="true" aria-label="Security image preview">
          <button type="button" className="security-lightbox-backdrop" onClick={() => setZoomIndex(null)} aria-label="Close image preview" />
          <div className="security-lightbox-stage">
            <button type="button" className="security-lightbox-close" onClick={() => setZoomIndex(null)} aria-label="Close image preview">×</button>
            <button type="button" className="security-lightbox-nav security-lightbox-nav--left" onClick={() => moveZoom("prev")} aria-label="Previous image">‹</button>
            <img src={zoomImage} alt="Security project zoom" />
            <button type="button" className="security-lightbox-nav security-lightbox-nav--right" onClick={() => moveZoom("next")} aria-label="Next image">›</button>
          </div>
        </div>
      )}
    </section>
  );
}

function TestimonialsSection({ content }) {
  return (
    <section className="security-testimonials">
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

  if (variant === "monitoring-plan") {
    return (
      <>
        {common}
        <input name="camera_count" placeholder="Approx. number of cameras" autoComplete="off" />
        <select name="monitoring_needed" defaultValue="">
          <option value="" disabled>Monitoring requirement</option>
          <option>Camera audit</option>
          <option>Remote monitoring</option>
          <option>Alarm verification</option>
          <option>Incident reporting</option>
        </select>
        <textarea name="message" placeholder="Describe the site and monitoring needs" rows="5" />
      </>
    );
  }

  if (variant === "confidential-consultation") {
    return (
      <>
        {common}
        <select name="consultation_type" defaultValue="">
          <option value="" disabled>Consultation type</option>
          <option>Executive protection</option>
          <option>Secure transport</option>
          <option>Private residence review</option>
          <option>Corporate risk advisory</option>
        </select>
        <input name="preferred_contact" placeholder="Preferred confidential contact method" autoComplete="off" />
        <textarea name="message" placeholder="Share a short, non-sensitive summary of what support is needed" rows="5" />
      </>
    );
  }

  if (variant === "event-plan") {
    return (
      <>
        {common}
        <input name="event_date" type="date" autoComplete="off" />
        <input name="venue" placeholder="Venue / location" autoComplete="street-address" />
        <input name="attendance" placeholder="Expected attendance" autoComplete="off" />
        <textarea name="message" placeholder="Entrances, VIP areas, parking, stage/backstage, crowd control or other needs" rows="5" />
      </>
    );
  }


  if (variant === "patrol-response") {
    return (
      <>
        {common}
        <input name="number_of_sites" placeholder="Number of sites / locations" autoComplete="off" />
        <input name="patrol_hours" placeholder="Patrol hours: night, weekend, 24/7..." autoComplete="off" />
        <textarea name="message" placeholder="Tell us about routes, checkpoints, lock-up support or alarm attendance required" rows="5" />
      </>
    );
  }

  if (variant === "alarm-response") {
    return (
      <>
        {common}
        <input name="alarm_type" placeholder="Alarm system / alert type" autoComplete="off" />
        <select name="response_priority" defaultValue="">
          <option value="" disabled>Response priority</option>
          <option>Home alarm response</option>
          <option>Business alarm response</option>
          <option>Keyholder support</option>
          <option>Emergency dispatch support</option>
        </select>
        <textarea name="message" placeholder="Describe the site, alarm setup and response expectations" rows="5" />
      </>
    );
  }

  if (variant === "industrial-plan") {
    return (
      <>
        {common}
        <input name="site_size" placeholder="Site size / number of gates" autoComplete="off" />
        <input name="operating_hours" placeholder="Operating hours / shifts" autoComplete="off" />
        <textarea name="message" placeholder="Tell us about stock, contractors, deliveries, patrols and high-risk areas" rows="5" />
      </>
    );
  }

  if (variant === "estate-security") {
    return (
      <>
        {common}
        <input name="units" placeholder="Number of units / homes" autoComplete="off" />
        <input name="gates" placeholder="Entrances / gates" autoComplete="off" />
        <textarea name="message" placeholder="Describe visitor flow, patrol needs, resident support and gatehouse requirements" rows="5" />
      </>
    );
  }

  if (variant === "systems-installation") {
    return (
      <>
        {common}
        <select name="system_type" defaultValue="">
          <option value="" disabled>System required</option>
          <option>CCTV installation</option>
          <option>Access control</option>
          <option>Alarm system</option>
          <option>Integrated security system</option>
          <option>Maintenance / repair</option>
        </select>
        <input name="existing_system" placeholder="Existing system or new installation?" autoComplete="off" />
        <textarea name="message" placeholder="Tell us about the site, cameras, doors, alarms or support needed" rows="5" />
      </>
    );
  }

  if (variant === "retail-service") {
    return (
      <>
        {common}
        <input name="venue_type" placeholder="Venue: shop, mall, hotel, restaurant..." autoComplete="off" />
        <input name="public_hours" placeholder="Operating / public hours" autoComplete="off" />
        <textarea name="message" placeholder="Tell us about guest flow, loss prevention, closing support or front-of-house presence" rows="5" />
      </>
    );
  }

  return (
    <>
      {common}
      <input name="site_type" placeholder="Site type: estate, school, warehouse, office..." autoComplete="off" />
      <input name="coverage" placeholder="Coverage: day, night, 24/7, event only..." autoComplete="off" />
      <textarea name="message" placeholder="Tell us about the posts, gates, risk areas and preferred start date" rows="5" />
    </>
  );
}

function ContactSection({ content, config }) {
  const email = content.contact.email || "info@securitycompany.co.za";
  const subject = encodeURIComponent(`${content.businessName} enquiry`);
  const mapQuery = encodeURIComponent(content.contact.mapQuery || content.contact.address || "South Africa");

  return (
    <section className={`security-contact security-contact--${config.formVariant}`}>
      <div className="security-contact-copy">
        <span className="security-kicker">Contact</span>
        <h2>{content.contactTitle}</h2>
        <p>{content.contactIntro}</p>
        <div className="security-contact-details">
          <a href={`tel:${content.contact.phone}`}><FaPhoneAlt /> {content.contact.phone}</a>
          <a href={`mailto:${email}`}><FaEnvelope /> {email}</a>
          <span><FaMapMarkerAlt /> {content.contact.address}</span>
          <span><FaClock /> {content.contact.hours}</span>
        </div>
      </div>
      <div className="security-contact-panel">
        <form className="security-contact-form" action={`mailto:${email}?subject=${subject}`} method="post" encType="text/plain">
          <ContactFormFields variant={config.formVariant} />
          <button type="submit">Send Security Enquiry</button>
        </form>
        <iframe
          className="security-map"
          title="Security company location map"
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
    <section className="security-cta-band">
      <div>
        <span className="security-kicker">Next Step</span>
        <h2>Ready to turn this into a real security company website?</h2>
        <p>{content.tagline}</p>
      </div>
      <button type="button" onClick={() => onPageChange("contact")}>Request Quote</button>
    </section>
  );
}

function SecurityFooter({ content, config, onPageChange, preset }) {
  const showSocials = content.socialDisplay?.footer !== false;
  const socials = showSocials
    ? mergeSocialLinks(
        SECURITY_SOCIAL_DEFAULTS[preset.contentKey] || SECURITY_SOCIAL_DEFAULTS.guarding,
        content.socialLinks,
        content.contact,
        content.socialDisplay,
      )
    : [];

  return (
    <footer className={`security-footer security-footer--${config.footerVariant}`}>
      <div className="security-footer-main">
        <div>
          <strong>{content.businessName}</strong>
          <p>{content.tagline}</p>
          {showSocials && socials.length > 0 && (
            <div className="security-footer-social">
              {socials.map(({ key, label, url, Icon, color }) => (
                <a
                  key={key}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="security-social-icon"
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
      <div className="security-footer-bottom">
        <div className="security-copyright small">
          © {new Date().getFullYear()} {content.businessName}. All rights reserved.
        </div>

        <div className="security-powered-by">
          <span>Powered by</span>
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="security-ulterspace-link"
          >
            <img src={ulterspaceLogo} alt="Ulterspace Logo" className="security-ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function HomePage({ content, images, config, preset, onPageChange }) {
  if (preset.structure === "surveillance") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <IndustriesSection content={content} />
        <GallerySection images={images} content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "executive") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <ServicesSection content={content} config={config} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <OperationsSection content={content} preset={preset} />
        <GallerySection images={images} content={content} preset={preset} />
        <CTASection content={content} onPageChange={onPageChange} />
      </>
    );
  }

  if (preset.structure === "event") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <ServicesSection content={content} config={config} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <IndustriesSection content={content} />
        <OperationsSection content={content} preset={preset} />
        <GallerySection images={images} content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }


  if (preset.structure === "patrol") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <OperationsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <IndustriesSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "alarm") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <ServicesSection content={content} config={config} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "industrial") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <IndustriesSection content={content} />
        <OperationsSection content={content} preset={preset} />
        <SolutionsSection content={content} preset={preset} />
        <GallerySection images={images} content={content} preset={preset} />
        <CTASection content={content} onPageChange={onPageChange} />
      </>
    );
  }

  if (preset.structure === "estate") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <AboutSection content={content} images={images} preset={preset} />
        <VisionMissionValues content={content} config={config} />
        <ServicesSection content={content} config={config} preset={preset} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "systems") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <SolutionsSection content={content} preset={preset} />
        <ServicesSection content={content} config={config} preset={preset} />
        <OperationsSection content={content} preset={preset} />
        <IndustriesSection content={content} />
        <GallerySection images={images} content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  if (preset.structure === "retail") {
    return (
      <>
        <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
        <ServicesSection content={content} config={config} preset={preset} />
        <AboutSection content={content} images={images} preset={preset} />
        <IndustriesSection content={content} />
        <PackagesSection content={content} preset={preset} onPageChange={onPageChange} />
        <GallerySection images={images} content={content} preset={preset} />
        <ContactSection content={content} config={config} />
      </>
    );
  }

  return (
    <>
      <SecurityHero content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      <AboutSection content={content} images={images} preset={preset} />
      <ServicesSection content={content} config={config} preset={preset} />
      <VisionMissionValues content={content} config={config} />
      <SolutionsSection content={content} preset={preset} />
      <IndustriesSection content={content} />
      <OperationsSection content={content} preset={preset} />
      <GallerySection images={images} content={content} preset={preset} />
      <ContactSection content={content} config={config} />
    </>
  );
}

function PageContent({ currentPage, content, images, config, preset, onPageChange }) {
  const title = NAV_ITEMS.find((item) => item.key === currentPage)?.label || "Security";

  if (currentPage === "home") {
    return <HomePage content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />;
  }

  if (currentPage === "gallery") {
    return <GallerySection images={images} content={content} preset={preset} />;
  }

  return (
    <>
      <SecurityPageHeader title={title} subtitle={content.tagline} images={images} preset={preset} />
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
          <TrustStrip content={content} preset={preset} />
          <VisionMissionValues content={content} config={config} />
        </>
      )}
      {currentPage === "contact" && <ContactSection content={content} config={config} />}
    </>
  );
}


function SecurityScrollTopButton({ preset }) {
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
      className={`security-scroll-top security-scroll-top--${preset.structure} ${visible ? "is-visible" : ""}`}
      onClick={scrollPageTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <TopIcon />
    </button>
  );
}

export default function SecurityRenderer({ settings = {}, preset = SECURITY_PRESETS["security-guarding-v1"], page }) {
  const content = useMemo(() => normalizeSecurityContent(settings, preset), [settings, preset]);
  const config = useMemo(() => getSavedSecurityConfig(settings, preset), [settings, preset]);
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
      scrollToSecurityGallery();
      return;
    }

    setInternalPage(nextPage);
    scrollPageTop();
  };

  return (
    <div className={`security-template security-shell--${preset.structure} security-template--${preset.template_key}`} style={makeThemeStyle(config)}>
      <SecurityTopbar content={content} preset={preset} />
      <SecurityNavbar content={content} config={config} currentPage={currentPage} onPageChange={onPageChange} preset={preset} />
      <main>
        <PageContent currentPage={currentPage} content={content} images={images} config={config} preset={preset} onPageChange={onPageChange} />
      </main>
      <SecurityFooter content={content} config={config} onPageChange={onPageChange} preset={preset} />
      <SecurityScrollTopButton preset={preset} />
    </div>
  );
}
