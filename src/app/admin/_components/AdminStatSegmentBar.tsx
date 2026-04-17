/**
 * Decorative status strip (Superpower-style biomarker distribution bar).
 * Values are relative weights, not percentages — visual only.
 */
export function AdminStatSegmentBar({
  segments,
}: {
  segments: { key: string; className: string; flex: number }[];
}) {
  const total = segments.reduce((s, x) => s + x.flex, 0) || 1;

  return (
    <div
      className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-black/[0.06]"
      role="presentation"
      aria-hidden
    >
      {segments.map(({ key, className, flex }) => (
        <div
          key={key}
          className={className}
          style={{ flex: `${(flex / total) * 100} 1 0%` }}
        />
      ))}
    </div>
  );
}
