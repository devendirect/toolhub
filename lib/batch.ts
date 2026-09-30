/**
 * Traitement par lot, sans dépendance au DOM (testé dans __tests__/lib/batch.test.ts).
 */

/**
 * Nom unique dans une archive : deux IMG_0001.HEIC venus de dossiers
 * différents deviennent IMG_0001.jpg et IMG_0001-2.jpg. Comparaison insensible
 * à la casse, comme sur Windows et macOS où l'archive sera extraite.
 */
export function uniqueName(name: string, used: Set<string>): string {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let candidate = name;
  for (let n = 2; used.has(candidate.toLowerCase()); n++) candidate = `${base}-${n}${ext}`;
  used.add(candidate.toLowerCase());
  return candidate;
}

export type ItemStatus = "pending" | "working" | "done" | "error";

/**
 * Traite les éléments un par un — jamais en parallèle, pour ne garder qu'une
 * image décodée en mémoire à la fois. Une erreur marque l'élément et le lot
 * continue ; `isCancelled` est consulté entre deux éléments.
 * Renvoie le nombre d'éléments réussis.
 */
export async function runSequential<T>(
  items: readonly T[],
  work: (item: T, index: number) => Promise<void>,
  onStatus: (index: number, status: ItemStatus) => void,
  isCancelled: () => boolean = () => false,
): Promise<number> {
  let done = 0;
  for (let i = 0; i < items.length; i++) {
    if (isCancelled()) break;
    onStatus(i, "working");
    try {
      await work(items[i]!, i);
      onStatus(i, "done");
      done++;
    } catch {
      onStatus(i, "error");
    }
  }
  return done;
}
