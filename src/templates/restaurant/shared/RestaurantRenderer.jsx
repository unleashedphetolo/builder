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
  FaUtensils,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ulterspaceLogo from "../../../assets/logo.gif";
import { getRestaurantFallback } from "./restaurantFallbacks";
import "./restaurant-shared.css";

const PAGE_LABELS = {
  home: "Home",
  menu: "Menu",
  reservations: "Reservations",
  gallery: "Gallery",
  story: "Our Story",
  contact: "Contact",
  order: "Order Cart",
  item: "Menu Item",
};

const VALID_PAGES = new Set(["home", "menu", "reservations", "gallery", "story", "contact", "order", "item"]);
const GENERIC_BRANDS = new Set(["website preview", "live template preview", "template preview", "preview site", "website template", "restaurant preview"]);
const DEFAULT_SOCIAL_LINKS = { facebook: "#", instagram: "#", x: "#", youtube: "#", whatsapp: "#" };
const SOCIAL_ICON_MAP = { facebook: FaFacebookF, instagram: FaInstagram, x: FaXTwitter, youtube: FaYoutube, whatsapp: FaWhatsapp };
const SOCIAL_LABELS = { facebook: "Facebook", instagram: "Instagram", x: "X", youtube: "YouTube", whatsapp: "WhatsApp" };

const normalizePageKey = (value) => (VALID_PAGES.has(value) ? value : "home");
const toArray = (value) => Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : value ? [value] : [];
const isGenericBrand = (value) => GENERIC_BRANDS.has(String(value || "").trim().toLowerCase());
const formatPrice = (item) => item?.priceLabel || (Number(item?.price || 0) ? `R ${Number(item.price).toLocaleString("en-ZA")}` : "Price on request");
const scrollToTop = (behavior = "smooth") => {
  if (typeof window === "undefined") return;
  const run = () => window.scrollTo({ top: 0, left: 0, behavior });
  if (typeof window.requestAnimationFrame === "function") window.requestAnimationFrame(run);
  else run();
};
const buildMailto = ({ email, subject, body }) => `mailto:${email || "bookings@restaurant.co.za"}?subject=${encodeURIComponent(subject || "Restaurant enquiry")}&body=${encodeURIComponent(body || "")}`;

function RestaurantSocialLinks({ links, compact = false }) {
  const items = Object.entries(links || {}).filter(([, url]) => Boolean(url));
  if (!items.length) return null;
  return (
    <div className={`restaurant-social-links ${compact ? "is-compact" : ""}`} aria-label="Social media links">
      {items.map(([platform, url]) => {
        const Icon = SOCIAL_ICON_MAP[platform];
        const label = SOCIAL_LABELS[platform] || platform;
        return <a key={platform} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label}>{Icon ? <Icon /> : platform.slice(0, 2)}</a>;
      })}
    </div>
  );
}

function Topbar({ content, contact }) {
  return (
    <div className="restaurant-topbar">
      <div className="restaurant-topbar-status">{content.slogan}</div>
      <div className="restaurant-topbar-links">
        <a href={`mailto:${contact.email}`}>✉ {contact.email}</a>
        <a href={`tel:${contact.phone}`}>☎ {contact.phone}</a>
        <span><FaClock /> Open today</span>
      </div>
    </div>
  );
}

