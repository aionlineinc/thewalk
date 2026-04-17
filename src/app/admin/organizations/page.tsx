import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "../_components/AdminNav";
import { createOrganization } from "./actions";

export default async function AdminOrganizationsPage() {
  const session = await getServerSession(authOptions);

  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      kind: true,
      createdAt: true,
      _count: { select: { memberships: true } },
    },
  });

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-earth-900">Organizations</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Signed in as <span className="font-medium">{session?.user?.email}</span>
      </p>

      <div className="mt-6">
        <AdminNav />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form
          action={async (formData) => {
            "use server";
            await createOrganization(formData);
          }}
          className="rounded-2xl border border-earth-100 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold tracking-tight text-earth-900">Create organization</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use for ministries, partner organizations, or internal groups.
          </p>

          <div className="mt-5 space-y-3">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-earth-700">Name</span>
              <input
                name="name"
                required
                className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-red-500/40"
                placeholder="Example Ministry"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-earth-700">Slug</span>
              <input
                name="slug"
                required
                className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-red-500/40"
                placeholder="example-ministry"
              />
              <span className="mt-1 block text-xs text-muted-foreground">Lowercase, numbers, dashes.</span>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-earth-700">Kind</span>
              <input
                name="kind"
                defaultValue="organization"
                className="mt-2 w-full rounded-xl border border-earth-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-red-500/40"
                placeholder="ministry"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-earth-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-earth-900/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900/40"
          >
            Create
          </button>
        </form>

        <div className="overflow-hidden rounded-2xl border border-earth-100 bg-white shadow-sm">
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-earth-100 bg-muted px-6 py-3 text-xs font-semibold uppercase tracking-widest text-earth-700">
            <span>Organization</span>
            <span>Members</span>
            <span>Created</span>
          </div>
          <ul className="divide-y divide-earth-100">
            {orgs.map((o) => (
              <li key={o.id} className="px-6 py-4">
                <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-earth-900">{o.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      <span className="font-medium">{o.slug}</span> · {o.kind}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-earth-800">{o._count.memberships}</p>
                  <p className="text-sm text-muted-foreground">{o.createdAt.toISOString().slice(0, 10)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Back to <Link href="/admin" className="app-link">Admin overview</Link>.
      </p>
    </section>
  );
}

