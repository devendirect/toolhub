"use client";

import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { PdfPairMode } from "@/lib/pdf-pairs";

// Même pattern de lazy-load que ConvertWorkspace.tsx (paires image)
const PdfConverter = dynamic(
  () => import("@/components/workspaces/PdfConverter").then((m) => ({ default: m.PdfConverter })),
  { ssr: false, loading: () => <div className="border border-line min-h-[420px] bg-bg-1 animate-pulse" /> }
);

interface PdfConvertWorkspaceProps {
  mode: PdfPairMode;
  imgFormat?: "png" | "jpeg";
}

export function PdfConvertWorkspace({ mode, imgFormat }: PdfConvertWorkspaceProps) {
  return (
    <ErrorBoundary>
      <PdfConverter initialMode={mode} initialImgFormat={imgFormat} />
    </ErrorBoundary>
  );
}
