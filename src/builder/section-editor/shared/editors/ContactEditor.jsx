import ContentField from "../fields/ContentField";
import ItemCollection from "../fields/ItemCollection";

const createId = () => `contact-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function ContactEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={2} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <div className="bse-two-column">
        <ContentField label="Phone" value={draftContent.phone || ""} onChange={(v) => updateContent("phone", v)} />
        <ContentField label="Email" value={draftContent.email || ""} onChange={(v) => updateContent("email", v)} />
      </div>
      <ContentField label="Address" type="textarea" rows={3} value={draftContent.address || ""} onChange={(v) => updateContent("address", v)} />
      <ContentField label="Map URL" value={draftContent.map_url || ""} onChange={(v) => updateContent("map_url", v)} />
      <ItemCollection
        title="Locations / Offices"
        items={draftContent.items || []}
        addLabel="Add Location"
        emptyText="No locations configured."
        createItem={() => ({ id: createId(), title: "New Location", phone: "", email: "", address: "" })}
        fields={[
          { key: "title", label: "Title" },
          { key: "phone", label: "Phone" },
          { key: "email", label: "Email" },
          { key: "address", label: "Address", type: "textarea", rows: 2 },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
