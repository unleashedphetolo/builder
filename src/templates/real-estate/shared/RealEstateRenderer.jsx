import { useEffect, useMemo, useState } from "react";
import {
  FaChevronUp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ulterspaceLogo from "../../../assets/logo.gif";
import { getRealEstateFallback } from "./realEstateFallbacks";
import "./realestate-shared.css";

const PAGE_LABELS = {
  home: "Home",
  listings: "Listings",
  areas: "Areas",
  agents: "Agents",
  valuation: "Valuation",
  gallery: "Gallery",
  contact: "Contact",
};

const VALID_PAGES = new Set(["home", "listings", "areas", "agents", "valuation", "gallery", "contact", "property"]);
const GENERIC_BRAND_NAMES = new Set([
  "website preview",
  "live template preview",
  "template preview",
  "preview site",
  "website template",
  "real estate preview",
]);

const DEFAULT_SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  linkedin: "#",
  x: "#",
  youtube: "#",
  whatsapp: "#",
};

const SOCIAL_ICON_MAP = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
};

const SOCIAL_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  whatsapp: "WhatsApp",
};

const normalizePageKey = (value) => (VALID_PAGES.has(value) ? value : "home");

const isGenericBrand = (value) => GENERIC_BRAND_NAMES.has(String(value || "").trim().toLowerCase());

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === "object") return Object.values(value);
  return [value];
};

const resolveTemplateBrand = ({ organization, settings, content }) => {
  const preferred = organization?.name || settings?.site_name || settings?.name;
  return preferred && !isGenericBrand(preferred) ? preferred : content.name;
};

const resolveSocialLinks = (content, settings, organization) => ({
  ...DEFAULT_SOCIAL_LINKS,
  ...(content.social_links || content.socialLinks || {}),
  ...(settings?.social_links || settings?.socialLinks || {}),
  ...(organization?.social_links || organization?.socialLinks || {}),
});

const formatPrice = (property) => {
  if (property?.priceLabel) return property.priceLabel;
  const amount = Number(property?.price || 0);
  return amount ? `R ${amount.toLocaleString("en-ZA")}` : "Price on request";
};

const PRICE_FILTERS = [
  { value: "All", label: "Any budget" },
  { value: "under-1000000", label: "Under R1m", max: 1000000 },
  { value: "1000000-2500000", label: "R1m – R2.5m", min: 1000000, max: 2500000 },
  { value: "2500000-5000000", label: "R2.5m – R5m", min: 2500000, max: 5000000 },
  { value: "5000000-10000000", label: "R5m – R10m", min: 5000000, max: 10000000 },
  { value: "over-10000000", label: "R10m+", min: 10000000 },
];

const getPropertyPrice = (property) => Number(property?.price || 0);

const matchesPriceFilter = (property, priceRange) => {
  if (!priceRange || priceRange === "All") return true;

  const selectedRange = PRICE_FILTERS.find((item) => item.value === priceRange);
  if (!selectedRange) return true;

  const price = getPropertyPrice(property);
  if (!price) return false;

  const aboveMinimum = selectedRange.min ? price >= selectedRange.min : true;
  const belowMaximum = selectedRange.max ? price < selectedRange.max : true;

  return aboveMinimum && belowMaximum;
};

const scrollToTop = (behavior = "smooth") => {
  if (typeof window === "undefined") return;
  const run = () => window.scrollTo({ top: 0, left: 0, behavior });
  if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(run);
  else run();
};

const buildMailto = ({ email, subject, body }) => {
  const safeEmail = email || "property@realestate.co.za";
  return `mailto:${safeEmail}?subject=${encodeURIComponent(subject || "Property enquiry")}&body=${encodeURIComponent(body || "")}`;
};

function RealEstateTopbar({ content, contact }) {
  return (
    <div className="realestate-topbar">
      <div className="realestate-topbar-status">{content.slogan}</div>
      <div className="realestate-topbar-links">
        <a href={`mailto:${contact.email}`}>✉ {contact.email}</a>
        <a href={`tel:${contact.phone}`}>☎ {contact.phone}</a>
      </div>
    </div>
  );
}

