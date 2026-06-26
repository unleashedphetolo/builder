const CONTENT = {
  "portfolio-developer-v1": {
    name: "Phetolo Mpe",
    headline: "Full-stack developer building reliable web platforms.",
    subtitle: "I design, build and maintain modern applications with clean interfaces, secure data flows and production-ready architecture.",
    bioTitle: "Engineering practical software from idea to launch.",
    bio: "I combine frontend implementation, backend integration, database design and deployment thinking to create software that is easy to use, easy to scale and ready for real users.",
    proof: [["28+", "Production features"], ["12", "Integrated systems"], ["4", "Core stacks"], ["Fast", "Delivery rhythm"]],
    services: ["Web applications", "Dashboards", "Supabase systems", "Business automation", "API integration", "Technical support"],
    projects: ["School Website Builder", "Role-Based Admin Dashboard", "Supplier Portal", "Portfolio Engine"],
    skills: ["React", "Supabase", "JavaScript", "CSS", "SQL", "UI systems"],
    process: ["Plan requirements", "Build the interface", "Connect the database", "Test and launch"],
    formType: "Project Build Request",
  },
  "portfolio-clean-v1": {
    name: "Professional Portfolio",
    headline: "A clean personal brand for trusted professional work.",
    subtitle: "Present your profile, experience, services and achievements with a polished enterprise-style structure.",
    bioTitle: "Professional presence with clear credibility.",
    bio: "This portfolio is designed for professionals who need a strong personal profile, readable experience sections, downloadable resume and direct enquiries from clients or recruiters.",
    proof: [["8+", "Years experience"], ["40+", "Projects supported"], ["100%", "Profile clarity"], ["Ready", "Client enquiries"]],
    services: ["Professional profile", "Consultation", "Project support", "Resume showcase", "Client communication", "Advisory services"],
    projects: ["Executive Profile", "Client Work Showcase", "Professional Resume", "Service Overview"],
    skills: ["Communication", "Leadership", "Planning", "Reporting", "Operations", "Service delivery"],
    process: ["Understand the goal", "Prepare the solution", "Deliver professionally", "Follow up clearly"],
    formType: "Professional Enquiry",
  },
  "portfolio-creative-v1": {
    name: "Creative Studio",
    headline: "Visual storytelling for brands, campaigns and digital moments.",
    subtitle: "A bold portfolio for creators who need strong imagery, studio services, visual proof and booking-ready pages.",
    bioTitle: "Creative direction that turns ideas into visual identity.",
    bio: "This structure is built for designers, artists, content creators and studios that need an expressive portfolio with galleries, case stories and client-friendly contact flows.",
    proof: [["60+", "Visual pieces"], ["15", "Brand concepts"], ["4K", "Media-ready"], ["Bold", "Creative direction"]],
    services: ["Brand visuals", "Campaign design", "Content direction", "Gallery curation", "Creative consulting", "Digital assets"],
    projects: ["Brand Identity System", "Campaign Visuals", "Studio Gallery", "Digital Launch Pack"],
    skills: ["Visual design", "Branding", "Storyboarding", "Art direction", "Editing", "Creative strategy"],
    process: ["Discover the concept", "Build the mood", "Create the visuals", "Package for launch"],
    formType: "Creative Booking",
  },
  "portfolio-consultant-v1": {
    name: "Advisory Consultant",
    headline: "Strategy, operations and decision support for growing teams.",
    subtitle: "A consultant portfolio with credibility, frameworks, outcomes, services and consultation booking.",
    bioTitle: "Clear thinking for complex business decisions.",
    bio: "Designed for consultants who need to explain what they solve, show proof, outline methods and make it easy for clients to request a consultation.",
    proof: [["30+", "Advisory sessions"], ["12", "Frameworks"], ["3x", "Clarity focus"], ["Strong", "Client guidance"]],
    services: ["Strategy advisory", "Operations review", "Business planning", "Process improvement", "Leadership support", "Workshop facilitation"],
    projects: ["Growth Roadmap", "Operations Review", "Leadership Workshop", "Service Redesign"],
    skills: ["Strategy", "Analysis", "Facilitation", "Planning", "Reporting", "Stakeholder support"],
    process: ["Diagnose", "Prioritise", "Plan", "Execute"],
    formType: "Consultation Request",
  },
  "portfolio-product-v1": {
    name: "Product Designer",
    headline: "Designing user journeys, interfaces and product systems.",
    subtitle: "A product design portfolio with UX case studies, UI systems, process, prototypes and sprint enquiries.",
    bioTitle: "Product thinking from research to refined interface.",
    bio: "Built for product designers and UX professionals who need to present case studies, measurable design decisions and user-centred delivery.",
    proof: [["18", "Case sections"], ["6", "Product flows"], ["UI", "Design systems"], ["UX", "Research-led"]],
    services: ["UX research", "UI design", "Design systems", "Wireframes", "Product audits", "Prototype support"],
    projects: ["Mobile App Redesign", "SaaS Dashboard", "Design System", "Checkout Flow"],
    skills: ["Figma", "Wireframing", "User flows", "Design systems", "Prototyping", "Usability"],
    process: ["Research", "Map flows", "Prototype", "Validate"],
    formType: "Design Sprint Request",
  },
  "portfolio-educator-v1": {
    name: "Educator Portfolio",
    headline: "Teaching, tutoring and learner support with purpose.",
    subtitle: "A professional educator profile with qualifications, teaching philosophy, resources, tutoring and school-friendly contact pages.",
    bioTitle: "Supporting learners with structure, patience and measurable progress.",
    bio: "Created for teachers, tutors and education specialists who need a credible profile, services, resources and a simple enquiry path for parents or institutions.",
    proof: [["Curriculum", "Aligned support"], ["1:1", "Learner focus"], ["Clear", "Progress plans"], ["Trusted", "Communication"]],
    services: ["Tutoring", "Lesson support", "Study planning", "Resource creation", "Learner mentoring", "School programmes"],
    projects: ["Learner Support Pack", "Tutoring Programme", "Classroom Resources", "Exam Preparation"],
    skills: ["Teaching", "Assessment", "Lesson planning", "Mentoring", "Communication", "Curriculum support"],
    process: ["Assess needs", "Create plan", "Teach clearly", "Track progress"],
    formType: "Learner Support Request",
  },
  "portfolio-photographer-v1": {
    name: "Visual Stories Studio",
    headline: "Photography that captures people, products and events beautifully.",
    subtitle: "A gallery-first portfolio with booking packages, shoot types, proof galleries and client contact flow.",
    bioTitle: "Premium imagery with a calm, professional shoot experience.",
    bio: "Built for photographers who need to show visual range, highlight packages, explain the booking process and convert visitors into enquiries.",
    proof: [["120+", "Edited images"], ["30", "Shoots"], ["HD", "Gallery delivery"], ["Fast", "Booking response"]],
    services: ["Portrait shoots", "Event photography", "Product photography", "Brand sessions", "Retouching", "Gallery delivery"],
    projects: ["Event Story", "Brand Shoot", "Portrait Series", "Product Gallery"],
    skills: ["Lighting", "Composition", "Editing", "Retouching", "Direction", "Client experience"],
    process: ["Book session", "Plan shots", "Shoot", "Deliver gallery"],
    formType: "Shoot Booking",
  },
  "portfolio-architect-v1": {
    name: "Studio Blueprint",
    headline: "Architectural concepts, spaces and visual planning.",
    subtitle: "A studio portfolio for architecture, interiors and spatial design with project briefs, plans and consultation flow.",
    bioTitle: "Designing spaces with clarity, function and detail.",
    bio: "This portfolio supports architectural designers who need to show concepts, built work, design process and professional project enquiries.",
    proof: [["Concept", "To plan"], ["3D", "Visual support"], ["Detail", "Focused design"], ["Studio", "Process-led"]],
    services: ["Concept design", "Space planning", "Interior direction", "Project visuals", "Design consultation", "Presentation boards"],
    projects: ["Residential Concept", "Retail Interior", "Office Layout", "Facade Study"],
    skills: ["Planning", "Rendering", "Layouts", "Materials", "Concepts", "Presentation"],
    process: ["Brief", "Concept", "Design", "Present"],
    formType: "Project Brief",
  },
  "portfolio-freelancer-v1": {
    name: "Independent Pro",
    headline: "Freelance services packaged for fast, professional delivery.",
    subtitle: "A flexible portfolio for freelancers with services, pricing-style sections, workflow, proof and project-start forms.",
    bioTitle: "Independent work with organised delivery and clear communication.",
    bio: "Designed for freelancers who offer multiple services and need to show availability, packages, selected work and a direct way for clients to start a project.",
    proof: [["Flexible", "Engagements"], ["3", "Core packages"], ["Fast", "Project start"], ["Clear", "Delivery scope"]],
    services: ["Digital services", "Admin support", "Content support", "Website updates", "Client support", "Project assistance"],
    projects: ["Client Launch Pack", "Monthly Support", "Service Portfolio", "Project Setup"],
    skills: ["Organisation", "Content", "Communication", "Web support", "Client service", "Execution"],
    process: ["Choose package", "Confirm scope", "Start work", "Deliver update"],
    formType: "Start a Project",
  },
  "portfolio-cybersecurity-v1": {
    name: "Cyber Operations Portfolio",
    headline: "Cybersecurity, systems protection and technical risk support.",
    subtitle: "A specialist portfolio for cyber analysts, security engineers and IT risk professionals with labs, capabilities and secure enquiry pages.",
    bioTitle: "Protecting systems through analysis, hardening and clear reporting.",
    bio: "Built for cybersecurity professionals who need to show technical capability, certifications, labs, case studies and secure professional contact channels.",
    proof: [["SOC", "Monitoring mindset"], ["Labs", "Hands-on proof"], ["Risk", "Assessment focus"], ["Secure", "Reporting"]],
    services: ["Security audits", "Risk assessment", "Incident support", "Awareness training", "Hardening guidance", "Monitoring support"],
    projects: ["Security Lab Notes", "Risk Report", "SOC Dashboard", "Awareness Programme"],
    skills: ["Network security", "Linux", "SIEM", "Risk", "Incident response", "Reporting"],
    process: ["Scope", "Assess", "Report", "Harden"],
    formType: "Secure Enquiry",
  },
};

