import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const metadata = { title: "Flowers & Donations · Admin · inLovingMemory" };

async function addFlower(formData: FormData) {
  "use server";
  await requireStaffSession();
  const memorialId = formData.get("memorialId") as string;
  const label = formData.get("label") as string;
  const url = (formData.get("url") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const kind = (formData.get("kind") as string) || "FLOWERS";
  if (!memorialId || !label?.trim()) return;
  await prisma.ilmFlowerDonation.create({
    data: { memorialId, label: label.trim(), url, description, kind },
  });
  revalidatePath("/dashboard/admin/flowers");
  redirect("/dashboard/admin/flowers");
}

async function removeFlower(formData: FormData) {
  "use server";
  await requireStaffSession();
  const id = formData.get("id") as string;
  if (id) await prisma.ilmFlowerDonation.delete({ where: { id } });
  revalidatePath("/dashboard/admin/flowers");
  redirect("/dashboard/admin/flowers");
}

export default async function AdminFlowersPage() {
  await requireStaffSession();

  const [items, memorials] = await Promise.all([
    prisma.ilmFlowerDonation.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, label: true, url: true, kind: true, memorial: { select: { displayName: true } } },
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
      <h1 className="dash-page-title">Flowers &amp; donations</h1>
      <p className="dash-page-lead">Add flower shops or donation links to memorials.</p>

      <div className="dash-card-pad mt-10">
        <h2 className="text-lg font-semibold text-earth-900">Add link</h2>
        <form action={addFlower} className="mt-4 space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-earth-700">Memorial</label>
            <select name="memorialId" required className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm">
              <option value="">Select…</option>
              {memorials.map((m) => <option key={m.id} value={m.id}>{m.displayName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-700">Label</label>
              <input name="label" required maxLength={200} placeholder="e.g. Bloom Florist" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700">Type</label>
              <select name="kind" defaultValue="FLOWERS" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm">
                <option value="FLOWERS">Flowers</option>
                <option value="DONATION">Donation</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">URL</label>
            <input name="url" type="url" maxLength={500} placeholder="https://…" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Description (optional)</label>
            <textarea name="description" maxLength={500} rows={2} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="rounded-lg bg-earth-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-earth-900">Add</button>
        </form>
      </div>

      <div className="dash-card mt-6 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">{items.length} links</p>
        </div>
        <ul className="divide-y divide-earth-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="font-medium text-earth-900">{item.label}</p>
                <p className="text-sm text-earth-500">{item.memorial.displayName} · {item.kind}</p>
              </div>
              <form action={removeFlower}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="text-sm font-medium text-red-800 hover:underline">Remove</button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
