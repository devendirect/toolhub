import { describe, it, expect } from "vitest";
import { encodeEntities, decodeEntities } from "@/lib/html-entities";

describe("table Latin-1", () => {
  it("couvre exactement les points de code 160 à 255", () => {
    // Chaque caractère de la plage doit avoir un nom, sinon le décalage
    // d'indexation de la table est faux quelque part.
    for (let code = 160; code <= 255; code++) {
      const char = String.fromCodePoint(code);
      const encoded = encodeEntities(char);
      // Un nom peut contenir des chiffres : sup2, frac14…
      expect(encoded, `point de code ${code}`).toMatch(/^&[a-zA-Z][a-zA-Z0-9]*;$/);
      expect(decodeEntities(encoded)).toBe(char);
    }
  });

  it("ancre quelques noms connus sur le bon caractère", () => {
    expect(encodeEntities("é")).toBe("&eacute;");
    expect(encodeEntities("ñ")).toBe("&ntilde;");
    expect(encodeEntities("ÿ")).toBe("&yuml;");
    expect(encodeEntities(" ")).toBe("&nbsp;");
    expect(encodeEntities("©")).toBe("&copy;");
    expect(encodeEntities("÷")).toBe("&divide;");
  });
});

describe("encodeEntities", () => {
  it("échappe toujours les cinq caractères structurants", () => {
    expect(encodeEntities(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&apos;");
  });

  it("laisse l'ASCII imprimable intact", () => {
    const ascii = "abcXYZ 019 -_/:.,;!?()[]{}@#$%*+=|~^`\\";
    expect(encodeEntities(ascii)).toBe(ascii);
  });

  it("utilise l'entité nommée quand elle existe, la référence numérique sinon", () => {
    expect(encodeEntities("€")).toBe("&euro;");
    expect(encodeEntities("—")).toBe("&mdash;");
    // Le caractère cyrillique n'a pas de nom HTML 4 : repli numérique.
    expect(encodeEntities("Ж")).toBe("&#1046;");
  });

  it("ne casse pas les paires de substitution", () => {
    // U+1F600, hors du plan multilingue de base : une seule référence, pas deux.
    expect(encodeEntities("😀")).toBe("&#128512;");
    expect(decodeEntities(encodeEntities("😀"))).toBe("😀");
  });

  it("corrige le défaut de l'implémentation par textarea", () => {
    // L'ancienne version ne touchait ni aux guillemets ni aux accents.
    const out = encodeEntities(`Prix : "10€" — limitée`);
    expect(out).toContain("&quot;");
    expect(out).toContain("&euro;");
    expect(out).toContain("&eacute;");
  });
});

describe("decodeEntities", () => {
  it("décode le nommé, le décimal et l'hexadécimal", () => {
    expect(decodeEntities("&eacute;")).toBe("é");
    expect(decodeEntities("&#233;")).toBe("é");
    expect(decodeEntities("&#xE9;")).toBe("é");
    expect(decodeEntities("&#XE9;")).toBe("é");
  });

  it("laisse intacte une référence inconnue plutôt que de la supprimer", () => {
    expect(decodeEntities("&pasunevraieentite;")).toBe("&pasunevraieentite;");
    expect(decodeEntities("a &amp; b &nope; c")).toBe("a & b &nope; c");
  });

  it("laisse intacte une référence numérique non représentable", () => {
    // Au-delà de U+10FFFF, et substituts isolés.
    expect(decodeEntities("&#1114112;")).toBe("&#1114112;");
    expect(decodeEntities("&#xD800;")).toBe("&#xD800;");
  });

  it("ignore une esperluette qui n'ouvre pas de référence", () => {
    expect(decodeEntities("Marks & Spencer")).toBe("Marks & Spencer");
    expect(decodeEntities("a & b")).toBe("a & b");
  });

  it("décode l'échantillon affiché par l'outil", () => {
    const sample =
      "&lt;h1&gt;Bonjour &amp; bienvenue&lt;/h1&gt;\n" +
      "&lt;p&gt;Prix&nbsp;: &quot;10&euro;&quot; &mdash; &lt;strong&gt;offre limit&eacute;e&lt;/strong&gt;&lt;/p&gt;";
    expect(decodeEntities(sample)).toBe(
      "<h1>Bonjour & bienvenue</h1>\n" +
      "<p>Prix : \"10€\" — <strong>offre limitée</strong></p>"
    );
  });
});

describe("aller-retour", () => {
  it("encode puis décode restitue l'original", () => {
    const cases = [
      `<h1>Bonjour & bienvenue</h1>`,
      `Prix : "10€" — offre limitée`,
      "Ελληνικά, кириллица, 中文, 😀",
      "a\nb\tc",
      "",
    ];
    for (const s of cases) {
      expect(decodeEntities(encodeEntities(s)), s).toBe(s);
    }
  });
});
