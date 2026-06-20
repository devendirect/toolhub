"use client";

import { useCallback } from "react";

export function useTrackRun(slug: string, category: string) {
  return useCallback(() => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "tool_run", { tool_slug: slug, tool_category: category });
  }, [slug, category]);
}
