import React, { useState } from 'react';
import "../../styles/photo-gallery.css";

const IMAGES = [
  { id:1, title:'Soccer Coaches 2025', src:'/images/gallery1.jpg' },
  { id:2, title:'Soccer Team 2025', src:'/images/gallery2.avif' },
  { id:3, title:'QMS Submitor Of The Month 2025', src:'/images/gallery3.png' },
  { id:4, title:'Culture', src:'/images/gallery4.jpg' },
  { id:5, title:'School Event', src:'/images/gallery5.jpg' },
  { id:6, title:'Classroom Activity', src:'/images/gallery22.jpg' }
];

export default function PhotoGallery(){
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <div className="photo-grid">
        {IMAGES.map(img => (
          <div key={img.id} className="photo-tile" onClick={() => setLightbox(img)}>
            <div className="bg" style={{ backgroundImage:`url(${img.src})` }} />
            <div className="caption">{img.title}</div>
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-card" onClick={(e)=> e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.title} />
            <div className="meta">
              <h3>{lightbox.title}</h3>
              <button className="close" onClick={() => setLightbox(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
