import { useId } from "react";

function safeLabel(value = "field") {
  return String(value || "field")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toDateInputValue(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const isoDate = raw.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (isoDate) return isoDate[1];
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDateFromInput(value = "") {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return raw;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ContentField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  rows = 3,
  hint = "",
  maxLength,
}) {
  const inputId = useId();
  const fieldId = `bse-field-${safeLabel(label)}-${inputId.replace(/:/g, "")}`;

  return (
    <label className="bse-field" htmlFor={fieldId}>
      <span className="bse-field-label">
        {label}
        {maxLength && (
          <small className="bse-character-count">
            {String(value || "").length} / {maxLength}
          </small>
        )}
      </span>

      {type === "textarea" ? (
        <textarea
          id={fieldId}
          className="bse-textarea"
          rows={rows}
          value={value || ""}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
        />
      ) : (
        <input
          id={fieldId}
          className="bse-input"
          type={type}
          value={type === "date" ? toDateInputValue(value) : value || ""}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange?.(type === "date" ? formatDisplayDateFromInput(event.target.value) : event.target.value)}
        />
      )}

      {hint && <small className="bse-field-hint">{hint}</small>}
    </label>
  );
}
