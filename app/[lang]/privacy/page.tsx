import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import type { Lang } from "@/lib/types";
import { coerceLang } from "@/lib/localePath";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
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
          "Almost nothing. There is no account system and no tracking pixel. Audience measurement (Google Analytics) and advertising (Google AdSense) each only run if you explicitly accept the corresponding category via the cookie banner — they are requested separately, not bundled together.",
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
          "We use Google Analytics 4 to measure traffic volume. The Google script is only loaded after you click Accept on the cookie banner. If you decline, or before you make a choice, nothing is loaded and no request is sent to Google — not even an anonymous ping.",
          "If you accept, usage data is processed by Google in accordance with their privacy policy. You can withdraw your consent at any time via the “manage cookies” link in the footer, which also deletes the Google Analytics cookies from your browser.",
        ],
      },
      {
        heading: "// advertising",
        content: [
          "We may display ads served by Google AdSense. The AdSense script is only loaded after you accept the “advertising” category in the cookie banner — separately from audience measurement. If you decline, or before you make a choice, no ad script is loaded and no advertising cookie is set.",
          "If you accept, Google may use cookies to serve and measure ads, including personalized ads, as described in Google's advertising privacy policy. Because these cookies are set by Google on its own domain, they cannot be deleted from this site's “manage cookies” link — declining the category simply stops the script from loading again on future visits.",
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
          "You are covered by the General Data Protection Regulation (GDPR) if you are located in the European Union. Since we collect almost no personal data, there is little data on which to exercise your rights — but those rights remain fully intact.",
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
          "Presque rien. Il n'y a pas de système de compte ni de pixel de tracking. La mesure d'audience (Google Analytics) et la publicité (Google AdSense) ne s'activent chacune que si vous acceptez explicitement la catégorie correspondante via la bannière de cookies — les deux choix sont demandés séparément, jamais groupés.",
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
          "Nous utilisons Google Analytics 4 pour mesurer le volume de trafic. Le script Google n'est chargé qu'après votre clic sur Accepter dans la bannière de cookies. En cas de refus, ou avant votre choix, rien n'est chargé et aucune requête n'est envoyée à Google — pas même un ping anonyme.",
          "En cas d'acceptation, les données d'usage sont traitées par Google conformément à leur politique de confidentialité. Vous pouvez retirer votre consentement à tout moment via le lien « gérer les cookies » du pied de page, qui supprime aussi les cookies Google Analytics de votre navigateur.",
        ],
      },
      {
        heading: "// publicité",
        content: [
          "Nous pouvons afficher des annonces servies par Google AdSense. Le script AdSense n'est chargé qu'après votre acceptation de la catégorie « publicité » dans la bannière de cookies — indépendamment de la mesure d'audience. En cas de refus, ou avant votre choix, aucun script publicitaire n'est chargé et aucun cookie publicitaire n'est posé.",
          "En cas d'acceptation, Google peut utiliser des cookies pour diffuser et mesurer les annonces, y compris des annonces personnalisées, conformément à la politique de confidentialité publicitaire de Google. Ces cookies étant posés par Google sur son propre domaine, ils ne peuvent pas être supprimés via le lien « gérer les cookies » de ce site — refuser la catégorie empêche simplement le script de se recharger lors des visites suivantes.",
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
          "Vous êtes protégé par le Règlement Général sur la Protection des Données (RGPD) si vous êtes situé dans l'Union Européenne. Puisque nous collectons presque aucune donnée personnelle, il y a peu de données sur lesquelles exercer vos droits — mais vos droits restent entiers.",
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
  const l = coerceLang(lang);
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
            <h2 className="font-mono text-[11px] text-brand mb-3">{section.heading}</h2>
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
