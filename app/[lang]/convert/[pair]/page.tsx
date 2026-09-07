import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CONVERT_PAIRS, FORMAT_LABEL, findPair, type ConvertPair, type TargetFormat } from "@/lib/convert-pairs";
import { PDF_PAIRS, findPdfPair, type PdfPair } from "@/lib/pdf-pairs";
import { TOOLS } from "@/lib/tools";
import { privacyFaqItem } from "@/lib/faq";
import { jsonLdString } from "@/lib/jsonld";
import { SITE_URL, BRAND_NAME } from "@/lib/brand";
import { coerceLang } from "@/lib/localePath";
import { ConvertWorkspace } from "@/components/convert/ConvertWorkspace";
import { PdfConvertWorkspace } from "@/components/convert/PdfConvertWorkspace";
import { ConvertHub } from "@/components/convert/ConvertHub";
import { FaqList } from "@/components/FaqList";

interface Props {
  params: Promise<{ lang: string; pair: string }>;
}

// Une paire résolue expose toujours from/to/why/points/faq/slug — que ce soit
// une ConvertPair (image) ou une PdfPair, ces champs partagent la même forme,
// donc le reste de la page peut rester agnostique de la famille.
type Resolved =
  | { family: "image"; pair: ConvertPair }
  | { family: "pdf"; pair: PdfPair };

function resolvePair(slug: string): Resolved | null {
  const imagePair = findPair(slug);
  if (imagePair) return { family: "image", pair: imagePair };
  const pdfPair = findPdfPair(slug);
  if (pdfPair) return { family: "pdf", pair: pdfPair };
  return null;
}

const PARENT_SLUG = { image: "image-converter", pdf: "pdf-converter" } as const;

export function generateStaticParams() {
  return [...CONVERT_PAIRS, ...PDF_PAIRS].flatMap((p) => [
    { lang: "en", pair: p.slug },
    { lang: "fr", pair: p.slug },
  ]);
}

function pairTitle(from: string, to: string, lang: "en" | "fr") {
  const f = FORMAT_LABEL[from] ?? from.toUpperCase();
  const t = FORMAT_LABEL[to] ?? to.toUpperCase();
  return lang === "fr" ? `Convertir ${f} en ${t}` : `Convert ${f} to ${t}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, pair: pairSlug } = await params;
  const resolved = resolvePair(pairSlug);
  if (!resolved) return { robots: { index: false } };

  const l = coerceLang(lang);
  const { pair } = resolved;
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
  const resolved = resolvePair(pairSlug);
  if (!resolved) notFound();

  const { family, pair } = resolved;
  const l = coerceLang(lang);
  const title = pairTitle(pair.from, pair.to, l);
  const parentSlug = PARENT_SLUG[family];
  const parentTool = TOOLS.find((t) => t.slug === parentSlug);

  // FAQ visible = questions spécifiques à la paire + la seule question
  // transverse qui vaille ici. Auparavant on reprenait les deux premières
  // entrées de toolFaqItems() ; depuis que celles-ci commencent par les
  // questions propres à l'outil mère, cela recopiait la FAQ du convertisseur
  // sur ses quatorze pages de paires. Le JSON-LD reprend le même texte.
  const transverseFaq = parentTool ? [privacyFaqItem(parentTool)] : [];
  const faqItems = [...pair.faq, ...transverseFaq].map((item) => ({
    q: item.q[l],
    a: item.a[l],
  }));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND_NAME, item: `${SITE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: parentTool?.name[l] ?? parentSlug, item: `${SITE_URL}/${l}/t/${parentSlug}` },
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
        <Link href={`/${l}/t/${parentSlug}`} className="hover:text-brand transition-colors">
          {parentTool?.name[l].toLowerCase() ?? parentSlug}
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

      {family === "image" ? (
        <ConvertWorkspace target={pair.to as TargetFormat} />
      ) : (
        <PdfConvertWorkspace mode={pair.mode} imgFormat={pair.imgFormat} />
      )}

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

      {/* Sections de fond propres à la paire */}
      {pair.deepDive?.length ? (
        <section className="mb-10">
          <div className="font-mono text-[11px] text-dim mb-3">
            {"// "}{l === "fr" ? "en détail" : "in depth"}
          </div>
          <div className="flex flex-col gap-px bg-line border border-line">
            {pair.deepDive.map((section) => (
              <article key={section.h.en} className="bg-bg-1 p-6">
                <h2 className="font-mono text-[13px] text-fg font-medium mb-3">
                  <span className="text-brand mr-2">{"#"}</span>
                  {section.h[l]}
                </h2>
                <div className="flex flex-col gap-3">
                  {section.p[l].map((para) => (
                    <p key={para} className="text-[13px] text-fg-1 leading-relaxed">{para}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* FAQ — même texte que le JSON-LD FAQPage */}
      <section className="mb-10">
        <div className="font-mono text-[11px] text-dim mb-3">
          {"// "}{l === "fr" ? "questions fréquentes" : "faq"}
        </div>
        <FaqList items={faqItems} headingAs="h2" />
      </section>

      {/* Maillage : paires sœurs de la même famille + outil mère */}
      <ConvertHub lang={l} family={family} currentSlug={pair.slug} />
      <p className="mb-12 font-mono text-[13px]">
        <Link href={`/${l}/t/${parentSlug}`} className="text-fg-1 hover:text-brand transition-colors">
          {family === "image"
            ? (l === "fr"
                ? "→ Besoin d'un autre format ou du redimensionnement ? Ouvrir le convertisseur d'images complet"
                : "→ Need another format or resizing? Open the full Image Converter")
            : (l === "fr"
                ? "→ Besoin d'un autre mode ou format ? Ouvrir le convertisseur PDF complet"
                : "→ Need another mode or format? Open the full PDF Converter")}
        </Link>
      </p>
    </div>
  );
}
