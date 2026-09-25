import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, BRAND_NAME } from "@/lib/brand";
import { coerceLang } from "@/lib/localePath";
import { SectionHead } from "@/components/home/SectionHead";

const EMAIL = "contact@utilisio.com";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const title = l === "fr" ? "Contact" : "Contact us";
  const description = l === "fr"
    ? `Écrire à ${BRAND_NAME} : signaler un bug, proposer un outil, poser une question sur vos données ou nous alerter d'un problème de sécurité, à ${EMAIL}.`
    : `Write to ${BRAND_NAME}: report a bug, suggest a tool, ask about your data or tell us about a security issue, at ${EMAIL}. A real person reads every message.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/contact`,
      languages: { en: `${SITE_URL}/en/contact`, fr: `${SITE_URL}/fr/contact`, "x-default": `${SITE_URL}/en/contact` },
    },
    openGraph: { title, description, url: `${SITE_URL}/${l}/contact` },
  };
}

const TEXT = {
  fr: {
    lead: "utilisio est maintenu par un développeur indépendant. Il n'y a ni formulaire ni service client, mais une adresse e-mail lue par une vraie personne.",
    topics: [
      { h: "Signaler un bug", subject: "Bug", p: "Indiquez l'outil concerné, votre navigateur, ce que vous avez fait et ce qui s'est passé. Si le problème vient d'un fichier, décrivez-le (format, taille) plutôt que de l'envoyer : la plupart des outils fonctionnent sans jamais voir vos fichiers, et c'est voulu." },
      { h: "Proposer un outil ou une amélioration", subject: "Suggestion", p: "Décrivez la tâche que vous cherchez à faire, pas seulement l'outil : c'est souvent là qu'on trouve la bonne solution. Chaque suggestion est lue et gardée pour les prochains outils." },
      { h: "Vos données", subject: "Données personnelles", p: "Le site ne crée pas de compte et ne conserve ni vos fichiers ni vos textes. Pour une question sur la mesure d'audience ou la publicité, qui dépendent de votre consentement, ou pour exercer vos droits, écrivez-nous ; le détail est dans la politique de confidentialité." },
      { h: "Un problème de sécurité", subject: "Sécurité", p: "Si vous pensez avoir trouvé une faille, décrivez-la par e-mail avec les étapes pour la reproduire, et laissez-nous le temps de la corriger avant de la rendre publique. Merci d'avance." },
    ],
    write: "Écrire",
    privacy: "politique de confidentialité",
    about: "à propos",
  },
  en: {
    lead: "utilisio is maintained by an independent developer. There's no form and no support desk, but an email address read by a real person.",
    topics: [
      { h: "Report a bug", subject: "Bug", p: "Say which tool, which browser, what you did and what happened. If the problem comes from a file, describe it (format, size) rather than attaching it: most tools work without ever seeing your files, and that's on purpose." },
      { h: "Suggest a tool or an improvement", subject: "Suggestion", p: "Describe the task you're trying to get done, not only the tool: that's often where the right solution is. Every suggestion is read and kept for future tools." },
      { h: "Your data", subject: "Personal data", p: "The site creates no account and keeps neither your files nor your text. For a question about analytics or ads, which depend on your consent, or to exercise your rights, write to us; the details are in the privacy policy." },
      { h: "A security issue", subject: "Security", p: "If you think you've found a vulnerability, describe it by email with the steps to reproduce it, and give us time to fix it before making it public. Thank you." },
    ],
    write: "Write",
    privacy: "privacy policy",
    about: "about",
  },
};

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const l = coerceLang(lang);
  const t = TEXT[l];

  return (
    <div className="pt-9 pb-12 max-w-[72ch]">
      <div className="flex gap-[6px] font-mono text-[12px] text-dim mb-7">
        <Link href={`/${l}`} className="hover:text-brand transition-colors">~</Link>
        <span>/</span>
        <span className="text-brand">contact</span>
      </div>

      <h1 className="text-[36px] font-medium tracking-[-0.025em] leading-none mb-4">Contact</h1>
      <p className="text-[15px] text-fg-1 leading-[1.7] mb-6">{t.lead}</p>

      <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-3 border border-brand bg-brand-soft px-5 py-3 font-mono text-[15px] text-brand hover:brightness-110 transition-all mb-12">
        {EMAIL}
      </a>

      <SectionHead label={l === "fr" ? "// pour quoi nous écrire" : "// what to write about"} />
      <div className="flex flex-col gap-px bg-line border border-line mb-10">
        {t.topics.map((topic) => (
          <section key={topic.h} className="bg-bg-1 p-6">
            <h2 className="text-[16px] text-fg font-medium mb-2">{topic.h}</h2>
            <p className="text-[14px] text-fg-1 leading-[1.7] mb-3">{topic.p}</p>
            <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`[${BRAND_NAME}] ${topic.subject}`)}`} className="font-mono text-[12px] text-brand hover:underline">
              {t.write} →
            </a>
          </section>
        ))}
      </div>

      <p className="font-mono text-[12px] text-dim">
        <Link href={`/${l}/privacy`} className="underline hover:text-fg">{t.privacy}</Link>
        {" · "}
        <Link href={`/${l}/about`} className="underline hover:text-fg">{t.about}</Link>
      </p>
    </div>
  );
}
