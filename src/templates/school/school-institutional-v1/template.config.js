import fallbackLogo from "./assets/sebone.jpeg";
import fallbackHeroImage from "./assets/Sebone.png";

export const templateConfig = {
  templateKey: "school-institutional-v1",
  layoutKey: "school",
  name: "Institutional School",
  description:
    "A full institutional school website template with admissions, resources, governance, gallery, news, notices and contact.",

  defaults: {
    site_name: "Your School Name",
    tagline: "Excellence in Learning",
    motto: "Discipline • Respect • Success",

    logo_url: fallbackLogo,
    favicon_url: "",

    email: "info@yourschool.co.za",
    phone: "+27 00 000 0000",
    address_line1: "Your school address",
    city: "Johannesburg",
    province: "Gauteng",
    postal_code: "0000",
    country: "South Africa",

    primary_color: "#1e40af",
    secondary_color: "#0f172a",
    accent_color: "#f59e0b",
    font_family: "Inter, sans-serif",

    social_links: {
      facebook: "https://facebook.com",
      x: "https://x.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      tiktok: "https://tiktok.com",
      linkedin: "https://linkedin.com",
      whatsapp: "https://wa.me/",
    },

    social_display: {
      facebook: true,
      x: true,
      instagram: true,
      youtube: true,
      tiktok: true,
      linkedin: true,
      whatsapp: true,
      topbar: true,
      footer: true,
    },

    topbar_links: [
      { label: "News", href: "/news" },
      { label: "Resources", href: "/resources" },
      { label: "Calendar", href: "/resources/calendar" },
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
        type: "image",
        title: "Welcome to Our School",
        subtitle: "Building bright futures through excellence in education.",
        src: fallbackHeroImage,
        alt: "School hero",
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
    },
  },

  pages: [
    { slug: "/", title: "Home", enabled: true, nav: { label: "Home", location: "header", position: 0 } },
    { slug: "/about", title: "About", enabled: true, nav: { label: "About", location: "header", position: 1 } },
    { slug: "/about/who-we-are", title: "Who We Are", enabled: true },
    { slug: "/about/vision-mission", title: "Vision & Mission", enabled: true },
    { slug: "/about/history", title: "Our History", enabled: true },

    { slug: "/staff", title: "Staff Members", enabled: true },
    { slug: "/sgb", title: "SGB", enabled: true },
    { slug: "/facilities", title: "Facilities", enabled: true },

    { slug: "/activities", title: "School Life", enabled: true },
    { slug: "/activities/academics", title: "Academics", enabled: true },
    { slug: "/activities/sports", title: "Sports & Recreation", enabled: true },
    { slug: "/activities/culture", title: "Culture & Activities", enabled: true },
    { slug: "/activities/facilities", title: "Campus Facilities", enabled: true },

    { slug: "/resources", title: "Resources", enabled: true, nav: { label: "Resources", location: "header", position: 4 } },
    { slug: "/resources/subject-choices", title: "Subject Choices", enabled: true },
    { slug: "/resources/term-plan", title: "Term Plan", enabled: true },
    { slug: "/resources/exam-schedule", title: "Exam Schedule", enabled: true },
    { slug: "/resources/code-of-conduct", title: "Code Of Conduct", enabled: true },
    { slug: "/resources/stationary-list", title: "Stationary List", enabled: true },
    { slug: "/resources/calendar", title: "Calendar", enabled: true },

    { slug: "/bulletin", title: "Student Daily Bulletin", enabled: true },
    { slug: "/attendance", title: "Attendance Policy", enabled: true },
    { slug: "/calendar/events", title: "All Events", enabled: true },

    { slug: "/admissions", title: "Admissions", enabled: true, nav: { label: "Admissions", location: "header", position: 5 } },
    { slug: "/admissions/apply", title: "Apply", enabled: true },
    { slug: "/admissions/requirements", title: "Requirements", enabled: true },
    { slug: "/admissions/howtoapply", title: "How To Apply", enabled: true },

    { slug: "/digital-library", title: "Digital Library", enabled: true },
    { slug: "/schoolcalendar", title: "School Calendar", enabled: true },
    { slug: "/news", title: "News", enabled: true, nav: { label: "News", location: "header", position: 3 } },
    { slug: "/gallery", title: "Gallery", enabled: true, nav: { label: "Gallery", location: "header", position: 6 } },
    { slug: "/robotics", title: "Robotics Club", enabled: true },
    { slug: "/contact", title: "Contact", enabled: true, nav: { label: "Contact", location: "header", position: 7 } },
    { slug: "/notices", title: "Notices", enabled: true },
  ],
};