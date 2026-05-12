import Link from "next/link";
import { getDirectusConfig, directusGetJson } from "@/lib/cms/directus-client";

export const metadata = { title: "Blog · Resources · inLovingMemory" };
export const dynamic = "force-dynamic";

interface DirectusArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  date_published?: string;
  category?: string;
  author?: string;
}

export default async function BlogPage() {
  let posts: DirectusArticle[] = [];

  if (getDirectusConfig()) {
    try {
      const data = await directusGetJson<{ data: DirectusArticle[] }>(
        "/items/articles?fields=id,title,slug,excerpt,image,date_published,category&sort=-date_published&filter[status][_eq]=published"
      );
      posts = data.data ?? [];
    } catch { /* use empty list */ }
  }

  return (
    <main className="pb-24">
      <section className="relative flex h-[42vh] min-h-[320px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-10 pt-28 md:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Resources</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">Blog</h1>
        </div>
      </section>

      <div className="ilm-container py-12">
        <Link href="/resources" className="dash-link text-sm">← Resources</Link>

        {posts.length === 0 ? (
          <p className="mt-12 text-center text-earth-500">No blog posts yet. Check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/resources/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-sm transition hover:border-earth-300 hover:shadow-md"
              >
                {post.image ? (
                  <div className="aspect-[16/9] overflow-hidden bg-earth-100">
                    <img
                      src={post.image}
                      alt=""
                      className="h-full w-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-earth-100 to-earth-200" />
                )}
                <div className="p-5">
                  {post.category ? (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-calm-500">{post.category}</p>
                  ) : null}
                  <h2 className="mt-1 text-base font-semibold text-earth-900 transition-colors group-hover:text-calm-600">
                    {post.title}
                  </h2>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-earth-500">{post.excerpt}</p>
                  ) : null}
                  <div className="mt-3 flex items-center gap-3 text-xs text-earth-400">
                    {post.author ? <span>{post.author}</span> : null}
                    {post.date_published ? (
                      <span>{new Date(post.date_published).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
