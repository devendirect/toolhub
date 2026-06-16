import { notFound } from "next/navigation";
import { TOOLS } from "@/lib/tools";
import { ToolPageClient } from "@/components/tool/ToolPageClient";
import type { Metadata } from "next";
import type { Lang } from "@/lib/types";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    alternates: {
      canonical: `${SITE_URL}/${l}/t/${slug}`,
      languages: {
        en: `${SITE_URL}/en/t/${slug}`,
        fr: `${SITE_URL}/fr/t/${slug}`,
      },
    },
    openGraph: {
      title: tool.name[l],
      description: tool.desc[l],
    },
    ...(tool.comingSoon ? { robots: { index: false } } : {}),
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();
  return <ToolPageClient tool={tool} />;
}
