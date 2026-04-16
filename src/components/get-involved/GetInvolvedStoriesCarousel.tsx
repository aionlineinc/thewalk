"use client";

import { useCallback, useEffect, useState } from "react";
import { COMMUNITY_STORY_CARDS } from "@/content/get-involved";

const AUTO_MS = 6500;

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Walk brand corner accents — warm gold + subtle red (not Superpower orange). */
function ActiveStoryCorners() {
  return (
    <span className="pointer-events-none absolute inset-0 rounded-2xl" aria-hidden>
      <span className="absolute left-3 top-3 h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-amber-600/75" />
      <span className="absolute right-3 top-3 h-7 w-7 rounded-tr-lg border-r-2 border-t-2 border-amber-600/75" />
      <span className="absolute bottom-3 left-3 h-7 w-7 rounded-bl-lg border-b-2 border-l-2 border-red-500/50" />
      <span className="absolute bottom-3 right-3 h-7 w-7 rounded-br-lg border-b-2 border-r-2 border-red-500/50" />
    </span>
  );
}

function StoryCardBody({ quote, body }: { quote: string; body: string }) {
  return (
    <>
      <p className="font-sans text-lg font-medium leading-snug text-earth-900 md:text-xl">
        “{quote}”
      </p>
      <p className="mt-4 text-base font-light leading-relaxed text-muted-foreground">{body}</p>
    </>
  );
}

export function GetInvolvedStoriesCarousel() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const n = COMMUNITY_STORY_CARDS.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (reducedMotion) return;
    const t = setInterval(() => go(1), AUTO_MS);
    return () => clearInterval(t);
  }, [go, reducedMotion]);

  const prevIdx = (index - 1 + n) % n;
  const nextIdx = (index + 1) % n;
  const prev = COMMUNITY_STORY_CARDS[prevIdx];
  const curr = COMMUNITY_STORY_CARDS[index];
  const next = COMMUNITY_STORY_CARDS[nextIdx];

  return (
    <section
      id="get-involved-community"
      className="border-t border-earth-100 bg-[#faf9f7] px-4 py-20 md:py-28"
      aria-labelledby="get-involved-community-heading"
    >
      <div className="mx-auto max-w-content-wide">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 inline-block rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-red-700">
            Stories
          </p>
          <h2
            id="get-involved-community-heading"
            className="font-sans text-3xl font-semibold tracking-tight text-earth-900 md:text-4xl lg:text-5xl"
          >
            Hear from theWalk Community
          </h2>
        </div>

        {/* Desktop: three-up — dimmed neighbors; SR uses arrows + tabs (duplicates hidden). */}
        <div
          className="relative mx-auto hidden max-w-5xl md:grid md:grid-cols-[1fr_1.35fr_1fr] md:items-stretch md:gap-5"
          role="region"
          aria-roledescription="carousel"
          aria-label="Community stories"
        >
          <div className="relative min-w-0">
            <button
              type="button"
              className="absolute inset-0 z-20 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
              aria-label="Show previous story"
              onClick={() => setIndex(prevIdx)}
            />
            <article
              className="pointer-events-none relative flex min-h-[220px] flex-col rounded-2xl border border-earth-100 bg-white p-10 opacity-[0.42] shadow-sm motion-reduce:opacity-50"
              aria-hidden
            >
              <StoryCardBody quote={prev.quote} body={prev.body} />
            </article>
          </div>

          <div className="relative z-10 min-w-0">
            <article className="relative flex min-h-[220px] flex-col rounded-2xl border border-earth-200 bg-white p-10 shadow-md">
              <ActiveStoryCorners />
              <StoryCardBody quote={curr.quote} body={curr.body} />
            </article>
          </div>

          <div className="relative min-w-0">
            <button
              type="button"
              className="absolute inset-0 z-20 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
              aria-label="Show next story"
              onClick={() => setIndex(nextIdx)}
            />
            <article
              className="pointer-events-none relative flex min-h-[220px] flex-col rounded-2xl border border-earth-100 bg-white p-10 opacity-[0.42] shadow-sm motion-reduce:opacity-50"
              aria-hidden
            >
              <StoryCardBody quote={next.quote} body={next.body} />
            </article>
          </div>
        </div>

        {/* Mobile: single slide strip */}
        <div className="relative mx-auto max-w-2xl md:hidden">
          <div className="overflow-hidden rounded-2xl">
            <ul
              className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {COMMUNITY_STORY_CARDS.map(({ quote, body }, i) => (
                <li
                  key={quote}
                  className="w-full shrink-0 px-1"
                  aria-hidden={i !== index}
                >
                  <article className="relative mx-auto min-h-[200px] rounded-2xl border border-earth-200 bg-white p-8 shadow-sm">
                    <ActiveStoryCorners />
                    <StoryCardBody quote={quote} body={body} />
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="rounded-full border border-earth-200 bg-white px-4 py-2 text-sm font-medium text-earth-900 shadow-sm transition-colors hover:bg-earth-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
            aria-label="Previous story"
          >
            ←
          </button>
          <div className="flex gap-2" role="tablist" aria-label="Story slides">
            {COMMUNITY_STORY_CARDS.map((c, i) => (
              <button
                key={c.quote}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show story ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60 ${
                  i === index ? "bg-red-500" : "bg-earth-200 hover:bg-earth-300"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="rounded-full border border-earth-200 bg-white px-4 py-2 text-sm font-medium text-earth-900 shadow-sm transition-colors hover:bg-earth-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/60"
            aria-label="Next story"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
