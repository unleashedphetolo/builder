export default function ToggleRow({ title, text, checked, onChange, disabled = false }) {
  return (
    <label className={`bse-toggle-row ${disabled ? "is-disabled" : ""}`}>
      <span>
        <strong>{title}</strong>
        {text && <small>{text}</small>}
      </span>

      <span className={`bse-switch ${checked ? "is-on" : ""}`}>
        <input
          type="checkbox"
          checked={checked === true}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.checked)}
        />
        <span aria-hidden="true" />
      </span>
    </label>
  );
}
