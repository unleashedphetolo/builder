import React from "react";
import "../../styles/principal.css";

export default function PrincipalMessage({ settings = {}, content = {} }) {
  const principalName =
    content?.principal_name || settings?.principal_name || "Principal";

  const principalMessage =
    content?.message ||
    content?.principal_message ||
    settings?.principal_message ||
    "Welcome to our school. We are committed to academic excellence, discipline and community values. Our goal is to develop confident learners prepared for the future.";

  const principalImage =
    content?.image_url ||
    content?.principal_image ||
    settings?.principal_image ||
    "/images/principal.jpg";

  const sectionTitle =
    content?.section_title || "Principal's Message";

  const imageAlt =
    content?.image_alt || principalName;

  return (
    <section className="principal">
      <div className="container principal-inner">
        <div className="principal-text">
          <h2>{sectionTitle}</h2>

          <p>{principalMessage}</p>

          <p className="sign">{principalName}</p>
        </div>

        <div className="principal-photo">
          <img src={principalImage} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
