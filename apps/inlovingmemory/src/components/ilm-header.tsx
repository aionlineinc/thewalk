import Link from "next/link";
import type { Session } from "next-auth";
import { SignOutButton } from "@/components/sign-out-button";

export function IlmHeader({ session }: { session: Session | null }) {
  return (
    <header className="border-b border-earth-200/80 bg-earth-50/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link href="/" className="text-sm font-semibold tracking-tight text-earth-900">
          inLovingMemory
        </Link>
        <nav className="flex flex-wrap items-center gap-6 text-sm" aria-label="Primary">
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
            <Link className="font-medium text-earth-800 transition hover:text-earth-950" href="/sign-in">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
