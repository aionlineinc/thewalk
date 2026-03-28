"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** Orange track scale range (0≈empty → 1 full), aligned with scroll progress. */
const LINE_SCALE_MIN = 0.06;
const LINE_SCALE_MAX = 1;

/**
 * Scroll-time budget inside the journey section (sums to 1). Each card animates in alone,
 * then holds while the user scrolls (sticky viewport, motion paused) before the next starts.
 */
const JOURNEY_PHASE = {
  card1Enter: 0.1,
  holdAfter1: 0.16,
  card2Enter: 0.1,
  holdAfter2: 0.16,
  card3Enter: 0.1,
  holdAfterAll: 0.38,
} as const;

/** Vertical travel (px) while fading in: image from above (−), text from below (+). */
const IMAGE_SLIDE_PX = 52;
const TEXT_SLIDE_PX = 52;

type CardT = readonly [number, number, number];

/** Map overall section scroll 0→1 to per-card reveal 0→1 (sequential + holds). */
function sequentialCardTs(raw: number): CardT {
  const { card1Enter, holdAfter1, card2Enter, holdAfter2, card3Enter } = JOURNEY_PHASE;
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
    title: "Cross Over",
    copy: "Enter a place of restoration, support, and profound transformation.",
    href: "/journey/cross-over",
    image:
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=800&auto=format&fit=crop",
    alt: "Dawn light over hills — beginning the journey",
  },
  {
    num: 2,
    title: "Cross Roads",
    copy: "Grow deeply in your identity, absolute truth, and spiritual direction.",
    href: "/journey/cross-roads",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
    alt: "Forest path — growth and discipleship",
  },
  {
    num: 3,
    title: "Cross Connect",
    copy: "Build enduring community, fellowship, and expand into Kingdom impact.",
    href: "/journey/cross-connect",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
    alt: "Community gathered together",
  },
] as const;

/** Rail through badge center: image h-52 (13rem) + mt-11 (2.75rem) + half badge row (h-12/2) */
const RAIL_TOP_CLASSES = "top-[calc(13rem+2.75rem+1.5rem)]";

