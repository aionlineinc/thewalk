"use client";

import { JourneyImmersiveScroller, type Slide } from "@/components/journey/JourneyImmersiveScroller";

const SLIDES: readonly Slide[] = [
  {
    key: "growth-overview",
    label: "Overview",
    eyebrow: "Cross Roads",
    title: "Growth",
    body: "Deepen identity, truth, and direction — content and courses designed for real life in Christ.",
    href: "/growth/articles",
    cta: "Start reading",
    bg: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "growth-articles",
    label: "Articles",
    eyebrow: "Teachings",
    title: "Articles",
    body: "Teaching, studies, and series — filter by topic and move at your pace.",
    href: "/growth/articles",
    cta: "Browse articles",
    ministries: ["Studies", "Series", "Guides"],
    bg: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "growth-courses",
    label: "Courses",
    eyebrow: "Formation",
    title: "Courses",
    body: "Structured learning with a clear next step — take what you learn into daily practice.",
    href: "/growth/courses",
    cta: "Explore courses",
    ministries: ["Cohorts", "Practice", "Accountability"],
    bg: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "growth-services",
    label: "Services",
    eyebrow: "Support",
    title: "Services",
    body: "Pastoral care, equipping, and practical support for people, teams, ministries, and charities.",
    href: "/growth/services",
    cta: "View services",
    ministries: ["Care", "Training", "Consulting"],
    bg: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop",
  },
] as const;

export function GrowthImmersiveScroller() {
  return <JourneyImmersiveScroller slides={SLIDES} />;
}

