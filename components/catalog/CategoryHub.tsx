import Link from "next/link";
import { SectionHead } from "@/components/home/SectionHead";
import { FaqList } from "@/components/FaqList";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import { CATEGORY_CONTENT } from "@/lib/category-content";
import { CONVERT_PAIRS, FORMAT_LABEL } from "@/lib/convert-pairs";
import { PDF_PAIRS } from "@/lib/pdf-pairs";
import { jsonLdString } from "@/lib/jsonld";
import { guidesForCategory } from "@/lib/guides";
import type { Lang } from "@/lib/types";

type HubCat = keyof typeof CATEGORY_CONTENT;

const TR = {
  fr: { guides: "// guides", about: "// à propos de cette catégorie", guide: "// quel outil pour quel besoin", convert: "// conversions courantes", others: "// autres catégories", faq: "// questions fréquentes", tools: "outils" },
  en: { guides: "// guides", about: "// about this category", guide: "// which tool for which job", convert: "// common conversions", others: "// other categories", faq: "// faq", tools: "tools" },
};

/**
 * Partie éditoriale d'une page catégorie, rendue côté serveur sous le
 * catalogue : c'est elle qui fait de /tools/[category] un hub (introduction,
 * guide « quel outil pour quel besoin », pages de conversion, catégories
 * voisines, FAQ + JSON-LD) et non une simple liste de cartes.
 */
export function CategoryHub({ cat, lang }: { cat: HubCat; lang: Lang }) {
  const content = CATEGORY_CONTENT[cat];
  const t = TR[lang];
  const toolBySlug = new Map(TOOLS.map((tool) => [tool.slug, tool]));
  const conversions = cat === "file" ? [...CONVERT_PAIRS, ...PDF_PAIRS] : [];
  const others = CATEGORIES.filter((c) => c.id !== "all" && c.id !== cat);
  const guides = guidesForCategory(cat);
  const liveCount = (id: string) => TOOLS.filter((tool) => tool.cat === id && !tool.comingSoon).length;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((item) => ({
      "@type": "Question",
      name: item.q[lang],
      acceptedAnswer: { "@type": "Answer", text: item.a[lang] },
    })),
  };

  return (
    <div className="pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqLd) }} />

      <section className="mb-10">
        <SectionHead label={t.about} />
        <article className="bg-bg-1 border border-line p-6">
          <h3 className="font-mono text-[13px] text-fg font-medium mb-3">
            <span className="text-brand mr-2">{"#"}</span>
            {content.intro.h[lang]}
          </h3>
          <div className="flex flex-col gap-3 max-w-[75ch]">
            {content.intro.p[lang].map((para) => (
              <p key={para} className="text-[13px] text-fg-1 leading-relaxed">{para}</p>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-10">
        <SectionHead label={t.guide} />
        <ul className="flex flex-col divide-y divide-line border border-line">
          {content.guide.map(({ need, slug }) => {
            const tool = toolBySlug.get(slug);
            if (!tool || tool.comingSoon) return null;
            return (
              <li key={slug + need.en}>
                <Link
                  href={`/${lang}/t/${slug}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 hover:bg-bg-2 transition-colors"
                >
                  <span className="flex-1 text-[13px] text-fg-1">{need[lang]}</span>
                  <span className="font-mono text-[12px] text-brand shrink-0">→ {tool.name[lang]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {conversions.length > 0 && (
        <section className="mb-10">
          <SectionHead label={t.convert} />
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line">
            {conversions.map((p) => (
              <li key={p.slug} className="bg-bg">
                <Link href={`/${lang}/convert/${p.slug}`} className="block px-4 py-3 font-mono text-[12px] text-fg-1 hover:text-brand hover:bg-bg-2 transition-colors">
                  {FORMAT_LABEL[p.from] ?? p.from.toUpperCase()} → {FORMAT_LABEL[p.to] ?? p.to.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {guides.length > 0 && (
        <section className="mb-10">
          <SectionHead label={t.guides} />
          <ul className="flex flex-col divide-y divide-line border border-line">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={`/${lang}/guides/${g.slug}`} className="flex flex-col gap-1 px-4 py-3 hover:bg-bg-2 transition-colors">
                  <span className="text-[14px] text-fg font-medium">{g[lang].title} →</span>
                  <span className="text-[13px] text-fg-1">{g[lang].description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-10">
        <SectionHead label={t.others} />
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line">
          {others.map((c) => (
            <li key={c.id} className="bg-bg">
              <Link href={`/${lang}/tools/${c.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-2 transition-colors">
                <span className="font-mono text-[13px] text-brand w-7 shrink-0">{c.glyph}</span>
                <span className="flex-1 text-[13px] text-fg">{c.label[lang]}</span>
                <span className="font-mono text-[11px] text-dim-2">{liveCount(c.id)} {t.tools}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHead label={t.faq} />
        <FaqList items={content.faq.map((f) => ({ q: f.q[lang], a: f.a[lang] }))} headingAs="h3" />
      </section>
    </div>
  );
}
