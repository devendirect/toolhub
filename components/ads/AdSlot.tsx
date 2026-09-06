"use client";

import { useEffect, useRef } from "react";
import { ADS_CLIENT } from "@/lib/ads";
import { useLang } from "@/components/providers/I18nProvider";

interface Props {
  /** Identifiant du bloc AdSense (lib/ads.ts). Vide = rien n'est rendu. */
  slot: string;
  className?: string;
}

/**
 * Emplacement publicitaire AdSense.
 *
 * Le script du réseau est chargé une fois pour toutes par le layout racine ; ce
 * composant se contente de déclarer un `<ins>` et de signaler à AdSense qu'un
 * nouvel emplacement est à remplir. Le libellé « publicité » est obligatoire côté
 * bonnes pratiques : une annonce ne doit jamais pouvoir passer pour du contenu
 * éditorial.
 */
export function AdSlot({ slot, className }: Props) {
  const { lang } = useLang();
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Bloqueur de publicité ou script indisponible : l'emplacement reste vide,
      // ce qui n'a aucune incidence sur le reste de la page.
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <aside className={className} aria-label={lang === "fr" ? "Publicité" : "Advertisement"}>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim mb-2">
        {lang === "fr" ? "publicité" : "advertisement"}
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
