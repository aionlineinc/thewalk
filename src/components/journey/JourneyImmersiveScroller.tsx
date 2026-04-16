"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./JourneyImmersiveScroller.module.css";

type Slide = {
  key: string;
  label: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
  bg: string;
  ministries?: readonly string[];
};

const TOTAL = 4;

const DEFAULT_SLIDES: readonly Slide[] = [
  {
    key: "journey-intro",
    label: "Intro",
    title: "The Journey",
    body:
      "Four movements. One walk. Explore the ministries built for restoration, growth, and Kingdom impact—then step into the next right thing.",
    href: "/get-involved",
    cta: "Get involved",
    bg: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "cross-over",
    label: "Cross Over",
    title: "Cross Over",
    body: "Restoration, support, and transformation as you begin.",
    href: "/journey/cross-over",
    cta: "Explore Cross Over",
    ministries: ["Rugged", "Covered", "Exodus"],
    bg: "https://images.unsplash.com/photo-1523437237164-d442d57cc3c9?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "cross-roads",
    label: "Cross Roads",
    title: "Cross Roads",
    body: "Identity, truth, and spiritual direction in discipleship.",
    href: "/journey/cross-roads",
    cta: "Explore Cross Roads",
    ministries: ["Bible Study", "Series", "MyWalk"],
    bg: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2400&auto=format&fit=crop",
  },
  {
    key: "cross-connect",
    label: "Cross Connect",
    title: "Cross Connect",
    body: "Community, fellowship, and expanding Kingdom impact.",
    href: "/journey/cross-connect",
    cta: "Explore Cross Connect",
    ministries: ["Small Groups", "Prayer", "Ministry Development"],
    bg: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2400&auto=format&fit=crop",
  },
] as const;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function JourneyImmersiveScroller({ slides = DEFAULT_SLIDES }: { slides?: readonly Slide[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);

  const safeSlides = useMemo(() => slides.slice(0, TOTAL), [slides]);

  const syncFromScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const vh = window.visualViewport?.height ?? window.innerHeight;
    const rect = el.getBoundingClientRect();
    const sectionHeight = Math.max(el.offsetHeight, 1);
    const scrollableDistance = Math.max(sectionHeight - vh, 1);

    // 0 at the start of the section, 1 at the end.
    const progress = clamp01(-rect.top / scrollableDistance);
    let idx = Math.floor(progress * TOTAL);
    if (idx >= TOTAL) idx = TOTAL - 1;
    idx = Math.max(0, idx);

    setCurrentIndex((prev) => {
      if (prev === idx) return prev;
      setPrevIndex(prev);
      return idx;
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduceMotion(mq.matches);
    setReduceMotion(mq.matches);
    mq.addEventListener("change", onMq);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        syncFromScroll();
        ticking = false;
      });
    };

    syncFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const vv = window.visualViewport;
    vv?.addEventListener("scroll", onScroll, { passive: true });
    vv?.addEventListener("resize", onScroll);

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      vv?.removeEventListener("scroll", onScroll);
      vv?.removeEventListener("resize", onScroll);
    };
  }, [syncFromScroll]);

  const goTo = useCallback(
    (target: number) => {
      const el = sectionRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(TOTAL - 1, target));
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const sectionTop = el.getBoundingClientRect().top + window.pageYOffset;
      const scrollableDistance = Math.max(el.offsetHeight - vh, 0);

      const sliceCenter = (clamped + 0.5) / TOTAL;
      const targetY = sectionTop + scrollableDistance * sliceCenter;

      setPrevIndex(currentIndex);
      setCurrentIndex(clamped);

      window.scrollTo({ top: targetY, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [currentIndex, reduceMotion],
  );

  const reverse = prevIndex !== null && currentIndex < prevIndex;

  return (
    <section
      id="journey-immersive"
      ref={sectionRef}
      className={`${styles.scroller} relative w-full min-h-[400vh] rounded-none border-b border-neutral-100 bg-white`}
      aria-label="Journey overview"
    >
      <div className={`sticky top-0 min-h-screen rounded-none p-4 ${reverse ? styles.reverse : ""}`}>
        {/* Background stack */}
        <div className="absolute inset-4 overflow-hidden rounded-[20px]">
          {safeSlides.map((s, i) => {
            const isActive = i === currentIndex;
            const isPrev = prevIndex !== null && i === prevIndex;
            const className = [
              styles.bg,
              isActive ? styles.bgActive : "",
              isPrev ? styles.bgPrev : "",
            ]
              .filter(Boolean)
              .join(" ");
            return (
              <div key={s.key} className={className} aria-hidden>
                <Image src={s.bg} alt="" fill priority={i === 0} className="object-cover" sizes="100vw" />
                <div className="absolute inset-0 bg-neutral-950/55" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_25%_25%,rgba(255,255,255,0.10),transparent_55%)]" />
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-[calc(100vh-2rem)] pt-[116px] pb-16 md:pt-[132px] md:pb-20">
          <div className="flex min-h-[calc(100vh-2rem-116px-4rem)] items-center md:min-h-[calc(100vh-2rem-132px-5rem)]">
            <div className="container mx-auto w-full max-w-6xl px-4 md:px-8">
              <div className="relative grid grid-cols-1 items-center gap-10 md:gap-14">
                <div className="min-w-0">
                  <div className="relative min-h-[420px] md:min-h-[520px]">
                    {safeSlides.map((s, i) => {
                      const isActive = i === currentIndex;
                      const className = [styles.content, isActive ? styles.contentActive : ""]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <div key={s.key} className={className}>
                        <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
                          {i === 0 ? "Journey overview" : `Pathway ${String(i).padStart(2, "0")}`}
                        </p>
                        <h1 className="max-w-2xl font-sans text-4xl font-normal leading-[1.06] tracking-tight text-white md:text-[54px] md:leading-[1.02]">
                          {s.title}
                        </h1>
                        <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-white/80 md:text-lg">
                          {s.body}
                        </p>

                      {s.ministries?.length ? (
                        <div className="mt-8 grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                          {s.ministries.map((m) => (
                            <Link
                              key={m}
                              href={`${s.href ?? "/journey"}#ministries`}
                              className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                            >
                              {m}
                            </Link>
                          ))}
                        </div>
                      ) : null}

                      <div
                        className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
                      >
                        {s.href ? (
                          <Link
                            href={s.href}
                            data-button-link
                            className="inline-flex w-fit items-center justify-center rounded-full bg-red-soft px-6 py-3 text-sm font-medium text-white shadow-lg shadow-black/30 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          >
                            {s.cta ?? "Explore"}
                          </Link>
                        ) : null}
                        {i !== 0 ? (
                          <Link
                            href="/journey"
                            className="text-sm font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                          >
                            View all pathways
                          </Link>
                        ) : (
                          <Link
                            href="/journey/cross-over"
                            className="text-sm font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                          >
                            Start with Cross Over →
                          </Link>
                        )}
                      </div>
                        </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right-side nav */}
                <nav
                  aria-label="Journey sections"
                  className="hidden md:flex flex-col gap-3 absolute right-0 top-1/2 -translate-y-1/2"
                >
                  {safeSlides.map((s, i) => {
                    const isActive = i === currentIndex;
                    const itemClass = [
                      styles.navItem,
                      "group flex items-center justify-end gap-3 rounded-full px-3 py-2 text-left transition-colors",
                      isActive ? styles.navItemActive : "",
                    ]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => goTo(i)}
                        className={itemClass}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <span className="text-xs font-semibold text-white/70 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`${styles.navLabel} text-sm font-medium text-white/90`}>{s.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* extra space at the end so last animation can settle */}
      <div className="pointer-events-none min-h-[110vh] w-full" aria-hidden />
    </section>
  );
}
