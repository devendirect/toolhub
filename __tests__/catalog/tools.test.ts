import { describe, it, expect, vi } from "vitest";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { CONVERT_PAIRS, FORMAT_LABEL } from "@/lib/convert-pairs";

// Le registry appelle next/dynamic à l'import — on le neutralise pour ne tester
// que le mapping slug → workspace, sans monter de composant.
vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

import { WORKSPACE_REGISTRY } from "@/lib/workspace-registry";

const active = TOOLS.filter((t) => !t.comingSoon);
const registryKeys = Object.keys(WORKSPACE_REGISTRY);

describe("catalogue TOOLS ↔ WORKSPACE_REGISTRY", () => {
  it("chaque outil actif a un workspace enregistré", () => {
    const missing = active.filter((t) => !(t.slug in WORKSPACE_REGISTRY)).map((t) => t.slug);
    expect(missing).toEqual([]);
  });

  it("aucune entrée orpheline dans le registry", () => {
    const slugs = new Set(TOOLS.map((t) => t.slug));
    const orphans = registryKeys.filter((k) => !slugs.has(k));
    expect(orphans).toEqual([]);
  });
});

describe("catalogue TOOLS — cohérence des données", () => {
  it("slugs uniques", () => {
    const slugs = TOOLS.map((t) => t.slug);
    const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(dupes).toEqual([]);
  });

  it("name et desc renseignés en fr et en", () => {
    const incomplete = TOOLS.filter(
      (t) => !t.name.fr?.trim() || !t.name.en?.trim() || !t.desc.fr?.trim() || !t.desc.en?.trim()
    ).map((t) => t.slug);
    expect(incomplete).toEqual([]);
  });

  it("cat appartient aux catégories déclarées", () => {
    const validCats = new Set(CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id));
    const invalid = TOOLS.filter((t) => !validCats.has(t.cat)).map((t) => `${t.slug}:${t.cat}`);
    expect(invalid).toEqual([]);
  });

  it("privacy vaut 'local', 'network' ou absent", () => {
    const invalid = TOOLS.filter(
      (t) => t.privacy !== undefined && t.privacy !== "local" && t.privacy !== "network"
    ).map((t) => t.slug);
    expect(invalid).toEqual([]);
  });

  it("glyph et tags non vides", () => {
    const invalid = TOOLS.filter((t) => !t.glyph.trim() || t.tags.length === 0).map((t) => t.slug);
    expect(invalid).toEqual([]);
  });
});

describe("CONVERT_PAIRS — paires pSEO", () => {
  it("slugs uniques et cohérents avec from/to", () => {
    const slugs = CONVERT_PAIRS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const inconsistent = CONVERT_PAIRS.filter((p) => p.slug !== `${p.from}-to-${p.to}`).map((p) => p.slug);
    expect(inconsistent).toEqual([]);
  });

  it("source ≠ cible et formats connus", () => {
    const validTargets = new Set(["jpg", "png", "webp"]);
    const invalid = CONVERT_PAIRS.filter(
      (p) => p.from === p.to || !validTargets.has(p.to) || !(p.from in FORMAT_LABEL)
    ).map((p) => p.slug);
    expect(invalid).toEqual([]);
  });

  it("contenu bilingue complet (why, points, faq)", () => {
    const incomplete = CONVERT_PAIRS.filter(
      (p) =>
        !p.why.fr?.trim() || !p.why.en?.trim() ||
        p.points.fr.length === 0 || p.points.en.length === 0 ||
        p.faq.length === 0 ||
        p.faq.some((f) => !f.q.fr?.trim() || !f.q.en?.trim() || !f.a.fr?.trim() || !f.a.en?.trim())
    ).map((p) => p.slug);
    expect(incomplete).toEqual([]);
  });
});
