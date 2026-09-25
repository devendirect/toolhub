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
      ? `How ${BRAND_NAME} handles your data: most tools run entirely in your browser, analytics load only with your consent, and network tools don't store requests.`
      : `Comment ${BRAND_NAME} traite vos données : la plupart des outils restent locaux, audience mesurée seulement avec votre accord, requêtes réseau non conservées.`,
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
    updated: "Last updated: September 2026",
    sections: [
      {
        heading: "// what we collect",
        content: [
          "Almost nothing. There is no account system and no tracking pixel. Audience measurement (Google Analytics) runs only if you explicitly accept it. Advertising (Google AdSense) is present on every page but serves non-personalized, cookie-free ads until you consent through the consent management platform described below. The two are separate decisions, never bundled together.",
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
          "Some tools require a server-side request to fetch external data:",
          {
            tag: "ul",
            items: [
              "HTTP Headers Checker — requests the target URL from our server to read its response headers",
              "Meta Tag Preview — fetches the target URL via our proxy to read its meta tags",
              "SEO Analyzer — fetches the target URL via our proxy to analyze its content",
            ],
          },
          "In these cases, the request passes through our proxy. We don't keep the fetched pages, and the result stays in memory for one minute at most. The address you ask us to check travels in the request itself, so, like your IP address, it appears in the standard access logs described below, and nowhere else.",
        ],
      },
      {
        heading: "// server logs",
        content: [
          `${BRAND_NAME} is hosted on a private VPS (Virtual Private Server) rented from IONOS and administered by us. Like any web server, it retains standard HTTP access logs (IP address, URL, timestamp, response code) for operational and security purposes. These logs are retained for approximately 30 days, are stored on our server only, and are not shared with any third party or used for profiling.`,
        ],
      },
      {
        heading: "// analytics",
        content: [
          "We use Google Analytics 4 to measure traffic volume. The Google script is only loaded once consent has been given. In the European Economic Area, the United Kingdom and Switzerland, that consent is the one you give in the consent management platform; elsewhere, a short banner on this site asks for it. If you decline, or before you make a choice, nothing is loaded and no request is sent to Google — not even an anonymous ping.",
          "If you accept, usage data is processed by Google in accordance with their privacy policy. You can withdraw your consent at any time via the “manage cookies” link in the footer, which also deletes the Google Analytics cookies from your browser.",
        ],
      },
      {
        heading: "// advertising",
        content: [
          "We display ads served by Google AdSense. The AdSense script loads on every page, but it is governed by Google Consent Mode. In the European Economic Area, the United Kingdom and Switzerland, advertising consent is collected by a consent management platform certified by Google and built on the IAB Transparency and Consent Framework; until you consent there, the advertising signals stay set to “denied” and Google serves limited ads — non-personalized, with no advertising cookie stored on your device and no ad identifier read from it.",
          "If you accept, Google may use cookies to serve and measure ads, including personalized ads, as described in Google's advertising privacy policy. Those cookies are set by Google on its own domain and cannot be deleted from this site. The “manage cookies” link in the footer reopens the consent management platform so you can change or withdraw your choice, which switches ad serving back to the non-personalized mode described above.",
        ],
      },
      {
        heading: "// third-party services",
        content: [
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
          `For any privacy-related question or request, contact us at: contact@utilisio.com (see also the contact page)`,
        ],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    intro: `${BRAND_NAME} est conçu pour collecter le moins de données possible. La plupart des outils s'exécutent entièrement dans votre navigateur — vos fichiers et saisies ne quittent jamais votre appareil. Cette page explique ce que nous collectons, et ce que nous ne collectons pas.`,
    updated: "Dernière mise à jour : septembre 2026",
    sections: [
      {
        heading: "// ce que nous collectons",
        content: [
          "Presque rien. Il n'y a pas de système de compte ni de pixel de tracking. La mesure d'audience (Google Analytics) ne s'active que si vous l'acceptez explicitement. La publicité (Google AdSense) est présente sur toutes les pages mais diffuse des annonces non personnalisées et sans cookie tant que vous n'avez pas consenti via la plateforme de gestion du consentement décrite plus bas. Les deux choix restent distincts, jamais groupés.",
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
          "Certains outils nécessitent une requête côté serveur pour récupérer des données externes :",
          {
            tag: "ul",
            items: [
              "Vérificateur de headers — interroge l'URL cible depuis notre serveur pour lire ses en-têtes de réponse",
              "Aperçu des balises meta — récupère l'URL cible via notre proxy pour lire ses balises meta",
              "Analyseur SEO — récupère l'URL cible via notre proxy pour analyser son contenu",
            ],
          },
          "Dans ces cas, la requête transite par notre proxy. Nous ne conservons pas les pages récupérées, et le résultat reste au plus une minute en mémoire. L'adresse que vous nous demandez de vérifier voyage dans la requête elle-même : comme votre adresse IP, elle apparaît dans les logs d'accès standard décrits plus bas, et nulle part ailleurs.",
        ],
      },
      {
        heading: "// logs serveur",
        content: [
          `${BRAND_NAME} est hébergé sur un serveur privé (VPS) loué chez IONOS et administré par nous. Comme tout serveur web, il conserve des logs d'accès HTTP standard (adresse IP, URL, horodatage, code de réponse) à des fins opérationnelles et de sécurité. Ces logs sont conservés environ 30 jours, stockés uniquement sur notre serveur, et ne sont ni partagés avec des tiers ni utilisés à des fins de profilage.`,
        ],
      },
      {
        heading: "// analytiques",
        content: [
          "Nous utilisons Google Analytics 4 pour mesurer le volume de trafic. Le script Google n'est chargé qu'une fois le consentement donné. Dans l'Espace économique européen, au Royaume-Uni et en Suisse, ce consentement est celui que vous exprimez dans la plateforme de gestion du consentement ; ailleurs, une courte bannière propre à ce site vous le demande. En cas de refus, ou avant votre choix, rien n'est chargé et aucune requête n'est envoyée à Google — pas même un ping anonyme.",
          "En cas d'acceptation, les données d'usage sont traitées par Google conformément à leur politique de confidentialité. Vous pouvez retirer votre consentement à tout moment via le lien « gérer les cookies » du pied de page, qui supprime aussi les cookies Google Analytics de votre navigateur.",
        ],
      },
      {
        heading: "// publicité",
        content: [
          "Nous affichons des annonces servies par Google AdSense. Le script AdSense est chargé sur toutes les pages, mais il est piloté par le Consent Mode de Google. Dans l'Espace économique européen, au Royaume-Uni et en Suisse, le consentement publicitaire est recueilli par une plateforme de gestion du consentement certifiée par Google et fondée sur le cadre de transparence et de consentement de l'IAB ; tant que vous n'y avez pas consenti, les signaux publicitaires restent à « refusé » et Google diffuse des annonces limitées — non personnalisées, sans cookie publicitaire déposé sur votre appareil et sans lecture d'identifiant publicitaire.",
          "En cas d'acceptation, Google peut utiliser des cookies pour diffuser et mesurer les annonces, y compris des annonces personnalisées, conformément à la politique de confidentialité publicitaire de Google. Ces cookies sont posés par Google sur son propre domaine et ne peuvent pas être supprimés depuis ce site. Le lien « gérer les cookies » du pied de page rouvre la plateforme de gestion du consentement pour modifier ou retirer votre choix, ce qui rebascule la diffusion vers le mode non personnalisé décrit ci-dessus.",
        ],
      },
      {
        heading: "// services tiers",
        content: [
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
          `Pour toute question ou demande relative à la vie privée, contactez-nous à : contact@utilisio.com (voir aussi la page contact)`,
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