function Navbar({ brand, slogan, socialLinks, activePage, onNavigate, isMenuOpen, setIsMenuOpen, cartCount }) {
  const navItems = ["home", "menu", "reservations", "gallery", "story", "contact"];
  const handleNavigate = (page) => { onNavigate(page); setIsMenuOpen(false); };
  return (
    <nav className="restaurant-navbar">
      <button type="button" className="restaurant-brand" onClick={() => handleNavigate("home")}>
        <span className="restaurant-brand-mark"><FaUtensils /></span>
        <span><strong>{brand}</strong><small>{slogan}</small></span>
      </button>
      <div className={`restaurant-nav-links ${isMenuOpen ? "is-open" : ""}`}>
        {navItems.map((item) => <button type="button" key={item} className={activePage === item ? "active" : ""} onClick={() => handleNavigate(item)}>{PAGE_LABELS[item]}</button>)}
        <button type="button" className="restaurant-nav-cta" onClick={() => handleNavigate("reservations")}>Book Table</button>
      </div>
      <div className="restaurant-navbar-actions">
        <RestaurantSocialLinks links={socialLinks} compact />
        <button type="button" className="restaurant-cart-button" onClick={() => handleNavigate("order")} aria-label="Open order cart"><FaShoppingBag /><span>Order</span><em>{cartCount}</em></button>
        <button type="button" className={`restaurant-menu-toggle ${isMenuOpen ? "is-open" : ""}`} aria-label="Toggle navigation" onClick={() => setIsMenuOpen((current) => !current)}><span /><span /><span /></button>
      </div>
    </nav>
  );
}

function Hero({ content, onNavigate }) {
  const images = toArray(content.hero?.images);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % images.length), 4600);
    return () => window.clearInterval(timer);
  }, [images.length]);
  const activeImage = images[slide] || images[0];
  return (
    <section className={`restaurant-hero restaurant-hero--${content.heroVariant || "editorial"}`}>
      <div className="restaurant-hero-copy">
        <span className="restaurant-kicker">{content.hero?.kicker}</span>
        <h1>{content.hero?.headline}</h1>
        <p>{content.hero?.subtitle}</p>
        <div className="restaurant-hero-actions">
          <button type="button" onClick={() => onNavigate("menu")}>{content.hero?.primaryAction || "View Menu"}</button>
          <button type="button" className="ghost" onClick={() => onNavigate("reservations")}>{content.hero?.secondaryAction || "Book a Table"}</button>
        </div>
        <div className="restaurant-hero-trust"><span>Perfect for</span>{toArray(content.tags).slice(0, 4).map((tag) => <strong key={tag}>{tag}</strong>)}</div>
      </div>
      <div className="restaurant-hero-media">
        {activeImage ? <img src={activeImage} alt={content.name} loading="eager" /> : null}
        {images.length > 1 ? <div className="restaurant-hero-dots">{images.map((_, index) => <button type="button" key={index} className={index === slide ? "active" : ""} aria-label={`Show slide ${index + 1}`} onClick={() => setSlide(index)} />)}</div> : null}
      </div>
      <div className="restaurant-hero-proof">
        {toArray(content.proof).map((item, index) => <article key={`${item.value}-${index}`}><strong>{item.value}</strong><span>{item.label}</span></article>)}
      </div>
    </section>
  );
}

function SearchMenu({ query, setQuery, category, setCategory, categories }) {
  return (
    <section className="restaurant-menu-filter" aria-label="Restaurant menu search">
      <label><span>Search menu</span><div><FaSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search meals, category or description..." />{query ? <button type="button" className="clear" onClick={() => setQuery("")} aria-label="Clear search"><FaTimes /></button> : null}</div></label>
      <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="All">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    </section>
  );
}

function MenuCard({ item, onOpen, onAdd }) {
  return (
    <article className="restaurant-menu-card">
      <button type="button" className="restaurant-menu-image" onClick={() => onOpen(item)}>
        <img src={item.image} alt={item.name} loading="lazy" />
        <span>{item.badge}</span>
      </button>
      <div className="restaurant-menu-body">
        <small>{item.category} • {item.dietary}</small>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div><strong>{formatPrice(item)}</strong><button type="button" onClick={() => onAdd(item)}>Add to order</button></div>
      </div>
    </article>
  );
}

