export type ResourceDownload = {
  label: string;
  /** Use /contact for gated files until CMS provides real URLs */
  href: string;
};

export type ResourceExternal = {
  label: string;
  href: string;
};

export type ResourceItem = {
  id: string;
  title: string;
  summary: string;
  downloads?: ResourceDownload[];
  externals?: ResourceExternal[];
};

export type ResourceCategory = {
  id: string;
  title: string;
  description?: string;
  items: ResourceItem[];
};

/** Scaffold — replace with CMS when ready */
export const GROWTH_RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: "persons",
    title: "Persons",
    description: "Key contacts and leadership references.",
    items: [
      {
        id: "persons-staff",
        title: "Ministry staff directory",
        summary: "Names, roles, and how to reach the right person for prayer, care, or administration.",
        downloads: [{ label: "Staff directory (PDF)", href: "/contact?type=resource&item=staff-directory" }],
        externals: [{ label: "Email the office", href: "mailto:info@thewalk.org" }],
      },
      {
        id: "persons-elders",
        title: "Elders & oversight",
        summary: "Who provides spiritual oversight and how members can connect for counsel.",
        downloads: [{ label: "Elder care pathway (PDF)", href: "/contact?type=resource&item=elders" }],
      },
    ],
  },
  {
    id: "organizations",
    title: "Organizations",
    description: "Partners and entities we work with.",
    items: [
      {
        id: "org-partners",
        title: "Mission partners",
        summary: "Short profiles of organizations we support and how to learn more.",
        externals: [
          { label: "Global missions partner site", href: "https://www.example.org" },
          { label: "Local outreach collective", href: "https://www.example.org" },
        ],
      },
      {
        id: "org-fiscal",
        title: "Fiscal & legal",
        summary: "Registered name, charitable status, and annual report links.",
        downloads: [{ label: "Governance summary (PDF)", href: "/contact?type=resource&item=governance" }],
      },
    ],
  },
  {
    id: "documents",
    title: "Documents",
    description: "Policies, statements, and printable guides.",
    items: [
      {
        id: "docs-beliefs",
        title: "Statement of faith & practice",
        summary: "Concise doctrinal summary for members and partners.",
        downloads: [
          { label: "Statement of faith (PDF)", href: "/contact?type=resource&item=beliefs-pdf" },
          { label: "Member covenant (PDF)", href: "/contact?type=resource&item=covenant" },
        ],
      },
      {
        id: "docs-safety",
        title: "Safety & safeguarding",
        summary: "Expectations for volunteers and leaders serving with vulnerable groups.",
        downloads: [{ label: "Safeguarding overview (PDF)", href: "/contact?type=resource&item=safety" }],
      },
    ],
  },
  {
    id: "templates",
    title: "Templates",
    description: "Reusable forms and outlines for groups and hosts.",
    items: [
      {
        id: "tpl-small-group",
        title: "Small group discussion",
        summary: "A simple four-part outline you can adapt for weekly gatherings.",
        downloads: [
          { label: "Discussion guide (DOCX)", href: "/contact?type=resource&item=sg-template" },
          { label: "Prayer prompts (PDF)", href: "/contact?type=resource&item=prayer-prompts" },
        ],
      },
      {
        id: "tpl-volunteer",
        title: "Volunteer onboarding",
        summary: "Checklist for new volunteers across ministries.",
        downloads: [{ label: "Onboarding checklist (PDF)", href: "/contact?type=resource&item=volunteer" }],
      },
    ],
  },
];

export const GROWTH_SERVICES_TEASER = {
  id: "services",
  title: "Services",
  description: "Hands-on help from theWalk team — from first steps to ongoing support.",
  items: [
    {
      id: "svc-pastoral",
      title: "Pastoral care",
      summary: "Crisis prayer, visitation requests, and spiritual direction intake.",
      downloads: [{ label: "Care request form (PDF)", href: "/contact?type=service&item=pastoral" }],
      externals: [{ label: "Start a request online", href: "/contact?type=care" }],
    },
    {
      id: "svc-equipping",
      title: "Equipping & training",
      summary: "Workshops and coaching for hosts, leaders, and ministry teams.",
      externals: [{ label: "View the Services page", href: "/growth/services" }],
    },
  ],
};
