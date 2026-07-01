import { useEffect, useMemo, useState } from "react";
import {
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaEnvelope,
  FaExpand,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaMinus,
  FaPhoneAlt,
  FaPlus,
  FaSearch,
  FaShoppingBag,
  FaShoppingCart,
  FaTimes,
  FaTrash,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ulterspaceLogo from "../../../assets/logo.gif";
import {
  ECOMMERCE_DEFAULT_TEMPLATE,
  ECOMMERCE_MEDIA_PACKS,
  ECOMMERCE_PRESETS,
  ECOMMERCE_THEMES,
} from "./ecommercePresets";
import { normalizeEcommerceContent } from "./ecommerceFallbacks";
import "./ecommerce-shared.css";

const DEFAULT_PAGES = [
  { key: "home", label: "Home" },
  { key: "shop", label: "Shop" },
  { key: "collections", label: "Collections" },
  { key: "gallery", label: "Gallery" },
  { key: "about", label: "About" },
  { key: "contact", label: "Contact" },
];

const SOCIALS = [
  ["facebook", FaFacebookF, "https://facebook.com"],
  ["instagram", FaInstagram, "https://instagram.com"],
  ["x", FaXTwitter, "https://x.com"],
  ["youtube", FaYoutube, "https://youtube.com"],
  ["linkedin", FaLinkedinIn, "https://linkedin.com"],
  ["whatsapp", FaWhatsapp, "https://wa.me/27110000000"],
];

const getPageKey = (page) => {
  if (!page) return "home";
  if (typeof page === "string") return page;
  return page.template_page_key || page.slug || page.key || "home";
};

const toList = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value.split(/\r?\n|,/g).map((item) => item.trim()).filter(Boolean);
  }
  if (value && typeof value === "object") {
    const nested = value.items || value.list || value.values || value.entries || value.products || value.features;
    if (nested !== undefined) return toList(nested, fallback);
    return Object.values(value).filter(Boolean);
  }
  return Array.isArray(fallback) ? fallback : [];
};

const getSettingsValue = (settings, keys, fallback) => {
  for (const key of keys) {
    if (settings && settings[key] !== undefined && settings[key] !== null && settings[key] !== "") return settings[key];
  }
  return fallback;
};

const normalizeSocials = (settings, organization) => {
  const provided = settings?.social_links || settings?.socialLinks || organization?.social_links || {};
  return SOCIALS.map(([key, Icon, fallback]) => {
    const item = provided[key];
    const enabled = item?.enabled ?? Boolean(item?.url || item || key === "facebook" || key === "instagram" || key === "whatsapp");
    const url = typeof item === "string" ? item : item?.url || fallback;
    return { key, Icon, enabled, url };
  }).filter((item) => item.enabled);
};

