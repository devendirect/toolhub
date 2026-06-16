"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error("[toolhub] runtime error:", error); }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="font-mono text-[64px] text-hot leading-none mb-6 tracking-[0.1em]">ERR</div>
      <p className="text-[14px] text-fg-1 max-w-[40ch] mb-8 font-mono">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="px-[18px] py-[9px] bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:opacity-90 transition-opacity"
      >
        try again ↺
      </button>
    </div>
  );
}