function MenuPage({ content, menuItems, onOpenItem, onAddToCart, query, setQuery, category, setCategory }) {
  return (
    <main className="restaurant-section restaurant-menu-section">
      <div className="restaurant-section-heading"><span className="restaurant-kicker">Digital menu</span><h2>Signature dishes, combos and guest favourites.</h2><p>Search meals, browse categories and add dishes to the order enquiry cart.</p></div>
      <SearchMenu query={query} setQuery={setQuery} category={category} setCategory={setCategory} categories={toArray(content.categories)} />
      <div className="restaurant-menu-grid">
        {menuItems.length ? menuItems.map((item) => <MenuCard key={item.id} item={item} onOpen={onOpenItem} onAdd={onAddToCart} />) : <div className="restaurant-empty-state"><h3>No menu items found</h3><p>Try a different search or category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
      </div>
    </main>
  );
}

function ItemPage({ item, relatedItems, onAddToCart, onOpenItem, onNavigate, contact, brand }) {
  if (!item) return null;
  const body = `Hello ${brand},\n\nI would like to enquire about: ${item.name}.\n\nQuantity:\nCollection or sit-down:\n\nThank you.`;
  return (
    <main className="restaurant-item-page">
      <button type="button" className="restaurant-back-link" onClick={() => onNavigate("menu")}>← Back to menu</button>
      <section className="restaurant-item-detail">
        <div className="restaurant-item-image"><img src={item.image} alt={item.name} /></div>
        <div className="restaurant-item-copy"><span className="restaurant-kicker">{item.category}</span><h1>{item.name}</h1><strong>{formatPrice(item)}</strong><p>{item.description}</p><ul>{toArray(item.details).map((detail) => <li key={detail}>✓ {detail}</li>)}</ul><div className="restaurant-item-actions"><button type="button" onClick={() => onAddToCart(item)}>Add to order</button><a href={buildMailto({ email: contact.email, subject: `${brand} menu enquiry`, body })}>Email enquiry</a></div></div>
      </section>
      <section className="restaurant-section"><div className="restaurant-section-heading"><span className="restaurant-kicker">Related dishes</span><h2>Guests also view these items.</h2></div><div className="restaurant-menu-grid related">{relatedItems.map((related) => <MenuCard key={related.id} item={related} onOpen={onOpenItem} onAdd={onAddToCart} />)}</div></section>
    </main>
  );
}

function Overview({ content, onNavigate }) {
  return (
    <section className="restaurant-section restaurant-overview">
      <div><span className="restaurant-kicker">Restaurant experience</span><h2>Built for menus, bookings, orders and guest confidence.</h2><p>{content.story?.mission}</p><p>{content.story?.vision}</p><button type="button" onClick={() => onNavigate("menu")}>Explore menu</button></div>
      <div className="restaurant-feature-list">{toArray(content.features).map((feature) => <article key={feature}><FaUtensils /><span>{feature}</span></article>)}</div>
    </section>
  );
}

function StoryPage({ content }) {
  return (
    <main className="restaurant-section restaurant-story-page">
      <div><span className="restaurant-kicker">Our story</span><h1>{content.name}</h1><p>{content.story?.mission}</p><p>{content.story?.vision}</p></div>
      <div className="restaurant-card-grid">{toArray(content.features).map((feature, index) => <article className="restaurant-feature-card" key={feature}><span>{String(index + 1).padStart(2, "0")}</span><h3>{feature}</h3><p>Professional restaurant content section designed for real business enquiries and guest decision-making.</p></article>)}</div>
    </main>
  );
}

function ReservationsPage({ brand, contact, content }) {
  const body = `Hello ${brand},\n\nI would like to book a table.\n\nDate:\nTime:\nGuests:\nSpecial request:\n\nThank you.`;
  return (
    <main className="restaurant-reservations">
      <form className="restaurant-reservation-form" action={buildMailto({ email: contact.email, subject: `${brand} reservation request`, body })} method="get">
        <span className="restaurant-kicker">Reservations</span><h1>Book a table or send a dining enquiry.</h1><input placeholder="Full name" /><input placeholder="Email address" /><input placeholder="Phone number" /><div className="two"><input type="date" /><input type="time" /></div><select><option>2 guests</option><option>4 guests</option><option>6 guests</option><option>Private dining / event</option></select><textarea placeholder="Special requests, occasion or seating preference" /><button type="submit"><FaCalendarAlt /> Request reservation</button>
      </form>
      <aside className="restaurant-hours-card"><h2>Opening hours</h2>{toArray(content.hours).map((hour) => <p key={hour}><FaClock /> {hour}</p>)}<h3>Contact</h3><p>{contact.phone}</p><p>{contact.email}</p></aside>
    </main>
  );
}

function GalleryPage({ content }) {
  const gallery = toArray(content.gallery);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  if (!gallery.length) return null;
  const move = (direction) => setActiveIndex((current) => (current + direction + gallery.length) % gallery.length);
  const zoomMove = (direction) => setZoomIndex((current) => (current + direction + gallery.length) % gallery.length);
  const active = gallery[activeIndex] || gallery[0];
  const zoomItem = zoomIndex !== null ? gallery[zoomIndex] : null;
  return (
    <main className="restaurant-section restaurant-gallery-section"><div className="restaurant-section-heading"><span className="restaurant-kicker">Gallery</span><h2>Food, atmosphere and guest experience.</h2><p>Chevron gallery with zoom preview for desktop, tablet and mobile.</p></div><div className="restaurant-gallery-showcase"><button type="button" className="gallery-chevron prev" onClick={() => move(-1)}><FaChevronLeft /></button><button type="button" className="restaurant-gallery-main" onClick={() => setZoomIndex(activeIndex)}><img src={active.image} alt={active.title} /><span><strong>{active.title}</strong><small>{active.caption}</small></span></button><button type="button" className="gallery-chevron next" onClick={() => move(1)}><FaChevronRight /></button></div><div className="restaurant-gallery-thumbs">{gallery.map((item, index) => <button type="button" key={item.image} className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)}><img src={item.image} alt={item.title} /></button>)}</div>{zoomItem ? <div className="restaurant-lightbox" role="dialog" aria-modal="true"><button type="button" className="lightbox-close" onClick={() => setZoomIndex(null)}><FaTimes /></button><button type="button" className="lightbox-arrow prev" onClick={() => zoomMove(-1)}><FaChevronLeft /></button><figure><img src={zoomItem.image} alt={zoomItem.title} /><figcaption><strong>{zoomItem.title}</strong><span>{zoomItem.caption}</span></figcaption></figure><button type="button" className="lightbox-arrow next" onClick={() => zoomMove(1)}><FaChevronRight /></button></div> : null}</main>
  );
}

