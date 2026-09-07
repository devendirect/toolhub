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

describe("segmentation par graphèmes", () => {
  it("garde un accent combinant sur sa lettre", () => {
    // "cafe" + U+0301 : le é est ici décomposé en deux points de code.
    const decomposed = "café";
    expect(decomposed).toHaveLength(5);

    // L'accent doit rester collé au e, pas migrer sur le f.
    expect(reverseText(decomposed, "chars").normalize("NFC")).toBe("éfac");
  });

  it("ne fait pas éclater un emoji composé par liaison", () => {
    const family = "\u{1F468}‍\u{1F469}‍\u{1F467}";
    expect(reverseText(`a${family}b`, "chars")).toBe(`b${family}a`);
  });

  it("inverser deux fois restitue l'original", () => {
    const cases = [
      "café",
      "\u{1F468}‍\u{1F469}‍\u{1F467} ok",
      "Hello, World!",
      "\u{1F1EB}\u{1F1F7}\u{1F1EC}\u{1F1E7}",
    ];
    for (const s of cases) {
      expect(reverseText(reverseText(s, "chars"), "chars")).toBe(s);
    }
  });
});
