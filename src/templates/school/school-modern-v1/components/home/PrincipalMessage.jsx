import React from 'react';
import { useTenant } from "../../../../../site/TenantContext";
import "../../styles/principal.css";

export default function Principal() {
  const { settings, media } = useTenant();
  const name = settings?.principal_name || "Principal";
  const message = settings?.principal_message ||
    "Welcome to our school. We are committed to academic excellence, strong values, and a safe environment where every learner can thrive.";

  const photo =
    settings?.principal_photo_url ||
    media?.find((m) => (m.name || "").toLowerCase().includes("principal"))?.url ||
    "/images/principal.jpg";

  return (
    <section className="principal">
      <div className="container principal-inner">
        <div className="principal-text">
          <h2>From Our Principal</h2>
          <p>{message}</p>
          <p className="sign">- {name}</p>
        </div>
        <div className="principal-photo">
          <img src={photo} alt="principal" />
        </div>
      </div>
    </section>
  );
}
