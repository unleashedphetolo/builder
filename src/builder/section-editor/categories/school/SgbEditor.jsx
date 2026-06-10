import ContentField from "../../shared/fields/ContentField";
import TextListField from "../../shared/fields/TextListField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `sgb-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function SgbEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Description" type="textarea" rows={4} value={draftContent.description || draftContent.body || ""} onChange={(v) => updateContent("description", v)} />
      <ItemCollection
        title="SGB Members"
        items={draftContent.items || draftContent.members || []}
        addLabel="Add SGB Member"
        emptyText="No SGB members configured."
        createItem={() => ({ id: createId(), name: "New Member", role: "Member", img: "" })}
        fields={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "img", label: "Photo URL" },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
      <TextListField label="Responsibilities" items={draftContent.responsibilities || []} onChange={(v) => updateContent("responsibilities", v)} />
    </>
  );
}
