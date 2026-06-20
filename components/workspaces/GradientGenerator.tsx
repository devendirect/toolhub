"use client";

import { useState, useMemo } from "react";
import { useCopy } from "@/hooks/useCopy";
import { useLang } from "@/components/providers/I18nProvider";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { useTrackRun } from "@/hooks/useTrackRun";

const AFFILIATE_CANVA = process.env.NEXT_PUBLIC_AFFILIATE_CANVA;

const TR = {
  fr: {
    colorStops: "// couleurs",
    addStop:    "ajouter",
    copyValue:  "cliquer pour copier la valeur",
  },
  en: {
    colorStops: "// color stops",
    addStop:    "add stop",
    copyValue:  "click to copy value",
  },
} as const;

type GType = "linear" | "radial" | "conic";

interface Stop { color: string; pos: number; }

const DEFAULTS: Stop[] = [
  { color: "#00e08a", pos: 0 },
  { color: "#7c5cff", pos: 100 },
];

function buildCss(type: GType, angle: number, stops: Stop[]): string {
  const stopsStr = stops.map((s) => `${s.color} ${s.pos}%`).join(", ");
  switch (type) {
    case "linear": return `linear-gradient(${angle}deg, ${stopsStr})`;
    case "radial":  return `radial-gradient(circle, ${stopsStr})`;
    case "conic":   return `conic-gradient(from ${angle}deg, ${stopsStr})`;
  }
}

export function GradientGenerator() {
  const { lang } = useLang();
  const [type, setType] = useState<GType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>(DEFAULTS);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("gradient-generator", "design");

  const gradient = useMemo(() => buildCss(type, angle, stops), [type, angle, stops]);

  const updateStop = (stopIdx: number, patch: Partial<Stop>) =>
    setStops((prev) => prev.map((s, idx) => (idx === stopIdx ? { ...s, ...patch } : s)));

  const addStop = () => {
    if (stops.length >= 5) return;
    const penultimate = stops[stops.length - 2];
    const last = stops[stops.length - 1];
    const mid = Math.round(((penultimate?.pos ?? 0) + (last?.pos ?? 100)) / 2);
    setStops((prev) => {
      const tail = prev[prev.length - 1];
      return [...prev.slice(0, -1), { color: "#ffffff", pos: mid }, ...(tail ? [tail] : [])];
    });
  };

  const removeStop = (idx: number) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((_, j) => j !== idx));
  };

  const handleCopyCss = () => { trackRun(); copy(`background: ${gradient};`, "__css__"); };

  const handleCopyValue = () => { trackRun(); copy(gradient, "__value__"); };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleCopyCss}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
          >
            {copied ? "✓ copié" : "copy CSS ⏎"}
          </button>
        }
      >
        <OptBlock label="type">
          <SegControl options={["linear", "radial", "conic"] as GType[]} value={type} onChange={(v) => setType(v as GType)} />
        </OptBlock>
        {(type === "linear" || type === "conic") && (
          <OptBlock label={`angle — ${angle}°`}>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0} max={360} value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-[120px] accent-[var(--brand)]"
              />
              <input
                type="number"
                min={0} max={360} value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-[52px] font-mono text-[12px] bg-bg border border-line px-2 py-[3px] text-fg outline-none focus:border-brand-mid"
              />
            </div>
          </OptBlock>
        )}
      </OptionsBar>

      {/* Preview */}
      <div
        className="h-[200px] w-full border-x border-line"
        style={{ background: gradient }}
      />

      {/* Color stops */}
      <div className="border border-line border-t-0 bg-bg-1">
        <div className="flex items-center gap-3 px-[14px] py-[10px] border-b border-line">
          <span className="font-mono text-[11px] text-dim">{TR[lang].colorStops}</span>
          <button
            onClick={addStop}
            disabled={stops.length >= 5}
            className="ml-auto font-mono text-[11px] text-dim hover:text-brand transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            + {TR[lang].addStop}
          </button>
        </div>

        <div className="divide-y divide-line">
          {stops.map((stop, idx) => (
            <div key={idx} className="flex items-center gap-4 px-[14px] py-[10px]">
              <span className="font-mono text-[11px] text-dim-2 w-5">{String(idx + 1).padStart(2, "0")}</span>
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(idx, { color: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-line-2 bg-transparent shrink-0"
              />
              <span className="font-mono text-[13px] text-fg w-20 shrink-0">{stop.color}</span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="range"
                  min={0} max={100} value={stop.pos}
                  onChange={(e) => updateStop(idx, { pos: Number(e.target.value) })}
                  className="flex-1 accent-[var(--brand)]"
                />
                <input
                  type="number"
                  min={0} max={100} value={stop.pos}
                  onChange={(e) => updateStop(idx, { pos: Number(e.target.value) })}
                  className="w-[52px] font-mono text-[12px] bg-bg border border-line px-2 py-[3px] text-fg outline-none focus:border-brand-mid"
                />
                <span className="font-mono text-[12px] text-dim">%</span>
              </div>
              <button
                onClick={() => removeStop(idx)}
                disabled={stops.length <= 2}
                className="font-mono text-[12px] text-dim hover:text-danger transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >✕</button>
            </div>
          ))}
        </div>

        {/* CSS output */}
        <div className="border-t border-line bg-bg-code px-[14px] py-[12px]">
          <div className="flex items-start justify-between gap-4">
            <pre
              className="font-mono text-[12px] text-fg-1 leading-[1.6] flex-1 cursor-pointer hover:text-brand transition-colors"
              onClick={handleCopyValue}
            >
              <span className="text-dim">background: </span>
              <span className="text-brand">{gradient}</span>
              <span className="text-dim">;</span>
            </pre>
          </div>
          <div className="font-mono text-[11px] text-dim-2 mt-2">
            {TR[lang].copyValue} · {stops.length} stops
          </div>
        </div>
      </div>

      {AFFILIATE_CANVA && (
        <div className="mt-4 p-4 border border-line bg-bg-1 flex items-start gap-4">
          <span className="font-mono text-[20px] shrink-0">◐</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">
              {lang === "fr" ? "utiliser ce dégradé" : "use this gradient"}
            </span>
            <p className="text-[13px] text-fg-1">
              {lang === "fr"
                ? "Transposez votre dégradé dans un design professionnel avec Canva."
                : "Take your gradient into a professional design with Canva."}
            </p>
            <a
              href={AFFILIATE_CANVA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-brand hover:underline"
            >
              {lang === "fr" ? "Essayer Canva Pro gratuitement →" : "Try Canva Pro for free →"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
