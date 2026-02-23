import "../styles/builderNavbar.css";


export default function BuilderNavbar({ toggleSidebar }) {
  return (
    <header className="builder-navbar">

      <div className="left">
        <button onClick={toggleSidebar} className="hamburger">
          ☰
        </button>
        <h3>🏗️ Site Builder</h3>
      </div>

      <div className="center">
        <span className="page-indicator">Home Page</span>
      </div>

      <div className="right">
        <button className="btn">Preview</button>
        <button className="btn primary">Publish</button>
      </div>

    </header>
  );
}