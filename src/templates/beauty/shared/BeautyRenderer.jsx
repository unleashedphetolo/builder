import { useEffect, useMemo, useState } from "react";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaSearch,
  FaShoppingBag,
  FaTimes,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ulterspaceLogo from "../../../assets/logo.gif";
import { getBeautyFallback } from "./beautyFallbacks";
import "./beauty-shared.css";

const VALID_PAGES = ["home", "services", "details", "gallery", "about", "contact", "booking"];

const toList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === "object") return Object.values(value).filter(Boolean);
  return [];
};

const money = (item) => item?.priceLabel || (item?.price ? `R ${item.price}` : "Request quote");

const scrollToTop = (behavior = "smooth") => {
  if (typeof window === "undefined") return;
  window.requestAnimationFrame?.(() => window.scrollTo({ top: 0, left: 0, behavior }));
  if (!window.requestAnimationFrame) window.scrollTo({ top: 0, left: 0, behavior });
};

const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  x: FaXTwitter,
  twitter: FaXTwitter,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
};

function BeautySocials({ links }) {
  const entries = Object.entries(links || {}).filter(([, value]) => Boolean(value));
  if (!entries.length) return null;
  return (
    <div className="beauty-socials" aria-label="Social media links">
      {entries.map(([key, value]) => {
        const Icon = socialIcons[key] || FaInstagram;
        return (
          <a key={key} href={value} aria-label={key} target={value === "#" ? undefined : "_blank"} rel="noreferrer">
            <Icon />
          </a>
        );
      })}
    </div>
  );
}

function BeautyNavbar({ preset, page, cartCount, onPageChange, socialLinks }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ["home", "Home"],
    ["services", "Services"],
    ["gallery", "Gallery"],
    ["about", "About"],
    ["contact", "Contact"],
  ];
  const go = (target) => {
    setOpen(false);
    onPageChange(target);
  };
  return (
    <header className="beauty-navbar">
      <button className="beauty-brand" type="button" onClick={() => go("home")}>
        <span className="beauty-brand-mark">{preset.brandMark}</span>
        <span>
          <strong>{preset.name}</strong>
          <small>{preset.slogan}</small>
        </span>
      </button>
      <nav className={`beauty-nav-links ${open ? "is-open" : ""}`}>
        {nav.map(([target, label]) => (
          <button key={target} type="button" className={page === target ? "active" : ""} onClick={() => go(target)}>{label}</button>
        ))}
        <button type="button" className="beauty-nav-cta" onClick={() => go("contact")}>Book Now</button>
      </nav>
      <div className="beauty-navbar-actions">
        <BeautySocials links={socialLinks} />
        <button className="beauty-cart-nav" type="button" onClick={() => go("booking")} aria-label="Open booking list">
          <FaShoppingBag />
          <span>Booking</span>
          <em>{cartCount}</em>
        </button>
        <button className={`beauty-menu-toggle ${open ? "is-open" : ""}`} type="button" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}

function BeautyTopbar({ contact, preset }) {
  return (
    <div className="beauty-topbar">
      <div className="beauty-topbar-info">
        <span className="beauty-topbar-status">{preset.category}</span>
        <a href={`tel:${contact.phone}`}><FaCalendarAlt /> {contact.phone}</a>
        <a href={`mailto:${contact.email}`}><FaClock /> {contact.email}</a>
      </div>
      <span>{contact.address}</span>
    </div>
  );
}

