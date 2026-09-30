import type { Lang } from "./types";
import { TOOLS } from "./tools";
import { GUIDE_JSON_YAML_TOML } from "./guides/json-yaml-toml";
import { GUIDE_WEBP_AVIF_JPEG } from "./guides/webp-avif-jpeg";
import { GUIDE_JWT } from "./guides/jwt-explained";
import { GUIDE_SECURITY_HEADERS } from "./guides/http-security-headers";
import { GUIDE_OPEN_GRAPH } from "./guides/open-graph-link-previews";
import { GUIDE_MARKDOWN_TABLES } from "./guides/markdown-tables";

/**
 * Guides éditoriaux (/[lang]/guides/[slug]).
 *
 * Le texte des blocs accepte deux marquages en ligne, et seulement ceux-là :
 * `code` et [libellé](/t/outil) — un lien interne sans préfixe de langue,
 * ajouté au rendu. Tout le reste est du texte brut.
 *
 * Contraintes vérifiées par __tests__/catalog/guides.test.ts : slugs uniques,
 * outils liés existants, meta description 120–155 caractères, contenu FR et EN.
 */
export type GuideBlock =
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { code: string }
  | { table: { head: string[]; rows: string[][] } };

export interface GuideSection { h: string; blocks: GuideBlock[] }

export interface GuideText {
  title: string;
  description: string;       // meta description, 120–155 caractères
  lead: string;              // chapeau : la réponse courte, citable telle quelle
  sections: GuideSection[];
  faq: { q: string; a: string }[];
}

export interface Guide {
  slug: string;
  published: string;         // AAAA-MM-JJ
  updated: string;           // AAAA-MM-JJ
  tools: string[];           // outils cités, liés depuis leur page et en fin de guide
  en: GuideText;
  fr: GuideText;
}

export const GUIDES: Guide[] = [GUIDE_JSON_YAML_TOML, GUIDE_WEBP_AVIF_JPEG, GUIDE_JWT, GUIDE_SECURITY_HEADERS, GUIDE_OPEN_GRAPH, GUIDE_MARKDOWN_TABLES];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Guides qui citent un outil donné (lien retour depuis la page outil). */
export function guidesForTool(slug: string): Guide[] {
  return GUIDES.filter((g) => g.tools.includes(slug));
}

/** Guides dont au moins un outil appartient à la catégorie. */
export function guidesForCategory(cat: string): Guide[] {
  return GUIDES.filter((g) => g.tools.some((s) => TOOLS.find((t) => t.slug === s)?.cat === cat));
}

export function guideWords(text: GuideText): number {
  const count = (s: string) => s.split(/\s+/).filter(Boolean).length;
  return (
    count(text.lead) +
    text.sections.reduce((n, sec) => n + count(sec.h) + sec.blocks.reduce((m, b) => {
      if ("p" in b) return m + count(b.p);
      if ("ul" in b) return m + b.ul.reduce((k, x) => k + count(x), 0);
      if ("ol" in b) return m + b.ol.reduce((k, x) => k + count(x), 0);
      if ("table" in b) return m + b.table.rows.flat().reduce((k, x) => k + count(x), 0);
      return m;
    }, 0), 0) +
    text.faq.reduce((n, f) => n + count(f.q) + count(f.a), 0)
  );
}

/** Temps de lecture, à ~220 mots par minute. */
export function readingMinutes(text: GuideText): number {
  return Math.max(1, Math.round(guideWords(text) / 220));
}

export function guideText(guide: Guide, lang: Lang): GuideText {
  return guide[lang];
}
