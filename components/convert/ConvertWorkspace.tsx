"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { TargetFormat } from "@/lib/convert-pairs";

// Même pattern de lazy-load que lib/workspace-registry.tsx
const ImageConverter = dynamic(
  () => import("@/components/workspaces/ImageConverter").then((m) => ({ default: m.ImageConverter })),
  { ssr: false, loading: () => <div className="border border-line min-h-[420px] bg-bg-1 animate-pulse" /> }
);

export function ConvertWorkspace({ target }: { target: TargetFormat }) {
  return (
    <ErrorBoundary>
      <ImageConverter initialFormat={target} />
    </ErrorBoundary>
  );
}
