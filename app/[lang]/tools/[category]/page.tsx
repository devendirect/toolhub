import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/tools";
import { BRAND_NAME } from "@/lib/brand";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string; category: string }>;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  file:   "File conversion tools: image converter, PDF merge, audio and video converter. Free, no upload required.",
  dev:    "Developer tools: JSON formatter, Base64 encoder, UUID generator, QR code generator, regex tester, IP lookup and more.",
  text:   "Text utilities: case converter, URL encoder, HTML entity encoder, word counter, line break remover.",
  design: "Design tools: color palette generator, CSS gradient builder, password generator.",
  seo:    "SEO and marketing tools: meta tag preview for Google, Facebook and Twitter; on-page SEO analyzer with scoring.",
};

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.id !== "all").flatMap((c) => [
    { lang: "en", category: c.id },
    { lang: "fr", category: c.id },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};
  return {
    title: `${cat.label.en} tools — ${BRAND_NAME}`,
    description: CATEGORY_DESCRIPTIONS[category] ?? `${cat.label.en} tools on ${BRAND_NAME}. Free, no signup.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat || cat.id === "all") notFound();
  return <CatalogPageClient initialCat={category} />;
}
