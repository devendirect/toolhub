"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import type { Tool } from "@/lib/types";
import type { ToolContent } from "@/lib/tools-content";
import type { FaqItem } from "@/lib/faq";
import { ToolHeader } from "./ToolHeader";
import { GenericWorkspace } from "@/components/workspaces/GenericWorkspace";
import { SectionHead } from "@/components/home/SectionHead";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { localePath } from "@/lib/localePath";
import { FaqList } from "@/components/FaqList";
import { WORKSPACE_REGISTRY } from "@/lib/workspace-registry";
import { AdSlot } from "@/components/ads/AdSlot";
import { AD_SLOTS, adsAllowedOn } from "@/lib/ads";

function ToolContentSection({ content, lang }: { content: ToolContent; lang: "fr" | "en" }) {
  return (
    <article className="mb-10">
      <SectionHead label={`// ${lang === "fr" ? "à propos de cet outil" : "about this tool"}`} />
      <div className="border border-line bg-bg-1 p-6">
        <p className="text-[13px] text-fg-1 leading-relaxed mb-6">{content.desc[lang]}</p>
        <h3 className="font-mono text-[11px] text-dim mb-3">
          {"// "}{lang === "fr" ? "cas d'usage" : "use cases"}
        </h3>
        <ul className="flex flex-col gap-2">
          {content.useCases[lang].map((item) => (
            <li key={item} className="flex gap-3 text-[13px] text-fg-1 leading-relaxed">
              <span className="text-dim shrink-0">—</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function ToolDeepDive({ content, lang }: { content: ToolContent; lang: "fr" | "en" }) {
  if (!content.deepDive?.length) return null;
  return (
    <section className="mb-10">
      <SectionHead label={`// ${lang === "fr" ? "en détail" : "in depth"}`} />
      <div className="flex flex-col gap-px bg-line border border-line">
        {content.deepDive.map((section) => (
          <article key={section.h.en} className="bg-bg-1 p-6">
            <h3 className="font-mono text-[13px] text-fg font-medium mb-3">
              <span className="text-brand mr-2">{"#"}</span>
              {section.h[lang]}
            </h3>
            <div className="flex flex-col gap-3">
              {section.p[lang].map((para) => (
                <p key={para} className="text-[13px] text-fg-1 leading-relaxed">{para}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ToolFaqSection({ faqItems, lang }: { faqItems: FaqItem[]; lang: "fr" | "en" }) {
  const items = faqItems.map((item) => ({ q: item.q[lang], a: item.a[lang] }));
  return (
    <section className="mb-10">
      <SectionHead label={`// ${lang === "fr" ? "questions fréquentes" : "faq"}`} />
      <FaqList items={items} headingAs="h3" />
    </section>
  );
}

interface Props {
  tool: Tool;
  content?: ToolContent;
  faqItems: FaqItem[];
}

export function ToolPageClient({ tool, content, faqItems }: Props) {
  const { lang } = useLang();
  const i = t(lang);

  const WorkspaceComp = WORKSPACE_REGISTRY[tool.slug];
  const related = TOOLS.filter((t) => t.slug !== tool.slug && t.cat === tool.cat).slice(0, 3);

  return (
    <div className="pt-9">
      <ToolHeader tool={tool} />

      <ErrorBoundary>
        {WorkspaceComp
          ? <WorkspaceComp />
          : <GenericWorkspace tool={tool} />}
      </ErrorBoundary>

      {content && <ToolContentSection content={content} lang={lang} />}

      {content && <ToolDeepDive content={content} lang={lang} />}

      {/* Après le contenu rédactionnel, jamais entre l'outil et son résultat */}
      {adsAllowedOn(tool.slug) && <AdSlot slot={AD_SLOTS.toolContent} className="mb-10" />}

      {faqItems.length > 0 && <ToolFaqSection faqItems={faqItems} lang={lang} />}

      {related.length > 0 && (
        <section className="mb-10">
          <SectionHead label={`// ${i.relatedTools.toLowerCase()}`} />
          <div className="grid grid-cols-1 md:grid-cols-3 border border-line bg-bg-1">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                href={localePath(lang, `/t/${rel.slug}`)}
                className="group relative flex flex-col p-5 border-r border-line last:border-r-0 min-h-[150px] transition-colors duration-150 hover:bg-bg-2"
              >
                <span className="absolute top-5 right-5 font-mono text-[14px] text-dim transition-all duration-150 group-hover:text-brand group-hover:translate-x-1">→</span>
                <span className="font-mono text-[22px] text-fg tracking-[0.1em] mb-3 transition-colors duration-150 group-hover:text-brand">{rel.glyph}</span>
                <h3 className="text-[15px] font-medium tracking-[-0.015em] mb-[6px]">{rel.name[lang]}</h3>
                <p className="text-[13px] text-fg-1 leading-[1.5] flex-1">{rel.desc[lang]}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
