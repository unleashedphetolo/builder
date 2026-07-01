import { ECOMMERCE_DEFAULT_TEMPLATE, ECOMMERCE_PRESETS } from "./ecommercePresets";

const toList = (value, fallback = []) => {
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null && item !== "");
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (value && typeof value === "object") {
    const nested = value.items || value.list || value.values || value.entries || value.products || value.features;
    if (nested !== undefined) return toList(nested, fallback);
    return Object.values(value).filter((item) => item !== undefined && item !== null && item !== "");
  }
  return Array.isArray(fallback) ? fallback : [];
};

const normalizeProducts = (value, fallback = []) =>
  toList(value, fallback).map((item, index) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return {
        id: item.id || item.slug || `${item.name || item.title || "product"}-${index}`,
        name: item.name || item.title || `Product ${index + 1}`,
        price: item.price || item.amount || item.cost || "Quote",
        category: item.category || item.type || "Products",
        description: item.description || item.desc || item.text || "Add this item to the cart.",
        badge: item.badge || item.label || "New",
        discount: item.discount || item.discountLabel || item.discount_label || item.sale || "",
        compareAtPrice: item.compareAtPrice || item.compare_at_price || item.oldPrice || item.wasPrice || item.was_price || "",
        image: item.image || item.image_url || item.url || "",
        sku: item.sku || item.code || item.product_code || `SKU-${index + 1}`,
        stock: item.stock || item.availability || "Available on request",
        delivery: item.delivery || item.shipping || "Delivery or collection available",
        details: item.details || item.longDescription || item.long_description || item.description || item.desc || item.text || "Product details available on request.",
        highlights: toList(item.highlights || item.features || item.specs, []),
      };
    }

    return {
      id: `${String(item || "product")}-${index}`,
      name: String(item || `Product ${index + 1}`),
      price: "Quote",
      category: "Products",
      description: "Add this item to the cart.",
      badge: "New",
      image: "",
    };
  });

const normalizeGallery = (value, fallback = []) =>
  toList(value, fallback).map((item, index) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return {
        title: item.title || item.name || `Gallery ${index + 1}`,
        caption: item.caption || item.description || item.text || "Store image",
        image: item.image || item.image_url || item.url || "",
      };
    }
    return { title: `Gallery ${index + 1}`, caption: "Store image", image: String(item || "") };
  });

const normalizeProof = (value, fallback = []) =>
  toList(value, fallback).map((item) => {
    if (Array.isArray(item)) return { value: item[0] || "", label: item[1] || "" };
    if (item && typeof item === "object") {
      return {
        value: item.value || item.number || item.stat || item.title || "",
        label: item.label || item.text || item.description || "",
      };
    }
    const parts = String(item || "").split(":");
    return { value: parts[0]?.trim() || "", label: parts.slice(1).join(":").trim() || "Metric" };
  });


const GENERIC_ECOMMERCE_FEATURES = [
  "Responsive storefront navigation",
  "Product catalogue with clear categories",
  "Cart icon with live count",
  "Email order/quote checkout",
  "Enterprise gallery with chevrons and zoom",
  "Mobile-first product cards",
  "Trust badges and shipping messages",
  "Contact and store enquiry form",
];

