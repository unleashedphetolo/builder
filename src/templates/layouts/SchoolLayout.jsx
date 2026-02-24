import { Link } from "react-router-dom";
import "../../styles/schoolLayout.css";
import schoologo from "../../assets/school.png";


export default function SchoolLayout({
  children,
  schoolName = "Greenfield Academy",
  slogan = "Elevate Potential. Create Impact.",
  logoUrl,
  year = new Date().getFullYear()
}) {
  return (
    <div className="school-layout">

      {/* NAVBAR */}
      <header className="school-navbar">
        <div className="logo-area">
          {logoUrl ? (
            <img src={logoUrl} alt="School Logo" className="school-logo" />
          ) : (
            <div className="logo-fallback"><img src={schoologo} alt="logo" /></div>
          )}

          <div className="brand-text">
            <h2>{schoolName}</h2>
            <span>{slogan}</span>
          </div>
        </div>
        <nav>
          <Link to="/">Home</Link>

          <div className="dropdown">
            About
            <div className="dropdown-content">
              <Link to="/about/who-we-are">Who We Are</Link>
              <Link to="/about/vision-mission">Vision & Mission</Link>
              <Link to="/about/staff">Our Staff</Link>
              <Link to="/about/sgb">School Governing Body</Link>
              <Link to="/about/facilities">Campus Facilities</Link>
              <Link to="/about/history">Our History</Link>
            </div>
          </div>

          <Link to="/digital-library">Digital Library</Link>

          <div className="dropdown">
            Activities
            <div className="dropdown-content">
              <Link to="/activities/academics">Academic Programs</Link>
              <Link to="/activities/sports">Sports & Athletics</Link>
              <Link to="/activities/culture">Arts & Culture</Link>
              <Link to="/activities/facilities">Student Facilities</Link>
            </div>
          </div>

          <Link to="/gallery">Photo Gallery</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Welcome to {schoolName}</h1>
        <p>{slogan}</p>
        <div className="hero-buttons">
          <Link to="/about/who-we-are" className="hero-btn primary">
            Learn More
          </Link>
          <Link to="/contact" className="hero-btn secondary">
            Apply Now
          </Link>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main>
        {children || (
          <section style={{ padding: "60px 20px", textAlign: "center" }}>
            <h2>Building Bright Futures</h2>
            <p style={{ maxWidth: "700px", margin: "20px auto", lineHeight: 1.6 }}>
              At {schoolName}, we are committed to nurturing academic excellence,
              strong character, and lifelong learning. Our dedicated educators
              provide a supportive and innovative environment where every student
              can thrive and achieve their full potential.
            </p>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="school-footer">
        <div className="footer-content">
          <div>
            <h4>{schoolName}</h4>
            <p>
              A leading institution dedicated to academic excellence,
              character development, and community growth.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p><Link to="/">Home</Link></p>
            <p><Link to="/about/who-we-are">About Us</Link></p>
            <p><Link to="/gallery">Gallery</Link></p>
            <p><Link to="/contact">Contact</Link></p>
          </div>

          <div>
            <h4>Contact Info</h4>
            <p>Email: info@greenfieldacademy.edu</p>
            <p>Phone: +1 (000) 123-4567</p>
            <p>Address: 123 Education Lane, Learning City</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} {schoolName}. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}