import { submitGuestbookFromForm } from "@/lib/ilm-community-actions";

export function GuestbookPanel({
  slug,
  showForm,
  entries,
  primaryColor,
}: {
  slug: string;
  showForm: boolean;
  entries: { id: string; authorName: string; content: string; createdAt: Date }[];
  primaryColor?: string;
}) {
  return (
    <section id="guestbook" className="border-t border-earth-200 pt-12" aria-labelledby="guestbook-heading">
      <h2 id="guestbook-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Guest Book
      </h2>
      <p className="mt-2 text-sm text-earth-600">
        Messages appear after the page moderator approves them.
      </p>

      {showForm ? (
        <form action={submitGuestbookFromForm} className="mt-8 max-w-xl space-y-4">
          <input type="hidden" name="__ilmSlug" value={slug} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="gb-first" className="block text-sm font-medium text-earth-800">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="gb-first"
                name="firstName"
                required
                maxLength={60}
                autoComplete="given-name"
                className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
              />
            </div>
            <div>
              <label htmlFor="gb-last" className="block text-sm font-medium text-earth-800">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="gb-last"
                name="lastName"
                required
                maxLength={60}
                autoComplete="family-name"
                className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="gb-email" className="block text-sm font-medium text-earth-800">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="gb-email"
              name="authorEmail"
              type="email"
              maxLength={320}
              autoComplete="email"
              className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
            />
          </div>

          <div>
            <label htmlFor="gb-content" className="block text-sm font-medium text-earth-800">
              Share
            </label>
            <textarea
              id="gb-content"
              name="content"
              required
              rows={4}
              maxLength={5000}
              className="mt-1.5 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none focus:border-calm-500 focus:ring-2 focus:ring-calm-500/20"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-earth-700">
            <input
              type="checkbox"
              required
              className="h-4 w-4 rounded border-earth-300 text-calm-500 focus:ring-calm-500"
            />
            I am human
          </label>

          <button
            type="submit"
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            style={{ backgroundColor: primaryColor || "#b8642a" }}
          >
            Submit
          </button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-earth-600">Guest book accepts submissions on public memorial pages.</p>
      )}

      <ul className="mt-10 space-y-6">
        {entries.length === 0 ? (
          <li className="text-sm text-earth-600">No messages yet — be the first to leave a memory.</li>
        ) : (
          entries.map((e) => (
            <li key={e.id} className="rounded-xl border border-earth-100 bg-white/80 px-5 py-4 shadow-sm">
              <p className="text-sm font-medium text-earth-900">{e.authorName}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-earth-800">{e.content}</p>
              <p className="mt-3 text-xs text-earth-500">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(e.createdAt)}
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
