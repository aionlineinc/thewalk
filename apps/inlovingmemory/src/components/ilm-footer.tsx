import Link from "next/link";

export function IlmFooter() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0d0906]">
      <div className="ilm-container py-12 md:py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <img
              src="/weblogo-w.png"
              alt="inLovingMemory"
              width={160}
              height={44}
              className="h-7 w-auto object-contain opacity-90"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/45">
              More than a memorial — a living legacy.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-3">
            <Link className="font-medium text-white/60 transition hover:text-white/90" href="/about">
              About
            </Link>
            <Link className="font-medium text-white/60 transition hover:text-white/90" href="/how-it-works">
              How it works
            </Link>
            <Link className="font-medium text-white/60 transition hover:text-white/90" href="/pricing">
              Pricing
            </Link>
            <Link className="font-medium text-white/60 transition hover:text-white/90" href="/faq">
              FAQ
            </Link>
            <Link className="font-medium text-white/60 transition hover:text-white/90" href="/resources">
              Resources
            </Link>
            <Link className="font-medium text-white/60 transition hover:text-white/90" href="/resources/blog">
              Blog
            </Link>
            <Link className="font-medium text-white/60 transition hover:text-white/90" href="/directory">
              Find a memorial
            </Link>
          </nav>
        </div>

        <p className="mt-10 text-xs text-white/25">
          © {new Date().getFullYear()} theWalk Ministries. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
