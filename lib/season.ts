/**
 * Thèmes saisonniers. Tout est piloté par l'attribut `data-season="<id>"` posé
 * sur <html> ; sans lui, le site garde exactement son design de base.
 *
 * Calendrier (heure locale du visiteur) :
 *   xmas       1er au 25 décembre
 *   newyear    26 décembre au 5 janvier
 *   valentine  7 au 14 février
 *   easter     de Pâques - 5 jours à Pâques + 1 jour (date calculée chaque année)
 *   halloween  24 au 31 octobre
 *   back       25 août au 15 septembre (rentrée, prioritaire sur l'été)
 *   summer     1er juillet au 31 août
 *
 * Activation : un script inline (lib/season-script.ts) évalue `seasonFor` dans le
 * navigateur avant le premier rendu. C'est volontaire : les pages sont générées
 * au build, une date calculée côté serveur resterait figée jusqu'au prochain
 * déploiement. Le retour au design de base entre deux saisons est automatique.
 *
 * Aperçu hors période : `?season=<id>` dans l'URL (mémorisé pour l'onglet),
 * `?season=off` pour l'annuler. Coupe-circuit : NEXT_PUBLIC_SEASON=off au build.
 *
 * Retrait définitif : supprimer app/seasons.css, components/season/, lib/season*.ts
 * et leurs usages (layout, AppShell, Header, HomeHero, Cursor).
 */

export const SEASON_IDS = ["xmas", "newyear", "valentine", "easter", "halloween", "summer", "back"] as const;
export type SeasonId = (typeof SEASON_IDS)[number];

/**
 * Saison active pour une date locale, ou null. La fonction est volontairement
 * autonome (aucune référence externe) : son code source est injecté tel quel
 * dans le script inline, ce qui garde une seule source de vérité.
 */
export function seasonFor(now: Date): SeasonId | null {
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const md = m * 100 + d;

  if (md >= 1226 || md <= 105) return "newyear";
  if (m === 12) return "xmas";
  if (md >= 207 && md <= 214) return "valentine";

  // Dimanche de Pâques (algorithme de Meeus/Jones/Butcher), jours écoulés depuis.
  const a = y % 19, b = Math.floor(y / 100), c = y % 100;
  const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - dd - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const mm = Math.floor((a + 11 * h + 22 * l) / 451);
  const em = Math.floor((h + l - 7 * mm + 114) / 31);
  const ed = ((h + l - 7 * mm + 114) % 31) + 1;
  const diff = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, em - 1, ed)) / 864e5);
  if (diff >= -5 && diff <= 1) return "easter";

  if (md >= 1024 && md <= 1031) return "halloween";
  if (md >= 825 && md <= 915) return "back";
  if (m === 7 || m === 8) return "summer";
  return null;
}
