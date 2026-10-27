import { describe, it, expect } from "vitest";
import { TOOLS } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { CONVERT_PAIRS } from "@/lib/convert-pairs";
import { PDF_PAIRS } from "@/lib/pdf-pairs";
import { CHANGELOG, latestChangeForTool } from "@/lib/changelog";
import { SITE_URL } from "@/lib/brand";
import sitemap from "@/app/sitemap";
import { GET as getLlms } from "@/app/llms.txt/route";
import { GET as getLlmsFull } from "@/app/llms-full.txt/route";
import { generateMetadata } from "@/app/[lang]/changelog/page";

const LANGS = ["en", "fr"] as const;
const today = new Date().toISOString().slice(0, 10);

describe("CHANGELOG — données", () => {
  it("dates valides, jamais dans le futur, de la plus récente à la plus ancienne", () => {
    const bad = CHANGELOG.filter((e) => !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || Number.isNaN(Date.parse(e.date)) || e.date > today);
    expect(bad.map((e) => e.id)).toEqual([]);
    const dates = CHANGELOG.map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("id uniques, au format ancre", () => {
    const ids = CHANGELOG.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(id))).toEqual([]);
  });

  it("outils et guides cités existants (outils actifs, sauf entrée « retiré »)", () => {
    const bad = CHANGELOG.flatMap((e) => [
      ...(e.tools ?? []).filter((s) => !TOOLS.some((t) => t.slug === s && (e.kind === "removed" || !t.comingSoon))),
      ...(e.guides ?? []).filter((s) => !GUIDES.some((g) => g.slug === s)),
    ].map((s) => `${e.id}:${s}`));
    expect(bad).toEqual([]);
  });

  it("liens internes libres vers des pages existantes", () => {
    const pairs = new Set([...CONVERT_PAIRS, ...PDF_PAIRS].map((p) => p.slug));
    const pages = new Set(["/about", "/guides", "/tools", "/faq", "/contact"]);
    const bad = CHANGELOG.flatMap((e) => (e.links ?? []).map((l) => l.href).filter((href) => {
      if (/^https:\/\//.test(href)) return false;
      const pair = href.match(/^\/convert\/([a-z0-9-]+)$/);
      return pair ? !pairs.has(pair[1]!) : !pages.has(href);
    }).map((h) => `${e.id}:${h}`));
    expect(bad).toEqual([]);
  });

  it("titre et corps présents en FR et EN, corps entre 150 et 600 caractères", () => {
    const bad = CHANGELOG.flatMap((e) => LANGS.flatMap((l) => {
      const { title, body } = e.text[l];
      const out: string[] = [];
      if (!title.trim()) out.push(`${e.id}/${l} titre vide`);
      if (body.length < 150 || body.length > 600) out.push(`${e.id}/${l} corps ${body.length}`);
      return out;
    }));
    expect(bad).toEqual([]);
  });

  it("aucun tiret long, aucun « no logs » sur une entrée qui cite un outil réseau", () => {
    const network = new Set(TOOLS.filter((t) => t.privacy === "network").map((t) => t.slug));
    const bad = CHANGELOG.flatMap((e) => {
      const text = JSON.stringify(e.text);
      const out: string[] = [];
      if (text.includes("—")) out.push(`${e.id}: tiret long`);
      if ((e.tools ?? []).some((s) => network.has(s)) && /no logs?|aucun (journal|log)/i.test(text)) out.push(`${e.id}: no logs`);
      return out;
    });
    expect(bad).toEqual([]);
  });

  it("latestChangeForTool renvoie l'entrée la plus récente de l'outil", () => {
    expect(latestChangeForTool("image-converter")?.id).toBe("2026-10-27-jpeg-xl-firefox");
    expect(latestChangeForTool("base64")).toBeUndefined();
  });
});

describe("page Nouveautés — SEO", () => {
  it("titre ≤ 50 caractères, description entre 120 et 155", async () => {
    const bad: string[] = [];
    for (const l of LANGS) {
      const meta = await generateMetadata({ params: Promise.resolve({ lang: l }) });
      const title = String(meta.title);
      const description = String(meta.description);
      if (title.length > 50) bad.push(`${l} title ${title.length}`);
      if (description.length < 120 || description.length > 155) bad.push(`${l} desc ${description.length}`);
    }
    expect(bad).toEqual([]);
  });

  it("présente dans le sitemap et dans les deux routes llms (règle CLAUDE.md)", async () => {
    const urls = sitemap().map((e) => e.url);
    expect(LANGS.map((l) => `${SITE_URL}/${l}/changelog`).filter((u) => !urls.includes(u))).toEqual([]);
    expect(await getLlms().text()).toContain(`${SITE_URL}/en/changelog`);
    expect(await getLlmsFull().text()).toContain(`${SITE_URL}/en/changelog`);
  });
});
