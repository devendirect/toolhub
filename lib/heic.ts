/**
 * Lecture des photos HEIC/HEIF (format par défaut des iPhone).
 *
 * Seul Safari sait les décoder nativement ; ailleurs on passe par heic-to
 * (libheif compilé en WebAssembly, LGPL-3.0, ~3 Mo). La librairie n'est
 * téléchargée qu'au premier fichier HEIC, jamais au chargement de la page.
 * Variante `csp` : pas d'eval, compatible avec une Content-Security-Policy stricte.
 */

/** Pour l'attribut `accept` des <input type="file"> */
export const IMAGE_ACCEPT = "image/*,.heic,.heif";

/** Windows et Chrome laissent souvent `type` vide pour un .heic : on regarde aussi l'extension. */
export function isHeicFile(file: { name: string; type: string }): boolean {
  return /^image\/hei[cf](-sequence)?$/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
}

/** Image acceptée par nos outils, HEIC compris même sans type MIME. */
export function isImageFile(file: { name: string; type: string }): boolean {
  return file.type.startsWith("image/") || isHeicFile(file);
}

/** Safari 17+ décode le HEIC seul : on s'épargne alors les 3 Mo de libheif. */
async function decodeNatively(file: Blob, type: string, quality: number): Promise<Blob | null> {
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    return null;
  }
  const canvas = document.createElement("canvas");
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  canvas.getContext("2d")?.drawImage(bmp, 0, 0);
  bmp.close();
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Renvoie un fichier que tout navigateur sait afficher : le fichier lui-même
 * s'il n'est pas HEIC, sinon sa conversion.
 * PNG par défaut (sans perte : l'outil appelant fera la seule compression),
 * JPEG pour les usages où un PNG de photo serait inutilement lourd (PDF).
 */
export async function decodeIfHeic(
  file: File,
  type: "image/png" | "image/jpeg" = "image/png",
  quality = 0.92,
): Promise<File> {
  if (!isHeicFile(file)) return file;
  let blob = await decodeNatively(file, type, quality);
  if (!blob) {
    const { heicTo } = await import("heic-to/csp");
    blob = await heicTo({ blob: file, type, quality });
  }
  const ext = type === "image/png" ? "png" : "jpg";
  return new File([blob], file.name.replace(/\.hei[cf]$/i, "") + "." + ext, { type });
}
