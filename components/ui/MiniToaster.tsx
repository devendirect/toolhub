"use client";

import { useSyncExternalStore } from "react";
import { subscribeToast, getToast } from "@/lib/toast";

/** Zone des notifications, toujours présente pour que les lecteurs d'écran l'annoncent. */
export function MiniToaster() {
  const msg = useSyncExternalStore(subscribeToast, getToast, () => null);
  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-[60] pointer-events-none">
      {msg && (
        <div
          key={msg.id}
          className="flex items-center gap-2 px-4 py-3 border border-line bg-bg-1 font-mono text-[12px] text-fg shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-cp-pop"
        >
          <span aria-hidden className={msg.kind === "success" ? "text-brand" : "text-danger"}>{msg.kind === "success" ? "✓" : "✕"}</span>
          {msg.text}
        </div>
      )}
    </div>
  );
}
