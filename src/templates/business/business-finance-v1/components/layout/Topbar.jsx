import React from "react";
import SocialLinks from "../common/SocialLinks";

export default function Topbar({ settings }) {
  if (settings?.features?.topbar === false) return null;

  return (
    <div className="business-topbar">
      <div className="business-container business-topbar__inner">
        <div className="business-topbar__contact">
          <span>{settings.email || "info@company.co.za"}</span>
          <span>{settings.phone || "+27 11 000 0000"}</span>
          <span>{settings.address_line1 || settings.city || "Johannesburg, South Africa"}</span>
        </div>
        <SocialLinks settings={settings} location="topbar" />
      </div>
    </div>
  );
}
