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
  "Strategic Planning & Roadmaps",
  "Operating Model Design",
  "Governance & Risk Advisory",
  "Business Transformation Support",
  "Performance Reporting",
  "Change Management Enablement",
];

const professionalServices = [
  {
    id: "service-roadmap",
    title: "Strategic Planning & Roadmaps",
    body:
      "Structured business plans, practical priorities and delivery roadmaps that help leadership move from ideas to action.",
    icon: "strategy",
    bullets: ["Strategy workshops", "Priority roadmap", "Decision framework"],
    image_url:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Request a Roadmap",
  },
  {
    id: "service-operating-model",
    title: "Operating Model Design",
    body:
      "Clear roles, service processes and governance routines that help teams operate with accountability and consistency.",
    icon: "operations",
    bullets: ["Role clarity", "Process design", "Operating rhythm"],
    image_url:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Design Operations",
  },
  {
    id: "service-risk",
    title: "Governance & Risk Advisory",
    body:
      "Business governance support, risk awareness and documentation that strengthen professional control and client confidence.",
    icon: "governance",
    bullets: ["Risk review", "Policy guidance", "Governance reporting"],
    image_url:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Strengthen Governance",
  },
  {
    id: "service-transformation",
    title: "Business Transformation Support",
    body:
      "Practical transformation planning for teams, systems and service delivery improvements that need careful implementation.",
    icon: "automation",
    bullets: ["Transformation plan", "Workflow improvement", "Implementation support"],
    image_url:
      "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Plan Transformation",
  },
  {
    id: "service-reporting",
    title: "Performance Reporting",
    body:
      "Dashboards, review packs and management reporting routines that help leaders monitor progress and make informed decisions.",
    icon: "marketing",
    bullets: ["KPI framework", "Reporting pack", "Management review"],
    image_url:
      "https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Improve Reporting",
  },
  {
    id: "service-change",
    title: "Change Management Enablement",
    body:
      "Communication plans, team readiness and adoption support for businesses implementing new processes or systems.",
    icon: "support",
    bullets: ["Readiness support", "Team communication", "Adoption tracking"],
    image_url:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=80",
    link: "/contact",
    button_label: "Support Change",
  },
];

export const templateConfig = {
  templateKey: "business-consulting-v1",
  layoutKey: "business",
  name: "Consulting Firm",
  description:
    "Professional consulting site with advisory services, proof, insights and structured enquiries.",

  defaults: {
    site_name: "Meridian Consulting Group",
    business_name: "Meridian Consulting Group",
    company_name: "Meridian Consulting Group",
    tagline: "Practical advisory, operations and transformation support",
    motto: "Assess • Plan • Execute",
    email: "advisory@meridianconsulting.co.za",
    phone: "+27 11 684 3300",
    address_line1: "42 Advisory Crescent",
    city: "Rosebank",
    province: "Gauteng",
    postal_code: "2196",
    country: "South Africa",
    primary_color: "#0f766e",
    secondary_color: "#134e4a",
    accent_color: "#f97316",
    background_color: "#f0fdfa",
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
          company_name: "Meridian Consulting Group",
          heading: "A structured advisory partner for leaders who need clarity, governance and execution.",
          description:
            "We help organisations present their services professionally, improve internal operations and build client-ready systems that support sustainable growth.",
          founded: "2016",
          industry: "Management Consulting & Transformation",
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
          company_name: "Meridian Consulting Group",
          heading: "Built for clients who value clear strategy and professional delivery.",
          description:
            "We support small, growing and established organisations with practical business improvements, clearer service presentation and reliable digital operations.",
          founded: "2016",
          industry: "Management Consulting & Transformation",
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
          section_title: "Consulting Services",
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
          company_name: "Meridian Consulting Group",
          email: "advisory@meridianconsulting.co.za",
          phone: "+27 11 684 3300",
          address: "42 Advisory Crescent, Rosebank, Gauteng, South Africa",
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
