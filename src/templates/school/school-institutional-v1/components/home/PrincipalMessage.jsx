import React from "react";
import "../../styles/principal.css";

export default function PrincipalMessage({ settings = {} }) {
  const principalName = settings?.principal_name || "Principal";

  const principalMessage =
    settings?.principal_message ||
    "Welcome to our school. We are committed to academic excellence, discipline and community values. Our goal is to develop confident learners prepared for the future.";

  const principalImage =
    settings?.principal_image || "/images/principal.jpg";

  return (
    <section className="principal">
      <div className="container principal-inner">
        <div className="principal-text">
          <h2>Principal&apos;s Message</h2>

          <p>{principalMessage}</p>

          <p className="sign">{principalName}</p>
        </div>

        <div className="principal-photo">
          <img src={principalImage} alt={principalName} />
        </div>
      </div>
    </section>
  );
}