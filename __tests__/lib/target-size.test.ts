import { describe, it, expect } from "vitest";
import { fitToSize, MIN_QUALITY, MAX_QUALITY, type Encode } from "@/lib/target-size";

// Faux encodeur : le poids croît avec la surface et la qualité, comme un JPEG
const fake = (bytesPerPixel: number): Encode => async (w, h, q) =>
  new Blob([new Uint8Array(Math.round(w * h * bytesPerPixel * q))]);

describe("fitToSize", () => {
  it("garde la qualité haute et la taille d'origine quand la cible est large", async () => {
    const r = await fitToSize(1000, 1000, 1_000_000, fake(1));
    expect(r).toMatchObject({ reached: true, width: 1000, height: 1000, quality: MAX_QUALITY });
  });

  it("baisse la qualité sans redimensionner si le plancher suffit", async () => {
    const r = await fitToSize(1000, 1000, 600_000, fake(1));
    expect(r.reached).toBe(true);
    expect(r.width).toBe(1000);
    expect(r.quality).toBeGreaterThanOrEqual(MIN_QUALITY);
    expect(r.quality).toBeLessThan(MAX_QUALITY);
    expect(r.blob.size).toBeLessThanOrEqual(600_000);
    // Dichotomie : proche de la qualité idéale (0,6)
    expect(r.quality).toBeGreaterThan(0.58);
  });

  it("redimensionne en gardant les proportions quand la qualité ne suffit pas", async () => {
    const r = await fitToSize(4000, 3000, 100_000, fake(1));
    expect(r.reached).toBe(true);
    expect(r.blob.size).toBeLessThanOrEqual(100_000);
    expect(r.width).toBeLessThan(4000);
    expect(r.width / r.height).toBeCloseTo(4 / 3, 1);
  });

  it("signale une cible inatteignable et rend le plus petit fichier obtenu", async () => {
    const r = await fitToSize(100, 100, 1, fake(1));
    expect(r.reached).toBe(false);
    expect(r.blob.size).toBeGreaterThan(1);
  });
});
