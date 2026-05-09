import Image from "next/image";
import Link from "next/link";
import { IlmMemorialKind, IlmPrivacyLevel, IlmEventKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Find a memorial · inLovingMemory",
};

export const dynamic = "force-dynamic";

/* ── helpers ─────────────────────────────────────────────── */

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

function paramStr(p: string | string[] | undefined): string {
  if (typeof p === "string") return p.trim();
  if (Array.isArray(p)) return p[0]?.trim() ?? "";
  return "";
}

function paramDate(p: string | string[] | undefined): Date | null {
  const s = typeof p === "string" ? p : Array.isArray(p) ? p[0] : undefined;
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

type SortOption = "updated" | "name-asc" | "name-desc" | "birth-desc" | "death-desc";

function sortOrder(sort: string): { field: string; dir: "asc" | "desc" } {
  const map: Record<string, { field: string; dir: "asc" | "desc" }> = {
    "name-asc": { field: "displayName", dir: "asc" },
    "name-desc": { field: "displayName", dir: "desc" },
    "birth-desc": { field: "birthDate", dir: "desc" },
    "death-desc": { field: "deathDate", dir: "desc" },
  };
  return map[sort] ?? { field: "updatedAt", dir: "desc" };
}

function funeralWindow(timing: string): { gte: Date; lte: Date } | null {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (timing) {
    case "this-week": {
      const day = start.getDay();
      const mon = new Date(start);
      mon.setDate(start.getDate() - day + (day === 0 ? -6 : 1));
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      sun.setHours(23, 59, 59, 999);
      return { gte: mon, lte: sun };
    }
    case "next-week": {
      const day = start.getDay();
      const mon = new Date(start);
      mon.setDate(start.getDate() - day + (day === 0 ? -6 : 1) + 7);
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      sun.setHours(23, 59, 59, 999);
      return { gte: mon, lte: sun };
    }
    case "this-month": {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
      return { gte: start, lte: end };
    }
    default:
      return null;
  }
}

/* ── build query URL for links / badge removal ───────────── */

function buildQuery(current: Record<string, string>, overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged = { ...current, ...overrides };
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return `/directory${qs ? `?${qs}` : ""}`;
}

/* ── active filter badge ──────────────────────────────────── */

function Badge({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-calm-300 bg-calm-50 px-3 py-1 text-xs font-medium text-calm-700 transition hover:bg-calm-100"
    >
      {label}
      <span className="ml-0.5 text-calm-400">&times;</span>
    </Link>
  );
}

/* ── page ─────────────────────────────────────────────────── */

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  /* read params */
  const q = paramStr(searchParams.q);
  const kind = paramStr(searchParams.kind) as IlmMemorialKind | "";
  const country = paramStr(searchParams.country);
  const parish = paramStr(searchParams.parish);
  const birthFrom = paramDate(searchParams.birthFrom);
  const birthTo = paramDate(searchParams.birthTo);
  const deathFrom = paramDate(searchParams.deathFrom);
  const deathTo = paramDate(searchParams.deathTo);
  const funeralTiming = paramStr(searchParams.funeralTiming);
  const funeralFrom = paramDate(searchParams.funeralFrom);
  const funeralTo = paramDate(searchParams.funeralTo);
  const sort = paramStr(searchParams.sort);

  const currentParams: Record<string, string> = {};
  if (q) currentParams.q = q;
  if (kind) currentParams.kind = kind;
  if (country) currentParams.country = country;
  if (parish) currentParams.parish = parish;
  if (birthFrom) currentParams.birthFrom = searchParams.birthFrom as string;
  if (birthTo) currentParams.birthTo = searchParams.birthTo as string;
  if (deathFrom) currentParams.deathFrom = searchParams.deathFrom as string;
  if (deathTo) currentParams.deathTo = searchParams.deathTo as string;
  if (funeralTiming) currentParams.funeralTiming = funeralTiming;
  if (funeralFrom) currentParams.funeralFrom = searchParams.funeralFrom as string;
  if (funeralTo) currentParams.funeralTo = searchParams.funeralTo as string;
  if (sort) currentParams.sort = sort;

  const hasFilters = Object.keys(currentParams).length > 0;

  /* build where */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    privacyLevel: IlmPrivacyLevel.PUBLIC,
    hideFromDirectory: false,
  };

  if (q) {
    where.OR = [
      { displayName: { contains: q, mode: "insensitive" } },
      { biography: { contains: q, mode: "insensitive" } },
    ];
  }

  if (kind) {
    where.kind = kind;
  }

  if (country) {
    where.country = { contains: country, mode: "insensitive" };
  }

  if (parish) {
    where.parish = { contains: parish, mode: "insensitive" };
  }

  if (birthFrom || birthTo) {
    where.birthDate = {};
    if (birthFrom) where.birthDate.gte = birthFrom;
    if (birthTo) where.birthDate.lte = birthTo;
  }

  if (deathFrom || deathTo) {
    where.deathDate = {};
    if (deathFrom) where.deathDate.gte = deathFrom;
    if (deathTo) where.deathDate.lte = deathTo;
  }

  /* funeral filter */
  const fw = funeralTiming ? funeralWindow(funeralTiming) : null;
  if (fw || (funeralTiming === "custom" && (funeralFrom || funeralTo))) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where.events = { some: { kind: IlmEventKind.FUNERAL, startsAt: {} as any } };
    if (fw) {
      where.events.some.startsAt = { gte: fw.gte, lte: fw.lte };
    } else if (funeralTiming === "custom") {
      if (funeralFrom) where.events.some.startsAt.gte = funeralFrom;
      if (funeralTo) where.events.some.startsAt.lte = funeralTo;
    }
  }

  /* sort */
  const { field, dir } = sortOrder(sort);

  /* query */
  const memorials = await prisma.ilmMemorial.findMany({
    where,
    orderBy: { [field]: dir },
    take: 80,
    select: {
      id: true,
      slug: true,
      displayName: true,
      kind: true,
      biography: true,
      birthDate: true,
      deathDate: true,
      country: true,
      parish: true,
      updatedAt: true,
    },
  });

  /* active badges */
  const badges: { label: string; href: string }[] = [];
  if (kind) {
    badges.push({
      label: kind === "MEMORIAL" ? "Memorial" : "Living legacy",
      href: buildQuery(currentParams, { kind: undefined }),
    });
  }
  if (country) {
    badges.push({
      label: `Country: ${country}`,
      href: buildQuery(currentParams, { country: undefined }),
    });
  }
  if (parish) {
    badges.push({
      label: `Parish: ${parish}`,
      href: buildQuery(currentParams, { parish: undefined }),
    });
  }
  if (birthFrom || birthTo) {
    const label = ["Born", birthFrom ? birthFrom.toISOString().slice(0, 10) : "", birthTo ? `– ${birthTo.toISOString().slice(0, 10)}` : ""]
      .filter(Boolean)
      .join(" ");
    badges.push({
      label,
      href: buildQuery(currentParams, { birthFrom: undefined, birthTo: undefined }),
    });
  }
  if (deathFrom || deathTo) {
    const label = ["Died", deathFrom ? deathFrom.toISOString().slice(0, 10) : "", deathTo ? `– ${deathTo.toISOString().slice(0, 10)}` : ""]
      .filter(Boolean)
      .join(" ");
    badges.push({
      label,
      href: buildQuery(currentParams, { deathFrom: undefined, deathTo: undefined }),
    });
  }
  if (funeralTiming) {
    const labelMap: Record<string, string> = {
      "this-week": "Funeral this week",
      "next-week": "Funeral next week",
      "this-month": "Funeral this month",
      custom: "Funeral custom range",
    };
    badges.push({
      label: labelMap[funeralTiming] ?? "Funeral filter",
      href: buildQuery(currentParams, { funeralTiming: undefined, funeralFrom: undefined, funeralTo: undefined }),
    });
  }

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

      {/* Search + filters + results */}
      <div className="ilm-container py-12">
        {/* ---- Tier 1: search bar + kind chips ---- */}
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center" action="/directory" method="get">
          {/* persist hidden params */}
          {Object.entries(currentParams)
            .filter(([k]) => k !== "q")
            .map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
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

        {/* kind chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={buildQuery(currentParams, { kind: undefined })}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              !kind
                ? "border-calm-500 bg-calm-500 text-white"
                : "border-earth-200 bg-white text-earth-600 hover:border-earth-300"
            }`}
          >
            All
          </Link>
          <Link
            href={buildQuery(currentParams, { kind: kind === "MEMORIAL" ? undefined : "MEMORIAL" })}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              kind === "MEMORIAL"
                ? "border-calm-500 bg-calm-500 text-white"
                : "border-earth-200 bg-white text-earth-600 hover:border-earth-300"
            }`}
          >
            Memorial
          </Link>
          <Link
            href={buildQuery(currentParams, { kind: kind === "LIVING_LEGACY" ? undefined : "LIVING_LEGACY" })}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              kind === "LIVING_LEGACY"
                ? "border-calm-500 bg-calm-500 text-white"
                : "border-earth-200 bg-white text-earth-600 hover:border-earth-300"
            }`}
          >
            Living legacy
          </Link>
        </div>

        {/* ---- Tier 2: expandable more filters ---- */}
        <details className="mt-4">
          <summary className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-earth-200 bg-white px-4 py-2 text-sm font-medium text-earth-600 transition hover:border-earth-300 hover:text-earth-800">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasFilters ? (
              <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-calm-500 px-1.5 text-[11px] font-bold text-white">
                {badges.length}
              </span>
            ) : null}
          </summary>

          <form method="get" action="/directory" className="mt-4 rounded-2xl border border-earth-200 bg-white p-5 shadow-sm">
            {/* persist q */}
            {q ? <input type="hidden" name="q" value={q} /> : null}
            {kind ? <input type="hidden" name="kind" value={kind} /> : null}

            <div className="grid gap-5 sm:grid-cols-2">
              {/* country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-earth-700">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  defaultValue={country}
                  placeholder="e.g. United States, Kenya"
                  className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                />
              </div>

              {/* parish */}
              <div>
                <label htmlFor="parish" className="block text-sm font-medium text-earth-700">
                  Parish / community
                </label>
                <input
                  id="parish"
                  name="parish"
                  type="text"
                  defaultValue={parish}
                  placeholder="e.g. St. Mary's, Nairobi Chapel"
                  className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                />
              </div>

              {/* birth range */}
              <div>
                <label className="block text-sm font-medium text-earth-700">Date of birth</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    name="birthFrom"
                    defaultValue={birthFrom ? birthFrom.toISOString().slice(0, 10) : ""}
                    className="w-full rounded-lg border border-earth-200 bg-white px-2 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                  />
                  <input
                    type="date"
                    name="birthTo"
                    defaultValue={birthTo ? birthTo.toISOString().slice(0, 10) : ""}
                    className="w-full rounded-lg border border-earth-200 bg-white px-2 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                  />
                </div>
              </div>

              {/* death range */}
              <div>
                <label className="block text-sm font-medium text-earth-700">Date of death</label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    name="deathFrom"
                    defaultValue={deathFrom ? deathFrom.toISOString().slice(0, 10) : ""}
                    className="w-full rounded-lg border border-earth-200 bg-white px-2 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                  />
                  <input
                    type="date"
                    name="deathTo"
                    defaultValue={deathTo ? deathTo.toISOString().slice(0, 10) : ""}
                    className="w-full rounded-lg border border-earth-200 bg-white px-2 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                  />
                </div>
              </div>

              {/* funeral timing */}
              <div>
                <label htmlFor="funeralTiming" className="block text-sm font-medium text-earth-700">
                  Funeral timing
                </label>
                <select
                  id="funeralTiming"
                  name="funeralTiming"
                  defaultValue={funeralTiming}
                  className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                >
                  <option value="">Any time</option>
                  <option value="this-week">This week</option>
                  <option value="next-week">Next week</option>
                  <option value="this-month">This month</option>
                  <option value="custom">Custom range…</option>
                </select>
                {funeralTiming === "custom" ? (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      name="funeralFrom"
                      defaultValue={funeralFrom ? funeralFrom.toISOString().slice(0, 10) : ""}
                      className="w-full rounded-lg border border-earth-200 bg-white px-2 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                    />
                    <input
                      type="date"
                      name="funeralTo"
                      defaultValue={funeralTo ? funeralTo.toISOString().slice(0, 10) : ""}
                      className="w-full rounded-lg border border-earth-200 bg-white px-2 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                    />
                  </div>
                ) : null}
              </div>

              {/* sort */}
              <div>
                <label htmlFor="sort" className="block text-sm font-medium text-earth-700">
                  Sort by
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={sort}
                  className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 shadow-sm outline-none transition focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
                >
                  <option value="">Recently updated</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                  <option value="birth-desc">Birth date (newest)</option>
                  <option value="death-desc">Death date (newest)</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 border-t border-earth-100 pt-5">
              <button
                type="submit"
                className="rounded-full bg-calm-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-600"
              >
                Apply filters
              </button>
              {hasFilters ? (
                <Link
                  href="/directory"
                  className="text-sm font-medium text-earth-400 transition hover:text-earth-600"
                >
                  Clear all
                </Link>
              ) : null}
            </div>
          </form>
        </details>

        {/* ---- Tier 3: active filter badges ---- */}
        {badges.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b.label} label={b.label} href={b.href} />
            ))}
          </div>
        ) : null}

        {/* ---- Results ---- */}
        {memorials.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-earth-500">
              {hasFilters ? "No public memorials match these filters." : q ? `No public memorials match "${q}".` : "No memorials are listed yet."}
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
                    {m.country || m.parish ? (
                      <p className="mt-1 text-xs text-earth-400">
                        {[m.parish, m.country].filter(Boolean).join(", ")}
                      </p>
                    ) : null}
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
