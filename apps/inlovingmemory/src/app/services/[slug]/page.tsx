import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { submitOrder } from "./actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await prisma.ilmServiceProvider.findUnique({ where: { slug: params.slug }, select: { name: true } });
  if (!p) return { title: "Service provider · inLovingMemory" };
  return { title: `${p.name} · Service providers · inLovingMemory` };
}

export default async function ServiceProviderPage({ params, searchParams }: { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> }) {
  const orderSent = typeof searchParams.order === "string" && searchParams.order === "sent";
  const orderError = typeof searchParams.error === "string";
  const provider = await prisma.ilmServiceProvider.findUnique({
    where: { slug: params.slug },
    select: {
      id: true, name: true, description: true, location: true, phone: true, email: true, website: true, photoUrl: true, isActive: true,
      category: { select: { label: true } },
    },
  });

  if (!provider || !provider.isActive) notFound();

  return (
    <main className="pb-24">
      <section className="relative flex h-[42vh] min-h-[320px] items-end p-2 md:p-4">
        <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-4">
          <div className="h-full w-full bg-gradient-to-br from-[#1a1008] via-[#0f0b08] to-[#0d0806]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0806] via-black/55 to-black/20" aria-hidden />
        </div>
        <div className="relative z-10 ilm-container pb-10 pt-28 md:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">{provider.category.label}</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-white md:text-[50px] md:leading-[1.1]">{provider.name}</h1>
        </div>
      </section>

      <div className="ilm-container py-12">
        <Link href="/services" className="dash-link text-sm">← Service providers</Link>

        {orderSent ? (
          <p className="mt-4 rounded-lg border border-earth-200 bg-earth-50 px-4 py-3 text-sm text-earth-800">Thank you — your request was sent to the provider.</p>
        ) : null}
        {orderError ? (
          <p className="mt-4 text-sm text-red-800">Please check your details and try again.</p>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {provider.description ? (
              <div className="dash-card p-6">
                <h2 className="text-lg font-semibold text-earth-900">About</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-earth-700">{provider.description}</p>
              </div>
            ) : null}

            {/* Order form */}
            <div className="dash-card mt-6 p-6">
              <h2 className="text-lg font-semibold text-earth-900">Place an order</h2>
              <form action={submitOrder.bind(null, params.slug)} className="mt-4 space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-earth-700">Your name</label>
                  <input name="customerName" required maxLength={120} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700">Email</label>
                  <input name="customerEmail" type="email" required maxLength={200} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700">Phone (optional)</label>
                  <input name="customerPhone" maxLength={50} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700">Estimated budget ($)</label>
                  <input name="amount" type="number" min={0} step={0.01} className="mt-1.5 w-32 rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700">What do you need?</label>
                  <textarea name="description" rows={3} maxLength={1000} className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="rounded-lg bg-calm-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-calm-600">Submit request</button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="dash-card p-6">
              <h2 className="text-lg font-semibold text-earth-900">Contact</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {provider.location ? (
                  <div><dt className="text-earth-500">Location</dt><dd className="mt-0.5 text-earth-900">{provider.location}</dd></div>
                ) : null}
                {provider.phone ? (
                  <div><dt className="text-earth-500">Phone</dt><dd className="mt-0.5"><a href={`tel:${provider.phone}`} className="text-calm-500 hover:underline">{provider.phone}</a></dd></div>
                ) : null}
                {provider.email ? (
                  <div><dt className="text-earth-500">Email</dt><dd className="mt-0.5"><a href={`mailto:${provider.email}`} className="text-calm-500 hover:underline">{provider.email}</a></dd></div>
                ) : null}
                {provider.website ? (
                  <div><dt className="text-earth-500">Website</dt><dd className="mt-0.5"><a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-calm-500 hover:underline">Visit →</a></dd></div>
                ) : null}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
