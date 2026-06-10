import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `productseditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function ProductsEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Products"
        items={draftContent.items || []}
        addLabel="Add Item"
        emptyText="No products configured."
        createItem={() => ({ id: createId(), title: "New Item", body: "", image_url: "", link: "" })}
        fields={[
          {"key": "title", "label": "Title"},
          {"key": "body", "label": "Description", "type": "textarea", "rows": 3},
          {"key": "image_url", "label": "Image URL"},
          {"key": "link", "label": "Link"}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
