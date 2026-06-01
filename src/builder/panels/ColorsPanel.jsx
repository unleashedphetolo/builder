import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/builder-colors-panel.css";

const DEFAULT_SITE_COLORS = {
  primary_color: "#1e40af",
  secondary_color: "#0f172a",
  background_color: "#ffffff",
};

const DEFAULT_TYPOGRAPHY = {
  heading_font_family: 'Inter, "Segoe UI", Arial, sans-serif',
  body_font_family: 'Inter, "Segoe UI", Arial, sans-serif',
  heading_font_weight: 760,
  body_font_weight: 450,
  base_font_size: 5,
  heading_scale: 1.34,
  line_height: 1.6,
  letter_spacing: 0,
  button_text_transform: "none",
};

const STYLE_TABS = [
  { key: "colours", label: "Colours" },
  { key: "typography", label: "Typography" },
];

const BRAND_SWATCHES = [
  { name: "White", color: "#ffffff", border: true },
  { name: "Black", color: "#000000" },
  { name: "Ocean", color: "#2563eb" },
  { name: "Indigo", color: "#4338ca" },
  { name: "Emerald", color: "#047857" },
  { name: "Forest", color: "#166534" },
  { name: "Terracotta", color: "#c2410c" },
  { name: "Crimson", color: "#b91c1c" },
  { name: "Plum", color: "#7e22ce" },
  { name: "Graphite", color: "#334155" },
];

const CURATED_PALETTES = [
  {
    id: "executive-blue",
    name: "Executive Blue",
    description: "Trust and clarity",
    colors: {
      primary_color: "#2563eb",
      secondary_color: "#0f172a",
      background_color: "#ffffff",
    },
  },
  {
    id: "monochrome",
    name: "Monochrome",
    description: "Black and white",
    colors: {
      primary_color: "#000000",
      secondary_color: "#000000",
      background_color: "#ffffff",
    },
  },
  {
    id: "forest-growth",
    name: "Forest Growth",
    description: "Natural and grounded",
    colors: {
      primary_color: "#15803d",
      secondary_color: "#102a1d",
      background_color: "#fbfdf9",
    },
  },
  {
    id: "construction-gold",
    name: "Construction Gold",
    description: "Strong and practical",
    colors: {
      primary_color: "#d97706",
      secondary_color: "#1c1917",
      background_color: "#fffdf8",
    },
  },
  {
    id: "portfolio-ink",
    name: "Portfolio Ink",
    description: "Minimal and premium",
    colors: {
      primary_color: "#111827",
      secondary_color: "#0f172a",
      background_color: "#ffffff",
    },
  },
  {
    id: "berry-studio",
    name: "Berry Studio",
    description: "Creative and bold",
    colors: {
      primary_color: "#9333ea",
      secondary_color: "#221133",
      background_color: "#fdfbff",
    },
  },
  {
    id: "warm-earth",
    name: "Warm Earth",
    description: "Agriculture and craft",
    colors: {
      primary_color: "#a16207",
      secondary_color: "#292017",
      background_color: "#fffdf7",
    },
  },
];

const PAINT_LEVELS = [
  { id: "airy", label: "Airy", description: "Bright and minimal" },
  { id: "light", label: "Light", description: "Soft colour accents" },
  { id: "balanced", label: "Balanced", description: "Recommended" },
  { id: "rich", label: "Rich", description: "More brand colour" },
  { id: "dark", label: "Dark", description: "High impact" },
];

