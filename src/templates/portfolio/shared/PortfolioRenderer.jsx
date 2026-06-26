import { useEffect, useMemo, useState } from "react";
import {
  FaBehance,
  FaBriefcase,
  FaChevronUp,
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
  PORTFOLIO_DEFAULT_TEMPLATE,
  PORTFOLIO_MEDIA_PACKS,
  PORTFOLIO_PRESETS,
  PORTFOLIO_THEMES,
} from "./portfolioPresets";
import { normalizePortfolioContent } from "./portfolioFallbacks";
import "./portfolio-shared.css";

const PAGES = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "work", label: "Work" },
  { key: "services", label: "Services" },
  { key: "resume", label: "Resume" },
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
  email: "mailto:hello@portfolio.co.za",
  phone: "tel:+27000000000",
};

const SOCIAL_ORDER = [
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


const getPageKey = (page) => {
  if (!page) return "home";
  if (typeof page === "string") return page;
  return page.template_page_key || page.slug || page.key || "home";
};

const normalizePageKey = (page) => {
  const pageKey = getPageKey(page);
  return PAGES.some((item) => item.key === pageKey) ? pageKey : "home";
};

const getTemplateConfig = (settings, preset) => {
  const saved =
    settings.portfolio_config ||
    settings.template_config?.portfolio ||
    settings.templateConfig?.portfolio ||
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
  const theme = PORTFOLIO_THEMES[config.theme] || PORTFOLIO_THEMES.developer;
  const accent = config.accent || theme.accent;

  return {
    "--portfolio-primary": theme.primary,
    "--portfolio-secondary": theme.secondary,
    "--portfolio-accent": accent,
    "--portfolio-accent-2": theme.accent2,
    "--portfolio-surface": theme.surface,
    "--portfolio-text": theme.text,
    "--portfolio-muted": theme.muted,
  };
};

const getMediaPack = (config) => PORTFOLIO_MEDIA_PACKS[config.mediaPack] || PORTFOLIO_MEDIA_PACKS.developer;

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

const normalizePresetSocialItem = (item) => {
  if (typeof item === "string") {
    const baseItem = SOCIAL_STYLE_DEFAULTS[item] || {};

    return {
      key: item,
      label: baseItem.label || item,
      url: SOCIAL_PRESET_FALLBACKS[item] || "",
    };
  }

  if (item && typeof item === "object" && !Array.isArray(item)) {
    return item;
  }

  return {};
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
      ...SOCIAL_ORDER,
    ]),
  ).filter((key) => SOCIAL_ICON_MAP[key]);
};

