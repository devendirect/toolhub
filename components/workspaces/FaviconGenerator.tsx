"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { downloadBlob, downloadUrl } from "@/lib/download";
import { useTrackRun } from "@/hooks/useTrackRun";

const AFFILIATE_CANVA = process.env.NEXT_PUBLIC_AFFILIATE_CANVA;

type Size = 16 | 32 | 48 | 64;
const SIZES: Size[] = [16, 32, 48, 64];

const PRESETS = ["#00e08a", "#7c5cff", "#f59e0b", "#ef4444", "#3b82f6", "#1a1a1a"];

const TR = {
  fr: {
    textLabel:  "texte",
    background: "fond",
    weight:     "graisse",
  },
  en: {
    textLabel:  "text",
    background: "background",
    weight:     "weight",
  },
} as const;

export function FaviconGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("A");
  const [bg, setBg] = useState("#00e08a");
  const [fg, setFg] = useState("#ffffff");
  const [size, setSize] = useState<Size>(32);
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("bold");
  const trackRun = useTrackRun("favicon-generator", "design");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = fg;
    ctx.font = `${fontWeight} ${Math.round(size * 0.6)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.slice(0, 2), size / 2, size / 2 + 1);
  }, [text, bg, fg, size, fontWeight]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackRun();
    downloadUrl(canvas.toDataURL("image/png"), `favicon-${size}x${size}.png`);
  };

  const downloadIco = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackRun();
    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadBlob(blob, "favicon.ico");
    }, "image/png");
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <div className="flex gap-2">
            <button
              onClick={downloadIco}
              className="px-[14px] py-2 font-mono text-[12px] text-dim border border-line rounded-[3px] hover:text-brand hover:border-brand-mid transition-colors"
            >
              .ico
            </button>
            <button
              onClick={downloadPng}
              className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
            >
              .png ↓
            </button>
          </div>
        }
      >
        <OptBlock label={i.sizeOpt}>
          <SegControl
            options={SIZES}
            value={size}
            onChange={(v) => setSize(v as Size)}
          />
        </OptBlock>
        <OptBlock label={TR[lang].weight}>
          <SegControl
            options={["bold", "normal"]}
            value={fontWeight}
            onChange={(v) => setFontWeight(v as typeof fontWeight)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line">
        {/* Text input */}
        <div className="flex items-center gap-0 border-b border-line">
          <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">
            {TR[lang].textLabel}
          </span>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2}
            placeholder="A"
            className="flex-1 bg-transparent font-mono text-[16px] text-fg px-4 py-[9px] outline-none placeholder:text-dim-2"
          />
        </div>

        {/* Color pickers */}
        <div className="grid grid-cols-2 border-b border-line divide-x divide-line">
          {[
            { label: TR[lang].background, value: bg, onChange: setBg },
            { label: TR[lang].textLabel, value: fg, onChange: setFg },
          ].map(({ label, value, onChange }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-[10px]">
              <span className="font-mono text-[11px] text-dim w-20 shrink-0">{label}</span>
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-line bg-transparent shrink-0"
              />
              <span className="font-mono text-[12px] text-fg uppercase">{value}</span>
            </div>
          ))}
        </div>

        {/* Presets */}
        <div className="flex items-center gap-3 px-4 py-[10px] border-b border-line">
          <span className="font-mono text-[11px] text-dim shrink-0">presets</span>
          {PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => setBg(color)}
              className="w-6 h-6 rounded-[3px] border-2 transition-all"
              style={{
                backgroundColor: color,
                borderColor: bg === color ? "white" : "transparent",
              }}
            />
          ))}
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center gap-8 py-10 bg-bg-1">
          {SIZES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <canvas
                ref={s === size ? canvasRef : undefined}
                width={s}
                height={s}
                className="border border-line"
                style={{ width: s * (s < 32 ? 3 : 2), height: s * (s < 32 ? 3 : 2), imageRendering: "pixelated" }}
              />
              <span className="font-mono text-[10px] text-dim">{s}px</span>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 bg-bg font-mono text-[11px] text-dim border-t border-line">
          {i.localCanvas}
        </div>
      </div>

      {AFFILIATE_CANVA && (
        <div className="mt-4 p-4 border border-line bg-bg-1 flex items-start gap-4">
          <span className="font-mono text-[20px] shrink-0">◐</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">
              {lang === "fr" ? "votre branding complet" : "your full branding"}
            </span>
            <p className="text-[13px] text-fg-1">
              {lang === "fr"
                ? "Favicon créé — allez plus loin avec un logo et une identité visuelle complète sur Canva."
                : "Favicon created — go further with a full logo and visual identity on Canva."}
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
