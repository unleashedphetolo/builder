export default function MediaLibrary({
  assets = [],
  loading = false,
  error = "",
  query = "",
  onChangeQuery,
  onRefresh,
  onSelect,
}) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  const visibleAssets = assets.filter((asset) => {
    if (!normalizedQuery) return true;
    return [asset?.name, asset?.alt, asset?.kind].some((value) =>
      String(value || "").toLowerCase().includes(normalizedQuery),
    );
  });

  return (
    <section className="bse-library">
      <div className="bse-section-heading">
        <h3>Media Library</h3>
        <button type="button" className="bse-link-button" onClick={onRefresh}>Refresh</button>
      </div>

      <input
        className="bse-input"
        value={query}
        onChange={(event) => onChangeQuery?.(event.target.value)}
        placeholder="Search your uploaded media"
      />

      {loading && <p className="bse-library-message">Loading media library...</p>}
      {error && <p className="bse-library-message is-error">{error}</p>}
      {!loading && !error && !visibleAssets.length && (
        <p className="bse-library-message">No uploaded media yet. Upload a file or paste a direct URL.</p>
      )}

      <div className="bse-library-grid">
        {visibleAssets.map((asset) => (
          <button
            type="button"
            className="bse-library-asset"
            key={asset.id || asset.url}
            onClick={() => onSelect?.(asset)}
          >
            {asset.kind === "image" || String(asset.url || "").match(/\.(png|jpe?g|webp|gif|svg)(\?|$)/i) ? (
              <img src={asset.url} alt={asset.alt || asset.name || ""} />
            ) : (
              <span className="bse-file-preview">{asset.kind === "video" ? "▶" : "▧"}</span>
            )}
            <span>{asset.name || "Media asset"}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
