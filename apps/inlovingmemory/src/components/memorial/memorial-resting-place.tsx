export function MemorialRestingPlace({
  name,
  address,
  lat,
  lng,
  mapUrl,
}: {
  name: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  mapUrl: string | null;
}) {
  if (!name && !address && !mapUrl) return null;

  const googleMapsUrl =
    mapUrl ||
    (lat != null && lng != null
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : address
        ? `https://www.google.com/maps?q=${encodeURIComponent(address)}`
        : null);

  return (
    <section className="ilm-container mt-8">
      <div className="rounded-2xl border border-earth-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-earth-100">
            <svg className="h-7 w-7 text-earth-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-earth-500">Resting place</p>
            {name ? (
              <p className="mt-0.5 text-base font-semibold text-earth-900">{name}</p>
            ) : null}
            {address ? (
              <p className="mt-0.5 text-sm text-earth-600">{address}</p>
            ) : null}
            {googleMapsUrl && lat != null && lng != null ? (
              <p className="mt-1 text-xs text-earth-400">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </p>
            ) : null}
          </div>
          {googleMapsUrl ? (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-lg border border-earth-200 bg-earth-50 px-4 py-2 text-sm font-semibold text-earth-800 shadow-sm transition hover:bg-earth-100"
            >
              View on map
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