function OrderPage({ cartItems, updateQty, removeItem, onNavigate, contact, brand }) {
  const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
  const body = cartItems.length ? `Hello ${brand},\n\nI would like to place an order enquiry for:\n\n${cartItems.map((item) => `${item.qty} x ${item.name} - ${formatPrice(item)}`).join("\n")}\n\nEstimated total: R ${total.toLocaleString("en-ZA")}\n\nCollection/sit-down time:\nName:\nPhone:\n\nThank you.` : `Hello ${brand},\n\nI would like to enquire about your menu.\n\nThank you.`;
  return (
    <main className="restaurant-order-page">
      <div className="restaurant-section-heading"><span className="restaurant-kicker">Order cart</span><h1>Your order enquiry</h1><p>Add menu items and send the order by email for confirmation.</p></div>
      {cartItems.length ? <div className="restaurant-order-layout"><section className="restaurant-cart-list">{cartItems.map((item) => <article key={item.id} className="restaurant-cart-row"><img src={item.image} alt={item.name} /><div><small>{item.category}</small><h3>{item.name}</h3><p>{item.description}</p><strong>{formatPrice(item)}</strong></div><div className="restaurant-cart-controls"><button type="button" onClick={() => updateQty(item.id, -1)}>-</button><span>{item.qty}</span><button type="button" onClick={() => updateQty(item.id, 1)}>+</button><button type="button" className="remove" onClick={() => removeItem(item.id)}>Remove</button></div></article>)}</section><aside className="restaurant-order-summary"><h2>Order summary</h2><p>{cartItems.length} item type(s)</p><strong>R {total.toLocaleString("en-ZA")}</strong><a href={buildMailto({ email: contact.email, subject: `${brand} order enquiry`, body })}>Send order enquiry</a><button type="button" onClick={() => onNavigate("menu")}>Continue ordering</button></aside></div> : <div className="restaurant-empty-state"><h3>Your cart is empty</h3><p>Start from the menu and add dishes to your order enquiry.</p><button type="button" onClick={() => onNavigate("menu")}>View menu</button></div>}
    </main>
  );
}

