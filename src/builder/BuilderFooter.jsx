import "../styles/builderFooter.css";

const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5173";

export default function BuilderFooter() {
  return (
    <footer className="builder-footer">
      <div className="footer-container">
        
        {/* BRAND */}
        <div className="footer-brand">
          <h3>Ulterspace Builder</h3>
          <p>Build Beyond Limits</p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href={DASHBOARD_URL}>Dashboard</a>
            </li>
            <li>
              <a href="#preview">Preview</a>
            </li>
            <li>
              <a href="#publish">Publish</a>
            </li>
            <li>
              <a href="#templates">Templates</a>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Documentation</a>
            </li>
            <li>
              <a href="#">Contact Support</a>
            </li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Ulterspace. All rights reserved.
      </div>
    </footer>
  );
}