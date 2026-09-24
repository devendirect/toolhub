import { notFound } from "next/navigation";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { SITE_URL } from "@/lib/brand";
import { CatalogPageClient } from "@/components/catalog/CatalogPageClient";
import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { coerceLang } from "@/lib/localePath";

interface Props {
  params: Promise<{ lang: string; category: string }>;
}

// <title> par catégorie (≤ 50 car., le layout ajoute « — utilisio ») — traduit, jamais concaténé
const CATEGORY_TITLES: Record<string, Record<Lang, string>> = {
  file:   { en: "File Tools: Images, PDF, Audio, Video",       fr: "Outils fichiers : image, PDF, audio, vidéo" },
  dev:    { en: "Developer Tools: JWT, Regex, Hash, UUID",      fr: "Outils développeur : JWT, regex, hash, UUID" },
  text:   { en: "Text Tools: JSON, Case, Word Count, CSV",      fr: "Outils texte : JSON, casse, comptage, CSV" },
  design: { en: "CSS & Design Tools: Colors, Gradients, Grid",  fr: "Outils design et CSS : couleurs, dégradés" },
  seo:    { en: "SEO & Marketing Tools: Meta, Schema, UTM",     fr: "Outils SEO et marketing : meta, schema, UTM" },
};

// Meta description et chapeau de page (120–155 car.)
const CATEGORY_DESCRIPTIONS: Record<string, Record<Lang, string>> = {
  file: {
    en: "Convert images, PDFs, audio and video, merge PDFs, compress images or open ZIP files. Everything runs in your browser, so your files are never uploaded.",
    fr: "Convertissez images, PDF, audio et vidéo, fusionnez des PDF, compressez des images ou ouvrez un ZIP. Tout tourne dans le navigateur, sans envoi de fichier.",
  },
  dev: {
    en: "Decode JWTs, test regex, hash files, generate UUIDs and QR codes, convert timestamps, diff code and check HTTP security headers. Free, no signup.",
    fr: "Décodez un JWT, testez une regex, hashez un fichier, générez UUID et QR codes, convertissez un timestamp, comparez du code, auditez des en-têtes HTTP.",
  },
  text: {
    en: "Format JSON, convert CSV, change case, count words, strip line breaks, remove duplicate lines, encode URLs and check readability. Free, in your browser.",
    fr: "Formatez du JSON, convertissez un CSV, changez la casse, comptez les mots, retirez sauts de ligne et doublons, encodez une URL, mesurez la lisibilité.",
  },
  design: {
    en: "Build color palettes, CSS gradients, box shadows, border radius and grid layouts, check WCAG contrast, make a favicon or a strong password. Copy the CSS.",
    fr: "Créez palettes, dégradés CSS, ombres, arrondis et grilles, vérifiez le contraste WCAG, fabriquez un favicon ou un mot de passe fort. CSS prêt à copier.",
  },
  seo: {
    en: "Preview meta tags on Google and social networks, audit on-page SEO, check Open Graph, build UTM links and generate robots.txt, sitemaps and JSON-LD.",
    fr: "Prévisualisez vos balises meta sur Google et les réseaux, auditez le SEO d'une page, testez l'Open Graph, créez liens UTM, robots.txt, sitemap et JSON-LD.",
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

  const title = CATEGORY_TITLES[category]?.[l] ?? cat.label[l];
  const description = CATEGORY_DESCRIPTIONS[category]?.[l] ?? "";

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

  // Critère de classement énoncé en clair (contenu citable) — le tri par défaut
  // du catalogue est bien la popularité (champ runs)
  const count = TOOLS.filter((t) => t.cat === category && !t.comingSoon).length;
  const ranking = l === "en"
    ? ` The ${count} tools below are ranked by usage, most used first.`
    : ` Les ${count} outils ci-dessous sont classés par utilisation, du plus utilisé au moins utilisé.`;
  const description = (CATEGORY_DESCRIPTIONS[category]?.[l] ?? "") + ranking;

  return <CatalogPageClient initialCat={category} categoryDescription={description} />;
}
