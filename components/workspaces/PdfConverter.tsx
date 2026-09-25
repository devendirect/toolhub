"use client";

import { useState, useRef } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { fmtSize } from "@/lib/format";
import { downloadUrl } from "@/lib/download";
import { useConversionState } from "@/hooks/useConversionState";
import { useTrackRun } from "@/hooks/useTrackRun";

type Status = "idle" | "loading" | "converting" | "done" | "error";
type Mode = "pdf-to-images" | "images-to-pdf";
type ImgFormat = "png" | "jpeg";

interface PageResult { url: string; page: number; size: number; }

const TR = {
  fr: {
    dropPdf:           "déposer un PDF ou cliquer",
    dropImages:        "déposer des images ou cliquer",
    imagesSelected:    "image(s) sélectionnée(s)",
    convertingPage:    "conversion page",
    convertToImages:   "convertir en images",
    processingImage:   "traitement image",
    createPdf:         "créer le PDF",
    pagesExtracted:    "pages extraites",
    downloadAll:       "tout télécharger ↓",
    downloadArrow:     "télécharger ↓",
    passwordProtected: "Ce PDF est protégé par un mot de passe. Ouvrez-le dans votre lecteur PDF et enregistrez une copie sans protection, puis réessayez.",
  },
  en: {
    dropPdf:           "drop a PDF or click",
    dropImages:        "drop images or click",
    imagesSelected:    "image(s) selected",
    convertingPage:    "converting page",
    convertToImages:   "convert to images",
    processingImage:   "processing image",
    createPdf:         "create PDF",
    pagesExtracted:    "pages extracted",
    downloadAll:       "download all ↓",
    downloadArrow:     "download ↓",
    passwordProtected: "This PDF is password-protected. Open it in your PDF reader, save a copy without protection, then try again.",
  },
} as const;

interface PdfConverterProps {
  // Pré-configuration pour les pages /convert/[pair]
  initialMode?: Mode;
  initialImgFormat?: ImgFormat;
}

