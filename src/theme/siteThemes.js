export const DEFAULT_SITE_THEME_KEY = "signature";

export const SITE_THEMES = Object.freeze([
  {
    key: "signature",
    name: "Signature",
    description: "Balanced, clean and professional for any organisation.",
    recommendedFor: ["Business", "School", "Services"],
    tokens: {
      displayFont: '"Inter", "Segoe UI", Arial, sans-serif',
      bodyFont: '"Inter", "Segoe UI", Arial, sans-serif',
      headingWeight: "760",
      bodyWeight: "450",
      letterSpacing: "-0.025em",
      navHeight: "76px",
      sectionRadius: "16px",
      cardRadius: "14px",
      buttonRadius: "8px",
      contentWidth: "1180px",
      sectionGap: "68px",
      buttonTransform: "none",
      shadow: "0 14px 34px rgba(15, 23, 42, 0.08)",
      heroStyle: "balanced",
    },
  },
  {
    key: "heritage",
    name: "Heritage",
    description: "Established and formal with a confident institutional feel.",
    recommendedFor: ["School", "Legal", "Public Sector"],
    tokens: {
      displayFont: 'Georgia, "Times New Roman", serif',
      bodyFont: '"Inter", "Segoe UI", Arial, sans-serif',
      headingWeight: "700",
      bodyWeight: "450",
      letterSpacing: "-0.018em",
      navHeight: "84px",
      sectionRadius: "4px",
      cardRadius: "4px",
      buttonRadius: "3px",
      contentWidth: "1160px",
      sectionGap: "74px",
      buttonTransform: "uppercase",
      shadow: "0 10px 28px rgba(15, 23, 42, 0.07)",
      heroStyle: "formal",
    },
  },
  {
    key: "editorial",
    name: "Editorial",
    description: "Large typography and elegant whitespace for storytelling.",
    recommendedFor: ["Portfolio", "Studio", "Consulting"],
    tokens: {
      displayFont: 'Georgia, "Iowan Old Style", "Times New Roman", serif',
      bodyFont: '"Inter", "Segoe UI", Arial, sans-serif',
      headingWeight: "600",
      bodyWeight: "400",
      letterSpacing: "-0.038em",
      navHeight: "80px",
      sectionRadius: "0px",
      cardRadius: "0px",
      buttonRadius: "999px",
      contentWidth: "1080px",
      sectionGap: "92px",
      buttonTransform: "none",
      shadow: "none",
      heroStyle: "editorial",
    },
  },
  {
    key: "summit",
    name: "Summit",
    description: "Strong geometry and bold calls to action for impact.",
    recommendedFor: ["Construction", "Engineering", "Industrial"],
    tokens: {
      displayFont: '"Arial Narrow", "Roboto Condensed", Arial, sans-serif',
      bodyFont: '"Inter", "Segoe UI", Arial, sans-serif',
      headingWeight: "800",
      bodyWeight: "500",
      letterSpacing: "-0.018em",
      navHeight: "74px",
      sectionRadius: "2px",
      cardRadius: "3px",
      buttonRadius: "2px",
      contentWidth: "1240px",
      sectionGap: "62px",
      buttonTransform: "uppercase",
      shadow: "0 12px 24px rgba(15, 23, 42, 0.14)",
      heroStyle: "bold",
    },
  },
  {
    key: "verdant",
    name: "Verdant",
    description: "Warm organic surfaces for growth and natural brands.",
    recommendedFor: ["Agriculture", "Wellness", "Community"],
    tokens: {
      displayFont: '"Trebuchet MS", "Segoe UI", Arial, sans-serif',
      bodyFont: '"Inter", "Segoe UI", Arial, sans-serif',
      headingWeight: "720",
      bodyWeight: "450",
      letterSpacing: "-0.02em",
      navHeight: "78px",
      sectionRadius: "26px",
      cardRadius: "20px",
      buttonRadius: "999px",
      contentWidth: "1160px",
      sectionGap: "72px",
      buttonTransform: "none",
      shadow: "0 18px 38px rgba(35, 52, 36, 0.09)",
      heroStyle: "organic",
    },
  },
  {
    key: "atelier",
    name: "Atelier",
    description: "Modern showcase design for visual work and products.",
    recommendedFor: ["Portfolio", "Retail", "Creative"],
    tokens: {
      displayFont: '"Avenir Next", "Segoe UI", Arial, sans-serif',
      bodyFont: '"Inter", "Segoe UI", Arial, sans-serif',
      headingWeight: "700",
      bodyWeight: "400",
      letterSpacing: "-0.048em",
      navHeight: "72px",
      sectionRadius: "22px",
      cardRadius: "18px",
      buttonRadius: "12px",
      contentWidth: "1260px",
      sectionGap: "82px",
      buttonTransform: "none",
      shadow: "0 20px 42px rgba(15, 23, 42, 0.1)",
      heroStyle: "gallery",
    },
  },
]);

