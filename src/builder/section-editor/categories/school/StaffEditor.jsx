import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `staff-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function StaffEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={3} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Staff Members"
        items={draftContent.items || draftContent.staff || []}
        addLabel="Add Staff Member"
        emptyText="No staff members configured."
        createItem={() => ({ id: createId(), name: "New Staff Member", role: "Educator", img: "" })}
        fields={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "img", label: "Photo URL" },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
