import { describe, it, expect } from "vitest";
import { TOOLS } from "@/lib/tools";
import { TOOLS_SEO } from "@/lib/tools-seo";

const LANGS = ["en", "fr"] as const;
const entries = Object.entries(TOOLS_SEO);

describe("TOOLS_SEO — titres et meta descriptions", () => {
  it("chaque outil a une entrée, et aucune entrée n'est orpheline", () => {
    const slugs = new Set(TOOLS.map((t) => t.slug));
    expect(TOOLS.filter((t) => !(t.slug in TOOLS_SEO)).map((t) => t.slug)).toEqual([]);
    expect(entries.filter(([slug]) => !slugs.has(slug)).map(([slug]) => slug)).toEqual([]);
  });

  it("title ≤ 50 caractères (le layout ajoute « — utilisio »)", () => {
    const tooLong = entries.flatMap(([slug, s]) =>
      LANGS.filter((l) => s.title[l].length > 50).map((l) => `${slug}/${l}: ${s.title[l].length}`)
    );
    expect(tooLong).toEqual([]);
  });

  it("description entre 120 et 155 caractères", () => {
    const outOfRange = entries.flatMap(([slug, s]) =>
      LANGS.filter((l) => s.description[l].length < 120 || s.description[l].length > 155).map(
        (l) => `${slug}/${l}: ${s.description[l].length}`
      )
    );
    expect(outOfRange).toEqual([]);
  });

  it("titres et descriptions uniques, FR ≠ EN", () => {
    const titles = entries.flatMap(([, s]) => [s.title.en, s.title.fr]);
    const descs = entries.flatMap(([, s]) => [s.description.en, s.description.fr]);
    expect(titles.filter((t, i) => titles.indexOf(t) !== i)).toEqual([]);
    expect(descs.filter((d, i) => descs.indexOf(d) !== i)).toEqual([]);
  });

  it("jamais « no logs » sur un outil réseau", () => {
    const network = TOOLS.filter((t) => t.privacy === "network").map((t) => t.slug);
    const offenders = network.filter((slug) =>
      LANGS.some((l) => /no logs|sans logs|aucun log/i.test(TOOLS_SEO[slug]!.description[l]))
    );
    expect(offenders).toEqual([]);
  });
});
