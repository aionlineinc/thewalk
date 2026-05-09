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
  tagline: "More than a memorial — a living legacy.",

  heroTitle: "When their walk ends, their story lives on",

  heroBody:
    "From the moment of loss through every season of grief — inLovingMemory gives families a beautiful place to honor the service, gather memories, and find care and community along the way. Because grief was never meant to be faced alone.",

  heroLinks: [
    { label: "How it works", href: "/how-it-works" },
    { label: "Find a memorial", href: "/directory" },
  ],

  about: {
    title: "More than a memorial platform",
    body:
      "inLovingMemory was born out of theWalk Ministries' conviction that every life deserves to be honoured with dignity, remembered with love, and preserved with intention. We are a community of remembrance, grief support, and generational legacy. Powered by theWalk Ministries Int'l, we connect the bereaved to pastoral care, grief counselling, prayer, and community — because grief was never meant to be faced alone. This is where the end of one walk becomes the foundation of another.",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "View pricing", href: "/pricing" },
    ],
  },

  howItWorks: {
    title: "From the service to forever — and with you every step",
    intro:
      "Set up a memorial before the service. Share it on the day. Then let it grow into something lasting — while we walk alongside you through every season of grief.",
    steps: [
      {
        title: "Create your page",
        body: "Add a name, photo, life story, and service details in minutes. Free to start — ready to share before the day.",
      },
      {
        title: "Share at the service",
        body: "A digital program accessible via QR code. Family near and far can follow along, leave tributes, and feel present.",
      },
      {
        title: "Gather their memories",
        body: "Family and friends contribute photos, stories, and prayers — all held for your review before they appear.",
      },
      {
        title: "Preserve the legacy",
        body: "After the service, the story lives on. Unlock a private family vault for letters, documents, and keepsakes passed to the next generation.",
      },
      {
        title: "Connect to support",
        body: "Request grief counselling, join a prayer group, or connect with a pastoral care minister from theWalk — all from within your memorial.",
      },
    ],
    links: [
      { label: "View pricing", href: "/pricing" },
      { label: "Page keeper sign in", href: "/sign-in" },
    ],
  },

  pricing: {
    title: "Free to start. Built to last.",
    intro:
      "Create a memorial at no cost — ready for the service. Upgrade when your family needs more: richer media, grief counselling, and a private legacy vault.",
    tiers: [
      {
        name: "Basic",
        summary: "Free — for the service and beyond",
        bullets: [
          "Public or unlisted memorial page",
          "Service details & digital program",
          "Prayer wall on every page",
          "Guestbook & tributes (moderated)",
          "Starter photo gallery",
        ],
      },
      {
        name: "Premium",
        summary: "Full care for families",
        bullets: [
          "Unlimited photos, video & audio",
          "Digital funeral pamphlet & QR code",
          "AI obituary assistant",
          "Grief counselling sessions included",
          "Grief resource library",
          "Multiple page keepers",
        ],
      },
      {
        name: "Generations",
        summary: "A private family vault",
        bullets: [
          "Secure storage for documents & letters",
          "Time-locked messages to loved ones",
          "Private family tree (GEDCOM import)",
          "Faith & legacy narrative",
          "Guardian designation for the future",
        ],
      },
    ],
  },

  faq: {
    title: "Common questions",
    intro: "Start simply. You can expand, upgrade, and deepen at any pace — nothing is ever lost.",
    items: [
      {
        q: "Can I use this for the funeral service itself?",
        a: "Yes — that's exactly what it's built for. Add service details, order of service, and a digital program before the day. Share a QR code so attendees can access everything from their phones.",
      },
      {
        q: "Is it only for people who have passed?",
        a: "No. You can also create a Living Legacy page — for someone still living who wants to begin capturing their story and sharing it with family now.",
      },
      {
        q: "Is grief counselling available?",
        a: "Yes. Premium members can request grief counselling sessions matched by specialisation, timezone, and language. Basic counselling is included at no extra cost — extended or specialist sessions may be offered by the counsellor.",
      },
      {
        q: "What is the prayer wall?",
        a: "Every memorial — free or paid — includes a prayer wall. Visitors submit a prayer with their name and it appears publicly after the page keeper approves it. Families receive a weekly summary of how many people have prayed for them.",
      },
      {
        q: "Who manages the memorial page?",
        a: "A page keeper signs in using their theWalk account. They control privacy, approve all contributions, and can invite co-keepers to help. Premium members can assign multiple page keepers.",
      },
      {
        q: "Can I keep it private?",
        a: "Yes. You can hide the page from the public directory, share it only via a private link, or add a password so only family can access it. Premium adds full granular privacy by section.",
      },
    ],
  },

  resources: {
    title: "You don't have to carry this alone",
    intro:
      "From planning the service to navigating grief long after — care, prayer, and practical guidance for families at every stage of loss.",
    cards: [
      {
        title: "Planning the service",
        body: "A practical checklist for page keepers: setting up service details, generating a digital program, sharing with attendees, and managing the day.",
      },
      {
        title: "Grief counselling",
        body: "Request a session with a verified grief counsellor — matched to your type of loss, language, and availability. Included with Premium.",
        cta: { label: "Learn more", href: "/pricing" },
      },
      {
        title: "Prayer & pastoral care",
        body: "Every memorial includes a prayer wall. Our ministry team at theWalk can be assigned to walk alongside your family through the season of loss.",
        cta: { label: "Find a memorial", href: "/directory" },
      },
    ],
  },
};
