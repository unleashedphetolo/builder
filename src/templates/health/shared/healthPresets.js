// Shared health template presets. Mirrors the security template structure with health-specific content, themes, image packs and defaults.

export const HEALTH_THEMES = {
  "clinic": {
    "id": "clinic",
    "name": "Clinical Trust",
    "primary": "#082f49",
    "secondary": "#0e7490",
    "accent": "#0ea5e9",
    "accent2": "#10b981",
    "surface": "#f0f9ff",
    "card": "#ffffff",
    "text": "#082f49",
    "muted": "#64748b",
    "line": "#bae6fd"
  },
  "dental": {
    "id": "dental",
    "name": "Dental Mint",
    "primary": "#064e3b",
    "secondary": "#0f766e",
    "accent": "#14b8a6",
    "accent2": "#38bdf8",
    "surface": "#ecfdf5",
    "card": "#ffffff",
    "text": "#052e2b",
    "muted": "#55706b",
    "line": "#bbf7d0"
  },
  "specialist": {
    "id": "specialist",
    "name": "Specialist Navy",
    "primary": "#0f172a",
    "secondary": "#1e3a8a",
    "accent": "#2563eb",
    "accent2": "#22c55e",
    "surface": "#f8fafc",
    "card": "#ffffff",
    "text": "#0f172a",
    "muted": "#64748b",
    "line": "#dbeafe"
  },
  "physio": {
    "id": "physio",
    "name": "Recovery Teal",
    "primary": "#042f2e",
    "secondary": "#0f766e",
    "accent": "#10b981",
    "accent2": "#f59e0b",
    "surface": "#f0fdfa",
    "card": "#ffffff",
    "text": "#042f2e",
    "muted": "#5f746f",
    "line": "#ccfbf1"
  },
  "wellness": {
    "id": "wellness",
    "name": "Wellness Rose",
    "primary": "#3b0764",
    "secondary": "#7e22ce",
    "accent": "#ec4899",
    "accent2": "#14b8a6",
    "surface": "#faf5ff",
    "card": "#ffffff",
    "text": "#2e1065",
    "muted": "#6b5b7b",
    "line": "#eadcff"
  },
  "pediatric": {
    "id": "pediatric",
    "name": "Family Bright",
    "primary": "#0c4a6e",
    "secondary": "#0369a1",
    "accent": "#f59e0b",
    "accent2": "#22c55e",
    "surface": "#f0f9ff",
    "card": "#ffffff",
    "text": "#0c4a6e",
    "muted": "#64748b",
    "line": "#bae6fd"
  },
  "hospital": {
    "id": "hospital",
    "name": "Hospital Command",
    "primary": "#020617",
    "secondary": "#0e7490",
    "accent": "#38bdf8",
    "accent2": "#22c55e",
    "surface": "#eff6ff",
    "card": "#ffffff",
    "text": "#0f172a",
    "muted": "#64748b",
    "line": "#bfdbfe"
  },
  "diagnostics": {
    "id": "diagnostics",
    "name": "Lab Precision",
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
  "mental": {
    "id": "mental",
    "name": "Calm Indigo",
    "primary": "#312e81",
    "secondary": "#4f46e5",
    "accent": "#818cf8",
    "accent2": "#14b8a6",
    "surface": "#eef2ff",
    "card": "#ffffff",
    "text": "#1e1b4b",
    "muted": "#6b7280",
    "line": "#c7d2fe"
  },
  "pharmacy": {
    "id": "pharmacy",
    "name": "Pharmacy Green",
    "primary": "#064e3b",
    "secondary": "#15803d",
    "accent": "#22c55e",
    "accent2": "#38bdf8",
    "surface": "#ecfdf5",
    "card": "#ffffff",
    "text": "#052e2b",
    "muted": "#55706b",
    "line": "#bbf7d0"
  }
};

export const HEALTH_SOCIAL_DEFAULTS = {
  "clinic": [
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
  "dental": [
    {
      "key": "instagram"
    },
    {
      "key": "facebook"
    },
    {
      "key": "whatsapp"
    },
    {
      "key": "email"
    }
  ],
  "specialist": [
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
  "physio": [
    {
      "key": "instagram"
    },
    {
      "key": "facebook"
    },
    {
      "key": "whatsapp"
    },
    {
      "key": "email"
    }
  ],
  "wellness": [
    {
      "key": "instagram"
    },
    {
      "key": "facebook"
    },
    {
      "key": "youtube"
    },
    {
      "key": "whatsapp"
    }
  ],
  "pediatric": [
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
  "hospital": [
    {
      "key": "facebook"
    },
    {
      "key": "linkedin"
    },
    {
      "key": "phone"
    },
    {
      "key": "email"
    }
  ],
  "diagnostics": [
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
  "mental": [
    {
      "key": "instagram"
    },
    {
      "key": "facebook"
    },
    {
      "key": "whatsapp"
    },
    {
      "key": "email"
    }
  ],
  "pharmacy": [
    {
      "key": "facebook"
    },
    {
      "key": "whatsapp"
    },
    {
      "key": "email"
    },
    {
      "key": "phone"
    }
  ]
};

export const HEALTH_IMAGE_PACKS = {
  "clinic": {
    "hero": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Patient-centred clinic website",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Trusted consultations and care pathways",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Digital appointment experience",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/4121327/4121327-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "dental": {
    "hero": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Confident dental practice presence",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Modern treatments and patient comfort",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Smile-ready booking experience",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/5998265/5998265-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "specialist": {
    "hero": "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Specialist medical authority",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Referral-ready consultation flow",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Evidence-led care communication",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/8460159/8460159-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "physio": {
    "hero": "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Movement and recovery practice",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Rehabilitation plans with clarity",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Active recovery digital presence",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/4761719/4761719-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "wellness": {
    "hero": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Wellness centre with premium calm",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Preventive health and lifestyle support",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Programme enquiry experience",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/4327430/4327430-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "pediatric": {
    "hero": "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1576765607924-8fd670c590bf?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1576765607924-8fd670c590bf?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Family-friendly paediatric care",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Supportive care for children and parents",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Appointment-ready family website",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1576765607924-8fd670c590bf?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/4121314/4121314-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "hospital": {
    "hero": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Hospital network digital front door",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Departments, care pathways and support",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Enterprise hospital enquiry flow",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_25fps.mp4"
      }
    ]
  },
  "diagnostics": {
    "hero": "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Diagnostics laboratory precision",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Testing, reporting and specimen workflow",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Lab-ready digital experience",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "mental": {
    "hero": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Calm mental wellness practice",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Private support and guided care",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Sensitive enquiry experience",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/4475709/4475709-uhd_2560_1440_25fps.mp4"
      }
    ]
  },
  "pharmacy": {
    "hero": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1900&q=82",
    "about": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1900&q=82",
    "page": "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=1900&q=82",
    "gallery": [
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1300&q=82",
      "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=1300&q=82"
    ],
    "slides": [
      {
        "type": "image",
        "title": "Community pharmacy access",
        "subtitle": "A distinct enterprise healthcare layout with clear navigation and trust-focused content.",
        "image": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "image",
        "title": "Medication, clinic and collection services",
        "subtitle": "Use service sections, patient pathway content and proof blocks to guide visitors.",
        "image": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1900&q=82"
      },
      {
        "type": "video",
        "title": "Pharmacy enquiry and fulfilment flow",
        "subtitle": "Video slide support adds professional movement to the homepage while preserving a calm healthcare feel.",
        "image": "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=1900&q=82",
        "video": "https://videos.pexels.com/video-files/4122849/4122849-uhd_2560_1440_25fps.mp4"
      }
    ]
  }
};

export const HEALTH_PRESETS = {
  "health-clinic-v1": {
    "name": "PrimeCare Clinic",
    "contentKey": "clinic",
    "theme": "clinic",
    "imagePack": "clinic",
    "structure": "corporate",
    "navbarVariant": "clinic-trust",
    "heroVariant": "care-split",
    "vmvVariant": "care-panels",
    "cardVariant": "clinic-cards",
    "footerVariant": "clinic-footer",
    "formVariant": "patient-appointment",
    "template_key": "health-clinic-v1"
  },
  "health-dental-v1": {
    "name": "Dental Studio",
    "contentKey": "dental",
    "theme": "dental",
    "imagePack": "dental",
    "structure": "consulting",
    "navbarVariant": "dental-smile",
    "heroVariant": "smile-panel",
    "vmvVariant": "smile-panels",
    "cardVariant": "dental-cards",
    "footerVariant": "dental-footer",
    "formVariant": "dental-booking",
    "template_key": "health-dental-v1"
  },
  "health-specialist-v1": {
    "name": "Specialist Medical Centre",
    "contentKey": "specialist",
    "theme": "specialist",
    "imagePack": "specialist",
    "structure": "agency",
    "navbarVariant": "specialist-authority",
    "heroVariant": "consultant-card",
    "vmvVariant": "specialist-panels",
    "cardVariant": "specialist-cards",
    "footerVariant": "specialist-footer",
    "formVariant": "specialist-referral",
    "template_key": "health-specialist-v1"
  },
  "health-physio-v1": {
    "name": "Physio Recovery Studio",
    "contentKey": "physio",
    "theme": "physio",
    "imagePack": "physio",
    "structure": "finance",
    "navbarVariant": "physio-motion",
    "heroVariant": "recovery-flow",
    "vmvVariant": "recovery-panels",
    "cardVariant": "physio-cards",
    "footerVariant": "physio-footer",
    "formVariant": "physio-assessment",
    "template_key": "health-physio-v1"
  },
  "health-wellness-v1": {
    "name": "Wellness & Lifestyle Centre",
    "contentKey": "wellness",
    "theme": "wellness",
    "imagePack": "wellness",
    "structure": "executive",
    "navbarVariant": "wellness-soft",
    "heroVariant": "wellness-retreat",
    "vmvVariant": "wellness-panels",
    "cardVariant": "wellness-cards",
    "footerVariant": "wellness-footer",
    "formVariant": "wellness-consult",
    "template_key": "health-wellness-v1"
  },
  "health-pediatric-v1": {
    "name": "Family Paediatric Care",
    "contentKey": "pediatric",
    "theme": "pediatric",
    "imagePack": "pediatric",
    "structure": "saas",
    "navbarVariant": "pediatric-playful",
    "heroVariant": "family-care",
    "vmvVariant": "family-panels",
    "cardVariant": "pediatric-cards",
    "footerVariant": "family-footer",
    "formVariant": "child-appointment",
    "template_key": "health-pediatric-v1"
  },
  "health-hospital-v1": {
    "name": "Hospital Network",
    "contentKey": "hospital",
    "theme": "hospital",
    "imagePack": "hospital",
    "structure": "logistics",
    "navbarVariant": "hospital-command",
    "heroVariant": "hospital-network",
    "vmvVariant": "hospital-panels",
    "cardVariant": "hospital-cards",
    "footerVariant": "hospital-footer",
    "formVariant": "hospital-intake",
    "template_key": "health-hospital-v1"
  },
  "health-diagnostics-v1": {
    "name": "Diagnostics Laboratory",
    "contentKey": "diagnostics",
    "theme": "diagnostics",
    "imagePack": "diagnostics",
    "structure": "realestate",
    "navbarVariant": "diagnostics-lab",
    "heroVariant": "lab-dashboard",
    "vmvVariant": "lab-panels",
    "cardVariant": "diagnostic-cards",
    "footerVariant": "lab-footer",
    "formVariant": "lab-request",
    "template_key": "health-diagnostics-v1"
  },
  "health-mental-wellness-v1": {
    "name": "MindCare Wellness Practice",
    "contentKey": "mental",
    "theme": "mental",
    "imagePack": "mental",
    "structure": "healthcare",
    "navbarVariant": "mental-calm",
    "heroVariant": "calm-space",
    "vmvVariant": "mental-panels",
    "cardVariant": "mental-cards",
    "footerVariant": "mental-footer",
    "formVariant": "therapy-request",
    "template_key": "health-mental-wellness-v1"
  },
  "health-pharmacy-v1": {
    "name": "Community Pharmacy",
    "contentKey": "pharmacy",
    "theme": "pharmacy",
    "imagePack": "pharmacy",
    "structure": "legal",
    "navbarVariant": "pharmacy-care",
    "heroVariant": "pharmacy-access",
    "vmvVariant": "pharmacy-panels",
    "cardVariant": "pharmacy-cards",
    "footerVariant": "pharmacy-footer",
    "formVariant": "pharmacy-order",
    "template_key": "health-pharmacy-v1"
  }
};

export const HEALTH_TEMPLATE_KEYS = Object.keys(HEALTH_PRESETS);
export const HEALTH_DEFAULT_TEMPLATE = "health-clinic-v1";
