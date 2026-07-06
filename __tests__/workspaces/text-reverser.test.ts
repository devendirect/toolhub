import { describe, it, expect } from "vitest";
import { reverseText } from "@/components/workspaces/TextReverser";

describe("reverseText", () => {
  it("mode chars : inverse les caractères", () => {
    expect(reverseText("abc", "chars")).toBe("cba");
  });

  it("mode chars : ne casse pas les emojis (surrogate pairs)", () => {
    expect(reverseText("ab🚀", "chars")).toBe("🚀ba");
  });

  it("mode words : inverse les mots ligne par ligne", () => {
    expect(reverseText("one two three\nfour five", "words")).toBe("three two one\nfive four");
  });

  it("mode lines : inverse l'ordre des lignes", () => {
    expect(reverseText("first\nsecond\nthird", "lines")).toBe("third\nsecond\nfirst");
  });

  it("gère les fins de ligne Windows (CRLF)", () => {
    expect(reverseText("first\r\nsecond", "lines")).toBe("second\nfirst");
  });

  it("chaîne vide → chaîne vide", () => {
    expect(reverseText("", "chars")).toBe("");
  });
});
