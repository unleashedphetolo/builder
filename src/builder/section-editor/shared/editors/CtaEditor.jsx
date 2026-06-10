import ContentField from "../fields/ContentField";

export default function CtaEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Heading" value={draftContent.heading || ""} onChange={(v) => updateContent("heading", v)} />
      <ContentField label="Description" type="textarea" rows={4} value={draftContent.description || draftContent.body || ""} onChange={(v) => updateContent("description", v)} />
      <div className="bse-two-column">
        <ContentField label="Primary Button Label" value={draftContent.primary_button_label || ""} onChange={(v) => updateContent("primary_button_label", v)} />
        <ContentField label="Primary Button Link" value={draftContent.primary_button_href || ""} onChange={(v) => updateContent("primary_button_href", v)} />
        <ContentField label="Secondary Button Label" value={draftContent.secondary_button_label || ""} onChange={(v) => updateContent("secondary_button_label", v)} />
        <ContentField label="Secondary Button Link" value={draftContent.secondary_button_href || ""} onChange={(v) => updateContent("secondary_button_href", v)} />
      </div>
      <ContentField label="Background Image URL" value={draftContent.background_image || ""} onChange={(v) => updateContent("background_image", v)} />
    </>
  );
}
