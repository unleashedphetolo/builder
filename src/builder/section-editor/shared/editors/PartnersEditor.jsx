import ItemCollection from "../fields/ItemCollection";
import ContentField from "../fields/ContentField";

const createId = () => `partner-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function PartnersEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={3} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Partners / Sponsors"
        items={draftContent.items || []}
        addLabel="Add Partner"
        emptyText="No partners configured."
        createItem={() => ({ id: createId(), name: "New Partner", logo: "", link: "#" })}
        fields={[
          { key: "name", label: "Name" },
          { key: "logo", label: "Logo URL" },
          { key: "link", label: "Website Link" },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
