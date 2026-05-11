import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Services · Admin · inLovingMemory" };

async function createProvider(formData: FormData) {
  "use server";
  await requireStaffSession();
  const name = (formData.get("name") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  if (!name || !categoryId) return;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
  await prisma.ilmServiceProvider.create({ data: { name, slug, categoryId, description, location, phone, email, website } });
  revalidatePath("/dashboard/admin/services");
  redirect("/dashboard/admin/services");
}

async function deleteProvider(formData: FormData) {
  "use server";
  await requireStaffSession();
  const id = (formData.get("id") as string)?.trim();
  if (id) await prisma.ilmServiceProvider.delete({ where: { id } });
  revalidatePath("/dashboard/admin/services");
  redirect("/dashboard/admin/services");
}

async function toggleProvider(formData: FormData) {
  "use server";
  await requireStaffSession();
  const id = (formData.get("id") as string)?.trim();
  if (id) {
    const p = await prisma.ilmServiceProvider.findUnique({ where: { id }, select: { isActive: true } });
    if (p) await prisma.ilmServiceProvider.update({ where: { id }, data: { isActive: !p.isActive } });
  }
  revalidatePath("/dashboard/admin/services");
  redirect("/dashboard/admin/services");
}

export default async function AdminServicesPage() {
  await requireStaffSession();

  const [providers, categories] = await Promise.all([
    prisma.ilmServiceProvider.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, slug: true, category: { select: { label: true } }, location: true, email: true, isActive: true },
      take: 100,
    }),
    prisma.ilmServiceCategory.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, label: true } }),
  ]);

  return (
    <section className="w-full">
      <h1 className="dash-page-title">Service providers</h1>
      <p className="dash-page-lead">Manage vendor listings across all categories.</p>

      {/* Add provider */}
      <div className="dash-card-pad mt-10">
        <h2 className="text-lg font-semibold text-earth-900">Add provider</h2>
        <form action={createProvider} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-earth-700">Name</label>
            <input name="name" required maxLength={200} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Category</label>
            <select name="categoryId" required className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm">
              <option value="">Select…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Location</label>
            <input name="location" maxLength={200} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Phone</label>
            <input name="phone" maxLength={50} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Email</label>
            <input name="email" type="email" maxLength={200} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-700">Website</label>
            <input name="website" type="url" maxLength={500} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-earth-700">Description</label>
            <textarea name="description" rows={2} maxLength={1000} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-lg bg-earth-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-earth-900">Add provider</button>
          </div>
        </form>
      </div>

      {/* Provider list */}
      <div className="dash-card mt-6 overflow-hidden">
        <div className="border-b border-earth-100 bg-earth-50/50 px-6 py-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">{providers.length} providers</p>
        </div>
        <ul className="divide-y divide-earth-100">
          {providers.map((p) => (
            <li key={p.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="font-medium text-earth-900">
                  {p.name}
                  {!p.isActive ? <span className="ml-2 text-xs text-red-500">(inactive)</span> : null}
                </p>
                <p className="text-sm text-earth-500">
                  {p.category.label}{p.location ? ` · ${p.location}` : null}{p.email ? ` · ${p.email}` : null}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={toggleProvider}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="text-sm font-medium text-earth-600 hover:underline">
                    {p.isActive ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <form action={deleteProvider}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="text-sm font-medium text-red-800 hover:underline">Remove</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
