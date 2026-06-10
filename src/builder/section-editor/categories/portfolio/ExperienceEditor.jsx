import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `experienceeditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function ExperienceEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Experience Items"
        items={draftContent.items || []}
        addLabel="Add Experience"
        emptyText="No experience items configured."
        createItem={() => ({ id: createId(), title: "New Role", company: "", period: "", body: "" })}
        fields={[
          {"key": "title", "label": "Role / Title"},
          {"key": "company", "label": "Company"},
          {"key": "period", "label": "Period"},
          {"key": "body", "label": "Description", "type": "textarea", "rows": 3}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
