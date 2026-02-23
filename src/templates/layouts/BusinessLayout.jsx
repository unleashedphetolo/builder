import { Link } from "react-router-dom";
import "../../styles/businessLayout.css";

export default function BusinessLayout({ children }) {
  return (
    <div className="business-layout">

      {/* NAVBAR */}
      <header className="business-navbar">
        <h2>🏢 Corporate Inc.</h2>

        <nav>
          <Link to="/">Home</Link>

          <div className="dropdown">
            Company
            <div className="dropdown-content">
              <Link to="/about/who-we-are">Who We Are</Link>
              <Link to="/about/vision-mission">Vision</Link>
              <Link to="/about/staff">Team</Link>
            </div>
          </div>

          <div className="dropdown">
            Services
            <div className="dropdown-content">
              <Link to="/services/consulting">Consulting</Link>
              <Link to="/services/solutions">Solutions</Link>
              <Link to="/services/support">Support</Link>
            </div>
          </div>

          <Link to="/news">News</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="business-hero">
        <h1>Driving Innovation & Growth</h1>
        <p>Enterprise-grade solutions for modern businesses</p>
        <button className="cta-btn">Get Started</button>
      </section>

      {/* MAIN */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer className="business-footer">
        <div>
          <h4>Corporate Inc.</h4>
          <p>Leading innovation since 2005</p>
        </div>

        <div>
          <h4>Links</h4>
          <p>About</p>
          <p>Services</p>
          <p>Contact</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>Email: info@company.com</p>
          <p>Phone: +27 00 000 0000</p>
        </div>
      </footer>
    </div>
  );
}