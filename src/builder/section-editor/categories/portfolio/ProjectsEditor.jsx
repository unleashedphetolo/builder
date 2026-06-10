import ContentField from "../../shared/fields/ContentField";
import ItemCollection from "../../shared/fields/ItemCollection";

const createId = () => `projectseditor-${Date.now()}-${Math.round(Math.random() * 100000)}`;

export default function ProjectsEditor({ draftContent = {}, updateContent }) {
  return (
    <>
      <ContentField label="Section Title" value={draftContent.section_title || ""} onChange={(v) => updateContent("section_title", v)} />
      <ContentField label="Subtitle / Description" type="textarea" rows={3} value={draftContent.subtitle || draftContent.description || ""} onChange={(v) => updateContent("subtitle", v)} />
      <ItemCollection
        title="Projects"
        items={draftContent.items || []}
        addLabel="Add Project"
        emptyText="No projects configured."
        createItem={() => ({ id: createId(), title: "New Project", body: "", image_url: "", link: "" })}
        fields={[
          {"key": "title", "label": "Project Title"},
          {"key": "body", "label": "Description", "type": "textarea", "rows": 3},
          {"key": "image_url", "label": "Image URL"},
          {"key": "link", "label": "Project Link"}
        ]}
        onChange={(items) => updateContent("items", items)}
      />
    </>
  );
}
