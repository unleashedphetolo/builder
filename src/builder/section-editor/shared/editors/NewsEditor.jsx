import ItemCollection from "../fields/ItemCollection";
import ContentField from "../fields/ContentField";

const createId = () => `news-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function NewsEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={2} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="News Stories"
        items={draftContent.items || []}
        addLabel="Add News Story"
        emptyText="No news stories configured."
        createItem={() => ({ id: createId(), title: "New Story", date: "", category: "News", summary: "", image_url: "", link: "", button_label: "Read More" })}
        fields={[
          { key: "title", label: "Title" },
          { key: "date", label: "Date", type: "date", placeholder: "Tue, Nov 25, 2025" },
          { key: "category", label: "Category" },
          { key: "summary", label: "Summary", type: "textarea", rows: 2 },
          { key: "image_url", label: "Image URL" },
          { key: "link", label: "Optional Link" },
          { key: "button_label", label: "Button Label" },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