function BeautyHero({ preset, onPageChange }) {
  const images = toList(preset.hero?.images);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (images.length < 2) return undefined;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % images.length), 4500);
    return () => window.clearInterval(id);
  }, [images.length]);
  const activeImage = images[index] || images[0];
  return (
    <section className={`beauty-hero beauty-hero--${preset.heroVariant}`}>
      <div className="beauty-hero-copy">
        <span className="beauty-kicker">{preset.hero?.kicker}</span>
        <h1>{preset.hero?.headline}</h1>
        <p>{preset.hero?.subtitle}</p>
        <div className="beauty-hero-actions">
          <button type="button" onClick={() => onPageChange("services")}>{preset.hero?.primaryAction || "View Services"}</button>
          <button type="button" className="ghost" onClick={() => onPageChange("contact")}>{preset.hero?.secondaryAction || "Book Appointment"}</button>
        </div>
        <div className="beauty-hero-trust">
          <strong>{preset.category}</strong>
          <span>{preset.slogan}</span>
        </div>
      </div>
      <div className="beauty-hero-media">
        {activeImage && <img src={activeImage} alt={`${preset.name} beauty hero`} />}
        {images.length > 1 && (
          <div className="beauty-hero-dots">
            {images.map((image, dotIndex) => <button key={image} type="button" className={dotIndex === index ? "active" : ""} onClick={() => setIndex(dotIndex)} aria-label={`Show slide ${dotIndex + 1}`} />)}
          </div>
        )}
      </div>
      <div className="beauty-hero-proof">
        {toList(preset.proof).map((item) => <article key={`${item.value}-${item.label}`}><strong>{item.value}</strong><span>{item.label}</span></article>)}
      </div>
    </section>
  );
}

function ServiceCard({ service, onOpen, onAdd }) {
  return (
    <article className="beauty-service-card" onClick={() => onOpen(service)}>
      <div className="beauty-service-image">
        <img src={service.image} alt={service.name} />
        <span>{service.badge}</span>
      </div>
      <div className="beauty-service-body">
        <small>{service.category} • {service.duration}</small>
        <h3>{service.name}</h3>
        <p>{service.description}</p>
        <div>
          <strong>{money(service)}</strong>
          <button type="button" onClick={(event) => { event.stopPropagation(); onAdd(service); }}>Add to booking</button>
        </div>
      </div>
    </article>
  );
}

function BeautyServices({ preset, onOpenService, onAddService }) {
  const services = toList(preset.services);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All services");
  const categories = ["All services", ...toList(preset.categories)];
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = services.filter((service) => {
    const matchesCategory = category === "All services" || service.category === category;
    const haystack = [service.name, service.description, service.category, service.badge, service.duration, ...(service.highlights || [])].join(" ").toLowerCase();
    return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
  });

  return (
    <section className="beauty-section beauty-services-section">
      <div className="beauty-section-heading">
        <span className="beauty-kicker">Services & Treatments</span>
        <h2>Clear, bookable beauty services for every client journey.</h2>
        <p>Browse by treatment type, open full service details, or add services to the booking enquiry list.</p>
      </div>
      <div className="beauty-filter-bar">
        <div className="beauty-search-box">
          <FaSearch />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services, packages or categories" />
          {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><FaTimes /></button>}
        </div>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {filtered.length ? (
        <div className="beauty-service-grid">
          {filtered.map((service) => <ServiceCard key={service.id} service={service} onOpen={onOpenService} onAdd={onAddService} />)}
        </div>
      ) : (
        <div className="beauty-empty-state"><h3>No service found</h3><p>Clear search or choose another category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All services"); }}>Clear filters</button></div>
      )}
    </section>
  );
}

