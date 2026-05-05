import { submitPrayerFromForm } from "@/lib/ilm-community-actions";

export function PrayerPanel({
  slug,
  showForm,
  prayers,
}: {
  slug: string;
  showForm: boolean;
  prayers: { id: string; authorName: string; content: string; createdAt: Date }[];
}) {
  return (
    <section className="border-t border-earth-200 pt-12" aria-labelledby="prayer-heading">
      <h2 id="prayer-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Prayer wall
      </h2>
      <p className="mt-2 text-sm text-earth-600">
        Prayers are offered by visitors and the community. They appear here after moderation.
      </p>

      <ul className="mt-8 space-y-6">
        {prayers.length === 0 ? (
          <li className="text-sm text-earth-600">No prayers published yet.</li>
        ) : (
          prayers.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-calm-500/20 bg-calm-500/5 px-5 py-4 shadow-sm"
            >
              <p className="text-sm font-medium text-earth-900">{p.authorName}</p>
              <p className="mt-2 whitespace-pre-wrap text-earth-800">{p.content}</p>
              <p className="mt-3 text-xs text-earth-500">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(p.createdAt)}
              </p>
            </li>
          ))
        )}
      </ul>

      {showForm ? (
        <form action={submitPrayerFromForm} className="mt-10 space-y-4 max-w-xl">
          <input type="hidden" name="__ilmSlug" value={slug} />
          <div>
            <label htmlFor="pr-name" className="block text-sm font-medium text-earth-800">
              Your name
            </label>
            <input
              id="pr-name"
              name="authorName"
              required
              maxLength={120}
              autoComplete="name"
              className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-calm-500/20 focus:border-calm-500 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="pr-email" className="block text-sm font-medium text-earth-800">
              Email <span className="font-normal text-earth-500">(optional)</span>
            </label>
            <input
              id="pr-email"
              name="authorEmail"
              type="email"
              maxLength={320}
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-calm-500/20 focus:border-calm-500 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="pr-content" className="block text-sm font-medium text-earth-800">
              Prayer
            </label>
            <textarea
              id="pr-content"
              name="content"
              required
              rows={4}
              maxLength={5000}
              className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-calm-500/20 focus:border-calm-500 focus:ring-2"
            />
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-earth-700">
            <input
              type="checkbox"
              name="notifyAuthor"
              className="mt-1 rounded border-earth-300 text-calm-600 focus:ring-calm-500"
            />
            <span>
              I’m open to the page keeper reaching out with pastoral encouragement (uses your email if provided).
            </span>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-calm-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-calm-500"
          >
            Share prayer
          </button>
        </form>
      ) : (
        <p className="mt-8 text-sm text-earth-600">Prayer submissions are available on public memorial pages.</p>
      )}
    </section>
  );
}
