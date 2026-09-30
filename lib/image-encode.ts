/**
 * Réencodage d'une image par canvas — partagé par le mode fichier unique et le
 * mode lot du convertisseur d'images.
 */
export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

/** Largeur cible : on réduit, on n'agrandit jamais ; 0 = taille d'origine. */
export function targetSize(w: number, h: number, maxWidth: number): { w: number; h: number } {
  if (!maxWidth || w <= maxWidth) return { w, h };
  return { w: maxWidth, h: Math.round((h * maxWidth) / w) };
}

export class EncodeError extends Error {
  constructor(public reason: "load" | "canvas" | "encode") {
    super(reason);
  }
}

export interface Encoded {
  blob: Blob;
  src: { w: number; h: number };
  out: { w: number; h: number };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new EncodeError("load"));
    img.src = url;
  });
}

/** `quality` entre 0 et 1, ignorée pour le PNG. */
export async function encodeImage(file: Blob, format: ImageFormat, quality: number, maxWidth: number): Promise<Encoded> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const src = { w: img.naturalWidth, h: img.naturalHeight };
    const out = targetSize(src.w, src.h, maxWidth);
    const canvas = document.createElement("canvas");
    canvas.width = out.w;
    canvas.height = out.h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new EncodeError("canvas");
    ctx.imageSmoothingQuality = "high";
    // Le JPEG n'a pas de couche alpha : fond blanc plutôt que noir
    if (format === "image/jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, out.w, out.h);
    }
    ctx.drawImage(img, 0, 0, out.w, out.h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, format, quality));
    if (!blob) throw new EncodeError("encode");
    return { blob, src, out };
  } finally {
    URL.revokeObjectURL(url);
  }
}
