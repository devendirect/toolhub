"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: {
    textLabel:       "texte",
    background:      "fond",
    previewLarge:    "Texte grand (large)",
    previewNormal:   "Texte normal — vérifier le contraste WCAG AA et AAA.",
  },
  en: {
    textLabel:       "text",
    background:      "background",
    previewLarge:    "Large text sample",
    previewNormal:   "Normal text — checking WCAG AA and AAA contrast compliance.",
  },
} as const;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function linearize(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a), l2 = luminance(b);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span className={`font-mono text-[11px] px-2 py-[2px] rounded-[3px] ${pass ? "bg-ok/20 text-ok" : "bg-danger/20 text-danger"}`}>
      {pass ? "✓" : "✕"} {label}
    </span>
  );
}

export function ContrastChecker() {
  const { lang } = useLang();
  const [fg, setFg] = useState("#1a1a1a");
  const [bg, setBg] = useState("#ffffff");
  const trackRun = useTrackRun("contrast-checker", "design");
  const tracked = useRef(false);

  const ratio = useMemo(() => {
    try { return contrastRatio(fg, bg); }
    catch { return null; }
  }, [fg, bg]);

  useEffect(() => {
    if (!tracked.current && ratio !== null) { tracked.current = true; trackRun(); }
  }, [ratio, trackRun]);

  const checks = ratio ? {
    aaText:      ratio >= 4.5,
    aaLarge:     ratio >= 3,
    aaaText:     ratio >= 7,
    aaaLarge:    ratio >= 4.5,
  } : null;

  const colorInput = (label: string, value: string, onChange: (v: string) => void) => (
    <div className="flex items-center gap-0 border-b border-line">
      <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 w-28 shrink-0">{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="h-[46px] w-[46px] cursor-pointer border-r border-line bg-bg p-1 shrink-0" />
      <span className="font-mono text-[13px] text-fg px-4 py-[11px] flex-1 uppercase">{value}</span>
    </div>
  );

  return (
    <section className="mb-10">
      <div className="border border-line">
        {colorInput(TR[lang].textLabel, fg, setFg)}
        {colorInput(TR[lang].background, bg, setBg)}

        {/* Preview */}
        <div className="px-[18px] py-[24px] flex flex-col gap-3" style={{ backgroundColor: bg }}>
          <p className="text-[22px] font-semibold" style={{ color: fg }}>
            {TR[lang].previewLarge}
          </p>
          <p className="text-[14px]" style={{ color: fg }}>
            {TR[lang].previewNormal}
          </p>
        </div>

        {/* Results */}
        {ratio !== null && (
          <div className="border-t border-line bg-bg-1 px-[14px] py-[14px]">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="font-mono text-[28px] text-fg font-semibold">{ratio.toFixed(2)}</span>
              <span className="font-mono text-[13px] text-dim">: 1</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {checks && (
                <>
                  <Badge pass={checks.aaText}   label="AA text" />
                  <Badge pass={checks.aaLarge}   label="AA large" />
                  <Badge pass={checks.aaaText}  label="AAA text" />
                  <Badge pass={checks.aaaLarge} label="AAA large" />
                </>
              )}
            </div>
            <p className="font-mono text-[11px] text-dim mt-3">
              WCAG 2.1 · AA ≥ 4.5 (text) / ≥ 3 (large) · AAA ≥ 7 (text) / ≥ 4.5 (large)
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
