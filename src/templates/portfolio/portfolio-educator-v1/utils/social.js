import {
  FaBehance,
  FaDribbble,
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const socialPlatforms = {
  github: { label: "GitHub", icon: FaGithub, color: "#181717" },
  linkedin: { label: "LinkedIn", icon: FaLinkedinIn, color: "#0A66C2" },
  x: { label: "X", icon: FaXTwitter, color: "#000000" },
  website: { label: "Website", icon: FaGlobe, color: "#2563eb" },
  instagram: { label: "Instagram", icon: FaInstagram, color: "#E4405F" },
  youtube: { label: "YouTube", icon: FaYoutube, color: "#FF0000" },
  behance: { label: "Behance", icon: FaBehance, color: "#1769FF" },
  dribbble: { label: "Dribbble", icon: FaDribbble, color: "#EA4C89" },
  email: { label: "Email", icon: FaEnvelope, color: "#EA4335" },
};

export function enabledSocialLinks(links = {}) {
  return Object.entries(links)
    .map(([key, value]) => ({ key, ...(typeof value === "string" ? { url: value } : value || {}) }))
    .filter((item) => item.enabled !== false && item.url);
}
