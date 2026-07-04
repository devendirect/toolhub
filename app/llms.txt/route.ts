import { TOOLS, CATEGORIES } from "@/lib/tools";
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
    "Three tools use a server-side proxy to fetch external data: IP Lookup, Meta Preview and SEO Analyzer.",
    "Inputs are not stored. Standard HTTP access logs (IP, timestamp) are retained ~30 days for security.",
    "",
    "## Key URLs",
    "",
    `- Tool catalog (EN): ${SITE_URL}/en/tools`,
    `- Tool catalog (FR): ${SITE_URL}/fr/tools`,
    `- About (EN): ${SITE_URL}/en/about`,
    `- About (FR): ${SITE_URL}/fr/about`,
    `- Privacy policy (EN): ${SITE_URL}/en/privacy`,
    `- Privacy policy (FR): ${SITE_URL}/fr/privacy`,
    `- FAQ (EN): ${SITE_URL}/en/faq`,
    `- FAQ (FR): ${SITE_URL}/fr/faq`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
