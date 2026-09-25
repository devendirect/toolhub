import type { Metadata } from "next";
import { SITE_URL } from "@/lib/brand";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";
import { CatalogGuide } from "@/components/catalog/CatalogGuide";
import { coerceLang } from "@/lib/localePath";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const isEn = l === "en";

  const title = isEn ? "All tools" : "Tous les outils";
  const description = isEn
    ? "Browse every free tool: file converters, developer utilities, text tools, design helpers and SEO analyzers. No signup, most run in your browser."
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

export default async function ToolsPage({ params }: Props) {
  const { lang } = await params;
  return (
    <>
      <CatalogPageClient initialCat="all" />
      <CatalogGuide lang={coerceLang(lang)} />
    </>
  );
}
