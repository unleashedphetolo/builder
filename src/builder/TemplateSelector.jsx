import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiActivity,
  FiBookOpen,
  FiBriefcase,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCoffee,
  FiCpu,
  FiGrid,
  FiHeart,
  FiHome,
  FiLayers,
  FiMonitor,
  FiPenTool,
  FiShield,
  FiShoppingBag,
  FiSmartphone,
  FiTablet,
  FiTruck,
  FiUser,
} from "react-icons/fi";
import "../styles/templateSelector.css";

const RECOMMENDED_LAYOUTS = [
  "all",
  "school",
  "business",
  "portfolio",
  "health",
  "agriculture",
  "construction",
  "technology",
  "ecommerce",
  "real-estate",
  "restaurant",
  "beauty",
  "law",
  "nonprofit",
];

const CATEGORY_LABELS = {
  all: "All",
  school: "School",
  business: "Business",
  portfolio: "Portfolio",
  health: "Health",
  agriculture: "Agriculture",
  construction: "Construction",
  technology: "Technology",
  ecommerce: "E-Commerce",
  "real-estate": "Real Estate",
  restaurant: "Restaurant",
  beauty: "Beauty",
  law: "Legal",
  nonprofit: "Nonprofit",
};

const CATEGORY_ICONS = {
  all: FiGrid,
  school: FiBookOpen,
  business: FiBriefcase,
  portfolio: FiUser,
  health: FiHeart,
  agriculture: FiLayers,
  construction: FiHome,
  technology: FiCpu,
  ecommerce: FiShoppingBag,
  "real-estate": FiHome,
  restaurant: FiCoffee,
  beauty: FiPenTool,
  law: FiShield,
  nonprofit: FiActivity,
};

const CATEGORY_STYLES = {
  all: {
    color: "#4f46e5",
    background: "#eef2ff",
    border: "#c7d2fe",
  },
  school: {
    color: "#2563eb",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  business: {
    color: "#0f766e",
    background: "#ecfdf5",
    border: "#99f6e4",
  },
  portfolio: {
    color: "#7c3aed",
    background: "#f5f3ff",
    border: "#ddd6fe",
  },
  health: {
    color: "#dc2626",
    background: "#fef2f2",
    border: "#fecaca",
  },
  agriculture: {
    color: "#15803d",
    background: "#f0fdf4",
    border: "#bbf7d0",
  },
  construction: {
    color: "#ca8a04",
    background: "#fefce8",
    border: "#fde68a",
  },
  technology: {
    color: "#0284c7",
    background: "#f0f9ff",
    border: "#bae6fd",
  },
  ecommerce: {
    color: "#ea580c",
    background: "#fff7ed",
    border: "#fed7aa",
  },
  "real-estate": {
    color: "#475569",
    background: "#f8fafc",
    border: "#cbd5e1",
  },
  restaurant: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
  },
  beauty: {
    color: "#db2777",
    background: "#fdf2f8",
    border: "#fbcfe8",
  },
  law: {
    color: "#1e3a8a",
    background: "#eff6ff",
    border: "#bfdbfe",
  },
  nonprofit: {
    color: "#059669",
    background: "#ecfdf5",
    border: "#a7f3d0",
  },
};

/**
 * TemplateSelector (Marketplace)
 * - Shows saved category/template from database when provided by Builder.jsx
 * - Search works inside the active category first
 * - If no category result, it shows close matches from all templates
 * - Exit button is optional via onClose
 */
