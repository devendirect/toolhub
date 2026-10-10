"use client";

import { useEffect, useState } from "react";
import { resetConsent } from "@/components/analytics/CookieBanner";
import type { Lang } from "@/lib/types";

/** Les deux seuls morceaux du pied de page qui ont besoin du navigateur. */

export function ManageCookiesButton({ lang, className }: { lang: Lang; className: string }) {
  // Quand une CMP certifiée pilote la page, resetConsent lui rend la
  // main et rouvre son écran : recharger effacerait cet écran.
  return (
    <button onClick={() => { if (!resetConsent()) window.location.reload(); }} className={className}>
      {lang === "fr" ? "gérer les cookies" : "manage cookies"}
    </button>
  );
}

/** Heure du visiteur : la page est pré-rendue au build, l'heure serveur serait figée. */
export function SessionClock({ className }: { className: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setNow(new Date().toISOString().slice(0, 19).replace("T", " ")), 0);
    return () => clearTimeout(id);
  }, []);
  return <span className={className}>{`> session_end  ::  ${now ?? "…"}`}</span>;
}
