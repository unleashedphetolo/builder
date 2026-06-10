import ContentField from "../fields/ContentField";

export default function VideoFieldEditor({ label = "Video URL", value = "", onChange, onUpload, onChoose }) {
  return (
    <div className="bse-media-field">
      <ContentField
        label={label}
        value={value || ""}
        placeholder="Paste video URL"
        onChange={onChange}
      />
      <div className="bse-media-actions">
        <button type="button" className="bse-secondary-button" onClick={onUpload}>Upload Video</button>
        <button type="button" className="bse-secondary-button" onClick={onChoose}>Choose from Library</button>
      </div>
      {value && <video className="bse-media-preview-video" src={value} controls />}
    </div>
  );
}
