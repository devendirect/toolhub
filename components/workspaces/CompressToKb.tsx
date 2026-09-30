"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { downloadUrl } from "@/lib/download";
import { useTrackRun } from "@/hooks/useTrackRun";
import { fitToSize, KB, type FitResult } from "@/lib/target-size";

type Format = "image/jpeg" | "image/webp";
const PRESETS = [20, 50, 100, 200, 500, 1000] as const;

const TR = {
  fr: {
    target:    "cible",
    custom:    "autre",
    unit:      "Ko",
    dropImage: "déposez une image ou cliquez",
    working:   "recherche du meilleur réglage…",
    reached:   "sous la cible",
    missed:    "cible inatteignable, voici le plus petit fichier obtenu",
    already:   "déjà sous la cible : fichier d'origine conservé",
    quality:   "qualité",
    resized:   "redimensionnée",
    unitNote:  "1 Ko = 1000 octets, donc accepté aussi par les formulaires qui comptent 1024",
    reset:     "recommencer",
    error:     "image illisible par le navigateur",
  },
  en: {
    target:    "target",
    custom:    "other",
    unit:      "KB",
    dropImage: "drop an image or click",
    working:   "finding the best setting…",
    reached:   "under target",
    missed:    "target out of reach, here is the smallest file obtained",
    already:   "already under target: original file kept",
    quality:   "quality",
    resized:   "resized",
    unitNote:  "1 KB = 1000 bytes, so it also passes forms that count 1024",
    reset:     "reset",
    error:     "the browser can't read this image",
  },
} as const;

interface Source { file: File; url: string; width: number; height: number }
type Output =
  | { kind: "fit"; url: string; fit: FitResult }
  | { kind: "original" }
  | { kind: "error" };

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function canvasEncoder(img: HTMLImageElement, format: Format) {
  return (w: number, h: number, q: number) => new Promise<Blob>((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("canvas"));
    // Le JPEG n'a pas de couche alpha : fond blanc plutôt que noir
    if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), format, q);
  });
}

