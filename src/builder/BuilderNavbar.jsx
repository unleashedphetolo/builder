import { useState } from "react";
import "../styles/builderNavbar.css";
import logo from "../assets/logo.gif";


export default function BuilderNavbar({
  toggleSidebar,
  onPreview,
  onPublish,
  onChangeTemplate,
  saveStatus = "Saved"
}) {
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  return (
    <header className="builder-navbar">

      {/* LEFT — Branding */}
      <div className="left">

        <button onClick={toggleSidebar} className="hamburger">
          ☰
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

      {/* CENTER — Page Indicator */}
      <div className="center">
        <span className="page-indicator"></span>
      </div>

      {/* RIGHT — Actions */}
      <div className="right">

        <span className="save-status">
          {saveStatus}
        </span>

        <button className="btn ghost" onClick={onChangeTemplate}>
          Change Template
        </button>

        <button className="btn" onClick={onPreview}>
          Preview
        </button>

        <button
          className="btn primary"
          onClick={() => setShowPublishConfirm(true)}
        >
          Publish
        </button>

      </div>

      {/* Publish Confirmation Modal */}
      {showPublishConfirm && (
        <div className="publish-modal">
          <div className="publish-box">
            <h3>Ready to Publish?</h3>
            <p>Your website will go live instantly.</p>

            <div className="publish-actions">
              <button
                className="btn"
                onClick={() => setShowPublishConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="btn primary"
                onClick={() => {
                  onPublish();
                  setShowPublishConfirm(false);
                }}
              >
                Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}