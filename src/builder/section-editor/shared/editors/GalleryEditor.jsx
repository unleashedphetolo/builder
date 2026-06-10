import ItemCollection from "../fields/ItemCollection";
import ContentField from "../fields/ContentField";

const createId = () => `gallery-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function GalleryEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={2} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Gallery Items"
        items={draftContent.items || []}
        emptyText="No gallery items configured."
        addLabel="Add Gallery Item"
        createItem={() => ({ id: createId(), title: "New Image", image_url: "", link: "", image_alt: "" })}
        fields={[
          { key: "title", label: "Title" },
          { key: "image_url", label: "Image URL" },
          { key: "image_alt", label: "Alternative Text" },
          { key: "link", label: "Optional Link" },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
