import { Link } from "react-router-dom";
import "../../styles/schoolLayout.css";

export default function SchoolLayout({ children }) {
  return (
    <div className="school-layout">

      {/* NAVBAR */}
      <header className="school-navbar">
        <h2>🏫 School Name</h2>

        <nav>
          <Link to="/">Home</Link>

          <div className="dropdown">
            About
            <div className="dropdown-content">
              <Link to="/about/who-we-are">Who We Are</Link>
              <Link to="/about/vision-mission">Vision & Mission</Link>
              <Link to="/about/staff">Staff</Link>
              <Link to="/about/sgb">SGB</Link>
              <Link to="/about/facilities">Facilities</Link>
              <Link to="/about/history">History</Link>
            </div>
          </div>

          <Link to="/digital-library">Library</Link>

          <div className="dropdown">
            Activities
            <div className="dropdown-content">
              <Link to="/activities/academics">Academics</Link>
              <Link to="/activities/sports">Sports</Link>
              <Link to="/activities/culture">Culture</Link>
              <Link to="/activities/facilities">Facilities</Link>
            </div>
          </div>

          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Welcome to Our School</h1>
        <p>Excellence • Discipline • Success</p>
      </section>

      {/* MAIN CONTENT */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer className="school-footer">
        <p>© 2026 School Name • All Rights Reserved</p>
      </footer>
    </div>
  );
}