import type { Metadata } from "next";
import { SITE_URL } from "@/lib/brand";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";
import type { Lang } from "@/lib/types";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = (lang === "fr" ? "fr" : "en") satisfies Lang;
  const isEn = l === "en";

  const title = isEn ? "All tools" : "Tous les outils";
  const description = isEn
    ? "Browse all free tools: file converters, developer utilities, text processors, design helpers and SEO analyzers. No signup, most tools run locally in your browser."
    : "Parcourez tous les outils gratuits : convertisseurs de fichiers, utilitaires dev, traitement de texte, outils design et analyseurs SEO. Sans inscription.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/tools`,
      languages: {
        en: `${SITE_URL}/en/tools`,
        fr: `${SITE_URL}/fr/tools`,
        "x-default": `${SITE_URL}/en/tools`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${l}/tools`,
    },
  };
}

export default function ToolsPage() {
  return <CatalogPageClient initialCat="all" />;
}
