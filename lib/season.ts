/**
 * Thème saisonnier (Noël). Tout est piloté par l'attribut `data-season="xmas"`
 * posé sur <html> ; sans lui le site garde exactement son design de base.
 *
 * Activation : un script inline (SEASON_SCRIPT) l'ajoute côté navigateur quand
 * le mois local est décembre. C'est volontaire : les pages sont générées au
 * build, une date calculée côté serveur resterait figée jusqu'au prochain
 * déploiement. Le retour au design de base le 1er janvier est donc automatique.
 *
 * Aperçu hors décembre : ajouter `?season=xmas` à l'URL (mémorisé pour l'onglet),
 * `?season=off` pour l'annuler.
 *
 * Coupe-circuit : NEXT_PUBLIC_SEASON=off (au build) n'émet plus le script.
 * Retrait définitif : supprimer app/seasonal-xmas.css, components/season/ et les
 * usages marqués « xmas » dans AppShell, Header, HomeHero, Cursor, layout.
 */
export const SEASON_ENABLED = process.env.NEXT_PUBLIC_SEASON !== "off";

export const SEASON_SCRIPT = `(function(){var r=document.documentElement,on=function(){r.setAttribute('data-season','xmas')};try{var s=window.sessionStorage,q=location.search;if(/[?&]season=off/.test(q))s.setItem('season','off');else if(/[?&]season=xmas/.test(q))s.setItem('season','xmas');var f=s.getItem('season');if(f==='xmas'||(f!=='off'&&new Date().getMonth()===11))on()}catch(e){if(new Date().getMonth()===11)on()}})();`;

/** Sapin ASCII : chaque rangée est centrée sur la colonne 8. */
export const XMAS_TREE = [
  "        *",
  "       /^\\",
  "      /^o^\\",
  "     /^^^o^\\",
  "    /^o^^^o^\\",
  "   /^^^o^^^^o\\",
  "  /^o^^^^^o^^^\\",
  " /^^^^o^^^^^^o^\\",
  "       |||",
];
