"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { track } from "@/lib/analytics";
import { watchTcf, reopenCmp, type TcfState } from "@/lib/tcf";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// Version 2 du cookie, et le suffixe compte.
//
// Une version antérieure de la détection TCF prenait « CMP initialisée sans
// verdict » pour un refus : elle enregistrait ce refus sans que personne n'ait
// rien demandé au visiteur, et masquait la bannière. Les valeurs écrites dans
// `utilisio-consent` pendant cette période ne reflètent aucun choix réel et ne
// doivent pas être respectées — changer de clé les écarte proprement.
const COOKIE_KEY = "utilisio-consent-v2";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1] ?? "") : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function ensureGtag() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function() { window.dataLayer.push(arguments); } as typeof window.gtag;
  }
}

// Seul `analytics_storage` nous appartient désormais.
//
// Le consentement publicitaire relève de la CMP certifiée IAB TCF que Google
// impose pour diffuser dans l'EEE, au Royaume-Uni et en Suisse : elle émet
// elle-même `ad_storage`, `ad_user_data` et `ad_personalization`. Y toucher
// depuis ici reviendrait à écraser son verdict selon l'ordre de chargement.
//
// Les valeurs par défaut sont posées dans app/layout.tsx avant tout script
// Google ; on n'émet ici que des « update », seul type d'appel pris en compte
// après coup — un second « default » serait ignoré.
function pushAnalyticsConsent(granted: boolean) {
  ensureGtag();
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

// GA reste conditionné au chargement effectif de son script : avec le seul
// signal Consent Mode, il émettrait des pings sans cookie que l'on ne souhaite
// pas avant un choix explicite.
function applyAnalytics(granted: boolean) {
  pushAnalyticsConsent(granted);
  if (granted) loadGA();
}

function loadGA() {
  if (!GA_ID || typeof window === "undefined") return;
  if (document.getElementById("ga-script")) return;

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
    msg:     "Ce site mesure son audience avec Google Analytics. Rien n'est chargé tant que vous n'avez pas accepté.",
    accept:  "Accepter",
    decline: "Refuser",
  },
  en: {
    msg:     "This site measures its audience with Google Analytics. Nothing is loaded until you accept.",
    accept:  "Accept",
    decline: "Decline",
  },
} as const;

/**
 * Bannière de consentement pour la seule mesure d'audience.
 *
 * Elle ne s'affiche que lorsqu'aucune CMP certifiée ne pilote la page. Dans
 * l'EEE, au Royaume-Uni et en Suisse, la CMP de Google prend la main : elle
 * recueille le consentement publicitaire au format TCF, et nous en déduisons
 * celui de la mesure d'audience via la finalité 1 — « stocker ou accéder à des
 * informations sur un appareil », qui est exactement la base légale dont le
 * cookie de Google Analytics a besoin.
 *
 * Le visiteur voit donc toujours exactement une bannière : la nôtre ou celle de
 * la CMP, jamais les deux empilées.
 */
export function CookieBanner() {
  const { lang } = useLang();
  const i = TR[lang];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getCookie(COOKIE_KEY);

    // Un choix déjà enregistré s'applique immédiatement, sans attendre la CMP.
    if (stored !== null) applyAnalytics(stored === "true");

    const stop = watchTcf((state: TcfState) => {
      if (state.kind === "pending") {
        setVisible(false);
        return;
      }

      if (state.kind === "decided") {
        // La CMP fait autorité et remplace tout choix antérieur de notre côté.
        setCookie(COOKIE_KEY, String(state.storageConsent), 365);
        applyAnalytics(state.storageConsent);
        setVisible(false);
        return;
      }

      // Aucune CMP applicable : à nous de demander, si ce n'est pas déjà fait.
      setVisible(stored === null);
    });

    return stop;
  }, []);

  const choose = (granted: boolean) => {
    setCookie(COOKIE_KEY, String(granted), 365);
    setVisible(false);
    applyAnalytics(granted);
    // Un refus n'est pas mesurable : GA n'est pas chargé, track() est un no-op.
    if (granted) track("consent_choice", { analytics: "true" });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-6 py-4 bg-bg-1 border-t border-line font-mono text-[12px] text-fg-1">
      <p className="flex-1 min-w-0 text-dim">{i.msg}</p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => choose(false)}
          className="px-4 py-[5px] border border-line text-dim hover:text-fg transition-colors"
        >
          {i.decline}
        </button>
        <button
          onClick={() => choose(true)}
          className="px-4 py-[5px] bg-brand text-bg font-semibold hover:brightness-110 transition-all"
        >
          {i.accept}
        </button>
      </div>
    </div>
  );
}

/**
 * Retrait du consentement — lien « gérer les cookies » du pied de page.
 *
 * Quand la CMP est présente, la chaîne de consentement lui appartient : nous ne
 * pouvons pas la révoquer depuis notre code, seulement lui rendre la main via
 * son écran de révocation. Sinon, on efface notre propre choix ainsi que les
 * cookies déjà posés par Google Analytics.
 *
 * Retourne `true` si la CMP a repris la main, auquel cas l'appelant n'a pas
 * besoin de recharger la page.
 */
export function resetConsent(): boolean {
  if (reopenCmp()) return true;

  setCookie(COOKIE_KEY, "", -1);
  pushAnalyticsConsent(false);

  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const domain = location.hostname.replace(/^www\./, "");
  for (const entry of document.cookie.split("; ")) {
    const name = entry.split("=")[0];
    if (name === "_ga" || name?.startsWith("_ga_")) {
      // GA pose ses cookies sur le domaine racine — supprimer avec et sans domaine
      document.cookie = `${name}=; ${expired}; path=/`;
      document.cookie = `${name}=; ${expired}; path=/; domain=.${domain}`;
    }
  }
  return false;
}
