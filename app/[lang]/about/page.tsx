import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import { AboutClient } from "@/components/about/AboutClient";
import { coerceLang } from "@/lib/localePath";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const isEn = l === "en";

  const title = isEn ? "About" : "À propos";
  const description = isEn
    ? `What ${BRAND_NAME} is, how the tools work (in-browser, no upload), who maintains it, and the open-source libraries it is built on.`
    : `Ce qu'est ${BRAND_NAME}, comment fonctionnent les outils (dans le navigateur, sans upload), qui le maintient, et les librairies open-source utilisées.`;

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
