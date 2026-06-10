import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `serviceseditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function ServicesEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Services"
        items={draftContent.items || []}
        addLabel="Add Service"
        emptyText="No services configured."
        createItem={() => ({ id: createId(), title: "New Service", body: "", image_url: "", link: "" })}
        fields={[
          {"key": "title", "label": "Service Title"},
          {"key": "body", "label": "Description", "type": "textarea", "rows": 3},
          {"key": "image_url", "label": "Image URL"},
          {"key": "link", "label": "Link"}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
