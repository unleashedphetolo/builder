import Home from "./Home";
import About from "./About";
import Services from "./Services";
import Projects from "./Projects";
import Resume from "./Resume";
import Contact from "./Contact";
import NotFound from "./NotFound";

const pages = {
  home: Home,
  about: About,
  services: Services,
  projects: Projects,
  portfolio: Projects,
  work: Projects,
  resume: Resume,
  cv: Resume,
  qualifications: Resume,
  experience: Resume,
  contact: Contact,
};

function normalize(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^#+/, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[\s_]+/g, "-");
}

function pageFromHash() {
  if (typeof window === "undefined") return "";

  const rawHash = String(window.location.hash || "").replace(/^#/, "");
  if (!rawHash) return "";

  const [hashPath] = rawHash.split("?");
  const parts = hashPath.split("/").filter(Boolean);
  const previewIndex = parts.indexOf("template-preview");

  if (previewIndex !== -1) {
    return normalize(parts[previewIndex + 3] || "home");
  }

  return normalize(parts[parts.length - 1] || "");
}

function pageFromPathname() {
  if (typeof window === "undefined") return "";

  const parts = window.location.pathname.split("/").filter(Boolean);
  const last = normalize(parts[parts.length - 1] || "");

  if (!last || last === "site" || last === "template-preview") return "";
  return last;
}

export function getPageKey(page, fallback = "home") {
  const fromPage = normalize(
    page?.slug || page?.page_key || page?.key || page?.title || page || "",
  );

  if (fromPage && pages[fromPage]) return fromPage;

  const fromHash = pageFromHash();
  if (fromHash && pages[fromHash]) return fromHash;

  const fromPath = pageFromPathname();
  if (fromPath && pages[fromPath]) return fromPath;

  return fallback;
}

export function getPageComponent(pageKey) {
  return pages[pageKey] || NotFound;
}
