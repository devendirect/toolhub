import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES, findGuide, readingMinutes } from "@/lib/guides";
import { TOOLS } from "@/lib/tools";
import { SITE_URL, BRAND_NAME } from "@/lib/brand";
import { coerceLang } from "@/lib/localePath";
import { jsonLdString } from "@/lib/jsonld";
import { GuideBody } from "@/components/guides/GuideBody";
import { FaqList } from "@/components/FaqList";
import { SectionHead } from "@/components/home/SectionHead";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return GUIDES.flatMap((g) => [{ lang: "en", slug: g.slug }, { lang: "fr", slug: g.slug }]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const guide = findGuide(slug);
  if (!guide) return { robots: { index: false } };
  const l = coerceLang(lang);
  const { title, description } = guide[l];
  const url = `${SITE_URL}/${l}/guides/${slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `${SITE_URL}/en/guides/${slug}`, fr: `${SITE_URL}/fr/guides/${slug}`, "x-default": `${SITE_URL}/en/guides/${slug}` },
    },
    openGraph: { type: "article", title, description, url, publishedTime: guide.published, modifiedTime: guide.updated, siteName: BRAND_NAME },
    twitter: { card: "summary", title, description },
  };
}

function formatDate(iso: string, lang: "en" | "fr") {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function GuidePage({ params }: Props) {
  const { lang, slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();
  const l = coerceLang(lang);
  const text = guide[l];
  const url = `${SITE_URL}/${l}/guides/${slug}`;
  const tools = guide.tools.map((s) => TOOLS.find((t) => t.slug === s)).filter((t) => t && !t.comingSoon);
  const others = GUIDES.filter((g) => g.slug !== slug);
  const fr = l === "fr";

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: text.title,
    description: text.description,
    inLanguage: l,
    datePublished: guide.published,
    dateModified: guide.updated,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: BRAND_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: BRAND_NAME, url: SITE_URL },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND_NAME, item: `${SITE_URL}/${l}` },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/${l}/guides` },
      { "@type": "ListItem", position: 3, name: text.title, item: url },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: text.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="pt-9 pb-12">
      {[articleLd, breadcrumbLd, faqLd].map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(ld) }} />
      ))}

      <div className="flex gap-[6px] font-mono text-[12px] text-dim mb-7">
        <Link href={`/${l}`} className="hover:text-brand transition-colors">~</Link>
        <span>/</span>
        <Link href={`/${l}/guides`} className="hover:text-brand transition-colors">guides</Link>
        <span>/</span>
        <span className="text-brand">{slug}</span>
      </div>

      <article className="max-w-[72ch]">
        <header className="mb-10">
          <h1 className="text-[34px] sm:text-[40px] font-medium tracking-[-0.025em] leading-[1.15] mb-4">{text.title}</h1>
          <p className="font-mono text-[12px] text-dim mb-6">
            {fr ? "Mis à jour le" : "Updated"} {formatDate(guide.updated, l)} · {readingMinutes(text)} min {fr ? "de lecture" : "read"} · {BRAND_NAME}
          </p>
          <p className="text-[17px] text-fg leading-[1.7] border-l-2 border-brand pl-4">{text.lead}</p>
        </header>

        <GuideBody sections={text.sections} lang={l} />
      </article>

      {tools.length > 0 && (
        <section className="mt-14 mb-10">
          <SectionHead label={fr ? "// outils utilisés dans ce guide" : "// tools used in this guide"} />
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
            {tools.map((t) => (
              <li key={t!.slug} className="bg-bg">
                <Link href={`/${l}/t/${t!.slug}`} className="flex flex-col gap-1 px-4 py-3 hover:bg-bg-2 transition-colors">
                  <span className="text-[14px] text-fg font-medium">{t!.name[l]} →</span>
                  <span className="text-[13px] text-fg-1">{t!.desc[l]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {text.faq.length > 0 && (
        <section className="mb-10 max-w-[72ch]">
          <SectionHead label={fr ? "// questions fréquentes" : "// faq"} />
          <FaqList items={text.faq} headingAs="h3" />
        </section>
      )}

      {others.length > 0 && (
        <section>
          <SectionHead label={fr ? "// autres guides" : "// more guides"} />
          <ul className="flex flex-col divide-y divide-line border border-line">
            {others.map((g) => (
              <li key={g.slug}>
                <Link href={`/${l}/guides/${g.slug}`} className="block px-4 py-3 text-[14px] text-fg hover:bg-bg-2 hover:text-brand transition-colors">{g[l].title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
