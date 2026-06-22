import fallbackLogo from "./assets/Modern.png";
import fallbackHeroImage from "./assets/gallery3.png";
import hero2 from "./assets/gallery4.jpg";
import hero3 from "./assets/acade14.jpg";
import heroVideo from "./assets/acade1.mp4";


/*
  Every normal website content area below is seeded into site_sections.
  Hero media, logo and social icons continue using their specialised editors,
  while their surrounding page records remain available to the builder.
*/
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

export const templateConfig = {
  templateKey: "school-primary-school-v1",
  layoutKey: "school",
  name: "Primary School",
  description:
    "Friendly primary school design with soft green, rounded cards and welcoming responsive pages.",

  defaults: {
    site_name: "School Name",
    tagline: "Excellence in every learner",
    motto: "Learn • Lead • Achieve",

    logo_url: fallbackLogo,
    favicon_url: "",

    email: "info@yourschool.co.za",
    phone: "+27 00 000 0000",
    address_line1: "123 Education St",
    city: "Johannesburg",
    province: "Gauteng",
    postal_code: "0000",
    country: "South Africa",

    primary_color: "#15803d",
    secondary_color: "#065f46",
    background_color: "#f0fdf4",
    accent_color: "#fbbf24",
    font_family: 'Inter, "Segoe UI", Arial, sans-serif',
    theme_name: "school-primary-friendly",
    typography_settings: {
      heading_font_family: 'Inter, "Segoe UI", Arial, sans-serif',
      body_font_family: 'Inter, "Segoe UI", Arial, sans-serif',
      heading_font_weight: 760,
      body_font_weight: 450,
      base_font_size: 16,
      heading_scale: 1.34,
      line_height: 1.6,
      letter_spacing: 0,
      button_text_transform: "none",
    },
    announcements: [],

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
        title: "A School Website That Feels Professional",
        subtitle: "Modern admissions, notices, resources and school communication in a clean responsive experience.",
        src: fallbackHeroImage,
        alt: "Learners at school",
        primaryButtonText: "Apply Now",
        primaryButtonHref: "/admissions/apply",
        secondaryButtonText: "School Life",
        secondaryButtonHref: "/activities",
      },
      {
        id: 2,
        type: "image",
        title: "Academic Excellence and School Life",
        subtitle: "Showcase learner achievement, culture, sports, resources and school life with a premium layout.",
        src: hero3,
        alt: "School awards and achievements",
        primaryButtonText: "View Admissions",
        primaryButtonHref: "/admissions",
        secondaryButtonText: "View Gallery",
        secondaryButtonHref: "/gallery",
      },
      {
        id: 3,
        type: "image",
        title: "Connected Parents, Learners and Staff",
        subtitle: "Make notices, calendars, galleries and resources easy to find from any device.",
        src: hero2,
        alt: "School community",
        primaryButtonText: "Notice Board",
        primaryButtonHref: "/notices",
        secondaryButtonText: "Resources",
        secondaryButtonHref: "/resources",
      },
      {
        id: 4,
        type: "video",
        title: "A Complete Digital Front Office",
        subtitle: "Built for schools that need a professional, editable and mobile-ready website.",
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
      visualSections: true,
    },
  },

  pages: [
    {
      slug: "/",
      title: "Home",
      enabled: true,
      nav: { label: "Home", location: "header", position: 0 },
      sections: [
        editableSection("home-notice-board", "notice_board", {
          section_title: "Notice Board",
          button_label: "View All",
          button_href: "/notices",
          items: [
            {
              id: "notice-1",
              title: "Issuing Term 4 Report Cards",
              publishedAt: "2025-12-07T08:00:00",
              startAt: "2025-12-07T08:00:00",
              endAt: "2025-12-07T14:00:00",
              location: "Administration Office",
              status: "Active",
            },
            {
              id: "notice-2",
              title: "Awards Ceremony",
              publishedAt: "2025-11-25T07:30:00",
              startAt: "2025-11-25T10:00:00",
              endAt: "2025-11-25T12:30:00",
              location: "School Hall",
              status: "Active",
            },
            {
              id: "notice-3",
              title: "School Awards Day",
              publishedAt: "2025-11-25T07:35:00",
              startAt: "2025-11-25T13:30:00",
              endAt: "2025-11-25T15:30:00",
              location: "School Hall",
              status: "Active",
            },
            {
              id: "notice-4",
              title: "Examinations Period",
              publishedAt: "2025-11-10T06:45:00",
              startAt: "2025-11-10T08:00:00",
              endAt: "2025-11-28T13:30:00",
              location: "Examination Venues",
              status: "Active",
            },
          ],
        }),
        editableSection("home-about-section", "about_section", {
          section_title: "Vision, Mission & Values",
          cards: [
            {
              id: "vision",
              eyebrow: "Vision",
              title: "Our Vision",
              body:
                "To be a dynamic centre of excellence where all stakeholders work collaboratively to achieve educational goals, developing learners holistically into responsible, disciplined citizens who make a meaningful contribution to society.",
            },
            {
              id: "mission",
              eyebrow: "Mission",
              title: "Our Mission",
              body:
                "To achieve our vision through efficient management, democratic governance, quality leadership, committed stakeholder participation, and a nurturing environment that promotes personal growth and academic excellence.",
            },
            {
              id: "values",
              eyebrow: "Values",
              title: "Our Motto & Core Values",
              values: [
                "Accountability",
                "Punctuality",
                "Respect",
                "Reliability",
                "Co-operation",
                "Hard Work",
                "Commitment",
              ],
            },
          ],
        }),
        editableSection("home-gallery-preview", "gallery", {
          section_title: "Gallery Preview",
          items: [
            {
              id: "gallery-academics",
              title: "ACADEMICS",
              image_url: "/images/gallery1.jpg",
              link: "/activities/academics",
            },
            {
              id: "gallery-sports",
              title: "SPORTS",
              image_url: "/images/gallery2.avif",
              link: "/activities/sports",
            },
            {
              id: "gallery-culture",
              title: "CULTURE",
              image_url: "/images/gallery4.jpg",
              link: "/activities/culture",
            },
            {
              id: "gallery-staff",
              title: "STAFF",
              image_url: "/images/teachers.jpeg",
              link: "/staff",
            },
          ],
        }),
        editableSection("home-principal-message", "principal_message", {
          section_title: "Principal's Message",
          message:
            "Welcome to our school. We are committed to academic excellence, discipline and community values. Our goal is to develop confident learners prepared for the future.",
          principal_name: "Principal",
          principal_role: "Principal",
          image_url: "/images/principal.jpg",
          image_alt: "Principal",
        }),
        editableSection("home-admissions", "admissions", {
          section_title: "Admission",
          subtitle:
            "Join a school that shapes character, curiosity and leadership.",
          heading: "Are you ready for the adventure of your life?",
          description:
            "View the admissions process and requirements. We admit learners from Grade 8 through Grade 12. Follow the clear steps below to apply — we review each application with care.",
          eligibility:
            "Learners must be between ages 12 – 20 for secondary placements. Special assessments may apply.",
          primary_button_label: "Start Application",
          primary_button_href: "/admissions/apply",
          secondary_button_label: "Download Form",
          secondary_button_href: "",
          stats: [
            { id: "established", label: "Established", value: 1990 },
            { id: "learners", label: "No. Of Learners", value: 1525 },
            { id: "staff", label: "No. Of Staff", value: 18 },
            { id: "grades", label: "Grades", value: "8 to 12" },
          ],
        }),
        editableSection("home-school-calendar", "calendar", {
          section_title: "School Calendar",
          subtitle:
            "Key academic dates, examinations, school activities, and public holidays.",
          view_all_label: "View All Events",
          view_all_href: "/calendar/events",
          download_label: "Download PDF",
          pdf_url: "/docs/school-calendar.pdf",
          calendar_label: "Calendar",
          calendar_heading: "Monthly Overview",
          calendar_note: "Tap days to view events (optional upgrade).",
          upcoming_label: "# Upcoming",
          upcoming_heading: "Upcoming Events",
          upcoming_note:
            "This is a preview. Use “View All Events” for the full calendar list.",
          view_all_link_label: "View All →",
          footer_note:
            "For official confirmation of dates, please contact the Administration Office.",
          items: [
            {
              id: "home-calendar-new-year",
              title: "New Year's Day",
              startAt: "2026-01-01T00:00",
              endAt: "2026-01-01T23:59",
              location: "Public Holiday",
              category: "Public Holiday",
            },
            {
              id: "home-calendar-reopens",
              title: "School Reopens (Term 1)",
              startAt: "2026-01-14T07:30",
              endAt: "2026-01-14T14:30",
              location: "School Campus",
              category: "Academic",
            },
            {
              id: "home-calendar-exams",
              title: "Final Examinations Begin",
              startAt: "2026-11-10T08:00",
              endAt: "2026-11-10T15:00",
              location: "Exam Venues",
              category: "Exams",
            },
            {
              id: "home-calendar-awards",
              title: "Awards Ceremony",
              startAt: "2026-11-25T10:00",
              endAt: "2026-11-25T12:00",
              location: "School Hall",
              category: "School Event",
            },
          ],
        }),
        editableSection("home-wall-of-fame", "wall_of_fame", {
          section_title: "Academic Wall of Fame",
          subtitle:
            "Celebrating Outstanding Academic Performance & Excellence",
          items: [
            {
              id: "award-top-performers",
              title: "Top Academic Performers",
              year: 2025,
              description:
                "Learners who achieved distinctions across all subjects",
              image_url: "/images/academics/acade13.jpg",
              gallery: [
                "/images/academics/acade10.jpg",
                "/images/academics/acade12.jpg",
              ],
            },
            {
              id: "award-mathematics",
              title: "Mathematics Excellence Award",
              year: 2025,
              description:
                "Outstanding results in Mathematics & Physical Sciences",
              image_url: "/images/academics/acade14.jpg",
              gallery: [
                "/images/academics/acade5.jpg",
                "/images/academics/acade8.jpg",
              ],
            },
            {
              id: "award-improved-performance",
              title: "Most Improved Academic Performance",
              year: 2025,
              description:
                "Recognising exceptional academic growth and commitment",
              image_url: "/images/academics/acade4.jpg",
              gallery: [
                "/images/academics/acade3.webp",
                "/images/academics/acade1.jpg",
              ],
            },
          ],
        }),
        editableSection("home-partners", "partners", {
          section_title: "Our Partners & Supporters",
          subtitle:
            "{site_name} appreciates the continued support of our partners, community stakeholders, and organisations that contribute to learner development and school growth.",
          items: [
            {
              id: "partner-dbe",
              name: "Department of Basic Education",
              logo: "/images/dbe.png",
              link: "https://www.education.gov.za/",
            },
            {
              id: "partner-municipality",
              name: "Local Municipality",
              logo: "/images/municipality.png",
              link: "https://www.joburg.org.za/",
            },
            {
              id: "partner-community",
              name: "Community Development Trust",
              logo: "/images/community.png",
              link: "https://www.gov.za/",
            },
            {
              id: "partner-alumni",
              name: "Modern Alumni Association",
              logo: "/images/alumni.png",
              link: "#",
            },
          ],
        }),
      ],
    },

    {
      slug: "/home/hero",
      title: "Hero",
      enabled: true,
      nav: { label: "Hero", location: "home", position: 100 },
      sections: [
        editableSection("home-hero-specialised-media", "hero", {
          section_title: "Hero",
          editor_mode: "media",
          note:
            "Hero slideshow images and video are managed through the dedicated Hero media editor.",
        }),
      ],
    },
    {
      slug: "/home/about-section",
      title: "About Section",
      enabled: true,
      nav: { label: "About Section", location: "home", position: 101 },
      sections: [
        editableSection("home-about-feature", "about_section", {
          section_title: "Vision, Mission & Values",
          cards: [
            {
              id: "vision",
              eyebrow: "Vision",
              title: "Our Vision",
              body:
                "To be a dynamic centre of excellence where all stakeholders work collaboratively to achieve educational goals, developing learners holistically into responsible, disciplined citizens who make a meaningful contribution to society.",
            },
            {
              id: "mission",
              eyebrow: "Mission",
              title: "Our Mission",
              body:
                "To achieve our vision through efficient management, democratic governance, quality leadership, committed stakeholder participation, and a nurturing environment that promotes personal growth and academic excellence.",
            },
            {
              id: "values",
              eyebrow: "Values",
              title: "Our Motto & Core Values",
              values: [
                "Accountability",
                "Punctuality",
                "Respect",
                "Reliability",
                "Co-operation",
                "Hard Work",
                "Commitment",
              ],
            },
          ],
        }),
      ],
    },
    {
      slug: "/home/gallery-preview",
      title: "Gallery Preview",
      enabled: true,
      nav: { label: "Gallery Preview", location: "home", position: 102 },
      sections: [
        editableSection("home-gallery-feature", "gallery", {
          section_title: "Gallery Preview",
          items: [
            {
              id: "preview-academics",
              title: "ACADEMICS",
              image_url: "/images/gallery1.jpg",
              link: "/activities/academics",
            },
            {
              id: "preview-sports",
              title: "SPORTS",
              image_url: "/images/gallery2.avif",
              link: "/activities/sports",
            },
            {
              id: "preview-culture",
              title: "CULTURE",
              image_url: "/images/gallery4.jpg",
              link: "/activities/culture",
            },
            {
              id: "preview-staff",
              title: "STAFF",
              image_url: "/images/teachers.jpeg",
              link: "/staff",
            },
          ],
        }),
      ],
    },
    {
      slug: "/home/principal-message",
      title: "Principal Message",
      enabled: true,
      nav: { label: "Principal Message", location: "home", position: 103 },
      sections: [
        editableSection("home-principal-feature", "principal_message", {
          section_title: "Principal's Message",
          message:
            "Welcome to our school. We are committed to academic excellence, discipline and community values. Our goal is to develop confident learners prepared for the future.",
          principal_name: "Principal",
          principal_role: "Principal",
          image_url: "/images/principal.jpg",
          image_alt: "Principal",
        }),
      ],
    },
    {
      slug: "/home/quick-links",
      title: "Quick Links",
      enabled: true,
      nav: { label: "Quick Links", location: "home", position: 104 },
      sections: [
        editableSection("home-quick-links", "quick_links", {
          section_title: "Quick Links",
          items: [
            { id: "apply", title: "Apply Now", href: "/admissions/apply" },
            { id: "calendar", title: "School Calendar", href: "/schoolcalendar" },
            { id: "resources", title: "Resources", href: "/resources" },
            { id: "contact", title: "Contact Us", href: "/contact" },
          ],
        }),
      ],
    },
    {
      slug: "/home/latest-news",
      title: "Latest News",
      enabled: true,
      nav: { label: "Latest News", location: "home", position: 105 },
      sections: [
        editableSection("home-latest-news", "latest_news", {
          section_title: "Latest News",
          subtitle: "Latest stories and achievements from our school community.",
          items: [
            {
              id: "news-sponsors-partners",
              title:
                "We are grateful to our Sponsors and Partners on this journey",
              image_url: "/images/sponsor.webp",
              image_alt:
                "We are grateful to our Sponsors and Partners on this journey",
              date: "Dec 2025",
              category: "School News",
              summary:
                "Read more about our partnerships, collaborations, and school activities.",
            },
            {
              id: "news-motus-partnership",
              title: "Motus — Partnership announcement",
              image_url: "/images/motus.jpg",
              image_alt: "Motus — Partnership announcement",
              date: "Nov 2025",
              category: "School News",
              summary:
                "Read more about our partnerships, collaborations, and school activities.",
            },
            {
              id: "news-dfa-collaboration",
              title: "Open Access Network DFA collaboration",
              image_url: "/images/DFA.webp",
              image_alt: "Open Access Network DFA collaboration",
              date: "Oct 2025",
              category: "School News",
              summary:
                "Read more about our partnerships, collaborations, and school activities.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/home/events",
      title: "Events List",
      enabled: true,
      nav: { label: "Events List", location: "home", position: 106 },
      sections: [
        editableSection("home-events-list", "calendar", {
          section_title: "Upcoming Events",
          view_all_label: "View All Events",
          view_all_href: "/calendar/events",
          items: [
            {
              id: "home-event-new-year",
              title: "New Year's Day",
              startAt: "2026-01-01T00:00",
              endAt: "2026-01-01T23:59",
              location: "Public Holiday",
              category: "Public Holiday",
            },
            {
              id: "home-event-reopens",
              title: "School Reopens (Term 1)",
              startAt: "2026-01-14T07:30",
              endAt: "2026-01-14T14:30",
              location: "School Campus",
              category: "Academic",
            },
            {
              id: "home-event-exams",
              title: "Final Examinations Begin",
              startAt: "2026-11-10T08:00",
              endAt: "2026-11-10T15:00",
              location: "Exam Venues",
              category: "Exams",
            },
            {
              id: "home-event-awards",
              title: "Awards Ceremony",
              startAt: "2026-11-25T10:00",
              endAt: "2026-11-25T12:00",
              location: "School Hall",
              category: "School Event",
            },
          ],
        }),
      ],
    },
    {
      slug: "/home/school-stats",
      title: "School Stats",
      enabled: true,
      nav: { label: "School Stats", location: "home", position: 107 },
      sections: [
        editableSection("home-school-stats", "statistics", {
          section_title: "School Statistics",
          items: [
            { id: "stat-1", label: "Established", value: 1990 },
            { id: "stat-2", label: "No. Of Learners", value: 1525 },
            { id: "stat-3", label: "No. Of Staff", value: 18 },
            { id: "stat-4", label: "Grades", value: "8 to 12" },
            { id: "stat-5", label: "Quintile", value: 3 },
            { id: "stat-6", label: "EMIS Number", value: 600112192 },
          ],
        }),
      ],
    },

    {
      slug: "/about",
      title: "About",
      enabled: true,
      nav: { label: "About", location: "header", position: 1 },
      sections: [
        editableSection("about-introduction", "school_about_landing", {
          section_title: "About Our School",
          subtitle:
            "A learning community built on academic excellence, character and opportunity.",
          heading: "Welcome to our school",
          body:
            "Our school provides a supportive environment in which learners are challenged to achieve their potential and contribute positively to society.",
          image_url: fallbackHeroImage,
        }),
        editableSection("about-values", "school_about_values", {
          section_title: "Our Values",
          cards: [
            {
              id: "value-excellence",
              title: "Excellence",
              body: "We strive for high standards in learning and service.",
            },
            {
              id: "value-respect",
              title: "Respect",
              body: "We value every learner, family and staff member.",
            },
            {
              id: "value-community",
              title: "Community",
              body: "We grow through partnership and shared responsibility.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/about/who-we-are",
      title: "Who We Are",
      enabled: true,
      nav: { label: "Who We Are", location: "header", position: 2 },
      sections: [
        editableSection("who-we-are-introduction", "school_who_we_are", {
          section_title: "Who We Are",
          subtitle: "A school committed to learning, leadership and service.",
          body:
            "We nurture responsible, capable and compassionate young people through quality teaching and meaningful school experiences.",
          image_url: fallbackHeroImage,
        }),
      ],
    },
    {
      slug: "/about/vision-mission",
      title: "Vision & Mission",
      enabled: true,
      nav: { label: "Vision & Mission", location: "header", position: 3 },
      sections: [
        editableSection("vision-mission-content", "school_vision_mission", {
          section_title: "Vision & Mission",
          cards: [
            {
              id: "vision",
              eyebrow: "Vision",
              title: "Our Vision",
              body:
                "To develop empowered learners who excel academically and contribute responsibly.",
            },
            {
              id: "mission",
              eyebrow: "Mission",
              title: "Our Mission",
              body:
                "To deliver quality education through dedicated teaching, strong values and community partnership.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/about/history",
      title: "Our History",
      enabled: true,
      nav: { label: "Our History", location: "header", position: 4 },
      sections: [
        editableSection("school-history", "school_history", {
          section_title: "Our History",
          subtitle: "Milestones in our journey of learning and service.",
          items: [
            {
              id: "history-1",
              title: "School Established",
              year: "1990",
              body: "Our school was founded to serve the local community.",
            },
            {
              id: "history-2",
              title: "Growing Achievement",
              year: "Present",
              body: "We continue to develop learners through quality education.",
            },
          ],
        }),
      ],
    },

    {
      slug: "/staff",
      title: "Staff Members",
      enabled: true,
      nav: { label: "Staff Members", location: "header", position: 5 },
      sections: [
        editableSection("staff-team", "school_staff", {
          section_title: "School Leadership & Staff",
          subtitle:
            "Dedicated educators and leaders committed to academic excellence, discipline and learner development at M.O.M Sebone Secondary School.",
          items: [
            {
              id: "staff-mathibe",
              name: "P. MATHIBE",
              role: "Principal",
              image_url: "/images/staff/mathibe.jpg",
              img: "/images/staff/mathibe.jpg",
            },
            {
              id: "staff-mokoena",
              name: "S. MOKOENA",
              role: "Deputy Principal",
              image_url: "/images/staff/teacher1.jpg",
              img: "/images/staff/teacher1.jpg",
            },
            {
              id: "staff-nkosi",
              name: "N. NKOSI",
              role: "HOD: Sciences",
              image_url: "/images/staff/teacher2.jpg",
              img: "/images/staff/teacher2.jpg",
            },
            {
              id: "staff-dlamini",
              name: "M. DLAMINI",
              role: "Educator",
              image_url: "/images/staff/teacher3.jpg",
              img: "/images/staff/teacher3.jpg",
            },
          ],
        }),
        editableSection("staff-sgb-team", "school_sgb", {
          section_title: "School Governing Body (SGB)",
          subtitle:
            "The School Governing Body supports governance, accountability, community engagement and policy oversight to ensure that M.O.M Sebone Secondary School continues to deliver quality education and responsible leadership.",
          description:
            "The School Governing Body supports governance, accountability, community engagement and policy oversight to ensure that M.O.M Sebone Secondary School continues to deliver quality education and responsible leadership.",
          responsibilities_title: "SGB Responsibilities",
          responsibilities: [
            "Develop and approve school policies",
            "Support the leadership of the school",
            "Promote parent and community participation",
            "Ensure responsible financial governance",
            "Promote discipline, safety and learner development",
          ],
          items: [
            {
              id: "staff-sgb-chairperson",
              name: "T. Lukes",
              role: "Chairperson",
              image_url: "/images/sgb/chairperson.jpg",
              img: "/images/sgb/chairperson.jpg",
            },
            {
              id: "staff-sgb-deputy",
              name: "R. Molefe",
              role: "Deputy Chairperson",
              image_url: "/images/sgb/deputy.jpg",
              img: "/images/sgb/deputy.jpg",
            },
            {
              id: "staff-sgb-secretary",
              name: "L. Nkosi",
              role: "Secretary",
              image_url: "/images/sgb/secretary.jpg",
              img: "/images/sgb/secretary.jpg",
            },
            {
              id: "staff-sgb-treasurer",
              name: "M. Van Rooyen",
              role: "Treasurer",
              image_url: "/images/sgb/treasurer.jpg",
              img: "/images/sgb/treasurer.jpg",
            },
          ],
        }),
      ],
    },
    {
      slug: "/sgb",
      title: "SGB",
      enabled: true,
      nav: { label: "SGB", location: "header", position: 6 },
      sections: [
        editableSection("sgb-team", "school_sgb", {
          section_title: "School Governing Body (SGB)",
          subtitle:
            "The School Governing Body supports governance, accountability, community engagement and policy oversight to ensure that M.O.M Sebone Secondary School continues to deliver quality education and responsible leadership.",
          description:
            "The School Governing Body supports governance, accountability, community engagement and policy oversight to ensure that M.O.M Sebone Secondary School continues to deliver quality education and responsible leadership.",
          responsibilities_title: "SGB Responsibilities",
          responsibilities: [
            "Develop and approve school policies",
            "Support the leadership of the school",
            "Promote parent and community participation",
            "Ensure responsible financial governance",
            "Promote discipline, safety and learner development",
          ],
          items: [
            {
              id: "sgb-chairperson",
              name: "T. Lukes",
              role: "Chairperson",
              image_url: "/images/sgb/chairperson.jpg",
              img: "/images/sgb/chairperson.jpg",
            },
            {
              id: "sgb-deputy",
              name: "R. Molefe",
              role: "Deputy Chairperson",
              image_url: "/images/sgb/deputy.jpg",
              img: "/images/sgb/deputy.jpg",
            },
            {
              id: "sgb-secretary",
              name: "L. Nkosi",
              role: "Secretary",
              image_url: "/images/sgb/secretary.jpg",
              img: "/images/sgb/secretary.jpg",
            },
            {
              id: "sgb-treasurer",
              name: "M. Van Rooyen",
              role: "Treasurer",
              image_url: "/images/sgb/treasurer.jpg",
              img: "/images/sgb/treasurer.jpg",
            },
          ],
        }),
      ],
    },
    {
      slug: "/facilities",
      title: "Facilities",
      enabled: true,
      nav: { label: "Facilities", location: "header", position: 7 },
      sections: [
        editableSection("facilities-overview", "school_facilities", {
          section_title: "School Facilities",
          subtitle:
            "Our facilities are designed to provide a safe, structured, and resource-rich environment that supports both academic and extracurricular excellence.",
          items: [
            {
              id: "facility-learning-spaces",
              title: "Learning Spaces",
              body:
                "Modern classrooms, science laboratories, and structured learning spaces designed to support academic excellence and focused instruction.",
              image_url: "/images/facilities/classrooms.jpg",
              img: "/images/facilities/classrooms.jpg",
            },
            {
              id: "facility-library-resource-centre",
              title: "Library & Resource Centre",
              body:
                "A dedicated space for reading, research, and digital learning access, supporting independent study and curriculum enrichment.",
              image_url: "/images/facilities/library.jpg",
            },
            {
              id: "facility-science-computer-labs",
              title: "Science & Computer Labs",
              body:
                "Fully equipped laboratories for Physical Sciences, Life Sciences, and Information Technology.",
              image_url: "/images/facilities/computer-lab.jpg",
            },
            {
              id: "facility-sport-recreation",
              title: "Sport & Recreation",
              body:
                "Soccer field, athletics space, and courts that promote discipline, teamwork, and physical development.",
              image_url: "/images/facilities/sports.jpg",
            },
            {
              id: "facility-administration-block",
              title: "Administration Block",
              body:
                "Professional administrative offices ensuring effective school management and learner support services.",
              image_url: "/images/facilities/admin.jpg",
            },
            {
              id: "facility-multipurpose-hall",
              title: "Assembly & Multi-Purpose Hall",
              body:
                "A venue for assemblies, examinations, cultural activities, and important school events.",
              image_url: "/images/facilities/hall.jpg",
            },
          ],
        }),
      ],
    },
    {
      slug: "/activities",
      title: "Activities",
      enabled: true,
      nav: { label: "Activities", location: "header", position: 8 },
      sections: [
        editableSection("activities-overview", "school_activities", {
          section_title: "Activities",
          subtitle:
            "Activities at school builds confident learners through academics, sport, culture and a safe campus environment.",
          items: [
            {
              id: "activity-academics",
              title: "Academics",
              body:
                "Study support, subject guidance, and learning culture that drives strong results.",
              href: "/site/activities/academics",
            },
            {
              id: "activity-sports",
              title: "Sports & Recreation",
              body: "Healthy competition, teamwork and fitness for learners.",
              href: "/site/activities/sports",
            },
            {
              id: "activity-culture",
              title: "Culture & Activities",
              body:
                "Leadership, arts, clubs and activities that develop well-rounded learners.",
              href: "/site/activities/culture",
            },
            {
              id: "activity-facilities",
              title: "Campus Facilities",
              body:
                "The spaces and resources that support learning and growth.",
              href: "/site/activities/facilities",
            },
          ],
        }),
      ],
    },
    {
      slug: "/activities/academics",
      title: "Academics",
      enabled: true,
      nav: { label: "Academics", location: "header", position: 9 },
      sections: [
        editableSection("academics-programmes", "school_academics", {
          section_title: "Academic Programme",
          subtitle:
            "Our School is committed to maintaining high academic standards, fostering discipline, and preparing learners for tertiary education and responsible citizenship.",
          image_url: "/images/gallery22.jpg",
          image_alt: "Classroom Activity",
          commitment_title: "Our Academic Commitment",
          commitment_body:
            "We strive to cultivate disciplined, confident, and high-performing learners through structured teaching, academic support, and strong school–parent partnerships.",
          items: [
            {
              id: "academic-curriculum-excellence",
              title: "Curriculum Excellence",
              body:
                "Our curriculum is aligned with the National Curriculum Statement (CAPS) and is delivered by qualified educators committed to academic excellence and learner development.",
            },
            {
              id: "academic-subject-support",
              title: "Subject Support & Enrichment",
              body:
                "We provide structured extra lessons, revision sessions, study groups, and targeted intervention programmes to support learner progress and performance improvement.",
            },
            {
              id: "academic-assessment",
              title: "Assessment & Examination Culture",
              body:
                "Learners benefit from continuous assessment, structured feedback, term tests, and formal examinations that prepare them effectively for Grade 12 final assessments.",
            },
            {
              id: "academic-stem",
              title: "STEM & Digital Learning",
              body:
                "Our academic programme integrates science, technology, mathematics, and digital literacy to equip learners with 21st-century skills.",
            },
            {
              id: "academic-career-guidance",
              title: "Career Guidance & Subject Choices",
              body:
                "We assist learners in selecting subjects aligned with their strengths, interests, and future career aspirations, ensuring informed academic decisions.",
            },
            {
              id: "academic-monitoring",
              title: "Academic Performance Monitoring",
              body:
                "Learner progress is monitored throughout the year through data-driven performance tracking and structured parental engagement.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/activities/sports",
      title: "Sports & Recreation",
      enabled: true,
      nav: { label: "Sports & Recreation", location: "header", position: 10 },
      sections: [
        editableSection("sports-programmes", "school_sports", {
          section_title: "Sports & Recreation",
          subtitle:
            "Our sports programme promotes teamwork, discipline, and excellence—developing confident learners through structured training and competitive participation.",
          image_url: "/images/gallery2.avif",
          image_alt: "Soccer Team 2025",
          items: [
            {
              id: "sport-team-sports",
              title: "Team Sports",
              body:
                "Structured training sessions, competitive fixtures, and school pride that build discipline, teamwork, and resilience.",
            },
            {
              id: "sport-athletic-development",
              title: "Athletic Development",
              body:
                "Programmes designed to improve strength, coordination, endurance, and overall physical performance.",
            },
            {
              id: "sport-fitness-wellness",
              title: "Fitness & Wellness",
              body:
                "Physical education initiatives that promote healthy lifestyles and balanced learner development.",
            },
            {
              id: "sport-inclusive-participation",
              title: "Inclusive Participation",
              body:
                "Opportunities for all learners to participate, develop skills, and proudly represent the school.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/activities/culture",
      title: "Culture & Activities",
      enabled: true,
      nav: { label: "Culture & Activities", location: "header", position: 11 },
      sections: [
        editableSection("culture-programmes", "school_culture", {
          section_title: "Culture & Activities",
          subtitle:
            "Our cultural and co-curricular programmes build confident, responsible learners through leadership, creativity, and community participation.",
          image_url: "/images/gallery4.jpg",
          image_alt: "School Culture Activities",
          items: [
            {
              id: "culture-leadership",
              title: "Leadership Development",
              body:
                "Learner leadership programmes promote responsibility, accountability, and disciplined representation of the school.",
            },
            {
              id: "culture-clubs",
              title: "Clubs & Societies",
              body:
                "Academic and creative clubs provide opportunities for innovation, teamwork, and skill development beyond the classroom.",
            },
            {
              id: "culture-activities",
              title: "Cultural Activities",
              body:
                "Drama, music, debate, and heritage events foster confidence, expression, and appreciation of diversity.",
            },
            {
              id: "culture-events",
              title: "School Events",
              body:
                "Assemblies, award ceremonies, and special celebrations strengthen unity, pride, and school identity.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/activities/facilities",
      title: "Campus Facilities",
      enabled: true,
      nav: { label: "Campus Facilities", location: "header", position: 12 },
      sections: [
        editableSection("activity-facilities-gallery", "school_activity_facilities", {
          section_title: "Campus Facilities",
          subtitle:
            "Our facilities provide a supportive environment for academic excellence, discipline, learner wellbeing, and participation in sport and culture.",
          primary_button_label: "Full Facilities Page",
          primary_button_href: "/facilities",
          secondary_button_label: "View Photos",
          secondary_button_href: "/gallery",
          image_url: "/images/school/school.jpg",
          image_alt: "School Campus",
          feature_groups: [
            {
              id: "academic",
              title: "Academic Facilities",
              icon: "🎓",
              items: [
                "Spacious, well-equipped classrooms",
                "Science laboratories (Physical Sciences & Life Sciences)",
                "Computer laboratory with internet access",
                "Library and study resource centre",
                "Mathematics support and enrichment",
              ],
            },
            {
              id: "sports",
              title: "Sports & Recreation",
              icon: "🏟️",
              items: [
                "Soccer and athletics field",
                "Netball and basketball courts",
                "Multi-purpose sports ground",
                "Indoor hall for assemblies and events",
              ],
            },
            {
              id: "support",
              title: "Learner Support Areas",
              icon: "🛡️",
              items: [
                "Administration block",
                "Guidance and counselling support",
                "Staff room and meeting facilities",
                "Secure school premises and controlled access",
              ],
            },
          ],
          gallery_label: "# Preview",
          gallery_title: "Facilities Photo Preview",
          gallery_subtitle: "Replace these images with your real facility photos.",
          gallery_button_label: "Open Gallery →",
          gallery_note:
            "Tip: put images in public/images/facilities/ and keep the same names.",
          gallery: [
            {
              id: "facility-preview-classrooms",
              title: "Classrooms",
              image_url: "/images/facilities/classrooms.jpg",
              img: "/images/facilities/classrooms.jpg",
            },
            {
              id: "facility-preview-science-lab",
              title: "Science Lab",
              image_url: "/images/facilities/science-lab.jpg",
              img: "/images/facilities/science-lab.jpg",
            },
            {
              id: "facility-preview-computer-lab",
              title: "Computer Lab",
              image_url: "/images/facilities/computer-lab.jpg",
              img: "/images/facilities/computer-lab.jpg",
            },
            {
              id: "facility-preview-sports",
              title: "Sports Grounds",
              image_url: "/images/facilities/sports.jpg",
              img: "/images/facilities/sports.jpg",
            },
          ],
        }),
      ],
    },
    {
      slug: "/resources",
      title: "Resources",
      enabled: true,
      nav: { label: "Resources", location: "header", position: 13 },
      sections: [
        editableSection("resources-library", "school_resources", {
          section_title: "Resources",
          subtitle:
            "Important academic documents, learner support materials, school policies, and official information for learners and parents.",
          items: [
            {
              id: "subject-choices",
              title: "Subject Choices",
              body: "Guidance on subject selection and academic pathways.",
              href: "/resources/subject-choices",
              button_label: "View",
            },
            {
              id: "term-plan",
              title: "Term Plan",
              body: "Official academic calendar and term activities.",
              href: "/resources/term-plan",
              button_label: "View",
            },
            {
              id: "exam-schedule",
              title: "Exam Schedule",
              body: "Examination dates and assessment planning.",
              href: "/resources/exam-schedule",
              button_label: "View",
            },
            {
              id: "code-of-conduct",
              title: "Code of Conduct",
              body: "Learner behaviour guidelines and discipline policy.",
              href: "/resources/code-of-conduct",
              button_label: "View",
            },
            {
              id: "stationary-list",
              title: "Stationary List",
              body: "Required stationery items per grade.",
              href: "/resources/stationary-list",
              button_label: "View",
            },
            {
              id: "school-calendar",
              title: "School Calendar",
              body: "Important academic and school activity dates.",
              href: "/resources/calendar",
              button_label: "View",
            },
          ],
        }),
      ],
    },
    {
      slug: "/resources/subject-choices",
      title: "Subject Choices",
      enabled: true,
      nav: { label: "Subject Choices", location: "header", position: 14 },
      sections: [
        editableSection("subject-choices-content", "school_subject_choices", {
          section_title: "Subject Choices",
          subtitle:
            "Use this guide to understand subject options by grade and choose the best pathway based on interests, strengths and career goals.",
          core_title: "Grade 8–9 Core Subjects",
          core_description:
            "These are the standard compulsory subjects offered in the Senior Phase.",
          core_subjects: [
            "Home Language",
            "First Additional Language",
            "Mathematics",
            "Natural Sciences",
            "Social Sciences",
            "Technology",
            "Economic & Management Sciences (EMS)",
            "Life Orientation",
            "Creative Arts",
          ],
          core_note:
            "Note: Exact subjects may vary depending on school offerings. Update this list to match Sebone’s official curriculum.",
          streams_title: "Grade 10–12 Streams",
          streams_description:
            "In Grade 10–12, learners usually select a stream (pathway). The final subject package should meet promotion and NSC requirements.",
          streams: [
            {
              id: "science-technology-stream",
              title: "Science & Technology Stream",
              summary:
                "Best for learners interested in engineering, health sciences, IT and technical careers.",
              subjects: [
                "Mathematics",
                "Physical Sciences",
                "Life Sciences",
                "Geography or Information Technology (if offered)",
                "Life Orientation",
                "Home Language",
                "First Additional Language",
              ],
              note:
                "Some schools offer CAT/IT; replace with the correct option at Sebone.",
            },
            {
              id: "commerce-stream",
              title: "Commerce Stream",
              summary:
                "Best for learners interested in business, finance, accounting, economics and management.",
              subjects: [
                "Mathematics or Mathematical Literacy (depending on requirements)",
                "Accounting",
                "Business Studies",
                "Economics",
                "Life Orientation",
                "Home Language",
                "First Additional Language",
              ],
            },
            {
              id: "humanities-stream",
              title: "Humanities Stream",
              summary:
                "Best for learners interested in law, education, languages, social sciences and public service.",
              subjects: [
                "Mathematics or Mathematical Literacy",
                "History or Geography",
                "Life Sciences or Tourism (if offered)",
                "Religious Studies / Consumer Studies (if offered)",
                "Life Orientation",
                "Home Language",
                "First Additional Language",
              ],
              note:
                "Replace optional subjects with what your school offers.",
            },
          ],
          electives_title: "Electives & Additional Options",
          electives_description:
            "These subjects depend on availability and class capacity. Confirm with the school before selecting.",
          electives: [
            {
              id: "cat",
              name: "Computer Applications Technology (CAT)",
              desc: "Office tools, productivity, basic computer skills.",
            },
            {
              id: "it",
              name: "Information Technology (IT)",
              desc: "Programming and computing concepts (if offered).",
            },
            {
              id: "tourism",
              name: "Tourism",
              desc: "Tourism industry knowledge and practical learning.",
            },
            {
              id: "consumer-studies",
              name: "Consumer Studies",
              desc: "Food, nutrition and consumer management (if offered).",
            },
            {
              id: "agricultural-sciences",
              name: "Agricultural Sciences",
              desc: "Agriculture and life sciences focus (if offered).",
            },
          ],
          electives_note:
            "If your school does not offer some options above, remove them and replace with Sebone’s real electives.",
          downloads_title: "Downloads",
          downloads_description:
            "You can upload PDF documents to the public folder and link them here.",
          downloads: [
            {
              id: "subject-choice-form",
              label: "Subject Choice Form (PDF) →",
              href: "/site/docs/subject-choice-form.pdf",
            },
            {
              id: "grade-10-subject-guide",
              label: "Grade 10 Subject Guide (PDF) →",
              href: "/site/docs/grade-10-subject-guide.pdf",
            },
          ],
          downloads_note:
            "If you don’t have PDFs yet, keep the section and remove these links until documents are available.",
        }),
      ],
    },
    {
      slug: "/resources/term-plan",
      title: "Term Plan",
      enabled: true,
      nav: { label: "Term Plan", location: "header", position: 15 },
      sections: [
        editableSection("term-plan-content", "school_term_plan", {
          section_title: "Academic Term Plan",
          description:
            "The Academic Term Plan provides important information about the school academic year including term dates, examination periods, school holidays, and other key academic activities.",
          supporting_text:
            "Learners, parents, and educators are encouraged to review the official term plan regularly to stay informed about important academic dates and school events.",
          pdf_url: "",
          view_button_label: "View Term Plan",
          download_button_label: "Download PDF",
          pdf_title: "Academic Term Plan",
        }),
      ],
    },
    {
      slug: "/resources/exam-schedule",
      title: "Exam Schedule",
      enabled: true,
      nav: { label: "Exam Schedule", location: "header", position: 16 },
      sections: [
        editableSection("exam-schedule-content", "school_exam_schedule", {
          kicker: "Academic Assessment",
          section_title: "Exam Schedule",
          subtitle:
            "View examination dates, subjects, times and venues. Learners should arrive early with all required materials.",
          notice_title: "Important notice",
          notice_body:
            "The timetable shown below contains sample dates for website setup. Replace it with the school-approved examination timetable before publishing.",
          table_title: "Examination Timetable",
          table_subtitle: "Filter by grade or search by subject and venue.",
          pdf_url: "",
          view_button_label: "View Official PDF",
          download_button_label: "Download Schedule",
          footer_note:
            "Learners must confirm final dates with the school and report to the examination venue at least 30 minutes before the starting time.",
          items: [
            {
              id: "exam-grade12-english-p1",
              grade: "Grade 12",
              subject: "English Home Language",
              paper: "Paper 1",
              date: "2026-11-02",
              time: "09:00",
              end_time: "12:00",
              venue: "Main Hall",
              duration: "3 hours",
              status: "Scheduled",
            },
            {
              id: "exam-grade12-mathematics-p1",
              grade: "Grade 12",
              subject: "Mathematics",
              paper: "Paper 1",
              date: "2026-11-04",
              time: "09:00",
              end_time: "12:00",
              venue: "Main Hall",
              duration: "3 hours",
              status: "Scheduled",
            },
            {
              id: "exam-grade12-life-sciences-p1",
              grade: "Grade 12",
              subject: "Life Sciences",
              paper: "Paper 1",
              date: "2026-11-06",
              time: "09:00",
              end_time: "11:30",
              venue: "Main Hall",
              duration: "2 h 30 min",
              status: "Scheduled",
            },
            {
              id: "exam-grade11-mathematics-p1",
              grade: "Grade 11",
              subject: "Mathematics",
              paper: "Paper 1",
              date: "2026-11-09",
              time: "09:00",
              end_time: "12:00",
              venue: "Room B12",
              duration: "3 hours",
              status: "Scheduled",
            },
            {
              id: "exam-grade11-physical-sciences-p1",
              grade: "Grade 11",
              subject: "Physical Sciences",
              paper: "Paper 1",
              date: "2026-11-11",
              time: "09:00",
              end_time: "12:00",
              venue: "Science Block",
              duration: "3 hours",
              status: "Scheduled",
            },
            {
              id: "exam-grade10-geography-p1",
              grade: "Grade 10",
              subject: "Geography",
              paper: "Paper 1",
              date: "2026-11-12",
              time: "09:00",
              end_time: "11:30",
              venue: "Room C04",
              duration: "2 h 30 min",
              status: "Scheduled",
            },
            {
              id: "exam-grade9-mathematics",
              grade: "Grade 9",
              subject: "Mathematics",
              paper: "Final Assessment",
              date: "2026-11-16",
              time: "09:00",
              end_time: "11:00",
              venue: "Room A08",
              duration: "2 hours",
              status: "Scheduled",
            },
            {
              id: "exam-grade8-natural-sciences",
              grade: "Grade 8",
              subject: "Natural Sciences",
              paper: "Final Assessment",
              date: "2026-11-18",
              time: "09:00",
              end_time: "10:30",
              venue: "Room A03",
              duration: "1 h 30 min",
              status: "Scheduled",
            },
          ],
        }),
      ],
    },
    {
      slug: "/resources/code-of-conduct",
      title: "Code Of Conduct",
      enabled: true,
      nav: { label: "Code of Conduct", location: "header", position: 17 },
      sections: [
        editableSection("conduct-policy", "school_code_of_conduct", {
          section_title: "Learner Code of Conduct",
          introduction:
            "The Learner Code of Conduct of M.O.M Sebone Secondary School sets out the standards of behaviour expected from every learner. These rules are designed to create a safe, disciplined, and respectful environment that supports effective teaching and learning.",
          rules: [
            {
              id: "respect-behaviour",
              title: "Respect and Behaviour",
              body:
                "Learners must treat teachers, staff members, fellow learners, and visitors with respect and dignity at all times. Bullying, discrimination, harassment, or any form of violence is strictly prohibited.",
            },
            {
              id: "attendance",
              title: "Attendance",
              body:
                "Regular attendance is essential for academic success. Learners must attend school daily, arrive on time, and participate fully in all learning activities unless a valid reason is provided.",
            },
            {
              id: "school-uniform",
              title: "School Uniform",
              body:
                "Learners are required to wear the correct school uniform at all times during school hours and official school activities. The uniform must be clean, neat, and worn in accordance with school policy.",
            },
            {
              id: "academic-responsibility",
              title: "Academic Responsibility",
              body:
                "Learners are expected to complete all assignments, homework, and assessments honestly and on time. Cheating, plagiarism, or academic dishonesty will not be tolerated.",
            },
            {
              id: "safety-property",
              title: "Safety and School Property",
              body:
                "Learners must respect school property and maintain a clean environment. Any damage to school facilities or equipment may result in disciplinary action.",
            },
            {
              id: "discipline",
              title: "Discipline",
              body:
                "Failure to comply with school rules may result in disciplinary action in accordance with the school's disciplinary procedures and national education regulations.",
            },
          ],
          closing_text:
            "Parents and guardians are encouraged to review this policy together with learners to ensure that all expectations are clearly understood.",
          pdf_url: "/docs/code-of-conduct.pdf",
          view_button_label: "View Full Document",
          download_button_label: "Download Code of Conduct (PDF)",
        }),
      ],
    },
    {
      slug: "/resources/stationary-list",
      title: "Stationary List",
      enabled: true,
      nav: { label: "Stationary List", location: "header", position: 18 },
      sections: [
        editableSection("stationary-list-content", "school_stationary_list", {
          section_title: "Stationery Requirements",
          subtitle:
            "Official stationery items per grade and subject. Please ensure learners have the required materials.",
          pdf_url: "/site/docs/stationary-list.pdf",
          download_button_label: "Download PDF",
          footer_note:
            "Note: Teachers may issue additional subject-specific requirements during the first week of school.",
          items: [
            {
              id: "grade8-all-subjects",
              grade: "Grade 8",
              subject: "All Subjects",
              items:
                "72-page exercise books, A4 hard cover books, file folder, pens/pencils/eraser, ruler, glue stick",
            },
            {
              id: "grade8-mathematics",
              grade: "Grade 8",
              subject: "Mathematics",
              items: "Scientific calculator, mathematical set, graph book",
            },
            {
              id: "grade8-natural-sciences",
              grade: "Grade 8",
              subject: "Natural Sciences",
              items:
                "A4 hard cover book, calculator (recommended), colour pencils",
            },
            {
              id: "grade9-all-subjects",
              grade: "Grade 9",
              subject: "All Subjects",
              items:
                "Exercise books, A4 hard cover books, file folder, highlighters, pens/pencils/eraser, ruler",
            },
            {
              id: "grade9-mathematics",
              grade: "Grade 9",
              subject: "Mathematics",
              items: "Scientific calculator, mathematical set, graph book",
            },
            {
              id: "grade9-natural-sciences",
              grade: "Grade 9",
              subject: "Natural Sciences",
              items:
                "A4 hard cover book, calculator (recommended), colour pencils",
            },
            {
              id: "grade10-12-all-subjects",
              grade: "Grade 10–12",
              subject: "All Subjects",
              items:
                "Subject exercise books, A4 hard cover books, file folder for assessments, pens/pencils/eraser, ruler",
            },
            {
              id: "grade10-12-mathematics",
              grade: "Grade 10–12",
              subject: "Mathematics / Maths Lit",
              items: "Scientific calculator, mathematical set, graph book",
            },
            {
              id: "grade10-12-physical-sciences",
              grade: "Grade 10–12",
              subject: "Physical Sciences",
              items:
                "Scientific calculator, A4 hard cover book, practical file/folder",
            },
          ],
        }),
      ],
    },
    {
      slug: "/resources/calendar",
      title: "Calendar",
      enabled: true,
      nav: { label: "Calendar", location: "header", position: 19 },
      sections: [
        editableSection("resource-calendar", "school_calendar", {
          section_title: "School Calendar",
          subtitle:
            "Key academic dates, examinations, school activities, and public holidays.",
          view_all_label: "View All Events",
          view_all_href: "/calendar/events",
          download_label: "Download PDF",
          pdf_url: "/docs/school-calendar.pdf",
          calendar_label: "Calendar",
          calendar_heading: "Monthly Overview",
          calendar_note: "Tap days to view events (optional upgrade).",
          upcoming_label: "# Upcoming",
          upcoming_heading: "Upcoming Events",
          upcoming_note:
            "This is a preview. Use “View All Events” for the full calendar list.",
          view_all_link_label: "View All →",
          footer_note:
            "For official confirmation of dates, please contact the Administration Office.",
          items: [
            {
              id: "resource-calendar-new-year",
              title: "New Year's Day",
              startAt: "2026-01-01T00:00",
              endAt: "2026-01-01T23:59",
              location: "Public Holiday",
              category: "Public Holiday",
            },
            {
              id: "resource-calendar-reopens",
              title: "School Reopens (Term 1)",
              startAt: "2026-01-14T07:30",
              endAt: "2026-01-14T14:30",
              location: "School Campus",
              category: "Academic",
            },
            {
              id: "resource-calendar-exams",
              title: "Final Examinations Begin",
              startAt: "2026-11-10T08:00",
              endAt: "2026-11-10T15:00",
              location: "Exam Venues",
              category: "Exams",
            },
            {
              id: "resource-calendar-awards",
              title: "Awards Ceremony",
              startAt: "2026-11-25T10:00",
              endAt: "2026-11-25T12:00",
              location: "School Hall",
              category: "School Event",
            },
          ],
        }),
      ],
    },
    {
      slug: "/bulletin",
      title: "Daily Bulletin",
      enabled: true,
      nav: { label: "Daily Bulletin", location: "header", position: 20 },
      sections: [
        editableSection("daily-bulletin", "school_daily_bulletin", {
          section_title: "Student Daily Bulletin",
          subtitle:
            "Official daily announcements for learners at M.O.M Sebone Secondary School.",
          search_placeholder: "Search bulletin...",
          empty_message: "No announcements matched your search.",
          footer_note:
            "For urgent announcements, learners should confirm details with the school office or their class teacher.",
          items: [
            {
              id: "bulletin-mathematics-extra-classes",
              date: "18 March 2026",
              title: "Mathematics Extra Classes",
              category: "Academics",
              urgent: false,
              content:
                "Grade 12 learners will attend Mathematics extra classes from 14:30 – 16:00 in Room 12.",
            },
            {
              id: "bulletin-school-assembly-reminder",
              date: "18 March 2026",
              title: "School Assembly Reminder",
              category: "General",
              urgent: true,
              content:
                "All learners must report to the assembly ground at 07:30 sharp in full school uniform.",
            },
            {
              id: "bulletin-soccer-trials",
              date: "17 March 2026",
              title: "Soccer Trials",
              category: "Sports",
              urgent: false,
              content:
                "Soccer trials will take place at 15:00 on the main field. Bring training kit.",
            },
            {
              id: "bulletin-life-sciences-practical",
              date: "17 March 2026",
              title: "Life Sciences Practical",
              category: "Academics",
              urgent: false,
              content:
                "Grade 11 learners must bring lab coats for the Life Sciences practical session.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/attendance",
      title: "Attendance Policy",
      enabled: true,
      nav: { label: "Attendance Policy", location: "header", position: 21 },
      sections: [
        editableSection("attendance-policy", "school_attendance_policy", {
          section_title: "Attendance Policy",
          subtitle:
            "This policy explains attendance expectations, late-coming procedures, absence reporting, and academic accountability for learners at M.O.M Sebone Secondary School.",
          school_name: "M.O.M Sebone Secondary School",
          phone: "011 023 9428",
          email: "sebone@gmail.com",
          meta_items: [
            "Policy Type: Learner Conduct",
            "Applies to: All Grades",
            "Status: Active",
          ],
          purpose_title: "1. Purpose",
          purpose_body:
            "Regular attendance is essential for learner performance, discipline, and successful completion of curriculum requirements. This policy sets out clear procedures to support punctuality, monitor attendance, and ensure effective communication between the school and parents/guardians.",
          attendance_title: "2. Attendance Expectations",
          attendance_expectations: [
            "Learners must attend school every official school day unless excused for a valid reason.",
            "Learners must arrive on time and be prepared for learning (uniform, stationery, and books).",
            "Attendance is recorded daily (and per period where applicable).",
            "Repeated absences or late-coming may lead to intervention and disciplinary steps.",
          ],
          late_coming_title: "3. Late-Coming Procedure",
          late_coming_body:
            "Learners who arrive late disrupt teaching and learning. Late-coming is recorded and monitored.",
          late_arrival_title: "3.1 When a learner is late",
          late_arrival_items: [
            "Report to the designated late-coming point/office on arrival.",
            "Late-coming is recorded and may require a slip/pass to enter class.",
            "Repeated late-coming triggers parent contact and intervention.",
          ],
          acceptable_reasons_title: "3.2 Acceptable reasons",
          acceptable_reasons: [
            "Medical appointment (proof required)",
            "Public transport delays (when consistent and verifiable)",
            "Family emergency (parent/guardian confirmation required)",
          ],
          absences_title: "4. Absences & Reporting",
          absence_items: [
            "Parents/guardians must inform the school as soon as possible when a learner will be absent.",
            "A written note or proof must be provided upon return to school.",
            "Medical certificates are required for extended illness or repeated health-related absences.",
            "Unreported absences may be recorded as unexcused and can trigger intervention.",
          ],
          absence_callout_label: "Important:",
          absence_callout:
            "If a learner is absent on the day of a test/exam, the school may require valid proof before a make-up assessment is considered.",
          catch_up_title: "5. Catch-Up Work & Assessments",
          catch_up_items: [
            "It is the learner’s responsibility to request and complete missed classwork.",
            "Teachers will guide learners on what was missed and the deadline for catch-up work.",
            "Make-up tasks/tests are granted at the school’s discretion and may require proof of absence.",
            "Repeated missed assessments may affect promotion requirements.",
          ],
          intervention_title: "6. Monitoring & Intervention",
          intervention_steps: [
            {
              id: "early-warning",
              title: "Early Warning",
              body:
                "Educator/grade head identifies patterns of lateness/absence and records concerns.",
            },
            {
              id: "parent-contact",
              title: "Parent/Guardian Contact",
              body:
                "School contacts parent/guardian to discuss causes and agree on corrective actions.",
            },
            {
              id: "support-plan",
              title: "Support Plan",
              body:
                "Where needed, a learner support plan may be implemented (counselling, referrals, monitoring).",
            },
            {
              id: "disciplinary-steps",
              title: "Disciplinary Steps",
              body:
                "Continued non-compliance may lead to disciplinary action in line with the school code of conduct.",
            },
          ],
          roles_title: "7. Roles & Responsibilities",
          roles: [
            {
              id: "learners",
              title: "Learners",
              items: [
                "Attend daily and arrive on time.",
                "Bring required materials and maintain discipline.",
                "Catch up missed work promptly.",
              ],
            },
            {
              id: "parents",
              title: "Parents/Guardians",
              items: [
                "Ensure learners arrive on time.",
                "Report absences promptly and provide proof.",
                "Respond to school communication and attend meetings when required.",
              ],
            },
            {
              id: "school",
              title: "School",
              items: [
                "Record attendance accurately.",
                "Communicate concerns and apply interventions.",
                "Support learners to improve attendance.",
              ],
            },
          ],
          contact_title: "8. Contact",
          contact_body:
            "For attendance enquiries, please contact the school office:",
          footer_note:
            "This page is a website version of the policy. The school’s official signed policy document remains the primary reference.",
        }),
      ],
    },
    {
      slug: "/calendar/events",
      title: "All Events",
      enabled: true,
      nav: { label: "All Events", location: "header", position: 22 },
      sections: [
        editableSection("all-calendar-events", "school_all_events", {
          section_title: "All Calendar Events",
          subtitle:
            "Browse and search all school events, academic dates, and public holidays.",
          search_placeholder: "Search events (e.g. exams, awards, term 1)",
          empty_message: "No events matched your search.",
          footer_note:
            "Tip: Upload a PDF to public/docs/school-calendar.pdf and the download button will work.",
          items: [
            {
              id: "all-event-new-year",
              title: "New Year's Day",
              startAt: "2026-01-01T00:00",
              endAt: "2026-01-01T23:59",
              location: "Public Holiday",
              category: "Public Holiday",
            },
            {
              id: "all-event-reopens",
              title: "School Reopens (Term 1)",
              startAt: "2026-01-14T07:30",
              endAt: "2026-01-14T14:30",
              location: "School Campus",
              category: "Academic",
            },
            {
              id: "all-event-awards",
              title: "Awards Ceremony",
              startAt: "2026-11-25T10:00",
              endAt: "2026-11-25T12:00",
              location: "School Hall",
              category: "School Event",
            },
            {
              id: "all-event-exams",
              title: "Final Examinations Begin",
              startAt: "2026-11-10T08:00",
              endAt: "2026-11-10T15:00",
              location: "Exam Venues",
              category: "Exams",
            },
          ],
        }),
      ],
    },
    {
      slug: "/admissions",
      title: "Admissions",
      enabled: true,
      nav: { label: "Admissions", location: "header", position: 23 },
      sections: [
        editableSection("admissions-main", "school_admissions_landing", {
          section_title: "Admission",
          subtitle:
            "Join a school that shapes character, curiosity and leadership.",
          heading: "Are you ready for the adventure of your life?",
          description:
            "View the admissions process and requirements. We admit learners from Grade 8 through Grade 12. Follow the clear steps below to apply — we review each application with care.",
          eligibility:
            "Learners must be between ages 12 — 20 for secondary placements. Special assessments may apply.",
          primary_button_label: "Start Application",
          primary_button_href: "/admissions/apply",
          secondary_button_label: "Download Form",
          secondary_button_href: "",
          overview_title: "School Overview",
          overview_subtitle:
            "Established 1990 • Co-educational • Grades 8–12",
          book_visit_label: "Book a Visit",
          requirements_label: "Policies",
          process: [
            {
              id: "download",
              title: "Download",
              body: "Get the official admission form (PDF).",
            },
            {
              id: "complete",
              title: "Complete",
              body:
                "Fill guardian details and attach required documents (ID, proof of residence, reports).",
            },
            {
              id: "submit",
              title: "Submit",
              body:
                "Upload online or hand-deliver to the school office during working hours.",
            },
            {
              id: "await",
              title: "Await",
              body:
                "You will receive confirmation via email or SMS about assessment and intake.",
            },
          ],
          stats: [
            { id: "established", label: "Established", value: 1990 },
            { id: "learners", label: "No. Of Learners", value: 1525 },
            { id: "staff", label: "No. Of Staff", value: 18 },
            { id: "grades", label: "Grades", value: "8 to 12" },
            { id: "quintile", label: "Quintile", value: 3 },
            { id: "emis", label: "EMIS Number", value: 600112192 },
          ],
        }),
      ],
    },
    {
      slug: "/admissions/apply",
      title: "Apply",
      enabled: true,
      nav: { label: "Apply Now", location: "header", position: 24 },
      sections: [
        editableSection("application-introduction", "school_apply_online", {
          section_title: "Online Application",
          form_title: "Online Application",
          form_subtitle:
            "Complete the form below and upload required documents. Fields marked",
          required_fields_label: "are mandatory.",
          manual_form_url: "/docs/admission-form.pdf",
          manual_form_label: "Download Manual Form",
          help_href: "/contact",
          help_label: "Need Help?",
          progress_title: "Application Progress",
          uploads_tip_title: "Tip",
          uploads_tip_text:
            "If you cannot upload documents, you may submit the manual form in person with certified copies.",
          submit_note:
            "By submitting, your application will be sent to the Administration Office for review.",
          help_text:
            "If you experience any difficulty, contact the school office or submit your manual application form with certified copies.",
        }),
      ],
    },
    {
      slug: "/admissions/requirements",
      title: "Requirements",
      enabled: true,
      nav: { label: "Entry Requirements", location: "header", position: 25 },
      sections: [
        editableSection("admission-requirements", "school_entry_requirements", {
          section_title: "Entry Requirements",
          documents_title: "Required Documents",
          documents_description:
            "All applications must include the following certified documents:",
          required_documents: [
            "Certified copy of learner's birth certificate or ID",
            "Certified copy of parent/guardian ID",
            "Latest school report",
            "Proof of residential address",
            "Transfer letter from previous school if applicable",
            "Immunisation card if available",
          ],
          grades_title: "Grade Admissions",
          process_title: "Application Process",
          application_process: [
            "Complete the official school application form.",
            "Submit all required supporting documents.",
            "Applications may be submitted online or at the school office.",
            "Parents will be contacted once the application has been reviewed.",
          ],
          notes_title: "Important Notes",
          important_notes: [
            "All documents must be certified.",
            "Incomplete applications may not be processed.",
            "Submission of an application does not guarantee admission.",
            "Admission decisions are subject to the school's capacity.",
          ],
          apply_button_label: "Apply Online",
          download_button_label: "Manual Application PDF",
          view_button_label: "View Form",
          footer_note:
            "You can apply online, or download the manual form, complete it, and submit it to the school office with the required certified documents.",
        }),
      ],
    },
    {
      slug: "/admissions/howtoapply",
      title: "How To Apply",
      enabled: true,
      nav: { label: "How to Apply", location: "header", position: 26 },
      sections: [
        editableSection("how-to-apply", "school_how_to_apply", {
          section_title: "How to Apply",
          primary_badge: "Admissions",
          secondary_badge: "Grade 8–12",
          apply_button_label: "Apply Online",
          hero_download_label: "Download Manual Form (PDF)",
          help_button_label: "Need Help?",
          online_title: "Option A: Apply Online",
          online_description:
            "Complete the online form and upload the required documents. You will receive an application reference number.",
          online_steps: [
            "Fill in learner details and parent/guardian details.",
            "Provide previous school information if applicable.",
            "Upload required documents in PDF, JPG, or PNG format.",
            "Review and submit your application.",
          ],
          online_start_label: "Start Online Application",
          requirements_button_label: "View Requirements",
          manual_title: "Option B: Manual Application",
          manual_description:
            "Download the manual application form, complete it and submit it at the school office with certified copies.",
          manual_steps: [
            "Download and print the form.",
            "Complete clearly in block letters.",
            "Attach certified supporting documents.",
            "Submit to the Administration Office during school hours.",
          ],
          manual_download_label: "Download Manual Form",
          contact_button_label: "Contact the School",
          documents_title: "Required Documents Summary",
          documents_description:
            "The documents below are typically required. Please confirm on the Entry Requirements page for the latest list.",
          required_documents: [
            "Certified copy of learner Birth Certificate / ID",
            "Certified copy of parent/guardian ID",
            "Latest school report",
            "Proof of address",
            "Transfer letter if applicable",
            "Immunisation card / clinic card if applicable",
          ],
          footer_note:
            "For official confirmation of placement and deadlines, please contact the Administration Office.",
        }),
      ],
    },
    {
      slug: "/digital-library",
      title: "Digital Library",
      enabled: true,
      nav: { label: "Digital Library", location: "header", position: 27 },
      sections: [
        editableSection("digital-library-content", "school_digital_library", {
          section_title: "Digital Academic Library",
          subtitle: "Grades 8–12 | CAPS Curriculum | South Africa",
          search_placeholder: "Search by title or keyword",
          clear_button_label: "Clear Filters",
          grade_filter_title: "Grade",
          term_filter_title: "Term",
          open_subject_label: "Open Resources",
          open_resource_label: "Open Resource",
          empty_message: "No resources found for the selected filters.",
          portal_title: "NSC Examination Portal – Grade 12",
          portal_body:
            "Official National Senior Certificate examination papers, trial examinations, supplementary exams and memorandums from national and provincial departments.",
          close_pdf_label: "✕ Close",
          default_grade: 10,
          default_term: "Term 1",
          grades: [8, 9, 10, 11, 12],
          terms: ["Term 1", "Term 2", "Term 3", "Term 4"],
          provinces: [
            "National",
            "Gauteng",
            "Limpopo",
            "Western Cape",
            "Mpumalanga",
            "Free State",
            "KwaZulu-Natal",
            "North West",
            "Eastern Cape",
            "Northern Cape",
          ],
          subject_groups: {
            Languages: [
              "English HL",
              "English FAL",
              "Afrikaans",
              "IsiXhosa",
              "IsiZulu",
              "Sepedi",
              "Sesotho",
              "Setswana",
              "Tshivenda",
              "Siswati",
              "IsiNdebele",
            ],
            "Mathematics & Life Skills": [
              "Mathematics",
              "Mathematical Literacy",
              "Life Orientation",
            ],
            Sciences: ["Physical Sciences", "Life Sciences"],
            Commerce: ["Accounting", "Business Studies", "Economics"],
            Humanities: ["History", "Geography", "Tourism"],
            Technology: [
              "Computer Applications Technology (CAT)",
              "Information Technology (IT)",
              "Engineering Graphics & Design (EGD)",
            ],
            "Arts & Creative": [
              "Visual Arts",
              "Music",
              "Dramatic Arts",
              "Dance Studies",
              "Hospitality Studies",
            ],
            Other: [
              "Agricultural Sciences",
              "Consumer Studies",
              "Religion Studies",
            ],
          },
          items: [
            {
              id: "resource-mathematics-nsc-2023-exam",
              title: "NSC Mathematics Final Examination",
              grade: 12,
              subject: "Mathematics",
              type: "Exam",
              year: 2023,
              province: "National",
              pdf: "/pdfs/maths-nsc-2023.pdf",
            },
            {
              id: "resource-mathematics-nsc-2023-memo",
              title: "NSC Mathematics Final Memorandum",
              grade: 12,
              subject: "Mathematics",
              type: "Memo",
              year: 2023,
              province: "National",
              pdf: "/pdfs/maths-nsc-2023-memo.pdf",
            },
            {
              id: "resource-physical-sciences-2022-exam",
              title: "Physical Sciences November Exam",
              grade: 11,
              subject: "Physical Sciences",
              type: "Exam",
              year: 2022,
              province: "Gauteng",
              pdf: "/pdfs/physics-2022.pdf",
            },
          ],
        }),
      ],
    },
    {
      slug: "/schoolcalendar",
      title: "School Calendar",
      enabled: true,
      nav: { label: "School Calendar", location: "header", position: 28 },
      sections: [
        editableSection("school-calendar-main", "school_calendar", {
          section_title: "School Calendar",
          subtitle:
            "Key academic dates, examinations, school activities, and public holidays.",
          view_all_label: "View All Events",
          view_all_href: "/calendar/events",
          download_label: "Download PDF",
          pdf_url: "/docs/school-calendar.pdf",
          calendar_label: "Calendar",
          calendar_heading: "Monthly Overview",
          calendar_note: "Tap days to view events (optional upgrade).",
          upcoming_label: "# Upcoming",
          upcoming_heading: "Upcoming Events",
          upcoming_note:
            "This is a preview. Use “View All Events” for the full calendar list.",
          view_all_link_label: "View All →",
          footer_note:
            "For official confirmation of dates, please contact the Administration Office.",
          items: [
            {
              id: "school-calendar-new-year",
              title: "New Year's Day",
              startAt: "2026-01-01T00:00",
              endAt: "2026-01-01T23:59",
              location: "Public Holiday",
              category: "Public Holiday",
            },
            {
              id: "school-calendar-reopens",
              title: "School Reopens (Term 1)",
              startAt: "2026-01-14T07:30",
              endAt: "2026-01-14T14:30",
              location: "School Campus",
              category: "Academic",
            },
            {
              id: "school-calendar-exams",
              title: "Final Examinations Begin",
              startAt: "2026-11-10T08:00",
              endAt: "2026-11-10T15:00",
              location: "Exam Venues",
              category: "Exams",
            },
            {
              id: "school-calendar-awards",
              title: "Awards Ceremony",
              startAt: "2026-11-25T10:00",
              endAt: "2026-11-25T12:00",
              location: "School Hall",
              category: "School Event",
            },
          ],
        }),
      ],
    },
    {
      slug: "/news",
      title: "News",
      enabled: true,
      nav: { label: "News", location: "header", position: 29 },
      sections: [
        editableSection("news-listing", "school_news", {
          section_title: "Latest News",
          subtitle: "Latest stories and achievements from our school community.",
          items: [
            {
              id: "news-sponsors-partners",
              title:
                "We are grateful to our Sponsors and Partners on this journey",
              image_url: "/images/sponsor.webp",
              image_alt:
                "We are grateful to our Sponsors and Partners on this journey",
              date: "Dec 2025",
              category: "School News",
              summary:
                "Read more about our partnerships, collaborations, and school activities.",
            },
            {
              id: "news-motus-partnership",
              title: "Motus — Partnership announcement",
              image_url: "/images/motus.jpg",
              image_alt: "Motus — Partnership announcement",
              date: "Nov 2025",
              category: "School News",
              summary:
                "Read more about our partnerships, collaborations, and school activities.",
            },
            {
              id: "news-dfa-collaboration",
              title: "Open Access Network DFA collaboration",
              image_url: "/images/DFA.webp",
              image_alt: "Open Access Network DFA collaboration",
              date: "Oct 2025",
              category: "School News",
              summary:
                "Read more about our partnerships, collaborations, and school activities.",
            },
          ],
        }),
      ],
    },
    {
      slug: "/gallery",
      title: "Gallery",
      enabled: true,
      nav: { label: "Gallery", location: "header", position: 30 },
      sections: [
        editableSection("gallery-main", "school_gallery", {
          section_title: "Photo Gallery",
          subtitle: "Moments from academics, activities and school events.",
          items: [
            {
              id: "gallery-academics",
              title: "ACADEMICS",
              image_url: "/images/gallery1.jpg",
              image_alt: "ACADEMICS",
              link: "/activities/academics",
            },
            {
              id: "gallery-sports",
              title: "SPORTS",
              image_url: "/images/gallery2.avif",
              image_alt: "SPORTS",
              link: "/activities/sports",
            },
            {
              id: "gallery-culture",
              title: "CULTURE",
              image_url: "/images/gallery4.jpg",
              image_alt: "CULTURE",
              link: "/activities/culture",
            },
            {
              id: "gallery-staff",
              title: "STAFF",
              image_url: "/images/teachers.jpeg",
              image_alt: "STAFF",
              link: "/staff",
            },
          ],
        }),
        editableSection("gallery-wall-of-fame", "school_wall_of_fame", {
          section_title: "Academic Wall of Fame",
          subtitle:
            "Celebrating Outstanding Academic Performance & Excellence",
          items: [
            {
              id: "gallery-award-top-performers",
              title: "Top Academic Performers",
              year: 2025,
              description:
                "Learners who achieved distinctions across all subjects",
              image_url: "/images/academics/acade13.jpg",
              gallery: [
                "/images/academics/acade10.jpg",
                "/images/academics/acade12.jpg",
              ],
            },
            {
              id: "gallery-award-mathematics",
              title: "Mathematics Excellence Award",
              year: 2025,
              description:
                "Outstanding results in Mathematics & Physical Sciences",
              image_url: "/images/academics/acade14.jpg",
              gallery: [
                "/images/academics/acade5.jpg",
                "/images/academics/acade8.jpg",
              ],
            },
            {
              id: "gallery-award-improved-performance",
              title: "Most Improved Academic Performance",
              year: 2025,
              description:
                "Recognising exceptional academic growth and commitment",
              image_url: "/images/academics/acade4.jpg",
              gallery: [
                "/images/academics/acade3.webp",
                "/images/academics/acade1.jpg",
              ],
            },
          ],
        }),
      ],
    },
    {
      slug: "/robotics",
      title: "Robotics Club",
      enabled: true,
      nav: { label: "Robotics Club", location: "header", position: 31 },
      sections: [
        editableSection("robotics-overview", "school_robotics", {
          section_title: "Robotics Club",
          subtitle:
            "The Robotics Club develops problem-solving, teamwork and engineering skills through hands-on projects, coding and competitions.",
          learning_title: "What You Learn",
          learning_items: [
            "Basic electronics & sensors",
            "Programming logic & control",
            "Design thinking & teamwork",
            "Competition preparation",
          ],
          projects_title: "Projects",
          projects_body:
            "Build line-followers, obstacle robots, mini automation systems, and creative prototypes.",
          competitions_title: "Competitions",
          competitions_body:
            "Represent the school and learn confidence through challenges, presentations and teamwork.",
          primary_button_label: "Join the club",
          primary_button_href: "/contact",
          secondary_button_label: "See school gallery",
          secondary_button_href: "/gallery",
        }),
      ],
    },
    {
      slug: "/wall-of-fame",
      title: "Wall Of Fame",
      enabled: true,
      nav: { label: "Wall Of Fame", location: "home", position: 108 },
      sections: [
        editableSection("recognition-main", "school_wall_of_fame", {
          section_title: "Academic Wall of Fame",
          subtitle:
            "Celebrating Outstanding Academic Performance & Excellence",
          items: [
            {
              id: "award-top-performers",
              title: "Top Academic Performers",
              year: 2025,
              description:
                "Learners who achieved distinctions across all subjects",
              image_url: "/images/academics/acade13.jpg",
              gallery: [
                "/images/academics/acade10.jpg",
                "/images/academics/acade12.jpg",
              ],
            },
            {
              id: "award-mathematics",
              title: "Mathematics Excellence Award",
              year: 2025,
              description:
                "Outstanding results in Mathematics & Physical Sciences",
              image_url: "/images/academics/acade14.jpg",
              gallery: [
                "/images/academics/acade5.jpg",
                "/images/academics/acade8.jpg",
              ],
            },
            {
              id: "award-improved-performance",
              title: "Most Improved Academic Performance",
              year: 2025,
              description:
                "Recognising exceptional academic growth and commitment",
              image_url: "/images/academics/acade4.jpg",
              gallery: [
                "/images/academics/acade3.webp",
                "/images/academics/acade1.jpg",
              ],
            },
          ],
        }),
      ],
    },
    {
      slug: "/contact",
      title: "Contact",
      enabled: true,
      nav: { label: "Contact", location: "header", position: 33 },
      sections: [
        editableSection("contact-details", "school_contact", {
          section_title: "Contact Us",
          subtitle: "We look forward to hearing from you.",
          heading: "Get in Touch",
          body:
            "Contact our school for admissions, learner support and general enquiries.",
          email: "info@yourschool.co.za",
          phone: "+27 00 000 0000",
          address_line1: "123 Education St",
          city: "Johannesburg",
          province: "Gauteng",
          postal_code: "0000",
          country: "South Africa",
          map_title: "Location Map",
          map_badge_label: "Map",
          map_available_text: "Find us using the official address",
          map_empty_text: "Save an organisation address to show the map",
        }),
      ],
    },
    {
      slug: "/notices",
      title: "Notices",
      enabled: true,
      nav: { label: "Notice Board", location: "home", position: 109 },
      sections: [
        editableSection("notices-main", "school_notices", {
          section_title: "School Notices",
          subtitle:
            "Official communications and announcements from M.O.M Sebone Secondary School.",
          search_placeholder:
            "Search notices (exams, awards, report cards, hall...)",
          badge_label: "Official Notice Board",
          empty_message: "No notices matched your search.",
          footer_note:
            "For official confirmation, contact the school administration office.",
          items: [
            {
              id: "notices-report-cards",
              title: "Issuing Term 4 Report Cards",
              publishedAt: "2025-12-07T08:00:00",
              startAt: "2025-12-07T08:00:00",
              endAt: "2025-12-07T14:00:00",
              location: "Administration Office",
              status: "Active",
            },
            {
              id: "notices-awards-ceremony",
              title: "Awards Ceremony",
              publishedAt: "2025-11-25T07:30:00",
              startAt: "2025-11-25T10:00:00",
              endAt: "2025-11-25T12:30:00",
              location: "School Hall",
              status: "Active",
            },
            {
              id: "notices-school-awards-day",
              title: "School Awards Day",
              publishedAt: "2025-11-25T07:35:00",
              startAt: "2025-11-25T13:30:00",
              endAt: "2025-11-25T15:30:00",
              location: "School Hall",
              status: "Active",
            },
            {
              id: "notices-examinations-period",
              title: "Examinations Period",
              publishedAt: "2025-11-10T06:45:00",
              startAt: "2025-11-10T08:00:00",
              endAt: "2025-11-28T13:30:00",
              location: "Examination Venues",
              status: "Active",
            },
          ],
        }),
      ],
    },
    {
      slug: "/sponsors",
      title: "Sponsors",
      enabled: true,
      nav: { label: "Sponsors", location: "home", position: 110 },
      sections: [
        editableSection("sponsors-main", "school_sponsors", {
          section_title: "Our Partners & Supporters",
          subtitle:
            "School Name appreciates the continued support of our partners, community stakeholders, and organisations that contribute to learner development and school growth.",
          items: [
            {
              id: "partner-dbe",
              name: "Department of Basic Education",
              logo: "/images/dbe.png",
              link: "https://www.education.gov.za/",
            },
            {
              id: "partner-municipality",
              name: "Local Municipality",
              logo: "/images/municipality.png",
              link: "https://www.joburg.org.za/",
            },
            {
              id: "partner-community",
              name: "Community Development Trust",
              logo: "/images/community.png",
              link: "https://www.gov.za/",
            },
            {
              id: "partner-alumni",
              name: "Sebone Alumni Association",
              logo: "/images/alumni.png",
              link: "#",
            },
          ],
        }),
      ],
    },
  ],
};