const DEFAULT_COLOURS = {
  primary_color: "#1e40af",
  secondary_color: "#0f172a",
  background_color: "#ffffff",
};

function isValidHex(value = "") {
  return /^#[0-9a-f]{6}$/i.test(String(value || "").trim());
}

function normalizeHex(value, fallback) {
  return isValidHex(value) ? String(value).toLowerCase() : fallback;
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

export function mixThemeColour(first, second, amount = 0.5) {
  const start = hexToRgb(first);
  const end = hexToRgb(second);
  const weight = Math.max(0, Math.min(1, amount));

  return rgbToHex({
    r: start.r + (end.r - start.r) * weight,
    g: start.g + (end.g - start.g) * weight,
    b: start.b + (end.b - start.b) * weight,
  });
}

export function getSiteTheme(themeKey = DEFAULT_SITE_THEME_KEY) {
  return (
    SITE_THEMES.find((theme) => theme.key === themeKey) ||
    SITE_THEMES.find((theme) => theme.key === DEFAULT_SITE_THEME_KEY) ||
    SITE_THEMES[0]
  );
}

export function normalizeThemeColours(settings = {}) {
  return {
    primary_color: normalizeHex(
      settings?.primary_color,
      DEFAULT_COLOURS.primary_color,
    ),
    secondary_color: normalizeHex(
      settings?.secondary_color,
      DEFAULT_COLOURS.secondary_color,
    ),
    background_color: normalizeHex(
      settings?.background_color,
      DEFAULT_COLOURS.background_color,
    ),
  };
}

function clampThemeNumber(value, minimum, maximum, fallback) {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(minimum, Math.min(maximum, number))
    : fallback;
}

export function createThemeCssVariables(themeInput, settings = {}) {
  const theme =
    typeof themeInput === "string" ? getSiteTheme(themeInput) : themeInput;
  const colours = normalizeThemeColours(settings);
  const tokens = theme?.tokens || getSiteTheme().tokens;
  const typography =
    settings?.typography_settings &&
    typeof settings.typography_settings === "object" &&
    !Array.isArray(settings.typography_settings)
      ? settings.typography_settings
      : {};

  const headingFont = typography.heading_font_family || tokens.displayFont;
  const bodyFont =
    typography.body_font_family || settings?.font_family || tokens.bodyFont;
  const headingWeight = clampThemeNumber(
    typography.heading_font_weight,
    400,
    900,
    Number(tokens.headingWeight) || 700,
  );
  const bodyWeight = clampThemeNumber(
    typography.body_font_weight,
    300,
    700,
    Number(tokens.bodyWeight) || 450,
  );
  const baseFontSize = clampThemeNumber(
    typography.base_font_size,
    14,
    20,
    16,
  );
  const headingScale = clampThemeNumber(
    typography.heading_scale,
    1.1,
    1.7,
    1.34,
  );
  const lineHeight = clampThemeNumber(
    typography.line_height,
    1.3,
    2,
    1.6,
  );
  const letterSpacing =
    typography.letter_spacing === undefined ||
    typography.letter_spacing === null
      ? tokens.letterSpacing
      : `${clampThemeNumber(typography.letter_spacing, -0.04, 0.08, 0)}em`;
  const buttonTransform =
    typography.button_text_transform === "uppercase"
      ? "uppercase"
      : tokens.buttonTransform;

  return {
    "--site-theme-primary": colours.primary_color,
    "--site-theme-secondary": colours.secondary_color,
    "--site-theme-background": colours.background_color,
    "--site-theme-surface": mixThemeColour(colours.background_color, "#ffffff", 0.44),
    "--site-theme-soft": mixThemeColour(colours.primary_color, colours.background_color, 0.93),
    "--site-theme-border": mixThemeColour(colours.secondary_color, colours.background_color, 0.87),
    "--site-theme-display-font": headingFont,
    "--site-theme-body-font": bodyFont,
    "--site-theme-heading-weight": String(headingWeight),
    "--site-theme-body-weight": String(bodyWeight),
    "--site-theme-base-font-size": `${baseFontSize}px`,
    "--site-theme-heading-scale": String(headingScale),
    "--site-theme-line-height": String(lineHeight),
    "--site-theme-letter-spacing": letterSpacing,
    "--site-theme-nav-height": tokens.navHeight,
    "--site-theme-section-radius": tokens.sectionRadius,
    "--site-theme-card-radius": tokens.cardRadius,
    "--site-theme-button-radius": tokens.buttonRadius,
    "--site-theme-content-width": tokens.contentWidth,
    "--site-theme-section-gap": tokens.sectionGap,
    "--site-theme-button-transform": buttonTransform,
    "--site-theme-shadow": tokens.shadow,
  };
}

export function cssVariablesToText(variables = {}) {
  return Object.entries(variables)
    .map(([name, value]) => `${name}: ${value};`)
    .join("\n");
}

/*
  Preview-only live styling.
  The ThemePanel injects this into same-origin thumbnail iframes so each card
  displays the real selected website page using a different look, without
  saving that look until the user selects it.
*/
export function createThemePreviewStyles(themeInput, settings = {}) {
  const theme =
    typeof themeInput === "string" ? getSiteTheme(themeInput) : themeInput;
  const variables = cssVariablesToText(createThemeCssVariables(theme, settings));

  return `
    :root {
      ${variables}
    }

    html, body {
      background: var(--site-theme-background) !important;
      color: var(--site-theme-secondary) !important;
      font-family: var(--site-theme-body-font) !important;
    }

    body {
      overflow-x: hidden !important;
    }

    header, nav, [class*="navbar"], [class*="header"] {
      font-family: var(--site-theme-body-font) !important;
    }

    h1, h2, h3, h4, [class*="title"], [class*="heading"] {
      color: var(--site-theme-secondary) !important;
      font-family: var(--site-theme-display-font) !important;
      font-weight: var(--site-theme-heading-weight) !important;
      letter-spacing: var(--site-theme-letter-spacing) !important;
    }

    p, li, span {
      font-family: var(--site-theme-body-font) !important;
    }

    main section,
    [class*="section"] {
      border-radius: var(--site-theme-section-radius);
    }

    [class*="card"],
    article {
      border-radius: var(--site-theme-card-radius) !important;
    }

    button,
    [class*="btn"],
    [class*="button"],
    a[class*="btn"],
    a[class*="button"] {
      border-radius: var(--site-theme-button-radius) !important;
      text-transform: var(--site-theme-button-transform) !important;
    }

    [class*="primary"],
    button[class*="primary"],
    a[class*="primary"] {
      background-color: var(--site-theme-primary) !important;
    }

    [class*="edit"],
    [data-builder-section-target] > button,
    .navbar-logo-edit-button {
      display: none !important;
    }
  `;
}
