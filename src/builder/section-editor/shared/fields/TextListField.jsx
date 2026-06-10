function splitTextList(value = "") {
  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function TextListField({
  label,
  items = [],
  onChange,
  placeholder = "One item per line",
  hint = "",
  rows = 5,
}) {
  return (
    <label className="bse-field">
      <span className="bse-field-label">{label}</span>
      <textarea
        className="bse-textarea"
        rows={rows}
        value={Array.isArray(items) ? items.join("\n") : ""}
        placeholder={placeholder}
        onChange={(event) => onChange?.(splitTextList(event.target.value))}
      />
      {hint && <small className="bse-field-hint">{hint}</small>}
    </label>
  );
}
