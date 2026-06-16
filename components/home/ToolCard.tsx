import Link from "next/link";
import type { Tool, Lang } from "@/lib/types";
import { localePath } from "@/lib/localePath";

interface ToolCardProps {
  tool: Tool;
  lang: Lang;
  catLabel: string;
}

export function ToolCard({ tool, lang, catLabel }: ToolCardProps) {
  const soon = tool.comingSoon;

  const inner = (
    <>
      {/* Arrow / soon badge */}
      <span className="absolute top-[22px] right-[22px] font-mono text-[14px] text-dim transition-all duration-150 group-hover:text-brand group-hover:translate-x-1">
        {soon ? "" : "→"}
      </span>
      {soon && (
        <span className="absolute top-[20px] right-[20px] font-mono text-[10px] text-dim border border-line rounded-[3px] px-[6px] py-[2px] uppercase tracking-[0.08em]">
          {lang === "fr" ? "bientôt" : "soon"}
        </span>
      )}

      {/* Top row */}
      <div className="flex items-center justify-between mb-[14px]">
        <span className={`font-mono text-[22px] tracking-[0.1em] transition-colors duration-150 ${soon ? "text-dim" : "text-fg group-hover:text-brand"}`}>
          {tool.glyph}
        </span>
        {!soon && (tool.privacy === "network" ? (
          <span className="font-mono text-[10px] text-hot tracking-[0.08em]">● proxy</span>
        ) : (
          <span className="font-mono text-[10px] text-dim uppercase tracking-[0.1em]">{catLabel}</span>
        ))}
      </div>

      {/* Name */}
      <div className={`text-[16px] font-medium tracking-[-0.015em] mb-[6px] ${soon ? "text-fg-1" : ""}`}>
        {tool.name[lang]}
      </div>

      {/* Desc */}
      <div className="text-[13px] text-fg-1 leading-[1.5] flex-1">{tool.desc[lang]}</div>

      {/* Bottom */}
      <div className="flex items-center justify-between mt-[14px] gap-2">
        <div className="flex gap-1 flex-wrap">
          {tool.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="font-mono text-[11px] text-dim border border-line rounded-[3px] px-2 py-[1px]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  if (soon) {
    return (
      <div className="group relative flex flex-col p-[22px] border-r border-b border-line bg-bg-1 min-h-[180px] opacity-50 cursor-default">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={localePath(lang, `/t/${tool.slug}`)}
      className="group relative flex flex-col p-[22px] border-r border-b border-line bg-bg-1 min-h-[180px] transition-colors duration-150 hover:bg-bg-2 hover:border-brand-mid"
    >
      {inner}
    </Link>
  );
}
