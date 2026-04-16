import Link from "next/link";
import { AppPillLink } from "@/components/ui/AppPillLink";

export function GetInvolvedTurningPoint() {
  return (
    <section
      id="get-involved-turning"
      className="bg-white px-4 py-20 md:py-28"
      aria-labelledby="get-involved-turning-heading"
    >
      <div className="mx-auto max-w-content text-center">
        <h2
          id="get-involved-turning-heading"
          className="font-sans text-3xl font-semibold tracking-tight text-earth-900 md:text-4xl lg:text-5xl"
        >
          Then They Found Their Place.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
          What began as a desire to grow became a journey of purpose, service, and impact.
        </p>
      </div>
    </section>
  );
}

export function GetInvolvedFinalCta() {
  return (
    <section
      id="get-involved-final-cta"
      className="bg-[#1a0f12] px-4 py-24 text-center md:py-32"
      aria-labelledby="get-involved-final-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="get-involved-final-heading"
          className="font-sans text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl"
        >
          Don’t Just Watch. Be Part of It.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg font-light text-white/70 md:text-xl">
          There is a place for you here.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
          <AppPillLink href="/journey" variant="primary">
            Join the Walk
          </AppPillLink>
          <AppPillLink href="/contact?type=serve" variant="ghostOnDark">
            Serve
          </AppPillLink>
          <AppPillLink href="/donations" variant="ghostOnDark">
            Support
          </AppPillLink>
        </div>
        <p className="mt-12 text-sm font-light text-white/40">
          <Link
            href="/contact"
            data-button-link
            className="text-white/70 underline underline-offset-4 transition-colors hover:text-white"
          >
            Questions?
          </Link>{" "}
          Reach out anytime.
        </p>
      </div>
    </section>
  );
}
