import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_SITE_THEME_KEY,
  SITE_THEMES,
  createThemeCssVariables,
  createThemePreviewStyles,
  getSiteTheme,
  normalizeThemeColours,
} from "../../theme/siteThemes";
import "../../styles/builder-theme-panel.css";

const EMPTY_PAGES = Object.freeze([]);
const EMPTY_SETTINGS = Object.freeze({});

function normalizeSlug(slug = "/") {
  const clean = String(slug || "/")
    .split("?")[0]
    .split("#")[0]
    .replace(/^\/+|\/+$/g, "");

  if (!clean || clean.toLowerCase() === "home") return "/";

  return `/${clean}`;
}

function isVisiblePage(page = {}) {
  return page?.is_visible !== false && page?.visible !== false;
}

function uniquePreviewPages(pages = [], currentPageData = null) {
  const source = Array.isArray(pages) ? pages.filter(isVisiblePage) : [];
  const candidates = [
    currentPageData,
    source.find((page) => normalizeSlug(page?.slug) === "/"),
    ...source,
  ].filter(Boolean);

  const seen = new Set();
  const result = [];

  candidates.forEach((page) => {
    const slug = normalizeSlug(page?.slug || "/");

    if (seen.has(slug)) return;

    seen.add(slug);
    result.push({
      id: page?.id || slug,
      slug,
      title: page?.title || page?.name || (slug === "/" ? "Home" : slug.slice(1)),
    });
  });

  if (!result.length) {
    result.push({ id: "home", slug: "/", title: "Home" });
  }

  return result.slice(0, 6);
}

function buildSitePreviewUrl(siteId, slug = "/") {
  if (!siteId) return "";

  const path = normalizeSlug(slug) === "/" ? "" : normalizeSlug(slug);

  return `/#/site/${siteId}${path}?builder=1&mini=1&themeGallery=1`;
}

