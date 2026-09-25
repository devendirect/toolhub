import { describe, it, expect } from "vitest";
import { buildPalette } from "@/components/workspaces/PaletteGenerator";

describe("buildPalette", () => {
  it("le nombre demandé est respecté même quand l'harmonie a moins de teintes", () => {
    expect(buildPalette("#00e08a", "complementary", 5)).toHaveLength(5);
    expect(buildPalette("#00e08a", "triadic", 5)).toHaveLength(5);
  });

  it("la couleur de base est toujours la première", () => {
    expect(buildPalette("#3366cc", "tetradic", 4)[0]).toBe("#3366cc");
  });

  it("complémentaire : la 2e teinte est à 180°", () => {
    expect(buildPalette("#ff0000", "complementary", 2)).toEqual(["#ff0000", "#00ffff"]);
  });

  it("pas de doublons, y compris sur une base grise", () => {
    const p = buildPalette("#808080", "triadic", 5);
    expect(new Set(p).size).toBe(p.length);
  });
});
