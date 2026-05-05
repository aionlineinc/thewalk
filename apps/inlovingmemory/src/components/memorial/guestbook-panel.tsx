import { submitGuestbookFromForm } from "@/lib/ilm-community-actions";

export function GuestbookPanel({
  slug,
  showForm,
  entries,
}: {
  slug: string;
  showForm: boolean;
  entries: { id: string; authorName: string; content: string; createdAt: Date }[];
}) {
  return (
    <section className="border-t border-earth-200 pt-12" aria-labelledby="guestbook-heading">
      <h2 id="guestbook-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Guest book
      </h2>
      <p className="mt-2 text-sm text-earth-600">
        Messages appear after the page keeper approves them. Only public memorials accept new entries.
      </p>

      <ul className="mt-8 space-y-6">
        {entries.length === 0 ? (
          <li className="text-sm text-earth-600">No messages yet — be the first to leave a memory.</li>
        ) : (
          entries.map((e) => (
            <li key={e.id} className="rounded-xl border border-earth-100 bg-white/80 px-5 py-4 shadow-sm">
              <p className="text-sm font-medium text-earth-900">{e.authorName}</p>
              <p className="mt-2 whitespace-pre-wrap text-earth-800">{e.content}</p>
              <p className="mt-3 text-xs text-earth-500">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(e.createdAt)}
              </p>
            </li>
          ))
        )}
      </ul>

      {showForm ? (
        <form action={submitGuestbookFromForm} className="mt-10 space-y-4 max-w-xl">
          <input type="hidden" name="__ilmSlug" value={slug} />
          <div>
            <label htmlFor="gb-name" className="block text-sm font-medium text-earth-800">
              Your name
            </label>
            <input
              id="gb-name"
              name="authorName"
              required
              maxLength={120}
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-calm-500/20 focus:border-calm-500 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="gb-email" className="block text-sm font-medium text-earth-800">
              Email <span className="font-normal text-earth-500">(optional)</span>
            </label>
            <input
              id="gb-email"
              name="authorEmail"
              type="email"
              maxLength={320}
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-calm-500/20 focus:border-calm-500 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="gb-content" className="block text-sm font-medium text-earth-800">
              Message
            </label>
            <textarea
              id="gb-content"
              name="content"
              required
              rows={4}
              maxLength={5000}
              className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-calm-500/20 focus:border-calm-500 focus:ring-2"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-earth-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
          >
            Submit message
          </button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-earth-600">Guest book accepts submissions on public memorial pages.</p>
      )}
    </section>
  );
}
