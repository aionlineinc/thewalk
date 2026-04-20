import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ARTICLE_CATEGORY_LABEL,
  GROWTH_ARTICLES,
  getGrowthArticleBySlug,
  getGrowthArticles,
} from "@/lib/growth-content";
import { renderProseParagraphs } from "@/lib/cms/prose";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return GROWTH_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const article = (await getGrowthArticleBySlug(slug)) ?? GROWTH_ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: "Article | theWalk Ministries" };
  return {
    title: `${article.title} | theWalk Ministries`,
    description: article.excerpt,
  };
}

export default async function GrowthArticleDetailPage({ params }: Props) {
  const { slug } = params;
  const article = (await getGrowthArticleBySlug(slug)) ?? GROWTH_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  // Resolve the article's sibling chapters so we can show a "Part N of M"
  // pill and a "More in this series" list at the bottom of the article.
  // Sibling lookup is best-effort: if the CMS is unreachable we fall back
  // to the scaffold list (same source as the list view), so the detail
  // page is always internally consistent with whatever the list shows.
  const siblings = article.series
    ? (await getGrowthArticles())
        .filter(
          (a) =>
            a.series?.slug === article.series!.slug && a.slug !== article.slug,
        )
        .sort(
          (a, b) =>
            (a.seriesSort ?? Number.POSITIVE_INFINITY) -
            (b.seriesSort ?? Number.POSITIVE_INFINITY),
        )
    : [];
  const totalParts = article.series ? siblings.length + 1 : 0;
  const partLabel =
    article.series && article.seriesSort != null
      ? `Part ${article.seriesSort}${totalParts > 1 ? ` of ${totalParts}` : ""}`
      : null;

  return (
    <article className="bg-white pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-content px-4">
        <Link
          href="/growth/articles"
          className="text-sm font-medium text-red-900 transition-colors hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
        >
          ← Back to articles
        </Link>
        {article.series ? (
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 md:px-5 md:py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              Part of a series
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <Link
                href={`/growth/articles?type=series`}
                className="text-base font-medium tracking-tight text-gray-900 hover:text-red-900 md:text-lg"
              >
                {article.series.title}
              </Link>
              {partLabel ? (
                <span className="text-sm font-light text-gray-500">
                  {partLabel}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
        <header className="mt-8">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            {ARTICLE_CATEGORY_LABEL[article.category]}
          </span>
          <h1 className="mt-3 text-3xl font-normal tracking-tight text-gray-900 md:text-4xl lg:text-[2.75rem]">
            {article.title}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-gray-600 md:text-lg">{article.excerpt}</p>
          <p className="mt-6 text-sm text-gray-500">
            <span className="text-gray-900">{article.author}</span>
            <span className="mx-2 text-gray-300">·</span>
            <time dateTime={article.date}>{article.date}</time>
          </p>
        </header>
        <div className="relative mt-10 aspect-[16/9] w-full isolate overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/[0.06]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            className="object-cover rounded-2xl"
            sizes="(max-width:850px) 100vw, 850px"
            priority
          />
        </div>
        <div className="mt-12 max-w-none">
          <div className="space-y-5 text-[15px] leading-relaxed text-gray-600 md:text-lg">
            {article.body
              ? renderProseParagraphs(article.body, {
                  paragraphClassName:
                    "text-[15px] leading-relaxed text-gray-600 md:text-lg",
                })
              : (
                  <p className="text-[15px] leading-relaxed text-gray-600 md:text-lg">
                    {article.excerpt}
                  </p>
                )}
          </div>
        </div>

        {siblings.length > 0 && article.series ? (
          <aside
            className="mt-16 rounded-3xl border border-gray-100 bg-gray-50 p-6 md:mt-20 md:p-8"
            aria-labelledby={`series-more-${article.series.slug}`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              More in this series
            </p>
            <h2
              id={`series-more-${article.series.slug}`}
              className="mt-1 text-xl font-semibold tracking-tight text-gray-900 md:text-2xl"
            >
              {article.series.title}
            </h2>
            <ul className="mt-6 grid list-none gap-6 p-0 sm:grid-cols-2">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/growth/articles/${s.slug}`}
                    className="group flex gap-4 rounded-2xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red-900 focus-visible:ring-offset-2"
                  >
                    <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {s.image ? (
                        <Image
                          src={s.image}
                          alt={s.imageAlt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="84px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                        Part {s.seriesSort ?? ""}
                      </span>
                      <h3 className="mt-1 line-clamp-2 text-base font-medium text-gray-900 transition-colors group-hover:text-red-900">
                        {s.title}
                      </h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </article>
  );
}
