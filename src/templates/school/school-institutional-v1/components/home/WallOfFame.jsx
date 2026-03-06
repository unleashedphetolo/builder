// WallOfFame.js
import React, { useState } from "react";
import "../../styles/wall.css";

const HONOREES = [
  {
    id: 1,
    name: "Top Academic Performers",
    year: 2025,
    note: "Learners who achieved distinctions across all subjects",
    cover: "/images/academics/acade13.jpg",
    gallery: [
      "/images/academics/acade10.jpg",
      "/images/academics/acade12.jpg"
    ]
  },
  {
    id: 2,
    name: "Mathematics Excellence Award",
    year: 2025,
    note: "Outstanding results in Mathematics & Physical Sciences",
    cover: "/images/academics/acade14.jpg",
    gallery: [
      "/images/academics/acade5.jpg",
      "/images/academics/acade8.jpg"
    ]
  },
  {
    id: 3,
    name: "Most Improved Academic Performance",
    year: 2025,
    note: "Recognising exceptional academic growth and commitment",
    cover: "/images/academics/acade4.jpg",
    gallery: [
      "/images/academics/acade3.webp",
      "/images/academics/acade1.jpg"
    ]
  }
];

export default function WallOfFame() {
  const [preview, setPreview] = useState(null);

  return (
    <div className="wall-container">
      <h2 className="wall-title">Academic Wall of Fame</h2>
      <p className="wall-subtitle">
        Celebrating Outstanding Academic Performance & Excellence
      </p>

      <div className="wall-grid">
        {HONOREES.map(h => (
          <div className="honour-card" key={h.id}>
            <div className="honour-cover">
              <img
                src={h.cover}
                alt={h.name}
                onClick={() => setPreview(h.cover)}
              />
              <span className="badge">{h.year}</span>
            </div>

            <div className="honour-body">
              <h4>{h.name}</h4>
              <p>{h.note}</p>

              <div className="honour-gallery">
                {h.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Academic achievement"
                    onClick={() => setPreview(img)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div className="image-preview" onClick={() => setPreview(null)}>
          <img src={preview} alt="Preview" />
          <span className="close">✕</span>
        </div>
      )}
    </div>
  );
}
