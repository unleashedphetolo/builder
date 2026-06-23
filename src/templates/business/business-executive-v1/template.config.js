import { templateAssets, templateSocialDisplay, templateSocialLinks } from "./assets/template.assets";

function editableSection(sectionKey, type, content = {}, options = {}) {
  return {
    section_key: sectionKey,
    type,
    visible: options.visible !== false,
    is_locked: options.is_locked === true,
    style: options.style || {},
    animation: options.animation || {},
    content,
  };
}

const executiveServiceOptions = [
  "Business Strategy & Advisory",
  "Operations & Process Improvement",
  "Digital Systems & Automation",
  "Corporate Website & Lead Capture",
  "Governance & Compliance Support",
  "Client Support & Retainer Services",
];

const professionalServices = [
  {
    id: "service-strategy",
    title: "Business Strategy & Advisory",
    body:
      "Clear growth plans, positioning, service packaging and decision support for companies that want to operate with confidence.",
    icon: "strategy",
    bullets: ["Growth roadmap", "Market positioning", "Leadership decision support"],
    image_url:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Request Strategy Support",
  },
  {
    id: "service-operations",
    title: "Operations & Process Improvement",
    body:
      "Documented workflows, operating procedures and reporting routines that make service delivery more consistent and measurable.",
    icon: "operations",
    bullets: ["Workflow mapping", "Process improvement", "Team accountability"],
    image_url:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Improve Operations",
  },
  {
    id: "service-automation",
    title: "Digital Systems & Automation",
    body:
      "Practical business systems, automation planning and digital tools that reduce manual work and improve turnaround time.",
    icon: "automation",
    bullets: ["System planning", "Automation support", "Digital workflows"],
    image_url:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Plan Digital Systems",
  },
  {
    id: "service-website",
    title: "Corporate Website & Lead Capture",
    body:
      "Professional websites, landing pages and contact journeys that present services clearly and help convert visitors into leads.",
    icon: "marketing",
    bullets: ["Service pages", "Lead capture", "Trust-focused content"],
    image_url:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Discuss Website Needs",
  },
  {
    id: "service-governance",
    title: "Governance & Compliance Support",
    body:
      "Business documentation, risk awareness and professional operating standards that support trust and accountability.",
    icon: "governance",
    bullets: ["Policy templates", "Risk registers", "Reporting structures"],
    image_url:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Strengthen Governance",
  },
  {
    id: "service-support",
    title: "Client Support & Retainer Services",
    body:
      "Ongoing support for content updates, service improvements, client communication and business website maintenance.",
    icon: "support",
    bullets: ["Monthly support", "Content updates", "Client communication"],
    image_url:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Ask About Support",
  },
];