const mergeSocialLinks = (
  defaultItems = [],
  savedLinks = {},
  contact = {},
  socialDisplay = {},
) => {
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

      return {
        ...data,
        Icon: SOCIAL_ICON_MAP[key],
        color: getSocialIconColor(data),
      };
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
    <div className="portfolio-socials" aria-label="Social media links">
      {socials.map(({ key, label, url, Icon, color }) => {
        const directLink = key === "email" || key === "phone" || url.startsWith("mailto:") || url.startsWith("tel:");

        return (
          <a
            key={key}
            href={url || "#"}
            target={directLink ? undefined : "_blank"}
            rel={directLink ? undefined : "noreferrer"}
            aria-label={label}
            title={label}
            style={{ "--portfolio-social-color": color }}
            onClick={(event) => !url && event.preventDefault()}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}

function PortfolioTopbar({ content, config, preset }) {
  const showSocials = content.socialDisplay?.topbar !== false;

  return (
    <div className={`portfolio-topbar portfolio-topbar--${config.navVariant}`}>
      <div className="portfolio-topbar-info">
        <span className="portfolio-topbar-status">Available for selected work</span>
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

function PortfolioNavbar({ content, config, currentPage, onPageChange }) {
  const [open, setOpen] = useState(false);

  const navigate = (page) => {
    onPageChange(page);
    setOpen(false);
  };

  return (
    <header className={`portfolio-navbar portfolio-navbar--${config.navVariant}`}>
      <button type="button" className="portfolio-brand" onClick={() => navigate("home")}>
        <span className="portfolio-brand-mark"><FaBriefcase /></span>
        <span>
          <strong>{content.name}</strong>
          <small>{content.role}</small>
        </span>
      </button>

      <button className={`portfolio-menu-toggle ${open ? "is-open" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation menu" aria-expanded={open}>
        <span />
        <span />
        <span />
      </button>

      <nav className={`portfolio-nav-links ${open ? "is-open" : ""}`} aria-label="Portfolio navigation">
        {PAGES.map((item) => (
          <button key={item.key} type="button" className={currentPage === item.key ? "active" : ""} onClick={() => navigate(item.key)}>
            {item.label}
          </button>
        ))}
      </nav>
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
    <div className="portfolio-hero-media">
      {active.type === "video" ? (
        <video key={active.url} src={active.url} poster={active.poster} muted playsInline autoPlay loop />
      ) : (
        <img src={active.url} alt="Portfolio presentation" />
      )}
      <div className="portfolio-hero-dots">
        {slides.map((slide, slideIndex) => (
          <button key={`${slide.url}-${slideIndex}`} type="button" className={slideIndex === index ? "active" : ""} onClick={() => setIndex(slideIndex)} aria-label={`Show slide ${slideIndex + 1}`} />
        ))}
      </div>
    </div>
  );
}

function PortfolioHero({ content, config, media, onPageChange }) {
  return (
    <section className={`portfolio-hero portfolio-hero--${config.heroVariant}`}>
      <div className="portfolio-hero-copy">
        <span className="portfolio-kicker">{content.role}</span>
        <h1>{content.headline}</h1>
        <p>{content.subtitle}</p>
        <div className="portfolio-hero-actions">
          <button type="button" onClick={() => onPageChange("work")}>View Work</button>
          <button type="button" className="ghost" onClick={() => onPageChange("contact")}>Start Conversation</button>
        </div>
      </div>

      <HeroMedia media={media} />

      <div className="portfolio-hero-proof">
        {content.proof.map(([value, label]) => (
          <article key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PageHeader({ currentPage, content, media }) {
  const title = PAGES.find((page) => page.key === currentPage)?.label || "Portfolio";
  return (
    <section className="portfolio-page-header" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.88), rgba(15,23,42,.5)), url("${media.page}")` }}>
      <span className="portfolio-kicker">{content.role}</span>
      <h1>{title}</h1>
      <p>{content.subtitle}</p>
    </section>
  );
}

function AboutSection({ content, media }) {
  return (
    <section className="portfolio-section portfolio-about">
      <div>
        <span className="portfolio-kicker">Profile</span>
        <h2>{content.bioTitle}</h2>
        <p>{content.bio}</p>
      </div>
      <div className="portfolio-portrait-card">
        <img src={media.portrait} alt="Portfolio profile" />
      </div>
    </section>
  );
}

function WorkSection({ content, config }) {
  return (
    <section className="portfolio-section">
      <div className="portfolio-section-heading">
        <span className="portfolio-kicker">Selected Work</span>
        <h2>Projects and proof of capability.</h2>
      </div>
      <div className={`portfolio-card-grid portfolio-card-grid--${config.cardsVariant}`}>
        {content.projects.map((project, index) => (
          <article key={project} className="portfolio-work-card">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{project}</h3>
            <p>Detailed case structure with challenge, approach, outcome and professional presentation for clients.</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServicesSection({ content }) {
  return (
    <section className="portfolio-section portfolio-services-section">
      <div className="portfolio-section-heading">
        <span className="portfolio-kicker">Services</span>
        <h2>Clear services that clients can understand and request.</h2>
      </div>
      <div className="portfolio-service-list">
        {content.services.map((service) => (
          <article key={service}>
            <strong>✦</strong>
            <span>{service}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ResumeSection({ content }) {
  return (
    <section className="portfolio-section portfolio-resume-section">
      <div>
        <span className="portfolio-kicker">Resume</span>
        <h2>Experience, skills and professional background.</h2>
        <p>{content.bio}</p>
        <a className="portfolio-download" href={content.resumeUrl} target="_blank" rel="noreferrer">Download Resume</a>
      </div>
      <div className="portfolio-skills-panel">
        {content.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </section>
  );
}

function ProcessSection({ content }) {
  return (
    <section className="portfolio-process">
      {content.process.map((step, index) => (
        <article key={step}>
          <strong>{String(index + 1).padStart(2, "0")}</strong>
          <p>{step}</p>
        </article>
      ))}
    </section>
  );
}

function ContactSection({ content, config }) {
  const email = content.contact.email || "hello@portfolio.co.za";
  const subject = encodeURIComponent(content.formType || "Portfolio enquiry");
  const body = encodeURIComponent("Good day,\n\nI would like to discuss a project/enquiry.\n\nRegards,");
  const mapQuery = encodeURIComponent(content.contact.address || "Johannesburg, South Africa");

  return (
    <section className={`portfolio-contact portfolio-contact--${config.contactVariant}`}>
      <div className="portfolio-contact-info">
        <span className="portfolio-kicker">Contact</span>
        <h2>{content.formType}</h2>
        <p><FaPhoneAlt /> <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a></p>
        <p><FaEnvelope /> <a href={`mailto:${email}`}>{email}</a></p>
        <p><FaMapMarkerAlt /> {content.contact.address}</p>
        <iframe title="Portfolio location map" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>

      <form className="portfolio-contact-form" action={`mailto:${email}?subject=${subject}&body=${body}`} method="post" encType="text/plain">
        <input name="name" placeholder="Your name" autoComplete="name" />
        <input name="email" placeholder="Email address" type="email" autoComplete="email" />
        <input name="phone" placeholder="Phone number" type="tel" autoComplete="tel" />
        <input name="company" placeholder="Company / organisation" autoComplete="organization" />
        <select name="service" defaultValue="">
          <option value="" disabled>Select enquiry type</option>
          {content.services.slice(0, 5).map((service) => <option key={service}>{service}</option>)}
        </select>
        <textarea name="message" placeholder="Tell me what you need" rows="5" autoComplete="off" />
        <button type="submit">Send Enquiry</button>
      </form>
    </section>
  );
}

function PortfolioFooter({ content, preset, config, onPageChange }) {
  const showSocials = content.socialDisplay?.footer !== false;

  return (
    <footer className={`portfolio-footer portfolio-footer--${config.footerVariant}`}>
      <div className="portfolio-footer-main">
        <div>
          <strong>{content.name}</strong>
          <p>{content.subtitle}</p>
          {showSocials && <SocialLinks content={content} preset={preset} />}
        </div>
        <div>
          <h4>Pages</h4>
          {PAGES.map((page) => (
            <button key={page.key} type="button" onClick={() => onPageChange(page.key)}>{page.label}</button>
          ))}
        </div>
        <div>
          <h4>Services</h4>
          {content.services.slice(0, 5).map((service) => <span key={service}>{service}</span>)}
        </div>
        <div>
          <h4>Contact</h4>
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
          <a href={`tel:${content.contact.phone}`}>{content.contact.phone}</a>
          <span>{content.contact.address}</span>
        </div>
      </div>
      <div className="portfolio-footer-bottom">
        <div className="portfolio-copyright small">
          © {new Date().getFullYear()} {content.name}. All rights reserved.
        </div>

        <div className="portfolio-powered-by">
          <span>Powered by</span>
          <a
            href="https://ulterspace.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="portfolio-ulterspace-link"
          >
            <img src={ulterspaceLogo} alt="Ulterspace Logo" className="portfolio-ulterspace-logo" />
            <span>Ulterspace</span>
          </a>
        </div>
      </div>
    </footer>
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
    <button type="button" className={`portfolio-scroll-top portfolio-scroll-top--${preset.template_key} ${show ? "is-visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top">
      <FaChevronUp />
    </button>
  );
}

export default function PortfolioRenderer({ settings = {}, preset = PORTFOLIO_PRESETS[PORTFOLIO_DEFAULT_TEMPLATE], page }) {
  const content = useMemo(() => normalizePortfolioContent(settings, preset), [settings, preset]);
  const config = useMemo(() => getTemplateConfig(settings, preset), [settings, preset]);
  const media = useMemo(() => getMediaPack(config), [config]);
  const initialPage = normalizePageKey(page);
  const [internalPage, setInternalPage] = useState(initialPage || "home");
  const currentPage = internalPage;

  useEffect(() => {
    if (page) setInternalPage(initialPage || "home");
  }, [page, initialPage]);

  const onPageChange = (nextPage) => {
    setInternalPage(normalizePageKey(nextPage));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`portfolio-enterprise portfolio-enterprise--${preset.template_key}`} style={getThemeStyle(config)}>
      <PortfolioTopbar content={content} config={config} preset={preset} />
      <PortfolioNavbar content={content} config={config} currentPage={currentPage} onPageChange={onPageChange} />

      {currentPage === "home" ? (
        <>
          <PortfolioHero content={content} config={config} media={media} onPageChange={onPageChange} />
          <AboutSection content={content} media={media} />
          <WorkSection content={content} config={config} />
          <ServicesSection content={content} />
          <ProcessSection content={content} />
          <ContactSection content={content} config={config} />
        </>
      ) : (
        <>
          <PageHeader currentPage={currentPage} content={content} media={media} />
          {currentPage === "about" && <><AboutSection content={content} media={media} /><ProcessSection content={content} /></>}
          {currentPage === "work" && <WorkSection content={content} config={config} />}
          {currentPage === "services" && <ServicesSection content={content} />}
          {currentPage === "resume" && <ResumeSection content={content} />}
          {currentPage === "contact" && <ContactSection content={content} config={config} />}
        </>
      )}

      <PortfolioFooter content={content} preset={preset} config={config} onPageChange={onPageChange} />
      <ScrollTopButton preset={preset} />
    </div>
  );
}
