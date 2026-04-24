"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BlogHeroCollage } from "@/components/growth/BlogHeroCollage";
import {
  ARTICLE_CATEGORY_LABEL,
  type GrowthArticle,
  getGrowthArticleHref,
} from "@/lib/growth-content";

const FILTER_ALL = "all" as const;
type FilterId = typeof FILTER_ALL | "series" | string;

function categoryLabel(category: string): string {
  const hit = ARTICLE_CATEGORY_LABEL[category];
  if (hit) return hit;
  // slug → Title Case
  return category
    .split(/[-_]/g)
    .filter(Boolean)
    .map((w) => w.slice(0, 1).toUpperCase() + w.slice(1))
    .join(" ");
}

function matchesFilter(article: GrowthArticle, filter: FilterId) {
  if (filter === FILTER_ALL) return true;
  // "Series" is not a category tag — it's membership in a parent series.
  // An article qualifies if it has a non-null `series` reference. This
  // unifies the homepage "Current series" block (which is a collection
  // of articles) with the articles-page concept of a series.
  if (filter === "series") return !!article.series;
  return article.category === filter;
}

/**
 * Group articles by their parent `series` reference, in the order each
 * series first appears. Articles without a series are dropped. Within
 * each series, items are sorted by `seriesSort` (nulls last).
 */
function groupBySeries(
  articles: GrowthArticle[],
): Array<{ slug: string; title: string; items: GrowthArticle[] }> {
  const order: string[] = [];
  const groups = new Map<string, { slug: string; title: string; items: GrowthArticle[] }>();
  for (const a of articles) {
    if (!a.series) continue;
    const key = a.series.slug;
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(a);
    } else {
      order.push(key);
      groups.set(key, { slug: key, title: a.series.title, items: [a] });
    }
  }
  for (const g of groups.values()) {
    g.items.sort((x, y) => {
      const xs = x.seriesSort ?? Number.POSITIVE_INFINITY;
      const ys = y.seriesSort ?? Number.POSITIVE_INFINITY;
      return xs - ys;
    });
  }
  return order.map((k) => groups.get(k)!).filter(Boolean);
}

function ArticleMeta({ article }: { article: GrowthArticle }) {
  return (
    <p className="mt-3 text-sm text-gray-500">
      <span className="text-gray-900">{article.author}</span>
      <span className="mx-2 text-gray-300" aria-hidden>
        ·
      </span>
      <time dateTime={article.date}>{article.date}</time>
    </p>
  );
}