function BeautyServiceDetails({ preset, service, onAddService, onOpenService, onPageChange }) {
  const selected = service || toList(preset.services)[0];
  const related = toList(preset.services).filter((item) => item.id !== selected?.id).slice(0, 3);
  if (!selected) return null;
  return (
    <main className="beauty-detail-page">
      <button type="button" className="beauty-back-link" onClick={() => onPageChange("services")}>← Back to services</button>
      <section className="beauty-detail-layout">
        <div className="beauty-detail-image"><img src={selected.image} alt={selected.name} /></div>
        <div className="beauty-detail-copy">
          <span className="beauty-kicker">{selected.category}</span>
          <h1>{selected.name}</h1>
          <p>{selected.description}</p>
          <div className="beauty-detail-meta">
            <span>{money(selected)}</span><span>{selected.duration}</span><span>{selected.availability}</span>
          </div>
          <ul>{toList(selected.highlights).map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="beauty-detail-actions">
            <button type="button" onClick={() => onAddService(selected)}>Add to booking enquiry</button>
            <button type="button" className="ghost" onClick={() => onPageChange("contact")}>Ask about this service</button>
          </div>
        </div>
      </section>
      <section className="beauty-section beauty-related-section">
        <div className="beauty-section-heading"><span className="beauty-kicker">Related services</span><h2>Recommended next options</h2></div>
        <div className="beauty-service-grid compact">
          {related.map((item) => <ServiceCard key={item.id} service={item} onOpen={onOpenService} onAdd={onAddService} />)}
        </div>
      </section>
    </main>
  );
}

function BeautyGallery({ preset }) {
  const gallery = toList(preset.gallery);
  const [active, setActive] = useState(null);
  const move = (direction) => setActive((current) => {
    const index = current ?? 0;
    return (index + direction + gallery.length) % gallery.length;
  });
  return (
    <section className="beauty-section beauty-gallery-section">
      <div className="beauty-section-heading">
        <span className="beauty-kicker">Gallery</span>
        <h2>Visual proof for atmosphere, services and client experience.</h2>
      </div>
      <div className="beauty-gallery-grid">
        {gallery.map((item, index) => (
          <article key={item.title} className={index === 0 ? "is-large" : ""} onClick={() => setActive(index)}>
            <img src={item.image} alt={item.title} />
            <div><strong>{item.title}</strong><span>{item.caption}</span></div>
          </article>
        ))}
      </div>
      {active !== null && gallery[active] && (
        <div className="beauty-lightbox" role="dialog" aria-modal="true">
          <button type="button" className="beauty-lightbox-close" onClick={() => setActive(null)}><FaTimes /></button>
          <button type="button" className="beauty-lightbox-arrow left" onClick={() => move(-1)}><FaChevronLeft /></button>
          <figure><img src={gallery[active].image} alt={gallery[active].title} /><figcaption><strong>{gallery[active].title}</strong><span>{gallery[active].caption}</span></figcaption></figure>
          <button type="button" className="beauty-lightbox-arrow right" onClick={() => move(1)}><FaChevronRight /></button>
        </div>
      )}
    </section>
  );
}

function BeautyAbout({ preset }) {
  return (
    <section className="beauty-section beauty-about-section">
      <div className="beauty-about-layout">
        <div>
          <span className="beauty-kicker">About {preset.name}</span>
          <h2>{preset.category} designed for trust, calm and confident booking decisions.</h2>
          <p>{preset.story?.mission}</p>
          <p>{preset.story?.vision}</p>
        </div>
        <div className="beauty-feature-panel">
          {toList(preset.features).map((feature) => <article key={feature}><strong>✓</strong><span>{feature}</span></article>)}
        </div>
      </div>
    </section>
  );
}

function BeautyContact({ preset, contact, bookingItems }) {
  const firstBookingService = bookingItems?.[0]?.name || "";
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    serviceInterest: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  useEffect(() => {
    if (!firstBookingService) return;
    setFormData((current) =>
      current.serviceInterest
        ? current
        : { ...current, serviceInterest: firstBookingService },
    );
  }, [firstBookingService]);

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const selectedServicesText = bookingItems.length
    ? bookingItems
        .map(
          (item) =>
            `- ${item.name}${item.category ? ` (${item.category})` : ""}${
              item.duration ? ` • ${item.duration}` : ""
            } — ${money(item)}`,
        )
        .join("\n")
    : formData.serviceInterest
      ? `- ${formData.serviceInterest}`
      : "- Beauty appointment";

  const subject = encodeURIComponent(
    `Booking enquiry for ${preset.name}${
      formData.fullName ? ` - ${formData.fullName}` : ""
    }`,
  );

  const body = encodeURIComponent(
    `Hello ${preset.name},\n\n` +
      `I would like to send a booking enquiry.\n\n` +
      `Selected services:\n${selectedServicesText}\n\n` +
      `Client details:\n` +
      `Name: ${formData.fullName || ""}\n` +
      `Phone: ${formData.phone || ""}\n` +
      `Email: ${formData.email || ""}\n` +
      `Service interest: ${formData.serviceInterest || ""}\n` +
      `Preferred date: ${formData.preferredDate || ""}\n` +
      `Preferred time: ${formData.preferredTime || ""}\n` +
      `Message: ${formData.message || ""}\n\n` +
      `Please confirm availability and the next steps.\n\nThank you.`,
  );

  return (
    <section className="beauty-contact">
      <form className="beauty-contact-form">
        <span className="beauty-kicker">Booking Enquiry</span>
        <h2>Request an appointment</h2>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={(event) => updateForm("fullName", event.target.value)}
          placeholder="Full name"
          autoComplete="name"
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={(event) => updateForm("phone", event.target.value)}
          placeholder="Phone number"
          autoComplete="tel"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={(event) => updateForm("email", event.target.value)}
          placeholder="Email address"
          autoComplete="email"
        />
        <select
          name="serviceInterest"
          value={formData.serviceInterest}
          onChange={(event) => updateForm("serviceInterest", event.target.value)}
        >
          <option value="" disabled>Select service interest</option>
          {toList(preset.services).map((service) => (
            <option key={service.id} value={service.name}>{service.name}</option>
          ))}
        </select>
        <div className="beauty-form-row">
          <input
            name="preferredDate"
            type="date"
            value={formData.preferredDate}
            onChange={(event) => updateForm("preferredDate", event.target.value)}
            aria-label="Preferred appointment date"
            autoComplete="off"
          />
          <input
            name="preferredTime"
            type="time"
            value={formData.preferredTime}
            onChange={(event) => updateForm("preferredTime", event.target.value)}
            aria-label="Preferred appointment time"
            autoComplete="off"
          />
        </div>
        <textarea
          name="message"
          value={formData.message}
          onChange={(event) => updateForm("message", event.target.value)}
          placeholder="Message, treatment notes or preferred stylist"
          autoComplete="off"
        />
        <a className="beauty-form-button" href={`mailto:${contact.email}?subject=${subject}&body=${body}`}>
          Send booking enquiry
        </a>
      </form>
      <div className="beauty-contact-info">
        <span className="beauty-kicker">Visit & Contact</span>
        <h2>Contact details</h2>
        <p><FaMapMarkerAlt /> {contact.address}</p>
        <p><FaCalendarAlt /> <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
        <p><FaClock /> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
        <div className="beauty-hours">{toList(preset.hours).map((hour) => <span key={hour}>{hour}</span>)}</div>
        <iframe title={`${preset.name} map`} src="https://www.google.com/maps?q=Johannesburg%20South%20Africa&output=embed" loading="lazy" />
      </div>
    </section>
  );
}

function BeautyBookingPage({ preset, contact, bookingItems, setBookingItems, onPageChange }) {
  const total = bookingItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const subject = encodeURIComponent(`Booking list enquiry for ${preset.name}`);
  const body = encodeURIComponent(`Hello ${preset.name},\n\nPlease assist me with these services:\n${bookingItems.map((item) => `- ${item.name}: ${money(item)}`).join("\n") || "No services selected yet."}\n\nEstimated total: R ${total}\n\nName:\nPreferred date:\nPhone:`);
  return (
    <main className="beauty-section beauty-booking-page">
      <div className="beauty-section-heading"><span className="beauty-kicker">Booking List</span><h2>Your selected beauty services</h2><p>Review selected services and send an enquiry by email.</p></div>
      {bookingItems.length ? (
        <div className="beauty-booking-layout">
          <div className="beauty-booking-items">
            {bookingItems.map((item, index) => (
              <article key={`${item.id}-${index}`}>
                <img src={item.image} alt={item.name} />
                <div><strong>{item.name}</strong><span>{item.category} • {item.duration}</span><small>{money(item)}</small></div>
                <button type="button" onClick={() => setBookingItems((current) => current.filter((_, currentIndex) => currentIndex !== index))}>Remove</button>
              </article>
            ))}
          </div>
          <aside className="beauty-booking-summary"><h3>Summary</h3><p>{bookingItems.length} selected service(s)</p><strong>Estimated: R {total}</strong><a href={`mailto:${contact.email}?subject=${subject}&body=${body}`}>Send booking enquiry</a></aside>
        </div>
      ) : (
        <div className="beauty-empty-state"><h3>Your booking list is empty</h3><p>Add services from the services page before sending an enquiry.</p><button type="button" onClick={() => onPageChange("services")}>View services</button></div>
      )}
    </main>
  );
}

function BeautyFooter({ preset, contact, onPageChange, socialLinks }) {
  return (
    <footer className="beauty-footer">
      <div className="beauty-footer-main">
        <div><strong>{preset.name}</strong><p>{preset.slogan}</p><BeautySocials links={socialLinks} /></div>
        <div><h4>Explore</h4>{["Home","Services","Gallery","About","Contact"].map((label) => <button key={label} type="button" onClick={() => onPageChange(label.toLowerCase())}>{label}</button>)}</div>
        <div><h4>Beauty services</h4>{toList(preset.categories).slice(0,4).map((item) => <span key={item}>{item}</span>)}</div>
        <div><h4>Contact</h4><a href={`tel:${contact.phone}`}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><span>{contact.address}</span></div>
      </div>
      <div className="beauty-footer-bottom"><span>© 2026 {preset.name}. All rights reserved.</span><span className="beauty-powered-by">Powered by <a className="beauty-ulterspace-link" href="https://ulterspace.co.za" target="_blank" rel="noreferrer"><img src={ulterspaceLogo} alt="Ulterspace" className="beauty-ulterspace-logo" /> Ulterspace</a></span></div>
    </footer>
  );
}

export default function BeautyRenderer({ settings, organization, templateKey, template_key, selectedTemplateKey, page: externalPage }) {
  const resolvedKey = templateKey || template_key || selectedTemplateKey || settings?.template_key || settings?.selected_template_key || "beauty-luxury-salon-v1";
  const fallback = getBeautyFallback(resolvedKey);
  const preset = useMemo(() => ({ ...fallback, contact: { ...fallback.contact, ...(settings?.contact || {}) }, social_links: { ...fallback.social_links, ...(settings?.social_links || settings?.socialLinks || {}) } }), [fallback, settings]);
  const requestedPage = VALID_PAGES.includes(externalPage) ? externalPage : "home";
  const [page, setPage] = useState(requestedPage);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingItems, setBookingItems] = useState([]);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => { setPage(requestedPage); }, [requestedPage]);
  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onPageChange = (target) => { setPage(VALID_PAGES.includes(target) ? target : "home"); scrollToTop(); };
  const openService = (service) => { setSelectedService(service); setPage("details"); scrollToTop(); };
  const addService = (service) => { setBookingItems((current) => [...current, service]); };
  const contact = preset.contact || {};
  const socialLinks = preset.social_links || {};

  return (
    <div className={`beauty-enterprise beauty-enterprise--${preset.template_key}`}>
      <BeautyTopbar contact={contact} preset={preset} />
      <BeautyNavbar preset={preset} page={page} cartCount={bookingItems.length} onPageChange={onPageChange} socialLinks={socialLinks} />
      {page === "home" && <><BeautyHero preset={preset} onPageChange={onPageChange} /><BeautyServices preset={preset} onOpenService={openService} onAddService={addService} /><BeautyGallery preset={preset} /><BeautyAbout preset={preset} /><BeautyContact preset={preset} contact={contact} bookingItems={bookingItems} /></>}
      {page === "services" && <BeautyServices preset={preset} onOpenService={openService} onAddService={addService} />}
      {page === "details" && <BeautyServiceDetails preset={preset} service={selectedService} onAddService={addService} onOpenService={openService} onPageChange={onPageChange} />}
      {page === "gallery" && <BeautyGallery preset={preset} />}
      {page === "about" && <BeautyAbout preset={preset} />}
      {page === "contact" && <BeautyContact preset={preset} contact={contact} bookingItems={bookingItems} />}
      {page === "booking" && <BeautyBookingPage preset={preset} contact={contact} bookingItems={bookingItems} setBookingItems={setBookingItems} onPageChange={onPageChange} />}
      <BeautyFooter preset={preset} contact={contact} onPageChange={onPageChange} socialLinks={socialLinks} />
      <button type="button" className={`beauty-scroll-top ${showScroll ? "is-visible" : ""}`} onClick={() => scrollToTop()} aria-label="Scroll to top"><FaChevronUp /></button>
    </div>
  );
}
