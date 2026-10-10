import { describe, it, expect } from "vitest";
import { TOOLS } from "@/lib/tools";
import { GUIDES, guideWords, sourceNumbers, CITATION, type Guide } from "@/lib/guides";
import { CONVERT_PAIRS } from "@/lib/convert-pairs";
import { PDF_PAIRS } from "@/lib/pdf-pairs";

const LANGS = ["en", "fr"] as const;
const LINK = /\[[^\]]+\]\(([^)]+)\)/g;

describe("GUIDES — données éditoriales", () => {
  it("slugs uniques, au format URL", () => {
    const slugs = GUIDES.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.filter((s) => !/^[a-z0-9-]+$/.test(s))).toEqual([]);
  });

  it("outils cités existants et actifs", () => {
    const bad = GUIDES.flatMap((g) => g.tools.filter((s) => !TOOLS.some((t) => t.slug === s && !t.comingSoon)).map((s) => `${g.slug}:${s}`));
    expect(bad).toEqual([]);
  });

  it("meta description entre 120 et 155 caractères, titre ≤ 60", () => {
    const bad = GUIDES.flatMap((g) => LANGS.flatMap((l) => {
      const { title, description } = g[l];
      const out: string[] = [];
      if (description.length < 120 || description.length > 155) out.push(`${g.slug}/${l} desc ${description.length}`);
      if (title.length > 60) out.push(`${g.slug}/${l} title ${title.length}`);
      return out;
    }));
    expect(bad).toEqual([]);
  });

  it("au moins 900 mots par langue", () => {
    const short = GUIDES.flatMap((g) => LANGS.map((l) => [g.slug, l, guideWords(g[l])] as const).filter(([, , n]) => n < 900).map(([s, l, n]) => `${s}/${l}: ${n}`));
    expect(short).toEqual([]);
  });

  it("les liens internes du texte pointent vers des outils, guides ou paires de conversion existants", () => {
    const text = (g: (typeof GUIDES)[number]) => JSON.stringify([g.en, g.fr]);
    const bad = GUIDES.flatMap((g) => [...text(g).matchAll(LINK)].map((m) => m[1]!).filter((href) => {
      const tool = /^\/t\/([a-z0-9-]+)$/.exec(href);
      const guide = /^\/guides\/([a-z0-9-]+)$/.exec(href);
      const pair = /^\/convert\/([a-z0-9-]+)$/.exec(href);
      if (pair) return ![...CONVERT_PAIRS, ...PDF_PAIRS].some((p) => p.slug === pair[1]);
      if (tool) return !TOOLS.some((t) => t.slug === tool[1] && !t.comingSoon);
      if (guide) return !GUIDES.some((x) => x.slug === guide[1]);
      return href.startsWith("/");
    }).map((h) => `${g.slug}: ${h}`));
    expect(bad).toEqual([]);
  });

  it("dates au format AAAA-MM-JJ, mise à jour ≥ publication", () => {
    const bad = GUIDES.filter((g) => !/^\d{4}-\d{2}-\d{2}$/.test(g.published) || !/^\d{4}-\d{2}-\d{2}$/.test(g.updated) || g.updated < g.published);
    expect(bad.map((g) => g.slug)).toEqual([]);
  });
});

describe("GUIDES — vérification des faits et sources", () => {
  const today = new Date().toISOString().slice(0, 10);
  const cited = (g: Guide, l: (typeof LANGS)[number]) => [...JSON.stringify(g[l].sections).matchAll(CITATION)].map((m) => m[1]!);

  it("chaque renvoi [^id] du texte correspond à une source déclarée", () => {
    const bad = GUIDES.flatMap((g) => LANGS.flatMap((l) => cited(g, l)
      .filter((id) => !(g.sources ?? []).some((s) => s.id === id))
      .map((id) => `${g.slug}/${l}: ${id}`)));
    expect(bad).toEqual([]);
  });

  it("renvois seulement dans les sections (pas dans le titre, la meta, le chapeau ni la FAQ)", () => {
    const bad = GUIDES.flatMap((g) => LANGS.filter((l) => {
      const { title, description, lead, faq } = g[l];
      return [...JSON.stringify({ title, description, lead, faq }).matchAll(CITATION)].length > 0;
    }).map((l) => `${g.slug}/${l}`));
    expect(bad).toEqual([]);
  });

  it("sources : ids uniques au format a-z0-9-, URL https, chacune citée (texte ou affirmation)", () => {
    const bad = GUIDES.flatMap((g) => {
      const ids = (g.sources ?? []).map((s) => s.id);
      const out: string[] = [];
      if (new Set(ids).size !== ids.length) out.push(`${g.slug}: ids en double`);
      for (const s of g.sources ?? []) {
        if (!/^[a-z0-9-]+$/.test(s.id)) out.push(`${g.slug}: id ${s.id}`);
        if (!s.url.startsWith("https://")) out.push(`${g.slug}: url ${s.url}`);
        const used = LANGS.some((l) => cited(g, l).includes(s.id)) || (g.claims ?? []).some((c) => c.source === s.id);
        if (!used) out.push(`${g.slug}: ${s.id} jamais citée`);
      }
      return out;
    });
    expect(bad).toEqual([]);
  });

  it("affirmations : source existante ou \"test\", texte FR et EN, aucun tiret long", () => {
    const bad = GUIDES.flatMap((g) => (g.claims ?? []).flatMap((c) => {
      const out: string[] = [];
      if (c.source !== "test" && !(g.sources ?? []).some((s) => s.id === c.source)) out.push(`${g.slug}: source ${c.source}`);
      if (!c.text.fr.trim() || !c.text.en.trim()) out.push(`${g.slug}: texte manquant`);
      if (JSON.stringify(c).includes("—")) out.push(`${g.slug}: tiret long`);
      return out;
    }));
    expect(bad).toEqual([]);
  });

  it("verified entre la publication et aujourd'hui, et seulement avec des sources ou des affirmations", () => {
    const bad = GUIDES.filter((g) => g.verified !== undefined && (
      !/^\d{4}-\d{2}-\d{2}$/.test(g.verified) || g.verified < g.published || g.verified > today ||
      ((g.sources?.length ?? 0) === 0 && (g.claims?.length ?? 0) === 0)
    )).map((g) => g.slug);
    expect(bad).toEqual([]);
  });

  it("sourceNumbers numérote dans l'ordre d'apparition, puis les sources des seules affirmations", () => {
    const base = GUIDES[0]!;
    const text = { ...base.en, sections: [{ h: "x", blocks: [{ p: "Un.[^b] Deux.[^a] Encore.[^b]" }] }] };
    const fake: Guide = {
      ...base,
      en: text,
      fr: text,
      sources: ["a", "b", "c"].map((id) => ({ id, title: id, publisher: id, url: `https://example.org/${id}`, official: true })),
      claims: [{ text: { fr: "x", en: "x" }, source: "c" }, { text: { fr: "y", en: "y" }, source: "test" }],
    };
    expect([...sourceNumbers(fake, "en")]).toEqual([["b", 1], ["a", 2], ["c", 3]]);
  });
});
