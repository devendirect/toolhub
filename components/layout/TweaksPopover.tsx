"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme, type Accent, type Density, type UIFont } from "@/components/providers/ThemeProvider";
import { useLang } from "@/components/providers/I18nProvider";
import { SegControl } from "@/components/workspace/OptionsBar";

const ACCENTS:   Accent[]  = ["green", "amber", "violet", "cyan"];
const DENSITIES: Density[] = ["compact", "regular", "comfy"];
const FONTS:     UIFont[]  = ["geist", "inter", "ibm"];

const ACCENT_DOTS: Record<Accent, string> = {
  green:  "#4ade80",
  amber:  "#fbbf24",
  violet: "#a78bfa",
  cyan:   "#22d3ee",
};

export function TweaksPopover() {
  const { accent, density, font, setAccent, setDensity, setFont } = useTheme();
  const { lang } = useLang();

  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex items-center justify-center w-8 h-8 font-mono text-[16px] text-dim border border-line-2 rounded bg-bg-1 transition-colors duration-150 hover:border-brand-mid hover:text-fg-1"
        aria-label={lang === "fr" ? "Personnaliser l'apparence" : "Customize appearance"}
      >
        ⊞
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[280px] p-0 border border-line bg-bg-1 rounded-none shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-brand">⊞</span>
          <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">
            {lang === "fr" ? "apparence" : "tweaks"}
          </span>
        </div>

        <div className="p-4 flex flex-col gap-5">

          {/* Accent */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-dim uppercase tracking-[0.1em]">accent</span>
            <div className="flex gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAccent(a)}
                  title={a}
                  className={`flex-1 h-7 rounded-[3px] border transition-all duration-150 ${
                    accent === a
                      ? "border-fg-1 scale-[1.06]"
                      : "border-line-2 hover:border-fg-1 opacity-60 hover:opacity-100"
                  }`}
                  style={{ background: ACCENT_DOTS[a] }}
                />
              ))}
            </div>
            <span className="font-mono text-[10px] text-dim">{accent}</span>
          </div>

          {/* Density */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-dim uppercase tracking-[0.1em]">density</span>
            <SegControl
              options={DENSITIES}
              value={density}
              onChange={(v) => setDensity(v as Density)}
            />
          </div>

          {/* Font */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-dim uppercase tracking-[0.1em]">font</span>
            <SegControl
              options={FONTS}
              value={font}
              onChange={(v) => setFont(v as UIFont)}
            />
          </div>

        </div>

        {/* Footer reset */}
        <div className="px-4 py-3 border-t border-line">
          <button
            onClick={() => { setAccent("green"); setDensity("regular"); setFont("geist"); }}
            className="font-mono text-[11px] text-dim hover:text-fg-1 transition-colors"
          >
            {lang === "fr" ? "↺ réinitialiser" : "↺ reset to defaults"}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
