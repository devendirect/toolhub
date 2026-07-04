"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { track } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const COOKIE_KEY = "utilisio-consent";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? "") : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

// Consent Mode "basic" (exigence CNIL) : cette fonction n'est appelée qu'APRÈS
// acceptation explicite. Avant le clic Accepter, aucun script Google n'est chargé
// et aucune requête ne part — pas même un ping sans cookies.
export function initGA() {
  if (!GA_ID || typeof window === "undefined") return;
  if (document.getElementById("ga-script")) return;

  window.dataLayer = window.dataLayer || [];
  // GA4 requiert un objet Arguments (pas un Array) pour reconnaître les commandes gtag
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function() { window.dataLayer.push(arguments); } as typeof window.gtag;

  // Le consentement analytics est acquis (on n'arrive ici qu'après acceptation) ;
  // les signaux publicitaires restent refusés — le site ne fait pas de pub Google
  window.gtag("consent", "default", {
    analytics_storage:   "granted",
    ad_storage:          "denied",
    ad_user_data:        "denied",
    ad_personalization:  "denied",
  });

  window.gtag("js", new Date());
  window.gtag("config", GA_ID);

  const script = document.createElement("script");
  script.id    = "ga-script";
  script.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

const TR = {
  fr: {
    msg:     "Ce site utilise Google Analytics pour mesurer l'audience. Aucune donnée n'est collectée tant que vous n'acceptez pas.",
    accept:  "Accepter",
    decline: "Refuser",
  },
  en: {
    msg:     "This site uses Google Analytics to measure traffic. No data is collected until you accept.",
    accept:  "Accept",
    decline: "Decline",
  },
} as const;

export function CookieBanner() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie(COOKIE_KEY);
    if (consent === "true")  { initGA(); return; } // consentement déjà donné
    if (consent === "false") return;               // refus : rien n'est chargé
    setVisible(true);                              // pas de choix → bannière
  }, []);

  const accept = () => {
    setCookie(COOKIE_KEY, "true", 365);
    setVisible(false);
    initGA();
    // Les refus ne sont pas mesurables en mode basic (rien n'est chargé) —
    // le taux d'acceptation se lit en croisant avec les logs serveur
    track("consent_choice", { choice: "accepted" });
  };

  const decline = () => {
    setCookie(COOKIE_KEY, "false", 365);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-3 bg-bg-1 border-t border-line font-mono text-[12px] text-fg-1">
      <p className="flex-1 min-w-0 text-dim">{TR[lang].msg}</p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={decline}
          className="px-4 py-[5px] border border-line text-dim hover:text-fg transition-colors"
        >
          {TR[lang].decline}
        </button>
        <button
          onClick={accept}
          className="px-4 py-[5px] bg-brand text-bg font-semibold hover:brightness-110 transition-all"
        >
          {TR[lang].accept}
        </button>
      </div>
    </div>
  );
}

// Retrait du consentement (lien "gérer les cookies" du footer) :
// efface le choix ET les cookies GA posés lors d'un consentement antérieur
export function resetConsent() {
  setCookie(COOKIE_KEY, "", -1);
  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const domain = location.hostname.replace(/^www\./, "");
  for (const entry of document.cookie.split("; ")) {
    const name = entry.split("=")[0];
    if (name === "_ga" || name?.startsWith("_ga_")) {
      // GA pose ses cookies sur le domaine racine — supprimer avec et sans attribut domain
      document.cookie = `${name}=; ${expired}; path=/`;
      document.cookie = `${name}=; ${expired}; path=/; domain=.${domain}`;
    }
  }
}
