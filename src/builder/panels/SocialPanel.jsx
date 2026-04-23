import React from "react";
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
  "x",
  "youtube",
  "tiktok",
  "linkedin",
  "whatsapp",
];

const PLATFORM_DEFAULTS = {
  facebook: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "Facebook",
    placeholder: "https://www.facebook.com",
  },
  instagram: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "Instagram",
    placeholder: "https://www.instagram.com",
  },
  x: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "X",
    placeholder: "https://www.x.com",
  },
  youtube: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "YouTube",
    placeholder: "https://www.youtube.com",
  },
  tiktok: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "TikTok",
    placeholder: "https://www.tiktok.com",
  },
  linkedin: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "LinkedIn",
    placeholder: "https://www.linkedin.com",
  },
  whatsapp: {
    enabled: true,
    url: "",
    colorMode: "original",
    label: "WhatsApp",
    placeholder: "https://www.whatsapp.com/",
  },
};

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

export default function SocialPanel({
  siteSettings = {},
  onUpdateSocialMedia,
  onUpdateSettings,
}) {
  const social =
    siteSettings.social_media ||
    siteSettings.social || {
      topbar: true,
      footer: true,
      order: DEFAULT_PLATFORMS,
    };

  const order = Array.isArray(social.order) ? social.order : DEFAULT_PLATFORMS;

  const persistSocial = async (nextSocial) => {
    if (onUpdateSocialMedia) {
      await onUpdateSocialMedia(nextSocial);
      return;
    }

    if (onUpdateSettings) {
      await onUpdateSettings({
        social_media: nextSocial,
      });
    }
  };

  const updateGlobal = async (key, value) => {
    await persistSocial({
      ...social,
      [key]: value,
    });
  };

  const update = async (platform, field, value) => {
    await persistSocial({
      ...social,
      [platform]: {
        ...(PLATFORM_DEFAULTS[platform] || {}),
        ...(social[platform] || {}),
        [field]: value,
      },
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(order, oldIndex, newIndex);

    await persistSocial({
      ...social,
      order: newOrder,
    });
  };

  return (
    <div className="section-block">
      <h4>Social Media</h4>

      <div className="social-item">
        <label>Show in Topbar</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={!!social.topbar}
            onChange={(e) => updateGlobal("topbar", e.target.checked)}
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
            onChange={(e) => updateGlobal("footer", e.target.checked)}
          />
          <span className="slider" style={{ "--brand": "#3b82f6" }} />
        </label>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((platform) => {
            const defaults = PLATFORM_DEFAULTS[platform] || {
              enabled: true,
              url: "",
              colorMode: "original",
              label: platform,
              placeholder: `https://${platform}.com`,
            };

            const data = {
              ...defaults,
              ...(social[platform] || {}),
            };

            return (
              <SortableItem key={platform} id={platform}>
                <div className="social-item drag-item">
                  <div className="social-header">
                    <strong>{data.label}</strong>

                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={!!data.enabled}
                        onChange={(e) =>
                          update(platform, "enabled", e.target.checked)
                        }
                      />
                      <span
                        className="slider"
                        style={{
                          "--brand": "#22c55e",
                        }}
                      />
                    </label>
                  </div>

                  <div className="field">
                    <label>{data.label} Link</label>
                    <input
                      type="text"
                      placeholder={data.placeholder}
                      value={data.url || ""}
                      onChange={(e) => update(platform, "url", e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Icon Style</label>
                    <select
                      value={data.colorMode || "original"}
                      onChange={(e) =>
                        update(platform, "colorMode", e.target.value)
                      }
                    >
                      <option value="original">Original</option>
                      <option value="mono">Black and White</option>
                    </select>
                  </div>
                </div>
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
}