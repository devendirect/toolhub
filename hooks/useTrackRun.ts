"use client";

import { useCallback } from "react";

export function useTrackRun(slug: string, category: string) {
  return useCallback(() => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    // Sur une page pSEO /convert/[pair], trace quelle variante a amené l'utilisation
    const pair = window.location.pathname.match(/^\/(?:en|fr)\/convert\/([^/]+)/)?.[1];
    window.gtag("event", "tool_run", {
      tool_slug: slug,
      tool_category: category,
      ...(pair ? { entry_variant: pair } : {}),
    });
  }, [slug, category]);
}
