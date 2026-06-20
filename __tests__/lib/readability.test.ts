import { describe, it, expect } from "vitest";
import { syllablesEn, syllablesFr, analyze, fleschLevel } from "@/lib/readability";

describe("syllablesEn", () => {
  it("1 syllabe — mots courts", () => {
    expect(syllablesEn("the")).toBe(1);
    expect(syllablesEn("cat")).toBe(1);
    expect(syllablesEn("dog")).toBe(1);
    expect(syllablesEn("bright")).toBe(1);
  });

  it("règle silent-e — le e final est supprimé avant le compte", () => {
    // "inside" → "insid" → ["i","i"] = 2
    expect(syllablesEn("inside")).toBe(2);
    // "mistake" → "mistak" → ["i","a"] = 2
    expect(syllablesEn("mistake")).toBe(2);
    // "stripe" → "strip" → ["i"] = 1
    expect(syllablesEn("stripe")).toBe(1);
  });

  it("mots polysyllabiques", () => {
    // "beautiful" → ["eau","i","u"] = 3 groupes de voyelles
    expect(syllablesEn("beautiful")).toBe(3);
    // "understand" → ["u","e","a"] = 3
    expect(syllablesEn("understand")).toBe(3);
    // "communication" → ["o","u","i","a","io"] = 5
    expect(syllablesEn("communication")).toBe(5);
  });

  it("minimum 1 syllabe même sans voyelle détectée", () => {
    expect(syllablesEn("gym")).toBe(1);
    expect(syllablesEn("rhythm")).toBe(1);
  });

  it("ignore la ponctuation", () => {
    expect(syllablesEn("cat,")).toBe(1);
    expect(syllablesEn("understand.")).toBe(3);
  });
});

describe("syllablesFr", () => {
  it("1 syllabe", () => {
    expect(syllablesFr("chat")).toBe(1);
    expect(syllablesFr("main")).toBe(1);
  });

  it("mots accentués", () => {
    expect(syllablesFr("été")).toBe(2);
    expect(syllablesFr("éléphant")).toBe(3);
  });

  it("voyelles groupées → 1 syllabe par groupe", () => {
    expect(syllablesFr("beau")).toBe(1);
    expect(syllablesFr("peau")).toBe(1);
  });

  it("mots polysyllabiques", () => {
    expect(syllablesFr("liberté")).toBe(3);
    expect(syllablesFr("communication")).toBe(5);
  });

  it("retourne 0 sur chaîne vide après nettoyage", () => {
    expect(syllablesFr("123")).toBe(0);
  });
});

describe("analyze", () => {
  it("retourne null si moins de 5 mots", () => {
    expect(analyze("Too short text.", "en")).toBeNull();
    expect(analyze("Un deux trois.", "fr")).toBeNull();
  });

  it("retourne un résultat pour un texte suffisant (EN)", () => {
    const text = "The quick brown fox jumps over the lazy dog. This is a simple sentence.";
    const r = analyze(text, "en");
    expect(r).not.toBeNull();
    expect(r!.wordCount).toBeGreaterThan(0);
    expect(r!.sentCount).toBeGreaterThan(0);
  });

  it("retourne un résultat pour un texte suffisant (FR)", () => {
    const text = "Le renard brun saute par-dessus le chien paresseux. Voici une phrase simple.";
    const r = analyze(text, "fr");
    expect(r).not.toBeNull();
    expect(r!.wordCount).toBeGreaterThan(0);
  });

  it("flesch est borné entre 0 et 100", () => {
    const text = "The very, very, very, very long incomprehensible multisyllabic terminology overwhelms understanding comprehensively.";
    const r = analyze(text, "en");
    expect(r!.flesch).toBeGreaterThanOrEqual(0);
    expect(r!.flesch).toBeLessThanOrEqual(100);
  });

  it("texte simple → score flesch élevé (EN)", () => {
    const text = "The cat sat on the mat. The dog ran. It was fun. Go now.";
    const r = analyze(text, "en");
    expect(r!.flesch).toBeGreaterThan(60);
  });

  it("texte complexe → score flesch bas (EN)", () => {
    const text = "Implementation of sophisticated algorithms necessitates comprehensive understanding of interdependent computational methodologies. Parameterization facilitates optimization.";
    const r = analyze(text, "en");
    expect(r!.flesch).toBeLessThan(40);
  });

  it("fog index est positif", () => {
    const text = "The quick brown fox jumps over the lazy dog. Simple words work best.";
    const r = analyze(text, "en");
    expect(r!.fog).toBeGreaterThan(0);
  });
});

describe("fleschLevel", () => {
  const levels = ["très difficile", "difficile", "standard", "facile", "très facile"] as const;

  it("score >= 80 → très facile", () => {
    expect(fleschLevel(80, levels)).toBe("très facile");
    expect(fleschLevel(100, levels)).toBe("très facile");
  });

  it("score 60–79 → facile", () => {
    expect(fleschLevel(60, levels)).toBe("facile");
    expect(fleschLevel(79, levels)).toBe("facile");
  });

  it("score 40–59 → standard", () => {
    expect(fleschLevel(40, levels)).toBe("standard");
    expect(fleschLevel(59, levels)).toBe("standard");
  });

  it("score 20–39 → difficile", () => {
    expect(fleschLevel(20, levels)).toBe("difficile");
  });

  it("score < 20 → très difficile", () => {
    expect(fleschLevel(0, levels)).toBe("très difficile");
    expect(fleschLevel(19, levels)).toBe("très difficile");
  });
});
