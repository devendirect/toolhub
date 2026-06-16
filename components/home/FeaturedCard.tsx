import Link from "next/link";
import type { Tool, Lang } from "@/lib/types";
import { localePath } from "@/lib/localePath";

interface FeaturedCardProps {
  tool: Tool;
  lang: Lang;
  catLabel: string;
  openLabel: string;
  mostUsedLabel: string;
}

export function FeaturedCard({ tool, lang, catLabel, openLabel, mostUsedLabel }: FeaturedCardProps) {
  return (
    <Link
      href={localePath(lang, `/t/${tool.slug}`)}
      className="group relative w-full grid grid-cols-1 md:grid-cols-[200px_1fr_180px] gap-6 p-6 border border-line bg-bg-1 transition-colors duration-150 hover:border-brand-mid hover:bg-bg-2"
    >
      {/* FEATURED label */}
      <span className="absolute -top-[7px] left-5 bg-bg px-2 font-mono text-[10px] text-brand tracking-[0.15em]">
        FEATURED
      </span>

      {/* Left */}
      <div className="border-b md:border-b-0 md:border-r border-dashed border-line pb-4 md:pb-0 md:pr-5 flex flex-col justify-between">
        <div className="font-mono text-[38px] text-brand tracking-[0.1em] leading-none">{tool.glyph}</div>
        <div className="font-mono text-[11px] text-dim">{catLabel} · {mostUsedLabel}</div>
      </div>

      {/* Mid */}
      <div>
        <div className="text-[22px] font-medium tracking-[-0.02em] mb-[6px]">{tool.name[lang]}</div>
        <div className="text-[14px] text-fg-1 mb-[14px] max-w-[60ch]">{tool.desc[lang]}</div>
        <div className="flex flex-wrap gap-[6px]">
          {tool.tags.map((tag) => (
            <span key={tag} className="font-mono text-[11px] text-dim border border-line rounded-[3px] px-2 py-[1px]">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col justify-between items-end">
        {tool.privacy === "network" && (
          <span className="font-mono text-[10px] text-hot tracking-[0.08em]">● proxy</span>
        )}
        <span className="font-mono text-[13px] text-brand">{openLabel} →</span>
      </div>
    </Link>
  );
}
