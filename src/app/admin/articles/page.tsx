import Link from "next/link";
import { fetchDirectusItems, directusAdminUiUrl } from "@/lib/admin-directus";
import {
  ARTICLE_CATEGORY_LABEL,
  GROWTH_ARTICLES,
  type ArticleCategory,
} from "@/lib/growth-content";

type CmsArticle = {
  id?: string | number;
  slug?: string;
  title?: string;
  category?: string;
  status?: string;
};

const CMS_COLLECTION = process.env.DIRECTUS_ARTICLES_COLLECTION ?? "articles";

function isArticleCategory(v: string): v is ArticleCategory {
  return Object.prototype.hasOwnProperty.call(ARTICLE_CATEGORY_LABEL, v);
}

export default async function AdminArticlesPage() {
  const cmsRows = await fetchDirectusItems<CmsArticle>(CMS_COLLECTION);
  const directusUrl = directusAdminUiUrl();
  const useCms = Boolean(cmsRows && cmsRows.length > 0);

  const cmsByCategory: Partial<Record<ArticleCategory, CmsArticle[]>> = {};
  const cmsOther: CmsArticle[] = [];

  if (useCms && cmsRows) {
    for (const row of cmsRows) {
      const raw = row.category ?? "";
      if (raw && isArticleCategory(raw)) {
        (cmsByCategory[raw] ??= []).push(row);
      } else {
        cmsOther.push(row);
      }
    }
  }

  const staticByCategory = GROWTH_ARTICLES.reduce(
    (acc, a) => {
      acc[a.category] = acc[a.category] ?? [];
      acc[a.category].push(a);
      return acc;
    },
    {} as Record<ArticleCategory, typeof GROWTH_ARTICLES>
  );

  const categories = Object.keys(ARTICLE_CATEGORY_LABEL) as ArticleCategory[];

  return (
    <section className="w-full">
      <h1 className="admin-page-title">Articles</h1>
      <p className="admin-page-lead">
        Growth library content by area. When{" "}
        <code className="rounded bg-black/[0.05] px-1.5 py-0.5 font-mono text-xs text-admin-ink">DIRECTUS_TOKEN</code> is set,
        entries are read from the Directus collection{" "}
        <span className="font-mono text-admin-ink">{CMS_COLLECTION}</span>. Otherwise the in-app scaffold list is shown for
        reference.
      </p>

      {directusUrl ? (
        <p className="mt-4 text-sm text-admin-muted">
          <a href={directusUrl} className="admin-link" target="_blank" rel="noreferrer">
            Open Directus admin
          </a>{" "}
          to edit collections, permissions, and assets.
        </p>
      ) : null}

      <div className="mt-10 space-y-12">
        {categories.map((cat) => {
          const label = ARTICLE_CATEGORY_LABEL[cat];
          const cmsList = cmsByCategory[cat] ?? [];
          const staticList = staticByCategory[cat] ?? [];
          const rows = useCms ? cmsList : staticList;

          return (
            <div key={cat}>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">{label}</h2>
              <div className="admin-card mt-4 overflow-hidden">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3 border-b border-black/[0.06] bg-black/[0.02] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-admin-muted md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
                  <span>Title</span>
                  <span className="hidden md:block">Slug</span>
                  <span>Status</span>
                </div>
                <ul className="divide-y divide-black/[0.05]">
                  {rows.length === 0 ? (
                    <li className="px-6 py-8 text-sm text-admin-muted">No articles in this area yet.</li>
                  ) : useCms ? (
                    (rows as CmsArticle[]).map((row, i) => (
                      <li key={String(row.id ?? row.slug ?? i)} className="px-6 py-4 transition-colors hover:bg-black/[0.02]">
                        <div className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center">
                          <p className="text-sm font-medium text-admin-ink">{row.title ?? "Untitled"}</p>
                          <p className="font-mono text-xs text-admin-muted">{row.slug ?? "—"}</p>
                          <p className="text-sm text-admin-ink/80">{row.status ?? "—"}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    (rows as (typeof GROWTH_ARTICLES)[number][]).map((a) => (
                      <li key={a.slug} className="px-6 py-4 transition-colors hover:bg-black/[0.02]">
                        <div className="grid grid-cols-1 gap-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center">
                          <p className="text-sm font-medium text-admin-ink">{a.title}</p>
                          <p className="font-mono text-xs text-admin-muted">{a.slug}</p>
                          <p className="text-sm text-admin-muted">Scaffold</p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          );
        })}

        {useCms && cmsOther.length > 0 ? (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-admin-muted">Other / uncategorized</h2>
            <ul className="admin-card mt-4 divide-y divide-black/[0.05] overflow-hidden">
              {cmsOther.map((row, i) => (
                <li key={String(row.id ?? row.slug ?? i)} className="px-6 py-4 transition-colors hover:bg-black/[0.02]">
                  <p className="text-sm font-medium text-admin-ink">{row.title ?? "Untitled"}</p>
                  <p className="mt-1 font-mono text-xs text-admin-muted">{row.slug ?? "—"}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <p className="mt-10 text-sm text-admin-muted">
        <Link href="/growth" className="admin-link">
          View public Growth hub
        </Link>{" "}
        ·{" "}
        <Link href="/admin" className="admin-link">
          Admin overview
        </Link>
      </p>
    </section>
  );
}
