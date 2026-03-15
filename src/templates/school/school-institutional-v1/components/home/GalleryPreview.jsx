import React from "react";
import "../../styles/gallery.css";

export default function GalleryPreview() {

  const navigate = (slug) => {
    window.dispatchEvent(
      new CustomEvent("builder:navigate", { detail: slug })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(item.link);
            }}
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