const makeMailto = ({ content, cartItems, totalLabel }) => {
  const email = content.contact?.email || "orders@ecommerce.co.za";
  const subject = encodeURIComponent(`New order request - ${content.brandName}`);
  const lines = [
    `Hello ${content.brandName},`,
    "",
    "I would like to request the following items:",
    "",
    ...cartItems.map((item, index) => `${index + 1}. ${item.name} x${item.qty} - ${content.currency || "R"}${item.price}`),
    "",
    `Estimated total: ${totalLabel}`,
    "",
    "My details:",
    "Name:",
    "Phone:",
    "Delivery/collection preference:",
    "Notes:",
  ];
  return `mailto:${email}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
};

const priceNumber = (price) => {
  const parsed = Number(String(price || "0").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const getProductDiscountLabel = (product) =>
  product?.discount || product?.discountLabel || product?.discount_label || product?.sale || "";

const getProductComparePrice = (product) =>
  product?.compareAtPrice || product?.compare_at_price || product?.oldPrice || product?.wasPrice || product?.was_price || "";

const scrollToPageTop = (behavior = "smooth") => {
  if (typeof window === "undefined") return;

  const run = () => {
    window.scrollTo({ top: 0, left: 0, behavior });
  };

  if (typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(run);
    return;
  }

  run();
};

export default function EcommerceRenderer({ settings, organization, preset, page, sections, builderMode, previewMode, onNavigate, ...rest }) {
  const templateKey =
    preset?.template_key ||
    settings?.template_key ||
    settings?.selected_template_key ||
    ECOMMERCE_DEFAULT_TEMPLATE;

  const resolvedPreset = preset || ECOMMERCE_PRESETS[templateKey] || ECOMMERCE_PRESETS[ECOMMERCE_DEFAULT_TEMPLATE];
  const theme = resolvedPreset?.theme || ECOMMERCE_THEMES[templateKey] || ECOMMERCE_THEMES[ECOMMERCE_DEFAULT_TEMPLATE];
  const safeOrganization = organization || settings?.organization || {};
  const content = useMemo(
    () => normalizeEcommerceContent({ preset: resolvedPreset, settings, organization: safeOrganization }),
    [resolvedPreset, settings, safeOrganization],
  );

  const [activePage, setActivePage] = useState(getPageKey(page));
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [showTop, setShowTop] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [zoomIndex, setZoomIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => setActivePage(getPageKey(page)), [page]);
  useEffect(() => {
    setCart([]);
    setSelectedProduct(null);
    setProductSearch("");
  }, [templateKey]);
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 520);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mediaSlides = useMemo(() => {
    const settingsMedia = settings?.media || settings?.hero_media || settings?.heroMedia;
    const normalized = toList(settingsMedia, ECOMMERCE_MEDIA_PACKS[templateKey] || ECOMMERCE_MEDIA_PACKS[ECOMMERCE_DEFAULT_TEMPLATE]).map((item) => {
      if (typeof item === "string") return { type: "image", url: item, alt: content.brandName };
      return { type: item.type || "image", url: item.url || item.image || item.image_url || "", alt: item.alt || content.brandName };
    }).filter((item) => item.url);
    return normalized.length ? normalized : ECOMMERCE_MEDIA_PACKS[ECOMMERCE_DEFAULT_TEMPLATE];
  }, [settings, templateKey, content.brandName]);

  useEffect(() => {
    if (!mediaSlides.length) return undefined;
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % mediaSlides.length), 5200);
    return () => window.clearInterval(timer);
  }, [mediaSlides.length]);

  const socials = useMemo(() => normalizeSocials(settings, safeOrganization), [settings, safeOrganization]);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + priceNumber(item.price) * item.qty, 0);
  const totalLabel = `${content.currency || "R"}${cartTotal.toLocaleString("en-ZA")}`;
  const categories = ["All", ...new Set(content.products.map((item) => item.category).filter(Boolean))];
  const normalizedProductSearch = productSearch.trim().toLowerCase();
  const categoryProducts = selectedCategory === "All" ? content.products : content.products.filter((item) => item.category === selectedCategory);
  const visibleProducts = normalizedProductSearch
    ? categoryProducts.filter((item) => [
        item.name,
        item.category,
        item.description,
        item.details,
        item.sku,
        item.badge,
        item.discount,
        item.discountLabel,
        item.compareAtPrice,
        item.oldPrice,
        ...(toList(item.highlights)),
      ].filter(Boolean).join(" ").toLowerCase().includes(normalizedProductSearch))
    : categoryProducts;

  const cssVars = {
    "--ecommerce-primary": theme.primary,
    "--ecommerce-secondary": theme.secondary,
    "--ecommerce-accent": theme.accent,
    "--ecommerce-surface": theme.surface,
    "--ecommerce-text": theme.text,
    "--ecommerce-muted": theme.muted,
  };

  const handlePageChange = (key) => {
    setActivePage(key);
    setMenuOpen(false);
    if (key !== "product") setSelectedProduct(null);
    if (typeof onNavigate === "function") onNavigate(key);
    scrollToPageTop();
  };

  const openProductPage = (product) => {
    setSelectedProduct(product);
    setActivePage("product");
    setMenuOpen(false);
    if (typeof onNavigate === "function") onNavigate("product");
    scrollToPageTop();
  };

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) return items.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...items, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((items) => items
      .map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
      .filter((item) => item.qty > 0));
  };

  const removeItem = (id) => setCart((items) => items.filter((item) => item.id !== id));

  const renderPage = () => {
    if (activePage === "product" && selectedProduct) {
      return <ProductDetailsPage product={selectedProduct} content={content} allProducts={content.products} addToCart={addToCart} onShop={() => handlePageChange("shop")} onOpenProduct={openProductPage} />;
    }
    if (activePage === "cart") return <CartPage content={content} cart={cart} totalLabel={totalLabel} updateQty={updateQty} removeItem={removeItem} onShop={() => handlePageChange("shop")} />;
    if (activePage === "shop") return <ShopPage content={content} products={visibleProducts} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} productSearch={productSearch} setProductSearch={setProductSearch} addToCart={addToCart} onOpenProduct={openProductPage} cart={cart} cartTotal={cartTotal} totalLabel={totalLabel} updateQty={updateQty} removeItem={removeItem} />;
    if (activePage === "collections") return <CollectionsPage content={content} onShop={() => handlePageChange("shop")} />;
    if (activePage === "gallery") return <GalleryPage content={content} galleryIndex={galleryIndex} setGalleryIndex={setGalleryIndex} zoomIndex={zoomIndex} setZoomIndex={setZoomIndex} />;
    if (activePage === "about") return <AboutPage content={content} />;
    if (activePage === "contact") return <ContactPage content={content} cart={cart} totalLabel={totalLabel} />;
    return <HomePage content={content} mediaSlides={mediaSlides} heroIndex={heroIndex} setHeroIndex={setHeroIndex} addToCart={addToCart} onOpenProduct={openProductPage} products={content.products} onPageChange={handlePageChange} galleryIndex={galleryIndex} setGalleryIndex={setGalleryIndex} zoomIndex={zoomIndex} setZoomIndex={setZoomIndex} />;
  };

  return (
    <div className={`ecommerce-enterprise ecommerce-enterprise--${templateKey} ecommerce-style--${resolvedPreset.style || "store"}`} style={cssVars} {...rest}>
      <TopBar content={content} socials={socials} />
      <Navbar content={content} pages={DEFAULT_PAGES} activePage={activePage} onPageChange={handlePageChange} menuOpen={menuOpen} setMenuOpen={setMenuOpen} cartCount={cartCount} />
      {renderPage()}
      <Footer content={content} pages={DEFAULT_PAGES} onPageChange={handlePageChange} socials={socials} />
      <button type="button" className={`ecommerce-scroll-top ${showTop ? "is-visible" : ""}`} onClick={() => scrollToPageTop()} aria-label="Back to top"><FaChevronUp /></button>
    </div>
  );
}

function TopBar({ content, socials }) {
  return (
    <div className="ecommerce-topbar">
      <span>{content.topbar}</span>
      <div>
        <a href={`mailto:${content.contact?.email || "orders@ecommerce.co.za"}`}><FaEnvelope /> {content.contact?.email}</a>
        <a href={`tel:${content.contact?.phone || "+27110000000"}`}><FaPhoneAlt /> {content.contact?.phone}</a>
        <div className="ecommerce-socials">{socials.map(({ key, Icon, url }) => <a key={key} href={url} aria-label={key}><Icon /></a>)}</div>
      </div>
    </div>
  );
}

function Navbar({ content, pages, activePage, onPageChange, menuOpen, setMenuOpen, cartCount }) {
  return (
    <header className="ecommerce-navbar">
      <button type="button" className="ecommerce-brand" onClick={() => onPageChange("home")}>
        <span className="ecommerce-brand-mark"><FaShoppingBag /></span>
        <span><strong>{content.brandName}</strong><small>{content.brandLabel}</small></span>
      </button>
      <nav className={`ecommerce-nav-links ${menuOpen ? "is-open" : ""}`}>{pages.map((item) => <button key={item.key} type="button" className={activePage === item.key ? "active" : ""} onClick={() => onPageChange(item.key)}>{item.label}</button>)}</nav>
      <div className="ecommerce-navbar-actions">
        <button type="button" className={`ecommerce-cart-nav ${activePage === "cart" ? "active" : ""}`} onClick={() => onPageChange("cart")} aria-label="Open cart"><FaShoppingCart /><span>Cart</span><em>{cartCount}</em></button>
        <button type="button" className={`ecommerce-menu-toggle ${menuOpen ? "is-open" : ""}`} onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu"><span /><span /><span /></button>
      </div>
    </header>
  );
}

function HomePage({ content, mediaSlides, heroIndex, setHeroIndex, addToCart, onOpenProduct, products, onPageChange, galleryIndex, setGalleryIndex, zoomIndex, setZoomIndex }) {
  const activeSlide = mediaSlides[heroIndex] || mediaSlides[0];
  return (
    <main>
      <section className="ecommerce-hero">
        <div className="ecommerce-hero-copy">
          <span className="ecommerce-kicker">{content.role}</span>
          <h1>{content.headline}</h1>
          <p>{content.subtitle}</p>
          <div className="ecommerce-hero-actions">
            <button type="button" onClick={() => onPageChange("shop")}>{content.primaryAction || "Shop Now"}</button>
            <button type="button" className="ghost" onClick={() => onPageChange("collections")}>{content.secondaryAction || "View Collections"}</button>
          </div>
          <div className="ecommerce-hero-audience"><span>Popular for</span>{toList(content.audience).map((item) => <strong key={item}>{item}</strong>)}</div>
        </div>
        <div className="ecommerce-hero-media">
          {activeSlide?.type === "video" ? <video src={activeSlide.url} autoPlay muted loop playsInline /> : <img src={activeSlide?.url} alt={activeSlide?.alt || content.brandName} />}
          <div className="ecommerce-hero-dots">{mediaSlides.map((_, index) => <button key={index} type="button" className={index === heroIndex ? "active" : ""} onClick={() => setHeroIndex(index)} aria-label={`Go to slide ${index + 1}`} />)}</div>
        </div>
        <div className="ecommerce-proof">{toList(content.proof).map((item, index) => <article key={`${item.value}-${index}`}><strong>{item.value}</strong><span>{item.label}</span></article>)}</div>
      </section>
      <CategoryStrip categories={content.categories} onShop={onPageChange} />
      <FeaturedProducts content={content} products={products.slice(0, 4)} addToCart={addToCart} onOpenProduct={onOpenProduct} />
      <CollectionsPage content={content} compact onShop={() => onPageChange("shop")} />
      <GalleryPage content={content} compact galleryIndex={galleryIndex} setGalleryIndex={setGalleryIndex} zoomIndex={zoomIndex} setZoomIndex={setZoomIndex} />
    </main>
  );
}

function CategoryStrip({ categories, onShop }) {
  return <section className="ecommerce-category-strip">{toList(categories).map((item) => <button key={item} type="button" onClick={() => onShop("shop")}>{item}</button>)}</section>;
}

function FeaturedProducts({ content, products, addToCart, onOpenProduct }) {
  return (
    <section className="ecommerce-section ecommerce-featured">
      <div className="ecommerce-section-heading"><span className="ecommerce-kicker">Featured products</span><h2>Ready-to-shop products with clean ecommerce cards.</h2></div>
      <div className="ecommerce-product-grid">{products.map((product) => <ProductCard key={product.id} product={product} currency={content.currency} addToCart={addToCart} onOpenProduct={onOpenProduct} />)}</div>
    </section>
  );
}

function ShopPage({ content, products, categories, selectedCategory, setSelectedCategory, productSearch, setProductSearch, addToCart, onOpenProduct, cart, totalLabel, updateQty, removeItem }) {
  return (
    <main>
      <PageHeader content={content} title="Shop products" subtitle="Browse categories, add products to cart and send an order request directly to the store email." />
      <section className="ecommerce-section ecommerce-shop-layout">
        <div>
          <div className="ecommerce-shop-search-row">
            <label className="ecommerce-search-box">
              <FaSearch />
              <input
                type="search"
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                placeholder="Search products, categories or SKU"
                aria-label="Search products"
              />
              {productSearch ? (
                <button type="button" onClick={() => setProductSearch("")} aria-label="Clear search">
                  <FaTimes />
                </button>
              ) : null}
            </label>
          </div>

          <div className="ecommerce-filter-row">{categories.map((category) => <button key={category} type="button" className={selectedCategory === category ? "active" : ""} onClick={() => setSelectedCategory(category)}>{category}</button>)}</div>

          {products.length ? (
            <div className="ecommerce-product-grid">{products.map((product) => <ProductCard key={product.id} product={product} currency={content.currency} addToCart={addToCart} onOpenProduct={onOpenProduct} />)}</div>
          ) : (
            <div className="ecommerce-search-empty">
              <FaSearch />
              <h3>No products found</h3>
              <p>Try a different product name, category or SKU.</p>
              <button type="button" onClick={() => setProductSearch("")}>Clear search</button>
            </div>
          )}
        </div>
        <CartPanel content={content} cart={cart} totalLabel={totalLabel} updateQty={updateQty} removeItem={removeItem} />
      </section>
    </main>
  );
}

function ProductCard({ product, currency, addToCart, onOpenProduct }) {
  const openProduct = () => {
    if (typeof onOpenProduct === "function") onOpenProduct(product);
  };

  return (
    <article className="ecommerce-product-card" role="button" tabIndex={0} onClick={openProduct} onKeyDown={(event) => { if (event.key === "Enter") openProduct(); }} aria-label={`Open ${product.name} product page`}>
      <div className="ecommerce-product-image">
        <img src={product.image} alt={product.name} />
        <ProductBadges product={product} />
      </div>
      <div className="ecommerce-product-body">
        <small>{product.category}</small>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div>
          <ProductPrice product={product} currency={currency} />
          <button type="button" onClick={(event) => { event.stopPropagation(); addToCart(product); }}><FaPlus /> Add</button>
        </div>
      </div>
    </article>
  );
}

function ProductBadges({ product }) {
  const discount = getProductDiscountLabel(product);

  return (
    <div className="ecommerce-product-badges">
      {product.badge ? <span>{product.badge}</span> : null}
      {discount ? <em>{discount}</em> : null}
    </div>
  );
}

function ProductPrice({ product, currency, className = "" }) {
  const comparePrice = getProductComparePrice(product);
  const discount = getProductDiscountLabel(product);

  return (
    <div className={`ecommerce-price-block ${className}`.trim()}>
      <strong>{currency || "R"}{product.price}</strong>
      {comparePrice ? <span>{currency || "R"}{comparePrice}</span> : null}
      {discount ? <small>{discount}</small> : null}
    </div>
  );
}

function ProductDetailsPage({ product, content, allProducts, addToCart, onShop, onOpenProduct }) {
  const highlights = toList(product.highlights).length
    ? toList(product.highlights)
    : [product.delivery || "Delivery or collection available", product.stock || "Available on request", "Email order support"];

  const relatedProducts = toList(allProducts)
    .filter((item) => item.id !== product.id)
    .sort((a, b) => (a.category === product.category ? -1 : 1) - (b.category === product.category ? -1 : 1))
    .slice(0, 4);

  return (
    <main className="ecommerce-product-page">
      <section className="ecommerce-product-detail-section">
        <div className="ecommerce-product-breadcrumbs">
          <button type="button" onClick={onShop}>Shop</button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <strong>{product.name}</strong>
        </div>

        <div className="ecommerce-product-detail-layout">
          <div className="ecommerce-product-detail-media">
            <img src={product.image} alt={product.name} />
            <ProductBadges product={product} />
          </div>

          <div className="ecommerce-product-detail-copy">
            <small>{product.category}</small>
            <h1>{product.name}</h1>
            <ProductPrice product={product} currency={content.currency} className="ecommerce-product-detail-price" />
            <p>{product.details || product.description}</p>

            <div className="ecommerce-product-detail-meta">
              <span><b>SKU</b>{product.sku || product.id}</span>
              <span><b>Availability</b>{product.stock || "Available on request"}</span>
              <span><b>Delivery</b>{product.delivery || "Delivery or collection available"}</span>
            </div>

            <div className="ecommerce-product-detail-highlights">
              {highlights.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
            </div>

            <div className="ecommerce-product-detail-actions">
              <button type="button" onClick={() => addToCart(product)}><FaPlus /> Add to cart</button>
              <a href={makeMailto({ content, cartItems: [{ ...product, qty: 1 }], totalLabel: `${content.currency || "R"}${product.price}` })}><FaEnvelope /> Enquire about this product</a>
            </div>

            <div className="ecommerce-product-detail-trust">
              <article><strong>Secure order request</strong><span>Cart and enquiry details are sent to the store email.</span></article>
              <article><strong>Clear fulfilment</strong><span>Customers can confirm delivery, collection or availability.</span></article>
            </div>
          </div>
        </div>
      </section>

      <section className="ecommerce-section ecommerce-related-products">
        <div className="ecommerce-section-heading"><span className="ecommerce-kicker">Related products</span><h2>Similar products customers may also like.</h2></div>
        <div className="ecommerce-product-grid">
          {relatedProducts.map((item) => <ProductCard key={item.id} product={item} currency={content.currency} addToCart={addToCart} onOpenProduct={onOpenProduct} />)}
        </div>
      </section>
    </main>
  );
}

function CartPanel({ content, cart, totalLabel, updateQty, removeItem }) {
  const href = makeMailto({ content, cartItems: cart, totalLabel });
  return (
    <aside className="ecommerce-cart-panel">
      <h3>Order cart</h3>
      <p>Add products, then send the cart to the store email.</p>
      {cart.length === 0 ? <div className="ecommerce-cart-empty">Your cart is empty.</div> : <ul>{cart.map((item) => <li key={item.id}><div><strong>{item.name}</strong><small>{content.currency || "R"}{item.price} × {item.qty}</small></div><div className="ecommerce-qty"><button type="button" onClick={() => updateQty(item.id, -1)}><FaMinus /></button><span>{item.qty}</span><button type="button" onClick={() => updateQty(item.id, 1)}><FaPlus /></button></div><button type="button" className="ecommerce-trash" onClick={() => removeItem(item.id)}><FaTrash /></button></li>)}</ul>}
      <strong className="ecommerce-cart-total">Total: {totalLabel}</strong>
      <a className={`ecommerce-order-email ${cart.length ? "" : "is-disabled"}`} href={href}><FaEnvelope /> Send order to email</a>
      <small>Recipient: {content.contact?.email}</small>
    </aside>
  );
}

function CartPage({ content, cart, totalLabel, updateQty, removeItem, onShop }) {
  const href = makeMailto({ content, cartItems: cart, totalLabel });
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <main className="ecommerce-cart-page">
      <PageHeader content={content} title="Order cart" subtitle="Review selected products, update quantities and send the order request directly to the store email." />

      <section className="ecommerce-section ecommerce-cart-page-layout">
        <div className="ecommerce-cart-page-list">
          <div className="ecommerce-section-heading">
            <span className="ecommerce-kicker">Selected products</span>
            <h2>{cart.length ? `${itemCount} item${itemCount === 1 ? "" : "s"} ready for checkout` : "Your cart is empty"}</h2>
          </div>

          {cart.length === 0 ? (
            <div className="ecommerce-cart-page-empty">
              <FaShoppingCart />
              <h3>No products added yet.</h3>
              <p>Browse the shop and add products before sending an order request.</p>
              <button type="button" onClick={onShop}>Continue shopping</button>
            </div>
          ) : (
            <div className="ecommerce-cart-page-items">
              {cart.map((item) => {
                const subtotal = `${content.currency || "R"}${(priceNumber(item.price) * item.qty).toLocaleString("en-ZA")}`;
                return (
                  <article className="ecommerce-cart-page-item" key={item.id}>
                    <div className="ecommerce-cart-page-image">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="ecommerce-cart-page-copy">
                      <small>{item.category}</small>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <span>{content.currency || "R"}{item.price} each</span>
                    </div>

                    <div className="ecommerce-cart-page-controls">
                      <div className="ecommerce-qty">
                        <button type="button" onClick={() => updateQty(item.id, -1)} aria-label={`Decrease ${item.name} quantity`}><FaMinus /></button>
                        <span>{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.id, 1)} aria-label={`Increase ${item.name} quantity`}><FaPlus /></button>
                      </div>
                      <strong>{subtotal}</strong>
                      <button type="button" className="ecommerce-cart-page-remove" onClick={() => removeItem(item.id)}><FaTrash /> Remove</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="ecommerce-cart-page-summary">
          <span className="ecommerce-kicker">Checkout</span>
          <h3>Order summary</h3>
          <div>
            <span>Items</span>
            <strong>{itemCount}</strong>
          </div>
          <div>
            <span>Total</span>
            <strong>{totalLabel}</strong>
          </div>
          <a className={`ecommerce-order-email ${cart.length ? "" : "is-disabled"}`} href={href}><FaEnvelope /> Send order to email</a>
          <button type="button" onClick={onShop}>Continue shopping</button>
          <small>Recipient: {content.contact?.email}</small>
        </aside>
      </section>
    </main>
  );
}

function CollectionsPage({ content, compact, onShop }) {
  return (
    <section className={`ecommerce-section ecommerce-collections ${compact ? "is-compact" : ""}`}>
      {!compact && <PageTitle eyebrow="Collections" title="Curated ecommerce shopping journeys" />}
      <div className="ecommerce-section-heading"><span className="ecommerce-kicker">Collections</span><h2>Make discovery easier with clear product collections.</h2></div>
      <div className="ecommerce-collection-grid">{toList(content.collections).map((item, index) => <article key={`${item.title || item}-${index}`}><span>0{index + 1}</span><h3>{item.title || item}</h3><p>{item.description || "Curated products for faster shopping."}</p><button type="button" onClick={onShop}>Shop collection</button></article>)}</div>
    </section>
  );
}

function GalleryPage({ content, compact, galleryIndex, setGalleryIndex, zoomIndex, setZoomIndex }) {
  const gallery = toList(content.gallery);
  const active = gallery[galleryIndex] || gallery[0];
  const go = (delta) => setGalleryIndex((index) => (index + delta + gallery.length) % gallery.length);
  const goZoom = (delta) => setZoomIndex((index) => (index + delta + gallery.length) % gallery.length);
  return (
    <section className={`ecommerce-section ecommerce-gallery-section ${compact ? "is-compact" : ""}`}>
      <div className="ecommerce-section-heading"><span className="ecommerce-kicker">Gallery</span><h2>Enterprise product visuals with chevrons, thumbnails and zoom.</h2></div>
      <div className="ecommerce-gallery-board">
        <button type="button" className="ecommerce-gallery-arrow left" onClick={() => go(-1)}><FaChevronLeft /></button>
        <button type="button" className="ecommerce-gallery-main" onClick={() => setZoomIndex(galleryIndex)}><img src={active?.image} alt={active?.title} /><span><FaExpand /> Zoom</span><div><strong>{active?.title}</strong><small>{active?.caption}</small></div></button>
        <button type="button" className="ecommerce-gallery-arrow right" onClick={() => go(1)}><FaChevronRight /></button>
      </div>
      <div className="ecommerce-gallery-thumbs">{gallery.map((item, index) => <button key={`${item.title}-${index}`} type="button" className={index === galleryIndex ? "active" : ""} onClick={() => setGalleryIndex(index)}><img src={item.image} alt={item.title} /></button>)}</div>
      {zoomIndex !== null && <div className="ecommerce-lightbox" role="dialog" aria-modal="true"><button type="button" className="ecommerce-lightbox-close" onClick={() => setZoomIndex(null)}><FaTimes /></button><button type="button" className="ecommerce-lightbox-arrow left" onClick={() => goZoom(-1)}><FaChevronLeft /></button><img src={gallery[zoomIndex]?.image} alt={gallery[zoomIndex]?.title} /><button type="button" className="ecommerce-lightbox-arrow right" onClick={() => goZoom(1)}><FaChevronRight /></button><div>{zoomIndex + 1} / {gallery.length} · {gallery[zoomIndex]?.title}</div></div>}
    </section>
  );
}

function AboutPage({ content }) {
  return (
    <main>
      <PageHeader content={content} title={`About ${content.brandName}`} subtitle={content.aboutIntro || content.subtitle} />
      <section className="ecommerce-section ecommerce-about-grid">
        <div><span className="ecommerce-kicker">Why shop here</span><h2>{content.aboutHeadline || `${content.brandName} is built for smooth product discovery and easy ordering.`}</h2><p>{content.aboutIntro || content.subtitle}</p></div>
        <div>{toList(content.features).map((item) => <article key={item}><FaShoppingBag /><span>{item}</span></article>)}</div>
      </section>
      <section className="ecommerce-section ecommerce-mission-vision">
        <article><span className="ecommerce-kicker">Mission</span><h3>What this store is built to do</h3><p>{content.mission || `To help customers shop ${content.brandName} products with clear details, simple ordering and trusted support.`}</p></article>
        <article><span className="ecommerce-kicker">Vision</span><h3>Where the brand is going</h3><p>{content.vision || `To become a trusted ecommerce destination with excellent products, smooth discovery and reliable service.`}</p></article>
      </section>
      <section className="ecommerce-section ecommerce-testimonials">{toList(content.testimonials).map((item, index) => <article key={index}><p>“{item.quote || item}”</p><strong>{item.name || "Customer"}</strong></article>)}</section>
    </main>
  );
}

function ContactPage({ content, cart, totalLabel }) {
  const href = makeMailto({ content, cartItems: cart, totalLabel });
  return <main><PageHeader content={content} title="Contact and order support" subtitle="Customers can ask questions, request stock confirmation or send the current cart to your email." /><section className="ecommerce-contact"><div><span className="ecommerce-kicker">Store details</span><h2>Need help choosing products?</h2><p><FaEnvelope /><a href={`mailto:${content.contact?.email}`}>{content.contact?.email}</a></p><p><FaPhoneAlt /><a href={`tel:${content.contact?.phone}`}>{content.contact?.phone}</a></p><p><FaMapMarkerAlt />{content.contact?.address}</p><a className="ecommerce-order-email" href={href}><FaEnvelope /> Send current cart</a></div><form className="ecommerce-contact-form" onSubmit={(e) => e.preventDefault()}><input placeholder="Full name" /><input placeholder="Email or phone" /><select><option>Product enquiry</option><option>Delivery question</option><option>Bulk order</option><option>Return or support</option></select><textarea placeholder="Tell us what you need" /><button type="submit">Submit enquiry</button></form></section></main>;
}

function PageHeader({ content, title, subtitle }) {
  const image = content.gallery?.[0]?.image;
  return <header className="ecommerce-page-header" style={{ backgroundImage: `linear-gradient(90deg, rgba(2,6,23,.86), rgba(2,6,23,.34)), url(${image})` }}><span className="ecommerce-kicker">{content.brandName}</span><h1>{title}</h1><p>{subtitle}</p></header>;
}

function PageTitle({ eyebrow, title }) {
  return <div className="ecommerce-page-title"><span className="ecommerce-kicker">{eyebrow}</span><h1>{title}</h1></div>;
}

function Footer({ content, pages, onPageChange, socials }) {
  return (
    <footer className="ecommerce-footer">
      <div className="ecommerce-footer-main"><div><strong>{content.brandName}</strong><p>{content.subtitle}</p><div className="ecommerce-socials">{socials.map(({ key, Icon, url }) => <a key={key} href={url} aria-label={key}><Icon /></a>)}</div></div><div><h4>Shop</h4>{toList(content.categories).slice(0, 5).map((item) => <button key={item} type="button" onClick={() => onPageChange("shop")}>{item}</button>)}</div><div><h4>Pages</h4>{pages.map((item) => <button key={item.key} type="button" onClick={() => onPageChange(item.key)}>{item.label}</button>)}</div><div><h4>Contact</h4><span>{content.contact?.email}</span><span>{content.contact?.phone}</span><span>{content.contact?.address}</span></div></div>
      <div className="ecommerce-footer-bottom"><span>© {new Date().getFullYear()} {content.brandName}. All rights reserved.</span><a className="ecommerce-ulterspace-link" href="https://ulterspace.co.za"><span>Powered by</span><img src={ulterspaceLogo} alt="Ulterspace" className="ecommerce-ulterspace-logo" /><strong>Ulterspace</strong></a></div>
    </footer>
  );
}
