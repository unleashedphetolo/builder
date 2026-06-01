import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/builder-announcements-panel.css";

const EMPTY_ANNOUNCEMENTS = Object.freeze([]);

const DEFAULT_ANNOUNCEMENT = {
  id: "",
  label: "",
  title: "",
  body: "",
  enabled: true,
  placement: "header_bar",
  priority: "normal",
  link_label: "",
  link_href: "",
  starts_at: "",
  ends_at: "",
  dismissible: true,
  show_once_per_session: false,
  target_scope: "all_pages",
  target_page_ids: [],
  style: {
    background_color: "#1e40af",
    text_color: "#ffffff",
    accent_style: "solid",
  },
};

const PANEL_TABS = [
  { key: "content", label: "Content" },
  { key: "display", label: "Display" },
  { key: "schedule", label: "Schedule" },
  { key: "targeting", label: "Targeting" },
];

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "scheduled", label: "Scheduled" },
  { key: "off", label: "Off" },
];

const PLACEMENT_OPTIONS = [
  {
    key: "header_bar",
    name: "Announcement Bar",
    description: "A ribbon above the navigation menu.",
    recommended: true,
  },
  {
    key: "notice_board",
    name: "Notice Board",
    description: "A content section within a selected page.",
  },
  {
    key: "popup",
    name: "Pop-up Notice",
    description: "A focused message visitors can dismiss.",
  },
];

const PRIORITY_OPTIONS = [
  { key: "normal", label: "Standard" },
  { key: "important", label: "Important" },
  { key: "urgent", label: "Urgent" },
];

