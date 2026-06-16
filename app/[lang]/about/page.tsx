import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import { AboutClient } from "@/components/about/AboutClient";
import type { Lang } from "@/lib/types";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = (lang === "fr" ? "fr" : "en") satisfies Lang;
  const isEn = l === "en";

  const title = isEn ? "Open-source credits" : "Crédits open-source";
  const description = isEn
    ? `Libraries and tools used to build ${BRAND_NAME}. Open-source credits.`
    : `Bibliothèques et outils utilisés pour construire ${BRAND_NAME}. Crédits open-source.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/about`,
      languages: {
        en: `${SITE_URL}/en/about`,
        fr: `${SITE_URL}/fr/about`,
        "x-default": `${SITE_URL}/en/about`,
      },
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
