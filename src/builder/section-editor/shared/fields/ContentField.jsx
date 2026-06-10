import { useId } from "react";

function safeLabel(value = "field") {
  return String(value || "field")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
          value={value || ""}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange?.(event.target.value)}
        />
      )}

      {hint && <small className="bse-field-hint">{hint}</small>}
    </label>
  );
}
