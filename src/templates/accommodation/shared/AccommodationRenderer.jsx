import { useEffect, useMemo, useState } from "react";
import {
  FaBed,
  FaCalendarCheck,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaSearch,
  FaTimes,
  FaUserFriends,
  FaWhatsapp,
  FaWifi,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ulterspaceLogo from "../../../assets/logo.gif";
import { getAccommodationFallback } from "./accommodationFallbacks";
import "./accommodation-shared.css";

const PAGE_LABELS = {
  home: "Home",
  stays: "Stays",
  amenities: "Amenities",
  gallery: "Gallery",
  packages: "Packages",
  location: "Location",
  contact: "Contact",
};

const VALID_PAGES = new Set(["home", "stays", "amenities", "gallery", "packages", "location", "contact", "room"]);
const GENERIC_BRAND_NAMES = new Set(["website preview", "live template preview", "template preview", "preview site", "website template", "accommodation preview"]);
const DEFAULT_SOCIAL_LINKS = { facebook: "#", instagram: "#", linkedin: "#", x: "#", youtube: "#", whatsapp: "#" };
const SOCIAL_ICON_MAP = { facebook: FaFacebookF, instagram: FaInstagram, linkedin: FaLinkedinIn, x: FaXTwitter, youtube: FaYoutube, whatsapp: FaWhatsapp };
const SOCIAL_LABELS = { facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn", x: "X", youtube: "YouTube", whatsapp: "WhatsApp" };
const PRICE_FILTERS = [
  { value: "All", label: "Any rate" },
  { value: "under-800", label: "Under R800", max: 800 },
  { value: "800-1500", label: "R800 – R1,500", min: 800, max: 1500 },
  { value: "1500-3000", label: "R1,500 – R3,000", min: 1500, max: 3000 },
  { value: "3000-6000", label: "R3,000 – R6,000", min: 3000, max: 6000 },
  { value: "over-6000", label: "R6,000+", min: 6000 },
];

const normalizePageKey = (value) => (VALID_PAGES.has(value) ? value : "home");
const isGenericBrand = (value) => GENERIC_BRAND_NAMES.has(String(value || "").trim().toLowerCase());
const toArray = (value) => Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : value ? [value] : [];
const resolveTemplateBrand = ({ organization, settings, content }) => {
  const preferred = organization?.name || settings?.site_name || settings?.name;
  return preferred && !isGenericBrand(preferred) ? preferred : content.name;
};
const resolveSocialLinks = (content, settings, organization) => ({ ...DEFAULT_SOCIAL_LINKS, ...(content.social_links || content.socialLinks || {}), ...(settings?.social_links || settings?.socialLinks || {}), ...(organization?.social_links || organization?.socialLinks || {}) });
const formatRate = (room) => room?.priceLabel || (Number(room?.price || 0) ? `R ${Number(room.price).toLocaleString("en-ZA")} / night` : "Rate on request");
const scrollToTop = (behavior = "smooth") => {
  if (typeof window === "undefined") return;
  const run = () => window.scrollTo({ top: 0, left: 0, behavior });
  if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(run);
  else run();
};
const matchesPriceFilter = (room, priceRange) => {
  if (!priceRange || priceRange === "All") return true;
  const selectedRange = PRICE_FILTERS.find((item) => item.value === priceRange);
  if (!selectedRange) return true;
  const price = Number(room?.price || 0);
  if (!price) return false;
  const aboveMinimum = selectedRange.min ? price >= selectedRange.min : true;
  const belowMaximum = selectedRange.max ? price < selectedRange.max : true;
  return aboveMinimum && belowMaximum;
};
const buildMailto = ({ email, subject, body }) => `mailto:${email || "bookings@accommodation.co.za"}?subject=${encodeURIComponent(subject || "Accommodation booking enquiry")}&body=${encodeURIComponent(body || "")}`;

function AccommodationSocialLinks({ links, compact = false }) {
  const items = Object.entries(links || {}).filter(([, url]) => Boolean(url));
  if (!items.length) return null;
  return (
    <div className={`accommodation-social-links ${compact ? "is-compact" : ""}`} aria-label="Social media links">
      {items.map(([platform, url]) => {
        const Icon = SOCIAL_ICON_MAP[platform];
        const label = SOCIAL_LABELS[platform] || platform;
        return <a key={platform} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label}>{Icon ? <Icon /> : platform.slice(0, 2)}</a>;
      })}
    </div>
  );
}

function AccommodationTopbar({ content, contact }) {
  return (
    <div className="accommodation-topbar">
      <div className="accommodation-topbar-status">{content.slogan}</div>
      <div className="accommodation-topbar-links">
        <a href={`mailto:${contact.email}`}>✉ {contact.email}</a>
        <a href={`tel:${contact.phone}`}>☎ {contact.phone}</a>
      </div>
    </div>
  );
}

function AccommodationNavbar({ brand, category, slogan, socialLinks, activePage, onNavigate, isMenuOpen, setIsMenuOpen, savedCount }) {
  const navItems = ["home", "stays", "amenities", "gallery", "packages", "contact"];
  const handleNavigate = (page) => { onNavigate(page); setIsMenuOpen(false); };
  return (
    <nav className="accommodation-navbar">
      <button type="button" className="accommodation-brand" onClick={() => handleNavigate("home")}>
        <span className="accommodation-brand-mark"><FaBed /></span>
        <span><strong>{brand}</strong><small>{slogan || category}</small></span>
      </button>
      <div className={`accommodation-nav-links ${isMenuOpen ? "is-open" : ""}`}>
        {navItems.map((item) => <button type="button" key={item} className={activePage === item ? "active" : ""} onClick={() => handleNavigate(item)}>{PAGE_LABELS[item]}</button>)}
        <button type="button" className="accommodation-nav-cta" onClick={() => handleNavigate("stays")}>Book Stay</button>
      </div>
      <div className="accommodation-navbar-actions">
        <AccommodationSocialLinks links={socialLinks} compact />
        <button type="button" className="accommodation-saved-button" onClick={() => handleNavigate("stays")}>♡ <span>Saved</span><em>{savedCount}</em></button>
        <button type="button" className={`accommodation-menu-toggle ${isMenuOpen ? "is-open" : ""}`} aria-label="Toggle navigation" onClick={() => setIsMenuOpen((current) => !current)}><span /><span /><span /></button>
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
  const activeImage = images[slide] || images[0];
  return (
    <section className="accommodation-hero">
      <div className="accommodation-hero-copy">
        <span className="accommodation-kicker">{content.hero?.kicker}</span>
        <h1>{content.hero?.headline}</h1>
        <p>{content.hero?.subtitle}</p>
        <div className="accommodation-hero-actions">
          <button type="button" onClick={() => onNavigate("stays")}>{content.hero?.primaryAction || "View Stays"}</button>
          <button type="button" className="ghost" onClick={() => onNavigate("contact")}>{content.hero?.secondaryAction || "Request Booking"}</button>
        </div>
        <div className="accommodation-hero-trust"><span>Suitable for</span>{toArray(content.tags).slice(0, 4).map((tag) => <strong key={tag}>{tag}</strong>)}</div>
      </div>
      <div className="accommodation-hero-media">
        {activeImage ? <img src={activeImage} alt={content.name} loading="eager" /> : null}
        {images.length > 1 ? <div className="accommodation-hero-dots">{images.map((_, index) => <button type="button" key={index} className={index === slide ? "active" : ""} aria-label={`Show slide ${index + 1}`} onClick={() => setSlide(index)} />)}</div> : null}
      </div>
      <div className="accommodation-hero-proof">
        {toArray(content.proof).map((item, index) => <article key={`${item.value}-${index}`}><strong>{item.value}</strong><span>{item.label}</span></article>)}
      </div>
    </section>
  );
}

function SearchPanel({ search, setSearch, priceRange, setPriceRange, guestCount, setGuestCount, onSubmit }) {
  return (
    <section className="accommodation-search-panel" aria-label="Find accommodation">
      <label><span>Find a stay</span><div><FaSearch /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search rooms, location, amenities..." /></div></label>
      <label><span>Nightly rate</span><select value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>{PRICE_FILTERS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <label><span>Guests</span><select value={guestCount} onChange={(event) => setGuestCount(event.target.value)}><option value="All">Any guests</option><option value="1">1 guest</option><option value="2">2 guests</option><option value="4">4+ guests</option></select></label>
      <button type="button" onClick={onSubmit}>Search stays</button>
    </section>
  );
}

function RoomCard({ room, onOpen, onSave, isSaved }) {
  return (
    <article className="accommodation-room-card">
      <button type="button" className="accommodation-room-image" onClick={() => onOpen(room)}>
        <img src={room.image} alt={room.title} loading="lazy" />
        <span>{room.status}</span>
      </button>
      <div className="accommodation-room-body">
        <small>{room.type} • {room.location}</small>
        <h3>{room.title}</h3>
        <p>{room.description}</p>
        <div className="accommodation-room-meta"><span><FaUserFriends /> {room.guests} guests</span><span><FaBed /> {room.beds} beds</span><span><FaWifi /> Wi-Fi</span></div>
        <div className="accommodation-room-footer"><strong>{formatRate(room)}</strong><button type="button" onClick={() => onOpen(room)}>View room</button><button type="button" className={isSaved ? "is-saved" : ""} onClick={() => onSave(room)} aria-label="Save room"><FaHeart /></button></div>
      </div>
    </article>
  );
}

function RoomsPage({ content, rooms, onOpenRoom, onSaveRoom, savedRoomIds, search, setSearch, priceRange, setPriceRange, guestCount, setGuestCount }) {
  return (
    <main className="accommodation-section accommodation-rooms-section">
      <div className="accommodation-section-heading"><span className="accommodation-kicker">Rooms & stays</span><h2>Available accommodation options</h2><p>Search by room, location, amenity or budget range.</p></div>
      <SearchPanel search={search} setSearch={setSearch} priceRange={priceRange} setPriceRange={setPriceRange} guestCount={guestCount} setGuestCount={setGuestCount} onSubmit={() => scrollToTop()} />
      <div className="accommodation-room-grid">
        {rooms.length ? rooms.map((room) => <RoomCard key={room.id} room={room} onOpen={onOpenRoom} onSave={onSaveRoom} isSaved={savedRoomIds.includes(room.id)} />) : <div className="accommodation-empty-state"><h3>No stays found</h3><p>Try a different search or budget range.</p><button type="button" onClick={() => { setSearch(""); setPriceRange("All"); setGuestCount("All"); }}>Clear filters</button></div>}
      </div>
    </main>
  );
}

function Overview({ content, onNavigate }) {
  return (
    <section className="accommodation-section accommodation-overview">
      <div><span className="accommodation-kicker">Why stay here</span><h2>Accommodation website sections built for trust and direct booking enquiries.</h2><p>{content.sections?.mission}</p><p>{content.sections?.vision}</p><button type="button" onClick={() => onNavigate("stays")}>Explore rooms</button></div>
      <div className="accommodation-feature-list">{toArray(content.sections?.amenities).slice(0, 8).map((item) => <article key={item}><FaCalendarCheck /><span>{item}</span></article>)}</div>
    </section>
  );
}

function AmenitiesPage({ content }) {
  return (
    <main className="accommodation-section"><div className="accommodation-section-heading"><span className="accommodation-kicker">Amenities</span><h2>Everything guests need to feel confident before booking.</h2></div><div className="accommodation-card-grid">{toArray(content.sections?.amenities).map((item, index) => <article className="accommodation-feature-card" key={item}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item}</h3><p>Clear guest information, easy enquiries and professional accommodation presentation.</p></article>)}</div></main>
  );
}

function PackagesPage({ content, onNavigate }) {
  return (
    <main className="accommodation-section"><div className="accommodation-section-heading"><span className="accommodation-kicker">Packages</span><h2>Stay packages for direct booking enquiries.</h2></div><div className="accommodation-package-grid">{toArray(content.packages).map((plan) => <article key={plan.name} className={`accommodation-package-card ${plan.featured ? "is-featured" : ""}`}><header><h3>{plan.name}</h3><strong>{plan.price}</strong><p>{plan.description}</p></header><ul>{toArray(plan.features).map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><button type="button" onClick={() => onNavigate("contact")}>Request package</button></article>)}</div></main>
  );
}

function GallerySection({ content }) {
  const gallery = toArray(content.gallery);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  if (!gallery.length) return null;
  const move = (direction) => setActiveIndex((current) => (current + direction + gallery.length) % gallery.length);
  const zoomMove = (direction) => setZoomIndex((current) => (current + direction + gallery.length) % gallery.length);
  const active = gallery[activeIndex] || gallery[0];
  const zoomItem = zoomIndex !== null ? gallery[zoomIndex] : null;
  return (
    <main className="accommodation-section accommodation-gallery-section"><div className="accommodation-section-heading"><span className="accommodation-kicker">Gallery</span><h2>Visual stay experience</h2><p>Enterprise gallery with chevrons, thumbnails and zoom preview.</p></div><div className="accommodation-gallery-showcase"><button type="button" className="gallery-chevron prev" onClick={() => move(-1)}><FaChevronLeft /></button><button type="button" className="accommodation-gallery-main" onClick={() => setZoomIndex(activeIndex)}><img src={active.image} alt={active.title} /><span><strong>{active.title}</strong><small>{active.caption}</small></span></button><button type="button" className="gallery-chevron next" onClick={() => move(1)}><FaChevronRight /></button></div><div className="accommodation-gallery-thumbs">{gallery.map((item, index) => <button type="button" key={item.image} className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)}><img src={item.image} alt={item.title} /></button>)}</div>{zoomItem ? <div className="accommodation-lightbox" role="dialog" aria-modal="true"><button type="button" className="lightbox-close" onClick={() => setZoomIndex(null)}><FaTimes /></button><button type="button" className="lightbox-arrow prev" onClick={() => zoomMove(-1)}><FaChevronLeft /></button><figure><img src={zoomItem.image} alt={zoomItem.title} /><figcaption><strong>{zoomItem.title}</strong><span>{zoomItem.caption}</span></figcaption></figure><button type="button" className="lightbox-arrow next" onClick={() => zoomMove(1)}><FaChevronRight /></button></div> : null}</main>
  );
}

function LocationPage({ content }) {
  return <main className="accommodation-section accommodation-location"><div><span className="accommodation-kicker">Location</span><h2>{content.contact?.address}</h2><p>Show nearby landmarks, transport access and guest-ready location highlights.</p><div className="accommodation-feature-list">{toArray(content.sections?.locationHighlights).map((item) => <article key={item}><FaMapMarkerAlt /><span>{item}</span></article>)}</div></div><iframe title="Accommodation map" src="https://www.google.com/maps?q=Johannesburg%20South%20Africa&output=embed" loading="lazy" /></main>;
}

function ContactPage({ content, brand, contact }) {
  const body = `Hello ${brand},\n\nI would like to enquire about accommodation.\n\nPreferred dates:\nGuests:\nRoom type:\n\nThank you.`;
  return <main className="accommodation-contact"><form className="accommodation-contact-form" action={buildMailto({ email: contact.email, subject: `${brand} booking enquiry`, body })} method="get"><input placeholder="Full name" /><input placeholder="Email address" /><input placeholder="Phone number" /><select><option>Booking enquiry</option><option>Group stay</option><option>Long stay</option><option>Event or conference</option></select><textarea placeholder="Dates, guests, room type and special requests" /><button type="submit">Send booking enquiry</button></form><div className="accommodation-contact-info"><span className="accommodation-kicker">Contact</span><h2>Request a booking or ask about availability.</h2><p><FaMapMarkerAlt /> {contact.address}</p><p>✉ <a href={`mailto:${contact.email}`}>{contact.email}</a></p><p>☎ <a href={`tel:${contact.phone}`}>{contact.phone}</a></p><iframe title="Accommodation location" src="https://www.google.com/maps?q=Johannesburg%20South%20Africa&output=embed" loading="lazy" /></div></main>;
}

function RoomDetailGallery({ room }) {
  const galleryImages = [room.image, ...toArray(room.gallery)]
    .map((item) => (typeof item === "string" ? item : item?.image || item?.url || item?.src))
    .filter(Boolean)
    .filter((image, index, list) => list.indexOf(image) === index);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  if (!galleryImages.length) return null;
  const move = (direction) => setActiveIndex((current) => (current + direction + galleryImages.length) % galleryImages.length);
  const zoomMove = (direction) => setZoomIndex((current) => (current + direction + galleryImages.length) % galleryImages.length);
  const activeImage = galleryImages[activeIndex] || galleryImages[0];
  const zoomImage = zoomIndex !== null ? galleryImages[zoomIndex] : null;
  return (
    <div className="accommodation-room-gallery accommodation-room-gallery--interactive">
      <div className="accommodation-room-gallery-stage">
        {galleryImages.length > 1 ? <button type="button" className="room-gallery-chevron prev" aria-label="Previous image" onClick={() => move(-1)}><FaChevronLeft /></button> : null}
        <button type="button" className="accommodation-room-gallery-main" onClick={() => setZoomIndex(activeIndex)} aria-label="Zoom room image">
          <img src={activeImage} alt={room.title} />
          <span>Zoom</span>
        </button>
        {galleryImages.length > 1 ? <button type="button" className="room-gallery-chevron next" aria-label="Next image" onClick={() => move(1)}><FaChevronRight /></button> : null}
      </div>
      {galleryImages.length > 1 ? <div className="accommodation-room-gallery-thumbs">{galleryImages.map((image, index) => <button type="button" key={image} className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} aria-label={`Show ${room.title} image ${index + 1}`}><img src={image} alt={`${room.title} ${index + 1}`} /></button>)}</div> : null}
      {zoomImage ? <div className="accommodation-lightbox" role="dialog" aria-modal="true"><button type="button" className="lightbox-close" onClick={() => setZoomIndex(null)}><FaTimes /></button>{galleryImages.length > 1 ? <button type="button" className="lightbox-arrow prev" onClick={() => zoomMove(-1)}><FaChevronLeft /></button> : null}<figure><img src={zoomImage} alt={room.title} /><figcaption><strong>{room.title}</strong><span>{zoomIndex + 1} / {galleryImages.length}</span></figcaption></figure>{galleryImages.length > 1 ? <button type="button" className="lightbox-arrow next" onClick={() => zoomMove(1)}><FaChevronRight /></button> : null}</div> : null}
    </div>
  );
}

