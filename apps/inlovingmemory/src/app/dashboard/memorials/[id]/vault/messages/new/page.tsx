import Link from "next/link";
import { notFound } from "next/navigation";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MemorialSubNav } from "@/components/dashboard/memorial-sub-nav";
import { createMessage } from "../../actions";

export const metadata = { title: "New message · inLovingMemory" };

export default async function NewMessagePage({ params }: { params: { id: string } }) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: params.id },
    select: { id: true, slug: true, displayName: true, pageKeeperId: true },
  });

  if (!memorial || memorial.pageKeeperId !== userId) notFound();

  return (
    <section className="w-full">
      <Link
        href={`/dashboard/memorials/${memorial.id}/vault/messages`}
        className="dash-link text-sm"
      >
        ← Messages
      </Link>
      <h1 className="dash-page-title mt-6">Write a message</h1>
      <p className="dash-page-lead">
        A letter to a loved one. You can lock it so it can&apos;t be edited, ready for future delivery.
      </p>
      <div className="mt-6">
        <MemorialSubNav memorialId={memorial.id} slug={memorial.slug} />
      </div>

      <div className="dash-card-pad mt-6">
        <form action={createMessage} className="space-y-4">
          <input type="hidden" name="memorialId" value={memorial.id} />

          <div>
            <label className="block text-sm font-medium text-earth-800">
              Recipient email <span className="text-earth-400">(optional)</span>
            </label>
            <input
              name="recipientEmail"
              type="email"
              maxLength={320}
              placeholder="person@example.com"
              className="mt-1 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-earth-800">Message</label>
            <textarea
              name="body"
              required
              rows={8}
              placeholder="Write your message here…"
              className="mt-1 w-full max-w-2xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-calm-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-calm-600"
            >
              Save message
            </button>
            <Link
              href={`/dashboard/memorials/${memorial.id}/vault/messages`}
              className="rounded-lg border border-earth-200 bg-white px-5 py-2.5 text-sm font-semibold text-earth-700 transition hover:bg-earth-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
