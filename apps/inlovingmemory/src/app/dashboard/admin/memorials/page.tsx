import Link from "next/link";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Memorials · Admin · inLovingMemory",
};

export default async function AdminMemorialsPage() {
  await requireStaffSession();

  const memorials = await prisma.ilmMemorial.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      displayName: true,
      kind: true,
      tier: true,
      privacyLevel: true,
      createdAt: true,
      pageKeeper: { select: { email: true, name: true } },
    },
  });

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Memorials</h1>
      <p className="dash-page-lead">All memorial pages in the system.</p>

      <div className="dash-card mt-10 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">
            {memorials.length} memorials
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-earth-100 bg-earth-50/30">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Name</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Kind</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Tier</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Keeper</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Privacy</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {memorials.map((m) => (
                <tr key={m.id} className="hover:bg-earth-50/50">
                  <td className="px-6 py-3 font-medium text-earth-900">{m.displayName}</td>
                  <td className="px-6 py-3 text-earth-600">
                    {m.kind === "LIVING_LEGACY" ? "Living legacy" : "Memorial"}
                  </td>
                  <td className="px-6 py-3 text-earth-600">{m.tier}</td>
                  <td className="px-6 py-3 text-earth-600">
                    {m.pageKeeper.name || m.pageKeeper.email}
                  </td>
                  <td className="px-6 py-3 text-earth-600">{m.privacyLevel.replace(/_/g, " ")}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-3">
                      <Link className="dash-link text-sm" href={`/memorial/${m.slug}`}>
                        View
                      </Link>
                      <Link className="dash-link text-sm" href={`/dashboard/memorials/${m.id}/edit`}>
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
