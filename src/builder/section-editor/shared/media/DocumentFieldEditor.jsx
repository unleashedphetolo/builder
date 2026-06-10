import ContentField from "../fields/ContentField";

export default function DocumentFieldEditor({ label = "Document URL", value = "", onChange, onUpload, onChoose }) {
  return (
    <div className="bse-media-field">
      <ContentField
        label={label}
        value={value || ""}
        placeholder="Paste PDF or document URL"
        onChange={onChange}
      />
      <div className="bse-media-actions">
        <button type="button" className="bse-secondary-button" onClick={onUpload}>Upload PDF / Document</button>
        <button type="button" className="bse-secondary-button" onClick={onChoose}>Choose from Library</button>
      </div>
      {value && (
        <a className="bse-link-button" href={value} target="_blank" rel="noreferrer">
          Open document
        </a>
      )}
    </div>
  );
}