export function PdfConverter({ initialMode, initialImgFormat }: PdfConverterProps = {}) {
  const { lang } = useLang();
  const i = t(lang);
  const [mode, setMode] = useState<Mode>(initialMode ?? "pdf-to-images");
  const [imgFormat, setImgFormat] = useState<ImgFormat>(initialImgFormat ?? "png");
  const [scale, setScale] = useState(2);
  const [file, setFile]   = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const { status, setStatus, error, outputUrl, outputSize, fail, succeed, reset } =
    useConversionState<Status>("idle");
  const [pages, setPages]     = useState<PageResult[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const pdfRef  = useRef<HTMLInputElement>(null);
  const imgRef  = useRef<HTMLInputElement>(null);
  const trackRun = useTrackRun("pdf-converter", "file");
  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => ref.current?.click();

  const handlePdf = (f: File) => {
    setFile(f);
    setPages([]);
    reset();
  };

  const handleImages = (files: FileList | null) => {
    if (!files) return;
    setImages(Array.from(files));
    reset();
  };

  /* PDF → Images */
  const convertPdfToImages = async () => {
    if (!file) return;
    trackRun();
    setStatus("loading");
    setPages([]);
    setCurrent(0);

    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      // Servi par le site (copié au build par scripts/copy-pdf-worker.mjs), plus par unpkg.com
      GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      setStatus("converting");

      const results: PageResult[] = [];
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        setCurrent(pageNum);
        const page     = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        const canvas   = document.createElement("canvas");
        canvas.width   = viewport.width;
        canvas.height  = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context unavailable");

        if (imgFormat === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const blob = await new Promise<Blob>((res, rej) =>
          canvas.toBlob((b) => b ? res(b) : rej(new Error("toBlob failed")), `image/${imgFormat}`, 0.92)
        );
        results.push({
          url:  URL.createObjectURL(blob),
          page: pageNum,
          size: blob.size,
        });
      }

      setPages(results);
      setStatus("done");
    } catch (e) {
      // PDF.js lève une PasswordException en anglais : on la remplace par un message utile
      fail(e instanceof Error && e.name === "PasswordException" ? new Error(TR[lang].passwordProtected) : e);
    }
  };

  /* Images → PDF */
  const convertImagesToPdf = async () => {
    if (images.length === 0) return;
    setStatus("loading");
    setCurrent(0);

    try {
      const { PDFDocument } = await import("pdf-lib");
      setStatus("converting");

      const pdf = await PDFDocument.create();

      for (const [idx, img] of images.entries()) {
        setCurrent(idx + 1);
        const bytes  = await img.arrayBuffer();
        const isJpeg = img.type === "image/jpeg" || img.name.match(/\.jpe?g$/i);

        let embedded;
        if (isJpeg) {
          embedded = await pdf.embedJpg(bytes);
        } else {
          // convert to PNG via canvas if not already PNG
          if (img.type === "image/png" || img.name.match(/\.png$/i)) {
            embedded = await pdf.embedPng(bytes);
          } else {
            const bmp = await createImageBitmap(img);
            const canvas = document.createElement("canvas");
            canvas.width = bmp.width; canvas.height = bmp.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context unavailable");
            ctx.drawImage(bmp, 0, 0);
            const pngBlob = await new Promise<Blob>((res, rej) =>
              canvas.toBlob((b) => b ? res(b) : rej(new Error("toBlob failed")), "image/png")
            );
            embedded = await pdf.embedPng(await pngBlob.arrayBuffer());
          }
        }

        const page = pdf.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
      }

      const pdfBytes = await pdf.save();
      const blob     = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      succeed(URL.createObjectURL(blob), blob.size);
    } catch (e) {
      fail(e);
    }
  };

  const downloadAll = () => {
    pages.forEach(({ url, page }) => {
      downloadUrl(url, `${file?.name.replace(/\.pdf$/i, "") ?? "page"}_p${page}.${imgFormat}`);
    });
  };

  const downloadPdf = () => {
    if (!outputUrl) return;
    downloadUrl(outputUrl, "converted.pdf");
  };

  const busy = status === "loading" || status === "converting";

  return (
    <section className="mb-10">
      <div className="flex border border-line border-b-0">
        {(["pdf-to-images", "images-to-pdf"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setPages([]); reset(); }}
            className={`flex-1 font-mono text-[12px] px-4 py-[10px] border-r last:border-r-0 border-line transition-colors ${mode === m ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}
          >
            {m === "pdf-to-images" ? "PDF → images" : "images → PDF"}
          </button>
        ))}
      </div>

      {mode === "pdf-to-images" && (
        <>
          <div
            className="border border-line border-dashed flex flex-col items-center justify-center gap-3 py-14 cursor-pointer hover:bg-bg-1 transition-colors"
            onClick={() => openPicker(pdfRef)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handlePdf(f); }}
          >
            <span className="font-mono text-[28px] text-dim">▣</span>
            <span className="font-mono text-[12px] text-dim">
              {file ? `${file.name} — ${fmtSize(file.size)}` : TR[lang].dropPdf}
            </span>
          </div>
          <input ref={pdfRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePdf(f); }} />

          <div className="flex gap-0 border border-line border-t-0">
            <div className="flex items-center border-r border-line">
              <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1">format</span>
              {(["png", "jpeg"] as ImgFormat[]).map((f) => (
                <button key={f} onClick={() => setImgFormat(f)}
                  className={`font-mono text-[11px] px-3 py-[10px] border-r border-line transition-colors ${imgFormat === f ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center">
              <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1">
                {i.quality}
              </span>
              {[1, 2, 3].map((s) => (
                <button key={s} onClick={() => setScale(s)}
                  className={`font-mono text-[11px] px-3 py-[10px] border-r border-line transition-colors ${scale === s ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}>
                  {s === 1 ? "1×" : s === 2 ? "2× (HD)" : "3× (UHD)"}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-line border-t-0 p-4 flex flex-col gap-4">
            <button onClick={convertPdfToImages} disabled={!file || busy}
              className="w-full py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold hover:brightness-110 transition-all disabled:opacity-40">
              {busy
                ? `${TR[lang].convertingPage} ${current}${pageCount ? `/${pageCount}` : ""}…`
                : TR[lang].convertToImages}
            </button>

            {busy && (
              <div className="w-full h-1 bg-bg-2 rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full transition-all"
                  style={{ width: pageCount ? `${(current / pageCount) * 100}%` : "10%" }} />
              </div>
            )}

            {error && <p className="font-mono text-[12px] text-danger">✕ {error}</p>}

            {pages.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[12px] text-dim">{pages.length} {TR[lang].pagesExtracted}</span>
                  <button onClick={downloadAll}
                    className="font-mono text-[12px] text-brand px-4 py-2 border border-brand hover:brightness-110 transition-all">
                    {TR[lang].downloadAll}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {pages.map(({ url, page, size }) => (
                    <a key={page} href={url} download={`page_${page}.${imgFormat}`}
                      className="group border border-line hover:border-brand transition-colors overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Page ${page}`} className="w-full object-contain bg-bg-2" />
                      <div className="px-2 py-1 font-mono text-[10px] text-dim flex justify-between">
                        <span>p.{page}</span><span>{fmtSize(size)}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {mode === "images-to-pdf" && (
        <>
          <div
            className="border border-line border-dashed flex flex-col items-center justify-center gap-3 py-14 cursor-pointer hover:bg-bg-1 transition-colors"
            onClick={() => openPicker(imgRef)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleImages(e.dataTransfer.files); }}
          >
            <span className="font-mono text-[28px] text-dim">⊞</span>
            <span className="font-mono text-[12px] text-dim">
              {images.length > 0
                ? `${images.length} ${TR[lang].imagesSelected}`
                : TR[lang].dropImages}
            </span>
            <span className="font-mono text-[11px] text-dim-2">PNG, JPEG, WEBP, GIF…</span>
          </div>
          <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImages(e.target.files)} />

          {images.length > 0 && (
            <div className="border border-line border-t-0 divide-y divide-line max-h-40 overflow-y-auto">
              {images.map((img, idx) => (
                <div key={img.name + idx} className="flex items-center justify-between px-3 py-[7px] font-mono text-[11px]">
                  <span className="text-dim w-6 shrink-0">{idx + 1}</span>
                  <span className="text-fg flex-1 truncate">{img.name}</span>
                  <span className="text-dim-2 ml-3">{fmtSize(img.size)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border border-line border-t-0 p-4 flex flex-col gap-4">
            <button onClick={convertImagesToPdf} disabled={images.length === 0 || busy}
              className="w-full py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold hover:brightness-110 transition-all disabled:opacity-40">
              {busy
                ? `${TR[lang].processingImage} ${current}/${images.length}…`
                : TR[lang].createPdf}
            </button>

            {busy && (
              <div className="w-full h-1 bg-bg-2 rounded-full overflow-hidden">
                <div className="h-full bg-brand rounded-full transition-all"
                  style={{ width: `${(current / images.length) * 100}%` }} />
              </div>
            )}

            {error && <p className="font-mono text-[12px] text-danger">✕ {error}</p>}

            {status === "done" && outputUrl && (
              <div className="flex items-center justify-between border border-line px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[12px] text-fg">converted.pdf</span>
                  <span className="font-mono text-[11px] text-dim">{fmtSize(outputSize)} · {images.length} pages</span>
                </div>
                <button onClick={downloadPdf}
                  className="font-mono text-[12px] text-brand px-4 py-2 border border-brand hover:brightness-110 transition-all">
                  {TR[lang].downloadArrow}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex items-center gap-4 px-[14px] py-2 border border-line border-t-0 bg-bg font-mono text-[11px] text-dim">
        <span className="inline-block w-[6px] h-[6px] rounded-full bg-brand mr-1" />
        {i.localConversion}
      </div>
    </section>
  );
}
