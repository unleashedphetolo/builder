import { useEffect, useMemo, useState } from "react";
import {
  FaBehance,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaExpand,
  FaCloud,
  FaDiscord,
  FaDribbble,
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaMediumM,
  FaPhoneAlt,
  FaPinterestP,
  FaShoppingCart,
  FaTimes,
  FaRedditAlien,
  FaSnapchatGhost,
  FaSpotify,
  FaTelegramPlane,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";
import ulterspaceLogo from "../../../assets/logo.gif";
import {
  TECHNOLOGY_DEFAULT_TEMPLATE,
  TECHNOLOGY_MEDIA_PACKS,
  TECHNOLOGY_PRESETS,
  TECHNOLOGY_THEMES,
} from "./technologyPresets";
import { normalizeTechnologyContent } from "./technologyFallbacks";
import "./technology-shared.css";

const DEFAULT_PAGES = [
  { key: "home", label: "Home" },
  { key: "services", label: "Services" },
  { key: "shop", label: "Shop" },
  { key: "gallery", label: "Gallery" },
  { key: "pricing", label: "Pricing" },
  { key: "contact", label: "Contact" },
];

const SERVICE_PAGES = [
  { key: "home", label: "Home" },
  { key: "services", label: "Services" },
  { key: "solutions", label: "Solutions" },
  { key: "gallery", label: "Gallery" },
  { key: "pricing", label: "Pricing" },
  { key: "contact", label: "Contact" },
];

const SOCIAL_ICON_MAP = {
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

const SOCIAL_STYLE_DEFAULTS = {
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
  website: { label: "Website", enabled: false, url: "", colorMode: "original", originalColor: "#38bdf8", monoColor: "#ffffff", color: "#38bdf8" },
  email: { label: "Email", enabled: false, url: "", colorMode: "mono", originalColor: "#cbd5e1", monoColor: "#ffffff", color: "#cbd5e1" },
  phone: { label: "Phone", enabled: false, url: "", colorMode: "mono", originalColor: "#cbd5e1", monoColor: "#ffffff", color: "#cbd5e1" },
};

const SOCIAL_PRESET_FALLBACKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  x: "https://x.com",
  youtube: "https://youtube.com",
  tiktok: "https://tiktok.com",
  linkedin: "https://linkedin.com",
  whatsapp: "https://wa.me/27110000000",
  threads: "https://threads.net",
  telegram: "https://t.me/yourcompany",
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
  email: "mailto:hello@technology.co.za",
  phone: "tel:+27110000000",
};

const SOCIAL_ORDER = [
  "facebook", "instagram", "x", "youtube", "tiktok", "linkedin",
  "whatsapp", "threads", "telegram", "snapchat", "pinterest", "discord",
  "github", "behance", "dribbble", "medium", "reddit", "twitch",
  "spotify", "website", "email", "phone",
];

const getPageKey = (page) => {
  if (!page) return "home";
  if (typeof page === "string") return page;
  return page.template_page_key || page.slug || page.key || "home";
};

const toList = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && item !== "");
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (value && typeof value === "object") {
    const nested = value.items || value.list || value.values || value.entries || value.features;
    if (nested !== undefined) return toList(nested, fallback);
    return Object.values(value).filter((item) => item !== undefined && item !== null && item !== "");
  }
  return Array.isArray(fallback) ? fallback : [];
};

const toProofList = (value) =>
  toList(value)
    .map((item) => {
      if (Array.isArray(item)) return [item[0] || "", item[1] || ""];
      if (item && typeof item === "object") {
        return [item.value || item.number || item.stat || item.title || "", item.label || item.text || item.description || ""];
      }
      const parts = String(item || "").split(":");
      return [parts[0]?.trim() || "", parts.slice(1).join(":").trim() || "Metric"];
    })
    .filter(([valueText, labelText]) => valueText || labelText);

const toTierList = (value) =>
  toList(value).map((tier, index) => {
    if (tier && typeof tier === "object" && !Array.isArray(tier)) {
      return {
        name: tier.name || tier.title || `Package ${index + 1}`,
        price: tier.price || tier.amount || "Custom",
        period: tier.period || tier.billing || "per project",
        desc: tier.desc || tier.description || tier.text || "Business-ready package.",
        features: toList(tier.features || tier.items || tier.includes),
      };
    }

    return {
      name: String(tier || `Package ${index + 1}`),
      price: "Custom",
      period: "per project",
      desc: "Business-ready package.",
      features: [],
    };
  });