function MiniPreviewFallback({ theme, settings }) {
  const variables = createThemeCssVariables(theme, settings);

  return (
    <div className="btp-fallback-preview" style={variables}>
      <div className="btp-fallback-top">
        <span />
        <span />
        <span />
      </div>

      <div className="btp-fallback-nav">
        <b />
        <i />
        <i />
        <i />
      </div>

      <div className="btp-fallback-hero">
        <small>Live website preview</small>
        <strong>Heading style</strong>
        <span />
        <button type="button" tabIndex={-1}>
          Action
        </button>
      </div>

      <div className="btp-fallback-grid">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function ThemePreviewCard({
  theme,
  active,
  applying,
  siteId,
  page,
  settings,
  onApply,
}) {
  const iframeRef = useRef(null);
  const previewUrl = buildSitePreviewUrl(siteId, page?.slug || "/");

  const applyPreviewStyles = () => {
    const frame = iframeRef.current;

    if (!frame) return;

    try {
      const documentRef = frame.contentDocument;

      if (!documentRef?.head || !documentRef?.documentElement) return;

      documentRef.documentElement.setAttribute(
        "data-site-theme-preview",
        theme.key,
      );

      let styleTag = documentRef.getElementById("builder-theme-card-preview");

      if (!styleTag) {
        styleTag = documentRef.createElement("style");
        styleTag.id = "builder-theme-card-preview";
        documentRef.head.appendChild(styleTag);
      }

      styleTag.textContent = createThemePreviewStyles(theme, settings);
    } catch (error) {
      // Same-origin preview is expected in the builder. Fallback UI remains
      // available when browser restrictions block thumbnail access.
    }
  };

  useEffect(() => {
    applyPreviewStyles();
    // Theme/colour changes should refresh only preview styling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    theme.key,
    settings?.primary_color,
    settings?.secondary_color,
    settings?.background_color,
    previewUrl,
  ]);

  return (
    <article className={`btp-theme-card ${active ? "is-selected" : ""}`}>
      <button
        type="button"
        className="btp-card-select"
        onClick={() => onApply(theme)}
        aria-pressed={active}
        aria-label={`Apply ${theme.name} theme`}
        disabled={applying}
      >
        <div className="btp-card-preview">
          {previewUrl ? (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title={`${theme.name} ${page?.title || "page"} preview`}
              loading="lazy"
              tabIndex={-1}
              onLoad={applyPreviewStyles}
            />
          ) : (
            <MiniPreviewFallback theme={theme} settings={settings} />
          )}
        </div>

        <div className="btp-card-copy">
          <div>
            <strong>{theme.name}</strong>
            <small>{theme.description}</small>
          </div>

          <span className="btp-selected-check" aria-hidden="true">
            {active ? "✓" : ""}
          </span>
        </div>

        <div className="btp-tags">
          {theme.recommendedFor.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </button>
    </article>
  );
}

export default function ThemePanel({
  siteId = "",
  layoutKey = "",
  templateKey = "",
  pages = EMPTY_PAGES,
  currentPageData = null,
  siteSettings = EMPTY_SETTINGS,
  onUpdateTheme,
  onUpdateSettings,
  onChange,
}) {
  const resolvedSiteId = siteId || siteSettings?.site_id || "";
  const selectedFromSettings =
    siteSettings?.theme_name || DEFAULT_SITE_THEME_KEY;

  const [selectedThemeKey, setSelectedThemeKey] = useState(selectedFromSettings);
  const [previewPageSlug, setPreviewPageSlug] = useState(
    normalizeSlug(currentPageData?.slug || "/"),
  );
  const [saveState, setSaveState] = useState("saved");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const saveSequenceRef = useRef(0);
  const noticeTimeoutRef = useRef(null);

  const previewPages = useMemo(
    () => uniquePreviewPages(pages, currentPageData),
    [pages, currentPageData],
  );

  const selectedTheme = useMemo(
    () => getSiteTheme(selectedThemeKey),
    [selectedThemeKey],
  );

  const colours = useMemo(
    () => normalizeThemeColours(siteSettings),
    [
      siteSettings?.primary_color,
      siteSettings?.secondary_color,
      siteSettings?.background_color,
    ],
  );

  const selectedPreviewPage =
    previewPages.find((page) => page.slug === previewPageSlug) ||
    previewPages[0];

  useEffect(() => {
    setSelectedThemeKey(selectedFromSettings);
  }, [selectedFromSettings]);

  useEffect(() => {
    const available = previewPages.some(
      (page) => page.slug === previewPageSlug,
    );

    if (!available && previewPages[0]) {
      setPreviewPageSlug(previewPages[0].slug);
    }
  }, [previewPages, previewPageSlug]);

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) {
        window.clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  const showNotice = (message) => {
    setNotice(message);

    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current);
    }

    noticeTimeoutRef.current = window.setTimeout(() => {
      setNotice("");
    }, 3000);
  };

  const applyTheme = async (theme) => {
    if (!theme?.key || theme.key === selectedThemeKey) return;

    const handler =
      typeof onUpdateTheme === "function"
        ? onUpdateTheme
        : typeof onChange === "function"
          ? onChange
          : onUpdateSettings;

    if (typeof handler !== "function") {
      setSaveState("error");
      setError("No theme save handler is connected to this panel.");
      return;
    }

    const previousThemeKey = selectedThemeKey;
    const sequence = saveSequenceRef.current + 1;

    saveSequenceRef.current = sequence;
    setSelectedThemeKey(theme.key);
    setSaveState("saving");
    setNotice("");
    setError("");

    try {
      /*
        Keep persistence compatible with the current database: theme_name is
        the only required saved field. The central renderer can resolve all
        theme tokens from this key.
      */
      const result = await Promise.resolve(
        handler({
          theme_name: theme.key,
        }),
      );

      if (saveSequenceRef.current !== sequence) return;

      if (result === false) {
        throw new Error("Theme update was not saved.");
      }

      setSaveState("saved");
      showNotice(`${theme.name} theme applied.`);
    } catch (saveError) {
      console.error("ThemePanel save error:", saveError);

      if (saveSequenceRef.current !== sequence) return;

      setSelectedThemeKey(previousThemeKey);
      setSaveState("error");
      setError("Theme could not be saved. Please try again.");
    }
  };

  return (
    <section className="btp-root" aria-label="Website themes">
      <header className="btp-header">
        <div>
          <span className="btp-eyebrow">Theme</span>
          <h3>Try a New Look</h3>
          <p>
            Preview your real website content in a new design before applying
            it across the site.
          </p>
        </div>

        <div className={`btp-save-state is-${saveState}`} aria-live="polite">
          <span aria-hidden="true" />
          {saveState === "saving"
            ? "Saving"
            : saveState === "error"
              ? "Error"
              : "Saved"}
        </div>
      </header>

      <div className="btp-current-theme">
        <span>Current theme</span>
        <strong>{selectedTheme.name}</strong>
        <small>{selectedTheme.description}</small>
        <span>Current preview page</span>
        <strong>{selectedPreviewPage?.title || currentPageData?.title || "Current Page"}</strong>
      </div>

      {notice && <div className="btp-notice">{notice}</div>}
      {error && <div className="btp-error">{error}</div>}

      <section className="btp-preview-page">
        <div className="btp-block-title">
          <h4>Preview Page</h4>
          <p>
            Every style below uses the same selected page and website content.
          </p>
        </div>

        <div className="btp-page-selector">
          {previewPages.map((page) => (
            <button
              type="button"
              key={page.id || page.slug}
              className={page.slug === selectedPreviewPage?.slug ? "is-active" : ""}
              onClick={() => setPreviewPageSlug(page.slug)}
            >
              {page.title}
            </button>
          ))}
        </div>
      </section>

      <section className="btp-gallery">
        <div className="btp-block-title">
          <h4>Theme Gallery</h4>
          <p>
            Themes change the site-wide visual style while keeping your pages
            and content in place.
          </p>
        </div>

        <div className="btp-theme-grid">
          {SITE_THEMES.map((theme) => (
            <ThemePreviewCard
              key={theme.key}
              theme={theme}
              active={theme.key === selectedThemeKey}
              applying={saveState === "saving"}
              siteId={resolvedSiteId}
              page={selectedPreviewPage}
              settings={colours}
              onApply={applyTheme}
            />
          ))}
        </div>
      </section>

      <footer className="btp-footer">
        <div className="btp-guidance">
          <strong>Recommended structure</strong>
          <p>
            Templates control page structure. Themes control typography,
            spacing, buttons and visual character. Colours remain managed in
            Website Colours.
          </p>
        </div>

        {(layoutKey || templateKey) && (
          <p className="btp-context">
            Template context: {layoutKey || "website"}
            {templateKey ? ` / ${templateKey}` : ""}
          </p>
        )}
      </footer>
    </section>
  );
}
