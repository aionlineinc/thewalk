"use client";

import Image from "next/image";
import { AppPillLink } from "@/components/ui/AppPillLink";
import { HERO_FACE_CIRCLES } from "@/content/get-involved";

export function GetInvolvedImmersiveHero() {
  return (
    <div className="relative">
      <section
        className="relative isolate min-h-[78vh] overflow-hidden bg-[#1a0f12] pb-0 pt-40 md:min-h-[82vh] md:pt-48"
        aria-labelledby="get-involved-immersive-title"
      >
        {/* Darkening layers FIRST — faces are stacked above so they stay visible */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#1a0f12]/80 via-[#1a0f12]/65 to-[#1a0f12]/85"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(170,3,3,0.12),transparent_50%)]"
          aria-hidden
        />

        {/* Circular portraits — z-[4] under copy (z-10) so they read behind headline; above base gradients */}
        <div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden>
          {HERO_FACE_CIRCLES.map(({ src, alt, style, sizePx, className }, i) => (
            <div
              key={`hero-face-${i}`}
              className={`absolute overflow-hidden rounded-full ring-2 ring-white/20 shadow-md ${className ?? ""}`}
              style={{
                ...style,
                width: sizePx,
                height: sizePx,
              }}
            >
              <Image
                src={src}
                alt={alt}
                width={sizePx}
                height={sizePx}
                className="h-full w-full object-cover"
                sizes={`${sizePx}px`}
                priority={i < 3}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 flex justify-center">
          <div className="relative z-10 mt-[50px] mb-0 mx-[23px] flex w-full max-w-4xl flex-col items-center px-4 pt-10 pb-32 text-center md:px-6 md:pb-[120px]">
            <h1
              id="get-involved-immersive-title"
              className="mb-6 max-w-[22rem] font-sans text-4xl font-normal leading-[1.08] tracking-tight text-white drop-shadow-md md:mb-8 md:max-w-3xl md:text-[50px] md:leading-[1.05] lg:text-7xl"
            >
              Before You Stepped In…
              <span className="mt-2 block text-white/95">Something Was Missing.</span>
            </h1>
            <p
              id="get-involved-immersive-sub"
              className="mb-10 max-w-xl text-lg font-light leading-relaxed text-white/80 md:mb-12"
            >
              Many feel the call—but don’t yet know where to walk it out.
            </p>
            <AppPillLink href="/journey" variant="primary" className="text-base md:text-lg">
              Join the Walk
            </AppPillLink>
          </div>
        </div>

        {/* Curve into next section — transition copy lives in GetInvolvedTransitionStrip */}
        <div className="relative z-[6] mt-auto w-full leading-[0] text-white">
          <svg
            className="relative block w-full"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            aria-hidden
            style={{ height: "clamp(3.25rem, 12vw, 7.5rem)" }}
          >
            <path
              fill="currentColor"
              d="M0,100 L0,66 Q720,99 1440,66 L1440,100 Z"
            />
          </svg>
        </div>
      </section>
    </div>
  );
}
