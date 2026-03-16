import React from "react";
import PhotoGallery from "../components/gallery/PhotoGallery";
import WallOfFame from "../components/home/WallOfFame";

export default function Gallery() {
  return (
    <div className="container" style={{ paddingTop: 10 }}>
      <h2 className="section-title">Photo Gallery</h2>
      <PhotoGallery />
      <div style={{ marginTop: 30 }}>
        <WallOfFame />
      </div>
    </div>
  );
}
