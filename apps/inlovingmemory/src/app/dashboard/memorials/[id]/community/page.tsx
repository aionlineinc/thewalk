import { IlmSubmissionStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  setGuestbookStatusFromForm,
  setPrayerStatusFromForm,
  setMediaStatusFromForm,
  submitGriefRequestFromForm,
} from "@/app/dashboard/memorials/[id]/community/actions";
import { MemorialSubNav } from "@/components/dashboard/memorial-sub-nav";
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
      media: {
        where: { authorGuestName: { not: null }, status: IlmSubmissionStatus.PENDING },
        orderBy: { createdAt: "asc" },
        select: { id: true, storageUrl: true, kind: true, authorGuestName: true, createdAt: true },
      },
      griefRequests: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          brief: true,
          status: true,
          createdAt: true,
          matchedCounsellor: {
            select: {
              id: true,
              bio: true,
              user: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  const verifiedCounsellors = await prisma.ilmCounsellor.findMany({
    where: { verifiedAt: { not: null } },
    select: {
      id: true,
      bio: true,
      specialisations: true,
      user: { select: { name: true } },
    },
  });

  if (!memorial || memorial.pageKeeperId !== userId) {
    notFound();
  }

  return (
    <section className="w-full">
      <Link href="/dashboard" className="dash-link text-sm">
        ← Dashboard
      </Link>
      <h1 className="dash-page-title mt-6">Community moderation</h1>
      <p className="dash-page-lead">
        {memorial.displayName} · <span className="font-mono text-sm">/{memorial.slug}</span>
      </p>
      <p className="dash-page-lead">
        {memorial.displayName} · <span className="font-mono text-sm">/{memorial.slug}</span>
      </p>
      <p className="mt-3 text-sm text-earth-500">
        Approve or reject guest book messages, prayers, photos, audio, and videos. Only approved items appear on the public page.
      </p>
      <div className="mt-6">
        <MemorialSubNav memorialId={memorial.id} slug={memorial.slug} />
      </div>

      <div className="mt-10 space-y-12">
        {/* Guest book */}
        <section aria-labelledby="gb-mod">
          <h2 id="gb-mod" className="text-lg font-semibold text-earth-900">
            Guest book — pending
          </h2>
          {memorial.guestbookEntries.length === 0 ? (
            <p className="mt-4 text-sm text-earth-500">No pending messages.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {memorial.guestbookEntries.map((e) => (
                <li key={e.id} className="dash-card px-5 py-4">
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
                        className="rounded-lg bg-earth-800 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-earth-900"
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
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-800 shadow-sm transition hover:bg-red-50"
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

        {/* Prayer wall */}
        <section aria-labelledby="pr-mod">
          <h2 id="pr-mod" className="text-lg font-semibold text-earth-900">
            Prayer wall — pending
          </h2>
          {memorial.prayers.length === 0 ? (
            <p className="mt-4 text-sm text-earth-500">No pending prayers.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {memorial.prayers.map((p) => (
                <li key={p.id} className="dash-card px-5 py-4">
                  <p className="text-sm font-medium text-earth-900">{p.authorName}</p>
                  {p.authorEmail ? (
                    <p className="text-xs text-earth-500">{p.authorEmail}</p>
                  ) : null}
                  {p.notifyAuthor ? (
                    <p className="mt-1 text-xs font-medium text-calm-500">
                      Open to follow-up from page moderator
                    </p>
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
                        className="rounded-lg bg-calm-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-calm-600"
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
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-800 shadow-sm transition hover:bg-red-50"
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

        {/* Media — pending */}
        <section aria-labelledby="media-mod">
          <h2 id="media-mod" className="text-lg font-semibold text-earth-900">
            Shared media — pending
          </h2>
          {memorial.media.length === 0 ? (
            <p className="mt-4 text-sm text-earth-500">No pending media.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {memorial.media.map((m) => (
                <li key={m.id} className="dash-card px-5 py-4">
                  <p className="text-sm font-medium text-earth-900">{m.authorGuestName ?? "Anonymous"}</p>
                  <p className="text-xs text-earth-500">
                    {m.kind === "AUDIO" ? "Audio" : "Photo"} ·{" "}
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(m.createdAt)}
                  </p>
                  {m.kind === "PHOTO" ? (
                    <img src={m.storageUrl} alt="" className="mt-3 h-24 w-24 rounded-lg object-cover" loading="lazy" />
                  ) : (
                    <audio src={m.storageUrl} controls className="mt-3 w-full max-w-md" preload="metadata" />
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <form action={setMediaStatusFromForm}>
                      <input type="hidden" name="__memorialId" value={memorial.id} />
                      <input type="hidden" name="__mediaId" value={m.id} />
                      <input type="hidden" name="__status" value={IlmSubmissionStatus.APPROVED} />
                      <button
                        type="submit"
                        className="rounded-lg bg-earth-800 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-earth-900"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={setMediaStatusFromForm}>
                      <input type="hidden" name="__memorialId" value={memorial.id} />
                      <input type="hidden" name="__mediaId" value={m.id} />
                      <input type="hidden" name="__status" value={IlmSubmissionStatus.REJECTED} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-800 shadow-sm transition hover:bg-red-50"
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

        {/* Grief support */}
        <section aria-labelledby="grief-mod" className="mt-12">
          <h2 id="grief-mod" className="text-lg font-semibold text-earth-900">
            Grief support requests
          </h2>
          <p className="mt-1 text-sm text-earth-600">
            Submit a request to be matched with a grief counsellor or minister.
          </p>

          {/* Request form */}
          <div className="dash-card-pad mt-4">
            <form action={submitGriefRequestFromForm} className="space-y-4">
              <input type="hidden" name="__memorialId" value={memorial.id} />
              <div>
                <label className="block text-sm font-medium text-earth-800">
                  How can we support you?
                </label>
                <textarea
                  name="brief"
                  required
                  rows={3}
                  maxLength={2000}
                  placeholder="Briefly describe what you're going through and the kind of support you need…"
                  className="mt-1.5 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-sm text-earth-900 outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-calm-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-600"
              >
                Submit request
              </button>
            </form>
          </div>

          {/* Existing requests */}
          {memorial.griefRequests.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-earth-700">Previous requests</h3>
              {memorial.griefRequests.map((r) => (
                <div key={r.id} className="dash-card-pad">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${
                        r.status === "OPEN"
                          ? "bg-amber-100 text-amber-800"
                          : r.status === "MATCHED"
                            ? "bg-green-100 text-green-800"
                            : "bg-earth-100 text-earth-600"
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="text-xs text-earth-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-earth-700">{r.brief}</p>
                  {r.matchedCounsellor && (
                    <p className="mt-2 text-xs text-calm-600">
                      Matched with: {r.matchedCounsellor.user.name || "A counsellor"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Available counsellors */}
          {verifiedCounsellors.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-earth-900">Available counsellors</h3>
              <p className="mt-1 text-xs text-earth-500">
                These verified counsellors are ready to be matched with families on the platform.
              </p>
              <div className="mt-3 space-y-2">
                {verifiedCounsellors.map((c) => (
                  <div key={c.id} className="dash-card-pad flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-earth-900">
                        {c.user.name || "Counsellor"}
                      </p>
                      {c.bio && (
                        <p className="mt-0.5 text-xs text-earth-600 line-clamp-2">{c.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

    </section>
  );
}
