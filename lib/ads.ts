// Configuration AdSense.
//
// L'identifiant éditeur est une donnée PUBLIQUE : il est déjà versionné dans
// public/ads.txt et apparaît en clair dans le HTML de chaque page. Il est donc
// codé ici plutôt que dans une variable NEXT_PUBLIC_*.
//
// Ce choix n'est pas cosmétique : les variables NEXT_PUBLIC_* sont inlinées au
// moment du `npm run build`. Celle qui portait cet identifiant n'avait jamais
// été déclarée sur le VPS, si bien que le bundle de production ne contenait
// aucun tag AdSense — pas même pour un visiteur ayant tout accepté. Une valeur
// versionnée ne peut pas se perdre entre deux environnements.
export const ADS_CLIENT = "ca-pub-3175561114682298";

// Identifiants des blocs d'annonces, à créer dans AdSense → Annonces → Par bloc
// d'annonces. Un emplacement dont l'identifiant est vide ne rend rien : le site
// reste parfaitement fonctionnel tant que les blocs n'existent pas.
export const AD_SLOTS = {
  /** Sous le contenu rédactionnel d'une page outil, avant la FAQ. */
  toolContent: "",
  /** Bas de page des pages de conversion. */
  convertContent: "",
} as const;

// Les pages audio-converter et video-converter servent un en-tête
// Cross-Origin-Embedder-Policy: require-corp, nécessaire à SharedArrayBuffer pour
// ffmpeg.wasm (next.config.ts). Cet en-tête bloque toute ressource tierce
// dépourvue de CORP — donc les iframes AdSense. Y placer un bloc produirait un
// emplacement vide en permanence : on les exclut explicitement.
const COEP_ISOLATED_SLUGS = new Set(["audio-converter", "video-converter"]);

export function adsAllowedOn(slug: string): boolean {
  return !COEP_ISOLATED_SLUGS.has(slug);
}
