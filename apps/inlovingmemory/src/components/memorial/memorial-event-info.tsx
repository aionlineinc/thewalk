export type EventInfoItem = {
  id: string;
  kind: string;
  title: string | null;
  startsAt: Date | null;
  venue: string | null;
  notes: string | null;
};

function kindLabel(kind: string) {
  if (kind === "FUNERAL") return "Funeral Service Location";
  if (kind === "VISITATION") return "Interment Location";
  return "Service Location";
}

export function MemorialEventInfo({ events }: { events: EventInfoItem[] }) {
  const relevant = events.filter((e) => e.venue || e.notes);
  if (relevant.length === 0) return null;

  return (
    <div className="ilm-container mt-6">
      <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-2xl border border-earth-200 bg-white px-6 py-4 text-sm shadow-sm">
        {relevant.map((e) => (
          <div key={e.id}>
            <span className="font-semibold text-earth-700">{kindLabel(e.kind)}: </span>
            <span className="text-earth-600">{e.venue ?? e.notes}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
