import ContentField from "../../shared/fields/ContentField";
import TextListField from "../../shared/fields/TextListField";

export default function FarmProfileEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Farm Name" value={draftContent.farm_name || draftContent.section_title || ""} onChange={(v) => updateContent("farm_name", v)} />
      <ContentField label="Farm Description" type="textarea" rows={5} value={draftContent.description || draftContent.body || ""} onChange={(v) => updateContent("description", v)} />
      <div className="bse-two-column">
        <ContentField label="Location" value={draftContent.location || ""} onChange={(v) => updateContent("location", v)} />
        <ContentField label="Farm Size" value={draftContent.farm_size || ""} onChange={(v) => updateContent("farm_size", v)} />
      </div>
      <ContentField label="Farm Image URL" value={draftContent.image_url || ""} onChange={(v) => updateContent("image_url", v)} />
      <TextListField label="Farm Highlights" items={draftContent.highlights || []} onChange={(v) => updateContent("highlights", v)} />
    </>
  );
}