export default function TemplateSelector({
  templates = [],
  onSelect,
  onClose,
  defaultLayout,
  selectedLayoutKey,
  selectedTemplateKey,
  error,
}) {
  const availableLayouts = useMemo(() => {
    const layouts = new Set(RECOMMENDED_LAYOUTS);

    (templates || [])
      .map((template) => template.layout_key)
      .filter(Boolean)
      .forEach((layoutKey) => layouts.add(layoutKey));

    return Array.from(layouts);
  }, [templates]);

  const getInitialLayout = () => {
    const savedLayout = selectedLayoutKey || defaultLayout;

    if (savedLayout && availableLayouts.includes(savedLayout)) {
      return savedLayout;
    }

    return availableLayouts.includes("all") ? "all" : availableLayouts[0] || "";
  };

  const [tab, setTab] = useState(getInitialLayout);
  const [search, setSearch] = useState("");
  const tabsScrollRef = useRef(null);

  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [applyingTemplateKey, setApplyingTemplateKey] = useState("");
  const [applyingProgress, setApplyingProgress] = useState(0);

  const [previewDevice, setPreviewDevice] = useState(() => {
    if (typeof window === "undefined") return "desktop";

    return (
      window.localStorage.getItem("ulterspace_template_preview_device") ||
      "desktop"
    );
  });

  const [previewCache, setPreviewCache] = useState(() => {
    if (typeof window === "undefined") return {};

    try {
      return JSON.parse(
        window.localStorage.getItem("ulterspace_template_preview_cache") ||
          "{}",
      );
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const savedLayout = selectedLayoutKey || defaultLayout;

    if (savedLayout && availableLayouts.includes(savedLayout)) {
      setTab(savedLayout);
    }
  }, [selectedLayoutKey, defaultLayout, availableLayouts]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      "ulterspace_template_preview_device",
      previewDevice,
    );
  }, [previewDevice]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(
      "ulterspace_template_preview_cache",
      JSON.stringify(previewCache || {}),
    );
  }, [previewCache]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lastPreviewKey = window.localStorage.getItem(
      "ulterspace_last_preview_template_key",
    );

    if (!lastPreviewKey) return;

    const cachedTemplate = (templates || []).find(
      (template) => template.template_key === lastPreviewKey,
    );

    if (cachedTemplate) {
      const previewUrl = getLivePreviewUrl(cachedTemplate);

      setPreviewCache((prev) => ({
        ...(prev || {}),
        [cachedTemplate.template_key]: previewUrl,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates]);

  useEffect(() => {
    if (!applyingTemplateKey) {
      setApplyingProgress(0);
      return;
    }

    setApplyingProgress(12);

    const interval = window.setInterval(() => {
      setApplyingProgress((prev) => {
        if (prev < 28) return prev + 8;
        if (prev < 52) return prev + 6;
        if (prev < 76) return prev + 4;
        if (prev < 92) return prev + 2;
        return 92;
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [applyingTemplateKey]);

  useEffect(() => {
    if (!error) return;

    setApplyingTemplateKey("");
    setApplyingProgress(0);
  }, [error]);

  const cleanSearch = search.trim().toLowerCase();

  const getCategoryLabel = (layoutKey) => {
    return (
      CATEGORY_LABELS[layoutKey] ||
      String(layoutKey || "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    );
  };

  const getCategoryIcon = (layoutKey) => {
    return CATEGORY_ICONS[layoutKey] || FiTruck;
  };

  const getCategoryStyle = (layoutKey) => {
    return (
      CATEGORY_STYLES[layoutKey] || {
        color: "#334155",
        background: "#f8fafc",
        border: "#cbd5e1",
      }
    );
  };

  const getTemplateCacheKey = (template) => {
    return (
      template?.updated_at ||
      template?.updatedAt ||
      template?.modified_at ||
      template?.last_modified ||
      template?.template_updated_at ||
      template?.created_at ||
      template?.template_key ||
      "1"
    );
  };

  const getLivePreviewUrl = (template) => {
    if (!template?.layout_key || !template?.template_key) return "";

    const cacheKey = getTemplateCacheKey(template);

    return `/?preview_v=${encodeURIComponent(
      cacheKey,
    )}#/template-preview/${template.layout_key}/${template.template_key}?mini=1`;
  };

  const getFullPreviewUrl = (template) => {
    if (!template?.layout_key || !template?.template_key) return "";

    const cacheKey = getTemplateCacheKey(template);

    return `/?preview_v=${encodeURIComponent(
      cacheKey,
    )}#/template-preview/${template.layout_key}/${template.template_key}?preview=1`;
  };

  const getTemplateScore = (template, query) => {
    if (!query) return 1;

    const name = String(template?.name || "").toLowerCase();
    const description = String(template?.description || "").toLowerCase();
    const layout = String(template?.layout_key || "").toLowerCase();
    const templateKey = String(template?.template_key || "").toLowerCase();
    const tags = Array.isArray(template?.tags)
      ? template.tags.join(" ").toLowerCase()
      : "";

    const haystack = [name, description, layout, templateKey, tags]
      .filter(Boolean)
      .join(" ");

    const words = query.split(/\s+/).filter(Boolean);

    let score = 0;

    if (name === query) score += 120;
    if (templateKey === query) score += 110;
    if (layout === query) score += 90;
    if (tags.split(/\s+/).includes(query)) score += 80;
    if (name.startsWith(query)) score += 70;
    if (name.includes(query)) score += 60;
    if (templateKey.includes(query)) score += 50;
    if (tags.includes(query)) score += 40;
    if (description.includes(query)) score += 30;
    if (haystack.includes(query)) score += 20;

    const matchedWords = words.filter((word) => haystack.includes(word));
    score += matchedWords.length * 10;

    return score;
  };

  const categoryList = useMemo(() => {
    if (tab === "all") return templates || [];

    return (templates || []).filter((template) => template.layout_key === tab);
  }, [templates, tab]);

  const categoryResults = useMemo(() => {
    if (!cleanSearch) return categoryList;

    return categoryList
      .map((template) => ({
        template,
        score: getTemplateScore(template, cleanSearch),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.template);
  }, [categoryList, cleanSearch]);

  const closeMatches = useMemo(() => {
    if (!cleanSearch) return [];

    return (templates || [])
      .map((template) => ({
        template,
        score: getTemplateScore(template, cleanSearch),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.template);
  }, [templates, cleanSearch]);

  const list = useMemo(() => {
    if (!cleanSearch) return categoryList;

    if (categoryResults.length) return categoryResults;

    return closeMatches;
  }, [cleanSearch, categoryList, categoryResults, closeMatches]);

  const isShowingCloseMatches =
    cleanSearch && categoryResults.length === 0 && closeMatches.length > 0;

  const handleUseTemplate = (template, options = {}) => {
    if (!template?.layout_key || !template?.template_key) return;
    if (applyingTemplateKey) return;

    const shouldClosePreview = options.closePreview !== false;

    setApplyingTemplateKey(template.template_key);
    setApplyingProgress(12);

    if (shouldClosePreview) {
      setPreviewTemplate(null);
    }

    window.requestAnimationFrame(() => {
      onSelect?.({
        layout_key: template.layout_key,
        template_key: template.template_key,
      });
    });
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleChangeCategory = (nextTab) => {
    setTab(nextTab);
    setSearch("");
  };

  const handleCloseSelector = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const scrollTemplateTabs = (direction) => {
    const node = tabsScrollRef.current;

    if (!node) return;

    const scrollAmount = Math.max(280, Math.floor(node.clientWidth * 0.62));

    node.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleOpenPreview = (template) => {
    if (!template) return;

    const fullPreviewUrl = getFullPreviewUrl(template);
    const miniPreviewUrl = getLivePreviewUrl(template);

    setPreviewCache((prev) => ({
      ...(prev || {}),
      [template.template_key]: fullPreviewUrl || miniPreviewUrl,
      [`${template.template_key}:mini`]: miniPreviewUrl,
    }));

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "ulterspace_last_preview_template_key",
        template.template_key,
      );
    }

    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    if (applyingTemplateKey) return;

    setPreviewTemplate(null);
  };

  const handleStartFromPreview = () => {
    if (!previewTemplate) return;

    handleUseTemplate(previewTemplate, {
      closePreview: false,
    });
  };

  const getPreviewFrameWidth = () => {
    if (previewDevice === "mobile") return "390px";
    if (previewDevice === "tablet") return "820px";
    return "100%";
  };

  const getPreviewFrameRadius = () => {
    if (previewDevice === "desktop") return "0";
    return "24px";
  };

  const getPreviewFrameHeight = () => {
    if (previewDevice === "mobile") return "calc(100vh - 96px)";
    if (previewDevice === "tablet") return "calc(100vh - 108px)";
    return "calc(100vh - 74px)";
  };

  const previewUrl = previewTemplate
    ? previewCache?.[previewTemplate.template_key] ||
      getFullPreviewUrl(previewTemplate) ||
      getLivePreviewUrl(previewTemplate)
    : "";

  const ApplyProgress = ({ compact = false }) => (
    <span
      className={
        compact ? "template-apply-progress compact" : "template-apply-progress"
      }
    >
      <span className="template-apply-progress-top">
        <span>Completing</span>
        <strong>{applyingProgress}%</strong>
      </span>

      <span className="template-apply-progress-track">
        <span
          className="template-apply-progress-fill"
          style={{ width: `${applyingProgress}%` }}
        />
      </span>
    </span>
  );

  return (
    <div className="template-modal">
      <style>
        {`
          .template-modal-inner {
            position: relative !important;
          }

          .template-modal-inner.is-maximized {
            width: calc(100vw - 28px) !important;
            height: calc(100vh - 28px) !important;
            max-height: calc(100vh - 28px) !important;
            border-radius: 18px !important;
          }

          .template-modal-close-only {
            position: absolute !important;
            top: 14px !important;
            right: 14px !important;
            z-index: 30 !important;
            width: 42px;
            height: 38px;
            border: 1px solid rgba(148, 163, 184, 0.38);
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.94);
            color: #334155;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            cursor: pointer;
            font-size: 25px;
            line-height: 1;
            font-weight: 700;
            box-shadow:
              0 10px 22px rgba(15, 23, 42, 0.11),
              inset 0 1px 0 rgba(255, 255, 255, 0.78);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            transition:
              background 0.14s ease,
              color 0.14s ease,
              border-color 0.14s ease;
          }

          .template-modal-close-only:hover,
          .template-modal-close-only:focus-visible {
            background: #dc2626;
            border-color: #dc2626;
            color: #ffffff;
            outline: none;
          }

          .template-header {
            padding-right: 72px !important;
          }

          @media (max-width: 720px) {
            .template-modal-inner.is-maximized {
              width: calc(100vw - 16px) !important;
              height: calc(100vh - 16px) !important;
              max-height: calc(100vh - 16px) !important;
              border-radius: 16px !important;
            }

            .template-modal-close-only {
              top: 10px !important;
              right: 10px !important;
              width: 38px;
              height: 36px;
              border-radius: 10px;
              font-size: 23px;
            }

            .template-header {
              padding-right: 54px !important;
            }
          }

          .template-preview-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            animation: templatePreviewFadeIn 140ms ease-out;
          }

          @keyframes templatePreviewFadeIn {
            from {
              opacity: 0;
              transform: translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .template-preview-toolbar {
            min-height: 74px;
            padding: 12px 20px;
            background: rgba(255, 255, 255, 0.96);
            border-bottom: 1px solid #e2e8f0;
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 18px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
            backdrop-filter: blur(14px);
          }

          .template-preview-left {
            display: flex;
            align-items: center;
            gap: 16px;
            min-width: 0;
          }

          .template-preview-back {
            border: 0;
            background: transparent;
            color: #0f172a;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            height: 38px;
            font-size: 14px;
            line-height: 1;
            font-weight: 750;
            cursor: pointer;
            padding: 0;
          }

          .template-preview-back:disabled {
            opacity: 0.55;
            cursor: wait;
          }

          .template-preview-back-icon {
            width: 22px;
            height: 22px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
          }

          .template-preview-back-icon svg {
            width: 22px;
            height: 22px;
            stroke-width: 2.4;
          }

          .template-preview-devices {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .template-preview-device-btn {
            width: 36px;
            height: 34px;
            border-radius: 10px;
            border: 1px solid transparent;
            background: transparent;
            color: #334155;
            cursor: pointer;
            font-size: 17px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .template-preview-device-btn svg {
            width: 18px;
            height: 18px;
            stroke-width: 2.4;
          }

          .template-preview-device-btn.active {
            background: #eff6ff;
            border-color: #bfdbfe;
            color: #0284c7;
          }

          .template-preview-center {
            min-width: 0;
            text-align: center;
            color: #111827;
            font-size: 13px;
            font-weight: 750;
            white-space: nowrap;
          }

          .template-preview-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 18px;
            min-width: 0;
          }

          .template-preview-note {
            color: #111827;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
          }

          .template-preview-start-btn {
            border: 0;
            border-radius: 10px;
            background: #111111;
            color: #ffffff;
            padding: 13px 20px;
            font-size: 14px;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
            white-space: nowrap;
            min-width: 206px;
            min-height: 47px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .template-preview-start-btn:disabled,
          .template-actions .btn:disabled {
            opacity: 0.88;
            cursor: wait;
          }

          .template-apply-progress {
            width: 100%;
            min-width: 150px;
            display: grid;
            gap: 5px;
          }

          .template-apply-progress.compact {
            min-width: 128px;
          }

          .template-apply-progress-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            font-size: 11px;
            line-height: 1;
            font-weight: 900;
          }

          .template-apply-progress-top strong {
            font-size: 11px;
            font-weight: 950;
          }

          .template-apply-progress-track {
            width: 100%;
            height: 5px;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.28);
          }

          .btn.primary .template-apply-progress-track {
            background: rgba(8, 8, 8, 0.34);
          }

          .template-apply-progress-fill {
            display: block;
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, #ffffff, #76faa4, #30d2e7);
            transition: width 180ms ease;
          }

          .template-preview-stage {
            flex: 1;
            min-height: 0;
            overflow: auto;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background:
              radial-gradient(circle at top, rgba(37, 99, 235, 0.06), transparent 34%),
              #e5e7eb;
          }

          .template-preview-frame-shell {
            width: 100%;
            min-height: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 0;
          }

          .template-preview-device-shell {
            position: relative;
            overflow: hidden;
            background: #ffffff;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.22);
            transition: none !important;
          }

          .template-preview-device-frame {
            width: 100%;
            height: 100%;
            border: 0;
            background: #ffffff;
            display: block;
            transition: none !important;
          }

          .template-device-window-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 5;
            height: 30px;
            overflow: hidden;
            border: 1px solid rgba(148, 163, 184, 0.32);
            border-radius: 999px;
            background: rgba(226, 232, 240, 0.78);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            display: inline-flex;
            align-items: center;
            box-shadow:
              0 12px 26px rgba(15, 23, 42, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.62);
            pointer-events: none;
          }

          .template-device-window-control {
            width: 38px;
            height: 30px;
            color: #334155;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            line-height: 1;
            font-weight: 700;
          }

          .template-device-window-control + .template-device-window-control {
            border-left: 1px solid rgba(148, 163, 184, 0.24);
          }

          .template-device-window-control.minimize {
            font-size: 18px;
            transform: translateY(-1px);
          }

          .template-device-window-control.maximize {
            font-size: 13px;
          }

          .template-device-window-control.close {
            color: #64748b;
            font-size: 16px;
          }

          .template-preview-device-shell.is-mobile .template-device-window-controls {
            display: none;
          }

          .template-preview-device-shell.is-tablet .template-device-window-controls {
            top: 8px;
            right: 8px;
            transform: scale(0.9);
            transform-origin: top right;
          }

          .template-preview-card-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            width: 100%;
          }

          .template-tabs button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
          }

          .template-tab-icon,
          .template-tab-chevron {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }

          .template-tab-icon svg {
            width: 15px;
            height: 15px;
            stroke-width: 2.35;
          }

          .template-tab-chevron {
            opacity: 0.62;
          }

          .template-tab-chevron svg {
            width: 13px;
            height: 13px;
            stroke-width: 2.4;
          }

          .template-tabs-shell {
            width: 100%;
            max-width: 100%;
            margin-top: 18px;
            padding: 8px;
            border: 1px solid #dbe4f0;
            border-radius: 20px;
            background: linear-gradient(180deg, #ffffff, #f8fafc);
            display: grid;
            grid-template-columns: 42px minmax(0, 1fr) 42px;
            align-items: stretch;
            gap: 8px;
            box-shadow: 0 12px 30px rgba(15, 23, 42, 0.055);
          }

          .template-tabs {
            width: 100% !important;
            max-width: 100% !important;
            margin-top: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            border-radius: 0 !important;
            background: transparent !important;
            display: flex !important;
            flex-wrap: nowrap !important;
            align-items: stretch !important;
            gap: 10px !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            scroll-behavior: smooth;
            scrollbar-width: none;
          }

          .template-tabs::-webkit-scrollbar {
            display: none;
          }

          .template-tabs-scroll {
            width: 42px;
            min-height: 70px;
            border: 1px solid #dbe4f0;
            border-radius: 16px;
            background: #ffffff;
            color: #334155;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 10px 22px rgba(15, 23, 42, 0.075);
            transition:
              background 0.18s ease,
              border-color 0.18s ease,
              color 0.18s ease,
              transform 0.18s ease;
          }

          .template-tabs-scroll svg {
            width: 21px;
            height: 21px;
            stroke-width: 2.7;
          }

          .template-tabs-scroll:hover,
          .template-tabs-scroll:focus-visible {
            background: #eff6ff;
            border-color: #bfdbfe;
            color: #2563eb;
            outline: none;
            transform: translateY(-1px);
          }

          .template-tab-btn {
            --template-category-color: #334155;
            --template-category-bg: #f8fafc;
            --template-category-border: #cbd5e1;

            flex: 0 0 106px !important;
            min-height: 70px;
            padding: 9px 10px !important;
            border: 1px solid var(--template-category-border) !important;
            border-radius: 17px !important;
            background:
              radial-gradient(circle at top left, rgba(255, 255, 255, 0.92), transparent 44%),
              var(--template-category-bg) !important;
            color: var(--template-category-color) !important;
            display: inline-flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
            white-space: nowrap !important;
            font-weight: 900 !important;
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.78),
              0 8px 18px rgba(15, 23, 42, 0.045);
          }

          .template-tab-btn:hover,
          .template-tab-btn:focus-visible {
            border-color: color-mix(in srgb, var(--template-category-color) 44%, var(--template-category-border)) !important;
            background:
              radial-gradient(circle at top left, rgba(255, 255, 255, 0.96), transparent 44%),
              color-mix(in srgb, var(--template-category-bg) 88%, #ffffff) !important;
            outline: none;
            transform: translateY(-1px);
          }

          .template-tab-btn.active {
            background:
              radial-gradient(circle at top left, rgba(255, 255, 255, 0.18), transparent 42%),
              var(--template-category-color) !important;
            border-color: var(--template-category-color) !important;
            color: #ffffff !important;
            box-shadow:
              0 12px 26px color-mix(in srgb, var(--template-category-color) 28%, transparent),
              inset 0 1px 0 rgba(255, 255, 255, 0.18);
          }

          .template-tab-visual {
            position: relative;
            width: 33px;
            height: 33px;
            border-radius: 13px;
            background: #ffffff;
            color: var(--template-category-color);
            border: 1px solid color-mix(in srgb, var(--template-category-color) 24%, #ffffff);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow:
              0 7px 16px rgba(15, 23, 42, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
          }

          .template-tab-btn.active .template-tab-visual {
            color: var(--template-category-color);
            background: #ffffff;
            border-color: rgba(255, 255, 255, 0.72);
          }

          .template-tab-icon svg {
            width: 17px;
            height: 17px;
            stroke-width: 2.55;
          }

          .template-tab-label {
            max-width: 94px;
            overflow: hidden;
            text-align: center;
            color: inherit;
            font-size: 11px;
            line-height: 1.05;
            font-weight: 950;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .template-tab-chevron {
            position: absolute;
            right: -5px;
            bottom: -5px;
            width: 16px;
            height: 16px;
            border-radius: 999px;
            background: var(--template-category-color);
            color: #ffffff;
            opacity: 1;
            border: 1px solid #ffffff;
            box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
          }

          .template-tab-btn.active .template-tab-chevron {
            background: #ffffff;
            color: var(--template-category-color);
          }

          .template-tab-chevron svg {
            width: 10px;
            height: 10px;
            stroke-width: 3;
          }

          .template-actions .btn.secondary {
            border: 1px solid #dbeafe;
            background: #eff6ff;
            color: #1d4ed8;
            font-weight: 850;
          }

          @media (max-width: 768px) {
            .template-preview-toolbar {
              min-height: 96px;
              padding: 18px 18px;
              grid-template-columns: auto 1fr;
              gap: 10px;
            }

            .template-preview-back {
              height: 52px;
              font-size: 28px;
              font-weight: 500;
              gap: 9px;
            }

            .template-preview-back-icon {
              width: 42px;
              height: 42px;
            }

            .template-preview-back-icon svg {
              width: 42px;
              height: 42px;
              stroke-width: 1.8;
            }

            .template-preview-center,
            .template-preview-devices,
            .template-preview-note {
              display: none;
            }

            .template-preview-right {
              justify-content: flex-end;
            }

            .template-preview-start-btn {
              border-radius: 14px;
              padding: 14px 18px;
              font-size: 16px;
              font-weight: 950;
              min-width: 184px;
              min-height: 62px;
            }

            .template-preview-stage {
              background: #ffffff;
            }

            .template-preview-frame-shell {
              padding: 0;
            }

            .template-preview-device-shell {
              width: 100% !important;
              max-width: 100% !important;
              height: calc(100vh - 96px) !important;
              border-radius: 0 !important;
              box-shadow: none;
            }

            .template-device-window-controls {
              display: none;
            }

            .template-preview-card-actions {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 420px) {
            .template-preview-toolbar {
              padding: 14px 14px;
            }

            .template-preview-back {
              height: 44px;
              font-size: 21px;
            }

            .template-preview-back-icon {
              width: 34px;
              height: 34px;
            }

            .template-preview-back-icon svg {
              width: 34px;
              height: 34px;
            }

            .template-preview-start-btn {
              padding: 12px 14px;
              font-size: 14px;
              min-width: 162px;
              min-height: 56px;
            }

            .template-apply-progress {
              min-width: 128px;
            }
          }
        `}
      </style>

      {previewTemplate && (
        <div
          className="template-preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewTemplate.name || "Template"} preview`}
        >
          <div className="template-preview-toolbar">
            <div className="template-preview-left">
              <button
                type="button"
                className="template-preview-back"
                onClick={handleClosePreview}
                disabled={Boolean(applyingTemplateKey)}
              >
                <span className="template-preview-back-icon">
                  <FiChevronLeft />
                </span>
                <span>Back</span>
              </button>

              <div
                className="template-preview-devices"
                aria-label="Preview device size"
              >
                <button
                  type="button"
                  className={`template-preview-device-btn ${
                    previewDevice === "desktop" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (previewDevice !== "desktop") {
                      setPreviewDevice("desktop");
                    }
                  }}
                  title="Desktop preview"
                  aria-label="Desktop preview"
                >
                  <FiMonitor />
                </button>

                <button
                  type="button"
                  className={`template-preview-device-btn ${
                    previewDevice === "tablet" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (previewDevice !== "tablet") {
                      setPreviewDevice("tablet");
                    }
                  }}
                  title="Tablet preview"
                  aria-label="Tablet preview"
                >
                  <FiTablet />
                </button>

                <button
                  type="button"
                  className={`template-preview-device-btn ${
                    previewDevice === "mobile" ? "active" : ""
                  }`}
                  onClick={() => {
                    if (previewDevice !== "mobile") {
                      setPreviewDevice("mobile");
                    }
                  }}
                  title="Mobile preview"
                  aria-label="Mobile preview"
                >
                  <FiSmartphone />
                </button>
              </div>
            </div>

            <div className="template-preview-center">
              {previewTemplate.name || "Template Preview"}
            </div>

            <div className="template-preview-right">
              <button
                type="button"
                className="template-preview-start-btn"
                onClick={handleStartFromPreview}
                disabled={applyingTemplateKey === previewTemplate.template_key}
              >
                {applyingTemplateKey === previewTemplate.template_key ? (
                  <ApplyProgress />
                ) : (
                  "Start with this Template"
                )}
              </button>
            </div>
          </div>

          <div className="template-preview-stage">
            <div className="template-preview-frame-shell">
              {previewUrl ? (
                <div
                  className={`template-preview-device-shell is-${previewDevice}`}
                  style={{
                    width: getPreviewFrameWidth(),
                    maxWidth:
                      previewDevice === "desktop"
                        ? "100%"
                        : getPreviewFrameWidth(),
                    height: getPreviewFrameHeight(),
                    borderRadius: getPreviewFrameRadius(),
                  }}
                >
                  {/* <div
                    className="template-device-window-controls"
                    aria-hidden="true"
                  >
                    <span className="template-device-window-control minimize">
                      −
                    </span>
                    <span className="template-device-window-control maximize">
                      □
                    </span>
                    <span className="template-device-window-control close">
                      ×
                    </span>
                  </div> */}

                  <iframe
                    key={previewTemplate.template_key}
                    src={previewUrl}
                    title={`${previewTemplate.name || "Template"} full preview`}
                    className="template-preview-device-frame"
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="template-live-preview-fallback">
                  <strong>{previewTemplate.name?.slice(0, 1) || "T"}</strong>
                  <span>Preview not available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="template-modal-inner is-maximized">
        {onClose && (
          <button
            type="button"
            className="template-modal-close-only"
            onClick={handleCloseSelector}
            aria-label="Close template selector"
            title="Close"
          >
            ×
          </button>
        )}

        <div className="template-header">
          <div className="template-header-main">
            <span className="template-header-kicker">Template Marketplace</span>

            <h2>Choose a Website Template</h2>

            {/* <p>
              Select a professional template. Your saved website information,
              pages, text, colours and media remain connected to the same site.
            </p> */}
          </div>

          {selectedTemplateKey && (
            <div className="template-current-selection">
              <span style={{ color: "black" }}>Current template</span>
              <strong>{selectedTemplateKey}</strong>
            </div>
          )}

          {error && <div className="template-error">{error}</div>}
        </div>

        <div className="template-search-area">
          <label className="template-search-box" aria-label="Search templates">
            <span className="template-search-icon">⌕</span>

            <input
              type="text"
              value={search}
              placeholder="Search templates by name, type, feature or tag..."
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="template-search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
                title="Clear search"
              >
                ×
              </button>
            )}
          </label>
        </div>

        <div className="template-tabs-shell">
          <button
            type="button"
            className="template-tabs-scroll template-tabs-scroll-left"
            onClick={() => scrollTemplateTabs("left")}
            aria-label="Scroll template categories left"
            title="Scroll left"
          >
            <FiChevronLeft />
          </button>

          <div className="template-tabs" ref={tabsScrollRef}>
            {availableLayouts.map((layout) => {
              const CategoryIcon = getCategoryIcon(layout);
              const categoryStyle = getCategoryStyle(layout);

              return (
                <button
                  key={layout}
                  data-layout={layout}
                  className={`template-tab-btn ${tab === layout ? "active" : ""}`}
                  style={{
                    "--template-category-color": categoryStyle.color,
                    "--template-category-bg": categoryStyle.background,
                    "--template-category-border": categoryStyle.border,
                  }}
                  onClick={() => handleChangeCategory(layout)}
                  type="button"
                >
                  <span className="template-tab-visual" aria-hidden="true">
                    <span className="template-tab-icon">
                      <CategoryIcon />
                    </span>

                    {availableLayouts.length > 8 && layout !== "all" && (
                      <span className="template-tab-chevron">
                        <FiChevronDown />
                      </span>
                    )}
                  </span>

                  <span className="template-tab-label">
                    {getCategoryLabel(layout)}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="template-tabs-scroll template-tabs-scroll-right"
            onClick={() => scrollTemplateTabs("right")}
            aria-label="Scroll template categories right"
            title="Scroll right"
          >
            <FiChevronRight />
          </button>
        </div>

        <div className="template-results-summary">
          {!cleanSearch ? (
            <span>
              Showing <strong>{categoryList.length}</strong>{" "}
              {getCategoryLabel(tab)} template
              {categoryList.length === 1 ? "" : "s"}.
            </span>
          ) : isShowingCloseMatches ? (
            <span>
              No direct result in <strong>{getCategoryLabel(tab)}</strong>.
              Showing <strong>{closeMatches.length}</strong> closest match
              {closeMatches.length === 1 ? "" : "es"} from all templates.
            </span>
          ) : (
            <span>
              Search results for <strong>“{search}”</strong>:{" "}
              <strong>{list.length}</strong> result
              {list.length === 1 ? "" : "s"}.
            </span>
          )}
        </div>

        <div className="template-grid">
          {list.length === 0 && (
            <div className="template-empty">
              <p>
                No templates found for <strong>“{search || tab}”</strong>.
              </p>

              {search && (
                <button
                  type="button"
                  className="template-empty-clear"
                  onClick={handleClearSearch}
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {list.map((t) => {
            const livePreviewUrl =
              previewCache?.[`${t.template_key}:mini`] || getLivePreviewUrl(t);
            const isCurrent = selectedTemplateKey === t.template_key;
            const isApplying = applyingTemplateKey === t.template_key;

            return (
              <div
                key={t.template_key}
                className={`template-card ${isCurrent ? "current" : ""}`}
              >
                <div
                  className="template-preview"
                  role="button"
                  tabIndex={0}
                  title={`Preview ${t.name}`}
                  onClick={() => handleOpenPreview(t)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenPreview(t);
                    }
                  }}
                >
                  {livePreviewUrl ? (
                    <iframe
                      src={livePreviewUrl}
                      title={`${t.name} live preview`}
                      className="template-live-preview-frame"
                      loading="eager"
                    />
                  ) : (
                    <div className="template-live-preview-fallback">
                      <strong>{t.name?.slice(0, 1) || "T"}</strong>
                      <span>Live Preview</span>
                    </div>
                  )}
                </div>

                <div className="template-meta">
                  <div className="template-title-row">
                    <h3>{t.name}</h3>
                    <span className={`badge ${isCurrent ? "current" : ""}`}>
                      {isCurrent ? "CURRENT" : "READY"}
                    </span>
                  </div>

                  <p>{t.description || "Professional website template."}</p>

                  <div className="template-tags">
                    <span className="tag">
                      {getCategoryLabel(t.layout_key)}
                    </span>

                    {(t.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="template-actions">
                  <div className="template-preview-card-actions">
                    <button
                      className="btn secondary"
                      onClick={() => handleOpenPreview(t)}
                      type="button"
                      disabled={Boolean(applyingTemplateKey)}
                    >
                      Preview site
                    </button>

                    <button
                      className={`btn primary ${isCurrent ? "current" : ""}`}
                      onClick={() => handleUseTemplate(t)}
                      type="button"
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <ApplyProgress compact />
                      ) : isCurrent ? (
                        "Current Template"
                      ) : (
                        "Use this template"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}