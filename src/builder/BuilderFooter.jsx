import "../styles/builderFooter.css";
import logo from "../assets/logo.gif";
import { Link } from "react-router-dom";

const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || "http://localhost:3000/dashboard";

export default function BuilderFooter({
  onPreview,
  onPublish,
  onChangeTemplate,
  onExport,
  onDownloadHtml,
}) {
  const goToDashboard = () => {
    window.location.href = DASHBOARD_URL;
  };

  const handleChangeTemplate = () => {
    if (onChangeTemplate) onChangeTemplate();
  };

  const handlePreview = () => {
    if (onPreview) onPreview();
  };

  const handleExport = () => {
    if (onExport) onExport();
  };

  const handleDownloadHtml = () => {
    if (onDownloadHtml) onDownloadHtml();
  };

  const handlePublish = () => {
    if (onPublish) onPublish();
  };

  return (
    <footer className="builder-footer">
      <div className="footer-container">
        {/* BRAND */}
        <Link to="/" className="footer-brand">
          <div className="logo">
            <img src={logo} alt="Ulterspace logo" />
          </div>

          <div className="brand-text">
            <h3>Ulterspace</h3>
            <span>Build Beyond Limits</span>
          </div>
        </Link>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <button type="button" onClick={goToDashboard}>
                Dashboard
              </button>
            </li>

            <li>
              <button type="button" onClick={handleChangeTemplate}>
                Change Template
              </button>
            </li>

            <li>
              <button type="button" onClick={handlePreview}>
                Preview
              </button>
            </li>

            <li>
              <button type="button" onClick={handleExport}>
                Export ZIP
              </button>
            </li>

            <li>
              <button type="button" onClick={handleDownloadHtml}>
                Download 1-File
              </button>
            </li>

            <li>
              <button type="button" onClick={handlePublish}>
                Publish
              </button>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li>
              <a href="mailto:ulterspace@gmail.com">Contact Support</a>
            </li>

            <li>
              <a href="mailto:ulterspace@gmail.com?subject=Ulterspace%20Help%20Center">
                Help Center
              </a>
            </li>

            <li>
              <a href="mailto:ulterspace@gmail.com?subject=Ulterspace%20Documentation%20Support">
                Documentation
              </a>
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