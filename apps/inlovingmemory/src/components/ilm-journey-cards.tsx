"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const LINE_SCALE_MIN = 0.06;
const LINE_SCALE_MAX = 1;

const PHASE = {
  card1Enter: 0.1,
  holdAfter1: 0.16,
  card2Enter: 0.1,
  holdAfter2: 0.16,
  card3Enter: 0.1,
  holdAfterAll: 0.38,
} as const;

const IMAGE_SLIDE_PX = 52;
const TEXT_SLIDE_PX = 52;

type CardT = readonly [number, number, number];

function sequentialCardTs(raw: number): CardT {
  const { card1Enter, holdAfter1, card2Enter, holdAfter2, card3Enter } = PHASE;
  const p = Math.min(1, Math.max(0, raw));
  const b0 = 0;
  const b1 = b0 + card1Enter;
  const b2 = b1 + holdAfter1;
  const b3 = b2 + card2Enter;
  const b4 = b3 + holdAfter2;
  const b5 = b4 + card3Enter;

  const span = (from: number, to: number) => Math.max(to - from, 1e-6);
  const lerp = (u: number) => Math.min(1, Math.max(0, u));

  if (p < b1) return [lerp((p - b0) / span(b0, b1)), 0, 0];
  if (p < b2) return [1, 0, 0];
  if (p < b3) return [1, lerp((p - b2) / span(b2, b3)), 0];
  if (p < b4) return [1, 1, 0];
  if (p < b5) return [1, 1, lerp((p - b4) / span(b4, b5))];
  return [1, 1, 1];
}

const STEPS = [
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
] as const;

const RAIL_TOP_CLASSES = "top-[18.75rem]";

export type IlmJourneyStep = {
  num: number;
  title: string;
  copy: string;
  href: string;
  image: string;
  alt: string;
};

type IlmJourneyCardsProps = {
  heading?: string;
  intro?: string;
  steps?: IlmJourneyStep[];
};

