import { describe, it, expect } from "vitest";
import { TOOLS } from "@/lib/tools";
import { GUIDES, guideWords } from "@/lib/guides";

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

  it("les liens internes du texte pointent vers des outils ou guides existants", () => {
    const text = (g: (typeof GUIDES)[number]) => JSON.stringify([g.en, g.fr]);
    const bad = GUIDES.flatMap((g) => [...text(g).matchAll(LINK)].map((m) => m[1]!).filter((href) => {
      const tool = /^\/t\/([a-z0-9-]+)$/.exec(href);
      const guide = /^\/guides\/([a-z0-9-]+)$/.exec(href);
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
