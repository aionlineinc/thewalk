import Link from "next/link";

export function IlmFooter() {
  return (
    <footer className="border-t border-earth-200/80 bg-earth-50/40">
      <div className="ilm-container py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-tight text-earth-900">inLovingMemory</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-earth-700">
              More than a memorial — a living legacy.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-3">
            <Link className="font-medium text-earth-800 hover:text-earth-950" href="/about">
              About
            </Link>
            <Link className="font-medium text-earth-800 hover:text-earth-950" href="/how-it-works">
              How it works
            </Link>
            <Link className="font-medium text-earth-800 hover:text-earth-950" href="/pricing">
              Pricing
            </Link>
            <Link className="font-medium text-earth-800 hover:text-earth-950" href="/faq">
              FAQ
            </Link>
            <Link className="font-medium text-earth-800 hover:text-earth-950" href="/resources">
              Resources
            </Link>
            <Link className="font-medium text-earth-800 hover:text-earth-950" href="/directory">
              Find a memorial
            </Link>
          </nav>
        </div>

        <p className="mt-10 text-xs text-earth-500">
          © {new Date().getFullYear()} theWalk Ministries. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

