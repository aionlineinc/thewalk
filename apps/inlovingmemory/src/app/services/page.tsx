import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Service providers · inLovingMemory" };
export const dynamic = "force-dynamic";

export default async function ServicesDirectoryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const [categories, providers] = await Promise.all([
    prisma.ilmServiceCategory.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, slug: true, label: true, _count: { select: { vendors: { where: { isActive: true } } } } },
    }),
    prisma.ilmServiceProvider.findMany({
      where: {
        isActive: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, description: true, location: true, category: { select: { label: true, slug: true } } },
      take: 80,
    }),
  ]);

  return (
    <main className="pb-24">
      <section className="relative flex h-[58vh] min-h-[440px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-12 pt-28 md:pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Directory</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">
            Service providers
          </h1>
          <p className="mt-4 max-w-xl text-base font-light leading-relaxed text-white/70 md:text-lg">
            Trusted vendors for funeral flowers, videography, counselling, and more.
          </p>
        </div>
      </section>

      <div className="ilm-container py-12">
        {/* Search + filter */}
        <form className="flex flex-col gap-3 sm:flex-row sm:items-center" action="/services" method="get">
          <input type="search" name="q" defaultValue={q} placeholder="Search providers…" className="flex-1 rounded-full border border-earth-200 bg-white px-5 py-3 text-sm text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20" />
          <select name="category" defaultValue={category} className="rounded-full border border-earth-200 bg-white px-4 py-3 text-sm text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label} ({c._count.vendors})</option>
            ))}
          </select>
          <button type="submit" className="rounded-full bg-calm-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-calm-600">Search</button>
        </form>

        {/* Category quick links */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/services" className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${!category ? "border-calm-500 bg-calm-500 text-white" : "border-earth-200 bg-white text-earth-600 hover:border-earth-300"}`}>All</Link>
          {categories.filter((c) => c._count.vendors > 0).map((c) => (
            <Link key={c.slug} href={`/services?category=${c.slug}`} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${category === c.slug ? "border-calm-500 bg-calm-500 text-white" : "border-earth-200 bg-white text-earth-600 hover:border-earth-300"}`}>{c.label}</Link>
          ))}
        </div>

        {/* Results */}
        {providers.length === 0 ? (
          <p className="mt-12 text-center text-earth-500">No service providers found.</p>
        ) : (
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {providers.map((p) => (
              <li key={p.id}>
                <Link href={`/services/${p.slug}`} className="group block rounded-2xl border border-earth-200 bg-white p-5 shadow-sm transition hover:border-earth-300 hover:shadow-md">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-earth-400">{p.category.label}</p>
                  <h2 className="mt-1 text-base font-semibold text-earth-900 transition-colors group-hover:text-calm-600">{p.name}</h2>
                  {p.location ? <p className="mt-1 text-sm text-earth-500">{p.location}</p> : null}
                  {p.description ? <p className="mt-2 line-clamp-2 text-sm text-earth-600">{p.description}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