export const templateConfig = {
  templateKey: "business-executive-v1",
  layoutKey: "business",
  name: "Executive Business",
  description:
    "Corporate homepage with services, testimonials, CTA, pricing and contact sections.",

  defaults: {
    site_name: "Executive Advisory Group",
    business_name: "Executive Advisory Group",
    company_name: "Executive Advisory Group",
    tagline: "Practical strategy, systems and growth support",
    motto: "Clarity • Leadership • Results",
    email: "hello@executiveadvisory.co.za",
    phone: "+27 11 482 1900",
    address_line1: "24 Corporate Avenue",
    city: "Sandton",
    province: "Gauteng",
    postal_code: "2196",
    country: "South Africa",
    primary_color: "#123c7c",
    secondary_color: "#0f172a",
    accent_color: "#f59e0b",
    background_color: "#f8fafc",
    font_family: 'Inter, "Segoe UI", Arial, sans-serif',
    theme_name: "business-enterprise",
    footer_text: "",
    social_links: templateSocialLinks,
    social_display: templateSocialDisplay,
    topbar_links: [
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
    footer_links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
    media: templateAssets.media,
    hero_slides: templateAssets.heroSlides,
    hero_slideshow_settings: {
      autoplay: true,
      intervalSeconds: 5,
      pauseOnHover: true,
      showArrows: true,
      showDots: true,
      transition: "fade",
    },
    features: {
      topbar: true,
      services: true,
      testimonials: true,
      portfolio: true,
      team: true,
      pricing: true,
      contact: true,
      cta: true,
      social: true,
      heroSlideshow: true,
      fallbackMedia: true,
    },
  },

  pages: [
    {
      slug: "/",
      title: "Home",
      description:
        "Enterprise homepage with a strong value proposition, real services, proof and contact journey.",
      enabled: true,
      nav: { label: "Home", location: "header", position: 0 },
      sections: [
        editableSection("home-company-profile", "business_company_profile", {
          company_name: "Executive Advisory Group",
          heading: "A trusted business partner for strategy, systems and measurable growth.",
          description:
            "We help organisations present their services professionally, improve internal operations and build client-ready systems that support sustainable growth.",
          founded: "2018",
          industry: "Business Consulting & Digital Operations",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=80",
          summary:
            "A professional business website foundation with services, credibility, proof, contact enquiries and editable content.",
        }),
        editableSection("home-services", "business_services", {
          eyebrow: "What We Do",
          section_title: "Core Business Services",
          subtitle:
            "Fallback services are written to feel real and professional, while still editable from the builder.",
          items: professionalServices.slice(0, 3),
        }),
        editableSection("home-stats", "stats", {
          section_title: "Trusted Delivery Indicators",
          subtitle:
            "Use measurable proof points to help clients understand reliability, experience and business value.",
          items: [
            { id: "stat-1", value: "120+", label: "Projects Delivered" },
            { id: "stat-2", value: "98%", label: "Client Satisfaction" },
            { id: "stat-3", value: "12", label: "Industries Served" },
            { id: "stat-4", value: "24h", label: "Average Response Time" },
          ],
        }),
        editableSection("home-clients", "business_clients", {
          section_title: "Trusted by Clients",
          subtitle:
            "Use this area for testimonials, partner names or client success statements.",
          items: [
            {
              id: "client-1",
              name: "Corporate Services Client",
              logo: "",
              link: "",
              body:
                "The team helped us clarify our service offering and present our business more professionally.",
            },
            {
              id: "client-2",
              name: "Operations Improvement Client",
              logo: "",
              link: "",
              body:
                "Their structured approach improved our workflow, communication and delivery visibility.",
            },
            {
              id: "client-3",
              name: "Digital Growth Client",
              logo: "",
              link: "",
              body:
                "We gained a stronger online presence and a better enquiry process for new clients.",
            },
          ],
        }),
        editableSection("home-portfolio", "gallery", {
          section_title: "Selected Work",
          subtitle:
            "Showcase client projects, service outcomes and business improvements.",
          items: [
            {
              id: "project-1",
              title: "Corporate Service Website",
              image_url:
                "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Corporate website project",
              link: "/portfolio",
            },
            {
              id: "project-2",
              title: "Operations Dashboard Planning",
              image_url:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Operations dashboard project",
              link: "/portfolio",
            },
            {
              id: "project-3",
              title: "Lead Capture Campaign",
              image_url:
                "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Lead capture project",
              link: "/portfolio",
            },
          ],
        }),
        editableSection("home-cta", "cta", {
          section_title: "Ready to Start?",
          heading: "Let’s build a stronger, more trusted business presence.",
          description:
            "Send an enquiry and your email app will open with a professional message already prepared.",
          primary_button_label: "Send Enquiry",
          primary_button_href: "/contact",
          secondary_button_label: "View Services",
          secondary_button_href: "/services",
          background_image:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1800&q=80",
        }),
      ],
    },
    {
      slug: "/about",
      title: "About",
      description:
        "Company background, leadership and professional standards clients can trust.",
      enabled: true,
      nav: { label: "About", location: "header", position: 10 },
      sections: [
        editableSection("about-company", "business_company_profile", {
          company_name: "Executive Advisory Group",
          heading: "Built for clients who value clear strategy and professional delivery.",
          description:
            "We support small, growing and established organisations with practical business improvements, clearer service presentation and reliable digital operations.",
          founded: "2018",
          industry: "Business Consulting & Digital Operations",
          image_url:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80",
          summary:
            "Our work combines business thinking, operational discipline and digital presentation to help clients move with confidence.",
        }),
        editableSection("about-values", "business_services", {
          eyebrow: "How We Work",
          section_title: "Professional Standards",
          subtitle:
            "These values help create confidence for clients and visitors.",
          items: [
            {
              id: "value-1",
              title: "Clear Communication",
              body:
                "Clients receive practical explanations, realistic timelines and direct next steps.",
              icon: "clients",
              link: "/contact",
            },
            {
              id: "value-2",
              title: "Reliable Delivery",
              body:
                "Work is organised around agreed priorities, documented processes and measurable outcomes.",
              icon: "operations",
              link: "/services",
            },
            {
              id: "value-3",
              title: "Long-Term Support",
              body:
                "The relationship continues through updates, improvements and support when the business grows.",
              icon: "support",
              link: "/contact",
            },
          ],
        }),
        editableSection("about-team", "business_team", {
          section_title: "Leadership Team",
          subtitle:
            "Replace these fallback profiles with real team members in the builder.",
          items: [
            {
              id: "team-1",
              name: "Managing Director",
              role: "Strategy Lead",
              bio:
                "Leads client strategy, service positioning and business growth planning.",
              image_url:
                "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",
            },
            {
              id: "team-2",
              name: "Operations Manager",
              role: "Delivery Lead",
              bio:
                "Manages workflows, delivery processes and client implementation support.",
              image_url:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80",
            },
            {
              id: "team-3",
              name: "Client Success Lead",
              role: "Client Relations",
              bio:
                "Supports onboarding, communication and ongoing client satisfaction.",
              image_url:
                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
            },
          ],
        }),
      ],
    },
    {
      slug: "/services",
      title: "Services",
      description:
        "Professional services, packages and solutions designed for serious client outcomes.",
      enabled: true,
      nav: { label: "Services", location: "header", position: 20 },
      sections: [
        editableSection("services-list", "business_services", {
          eyebrow: "Services",
          section_title: "Real Business Services",
          subtitle:
            "Use these fallback services as a professional starting point, then edit them for the business.",
          items: professionalServices,
        }),
        editableSection("services-pricing", "business_services", {
          eyebrow: "Packages",
          section_title: "Service Packages",
          subtitle:
            "Present packages clearly so clients can choose the level of support that fits their needs.",
          items: [
            {
              id: "plan-1",
              title: "Starter Advisory",
              body:
                "Best for businesses that need direction, service clarity and a professional improvement plan.",
              icon: "consulting",
              bullets: ["Discovery session", "Service review", "Action roadmap"],
              image_url:
                "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=80",
              link: "/contact",
              button_label: "Ask About Starter",
            },
            {
              id: "plan-2",
              title: "Professional Growth",
              body:
                "Best for businesses that need stronger operations, digital presentation and lead capture support.",
              icon: "marketing",
              bullets: ["Process mapping", "Website structure", "Lead enquiry journey"],
              image_url:
                "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80",
              link: "/contact",
              button_label: "Ask About Professional",
            },
            {
              id: "plan-3",
              title: "Enterprise Retainer",
              body:
                "Best for companies that need ongoing support, reporting and continuous improvement.",
              icon: "support",
              bullets: ["Monthly support", "Content updates", "Performance reporting"],
              image_url:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80",
              link: "/contact",
              button_label: "Ask About Enterprise",
            },
          ],
        }),
        editableSection("services-cta", "cta", {
          section_title: "Need Help Choosing?",
          heading: "Request a service recommendation.",
          description:
            "Use the contact form to explain your needs. The email will be prepared automatically with the right details.",
          primary_button_label: "Open Contact Form",
          primary_button_href: "/contact",
          secondary_button_label: "View Portfolio",
          secondary_button_href: "/portfolio",
        }),
      ],
    },
    {
      slug: "/portfolio",
      title: "Portfolio",
      description:
        "Selected work, project examples and trusted delivery highlights.",
      enabled: true,
      nav: { label: "Portfolio", location: "header", position: 30 },
      sections: [
        editableSection("portfolio-gallery", "gallery", {
          section_title: "Client Work & Case Studies",
          subtitle:
            "Use this page to show proof of work, completed projects, campaign examples or service outcomes.",
          items: [
            {
              id: "portfolio-1",
              title: "Corporate Website Launch",
              image_url:
                "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Corporate website launch",
              link: "/contact",
            },
            {
              id: "portfolio-2",
              title: "Operations Improvement Plan",
              image_url:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Business operations planning",
              link: "/contact",
            },
            {
              id: "portfolio-3",
              title: "Client Enquiry System",
              image_url:
                "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Client enquiry system",
              link: "/contact",
            },
            {
              id: "portfolio-4",
              title: "Service Brand Refresh",
              image_url:
                "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Brand and service refresh",
              link: "/contact",
            },
            {
              id: "portfolio-5",
              title: "Leadership Reporting Pack",
              image_url:
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Reporting and leadership pack",
              link: "/contact",
            },
            {
              id: "portfolio-6",
              title: "Retainer Support Programme",
              image_url:
                "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80",
              image_alt: "Retainer support programme",
              link: "/contact",
            },
          ],
        }),
        editableSection("portfolio-clients", "business_clients", {
          section_title: "Client Confidence",
          subtitle:
            "Add real testimonials later. These fallback statements show how this page should feel.",
          items: [
            {
              id: "testimonial-1",
              name: "Service Business Client",
              body:
                "The structure helped us explain our services clearly and receive better enquiry details.",
            },
            {
              id: "testimonial-2",
              name: "Operations Client",
              body:
                "The process review helped our team work with more confidence and accountability.",
            },
            {
              id: "testimonial-3",
              name: "Growth Client",
              body:
                "The business website now looks more trusted and easier for clients to understand.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/insights",
      title: "Insights",
      description:
        "News, articles and business insights that build authority and trust.",
      enabled: true,
      nav: { label: "Insights", location: "header", position: 40 },
      sections: [
        editableSection("business-news", "latest_news", {
          section_title: "Latest Insights",
          subtitle:
            "Publish articles, business updates, announcements or practical advice.",
          items: [
            {
              id: "news-1",
              title: "How to make a business website feel trusted",
              date: "Mon, Jan 12, 2026",
              body:
                "Clear services, real contact details, proof points and a simple enquiry journey help visitors feel confident.",
            },
            {
              id: "news-2",
              title: "Why service pages should explain outcomes",
              date: "Fri, Feb 06, 2026",
              body:
                "Clients want to understand what they get, how the process works and what result they can expect.",
            },
            {
              id: "news-3",
              title: "Using systems to improve delivery",
              date: "Tue, Mar 10, 2026",
              body:
                "Documented workflows, reporting and repeatable processes help growing teams deliver more consistently.",
            },
          ],
        }),
        editableSection("insights-cta", "cta", {
          section_title: "Need Professional Guidance?",
          heading: "Turn website visitors into serious enquiries.",
          description:
            "Use the contact form to send a structured enquiry directly through email.",
          primary_button_label: "Send Enquiry",
          primary_button_href: "/contact",
          secondary_button_label: "View Services",
          secondary_button_href: "/services",
        }),
      ],
    },
    {
      slug: "/contact",
      title: "Contact",
      description:
        "Contact details, enquiry form and dynamic location map.",
      enabled: true,
      nav: { label: "Contact", location: "header", position: 50 },
      sections: [
        editableSection("contact-main", "business_contact", {
          eyebrow: "Contact",
          section_title: "Contact Us",
          heading: "Start the conversation with our team.",
          description:
            "Send a structured enquiry. The form opens your email app and automatically completes the subject and message details.",
          company_name: "Executive Advisory Group",
          email: "hello@executiveadvisory.co.za",
          phone: "+27 11 482 1900",
          address: "24 Corporate Avenue, Sandton, Gauteng, South Africa",
          office_hours: "Monday to Friday, 08:00 - 17:00",
          form_title: "Send a Business Enquiry",
          form_description:
            "Choose a service, add your details and submit. Your email app will open with the message already prepared.",
          email_subject_prefix: "New business enquiry",
          service_options: executiveServiceOptions,
          map_title: "Location Map",
          map_available_text: "Find us using the official business address",
          map_empty_text: "Save a business address to show the map",
          map_badge_label: "Map",
        }),
      ],
    },
  ],
};

export default templateConfig;