function ContactPage({ brand, contact }) {
  const body = `Hello ${brand},\n\nI would like to contact the restaurant.\n\nMessage:\n\nThank you.`;
  return (
    <main className="restaurant-contact">
      <form className="restaurant-contact-form" action={buildMailto({ email: contact.email, subject: `${brand} contact enquiry`, body })} method="get"><span className="restaurant-kicker">Contact</span><h1>Send an enquiry</h1><input placeholder="Full name" /><input placeholder="Email address" /><input placeholder="Phone number" /><select><option>General enquiry</option><option>Reservation</option><option>Private event</option><option>Catering</option></select><textarea placeholder="How can we help?" /><button type="submit">Send enquiry</button></form>
      <div className="restaurant-contact-info"><h2>Visit us</h2><p><FaMapMarkerAlt /> {contact.address}</p><p>✉ <a href={`mailto:${contact.email}`}>{contact.email}</a></p><p>☎ <a href={`tel:${contact.phone}`}>{contact.phone}</a></p><iframe title="Restaurant location" src="https://www.google.com/maps?q=Johannesburg%20South%20Africa&output=embed" loading="lazy" /></div>
    </main>
  );
}

function Footer({ brand, content, contact, socialLinks, onNavigate }) {
  return (
    <footer className="restaurant-footer">
      <div className="restaurant-footer-main"><div><strong>{brand}</strong><p>{content.slogan}</p><RestaurantSocialLinks links={socialLinks} /></div><div><h4>Explore</h4>{["home", "menu", "reservations", "gallery", "contact"].map((page) => <button key={page} type="button" onClick={() => onNavigate(page)}>{PAGE_LABELS[page]}</button>)}</div><div><h4>Contact</h4><span>{contact.phone}</span><span>{contact.email}</span><span>{contact.address}</span></div><div><h4>Dining</h4>{toArray(content.tags).map((tag) => <span key={tag}>{tag}</span>)}</div></div>
      <div className="restaurant-footer-bottom"><span>© 2026 {brand}. All rights reserved.</span><span className="restaurant-powered-by">Powered by <a className="restaurant-ulterspace-link" href="https://ulterspace.co.za" target="_blank" rel="noreferrer"><img src={ulterspaceLogo} alt="Ulterspace" className="restaurant-ulterspace-logo" /> Ulterspace</a></span></div>
    </footer>
  );
}

