import { Cursor } from "@/components/brand/Cursor";
import { TOOLS } from "@/lib/tools";
import type { Lang } from "@/lib/types";
import type { Dict } from "@/lib/i18n";

interface HomeHeroProps {
  lang: Lang;
  i: Dict;
  onSearchClick: () => void;
}

const CORNERS = [
  { char: "┌", pos: "top-0 left-0" },
  { char: "┐", pos: "top-0 right-0" },
  { char: "└", pos: "bottom-0 left-0" },
  { char: "┘", pos: "bottom-0 right-0" },
] as const;

export function HomeHero({ lang, i, onSearchClick }: HomeHeroProps) {
  const toolCount       = TOOLS.filter((t) => !t.comingSoon).length;
  const comingSoonCount = TOOLS.filter((t) => t.comingSoon).length;

  return (
    <section className="mb-14">
      <div
        className="relative p-9 border border-line bg-bg-1"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.015), transparent 40%), var(--bg-1)" }}
      >
        {CORNERS.map(({ char, pos }) => (
          <span
            key={pos}
            className={`absolute font-mono text-[14px] text-brand leading-none ${pos}`}
            style={{ transform: "translate(-1px, -1px)" }}
            aria-hidden
          >
            {char}
          </span>
        ))}

        <div className="flex gap-[10px] font-mono text-[11px] text-dim mb-5">
          <span>{toolCount} {i.toolsAvailable}</span>
          <span className="text-dim-2">·</span>
          <span>{comingSoonCount} {i.comingSoonLabel}</span>
        </div>

        <h1 className="text-[44px] font-medium tracking-[-0.025em] leading-[1.1] mb-[18px]">
          <span className="font-mono text-brand mr-2">$</span>
          {i.tagline}
          <Cursor />
        </h1>

        <p className="text-fg-1 text-[16px] leading-[1.6] max-w-[64ch] mb-7">{i.heroDesc}</p>

        <div className="mb-[18px]">
          <button
            onClick={onSearchClick}
            className="flex items-center gap-[10px] w-full px-4 py-[14px] border border-line-2 bg-bg rounded transition-colors duration-150 hover:border-brand-mid"
          >
            <span className="font-mono text-brand text-[14px]">{">"}</span>
            <span className="font-mono text-dim text-[14px] flex-1 text-left">{i.searchPlaceholder}</span>
            <kbd className="font-mono text-[11px] text-fg-1 border border-line-2 rounded-[3px] px-[6px] py-[2px] bg-bg-1">⌘</kbd>
            <kbd className="font-mono text-[11px] text-fg-1 border border-line-2 rounded-[3px] px-[6px] py-[2px] bg-bg-1">K</kbd>
          </button>
          <div className="font-mono text-[11px] text-dim mt-[6px] pl-1">{i.searchHint}</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[i.noServer, i.inBrowser, "open source"].map((label) => (
            <span key={label} className="inline-flex items-center gap-[6px] px-[10px] py-1 border border-line-2 bg-bg rounded-full font-mono text-[11px] text-fg-1">
              <span className="w-[5px] h-[5px] rounded-full bg-brand shrink-0" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
