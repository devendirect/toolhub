import { describe, it, expect } from "vitest";
import { parseSitemap, parseState, computeDiff, stateFrom, manualUrls } from "../../scripts/indexnow-ping.mjs";
import sitemap from "@/app/sitemap";
import { SITE_URL } from "@/lib/brand";
import { TOOLS } from "@/lib/tools";
import { latestChangeForTool } from "@/lib/changelog";

const SITE = "https://utilisio.com";

const XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>http://localhost:3000/fr/guides/webp-avif-jpeg</loc>
<lastmod>2026-10-10</lastmod>
</url>
<url>
<loc>http://localhost:3000/fr/t/base64</loc>
</url>
</urlset>`;

describe("indexnow-ping : lecture du sitemap", () => {
  it("relève l'URL et la date, et ramène l'origine au domaine du site", () => {
    expect(parseSitemap(XML, SITE)).toEqual([
      { url: `${SITE}/fr/guides/webp-avif-jpeg`, lastmod: "2026-10-10" },
      { url: `${SITE}/fr/t/base64`, lastmod: "" },
    ]);
  });
});

describe("indexnow-ping : différentiel", () => {
  const entries = [
    { url: `${SITE}/a`, lastmod: "2026-10-10" },
    { url: `${SITE}/b`, lastmod: "" },
    { url: `${SITE}/c`, lastmod: "2026-09-25" },
  ];

  it("premier envoi (état vide) : tout part comme ajouté", () => {
    expect(computeDiff(entries, new Map())).toEqual({ added: [`${SITE}/a`, `${SITE}/b`, `${SITE}/c`], updated: [], removed: [] });
  });

  it("date changée → modifiée ; date identique ou absente → rien ; URL disparue → retirée", () => {
    const state = new Map<string, string | null>([[`${SITE}/a`, "2026-09-25"], [`${SITE}/b`, ""], [`${SITE}/c`, "2026-09-25"], [`${SITE}/old`, ""]]);
    expect(computeDiff(entries, state)).toEqual({ added: [], updated: [`${SITE}/a`], removed: [`${SITE}/old`] });
  });

  it("ancien format (tableau d'URLs) : seules les URLs qui ont maintenant une date repartent, une fois", () => {
    const old = parseState(JSON.stringify([`${SITE}/a`, `${SITE}/b`, `${SITE}/c`]));
    expect(computeDiff(entries, old)).toEqual({ added: [], updated: [`${SITE}/a`, `${SITE}/c`], removed: [] });
    // après cet envoi, l'état au nouveau format ne renvoie plus rien
    expect(computeDiff(entries, parseState(JSON.stringify(stateFrom(entries))))).toEqual({ added: [], updated: [], removed: [] });
  });
});

describe("indexnow-ping : envoi manuel --urls", () => {
  it("accepte chemins et URLs du site, refuse un autre domaine", () => {
    expect(manualUrls("/fr/changelog, https://utilisio.com/en/changelog", SITE)).toEqual([`${SITE}/fr/changelog`, `${SITE}/en/changelog`]);
    expect(() => manualUrls("https://example.org/x", SITE)).toThrow();
  });
});

describe("sitemap : dates des pages outils", () => {
  const byUrl = new Map(sitemap().map((e) => [e.url, e.lastModified]));

  it("un outil cité dans Nouveautés porte la date de sa dernière entrée", () => {
    const withChange = TOOLS.filter((t) => !t.comingSoon && latestChangeForTool(t.slug));
    expect(withChange.length).toBeGreaterThan(0);
    const bad = withChange.filter((t) => byUrl.get(`${SITE_URL}/fr/t/${t.slug}`) !== latestChangeForTool(t.slug)!.date).map((t) => t.slug);
    expect(bad).toEqual([]);
  });

  it("un outil jamais cité n'a pas de date inventée", () => {
    const without = TOOLS.filter((t) => !t.comingSoon && !latestChangeForTool(t.slug));
    expect(without.filter((t) => byUrl.get(`${SITE_URL}/fr/t/${t.slug}`) !== undefined).map((t) => t.slug)).toEqual([]);
  });
});
