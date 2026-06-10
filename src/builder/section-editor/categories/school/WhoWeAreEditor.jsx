import ContentField from "../../shared/fields/ContentField";
import TextListField from "../../shared/fields/TextListField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function WhoWeAreEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Introduction" type="textarea" rows={4} value={draftContent.body || draftContent.subtitle || ""} onChange={(v) => updateContent("body", v)} />
      <div className="bse-two-column">
        <ContentField label="School Name Override" value={draftContent.school_name || ""} onChange={(v) => updateContent("school_name", v)} />
        <ContentField label="Profile Badge" value={draftContent.badge_label || ""} onChange={(v) => updateContent("badge_label", v)} />
      </div>
      <TextListField label="Profile Pills" items={draftContent.pills || []} onChange={(v) => updateContent("pills", v)} />
      <ItemCollection
        title="Profile Statistics"
        items={draftContent.stats || []}
        addLabel="Add Statistic"
        emptyText="No statistics configured."
        createItem={() => ({ id: createId("stat"), value: "0", label: "New Statistic" })}
        fields={[
          { key: "value", label: "Value" },
          { key: "label", label: "Label" },
        ]}
        onChange={(items) => updateContent("stats", items)}
      />
      <ItemCollection
        title="Who We Are Cards"
        items={draftContent.cards || []}
        addLabel="Add Profile Card"
        emptyText="No profile cards configured."
        createItem={() => ({ id: createId("card"), title: "New Card", body: "", items: [] })}
        fields={[
          { key: "title", label: "Title" },
          { key: "body", label: "Content", type: "textarea", rows: 4 },
          { key: "items", label: "Bullet Items", type: "list", rows: 4 },
        ]}
        onChange={(items) => updateContent("cards", items)}
      />
      <ContentField label="Commitment Heading" value={draftContent.commitment_title || ""} onChange={(v) => updateContent("commitment_title", v)} />
      <ContentField label="Commitment Content" type="textarea" rows={4} value={draftContent.commitment_body || ""} onChange={(v) => updateContent("commitment_body", v)} />
    </>
  );
}
