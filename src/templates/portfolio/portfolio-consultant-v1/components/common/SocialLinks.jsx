import React from "react";
import { enabledSocialLinks, socialPlatforms } from "../../utils/social";

export default function SocialLinks({ data, location = "topbar" }) {
  const display = data?.socialDisplay || {};
  if (display[location] === false) return null;

  const links = enabledSocialLinks(data?.socialLinks || {});
  if (!links.length) return null;

  return (
    <div className={`portfolio-social portfolio-social--${location}`}>
      {links.map((item) => {
        const platform = socialPlatforms[item.key] || socialPlatforms.website;
        const Icon = platform.icon;
        return (
          <a
            key={`${item.key}-${item.url}`}
            href={item.url}
            aria-label={platform.label}
            title={platform.label}
            target={item.url?.startsWith("http") ? "_blank" : undefined}
            rel={item.url?.startsWith("http") ? "noreferrer" : undefined}
            style={{ "--portfolio-social-color": platform.color }}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