export function GrowthArticlesClient({ articles }: { articles: GrowthArticle[] }) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const raw = searchParams?.get("type") ?? null;
  const filters = useMemo(() => {
    const cats = new Set<string>();
    for (const a of articles) {
      if (a.category && a.category !== "series") cats.add(a.category);
    }
    const sorted = Array.from(cats).sort((a, b) => a.localeCompare(b));
    return [
      { id: FILTER_ALL as FilterId, label: "All" },
      ...sorted.map((c) => ({ id: c as FilterId, label: categoryLabel(c) })),
      { id: "series" as FilterId, label: "Series" },
    ];
  }, [articles]);

  const activeFilter: FilterId = useMemo(() => {
    if (!raw || raw === FILTER_ALL) return FILTER_ALL;
    const ok = filters.some((f) => f.id === raw);
    return ok ? (raw as FilterId) : FILTER_ALL;
  }, [filters, raw]);

  const setFilter = useCallback(
    (id: FilterId) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (id === FILTER_ALL) params.delete("type");
      else params.set("type", id);
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filtered = useMemo(
    () => articles.filter((a) => matchesFilter(a, activeFilter)),
    [articles, activeFilter],
  );

  const topMain = useMemo(() => {
    const hit = filtered.find((a) => a.featured);
    return hit ?? filtered[0];
  }, [filtered]);

  const topRest = useMemo(() => {
    if (!topMain) return [];
    return filtered.filter((a) => a.slug !== topMain.slug).slice(0, 2);
  }, [filtered, topMain]);

  const latest = useMemo(() => {
    const skip = new Set<string>();
    if (topMain) skip.add(topMain.slug);
    topRest.forEach((a) => skip.add(a.slug));
    return filtered.filter((a) => !skip.has(a.slug)).slice(0, 6);
  }, [filtered, topMain, topRest]);

  const spotlight = useCallback(
    (category: string, title: string) => {
      if (activeFilter !== FILTER_ALL && activeFilter !== category) return null;
      const list = articles.filter((a) => a.category === category).slice(0, 3);
      if (list.length === 0) return null;
      const main = list[0];
      const side = list.slice(1, 3);
      return (
        <section className="mt-20 md:mt-24" aria-labelledby={`spotlight-${category}-heading`}>
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-gray-100 pb-4">
            <h2 id={`spotlight-${category}-heading`} className="text-2xl font-semibold tracking-tight text-gray-900">
              {title}
            </h2>
            <div className="flex gap-2" aria-hidden>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400">
                ‹
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-400">
                ›
              </span>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:gap-10">
            <Link
              href={getGrowthArticleHref(main)}
              className="group flex min-h-0 flex-col gap-5 transition-shadow"
            >
              <div className="relative aspect-[16/10] w-full isolate overflow-hidden rounded-2xl ring-1 ring-black/[0.06] transition-shadow hover:shadow-md">
                <Image
                  src={main.image}
                  alt={main.imageAlt}
                  fill
                  className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width:1024px) 100vw, 55vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                  {ARTICLE_CATEGORY_LABEL[main.category]}
                </span>
                <h3 className="mt-2 text-xl font-normal tracking-tight text-gray-900 transition-colors group-hover:text-red-900 md:text-2xl">
                  {main.title}
                </h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600">{main.excerpt}</p>
                <ArticleMeta article={main} />
              </div>
            </Link>
            <div className="flex flex-col gap-6">
              {side.map((article) => (
                <Link
                  key={article.slug}
                  href={getGrowthArticleHref(article)}
                  className="group block w-full rounded-2xl outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2"
                >
                  <div className="isolate overflow-hidden rounded-2xl">
                    <div className="flex items-center gap-4 py-3 pl-0 pr-3 md:gap-5 md:pr-4">
                      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-2xl md:h-[112px] md:w-[112px]">
                        <Image
                          src={article.image}
                          alt={article.imageAlt}
                          fill
                          className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="112px"
                        />
                      </div>
                      <div className="min-w-0 flex-1 py-1 pr-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                          {ARTICLE_CATEGORY_LABEL[article.category]}
                        </span>
                        <h3 className="mt-1 line-clamp-2 text-base font-normal text-gray-900 transition-colors group-hover:text-red-900">
                          {article.title}
                        </h3>
                        <ArticleMeta article={article} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      );
    },
    [activeFilter, articles],
  );

  return (
    <>
      <section
        className="border-b border-gray-100 bg-white pb-12 pt-28 md:pb-16 md:pt-36"
        aria-labelledby="growth-articles-hero-title"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-14 lg:gap-16">
            <BlogHeroCollage />
            <div className="text-center md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Growth</p>
              <h1 id="growth-articles-hero-title" className="mt-3 text-4xl font-normal tracking-tight text-gray-900 md:text-5xl">
                Articles
              </h1>
              <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-gray-600 md:mx-0">
                Messages, studies, and resources to strengthen your walk with God and your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-[88px] z-30 border-b border-gray-100 bg-white/95 py-4 backdrop-blur-md md:top-[100px]">
        <div className="mx-auto max-w-6xl px-4">
          <p className="sr-only" id="article-type-filter-label">
            Filter by article type
          </p>
          <div
            className="flex flex-wrap justify-center gap-2 md:justify-start"
            role="group"
            aria-labelledby="article-type-filter-label"
          >
            {filters.map((f) => {
              const isOn = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 ${
                    isOn
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                  aria-pressed={isOn}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="mx-auto max-w-6xl px-4">
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center text-gray-600">
              No articles in this category yet.
            </p>
          ) : activeFilter === "series" ? (
            /**
             * Series view: group articles by parent series so each series
             * reads as a single collection (matching the homepage "Current
             * series" block's mental model). Each group shows the series
             * title as the row header with its ordered chapters as cards.
             */
            <>
              {groupBySeries(filtered).map((group) => (
                <section
                  key={group.slug}
                  className="mb-20 md:mb-24"
                  aria-labelledby={`series-${group.slug}-heading`}
                >
                  <div className="mb-8 flex items-end justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Series
                      </p>
                      <h2
                        id={`series-${group.slug}-heading`}
                        className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"
                      >
                        {group.title}
                      </h2>
                    </div>
                    <span className="shrink-0 text-sm font-light text-gray-500">
                      {group.items.length}{" "}
                      {group.items.length === 1 ? "part" : "parts"}
                    </span>
                  </div>
                  <ul className="grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((article, i) => (
                      <li key={article.slug}>
                        <Link
                          href={getGrowthArticleHref(article)}
                          className="group block h-full rounded-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2"
                        >
                          <div className="isolate flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-2xl p-3">
                            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl">
                              <Image
                                src={article.image}
                                alt={article.imageAlt}
                                fill
                                className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                sizes="(max-width:1024px) 100vw, 33vw"
                              />
                            </div>
                            <div className="flex min-h-0 flex-1 flex-col px-1 pb-1 pt-0">
                              <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                                Part {article.seriesSort ?? i + 1}
                              </span>
                              <h3 className="mt-2 line-clamp-2 text-lg font-normal tracking-tight text-gray-900 transition-colors group-hover:text-red-900">
                                {article.title}
                              </h3>
                              <ArticleMeta article={article} />
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </>
          ) : (
            <>
              <section className="mb-20 md:mb-24" aria-labelledby="top-articles-heading">
                <h2 id="top-articles-heading" className="mb-10 text-2xl font-semibold tracking-tight text-gray-900">
                  Top articles
                </h2>
                {topMain ? (
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:gap-10">
                    <Link
                      href={getGrowthArticleHref(topMain)}
                      className="group flex min-h-0 flex-col gap-5 transition-shadow"
                    >
                      <div className="relative aspect-[16/10] w-full isolate overflow-hidden rounded-2xl ring-1 ring-black/[0.06] transition-shadow hover:shadow-md">
                        <Image
                          src={topMain.image}
                          alt={topMain.imageAlt}
                          fill
                          className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          sizes="(max-width:1024px) 100vw, 55vw"
                          priority
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6 md:p-8">
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                          {ARTICLE_CATEGORY_LABEL[topMain.category]}
                        </span>
                        <h3 className="mt-2 text-2xl font-normal tracking-tight text-gray-900 transition-colors group-hover:text-red-900 md:text-3xl">
                          {topMain.title}
                        </h3>
                        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-gray-600 md:text-base">{topMain.excerpt}</p>
                        <ArticleMeta article={topMain} />
                      </div>
                    </Link>
                    <div className="flex flex-col gap-6">
                      {topRest.map((article) => (
                        <Link
                          key={article.slug}
                          href={getGrowthArticleHref(article)}
                          className="group block w-full rounded-2xl outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2"
                        >
                          <div className="isolate overflow-hidden rounded-2xl">
                            <div className="flex items-center gap-4 py-3 pl-0 pr-3 md:gap-5 md:pr-4">
                              <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-2xl md:h-[112px] md:w-[112px]">
                                <Image
                                  src={article.image}
                                  alt={article.imageAlt}
                                  fill
                                  className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                  sizes="112px"
                                />
                              </div>
                              <div className="min-w-0 flex-1 py-1 pr-0.5">
                                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                                  {ARTICLE_CATEGORY_LABEL[article.category]}
                                </span>
                                <h3 className="mt-1 line-clamp-2 text-base font-normal text-gray-900 transition-colors group-hover:text-red-900">
                                  {article.title}
                                </h3>
                                <ArticleMeta article={article} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="mb-20 md:mb-24" aria-labelledby="latest-articles-heading">
                <h2 id="latest-articles-heading" className="mb-10 text-2xl font-semibold tracking-tight text-gray-900">
                  Latest
                </h2>
                <ul className="grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
                  {latest.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={getGrowthArticleHref(article)}
                        className="group block h-full rounded-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2"
                      >
                        <div className="isolate flex h-full min-h-0 flex-col gap-3 overflow-hidden rounded-2xl p-3">
                          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl">
                            <Image
                              src={article.image}
                              alt={article.imageAlt}
                              fill
                              className="rounded-2xl object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                              sizes="(max-width:1024px) 100vw, 33vw"
                            />
                          </div>
                          <div className="flex min-h-0 flex-1 flex-col px-1 pb-1 pt-0">
                            <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                              {ARTICLE_CATEGORY_LABEL[article.category]}
                            </span>
                            <h3 className="mt-2 line-clamp-2 text-lg font-normal tracking-tight text-gray-900 transition-colors group-hover:text-red-900">
                              {article.title}
                            </h3>
                            <ArticleMeta article={article} />
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              {spotlight("exodus", "Exodus")}
              {spotlight("bible-study", "Bible Study")}
            </>
          )}

          <section
            className="mt-20 overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 md:mt-28"
            aria-labelledby="growth-articles-subscribe-heading"
          >
            <div className="grid gap-10 p-8 md:grid-cols-2 md:gap-12 md:p-12 lg:gap-16">
              <div className="flex max-w-lg flex-col justify-center">
                <h2 id="growth-articles-subscribe-heading" className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
                  Subscribe to Growth updates
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                  New articles and series — minimal noise, meaningful formation.
                </p>
                <form
                  className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <label htmlFor="growth-subscribe-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="growth-subscribe-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    className="min-h-12 flex-1 rounded-full border border-gray-200 bg-white px-5 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 focus:border-red-900/30 focus:ring-2 focus:ring-red-900/20"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-red-soft px-8 text-sm font-medium text-white shadow-lg shadow-black/15 transition-colors hover:bg-red-soft-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="mt-3 text-xs text-gray-500">
                  Prefer the full form?{" "}
                  <Link href="/contact" className="font-medium text-red-900 underline-offset-2 hover:underline">
                    Contact us
                  </Link>
                  .
                </p>
              </div>
              <div className="relative hidden min-h-[220px] md:block">
                <BlogHeroCollage />
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
