"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import type { Tool } from "@/lib/types";
import { ToolHeader } from "./ToolHeader";
import { JsonFormatter } from "@/components/workspaces/JsonFormatter";
import { QrGenerator } from "@/components/workspaces/QrGenerator";
import { Base64Tool } from "@/components/workspaces/Base64Tool";
import { ImageConverter } from "@/components/workspaces/ImageConverter";
import { PaletteGenerator } from "@/components/workspaces/PaletteGenerator";
import { PdfMerge } from "@/components/workspaces/PdfMerge";
import { UuidGenerator } from "@/components/workspaces/UuidGenerator";
import { RemoveLineBreaks } from "@/components/workspaces/RemoveLineBreaks";
import { TextReverser } from "@/components/workspaces/TextReverser";
import { UrlEncoder } from "@/components/workspaces/UrlEncoder";
import { HtmlEntities } from "@/components/workspaces/HtmlEntities";
import { WordCounter } from "@/components/workspaces/WordCounter";
import { CaseConverter } from "@/components/workspaces/CaseConverter";
import { PasswordGenerator } from "@/components/workspaces/PasswordGenerator";
import { GradientGenerator } from "@/components/workspaces/GradientGenerator";
import { HashGenerator } from "@/components/workspaces/HashGenerator";
import { MarkdownHtml } from "@/components/workspaces/MarkdownHtml";
import { RegexTester } from "@/components/workspaces/RegexTester";
import { CronGenerator } from "@/components/workspaces/CronGenerator";
import { IpLookup } from "@/components/workspaces/IpLookup";
import { MetaPreview } from "@/components/workspaces/MetaPreview";
import { SeoAnalyzer } from "@/components/workspaces/SeoAnalyzer";
import { GenericWorkspace } from "@/components/workspaces/GenericWorkspace";
import { SectionHead } from "@/components/home/SectionHead";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { localePath } from "@/lib/localePath";
import { TOOLS_CONTENT } from "@/lib/tools-content";

function WorkspaceSkeleton() {
  return <div className="border border-line min-h-[420px] bg-bg-1 animate-pulse" />;
}

const AudioConverter = dynamic(
  () => import("@/components/workspaces/AudioConverter").then((m) => m.AudioConverter),
  { ssr: false, loading: WorkspaceSkeleton }
);
const VideoConverter = dynamic(
  () => import("@/components/workspaces/VideoConverter").then((m) => m.VideoConverter),
  { ssr: false, loading: WorkspaceSkeleton }
);
const PdfConverter = dynamic(
  () => import("@/components/workspaces/PdfConverter").then((m) => m.PdfConverter),
  { ssr: false, loading: WorkspaceSkeleton }
);

const WORKSPACE_MAP: Partial<Record<string, React.ComponentType<{ tool: Tool }>>> = {
  "json-formatter":    () => <JsonFormatter />,
  "qr-generator":      () => <QrGenerator />,
  "base64":            () => <Base64Tool />,
  "image-converter":   () => <ImageConverter />,
  "palette-generator": () => <PaletteGenerator />,
  "pdf-merge":         () => <PdfMerge />,
  "uuid-generator":    () => <UuidGenerator />,
  "remove-linebreaks": () => <RemoveLineBreaks />,
  "text-reverser":     () => <TextReverser />,
  "url-encoder":       () => <UrlEncoder />,
  "html-entities":     () => <HtmlEntities />,
  "word-counter":      () => <WordCounter />,
  "case-converter":    () => <CaseConverter />,
  "password-generator":  () => <PasswordGenerator />,
  "gradient-generator":  () => <GradientGenerator />,
  "hash-generator":      () => <HashGenerator />,
  "markdown-html":       () => <MarkdownHtml />,
  "regex-tester":        () => <RegexTester />,
  "cron-generator":      () => <CronGenerator />,
  "ip-lookup":           () => <IpLookup />,
  "meta-preview":        () => <MetaPreview />,
  "seo-analyzer":        () => <SeoAnalyzer />,
  "audio-converter":     () => <AudioConverter />,
  "video-converter":     () => <VideoConverter />,
  "pdf-converter":       () => <PdfConverter />,
};

export function ToolPageClient({ tool }: { tool: Tool }) {
  const { lang } = useLang();
  const i = t(lang);

  const Workspace = WORKSPACE_MAP[tool.slug] ?? (() => <GenericWorkspace tool={tool} />);

  const related = TOOLS.filter((t) => t.slug !== tool.slug && t.cat === tool.cat).slice(0, 3);

  return (
    <div className="pt-9">
      <ToolHeader tool={tool} />

      {/* Workspace */}
      <ErrorBoundary>
        <Workspace tool={tool} />
      </ErrorBoundary>

      {/* Tool content */}
      {(() => {
        const content = TOOLS_CONTENT[tool.slug];
        if (!content) return null;
        return (
          <section className="mb-10">
            <SectionHead label={`// ${lang === "fr" ? "à propos de cet outil" : "about this tool"}`} />
            <div className="border border-line bg-bg-1 p-6">
              <p className="text-[13px] text-fg-1 leading-relaxed mb-6">{content.desc[lang]}</p>
              <h3 className="font-mono text-[11px] text-dim mb-3">
                {"// "}{lang === "fr" ? "cas d'usage" : "use cases"}
              </h3>
              <ul className="flex flex-col gap-2">
                {content.useCases[lang].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-[13px] text-fg-1 leading-relaxed">
                    <span className="text-dim shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })()}

      {/* Related tools */}
      {related.length > 0 && (
        <section className="mb-10">
          <SectionHead label={`// ${i.relatedTools.toLowerCase()}`} />
          <div className="grid grid-cols-1 md:grid-cols-3 border border-line bg-bg-1">
            {related.map((rel) => {
              const catLabel = CATEGORIES.find((c) => c.id === rel.cat)?.label[lang] ?? "";
              return (
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
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
