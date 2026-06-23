const templateConfig = {
  layout_key: "portfolio",
  template_key: "portfolio-clean-v1",
  template_path: "templates/portfolio/portfolio-clean-v1",
  name: "Clean Professional",
  variant: "clean",
  description: "Clean personal brand portfolio with profile, projects, skills, services, resume and contact.",
  tags: ["clean", "professional", "resume", "projects"],
  preview_image: "/template-previews/portfolio-clean.png",
  defaults: {
    site_name: "Alex Morgan",
    tagline: "Professional Specialist",
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
