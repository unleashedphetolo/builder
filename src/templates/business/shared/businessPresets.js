// Shared business template presets. Mirrors the security template structure with business-specific content, themes, image packs and defaults.

export const BUSINESS_THEMES = {
  "corporate": {
    "id": "corporate",
    "name": "Corporate Navy",
    "primary": "#0f172a",
    "secondary": "#1e3a8a",
    "accent": "#2563eb",
    "accent2": "#14b8a6",
    "surface": "#f8fafc",
    "card": "#ffffff",
    "text": "#0f172a",
    "muted": "#64748b",
    "line": "#dbeafe"
  },
  "consulting": {
    "id": "consulting",
    "name": "Advisor Teal",
    "primary": "#0f172a",
    "secondary": "#0f766e",
    "accent": "#14b8a6",
    "accent2": "#f59e0b",
    "surface": "#f0fdfa",
    "card": "#ffffff",
    "text": "#0f172a",
    "muted": "#64748b",
    "line": "#ccfbf1"
  },
  "agency": {
    "id": "agency",
    "name": "Creative Violet",
    "primary": "#2e1065",
    "secondary": "#7e22ce",
    "accent": "#ec4899",
    "accent2": "#f97316",
    "surface": "#faf5ff",
    "card": "#ffffff",
    "text": "#1f1235",
    "muted": "#6b5b7b",
    "line": "#eadcff"
  },
  "finance": {
    "id": "finance",
    "name": "Capital Emerald",
    "primary": "#052e16",
    "secondary": "#065f46",
    "accent": "#10b981",
    "accent2": "#eab308",
    "surface": "#ecfdf5",
    "card": "#ffffff",
    "text": "#052e16",
    "muted": "#55706b",
    "line": "#bbf7d0"
  },
  "executive": {
    "id": "executive",
    "name": "Executive Gold",
    "primary": "#111111",
    "secondary": "#2a2118",
    "accent": "#b8892e",
    "accent2": "#eab308",
    "surface": "#f7f3ea",
    "card": "#fffdf8",
    "text": "#1f2937",
    "muted": "#6b7280",
    "line": "#eadfca"
  },
  "saas": {
    "id": "saas",
    "name": "SaaS Blue",
    "primary": "#111827",
    "secondary": "#1d4ed8",
    "accent": "#38bdf8",
    "accent2": "#8b5cf6",
    "surface": "#eff6ff",
    "card": "#ffffff",
    "text": "#111827",
    "muted": "#64748b",
    "line": "#bfdbfe"
  },
  "logistics": {
    "id": "logistics",
    "name": "Route Orange",
    "primary": "#1c1917",
    "secondary": "#9a3412",
    "accent": "#f97316",
    "accent2": "#22c55e",
    "surface": "#fff7ed",
    "card": "#ffffff",
    "text": "#1c1917",
    "muted": "#78716c",
    "line": "#fed7aa"
  },
  "realestate": {
    "id": "realestate",
    "name": "Property Slate",
    "primary": "#1f2937",
    "secondary": "#334155",
    "accent": "#0ea5e9",
    "accent2": "#94a3b8",
    "surface": "#f1f5f9",
    "card": "#ffffff",
    "text": "#111827",
    "muted": "#64748b",
    "line": "#cbd5e1"
  },
  "healthcare": {
    "id": "healthcare",
    "name": "Healthcare Calm",
    "primary": "#064e3b",
    "secondary": "#0f766e",
    "accent": "#10b981",
    "accent2": "#38bdf8",
    "surface": "#ecfdf5",
    "card": "#ffffff",
    "text": "#052e2b",
    "muted": "#55706b",
    "line": "#bbf7d0"
  },
  "legal": {
    "id": "legal",
    "name": "Legal Burgundy",
    "primary": "#1f1010",
    "secondary": "#78350f",
    "accent": "#b45309",
    "accent2": "#facc15",
    "surface": "#fff7ed",
    "card": "#ffffff",
    "text": "#111827",
    "muted": "#6b7280",
    "line": "#fed7aa"
  }
};

export const BUSINESS_SOCIAL_DEFAULTS = {
  "corporate": [
    {
      "key": "linkedin"
    },
    {
      "key": "website"
    },
    {
      "key": "email"
    },
    {
      "key": "phone"
    }
  ],
  "consulting": [
    {
      "key": "linkedin"
    },
    {
      "key": "youtube"
    },
    {
      "key": "website"
    },
    {
      "key": "email"
    }
  ],
  "agency": [
    {
      "key": "instagram"
    },
    {
      "key": "linkedin"
    },
    {
      "key": "behance"
    },
    {
      "key": "email"
    }
  ],
  "finance": [
    {
      "key": "linkedin"
    },
    {
      "key": "website"
    },
    {
      "key": "email"
    },
    {
      "key": "phone"
    }
  ],
  "executive": [
    {
      "key": "linkedin"
    },
    {
      "key": "website"
    },
    {
      "key": "email"
    },
    {
      "key": "phone"
    }
  ],
  "saas": [
    {
      "key": "x"
    },
    {
      "key": "linkedin"
    },
    {
      "key": "github"
    },
    {
      "key": "email"
    }
  ],
  "logistics": [
    {
      "key": "linkedin"
    },
    {
      "key": "whatsapp"
    },
    {
      "key": "website"
    },
    {
      "key": "email"
    }
  ],
  "realestate": [
    {
      "key": "instagram"
    },
    {
      "key": "facebook"
    },
    {
      "key": "website"
    },
    {
      "key": "whatsapp"
    }
  ],
  "healthcare": [
    {
      "key": "facebook"
    },
    {
      "key": "instagram"
    },
    {
      "key": "whatsapp"
    },
    {
      "key": "email"
    }
  ],
  "legal": [
    {
      "key": "linkedin"
    },
    {
      "key": "website"
    },
    {
      "key": "email"
    },
    {
      "key": "phone"
    }
  ]
};

