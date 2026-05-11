export type EventInfoItem = {
  id: string;
  kind: string;
  title: string | null;
  startsAt: Date | null;
  venue: string | null;
  address: string | null;
  mapUrl: string | null;
  officiant: string | null;
  programDetails: string | null;
  notes: string | null;
};

const fmt = (d: Date | null | undefined) =>
  d
    ? new Intl.DateTimeFormat("en", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(d)
    : null;

function kindLabel(kind: string) {
  if (kind === "FUNERAL") return "Funeral Service";
  if (kind === "VISITATION") return "Visitation";
  return "Service";
}

function kindIcon(kind: string) {
  if (kind === "FUNERAL") return "🕊";
  if (kind === "VISITATION") return "🕯";
  return "📅";
}

export function MemorialEventInfo({ events }: { events: EventInfoItem[] }) {
  if (events.length === 0) return null;

  return (
    <section className="ilm-container mt-8" aria-labelledby="events-heading">
      <h2 id="events-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Service details
      </h2>
      <div className="mt-6 space-y-5">
        {events.map((e) => (
          <div key={e.id} className="rounded-2xl border border-earth-200 bg-white px-6 py-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-xl" aria-hidden>
                {kindIcon(e.kind)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-earth-500">
                  {kindLabel(e.kind)}
                </p>
                {e.title ? (
                  <p className="mt-1 text-lg font-semibold text-earth-900">{e.title}</p>
                ) : null}

                {/* Date & time */}
                {e.startsAt ? (
                  <p className="mt-2 text-sm text-earth-700">{fmt(e.startsAt)}</p>
                ) : null}

                {/* Venue + address */}
                {e.venue ? (
                  <div className="mt-2 text-sm text-earth-700">
                    <span className="font-medium">{e.venue}</span>
                    {e.address ? <span className="text-earth-500"> · {e.address}</span> : null}
                  </div>
                ) : null}

                {/* Map link */}
                {e.mapUrl ? (
                  <a
                    href={e.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-calm-500 underline-offset-4 hover:underline"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    View map
                  </a>
                ) : null}

                {/* Officiant */}
                {e.officiant ? (
                  <p className="mt-3 text-sm text-earth-700">
                    <span className="font-medium">Officiant:</span> {e.officiant}
                  </p>
                ) : null}

                {/* Program details */}
                {e.programDetails ? (
                  <div className="mt-4 rounded-xl border border-earth-100 bg-earth-50/50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">
                      Order of service
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-earth-800">
                      {e.programDetails}
                    </p>
                  </div>
                ) : null}

                {e.notes ? (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-earth-600">
                    {e.notes}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