const toCatalogList = (value) =>
  toList(value).map((item, index) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return {
        id: item.id || item.slug || `${item.name || item.title || "item"}-${index}`,
        name: item.name || item.title || `Item ${index + 1}`,
        price: item.price || item.amount || "Quote",
        category: item.category || item.type || "Service",
        description: item.description || item.desc || item.text || "Add this item to the quote basket.",
        badge: item.badge || item.label || "Quote",
        image: item.image || item.image_url || item.url || "",
      };
    }

    return {
      id: `${String(item || "item")}-${index}`,
      name: String(item || `Item ${index + 1}`),
      price: "Quote",
      category: "Service",
      description: "Add this item to the quote basket.",
      badge: "Quote",
      image: "",
    };
  });

const toGalleryList = (contentGallery, mediaGallery = []) => {
  const gallery = toList(contentGallery).length ? toList(contentGallery) : toList(mediaGallery);

  return gallery.map((item, index) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return {
        url: item.url || item.image || item.src || "",
        title: item.title || item.label || `Gallery ${index + 1}`,
        description: item.description || item.text || "Technology work preview",
      };
    }

    return {
      url: String(item || ""),
      title: `Gallery ${index + 1}`,
      description: "Technology work preview",
    };
  }).filter((item) => item.url);
};

const normalizePageKey = (page, pages) => {
  const pageKey = getPageKey(page);
  return pages.some((item) => item.key === pageKey) ? pageKey : "home";
};

const getPages = (content) => {
  const hasCatalog = toCatalogList(content.catalog).length > 0;
  return hasCatalog ? DEFAULT_PAGES : SERVICE_PAGES;
};

const getTemplateConfig = (settings, preset) => {
  const saved =
    settings.technology_config ||
    settings.template_config?.technology ||
    settings.templateConfig?.technology ||
    {};

  return {
    theme: saved.theme || preset.theme,
    accent: saved.accent || "",
    mediaPack: saved.mediaPack || preset.mediaPack,
    navVariant: saved.navVariant || preset.navVariant,
    heroVariant: saved.heroVariant || preset.heroVariant,
    cardsVariant: saved.cardsVariant || preset.cardsVariant,
    contactVariant: saved.contactVariant || preset.contactVariant,
    footerVariant: saved.footerVariant || preset.footerVariant,
  };
};

const getThemeStyle = (config) => {
  const theme = TECHNOLOGY_THEMES[config.theme] || TECHNOLOGY_THEMES.internetCafe;
  const accent = config.accent || theme.accent;

  return {
    "--technology-primary": theme.primary,
    "--technology-secondary": theme.secondary,
    "--technology-accent": accent,
    "--technology-accent-2": theme.accent2,
    "--technology-surface": theme.surface,
    "--technology-text": theme.text,
    "--technology-muted": theme.muted,
  };
};

const getMediaPack = (config) => TECHNOLOGY_MEDIA_PACKS[config.mediaPack] || TECHNOLOGY_MEDIA_PACKS.internetCafe;

const getSocialIconColor = (data = {}) => {
  const mode = data.colorMode || "original";
  if (mode === "mono") return data.monoColor || "#ffffff";
  return data.originalColor || data.color || "#ffffff";
};

const resolveSavedSocialData = (savedLinks, key) => {
  if (!savedLinks || typeof savedLinks !== "object") return {};
  const savedValue = savedLinks[key];
  if (savedValue === undefined || savedValue === null) return {};
  if (typeof savedValue === "string") return { enabled: true, url: savedValue };
  if (typeof savedValue === "object" && !Array.isArray(savedValue)) return savedValue;
  return {};
};

const hasSavedSocialData = (savedLinks, key) =>
  Boolean(savedLinks && typeof savedLinks === "object" && Object.prototype.hasOwnProperty.call(savedLinks, key));

const getContactSocialUrl = (key, contact = {}) => {
  if (key === "email") return contact.email ? `mailto:${contact.email}` : "";
  if (key === "phone") return contact.phone ? `tel:${contact.phone}` : "";
  if (key === "whatsapp") {
    const phone = String(contact.phone || "").replace(/[^0-9]/g, "");
    return phone ? `https://wa.me/${phone}` : "";
  }
  return "";
};

const normalizePresetSocialItem = (item) => {
  if (typeof item === "string") {
    const baseItem = SOCIAL_STYLE_DEFAULTS[item] || {};
    return { key: item, label: baseItem.label || item, url: SOCIAL_PRESET_FALLBACKS[item] || "" };
  }
  if (item && typeof item === "object" && !Array.isArray(item)) return item;
  return {};
};

