import "../styles/builderSidebar.css";


export default function BuilderSidebar({ setSelectedSection }) {
  return (
    <aside className="builder-sidebar">

      <h4>Pages</h4>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Admissions</li>
        <li>Gallery</li>
      </ul>

      <h4>Sections</h4>
      <div className="sections">

        <div onClick={() => setSelectedSection("hero")} className="section-item">
          Hero Section
        </div>

        <div onClick={() => setSelectedSection("about")} className="section-item">
          About Section
        </div>

        <div onClick={() => setSelectedSection("gallery")} className="section-item">
          Gallery Section
        </div>

      </div>

    </aside>
  );
}