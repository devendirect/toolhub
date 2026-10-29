import type { Lang } from "./types";
import { TOOLS } from "./tools";
import { GUIDE_JSON_YAML_TOML } from "./guides/json-yaml-toml";
import { GUIDE_WEBP_AVIF_JPEG } from "./guides/webp-avif-jpeg";
import { GUIDE_JWT } from "./guides/jwt-explained";
import { GUIDE_SECURITY_HEADERS } from "./guides/http-security-headers";
import { GUIDE_OPEN_GRAPH } from "./guides/open-graph-link-previews";
import { GUIDE_MARKDOWN_TABLES } from "./guides/markdown-tables";
import { GUIDE_WHERE_FILES_GO } from "./guides/where-converted-files-go";
import { GUIDE_ONE_PDF_APPLICATION } from "./guides/one-pdf-application";

/**
 * Guides éditoriaux (/[lang]/guides/[slug]).
 *
 * Le texte des blocs accepte trois marquages en ligne, et seulement ceux-là :
 * `code`, [libellé](/t/outil) (lien interne sans préfixe de langue, ajouté au
 * rendu) et [^id] (renvoi vers une source de `sources`, affiché [1], [2]…).
 * Les renvois ne s'utilisent que dans les sections, collés au mot ou à la
 * ponctuation qui précède. Tout le reste est du texte brut.
 *
 * Contraintes vérifiées par __tests__/catalog/guides.test.ts : slugs uniques,
 * outils liés existants, meta description 120–155 caractères, contenu FR et EN.
 */
export type GuideBlock =
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { code: string }
  | { table: { head: string[]; rows: string[][] } }
  /** Prise en charge par navigateur ou par outil, rendue en sortie terminal. */
  | { support: { query: string; rows: SupportRow[] } };

export interface SupportRow {
  label: string;                       // « chrome 155+ »
  state: "yes" | "partial" | "no";
  note: string;                        // « par défaut · oct. 2026 »
}

/** Source citée par un guide (renvois [^id] dans le texte, bloc de vérification). */
export interface GuideSource {
  id: string;                          // a-z0-9-, référencé par [^id]
  title: string;                       // titre du document, non traduit
  publisher: string;                   // « Chrome for Developers »
  url: string;                         // https uniquement
  official: boolean;                   // source primaire (éditeur, norme) ou secondaire
}

/** Affirmation vérifiée, listée dans le bloc `$ utilisio verify`. */
export interface GuideClaim {
  text: Record<Lang, string>;
  source: string;                      // id d'une GuideSource, ou "test" (vérifié sur nos outils)
  recheck?: Record<Lang, string>;      // affiché après « à revérifier » : « à la sortie de Firefox 158 »
}

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
  /** Dernière passe de vérification des faits (AAAA-MM-JJ). Sans elle, ni badge ni bloc « verify ». */
  verified?: string;
  sources?: GuideSource[];
  claims?: GuideClaim[];
  en: GuideText;
  fr: GuideText;
}

export const GUIDES: Guide[] = [GUIDE_JSON_YAML_TOML, GUIDE_WEBP_AVIF_JPEG, GUIDE_JWT, GUIDE_SECURITY_HEADERS, GUIDE_OPEN_GRAPH, GUIDE_MARKDOWN_TABLES, GUIDE_WHERE_FILES_GO, GUIDE_ONE_PDF_APPLICATION];

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

export const CITATION = /\[\^([a-z0-9-]+)\]/g;

/**
 * Numéro affiché de chaque source : ordre de première apparition des renvois
 * [^id] dans les sections, puis les sources citées seulement par une affirmation.
 */
export function sourceNumbers(guide: Guide, lang: Lang): Map<string, number> {
  const order = new Map<string, number>();
  const add = (id: string) => { if (!order.has(id)) order.set(id, order.size + 1); };
  for (const m of JSON.stringify(guide[lang].sections).matchAll(CITATION)) add(m[1]!);
  for (const c of guide.claims ?? []) if (c.source !== "test") add(c.source);
  for (const src of guide.sources ?? []) add(src.id);
  return order;
}

export function guideWords(text: GuideText): number {
  const count = (s: string) => s.replace(CITATION, "").split(/\s+/).filter(Boolean).length;
  return (
    count(text.lead) +
    text.sections.reduce((n, sec) => n + count(sec.h) + sec.blocks.reduce((m, b) => {
      if ("p" in b) return m + count(b.p);
      if ("ul" in b) return m + b.ul.reduce((k, x) => k + count(x), 0);
      if ("ol" in b) return m + b.ol.reduce((k, x) => k + count(x), 0);
      if ("table" in b) return m + b.table.rows.flat().reduce((k, x) => k + count(x), 0);
      if ("support" in b) return m + b.support.rows.reduce((k, r) => k + count(r.label) + count(r.note), 0);
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
