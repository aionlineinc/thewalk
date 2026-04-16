import type { CSSProperties } from "react";

/** Calling statements — scattered % positions below hero (like HERO_FACE_CIRCLES); float animation + delay */
export const GET_INVOLVED_STATEMENTS: {
  text: string;
  anim: string;
  delay: string;
  style: CSSProperties;
  align: "left" | "center" | "right";
}[] = [
  {
    text: "I knew I was meant for more.",
    anim: "animate-float-a",
    delay: "delay-0",
    style: { left: "6%", top: "5%" },
    align: "left",
  },
  {
    text: "I wanted to grow—but didn’t know where to start.",
    anim: "animate-float-b",
    delay: "delay-150",
    style: { left: "58%", top: "7%", transform: "translateX(-12%)" },
    align: "right",
  },
  {
    text: "I felt called to serve.",
    anim: "animate-float-c",
    delay: "delay-300",
    style: { left: "42%", top: "22%", transform: "translateX(-50%)" },
    align: "center",
  },
  {
    text: "I didn’t want to just attend anymore.",
    anim: "animate-float-a",
    delay: "delay-75",
    style: { left: "11%", top: "34%" },
    align: "left",
  },
  {
    text: "There had to be something deeper.",
    anim: "animate-float-b",
    delay: "delay-200",
    style: { right: "7%", top: "38%" },
    align: "right",
  },
  {
    text: "I wanted my faith to be active.",
    anim: "animate-float-c",
    delay: "delay-100",
    style: { left: "50%", top: "52%", transform: "translate(-50%, -50%)" },
    align: "center",
  },
  {
    text: "I knew I wasn’t meant to walk alone.",
    anim: "animate-float-b",
    delay: "delay-250",
    style: { left: "18%", top: "66%" },
    align: "left",
  },
  {
    text: "I wanted to be part of something real.",
    anim: "animate-float-a",
    delay: "delay-75",
    style: { left: "64%", top: "72%", transform: "translateX(-8%)" },
    align: "right",
  },
];

/** Small circular avatars — % positions + optional transform; sit below headline (see hero z-index). */
export const HERO_FACE_CIRCLES: {
  src: string;
  alt: string;
  style: CSSProperties;
  sizePx: number;
  /** Slightly softer when orb sits under copy for legibility */
  className?: string;
}[] = [
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "7%", top: "9%", transform: "rotate(-11deg)" },
    sizePx: 52,
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "41%", top: "11%", transform: "translateX(-50%) rotate(6deg)" },
    sizePx: 44,
    className: "opacity-[0.72]",
  },
  {
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "58%", top: "16%", transform: "translate(-50%, -15%) rotate(-5deg)" },
    sizePx: 40,
    className: "opacity-[0.68]",
  },
  {
    src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { right: "6%", top: "13%", transform: "rotate(9deg)" },
    sizePx: 58,
  },
  {
    src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "14%", top: "36%", transform: "rotate(-4deg)" },
    sizePx: 48,
  },
  {
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "50%", top: "38%", transform: "translate(-50%, -50%) rotate(7deg)" },
    sizePx: 46,
    className: "opacity-[0.65]",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "82%", top: "41%", transform: "rotate(-9deg)" },
    sizePx: 54,
  },
  {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "33%", top: "58%", transform: "translate(-40%, -50%) rotate(-12deg)" },
    sizePx: 50,
    className: "opacity-[0.7]",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "67%", top: "52%", transform: "translate(-20%, -30%) rotate(5deg)" },
    sizePx: 42,
    className: "opacity-[0.68]",
  },
  {
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "5%", bottom: "21%", transform: "rotate(8deg)" },
    sizePx: 56,
  },
  {
    src: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { right: "8%", bottom: "19%", transform: "rotate(-6deg)" },
    sizePx: 50,
  },
  {
    src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&q=80",
    alt: "",
    style: { left: "48%", bottom: "14%", transform: "translateX(-50%) rotate(4deg)" },
    sizePx: 44,
    className: "opacity-[0.72]",
  },
];

export const COMMUNITY_STORY_CARDS = [
  {
    quote: "I stopped just listening—and started living it.",
    body: "I found a place where I could grow and actually serve. It changed everything.",
  },
  {
    quote: "Serving gave my faith direction.",
    body: "What I believed finally had expression through action.",
  },
  {
    quote: "I found people walking the same journey.",
    body: "It’s not just teaching—it’s community.",
  },
  {
    quote: "Giving connected me to something bigger.",
    body: "I could see the impact of what I was part of.",
  },
] as const;