export function IlmJourneyCards({
  heading = "Create a Beautiful Online Memorial",
  intro = "Remember with clarity, gather with community, and preserve a legacy worth carrying forward.",
  steps,
}: IlmJourneyCardsProps) {
  const journeySteps = (steps?.length ? steps : STEPS).slice(0, 3).map((step, index) => ({
    ...step,
    num: step.num || index + 1,
  }));
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionExposure, setSectionExposure] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const updateProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const rect = el.getBoundingClientRect();
    const h = Math.max(el.offsetHeight, 1);
    const range = vh + h;
    let raw = (vh - rect.top) / range;
    raw = Math.min(1, Math.max(0, raw));
    setScrollProgress(raw);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onMq = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onMq);

    const onScroll = () => requestAnimationFrame(updateProgress);
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress);
    const vv = window.visualViewport;
    vv?.addEventListener("scroll", onScroll, { passive: true });
    vv?.addEventListener("resize", updateProgress);
    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
      vv?.removeEventListener("scroll", onScroll);
      vv?.removeEventListener("resize", updateProgress);
    };
  }, [updateProgress]);

  useLayoutEffect(() => {
    updateProgress();
  }, [updateProgress]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        setSectionExposure(e?.intersectionRatio ?? 0);
        updateProgress();
      },
      { threshold: thresholds },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [updateProgress]);

  const timelineRaw =
    reduceMotion || scrollProgress > 0.001 ? scrollProgress : sectionExposure > 0.02 ? Math.max(scrollProgress, 0.05) : scrollProgress;

  const cardTs: CardT = reduceMotion ? [1, 1, 1] : sequentialCardTs(timelineRaw);
  const lineFill01 = reduceMotion ? 1 : (cardTs[0] + cardTs[1] + cardTs[2]) / journeySteps.length;
  const lineScale = reduceMotion ? 1 : LINE_SCALE_MIN + (LINE_SCALE_MAX - LINE_SCALE_MIN) * lineFill01;

  const imageMotion = (index: number) => {
    if (reduceMotion) return undefined;
    const t = cardTs[index] ?? 0;
    const y = (1 - t) * -IMAGE_SLIDE_PX;
    return { transform: `translate3d(0, ${y}px, 0)`, opacity: t, willChange: "transform, opacity" } as const;
  };

  const textMotion = (index: number) => {
    if (reduceMotion) return undefined;
    const t = cardTs[index] ?? 0;
    const y = (1 - t) * TEXT_SLIDE_PX;
    return { transform: `translate3d(0, ${y}px, 0)`, opacity: t, willChange: "transform, opacity" } as const;
  };

  return (
    <section
      id="ilm-journey-cards"
      ref={sectionRef}
      className="relative w-full min-h-[320vh] bg-white border-b border-neutral-100"
      aria-labelledby="ilm-journey-heading"
    >
      <div className="sticky top-0 flex min-h-screen flex-col justify-start pt-6 pb-16 md:justify-center md:py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <header className="mx-auto mb-12 max-w-3xl text-center md:mb-20">
            <h2
              id="ilm-journey-heading"
              className="text-3xl font-medium tracking-tight text-neutral-950 md:text-4xl lg:text-[35px] lg:leading-[1.1]"
            >
              {heading}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-neutral-500 md:text-lg md:leading-relaxed">
              {intro}
            </p>
          </header>

          <div className="relative isolate hidden md:block">
            <div
              className={`pointer-events-none absolute left-0 right-0 z-0 h-[2px] -translate-y-1/2 rounded-full bg-neutral-200/90 ${RAIL_TOP_CLASSES}`}
              aria-hidden
            />
            <div
              className={`pointer-events-none absolute left-0 right-0 z-[1] h-[2px] -translate-y-1/2 overflow-hidden rounded-full ${RAIL_TOP_CLASSES}`}
              aria-hidden
            >
              <div className="h-full w-full origin-left rounded-full bg-calm-500 will-change-transform" style={{ transform: `translate3d(0,0,0) scale3d(${lineScale},1,1)` }} />
            </div>

            <div className="relative z-10 pb-4 md:pb-0">
              <div className="grid grid-cols-3 gap-4 py-6 md:gap-6 lg:gap-x-10">
                {journeySteps.map((step, index) => (
                  <Link
                    key={step.href}
                    href={step.href}
                    data-button-link
                    className="group relative flex min-w-0 flex-col text-left outline-none transition-shadow focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-calm-600 focus-visible:ring-offset-2"
                  >
                    <div className="min-w-0" style={imageMotion(index)}>
                      <div className="relative h-52 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/[0.06]">
                        <img
                          src={step.image}
                          alt={step.alt}
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                          loading={index === 0 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </div>
                    </div>

                    <div className="relative mt-11 flex h-12 items-center justify-center">
                      <div className="absolute left-1/2 top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-calm-500 font-mono text-sm font-semibold text-white shadow-md ring-[3px] ring-white" aria-hidden>
                        {step.num}
                      </div>
                    </div>

                    <div className="min-w-0 pt-2" style={textMotion(index)}>
                      <h3 className="text-lg font-medium tracking-tight text-neutral-950 transition-colors group-hover:text-calm-700 lg:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[15px] font-light leading-relaxed text-neutral-500 lg:text-base">{step.copy}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-14 md:hidden">
            {journeySteps.map((step, index) => (
              <Link
                key={step.href}
                href={step.href}
                data-button-link
                className="flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-calm-600 focus-visible:ring-offset-2"
              >
                <div className="mb-4 min-w-0" style={imageMotion(index)}>
                  <div className="relative h-44 overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="h-full w-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-calm-500 font-mono text-sm font-semibold text-white shadow-md ring-[3px] ring-white" aria-hidden>
                    {step.num}
                  </div>
                  <div className="h-0.5 flex-1 rounded-full bg-neutral-200">
                    <div className="h-full origin-left rounded-full bg-calm-500" style={{ transform: `scaleX(${lineScale})` }} />
                  </div>
                </div>
                <div className="mt-4 min-w-0 text-left" style={textMotion(index)}>
                  <h3 className="text-lg font-medium text-neutral-950">{step.title}</h3>
                  <p className="mt-2 text-[15px] font-light leading-relaxed text-neutral-500">{step.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none min-h-[120vh] w-full shrink-0" aria-hidden />
    </section>
  );
}

