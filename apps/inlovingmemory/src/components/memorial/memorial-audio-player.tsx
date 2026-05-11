"use client";

import { useRef, useState } from "react";

export function MemorialAudioPlayer({
  src,
  authorName,
}: {
  src: string;
  authorName?: string | null;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().catch(() => {});
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  }

  function fmt(sec: number) {
    if (!sec || !isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-earth-200 bg-white px-4 py-3 shadow-sm">
      <button
        type="button"
        onClick={toggle}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-calm-500 text-white shadow-sm transition hover:bg-calm-600"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        {authorName ? (
          <p className="truncate text-sm font-medium text-earth-900">{authorName}</p>
        ) : null}
        <div className="flex items-center gap-2 text-xs text-earth-500">
          <span>{fmt(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              const a = audioRef.current;
              if (a) {
                a.currentTime = Number(e.target.value);
                setCurrentTime(a.currentTime);
              }
            }}
            className="h-1 flex-1 appearance-none rounded bg-earth-200 accent-calm-500"
          />
          <span>{fmt(duration)}</span>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration((e.target as HTMLAudioElement).duration)}
        onTimeUpdate={(e) => setCurrentTime((e.target as HTMLAudioElement).currentTime)}
        onEnded={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
}
