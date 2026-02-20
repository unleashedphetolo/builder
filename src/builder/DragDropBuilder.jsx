import { DndContext } from "@dnd-kit/core";

export default function DragDropBuilder({ sections, setSections }) {
  return (
    <DndContext>
      {sections.map((s) => (
        <div key={s.id}>{s.type}</div>
      ))}
    </DndContext>
  );
}
