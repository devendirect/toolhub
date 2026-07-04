import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import type { Lang } from "@/lib/types";
import { coerceLang } from "@/lib/localePath";
import { jsonLdString } from "@/lib/jsonld";
import { TOOLS } from "@/lib/tools";
import { FaqList } from "@/components/FaqList";

interface Props {
  params: Promise<{ lang: string }>;
}

type FaqItem = { q: string; a: string };

// Compteur calculé depuis le catalogue — jamais de chiffre en dur qui périme
const LIVE_TOOLS = TOOLS.filter((t) => !t.comingSoon).length;

const FAQ: Record<Lang, FaqItem[]> = {
  en: [
    {
      q: `What is ${BRAND_NAME}?`,
      a: `${BRAND_NAME} is a free, no-signup collection of ${LIVE_TOOLS} browser-based micro-tools for developers, designers and everyday users. Convert files, generate codes, format data, analyze SEO — all from one place.`,
    },
    {
      q: "Are all the tools free?",
      a: "Yes. Every tool on utilisio is completely free to use, with no account required and no usage limits.",
    },
    {
      q: "Do I need to create an account?",
      a: "No. There is no account system. Open a tool, use it, done. No email, no password, no cookies beyond your language preference.",
    },
    {
      q: "Are my files uploaded to a server?",
      a: "Most tools run entirely in your browser — your files never leave your device. The exceptions are network tools (IP Lookup, Meta Preview, SEO Analyzer) which send a request through a proxy to fetch external data. None of your input is stored or logged.",
    },
    {
      q: "Which browsers are supported?",
      a: "Any modern browser: Chrome, Firefox, Safari, Edge. Some tools (audio/video conversion) use WebAssembly and require a recent browser version — Chrome 90+ or Firefox 89+ recommended.",
    },
    {
      q: "How many tools are available?",
      a: `There are currently ${LIVE_TOOLS} live tools across 5 categories (File, Developer, Text, Design, SEO). New tools are added regularly.`,
    },
    {
      q: `Do the tools work on mobile?`,
      a: "Yes — the interface is responsive and works on phones and tablets. Some tools with complex workspaces (code editors, split-pane layouts) are better experienced on a desktop.",
    },
    {
      q: "Is there an API?",
      a: `Not currently. ${BRAND_NAME} is designed for direct browser use. An API is not planned for the immediate roadmap.`,
    },
  ],
  fr: [
    {
      q: `Qu'est-ce qu'utilisio ?`,
      a: `${BRAND_NAME} est une collection gratuite et sans inscription de ${LIVE_TOOLS} micro-outils en ligne pour les développeurs, designers et utilisateurs du quotidien. Convertissez des fichiers, générez des codes, formatez des données, analysez le SEO — depuis un seul endroit.`,
    },
    {
      q: "Tous les outils sont-ils gratuits ?",
      a: "Oui. Chaque outil sur utilisio est entièrement gratuit, sans compte requis et sans limite d'utilisation.",
    },
    {
      q: "Dois-je créer un compte ?",
      a: "Non. Il n'y a pas de système de compte. Ouvrez un outil, utilisez-le, c'est tout. Aucun e-mail, aucun mot de passe, aucun cookie au-delà de votre préférence de langue.",
    },
    {
      q: "Mes fichiers sont-ils téléchargés sur un serveur ?",
      a: "La plupart des outils s'exécutent entièrement dans votre navigateur — vos fichiers ne quittent jamais votre appareil. Les exceptions sont les outils réseau (Recherche IP, Aperçu Meta, Analyseur SEO) qui envoient une requête via un proxy pour récupérer des données externes. Aucune de vos données n'est stockée ni journalisée.",
    },
    {
      q: "Quels navigateurs sont supportés ?",
      a: "Tout navigateur moderne : Chrome, Firefox, Safari, Edge. Certains outils (conversion audio/vidéo) utilisent WebAssembly et nécessitent une version récente — Chrome 90+ ou Firefox 89+ recommandés.",
    },
    {
      q: "Combien d'outils sont disponibles ?",
      a: `Il y a actuellement ${LIVE_TOOLS} outils actifs répartis en 5 catégories (Fichiers, Développeur, Texte, Design, SEO). De nouveaux outils sont ajoutés régulièrement.`,
    },
    {
      q: "Les outils fonctionnent-ils sur mobile ?",
      a: "Oui — l'interface est responsive et fonctionne sur téléphones et tablettes. Certains outils avec des espaces de travail complexes (éditeurs de code, mises en page en volets) sont mieux utilisés sur ordinateur.",
    },
    {
      q: "Y a-t-il une API ?",
      a: `Pas actuellement. ${BRAND_NAME} est conçu pour une utilisation directe dans le navigateur. Une API n'est pas prévue dans la feuille de route immédiate.`,
    },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const isEn = l === "en";

  const title = isEn ? "FAQ" : "FAQ";
  const description = isEn
    ? `Frequently asked questions about ${BRAND_NAME} — free tools, privacy, browser support and more.`
    : `Questions fréquentes sur ${BRAND_NAME} — outils gratuits, confidentialité, compatibilité navigateur et plus.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/faq`,
      languages: {
        en: `${SITE_URL}/en/faq`,
        fr: `${SITE_URL}/fr/faq`,
        "x-default": `${SITE_URL}/en/faq`,
      },
    },
  };
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  const l = coerceLang(lang);
  const items = FAQ[l];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }}
      />
      <div className="pt-9 pb-16 max-w-[720px]">
        <div className="font-mono text-[12px] text-brand mb-2">
          {l === "fr" ? "~/ $ cat faq.md" : "~/ $ cat faq.md"}
        </div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] mb-2">
          {l === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
        </h1>
        <p className="text-[14px] text-fg-1 mb-10">
          {l === "fr"
            ? `Tout ce que vous devez savoir sur ${BRAND_NAME}.`
            : `Everything you need to know about ${BRAND_NAME}.`}
        </p>

        <FaqList items={items} headingAs="h2" />
      </div>
    </>
  );
}
