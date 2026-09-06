"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { track } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const COOKIE_KEY = "utilisio-consent";
const ADS_COOKIE_KEY = "utilisio-consent-ads";

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

// Consent Mode v2 : mesure d'audience et publicité sont deux finalités distinctes,
// chacune avec son propre signal. Les valeurs par défaut ("denied") sont posées dans
// app/layout.tsx avant tout script Google ; on n'émet ici que des "update", qui sont
// le seul type d'appel autorisé après coup — un second "default" serait ignoré.
function pushConsent(analytics: boolean, ads: boolean) {
  ensureGtag();
  window.gtag("consent", "update", {
    analytics_storage:   analytics ? "granted" : "denied",
    ad_storage:          ads ? "granted" : "denied",
    ad_user_data:        ads ? "granted" : "denied",
    ad_personalization:  ads ? "granted" : "denied",
  });
}

// Le tag AdSense est chargé inconditionnellement par le layout racine : sans
// consentement il diffuse des annonces non personnalisées et sans cookie. Seule la
// mesure d'audience reste conditionnée au chargement effectif de son script — GA
// émettrait sinon des pings sans cookie que l'on ne souhaite pas avant un choix.
function applyConsent(analytics: boolean, ads: boolean) {
  pushConsent(analytics, ads);
  if (analytics) loadGA();
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
    msg:        "Ce site utilise Google Analytics (mesure d'audience) et affiche des publicités Google AdSense. Sans votre accord, aucune mesure n'est effectuée et les annonces restent non personnalisées, sans cookie publicitaire.",
    customize:  "Personnaliser",
    acceptAll:  "Tout accepter",
    declineAll: "Tout refuser",
    analyticsLabel: "Mesure d'audience",
    analyticsDesc:  "Google Analytics — statistiques de trafic anonymisées.",
    adsLabel: "Publicité personnalisée",
    adsDesc:  "Google AdSense — autorise les cookies publicitaires et la personnalisation des annonces. Refusé, les annonces restent affichées mais non personnalisées.",
    save: "Enregistrer mes choix",
  },
  en: {
    msg:        "This site uses Google Analytics (audience measurement) and shows Google AdSense ads. Without your consent nothing is measured and ads stay non-personalized, with no advertising cookie.",
    customize:  "Customize",
    acceptAll:  "Accept all",
    declineAll: "Decline all",
    analyticsLabel: "Audience measurement",
    analyticsDesc:  "Google Analytics — anonymized traffic stats.",
    adsLabel: "Personalized advertising",
    adsDesc:  "Google AdSense — allows advertising cookies and ad personalization. If declined, ads still show but stay non-personalized.",
    save: "Save my choices",
  },
} as const;

export function CookieBanner() {
  const { lang } = useLang();
  const i = TR[lang];
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefAnalytics, setPrefAnalytics] = useState(false);
  const [prefAds, setPrefAds] = useState(false);

  useEffect(() => {
    const analyticsConsent = getCookie(COOKIE_KEY);
    const adsConsent = getCookie(ADS_COOKIE_KEY);

    applyConsent(analyticsConsent === "true", adsConsent === "true");

    setPrefAnalytics(analyticsConsent === "true");
    setPrefAds(adsConsent === "true");

    // Bannière ré-affichée si une des deux catégories n'a jamais reçu de choix explicite
    // (ex : utilisateur ayant déjà répondu pour analytics avant l'ajout de la pub)
    if (analyticsConsent === null || adsConsent === null) setVisible(true);
  }, []);

  const applyChoice = (analytics: boolean, ads: boolean) => {
    setCookie(COOKIE_KEY, String(analytics), 365);
    setCookie(ADS_COOKIE_KEY, String(ads), 365);
    setVisible(false);
    setExpanded(false);
    applyConsent(analytics, ads);
    // Un refus total reste non mesurable : GA n'est pas chargé, track() est un no-op
    if (analytics) track("consent_choice", { analytics: String(analytics), ads: String(ads) });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-3 px-6 py-4 bg-bg-1 border-t border-line font-mono text-[12px] text-fg-1">
      <div className="flex items-center justify-between gap-4">
        <p className="flex-1 min-w-0 text-dim">{i.msg}</p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="px-4 py-[5px] border border-line text-dim hover:text-fg transition-colors"
          >
            {i.customize}
          </button>
          <button
            onClick={() => applyChoice(false, false)}
            className="px-4 py-[5px] border border-line text-dim hover:text-fg transition-colors"
          >
            {i.declineAll}
          </button>
          <button
            onClick={() => applyChoice(true, true)}
            className="px-4 py-[5px] bg-brand text-bg font-semibold hover:brightness-110 transition-all"
          >
            {i.acceptAll}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3 pt-3 border-t border-line">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefAnalytics}
              onChange={(e) => setPrefAnalytics(e.target.checked)}
              style={{ accentColor: "var(--brand)" }}
              className="mt-[3px]"
            />
            <span>
              <span className="text-fg-1">{i.analyticsLabel}</span>
              <span className="block text-dim">{i.analyticsDesc}</span>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefAds}
              onChange={(e) => setPrefAds(e.target.checked)}
              style={{ accentColor: "var(--brand)" }}
              className="mt-[3px]"
            />
            <span>
              <span className="text-fg-1">{i.adsLabel}</span>
              <span className="block text-dim">{i.adsDesc}</span>
            </span>
          </label>
          <button
            onClick={() => applyChoice(prefAnalytics, prefAds)}
            className="self-start px-4 py-[5px] bg-brand text-bg font-semibold hover:brightness-110 transition-all"
          >
            {i.save}
          </button>
        </div>
      )}
    </div>
  );
}

// Retrait du consentement (lien "gérer les cookies" du footer) :
// efface les deux choix ET les cookies GA posés lors d'un consentement antérieur.
// Les cookies publicitaires Google (doubleclick.net) sont posés sur un domaine tiers
// et ne peuvent pas être supprimés depuis notre JS — seul le rechargement futur du
// script est bloqué.
export function resetConsent() {
  setCookie(COOKIE_KEY, "", -1);
  setCookie(ADS_COOKIE_KEY, "", -1);
  // Repasser les signaux Consent Mode à "denied" immédiatement : AdSense retombe
  // en annonces non personnalisées sans attendre le rechargement de la page.
  pushConsent(false, false);
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