export function CompressToKb() {
  const { lang } = useLang();
  const i = t(lang);
  const tr = TR[lang];
  const trackRun = useTrackRun("compress-to-kb", "file");
  const inputRef = useRef<HTMLInputElement>(null);
  const runId = useRef(0);

  const [targetKb, setTargetKb] = useState(100);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [source, setSource] = useState<Source | null>(null);
  const [output, setOutput] = useState<Output | null>(null);
  const [loading, setLoading] = useState(false);

  const kb = (bytes: number) =>
    `${(bytes / KB).toLocaleString(lang, { maximumFractionDigits: 1 })} ${tr.unit}`;

  const run = useCallback(async (src: Source, target: number, fmt: Format) => {
    const id = ++runId.current;
    setLoading(true);
    setOutput(null);
    const targetBytes = target * KB;
    try {
      if (src.file.size <= targetBytes && src.file.type === fmt) {
        setOutput({ kind: "original" });
      } else {
        const img = await loadImage(src.url);
        const fit = await fitToSize(src.width, src.height, targetBytes, canvasEncoder(img, fmt));
        if (id !== runId.current) return;
        setOutput({ kind: "fit", url: URL.createObjectURL(fit.blob), fit });
      }
    } catch {
      if (id === runId.current) setOutput({ kind: "error" });
    }
    if (id === runId.current) setLoading(false);
  }, []);

  // Relance à chaque changement de réglage
  useEffect(() => {
    if (!source || !targetKb) return;
    const timer = setTimeout(() => run(source, targetKb, format), 250);
    return () => clearTimeout(timer);
  }, [source, targetKb, format, run]);

  // Libère l'aperçu précédent
  useEffect(() => () => { if (output?.kind === "fit") URL.revokeObjectURL(output.url); }, [output]);

  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      setSource({ file, url, width: img.naturalWidth, height: img.naturalHeight });
    } catch {
      setSource(null);
      setOutput({ kind: "error" });
    }
  };

  const reset = () => {
    runId.current++;
    if (source) URL.revokeObjectURL(source.url);
    setSource(null);
    setOutput(null);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!source || !output || output.kind === "error") return;
    trackRun();
    if (output.kind === "original") return downloadUrl(source.url, source.file.name);
    const ext = format === "image/jpeg" ? "jpg" : "webp";
    downloadUrl(output.url, source.file.name.replace(/\.[^.]+$/, "") + `-${targetKb}${lang === "fr" ? "ko" : "kb"}.${ext}`);
  };

  const fit = output?.kind === "fit" ? output.fit : null;
  const resultUrl = output?.kind === "fit" ? output.url : output?.kind === "original" ? source?.url : undefined;
  const resultSize = fit ? fit.blob.size : output?.kind === "original" ? source?.file.size : undefined;

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleDownload}
            disabled={!output || output.kind === "error" || loading}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40"
          >
            {i.download} ↓
          </button>
        }
      >
        <OptBlock label={tr.target}>
          <SegControl
            options={[...PRESETS]}
            value={PRESETS.includes(targetKb as (typeof PRESETS)[number]) ? targetKb : (0 as number)}
            onChange={(v) => setTargetKb(v)}
            labels={Object.fromEntries(PRESETS.map((p) => [p, p >= 1000 ? `${p / 1000} ${lang === "fr" ? "Mo" : "MB"}` : `${p}`]))}
          />
        </OptBlock>
        <OptBlock label={tr.custom}>
          <input
            type="number"
            min={5}
            max={20000}
            value={targetKb}
            onChange={(e) => setTargetKb(Math.max(0, Math.round(Number(e.target.value))))}
            aria-label={`${tr.target} (${tr.unit})`}
            className="w-[72px] px-2 py-[3px] bg-bg border border-line font-mono text-[12px] text-fg focus:border-brand-mid outline-none"
          />
          <span className="font-mono text-[11px] text-dim">{tr.unit}</span>
        </OptBlock>
        <OptBlock label="format">
          <SegControl
            options={["image/jpeg", "image/webp"] as Format[]}
            value={format}
            onChange={(v) => setFormat(v as Format)}
            labels={{ "image/jpeg": "JPG", "image/webp": "WebP" }}
          />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line">
        {!source && (
          <div
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleFile(f); }}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 py-20 cursor-pointer hover:bg-bg-2 transition-colors"
          >
            <span className="font-mono text-[28px] text-dim">▣≤</span>
            <span className="font-mono text-[13px] text-fg">{tr.dropImage}</span>
            <span className="font-mono text-[11px] text-dim">JPG · PNG · WebP · AVIF</span>
            {output?.kind === "error" && <span className="font-mono text-[12px] text-danger">{tr.error}</span>}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {source && (
          <>
            <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
              {[
                { label: "original", url: source.url, size: source.file.size, dims: `${source.width}×${source.height}` },
                { label: format === "image/jpeg" ? "JPG" : "WebP", url: resultUrl, size: resultSize, dims: fit ? `${fit.width}×${fit.height}` : undefined },
              ].map(({ label, url, size, dims }) => (
                <div key={label} className="p-4 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[11px] text-dim">{label}{dims ? ` · ${dims}` : ""}</span>
                    <span className="font-mono text-[11px] text-fg">{size !== undefined ? kb(size) : "…"}</span>
                  </div>
                  {url && <img src={url} alt={label} className="max-h-[200px] w-full object-contain border border-line bg-bg-1" />}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-[14px] py-[10px] bg-bg-1 font-mono text-[12px]">
              {loading && <span className="text-dim">{tr.working}</span>}
              {!loading && output?.kind === "original" && <span className="text-ok">✓ {tr.already}</span>}
              {!loading && output?.kind === "error" && <span className="text-danger">{tr.error}</span>}
              {!loading && fit && (
                <>
                  <span className={fit.reached ? "text-ok font-semibold" : "text-hot font-semibold"}>
                    {fit.reached ? `✓ ${kb(fit.blob.size)} ≤ ${targetKb} ${tr.unit}` : `! ${tr.missed}`}
                  </span>
                  <span className="text-dim">{tr.quality} {Math.round(fit.quality * 100)} %</span>
                  {fit.width !== source.width && (
                    <span className="text-dim">{tr.resized} {fit.width}×{fit.height}</span>
                  )}
                </>
              )}
              <button onClick={reset} className="ml-auto text-[11px] text-dim hover:text-danger transition-colors">
                {tr.reset}
              </button>
            </div>
          </>
        )}

        <div className="px-[14px] py-2 bg-bg font-mono text-[11px] text-dim border-t border-line">
          {i.localProcessing} · {tr.unitNote}
        </div>
      </div>
    </section>
  );
}
