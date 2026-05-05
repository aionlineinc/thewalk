import { IlmSubmissionStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  setGuestbookStatusFromForm,
  setPrayerStatusFromForm,
} from "@/app/dashboard/memorials/[id]/community/actions";
import { getIlmSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Community moderation · inLovingMemory",
};

export default async function MemorialCommunityPage({ params }: { params: { id: string } }) {
  const session = await getIlmSession();
  const userId = session?.user && "id" in session.user ? (session.user as { id: string }).id : undefined;

  const memorial = await prisma.ilmMemorial.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      displayName: true,
      slug: true,
      pageKeeperId: true,
      guestbookEntries: {
        where: { status: IlmSubmissionStatus.PENDING },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          authorName: true,
          authorEmail: true,
          content: true,
          createdAt: true,
        },
      },
      prayers: {
        where: { status: IlmSubmissionStatus.PENDING },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          authorName: true,
          authorEmail: true,
          content: true,
          notifyAuthor: true,
          createdAt: true,
        },
      },
    },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-content px-6 py-12 sm:px-8">
      <Link
        href="/dashboard"
        className="text-sm font-medium text-earth-800 underline-offset-4 hover:underline"
      >
        ← Dashboard
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-earth-900">Community moderation</h1>
      <p className="mt-2 text-earth-700">
        {memorial.displayName} · <span className="font-mono text-sm">/{memorial.slug}</span>
      </p>
      <p className="mt-4 text-sm text-earth-600">
        Approve or reject guest book messages and prayers. Only approved items appear on the public page.
      </p>

      <div className="mt-10 space-y-12">
        <section aria-labelledby="gb-mod">
          <h2 id="gb-mod" className="text-lg font-semibold text-earth-900">
            Guest book — pending
          </h2>
          {memorial.guestbookEntries.length === 0 ? (
            <p className="mt-4 text-sm text-earth-600">No pending messages.</p>
          ) : (
            <ul className="mt-6 space-y-6">
              {memorial.guestbookEntries.map((e) => (
                <li
                  key={e.id}
                  className="rounded-xl border border-earth-200 bg-white px-5 py-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-earth-900">{e.authorName}</p>
                  {e.authorEmail ? (
                    <p className="text-xs text-earth-500">{e.authorEmail}</p>
                  ) : null}
                  <p className="mt-3 whitespace-pre-wrap text-sm text-earth-800">{e.content}</p>
                  <p className="mt-3 text-xs text-earth-500">
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
                      e.createdAt,
                    )}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={setGuestbookStatusFromForm}>
                      <input type="hidden" name="__memorialId" value={memorial.id} />
                      <input type="hidden" name="__guestbookEntryId" value={e.id} />
                      <input type="hidden" name="__status" value={IlmSubmissionStatus.APPROVED} />
                      <button
                        type="submit"
                        className="rounded-lg bg-earth-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-earth-900"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={setGuestbookStatusFromForm}>
                      <input type="hidden" name="__memorialId" value={memorial.id} />
                      <input type="hidden" name="__guestbookEntryId" value={e.id} />
                      <input type="hidden" name="__status" value={IlmSubmissionStatus.REJECTED} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-900 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="pr-mod">
          <h2 id="pr-mod" className="text-lg font-semibold text-earth-900">
            Prayer wall — pending
          </h2>
          {memorial.prayers.length === 0 ? (
            <p className="mt-4 text-sm text-earth-600">No pending prayers.</p>
          ) : (
            <ul className="mt-6 space-y-6">
              {memorial.prayers.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-calm-500/20 bg-calm-500/5 px-5 py-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-earth-900">{p.authorName}</p>
                  {p.authorEmail ? (
                    <p className="text-xs text-earth-500">{p.authorEmail}</p>
                  ) : null}
                  {p.notifyAuthor ? (
                    <p className="mt-1 text-xs text-calm-600">Open to follow-up from page keeper</p>
                  ) : null}
                  <p className="mt-3 whitespace-pre-wrap text-sm text-earth-800">{p.content}</p>
                  <p className="mt-3 text-xs text-earth-500">
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
                      p.createdAt,
                    )}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={setPrayerStatusFromForm}>
                      <input type="hidden" name="__memorialId" value={memorial.id} />
                      <input type="hidden" name="__prayerId" value={p.id} />
                      <input type="hidden" name="__status" value={IlmSubmissionStatus.APPROVED} />
                      <button
                        type="submit"
                        className="rounded-lg bg-calm-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-calm-500"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={setPrayerStatusFromForm}>
                      <input type="hidden" name="__memorialId" value={memorial.id} />
                      <input type="hidden" name="__prayerId" value={p.id} />
                      <input type="hidden" name="__status" value={IlmSubmissionStatus.REJECTED} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-900 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="mt-12">
        <Link
          href={`/memorial/${memorial.slug}`}
          className="text-sm font-medium text-earth-800 underline-offset-4 hover:underline"
        >
          View public page
        </Link>
      </p>
    </main>
  );
}
