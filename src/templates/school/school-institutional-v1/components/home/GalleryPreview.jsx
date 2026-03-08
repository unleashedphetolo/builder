import React from "react";
import "../../styles/gallery.css";

function buildSiteHref(siteId, path = "") {
  const clean = path ? `/${String(path).replace(/^\/+/, "")}` : "";
  return `/#/site/${siteId || ""}${clean}`;
}

export default function GalleryPreview({ settings = {} }) {
  const siteId = settings?.site_id || "";

  const items = [
    { id: 1, title: "ACADEMICS", img: "/images/gallery1.jpg", link: "/activities/academics" },
    { id: 3, title: "SPORTS", img: "/images/gallery2.avif", link: "/activities/sports" },
    { id: 2, title: "CULTURE", img: "/images/gallery4.jpg", link: "/activities/culture" },
    { id: 4, title: "STAFF", img: "/images/teachers.jpeg", link: "/staff" },
  ];

  return (
    <section className="gallery">
      <div className="gallery-grid">
        {items.map((item) => (
          <a
            className="gallery-card"
            key={item.id}
            href={buildSiteHref(siteId, item.link)}
          >
            <img src={item.img} alt={item.title} />
            <div className="gallery-overlay">
              <h3>{item.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}