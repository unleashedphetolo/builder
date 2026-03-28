import React from "react";
import { useBuilderStore } from "../../store/useBuilderStore";
import "../../styles/panels.css";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DEFAULT_PLATFORMS = [
  "facebook",
  "instagram",
  "tiktok",
  "linkedin",
  "x",
  "youtube",
  "whatsapp",
];

/* ---------- DRAG ITEM ---------- */
function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="drag-handle" {...attributes} {...listeners}>
        ☰
      </div>
      {children}
    </div>
  );
}

/* ---------- MAIN PANEL ---------- */
export default function SocialPanel() {
  const { siteSettings, setSiteSettings } = useBuilderStore();

  const social = siteSettings.social ?? {
    topbar: true,
    footer: true,
  };
  const order = Array.isArray(social.order) ? social.order : DEFAULT_PLATFORMS;
  /* ---------- UPDATE FUNCTION ---------- */
  const update = (platform, field, value) => {
    setSiteSettings((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: {
          ...prev.social?.[platform],
          [field]: value,
        },
      },
    }));
  };

  /* ---------- DRAG END ---------- */
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);

    const newOrder = arrayMove(order, oldIndex, newIndex);

    setSiteSettings((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        order: newOrder,
      },
    }));
  };

  return (
    <div>
      <h3>Social Links</h3>

      {/* 🔹 GLOBAL TOGGLES */}
      <div className="social-item">
        <label>Show in Topbar</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={!!social.topbar}
            onChange={() =>
              setSiteSettings((prev) => ({
                ...prev,
                social: {
                  ...prev.social,
                  topbar: !prev.social?.topbar,
                },
              }))
            }
          />
          <span className="slider" style={{ "--brand": "#3b82f6" }} />
        </label>
      </div>

      <div className="social-item">
        <label>Show in Footer</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={social.footer ?? true}
            onChange={() =>
              setSiteSettings((prev) => ({
                ...prev,
                social: {
                  ...prev.social,
                  footer: !prev.social?.footer,
                },
              }))
            }
          />
          <span className="slider" style={{ "--brand": "#3b82f6" }} />
        </label>
      </div>

      {/* 🔹 DRAG LIST */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((platform) => {
            const DEFAULTS = {
              facebook: { enabled: true, url: "", color: "#1877f2" },
              instagram: { enabled: true, url: "", color: "#e4405f" },
              tiktok: { enabled: false, url: "", color: "#ffffff" },
              linkedin: { enabled: true, url: "", color: "#0a66c2" },
              x: { enabled: true, url: "", color: "#ffffff" },
              youtube: { enabled: true, url: "", color: "#ff0000" },
              whatsapp: { enabled: true, url: "", color: "#25d366" },
            };

            const data = {
              ...DEFAULTS[platform],
              ...social[platform],
            };

            return (
              <SortableItem key={platform} id={platform}>
                <div className="social-item drag-item">
                  {/* HEADER */}
                  <div className="social-header">
                    <strong>{platform.toUpperCase()}</strong>

                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!!data.enabled}
                        onChange={() =>
                          update(platform, "enabled", !data.enabled)
                        }
                      />
                      <span
                        className="slider"
                        style={{
                          "--brand": data.color || "#22c55e",
                        }}
                      />
                    </label>
                  </div>

                  {/* URL */}
                  {data.enabled && (
                    <>
                      <input
                        type="text"
                        placeholder={`Enter ${platform} link`}
                        value={data.url}
                        onChange={(e) =>
                          update(platform, "url", e.target.value)
                        }
                      />

                      {/* COLOR */}
                      <label>Icon Color</label>
                      <input
                        type="color"
                        value={data.color || "#000000"}
                        onChange={(e) =>
                          update(platform, "color", e.target.value)
                        }
                      />
                    </>
                  )}
                </div>
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}
