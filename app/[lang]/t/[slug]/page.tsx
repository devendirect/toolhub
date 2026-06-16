import { notFound } from "next/navigation";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { SITE_URL } from "@/lib/brand";
import { ToolPageClient } from "@/components/tool/ToolPageClient";
import { toolJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import type { Metadata } from "next";
import type { Lang } from "@/lib/types";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return TOOLS.flatMap((t) => [
    { lang: "en", slug: t.slug },
    { lang: "fr", slug: t.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) return { robots: { index: false } };

  const l = (lang === "fr" ? "fr" : "en") satisfies Lang;

  return {
    title: tool.name[l],
    description: tool.desc[l],
    keywords: tool.tags,
    alternates: {
      canonical: `${SITE_URL}/${l}/t/${slug}`,
      languages: {
        en: `${SITE_URL}/en/t/${slug}`,
        fr: `${SITE_URL}/fr/t/${slug}`,
        "x-default": `${SITE_URL}/en/t/${slug}`,
      },
    },
    openGraph: {
      title: tool.name[l],
      description: tool.desc[l],
      url: `${SITE_URL}/${l}/t/${slug}`,
    },
    twitter: {
      card: "summary",
      title: tool.name[l],
      description: tool.desc[l],
    },
    ...(tool.comingSoon ? { robots: { index: false } } : {}),
  };
}

export default async function ToolPage({ params }: Props) {
  const { lang, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  const l = (lang === "fr" ? "fr" : "en") satisfies Lang;

  const catLabel = CATEGORIES.find((c) => c.id === tool.cat)?.label[l] ?? "";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd(tool, l)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(tool, l, catLabel)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(tool, l)) }}
      />
      <ToolPageClient tool={tool} />
    </>
  );
}
