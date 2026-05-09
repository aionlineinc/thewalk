import Image from "next/image";
import Link from "next/link";
import { IlmMemorialKind, IlmPrivacyLevel } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Find a memorial · inLovingMemory",
};

export const dynamic = "force-dynamic";

function excerpt(text: string | null, max = 120) {
  if (!text?.trim()) return null;
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max).trim()}…`;
}

function MemorialInitial({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-earth-100 to-earth-200">
      <span className="text-3xl font-light tracking-tight text-earth-500">{initials}</span>
    </div>
  );
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
    <main className="pb-24">
      {/* Cinematic hero */}
      <section className="relative flex h-[52vh] min-h-[400px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=85"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-10 pt-28 md:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Discover</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">
            Find a memorial
          </h1>
          <p className="mt-3 max-w-lg text-base font-light text-white/65">
            Public pages only. Page keepers can hide a memorial from this list while keeping the direct link available.
          </p>
        </div>
      </section>

      {/* Search + results */}
      <div className="ilm-container py-12">
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center" action="/directory" method="get">
          <div className="flex-1">
            <label htmlFor="q" className="sr-only">
              Search by name or keyword
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="Search by name or keyword…"
              className="w-full rounded-full border border-earth-200 bg-white px-5 py-3 text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-calm-500 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-600"
          >
            Search
          </button>
        </form>

        {memorials.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-earth-500">
              {q ? `No public memorials match "${q}".` : "No memorials are listed yet."}
            </p>
          </div>
        ) : (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {memorials.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/memorial/${m.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm transition hover:border-earth-300 hover:shadow-md"
                >
                  <div className="relative h-36 overflow-hidden">
                    <MemorialInitial name={m.displayName} />
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-earth-400">
                      {m.kind === IlmMemorialKind.LIVING_LEGACY ? "Living legacy" : "Memorial"}
                    </p>
                    <h2 className="mt-1.5 text-base font-semibold text-earth-900 transition-colors group-hover:text-calm-600">
                      {m.displayName}
                    </h2>
                    {excerpt(m.biography) ? (
                      <p className="mt-2 text-sm leading-relaxed text-earth-500 line-clamp-2">
                        {excerpt(m.biography)}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
