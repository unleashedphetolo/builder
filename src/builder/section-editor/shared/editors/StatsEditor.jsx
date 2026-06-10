import ContentField from "../fields/ContentField";
import ItemCollection from "../fields/ItemCollection";

const createId = () => `stat-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function StatsEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle" type="textarea" rows={2} value={draftContent.subtitle || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Statistics"
        items={draftContent.items || []}
        addLabel="Add Statistic"
        emptyText="No statistics configured."
        createItem={() => ({ id: createId(), value: "0", label: "New Statistic" })}
        fields={[
          { key: "value", label: "Value" },
          { key: "label", label: "Label" },
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
