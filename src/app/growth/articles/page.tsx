import type { Metadata } from "next";
import { Suspense } from "react";
import { GrowthArticlesClient } from "@/components/growth/GrowthArticlesClient";
import { GROWTH_ARTICLES } from "@/lib/growth-content";

export const metadata: Metadata = {
  title: "Articles | Growth | theWalk Ministries",
  description:
    "Browse articles, studies, and series — filter by topic and grow in faith with theWalk.",
};

function ArticlesShell() {
  return <GrowthArticlesClient articles={GROWTH_ARTICLES} />;
}

export default function GrowthArticlesPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-white pt-32" aria-busy="true" />}>
      <ArticlesShell />
    </Suspense>
  );
}