export const BUSINESS_IMAGE_PACKS = {
  "corporate": {
    "hero": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Enterprise Business Presence",
        "subtitle": "A polished template for companies that need credibility, services and clear calls to action.",
        "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Boardroom Confidence",
        "subtitle": "Show leadership, trust metrics and structured service delivery.",
        "image": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Operational Excellence",
        "subtitle": "Use image and video slides to present the business with authority.",
        "image": "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/3184465/3184465-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "consulting": {
    "hero": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Strategy Advisory Built For Growth",
        "subtitle": "A refined template for strategy, operations and management consultants.",
        "image": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Clear Decisions For Complex Markets",
        "subtitle": "Present advisory offers, outcomes, industries and client confidence.",
        "image": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Consulting Delivery In Motion",
        "subtitle": "Video slide support for a premium consulting brand experience.",
        "image": "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "agency": {
    "hero": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Campaigns That Move Markets",
        "subtitle": "A bold template for creative, digital and marketing agencies.",
        "image": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Creative Systems With Measurable Results",
        "subtitle": "Show campaign thinking, portfolio value and conversion-focused services.",
        "image": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Launch-Ready Growth Studio",
        "subtitle": "Video gives the homepage movement without sacrificing professionalism.",
        "image": "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/3209829/3209829-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "finance": {
    "hero": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Financial Clarity For Better Decisions",
        "subtitle": "Designed for finance, accounting, tax and capital advisory brands.",
        "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Capital Planning And Advisory",
        "subtitle": "Build trust with financial services, compliance language and metrics.",
        "image": "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Measured Growth With Trusted Numbers",
        "subtitle": "Use video to communicate steady, professional growth.",
        "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/3184291/3184291-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "executive": {
    "hero": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Executive-Level Corporate Presence",
        "subtitle": "A premium template for holdings, boards and executive service firms.",
        "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Leadership, Governance And Partnership",
        "subtitle": "Present leadership, governance, partnerships and high-value services.",
        "image": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Premium Business Confidence",
        "subtitle": "A cinematic slide supports a high-end corporate impression.",
        "image": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1900&q=82",
        "video": "https://cdn.pixabay.com/video/2023/10/15/184953-875016732_large.mp4"
      }
    ]
  },
  "saas": {
    "hero": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Software That Scales Operations",
        "subtitle": "Designed for software platforms, dashboards and enterprise tools.",
        "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Cloud Platform For Modern Teams",
        "subtitle": "Show product features, workflows, integrations and demo requests.",
        "image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Product Demos That Convert",
        "subtitle": "Video slide support helps the product feel active and modern.",
        "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
      }
    ]
  },
  "logistics": {
    "hero": "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Logistics Built Around Visibility",
        "subtitle": "Built for transport, warehousing, delivery and supply-chain companies.",
        "image": "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Warehousing And Route Control",
        "subtitle": "Show routes, fulfilment, fleet operations and service packages.",
        "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Supply Chain Momentum",
        "subtitle": "Use video to create movement and operational energy.",
        "image": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/856971/856971-hd_1920_1080_25fps.mp4"
      }
    ]
  },
  "realestate": {
    "hero": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Property Brands With Presence",
        "subtitle": "Built for property agencies, developers and real estate groups.",
        "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Modern Listings And Advisory",
        "subtitle": "Show valuation, property services, developments and client enquiries.",
        "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Development And Investment Confidence",
        "subtitle": "Video slide support for a premium property showcase.",
        "image": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/3770033/3770033-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "healthcare": {
    "hero": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Healthcare Practice With Trust",
        "subtitle": "A calm, trustworthy structure for clinics and professional healthcare providers.",
        "image": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Patient-Centred Professional Services",
        "subtitle": "Show services, appointment options, team values and patient contact paths.",
        "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Appointment-Ready Digital Presence",
        "subtitle": "Video slide support while keeping the page gentle and professional.",
        "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/4121327/4121327-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "legal": {
    "hero": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1500&q=82",
    "page": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1700&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Legal Advisory With Authority",
        "subtitle": "Formal website structure for legal, compliance and advisory firms.",
        "image": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Contracts, Compliance And Counsel",
        "subtitle": "Show practice areas, consultation paths and credible positioning.",
        "image": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Professional Consultation Experience",
        "subtitle": "Video slide support for an authoritative firm presence.",
        "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/3183197/3183197-uhd_2560_1440_25fps.mp4"
      }
    ]
  }
};

