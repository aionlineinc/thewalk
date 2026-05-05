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
        Every life tells a story worth preserving. Honour those who have passed and protect what matters for the generations that follow.
      </p>
      <div className="mt-12 flex flex-wrap gap-4">
        {session?.user ? (
          <Link
            href="/dashboard"
            className="inline-flex rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
          >
            Go to dashboard
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
      <p className="mt-10 text-sm text-earth-500">
        Status · <code className="rounded bg-earth-100 px-2 py-0.5 text-earth-800">/api/health</code>
      </p>
    </main>
  );
}
