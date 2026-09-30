"use client";

import { useState, useRef, useCallback } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";
import { fmtSize } from "@/lib/format";
import { downloadUrl } from "@/lib/download";
import { useTrackRun } from "@/hooks/useTrackRun";
import { IMAGE_ACCEPT, isHeicFile, isImageFile, decodeIfHeic } from "@/lib/heic";

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
    couldNotLoad:       "Impossible de charger l'image (format non lu par ce navigateur ?)",
    decodingHeic:       "lecture de la photo HEIC…",
    heicFailed:         "Photo HEIC illisible (fichier endommagé ou variante non prise en charge)",
    maxWidth:           "largeur max",
    original:           "originale",
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
    couldNotLoad:       "Could not load image (format not readable by this browser?)",
    decodingHeic:       "reading the HEIC photo…",
    heicFailed:         "Unreadable HEIC photo (damaged file or unsupported variant)",
    maxWidth:           "max width",
    original:           "original",
  },
} as const;

/** Largeurs cibles proposées ; 0 = taille d'origine. On réduit, on n'agrandit jamais. */
const MAX_WIDTHS = [0, 1920, 1280, 800] as const;
type MaxWidth = (typeof MAX_WIDTHS)[number];

export function targetSize(w: number, h: number, maxWidth: number): { w: number; h: number } {
  if (!maxWidth || w <= maxWidth) return { w, h };
  return { w: maxWidth, h: Math.round((h * maxWidth) / w) };
}

interface ImageConverterProps {
  // Format cible pré-sélectionné (pages /convert/[pair])
  initialFormat?: "jpg" | "png" | "webp";
}

export function ImageConverter({ initialFormat }: ImageConverterProps = {}) {
  const { lang } = useLang();
  const i = t(lang);

  // `source` : le fichier déposé (nom, taille, extension affichés) ;
  // `file` : ce que le canvas lit — le même, ou sa version décodée si HEIC.
  const [source, setSource] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [decoding, setDecoding] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [outputSize, setOutputSize] = useState<number>(0);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [format, setFormat] = useState<Format>(
    (initialFormat && EXT_TO_FORMAT[initialFormat]) || "image/webp"
  );
  const [quality, setQuality] = useState<80 | 90 | 100>(80);
  const [maxWidth, setMaxWidth] = useState<MaxWidth>(0);
  const [outDims, setOutDims] = useState<{ w: number; h: number } | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const trackRun = useTrackRun("image-converter", "file");

  const loadId = useRef(0);
  const loadFile = useCallback(async (picked: File) => {
    const id = ++loadId.current;
    setSource(picked);
    setDecoding(false);
    setFile(null);
    setDims(null);
    setOutDims(null);
    setError(null);
    // Libère les images précédentes : chaque object URL garde le fichier en mémoire
    setOutputUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return ""; });
    setOriginalUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return ""; });
    let f = picked;
    if (isHeicFile(picked)) {
      setDecoding(true);
      try {
        f = await decodeIfHeic(picked);
      } catch {
        if (id === loadId.current) { setError(TR[lang].heicFailed); setDecoding(false); }
        return;
      }
      if (id !== loadId.current) return;
      setDecoding(false);
    }
    setOriginalUrl(URL.createObjectURL(f));
    setFile(f);
  }, [lang]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && isImageFile(f)) loadFile(f);
  };

  const handleConvert = () => {
    if (!file) return;
    trackRun();
    setConverting(true);
    setError(null);
    const img = new Image();
    img.onload = () => {
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
      const out = targetSize(img.naturalWidth, img.naturalHeight, maxWidth);
      const canvas = document.createElement("canvas");
      canvas.width = out.w;
      canvas.height = out.h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { setError(TR[lang].canvasNotSupported); setConverting(false); return; }
      ctx.imageSmoothingQuality = "high";
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, out.w, out.h);
      canvas.toBlob(
        (blob) => {
          if (!blob) { setError(TR[lang].conversionFailed); setConverting(false); return; }
          setOutputUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
          setOutputSize(blob.size);
          setOutDims(out);
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
    if (!outputUrl || !source) return;
    downloadUrl(outputUrl, source.name.replace(/\.[^.]+$/, "") + "." + FORMAT_EXT[format]);
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
        <OptBlock label={TR[lang].maxWidth}>
          <SegControl
            options={[...MAX_WIDTHS]}
            value={maxWidth}
            onChange={(v) => setMaxWidth(v as MaxWidth)}
            labels={{ 0: TR[lang].original }}
          />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        {/* Input */}
        <Pane
          title="original"
          ext={source ? source.name.split(".").pop() ?? "img" : "img"}
          meta={source ? fmtSize(source.size) : undefined}
          actions={
            <PaneBtn onClick={() => inputRef.current?.click()}>
              {TR[lang].browse}
            </PaneBtn>
          }
          footer={
            decoding
              ? <span className="text-dim">{TR[lang].decodingHeic}</span>
              : dims
              ? <span>{dims.w} × {dims.h}px</span>
              : <span className="text-dim-2">{source ? source.name : TR[lang].noFile}</span>
          }
          className="border-r border-line"
        >
          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
          />
          <div
            className="flex-1 flex items-center justify-center bg-bg-code min-h-[320px] cursor-pointer"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => !source && inputRef.current?.click()}
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
                <span className="font-mono text-[11px] text-dim-2">JPG · PNG · WebP · AVIF · HEIC · GIF · BMP</span>
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
            ) : outputUrl && source ? (
              <span>
                {FORMAT_EXT[format].toUpperCase()} · {format === "image/png" ? TR[lang].lossless : `q${quality}`} ·{" "}
                {outDims && <>{outDims.w} × {outDims.h}px · </>}
                {outputSize < source.size
                  ? <span className="text-brand">-{(((source.size - outputSize) / source.size) * 100).toFixed(0)}%</span>
                  : <span className="text-hot">+{(((outputSize - source.size) / source.size) * 100).toFixed(0)}%</span>}
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
