import Link from "next/link";
import type { Session } from "next-auth";
import { SignOutButton } from "@/components/sign-out-button";

export function IlmHeader({ session }: { session: Session | null }) {
  return (
    <header className="fixed inset-x-0 top-6 z-50 sm:top-7">
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 rounded-full border border-earth-200 bg-white/90 px-5 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/75">
          <Link href="/" className="shrink-0">
            <img
              src="/weblogo.png"
              alt="inLovingMemory — Remember. Celebrate. Cherish."
              width={180}
              height={48}
              className="h-8 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </Link>
          <nav className="flex flex-wrap items-center gap-5 text-sm" aria-label="Primary">
            <Link className="font-medium text-earth-800 transition hover:text-earth-950" href="/how-it-works">
              How it works
            </Link>
            <Link className="font-medium text-earth-800 transition hover:text-earth-950" href="/directory">
              Find a memorial
            </Link>
          {session?.user ? (
            <>
              <Link className="font-medium text-earth-800 transition hover:text-earth-950" href="/dashboard">
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link className="font-medium text-earth-800 transition hover:text-earth-950" href="/pricing">
                Pricing
              </Link>
              <Link className="font-medium text-earth-800 transition hover:text-earth-950" href="/sign-in">
                Sign in
              </Link>
            </>
          )}
          </nav>
        </div>
      </div>
    </header>
  );
}
