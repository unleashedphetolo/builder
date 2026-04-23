function buildTree(pages = []) {
  const map = new Map();
  const roots = [];

  pages.forEach((page) => {
    map.set(page.id, { ...page, children: [] });
  });

  map.forEach((page) => {
    const parentId = page.parent_id || page.parentId || null;
    if (parentId && map.has(parentId)) {
      map.get(parentId).children.push(page);
    } else {
      roots.push(page);
    }
  });

  return roots;
}

function PageRow({ page, level = 0, currentPage, setCurrentPage }) {
  return (
    <>
      <button
        type="button"
        className={`page-tree-item ${currentPage === page.id ? "active" : ""}`}
        style={{ paddingLeft: `${12 + level * 18}px` }}
        onClick={() => setCurrentPage?.(page.id)}
      >
        {page.title || "Untitled Page"}
      </button>

      {page.children?.map((child) => (
        <PageRow
          key={child.id}
          page={child}
          level={level + 1}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ))}
    </>
  );
}

export default function PagesPanel({
  pages = [],
  currentPage,
  currentPageData,
  setCurrentPage,
  onUpdatePage,
  onUpdatePageContent,
}) {
  const tree = buildTree(pages);

  return (
    <div className="panel-shell">
      <div className="panel-header">
        <h3>Pages</h3>
        <p>Open and edit the pages available on this website.</p>
      </div>

      <div className="page-tree">
        {tree.map((page) => (
          <PageRow
            key={page.id}
            page={page}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        ))}
      </div>

      {currentPageData && (
        <div className="card-block">
          <div className="field compact">
            <label>Page Title</label>
            <input
              value={currentPageData?.title || ""}
              onChange={(e) => onUpdatePage?.({ title: e.target.value })}
            />
          </div>

          <div className="field compact">
            <label>Page Slug</label>
            <input
              value={currentPageData?.slug || ""}
              onChange={(e) => onUpdatePage?.({ slug: e.target.value })}
            />
          </div>

          <div className="field compact">
            <label>Intro / Description</label>
            <textarea
              value={currentPageData?.content?.description || ""}
              onChange={(e) =>
                onUpdatePageContent?.("description", e.target.value)
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
