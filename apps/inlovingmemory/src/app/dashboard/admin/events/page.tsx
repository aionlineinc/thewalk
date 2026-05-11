import Link from "next/link";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Events · Admin · inLovingMemory" };

export default async function AdminEventsPage() {
  await requireStaffSession();

  const events = await prisma.ilmEvent.findMany({
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      kind: true,
      title: true,
      startsAt: true,
      venue: true,
      officiant: true,
      memorial: { select: { displayName: true, slug: true } },
      _count: { select: { rsvps: true } },
    },
    take: 100,
  });

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Events</h1>
      <p className="dash-page-lead">All service events across memorials with RSVP counts.</p>

      <div className="dash-card mt-10 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">{events.length} events</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-earth-100 bg-earth-50/30">
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Memorial</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Kind</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Title</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Date</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Venue</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">Officiant</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">RSVPs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-100">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-earth-50/50">
                  <td className="px-6 py-3">
                    <Link className="dash-link text-sm" href={`/memorial/${e.memorial.slug}`}>
                      {e.memorial.displayName}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-earth-600">{e.kind}</td>
                  <td className="px-6 py-3 text-earth-600">{e.title || "—"}</td>
                  <td className="px-6 py-3 text-earth-600">
                    {e.startsAt
                      ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(e.startsAt)
                      : "—"}
                  </td>
                  <td className="px-6 py-3 text-earth-600">{e.venue || "—"}</td>
                  <td className="px-6 py-3 text-earth-600">{e.officiant || "—"}</td>
                  <td className="px-6 py-3 text-earth-600">{e._count.rsvps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
