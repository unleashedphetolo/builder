import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `card-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function VisionMissionEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={2} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Vision, Mission & Values Cards"
        items={draftContent.cards || []}
        addLabel="Add Card"
        emptyText="No information cards configured."
        createItem={() => ({ id: createId(), eyebrow: "NEW", title: "New Card", body: "", values: [] })}
        fields={[
          { key: "eyebrow", label: "Small Label" },
          { key: "title", label: "Title" },
          { key: "body", label: "Content", type: "textarea", rows: 4 },
          { key: "values", label: "Values / Bullet Items", type: "list", rows: 4 },
        ]}
        onChange={(items) => updateContent("cards", items)}
      />
    </>
  );
}
