export type IlmMarketingLink = { label: string; href: string };

export type IlmMarketingContent = {
  tagline: string;
  heroTitle: string;
  heroBody: string;
  heroLinks: IlmMarketingLink[];
  about: { title: string; body: string; links: IlmMarketingLink[] };
  howItWorks: { title: string; intro: string; steps: { title: string; body: string }[]; links: IlmMarketingLink[] };
  pricing: { title: string; intro: string; tiers: { name: string; summary: string; bullets: string[] }[] };
  faq: { title: string; intro: string; items: { q: string; a: string }[] };
  resources: { title: string; intro: string; cards: { title: string; body: string; cta?: IlmMarketingLink }[] };
};

export const ilmMarketingDefault: IlmMarketingContent = {
  tagline: "More than a memorial — a living legacy",
  heroTitle: "More than a memorial — a living legacy",
  heroBody:
    "Every life tells a story worth preserving. Create a beautiful space to honour those who have passed — and protect what matters most for the generations that follow.",
  heroLinks: [
    { label: "How it works", href: "/how-it-works" },
    { label: "Find a memorial", href: "/directory" },
  ],
  about: {
    title: "More than a memorial",
    body:
      "inLovingMemory was born from the conviction that every life deserves to be honoured with dignity, remembered with love, and preserved with intention.",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "View pricing", href: "/pricing" },
    ],
  },
  howItWorks: {
    title: "Memory becomes legacy",
    intro: "Create a page in minutes, invite others to contribute, and keep the story accessible with dignity.",
    steps: [
      { title: "Create your memorial", body: "Add basic details, a photo, and a life story. Start simple — expand later." },
      { title: "Personalise and share", body: "Upload photos and invite memories and prayers (moderated by the page keeper)." },
      { title: "Honour the service", body: "Share service details and a digital program that’s easy to access from a QR code." },
      { title: "Preserve the legacy", body: "Unlock private family storage for letters, documents, and keepsakes." },
    ],
    links: [
      { label: "View pricing", href: "/pricing" },
      { label: "Page keeper sign in", href: "/sign-in" },
    ],
  },
  pricing: {
    title: "Simple tiers",
    intro: "Begin with a beautiful memorial. Upgrade when you need more privacy, media, and long-term preservation.",
    tiers: [
      {
        name: "Basic",
        summary: "Free to start",
        bullets: ["Public memorial page", "Guest book & prayer wall (moderated)", "Starter photo gallery"],
      },
      {
        name: "Premium",
        summary: "For families",
        bullets: ["More photos & richer layouts", "Advanced privacy (coming)", "Service program tools (coming)"],
      },
      {
        name: "Generations",
        summary: "Private family vault",
        bullets: ["Private storage for documents & letters", "Family roles & guardians (coming)", "Legacy timeline tools (coming)"],
      },
    ],
  },
  faq: {
    title: "Common questions",
    intro: "Start simple. You can upgrade and expand later without losing anything.",
    items: [
      {
        q: "Who can create and manage a memorial?",
        a: "A page keeper signs in using the same account system as theWalk. The page keeper controls privacy settings, photos, and moderation.",
      },
      {
        q: "Do guest book messages and prayers appear immediately?",
        a: "No. Submissions are held for moderation so the page keeper can approve what appears on the public page.",
      },
      {
        q: "Can I hide a memorial from the directory?",
        a: "Yes. You can keep a memorial public but not listed. The direct link still works for anyone you share it with.",
      },
    ],
  },
  resources: {
    title: "You don’t have to carry grief alone",
    intro: "We’re building guidance, prayers, and practical steps for families in loss — and a path to spiritual care.",
    cards: [
      {
        title: "Grief support",
        body: "Short readings, grounded encouragement, and next steps for the days when everything feels heavy.",
      },
      {
        title: "Prayer & ministry",
        body: "Invite others to pray through a memorial page. Page keepers moderate submissions before they appear.",
        cta: { label: "Find a memorial", href: "/directory" },
      },
    ],
  },
};

