/**
 * Recherche du couple (dimensions, qualité) qui fait passer une image sous un
 * poids cible — le moteur de l'outil « réduire une image à X Ko ».
 *
 * Stratégie : à une échelle donnée, recherche dichotomique de la qualité la
 * plus haute qui tient dans la cible. Si même la qualité plancher dépasse, on
 * réduit les dimensions et on recommence. Le plancher (0,4) est volontaire :
 * en dessous, les artefacts JPEG/WebP deviennent grossiers, et une image un peu
 * plus petite mais propre vaut mieux qu'une image pleine taille illisible.
 *
 * L'encodeur est injecté (canvas.toBlob dans le navigateur, un faux dans les
 * tests) : la logique ne dépend d'aucune API DOM.
 */

/** 1 Ko = 1000 octets : tient aussi sous une limite qui compte 1024. */
export const KB = 1000;

export const MIN_QUALITY = 0.4;
export const MAX_QUALITY = 0.92;
const QUALITY_STEPS = 7;
const MAX_PASSES = 10;
const MIN_SIDE = 16;

export type Encode = (width: number, height: number, quality: number) => Promise<Blob>;

export interface FitResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
  /** false : cible inatteignable, `blob` est le plus petit fichier obtenu */
  reached: boolean;
  attempts: number;
}

export async function fitToSize(
  width: number,
  height: number,
  targetBytes: number,
  encode: Encode,
): Promise<FitResult> {
  let scale = 1;
  let attempts = 0;
  let smallest: FitResult | null = null;

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    const run = async (q: number) => { attempts++; return encode(w, h, q); };

    // Qualité haute d'abord : souvent suffisante quand la cible est large
    const top = await run(MAX_QUALITY);
    if (top.size <= targetBytes) {
      return { blob: top, width: w, height: h, quality: MAX_QUALITY, reached: true, attempts };
    }

    const floor = await run(MIN_QUALITY);
    if (!smallest || floor.size < smallest.blob.size) {
      smallest = { blob: floor, width: w, height: h, quality: MIN_QUALITY, reached: false, attempts };
    }

    if (floor.size <= targetBytes) {
      let lo = MIN_QUALITY;
      let hi = MAX_QUALITY;
      let best = floor;
      for (let i = 0; i < QUALITY_STEPS; i++) {
        const mid = (lo + hi) / 2;
        const blob = await run(mid);
        if (blob.size <= targetBytes) { best = blob; lo = mid; } else { hi = mid; }
      }
      return { blob: best, width: w, height: h, quality: lo, reached: true, attempts };
    }

    // Le poids varie à peu près comme la surface : on vise la racine du ratio,
    // avec une marge, sans jamais diviser un côté par plus de deux d'un coup.
    const factor = Math.max(0.5, Math.sqrt(targetBytes / floor.size) * 0.9);
    scale *= factor;
    if (Math.min(width, height) * scale < MIN_SIDE) break;
  }

  return { ...smallest!, attempts };
}
