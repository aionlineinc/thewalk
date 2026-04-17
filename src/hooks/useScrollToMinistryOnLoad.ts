"use client";

import { useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

/**
 * After navigation with ?tab= and #sectionId (e.g. from the Journey mega menu), scrolls the
 * ministry tabs block into view once. In-page tab changes omit the hash and do not re-scroll.
 */
export function useScrollToMinistryOnLoad(sectionId: string, validTabKeys: readonly string[]) {
  const searchParams = useSearchParams();
  const didScroll = useRef(false);

  useLayoutEffect(() => {
    if (didScroll.current) return;

    const tab = searchParams?.get("tab") ?? null;
    if (!tab || !validTabKeys.includes(tab)) return;
    if (typeof window === "undefined") return;
    if (window.location.hash !== `#${sectionId}`) return;

    didScroll.current = true;

    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [searchParams, sectionId, validTabKeys]);
}
