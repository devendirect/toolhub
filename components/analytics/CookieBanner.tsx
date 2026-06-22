"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";

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

// Initialise GA avec les défauts Consent Mode v2 (tout refusé)
// Le script charge mais ne collecte rien tant que l'utilisateur n'a pas accepté
export function initGA() {
  if (!GA_ID || typeof window === "undefined") return;
  if (document.getElementById("ga-script")) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) { window.dataLayer.push(args); };

  // Consent Mode v2 — défauts refusés AVANT le chargement du script
  window.gtag("consent", "default", {
    analytics_storage:   "denied",
    ad_storage:          "denied",
    ad_user_data:        "denied",
    ad_personalization:  "denied",
    wait_for_update:     500,
  });

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.id    = "ga-script";
  script.src   = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

export function grantConsent() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage:   "granted",
    ad_storage:          "granted",
    ad_user_data:        "granted",
    ad_personalization:  "granted",
  });
  // Envoie la page vue maintenant que le consentement est accordé
  if (GA_ID) window.gtag("config", GA_ID, { send_page_view: true });
}

export function denyConsent() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage:   "denied",
    ad_storage:          "denied",
    ad_user_data:        "denied",
    ad_personalization:  "denied",
  });
}

// Alias pour compatibilité avec les imports existants
export const loadGA = initGA;

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
    initGA(); // Toujours initialiser avec les défauts refusés
    const consent = getCookie(COOKIE_KEY);
    if (consent === "true")  { grantConsent(); return; }
    if (consent === "false") { denyConsent();  return; }
    setVisible(true); // Pas de choix → afficher la bannière
  }, []);

  const accept = () => {
    setCookie(COOKIE_KEY, "true", 365);
    setVisible(false);
    grantConsent();
  };

  const decline = () => {
    setCookie(COOKIE_KEY, "false", 365);
    setVisible(false);
    denyConsent();
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

export function resetConsent() {
  setCookie(COOKIE_KEY, "", -1);
}
