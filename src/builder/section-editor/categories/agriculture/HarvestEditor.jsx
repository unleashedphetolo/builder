import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `harvesteditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function HarvestEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Harvest Seasons"
        items={draftContent.items || []}
        addLabel="Add Item"
        emptyText="No harvest seasons configured."
        createItem={() => ({ id: createId(), title: "New Item", body: "", image_url: "", season: "" })}
        fields={[
          {"key": "title", "label": "Title"},
          {"key": "body", "label": "Description", "type": "textarea", "rows": 3},
          {"key": "season", "label": "Season / Availability"},
          {"key": "image_url", "label": "Image URL"}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
