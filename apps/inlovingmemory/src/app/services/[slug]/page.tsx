import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await prisma.ilmServiceProvider.findUnique({ where: { slug: params.slug }, select: { name: true } });
  if (!p) return { title: "Service provider · inLovingMemory" };
  return { title: `${p.name} · Service providers · inLovingMemory` };
}

export default async function ServiceProviderPage({ params }: { params: { slug: string } }) {
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

        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {provider.description ? (
              <div className="dash-card p-6">
                <h2 className="text-lg font-semibold text-earth-900">About</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-earth-700">{provider.description}</p>
              </div>
            ) : null}

            {/* Future: order form goes here */}
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
