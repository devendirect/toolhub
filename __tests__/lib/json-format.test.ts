import { describe, it, expect } from "vitest";
import { inspectJson, formatJson } from "@/lib/json-format";

const opts = { indent: 2 as const, sortKeys: false, minify: true };
const hintOf = (s: string) => inspectJson(s).error?.hint;

describe("inspectJson — localisation et cause des erreurs", () => {
  it("JSON valide : aucune erreur", () => {
    expect(inspectJson('{"a": [1, 2.5, -3e2, true, null, "x\\n"]}').error).toBeNull();
  });

  it("virgule finale dans un tableau et dans un objet", () => {
    expect(hintOf("[1, 2,]")).toBe("trailingComma");
    expect(hintOf('{"a": 1,}')).toBe("trailingComma");
  });

  it("apostrophes, commentaire, clé sans guillemets", () => {
    expect(hintOf("{'a': 1}")).toBe("singleQuote");
    expect(hintOf('{"a": 1 // note\n}')).toBe("comment");
    expect(hintOf("{a: 1}")).toBe("unquotedKey");
  });

  it("virgule manquante : ligne et colonne exactes", () => {
    const e = inspectJson('{\n  "a": 1\n  "b": 2\n}').error!;
    expect(e.hint).toBe("expectedComma");
    expect([e.line, e.col]).toEqual([3, 3]);
  });

  it("valeurs JavaScript qui ne sont pas du JSON", () => {
    expect(hintOf('{"a": undefined}')).toBe("notJson");
    expect(hintOf('{"a": NaN}')).toBe("notJson");
  });

  it("contenu en trop et fin prématurée", () => {
    expect(hintOf("{} {}")).toBe("trailingContent");
    expect(hintOf('{"a": ')).toBe("unexpectedEnd");
  });
});

describe("formatJson", () => {
  it("conserve les grands entiers au chiffre près", () => {
    const r = formatJson('{"id": 1234567890123456789, "n": 42}', opts);
    expect(r.ok && r.output).toBe('{"id":1234567890123456789,"n":42}');
    expect(r.ok && r.bigIntCount).toBe(1);
  });

  it("conserve les grands entiers après tri des clés et indentation", () => {
    const r = formatJson('{"z": 1, "a": [9007199254740993]}', { indent: 2, sortKeys: true, minify: false });
    expect(r.ok && r.output).toBe('{\n  "a": [\n    9007199254740993\n  ],\n  "z": 1\n}');
  });

  it("signale les clés en double", () => {
    const r = formatJson('{"a": 1, "b": {"c": 1, "c": 2}, "a": 3}', opts);
    expect(r.ok && r.duplicateKeys).toEqual(["b.c", "a"]);
  });

  it("renvoie l'erreur localisée au lieu de lever", () => {
    const r = formatJson("[1,2,]", opts);
    expect(!r.ok && r.error.hint).toBe("trailingComma");
  });
});