const FONT_PAIRINGS = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean and universal",
    suitableFor: "Business · School",
    typography: {
      heading_font_family: 'Inter, "Segoe UI", Arial, sans-serif',
      body_font_family: 'Inter, "Segoe UI", Arial, sans-serif',
      heading_font_weight: 760,
      body_font_weight: 450,
      heading_scale: 1.34,
      line_height: 1.6,
      letter_spacing: 0,
    },
  },
  {
    id: "institutional",
    name: "Institutional",
    description: "Formal and established",
    suitableFor: "School · Legal",
    typography: {
      heading_font_family: 'Georgia, "Times New Roman", serif',
      body_font_family: 'Inter, "Segoe UI", Arial, sans-serif',
      heading_font_weight: 700,
      body_font_weight: 450,
      heading_scale: 1.38,
      line_height: 1.64,
      letter_spacing: 0,
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Elegant and expressive",
    suitableFor: "Portfolio · Studio",
    typography: {
      heading_font_family: 'Georgia, "Iowan Old Style", "Times New Roman", serif',
      body_font_family: 'Arial, "Segoe UI", sans-serif',
      heading_font_weight: 600,
      body_font_weight: 400,
      heading_scale: 1.48,
      line_height: 1.7,
      letter_spacing: 0,
    },
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Bold and direct",
    suitableFor: "Construction",
    typography: {
      heading_font_family: '"Arial Narrow", "Roboto Condensed", Arial, sans-serif',
      body_font_family: 'Arial, "Segoe UI", sans-serif',
      heading_font_weight: 800,
      body_font_weight: 500,
      heading_scale: 1.42,
      line_height: 1.52,
      letter_spacing: 0.01,
    },
  },
  {
    id: "organic",
    name: "Organic",
    description: "Warm and approachable",
    suitableFor: "Agriculture",
    typography: {
      heading_font_family: '"Trebuchet MS", "Segoe UI", Arial, sans-serif',
      body_font_family: 'Arial, "Segoe UI", sans-serif',
      heading_font_weight: 700,
      body_font_weight: 450,
      heading_scale: 1.34,
      line_height: 1.66,
      letter_spacing: 0,
    },
  },
  {
    id: "showcase",
    name: "Showcase",
    description: "Premium and spacious",
    suitableFor: "Portfolio · Retail",
    typography: {
      heading_font_family: '"Avenir Next", "Segoe UI", Arial, sans-serif',
      body_font_family: 'Inter, "Segoe UI", Arial, sans-serif',
      heading_font_weight: 700,
      body_font_weight: 400,
      heading_scale: 1.5,
      line_height: 1.68,
      letter_spacing: -0.01,
    },
  },
];

const HEADING_FONT_OPTIONS = [
  { label: "Inter / Modern", value: 'Inter, "Segoe UI", Arial, sans-serif' },
  { label: "Georgia / Formal", value: 'Georgia, "Times New Roman", serif' },
  { label: "Arial / Neutral", value: 'Arial, "Segoe UI", sans-serif' },
  {
    label: "Arial Narrow / Bold",
    value: '"Arial Narrow", "Roboto Condensed", Arial, sans-serif',
  },
  {
    label: "Trebuchet / Friendly",
    value: '"Trebuchet MS", "Segoe UI", Arial, sans-serif',
  },
  {
    label: "Avenir / Premium",
    value: '"Avenir Next", "Segoe UI", Arial, sans-serif',
  },
];

const BODY_FONT_OPTIONS = [
  { label: "Inter / Clean", value: 'Inter, "Segoe UI", Arial, sans-serif' },
  { label: "Arial / Universal", value: 'Arial, "Segoe UI", sans-serif' },
  {
    label: "Trebuchet / Friendly",
    value: '"Trebuchet MS", "Segoe UI", Arial, sans-serif',
  },
  { label: "Georgia / Editorial", value: 'Georgia, "Times New Roman", serif' },
];

const HEADING_WEIGHTS = [
  { value: 500, label: "Medium" },
  { value: 600, label: "Semi Bold" },
  { value: 700, label: "Bold" },
  { value: 760, label: "Strong" },
  { value: 800, label: "Extra Bold" },
];

const BODY_WEIGHTS = [
  { value: 400, label: "Regular" },
  { value: 450, label: "Comfortable" },
  { value: 500, label: "Medium" },
  { value: 600, label: "Semi Bold" },
];

function isValidHex(value = "") {
  return /^#[0-9a-f]{6}$/i.test(String(value || "").trim());
}

function normalizeHex(value, fallback) {
  return isValidHex(value) ? String(value).toLowerCase() : fallback;
}

function clampNumber(value, minimum, maximum, fallback) {
  const number = Number(value);
  return Number.isFinite(number)
    ? Math.max(minimum, Math.min(maximum, number))
    : fallback;
}

