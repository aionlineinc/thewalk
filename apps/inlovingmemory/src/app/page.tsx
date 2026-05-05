import Link from "next/link";
import { getIlmSession } from "@/lib/auth";

export default async function IlmHomePage() {
  const session = await getIlmSession();

  return (
    <main className="mx-auto flex min-h-screen max-w-content flex-col px-6 pb-24 pt-20 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">theWalk Ministries</p>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-earth-900 sm:text-5xl">
        More than a memorial — a living legacy
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-earth-800">
        Honour those who have passed, share prayers and memories with family and friends, and keep their story
        accessible with dignity.
      </p>
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/how-it-works"
          className="inline-flex rounded-lg border border-earth-300 bg-white px-5 py-2.5 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50"
        >
          How it works
        </Link>
        <Link
          href="/directory"
          className="inline-flex rounded-lg border border-earth-300 bg-white px-5 py-2.5 text-sm font-semibold text-earth-900 shadow-sm transition hover:border-earth-400 hover:bg-earth-50"
        >
          Find a memorial
        </Link>
        {session?.user ? (
          <Link
            href="/dashboard"
            className="inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
          >
            Your memorials
          </Link>
        ) : (
          <Link
            href="/sign-in"
            className="inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
          >
            Page keeper sign in
          </Link>
        )}
      </div>
      <ul className="mt-16 space-y-4 text-earth-800">
        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-calm-600" aria-hidden />
          <span>
            <strong className="font-medium text-earth-900">Memorials & living legacies</strong> — create a
            beautiful page with story, guest book, and prayer wall.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-calm-600" aria-hidden />
          <span>
            <strong className="font-medium text-earth-900">You stay in control</strong> — privacy levels,
            moderation, and optional directory visibility.
          </span>
        </li>
      </ul>
      <div className="mt-14 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <Link className="font-medium text-earth-800 underline-offset-4 hover:underline" href="/about">
          About
        </Link>
        <Link className="font-medium text-earth-800 underline-offset-4 hover:underline" href="/pricing">
          Pricing
        </Link>
        <Link className="font-medium text-earth-800 underline-offset-4 hover:underline" href="/faq">
          FAQ
        </Link>
        <Link className="font-medium text-earth-800 underline-offset-4 hover:underline" href="/resources">
          Resources
        </Link>
      </div>
      <p className="mt-14 text-xs text-earth-500">
        Accounts use the same sign-in as theWalk.org — register there if you need a new account.
      </p>
    </main>
  );
}
