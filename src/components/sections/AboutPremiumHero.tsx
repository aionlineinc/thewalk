import Image from "next/image";

/**
 * Framed hero with earth-tone field and a right-edge portrait that fades into the background
 * (left-edge mask + no extra scrim on the photo so it blends, not a boxed cutout).
 */
export function AboutPremiumHero() {
  return (
    <section className="relative flex h-[min(72vh,640px)] min-h-[480px] w-full flex-col items-center justify-center p-2 font-sans tracking-tight md:h-[min(74vh,680px)] md:min-h-[520px] md:p-4">
      <div className="absolute inset-2 overflow-hidden rounded-[15px] bg-earth-900 shadow-2xl md:inset-4">
        <div
          className="absolute inset-0 bg-gradient-to-br from-earth-900 via-[#3d3a35] to-[#252320]"
          aria-hidden
        />

        {/* Atmosphere behind copy only — portrait is layered above so it is not mudded */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/35 via-transparent to-black/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/32 via-black/8 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-red-soft/12 mix-blend-overlay"
          aria-hidden
        />

        {/* Portrait: soft fade on the left into the gradient — no overlay on the photo itself */}
        <div
          className="absolute inset-y-0 right-0 z-10 w-[34%] min-w-[9.5rem] sm:w-[38%] md:w-[42%] lg:w-[46%] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_34%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.35)_10%,rgba(0,0,0,0.85)_22%,black_34%)]"
        >
          <Image
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop"
            alt="Person in quiet reflection, representing the spiritual journey"
            fill
            className="object-cover object-[56%_10%]"
            sizes="(max-width: 768px) 40vw, 46vw"
            priority
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex max-w-4xl flex-col items-center px-4 text-center md:mt-12">
        <h1 className="mb-6 text-5xl font-normal leading-[1.1] tracking-tight text-white drop-shadow-md md:text-[70px] lg:text-[5rem]">
          About theWalk
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-lg font-light leading-relaxed text-white/90">
          A ministry committed to spiritual growth, discipleship, fellowship, and transformation—meeting you where
          you are and walking with you toward Christ-centered purpose.
        </p>
      </div>
    </section>
  );
}
