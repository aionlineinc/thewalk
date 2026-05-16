import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "New organisation · inLovingMemory" };

async function createOrganisation(formData: FormData) {
  "use server";
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const name = (formData.get("name") as string)?.trim();
  const kind = (formData.get("kind") as string) || "FUNERAL_HOME";
  const adminUserId = (formData.get("adminUserId") as string) || "";
  const tier = (formData.get("tier") as string) || "starter";

  if (!name || !adminUserId) redirect("/dashboard/admin/organisations/new?error=missing");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

  await prisma.ilmOrgAccount.create({
    data: {
      kind: kind as "FUNERAL_HOME" | "MINISTRY",
      name,
      slug,
      tier,
      adminUserId,
    },
  });

  revalidatePath("/dashboard/admin/organisations");
  redirect("/dashboard/admin/organisations");
}

export default async function NewOrganisationPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (!user || user.role !== "SUPER_ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  const error = searchParams.error === "missing";

  return (
    <section className="w-full">
      <Link href="/dashboard/admin/organisations" className="dash-link text-sm">
        ← Organisations
      </Link>
      <h1 className="dash-page-title mt-6">New organisation</h1>
      <p className="dash-page-lead">Create a funeral home or ministry account.</p>

      {error ? <p className="mt-4 text-sm text-red-800">Name and admin user are required.</p> : null}

      <div className="dash-card-pad mt-6">
        <form action={createOrganisation} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-earth-800">Organisation name</label>
            <input
              name="name"
              type="text"
              required
              maxLength={200}
              className="mt-1.5 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-800">Type</label>
            <select
              name="kind"
              className="mt-1.5 w-full max-w-xs rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            >
              <option value="FUNERAL_HOME">Funeral Home</option>
              <option value="MINISTRY">Ministry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-800">Admin user</label>
            <select
              name="adminUserId"
              required
              className="mt-1.5 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            >
              <option value="">Select a user…</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || "Unnamed"} ({u.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-800">Tier</label>
            <select
              name="tier"
              className="mt-1.5 w-full max-w-xs rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            >
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-calm-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-600"
          >
            Create organisation
          </button>
        </form>
      </div>
    </section>
  );
}
