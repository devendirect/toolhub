import { describe, it, expect } from "vitest";
import { generate, entropyBits } from "@/components/workspaces/PasswordGenerator";

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

describe("entropyBits — calculée sur l'alphabet réellement utilisé", () => {
  it("minuscules seules : 26 caractères", () => {
    expect(entropyBits(8, ALL_OFF)).toBe(Math.floor(8 * Math.log2(26)));
  });

  it("les 4 familles : 26 + 26 + 10 + 26 symboles = 88 caractères", () => {
    expect(entropyBits(16, ALL_ON)).toBe(Math.floor(16 * Math.log2(88)));
  });

  it("sans caractères ambigus : l'alphabet rétrécit, l'entropie aussi", () => {
    expect(entropyBits(16, { ...ALL_ON, noAmbiguous: true })).toBeLessThan(entropyBits(16, ALL_ON));
  });
});

describe("generate — chaque famille cochée est présente", () => {
  it("sur 200 tirages de 8 caractères, toujours au moins une majuscule, un chiffre et un symbole", () => {
    for (let n = 0; n < 200; n++) {
      const pw = generate(8, ALL_ON);
      expect(pw).toMatch(/[A-Z]/);
      expect(pw).toMatch(/[0-9]/);
      expect(pw).toMatch(/[^a-zA-Z0-9]/);
    }
  });
});
