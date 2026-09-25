"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: { hexInvalid: "HEX invalide" },
  en: { hexInvalid: "invalid HEX" },
} as const;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hexToHsv(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex);
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn), d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (max !== min) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(max * 100)];
}

export function ColorPicker() {
  const { lang } = useLang();
  const i = t(lang);
  const [hex, setHex] = useState("#00e08a");
  const [hexInput, setHexInput] = useState("#00e08a");
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("color-picker", "design");

  const isValidHex = (h: string) => /^#[0-9A-Fa-f]{6}$/.test(h);

  const handleHexInput = (val: string) => {
    setHexInput(val);
    if (isValidHex(val)) setHex(val);
  };

  const handleColorPicker = (val: string) => {
    setHex(val);
    setHexInput(val);
  };

  const colors = useMemo(() => {
    if (!isValidHex(hex)) return null;
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    const [hh, sv, v] = hexToHsv(hex);
    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`,
      hsv: `hsv(${hh}, ${sv}%, ${v}%)`,
      r, g, b, h, s, l,
    };
  }, [hex]);

  const rows = colors
    ? [
        { label: "HEX",  value: colors.hex },
        { label: "RGB",  value: colors.rgb },
        { label: "HSL",  value: colors.hsl },
        { label: "HSV",  value: colors.hsv },
        { label: "R",    value: String(colors.r) },
        { label: "G",    value: String(colors.g) },
        { label: "B",    value: String(colors.b) },
      ]
    : [];

  return (
    <section className="mb-10">
      {/* Picker + HEX input */}
      <div className="border border-line border-b-0 flex items-center gap-0">
        <input
          type="color"
          value={hex}
          onChange={(e) => handleColorPicker(e.target.value)}
          className="h-[46px] w-[46px] cursor-pointer border-r border-line bg-bg-1 shrink-0 p-1"
        />
        <div
          className="h-[46px] w-[80px] shrink-0 border-r border-line"
          style={{ backgroundColor: hex }}
        />
        <input
          value={hexInput}
          onChange={(e) => handleHexInput(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className="flex-1 bg-transparent font-mono text-[14px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2 uppercase"
        />
      </div>

      <div className="border border-line divide-y divide-line">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="group flex items-center gap-4 px-[14px] py-[11px] hover:bg-bg-2 transition-colors cursor-pointer"
            onClick={() => { trackRun(); copy(value, label); }}
          >
            <span className="font-mono text-[11px] text-dim uppercase tracking-[0.08em] w-12 shrink-0">{label}</span>
            <span className="font-mono text-[13px] text-fg flex-1">{value}</span>
            <span className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {copied === label ? "✓" : i.copy}
            </span>
          </div>
        ))}

        {!colors && (
          <div className="px-[14px] py-[14px]">
            <span className="font-mono text-[12px] text-dim-2">
              {TR[lang].hexInvalid}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