export const BUSINESS_PRESETS = {
  "business-corporate-v1": {
    "template_key": "business-corporate-v1",
    "name": "Corporate Enterprise",
    "contentKey": "corporate",
    "theme": "corporate",
    "imagePack": "corporate",
    "structure": "corporate",
    "navbarVariant": "boardroom",
    "heroVariant": "boardroom-split",
    "vmvVariant": "board-panels",
    "cardVariant": "enterprise-cards",
    "footerVariant": "corporate-footer",
    "formVariant": "enterprise-enquiry"
  },
  "business-consulting-v1": {
    "template_key": "business-consulting-v1",
    "name": "Strategy Consulting",
    "contentKey": "consulting",
    "theme": "consulting",
    "imagePack": "consulting",
    "structure": "consulting",
    "navbarVariant": "advisor-bar",
    "heroVariant": "advisor-panel",
    "vmvVariant": "advisor-panels",
    "cardVariant": "consulting-cards",
    "footerVariant": "advisor-footer",
    "formVariant": "consulting-brief"
  },
  "business-agency-v1": {
    "template_key": "business-agency-v1",
    "name": "Growth Agency",
    "contentKey": "agency",
    "theme": "agency",
    "imagePack": "agency",
    "structure": "agency",
    "navbarVariant": "creative-lab",
    "heroVariant": "campaign-mosaic",
    "vmvVariant": "creative-blocks",
    "cardVariant": "campaign-cards",
    "footerVariant": "agency-footer",
    "formVariant": "campaign-start"
  },
  "business-finance-v1": {
    "template_key": "business-finance-v1",
    "name": "Finance Advisory",
    "contentKey": "finance",
    "theme": "finance",
    "imagePack": "finance",
    "structure": "finance",
    "navbarVariant": "capital-strip",
    "heroVariant": "capital-dashboard",
    "vmvVariant": "finance-panels",
    "cardVariant": "capital-cards",
    "footerVariant": "finance-footer",
    "formVariant": "finance-consultation"
  },
  "business-executive-v1": {
    "template_key": "business-executive-v1",
    "name": "Executive Holdings",
    "contentKey": "executive",
    "theme": "executive",
    "imagePack": "executive",
    "structure": "executive",
    "navbarVariant": "executive-dark",
    "heroVariant": "executive-suite",
    "vmvVariant": "executive-panels",
    "cardVariant": "executive-cards",
    "footerVariant": "executive-footer",
    "formVariant": "executive-intake"
  },
  "business-saas-v1": {
    "template_key": "business-saas-v1",
    "name": "SaaS Platform",
    "contentKey": "saas",
    "theme": "saas",
    "imagePack": "saas",
    "structure": "saas",
    "navbarVariant": "saas-glass",
    "heroVariant": "product-cloud",
    "vmvVariant": "product-grid",
    "cardVariant": "product-cards",
    "footerVariant": "saas-footer",
    "formVariant": "demo-request"
  },
  "business-logistics-v1": {
    "template_key": "business-logistics-v1",
    "name": "Logistics Operations",
    "contentKey": "logistics",
    "theme": "logistics",
    "imagePack": "logistics",
    "structure": "logistics",
    "navbarVariant": "logistics-route",
    "heroVariant": "route-command",
    "vmvVariant": "route-panels",
    "cardVariant": "logistics-cards",
    "footerVariant": "logistics-footer",
    "formVariant": "shipment-plan"
  },
  "business-real-estate-v1": {
    "template_key": "business-real-estate-v1",
    "name": "Real Estate Group",
    "contentKey": "realestate",
    "theme": "realestate",
    "imagePack": "realestate",
    "structure": "realestate",
    "navbarVariant": "property-clean",
    "heroVariant": "property-showcase",
    "vmvVariant": "property-panels",
    "cardVariant": "property-cards",
    "footerVariant": "property-footer",
    "formVariant": "property-enquiry"
  },
  "business-healthcare-v1": {
    "template_key": "business-healthcare-v1",
    "name": "Healthcare Practice",
    "contentKey": "healthcare",
    "theme": "healthcare",
    "imagePack": "healthcare",
    "structure": "healthcare",
    "navbarVariant": "healthcare-calm",
    "heroVariant": "care-trust",
    "vmvVariant": "care-panels",
    "cardVariant": "care-cards",
    "footerVariant": "healthcare-footer",
    "formVariant": "appointment-request"
  },
  "business-legal-v1": {
    "template_key": "business-legal-v1",
    "name": "Legal Advisory",
    "contentKey": "legal",
    "theme": "legal",
    "imagePack": "legal",
    "structure": "legal",
    "navbarVariant": "legal-crest",
    "heroVariant": "legal-authority",
    "vmvVariant": "legal-panels",
    "cardVariant": "legal-cards",
    "footerVariant": "legal-footer",
    "formVariant": "legal-consultation"
  }
};

export const BUSINESS_TEMPLATE_KEYS = Object.keys(BUSINESS_PRESETS);
export const BUSINESS_DEFAULT_TEMPLATE = "business-corporate-v1";
