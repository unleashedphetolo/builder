import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `teameditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function TeamEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Team Members"
        items={draftContent.items || []}
        addLabel="Add Team Member"
        emptyText="No team members configured."
        createItem={() => ({ id: createId(), name: "New Member", role: "", image_url: "", bio: "" })}
        fields={[
          {"key": "name", "label": "Name"},
          {"key": "role", "label": "Role"},
          {"key": "bio", "label": "Bio", "type": "textarea", "rows": 3},
          {"key": "image_url", "label": "Image URL"}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
