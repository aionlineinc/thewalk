import Link from "next/link";
import { createOrganization } from "./actions";
import { adminOrganizationsPageData } from "@/server/admin/queries";

type OrgRow = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  createdAt: Date;
  _count: { memberships: number };
};

export default async function AdminOrganizationsPage() {
  const { orgs } = await adminOrganizationsPageData();

  return (
    <section className="w-full max-w-5xl">
      <h1 className="admin-page-title">Organizations</h1>
      <p className="admin-page-lead">Create organizations and assign users from the Users page.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          action={async (formData) => {
            "use server";
            await createOrganization(formData);
          }}
          className="admin-card p-6 sm:p-7"
        >
          <h2 className="text-lg font-semibold tracking-tight text-admin-ink">Create organization</h2>
          <p className="mt-2 text-sm text-admin-muted">Use for ministries, partner organizations, or internal groups.</p>

          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-admin-muted">Name</span>
              <input
                name="name"
                required
                className="mt-2 w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-admin-ink outline-none transition-colors focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
                placeholder="Example Ministry"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-admin-muted">Slug</span>
              <input
                name="slug"
                required
                className="mt-2 w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-admin-ink outline-none transition-colors focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
                placeholder="example-ministry"
              />
              <span className="mt-1 block text-xs text-admin-muted">Lowercase, numbers, dashes.</span>
            </label>
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-admin-muted">Kind</span>
              <input
                name="kind"
                defaultValue="organization"
                className="mt-2 w-full rounded-xl border border-black/[0.08] bg-white px-4 py-3 text-sm text-admin-ink outline-none transition-colors focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
                placeholder="ministry"
              />
            </label>
          </div>

          <button type="submit" className="admin-btn-primary mt-6 w-full rounded-full py-3.5">
            Create
          </button>
        </form>

        <div className="admin-card overflow-hidden">
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-black/[0.06] bg-black/[0.02] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-admin-muted">
            <span>Organization</span>
            <span>Members</span>
            <span>Created</span>
          </div>
          <ul className="divide-y divide-black/[0.05]">
            {orgs.map((o) => (
              <li key={o.id} className="px-6 py-4 transition-colors hover:bg-black/[0.02]">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-admin-ink">{o.name}</p>
                    <p className="mt-0.5 truncate text-xs text-admin-muted">
                      <span className="font-medium text-admin-ink/80">{o.slug}</span> · {o.kind}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-admin-ink">{o._count.memberships}</p>
                  <p className="text-sm text-admin-muted">{o.createdAt.toISOString().slice(0, 10)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 text-sm text-admin-muted">
        Back to <Link href="/admin" className="admin-link">Admin overview</Link>.
      </p>
    </section>
  );
}