const getSocialKeys = (presetItems, savedLinks, socialDisplay) => {
  const displayOrder = Array.isArray(socialDisplay?.order) ? socialDisplay.order : [];
  const presetKeys = presetItems.map((item) => item.key).filter(Boolean);
  const savedKeys = savedLinks && typeof savedLinks === "object" ? Object.keys(savedLinks) : [];
  return Array.from(new Set([...displayOrder, ...presetKeys, ...savedKeys, ...SOCIAL_ORDER]))
    .filter((key) => SOCIAL_ICON_MAP[key]);
};

const mergeSocialLinks = (defaultItems = [], savedLinks = {}, contact = {}, socialDisplay = {}) => {
  const presetItems = Array.isArray(defaultItems)
    ? defaultItems.map(normalizePresetSocialItem).filter((item) => item.key)
    : [];
  const keys = getSocialKeys(presetItems, savedLinks, socialDisplay);

  return keys
    .map((key) => {
      const presetItem = presetItems.find((item) => item.key === key) || {};
      const savedItem = resolveSavedSocialData(savedLinks, key);
      const baseItem = SOCIAL_STYLE_DEFAULTS[key] || {};
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
      data.url = savedItem.url || presetItem.url || contactUrl || SOCIAL_PRESET_FALLBACKS[key] || "";

      if (data.enabled === false || !data.url) return null;

      return { ...data, Icon: SOCIAL_ICON_MAP[key], color: getSocialIconColor(data) };
    })
    .filter(Boolean);
};

