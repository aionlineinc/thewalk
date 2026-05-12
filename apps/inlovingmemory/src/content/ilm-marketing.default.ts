export type IlmMarketingLink = { label: string; href: string };
export type IlmMarketingJourneyStep = {
  num: number;
  title: string;
  copy: string;
  href: string;
  image: string;
  alt: string;
};

export type IlmMarketingContent = {
  tagline: string;
  heroTitle: string;
  heroBody: string;
  heroLinks: IlmMarketingLink[];
  home: {
    heroBackgroundImageUrl: string;
    primaryCta: IlmMarketingLink;
    secondaryCta: IlmMarketingLink;
    signedInHint: string;
    signedOutHint: string;
    assistance: {
      eyebrow: string;
      title: string;
      body: string;
      primaryCta: IlmMarketingLink;
      secondaryCta: IlmMarketingLink;
      backgroundImageUrl: string;
      sideImageUrl: string;
      sideImageAlt: string;
    };
    organisations: {
      eyebrow: string;
      title: string;
      body: string;
      primaryCta: IlmMarketingLink;
      secondaryCta: IlmMarketingLink;
      cardTitle: string;
      cardBody: string;
      cardBullets: string[];
    };
  };
  journey: {
    title: string;
    intro: string;
    steps: IlmMarketingJourneyStep[];
  };
  signIn: {
    panelImageUrl: string;
    quote: string;
  };
  about: {
    title: string;
    body: string;
    links: IlmMarketingLink[];
    heroImage?: string;
    story?: { heading: string; body: string };
    belief?: { heading: string; body: string; verse: string; verseRef: string };
    offering?: { heading: string; body: string };
    connection?: { heading: string; body: string; cta: IlmMarketingLink };
    closing?: { heading: string; primaryCta: IlmMarketingLink; secondaryCta: IlmMarketingLink };
  };
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

  home: {
    heroBackgroundImageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=85",
    primaryCta: { label: "Get Started", href: "/how-it-works" },
    secondaryCta: { label: "Find a memorial", href: "/directory" },
    signedInHint: "Welcome back — manage your memorials in the dashboard.",
    signedOutHint: "Page moderators can sign in to manage memorials.",
    assistance: {
      eyebrow: "You are not alone",
      title: "Grief support, prayer, and pastoral care — in one place",
      body: "inLovingMemory connects families to grief counselling, the prayer of a community, and the pastoral care of theWalk Ministries — from the day of the service through every season that follows.",
      primaryCta: { label: "Find support", href: "/resources" },
      secondaryCta: { label: "How it works", href: "/how-it-works" },
      backgroundImageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=1600&q=80",
      sideImageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=900&q=80",
      sideImageAlt: "Family together sharing memories.",
    },
    organisations: {
      eyebrow: "For organisations",
      title: "Funeral homes & ministries",
      body: "Purpose-built tools for organisations that serve families — from digital service programs and QR code access on the day, to long-term memorial hosting for the years ahead.",
      primaryCta: { label: "Learn more", href: "/resources" },
      secondaryCta: { label: "View memorials", href: "/directory" },
      cardTitle: "What you can do today",
      cardBody: "Begin with the service essentials — then grow into a full, lasting memorial.",
      cardBullets: [
        "Service details, order of service & digital program",
        "Public or unlisted memorial pages",
        "Guestbook & prayer wall with moderator review",
        "Shareable QR code for service attendees",
      ],
    },
  },

  journey: {
    title: "Create a Beautiful Online Memorial",
    intro: "Remember with clarity, gather with community, and preserve a legacy worth carrying forward.",
    steps: [
      {
        num: 1,
        title: "Honor the service",
        copy: "A tribute page ready before the day — service details, digital program, and a QR code for every attendee.",
        href: "/how-it-works",
        image: "https://images.unsplash.com/photo-1474649107449-ea4f014b7e9f?w=800&q=80",
        alt: "Warm candlelight — service",
      },
      {
        num: 2,
        title: "Gather together",
        copy: "Loved ones near and far contribute memories, photos, and prayers — gently moderated by the page moderator.",
        href: "/directory",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
        alt: "Family together — gathering",
      },
      {
        num: 3,
        title: "Walk through grief",
        copy: "Access grief counselling, a community prayer wall, and pastoral care from theWalk — you were never meant to carry this alone.",
        href: "/resources",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
        alt: "Open landscape — walking together",
      },
    ],
  },

  signIn: {
    panelImageUrl: "https://images.unsplash.com/photo-1474649107449-ea4f014b7e9f?w=1200&q=85",
    quote: "A living place for a life well-lived.",
  },

  about: {
    title: "Every life deserves to be remembered. Every family deserves to be supported.",
    body: "inLovingMemory was born from a simple conviction: that the end of a walk is not the end of a story.",
    heroImage: "https://images.unsplash.com/photo-1475776408506-9a5371e7a068?w=1920&q=85",
    links: [],
    story: {
      heading: "Where we come from.",
      body: "inLovingMemory was born out of theWalk Ministries' conviction that every life lived in faith — and every life lived at all — deserves to be honoured with dignity, remembered with love, and preserved with intention.\n\nWe watched families struggle to find a single, beautiful, lasting place for their grief and their gratitude. We watched funeral homes serve families under pressure with limited digital tools. We watched ministers and counsellors reach for something more connected, more whole.\n\nSo we built it.\n\ninLovingMemory is not a product that happened to find a market. It is a ministry that became a platform — shaped by pastoral care, built for human dignity, and grounded in the belief that how we remember those we love says everything about who we are.",
    },
    belief: {
      heading: "We believe every walk matters.",
      body: "We are shaped by theWalk Ministries' understanding of life as a journey — a walk — with purpose, with community, and with a destination that exceeds this world. Death, in this frame, is not the end of a story. It is the close of one chapter and the opening of another.\n\nEvery memorial on this platform is therefore not simply a record of loss. It is the honouring of a walk well taken. A testimony. A gift to those who follow.",
      verse: "Precious in the sight of the Lord is the death of his faithful servants.",
      verseRef: "Psalm 116:15",
    },
    offering: {
      heading: "More than a memorial. A living legacy.",
      body: "We are more than a memorial platform. We are remembrance, grief support, and generational legacy.\n\nWhen you create a memorial here, you are not simply marking an end — you are protecting a beginning. A legacy that speaks to children not yet born, to family members not yet found, and to a community that carries someone's story forward.\n\nWe connect the bereaved to pastoral care, grief counselling, prayer, and community — because grief was never meant to be faced alone.\n\nThis is where the end of one walk becomes the foundation of another.",
    },
    connection: {
      heading: "Rooted in theWalk Ministries.",
      body: "inLovingMemory is a ministry of theWalk Ministries Int'l — a global community committed to discipleship, care, and the transformation of lives. Through theWalk, every memorial on this platform is connected to a network of ministers, counsellors, and prayer teams ready to walk with grieving families.\n\nWhen you use inLovingMemory, you are not just accessing a website. You are stepping into a community.",
      cta: { label: "Learn about theWalk Ministries", href: "https://thewalk.org" },
    },
    closing: {
      heading: "Their story starts here.",
      primaryCta: { label: "Create a Free Memorial", href: "/dashboard/memorials/new" },
      secondaryCta: { label: "Contact Us", href: "/resources" },
    },
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
      { label: "Page moderator sign in", href: "/sign-in" },
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
          "Multiple page moderators",
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
        a: "Every memorial — free or paid — includes a prayer wall. Visitors submit a prayer with their name and it appears publicly after the page moderator approves it. Families receive a weekly summary of how many people have prayed for them.",
      },
      {
        q: "Who manages the memorial page?",
        a: "A page moderator signs in using their theWalk account. They control privacy, approve all contributions, and can invite co-keepers to help. Premium members can assign multiple page moderators.",
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
        body: "A practical checklist for page moderators: setting up service details, generating a digital program, sharing with attendees, and managing the day.",
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
