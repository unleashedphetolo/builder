import { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiMonitor,
  FiTablet,
  FiSmartphone,
} from "react-icons/fi";

export default function TemplatePanel({
  layoutKey = "school",
  templates = [],
  templateKey,
  selectedTemplateKey,
  onChangeTemplate,
  onSelectTemplate,
}) {
  const activeTemplateKey = selectedTemplateKey || templateKey;

  const [applyingTemplateKey, setApplyingTemplateKey] = useState("");
  const [applyProgress, setApplyProgress] = useState(0);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewDevice, setPreviewDevice] = useState("desktop");

  useEffect(() => {
    if (!applyingTemplateKey) {
      setApplyProgress(0);
      return;
    }

    setApplyProgress(12);

    const interval = window.setInterval(() => {
      setApplyProgress((prev) => {
        if (prev < 30) return prev + 8;
        if (prev < 56) return prev + 6;
        if (prev < 78) return prev + 4;
        if (prev < 92) return prev + 2;
        return 92;
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [applyingTemplateKey]);

  useEffect(() => {
    if (!applyingTemplateKey) return;

    if (activeTemplateKey === applyingTemplateKey) {
      setApplyProgress(100);

      const timeout = window.setTimeout(() => {
        setApplyingTemplateKey("");
        setApplyProgress(0);
        setPreviewTemplate(null);
      }, 500);

      return () => window.clearTimeout(timeout);
    }
  }, [activeTemplateKey, applyingTemplateKey]);

  const getLivePreviewUrl = (template) => {
    const safeLayoutKey = template.layout_key || layoutKey || "school";
    const safeTemplateKey = template.template_key;

    if (!safeTemplateKey) return "";

    return `#/template-preview/${safeLayoutKey}/${safeTemplateKey}?mini=1`;
  };

  const getFullPreviewUrl = (template) => {
    const safeLayoutKey = template.layout_key || layoutKey || "school";
    const safeTemplateKey = template.template_key;

    if (!safeTemplateKey) return "";

    return `#/template-preview/${safeLayoutKey}/${safeTemplateKey}?preview=1`;
  };

  const handleSelectTemplate = (template) => {
    if (!template?.template_key) return;
    if (applyingTemplateKey) return;

    setApplyingTemplateKey(template.template_key);
    setApplyProgress(12);

    if (onSelectTemplate) {
      onSelectTemplate(template);
    } else if (onChangeTemplate) {
      onChangeTemplate(template.template_key);
    }

    if (window.innerWidth <= 1024) {
      window.dispatchEvent(new CustomEvent("builder:close-sidebar"));
    }
  };

  const handlePreviewTemplate = (event, template) => {
    event.preventDefault();
    event.stopPropagation();

    if (!getFullPreviewUrl(template)) return;

    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    if (applyingTemplateKey) return;
    setPreviewTemplate(null);
  };

  const handleStartFromPreview = () => {
    if (!previewTemplate) return;
    handleSelectTemplate(previewTemplate);
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

  const ProgressBar = () => (
    <span className="template-panel-progress">
      <span className="template-panel-progress-top">
        <span>Completing</span>
        <strong>{applyProgress}%</strong>
      </span>

      <span className="template-panel-progress-track">
        <span
          className="template-panel-progress-fill"
          style={{ width: `${applyProgress}%` }}
        />
      </span>
    </span>
  );

  const previewUrl = previewTemplate ? getFullPreviewUrl(previewTemplate) : "";

  return (
    <div className="panel-shell">
      <style>
        {`
          .template-panel-actions {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 8px;
            align-items: center;
            width: 100%;
            margin-top: 12px;
          }

          .template-preview-action {
            border: 1px solid #5698ee;
            background: #eff6ff;
            color: #1d4ed8;
            border-radius: 999px;
            padding: 8px 11px;
            font-size: 11px;
            font-weight: 850;
            cursor: pointer;
            white-space: nowrap;
          }

          .template-preview-action:hover {
            background: #dbeafe;
          }

          .template-preview-action:disabled {
            opacity: 0.65;
            cursor: wait;
          }

          .template-preview-box {
            position: relative;
          }

          .template-preview-click-layer {
            position: absolute;
            inset: 0;
            z-index: 3;
            border: 0;
            background: transparent;
            cursor: zoom-in;
          }

          .template-use-pill.is-progress {
            min-width: 96px;
            padding: 7px 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .template-panel-progress {
            width: 100%;
            display: grid;
            gap: 5px;
          }

          .template-panel-progress-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            font-size: 10px;
            line-height: 1;
            font-weight: 900;
          }

          .template-panel-progress-top strong {
            font-size: 10px;
            font-weight: 950;
          }

          .template-panel-progress-track {
            width: 100%;
            height: 5px;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(3, 8, 19, 0.12);
          }

          .template-panel-progress-fill {
            display: block;
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, #2563eb, #0e3f20, #040b69);
            transition: width 180ms ease;
          }

          .btn.primary,
          .template-use-pill {
            border: none;
            border-radius: 999px;
            background-color: #3fc01f;
            color: #ffffff;
            padding: 10px 16px;
            font-size: 13px;
            font-weight: 900;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-height: 38px;
            transition:
              transform 160ms ease,
              box-shadow 160ms ease,
              opacity 160ms ease;
          }

          .btn.primary:hover,
          .template-use-pill:hover {
            transform: translateY(-1px);
          }

          .btn.primary:active,
          .template-use-pill:active {
            transform: translateY(0);
          }

          .btn.primary.current,
          .template-use-pill.current {
            background-color: #4deb25;
            border: 1px solid #030e01;
          }

          .btn.primary:disabled,
          .template-use-pill.is-progress {
            opacity: 0.85;
            cursor: wait;
          }

          .template-panel-preview-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            animation: templatePanelPreviewFadeIn 140ms ease-out;
          }

          @keyframes templatePanelPreviewFadeIn {
            from {
              opacity: 0;
              transform: translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .template-panel-preview-toolbar {
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

          .template-panel-preview-left {
            display: flex;
            align-items: center;
            gap: 16px;
            min-width: 0;
          }

          .template-panel-preview-back {
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

          .template-panel-preview-back:disabled {
            opacity: 0.55;
            cursor: wait;
          }

          .template-panel-preview-back-icon {
            width: 22px;
            height: 22px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
          }

          .template-panel-preview-back-icon svg {
            width: 22px;
            height: 22px;
            stroke-width: 2.4;
          }

          .template-panel-preview-devices {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .template-panel-preview-device-btn {
            width: 36px;
            height: 34px;
            border-radius: 10px;
            border: 1px solid transparent;
            background: transparent;
            color: #334155;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .template-panel-preview-device-btn svg {
            width: 18px;
            height: 18px;
            stroke-width: 2.4;
          }

          .template-panel-preview-device-btn.active {
            background: #eff6ff;
            border-color: #bfdbfe;
            color: #0284c7;
          }

          .template-panel-preview-center {
            min-width: 0;
            text-align: center;
            color: #111827;
            font-size: 13px;
            font-weight: 750;
            white-space: nowrap;
          }

          .template-panel-preview-right {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            min-width: 0;
          }

          .template-panel-preview-start-btn {
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

          .template-panel-preview-start-btn:disabled {
            opacity: 0.88;
            cursor: wait;
          }

          .template-panel-preview-stage {
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

          .template-panel-preview-frame-shell {
            width: 100%;
            min-height: 100%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 0;
          }

          .template-panel-preview-device-frame {
            border: 0;
            background: #ffffff;
            box-shadow: 0 24px 80px rgba(15, 23, 42, 0.22);
            transition: none !important;
          }

          @media (max-width: 768px) {
            .template-panel-preview-toolbar {
              min-height: 96px;
              padding: 18px 18px;
              grid-template-columns: auto 1fr;
              gap: 10px;
            }

            .template-panel-preview-back {
              height: 52px;
              font-size: 28px;
              font-weight: 500;
              gap: 9px;
            }

            .template-panel-preview-back-icon {
              width: 42px;
              height: 42px;
            }

            .template-panel-preview-back-icon svg {
              width: 42px;
              height: 42px;
              stroke-width: 1.8;
            }

            .template-panel-preview-center,
            .template-panel-preview-devices {
              display: none;
            }

            .template-panel-preview-right {
              justify-content: flex-end;
            }

            .template-panel-preview-start-btn {
              border-radius: 14px;
              padding: 14px 18px;
              font-size: 16px;
              font-weight: 950;
              min-width: 184px;
              min-height: 62px;
            }

            .template-panel-preview-stage {
              background: #ffffff;
            }

            .template-panel-preview-device-frame {
              width: 100% !important;
              max-width: 100% !important;
              height: calc(100vh - 96px) !important;
              border-radius: 0 !important;
              box-shadow: none;
            }
          }

          @media (max-width: 420px) {
            .template-panel-preview-toolbar {
              padding: 14px 14px;
            }

            .template-panel-preview-back {
              height: 44px;
              font-size: 21px;
            }

            .template-panel-preview-back-icon {
              width: 34px;
              height: 34px;
            }

            .template-panel-preview-back-icon svg {
              width: 34px;
              height: 34px;
            }

            .template-panel-preview-start-btn {
              padding: 12px 14px;
              font-size: 14px;
              min-width: 162px;
              min-height: 56px;
            }
          }
        `}
      </style>

      {previewTemplate && (
        <div
          className="template-panel-preview-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewTemplate.name || "Template"} preview`}
        >
          <div className="template-panel-preview-toolbar">
            <div className="template-panel-preview-left">
              <button
                type="button"
                className="template-panel-preview-back"
                onClick={handleClosePreview}
                disabled={Boolean(applyingTemplateKey)}
              >
                <span className="template-panel-preview-back-icon">
                  <FiChevronLeft />
                </span>
                <span>Back</span>
              </button>

              <div
                className="template-panel-preview-devices"
                aria-label="Preview device size"
              >
                <button
                  type="button"
                  className={`template-panel-preview-device-btn ${
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
                  className={`template-panel-preview-device-btn ${
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
                  className={`template-panel-preview-device-btn ${
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

            <div className="template-panel-preview-center">
              {previewTemplate.name || "Template Preview"}
            </div>

            <div className="template-panel-preview-right">
              <button
                type="button"
                className="template-panel-preview-start-btn"
                onClick={handleStartFromPreview}
                disabled={applyingTemplateKey === previewTemplate.template_key}
              >
                {applyingTemplateKey === previewTemplate.template_key ? (
                  <ProgressBar />
                ) : (
                  "Start with this Template"
                )}
              </button>
            </div>
          </div>

          <div className="template-panel-preview-stage">
            <div className="template-panel-preview-frame-shell">
              {previewUrl ? (
                <iframe
                  key={previewTemplate.template_key}
                  src={previewUrl}
                  title={`${previewTemplate.name || "Template"} full preview`}
                  className="template-panel-preview-device-frame"
                  loading="eager"
                  style={{
                    width: getPreviewFrameWidth(),
                    maxWidth:
                      previewDevice === "desktop"
                        ? "100%"
                        : getPreviewFrameWidth(),
                    height: getPreviewFrameHeight(),
                    borderRadius: getPreviewFrameRadius(),
                  }}
                />
              ) : (
                <div className="template-preview-fallback">
                  <span>{previewTemplate.name?.slice(0, 1) || "T"}</span>
                  <small>Preview not available</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="panel-header">
        <h3>Website Template</h3>
      </div>

      <div className="chip-row">
        <span className="status-chip enterprise-category-chip">
          <span className="category-dot" />
          <span className="category-label">Category:</span>
          <strong>{layoutKey}</strong>
        </span>
      </div>

      <div className="template-list">
        {templates.length === 0 && (
          <div className="empty-state">
            <p>No templates available in this category.</p>
          </div>
        )}

        {templates.map((template) => {
          const active = activeTemplateKey === template.template_key;
          const previewUrl = getLivePreviewUrl(template);
          const isApplying = applyingTemplateKey === template.template_key;

          return (
            <button
              key={template.template_key}
              type="button"
              className={`template-option template-option-with-preview ${
                active ? "active" : ""
              }`}
              onClick={() => handleSelectTemplate(template)}
              disabled={Boolean(applyingTemplateKey)}
            >
              <div className="template-preview-box">
                {previewUrl ? (
                  <iframe
                    src={previewUrl}
                    title={`${template.name} live preview`}
                    className="template-preview-frame"
                    loading="lazy"
                  />
                ) : (
                  <div className="template-preview-fallback">
                    <span>{template.name?.slice(0, 1) || "T"}</span>
                    <small>Live Preview</small>
                  </div>
                )}

                <button
                  type="button"
                  className="template-preview-click-layer"
                  aria-label={`Preview ${template.name}`}
                  onClick={(event) => handlePreviewTemplate(event, template)}
                  disabled={Boolean(applyingTemplateKey)}
                />
              </div>

              <div className="template-option-content">
                <strong>{template.name}</strong>
                <p>{template.description}</p>

                <div className="template-panel-actions">
                  <button
                    type="button"
                    className="template-preview-action"
                    onClick={(event) => handlePreviewTemplate(event, template)}
                    disabled={Boolean(applyingTemplateKey)}
                  >
                    Preview site
                  </button>

                  <span
                    className={`template-use-pill ${
                      isApplying ? "is-progress" : ""
                    }`}
                  >
                    {isApplying ? (
                      <ProgressBar />
                    ) : active ? (
                      "Selected"
                    ) : (
                      "Use this template"
                    )}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}