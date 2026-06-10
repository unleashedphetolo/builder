import ContentField from "../../shared/fields/ContentField";
import TextListField from "../../shared/fields/TextListField";

export default function PersonalProfileEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Full Name" value={draftContent.full_name || draftContent.section_title || ""} onChange={(v) => updateContent("full_name", v)} />
      <ContentField label="Professional Title" value={draftContent.professional_title || ""} onChange={(v) => updateContent("professional_title", v)} />
      <ContentField label="Bio" type="textarea" rows={5} value={draftContent.bio || draftContent.body || ""} onChange={(v) => updateContent("bio", v)} />
      <ContentField label="Profile Image URL" value={draftContent.image_url || ""} onChange={(v) => updateContent("image_url", v)} />
      <TextListField label="Highlights" items={draftContent.highlights || []} onChange={(v) => updateContent("highlights", v)} />
    </>
  );
}
