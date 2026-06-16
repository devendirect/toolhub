import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import type { Lang } from "@/lib/types";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = (lang === "fr" ? "fr" : "en") satisfies Lang;
  const isEn = l === "en";

  return {
    title: isEn ? "Privacy policy" : "Politique de confidentialité",
    description: isEn
      ? `How ${BRAND_NAME} handles your data. Short version: almost nothing is collected.`
      : `Comment ${BRAND_NAME} gère vos données. Version courte : presque rien n'est collecté.`,
    alternates: {
      canonical: `${SITE_URL}/${l}/privacy`,
      languages: {
        en: `${SITE_URL}/en/privacy`,
        fr: `${SITE_URL}/fr/privacy`,
        "x-default": `${SITE_URL}/en/privacy`,
      },
    },
  };
}

interface Section {
  heading: string;
  content: (string | { tag: "ul"; items: string[] })[];
}

const CONTENT: Record<Lang, { title: string; intro: string; updated: string; sections: Section[] }> = {
  en: {
    title: "Privacy policy",
    intro: `${BRAND_NAME} is designed to collect as little data as possible. Most tools run entirely in your browser — your files and inputs never leave your device. This page explains what we do and don't collect.`,
    updated: "Last updated: June 2026",
    sections: [
      {
        heading: "// what we collect",
        content: [
          "Almost nothing. There is no account system, no tracking pixel, no advertising network and no analytics platform.",
          "The only data stored on your device is a single cookie named `lang` that remembers your language preference (French or English). It expires after one year and contains no personal information.",
        ],
      },
      {
        heading: "// local tools",
        content: [
          "The majority of tools on utilisio — file converters, text utilities, code formatters, design generators — process everything locally in your browser using native Web APIs.",
          "Your files, text and inputs are never sent to any server. No upload, no log, no trace.",
        ],
      },
      {
        heading: "// network tools",
        content: [
          "Three tools require a server-side request to fetch external data:",
          {
            tag: "ul",
            items: [
              "IP Address Lookup — sends the IP to look up to a geolocation API",
              "Meta Tag Preview — fetches the target URL via our proxy to read its meta tags",
              "SEO Analyzer — fetches the target URL via our proxy to analyze its content",
            ],
          },
          "In these cases, the request passes through our proxy. We do not store the URLs you enter, the results returned, or any content of the fetched pages. Your IP address is visible to our server during the request (as with any HTTP request) but is not logged.",
        ],
      },
      {
        heading: "// server logs",
        content: [
          `${BRAND_NAME} is hosted on a private VPS (Virtual Private Server) under our direct control. Like any web server, it retains standard HTTP access logs (IP address, URL, timestamp, response code) for operational and security purposes. These logs are retained for approximately 30 days, are stored on our server only, and are not shared with any third party or used for profiling.`,
        ],
      },
      {
        heading: "// analytics",
        content: [
          "We currently use no analytics platform. No Google Analytics, no Mixpanel, no session recording tool.",
          "If we add analytics in the future, we will update this page and favor privacy-respecting tools (Plausible, Fathom) that do not track individuals.",
        ],
      },
      {
        heading: "// third-party services",
        content: [
          "The IP Lookup tool queries a third-party geolocation API. The queried IP is sent to that API to retrieve location data. No other personal information is transmitted.",
          "Fonts are loaded from Google Fonts via Next.js, which downloads and self-hosts them at build time — no runtime request is made to Google's servers.",
        ],
      },
      {
        heading: "// your rights",
        content: [
          "You are covered by the General Data Protection Regulation (GDPR) if you are located in the European Union. Since we collect almost no personal data, there is very little to exercise rights over.",
          "You can delete the `lang` cookie at any time through your browser settings. To request information about any data we may hold, contact us at the address below.",
        ],
      },
      {
        heading: "// contact",
        content: [
          `For any privacy-related question or request, contact us at: hello@utilisio.com`,
        ],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    intro: `${BRAND_NAME} est conçu pour collecter le moins de données possible. La plupart des outils s'exécutent entièrement dans votre navigateur — vos fichiers et saisies ne quittent jamais votre appareil. Cette page explique ce que nous collectons, et ce que nous ne collectons pas.`,
    updated: "Dernière mise à jour : juin 2026",
    sections: [
      {
        heading: "// ce que nous collectons",
        content: [
          "Presque rien. Il n'y a pas de système de compte, pas de pixel de tracking, pas de réseau publicitaire et pas de plateforme d'analyse.",
          "La seule donnée stockée sur votre appareil est un cookie nommé `lang` qui mémorise votre préférence de langue (français ou anglais). Il expire après un an et ne contient aucune information personnelle.",
        ],
      },
      {
        heading: "// outils locaux",
        content: [
          "La grande majorité des outils d'utilisio — convertisseurs de fichiers, utilitaires texte, formateurs de code, générateurs design — traitent tout localement dans votre navigateur via des API web natives.",
          "Vos fichiers, textes et saisies ne sont jamais envoyés sur aucun serveur. Aucun upload, aucun log, aucune trace.",
        ],
      },
      {
        heading: "// outils réseau",
        content: [
          "Trois outils nécessitent une requête côté serveur pour récupérer des données externes :",
          {
            tag: "ul",
            items: [
              "Recherche d'adresse IP — envoie l'IP à consulter à une API de géolocalisation",
              "Aperçu des balises meta — récupère l'URL cible via notre proxy pour lire ses balises meta",
              "Analyseur SEO — récupère l'URL cible via notre proxy pour analyser son contenu",
            ],
          },
          "Dans ces cas, la requête transite par notre proxy. Nous ne stockons pas les URL que vous saisissez, les résultats retournés, ni le contenu des pages récupérées. Votre adresse IP est visible par notre serveur lors de la requête (comme pour toute requête HTTP) mais n'est pas journalisée.",
        ],
      },
      {
        heading: "// logs serveur",
        content: [
          `${BRAND_NAME} est hébergé sur un serveur privé (VPS) sous notre contrôle direct. Comme tout serveur web, il conserve des logs d'accès HTTP standard (adresse IP, URL, horodatage, code de réponse) à des fins opérationnelles et de sécurité. Ces logs sont conservés environ 30 jours, stockés uniquement sur notre serveur, et ne sont ni partagés avec des tiers ni utilisés à des fins de profilage.`,
        ],
      },
      {
        heading: "// analytiques",
        content: [
          "Nous n'utilisons actuellement aucune plateforme d'analyse. Pas de Google Analytics, pas de Mixpanel, pas d'outil d'enregistrement de session.",
          "Si nous ajoutons des analytiques à l'avenir, nous mettrons cette page à jour et privilégierons des outils respectueux de la vie privée (Plausible, Fathom) qui ne tracent pas les individus.",
        ],
      },
      {
        heading: "// services tiers",
        content: [
          "L'outil Recherche IP interroge une API de géolocalisation tierce. L'IP consultée est envoyée à cette API pour récupérer les données de localisation. Aucune autre information personnelle n'est transmise.",
          "Les polices sont chargées depuis Google Fonts via Next.js, qui les télécharge et les auto-héberge au moment du build — aucune requête n'est effectuée vers les serveurs de Google à l'exécution.",
        ],
      },
      {
        heading: "// vos droits",
        content: [
          "Vous êtes protégé par le Règlement Général sur la Protection des Données (RGPD) si vous êtes situé dans l'Union Européenne. Puisque nous collectons presque aucune donnée personnelle, il y a très peu de droits à exercer.",
          "Vous pouvez supprimer le cookie `lang` à tout moment via les paramètres de votre navigateur. Pour demander des informations sur les données que nous pourrions détenir, contactez-nous à l'adresse ci-dessous.",
        ],
      },
      {
        heading: "// contact",
        content: [
          `Pour toute question ou demande relative à la vie privée, contactez-nous à : hello@utilisio.com`,
        ],
      },
    ],
  },
};

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const l = (lang === "fr" ? "fr" : "en") satisfies Lang;
  const page = CONTENT[l];

  return (
    <div className="pt-9 pb-16 max-w-[720px]">
      <div className="font-mono text-[12px] text-brand mb-2">~/ $ cat privacy.md</div>
      <h1 className="text-[28px] font-semibold tracking-[-0.02em] mb-2">{page.title}</h1>
      <p className="font-mono text-[11px] text-dim mb-6">{page.updated}</p>
      <p className="text-[14px] text-fg-1 leading-relaxed mb-10">{page.intro}</p>

      <div className="flex flex-col gap-8">
        {page.sections.map((section, i) => (
          <section key={i}>
            <div className="font-mono text-[11px] text-brand mb-3">{section.heading}</div>
            <div className="flex flex-col gap-3">
              {section.content.map((block, j) =>
                typeof block === "string" ? (
                  <p key={j} className="text-[13px] text-fg-1 leading-relaxed">
                    {block}
                  </p>
                ) : (
                  <ul key={j} className="flex flex-col gap-1 pl-4">
                    {block.items.map((item, k) => (
                      <li key={k} className="text-[13px] text-fg-1 leading-relaxed before:content-['—'] before:mr-2 before:text-dim">
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
