import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `safetyeditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function SafetyEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Health & Safety"
        items={draftContent.items || []}
        addLabel="Add Item"
        emptyText="No health & safety configured."
        createItem={() => ({ id: createId(), title: "New Item", body: "", image_url: "", document_url: "" })}
        fields={[
          {"key": "title", "label": "Title"},
          {"key": "body", "label": "Description", "type": "textarea", "rows": 3},
          {"key": "image_url", "label": "Image URL"},
          {"key": "document_url", "label": "PDF / Document URL"}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