const APPEARANCE_PRESETS = [
  {
    key: "brand",
    name: "Brand",
    background_color: "#1e40af",
    text_color: "#ffffff",
  },
  {
    key: "dark",
    name: "Dark",
    background_color: "#0f172a",
    text_color: "#ffffff",
  },
  {
    key: "light",
    name: "Light",
    background_color: "#ffffff",
    text_color: "#0f172a",
  },
  {
    key: "success",
    name: "Positive",
    background_color: "#166534",
    text_color: "#ffffff",
  },
  {
    key: "attention",
    name: "Attention",
    background_color: "#b45309",
    text_color: "#ffffff",
  },
];

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `announcement-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function clone(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (error) {
    return value;
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isValidHex(value = "") {
  return /^#[0-9a-f]{6}$/i.test(String(value || "").trim());
}

function normalizeHex(value, fallback) {
  return isValidHex(value) ? String(value).toLowerCase() : fallback;
}

function hexToRgb(hex) {
  const clean = normalizeHex(hex, "#000000").slice(1);

  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16),
  };
}

function relativeLuminance(hex) {
  const rgb = hexToRgb(hex);

  const channel = (value) => {
    const normal = value / 255;
    return normal <= 0.03928
      ? normal / 12.92
      : ((normal + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * channel(rgb.r) +
    0.7152 * channel(rgb.g) +
    0.0722 * channel(rgb.b)
  );
}

function contrastRatio(first, second) {
  const firstLum = relativeLuminance(first);
  const secondLum = relativeLuminance(second);
  const light = Math.max(firstLum, secondLum);
  const dark = Math.min(firstLum, secondLum);

  return (light + 0.05) / (dark + 0.05);
}

function readableTextColour(background) {
  const whiteContrast = contrastRatio(background, "#ffffff");
  const darkContrast = contrastRatio(background, "#0f172a");

  return whiteContrast >= darkContrast ? "#ffffff" : "#0f172a";
}

function ensureReadableStyle(style = {}) {
  const background = normalizeHex(
    style?.background_color,
    DEFAULT_ANNOUNCEMENT.style.background_color,
  );
  const suppliedText = normalizeHex(
    style?.text_color,
    DEFAULT_ANNOUNCEMENT.style.text_color,
  );

  if (contrastRatio(suppliedText, background) >= 4.5) {
    return {
      style: {
        ...style,
        background_color: background,
        text_color: suppliedText,
        accent_style: style?.accent_style || "solid",
      },
      adjusted: false,
    };
  }

  return {
    style: {
      ...style,
      background_color: background,
      text_color: readableTextColour(background),
      accent_style: style?.accent_style || "solid",
    },
    adjusted: true,
  };
}

function normalizeAnnouncement(item = {}, index = 0) {
  const styleResult = ensureReadableStyle(
    isObject(item?.style) ? item.style : DEFAULT_ANNOUNCEMENT.style,
  );

  return {
    ...DEFAULT_ANNOUNCEMENT,
    ...item,
    id: item?.id || `legacy-announcement-${index + 1}`,
    title: String(item?.title || ""),
    body: String(item?.body || ""),
    enabled: item?.enabled !== false,
    placement: PLACEMENT_OPTIONS.some((option) => option.key === item?.placement)
      ? item.placement
      : DEFAULT_ANNOUNCEMENT.placement,
    priority: PRIORITY_OPTIONS.some((option) => option.key === item?.priority)
      ? item.priority
      : DEFAULT_ANNOUNCEMENT.priority,
    target_scope: ["all_pages", "home_only", "selected_pages"].includes(
      item?.target_scope,
    )
      ? item.target_scope
      : DEFAULT_ANNOUNCEMENT.target_scope,
    target_page_ids: Array.isArray(item?.target_page_ids)
      ? item.target_page_ids
      : [],
    style: styleResult.style,
  };
}

function normalizeAnnouncements(announcements = []) {
  return (Array.isArray(announcements) ? announcements : []).map(
    normalizeAnnouncement,
  );
}

function createAnnouncement() {
  return {
    ...clone(DEFAULT_ANNOUNCEMENT),
    id: createId(),
    title: "New Announcement",
  };
}

function serialize(value) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return "";
  }
}

function formatStatus(item) {
  if (!item?.enabled) {
    return { key: "off", label: "Off" };
  }

  const now = Date.now();
  const start = item?.starts_at ? new Date(item.starts_at).getTime() : null;
  const end = item?.ends_at ? new Date(item.ends_at).getTime() : null;

  if (start && Number.isFinite(start) && start > now) {
    return { key: "scheduled", label: "Scheduled" };
  }

  if (end && Number.isFinite(end) && end < now) {
    return { key: "ended", label: "Ended" };
  }

  return { key: "live", label: "Live" };
}

function placementName(placement) {
  return (
    PLACEMENT_OPTIONS.find((option) => option.key === placement)?.name ||
    "Announcement"
  );
}

function pageTitle(page = {}) {
  return page?.title || page?.name || page?.label || page?.slug || "Page";
}

function Field({ label, value, onChange, placeholder = "", rows = 0, maxLength }) {
  return (
    <label className="bap-field">
      <span>
        {label}
        {maxLength && (
          <small>
            {String(value || "").length}/{maxLength}
          </small>
        )}
      </span>

      {rows ? (
        <textarea
          value={value || ""}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          type="text"
          value={value || ""}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function Toggle({ title, description, checked, onChange }) {
  return (
    <label className="bap-toggle-row">
      <span>
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </span>

      <span className={`bap-switch ${checked ? "is-on" : ""}`}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <i aria-hidden="true" />
      </span>
    </label>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`bap-status is-${status.key}`}>
      <i aria-hidden="true" />
      {status.label}
    </span>
  );
}

function AnnouncementPreview({ announcement }) {
  const status = formatStatus(announcement);
  const style = {
    "--bap-announcement-background": announcement.style.background_color,
    "--bap-announcement-text": announcement.style.text_color,
  };

  if (announcement.placement === "notice_board") {
    return (
      <div className="bap-preview-browser">
        <div className="bap-preview-nav" />
        <div className="bap-preview-notice-card" style={style}>
          <small>{announcement.label || "Update"}</small>
          <strong>{announcement.title || "Your announcement title"}</strong>
          <p>{announcement.body || "Your announcement message will display here."}</p>
          {announcement.link_label && <span>{announcement.link_label} →</span>}
        </div>
      </div>
    );
  }

  if (announcement.placement === "popup") {
    return (
      <div className="bap-preview-browser is-popup">
        <div className="bap-preview-nav" />
        <div className="bap-preview-popup" style={style}>
          {announcement.dismissible && <b aria-hidden="true">×</b>}
          <small>{announcement.label || "Announcement"}</small>
          <strong>{announcement.title || "Your announcement title"}</strong>
          <p>{announcement.body || "Your announcement message will display here."}</p>
          {announcement.link_label && <span>{announcement.link_label}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="bap-preview-browser">
      <div className="bap-preview-bar" style={style}>
        <small>{announcement.label || status.label}</small>
        <strong>{announcement.title || "Your announcement title"}</strong>
        {announcement.link_label && <span>{announcement.link_label} →</span>}
        {announcement.dismissible && <b aria-hidden="true">×</b>}
      </div>
      <div className="bap-preview-nav" />
      <div className="bap-preview-content">
        <i />
        <i />
      </div>
    </div>
  );
}

export default function AnnouncementsPanel({
  announcements = EMPTY_ANNOUNCEMENTS,
  pages = EMPTY_ANNOUNCEMENTS,
  onChange,
  title = "Announcements",
}) {
  const incomingSignature = serialize(announcements);
  const noticeTimerRef = useRef(null);

  const [items, setItems] = useState(() => normalizeAnnouncements(announcements));
  const [selectedId, setSelectedId] = useState(
    () => normalizeAnnouncements(announcements)[0]?.id || null,
  );
  const [draft, setDraft] = useState(
    () => normalizeAnnouncements(announcements)[0] || null,
  );
  const [activeTab, setActiveTab] = useState("content");
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const next = normalizeAnnouncements(announcements);

    setItems(next);

    setSelectedId((currentId) => {
      const nextSelected =
        next.find((item) => item.id === currentId) || next[0] || null;

      setDraft(nextSelected ? clone(nextSelected) : null);
      return nextSelected?.id || null;
    });
    // The parent array is copied only after a persisted change is received.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingSignature]);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const selectedSaved = items.find((item) => item.id === selectedId) || null;
  const dirty = Boolean(draft && serialize(draft) !== serialize(selectedSaved));

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const status = formatStatus(item);

      if (filter === "all") return true;
      if (filter === "off") return status.key === "off" || status.key === "ended";

      return status.key === filter;
    });
  }, [items, filter]);

  const counts = useMemo(() => {
    return items.reduce(
      (result, item) => {
        const status = formatStatus(item);
        result.all += 1;

        if (status.key === "live") result.live += 1;
        if (status.key === "scheduled") result.scheduled += 1;
        if (status.key === "off" || status.key === "ended") result.off += 1;

        return result;
      },
      { all: 0, live: 0, scheduled: 0, off: 0 },
    );
  }, [items]);

  const showNotice = (message) => {
    setNotice(message);

    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current);
    }

    noticeTimerRef.current = window.setTimeout(() => {
      setNotice("");
    }, 3000);
  };

  const persist = async (nextItems, message) => {
    if (typeof onChange !== "function") {
      setError("No announcement save handler is connected to this panel.");
      return false;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await Promise.resolve(onChange(nextItems));

      if (response === false) {
        throw new Error("Announcement change was not saved.");
      }

      setItems(nextItems);
      showNotice(message);
      return true;
    } catch (saveError) {
      console.error("AnnouncementsPanel save error:", saveError);
      setError("Announcements could not be saved. Please try again.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const openItem = (item) => {
    if (dirty && !window.confirm("Discard unsaved announcement changes?")) {
      return;
    }

    setSelectedId(item.id);
    setDraft(clone(item));
    setActiveTab("content");
    setError("");
  };

  const updateDraft = (patch) => {
    setDraft((previous) => ({
      ...(previous || createAnnouncement()),
      ...patch,
    }));
    setError("");
    setNotice("");
  };

  const updateDraftStyle = (patch) => {
    const result = ensureReadableStyle({
      ...(draft?.style || DEFAULT_ANNOUNCEMENT.style),
      ...patch,
    });

    updateDraft({ style: result.style });

    if (result.adjusted) {
      showNotice("Text colour adjusted automatically for readability.");
    }
  };

  const saveDraft = async () => {
    if (!draft) return;

    const next = items.some((item) => item.id === draft.id)
      ? items.map((item) => (item.id === draft.id ? normalizeAnnouncement(draft) : item))
      : [...items, normalizeAnnouncement(draft)];

    const saved = await persist(next, "Announcement saved.");

    if (saved) {
      const nextDraft = next.find((item) => item.id === draft.id);
      setDraft(clone(nextDraft));
      setSelectedId(nextDraft.id);
    }
  };

  const addAnnouncement = () => {
    if (dirty && !window.confirm("Discard unsaved announcement changes?")) {
      return;
    }

    const next = createAnnouncement();
    setSelectedId(next.id);
    setDraft(next);
    setActiveTab("content");
  };

  const duplicateAnnouncement = async (item) => {
    const duplicate = {
      ...clone(item),
      id: createId(),
      title: `${item.title || "Announcement"} (Copy)`,
      enabled: false,
    };

    const next = [...items, duplicate];
    const saved = await persist(next, "Announcement duplicated as Off.");

    if (saved) {
      setSelectedId(duplicate.id);
      setDraft(clone(duplicate));
    }
  };

  const removeAnnouncement = async (item) => {
    if (!window.confirm(`Delete "${item.title || "this announcement"}"?`)) {
      return;
    }

    const next = items.filter((current) => current.id !== item.id);
    const saved = await persist(next, "Announcement deleted.");

    if (saved && selectedId === item.id) {
      const nextSelected = next[0] || null;
      setSelectedId(nextSelected?.id || null);
      setDraft(nextSelected ? clone(nextSelected) : null);
    }
  };

  const toggleEnabled = async (item, enabled) => {
    const next = items.map((current) =>
      current.id === item.id ? { ...current, enabled } : current,
    );

    const saved = await persist(
      next,
      enabled ? "Announcement is now live." : "Announcement switched off.",
    );

    if (saved && selectedId === item.id) {
      setDraft((previous) => ({ ...previous, enabled }));
    }
  };

  const moveAnnouncement = async (index, direction) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= items.length) return;

    const next = [...items];
    const [moving] = next.splice(index, 1);
    next.splice(targetIndex, 0, moving);

    await persist(next, "Announcement order updated.");
  };

  return (
    <section className="bap-root" aria-label={title}>
      <header className="bap-header">
        <div>
          <span className="bap-eyebrow">Communication</span>
          <h3>{title}</h3>
          <p>
            Publish header bars, notice-board updates and focused pop-up
            messages.
          </p>
        </div>

        <button
          type="button"
          className="bap-new-button"
          onClick={addAnnouncement}
          disabled={saving}
        >
          + New
        </button>
      </header>

      {notice && <div className="bap-alert is-success">{notice}</div>}
      {error && <div className="bap-alert is-error">{error}</div>}

      <nav className="bap-filters" aria-label="Filter announcements">
        {FILTER_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.key}
            className={filter === option.key ? "is-active" : ""}
            onClick={() => setFilter(option.key)}
          >
            {option.label}
            <span>{counts[option.key]}</span>
          </button>
        ))}
      </nav>

      <div className="bap-list" role="list">
        {!visibleItems.length && (
          <div className="bap-empty">
            <strong>No announcements here</strong>
            <p>Create a message visitors can see immediately.</p>
          </div>
        )}

        {visibleItems.map((item, index) => {
          const status = formatStatus(item);

          return (
            <article
              className={`bap-list-item ${
                selectedId === item.id ? "is-selected" : ""
              }`}
              key={item.id}
              role="listitem"
            >
              <button
                type="button"
                className="bap-item-select"
                onClick={() => openItem(item)}
              >
                <span className={`bap-item-icon is-${item.placement}`} aria-hidden="true">
                  {item.placement === "header_bar"
                    ? "▬"
                    : item.placement === "popup"
                      ? "▣"
                      : "▤"}
                </span>

                <span className="bap-item-copy">
                  <strong>{item.title || "Untitled announcement"}</strong>
                  <small>{placementName(item.placement)}</small>
                </span>

                <StatusBadge status={status} />
              </button>

              <div className="bap-list-actions">
                <label className={`bap-quick-switch ${item.enabled ? "is-on" : ""}`}>
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(event) => toggleEnabled(item, event.target.checked)}
                    disabled={saving}
                    aria-label={`Show ${item.title || "announcement"}`}
                  />
                  <i aria-hidden="true" />
                </label>

                <button
                  type="button"
                  onClick={() => moveAnnouncement(index, -1)}
                  disabled={saving || index === 0}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveAnnouncement(index, 1)}
                  disabled={saving || index === items.length - 1}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => duplicateAnnouncement(item)}
                  disabled={saving}
                  aria-label="Duplicate"
                >
                  ⧉
                </button>
                <button
                  type="button"
                  className="is-danger"
                  onClick={() => removeAnnouncement(item)}
                  disabled={saving}
                  aria-label="Delete"
                >
                  ×
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {draft && (
        <section className="bap-editor" aria-label="Edit announcement">
          <div className="bap-editor-head">
            <div>
              <small>Edit announcement</small>
              <strong>{draft.title || "Untitled announcement"}</strong>
            </div>
            <StatusBadge status={formatStatus(draft)} />
          </div>

          <AnnouncementPreview announcement={draft} />

          <nav className="bap-tabs" aria-label="Announcement edit tabs">
            {PANEL_TABS.map((tab) => (
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

          <div className="bap-tab-body">
            {activeTab === "content" && (
              <>
                <Field
                  label="Small Label"
                  value={draft.label}
                  maxLength={30}
                  placeholder="Important update"
                  onChange={(value) => updateDraft({ label: value })}
                />

                <Field
                  label="Title"
                  value={draft.title}
                  maxLength={90}
                  placeholder="School term report cards are available"
                  onChange={(value) => updateDraft({ title: value })}
                />

                <Field
                  label="Message"
                  value={draft.body}
                  rows={4}
                  maxLength={280}
                  placeholder="Write the announcement message here."
                  onChange={(value) => updateDraft({ body: value })}
                />

                <div className="bap-two-column">
                  <Field
                    label="Link Label"
                    value={draft.link_label}
                    maxLength={35}
                    placeholder="Learn More"
                    onChange={(value) => updateDraft({ link_label: value })}
                  />
                  <Field
                    label="Link Destination"
                    value={draft.link_href}
                    placeholder="/contact or https://..."
                    onChange={(value) => updateDraft({ link_href: value })}
                  />
                </div>
              </>
            )}

            {activeTab === "display" && (
              <>
                <div className="bap-panel-label">
                  <strong>Display Type</strong>
                  <small>
                    Announcement Bar is recommended for urgent site-wide updates.
                  </small>
                </div>

                <div className="bap-placement-grid">
                  {PLACEMENT_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option.key}
                      className={draft.placement === option.key ? "is-selected" : ""}
                      onClick={() => updateDraft({ placement: option.key })}
                    >
                      {option.recommended && <b>Recommended</b>}
                      <strong>{option.name}</strong>
                      <small>{option.description}</small>
                    </button>
                  ))}
                </div>

                <label className="bap-select-field">
                  <span>Priority</span>
                  <select
                    value={draft.priority}
                    onChange={(event) =>
                      updateDraft({ priority: event.target.value })
                    }
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority.key} value={priority.key}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="bap-panel-label">
                  <strong>Appearance</strong>
                  <small>Text is protected automatically for readability.</small>
                </div>

                <div className="bap-style-presets">
                  {APPEARANCE_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.key}
                      style={{
                        "--preset-background": preset.background_color,
                        "--preset-text": preset.text_color,
                      }}
                      onClick={() =>
                        updateDraftStyle({
                          background_color: preset.background_color,
                          text_color: preset.text_color,
                        })
                      }
                    >
                      <i />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>

                <div className="bap-colour-fields">
                  <label>
                    <span>Background</span>
                    <input
                      type="color"
                      value={draft.style.background_color}
                      onChange={(event) =>
                        updateDraftStyle({ background_color: event.target.value })
                      }
                    />
                    <code>{draft.style.background_color}</code>
                  </label>

                  <label>
                    <span>Text</span>
                    <input
                      type="color"
                      value={draft.style.text_color}
                      onChange={(event) =>
                        updateDraftStyle({ text_color: event.target.value })
                      }
                    />
                    <code>{draft.style.text_color}</code>
                  </label>
                </div>

                <div className="bap-readability">
                  <span aria-hidden="true">✓</span>
                  Automatic readability protection is on.
                </div>

                <Toggle
                  title="Dismissible"
                  description="Allow visitors to close this announcement."
                  checked={draft.dismissible}
                  onChange={(value) => updateDraft({ dismissible: value })}
                />
              </>
            )}

            {activeTab === "schedule" && (
              <>
                <Toggle
                  title="Show Announcement"
                  description="Turn this announcement on or off without deleting it."
                  checked={draft.enabled}
                  onChange={(value) => updateDraft({ enabled: value })}
                />

                <label className="bap-select-field">
                  <span>Publishing Priority</span>
                  <select
                    value={draft.priority}
                    onChange={(event) =>
                      updateDraft({ priority: event.target.value })
                    }
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority.key} value={priority.key}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="bap-date-field">
                  <span>Starts At</span>
                  <input
                    type="datetime-local"
                    value={draft.starts_at || ""}
                    onChange={(event) =>
                      updateDraft({ starts_at: event.target.value })
                    }
                  />
                </label>

                <label className="bap-date-field">
                  <span>Ends At</span>
                  <input
                    type="datetime-local"
                    value={draft.ends_at || ""}
                    onChange={(event) =>
                      updateDraft({ ends_at: event.target.value })
                    }
                  />
                </label>

                {draft.placement === "popup" && (
                  <Toggle
                    title="Show Once Per Session"
                    description="Avoid repeating the same pop-up during one visit."
                    checked={draft.show_once_per_session}
                    onChange={(value) =>
                      updateDraft({ show_once_per_session: value })
                    }
                  />
                )}
              </>
            )}

            {activeTab === "targeting" && (
              <>
                <div className="bap-panel-label">
                  <strong>Where It Appears</strong>
                  <small>
                    Use site-wide for critical announcements and selected pages
                    for focused promotions or notices.
                  </small>
                </div>

                <div className="bap-radio-group">
                  {[
                    {
                      key: "all_pages",
                      label: "All Pages",
                      text: "Display throughout the website.",
                    },
                    {
                      key: "home_only",
                      label: "Home Page Only",
                      text: "Show only on the landing page.",
                    },
                    {
                      key: "selected_pages",
                      label: "Selected Pages",
                      text: "Choose exactly where this appears.",
                    },
                  ].map((option) => (
                    <label
                      className={
                        draft.target_scope === option.key ? "is-selected" : ""
                      }
                      key={option.key}
                    >
                      <input
                        type="radio"
                        name={`target-scope-${draft.id}`}
                        checked={draft.target_scope === option.key}
                        onChange={() =>
                          updateDraft({ target_scope: option.key })
                        }
                      />
                      <span>
                        <strong>{option.label}</strong>
                        <small>{option.text}</small>
                      </span>
                    </label>
                  ))}
                </div>

                {draft.target_scope === "selected_pages" && (
                  <div className="bap-pages">
                    {(Array.isArray(pages) ? pages : []).length === 0 && (
                      <p>No pages are available yet.</p>
                    )}

                    {(Array.isArray(pages) ? pages : []).map((page) => {
                      const id = page.id || page.slug;
                      const checked = draft.target_page_ids.includes(id);

                      return (
                        <label key={id}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(event) => {
                              const nextIds = event.target.checked
                                ? [...draft.target_page_ids, id]
                                : draft.target_page_ids.filter(
                                    (pageId) => pageId !== id,
                                  );

                              updateDraft({ target_page_ids: nextIds });
                            }}
                          />
                          <span>{pageTitle(page)}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="bap-footer">
            <span className={dirty ? "has-changes" : ""}>
              {dirty ? "Unsaved changes" : "Up to date"}
            </span>

            <button
              type="button"
              className="bap-cancel"
              disabled={!dirty || saving}
              onClick={() => setDraft(clone(selectedSaved))}
            >
              Cancel
            </button>

            <button
              type="button"
              className="bap-save"
              disabled={!dirty || saving}
              onClick={saveDraft}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </footer>
        </section>
      )}

      {!draft && (
        <div className="bap-start">
          <strong>Create your first announcement</strong>
          <p>
            Header bars are recommended for urgent information, closures,
            promotions and site-wide updates.
          </p>
          <button type="button" onClick={addAnnouncement}>
            + Add Announcement
          </button>
        </div>
      )}
    </section>
  );
}
