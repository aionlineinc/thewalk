import type { Metadata } from "next";

import { GROWTH_ARTICLES, getGrowthSeriesArticleBySeriesSlugAndSlug } from "@/lib/growth-content";
import { GrowthArticleDetail } from "@/app/growth/_components/GrowthArticleDetail";

type Props = { params: { series: string; slug: string } };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { series, slug } = params;
  const article =
    (await getGrowthSeriesArticleBySeriesSlugAndSlug(series, slug)) ??
    GROWTH_ARTICLES.find((a) => a.slug === slug && a.series?.slug === series);
  if (!article) return { title: "Series | theWalk Ministries" };
  return { title: `${article.title} | theWalk Ministries`, description: article.excerpt };
}

export default async function GrowthSeriesArticlePage({ params }: Props) {
  const { series, slug } = params;
  const article =
    (await getGrowthSeriesArticleBySeriesSlugAndSlug(series, slug)) ??
    GROWTH_ARTICLES.find((a) => a.slug === slug && a.series?.slug === series) ??
    null;
  return await GrowthArticleDetail({ article });
}