function RoomDetailsPage({ room, rooms, content, contact, onNavigate, onOpenRoom }) {
  const related = rooms.filter((item) => item.id !== room.id).slice(0, 3);
  const body = `Hello,\n\nI would like to enquire about ${room.title}.\nRate: ${formatRate(room)}\nLocation: ${room.location}\nGuests: ${room.guests}\n\nPreferred dates:\nSpecial requests:\n\nThank you.`;
  return (
    <main className="accommodation-room-page">
      <button type="button" className="accommodation-back-link" onClick={() => onNavigate("stays")}>← Back to stays</button>
      <section className="accommodation-room-detail"><RoomDetailGallery room={room} /><div className="accommodation-room-summary"><span className="accommodation-kicker">{room.status}</span><h1>{room.title}</h1><p>{room.description}</p><strong className="accommodation-room-price">{formatRate(room)}</strong><div className="accommodation-room-meta is-large"><span><FaUserFriends /> {room.guests} guests</span><span><FaBed /> {room.beds} beds</span><span>{room.sizeLabel}</span><span>{room.plan}</span></div><div className="accommodation-detail-actions"><a href={buildMailto({ email: contact.email, subject: `${content.name} - ${room.title} enquiry`, body })}><FaCalendarCheck /> Request booking</a><button type="button" onClick={() => onNavigate("contact")}>Ask a question</button></div></div></section>
      <section className="accommodation-section accommodation-detail-lists"><div><h2>Highlights</h2>{toArray(room.highlights).map((item) => <p key={item}>✓ {item}</p>)}</div><div><h2>Amenities</h2>{toArray(room.amenities).map((item) => <p key={item}>✓ {item}</p>)}</div></section>
      <section className="accommodation-section"><div className="accommodation-section-heading"><span className="accommodation-kicker">Related stays</span><h2>Similar accommodation options</h2></div><div className="accommodation-room-grid">{related.map((item) => <RoomCard key={item.id} room={item} onOpen={onOpenRoom} onSave={() => {}} isSaved={false} />)}</div></section>
    </main>
  );
}

