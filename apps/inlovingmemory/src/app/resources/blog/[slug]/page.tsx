import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDirectusConfig, directusGetJson } from "@/lib/cms/directus-client";

export const dynamic = "force-dynamic";
const ILM_ARTICLES_APP = process.env.ILM_ARTICLES_APP?.trim() || "inlovingmemory";

interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  body?: string;
  date_published?: string;
  category?: string;
  author?: string;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (!getDirectusConfig()) return { title: "Blog · inLovingMemory" };
  try {
    const data = await directusGetJson<{ data: BlogPost[] }>(
      `/items/articles?filter[slug][_eq]=${encodeURIComponent(params.slug)}&filter[status][_eq]=published&filter[app][_eq]=${encodeURIComponent(ILM_ARTICLES_APP)}&limit=1`
    );
    const post = data.data?.[0];
    if (!post) return { title: "Blog · inLovingMemory" };
    return { title: `${post.title} · Blog · inLovingMemory`, description: post.excerpt };
  } catch { return { title: "Blog · inLovingMemory" }; }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  if (!getDirectusConfig()) notFound();

  let post: BlogPost | null = null;
  try {
    const data = await directusGetJson<{ data: BlogPost[] }>(
      `/items/articles?filter[slug][_eq]=${encodeURIComponent(params.slug)}&filter[status][_eq]=published&filter[app][_eq]=${encodeURIComponent(ILM_ARTICLES_APP)}&limit=1`
    );
    post = data.data?.[0] ?? null;
  } catch { /* not found */ }

  if (!post) notFound();

  return (
    <main className="pb-24">
      <section className="relative flex h-[42vh] min-h-[320px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          {post.image ? (
            <img src={post.image} alt="" className="h-full w-full object-cover" loading="eager" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-10 pt-28 md:pb-14">
          {post.category ? (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">{post.category}</p>
          ) : null}
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-white md:text-[42px] md:leading-[1.1]">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-white/60">
            {post.author ? <span>{post.author}</span> : null}
            {post.date_published ? (
              <span>{new Date(post.date_published).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</span>
            ) : null}
          </div>
        </div>
      </section>

      <article className="ilm-container py-12">
        <Link href="/resources/blog" className="dash-link text-sm">← Blog</Link>

        <div className="mx-auto mt-10 max-w-2xl">
          {post.body ? (
            <div className="prose prose-earth max-w-none" dangerouslySetInnerHTML={{ __html: post.body }} />
          ) : (
            <p className="text-earth-500">No content yet.</p>
          )}
        </div>
      </article>
    </main>
  );
}