const REAL_ECOMMERCE_COPY = {
  "commerce-luxury-fashion-v1": {
    brandName: "Maison Mode",
    brandLabel: "Luxury Fashion House",
    mission: "To make premium wardrobe pieces easy to discover, compare and order through a refined digital boutique experience.",
    vision: "To become a trusted online destination for timeless fashion, curated collections and confident everyday styling.",
    aboutHeadline: "Maison Mode curates quiet-luxury fashion with a boutique shopping experience.",
    aboutIntro: "This template is designed for fashion brands that need editorial storytelling, collection-led browsing, size-conscious product detail pages and a premium order flow.",
    features: [
      "Editorial new-arrival launches",
      "Size, colour and material guidance",
      "Lookbook-style collection discovery",
      "Premium product detail storytelling",
      "Delivery and return confidence messages",
      "Accessory upsell-ready product cards",
      "Boutique enquiry and order support",
      "Luxury gallery with zoom preview",
    ],
  },
  "commerce-electronics-v1": {
    brandName: "VoltHub Electronics",
    brandLabel: "Gadgets · Devices · Accessories",
    mission: "To help customers find reliable electronics quickly with clear categories, useful product details and simple order requests.",
    vision: "To become a trusted online tech store for phones, laptops, gaming gear, accessories and smart-home products.",
    aboutHeadline: "VoltHub Electronics is built for fast product comparison and confident tech buying.",
    aboutIntro: "This template works for electronics stores that need product specs, badges, category filters, cart requests and clear support paths for warranty, delivery and stock checks.",
    features: [
      "Device categories for phones and laptops",
      "Specification-focused product detail views",
      "Deal badges and featured bundles",
      "Warranty and dispatch messaging",
      "Accessory-ready cart ordering",
      "Stock enquiry and support form",
      "Product gallery for launches and deals",
      "Email checkout for high-value tech orders",
    ],
  },
  "commerce-grocery-v1": {
    brandName: "FreshCart Market",
    brandLabel: "Online Grocery & Fresh Produce",
    mission: "To make weekly grocery shopping simple, organised and convenient for households and local businesses.",
    vision: "To become the easiest local online market for fresh produce, pantry items and repeat household orders.",
    aboutHeadline: "FreshCart Market brings everyday grocery essentials into a clean online shopping flow.",
    aboutIntro: "This template is made for grocery shops, fresh produce sellers and convenience stores that need category browsing, daily deals and quick cart-to-email ordering.",
    features: [
      "Fresh produce and pantry categories",
      "Weekly deal and bundle sections",
      "Quick add-to-cart grocery cards",
      "Delivery or collection order notes",
      "Bulk household order support",
      "Clear price and availability display",
      "Store enquiry form for substitutions",
      "Fresh visuals with zoom gallery",
    ],
  },
  "commerce-furniture-v1": {
    brandName: "CasaNest Living",
    brandLabel: "Furniture & Home Interiors",
    mission: "To help customers choose beautiful furniture with room-focused collections, product visuals and easy quote requests.",
    vision: "To become a trusted online showroom for modern homes, apartments and interior projects.",
    aboutHeadline: "CasaNest Living turns furniture browsing into a polished digital showroom.",
    aboutIntro: "This template is ideal for furniture stores that need large product imagery, collection storytelling, quote-led purchases and delivery/install enquiry support.",
    features: [
      "Room-based furniture collections",
      "Large visual product cards",
      "Material and finish detail support",
      "Quote-ready cart for bulky items",
      "Delivery and assembly messaging",
      "Gallery for styled room inspiration",
      "Customer enquiry form for measurements",
      "Premium showroom-style navigation",
    ],
  },
  "commerce-beauty-v1": {
    brandName: "GlowLab Beauty",
    brandLabel: "Skincare · Makeup · Wellness",
    mission: "To present beauty products in a clean, trustworthy and easy-to-shop online boutique.",
    vision: "To become a go-to beauty store for curated skincare, makeup and self-care collections.",
    aboutHeadline: "GlowLab Beauty is designed for product trust, routines and visual discovery.",
    aboutIntro: "This template suits beauty boutiques that need routine-based collections, ingredient-friendly product detail pages, customer trust sections and quick cart requests.",
    features: [
      "Skincare and makeup category paths",
      "Routine-based collection discovery",
      "Ingredient and benefit detail support",
      "Beauty bundle order requests",
      "Soft premium product gallery",
      "Customer review-ready sections",
      "Mobile-first product cards",
      "Enquiry form for product recommendations",
    ],
  },
  "commerce-sneakers-v1": {
    brandName: "SneakerVault",
    brandLabel: "Sneakers & Streetwear Drops",
    mission: "To make limited sneakers and streetwear drops easy to browse, reserve and order.",
    vision: "To become a high-energy storefront for sneaker releases, streetwear collections and youth culture brands.",
    aboutHeadline: "SneakerVault is built for drops, hype products and fast mobile shopping.",
    aboutIntro: "This template is made for sneaker stores that need bold visuals, release categories, size-aware product detail views and a quick reserve/cart flow.",
    features: [
      "Drop-focused product launches",
      "Sneaker size and colour detail support",
      "Streetwear collection cards",
      "Reserve-by-email cart checkout",
      "Bold gallery with zoom preview",
      "Featured deal and limited badges",
      "Mobile-first shopping experience",
      "Customer enquiry support for sizes",
    ],
  },
  "commerce-auto-parts-v1": {
    brandName: "MotoParts Pro",
    brandLabel: "Auto Parts & Workshop Supplies",
    mission: "To help customers and workshops find the right parts faster with clear categories and quote-ready ordering.",
    vision: "To become a reliable online parts counter for everyday drivers, mechanics and fleet operators.",
    aboutHeadline: "MotoParts Pro gives auto parts businesses a practical ecommerce counter online.",
    aboutIntro: "This template is recommended for parts stores that need fitment enquiries, product categories, part detail views and email quote checkout for stock confirmation.",
    features: [
      "Parts categories for fast lookup",
      "Fitment and compatibility enquiry support",
      "Workshop-ready bulk quote cart",
      "Clear price and stock request flow",
      "Product detail pages for part notes",
      "Delivery or collection messaging",
      "Technical gallery for parts and workshop",
      "Mobile-friendly counter-style ordering",
    ],
  },
  "commerce-baby-kids-v1": {
    brandName: "LittleNest Kids",
    brandLabel: "Baby Essentials & Kids Store",
    mission: "To make baby and kids shopping gentle, clear and reassuring for parents and caregivers.",
    vision: "To become a trusted online kids store for essentials, gifts, nursery items and everyday family needs.",
    aboutHeadline: "LittleNest Kids creates a warm ecommerce experience for parents and gift buyers.",
    aboutIntro: "This template is designed for baby stores that need soft visuals, age-based collections, trustworthy product details and simple order enquiries.",
    features: [
      "Baby essentials and gift categories",
      "Age-stage collection discovery",
      "Soft product visuals and trust layout",
      "Parent-friendly product detail views",
      "Delivery and gift enquiry support",
      "Bundle-ready cart ordering",
      "Safe, friendly mobile shopping",
      "Gallery for nursery and lifestyle products",
    ],
  },
  "commerce-books-stationery-v1": {
    brandName: "PageCraft Books",
    brandLabel: "Books · Stationery · Study Supplies",
    mission: "To help learners, readers and offices order books and stationery through a simple organised storefront.",
    vision: "To become a reliable online shop for study packs, school stationery, books and office essentials.",
    aboutHeadline: "PageCraft Books is built for organised book and stationery shopping.",
    aboutIntro: "This template supports bookstores and stationery suppliers with category browsing, study pack collections, quote requests and product detail views.",
    features: [
      "Books and stationery categories",
      "School pack and office bundle support",
      "ISBN or item enquiry flow",
      "Clear product detail views",
      "Bulk quote cart for schools and offices",
      "Collection cards for study supplies",
      "Delivery and collection order notes",
      "Gallery for shelves, packs and displays",
    ],
  },
  "commerce-digital-products-v1": {
    brandName: "SkillStack Digital",
    brandLabel: "Courses · Templates · Downloads",
    mission: "To help creators sell digital products with clear benefits, preview sections and simple order requests.",
    vision: "To become a trusted marketplace-style storefront for downloadable tools, learning resources and digital bundles.",
    aboutHeadline: "SkillStack Digital turns courses, templates and downloads into a premium storefront.",
    aboutIntro: "This template is ideal for selling digital products where customers need product outcomes, previews, access notes and a simple checkout/enquiry path.",
    features: [
      "Digital course and template categories",
      "Outcome-focused product detail views",
      "Preview gallery for digital assets",
      "Bundle and licence enquiry support",
      "Instant-access messaging placeholders",
      "Creator-friendly collection sections",
      "Email checkout for custom packages",
      "Responsive SaaS-style storefront design",
    ],
  },
  "commerce-perfume-v1": {
    brandName: "Aurevia Fragrance",
    brandLabel: "Premium Fragrances · Discovery Sets",
    mission: "To make premium fragrances easy to discover, compare and order with clear scent notes, discount offers and gift-ready product pages.",
    vision: "To become a trusted online fragrance boutique for signature perfumes, discovery sets and elegant gift boxes.",
    aboutHeadline: "Aurevia Fragrance House is built for elegant fragrance discovery and simple ordering.",
    aboutIntro: "This recommended perfume template is ideal for fragrance boutiques that need scent storytelling, 20% off promotional badges, discovery sets, related products and email order checkout.",
    features: [
      "Women, men and unisex fragrance categories",
      "20% off promotional badges",
      "Compare-at pricing for offers",
      "Product detail pages with scent notes",
      "Related perfume recommendations",
      "Discovery set and gift-box collections",
      "Premium gallery with zoom preview",
      "Cart-to-email ordering support",
    ],
  },
  "commerce-spectacles-v1": {
    brandName: "Lensora Spectacles",
    brandLabel: "Prescription Frames · Sunglasses",
    mission: "To make stylish eyewear easier to browse, compare and order with clear frame details, lens options and simple quote-ready checkout.",
    vision: "To become a trusted online optical storefront for everyday spectacles, office eyewear, reading glasses and premium sunglasses.",
    aboutHeadline: "Lensora Spectacles Store is built for clear eyewear discovery and professional optical ordering.",
    aboutIntro: "This recommended spectacles template is ideal for optical stores that need frame categories, lens package descriptions, 20% off promotional badges, related products and email order checkout.",
    features: [
      "Prescription frame and sunglasses categories",
      "20% off promotional badges",
      "Compare-at pricing for offers",
      "Product detail pages with lens and frame notes",
      "Related eyewear recommendations",
      "Blue-light and reading-glasses collections",
      "Premium gallery with zoom preview",
      "Cart-to-email ordering support",
    ],
  },
};

