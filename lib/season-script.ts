import { SEASON_IDS, seasonFor } from "./season";

/** Coupe-circuit : NEXT_PUBLIC_SEASON=off (au build) n'émet plus le script. */
export const SEASON_ENABLED = process.env.NEXT_PUBLIC_SEASON !== "off";

/**
 * Script inline exécuté avant le premier rendu : pose data-season (et
 * data-season-banner="closed" si le bandeau de cette saison a été fermé).
 * `?season=<id>` force une saison pour l'onglet, `?season=off` la désactive.
 */
export const SEASON_SCRIPT = `(function(){var f=(${seasonFor.toString()}),r=document.documentElement,ids=${JSON.stringify(SEASON_IDS)},s=null;try{var st=window.sessionStorage,q=location.search.match(/[?&]season=([a-z]+)/);if(q)st.setItem('season',q[1]);var o=st.getItem('season');if(o==='off')return;if(o&&ids.indexOf(o)>-1)s=o}catch(e){}if(!s)s=f(new Date());if(!s)return;r.setAttribute('data-season',s);try{if(localStorage.getItem('season-banner-closed')===s)r.setAttribute('data-season-banner','closed')}catch(e){}})();`;
