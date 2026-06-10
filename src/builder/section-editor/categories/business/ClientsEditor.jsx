import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `clientseditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function ClientsEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Clients"
        items={draftContent.items || []}
        addLabel="Add Client"
        emptyText="No clients configured."
        createItem={() => ({ id: createId(), name: "New Client", logo: "", link: "" })}
        fields={[
          {"key": "name", "label": "Client Name"},
          {"key": "logo", "label": "Logo URL"},
          {"key": "link", "label": "Link"}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
