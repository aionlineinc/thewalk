import Link from "next/link";
import { fetchDirectusItems, directusAdminUiUrl } from "@/lib/admin-directus";

type CmsCourse = {
  id?: string | number;
  slug?: string;
  title?: string;
  status?: string;
};

const CMS_COLLECTION = process.env.DIRECTUS_COURSES_COLLECTION ?? "courses";

export default async function AdminCoursesPage() {
  const rows = await fetchDirectusItems<CmsCourse>(CMS_COLLECTION);
  const directusUrl = directusAdminUiUrl();

  return (
    <section className="w-full">
      <h1 className="admin-page-title">Courses</h1>
      <p className="admin-page-lead">
        Course records from Directus when{" "}
        <code className="rounded bg-black/[0.05] px-1.5 py-0.5 font-mono text-xs text-admin-ink">DIRECTUS_TOKEN</code> is
        configured. Collection name defaults to <span className="font-mono text-admin-ink">{CMS_COLLECTION}</span> (override
        with <span className="font-mono text-admin-ink">DIRECTUS_COURSES_COLLECTION</span>).
      </p>

      {directusUrl ? (
        <p className="mt-4 text-sm text-admin-muted">
          <a href={directusUrl} className="admin-link" target="_blank" rel="noreferrer">
            Open Directus admin
          </a>
        </p>
      ) : null}

      <div className="admin-card mt-8 overflow-hidden">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-black/[0.06] bg-black/[0.02] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-admin-muted">
          <span>Title</span>
          <span>Slug</span>
          <span>Status</span>
        </div>
        <ul className="divide-y divide-black/[0.05]">
          {rows === null ? (
            <li className="px-6 py-10 text-sm text-admin-muted">
              Connect Directus by setting <span className="font-mono text-admin-ink">DIRECTUS_URL</span> and a server{" "}
              <span className="font-mono text-admin-ink">DIRECTUS_TOKEN</span>, then create a{" "}
              <span className="font-mono text-admin-ink">{CMS_COLLECTION}</span> collection (or point the env var at your
              collection name).
            </li>
          ) : rows.length === 0 ? (
            <li className="px-6 py-10 text-sm text-admin-muted">No courses returned from Directus yet.</li>
          ) : (
            rows.map((row, i) => (
              <li key={String(row.id ?? row.slug ?? i)} className="px-6 py-4 transition-colors hover:bg-black/[0.02]">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3">
                  <p className="truncate text-sm font-medium text-admin-ink">{row.title ?? "Untitled"}</p>
                  <p className="truncate font-mono text-xs text-admin-muted">{row.slug ?? "—"}</p>
                  <p className="text-sm text-admin-ink/80">{row.status ?? "—"}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <p className="mt-8 text-sm text-admin-muted">
        <Link href="/admin" className="admin-link">
          Admin overview
        </Link>
      </p>
    </section>
  );
}
