import { useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FiChevronRight,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiMoreVertical as FiGripVertical,
  FiHome,
  FiSearch,
  FiX,
} from "react-icons/fi";

function normalizeSlug(slug = "/") {
  const raw = String(slug || "/").trim();
  if (!raw || raw === "/" || raw.toLowerCase() === "home") return "/";
  return `/${raw.replace(/^\/+|\/+$/g, "")}`;
}

function previewUrl(siteId, slug) {
  if (!siteId) return "";
  const cleanSlug = normalizeSlug(slug);
  const path = cleanSlug === "/" ? "" : cleanSlug;
  return `#/site/${siteId}${path}?builder=1&mini=1`;
}

function getParentSlug(slug) {
  const clean = normalizeSlug(slug);
  if (clean === "/") return null;
  const parts = clean.split("/").filter(Boolean);
  if (parts.length <= 1) return null;
  return `/${parts.slice(0, -1).join("/")}`;
}

function getPageOrder(page, navItem, fallbackIndex) {
  return page?.sort_order ?? navItem?.position ?? fallbackIndex ?? 0;
}

function buildPageTree(pages = [], navItems = []) {
  const navByPageId = new Map();
  const navById = new Map();

  navItems.forEach((item) => {
    if (item?.id) navById.set(item.id, item);
    if (item?.page_id) navByPageId.set(item.page_id, item);
  });

  const pageBySlug = new Map();
  pages.forEach((page) => {
    pageBySlug.set(normalizeSlug(page.slug), page);
  });

  const nodes = pages.map((page, index) => {
    const navItem = navByPageId.get(page.id) || null;
    return {
      ...page,
      navItem,
      children: [],
      _order: getPageOrder(page, navItem, index),
    };
  });

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const roots = [];

  nodes.forEach((node) => {
    let parentPageId = null;

    // Main database alignment: hierarchy comes from site_nav_items.parent_id,
    // because site_pages does not have parent_id in your schema.
    const parentNavId = node.navItem?.parent_id || null;
    if (parentNavId && navById.has(parentNavId)) {
      parentPageId = navById.get(parentNavId)?.page_id || null;
    }

    // Safe fallback for pages that are not in navigation: infer by URL path.
    if (!parentPageId) {
      const parentSlug = getParentSlug(node.slug);
      parentPageId = parentSlug ? pageBySlug.get(parentSlug)?.id : null;
    }

    if (
      parentPageId &&
      parentPageId !== node.id &&
      nodeById.has(parentPageId)
    ) {
      nodeById.get(parentPageId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  function sortNodes(list) {
    return [...list]
      .sort((a, b) => (a._order ?? 0) - (b._order ?? 0))
      .map((node) => ({ ...node, children: sortNodes(node.children || []) }));
  }

  return sortNodes(roots);
}

function flattenTree(nodes = [], level = 0, output = []) {
  nodes.forEach((node) => {
    output.push({ page: node, level });
    flattenTree(node.children || [], level + 1, output);
  });
  return output;
}

function filterTree(nodes = [], search = "") {
  const q = search.trim().toLowerCase();
  if (!q) return nodes;

  return nodes
    .map((node) => {
      const children = filterTree(node.children || [], q);
      const haystack = [
        node.title,
        node.slug,
        node.navItem?.label,
        node.template_page_key,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (haystack.includes(q) || children.length) {
        return { ...node, children };
      }

      return null;
    })
    .filter(Boolean);
}

function SortablePageRow({
  siteId,
  page,
  level,
  number,
  currentPage,
  onSelectPage,
  onToggleVisibility,
}) {
  const [hovered, setHovered] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cleanSlug = normalizeSlug(page.slug);
  const isHome = cleanSlug === "/";
  const isActive = currentPage === page.id;
  const isVisible = page.is_visible !== false && page.is_published !== false;
  const showPreview = isActive || hovered;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`enterprise-page-card ${isActive ? "active" : ""} ${
        isDragging ? "is-dragging" : ""
      } ${!isVisible ? "is-hidden" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="enterprise-page-row"
        role="button"
        tabIndex={0}
        onClick={() => onSelectPage(page)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelectPage(page);
        }}
        style={{ paddingLeft: `${12 + level * 18}px` }}
      >
        <button
          type="button"
          className="page-drag-handle"
          title="Drag to reorder"
          aria-label="Drag page"
          onClick={(e) => e.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          <FiGripVertical />
        </button>

        <span className="page-number">{String(number).padStart(2, "0")}</span>

        <span className={`page-type-icon ${isHome ? "home" : ""}`}>
          {isHome ? <FiHome /> : <FiFileText />}
        </span>

        {level > 0 && <FiChevronRight className="page-child-arrow" />}

        <span className="page-title-block">
          <strong>{page.title || "Untitled page"}</strong>
          <small>{cleanSlug}</small>
        </span>

        <button
          type="button"
          className={`page-visibility-toggle ${isVisible ? "on" : "off"}`}
          title={isVisible ? "Hide page" : "Show page"}
          aria-label={isVisible ? "Hide page" : "Show page"}
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(page, !isVisible);
          }}
        >
          {isVisible ? <FiEye /> : <FiEyeOff />}
          <span>{isVisible ? "On" : "Off"}</span>
        </button>
      </div>

      {showPreview && siteId && (
        <div
          className="page-mini-preview-shell"
          role="button"
          tabIndex={0}
          title={`Open ${page.title || "this page"}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPage(page);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onSelectPage(page);
            }
          }}
        >
          <div className="page-mini-preview-topline">
            <FiEdit3 />
            <span>Click preview to open page</span>
          </div>

          <div className="page-mini-preview-frame-wrap">
            <iframe
              src={previewUrl(siteId, cleanSlug)}
              title={`${page.title || "Page"} preview`}
              className="page-mini-preview-frame"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PagesPanel({
  siteId,
  layoutKey,
  templateKey,
  pages = [],
  navItems = [],
  currentPage,
  // currentPageData,
  setCurrentPage,
  // onUpdatePage,
  onUpdateAnyPage,
  // onUpdatePageContent,
  onReorderPages,
}) {
  const [search, setSearch] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const activePageIds = useMemo(() => {
    return new Set((pages || []).map((page) => page.id));
  }, [pages, layoutKey, templateKey]);

  const activeNavItems = useMemo(() => {
    return (navItems || []).filter((item) => {
      if (!item?.page_id) return true;
      return activePageIds.has(item.page_id);
    });
  }, [navItems, activePageIds, layoutKey, templateKey]);

  const tree = useMemo(
    () => buildPageTree(pages, activeNavItems),
    [pages, activeNavItems, layoutKey, templateKey],
  );

  const filteredTree = useMemo(() => filterTree(tree, search), [tree, search]);

  const flatRows = useMemo(() => flattenTree(filteredTree), [filteredTree]);

  const sortableIds = useMemo(
    () => flatRows.map(({ page }) => page.id),
    [flatRows],
  );

  // const selectedContent = currentPageData?.content || {};

  const handleSelectPage = (page) => {
    setCurrentPage?.(page.id);

    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: normalizeSlug(page.slug) }),
    );

    if (window.innerWidth <= 1024) {
      window.dispatchEvent(new CustomEvent("builder:close-sidebar"));
    }
  };

  const handleToggleVisibility = (page, visible) => {
    onUpdateAnyPage?.(page.id, {
      is_visible: visible,
      is_published: visible,
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (!active?.id || !over?.id || active.id === over.id) return;

    const oldIndex = sortableIds.indexOf(active.id);
    const newIndex = sortableIds.indexOf(over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const nextIds = arrayMove(sortableIds, oldIndex, newIndex);
    onReorderPages?.(nextIds);
  };

  return (
    <div className="panel-shell enterprise-pages-panel">
      {/* <div className="panel-header enterprise-pages-header">
        <div>
          <h3>Pages and navigation</h3>
          <p>Open, preview, search, reorder and control page visibility.</p>
        </div>
      </div> */}

      <label className="enterprise-page-search" aria-label="Search pages">
        <FiSearch />
        <input
          value={search}
          placeholder="Search pages..."
          onChange={(e) => setSearch(e.target.value)}
        />

        {search && (
          <button
            type="button"
            className="enterprise-page-search-clear"
            aria-label="Clear search"
            title="Clear search"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSearch("");
            }}
          >
            <FiX />
          </button>
        )}
      </label>

      <div className="enterprise-page-list-wrap">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortableIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="enterprise-page-list">
              {flatRows.length ? (
                flatRows.map(({ page, level }, index) => (
                  <SortablePageRow
                    key={page.id}
                    siteId={siteId}
                    page={page}
                    level={level}
                    number={index + 1}
                    currentPage={currentPage}
                    onSelectPage={handleSelectPage}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))
              ) : (
                <div className="enterprise-page-empty">
                  No pages found for the selected template.
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* {currentPageData && (
        <div className="card-block enterprise-page-editor">
          <div className="page-editor-title-row">
            <div>
              <strong>Edit selected page</strong>
              <small>{normalizeSlug(currentPageData.slug)}</small>
            </div>
          </div>

          <div className="field compact">
            <label>Page title</label>
            <input
              value={currentPageData?.title || ""}
              onChange={(e) => onUpdatePage?.({ title: e.target.value })}
            />
          </div>

          <div className="field compact">
            <label>Page slug</label>
            <input
              value={normalizeSlug(currentPageData?.slug || "/")}
              onChange={(e) => onUpdatePage?.({ slug: normalizeSlug(e.target.value) })}
            />
          </div>

          <div className="field compact">
            <label>Fallback headline</label>
            <input
              value={selectedContent?.headline || currentPageData?.title || ""}
              onChange={(e) => onUpdatePageContent?.("headline", e.target.value)}
            />
          </div>

          <div className="field compact">
            <label>Fallback intro / description</label>
            <textarea
              value={selectedContent?.description || ""}
              placeholder="This text is used by templates that render page fallback content."
              onChange={(e) => onUpdatePageContent?.("description", e.target.value)}
            />
          </div>

          <div className="grid-2">
            <div className="field compact">
              <label>Button text</label>
              <input
                value={selectedContent?.primaryText || ""}
                onChange={(e) => onUpdatePageContent?.("primaryText", e.target.value)}
              />
            </div>

            <div className="field compact">
              <label>Button link</label>
              <input
                value={selectedContent?.primaryHref || ""}
                onChange={(e) => onUpdatePageContent?.("primaryHref", e.target.value)}
              />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}