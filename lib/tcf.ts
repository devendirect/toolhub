"use client";

// Lecture du verdict d'une CMP certifiée IAB TCF v2.2.
//
// Google impose une telle CMP pour diffuser des annonces dans l'EEE, au
// Royaume-Uni et en Suisse. Celle de Google se charge avec le tag AdSense et
// pose l'API globale `__tcfapi`. Elle possède le consentement publicitaire et
// émet elle-même les signaux Consent Mode correspondants.
//
// Ce module ne sert donc qu'à une chose : savoir si cette CMP pilote la page,
// et si l'utilisateur y a accordé la finalité 1 du TCF — « stocker ou accéder à
// des informations sur un appareil ». C'est la base légale dont Google
// Analytics a besoin pour son cookie, et c'est ce qui nous évite d'afficher une
// seconde bannière par-dessus la sienne.

/** Finalité TCF 1 : stocker ou accéder à des informations sur l'appareil. */
const PURPOSE_DEVICE_STORAGE = 1;

/**
 * Au-delà de ce délai, on cesse d'attendre la CMP et on laisse notre bannière
 * demander le consentement à la mesure d'audience.
 */
const SOFT_TIMEOUT_MS = 3000;

/**
 * Mais on continue de guetter jusque-là. Sur une connexion lente, le script de
 * la CMP peut arriver après le délai ci-dessus : sans cette seconde fenêtre,
 * notre bannière resterait affichée et le visiteur en verrait deux empilées —
 * précisément ce que ce module existe pour éviter.
 */
const HARD_TIMEOUT_MS = 15000;

const POLL_INTERVAL_MS = 200;

interface TcData {
  listenerId?: number;
  eventStatus?: "tcloaded" | "cmpuishown" | "useractioncomplete";
  gdprApplies?: boolean;
  purpose?: { consents?: Record<number, boolean> };
}

type TcfApi = (
  command: string,
  version: number,
  callback: (data: TcData, success: boolean) => void,
  parameter?: number,
) => void;

export type TcfState =
  /** Aucune CMP applicable : c'est à notre bannière de demander le consentement. */
  | { kind: "absent" }
  /** La CMP est affichée, l'utilisateur n'a pas tranché — on n'affiche rien. */
  | { kind: "pending" }
  /** La CMP a un verdict. */
  | { kind: "decided"; storageConsent: boolean };

function getApi(): TcfApi | null {
  if (typeof window === "undefined") return null;
  const api = (window as unknown as { __tcfapi?: TcfApi }).__tcfapi;
  return typeof api === "function" ? api : null;
}

/**
 * Observe la CMP et rappelle `onState` à chaque évolution.
 *
 * L'API n'existe pas forcément au montage : le script de la CMP arrive avec le
 * tag AdSense, en asynchrone. On la cherche donc pendant quelques secondes avant
 * de conclure à son absence.
 *
 * Retourne une fonction de désabonnement.
 */
export function watchTcf(onState: (state: TcfState) => void): () => void {
  let cancelled = false;
  let listenerId: number | null = null;
  let reportedAbsent = false;
  const startedAt = Date.now();

  const attach = () => {
    if (cancelled) return;

    const api = getApi();
    if (!api) {
      const elapsed = Date.now() - startedAt;

      // Passé le délai court, on rend la main à notre bannière — mais sans
      // cesser de guetter : si la CMP finit par se charger, son verdict la fera
      // disparaître.
      if (elapsed >= SOFT_TIMEOUT_MS && !reportedAbsent) {
        reportedAbsent = true;
        onState({ kind: "absent" });
      }
      if (elapsed >= HARD_TIMEOUT_MS) return;

      window.setTimeout(attach, POLL_INTERVAL_MS);
      return;
    }

    api("addEventListener", 2, (data, success) => {
      if (cancelled || !success || !data) return;
      if (typeof data.listenerId === "number") listenerId = data.listenerId;

      // La CMP existe mais le RGPD ne s'applique pas à ce visiteur : elle
      // n'affichera aucune interface, c'est donc à notre bannière de prendre le
      // relais pour la mesure d'audience.
      if (data.gdprApplies === false) {
        onState({ kind: "absent" });
        return;
      }

      // Interface affichée, choix en cours : surtout ne rien montrer par-dessus.
      if (data.eventStatus === "cmpuishown") {
        onState({ kind: "pending" });
        return;
      }

      onState({
        kind: "decided",
        storageConsent: data.purpose?.consents?.[PURPOSE_DEVICE_STORAGE] === true,
      });
    });
  };

  attach();

  return () => {
    cancelled = true;
    const api = getApi();
    if (api && listenerId !== null) {
      api("removeEventListener", 2, () => {}, listenerId);
    }
  };
}

/**
 * Rouvre l'écran de consentement de la CMP Google, quand elle est présente.
 *
 * Nous ne pouvons pas révoquer un consentement TCF depuis notre code : la chaîne
 * de consentement appartient à la CMP. Google expose cette fonction pour que le
 * lien « gérer les cookies » d'un site puisse rendre la main à son interface.
 */
export function reopenCmp(): boolean {
  if (typeof window === "undefined") return false;
  const fc = (window as unknown as {
    googlefc?: { showRevocationMessage?: () => void };
  }).googlefc;

  if (typeof fc?.showRevocationMessage !== "function") return false;
  fc.showRevocationMessage();
  return true;
}
