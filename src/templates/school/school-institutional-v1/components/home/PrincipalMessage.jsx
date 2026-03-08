import React from "react";
import "../../styles/principal.css";

export default function PrincipalMessage({ settings = {} }) {

  const principalName =
    settings?.principal_name || "Principal";

  const principalMessage =
    settings?.principal_message ||
    "Welcome to our school. We are committed to academic excellence, discipline and community values. Our goal is to develop confident learners prepared for the future.";

  const principalImage =
    settings?.principal_image ||
    "/images/principal.jpg";

  return (
    <section className="principal-section">
      <div className="container principal-grid">

        <div className="principal-image">
          <img src={principalImage} alt="Principal" />
        </div>

        <div className="principal-content">
          <h2>Principal's Message</h2>

          <p className="principal-text">
            {principalMessage}
          </p>

          <p className="principal-name">
            {principalName}
          </p>
        </div>

      </div>
    </section>
  );
}