function hexToRgb(hex) {
  const safe = normalizeHex(hex, "#000000").slice(1);

  return {
    r: Number.parseInt(safe.slice(0, 2), 16),
    g: Number.parseInt(safe.slice(2, 4), 16),
    b: Number.parseInt(safe.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  const channel = (value) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, "0");

  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function mixColors(first, second, amount = 0.5) {
  const start = hexToRgb(first);
  const end = hexToRgb(second);
  const weight = Math.max(0, Math.min(1, amount));

  return rgbToHex({
    r: start.r + (end.r - start.r) * weight,
    g: start.g + (end.g - start.g) * weight,
    b: start.b + (end.b - start.b) * weight,
  });
}

function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);

  const convert = (value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * convert(rgb.r) +
    0.7152 * convert(rgb.g) +
    0.0722 * convert(rgb.b)
  );
}

function contrastRatio(first, second) {
  const firstLum = relativeLuminance(first);
  const secondLum = relativeLuminance(second);
  const light = Math.max(firstLum, secondLum);
  const dark = Math.min(firstLum, secondLum);

  return (light + 0.05) / (dark + 0.05);
}

function readableText(background) {
  const whiteContrast = contrastRatio(background, "#ffffff");
  const darkContrast = contrastRatio(background, "#0f172a");

  return whiteContrast >= darkContrast ? "#ffffff" : "#0f172a";
}

function normalizeSiteColors(settings = {}) {
  return {
    primary_color: normalizeHex(
      settings?.primary_color,
      DEFAULT_SITE_COLORS.primary_color,
    ),
    secondary_color: normalizeHex(
      settings?.secondary_color,
      DEFAULT_SITE_COLORS.secondary_color,
    ),
    background_color: normalizeHex(
      settings?.background_color,
      DEFAULT_SITE_COLORS.background_color,
    ),
  };
}

function normalizeTypography(settings = {}) {
  const saved =
    settings?.typography_settings &&
    typeof settings.typography_settings === "object" &&
    !Array.isArray(settings.typography_settings)
      ? settings.typography_settings
      : {};

  return {
    heading_font_family:
      saved.heading_font_family || DEFAULT_TYPOGRAPHY.heading_font_family,
    body_font_family:
      saved.body_font_family ||
      settings?.font_family ||
      DEFAULT_TYPOGRAPHY.body_font_family,
    heading_font_weight: clampNumber(
      saved.heading_font_weight,
      400,
      900,
      DEFAULT_TYPOGRAPHY.heading_font_weight,
    ),
    body_font_weight: clampNumber(
      saved.body_font_weight,
      300,
      700,
      DEFAULT_TYPOGRAPHY.body_font_weight,
    ),
    base_font_size: clampNumber(
      saved.base_font_size,
      1,
      20,
      DEFAULT_TYPOGRAPHY.base_font_size,
    ),
    heading_scale: clampNumber(
      saved.heading_scale,
      -4.1,
      1.7,
      DEFAULT_TYPOGRAPHY.heading_scale,
    ),
    line_height: clampNumber(
      saved.line_height,
      -1.3,
      2,
      DEFAULT_TYPOGRAPHY.line_height,
    ),
    letter_spacing: clampNumber(
      saved.letter_spacing,
      -32.04,
      0.08,
      DEFAULT_TYPOGRAPHY.letter_spacing,
    ),
    button_text_transform:
      saved.button_text_transform === "uppercase" ? "uppercase" : "none",
  };
}

function createPaintPalette(primaryColor, level = 2) {
  const primary = normalizeHex(primaryColor, DEFAULT_SITE_COLORS.primary_color);

  if (level === 0) {
    return {
      primary_color: primary,
      secondary_color: mixColors(primary, "#0f172a", 0.78),
      background_color: "#ffffff",
    };
  }

  if (level === 1) {
    return {
      primary_color: primary,
      secondary_color: mixColors(primary, "#0f172a", 0.74),
      background_color: mixColors(primary, "#ffffff", 0.97),
    };
  }

  if (level === 3) {
    return {
      primary_color: primary,
      secondary_color: mixColors(primary, "#0f172a", 0.64),
      background_color: mixColors(primary, "#ffffff", 0.91),
    };
  }

  if (level === 4) {
    return {
      primary_color: primary,
      secondary_color: "#ffffff",
      background_color: mixColors(primary, "#020617", 0.82),
    };
  }

  return {
    primary_color: primary,
    secondary_color: mixColors(primary, "#0f172a", 0.7),
    background_color: mixColors(primary, "#ffffff", 0.95),
  };
}

