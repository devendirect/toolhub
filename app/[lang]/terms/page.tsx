import type { Metadata } from "next";
import { BRAND_NAME, SITE_URL } from "@/lib/brand";
import type { Lang } from "@/lib/types";
import { coerceLang } from "@/lib/localePath";
import { networkToolNames } from "@/lib/tools";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const isEn = l === "en";

  return {
    title: isEn ? "Terms of use" : "Conditions d'utilisation",
    description: isEn
      ? `The terms for using ${BRAND_NAME}: free online tools with no account required, provided as is, and the rules of use and limits of liability that apply.`
      : `Les conditions d'utilisation d'${BRAND_NAME} : outils en ligne gratuits, sans compte, fournis en l'état, avec les règles d'usage et limites de responsabilité.`,
    alternates: {
      canonical: `${SITE_URL}/${l}/terms`,
      languages: {
        en: `${SITE_URL}/en/terms`,
        fr: `${SITE_URL}/fr/terms`,
        "x-default": `${SITE_URL}/en/terms`,
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
    title: "Terms of use",
    intro: `These terms govern your use of ${BRAND_NAME}. By using the site, you accept them. There's no account to create and nothing to sign — using a tool here is enough to mean you agree.`,
    updated: "Last updated: July 2026",
    sections: [
      {
        heading: "// the service",
        content: [
          `${BRAND_NAME} provides free browser-based utilities — file converters, text tools, code formatters, design generators, SEO tools. No account, no signup, no payment. Most tools run entirely client-side; a few (${networkToolNames("en").join(", ")}) make a server-side request to fetch external data, as described in the privacy policy.`,
          "The service is provided free of charge and may change, be added to, or be discontinued at any time, including individual tools, without notice.",
        ],
      },
      {
        heading: "// acceptable use",
        content: [
          "You may use these tools for any lawful purpose. You agree not to:",
          {
            tag: "ul",
            items: [
              `Use the network-dependent tools (${networkToolNames("en").join(", ")}) to send an automated or high-volume stream of requests intended to overload the service or the third-party endpoints it queries`,
              "Attempt to bypass, disable or interfere with the site's security, rate limits, or normal operation",
              "Use the site to process, generate or distribute content that is illegal, infringes a third party's rights, or violates applicable law",
              "Scrape or systematically extract the site's content or catalog data for republication without permission",
            ],
          },
        ],
      },
      {
        heading: "// no account, your data stays yours",
        content: [
          "There is no user account system. For tools that run locally in your browser, your files and inputs are never transmitted anywhere and remain entirely under your control — we have no access to them and no way to retrieve them.",
          "For the three network tools, the request passes through our server as described in the privacy policy; we do not claim any ownership over the content you submit or the results you generate with any tool.",
        ],
      },
      {
        heading: "// no warranty",
        content: [
          `${BRAND_NAME} is provided "as is" and "as available," without warranty of any kind, express or implied. We do not guarantee that any tool's output is accurate, complete, or fit for a particular purpose — for example, a generated password's strength, a hash's correctness, an SEO score, or a contrast ratio calculation should be independently verified before being relied on for anything security-critical, legally significant, or otherwise consequential.`,
          "We do not guarantee uninterrupted or error-free operation. The service can go down, change, or be temporarily unavailable without notice.",
        ],
      },
      {
        heading: "// limitation of liability",
        content: [
          `To the fullest extent permitted by law, ${BRAND_NAME} and its operator shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the service — including but not limited to data loss, business interruption, or reliance on a tool's output. Because most tools process data entirely in your browser, we have no visibility into and no responsibility for the files or text you process locally.`,
        ],
      },
      {
        heading: "// intellectual property",
        content: [
          `The ${BRAND_NAME} name, design and underlying code are the property of their respective owners; the site's source is open-source under the MIT license, as noted in the footer. This does not extend to third-party trademarks, fonts, or libraries used under their own licenses, nor to any content you generate using the tools, which remains yours.`,
        ],
      },
      {
        heading: "// advertising and third-party services",
        content: [
          "The site may display advertising served by Google AdSense and measure traffic via Google Analytics, both loaded only after you grant consent through the cookie banner, as described in the privacy policy. We are not responsible for the content of third-party advertisements or the practices of external sites linked from this one.",
        ],
      },
      {
        heading: "// changes to these terms",
        content: [
          "These terms may be updated from time to time to reflect changes to the service or legal requirements. The date at the top of this page indicates the last revision. Continuing to use the site after a change constitutes acceptance of the revised terms.",
        ],
      },
      {
        heading: "// governing law",
        content: [
          "These terms are governed by French law. Any dispute arising from your use of the service that cannot be resolved amicably falls under the jurisdiction of the competent French courts.",
        ],
      },
      {
        heading: "// contact",
        content: [
          `For any question about these terms, contact us at: hello@utilisio.com`,
        ],
      },
    ],
  },
  fr: {
    title: "Conditions d'utilisation",
    intro: `Ces conditions régissent votre utilisation d'${BRAND_NAME}. En utilisant le site, vous les acceptez. Il n'y a aucun compte à créer ni rien à signer — utiliser un outil ici suffit à valoir acceptation.`,
    updated: "Dernière mise à jour : juillet 2026",
    sections: [
      {
        heading: "// le service",
        content: [
          `${BRAND_NAME} propose des utilitaires gratuits fonctionnant dans le navigateur — convertisseurs de fichiers, outils texte, formateurs de code, générateurs design, outils SEO. Aucun compte, aucune inscription, aucun paiement. La plupart des outils s'exécutent entièrement côté client ; quelques-uns (${networkToolNames("fr").join(", ")}) effectuent une requête côté serveur pour récupérer des données externes, comme décrit dans la politique de confidentialité.`,
          "Le service est fourni gratuitement et peut évoluer, être complété ou interrompu à tout moment, y compris outil par outil, sans préavis.",
        ],
      },
      {
        heading: "// utilisation acceptable",
        content: [
          "Vous pouvez utiliser ces outils à toute fin légale. Vous vous engagez à ne pas :",
          {
            tag: "ul",
            items: [
              `Utiliser les outils dépendant du réseau (${networkToolNames("fr").join(", ")}) pour envoyer un flux de requêtes automatisé ou massif visant à surcharger le service ou les serveurs tiers qu'il interroge`,
              "Tenter de contourner, désactiver ou perturber la sécurité, les limites de débit ou le fonctionnement normal du site",
              "Utiliser le site pour traiter, générer ou diffuser un contenu illégal, portant atteinte aux droits d'un tiers, ou contraire à la réglementation applicable",
              "Extraire ou répliquer systématiquement le contenu ou les données du catalogue du site en vue d'une republication sans autorisation",
            ],
          },
        ],
      },
      {
        heading: "// pas de compte, vos données restent les vôtres",
        content: [
          "Il n'existe aucun système de compte utilisateur. Pour les outils qui s'exécutent localement dans votre navigateur, vos fichiers et saisies ne sont jamais transmis nulle part et restent entièrement sous votre contrôle — nous n'y avons aucun accès et aucun moyen de les récupérer.",
          "Pour les trois outils réseau, la requête transite par notre serveur comme décrit dans la politique de confidentialité ; nous ne revendiquons aucun droit de propriété sur le contenu que vous soumettez ou les résultats que vous générez avec un outil.",
        ],
      },
      {
        heading: "// aucune garantie",
        content: [
          `${BRAND_NAME} est fourni « en l'état » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite. Nous ne garantissons pas que le résultat d'un outil soit exact, complet, ou adapté à un usage particulier — par exemple, la robustesse d'un mot de passe généré, l'exactitude d'un hash, un score SEO, ou un calcul de ratio de contraste devraient être vérifiés indépendamment avant d'être utilisés pour quoi que ce soit de critique en matière de sécurité, de portée juridique, ou aux conséquences significatives.`,
          "Nous ne garantissons pas un fonctionnement ininterrompu ou sans erreur. Le service peut être interrompu, modifié, ou temporairement indisponible sans préavis.",
        ],
      },
      {
        heading: "// limitation de responsabilité",
        content: [
          `Dans toute la mesure permise par la loi, ${BRAND_NAME} et son exploitant ne pourront être tenus responsables de dommages indirects, accessoires ou consécutifs découlant de votre utilisation du service, ou de votre incapacité à l'utiliser — y compris, sans s'y limiter, la perte de données, l'interruption d'activité, ou le fait de s'être fié au résultat d'un outil. La plupart des outils traitant les données entièrement dans votre navigateur, nous n'avons aucune visibilité sur les fichiers ou textes que vous traitez localement, et aucune responsabilité à leur égard.`,
        ],
      },
      {
        heading: "// propriété intellectuelle",
        content: [
          `Le nom ${BRAND_NAME}, le design et le code sous-jacent sont la propriété de leurs détenteurs respectifs ; le code source du site est open-source sous licence MIT, comme indiqué en pied de page. Cela ne s'étend pas aux marques, polices ou bibliothèques tierces utilisées sous leurs propres licences, ni au contenu que vous générez à l'aide des outils, qui reste le vôtre.`,
        ],
      },
      {
        heading: "// publicité et services tiers",
        content: [
          "Le site peut afficher des publicités servies par Google AdSense et mesurer le trafic via Google Analytics, tous deux chargés uniquement après votre consentement via la bannière de cookies, comme décrit dans la politique de confidentialité. Nous ne sommes pas responsables du contenu des publicités tierces ni des pratiques des sites externes liés depuis celui-ci.",
        ],
      },
      {
        heading: "// modifications de ces conditions",
        content: [
          "Ces conditions peuvent être mises à jour ponctuellement pour refléter des évolutions du service ou des exigences légales. La date en haut de cette page indique la dernière révision. Continuer à utiliser le site après une modification vaut acceptation des conditions révisées.",
        ],
      },
      {
        heading: "// droit applicable",
        content: [
          "Ces conditions sont régies par le droit français. Tout litige découlant de votre utilisation du service qui ne pourrait être résolu à l'amiable relève de la compétence des tribunaux français compétents.",
        ],
      },
      {
        heading: "// contact",
        content: [
          `Pour toute question relative à ces conditions, contactez-nous à : hello@utilisio.com`,
        ],
      },
    ],
  },
};

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  const l = coerceLang(lang);
  const page = CONTENT[l];

  return (
    <div className="pt-9 pb-16 max-w-[720px]">
      <div className="font-mono text-[12px] text-brand mb-2">~/ $ cat terms.md</div>
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
