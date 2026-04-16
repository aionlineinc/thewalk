/**
 * Dark testimonial-style band after drifting statements — hierarchy + line motif
 * (Superpower section_testimonial-more–inspired; Walk burgundy / warm gold, not orange).
 */
export function GetInvolvedTransitionStrip() {
  return (
    <section
      className="relative overflow-hidden bg-[#1a0f12] px-4 py-20 md:py-28"
      aria-labelledby="get-involved-transition-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,rgba(180,83,9,0.08),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(170,3,3,0.06),transparent_50%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-content">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/25 to-transparent md:h-20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[min(100%,28rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-600/35 to-transparent"
          aria-hidden
        />

        <div className="relative pt-10 text-center md:pt-14">
          <p className="mb-5 font-mono text-[0.65rem] font-medium uppercase tracking-[0.35em] text-white/45 md:mb-6">
            A turning point
          </p>
          <h2
            id="get-involved-transition-heading"
            className="font-sans text-3xl font-semibold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
          >
            Your purpose deserves expression.
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed text-white/65 md:mt-10 md:text-xl">
            “I finally found a place where faith moves from Sunday into the rest of the week.”
          </p>
        </div>
      </div>
    </section>
  );
}
