import type { Metadata } from "next";

import { GROWTH_ARTICLES, getGrowthArticleByCategoryAndSlug } from "@/lib/growth-content";
import { GrowthArticleDetail } from "@/app/growth/_components/GrowthArticleDetail";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const article =
    (await getGrowthArticleByCategoryAndSlug("exodus", slug)) ??
    GROWTH_ARTICLES.find((a) => a.slug === slug && a.category === "exodus");
  if (!article) return { title: "Exodus | theWalk Ministries" };
  return { title: `${article.title} | theWalk Ministries`, description: article.excerpt };
}

export default async function GrowthExodusPage({ params }: Props) {
  const { slug } = params;
  const article =
    (await getGrowthArticleByCategoryAndSlug("exodus", slug)) ??
    GROWTH_ARTICLES.find((a) => a.slug === slug && a.category === "exodus") ??
    null;
  return await GrowthArticleDetail({ article });
}

