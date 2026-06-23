const templateConfig = {
  layout_key: "portfolio",
  template_key: "portfolio-product-v1",
  template_path: "templates/portfolio/portfolio-product-v1",
  name: "Product Designer Pro",
  variant: "product",
  description: "Premium product/UI designer portfolio with case studies, design systems, skills, services and contact.",
  tags: ["product", "designer", "case-studies", "ui-ux"],
  preview_image: "/template-previews/portfolio-product.png",
  defaults: {
    site_name: "Taylor Product",
    tagline: "Product Designer",
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
