import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLE_CATEGORY_LABEL, GROWTH_ARTICLES, getGrowthArticleBySlug } from "@/lib/growth-content";

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

  return (
    <article className="bg-white pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="mx-auto max-w-content px-4">
        <Link
          href="/growth/articles"
          className="text-sm font-medium text-red-900 transition-colors hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
        >
          ← Back to articles
        </Link>
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
          <p className="text-[15px] leading-relaxed text-gray-600 md:text-lg">
            Full article content will load here from your CMS when connected. This page confirms routing and layout
            for “{article.title}”.
          </p>
        </div>
      </div>
    </article>
  );
}
