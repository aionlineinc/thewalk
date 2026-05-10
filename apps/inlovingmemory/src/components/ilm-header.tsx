import Link from "next/link";
import type { Session } from "next-auth";
import { SignOutButton } from "@/components/sign-out-button";

export function IlmHeader({ session }: { session: Session | null }) {
  return (
    <header className="fixed inset-x-0 top-6 z-50 sm:top-7">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between gap-4 rounded-full bg-[#0d0906]/95 px-5 py-3 shadow-lg shadow-black/30 backdrop-blur-lg">
          <Link href="/" className="shrink-0">
            <img
              src="/weblogo-w.png"
              alt="inLovingMemory — Remember. Celebrate. Cherish."
              width={180}
              height={48}
              className="h-8 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </Link>
          <nav className="flex flex-wrap items-center gap-5 text-sm" aria-label="Primary">
            <Link className="font-medium text-white/80 transition hover:text-white" href="/how-it-works">
              How it works
            </Link>
            <Link className="font-medium text-white/80 transition hover:text-white" href="/directory">
              Find a memorial
            </Link>
          {session?.user ? (
            <>
              <Link className="font-medium text-white/80 transition hover:text-white" href="/dashboard">
                Dashboard
              </Link>
              <SignOutButton className="text-sm font-medium text-white/70 underline-offset-4 transition hover:text-white hover:underline" />
            </>
          ) : (
            <>
              <Link className="font-medium text-white/80 transition hover:text-white" href="/pricing">
                Pricing
              </Link>
              <Link className="font-medium text-white/80 transition hover:text-white" href="/sign-in">
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
