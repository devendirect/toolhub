import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL, BRAND_NAME, REPO_URL } from "@/lib/brand";
import { coerceLang } from "@/lib/localePath";

/**
 * Mentions légales — version « éditeur non professionnel » de la LCEN :
 * un particulier sans activité professionnelle peut ne publier que les
 * coordonnées de son hébergeur, à condition de lui avoir communiqué son
 * identité (c'est le cas : contrat IONOS au nom de l'éditeur).
 * Coordonnées IONOS vérifiées au registre national des entreprises (2026-09-25).
 */

const EMAIL = "contact@utilisio.com";
const HOST = {
  name: "IONOS SARL",
  address: "7 place de la Gare, 57200 Sarreguemines, France",
  phone: "09 70 80 89 11",
  siren: "431 303 775",
};

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = coerceLang(lang);
  const title = l === "fr" ? "Mentions légales" : "Legal notice";
  const description = l === "fr"
    ? `Mentions légales d'${BRAND_NAME} : éditeur particulier non professionnel, contact, hébergeur IONOS, propriété intellectuelle et données personnelles.`
    : `Legal notice for ${BRAND_NAME}: independent non-professional publisher, contact address, IONOS hosting, intellectual property and personal data.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/legal`,
      languages: { en: `${SITE_URL}/en/legal`, fr: `${SITE_URL}/fr/legal`, "x-default": `${SITE_URL}/en/legal` },
    },
    openGraph: { title, description, url: `${SITE_URL}/${l}/legal` },
  };
}

export default async function LegalPage({ params }: Props) {
  const { lang } = await params;
  const l = coerceLang(lang);
  const fr = l === "fr";

  const sections: { h: string; body: React.ReactNode }[] = fr
    ? [
        { h: "// éditeur", body: <>
          <p>{BRAND_NAME} ({SITE_URL.replace(/^https?:\/\//, "")}) est édité à titre non professionnel par un particulier. Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN), qui permet aux éditeurs non professionnels de préserver leur anonymat, ses éléments d&apos;identification personnelle ont été communiqués à l&apos;hébergeur mentionné ci-dessous.</p>
          <p>Contact : <a href={`mailto:${EMAIL}`} className="text-brand underline">{EMAIL}</a> (voir aussi la <Link href={`/${l}/contact`} className="text-brand underline">page contact</Link>).</p>
        </> },
        { h: "// hébergeur", body: <>
          <p>{HOST.name}<br />{HOST.address}<br />Téléphone : {HOST.phone}<br />SIREN : {HOST.siren}</p>
        </> },
        { h: "// propriété intellectuelle", body: <>
          <p>Le code source du site, y compris les textes des pages et des guides qu&apos;il contient, est publié sous licence MIT sur <a href={REPO_URL} className="text-brand underline" target="_blank" rel="noopener noreferrer">GitHub</a> : vous pouvez le réutiliser, à condition de conserver la mention de copyright et le texte de la licence. Le nom et le logo {BRAND_NAME} ne sont pas couverts par cette licence.</p>
          <p>Le site s&apos;appuie sur des bibliothèques open source, utilisées selon leurs licences respectives : la liste et les licences figurent sur la page <Link href={`/${l}/about`} className="text-brand underline">à propos</Link>.</p>
        </> },
        { h: "// données personnelles et cookies", body: <>
          <p>La façon dont le site traite (très peu de) données, la mesure d&apos;audience, la publicité et vos droits sont décrits dans la <Link href={`/${l}/privacy`} className="text-brand underline">politique de confidentialité</Link>. Vous pouvez modifier vos choix de cookies à tout moment via le lien « gérer les cookies » en bas de chaque page.</p>
        </> },
        { h: "// responsabilité", body: <>
          <p>Les outils sont fournis gratuitement, en l&apos;état. Les conditions d&apos;utilisation et les limites de responsabilité figurent dans les <Link href={`/${l}/terms`} className="text-brand underline">conditions d&apos;utilisation</Link>.</p>
        </> },
      ]
    : [
        { h: "// publisher", body: <>
          <p>{BRAND_NAME} ({SITE_URL.replace(/^https?:\/\//, "")}) is published on a non-professional basis by a private individual. Under French law n° 2004-575 of 21 June 2004 on confidence in the digital economy (LCEN), which allows non-professional publishers to remain anonymous, the publisher&apos;s identification details have been provided to the hosting provider listed below.</p>
          <p>Contact: <a href={`mailto:${EMAIL}`} className="text-brand underline">{EMAIL}</a> (see also the <Link href={`/${l}/contact`} className="text-brand underline">contact page</Link>).</p>
        </> },
        { h: "// hosting", body: <>
          <p>{HOST.name}<br />{HOST.address}<br />Phone: +33 {HOST.phone.slice(1)}<br />SIREN: {HOST.siren}</p>
        </> },
        { h: "// intellectual property", body: <>
          <p>The site&apos;s source code, including the page and guide texts it contains, is published under the MIT license on <a href={REPO_URL} className="text-brand underline" target="_blank" rel="noopener noreferrer">GitHub</a>: you may reuse it as long as you keep the copyright notice and the license text. The {BRAND_NAME} name and logo are not covered by that license.</p>
          <p>The site relies on open-source libraries, used under their respective licenses: the list and licenses are on the <Link href={`/${l}/about`} className="text-brand underline">about</Link> page.</p>
        </> },
        { h: "// personal data and cookies", body: <>
          <p>How the site handles (very little) data, analytics, advertising and your rights are described in the <Link href={`/${l}/privacy`} className="text-brand underline">privacy policy</Link>. You can change your cookie choices at any time with the “manage cookies” link at the bottom of every page.</p>
        </> },
        { h: "// liability", body: <>
          <p>The tools are provided free of charge, as is. Terms of use and limits of liability are set out in the <Link href={`/${l}/terms`} className="text-brand underline">terms of use</Link>.</p>
        </> },
      ];

  return (
    <main className="max-w-[860px] mx-auto px-6 py-12">
      <h1 className="font-mono text-[22px] font-semibold text-fg mb-8">{fr ? "// mentions légales" : "// legal notice"}</h1>
      <div className="flex flex-col gap-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-mono text-[15px] font-semibold text-fg mb-3">{s.h}</h2>
            <div className="flex flex-col gap-3 font-mono text-[13px] text-fg-1 leading-relaxed">{s.body}</div>
          </section>
        ))}
      </div>
    </main>
  );
}
