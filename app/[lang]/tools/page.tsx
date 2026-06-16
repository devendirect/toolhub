import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";

export const metadata: Metadata = {
  title: "All tools",
  description:
    "Browse all free tools: file converters, developer utilities, text processors, design helpers and SEO analyzers. No signup, most tools run locally in your browser.",
  openGraph: {
    title: `All tools — ${BRAND_NAME}`,
    description: "Browse free web tools. No signup required.",
  },
};

export default function ToolsPage() {
  return <CatalogPageClient initialCat="all" />;
}
