type FlowerDonation = {
  id: string;
  label: string;
  url: string | null;
  description: string | null;
  kind: string;
};

export function MemorialFlowersDonations({ items }: { items: FlowerDonation[] }) {
  if (items.length === 0) return null;

  return (
    <section className="ilm-container mt-8" aria-labelledby="flowers-heading">
      <h2 id="flowers-heading" className="text-xl font-semibold tracking-tight text-earth-900">
        Flowers &amp; donations
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-earth-200 bg-white px-5 py-4 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth-500">
              {item.kind === "DONATION" ? "Donation" : "Flowers"}
            </p>
            <p className="mt-1 text-base font-semibold text-earth-900">{item.label}</p>
            {item.description ? (
              <p className="mt-1 text-sm leading-relaxed text-earth-600">{item.description}</p>
            ) : null}
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-calm-500 underline-offset-4 hover:underline"
              >
                {item.kind === "DONATION" ? "Donate" : "Order flowers"} →
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