function enforceReadablePalette(colors = {}) {
  const normalized = normalizeSiteColors(colors);
  const textContrast = contrastRatio(
    normalized.secondary_color,
    normalized.background_color,
  );

  if (textContrast >= 4.5) {
    return {
      colors: normalized,
      adjusted: false,
    };
  }

  return {
    colors: {
      ...normalized,
      secondary_color: readableText(normalized.background_color),
    },
    adjusted: true,
  };
}

function sameColors(first, second) {
  return (
    first?.primary_color === second?.primary_color &&
    first?.secondary_color === second?.secondary_color &&
    first?.background_color === second?.background_color
  );
}

function findPaintLevel(colors) {
  for (let index = 0; index < PAINT_LEVELS.length; index += 1) {
    const candidate = enforceReadablePalette(
      createPaintPalette(colors.primary_color, index),
    ).colors;

    if (sameColors(candidate, colors)) {
      return index;
    }
  }

  return 2;
}

function ContrastStatus({ foreground, background, label }) {
  const ratio = contrastRatio(foreground, background);
  const passes = ratio >= 4.5;

  return (
    <div className={`bcp-contrast-row ${passes ? "is-pass" : "is-warning"}`}>
      <span>{label}</span>
      <strong>{ratio.toFixed(1)}:1</strong>
      <small>{passes ? "Readable" : "Auto fix needed"}</small>
    </div>
  );
}

function SaveState({ state }) {
  return (
    <div className={`bcp-save-state is-${state}`} aria-live="polite">
      <span aria-hidden="true" />
      {state === "saving" ? "Saving" : state === "error" ? "Error" : "Saved"}
    </div>
  );
}

