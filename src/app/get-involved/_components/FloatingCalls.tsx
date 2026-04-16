"use client";

import { useMemo } from "react";

type Item = {
  text: string;
  top: string;
  left: string;
  maxWidth: string;
  opacity: string;
  delay: string;
  duration: string;
  size: "sm" | "md";
};

const CALLS = [
  "I knew I was meant for more.",
  "I wanted to grow—but didn’t know where to start.",
  "I felt called to serve.",
  "I didn’t want to just attend anymore.",
  "There had to be something deeper.",
  "I wanted my faith to be active.",
  "I knew I wasn’t meant to walk alone.",
  "I wanted to be part of something real.",
] as const;

function hashToUnit(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 2 ** 32;
}

export function FloatingCalls() {
  const items = useMemo<Item[]>(() => {
    return CALLS.map((text, idx) => {
      const u1 = hashToUnit(`${text}|a`);
      const u2 = hashToUnit(`${text}|b`);
      const u3 = hashToUnit(`${text}|c`);
      const u4 = hashToUnit(`${text}|d`);

      // Keep away from center copy: place in bands left/right and above/below.
      const bandLeft = u1 < 0.5;
      const topPct = 10 + Math.round(u2 * 78); // 10–88
      const leftPct = bandLeft
        ? 6 + Math.round(u3 * 32) // 6–38
        : 62 + Math.round(u3 * 32); // 62–94

      const size: Item["size"] = idx % 3 === 0 ? "md" : "sm";
      const maxWidth = size === "md" ? "18rem" : "15rem";
      const opacity = (0.12 + u4 * 0.12).toFixed(2); // 0.12–0.24
      const delay = `${Math.round(u1 * 2200)}ms`;
      const duration = `${14 + Math.round(u2 * 18)}s`;

      return {
        text,
        top: `${topPct}%`,
        left: `${leftPct}%`,
        maxWidth,
        opacity,
        delay,
        duration,
        size,
      };
    });
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {items.map((it) => (
        <div
          key={it.text}
          className={
            "absolute will-change-transform motion-safe:animate-[drift_18s_ease-in-out_infinite] motion-reduce:animate-none"
          }
          style={{
            top: it.top,
            left: it.left,
            maxWidth: it.maxWidth,
            opacity: it.opacity,
            animationDelay: it.delay,
            animationDuration: it.duration,
          }}
        >
          <p
            className={
              it.size === "md"
                ? "text-base font-light leading-relaxed text-white/80"
                : "text-sm font-light leading-relaxed text-white/75"
            }
          >
            “{it.text}”
          </p>
        </div>
      ))}

      <style jsx global>{`
        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -14px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
