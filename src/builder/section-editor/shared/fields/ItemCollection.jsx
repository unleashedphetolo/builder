import ContentField from "./ContentField";
import TextListField from "./TextListField";
import ToggleRow from "./ToggleRow";

function reorderItems(items, fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function ItemField({ definition, value, onChange }) {
  if (definition.type === "list") {
    return (
      <TextListField
        label={definition.label}
        items={Array.isArray(value) ? value : []}
        rows={definition.rows || 3}
        placeholder={definition.placeholder || "One item per line"}
        onChange={onChange}
      />
    );
  }

  if (definition.type === "checkbox") {
    return (
      <ToggleRow
        title={definition.label}
        text={definition.hint}
        checked={value === true}
        onChange={onChange}
      />
    );
  }

  return (
    <ContentField
      label={definition.label}
      type={definition.type || "text"}
      rows={definition.rows || 2}
      value={value || ""}
      placeholder={definition.placeholder || ""}
      onChange={onChange}
    />
  );
}

export default function ItemCollection({
  title,
  items = [],
  fields = [],
  addLabel = "Add Item",
  emptyText = "No items configured.",
  createItem = () => ({}),
  onChange,
}) {
  const safeItems = Array.isArray(items) ? items : [];

  const updateItem = (index, field, value) => {
    const next = safeItems.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    );
    onChange?.(next);
  };

  const removeItem = (index) => {
    onChange?.(safeItems.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <section className="bse-collection">
      <div className="bse-section-heading">
        <h3>{title}</h3>
        <span className="bse-count-pill">{safeItems.length}</span>
      </div>

      {!safeItems.length && <p className="bse-empty-note">{emptyText}</p>}

      <div className="bse-item-list">
        {safeItems.map((item, index) => (
          <article className="bse-item-card" key={item.id || `${title}-${index}`}>
            <div className="bse-item-card-header">
              <span className="bse-drag-mark" aria-hidden="true">⋮⋮</span>
              <strong>{item.title || item.name || item.label || `Item ${index + 1}`}</strong>

              <div className="bse-item-controls">
                <button
                  type="button"
                  className="bse-icon-button"
                  disabled={index === 0}
                  aria-label="Move item up"
                  onClick={() => onChange?.(reorderItems(safeItems, index, index - 1))}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="bse-icon-button"
                  disabled={index === safeItems.length - 1}
                  aria-label="Move item down"
                  onClick={() => onChange?.(reorderItems(safeItems, index, index + 1))}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="bse-icon-button bse-danger"
                  aria-label="Delete item"
                  onClick={() => removeItem(index)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="bse-item-fields">
              {fields.map((field) => (
                <ItemField
                  key={field.key}
                  definition={field}
                  value={item[field.key]}
                  onChange={(value) => updateItem(index, field.key, value)}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="bse-add-item-button"
        onClick={() => onChange?.([...safeItems, createItem()])}
      >
        <span aria-hidden="true">＋</span>
        {addLabel}
      </button>
    </section>
  );
}
