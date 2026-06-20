"use client";

import { useState, useRef, useCallback } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { fmtSize } from "@/lib/format";
import { downloadUrl } from "@/lib/download";

type Format = "image/jpeg" | "image/png" | "image/webp";
const FORMAT_EXT: Record<Format, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const EXT_TO_FORMAT: Record<string, Format> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const TR = {
  fr: {
    browse:             "choisir",
    noFile:             "aucun fichier",
    dropImage:          "glisser une image ou cliquer",
    converted:          "converti",
    lossless:           "sans perte",
    resultAfterConvert: "résultat après conversion",
    canvasNotSupported: "Canvas non supporté",
    conversionFailed:   "Échec de la conversion",
    couldNotLoad:       "Impossible de charger l'image",
  },
  en: {
    browse:             "browse",
    noFile:             "no file",
    dropImage:          "drag an image or click",
    converted:          "converted",
    lossless:           "lossless",
    resultAfterConvert: "result after convert",
    canvasNotSupported: "Canvas not supported",
    conversionFailed:   "Conversion failed",
    couldNotLoad:       "Could not load image",
  },
} as const;

export function ImageConverter() {
  const { lang } = useLang();
  const i = t(lang);

  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [outputSize, setOutputSize] = useState<number>(0);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [format, setFormat] = useState<Format>("image/webp");
  const [quality, setQuality] = useState<80 | 90 | 100>(80);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((f: File) => {
    setFile(f);
    setOutputUrl("");
    setError(null);
    const url = URL.createObjectURL(f);
    setOriginalUrl(url);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) loadFile(f);
  };

  const handleConvert = () => {
    if (!file) return;
    setConverting(true);
    setError(null);
    const img = new Image();
    img.onload = () => {
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setError(TR[lang].canvasNotSupported); setConverting(false); return; }
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) { setError(TR[lang].conversionFailed); setConverting(false); return; }
          setOutputUrl(URL.createObjectURL(blob));
          setOutputSize(blob.size);
          setConverting(false);
        },
        format,
        quality / 100
      );
    };
    img.onerror = () => { setError(TR[lang].couldNotLoad); setConverting(false); };
    img.src = originalUrl;
  };

  const handleDownload = () => {
    if (!outputUrl || !file) return;
    downloadUrl(outputUrl, file.name.replace(/\.[^.]+$/, "") + "." + FORMAT_EXT[format]);
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={handleConvert}
            disabled={!file || converting}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {converting ? i.converting : i.convertBtn}
          </button>
        }
      >
        <OptBlock label="format">
          <SegControl
            options={["jpg", "png", "webp"]}
            value={FORMAT_EXT[format]}
            onChange={(v) => { const f = EXT_TO_FORMAT[v]; if (f) setFormat(f); }}
          />
        </OptBlock>
        <OptBlock label={i.quality}>
          <SegControl
            options={[80, 90, 100]}
            value={quality}
            onChange={(v) => setQuality(v as 80 | 90 | 100)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        {/* Input */}
        <Pane
          title="original"
          ext={file ? file.name.split(".").pop() ?? "img" : "img"}
          meta={file ? fmtSize(file.size) : undefined}
          actions={
            <PaneBtn onClick={() => inputRef.current?.click()}>
              {TR[lang].browse}
            </PaneBtn>
          }
          footer={
            dims
              ? <span>{dims.w} × {dims.h}px</span>
              : <span className="text-dim-2">{TR[lang].noFile}</span>
          }
          className="border-r border-line"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
          />
          <div
            className="flex-1 flex items-center justify-center bg-bg-code min-h-[320px] cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !file && inputRef.current?.click()}
          >
            {originalUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={originalUrl} alt="original" className="max-w-full max-h-[320px] object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-center p-8">
                <span className="font-mono text-[28px] text-dim">▣→▢</span>
                <span className="font-mono text-[12px] text-dim">
                  {TR[lang].dropImage}
                </span>
                <span className="font-mono text-[11px] text-dim-2">JPG · PNG · WebP · GIF · BMP</span>
              </div>
            )}
          </div>
        </Pane>

        {/* Output */}
        <Pane
          title={TR[lang].converted}
          ext={FORMAT_EXT[format]}
          meta={outputSize ? fmtSize(outputSize) : undefined}
          actions={
            <PaneBtn onClick={handleDownload} disabled={!outputUrl}>{i.download}</PaneBtn>
          }
          footer={
            error ? (
              <span className="text-danger">✕ {error}</span>
            ) : outputUrl && file ? (
              <span>
                {FORMAT_EXT[format].toUpperCase()} · {quality === 100 ? TR[lang].lossless : `q${quality}`} ·{" "}
                {outputSize < file.size
                  ? <span className="text-brand">-{(((file.size - outputSize) / file.size) * 100).toFixed(0)}%</span>
                  : <span className="text-hot">+{(((outputSize - file.size) / file.size) * 100).toFixed(0)}%</span>}
              </span>
            ) : undefined
          }
        >
          <div className="flex-1 flex items-center justify-center bg-bg-code min-h-[320px]">
            {outputUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={outputUrl} alt="converted" className="max-w-full max-h-[320px] object-contain" />
            ) : (
              <span className="font-mono text-[12px] text-dim">
                {"// "}{TR[lang].resultAfterConvert}
              </span>
            )}
          </div>
        </Pane>
      </div>
    </section>
  );
}
