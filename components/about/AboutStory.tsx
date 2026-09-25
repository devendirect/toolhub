import Link from "next/link";
import { localePath } from "@/lib/localePath";
import type { Lang } from "@/lib/types";

/**
 * Sections « qui / comment / ce que le site ne fait pas / financement » de la
 * page À propos : les signaux de confiance attendus d'un site qui affiche de
 * la publicité. Uniquement des faits vérifiables dans le code du site.
 */
const TEXT = {
  fr: [
    {
      id: "who",
      h: "// qui est derrière",
      p: [
        "utilisio est conçu, développé et maintenu par un développeur web indépendant, qui l'utilise lui-même chaque semaine. Les outils sont nés de besoins très concrets : lire la réponse minifiée d'une API, retrouver la virgule qui casse un fichier de config, alléger les images d'un site avant sa mise en ligne, convertir les fichiers envoyés par un client, regrouper des justificatifs en un seul PDF, générer un mot de passe pour une base de données ou un QR code pour le Wi-Fi.",
        "Le site est signé utilisio plutôt que d'un nom propre, mais une vraie personne lit les messages : pour une question, un bug ou une suggestion, passez par la page contact.",
      ],
    },
    {
      id: "tests",
      h: "// comment les outils sont testés",
      p: [
        "Chaque page outil explique ce que fait l'outil, ses limites et les pièges courants de la tâche. Ces textes sont écrits à partir du comportement réel de l'outil, testé sur de vraies données, pas à partir de ce qu'il devrait faire. Quand un test contredit la page, c'est l'outil qui est corrigé, ou la page qui dit la limite.",
        "Quelques exemples de corrections issues de ces vérifications : le formateur JSON arrondissait les identifiants de plus de 16 chiffres, il les conserve désormais au chiffre près ; le générateur de mots de passe produisait ses premiers résultats au moment de la construction du site, ils sont maintenant tirés uniquement dans votre navigateur ; l'analyseur SEO comptait le code des scripts comme du texte ; un outil de recherche d'adresse IP a été retiré parce que son fournisseur n'autorisait pas un usage commercial. Une suite de tests automatiques vérifie ce comportement, outil par outil.",
      ],
    },
    {
      id: "how-built",
      h: "// comment le site est fait",
      p: [
        "Le site est développé avec l'aide de Claude, l'assistant d'IA d'Anthropic, utilisé comme un binôme de développement : écriture et relecture du code, tests automatiques, premières versions des textes des pages outils et des guides. Les décisions, la relecture et la mise en ligne restent celles du développeur.",
        "Aucun texte n'est publié sur la seule foi de l'IA : chaque affirmation est vérifiée contre le comportement réel de l'outil, par un test ou une mesure, et retirée quand elle ne peut pas l'être. Plusieurs des corrections citées plus haut sont d'ailleurs nées de ces vérifications croisées.",
      ],
    },
    {
      id: "limits",
      h: "// ce que le site ne fait pas",
      p: [
        "Pas de compte, pas d'inscription, pas de limite d'usage. Les outils locaux ne transmettent ni vos fichiers ni vos textes : tout se passe dans l'onglet. Les quelques outils réseau, signalés par un point orange, envoient seulement l'adresse de la page à analyser, et le résultat n'est gardé qu'une minute en mémoire. La mesure d'audience ne se charge qu'avec votre accord.",
      ],
    },
    {
      id: "funding",
      h: "// comment le site est financé",
      p: [
        "utilisio est gratuit et financé par la publicité Google AdSense, affichée selon vos choix de consentement. Quelques pages outils proposent aussi un lien d'affiliation vers un service lié (enregistrement de nom de domaine, gestionnaire de mots de passe) : ces liens sont signalés comme sponsorisés et n'influencent ni le fonctionnement des outils ni le contenu des guides, qui ne recommandent aucun produit payant.",
      ],
    },
  ],
  en: [
    {
      id: "who",
      h: "// who's behind it",
      p: [
        "utilisio is designed, built and maintained by an independent web developer who uses it every week. The tools came from very concrete needs: reading a minified API response, finding the comma that breaks a config file, making a site's images lighter before launch, converting the files a client sends, gathering receipts into a single PDF, generating a password for a database or a QR code for the Wi-Fi.",
        "The site is signed utilisio rather than with a personal name, but a real person reads the messages: for a question, a bug or a suggestion, use the contact page.",
      ],
    },
    {
      id: "tests",
      h: "// how the tools are tested",
      p: [
        "Every tool page explains what the tool does, its limits and the usual traps of the task. Those texts are written from the tool's actual behaviour, tested on real input, not from what it's supposed to do. When a test contradicts the page, either the tool gets fixed or the page states the limit.",
        "A few fixes that came out of those checks: the JSON formatter rounded IDs longer than 16 digits and now keeps them digit for digit; the password generator produced its first results when the site was built, and now draws them only in your browser; the SEO analyzer counted script code as text; an IP lookup tool was withdrawn because its data provider didn't allow commercial use. An automated test suite checks that behaviour, tool by tool.",
      ],
    },
    {
      id: "how-built",
      h: "// how the site is built",
      p: [
        "The site is developed with the help of Claude, Anthropic's AI assistant, used as a pair-programming partner: writing and reviewing code, automated tests, and first drafts of the tool pages and guides. Decisions, review and releases remain the developer's.",
        "No text is published on the AI's word alone: every claim is checked against the tool's actual behaviour, with a test or a measurement, and removed when it can't be. Several of the fixes listed above came out of those cross-checks.",
      ],
    },
    {
      id: "limits",
      h: "// what the site doesn't do",
      p: [
        "No account, no signup, no usage limit. The local tools don't transmit your files or text: everything happens in the tab. The few network tools, marked with an orange dot, send only the address of the page to analyze, and the result is kept in memory for a minute at most. Analytics only load with your consent.",
      ],
    },
    {
      id: "funding",
      h: "// how the site is funded",
      p: [
        "utilisio is free and funded by Google AdSense ads, shown according to your consent choices. A few tool pages also offer an affiliate link to a related service (domain registration, password manager): those links are marked as sponsored and influence neither how the tools work nor the content of the guides, which don't recommend any paid product.",
      ],
    },
  ],
} as const;

export function AboutStory({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col gap-10 mb-12">
      {TEXT[lang].map((sec) => (
        <section key={sec.h} id={sec.id} className="scroll-mt-20">
          <h2 className="font-mono text-[17px] font-semibold text-fg mb-3">{sec.h}</h2>
          <div className="flex flex-col gap-3 font-mono text-[13px] text-fg-1 leading-relaxed">
            {sec.p.map((para) => <p key={para}>{para}</p>)}
          </div>
        </section>
      ))}
      <p className="font-mono text-[13px] text-fg-1">
        {lang === "fr" ? "Une question, un bug, une idée d'outil ? " : "A question, a bug, a tool idea? "}
        <Link href={localePath(lang, "/contact")} className="text-brand underline hover:no-underline">
          {lang === "fr" ? "Écrivez-nous" : "Write to us"}
        </Link>
        {lang === "fr" ? " — ou directement à " : ", or directly to "}
        <a href="mailto:contact@utilisio.com" className="text-brand underline hover:no-underline">contact@utilisio.com</a>.
      </p>
    </div>
  );
}