export default function ColorsPanel({
  siteSettings = {},
  onUpdateColors,
  onUpdateSettings,
  onChange,
}) {
  const colourSignature = [
    siteSettings?.primary_color,
    siteSettings?.secondary_color,
    siteSettings?.background_color,
  ].join("|");

  const typographySignature = JSON.stringify({
    font_family: siteSettings?.font_family,
    typography_settings: siteSettings?.typography_settings || {},
  });

  const saveSequenceRef = useRef(0);
  const noticeTimeoutRef = useRef(null);

  const initialColors = useMemo(
    () => enforceReadablePalette(normalizeSiteColors(siteSettings)).colors,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [colourSignature],
  );

  const initialTypography = useMemo(
    () => normalizeTypography(siteSettings),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typographySignature],
  );

  const [activeTab, setActiveTab] = useState("colours");
  const [draftColors, setDraftColors] = useState(initialColors);
  const [draftTypography, setDraftTypography] = useState(initialTypography);
  const [paintLevel, setPaintLevel] = useState(() => findPaintLevel(initialColors));
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [saveState, setSaveState] = useState("saved");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const nextColors = enforceReadablePalette(
      normalizeSiteColors(siteSettings),
    ).colors;

    setDraftColors(nextColors);
    setPaintLevel(findPaintLevel(nextColors));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colourSignature]);

  useEffect(() => {
    setDraftTypography(normalizeTypography(siteSettings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typographySignature]);

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) {
        window.clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  const buttonTextColor = readableText(draftColors.primary_color);
  const pageTextColor = draftColors.secondary_color;
  const pageBackground = draftColors.background_color;

  const emitNotice = (message) => {
    setNotice(message);

    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current);
    }

    noticeTimeoutRef.current = window.setTimeout(() => {
      setNotice("");
    }, 3200);
  };

  const resolveColorHandler = () => {
    if (typeof onUpdateColors === "function") return onUpdateColors;
    if (typeof onUpdateSettings === "function") return onUpdateSettings;
    return onChange;
  };

  const resolveTypographyHandler = () => {
    if (typeof onUpdateSettings === "function") return onUpdateSettings;
    return onChange;
  };

  const persistColors = async (nextColors, message = "Site colours updated.") => {
    const result = enforceReadablePalette(nextColors);
    const normalized = result.colors;
    const saveId = saveSequenceRef.current + 1;

    saveSequenceRef.current = saveId;
    setDraftColors(normalized);
    setSaveState("saving");
    setError("");
    setNotice("");

    const handler = resolveColorHandler();

    if (typeof handler !== "function") {
      setSaveState("error");
      setError("No colour save handler is connected to this panel.");
      return;
    }

    try {
      const response = await Promise.resolve(handler(normalized));

      if (saveSequenceRef.current !== saveId) return;
      if (response === false) throw new Error("Colour update was not saved.");

      setSaveState("saved");

      emitNotice(
        result.adjusted
          ? `${message} Text colour was adjusted automatically for readability.`
          : message,
      );
    } catch (saveError) {
      console.error("ColorsPanel update error:", saveError);

      if (saveSequenceRef.current !== saveId) return;

      setSaveState("error");
      setError("Website colours could not be saved. Please try again.");
    }
  };

  const persistTypography = async (
    nextTypography,
    message = "Typography updated across the website.",
  ) => {
    const normalized = normalizeTypography({
      typography_settings: nextTypography,
      font_family: nextTypography.body_font_family,
    });

    const saveId = saveSequenceRef.current + 1;
    saveSequenceRef.current = saveId;

    setDraftTypography(normalized);
    setSaveState("saving");
    setError("");
    setNotice("");

    const handler = resolveTypographyHandler();

    if (typeof handler !== "function") {
      setSaveState("error");
      setError("No typography save handler is connected to this panel.");
      return;
    }

    try {
      const response = await Promise.resolve(
        handler({
          font_family: normalized.body_font_family,
          typography_settings: normalized,
        }),
      );

      if (saveSequenceRef.current !== saveId) return;
      if (response === false) throw new Error("Typography update was not saved.");

      setSaveState("saved");
      emitNotice(message);
    } catch (saveError) {
      console.error("ColorsPanel typography update error:", saveError);

      if (saveSequenceRef.current !== saveId) return;

      setSaveState("error");
      setError(
        "Typography could not be saved. Run the typography_settings SQL setup if it has not been added yet.",
      );
    }
  };

  const chooseBrandColor = (color) => {
    const next = createPaintPalette(color, paintLevel);
    persistColors(next, "Brand colour applied across the website.");
  };

  const choosePaintLevel = (level) => {
    const nextLevel = Number(level);
    setPaintLevel(nextLevel);

    const next = createPaintPalette(draftColors.primary_color, nextLevel);
    persistColors(next, "Site colour balance updated.");
  };

  const chooseCuratedPalette = (palette) => {
    const next = normalizeSiteColors(palette.colors);
    setPaintLevel(findPaintLevel(next));
    persistColors(next, `${palette.name} palette applied.`);
  };

  const updateAdvancedColor = (key, value) => {
    const next = {
      ...draftColors,
      [key]: normalizeHex(value, draftColors[key]),
    };

    persistColors(next, "Custom site colours applied.");
  };

  const chooseFontPairing = (pairing) => {
    persistTypography(
      {
        ...draftTypography,
        ...pairing.typography,
      },
      `${pairing.name} typography applied.`,
    );
  };

  const updateTypography = (key, value) => {
    persistTypography({
      ...draftTypography,
      [key]: value,
    });
  };

  const restoreColourDefaults = () => {
    const next = { ...DEFAULT_SITE_COLORS };
    setPaintLevel(findPaintLevel(next));
    persistColors(next, "Default site colours restored.");
  };

  const restoreTypographyDefaults = () => {
    persistTypography(
      { ...DEFAULT_TYPOGRAPHY },
      "Default typography restored.",
    );
  };

  const previewVariables = {
    "--bcp-site-primary": draftColors.primary_color,
    "--bcp-site-secondary": draftColors.secondary_color,
    "--bcp-site-background": draftColors.background_color,
    "--bcp-site-on-primary": buttonTextColor,
    "--bcp-heading-font": draftTypography.heading_font_family,
    "--bcp-body-font": draftTypography.body_font_family,
    "--bcp-heading-weight": draftTypography.heading_font_weight,
    "--bcp-body-weight": draftTypography.body_font_weight,
    "--bcp-base-size": `${draftTypography.base_font_size}px`,
    "--bcp-line-height": draftTypography.line_height,
    "--bcp-letter-spacing": `${draftTypography.letter_spacing}em`,
    "--bcp-button-case": draftTypography.button_text_transform,
  };

  return (
    <section className="bcp-root" aria-label="Brand styles">
      <header className="bcp-header">
        <div>
          <span className="bcp-eyebrow">Theme</span>
          <h3>Brand Styles</h3>
          <p>
            Set global colours and typography for every page and section.
          </p>
        </div>

        <SaveState state={saveState} />
      </header>

      <nav className="bcp-tabs" aria-label="Brand style controls">
        {STYLE_TABS.map((tab) => (
          <button
            type="button"
            key={tab.key}
            className={activeTab === tab.key ? "is-active" : ""}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {notice && <div className="bcp-notice">{notice}</div>}
      {error && <div className="bcp-error">{error}</div>}

      <section className="bcp-preview" aria-label="Brand style preview">
        <div className="bcp-preview-browser" style={previewVariables}>
          <div className="bcp-preview-top">
            <span />
            <span />
            <span />
          </div>

          <div className="bcp-preview-nav">
            <b />
            <i />
            <i />
            <i />
          </div>

          <div className="bcp-preview-hero">
            <small>Professional Website</small>
            <strong>Build your future with confidence</strong>
            <span>Clear content and a consistent brand identity.</span>
            <button type="button" tabIndex={-1}>
              Get Started
            </button>
          </div>

          <div className="bcp-preview-cards">
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>

      {activeTab === "colours" && (
        <>
          <section className="bcp-block">
            <div className="bcp-block-title">
              <h4>Brand Colour</h4>
              <p>
                Choose the main accent used for actions, links and highlights.
              </p>
            </div>

            <div className="bcp-brand-controls">
              <label className="bcp-custom-colour">
                <input
                  type="color"
                  value={draftColors.primary_color}
                  onChange={(event) => chooseBrandColor(event.target.value)}
                  aria-label="Choose custom brand colour"
                />
                <span>Custom</span>
              </label>

              <div className="bcp-swatches" aria-label="Brand colour choices">
                {BRAND_SWATCHES.map((swatch) => {
                  const selected =
                    draftColors.primary_color.toLowerCase() ===
                    swatch.color.toLowerCase();

                  return (
                    <button
                      type="button"
                      key={swatch.name}
                      className={`${selected ? "is-selected" : ""} ${
                        swatch.border ? "needs-border" : ""
                      }`}
                      style={{ "--bcp-swatch": swatch.color }}
                      title={swatch.name}
                      aria-label={`Use ${swatch.name} brand colour`}
                      onClick={() => chooseBrandColor(swatch.color)}
                    >
                      <span />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bcp-block">
            <div className="bcp-block-title">
              <h4>Paint Your Site</h4>
              <p>
                Adjust the overall colour strength while keeping one consistent
                brand system.
              </p>
            </div>

            <div className="bcp-slider-labels" aria-hidden="true">
              <span>Light</span>
              <strong>{PAINT_LEVELS[paintLevel]?.label || "Balanced"}</strong>
              <span>Dark</span>
            </div>

            <input
              className="bcp-paint-slider"
              type="range"
              min="0"
              max="4"
              step="1"
              value={paintLevel}
              onChange={(event) => choosePaintLevel(event.target.value)}
              aria-label="Paint your site colour intensity"
            />

            <p className="bcp-paint-description">
              {PAINT_LEVELS[paintLevel]?.description || "Recommended"}
            </p>
          </section>

          <section className="bcp-block bcp-palettes">
            <div className="bcp-block-title">
              <h4>Recommended Styles</h4>
              <p>
                Professionally balanced palettes for different website
                categories.
              </p>
            </div>

            <div className="bcp-palette-grid">
              {CURATED_PALETTES.map((palette) => {
                const selected = sameColors(draftColors, palette.colors);

                return (
                  <button
                    type="button"
                    key={palette.id}
                    className={`bcp-palette-card ${
                      selected ? "is-selected" : ""
                    }`}
                    onClick={() => chooseCuratedPalette(palette)}
                  >
                    <span className="bcp-palette-colours">
                      <i style={{ background: palette.colors.primary_color }} />
                      <i
                        style={{ background: palette.colors.secondary_color }}
                      />
                      <i
                        style={{ background: palette.colors.background_color }}
                      />
                    </span>

                    <strong>{palette.name}</strong>
                    <small>{palette.description}</small>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bcp-block">
            <button
              type="button"
              className="bcp-advanced-toggle"
              aria-expanded={advancedOpen}
              onClick={() => setAdvancedOpen((current) => !current)}
            >
              <span>Advanced Colours</span>
              <small>Custom background and text colours</small>
              <b aria-hidden="true">{advancedOpen ? "−" : "+"}</b>
            </button>

            {advancedOpen && (
              <div className="bcp-advanced-body">
                <div className="bcp-auto-protection">
                  <span aria-hidden="true">✓</span>
                  <div>
                    <strong>Automatic readability protection</strong>
                    <p>
                      On. If the selected background makes text difficult to
                      read, the text colour is switched automatically to light
                      or dark.
                    </p>
                  </div>
                </div>

                <label className="bcp-colour-row">
                  <span>
                    <strong>Primary</strong>
                    <small>Buttons, links and active accents</small>
                  </span>
                  <input
                    type="color"
                    value={draftColors.primary_color}
                    onChange={(event) =>
                      updateAdvancedColor("primary_color", event.target.value)
                    }
                  />
                  <code>{draftColors.primary_color}</code>
                </label>

                <label className="bcp-colour-row">
                  <span>
                    <strong>Secondary / Text</strong>
                    <small>Headings, navigation and strong content</small>
                  </span>
                  <input
                    type="color"
                    value={draftColors.secondary_color}
                    onChange={(event) =>
                      updateAdvancedColor(
                        "secondary_color",
                        event.target.value,
                      )
                    }
                  />
                  <code>{draftColors.secondary_color}</code>
                </label>

                <label className="bcp-colour-row">
                  <span>
                    <strong>Background</strong>
                    <small>Main website surface colour</small>
                  </span>
                  <input
                    type="color"
                    value={draftColors.background_color}
                    onChange={(event) =>
                      updateAdvancedColor(
                        "background_color",
                        event.target.value,
                      )
                    }
                  />
                  <code>{draftColors.background_color}</code>
                </label>

                <div className="bcp-contrast-card">
                  <h5>Accessibility Check</h5>

                  <ContrastStatus
                    foreground={pageTextColor}
                    background={pageBackground}
                    label="Text on background"
                  />

                  <ContrastStatus
                    foreground={buttonTextColor}
                    background={draftColors.primary_color}
                    label="Button text"
                  />
                </div>
              </div>
            )}
          </section>

          <footer className="bcp-footer">
            <button
              type="button"
              className="bcp-reset-button"
              onClick={restoreColourDefaults}
            >
              Restore Default Colours
            </button>
          </footer>
        </>
      )}

      {activeTab === "typography" && (
        <>
          <section className="bcp-block bcp-font-pairings">
            <div className="bcp-block-title">
              <h4>Recommended Font Pairings</h4>
              <p>
                Choose a professional combination for headings and body text.
              </p>
            </div>

            <div className="bcp-font-grid">
              {FONT_PAIRINGS.map((pairing) => (
                <button
                  type="button"
                  key={pairing.id}
                  className="bcp-font-card"
                  style={{
                    "--font-heading": pairing.typography.heading_font_family,
                    "--font-body": pairing.typography.body_font_family,
                  }}
                  onClick={() => chooseFontPairing(pairing)}
                >
                  <strong>Aa</strong>
                  <span>{pairing.name}</span>
                  <small>{pairing.suitableFor}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="bcp-block">
            <div className="bcp-block-title">
              <h4>Font Selection</h4>
              <p>Heading and body fonts are applied throughout the website.</p>
            </div>

            <label className="bcp-select-field">
              <span>Heading Font</span>
              <select
                value={draftTypography.heading_font_family}
                onChange={(event) =>
                  updateTypography("heading_font_family", event.target.value)
                }
              >
                {HEADING_FONT_OPTIONS.map((font) => (
                  <option value={font.value} key={font.label}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="bcp-select-field">
              <span>Body Font</span>
              <select
                value={draftTypography.body_font_family}
                onChange={(event) =>
                  updateTypography("body_font_family", event.target.value)
                }
              >
                {BODY_FONT_OPTIONS.map((font) => (
                  <option value={font.value} key={font.label}>
                    {font.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="bcp-two-column">
              <label className="bcp-select-field">
                <span>Heading Weight</span>
                <select
                  value={draftTypography.heading_font_weight}
                  onChange={(event) =>
                    updateTypography(
                      "heading_font_weight",
                      Number(event.target.value),
                    )
                  }
                >
                  {HEADING_WEIGHTS.map((weight) => (
                    <option value={weight.value} key={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="bcp-select-field">
                <span>Body Weight</span>
                <select
                  value={draftTypography.body_font_weight}
                  onChange={(event) =>
                    updateTypography(
                      "body_font_weight",
                      Number(event.target.value),
                    )
                  }
                >
                  {BODY_WEIGHTS.map((weight) => (
                    <option value={weight.value} key={weight.value}>
                      {weight.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="bcp-block bcp-type-controls">
            <div className="bcp-block-title">
              <h4>Size & Spacing</h4>
              <p>Fine-tune readability across desktop, tablet and mobile.</p>
            </div>

            <label className="bcp-range-row">
              <span>
                Body Size <strong>{draftTypography.base_font_size}px</strong>
              </span>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={draftTypography.base_font_size}
                onChange={(event) =>
                  updateTypography("base_font_size", Number(event.target.value))
                }
              />
            </label>

            <label className="bcp-range-row">
              <span>
                Heading Scale{" "}
                <strong>{draftTypography.heading_scale.toFixed(2)}×</strong>
              </span>
              <input
                type="range"
                min="0.1"
                max="1.7"
                step="0.02"
                value={draftTypography.heading_scale}
                onChange={(event) =>
                  updateTypography("heading_scale", Number(event.target.value))
                }
              />
            </label>

            <label className="bcp-range-row">
              <span>
                Line Height{" "}
                <strong>{draftTypography.line_height.toFixed(2)}</strong>
              </span>
              <input
                type="range"
                min="0.3"
                max="2"
                step="0.05"
                value={draftTypography.line_height}
                onChange={(event) =>
                  updateTypography("line_height", Number(event.target.value))
                }
              />
            </label>

            <label className="bcp-range-row">
              <span>
                Letter Spacing{" "}
                <strong>{draftTypography.letter_spacing.toFixed(2)}em</strong>
              </span>
              <input
                type="range"
                min="-0.08"
                max="0.08"
                step="0.01"
                value={draftTypography.letter_spacing}
                onChange={(event) =>
                  updateTypography(
                    "letter_spacing",
                    Number(event.target.value),
                  )
                }
              />
            </label>

            <label className="bcp-select-field">
              <span>Button Text Style</span>
              <select
                value={draftTypography.button_text_transform}
                onChange={(event) =>
                  updateTypography(
                    "button_text_transform",
                    event.target.value,
                  )
                }
              >
                <option value="none">Normal Case</option>
                <option value="uppercase">Uppercase</option>
              </select>
            </label>
          </section>

          <footer className="bcp-footer">
            <button
              type="button"
              className="bcp-reset-button"
              onClick={restoreTypographyDefaults}
            >
              Restore Default Typography
            </button>

            <p>
              Typography is site-wide. Individual rich text sections can
              support limited emphasis later without changing brand fonts.
            </p>
          </footer>
        </>
      )}
    </section>
  );
}
