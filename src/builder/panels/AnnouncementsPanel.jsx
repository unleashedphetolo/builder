const EMPTY_NOTICE = {
  title: "",
  body: "",
  enabled: true,
};

export default function AnnouncementsPanel({
  announcements = [],
  onChange,
}) {
  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

  const updateItem = (index, patch) => {
    const next = safeAnnouncements.map((item, i) =>
      i === index ? { ...item, ...patch } : item,
    );
    onChange?.(next);
  };

  const addItem = () => {
    onChange?.([...safeAnnouncements, { ...EMPTY_NOTICE }]);
  };

  const removeItem = (index) => {
    onChange?.(safeAnnouncements.filter((_, i) => i !== index));
  };

  return (
    <div className="panel-shell">
      <div className="panel-header">
        <h3>Announcements</h3>
        <p>Create editable notice-board updates for this website.</p>
      </div>

      {safeAnnouncements.length === 0 && (
        <div className="empty-state">
          <p>No announcements yet.</p>
        </div>
      )}

      {safeAnnouncements.map((item, index) => (
        <div key={`${item.title}-${index}`} className="card-block">
          <div className="card-block-header">
            <strong>Announcement {index + 1}</strong>
            <button type="button" className="mini-btn danger" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>

          <div className="field compact">
            <label>Title</label>
            <input
              value={item?.title || ""}
              onChange={(e) => updateItem(index, { title: e.target.value })}
              placeholder="School term 4 report cards"
            />
          </div>

          <div className="field compact">
            <label>Message</label>
            <textarea
              value={item?.body || ""}
              onChange={(e) => updateItem(index, { body: e.target.value })}
              placeholder="Write the announcement text here."
            />
          </div>

          <label className="social-label-row">
            <span>Show this announcement</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={item?.enabled ?? true}
                onChange={(e) => updateItem(index, { enabled: e.target.checked })}
              />
              <span className="slider" />
            </label>
          </label>
        </div>
      ))}

      <button type="button" className="btn wide-btn" onClick={addItem}>
        + Add Announcement
      </button>
    </div>
  );
}