function AccommodationFooter({ brand, content, contact, socialLinks, onNavigate }) {
  const year = new Date().getFullYear();
  return <footer className="accommodation-footer"><div className="accommodation-footer-main"><div><strong>{brand}</strong><p>{content.category} website template for stays, rooms, booking enquiries, amenities and guest confidence.</p><AccommodationSocialLinks links={socialLinks} /></div><div><h4>Explore</h4>{["home", "stays", "amenities", "gallery", "contact"].map((page) => <button type="button" key={page} onClick={() => onNavigate(page)}>{PAGE_LABELS[page]}</button>)}</div><div><h4>Contact</h4><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={`tel:${contact.phone}`}>{contact.phone}</a><span>{contact.address}</span></div><div><h4>Booking</h4><span>Room enquiries</span><span>Group bookings</span><span>Long stays</span><span>Guest support</span></div></div><div className="accommodation-footer-bottom"><span>© {year} {brand}. All rights reserved.</span><span className="accommodation-powered-by">Powered by <a href="https://ulterspace.co.za" target="_blank" rel="noreferrer" className="accommodation-ulterspace-link"><img src={ulterspaceLogo} alt="Ulterspace" className="accommodation-ulterspace-logo" /> Ulterspace</a></span></div></footer>;
}

export default function AccommodationRenderer({ templateKey = "accommodation-luxury-hotel-v1", settings = {}, organization = {}, page = "home", sections = {}, builderMode = false, previewMode = false }) {
  const content = useMemo(() => ({ ...getAccommodationFallback(templateKey), ...(settings?.accommodation_content || settings?.content || {}), sections: { ...(getAccommodationFallback(templateKey)?.sections || {}), ...(sections || {}), ...(settings?.sections || {}) } }), [templateKey, settings, sections]);
  const brand = resolveTemplateBrand({ organization, settings, content });
  const socialLinks = resolveSocialLinks(content, settings, organization);
  const contact = { ...(content.contact || {}), ...(settings?.contact || {}), email: settings?.official_email || settings?.email || organization?.email || content.contact?.email || "bookings@accommodation.co.za", phone: settings?.official_phone || settings?.phone || organization?.phone || content.contact?.phone || "+27 11 000 0000", address: settings?.address || organization?.address || content.contact?.address || "Johannesburg, South Africa" };
  const [activePage, setActivePage] = useState(normalizePageKey(page));
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [savedRoomIds, setSavedRoomIds] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("All");
  const [guestCount, setGuestCount] = useState("All");

  useEffect(() => { setActivePage(normalizePageKey(page)); }, [page]);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (nextPage) => { setActivePage(normalizePageKey(nextPage)); setSelectedRoom(null); scrollToTop(); };
  const openRoom = (room) => { setSelectedRoom(room); setActivePage("room"); scrollToTop(); };
  const saveRoom = (room) => setSavedRoomIds((current) => current.includes(room.id) ? current.filter((id) => id !== room.id) : [...current, room.id]);
  const rooms = toArray(content.rooms);
  const filteredRooms = rooms.filter((room) => {
    const query = search.trim().toLowerCase();
    const searchable = [room.title, room.type, room.location, room.description, room.status, ...(room.amenities || []), ...(room.highlights || [])].join(" ").toLowerCase();
    const matchesSearch = !query || searchable.includes(query);
    const matchesGuests = guestCount === "All" || Number(room.guests || 0) >= Number(guestCount);
    return matchesSearch && matchesGuests && matchesPriceFilter(room, priceRange);
  });

  const styleVars = { "--accommodation-primary": content.theme?.primary, "--accommodation-secondary": content.theme?.secondary, "--accommodation-accent": content.theme?.accent, "--accommodation-surface": content.theme?.surface, "--accommodation-text": content.theme?.text, "--accommodation-muted": content.theme?.muted };

  return (
    <div className={`accommodation-enterprise accommodation-enterprise--${templateKey}`} style={styleVars} data-builder-mode={builderMode ? "true" : "false"} data-preview-mode={previewMode ? "true" : "false"}>
      <AccommodationTopbar content={content} contact={contact} />
      <AccommodationNavbar brand={brand} category={content.category} slogan={content.slogan} socialLinks={socialLinks} activePage={activePage} onNavigate={navigate} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} savedCount={savedRoomIds.length} />
      {activePage === "home" ? <><Hero content={content} onNavigate={navigate} /><SearchPanel search={search} setSearch={setSearch} priceRange={priceRange} setPriceRange={setPriceRange} guestCount={guestCount} setGuestCount={setGuestCount} onSubmit={() => navigate("stays")} /><Overview content={content} onNavigate={navigate} /><RoomsPage content={content} rooms={filteredRooms.slice(0, 3)} onOpenRoom={openRoom} onSaveRoom={saveRoom} savedRoomIds={savedRoomIds} search={search} setSearch={setSearch} priceRange={priceRange} setPriceRange={setPriceRange} guestCount={guestCount} setGuestCount={setGuestCount} /><GallerySection content={content} /><PackagesPage content={content} onNavigate={navigate} /></> : null}
      {activePage === "stays" ? <RoomsPage content={content} rooms={filteredRooms} onOpenRoom={openRoom} onSaveRoom={saveRoom} savedRoomIds={savedRoomIds} search={search} setSearch={setSearch} priceRange={priceRange} setPriceRange={setPriceRange} guestCount={guestCount} setGuestCount={setGuestCount} /> : null}
      {activePage === "amenities" ? <AmenitiesPage content={content} /> : null}
      {activePage === "gallery" ? <GallerySection content={content} /> : null}
      {activePage === "packages" ? <PackagesPage content={content} onNavigate={navigate} /> : null}
      {activePage === "location" ? <LocationPage content={content} /> : null}
      {activePage === "contact" ? <ContactPage content={content} brand={brand} contact={contact} /> : null}
      {activePage === "room" && selectedRoom ? <RoomDetailsPage room={selectedRoom} rooms={rooms} content={content} contact={contact} onNavigate={navigate} onOpenRoom={openRoom} /> : null}
      <AccommodationFooter brand={brand} content={content} contact={contact} socialLinks={socialLinks} onNavigate={navigate} />
      <button type="button" className={`accommodation-scroll-top ${showScrollTop ? "is-visible" : ""}`} onClick={() => scrollToTop()} aria-label="Scroll to top"><FaChevronUp /></button>
    </div>
  );
}
