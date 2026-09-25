"use client";

import { useState, useMemo } from "react";
import { useCopy } from "@/hooks/useCopy";
import { useLang } from "@/components/providers/I18nProvider";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { t } from "@/lib/i18n";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: {
    harmony:  "harmonie",
    count:    "nombre",
    export:   "export CSS",
    copied:   "✓ copié",
    harmonies: { analogous: "analogue", complementary: "complémentaire", triadic: "triadique", split: "compl. divisée", tetradic: "tétradique" },
  },
  en: {
    harmony:  "harmony",
    count:    "count",
    export:   "export CSS",
    copied:   "✓ copied",
    harmonies: { analogous: "analogous", complementary: "complementary", triadic: "triadic", split: "split", tetradic: "tetradic" },
  },
} as const;

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export type Harmony = "analogous" | "complementary" | "triadic" | "split" | "tetradic";

const HARMONY_ANGLES: Record<Harmony, number[]> = {
  analogous:       [0, 30, -30, 60, -60],
  complementary:   [0, 180],
  triadic:         [0, 120, 240],
  split:           [0, 150, 210],
  tetradic:        [0, 90, 180, 270],
};

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6
        : max === g ? ((b - r) / d + 2) / 6
        :             ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const hn = ((h % 360) + 360) % 360;
  const sl = s / 100, ll = l / 100;
  const a = sl * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + hn / 30) % 12;
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Teintes de l'harmonie, complétées par des variantes plus claires puis plus
 * foncées quand l'harmonie a moins de teintes que le nombre demandé
 * (complémentaire = 2 teintes : « 5 couleurs » en donnait 2).
 */
export function buildPalette(baseHex: string, harmony: Harmony, count: number): string[] {
  const [h, s, l] = hexToHsl(baseHex);
  const hues = HARMONY_ANGLES[harmony].map((a) => h + a);
  const clamp = (v: number) => Math.min(92, Math.max(8, v));
  const candidates = [
    ...hues.map((hue) => hslToHex(hue, s, l)),
    ...hues.map((hue) => hslToHex(hue, s, clamp(l + 20))),
    ...hues.map((hue) => hslToHex(hue, s, clamp(l - 20))),
  ];
  return [...new Set(candidates)].slice(0, count);
}

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function PaletteGenerator() {
  const { lang } = useLang();
  const i = t(lang);

  const [baseColor, setBaseColor] = useState("#00e08a");
  // Saisie libre : l'ancien champ contrôlé revenait à la valeur précédente à chaque caractère
  const [hexInput, setHexInput] = useState("#00e08a");
  const [harmony, setHarmony] = useState<Harmony>("analogous");
  const [count, setCount] = useState<3 | 4 | 5>(5);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("palette-generator", "design");

  const palette = useMemo(() => {
    return buildPalette(baseColor, harmony, count).map((hex) => {
      const [ch, cs, cl] = hexToHsl(hex);
      const { r, g, b } = hexToRgb(hex);
      return {
        hex,
        hsl: `hsl(${ch}, ${cs}%, ${cl}%)`,
        rgb: `rgb(${r}, ${g}, ${b})`,
        textColor: luminance(hex) > 140 ? "#0a0b0d" : "#e9eaec",
      };
    });
  }, [baseColor, harmony, count]);

  const handleCopy = (value: string) => { trackRun(); copy(value); };

  const handleExportCss = () => {
    const css = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join("\n")}\n}`;
    trackRun();
    copy(css, "__css__");
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleExportCss}
            className="px-[18px] py-2 border border-line-2 bg-bg-1 font-mono text-[12px] text-fg-1 rounded-[3px] hover:border-brand-mid hover:text-fg transition-colors"
          >
            {copied === "__css__" ? TR[lang].copied : TR[lang].export}
          </button>
        }
      >
        <OptBlock label={i.color}>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => { setBaseColor(e.target.value); setHexInput(e.target.value); }}
              className="w-7 h-7 rounded cursor-pointer border border-line-2 bg-transparent"
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => {
                const v = e.target.value.trim();
                setHexInput(v);
                const hex = v.startsWith("#") ? v : `#${v}`;
                if (HEX_RE.test(hex)) setBaseColor(hex.toLowerCase());
              }}
              className="w-[80px] font-mono text-[12px] bg-transparent text-fg border border-line px-2 py-[3px] outline-none focus:border-brand-mid"
              spellCheck={false}
            />
          </div>
        </OptBlock>
        <OptBlock label={TR[lang].harmony}>
          <SegControl
            options={["analogous", "complementary", "triadic", "split", "tetradic"]}
            value={harmony}
            onChange={(v) => setHarmony(v as Harmony)}
            labels={TR[lang].harmonies}
          />
        </OptBlock>
        <OptBlock label={TR[lang].count}>
          <SegControl options={[3, 4, 5]} value={count} onChange={(v) => setCount(v as 3 | 4 | 5)} />
        </OptBlock>
      </OptionsBar>

      {/* Swatches */}
      <div className="border border-line border-t-0">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${palette.length}, 1fr)` }}>
          {palette.map((color, idx) => (
            <div
              key={idx}
              className="flex flex-col"
              style={{ background: color.hex, color: color.textColor }}
            >
              <div className="h-[200px]" />
            </div>
          ))}
        </div>

        <div className="grid border-t border-line" style={{ gridTemplateColumns: `repeat(${palette.length}, 1fr)` }}>
          {palette.map((color, idx) => (
            <div key={idx} className="flex flex-col gap-[6px] p-[14px] border-r border-line last:border-r-0 bg-bg-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-dim-2">
                  {String(idx + 1).padStart(2, "0")}
                  {idx === 0 && <span className="ml-1 text-brand">●</span>}
                </span>
                <div className="w-5 h-5 rounded-[2px] border border-line shrink-0" style={{ background: color.hex }} />
              </div>
              <button
                onClick={() => handleCopy(color.hex)}
                className="font-mono text-[13px] text-fg font-medium text-left hover:text-brand transition-colors"
              >
                {copied === color.hex ? "✓" : color.hex}
              </button>
              <button
                onClick={() => handleCopy(color.hsl)}
                className="font-mono text-[11px] text-dim text-left hover:text-fg-1 transition-colors truncate"
              >
                {copied === color.hsl ? "✓" : color.hsl}
              </button>
              <button
                onClick={() => handleCopy(color.rgb)}
                className="font-mono text-[11px] text-dim-2 text-left hover:text-fg-1 transition-colors truncate"
              >
                {copied === color.rgb ? "✓" : color.rgb}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
