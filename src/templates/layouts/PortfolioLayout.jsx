import { Link } from "react-router-dom";
import "../../styles/portfolioLayout.css";

export default function PortfolioLayout({ children }) {
  return (
    <div className="portfolio-layout">

      {/* NAVBAR */}
      <header className="portfolio-navbar">
        <h2>🎨 My Portfolio</h2>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/about/who-we-are">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="portfolio-hero">
        <h1>Hello, I'm a Creative Developer</h1>
        <p>I design and build modern digital experiences</p>
      </section>

      {/* MAIN */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer className="portfolio-footer">
        <p>© 2026 My Portfolio • Built with passion</p>
      </footer>
    </div>
  );
}