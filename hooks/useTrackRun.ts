"use client";

export function useTrackRun(slug: string, category: string) {
  return () => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "tool_run", {
      tool_slug:     slug,
      tool_category: category,
    });
  };
}