function RealEstateSocialLinks({ links, compact = false }) {
  const items = Object.entries(links || {}).filter(([, url]) => Boolean(url));
  if (!items.length) return null;

  return (
    <div className={`realestate-social-links ${compact ? "is-compact" : ""}`} aria-label="Social media links">
      {items.map(([platform, url]) => {
        const Icon = SOCIAL_ICON_MAP[platform];
        const label = SOCIAL_LABELS[platform] || platform;

        return (
          <a key={platform} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label}>
            {Icon ? <Icon /> : platform.slice(0, 2)}
          </a>
        );
      })}
    </div>
  );
}

function RealEstateNavbar({ brand, category, slogan, socialLinks, activePage, onNavigate, isMenuOpen, setIsMenuOpen, savedCount }) {
  const navItems = ["home", "listings", "areas", "agents", "valuation", "contact"];

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <nav className="realestate-navbar">
      <button type="button" className="realestate-brand" onClick={() => handleNavigate("home")}>
        <span className="realestate-brand-mark">⌂</span>
        <span>
          <strong>{brand}</strong>
          <small>{slogan || category}</small>
        </span>
      </button>

      <div className={`realestate-nav-links ${isMenuOpen ? "is-open" : ""}`}>
        {navItems.map((item) => (
          <button
            type="button"
            key={item}
            className={activePage === item ? "active" : ""}
            onClick={() => handleNavigate(item)}
          >
            {PAGE_LABELS[item]}
          </button>
        ))}
        <button type="button" className="realestate-nav-cta" onClick={() => handleNavigate("listings")}>
          Find Property
        </button>
      </div>

      <div className="realestate-navbar-actions">
        <RealEstateSocialLinks links={socialLinks} compact />
        <button type="button" className="realestate-saved-button" onClick={() => handleNavigate("listings")}>
          ♡ <span>Saved</span><em>{savedCount}</em>
        </button>
        <button
          type="button"
          className={`realestate-menu-toggle ${isMenuOpen ? "is-open" : ""}`}
          aria-label="Toggle navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

function Hero({ content, onNavigate }) {
  const images = toArray(content.hero?.images);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % images.length), 4500);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <section className="realestate-hero">
      <div className="realestate-hero-copy">
        <span className="realestate-kicker">{content.hero?.kicker}</span>
        <h1>{content.hero?.headline}</h1>
        <p>{content.hero?.subtitle}</p>
        <div className="realestate-hero-actions">
          <button type="button" onClick={() => onNavigate("listings")}>{content.hero?.primaryAction || "View Listings"}</button>
          <button type="button" className="ghost" onClick={() => onNavigate("contact")}>{content.hero?.secondaryAction || "Book Viewing"}</button>
        </div>
        <div className="realestate-hero-trust">
          <span>Trusted for</span>
          {toArray(content.tags).slice(0, 4).map((tag) => <strong key={tag}>{tag}</strong>)}
        </div>
      </div>

      <div className="realestate-hero-media">
        {images.map((image, index) => (
          <img key={image} src={image} alt="Featured property" className={index === slide ? "is-active" : ""} />
        ))}
        <div className="realestate-hero-dots">
          {images.map((image, index) => (
            <button key={image} type="button" className={index === slide ? "active" : ""} onClick={() => setSlide(index)} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </div>

      <div className="realestate-proof-bar">
        {toArray(content.proof).map((item) => (
          <article key={`${item.value}-${item.label}`}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PropertyCard({ property, onOpen, onSave, saved }) {
  return (
    <article className="realestate-property-card" onClick={() => onOpen(property)}>
      <div className="realestate-property-image">
        <img src={property.image} alt={property.title} />
        <span>{property.status}</span>
        <button
          type="button"
          className={`realestate-save-floating ${saved ? "is-saved" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onSave(property.id);
          }}
          aria-label="Save property"
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <div className="realestate-property-body">
        <small>{property.type} • {property.location}</small>
        <h3>{property.title}</h3>
        <p>{property.description}</p>
        <div className="realestate-property-meta">
          {property.beds ? <span>{property.beds} Beds</span> : null}
          {property.baths ? <span>{property.baths} Baths</span> : null}
          <span>{property.sizeLabel}</span>
        </div>
        <div className="realestate-property-footer">
          <strong>{formatPrice(property)}</strong>
          <button type="button">View listing</button>
        </div>
      </div>
    </article>
  );
}

function SearchToolbar({ search, setSearch, type, setType, location, setLocation, priceRange, setPriceRange, properties }) {
  const types = ["All", ...Array.from(new Set(properties.map((p) => p.type).filter(Boolean)))];
  const locations = ["All", ...Array.from(new Set(properties.map((p) => p.location).filter(Boolean)))];
  return (
    <div className="realestate-search-toolbar">
      <label>
        <span>Search property</span>
        <div className="realestate-search-input">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, location, type or feature" />
          {search ? <button type="button" onClick={() => setSearch("")}>×</button> : null}
        </div>
      </label>
      <label>
        <span>Property type</span>
        <select value={type} onChange={(event) => setType(event.target.value)}>
          {types.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span>Location</span>
        <select value={location} onChange={(event) => setLocation(event.target.value)}>
          {locations.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        <span>Budget range</span>
        <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
          {PRICE_FILTERS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
    </div>
  );
}

function ListingsPage({ content, properties, onOpen, onSave, savedIds }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [location, setLocation] = useState("All");
  const [priceRange, setPriceRange] = useState("All");

  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();
    return properties.filter((property) => {
      const matchesSearch = !query || [property.title, property.type, property.location, property.description, ...(property.highlights || []), ...(property.amenities || [])].join(" ").toLowerCase().includes(query);
      const matchesType = type === "All" || property.type === type;
      const matchesLocation = location === "All" || property.location === location;
      const matchesPrice = matchesPriceFilter(property, priceRange);
      return matchesSearch && matchesType && matchesLocation && matchesPrice;
    });
  }, [properties, search, type, location, priceRange]);

  return (
    <main className="realestate-section realestate-listings-page">
      <div className="realestate-section-heading">
        <span className="realestate-kicker">Property search</span>
        <h2>Find listings with real estate filters, details and enquiry flow.</h2>
        <p>Search property type, location, listing features and availability.</p>
      </div>
      <SearchToolbar
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        location={location}
        setLocation={setLocation}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        properties={properties}
      />
      <div className="realestate-property-grid">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} onOpen={onOpen} onSave={onSave} saved={savedIds.includes(property.id)} />
        ))}
      </div>
      {!filteredProperties.length ? (
        <div className="realestate-empty-state">
          <h3>No matching properties</h3>
          <p>Clear search or try a different property type, location or budget range.</p>
          <button type="button" onClick={() => { setSearch(""); setType("All"); setLocation("All"); setPriceRange("All"); }}>Reset search</button>
        </div>
      ) : null}
    </main>
  );
}

function FeaturedListings({ properties, onOpen, onSave, savedIds }) {
  return (
    <section className="realestate-section">
      <div className="realestate-section-heading">
        <span className="realestate-kicker">Featured properties</span>
        <h2>Listing cards built for serious property discovery.</h2>
        <p>Each property opens a full listing page with gallery, highlights, enquiry and related listings.</p>
      </div>
      <div className="realestate-property-grid">
        {properties.slice(0, 3).map((property) => (
          <PropertyCard key={property.id} property={property} onOpen={onOpen} onSave={onSave} saved={savedIds.includes(property.id)} />
        ))}
      </div>
    </section>
  );
}

function MissionVision({ content }) {
  return (
    <section className="realestate-section realestate-mission-grid">
      <article>
        <span className="realestate-kicker">Mission</span>
        <h2>{content.sections?.mission}</h2>
      </article>
      <article>
        <span className="realestate-kicker">Vision</span>
        <h2>{content.sections?.vision}</h2>
      </article>
    </section>
  );
}

function AreasPage({ content }) {
  const areas = toArray(content.sections?.areas);
  return (
    <main className="realestate-section">
      <div className="realestate-section-heading">
        <span className="realestate-kicker">Areas and neighbourhoods</span>
        <h2>Help buyers and tenants understand where each listing belongs.</h2>
        <p>Area cards are useful for suburbs, estates, precincts, school zones, beaches or investment nodes.</p>
      </div>
      <div className="realestate-area-grid">
        {areas.map((area, index) => (
          <article key={area}>
            <strong>{String(index + 1).padStart(2, "0")}</strong>
            <h3>{area}</h3>
            <p>Market-ready area page for listings, amenities, access roads, lifestyle notes and property demand.</p>
          </article>
        ))}
      </div>
    </main>
  );
}

function AgentsPage({ content }) {
  const agents = toArray(content.sections?.agents);
  return (
    <main className="realestate-section">
      <div className="realestate-section-heading">
        <span className="realestate-kicker">Property team</span>
        <h2>Agent profiles for trust, quick calls and viewing requests.</h2>
        <p>Real estate websites convert better when buyers know who handles the listing.</p>
      </div>
      <div className="realestate-agent-grid">
        {agents.map((agent) => (
          <article key={agent.name}>
            <img src={agent.image} alt={agent.name} />
            <div>
              <h3>{agent.name}</h3>
              <p>{agent.role}</p>
              <a href={`tel:${agent.phone}`}>{agent.phone}</a>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function ValuationPage({ contact }) {
  return (
    <main className="realestate-contact-page">
      <div className="realestate-contact-copy">
        <span className="realestate-kicker">Valuation request</span>
        <h1>Let sellers request a valuation or buyers request a viewing.</h1>
        <p>This page is recommended for real estate websites because it captures seller leads, landlord leads and buyer viewing enquiries.</p>
        <div className="realestate-contact-points">
          <span>✓ Property valuation</span>
          <span>✓ Viewing appointment</span>
          <span>✓ Buyer matching</span>
          <span>✓ Rental assessment</span>
        </div>
      </div>
      <ContactForm contact={contact} subject="Property valuation request" />
    </main>
  );
}

function ContactForm({ contact, subject = "Property enquiry" }) {
  const body = "Hello, I would like to enquire about a property listing / valuation. Please contact me.";
  return (
    <form className="realestate-contact-form" onSubmit={(event) => event.preventDefault()}>
      <input placeholder="Full name" />
      <input placeholder="Email address" type="email" />
      <input placeholder="Phone number" />
      <select defaultValue="Viewing request">
        <option>Viewing request</option>
        <option>Buying enquiry</option>
        <option>Rental enquiry</option>
        <option>Property valuation</option>
        <option>List my property</option>
      </select>
      <textarea placeholder="Tell us what property, suburb or service you need" />
      <a className="realestate-submit-link" href={buildMailto({ email: contact.email, subject, body })}>Send enquiry to email</a>
      <small>Recipient: {contact.email}</small>
    </form>
  );
}

function ContactPage({ contact }) {
  return (
    <main className="realestate-contact-page">
      <div className="realestate-contact-copy">
        <span className="realestate-kicker">Contact</span>
        <h1>Book a viewing, request a valuation or list a property.</h1>
        <p>Use this page for serious buyers, tenants, sellers and landlords.</p>
        <p><strong>Email:</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        <p><strong>Phone:</strong> <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
        <p><strong>Address:</strong> {contact.address}</p>
      </div>
      <ContactForm contact={contact} />
    </main>
  );
}

function GalleryPage({ content }) {
  const gallery = toArray(content.sections?.gallery);
  const [index, setIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  const active = gallery[index] || gallery[0];

  const move = (direction) => setIndex((current) => (current + direction + gallery.length) % gallery.length);
  const zoomMove = (direction) => setZoomIndex((current) => (current + direction + gallery.length) % gallery.length);

  return (
    <main className="realestate-section realestate-gallery-page">
      <div className="realestate-section-heading">
        <span className="realestate-kicker">Gallery</span>
        <h2>Enterprise gallery with chevrons and zoom.</h2>
        <p>Use this for property photography, interiors, exteriors, lifestyle views and development renders.</p>
      </div>
      <div className="realestate-gallery-showcase">
        <button type="button" onClick={() => move(-1)}>‹</button>
        <img src={active?.image} alt={active?.title} onClick={() => setZoomIndex(index)} />
        <button type="button" onClick={() => move(1)}>›</button>
      </div>
      <div className="realestate-gallery-thumbs">
        {gallery.map((item, itemIndex) => (
          <button type="button" key={item.title} className={itemIndex === index ? "active" : ""} onClick={() => setIndex(itemIndex)}>
            <img src={item.image} alt={item.title} />
            <span>{item.title}</span>
          </button>
        ))}
      </div>
      {zoomIndex !== null ? (
        <div className="realestate-lightbox" role="dialog" aria-modal="true">
          <button type="button" className="realestate-lightbox-close" onClick={() => setZoomIndex(null)}>×</button>
          <button type="button" className="realestate-lightbox-arrow left" onClick={() => zoomMove(-1)}>‹</button>
          <img src={gallery[zoomIndex]?.image} alt={gallery[zoomIndex]?.title} />
          <button type="button" className="realestate-lightbox-arrow right" onClick={() => zoomMove(1)}>›</button>
          <strong>{zoomIndex + 1} / {gallery.length}</strong>
        </div>
      ) : null}
    </main>
  );
}

function PropertyDetailPage({ property, properties, contact, onOpen, onNavigate, onSave, saved }) {
  const gallery = toArray(property.gallery).length ? toArray(property.gallery) : [property.image];
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const related = properties.filter((item) => item.id !== property.id && (item.type === property.type || item.location === property.location)).slice(0, 3);
  const body = `Hello, I would like to enquire about ${property.title} in ${property.location}.`;

  const move = (direction) => setIndex((current) => (current + direction + gallery.length) % gallery.length);

  return (
    <main className="realestate-property-page">
      <button type="button" className="realestate-back-button" onClick={() => onNavigate("listings")}>← Back to listings</button>
      <section className="realestate-property-detail">
        <div className="realestate-property-gallery">
          <button type="button" onClick={() => move(-1)}>‹</button>
          <img src={gallery[index]} alt={property.title} onClick={() => setZoom(true)} />
          <button type="button" onClick={() => move(1)}>›</button>
          <span>{index + 1} / {gallery.length}</span>
        </div>
        <div className="realestate-property-panel">
          <span className="realestate-kicker">{property.status}</span>
          <h1>{property.title}</h1>
          <p>{property.location}</p>
          <strong>{formatPrice(property)}</strong>
          <div className="realestate-property-meta big">
            {property.beds ? <span>{property.beds} Bedrooms</span> : null}
            {property.baths ? <span>{property.baths} Bathrooms</span> : null}
            <span>{property.sizeLabel}</span>
            <span>{property.type}</span>
          </div>
          <p>{property.description}</p>
          <div className="realestate-highlight-list">
            {toArray(property.highlights).map((item) => <span key={item}>✓ {item}</span>)}
          </div>
          <div className="realestate-detail-actions">
            <a href={buildMailto({ email: contact.email, subject: `Viewing request: ${property.title}`, body })}>Book viewing</a>
            <button type="button" onClick={() => onSave(property.id)}>{saved ? "Saved" : "Save listing"}</button>
          </div>
          <small>Listed with {property.agent}</small>
        </div>
      </section>

      <section className="realestate-section realestate-amenities-section">
        <div className="realestate-section-heading">
          <span className="realestate-kicker">Listing details</span>
          <h2>Amenities, viewing notes and property features.</h2>
        </div>
        <div className="realestate-amenity-grid">
          {toArray(property.amenities).map((item) => <article key={item}>⌁ <span>{item}</span></article>)}
        </div>
      </section>

      <section className="realestate-section">
        <div className="realestate-section-heading">
          <span className="realestate-kicker">Related properties</span>
          <h2>Similar listings buyers may want to compare.</h2>
        </div>
        <div className="realestate-property-grid">
          {(related.length ? related : properties.filter((item) => item.id !== property.id).slice(0, 3)).map((item) => (
            <PropertyCard key={item.id} property={item} onOpen={onOpen} onSave={onSave} saved={false} />
          ))}
        </div>
      </section>

      {zoom ? (
        <div className="realestate-lightbox" role="dialog" aria-modal="true">
          <button type="button" className="realestate-lightbox-close" onClick={() => setZoom(false)}>×</button>
          <button type="button" className="realestate-lightbox-arrow left" onClick={() => move(-1)}>‹</button>
          <img src={gallery[index]} alt={property.title} />
          <button type="button" className="realestate-lightbox-arrow right" onClick={() => move(1)}>›</button>
          <strong>{index + 1} / {gallery.length}</strong>
        </div>
      ) : null}
    </main>
  );
}

function ScrollTopButton({ presetKey }) {
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
      className={`realestate-scroll-top realestate-scroll-top--${presetKey} ${show ? "is-visible" : ""}`}
      onClick={() => scrollToTop()}
      aria-label="Scroll to top"
    >
      <FaChevronUp />
    </button>
  );
}

function HomePage({ content, properties, onNavigate, onOpen, onSave, savedIds }) {
  return (
    <>
      <Hero content={content} onNavigate={onNavigate} />
      <FeaturedListings properties={properties} onOpen={onOpen} onSave={onSave} savedIds={savedIds} />
      <MissionVision content={content} />
      <section className="realestate-section realestate-service-strip">
        {toArray(content.sections?.services).map((service) => <article key={service}>{service}</article>)}
      </section>
    </>
  );
}

export default function RealEstateRenderer({ settings, organization, templateKey, template_key, selectedTemplateKey, page, children, preset: presetOverride }) {
  const resolvedKey = templateKey || template_key || selectedTemplateKey || settings?.template_key || settings?.selected_template_key;
  const preset = presetOverride || settings?.real_estate_preset || getRealEstateFallback(resolvedKey);
  const [activePage, setActivePage] = useState(() => normalizePageKey(page));
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setActivePage("home");
    setSelectedProperty(null);
    setIsMenuOpen(false);
  }, [preset.templateKey]);

  const content = useMemo(() => {
    const safeSettings = settings || {};
    return {
      ...preset,
      ...(safeSettings.real_estate_content || safeSettings.realEstateContent || {}),
      contact: {
        ...(preset.contact || {}),
        ...(safeSettings.contact || {}),
        email: safeSettings.official_email || safeSettings.email || organization?.email || preset.contact?.email,
        phone: safeSettings.official_phone || safeSettings.phone || organization?.phone || preset.contact?.phone,
        address: safeSettings.address || organization?.address || preset.contact?.address,
      },
    };
  }, [preset, settings, organization]);

  const brand = resolveTemplateBrand({ organization, settings, content });
  const properties = toArray(content.properties);
  const contact = content.contact || {};
  const socialLinks = resolveSocialLinks(content, settings, organization);

  const themeVars = {
    "--realestate-primary": content.theme?.primary,
    "--realestate-secondary": content.theme?.secondary,
    "--realestate-accent": content.theme?.accent,
    "--realestate-surface": content.theme?.surface,
    "--realestate-text": content.theme?.text,
    "--realestate-muted": content.theme?.muted,
  };

  const navigate = (nextPage) => {
    const safePage = normalizePageKey(nextPage);
    setActivePage(safePage);
    if (safePage !== "property") setSelectedProperty(null);
    scrollToTop();
  };

  const openProperty = (property) => {
    setSelectedProperty(property);
    setActivePage("property");
    scrollToTop();
  };

  const toggleSave = (propertyId) => {
    setSavedIds((current) => current.includes(propertyId) ? current.filter((id) => id !== propertyId) : [...current, propertyId]);
  };

  const currentProperty = selectedProperty || properties[0];
  const renderedPage = normalizePageKey(activePage);

  return (
    <div className={`realestate-enterprise realestate-enterprise--${preset.templateKey}`} style={themeVars}>
      <RealEstateTopbar content={content} contact={contact} />
      <RealEstateNavbar
        brand={brand}
        category={content.category}
        slogan={content.slogan}
        socialLinks={socialLinks}
        activePage={renderedPage}
        onNavigate={navigate}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        savedCount={savedIds.length}
      />

      {renderedPage === "home" ? <HomePage content={content} properties={properties} onNavigate={navigate} onOpen={openProperty} onSave={toggleSave} savedIds={savedIds} /> : null}
      {renderedPage === "listings" ? <ListingsPage content={content} properties={properties} onOpen={openProperty} onSave={toggleSave} savedIds={savedIds} /> : null}
      {renderedPage === "areas" ? <AreasPage content={content} /> : null}
      {renderedPage === "agents" ? <AgentsPage content={content} /> : null}
      {renderedPage === "valuation" ? <ValuationPage contact={contact} /> : null}
      {renderedPage === "gallery" ? <GalleryPage content={content} /> : null}
      {renderedPage === "contact" ? <ContactPage contact={contact} /> : null}
      {renderedPage === "property" && currentProperty ? (
        <PropertyDetailPage
          property={currentProperty}
          properties={properties}
          contact={contact}
          onOpen={openProperty}
          onNavigate={navigate}
          onSave={toggleSave}
          saved={savedIds.includes(currentProperty.id)}
        />
      ) : null}

      {children}
      <footer className="realestate-footer">
        <div className="realestate-footer-main">
          <div className="realestate-footer-brand">
            <strong>{brand}</strong>
            <p>{content.slogan || `${content.category} property website for listings, enquiries, valuations, agents and viewing bookings.`}</p>
            <RealEstateSocialLinks links={socialLinks} />
          </div>

          <div className="realestate-footer-links">
            <h4>Pages</h4>
            <button type="button" onClick={() => navigate("home")}>Home</button>
            <button type="button" onClick={() => navigate("listings")}>Listings</button>
            <button type="button" onClick={() => navigate("areas")}>Areas</button>
            <button type="button" onClick={() => navigate("agents")}>Agents</button>
            <button type="button" onClick={() => navigate("valuation")}>Valuation</button>
            <button type="button" onClick={() => navigate("contact")}>Contact</button>
          </div>

          <div className="realestate-footer-services">
            <h4>Services</h4>
            {toArray(content.sections?.services || content.services).slice(0, 5).map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>

          <div className="realestate-footer-contact">
            <h4>Contact</h4>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={`tel:${contact.phone}`}>{contact.phone}</a>
            <span>{contact.address}</span>
          </div>
        </div>

        <div className="realestate-footer-bottom">
          <div className="realestate-copyright small">
            © {new Date().getFullYear()} {brand}. All rights reserved.
          </div>

          <div className="realestate-powered-by">
            <span>Powered by</span>
            <a
              href="https://ulterspace.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="realestate-ulterspace-link"
            >
              <img src={ulterspaceLogo} alt="Ulterspace Logo" className="realestate-ulterspace-logo" />
              <span>Ulterspace</span>
            </a>
          </div>
        </div>
      </footer>
      <ScrollTopButton presetKey={preset.templateKey} />
    </div>
  );
}
