import { describe, it, expect } from "vitest";
import { TOOLS } from "@/lib/tools";
import { CONVERT_PAIRS } from "@/lib/convert-pairs";
import { SITE_URL } from "@/lib/brand";
import sitemap from "@/app/sitemap";
import { GET as getLlms } from "@/app/llms.txt/route";
import { GET as getLlmsFull } from "@/app/llms-full.txt/route";

const active = TOOLS.filter((t) => !t.comingSoon);
const networkTools = active.filter((t) => t.privacy === "network");

describe("sitemap — généré depuis le catalogue", () => {
  const urls = sitemap().map((e) => e.url);

  it("chaque outil actif a ses URLs /en et /fr", () => {
    const missing = active.flatMap((t) =>
      (["en", "fr"] as const)
        .map((l) => `${SITE_URL}/${l}/t/${t.slug}`)
        .filter((u) => !urls.includes(u))
    );
    expect(missing).toEqual([]);
  });

  it("aucun outil comingSoon dans le sitemap", () => {
    const leaked = TOOLS.filter((t) => t.comingSoon)
      .map((t) => `${SITE_URL}/en/t/${t.slug}`)
      .filter((u) => urls.includes(u));
    expect(leaked).toEqual([]);
  });

  it("chaque paire convert a ses URLs /en et /fr", () => {
    const missing = CONVERT_PAIRS.flatMap((p) =>
      (["en", "fr"] as const)
        .map((l) => `${SITE_URL}/${l}/convert/${p.slug}`)
        .filter((u) => !urls.includes(u))
    );
    expect(missing).toEqual([]);
  });
});

describe("llms.txt — généré depuis le catalogue", () => {
  it("liste chaque outil actif et le compte exact", async () => {
    const text = await getLlms().text();
    expect(text).toContain(`${active.length} tools`);
    const missing = active.filter((t) => !text.includes(`- ${t.name.en} — `)).map((t) => t.slug);
    expect(missing).toEqual([]);
  });
});

describe("llms-full.txt — généré depuis le catalogue", () => {
  it("contient l'URL de chaque outil actif", async () => {
    const text = await getLlmsFull().text();
    const missing = active.filter((t) => !text.includes(`/en/t/${t.slug}`)).map((t) => t.slug);
    expect(missing).toEqual([]);
  });

  it("règle trust signals : jamais 'runs entirely in the browser' sur un outil network", async () => {
    const text = await getLlmsFull().text();
    // Découpe par section d'outil (### Nom) pour vérifier la ligne Privacy de chacune
    const sections = text.split(/^### /m).slice(1);
    const sectionOf = (name: string) => sections.find((s) => s.startsWith(`${name}\n`));

    for (const tool of networkTools) {
      const section = sectionOf(tool.name.en);
      expect(section, `section manquante pour ${tool.slug}`).toBeDefined();
      expect(section).toContain("server-side proxy");
      expect(section).not.toContain("runs entirely in the browser");
    }

    for (const tool of active.filter((t) => t.privacy !== "network")) {
      const section = sectionOf(tool.name.en);
      expect(section, `section manquante pour ${tool.slug}`).toBeDefined();
      expect(section).toContain("runs entirely in the browser");
    }
  });
});
