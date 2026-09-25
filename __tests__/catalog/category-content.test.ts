import { describe, it, expect } from "vitest";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { CATEGORY_CONTENT } from "@/lib/category-content";

const cats = CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id);
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe("CATEGORY_CONTENT — hubs des pages catégories", () => {
  it("chaque catégorie a son contenu", () => {
    expect(cats.filter((c) => !(c in CATEGORY_CONTENT))).toEqual([]);
  });

  it("le guide ne pointe que vers des outils actifs de la bonne catégorie", () => {
    const bad = Object.entries(CATEGORY_CONTENT).flatMap(([cat, c]) =>
      c.guide
        .filter(({ slug }) => {
          const tool = TOOLS.find((t) => t.slug === slug);
          return !tool || tool.comingSoon || tool.cat !== cat;
        })
        .map(({ slug }) => `${cat}:${slug}`)
    );
    expect(bad).toEqual([]);
  });

  it("au moins 300 mots éditoriaux par hub et par langue", () => {
    const short = Object.entries(CATEGORY_CONTENT).flatMap(([cat, c]) =>
      (["en", "fr"] as const)
        .map((l) => {
          const n =
            words(c.intro.h[l]) +
            c.intro.p[l].reduce((s, p) => s + words(p), 0) +
            c.guide.reduce((s, g) => s + words(g.need[l]), 0) +
            c.faq.reduce((s, f) => s + words(f.q[l]) + words(f.a[l]), 0);
          return n < 300 ? `${cat}/${l}: ${n}` : null;
        })
        .filter(Boolean)
    );
    expect(short).toEqual([]);
  });
});
