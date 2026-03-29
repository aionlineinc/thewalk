import Image from "next/image";

/** Left-edge of portrait column — backgrounds stop here so mask feather shows page, not a fake plate. */
const PORTRAIT_EDGE =
  "right-[34%] sm:right-[38%] md:right-[42%] lg:right-[46%]";

/**
 * Framed hero with earth-tone field and a right-edge portrait that fades into the background
 * (left-edge mask + no extra scrim on the photo so it blends, not a boxed cutout).
 */
export function AboutPremiumHero() {
  return (
    <section className="relative flex h-[min(72vh,640px)] min-h-[480px] w-full flex-col items-start justify-center bg-background p-2 font-sans tracking-tight md:h-[min(74vh,680px)] md:min-h-[520px] md:p-4">
      <div className="absolute inset-2 flex flex-col overflow-hidden rounded-[15px] bg-transparent shadow-2xl md:inset-4">
        <div
          className={`absolute inset-y-0 left-0 z-0 bg-gradient-to-br from-earth-900 via-[#3d3a35] to-[#252320] ${PORTRAIT_EDGE}`}
          aria-hidden
        />

        {/* Atmosphere on copy side only — right column stays clear for transparent mask feather */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-[1] bg-gradient-to-t from-black/35 via-transparent to-black/20 ${PORTRAIT_EDGE}`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-[1] bg-gradient-to-r from-black/32 via-black/8 to-transparent ${PORTRAIT_EDGE}`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-[2] bg-red-soft/12 mix-blend-overlay ${PORTRAIT_EDGE}`}
          aria-hidden
        />

        {/* Portrait: soft fade on the left into the gradient — no overlay on the photo itself */}
        <div
          className="absolute inset-y-0 right-0 z-10 w-[34%] min-w-[9.5rem] bg-transparent sm:w-[38%] md:w-[42%] lg:w-[46%] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_34%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_34%)]"
        >
          <Image
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"
            alt="Person in quiet reflection, representing the spiritual journey"
            fill
            className="object-cover object-[56%_10%] bg-transparent"
            sizes="(max-width: 768px) 40vw, 46vw"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 mt-10 flex w-full max-w-[min(36rem,calc(100%-max(10.5rem,38%)))] flex-col items-start justify-center pl-4 pr-4 text-left sm:max-w-[min(38rem,calc(100%-max(11rem,42%)))] sm:pl-6 md:mt-12 md:max-w-[min(40rem,calc(100%-max(12rem,46%)))] md:pl-8 lg:max-w-[min(42rem,calc(100%-max(13rem,50%)))] lg:pl-10">
        <h1 className="mb-6 text-5xl font-normal leading-[1.1] tracking-tight text-white drop-shadow-md md:text-[70px]">
          About theWalk
        </h1>
        <p className="mb-6 max-w-none text-lg font-light leading-relaxed text-white/90">
          A ministry committed to spiritual growth, discipleship, fellowship, and transformation—meeting you where
          you are and walking with you toward Christ-centered purpose.
        </p>
      </div>
    </section>
  );
}
