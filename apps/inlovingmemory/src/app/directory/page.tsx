import Link from "next/link";
import { IlmMemorialKind, IlmPrivacyLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Find a memorial · inLovingMemory",
};

export const dynamic = "force-dynamic";

function excerpt(text: string | null, max = 140) {
  if (!text?.trim()) return null;
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max).trim()}…`;
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const qRaw = searchParams.q;
  const q = typeof qRaw === "string" ? qRaw.trim() : Array.isArray(qRaw) ? qRaw[0]?.trim() ?? "" : "";

  const memorials = await prisma.ilmMemorial.findMany({
    where: {
      privacyLevel: IlmPrivacyLevel.PUBLIC,
      hideFromDirectory: false,
      ...(q.length > 0
        ? {
            OR: [
              { displayName: { contains: q, mode: "insensitive" } },
              { biography: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 80,
    select: {
      id: true,
      slug: true,
      displayName: true,
      kind: true,
      biography: true,
      birthDate: true,
      deathDate: true,
      updatedAt: true,
    },
  });

  return (
    <main className="ilm-container py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-earth-500">Discover</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-earth-900">Find a memorial</h1>
      <p className="mt-4 max-w-xl text-earth-700">
        Public pages only. Page keepers can hide a memorial from this list while keeping the direct link
        available.
      </p>

      <form className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-end" action="/directory" method="get">
        <div className="flex-1">
          <label htmlFor="q" className="sr-only">
            Search by name or keyword
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Name or keyword"
            className="w-full rounded-lg border border-earth-200 bg-white px-3 py-2.5 text-earth-900 shadow-sm outline-none ring-calm-500/20 focus:border-calm-500 focus:ring-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-earth-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-earth-900"
        >
          Search
        </button>
      </form>

      {memorials.length === 0 ? (
        <p className="mt-12 text-earth-600">
          {q ? "No public memorials match that search." : "No memorials are listed yet."}
        </p>
      ) : (
        <ul className="mt-12 space-y-6">
          {memorials.map((m) => (
            <li key={m.id}>
              <Link
                href={`/memorial/${m.slug}`}
                className="group block rounded-2xl border border-earth-200 bg-white/80 px-6 py-5 shadow-sm transition hover:border-earth-300 hover:shadow"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">
                  {m.kind === IlmMemorialKind.LIVING_LEGACY ? "Living legacy" : "Memorial"}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-earth-900 group-hover:text-calm-500">
                  {m.displayName}
                </h2>
                {excerpt(m.biography) ? (
                  <p className="mt-2 text-sm leading-relaxed text-earth-700">{excerpt(m.biography)}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
