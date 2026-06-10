import ContentField from "../../shared/fields/ContentField";

export default function PrincipalMessageEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Message" type="textarea" rows={7} value={draftContent.message || draftContent.body || ""} onChange={(v) => updateContent("message", v)} />
      <div className="bse-two-column">
        <ContentField label="Principal Name" value={draftContent.principal_name || draftContent.name || ""} onChange={(v) => updateContent("principal_name", v)} />
        <ContentField label="Role / Position" value={draftContent.principal_role || draftContent.role || ""} onChange={(v) => updateContent("principal_role", v)} />
      </div>
      <ContentField label="Image URL" value={draftContent.image_url || draftContent.image || ""} onChange={(v) => updateContent("image_url", v)} />
    </>
  );
}
