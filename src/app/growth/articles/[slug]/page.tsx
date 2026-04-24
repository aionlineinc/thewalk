import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  GROWTH_ARTICLES,
  getGrowthArticleHref,
  getGrowthArticleBySlug,
} from "@/lib/growth-content";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  // This route is CMS-driven; slugs can change without a code deploy.
  // Avoid static params so new articles become available immediately.
  return [];
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
  if (article) redirect(getGrowthArticleHref(article));
  redirect("/growth/articles");
}
