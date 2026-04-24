import type { Metadata } from "next";

import {
  GROWTH_ARTICLES,
  ARTICLE_CATEGORY_LABEL,
  getGrowthArticleByCategoryAndSlug,
  growthRouteTypeToCategory,
} from "@/lib/growth-content";
import { GrowthArticleDetail } from "@/app/growth/_components/GrowthArticleDetail";

type Props = { params: { type: string; slug: string } };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = params;
  if (type === "series") return { title: "Series | theWalk Ministries" };

  const category = growthRouteTypeToCategory(type);
  const article =
    (await getGrowthArticleByCategoryAndSlug(category, slug)) ??
    GROWTH_ARTICLES.find((a) => a.slug === slug && a.category === category);

  const label = ARTICLE_CATEGORY_LABEL[category] ?? "Article";
  if (!article) return { title: `${label} | theWalk Ministries` };
  return { title: `${article.title} | theWalk Ministries`, description: article.excerpt };
}

export default async function GrowthAnyCategoryArticlePage({ params }: Props) {
  const { type, slug } = params;
  if (type === "series") return await GrowthArticleDetail({ article: null });

  const category = growthRouteTypeToCategory(type);
  const article =
    (await getGrowthArticleByCategoryAndSlug(category, slug)) ??
    GROWTH_ARTICLES.find((a) => a.slug === slug && a.category === category) ??
    null;

  return await GrowthArticleDetail({ article });
}

