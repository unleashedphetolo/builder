import fallbackLogo from "./assets/institutional.png";
import fallbackHeroImage from "./assets/gallery3.png";
import hero2 from "./assets/gallery4.jpg";
import hero3 from "./assets/acade14.jpg";
import heroVideo from "./assets/acade1.mp4";

export const templateConfig = {
  templateKey: "school-institutional-v1",
  layoutKey: "school",
  name: "Institutional School",
  description:
    "A full institutional school website template with admissions, resources, governance, gallery, news, notices and contact.",

  defaults: {
    site_name: "School Name",
    tagline: "Excellence in Learning",
    motto: "Discipline • Respect • Success",

    logo_url: fallbackLogo,
    favicon_url: "",

    email: "info@yourschool.co.za",
    phone: "+27 00 000 0000",
    address_line1: "123 Education St",
    city: "Johannesburg",
    province: "Gauteng",
    postal_code: "0000",
    country: "South Africa",

    primary_color: "#1e40af",
    secondary_color: "#0f172a",
    accent_color: "#f59e0b",
    font_family: "Inter, sans-serif",

    social_links: {
      facebook: {
        enabled: true,
        url: "",
        colorMode: "original",
        originalColor: "#1877f2",
        monoColor: "#ffffff",
      },
      instagram: {
        enabled: true,
        url: "",
        colorMode: "original",
        originalColor: "#e4405f",
        monoColor: "#ffffff",
      },
      tiktok: {
        enabled: true,
        url: "",
        colorMode: "original",
        originalColor: "#ffffff",
        monoColor: "#ffffff",
      },
      linkedin: {
        enabled: true,
        url: "",
        colorMode: "original",
        originalColor: "#0a66c2",
        monoColor: "#ffffff",
      },
      x: {
        enabled: true,
        url: "",
        colorMode: "original",
        originalColor: "#ffffff",
        monoColor: "#ffffff",
      },
      youtube: {
        enabled: true,
        url: "",
        colorMode: "original",
        originalColor: "#ff0000",
        monoColor: "#ffffff",
      },
      whatsapp: {
        enabled: true,
        url: "",
        colorMode: "original",
        originalColor: "#25d366",
        monoColor: "#ffffff",
      },
    },

    social_display: {
      topbar: true,
      footer: true,
      order: [
        "facebook",
        "instagram",
        "tiktok",
        "linkedin",
        "x",
        "youtube",
        "whatsapp",
      ],
    },

    topbar_links: [
      { label: "News", href: "/news" },
      { label: "Resources", href: "/resources" },
      { label: "Notice Board", href: "/notices" },
    ],

    footer_links: [
      { label: "Admissions", href: "/admissions" },
      { label: "Digital Library", href: "/digital-library" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],

    footer_text: "© Your School. All rights reserved.",

    hero_slides: [
      {
        id: 1,
        type: "image",
        title: "Academic Excellence",
        subtitle: "High standards, caring teachers.",
        src: fallbackHeroImage,
        alt: "School hero",
      },
      {
        id: 2,
        type: "image",
        title: "Achievement & Pride",
        subtitle: "Celebrating achievement across all grades.",
        src: hero3,
        alt: "School awards and achievements",
      },
      {
        id: 3,
        type: "image",
        title: "Community & Spirit",
        subtitle: "A safe, supportive learning environment.",
        src: hero2,
        alt: "Students on campus",
      },
      {
        id: 4,
        type: "video",
        title: "School Introduction",
        subtitle: "Discover learning, leadership and school life.",
        src: heroVideo,
        poster: fallbackHeroImage,
        alt: "School introduction video",
      },
    ],

    features: {
      about: true,
      staff: true,
      governance: true,
      facilities: true,
      activities: true,
      resources: true,
      bulletin: true,
      attendancePolicy: true,
      events: true,
      admissions: true,
      digitalLibrary: true,
      news: true,
      gallery: true,
      robotics: true,
      contact: true,
      notices: true,
      wallOfFame: true,
      sponsors: true,
      quickLinks: true,
      latestNews: true,
      schoolStats: true,
    },
  },

  pages: [
    {
      slug: "/",
      title: "Home",
      enabled: true,
      nav: { label: "Home", location: "header", position: 0 },
    },

    {
      slug: "/home/hero",
      title: "Hero",
      enabled: true,
      nav: { label: "Hero", location: "home", position: 100 },
    },
    {
      slug: "/home/about-section",
      title: "About Section",
      enabled: true,
      nav: { label: "About Section", location: "home", position: 101 },
    },
    {
      slug: "/home/gallery-preview",
      title: "Gallery Preview",
      enabled: true,
      nav: { label: "Gallery Preview", location: "home", position: 102 },
    },
    {
      slug: "/home/principal-message",
      title: "Principal Message",
      enabled: true,
      nav: { label: "Principal Message", location: "home", position: 103 },
    },
    {
      slug: "/home/quick-links",
      title: "Quick Links",
      enabled: true,
      nav: { label: "Quick Links", location: "home", position: 104 },
    },
    {
      slug: "/home/latest-news",
      title: "Latest News",
      enabled: true,
      nav: { label: "Latest News", location: "home", position: 105 },
    },
    {
      slug: "/home/events",
      title: "Events List",
      enabled: true,
      nav: { label: "Events List", location: "home", position: 106 },
    },
    {
      slug: "/home/school-stats",
      title: "School Stats",
      enabled: true,
      nav: { label: "School Stats", location: "home", position: 107 },
    },

    {
      slug: "/about",
      title: "About",
      enabled: true,
      nav: { label: "About", location: "header", position: 1 },
    },
    {
      slug: "/about/who-we-are",
      title: "Who We Are",
      enabled: true,
      nav: { label: "Who We Are", location: "header", position: 2 },
    },
    {
      slug: "/about/vision-mission",
      title: "Vision & Mission",
      enabled: true,
      nav: { label: "Vision & Mission", location: "header", position: 3 },
    },
    {
      slug: "/about/history",
      title: "Our History",
      enabled: true,
      nav: { label: "Our History", location: "header", position: 4 },
    },

    {
      slug: "/staff",
      title: "Staff Members",
      enabled: true,
      nav: { label: "Staff Members", location: "header", position: 5 },
    },
    {
      slug: "/sgb",
      title: "SGB",
      enabled: true,
      nav: { label: "SGB", location: "header", position: 6 },
    },
    {
      slug: "/facilities",
      title: "Facilities",
      enabled: true,
      nav: { label: "Facilities", location: "header", position: 7 },
    },

    {
      slug: "/activities",
      title: "Activities",
      enabled: true,
      nav: { label: "Activities", location: "header", position: 8 },
    },
    {
      slug: "/activities/academics",
      title: "Academics",
      enabled: true,
      nav: { label: "Academics", location: "header", position: 9 },
    },
    {
      slug: "/activities/sports",
      title: "Sports & Recreation",
      enabled: true,
      nav: { label: "Sports & Recreation", location: "header", position: 10 },
    },
    {
      slug: "/activities/culture",
      title: "Culture & Activities",
      enabled: true,
      nav: { label: "Culture & Activities", location: "header", position: 11 },
    },
    {
      slug: "/activities/facilities",
      title: "Campus Facilities",
      enabled: true,
      nav: { label: "Campus Facilities", location: "header", position: 12 },
    },

    {
      slug: "/resources",
      title: "Resources",
      enabled: true,
      nav: { label: "Resources", location: "header", position: 13 },
    },
    {
      slug: "/resources/subject-choices",
      title: "Subject Choices",
      enabled: true,
      nav: { label: "Subject Choices", location: "header", position: 14 },
    },
    {
      slug: "/resources/term-plan",
      title: "Term Plan",
      enabled: true,
      nav: { label: "Term Plan", location: "header", position: 15 },
    },
    {
      slug: "/resources/exam-schedule",
      title: "Exam Schedule",
      enabled: true,
      nav: { label: "Exam Schedule", location: "header", position: 16 },
    },
    {
      slug: "/resources/code-of-conduct",
      title: "Code Of Conduct",
      enabled: true,
      nav: { label: "Code of Conduct", location: "header", position: 17 },
    },
    {
      slug: "/resources/stationary-list",
      title: "Stationary List",
      enabled: true,
      nav: { label: "Stationary List", location: "header", position: 18 },
    },
    {
      slug: "/resources/calendar",
      title: "Calendar",
      enabled: true,
      nav: { label: "Calendar", location: "header", position: 19 },
    },

    {
      slug: "/bulletin",
      title: "Daily Bulletin",
      enabled: true,
      nav: { label: "Daily Bulletin", location: "header", position: 20 },
    },
    {
      slug: "/attendance",
      title: "Attendance Policy",
      enabled: true,
      nav: { label: "Attendance Policy", location: "header", position: 21 },
    },
    {
      slug: "/calendar/events",
      title: "All Events",
      enabled: true,
      nav: { label: "All Events", location: "header", position: 22 },
    },

    {
      slug: "/admissions",
      title: "Admissions",
      enabled: true,
      nav: { label: "Admissions", location: "header", position: 23 },
    },
    {
      slug: "/admissions/apply",
      title: "Apply",
      enabled: true,
      nav: { label: "Apply Now", location: "header", position: 24 },
    },
    {
      slug: "/admissions/requirements",
      title: "Requirements",
      enabled: true,
      nav: { label: "Entry Requirements", location: "header", position: 25 },
    },
    {
      slug: "/admissions/howtoapply",
      title: "How To Apply",
      enabled: true,
      nav: { label: "How to Apply", location: "header", position: 26 },
    },

    {
      slug: "/digital-library",
      title: "Digital Library",
      enabled: true,
      nav: { label: "Digital Library", location: "header", position: 27 },
    },
    {
      slug: "/schoolcalendar",
      title: "School Calendar",
      enabled: true,
      nav: { label: "School Calendar", location: "header", position: 28 },
    },
    {
      slug: "/news",
      title: "News",
      enabled: true,
      nav: { label: "News", location: "header", position: 29 },
    },
    {
      slug: "/gallery",
      title: "Gallery",
      enabled: true,
      nav: { label: "Gallery", location: "header", position: 30 },
    },
    {
      slug: "/robotics",
      title: "Robotics Club",
      enabled: true,
      nav: { label: "Robotics Club", location: "header", position: 31 },
    },
    {
      slug: "/wall-of-fame",
      title: "Wall Of Fame",
      enabled: true,
      nav: { label: "Wall Of Fame", location: "home", position: 108 },
    },
    {
      slug: "/contact",
      title: "Contact",
      enabled: true,
      nav: { label: "Contact", location: "header", position: 33 },
    },
    {
      slug: "/notices",
      title: "Notices",
      enabled: true,
      nav: { label: "Notice Board", location: "home", position: 109 },
    },
    {
      slug: "/sponsors",
      title: "Sponsors",
      enabled: true,
      nav: { label: "Sponsors", location: "home", position: 110 },
    },
  ],
};