export const getPortfolioField = (settings, keys, fallback) => {
  const safeKeys = Array.isArray(keys) ? keys : [keys];

  for (const key of safeKeys) {
    const parts = String(key).split(".");
    let current = settings;

    for (const part of parts) {
      if (!current || typeof current !== "object") {
        current = undefined;
        break;
      }
      current = current[part];
    }

    if (current !== undefined && current !== null && current !== "") {
      return current;
    }
  }

  return fallback;
};

export const normalizePortfolioContent = (settings = {}, preset = {}) => {
  const organization = settings.organization || {};
  const fallback = CONTENT[preset.template_key] || CONTENT["portfolio-developer-v1"];

  return {
    name: getPortfolioField(
      settings,
      ["website_name", "portfolio_name", "business_name", "organization.name", "name"],
      organization.name || fallback.name,
    ),
    role: getPortfolioField(settings, ["role", "position", "title"], preset.persona || fallback.name),
    headline: getPortfolioField(settings, ["hero.title", "hero_title", "headline"], fallback.headline),
    subtitle: getPortfolioField(settings, ["hero.subtitle", "hero_subtitle", "tagline", "slogan"], fallback.subtitle),
    bioTitle: getPortfolioField(settings, ["about.title", "about_title"], fallback.bioTitle),
    bio: getPortfolioField(settings, ["about.text", "about_text", "bio"], fallback.bio),
    proof: getPortfolioField(settings, ["stats", "proof"], fallback.proof),
    services: getPortfolioField(settings, ["services"], fallback.services),
    projects: getPortfolioField(settings, ["projects"], fallback.projects),
    skills: getPortfolioField(settings, ["skills"], fallback.skills),
    process: getPortfolioField(settings, ["process"], fallback.process),
    formType: fallback.formType,
    contact: {
      email: getPortfolioField(settings, ["official_email", "email", "contact.email", "organization.email"], organization.email || "hello@portfolio.co.za"),
      phone: getPortfolioField(settings, ["official_phone", "phone", "contact.phone", "organization.phone"], organization.phone || "+27 00 000 0000"),
      address: getPortfolioField(settings, ["address", "contact.address", "organization.address"], organization.address || "Johannesburg, South Africa"),
    },
    resumeUrl: getPortfolioField(settings, ["resume_url", "cv_url"], "#"),
    socialLinks: settings.social_links || settings.socialLinks || settings.socials || {},
    socialDisplay: settings.social_display || settings.socialDisplay || {},
    socials: settings.social_links || settings.socialLinks || settings.socials || {},
  };
};
