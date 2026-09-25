import { notFound } from "next/navigation";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import { SITE_URL } from "@/lib/brand";
import { TOOLS_CONTENT } from "@/lib/tools-content";
import { TOOLS_SEO } from "@/lib/tools-seo";
import { toolFaqItems } from "@/lib/faq";
import { ToolPageClient } from "@/components/tool/ToolPageClient";
import { guidesForTool } from "@/lib/guides";
import { toolJsonLd, breadcrumbJsonLd, faqJsonLd, jsonLdString } from "@/lib/jsonld";
import { ConvertHub } from "@/components/convert/ConvertHub";
import type { Metadata } from "next";
import { coerceLang } from "@/lib/localePath";

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

  const l = coerceLang(lang);
  const seo = TOOLS_SEO[slug];
  const title = seo?.title[l] ?? tool.name[l];
  const description = seo?.description[l] ?? tool.desc[l];

  return {
    title,
    description,
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
      title,
      description,
      url: `${SITE_URL}/${l}/t/${slug}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    ...(tool.comingSoon ? { robots: { index: false } } : {}),
  };
}

export default async function ToolPage({ params }: Props) {
  const { lang, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  const l = coerceLang(lang);

  const catLabel = CATEGORIES.find((c) => c.id === tool.cat)?.label[l] ?? "";
  const content  = TOOLS_CONTENT[tool.slug];
  const faqItems = toolFaqItems(tool);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(toolJsonLd(tool, l, content)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd(tool, l, catLabel)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd(tool, l)) }}
      />
      <ToolPageClient tool={tool} content={content} faqItems={faqItems} guides={guidesForTool(tool.slug).map((g) => ({ slug: g.slug, title: g[l].title }))} />
      {/* Hub pSEO : la page outil mère lie toutes les pages paires /convert/ de sa famille */}
      {tool.slug === "image-converter" && <ConvertHub lang={l} family="image" />}
      {tool.slug === "pdf-converter" && <ConvertHub lang={l} family="pdf" />}
    </>
  );
}