export function JourneyTransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionExposure, setSectionExposure] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const updateProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const rect = el.getBoundingClientRect();
    // Full layout height only — rect.height can disagree with offsetHeight in some layouts.
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

    const onScroll = () => {
      requestAnimationFrame(updateProgress);
    };

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

  /** When the section is on screen but scroll math is still ~0, avoid opacity:0 on all cards. */
  const timelineRaw =
    reduceMotion || scrollProgress > 0.001
      ? scrollProgress
      : sectionExposure > 0.02
        ? Math.max(scrollProgress, 0.05)
        : scrollProgress;

  const cardTs: CardT = reduceMotion ? [1, 1, 1] : sequentialCardTs(timelineRaw);
  const lineFill01 = reduceMotion
    ? 1
    : (cardTs[0] + cardTs[1] + cardTs[2]) / STEPS.length;
  const lineScale =
    reduceMotion ? 1 : LINE_SCALE_MIN + (LINE_SCALE_MAX - LINE_SCALE_MIN) * lineFill01;

  /** Image fades in while moving down from above; rail and number badges stay untransformed. */
  const imageMotion = (index: number) => {
    if (reduceMotion) return undefined;
    const t = cardTs[index] ?? 0;
    const y = (1 - t) * -IMAGE_SLIDE_PX;
    const opacity = t;
    return {
      transform: `translate3d(0, ${y}px, 0)`,
      opacity,
      willChange: "transform, opacity",
    };
  };

  /** Title + copy fade in while moving up from below. */
  const textMotion = (index: number) => {
    if (reduceMotion) return undefined;
    const t = cardTs[index] ?? 0;
    const y = (1 - t) * TEXT_SLIDE_PX;
    const opacity = t;
    return {
      transform: `translate3d(0, ${y}px, 0)`,
      opacity,
      willChange: "transform, opacity",
    };
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[380vh] bg-white border-b border-neutral-100"
      aria-labelledby="journey-transformation-heading"
    >
      <div className="sticky top-0 flex min-h-screen flex-col justify-start pt-10 pb-16 md:justify-center md:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <header className="mx-auto mb-12 max-w-3xl text-center md:mb-20 lg:mb-24">
            <h2
              id="journey-transformation-heading"
              className="text-3xl font-medium tracking-tight text-neutral-950 md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              A Journey of Transformation
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] font-light leading-relaxed text-neutral-500 md:text-lg md:leading-relaxed">
              theWalk is structured as a clear spiritual journey designed to support believers through
              different stages of growth, healing, identity, and community.
            </p>
          </header>

          {/* md+: three-column grid — horizontal snap strip was easy to clip on tablets */}
          <div className="relative isolate hidden md:block">
            <div
              className={`pointer-events-none absolute left-0 right-0 z-0 h-[2px] -translate-y-1/2 rounded-full bg-neutral-200/90 ${RAIL_TOP_CLASSES}`}
              aria-hidden
            />
            <div
              className={`pointer-events-none absolute left-0 right-0 z-[1] h-[2px] -translate-y-1/2 overflow-hidden rounded-full ${RAIL_TOP_CLASSES}`}
              aria-hidden
            >
              <div
                className="h-full w-full origin-left rounded-full bg-red-soft will-change-transform"
                style={{
                  transform: `translate3d(0, 0, 0) scale3d(${lineScale}, 1, 1)`,
                }}
              />
            </div>

            <div className="relative z-10 pb-4 md:pb-0">
              <div className="grid grid-cols-3 gap-4 py-6 md:gap-6 md:py-6 lg:gap-x-10 lg:py-0">
              {STEPS.map((step, index) => (
                <Link
                  key={step.href}
                  href={step.href}
                  className="group relative flex min-w-0 flex-col text-left outline-none transition-shadow focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2"
                >
                  <div className="min-w-0" style={imageMotion(index)}>
                    <div className="relative h-52 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/[0.06]">
                      <Image
                        src={step.image}
                        alt={step.alt}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        sizes="(min-width: 1024px) 340px, (min-width: 768px) 28vw, 100vw"
                      />
                    </div>
                  </div>

                  <div className="relative mt-11 flex h-12 items-center justify-center">
                    <div
                      className="absolute left-1/2 top-1/2 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-red-soft font-mono text-sm font-semibold text-white shadow-md ring-[3px] ring-white"
                      aria-hidden
                    >
                      {step.num}
                    </div>
                  </div>

                  <div className="min-w-0 pt-2" style={textMotion(index)}>
                    <h3 className="text-lg font-medium tracking-tight text-neutral-950 transition-colors group-hover:text-red-900 lg:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] font-light leading-relaxed text-neutral-500 lg:text-base">
                      {step.copy}
                    </p>
                  </div>
                </Link>
              ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-14 md:hidden">
            {STEPS.map((step, index) => (
              <Link
                key={step.href}
                href={step.href}
                className="flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2"
              >
                <div className="mb-4 min-w-0" style={imageMotion(index)}>
                  <div className="relative h-44 overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      priority
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-soft font-mono text-sm font-semibold text-white shadow-md ring-[3px] ring-white"
                    aria-hidden
                  >
                    {step.num}
                  </div>
                  <div className="h-0.5 flex-1 rounded-full bg-neutral-200">
                    <div
                      className="h-full origin-left rounded-full bg-red-soft"
                      style={{
                        transform: `scaleX(${lineScale})`,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-4 min-w-0 text-left" style={textMotion(index)}>
                  <h3 className="text-lg font-medium text-neutral-950">{step.title}</h3>
                  <p className="mt-2 text-[15px] font-light leading-relaxed text-neutral-500">
                    {step.copy}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="pointer-events-none min-h-[140vh] w-full shrink-0" aria-hidden />
    </section>
  );
}
