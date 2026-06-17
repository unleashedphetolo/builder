import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/builder-section-target.css";

const EMPTY_SECTION = Object.freeze({});
const EMPTY_OBJECT = Object.freeze({});

function cloneValue(value) {
  if (!value || typeof value !== "object") return value;

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function normalizeKey(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function toLabel(value = "") {
  return String(value || "")
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getSectionKey(section = EMPTY_SECTION, fallbackKey = "") {
  return (
    fallbackKey ||
    section?.section_key ||
    section?.key ||
    section?.content?._section_key ||
    section?.content?.__section_key ||
    section?.content?.section_key ||
    section?.content?.editor_section_type ||
    section?.content?._editor_section_type ||
    ""
  );
}

function getSectionType(section = EMPTY_SECTION, fallbackType = "") {
  return (
    fallbackType ||
    section?.content?._editor_section_type ||
    section?.content?.editor_section_type ||
    section?.content?.section_type ||
    section?.section_type ||
    section?.type ||
    section?.section_key ||
    section?.key ||
    section?.content?._section_key ||
    section?.content?.__section_key ||
    section?.content?.section_key ||
    ""
  );
}

function getSectionPageSlug(section = EMPTY_SECTION) {
  return (
    section?.page_slug ||
    section?.slug ||
    section?.content?.page_slug ||
    section?.content?._page_slug ||
    ""
  );
}

function getSectionId(section = EMPTY_SECTION, fallbackId = null) {
  return section?.id || section?.section_id || fallbackId || null;
}

function getSectionLabel(section = EMPTY_SECTION, fallbackLabel = "", fallbackType = "") {
  return (
    fallbackLabel ||
    section?.content?.section_title ||
    section?.content?.title ||
    section?.title ||
    section?.name ||
    toLabel(getSectionType(section, fallbackType)) ||
    "Section"
  );
}

function stableSerialize(value) {
  try {
    return JSON.stringify(value || {});
  } catch {
    return "";
  }
}

function isMiniTemplatePreview() {
  if (typeof window === "undefined") return false;

  const hashQuery = String(window.location.hash || "").split("?")[1] || "";
  const searchParams = new URLSearchParams(window.location.search || "");
  const hashParams = new URLSearchParams(hashQuery);

  return searchParams.get("mini") === "1" || hashParams.get("mini") === "1";
}

function sameSection(target = EMPTY_SECTION, candidate = EMPTY_SECTION, fallbackId, fallbackType) {
  const targetId = getSectionId(target, fallbackId);
  const candidateId = getSectionId(candidate);

  if (targetId && candidateId) {
    return String(targetId) === String(candidateId);
  }

  const targetKey = normalizeKey(getSectionKey(target, fallbackType));
  const candidateKey = normalizeKey(getSectionKey(candidate));

  if (targetKey && candidateKey && targetKey === candidateKey) {
    return true;
  }

  const targetType = normalizeKey(getSectionType(target, fallbackType));
  const candidateType = normalizeKey(getSectionType(candidate));

  return Boolean(targetType && candidateType && targetType === candidateType);
}

function findUpdatedSection(incomingSections, target, fallbackId, fallbackType) {
  if (!Array.isArray(incomingSections)) return null;

  const exactId = incomingSections.find((section) => {
    const targetId = getSectionId(target, fallbackId);
    return targetId && String(getSectionId(section)) === String(targetId);
  });

  if (exactId) return exactId;

  const targetKey = normalizeKey(getSectionKey(target, fallbackType));

  if (targetKey) {
    const exactKey = incomingSections.find(
      (section) => normalizeKey(getSectionKey(section)) === targetKey,
    );

    if (exactKey) return exactKey;
  }

  const targetType = normalizeKey(getSectionType(target, fallbackType));

  if (!targetType) return null;

  return (
    incomingSections.find(
      (section) => normalizeKey(getSectionType(section)) === targetType,
    ) || null
  );
}

function buildRequest({
  section,
  sectionId,
  sectionType,
  label,
  templateCategory,
  templateKey,
  source,
}) {
  const resolvedType = getSectionType(section, sectionType);
  const resolvedKey = getSectionKey(section, sectionType);
  const resolvedId = getSectionId(section, sectionId);

  const safeContent =
    section?.content && typeof section.content === "object"
      ? cloneValue(section.content)
      : {};

  const editorSectionType =
    safeContent?._editor_section_type ||
    safeContent?.editor_section_type ||
    safeContent?.section_type ||
    resolvedType;

  return {
    type: "builder:open-section-editor",
    editorType: "section",
    source,
    sectionId: resolvedId,
    section_id: resolvedId,
    sectionKey: resolvedKey || resolvedType,
    section_key: resolvedKey || resolvedType,
    sectionType: resolvedType,
    section_type: resolvedType,
    editorSectionType,
    editor_section_type: editorSectionType,
    pageSlug: getSectionPageSlug(section),
    page_slug: getSectionPageSlug(section),
    label: getSectionLabel(section, label, resolvedType),
    templateCategory: templateCategory || null,
    templateKey: templateKey || null,
    content: safeContent,
    style:
      section?.style && typeof section.style === "object"
        ? cloneValue(section.style)
        : {},
    animation:
      section?.animation && typeof section.animation === "object"
        ? cloneValue(section.animation)
        : {},
    visible: section?.visible !== false,
    position: section?.position,
  };
}

/**
 * BuilderSectionTarget
 *
 * Reusable visual editing wrapper for any template category.
 *
 * Example:
 *
 * <BuilderSectionTarget
 *   builderMode={builderMode}
 *   section={noticeSection}
 *   sectionType="notice_board"
 *   templateCategory="school"
 * >
 *   <NoticeBoardContent content={noticeSection?.content} />
 * </BuilderSectionTarget>
 *
 * Render-prop example for immediate saved-section updates:
 *
 * <BuilderSectionTarget builderMode={builderMode} section={serviceSection}>
 *   {({ content }) => <Services content={content} />}
 * </BuilderSectionTarget>
 */
export default function BuilderSectionTarget({
  children,
  section = EMPTY_SECTION,
  sectionId = null,
  sectionType = "",
  label = "",
  builderMode = false,
  enabled = false,
  disabled = false,
  previewOnly = false,
  disableInMiniPreview = true,
  className = "",
  selectedClassName = "",
  as: Component = "div",
  editButtonLabel = "Edit",
  showEditButton = true,
  openOnSectionClick = true,
  allowKeyboardSelection = true,
  keepVisibleWhenHiddenInBuilder = true,
  templateCategory = "",
  templateKey = "",
  source = "template-section",
  onOpen,
  onSelectedChange,
  onLiveSectionChange,
  ...rest
}) {
  const rootRef = useRef(null);
  const providedSignature = useMemo(() => stableSerialize(section), [section]);

  const [liveSection, setLiveSection] = useState(() => cloneValue(section) || {});
  const [selected, setSelected] = useState(false);

  const editorEnabled =
    (builderMode === true || enabled === true) &&
    disabled !== true &&
    previewOnly !== true &&
    !(disableInMiniPreview && isMiniTemplatePreview());

  const resolvedId = getSectionId(liveSection, sectionId);
  const resolvedType = getSectionType(liveSection, sectionType);
  const resolvedLabel = getSectionLabel(liveSection, label, resolvedType);
  const isHidden = liveSection?.visible === false;

  useEffect(() => {
    const nextSection = cloneValue(section) || {};
    setLiveSection(nextSection);
    onLiveSectionChange?.(nextSection);
    // Only refresh when the provided section record materially changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providedSignature]);

  useEffect(() => {
    if (editorEnabled) return;

    setSelected(false);
  }, [editorEnabled]);

  useEffect(() => {
    if (!editorEnabled) return undefined;

    const updateSelection = (payload = {}) => {
      if (payload.editorType && payload.editorType !== "section") {
        if (payload.open === true && selected) {
          setSelected(false);
          onSelectedChange?.(false);
        }
        return;
      }

      if (typeof payload.open !== "boolean") return;

      const appliesToTarget = sameSection(
        liveSection,
        {
          id: payload.sectionId || payload.section_id,
          type:
            payload.editorSectionType ||
            payload.editor_section_type ||
            payload.sectionType ||
            payload.section_type,
          section_key: payload.sectionKey || payload.section_key,
          key: payload.sectionKey || payload.section_key,
          content: {
            _section_key: payload.sectionKey || payload.section_key,
            section_key: payload.sectionKey || payload.section_key,
            _editor_section_type:
              payload.editorSectionType ||
              payload.editor_section_type ||
              payload.sectionType ||
              payload.section_type,
          },
        },
        sectionId,
        sectionType,
      );

      if (payload.open === true) {
        const nextSelected = appliesToTarget;

        setSelected(nextSelected);
        onSelectedChange?.(nextSelected);
        return;
      }

      if (appliesToTarget || selected) {
        setSelected(false);
        onSelectedChange?.(false);
      }
    };

    const applySectionUpdate = (incoming = []) => {
      const nextSection = findUpdatedSection(
        incoming,
        liveSection,
        sectionId,
        sectionType,
      );

      if (!nextSection) return;

      const clonedSection = cloneValue(nextSection) || {};
      setLiveSection(clonedSection);
      onLiveSectionChange?.(clonedSection);
    };

    const handleEditorState = (event) => {
      updateSelection(event?.detail || {});
    };

    const handleSectionsUpdated = (event) => {
      const detail = event?.detail || [];
      const incoming = Array.isArray(detail)
        ? detail
        : detail.sections || detail.items || detail.payload || [];

      applySectionUpdate(incoming);
    };

    const handleMessage = (event) => {
      const payload = event?.data;

      if (!payload || typeof payload !== "object") return;

      if (
        payload.type === "builder:section-editor-state" ||
        payload.type === "site:section-editor-state"
      ) {
        updateSelection(payload);
      }

      if (
        payload.type === "builder:media-editor-state" &&
        payload.open === true &&
        selected
      ) {
        setSelected(false);
        onSelectedChange?.(false);
      }

      if (
        payload.type === "builder:sections-updated" ||
        payload.type === "site-sections-updated"
      ) {
        applySectionUpdate(
          payload.sections || payload.items || payload.payload || [],
        );
      }
    };

    window.addEventListener("builder:section-editor-state", handleEditorState);
    window.addEventListener("site:section-editor-state", handleEditorState);
    window.addEventListener("builder:sections-updated", handleSectionsUpdated);
    window.addEventListener("site-sections-updated", handleSectionsUpdated);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener(
        "builder:section-editor-state",
        handleEditorState,
      );
      window.removeEventListener(
        "site:section-editor-state",
        handleEditorState,
      );
      window.removeEventListener(
        "builder:sections-updated",
        handleSectionsUpdated,
      );
      window.removeEventListener(
        "site-sections-updated",
        handleSectionsUpdated,
      );
      window.removeEventListener("message", handleMessage);
    };
  }, [
    editorEnabled,
    liveSection,
    onLiveSectionChange,
    onSelectedChange,
    sectionId,
    sectionType,
    selected,
  ]);

  const requestOpenEditor = (event) => {
    if (!editorEnabled || (!resolvedId && !resolvedType)) return;

    event?.preventDefault?.();
    event?.stopPropagation?.();

    const request = buildRequest({
      section: liveSection,
      sectionId,
      sectionType,
      label,
      templateCategory,
      templateKey,
      source,
    });

    /*
      Close Logo/Hero/Media editor instances mounted inside this same live
      template before opening a normal section editor in the outer builder.
    */
    window.dispatchEvent(
      new CustomEvent("builder:close-media-editor", {
        detail: {
          source: "section-target",
          sectionId: request.sectionId,
        },
      }),
    );

    setSelected(true);
    onSelectedChange?.(true);
    onOpen?.(request);

    /*
      Supports a template rendered directly in the builder document.
    */
    window.dispatchEvent(
      new CustomEvent("builder:open-section-editor", {
        detail: request,
      }),
    );

    /*
      Supports the normal iframe preview. The builder and preview are part of
      the same application origin, so avoid wildcard postMessage targeting.
    */
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(request, window.location.origin);
    }
  };

  const handleTargetClick = (event) => {
    if (!editorEnabled || !openOnSectionClick) return;

    if (event.defaultPrevented) return;
    if (event.__builderSectionTargetHandled === true) return;

    const interactiveElement = event.target.closest(
      "a, button, input, textarea, select, option, label, video, audio, [contenteditable='true'], [data-builder-ignore-section-click='true']",
    );

    if (interactiveElement) return;

    event.__builderSectionTargetHandled = true;
    requestOpenEditor(event);
  };

  const handleTargetKeyDown = (event) => {
    if (!editorEnabled || !allowKeyboardSelection) return;

    if (event.target !== rootRef.current) return;

    if (event.key === "Enter" || event.key === " ") {
      requestOpenEditor(event);
    }
  };

  const childContext = {
    section: liveSection,
    content: liveSection?.content || EMPTY_OBJECT,
    style: liveSection?.style || EMPTY_OBJECT,
    animation: liveSection?.animation || EMPTY_OBJECT,
    selected,
    builderMode: editorEnabled,
    visible: liveSection?.visible !== false,
  };

  const renderedChildren =
    typeof children === "function" ? children(childContext) : children;

  if (!editorEnabled) {
    if (liveSection?.visible === false && !keepVisibleWhenHiddenInBuilder) {
      return null;
    }

    return renderedChildren;
  }

  const targetClasses = [
    "bst-root",
    "bst-is-builder",
    selected ? "bst-is-selected" : "",
    isHidden ? "bst-is-hidden" : "",
    className,
    selected ? selectedClassName : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      {...rest}
      ref={rootRef}
      className={targetClasses}
      data-builder-section-target="true"
      data-section-id={resolvedId || undefined}
      data-section-type={resolvedType || undefined}
      data-section-selected={selected ? "true" : "false"}
      data-section-hidden={isHidden ? "true" : "false"}
      tabIndex={allowKeyboardSelection ? 0 : rest.tabIndex}
      onClick={handleTargetClick}
      onKeyDown={handleTargetKeyDown}
    >
      {isHidden && keepVisibleWhenHiddenInBuilder && (
        <div className="bst-hidden-banner" aria-label="Hidden section">
          <span aria-hidden="true">◌</span>
          Hidden on published website
        </div>
      )}

      {showEditButton && (
        <button
          type="button"
          className="bst-edit-button"
          onClick={requestOpenEditor}
          aria-label={`${editButtonLabel} ${resolvedLabel}`}
          title={`${editButtonLabel} ${resolvedLabel}`}
          data-builder-ignore-section-click="true"
        >
          <span className="bst-edit-icon" aria-hidden="true">
            ✎
          </span>
          <span className="bst-edit-text">
            {editButtonLabel} {resolvedLabel}
          </span>
        </button>
      )}

      {renderedChildren}
    </Component>
  );
}
