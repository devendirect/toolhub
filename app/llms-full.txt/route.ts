import { TOOLS, CATEGORIES } from "@/lib/tools";
import { GUIDES } from "@/lib/guides";
import { TOOLS_CONTENT } from "@/lib/tools-content";
import { toolFaqItems } from "@/lib/faq";
import { SITE_URL, BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

// Version détaillée de llms.txt, générée depuis le catalogue réel — jamais désynchronisée.
// Pré-rendue au build (le catalogue ne change qu'au déploiement).
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${BRAND_NAME} — full tool reference`,
    "",
    `> ${BRAND_TAGLINE.en} Free browser-based toolkit for developers, designers and everyday users — no account, no signup.`,
    "> This file is generated from the live tool catalog. Every page listed below also exists in French: swap /en/ for /fr/ in any URL.",
    "",
    `A condensed overview is available at ${SITE_URL}/llms.txt`,
    "",
  ];

  for (const cat of CATEGORIES.filter((c) => c.id !== "all")) {
    const tools = TOOLS.filter((t) => t.cat === cat.id && !t.comingSoon);
    if (tools.length === 0) continue;

    lines.push(`## ${cat.label.en} tools`, "");

    for (const tool of tools) {
      const content = TOOLS_CONTENT[tool.slug];
      lines.push(`### ${tool.name.en}`, "");
      lines.push(`URL: ${SITE_URL}/en/t/${tool.slug}`);
      lines.push(
        tool.privacy === "network"
          ? "Privacy: fetches external data through a server-side proxy; inputs are not stored."
          : "Privacy: runs entirely in the browser; files and inputs never leave the device.",
      );
      lines.push("", content?.desc.en ?? tool.desc.en, "");

      if (content?.useCases.en.length) {
        lines.push("Use cases:");
        for (const uc of content.useCases.en) lines.push(`- ${uc}`);
        lines.push("");
      }

      const faq = toolFaqItems(tool);
      if (faq.length) {
        lines.push("FAQ:");
        for (const item of faq) lines.push(`- Q: ${item.q.en} A: ${item.a.en}`);
        lines.push("");
      }
    }
  }

  lines.push(
    "## Key URLs",
    "",
    `- Tool catalog: ${SITE_URL}/en/tools`,
    `- Guides: ${SITE_URL}/en/guides`,
    `- About: ${SITE_URL}/en/about`,
    `- Privacy policy: ${SITE_URL}/en/privacy`,
    `- Terms of use: ${SITE_URL}/en/terms`,
    `- FAQ: ${SITE_URL}/en/faq`,
    "",
    "## Guides",
    "",
    ...GUIDES.flatMap((g) => [`### ${g.en.title}`, "", `URL: ${SITE_URL}/en/guides/${g.slug}`, "", g.en.lead, ""]),
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
