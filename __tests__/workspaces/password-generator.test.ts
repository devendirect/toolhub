import { describe, it, expect } from "vitest";
import { generate, entropy } from "@/components/workspaces/PasswordGenerator";

const ALL_OFF = { upper: false, digits: false, symbols: false, noAmbiguous: false };
const ALL_ON  = { upper: true,  digits: true,  symbols: true,  noAmbiguous: false };

describe("generate (password)", () => {
  it("respecte la longueur demandée", () => {
    for (const len of [8, 12, 16, 24, 32]) {
      expect(generate(len, ALL_ON)).toHaveLength(len);
    }
  });

  it("toutes options désactivées → uniquement des minuscules", () => {
    expect(generate(32, ALL_OFF)).toMatch(/^[a-z]+$/);
  });

  it("toutes options activées → uniquement des caractères du charset attendu", () => {
    const pw = generate(64, ALL_ON);
    expect(pw).toMatch(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}|;:,.<>?]+$/);
  });

  it("noAmbiguous exclut l 1 I O 0 B 8", () => {
    const pw = generate(200, { ...ALL_ON, noAmbiguous: true });
    expect(pw).not.toMatch(/[l1IO0B8]/);
  });

  it("deux tirages successifs diffèrent (aléa réel)", () => {
    expect(generate(32, ALL_ON)).not.toBe(generate(32, ALL_ON));
  });
});

describe("entropy", () => {
  it("minuscules seules : pool de 26", () => {
    expect(entropy("abcdefgh")).toBe(Math.floor(8 * Math.log2(26)));
  });

  it("les 4 classes : pool de 94", () => {
    expect(entropy("aA1!")).toBe(Math.floor(4 * Math.log2(94)));
  });

  it("croît avec la longueur", () => {
    expect(entropy("abcdefghijkl")).toBeGreaterThan(entropy("abcd"));
  });

  it("chaîne vide → 0", () => {
    expect(entropy("")).toBe(0);
  });
});
