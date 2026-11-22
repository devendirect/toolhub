import { describe, it, expect } from "vitest";
import { seasonFor, SEASON_IDS, type SeasonId } from "@/lib/season";
import { SEASON_SCRIPT } from "@/lib/season-script";
import { DECOR } from "@/lib/season-decor";

// Midi local : évite tout effet de bord de fuseau horaire
const at = (y: number, m: number, d: number) => seasonFor(new Date(y, m - 1, d, 12));

describe("seasonFor — calendrier fixe", () => {
  it.each<[string, number, number, number, SeasonId | null]>([
    ["veille de Noël", 2026, 11, 30, null],
    ["1er décembre", 2026, 12, 1, "xmas"],
    ["25 décembre", 2026, 12, 25, "xmas"],
    ["26 décembre", 2026, 12, 26, "newyear"],
    ["31 décembre", 2026, 12, 31, "newyear"],
    ["1er janvier", 2027, 1, 1, "newyear"],
    ["5 janvier", 2027, 1, 5, "newyear"],
    ["6 janvier", 2027, 1, 6, null],
    ["6 février", 2027, 2, 6, null],
    ["7 février", 2027, 2, 7, "valentine"],
    ["14 février", 2027, 2, 14, "valentine"],
    ["15 février", 2027, 2, 15, null],
    ["23 octobre", 2026, 10, 23, null],
    ["24 octobre", 2026, 10, 24, "halloween"],
    ["31 octobre", 2026, 10, 31, "halloween"],
    ["1er novembre", 2026, 11, 1, null],
    ["30 juin", 2026, 6, 30, null],
    ["1er juillet", 2026, 7, 1, "summer"],
    ["24 août", 2026, 8, 24, "summer"],
    ["25 août (la rentrée passe avant l'été)", 2026, 8, 25, "back"],
    ["15 septembre", 2026, 9, 15, "back"],
    ["16 septembre", 2026, 9, 16, null],
  ])("%s", (_l, y, m, d, expected) => {
    expect(at(y, m, d)).toBe(expected);
  });
});

describe("seasonFor — Pâques (date variable : de Pâques - 5 jours à Pâques + 1)", () => {
  // Pâques : 5 avril 2026, 28 mars 2027, 16 avril 2028
  it.each<[number, number, number, number, number]>([
    [2026, 3, 31, 4, 6],
    [2027, 3, 23, 3, 29],
    [2028, 4, 11, 4, 17],
  ])("%i : du %i/%i au %i/%i", (y, m1, d1, m2, d2) => {
    expect(at(y, m1, d1)).toBe("easter");
    expect(at(y, m2, d2)).toBe("easter");
    const before = new Date(y, m1 - 1, d1 - 1, 12);
    const after = new Date(y, m2 - 1, d2 + 1, 12);
    expect(seasonFor(before)).toBeNull();
    expect(seasonFor(after)).toBeNull();
  });
});

describe("script inline et décors", () => {
  it("le script inline est du JavaScript valide", () => {
    expect(() => new Function(SEASON_SCRIPT)).not.toThrow();
  });

  it("chaque saison a un décor FR et EN complet", () => {
    for (const id of SEASON_IDS) {
      const d = DECOR[id];
      for (const l of ["fr", "en"] as const) {
        expect(d.banner[l].trim(), `${id} bandeau ${l}`).not.toBe("");
        expect(d.prompt[l].trim(), `${id} prompt ${l}`).not.toBe("");
        expect(d.banner[l], `${id} tiret long ${l}`).not.toContain("—");
      }
    }
  });
});
