const templateConfig = {
  layout_key: "portfolio",
  template_key: "portfolio-educator-v1",
  template_path: "templates/portfolio/portfolio-educator-v1",
  name: "Educator Portfolio Pro",
  variant: "educator",
  description: "Professional teacher portfolio with teaching services, learner support, qualifications, resources, experience and contact.",
  tags: ["teacher", "educator", "tutoring", "qualifications", "resume"],
  preview_image: "/template-previews/portfolio-educator.png",
  defaults: {
    site_name: "Professional Educator",
    tagline: "Teacher | Tutor | Learner Support Specialist",
    email: "educator@portfolio.example",
    phone: "+27 11 000 0000",
    location: "South Africa",
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