const isGenericPreviewText = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return !normalized || [
    "website preview",
    "live template preview",
    "template preview",
    "site preview",
    "ecommerce store",
    "online store",
  ].includes(normalized);
};

const isGenericFeatureList = (items) => {
  const normalized = toList(items).map((item) => String(item).trim().toLowerCase());
  const generic = GENERIC_ECOMMERCE_FEATURES.map((item) => item.toLowerCase());
  return normalized.length === generic.length && normalized.every((item, index) => item === generic[index]);
};

export const normalizeEcommerceContent = ({ preset, settings, organization }) => {
  const selectedPreset = preset || ECOMMERCE_PRESETS[settings?.template_key] || ECOMMERCE_PRESETS[ECOMMERCE_DEFAULT_TEMPLATE];
  const templateKey = selectedPreset?.template_key || settings?.template_key || ECOMMERCE_DEFAULT_TEMPLATE;
  const realCopy = REAL_ECOMMERCE_COPY[templateKey] || {};
  const base = selectedPreset?.content || {};
  const safeSettings = settings || {};
  const safeOrganization = organization || safeSettings.organization || {};
  const config = safeSettings.ecommerce_config || safeSettings.template_config?.ecommerce || safeSettings.templateConfig?.ecommerce || {};

  const content = {
    ...base,
    ...realCopy,
    ...(safeSettings.content || {}),
    ...(config.content || {}),
  };

  const suppliedBrandName = safeSettings.site_name || safeSettings.website_name || safeOrganization.name;
  const suppliedBrandLabel = safeSettings.tagline || safeSettings.slogan;

  const contact = {
    ...(base.contact || {}),
    email: safeSettings.official_email || safeSettings.email || safeOrganization.email || base.contact?.email || "orders@ecommerce.co.za",
    phone: safeSettings.official_phone || safeSettings.phone || safeOrganization.phone || base.contact?.phone || "+27 11 000 0000",
    address: safeSettings.address || safeOrganization.address || base.contact?.address || "Johannesburg, South Africa",
    ...(safeSettings.contact || {}),
    ...(config.contact || {}),
  };

  const normalizedFeatures = toList(content.features || config.features, base.features);
  const finalFeatures = isGenericFeatureList(normalizedFeatures) && realCopy.features ? realCopy.features : normalizedFeatures;

  return {
    ...content,
    brandName: isGenericPreviewText(suppliedBrandName)
      ? (isGenericPreviewText(content.brandName) ? (selectedPreset?.name || "Ecommerce Store") : content.brandName)
      : suppliedBrandName,
    brandLabel: isGenericPreviewText(suppliedBrandLabel)
      ? (isGenericPreviewText(content.brandLabel) ? (realCopy.brandLabel || "Online Store") : content.brandLabel)
      : suppliedBrandLabel,
    contact,
    products: normalizeProducts(content.products || config.products || safeSettings.products, base.products),
    gallery: normalizeGallery(content.gallery || config.gallery || safeSettings.gallery, base.gallery),
    categories: toList(content.categories || config.categories, base.categories),
    audience: toList(content.audience || content.industries, base.audience),
    proof: normalizeProof(content.proof || content.stats || config.proof, base.proof),
    collections: toList(content.collections || config.collections, base.collections),
    features: finalFeatures,
    shipping: toList(content.shipping || config.shipping, base.shipping),
    testimonials: toList(content.testimonials || config.testimonials, base.testimonials),
  };
};
