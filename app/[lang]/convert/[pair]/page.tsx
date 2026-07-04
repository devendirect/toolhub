import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CONVERT_PAIRS, FORMAT_LABEL, findPair } from "@/lib/convert-pairs";
import { TOOLS } from "@/lib/tools";
import { toolFaqItems } from "@/lib/faq";
import { jsonLdString } from "@/lib/jsonld";
import { SITE_URL, BRAND_NAME } from "@/lib/brand";
import { coerceLang } from "@/lib/localePath";
import { ConvertWorkspace } from "@/components/convert/ConvertWorkspace";
import { ConvertHub } from "@/components/convert/ConvertHub";
import { FaqList } from "@/components/FaqList";

interface Props {
  params: Promise<{ lang: string; pair: string }>;
}

export function generateStaticParams() {
  return CONVERT_PAIRS.flatMap((p) => [
    { lang: "en", pair: p.slug },
    { lang: "fr", pair: p.slug },
  ]);
}

function pairTitle(from: string, to: string, lang: "en" | "fr") {
  const f = FORMAT_LABEL[from];
  const t = FORMAT_LABEL[to];
  return lang === "fr" ? `Convertir ${f} en ${t}` : `Convert ${f} to ${t}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, pair: pairSlug } = await params;
  const pair = findPair(pairSlug);
  if (!pair) return { robots: { index: false } };

  const l = coerceLang(lang);
  const title = pairTitle(pair.from, pair.to, l);
  // Description spécifique à la paire : la phrase-réponse, pas un gabarit
  const description = pair.why[l];

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${l}/convert/${pair.slug}`,
      languages: {
        en: `${SITE_URL}/en/convert/${pair.slug}`,
        fr: `${SITE_URL}/fr/convert/${pair.slug}`,
        "x-default": `${SITE_URL}/en/convert/${pair.slug}`,
      },
    },
    openGraph: { title, description, url: `${SITE_URL}/${l}/convert/${pair.slug}` },
    twitter: { card: "summary", title, description },
  };
}

export default async function ConvertPairPage({ params }: Props) {
  const { lang, pair: pairSlug } = await params;
  const pair = findPair(pairSlug);
  if (!pair) notFound();

  const l = coerceLang(lang);
  const title = pairTitle(pair.from, pair.to, l);
  const imageTool = TOOLS.find((t) => t.slug === "image-converter");

  // FAQ visible = questions spécifiques à la paire + questions universelles
  // (gratuit ? upload ?) — le JSON-LD reprend exactement le même texte
  const universalFaq = imageTool ? toolFaqItems(imageTool).slice(0, 2) : [];
  const faqItems = [...pair.faq, ...universalFaq].map((item) => ({
    q: item.q[l],
    a: item.a[l],
  }));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND_NAME, item: `${SITE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: imageTool?.name[l] ?? "Image Converter", item: `${SITE_URL}/${l}/t/image-converter` },
      { "@type": "ListItem", position: 3, name: title, item: `${SITE_URL}/${l}/convert/${pair.slug}` },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="pt-9">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqLd) }} />

      {/* Fil d'ariane */}
      <div className="flex gap-[6px] font-mono text-[12px] text-dim mb-7">
        <Link href={`/${l}`} className="hover:text-brand transition-colors">~</Link>
        <span>/</span>
        <Link href={`/${l}/t/image-converter`} className="hover:text-brand transition-colors">
          {imageTool?.name[l].toLowerCase() ?? "image converter"}
        </Link>
        <span>/</span>
        <span className="text-brand">{pair.slug}</span>
      </div>

      {/* Titre + phrase-réponse */}
      <div className="mb-8">
        <h1 className="text-[36px] font-medium tracking-[-0.025em] leading-none mb-3">
          {title}
          <span className="text-dim text-[20px] font-normal ml-3">
            {l === "fr" ? "— gratuit, dans votre navigateur" : "— free, in your browser"}
          </span>
        </h1>
        <p className="text-fg-1 text-[15px] leading-relaxed max-w-[72ch]">{pair.why[l]}</p>
      </div>

      <ConvertWorkspace target={pair.to} />

      {/* Points différenciants */}
      <section className="mb-10">
        <div className="font-mono text-[11px] text-dim mb-3">
          {"// "}{l === "fr" ? "à savoir" : "good to know"}
        </div>
        <ul className="flex flex-col gap-2 border border-line bg-bg-1 p-6">
          {pair.points[l].map((point) => (
            <li key={point} className="flex gap-3 text-[13px] text-fg-1 leading-relaxed">
              <span className="text-dim shrink-0">—</span>
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ — même texte que le JSON-LD FAQPage */}
      <section className="mb-10">
        <div className="font-mono text-[11px] text-dim mb-3">
          {"// "}{l === "fr" ? "questions fréquentes" : "faq"}
        </div>
        <FaqList items={faqItems} headingAs="h2" />
      </section>

      {/* Maillage : paires sœurs + outil mère */}
      <ConvertHub lang={l} currentSlug={pair.slug} />
      <p className="mb-12 font-mono text-[13px]">
        <Link href={`/${l}/t/image-converter`} className="text-fg-1 hover:text-brand transition-colors">
          {l === "fr"
            ? "→ Besoin d'un autre format ou du redimensionnement ? Ouvrir le convertisseur d'images complet"
            : "→ Need another format or resizing? Open the full Image Converter"}
        </Link>
      </p>
    </div>
  );
}
