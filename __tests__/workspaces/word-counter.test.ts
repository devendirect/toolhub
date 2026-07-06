import { describe, it, expect } from "vitest";
import { countWords, countSentences, countParagraphs } from "@/components/workspaces/WordCounter";

describe("countWords", () => {
  it("compte les mots simples", () => {
    expect(countWords("one two three")).toBe(3);
  });

  it("chaîne vide ou espaces → 0", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n  ")).toBe(0);
  });

  it("la ponctuation seule ne compte pas comme mot", () => {
    expect(countWords("hello, world!")).toBe(2);
  });

  it("les nombres comptent comme mots", () => {
    expect(countWords("42 tools")).toBe(2);
  });
});

describe("countSentences", () => {
  it("compte ., ! et ?", () => {
    expect(countSentences("One. Two! Three?")).toBe(3);
  });

  it("les points de suspension comptent pour une seule phrase", () => {
    expect(countSentences("Wait...")).toBe(1);
  });

  it("texte sans ponctuation finale → 0", () => {
    expect(countSentences("no ending")).toBe(0);
  });
});

describe("countParagraphs", () => {
  it("sépare sur les lignes vides", () => {
    expect(countParagraphs("para one\n\npara two")).toBe(2);
  });

  it("un simple saut de ligne ne crée pas de paragraphe", () => {
    expect(countParagraphs("line one\nline two")).toBe(1);
  });

  it("ignore les blocs vides en fin de texte", () => {
    expect(countParagraphs("para one\n\n\n")).toBe(1);
  });

  it("chaîne vide → 0", () => {
    expect(countParagraphs("")).toBe(0);
  });
});
