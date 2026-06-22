import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/tools";
import { SITE_URL } from "@/lib/brand";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";
import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { coerceLang } from "@/lib/localePath";

interface Props {
  params: Promise<{ lang: string; category: string }>;
}

const CATEGORY_DESCRIPTIONS: Record<string, Record<Lang, string>> = {
  file: {
    en: "File conversion tools: image converter, PDF merge, audio and video converter. Free, no upload required.",
    fr: "Outils de conversion de fichiers : convertisseur d'images, fusion PDF, convertisseur audio et vidéo. Gratuit, sans envoi sur un serveur.",
  },
  dev: {
    en: "Developer tools: JSON formatter, Base64 encoder, UUID generator, QR code generator, regex tester, IP lookup and more.",
    fr: "Outils pour développeurs : formateur JSON, encodeur Base64, générateur UUID, QR code, testeur de regex, recherche IP et plus.",
  },
  text: {
    en: "Text utilities: case converter, URL encoder, HTML entity encoder, word counter, line break remover.",
    fr: "Utilitaires texte : convertisseur de casse, encodeur URL, entités HTML, compteur de mots, suppression de sauts de ligne.",
  },
  design: {
    en: "Design tools: color palette generator, CSS gradient builder, password generator.",
    fr: "Outils design : générateur de palette de couleurs, créateur de dégradés CSS, générateur de mots de passe.",
  },
  seo: {
    en: "SEO and marketing tools: meta tag preview for Google, Facebook and X; on-page SEO analyzer with scoring.",
    fr: "Outils SEO et marketing : aperçu des balises meta pour Google, Facebook et X ; analyseur SEO avec score de page.",
  },
};

export function generateStaticParams() {
  return CATEGORIES.filter((c) => c.id !== "all").flatMap((c) => [
    { lang: "en", category: c.id },
    { lang: "fr", category: c.id },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category } = await params;
  const l = coerceLang(lang);
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};

  const label = cat.label[l];
  const title = `${label} tools`;
  const description = CATEGORY_DESCRIPTIONS[category]?.[l] ?? `${label} tools on utilisio. Free, no signup.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/tools/${category}`,
      languages: {
        en: `${SITE_URL}/en/tools/${category}`,
        fr: `${SITE_URL}/fr/tools/${category}`,
        "x-default": `${SITE_URL}/en/tools/${category}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${l}/tools/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { lang, category } = await params;
  const l = coerceLang(lang);
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat || cat.id === "all") notFound();
  const description = CATEGORY_DESCRIPTIONS[category]?.[l];
  return <CatalogPageClient initialCat={category} categoryDescription={description} />;
}
