"use client";

import { useCallback, useEffect, useState } from "react";

const AUTO_MS = 6500;

const ILM_TESTIMONIALS = [
  {
    quote: "A beautifully presented tribute page. Easy to share and update as family memories come in.",
    body: "Marissa G",
  },
  {
    quote: "Very easy to create a memorial page. Thank you for providing a place to remember.",
    body: "Menard P",
  },
  {
    quote: "Wonderful to share our memories with others. It reached many people and will last.",
    body: "Lisa D",
  },
] as const;

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

function ActiveStoryCorners() {
  return (
    <span className="pointer-events-none absolute inset-0 rounded-2xl" aria-hidden>
      <span className="absolute left-3 top-3 h-7 w-7 rounded-tl-lg border-l-2 border-t-2 border-amber-500/50" />
      <span className="absolute right-3 top-3 h-7 w-7 rounded-tr-lg border-r-2 border-t-2 border-amber-500/50" />
      <span className="absolute bottom-3 left-3 h-7 w-7 rounded-bl-lg border-b-2 border-l-2 border-amber-500/30" />
      <span className="absolute bottom-3 right-3 h-7 w-7 rounded-br-lg border-b-2 border-r-2 border-amber-500/30" />
    </span>
  );
}

function TestimonialCardBody({ quote, body }: { quote: string; body: string }) {
  return (
    <>
      <p className="font-sans text-lg font-medium leading-snug text-white/90 md:text-xl">“{quote}”</p>
      <p className="mt-4 text-base font-light leading-relaxed text-white/45">{body}</p>
    </>
  );
}

export function IlmTestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const n = ILM_TESTIMONIALS.length;

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
  const prev = ILM_TESTIMONIALS[prevIdx];
  const curr = ILM_TESTIMONIALS[index];
  const next = ILM_TESTIMONIALS[nextIdx];

  return (
    <section
      id="ilm-loved-by-families"
      className="relative overflow-hidden bg-[#0d0906] px-4 py-20 md:py-28"
      aria-labelledby="ilm-loved-by-families-heading"
    >
      {/* Ambient bokeh lights */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-amber-900/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-orange-900/15 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-content-wide">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 inline-block rounded-full border border-amber-600/25 bg-amber-900/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80">
            Stories
          </p>
          <h2
            id="ilm-loved-by-families-heading"
            className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            Loved by families
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-white/55 md:text-lg">
            A simple experience that helps people focus on what matters most.
          </p>
        </div>

        <div
          className="relative mx-auto hidden max-w-5xl md:grid md:grid-cols-[1fr_1.35fr_1fr] md:items-stretch md:gap-5"
          role="region"
          aria-roledescription="carousel"
          aria-label="Family testimonials"
        >
          <div className="relative min-w-0">
            <button
              type="button"
              className="absolute inset-0 z-20 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/40"
              aria-label="Show previous testimonial"
              onClick={() => setIndex(prevIdx)}
            />
            <article
              className="pointer-events-none relative flex min-h-[220px] flex-col rounded-2xl border border-white/[0.07] bg-white/[0.04] p-10 opacity-[0.42] shadow-sm motion-reduce:opacity-50"
              aria-hidden
            >
              <TestimonialCardBody quote={prev.quote} body={prev.body} />
            </article>
          </div>

          <div className="relative z-10 min-w-0">
            <article className="relative flex min-h-[220px] flex-col rounded-2xl border border-white/[0.12] bg-white/[0.07] p-10 shadow-xl">
              <ActiveStoryCorners />
              <TestimonialCardBody quote={curr.quote} body={curr.body} />
            </article>
          </div>

          <div className="relative min-w-0">
            <button
              type="button"
              className="absolute inset-0 z-20 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/40"
              aria-label="Show next testimonial"
              onClick={() => setIndex(nextIdx)}
            />
            <article
              className="pointer-events-none relative flex min-h-[220px] flex-col rounded-2xl border border-white/[0.07] bg-white/[0.04] p-10 opacity-[0.42] shadow-sm motion-reduce:opacity-50"
              aria-hidden
            >
              <TestimonialCardBody quote={next.quote} body={next.body} />
            </article>
          </div>
        </div>

        <div className="relative mx-auto max-w-2xl md:hidden">
          <div className="overflow-hidden rounded-2xl">
            <ul
              className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {ILM_TESTIMONIALS.map(({ quote, body }, i) => (
                <li key={quote} className="w-full shrink-0 px-1" aria-hidden={i !== index}>
                  <article className="relative mx-auto min-h-[200px] rounded-2xl border border-white/[0.12] bg-white/[0.06] p-8 shadow-sm">
                    <ActiveStoryCorners />
                    <TestimonialCardBody quote={quote} body={body} />
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
            className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/80 shadow-sm transition-colors hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/40"
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
            {ILM_TESTIMONIALS.map((c, i) => (
              <button
                key={c.quote}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/40 ${
                  i === index ? "bg-amber-400/70" : "bg-white/20 hover:bg-white/35"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/80 shadow-sm transition-colors hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500/40"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
