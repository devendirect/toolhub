import { describe, it, expect } from "vitest";
import { analyzeHtml } from "@/app/api/seo/route";

const url = new URL("https://example.com/page");
const check = (html: string, id: string, lang: "en" | "fr" = "en") =>
  analyzeHtml(html, url, lang).checks.find((c) => c.id === id)!;

describe("analyzeHtml", () => {
  it("le texte des <script> et <style> n'entre pas dans le nombre de mots", () => {
    const html = `<html><body><p>one two three</p>
      <script>self.__next_f.push([1,"a b c d e f g h i j"])</script>
      <style>.a { color: red }</style></body></html>`;
    expect(analyzeHtml(html, url, "en").wordCount).toBe(3);
  });

  it("alt=\"\" (image décorative) n'est pas compté comme absent", () => {
    const html = `<body><img src="a.png" alt=""><img src="b.png" alt="Logo"></body>`;
    expect(check(html, "images").status).toBe("pass");
  });

  it("une image sans attribut alt est signalée", () => {
    expect(check(`<body><img src="a.png"></body>`, "images").status).toBe("warn");
  });

  it("libellés traduits en français", () => {
    expect(check("<title>x</title>", "title", "fr").label).toBe("Balise title");
    expect(check("<body></body>", "desc", "fr").detail).toBe("Absente");
  });

  // Chiffres cités dans lib/tools-content.ts (seo-analyzer) : à mettre à jour ensemble
  it("une page HTML vide obtient 32 (barème décrit sur la page outil)", () => {
    expect(analyzeHtml("<html><head></head><body></body></html>", url, "en").score).toBe(32);
  });

  it("le total des points est 96", () => {
    const max = analyzeHtml("<body></body>", url, "en").checks.reduce((s, c) => s + c.max, 0);
    expect(max).toBe(96);
  });
});
