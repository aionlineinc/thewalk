"use client";

import { GET_INVOLVED_STATEMENTS } from "@/content/get-involved";

export function GetInvolvedDriftingStatements() {
  return (
    <section
      className="relative bg-white py-16 md:py-24"
      aria-labelledby="get-involved-drift-label"
    >
      <h2 id="get-involved-drift-label" className="sr-only">
        Voices along the journey
      </h2>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-stone-100/35 to-white" />

      {/* Scattered phrases — absolute % positions (same idea as hero portraits), slow drift */}
      <div className="relative z-[1] mx-auto min-h-[52rem] max-w-content-wide px-4 sm:min-h-[48rem] sm:px-6 md:min-h-[44rem] md:px-8 lg:min-h-[40rem]">
        {GET_INVOLVED_STATEMENTS.map(({ text, anim, delay, style, align }) => (
          <p
            key={text}
            className={`absolute max-w-[min(20rem,calc(100vw-2.5rem))] font-sans text-sm font-normal leading-relaxed tracking-tight text-stone-800 motion-reduce:animate-none sm:max-w-[min(22rem,90%)] sm:text-base md:text-lg ${
              align === "left"
                ? "text-left"
                : align === "right"
                  ? "text-right"
                  : "text-center"
            } ${anim} ${delay}`}
            style={style}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
