import { TOOLS, CATEGORIES, networkToolNames } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { SITE_URL, BRAND_NAME } from "@/lib/brand";

// llms.txt condensé, généré depuis le catalogue réel (l'ancien fichier statique
// dans public/ listait 28 outils sur 56 — plus jamais ça). Pré-rendu au build.
// Version détaillée : app/llms-full.txt/route.ts
export const dynamic = "force-static";

export function GET() {
  const live = TOOLS.filter((t) => !t.comingSoon);

  const lines: string[] = [
    `# ${BRAND_NAME}`,
    "",
    `> Free browser-based toolkit — ${live.length} tools for developers, designers and everyday users.`,
    "> Most tools run entirely in your browser with no file upload required.",
    "> No account, no signup, no tracking beyond an optional GA4 consent banner.",
    "",
    `Full per-tool reference (descriptions, use cases, FAQ): ${SITE_URL}/llms-full.txt`,
    "",
    "## Tool categories",
    "",
  ];

  for (const cat of CATEGORIES.filter((c) => c.id !== "all")) {
    const tools = live.filter((t) => t.cat === cat.id);
    if (tools.length === 0) continue;
    lines.push(`### ${cat.label.en} tools`, "");
    for (const tool of tools) {
      lines.push(`- ${tool.name.en} — ${tool.desc.en}`);
    }
    lines.push("");
  }

  lines.push(
    "## Privacy",
    "",
    "Most tools run locally in your browser — your files and inputs never leave your device.",
    `These tools use a server-side proxy to fetch external data: ${networkToolNames("en").join(", ")}.`,
    "Inputs are not stored beyond standard HTTP access logs (IP, requested URL, timestamp), retained ~30 days for security.",
    "",
    "## Key URLs",
    "",
    `- Tool catalog (EN): ${SITE_URL}/en/tools`,
    `- Tool catalog (FR): ${SITE_URL}/fr/tools`,
    `- Guides (EN): ${SITE_URL}/en/guides`,
    `- Guides (FR): ${SITE_URL}/fr/guides`,
    `- About (EN): ${SITE_URL}/en/about`,
    `- About (FR): ${SITE_URL}/fr/about`,
    `- Contact (EN): ${SITE_URL}/en/contact`,
    `- Contact (FR): ${SITE_URL}/fr/contact`,
    `- Legal notice (EN): ${SITE_URL}/en/legal`,
    `- Legal notice (FR): ${SITE_URL}/fr/legal`,
    `- Privacy policy (EN): ${SITE_URL}/en/privacy`,
    `- Privacy policy (FR): ${SITE_URL}/fr/privacy`,
    `- Terms of use (EN): ${SITE_URL}/en/terms`,
    `- Terms of use (FR): ${SITE_URL}/fr/terms`,
    `- FAQ (EN): ${SITE_URL}/en/faq`,
    `- FAQ (FR): ${SITE_URL}/fr/faq`,
    "",
    "## Guides",
    "",
    ...GUIDES.map((g) => `- ${g.en.title}: ${SITE_URL}/en/guides/${g.slug}`),
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
