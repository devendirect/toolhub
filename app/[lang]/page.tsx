import type { Metadata } from "next";
import { BRAND_NAME, BRAND_TAGLINE, SITE_URL } from "@/lib/brand";
import { TOOLS } from "@/lib/tools";
import { HomeClient } from "@/components/home/HomeClient";
import { websiteJsonLd, jsonLdString } from "@/lib/jsonld";
import { coerceLang } from "@/lib/localePath";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const isEn = l === "en";

  const toolCount = TOOLS.filter((t) => !t.comingSoon).length;

  const title = isEn
    ? "utilisio — Free web tools: JSON, file, text, generators."
    : "utilisio — Outils JSON, texte et fichiers pour développeurs.";
  const description = isEn
    ? `${toolCount} free tools, no signup: JSON formatter, Base64, UUID and QR code generators, PDF converter, SEO analyzer and more. Most run 100% in your browser.`
    : `${toolCount} outils gratuits, sans inscription : formateur JSON, Base64, UUID, QR code, PDF, analyseur SEO et plus. La plupart tournent dans votre navigateur.`;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}`,
      languages: {
        en: `${SITE_URL}/en`,
        fr: `${SITE_URL}/fr`,
        "x-default": `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description: isEn
        ? `${toolCount} free tools, no signup. Most tools run 100% in your browser.`
        : `${toolCount} outils gratuits, sans inscription. La plupart fonctionnent dans votre navigateur.`,
      url: `${SITE_URL}/${l}`,
    },
    twitter: {
      card: "summary",
      title,
      description: isEn ? `${toolCount} free browser tools. No signup.` : `${toolCount} outils gratuits. Sans inscription.`,
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const l = coerceLang(lang);
  const schemas = websiteJsonLd(l);

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(schema) }}
        />
      ))}
      <HomeClient />
    </>
  );
}
