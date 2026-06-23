import React from "react";
import SocialLinks from "../common/SocialLinks";

export default function Topbar({ data }) {
  if (data?.socialDisplay?.topbar === false) return null;

  return (
    <div className="portfolio-topbar">
      <div className="portfolio-container portfolio-topbar__inner">
        <span>{data.tagline}</span>
        <div className="portfolio-topbar__right">
          <span>{data.location}</span>
          <SocialLinks data={data} location="topbar" />
        </div>
      </div>
    </div>
  );
}