export default function RestaurantRenderer({ settings, organization, templateKey, page, children }) {
  const fallback = getRestaurantFallback(templateKey);
  const contact = { ...(fallback.contact || {}), ...(settings?.contact || {}) };
  const organizationName = organization?.name || settings?.site_name || settings?.name;
  const brand = organizationName && !isGenericBrand(organizationName) ? organizationName : fallback.name;
  const socialLinks = { ...DEFAULT_SOCIAL_LINKS, ...(fallback.social_links || {}), ...(settings?.social_links || settings?.socialLinks || {}), ...(organization?.social_links || organization?.socialLinks || {}) };
  const [activePage, setActivePage] = useState(normalizePageKey(page || settings?.page || "home"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (nextPage) => { setActivePage(normalizePageKey(nextPage)); scrollToTop(); };
  const openItem = (item) => { setSelectedItem(item); setActivePage("item"); scrollToTop(); };
  const addToCart = (item) => setCartItems((current) => {
    const existing = current.find((entry) => entry.id === item.id);
    if (existing) return current.map((entry) => entry.id === item.id ? { ...entry, qty: Number(entry.qty || 1) + 1 } : entry);
    return [...current, { ...item, qty: 1 }];
  });
  const updateQty = (id, change) => setCartItems((current) => current.map((item) => item.id === id ? { ...item, qty: Math.max(1, Number(item.qty || 1) + change) } : item));
  const removeItem = (id) => setCartItems((current) => current.filter((item) => item.id !== id));

  const filteredMenu = useMemo(() => {
    const q = query.trim().toLowerCase();
    return toArray(fallback.menu).filter((item) => {
      const categoryMatch = category === "All" || item.category === category;
      const searchMatch = !q || [item.name, item.description, item.category, item.badge, item.dietary].some((value) => String(value || "").toLowerCase().includes(q));
      return categoryMatch && searchMatch;
    });
  }, [fallback.menu, query, category]);

  const relatedItems = useMemo(() => toArray(fallback.menu).filter((item) => item.id !== selectedItem?.id).slice(0, 3), [fallback.menu, selectedItem]);
  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.qty || 1), 0);
  const shellStyle = {
    "--restaurant-primary": fallback.palette?.[0] || "#111827",
    "--restaurant-accent": fallback.palette?.[1] || "#b45309",
    "--restaurant-surface": fallback.palette?.[2] || "#fff7ed",
    "--restaurant-text": fallback.palette?.[3] || "#111827",
    "--restaurant-secondary": fallback.palette?.[4] || "#f97316",
  };

  const renderPage = () => {
    if (activePage === "menu") return <MenuPage content={fallback} menuItems={filteredMenu} onOpenItem={openItem} onAddToCart={addToCart} query={query} setQuery={setQuery} category={category} setCategory={setCategory} />;
    if (activePage === "item") return <ItemPage item={selectedItem || toArray(fallback.menu)[0]} relatedItems={relatedItems} onAddToCart={addToCart} onOpenItem={openItem} onNavigate={navigate} contact={contact} brand={brand} />;
    if (activePage === "reservations") return <ReservationsPage brand={brand} contact={contact} content={fallback} />;
    if (activePage === "gallery") return <GalleryPage content={fallback} />;
    if (activePage === "story") return <StoryPage content={fallback} />;
    if (activePage === "contact") return <ContactPage brand={brand} contact={contact} />;
    if (activePage === "order") return <OrderPage cartItems={cartItems} updateQty={updateQty} removeItem={removeItem} onNavigate={navigate} contact={contact} brand={brand} />;
    return <><Hero content={fallback} onNavigate={navigate} /><Overview content={fallback} onNavigate={navigate} /><MenuPage content={fallback} menuItems={filteredMenu.slice(0, 4)} onOpenItem={openItem} onAddToCart={addToCart} query={query} setQuery={setQuery} category={category} setCategory={setCategory} /><GalleryPage content={fallback} /></>;
  };

  return (
    <div className={`restaurant-enterprise restaurant-enterprise--${fallback.template_key}`} style={shellStyle}>
      <Topbar content={fallback} contact={contact} />
      <Navbar brand={brand} slogan={fallback.slogan} socialLinks={socialLinks} activePage={activePage} onNavigate={navigate} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} cartCount={cartCount} />
      {renderPage()}
      {children}
      <Footer brand={brand} content={fallback} contact={contact} socialLinks={socialLinks} onNavigate={navigate} />
      <button type="button" className={`restaurant-scroll-top ${showScrollTop ? "is-visible" : ""}`} aria-label="Scroll to top" onClick={() => scrollToTop()}><FaChevronUp /></button>
    </div>
  );
}
