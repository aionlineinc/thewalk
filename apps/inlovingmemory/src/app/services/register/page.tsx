import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Register as a service provider · inLovingMemory" };
export const dynamic = "force-dynamic";

async function registerProvider(formData: FormData) {
  "use server";
  const name = (formData.get("name") as string)?.trim();
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || null;
  const website = (formData.get("website") as string)?.trim() || null;
  const location = (formData.get("location") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name || !categoryId || !email) {
    redirect("/services/register?error=missing");
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

  // If a user with this email exists, link them
  const user = await prisma.user.findFirst({ where: { email: email.toLowerCase() } });

  await prisma.ilmServiceProvider.create({
    data: {
      name,
      slug,
      categoryId,
      email,
      phone,
      website,
      location,
      description,
      userId: user?.id ?? null,
    },
  });

  // Promote existing user to VENDOR if not already staff
  if (user && user.role === "MEMBER") {
    await prisma.user.update({ where: { id: user.id }, data: { role: "VENDOR" } });
  }

  revalidatePath("/services");
  redirect("/services/register?done=1");
}

export default async function RegisterProviderPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const done = searchParams.done === "1";
  const error = searchParams.error === "missing";

  const categories = await prisma.ilmServiceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, label: true },
  });

  return (
    <main className="pb-24">
      <section className="relative flex h-[42vh] min-h-[320px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
          <div className="absolute inset-0 bg-[#7c4a1e]/15 mix-blend-overlay" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-10 pt-28 md:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">For vendors</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">Register as a provider</h1>
        </div>
      </section>

      <div className="ilm-container py-12">
        {done ? (
          <div className="dash-card-pad mx-auto max-w-xl text-center">
            <h2 className="text-xl font-semibold text-earth-900">Thank you!</h2>
            <p className="mt-3 text-earth-600">Your provider listing has been submitted. An administrator will review it shortly. If you have an existing account with that email, you&apos;ll be able to manage your listing from the dashboard.</p>
            <a href="/services" className="dash-link mt-4 inline-block">← Back to services</a>
          </div>
        ) : (
          <div className="dash-card-pad mx-auto max-w-xl">
            <h2 className="text-lg font-semibold text-earth-900">List your services</h2>
            <p className="mt-2 text-sm text-earth-600">Fill out the form below to register as a service provider. If you already have a theWalk account, use the same email to link your listing.</p>

            {error ? <p className="mt-4 text-sm text-red-800">Please fill in your name, category, and email.</p> : null}

            <form action={registerProvider} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700">Business name</label>
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
                <label className="block text-sm font-medium text-earth-700">Email</label>
                <input name="email" type="email" required maxLength={200} placeholder="Use your theWalk account email if you have one" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700">Phone</label>
                  <input name="phone" maxLength={50} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700">Website</label>
                  <input name="website" type="url" maxLength={500} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700">Location</label>
                <input name="location" maxLength={200} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700">Description</label>
                <textarea name="description" rows={4} maxLength={1000} placeholder="Describe your services…" className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-calm-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-calm-600">Submit registration</button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
