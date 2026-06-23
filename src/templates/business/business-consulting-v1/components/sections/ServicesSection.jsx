import React from "react";
import {
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiCpu,
  FiLayers,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import BusinessLink from "../common/BusinessLink";
import SectionHeader from "../common/SectionHeader";

const SERVICE_ICONS = {
  strategy: FiTrendingUp,
  consulting: FiBriefcase,
  operations: FiLayers,
  automation: FiCpu,
  governance: FiShield,
  clients: FiUsers,
  marketing: FiBarChart2,
  support: FiCheckCircle,
};

const DEFAULT_SERVICE_ITEMS = [
  {
    id: "fallback-service-1",
    title: "Business Strategy & Advisory",
    body:
      "Practical planning, market positioning and decision support for growing organisations.",
    icon: "strategy",
    link: "/contact",
  },
  {
    id: "fallback-service-2",
    title: "Operations & Process Improvement",
    body:
      "Clear workflows, service delivery systems and reporting structures that help teams perform consistently.",
    icon: "operations",
    link: "/contact",
  },
  {
    id: "fallback-service-3",
    title: "Digital Systems & Automation",
    body:
      "Client-ready digital tools, automation support and internal systems that improve speed and accountability.",
    icon: "automation",
    link: "/contact",
  },
];

function getServiceIcon(item = {}, index = 0) {
  const iconKey = String(item.icon || item.icon_key || "").trim().toLowerCase();
  const fallbackKeys = ["strategy", "operations", "automation", "governance", "clients", "support"];
  const Icon = SERVICE_ICONS[iconKey] || SERVICE_ICONS[fallbackKeys[index % fallbackKeys.length]] || FiBriefcase;

  return Icon;
}

export default function ServicesSection({
  content = {},
  settings = {},
  navigateTo,
  builderMode,
  pricing = false,
}) {
  const items = Array.isArray(content.items) && content.items.length
    ? content.items
    : DEFAULT_SERVICE_ITEMS;
  const fallbackImages = settings.media?.serviceImages || [];

  return (
    <section className="business-section business-services-section">
      <div className="business-container">
        <SectionHeader
          eyebrow={pricing ? "Pricing" : content.eyebrow || "Services"}
          title={
            content.section_title ||
            content.heading ||
            (pricing ? "Plans Built for Growth" : "Professional Business Services")
          }
          subtitle={
            content.subtitle ||
            content.description ||
            "Real, practical business services that help clients trust the company and understand the value clearly."
          }
        />

        <div className="business-card-grid">
          {items.map((item, index) => {
            const image =
              item.image_url ||
              item.image ||
              fallbackImages[index % Math.max(fallbackImages.length, 1)] ||
              "";
            const Icon = getServiceIcon(item, index);

            return (
              <article
                className="business-card business-service-card"
                key={item.id || `${item.title}-${index}`}
              >
                {image ? (
                  <img
                    className="business-card__image"
                    src={image}
                    alt={item.image_alt || item.title || "Business service"}
                  />
                ) : null}

                <div className="business-service-card__top">
                  <span className="business-service-icon" aria-hidden="true">
                    <Icon />
                  </span>
                  <span className="business-card__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3>{item.title || item.name || "Business Service"}</h3>
                <p>
                  {item.body ||
                    item.description ||
                    "Professional service details can be edited from the builder."}
                </p>

                {Array.isArray(item.bullets) && item.bullets.length ? (
                  <ul className="business-service-bullets">
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}

                {item.link ? (
                  <BusinessLink
                    settings={settings}
                    navigateTo={navigateTo}
                    builderMode={builderMode}
                    href={item.link}
                  >
                    {item.button_label || "Discuss this service"}
                  </BusinessLink>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
