import { describe, it, expect } from "vitest";
import { CONVERT_PAIRS } from "@/lib/convert-pairs";
import { PDF_PAIRS } from "@/lib/pdf-pairs";
import { CONVERT_META } from "@/lib/convert-seo";

const LANGS = ["en", "fr"] as const;
const slugs = [...CONVERT_PAIRS, ...PDF_PAIRS].map((p) => p.slug);
const entries = Object.entries(CONVERT_META);

describe("CONVERT_META — meta descriptions des pages /convert/*", () => {
  it("chaque paire a une entrée, et aucune entrée n'est orpheline", () => {
    expect(slugs.filter((s) => !(s in CONVERT_META))).toEqual([]);
    expect(entries.filter(([s]) => !slugs.includes(s)).map(([s]) => s)).toEqual([]);
  });

  it("entre 120 et 155 caractères", () => {
    const outOfRange = entries.flatMap(([slug, d]) =>
      LANGS.filter((l) => d[l].length < 120 || d[l].length > 155).map((l) => `${slug}/${l}: ${d[l].length}`)
    );
    expect(outOfRange).toEqual([]);
  });

  it("uniques", () => {
    const all = entries.flatMap(([, d]) => [d.en, d.fr]);
    expect(all.filter((d, i) => all.indexOf(d) !== i)).toEqual([]);
  });
});
