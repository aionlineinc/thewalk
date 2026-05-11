import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { createEvent, deleteEvent, addFlower, removeFlower } from "./actions";

export const metadata = { title: "Funeral Services · Admin · inLovingMemory" };

export default async function AdminFuneralPage() {
  await requireStaffSession();

  const [events, flowers, memorials] = await Promise.all([
    prisma.ilmEvent.findMany({
      orderBy: { startsAt: "asc" },
      select: {
        id: true, kind: true, title: true, startsAt: true, venue: true, officiant: true,
        streamUrl: true,
        memorial: { select: { displayName: true, slug: true } },
      },
      take: 100,
    }),
    prisma.ilmFlowerDonation.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, label: true, kind: true, memorial: { select: { displayName: true } } },
      take: 100,
    }),
    prisma.ilmMemorial.findMany({
      orderBy: { displayName: "asc" },
      select: { id: true, displayName: true },
      take: 200,
    }),
  ]);

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Funeral services</h1>
      <p className="dash-page-lead">Manage events, flowers, and donations.</p>

      {/* Add Event */}
      <div className="dash-card-pad mt-10">
        <h2 className="text-lg font-semibold text-earth-900">Add event</h2>
        <form action={createEvent} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-earth-700">Memorial</label>
            <select name="memorialId" required className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm">
              <option value="">Select…</option>
              {memorials.map((m) => <option key={m.id} value={m.id}>{m.displayName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Kind</label>
            <select name="kind" defaultValue="FUNERAL" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm">
              <option value="FUNERAL">Funeral</option>
              <option value="VISITATION">Visitation</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Title</label>
            <input name="title" maxLength={200} placeholder="e.g. Celebration of Life" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Date & time</label>
            <input name="startsAt" type="datetime-local" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Venue</label>
            <input name="venue" maxLength={200} placeholder="e.g. St. Mary's Church" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Address</label>
            <input name="address" maxLength={300} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Map URL</label>
            <input name="mapUrl" type="url" maxLength={500} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Officiant</label>
            <input name="officiant" maxLength={200} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-earth-700">Program details</label>
            <textarea name="programDetails" rows={3} maxLength={2000} placeholder="Hymns, readings, eulogies, order of service…" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Stream URL</label>
            <input name="streamUrl" type="url" maxLength={500} placeholder="YouTube or Vimeo livestream" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-lg bg-earth-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-earth-900">Add event</button>
          </div>
        </form>
      </div>

      {/* Event list */}
      <div className="dash-card mt-6 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">{events.length} events</p>
        </div>
        <ul className="divide-y divide-earth-100">
          {events.map((e) => (
            <li key={e.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="font-medium text-earth-900">{e.title || e.kind}</p>
                <p className="text-sm text-earth-500">
                  {e.memorial.displayName}{e.venue ? ` · ${e.venue}` : null}{e.officiant ? ` · ${e.officiant}` : null}
                </p>
              </div>
              <form action={deleteEvent}>
                <input type="hidden" name="id" value={e.id} />
                <button type="submit" className="text-sm font-medium text-red-800 hover:underline">Remove</button>
              </form>
            </li>
          ))}
        </ul>
      </div>

      {/* Flowers & Donations */}
      <div className="dash-card-pad mt-10">
        <h2 className="text-lg font-semibold text-earth-900">Flowers &amp; donations</h2>
        <p className="mt-1 text-sm text-earth-500">Add links to flower shops or donation pages. These appear on the funeral service tab of the selected memorial page.</p>
        <form action={addFlower} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-earth-700">Memorial page</label>
            <select name="memorialId" required className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm">
              <option value="">Select a memorial…</option>
              {memorials.map((m) => <option key={m.id} value={m.id}>{m.displayName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Display name</label>
            <input name="label" required maxLength={200} placeholder="e.g. Bloom Florist" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Link type</label>
            <select name="kind" defaultValue="FLOWERS" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm">
              <option value="FLOWERS">💐 Flowers (link to a florist)</option>
              <option value="DONATION">💝 Donation (link to a charity or cause)</option>
              <option value="FLOWERS">Flowers</option>
              <option value="DONATION">Donation</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Link URL</label>
            <input name="url" type="url" maxLength={500} placeholder="https://www.bloomflorist.com/..." className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-earth-700">Description <span className="font-normal text-earth-500">(optional — shown below the link on the memorial page)</span></label>
            <textarea name="description" rows={2} maxLength={500} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-lg bg-earth-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-earth-900">Add to memorial</button>
          </div>
        </form>
      </div>

      <div className="dash-card mt-6 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">{flowers.length} existing links</p>
        </div>
        <ul className="divide-y divide-earth-100">
          {flowers.map((f) => (
            <li key={f.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="font-medium text-earth-900">{f.label} <span className="text-xs font-normal text-earth-500">({f.kind === "DONATION" ? "Donation" : "Flowers"})</span></p>
                <p className="text-sm text-earth-500">on {f.memorial.displayName}&apos;s memorial page</p>
              </div>
              <form action={removeFlower}>
                <input type="hidden" name="id" value={f.id} />
                <button type="submit" className="text-sm font-medium text-red-800 hover:underline">Remove</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
