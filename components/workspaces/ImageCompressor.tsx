"use client";

import { useState, useRef, useCallback } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { fmtSize } from "@/lib/format";
import { downloadUrl } from "@/lib/download";

type Format = "image/webp" | "image/jpeg" | "image/png";
const FORMAT_LABELS: Record<Format, string> = {
  "image/webp":  "WebP",
  "image/jpeg":  "JPEG",
  "image/png":   "PNG",
};

const TR = {
  fr: {
    dropImage: "déposez une image ou cliquez",
    saved:     "économisé",
    larger:    "plus lourd",
    reset:     "recommencer",
  },
  en: {
    dropImage: "drop an image or click",
    saved:     "saved",
    larger:    "larger",
    reset:     "reset",
  },
} as const;

export function ImageCompressor() {
  const { lang } = useLang();
  const i = t(lang);
  const inputRef = useRef<HTMLInputElement>(null);
  const [format, setFormat] = useState<Format>("image/webp");
  const [quality, setQuality] = useState(80);
  const [original, setOriginal] = useState<{ name: string; size: number; url: string } | null>(null);
  const [result, setResult] = useState<{ size: number; url: string; blob: Blob } | null>(null);
  const [loading, setLoading] = useState(false);

  const compress = useCallback((file: File, fmt: Format, q: number) => {
    setLoading(true);
    setResult(null);
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setLoading(false); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) { setLoading(false); return; }
          setResult({ size: blob.size, url: URL.createObjectURL(blob), blob });
          setLoading(false);
        },
        fmt,
        fmt === "image/png" ? undefined : q / 100
      );
    };
    img.src = objectUrl;
  }, []);

  const handleFile = (file: File) => {
    setOriginal({ name: file.name, size: file.size, url: URL.createObjectURL(file) });
    compress(file, format, quality);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleFile(file);
  };

  const handleDownload = () => {
    if (!result || !original) return;
    const ext = format === "image/webp" ? "webp" : format === "image/jpeg" ? "jpg" : "png";
    downloadUrl(result.url, original.name.replace(/\.[^.]+$/, `.${ext}`));
  };

  const saving = original && result
    ? Math.round((1 - result.size / original.size) * 100)
    : null;

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleDownload}
            disabled={!result}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40"
          >
            {i.download} ↓
          </button>
        }
      >
        <OptBlock label="format">
          <SegControl
            options={["image/webp", "image/jpeg", "image/png"] as Format[]}
            value={format}
            onChange={(v) => {
              const f = v as Format;
              setFormat(f);
              if (original) {
                const input = inputRef.current;
                if (input?.files?.[0]) compress(input.files[0], f, quality);
              }
            }}
          />
        </OptBlock>
        {format !== "image/png" && (
          <OptBlock label={`${i.quality} — ${quality}%`}>
            <input
              type="range"
              min={10} max={100} value={quality}
              onChange={(e) => {
                const q = Number(e.target.value);
                setQuality(q);
                if (original) {
                  const input = inputRef.current;
                  if (input?.files?.[0]) compress(input.files[0], format, q);
                }
              }}
              className="w-[100px] accent-[var(--brand)]"
            />
          </OptBlock>
        )}
      </OptionsBar>

      <div className="border border-line">
        {/* Drop zone */}
        {!original && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 py-20 cursor-pointer hover:bg-bg-2 transition-colors"
          >
            <span className="font-mono text-[28px] text-dim">▣↓</span>
            <span className="font-mono text-[13px] text-fg">
              {TR[lang].dropImage}
            </span>
            <span className="font-mono text-[11px] text-dim">JPG · PNG · WebP · AVIF</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {/* Results */}
        {original && (
          <>
            <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
              {[
                { label: "original", url: original.url, size: original.size },
                { label: FORMAT_LABELS[format], url: result?.url, size: result?.size },
              ].map(({ label, url, size }, idx) => (
                <div key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[11px] text-dim">{label}</span>
                    <span className="font-mono text-[11px] text-fg">{size !== undefined ? fmtSize(size) : "…"}</span>
                  </div>
                  {url && (
                    <img
                      src={url}
                      alt={label}
                      className="max-h-[200px] w-full object-contain border border-line bg-bg-1"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 px-[14px] py-[10px] bg-bg-1">
              {loading && <span className="font-mono text-[12px] text-dim">{i.compressing}</span>}
              {saving !== null && !loading && (
                <span className={`font-mono text-[13px] font-semibold ${saving > 0 ? "text-ok" : "text-danger"}`}>
                  {saving > 0 ? `−${saving}%` : `+${Math.abs(saving)}%`}
                  <span className="text-dim font-normal ml-2">
                    {saving > 0 ? TR[lang].saved : TR[lang].larger}
                  </span>
                </span>
              )}
              <button
                onClick={() => { setOriginal(null); setResult(null); if (inputRef.current) inputRef.current.value = ""; }}
                className="ml-auto font-mono text-[11px] text-dim hover:text-danger transition-colors"
              >
                {TR[lang].reset}
              </button>
            </div>
          </>
        )}

        <div className="px-[14px] py-2 bg-bg font-mono text-[11px] text-dim border-t border-line">
          {i.localProcessing}
        </div>
      </div>
    </section>
  );
}
