import ContentField from "../fields/ContentField";

export default function ImageFieldEditor({ label = "Image URL", value = "", onChange, onUpload, onChoose }) {
  return (
    <div className="bse-media-field">
      <ContentField
        label={label}
        value={value || ""}
        placeholder="Paste image URL"
        onChange={onChange}
      />
      <div className="bse-media-actions">
        <button type="button" className="bse-secondary-button" onClick={onUpload}>Upload Image</button>
        <button type="button" className="bse-secondary-button" onClick={onChoose}>Choose from Library</button>
      </div>
      {value && <img className="bse-media-preview-image" src={value} alt="" />}
    </div>
  );
}
