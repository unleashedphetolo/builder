import React from "react";
import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaMediumM,
  FaPhoneAlt,
  FaPinterestP,
  FaRedditAlien,
  FaSnapchatGhost,
  FaSpotify,
  FaTelegramPlane,
  FaTiktok,
  FaTwitch,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";
import { getVisibleSocialItems } from "../../utils/social";

const SOCIAL_ICON_MAP = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  x: FaXTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
  threads: FaThreads,
  telegram: FaTelegramPlane,
  snapchat: FaSnapchatGhost,
  pinterest: FaPinterestP,
  discord: FaDiscord,
  github: FaGithub,
  behance: FaBehance,
  dribbble: FaDribbble,
  medium: FaMediumM,
  reddit: FaRedditAlien,
  twitch: FaTwitch,
  spotify: FaSpotify,
  website: FaGlobe,
  email: FaEnvelope,
  phone: FaPhoneAlt,
};

export default function SocialLinks({ settings, location = "topbar" }) {
  const display = settings?.social_display || {};
  if (display[location] === false) return null;

  const items = getVisibleSocialItems(settings);
  if (!items.length) return null;

  return (
    <div className={`business-social business-social--${location}`}>
      {items.map(({ key, href, label }) => {
        const Icon = SOCIAL_ICON_MAP[key] || FaGlobe;
        const safeHref = href || "#";
        const external = String(safeHref || "").startsWith("http");

        return (
          <a
            key={`${location}-${key}`}
            href={safeHref}
            className="business-social__link"
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            aria-label={label}
            title={label}
            onClick={(event) => {
              if (safeHref === "#") event.preventDefault();
            }}
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
