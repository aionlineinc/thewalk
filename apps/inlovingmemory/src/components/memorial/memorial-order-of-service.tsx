export function MemorialOrderOfService({ pdfUrl }: { pdfUrl: string | null | undefined }) {
  return (
    <section className="ilm-container mt-8">
      <div className="flex items-center gap-4 rounded-2xl border border-earth-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-earth-100">
          <svg className="h-7 w-7 text-earth-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-earth-500">Document</p>
          <p className="mt-0.5 text-base font-semibold text-earth-900">Order of Service</p>
        </div>
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-earth-200 bg-earth-50 px-4 py-2 text-sm font-semibold text-earth-800 shadow-sm transition hover:bg-earth-100"
          >
            View PDF
          </a>
        ) : (
          <span className="shrink-0 rounded-lg border border-dashed border-earth-300 px-4 py-2 text-sm text-earth-400">
            Coming soon
          </span>
        )}
      </div>
    </section>
  );
}
