const templateConfig = {
  layout_key: "portfolio",
  template_key: "portfolio-creative-v1",
  template_path: "templates/portfolio/portfolio-creative-v1",
  name: "Creative Studio",
  variant: "creative",
  description: "Bold creative portfolio with gallery-focused projects, visual services, testimonials and contact.",
  tags: ["creative", "gallery", "visual", "portfolio"],
  preview_image: "/template-previews/portfolio-creative.png",
  defaults: {
    site_name: "Maya Creative",
    tagline: "Creative Designer",
    email: "hello@portfolio.example",
    phone: "+27 11 000 0000",
    location: "Johannesburg, South Africa",
    resume_url: "#",
    social_links: {
      github: { enabled: true, url: "https://github.com", colorMode: "original" },
      linkedin: { enabled: true, url: "https://www.linkedin.com", colorMode: "original" },
      x: { enabled: true, url: "https://www.x.com", colorMode: "original" },
      website: { enabled: true, url: "https://www.example.com", colorMode: "original" },
      instagram: { enabled: false, url: "https://www.instagram.com", colorMode: "original" },
      youtube: { enabled: false, url: "https://www.youtube.com", colorMode: "original" },
      behance: { enabled: false, url: "https://www.behance.net", colorMode: "original" },
      dribbble: { enabled: false, url: "https://dribbble.com", colorMode: "original" },
      email: { enabled: false, url: "mailto:hello@portfolio.example", colorMode: "original" },
    },
    social_display: { topbar: true, footer: true },
  },
};

export default templateConfig;
