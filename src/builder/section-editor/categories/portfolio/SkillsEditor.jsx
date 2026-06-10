import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `skillseditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function SkillsEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Skills"
        items={draftContent.items || []}
        addLabel="Add Skill"
        emptyText="No skills configured."
        createItem={() => ({ id: createId(), title: "New Skill", level: "", body: "" })}
        fields={[
          {"key": "title", "label": "Skill"},
          {"key": "level", "label": "Level"},
          {"key": "body", "label": "Description", "type": "textarea", "rows": 2}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
