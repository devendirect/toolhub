import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import { AboutClient } from "@/components/about/AboutClient";
import { coerceLang } from "@/lib/localePath";
import { jsonLdString, organizationJsonLd } from "@/lib/jsonld";

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

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  const l = coerceLang(lang);
  // AboutPage dont l'entité principale est l'éditeur (même @id que partout ailleurs)
  const org: Record<string, unknown> = { ...organizationJsonLd(l) };
  delete org["@context"]; // entité imbriquée : pas de second @context
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE_URL}/${l}/about`,
    name: l === "fr" ? `À propos d'${BRAND_NAME}` : `About ${BRAND_NAME}`,
    inLanguage: l === "fr" ? "fr-FR" : "en",
    mainEntity: org,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(aboutLd) }} />
      <AboutClient />
    </>
  );
}
