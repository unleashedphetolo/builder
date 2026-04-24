import { useEffect, useState } from "react";
import "../styles/builderNavbar.css";
import logo from "../assets/logo.gif";

const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || "http://localhost:3000/dashboard";

export default function BuilderNavbar({
  toggleSidebar,
  onPreview,
  onPublish,
  onChangeTemplate,
  onExport,
  onDownloadHtml,
  saveStatus = "Saved",
}) {
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToDashboard = () => {
    setMobileMenuOpen(false);
    window.location.href = DASHBOARD_URL;
  };

  const handleSidebarToggle = () => {
    if (toggleSidebar) toggleSidebar();
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleChangeTemplate = () => {
    setMobileMenuOpen(false);
    if (onChangeTemplate) onChangeTemplate();
  };

  const handlePreview = () => {
    setMobileMenuOpen(false);
    if (onPreview) onPreview();
  };

  const handleExport = () => {
    setMobileMenuOpen(false);
    if (onExport) onExport();
  };

  const handleDownloadHtml = () => {
    setMobileMenuOpen(false);
    if (onDownloadHtml) onDownloadHtml();
  };

  const handlePublishConfirm = () => {
    if (onPublish) onPublish();
    setShowPublishConfirm(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="builder-navbar">
        <div className="builder-navbar-left">
          <button
            onClick={handleSidebarToggle}
            className="sidebar-toggle"
            type="button"
            aria-label="Toggle sidebar"
          >
            <span />
            <span />
            <span />
          </button>

          <div className="brand">
            <div className="logo">
              <img src={logo} alt="Ulterspace logo" />
            </div>

            <div className="brand-text">
              <h3>Ulterspace</h3>
              <span>Build Beyond Limits</span>
            </div>
          </div>
        </div>

        <div className="builder-navbar-center">
          {/* <span className="page-indicator">Website Builder</span> */}
          <span className="page-indicator">ICT</span>
        </div>

        <div
          className={`builder-navbar-right ${
            mobileMenuOpen ? "mobile-open" : ""
          }`}
        >
          <span className="save-status">{saveStatus}</span>

          <button className="btn ghost" onClick={goToDashboard} type="button">
            Dashboard
          </button>

          <button
            className="btn ghost"
            onClick={handleChangeTemplate}
            type="button"
          >
            Change Template
          </button>

          <button className="btn" onClick={handlePreview} type="button">
            Preview
          </button>

          <button className="btn" onClick={handleExport} type="button">
            Export ZIP
          </button>

          <button
            className="btn secondary"
            onClick={handleDownloadHtml}
            type="button"
          >
            Download 1-File
          </button>

          <button
            className="btn primary"
            onClick={() => setShowPublishConfirm(true)}
            type="button"
          >
            Publish
          </button>
        </div>

        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
          onClick={handleMobileMenuToggle}
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {showPublishConfirm && (
        <div className="publish-modal">
          <div className="publish-box">
            <h3>Ready to Publish?</h3>
            <p>Your website will go live instantly.</p>

            <div className="publish-actions">
              <button
                className="btn"
                onClick={() => setShowPublishConfirm(false)}
                type="button"
              >
                Cancel
              </button>

              <button
                className="btn primary"
                onClick={handlePublishConfirm}
                type="button"
              >
                Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile && mobileMenuOpen && (
        <div
          className="builder-navbar-mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