function SocialLinks({ content, preset }) {
  const socials = mergeSocialLinks(
    preset.socials,
    content.socialLinks || content.socials,
    content.contact,
    content.socialDisplay,
  );

  if (!socials.length) return null;

  return (
    <div className="technology-socials" aria-label="Social media links">
      {socials.map(({ key, label, url, Icon, color }) => {
        const directLink =
          key === "email" || key === "phone" || url.startsWith("mailto:") || url.startsWith("tel:");

        return (
          <a
            key={key}
            href={url || "#"}
            target={directLink ? undefined : "_blank"}
            rel={directLink ? undefined : "noreferrer"}
            aria-label={label}
            title={label}
            style={{ "--technology-social-color": color }}
            onClick={(event) => !url && event.preventDefault()}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}

function TechnologyTopbar({ content, config, preset }) {
  const showSocials = content.socialDisplay?.topbar !== false;

  return (
    <div className={`technology-topbar technology-topbar--${config.navVariant}`}>
      <div className="technology-topbar-info">
        <span className="technology-topbar-status">● {content.statusLine}</span>
        <a href={`mailto:${content.contact.email}`}>
          <FaEnvelope />
          <span>{content.contact.email}</span>
        </a>
        <a href={`tel:${content.contact.phone}`}>
          <FaPhoneAlt />
          <span>{content.contact.phone}</span>
        </a>
      </div>

      {showSocials && <SocialLinks content={content} preset={preset} />}
    </div>
  );
}

function TechnologyNavbar({
  content,
  config,
  currentPage,
  pages,
  onPageChange,
  hasCatalog,
  cartCount = 0,
}) {
  const [open, setOpen] = useState(false);

  const navigate = (page) => {
    onPageChange(page);
    setOpen(false);
  };

  return (
    <header className={`technology-navbar technology-navbar--${config.navVariant}`}>
      <button type="button" className="technology-brand" onClick={() => navigate("home")}>
        <span className="technology-brand-mark"><FaCloud /></span>
        <span>
          <strong>{content.name}</strong>
          <small>{content.role}</small>
        </span>
      </button>

      <nav className={`technology-nav-links ${open ? "is-open" : ""}`} aria-label="Technology navigation">
        {pages.map((item) => (
          <button
            key={item.key}
            type="button"
            className={currentPage === item.key ? "active" : ""}
            onClick={() => navigate(item.key)}
          >
            {item.label}
          </button>
        ))}
        <button type="button" className="technology-nav-cta" onClick={() => navigate("contact")}>
          {content.navCta || "Contact"}
        </button>
      </nav>

      <div className="technology-navbar-actions">
        {hasCatalog && (
          <button
            type="button"
            className="technology-cart-nav-button"
            onClick={() => navigate("shop")}
            aria-label={`Open quote cart with ${cartCount} selected item${cartCount === 1 ? "" : "s"}`}
            title="Quote cart"
          >
            <FaShoppingCart />
            <span>Cart</span>
            <em>{cartCount}</em>
          </button>
        )}

        <button
          className={`technology-menu-toggle ${open ? "is-open" : ""}`}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function HeroMedia({ media }) {
  const [index, setIndex] = useState(0);
  const slides = Array.isArray(media.hero) && media.hero.length ? media.hero : [];
  const active = slides[index] || slides[0];

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % slides.length), 5200);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!active) return null;

  return (
    <div className="technology-hero-media">
      {active.type === "video" ? (
        <video key={active.url} src={active.url} poster={active.poster} muted playsInline autoPlay loop />
      ) : (
        <img src={active.url} alt="Technology business preview" />
      )}
      <div className="technology-hero-dots">
        {slides.map((slide, slideIndex) => (
          <button
            key={`${slide.url}-${slideIndex}`}
            type="button"
            className={slideIndex === index ? "active" : ""}
            onClick={() => setIndex(slideIndex)}
            aria-label={`Show slide ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function TechnologyHero({ content, config, media, onPageChange, preset }) {
  const hasCatalog = toCatalogList(content.catalog).length > 0;
  const templateKey = preset?.template_key || "technology";

  return (
    <section className={`technology-hero technology-hero--${config.heroVariant} technology-hero--${templateKey}`}>
      <div className="technology-hero-copy">
        <span className="technology-kicker">{content.role}</span>
        <h1>{content.headline}</h1>
        <p>{content.subtitle}</p>
        <div className="technology-hero-actions">
          <button type="button" onClick={() => onPageChange("services")}>{content.primaryAction || "View Services"}</button>
          <button type="button" className="ghost" onClick={() => onPageChange(hasCatalog ? "shop" : "contact")}>{content.secondaryAction || "Contact Us"}</button>
        </div>
        <div className="technology-hero-trust">
          <span>Suitable for</span>
          {toList(content.customers).slice(0, 4).map((customer) => (
            <strong key={customer}>{customer}</strong>
          ))}
        </div>
      </div>

      <HeroMedia media={media} />

      <div className="technology-hero-proof">
        {toProofList(content.proof).map(([value, label]) => (
          <article key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PageHeader({ currentPage, content, media, pages }) {
  const title = pages.find((page) => page.key === currentPage)?.label || content.name;
  return (
    <section
      className="technology-page-header"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.9), rgba(15,23,42,.55)), url("${media.page}")`,
      }}
    >
      <span className="technology-kicker">{content.role}</span>
      <h1>{title}</h1>
      <p>{content.subtitle}</p>
    </section>
  );
}

function OverviewSection({ content, media }) {
  return (
    <section className="technology-section technology-overview">
      <div>
        <span className="technology-kicker">Overview</span>
        <h2>{content.bioTitle}</h2>
        <p>{content.bio}</p>
        <a className="technology-link" href={content.docsUrl || "#"} target="_blank" rel="noreferrer">
          View more details →
        </a>
      </div>
      <div className="technology-product-card">
        <img src={media.product} alt="Technology business section" />
      </div>
    </section>
  );
}

function ServicesSection({ content, config }) {
  return (
    <section className="technology-section">
      <div className="technology-section-heading">
        <span className="technology-kicker">Services</span>
        <h2>Clear services customers can understand immediately.</h2>
      </div>
      <div className={`technology-card-grid technology-card-grid--${config.cardsVariant}`}>
        {toList(content.products).map((product, index) => (
          <article key={product} className="technology-feature-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{product}</h3>
            <p>{content.serviceCardText || "Editable technology service with clear customer value."}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection({ content }) {
  return (
    <section className="technology-section technology-features-section">
      <div className="technology-section-heading">
        <span className="technology-kicker">Features</span>
        <h2>Built to feel real, useful and easy to edit.</h2>
      </div>
      <div className="technology-feature-list">
        {toList(content.features).map((feature) => (
          <article key={feature}>
            <strong>✓</strong>
            <span>{feature}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function SolutionsSection({ content }) {
  return (
    <section className="technology-section">
      <div className="technology-section-heading">
        <span className="technology-kicker">Solutions</span>
        <h2>Use cases customers can quickly match to their needs.</h2>
      </div>
      <div className="technology-solutions-grid">
        {toList(content.solutions).map((solution, index) => (
          <article key={solution} className="technology-solution-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{solution}</h3>
            <p>Ready section for service details, customer outcomes and enquiry calls-to-action.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function IndustriesSection({ content }) {
  return (
    <section className="technology-industries">
      <div className="technology-section-heading">
        <span className="technology-kicker">Audience</span>
        <h2>Designed for the customers this business actually serves.</h2>
      </div>
      <div className="technology-industry-tags">
        {toList(content.industries).map((industry) => (
          <span key={industry}>{industry}</span>
        ))}
      </div>
    </section>
  );
}

function IntegrationsSection({ content }) {
  return (
    <section className="technology-section technology-integrations">
      <div className="technology-section-heading">
        <span className="technology-kicker">Tools & Support</span>
        <h2>Common tools, payments and support channels.</h2>
      </div>
      <div className="technology-integration-grid">
        {toList(content.integrations).map((integration) => (
          <article key={integration}>{integration}</article>
        ))}
      </div>
    </section>
  );
}

function ProcessSection({ content }) {
  return (
    <section className="technology-process">
      {toList(content.process).map((step, index) => (
        <article key={step}>
          <strong>{String(index + 1).padStart(2, "0")}</strong>
          <p>{step}</p>
        </article>
      ))}
    </section>
  );
}

function PricingSection({ content, onPageChange }) {
  return (
    <section className="technology-section technology-pricing">
      <div className="technology-section-heading">
        <span className="technology-kicker">Packages</span>
        <h2>Simple pricing blocks that can be edited per business.</h2>
      </div>
      <div className="technology-pricing-grid">
        {toTierList(content.tiers).map((tier, index) => (
          <article
            key={tier.name}
            className={`technology-pricing-card ${index === 1 ? "is-featured" : ""}`}
          >
            <header>
              <h3>{tier.name}</h3>
              <div>
                <strong>{tier.price}</strong>
                <span>{tier.period}</span>
              </div>
              <p>{tier.desc}</p>
            </header>
            <ul>
              {toList(tier.features).map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>
            <button type="button" onClick={() => onPageChange("contact")}>
              {index === 2 ? "Request Custom Quote" : "Enquire About " + tier.name}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ content, media }) {
  const gallery = toGalleryList(content.gallery, media.gallery).slice(0, 8);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);

  useEffect(() => {
    if (activeIndex > gallery.length - 1) setActiveIndex(0);
  }, [activeIndex, gallery.length]);

  useEffect(() => {
    if (zoomIndex === null) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setZoomIndex(null);
      if (event.key === "ArrowLeft") {
        setZoomIndex((current) => {
          const safeCurrent = typeof current === "number" ? current : activeIndex;
          return safeCurrent === 0 ? gallery.length - 1 : safeCurrent - 1;
        });
      }
      if (event.key === "ArrowRight") {
        setZoomIndex((current) => {
          const safeCurrent = typeof current === "number" ? current : activeIndex;
          return safeCurrent === gallery.length - 1 ? 0 : safeCurrent + 1;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, gallery.length, zoomIndex]);

  if (!gallery.length) return null;

  const activeItem = gallery[activeIndex] || gallery[0];
  const zoomItem = zoomIndex !== null ? gallery[zoomIndex] : null;

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? gallery.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === gallery.length - 1 ? 0 : current + 1));
  };

  const showPreviousZoom = () => {
    setZoomIndex((current) => {
      const safeCurrent = typeof current === "number" ? current : activeIndex;
      return safeCurrent === 0 ? gallery.length - 1 : safeCurrent - 1;
    });
  };

  const showNextZoom = () => {
    setZoomIndex((current) => {
      const safeCurrent = typeof current === "number" ? current : activeIndex;
      return safeCurrent === gallery.length - 1 ? 0 : safeCurrent + 1;
    });
  };

  const openZoom = (index = activeIndex) => {
    setActiveIndex(index);
    setZoomIndex(index);
  };

  return (
    <section className="technology-section technology-gallery-section">
      <div className="technology-section-heading technology-gallery-heading-row">
        <div>
          <span className="technology-kicker">Gallery</span>
          <h2>{content.galleryTitle || "Gallery"}</h2>
          <p>{content.galleryIntro}</p>
        </div>
        <div className="technology-gallery-counter" aria-label="Gallery image count">
          <strong>{String(activeIndex + 1).padStart(2, "0")}</strong>
          <span>/ {String(gallery.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="technology-gallery-grid technology-gallery-enterprise">
        <article className="technology-gallery-stage">
          <button
            type="button"
            className="technology-gallery-chevron technology-gallery-chevron--left"
            onClick={showPrevious}
            aria-label="Previous gallery image"
          >
            <FaChevronLeft />
          </button>

          <button
            type="button"
            className="technology-gallery-zoom-trigger"
            onClick={() => openZoom(activeIndex)}
            aria-label="Zoom gallery image"
          >
            <img src={activeItem.url} alt={activeItem.title} loading="lazy" />
            <span>
              <FaExpand />
              Zoom
            </span>
          </button>

          <button
            type="button"
            className="technology-gallery-chevron technology-gallery-chevron--right"
            onClick={showNext}
            aria-label="Next gallery image"
          >
            <FaChevronRight />
          </button>

          <div className="technology-gallery-caption">
            <strong>{activeItem.title}</strong>
            <span>{activeItem.description}</span>
          </div>
        </article>

        <div className="technology-gallery-thumbs" aria-label="Gallery thumbnails">
          {gallery.map((item, index) => (
            <button
              key={`${item.url}-${index}`}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => setActiveIndex(index)}
              aria-label={`View ${item.title}`}
            >
              <img src={item.url} alt="" loading="lazy" />
              <span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      {zoomItem && (
        <div className="technology-gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image preview">
          <button
            type="button"
            className="technology-gallery-lightbox-backdrop"
            onClick={() => setZoomIndex(null)}
            aria-label="Close gallery preview"
          />
          <div className="technology-gallery-lightbox-panel">
            <button
              type="button"
              className="technology-gallery-lightbox-close"
              onClick={() => setZoomIndex(null)}
              aria-label="Close gallery preview"
            >
              <FaTimes />
            </button>

            <button
              type="button"
              className="technology-gallery-lightbox-nav technology-gallery-lightbox-nav--left"
              onClick={showPreviousZoom}
              aria-label="Previous zoom image"
            >
              <FaChevronLeft />
            </button>

            <img src={zoomItem.url} alt={zoomItem.title} />

            <button
              type="button"
              className="technology-gallery-lightbox-nav technology-gallery-lightbox-nav--right"
              onClick={showNextZoom}
              aria-label="Next zoom image"
            >
              <FaChevronRight />
            </button>

            <div className="technology-gallery-lightbox-caption">
              <strong>{zoomItem.title}</strong>
              <span>{zoomItem.description}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function QuoteCartSection({ content, media, cartItems = [], onAddItem, onRemoveItem }) {
  const catalog = toCatalogList(content.catalog);
  const items = Array.isArray(cartItems) ? cartItems : [];

  if (!catalog.length) return null;

  const addItem = (item) => {
    if (typeof onAddItem === "function") onAddItem(item);
  };
  const removeItem = (indexToRemove) => {
    if (typeof onRemoveItem === "function") onRemoveItem(indexToRemove);
  };

  const email = content.contact.email || "hello@technology.co.za";
  const quoteLines = items.map((item, index) => `${index + 1}. ${item.name} — ${item.price} (${item.category})`);
  const subject = encodeURIComponent(`${content.name} quote request`);
  const body = encodeURIComponent(
    `Hello ${content.name},\n\nPlease send me a quote for:\n\n${quoteLines.join("\n") || "No items selected yet."}\n\nMy name:\nPhone number:\nPreferred collection/delivery/booking date:\nAdditional notes:\n\nRegards,`,
  );

  return (
    <section className="technology-section technology-catalog-section">
      <div className="technology-section-heading">
        <span className="technology-kicker">Quote Cart</span>
        <h2>Choose products or services and send them to email.</h2>
        <p>Add items to the basket, then send the selected list directly to the business email.</p>
      </div>

      <div className="technology-catalog-layout">
        <div className="technology-shop-grid">
          {catalog.map((item, index) => (
            <article key={`${item.name}-${index}`} className="technology-shop-card">
              <div className="technology-shop-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} loading="lazy" />
                ) : (
                  <img src={media.product} alt={item.name} loading="lazy" />
                )}
                <span>{item.category}</span>
              </div>
              <div className="technology-shop-card-body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <strong>{item.price}</strong>
                <button type="button" onClick={() => addItem(item)}>Add to quote</button>
              </div>
            </article>
          ))}
        </div>

        <aside className="technology-cart-panel">
          <span className="technology-kicker">Basket</span>
          <h3>Selected items</h3>
          {items.length ? (
            <ul>
              {items.map((item, index) => (
                <li key={`${item.name}-${index}`}>
                  <span>{item.name}</span>
                  <small>{item.price}</small>
                  <button type="button" onClick={() => removeItem(index)} aria-label={`Remove ${item.name}`}>×</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items selected yet.</p>
          )}
          <a
            className={`technology-cart-email ${items.length ? "" : "is-disabled"}`}
            href={items.length ? `mailto:${email}?subject=${subject}&body=${body}` : "#"}
            onClick={(event) => {
              if (!items.length) event.preventDefault();
            }}
          >
            Send selected items to email
          </a>
          <small>Destination: {email}</small>
        </aside>
      </div>
    </section>
  );
}

function CustomersSection({ content }) {
  return (
    <section className="technology-section technology-customers">
      <div className="technology-section-heading">
        <span className="technology-kicker">Trust</span>
        <h2>Customer groups and real outcomes.</h2>
      </div>
      <div className="technology-customer-logos">
        {toList(content.customers).map((customer) => (
          <span key={customer}>{customer}</span>
        ))}
      </div>
      <div className="technology-case-list">
        {toList(content.cases).map((caseLine, index) => (
          <article key={caseLine}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <p>{caseLine}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ content, config }) {
  const email = content.contact.email || "hello@technology.co.za";
  const subject = encodeURIComponent(content.formType || "Technology enquiry");
  const body = encodeURIComponent(
    `Hello ${content.name},\n\nI would like to enquire about your services.\n\nMy name:\nPhone number:\nService needed:\nPreferred date/time:\nNotes:\n\nRegards,`,
  );
  const mapQuery = encodeURIComponent(content.contact.address || "Johannesburg, South Africa");

  return (
    <section className={`technology-contact technology-contact--${config.contactVariant}`}>
      <div className="technology-contact-info">
        <span className="technology-kicker">Contact</span>
        <h2>{content.formType}</h2>
        <p><FaPhoneAlt /> <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a></p>
        <p><FaEnvelope /> <a href={`mailto:${email}`}>{email}</a></p>
        <p><FaMapMarkerAlt /> {content.contact.address}</p>
        <iframe
          title="Business location map"
          src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <form
        className="technology-contact-form"
        action={`mailto:${email}?subject=${subject}&body=${body}`}
        method="post"
        encType="text/plain"
      >
        <input name="name" placeholder="Full name" autoComplete="name" />
        <input name="email" placeholder="Email address" type="email" autoComplete="email" />
        <input name="phone" placeholder="Phone number" type="tel" autoComplete="tel" />
        <input name="company" placeholder="Company / school / household" autoComplete="organization" />
        <select name="interest" defaultValue="">
          <option value="" disabled>Primary interest</option>
          {toList(content.products).slice(0, 8).map((product) => (
            <option key={product}>{product}</option>
          ))}
        </select>
        <textarea
          name="message"
          placeholder="Tell us what you need, your timeline, location and any important details."
          rows="5"
          autoComplete="off"
        />
        <button type="submit">Send Enquiry</button>
      </form>
    </section>
  );
}

function TechnologyFooter({ content, preset, config, pages, onPageChange }) {
  const showSocials = content.socialDisplay?.footer !== false;

  return (
    <footer className={`technology-footer technology-footer--${config.footerVariant}`}>
      <div className="technology-footer-main">
        <div>
          <strong>{content.name}</strong>
          <p>{content.subtitle}</p>
          {showSocials && <SocialLinks content={content} preset={preset} />}
        </div>
        <div>
          <h4>Website</h4>
          {pages.map((page) => (
            <button key={page.key} type="button" onClick={() => onPageChange(page.key)}>
              {page.label}
            </button>
          ))}
        </div>
        <div>
          <h4>Services</h4>
          {toList(content.products).slice(0, 6).map((product) => (
            <span key={product}>{product}</span>
          ))}
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a>
          <span>{content.contact.address}</span>
        </div>
      </div>
      <div className="technology-footer-bottom">
        <div className="technology-copyright small">
          © {new Date().getFullYear()} {content.name}. All rights reserved.
        </div>

        <div className="technology-powered-by">
          <span>Powered by</span>
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="technology-ulterspace-link"
          >
            <img src={ulterspaceLogo} alt="Ulterspace Logo" className="technology-ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function HomePageContent({
  preset,
  content,
  config,
  media,
  hasCatalog,
  cartItems,
  onAddItem,
  onRemoveItem,
  onPageChange,
}) {
  const quoteCart = hasCatalog ? (
    <QuoteCartSection
      content={content}
      media={media}
      cartItems={cartItems}
      onAddItem={onAddItem}
      onRemoveItem={onRemoveItem}
    />
  ) : null;

  const sections = {
    overview: <OverviewSection content={content} media={media} />,
    services: <ServicesSection content={content} config={config} />,
    features: <FeaturesSection content={content} />,
    solutions: <SolutionsSection content={content} />,
    industries: <IndustriesSection content={content} />,
    process: <ProcessSection content={content} />,
    pricing: <PricingSection content={content} onPageChange={onPageChange} />,
    gallery: <GallerySection content={content} media={media} />,
    customers: <CustomersSection content={content} />,
    contact: <ContactSection content={content} config={config} />,
    cart: quoteCart,
  };

  const layouts = {
    "tech-internet-cafe-v1": ["services", "cart", "gallery", "process", "pricing", "contact"],
    "tech-software-studio-v1": ["overview", "solutions", "features", "process", "pricing", "gallery", "customers", "contact"],
    "tech-computer-repair-v1": ["services", "process", "cart", "gallery", "features", "pricing", "contact"],
    "tech-hardware-store-v1": ["cart", "services", "gallery", "features", "pricing", "contact"],
    "tech-appliances-v1": ["cart", "overview", "gallery", "services", "process", "pricing", "contact"],
    "tech-network-cctv-v1": ["solutions", "services", "gallery", "process", "pricing", "features", "contact"],
    "tech-mobile-device-v1": ["cart", "services", "process", "gallery", "pricing", "contact"],
    "tech-cloud-systems-v1": ["overview", "features", "solutions", "industries", "pricing", "gallery", "contact"],
    "tech-cyber-data-v1": ["features", "solutions", "process", "pricing", "gallery", "contact"],
    "tech-ai-automation-v1": ["solutions", "features", "process", "pricing", "gallery", "customers", "contact"],
  };

  const order = layouts[preset.template_key] || [
    "overview",
    "services",
    "cart",
    "gallery",
    "features",
    "solutions",
    "industries",
    "process",
    "pricing",
    "customers",
    "contact",
  ];

  return (
    <>
      <TechnologyHero content={content} config={config} media={media} onPageChange={onPageChange} preset={preset} />
      {order.map((key) => {
        const section = sections[key];
        return section ? <div key={key} className={`technology-home-block technology-home-block--${key}`}>{section}</div> : null;
      })}
    </>
  );
}

function ScrollTopButton({ preset }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 460);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`technology-scroll-top technology-scroll-top--${preset.template_key} ${show ? "is-visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
    >
      <FaChevronUp />
    </button>
  );
}

export default function TechnologyRenderer({
  settings = {},
  preset = TECHNOLOGY_PRESETS[TECHNOLOGY_DEFAULT_TEMPLATE],
  page,
}) {
  const content = useMemo(() => normalizeTechnologyContent(settings, preset), [settings, preset]);
  const config = useMemo(() => getTemplateConfig(settings, preset), [settings, preset]);
  const media = useMemo(() => getMediaPack(config), [config]);
  const pages = useMemo(() => getPages(content), [content]);
  const initialPage = normalizePageKey(page, pages);
  const [internalPage, setInternalPage] = useState(initialPage || "home");
  const currentPage = normalizePageKey(internalPage, pages);

  useEffect(() => {
    if (page) setInternalPage(initialPage || "home");
  }, [page, initialPage]);

  const onPageChange = (nextPage) => {
    setInternalPage(normalizePageKey(nextPage, pages));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasCatalog = toCatalogList(content.catalog).length > 0;
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems([]);
  }, [preset.template_key]);

  const addCartItem = (item) => setCartItems((current) => [...current, item]);
  const removeCartItem = (indexToRemove) =>
    setCartItems((current) => current.filter((_, index) => index !== indexToRemove));

  return (
    <div
      className={`technology-enterprise technology-enterprise--${preset.template_key}`}
      style={getThemeStyle(config)}
    >
      <TechnologyTopbar content={content} config={config} preset={preset} />
      <TechnologyNavbar
        content={content}
        config={config}
        currentPage={currentPage}
        pages={pages}
        onPageChange={onPageChange}
        hasCatalog={hasCatalog}
        cartCount={cartItems.length}
      />

      {currentPage === "home" ? (
        <HomePageContent
          preset={preset}
          content={content}
          config={config}
          media={media}
          hasCatalog={hasCatalog}
          cartItems={cartItems}
          onAddItem={addCartItem}
          onRemoveItem={removeCartItem}
          onPageChange={onPageChange}
        />
      ) : (
        <>
          <PageHeader currentPage={currentPage} content={content} media={media} pages={pages} />
          {currentPage === "services" && (
            <>
              <ServicesSection content={content} config={config} />
              <FeaturesSection content={content} />
              <IntegrationsSection content={content} />
            </>
          )}
          {currentPage === "shop" && (
            <QuoteCartSection
              content={content}
              media={media}
              cartItems={cartItems}
              onAddItem={addCartItem}
              onRemoveItem={removeCartItem}
            />
          )}
          {currentPage === "gallery" && <GallerySection content={content} media={media} />}
          {currentPage === "solutions" && (
            <>
              <SolutionsSection content={content} />
              <IndustriesSection content={content} />
              <ProcessSection content={content} />
            </>
          )}
          {currentPage === "pricing" && <PricingSection content={content} onPageChange={onPageChange} />}
          {currentPage === "contact" && <ContactSection content={content} config={config} />}
        </>
      )}

      <TechnologyFooter content={content} preset={preset} config={config} pages={pages} onPageChange={onPageChange} />
      <ScrollTopButton preset={preset} />
    </div>
  );
}
