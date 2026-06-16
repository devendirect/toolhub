"use client";

import { useState, useCallback } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { DropZoneMulti } from "@/components/workspace/DropZone";

interface PdfFile {
  id: string;
  file: File;
  pages: number | null;
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function PdfMerge() {
  const { lang } = useLang();

  const [files, setFiles] = useState<PdfFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const addFiles = useCallback(async (incoming: FileList | File[]) => {
    const arr = Array.from(incoming).filter((f) => f.type === "application/pdf");
    const { PDFDocument } = await import("pdf-lib");
    const entries: PdfFile[] = await Promise.all(
      arr.map(async (file) => {
        try {
          const buf = await file.arrayBuffer();
          const doc = await PDFDocument.load(buf);
          return { id: `${file.name}-${file.size}`, file, pages: doc.getPageCount() };
        } catch {
          return { id: `${file.name}-${file.size}`, file, pages: null };
        }
      })
    );
    setFiles((prev) => {
      const existing = new Set(prev.map((p) => p.id));
      return [...prev, ...entries.filter((e) => !existing.has(e.id))];
    });
    setDone(false);
  }, []);

  const handleRemove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    setFiles((prev) => {
      const next = [...prev];
      const a = next[idx - 1]!;
      const b = next[idx]!;
      next[idx - 1] = b;
      next[idx] = a;
      return next;
    });
  };

  const handleMoveDown = (idx: number) => {
    setFiles((prev) => {
      if (idx === prev.length - 1) return prev;
      const next = [...prev];
      const a = next[idx]!;
      const b = next[idx + 1]!;
      next[idx] = b;
      next[idx + 1] = a;
      return next;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const merged = await PDFDocument.create();
      for (const { file } of files) {
        const buf = await file.arrayBuffer();
        const doc = await PDFDocument.load(buf);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "merged.pdf";
      a.click();
      setDone(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setMerging(false);
    }
  };

  const totalPages = files.reduce((s, f) => s + (f.pages ?? 0), 0);
  const totalSize = files.reduce((s, f) => s + f.file.size, 0);

  return (
    <section className="mb-10">
      {/* Options bar */}
      <div className="flex items-center gap-6 px-[18px] py-[14px] border border-line bg-bg-1 border-b-0">
        <span className="font-mono text-[11px] text-dim">
          {files.length} {lang === "fr" ? "fichier(s)" : "file(s)"}
          {totalPages > 0 && ` · ${totalPages} ${lang === "fr" ? "pages" : "pages"}`}
          {totalSize > 0 && ` · ${formatBytes(totalSize)}`}
        </span>
        <div className="flex-1" />
        <button
          onClick={() => { setFiles([]); setDone(false); setError(null); }}
          disabled={files.length === 0}
          className="font-mono text-[12px] text-dim hover:text-fg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {lang === "fr" ? "effacer tout" : "clear all"}
        </button>
        <button
          onClick={handleMerge}
          disabled={files.length < 2 || merging}
          className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {merging
            ? (lang === "fr" ? "fusion…" : "merging…")
            : (lang === "fr" ? "fusionner ⏎" : "merge ⏎")}
        </button>
      </div>

      <div className="border border-line min-h-[420px] flex flex-col">
        <DropZoneMulti
          onFiles={(fs) => addFiles(fs)}
          accept=".pdf,application/pdf"
          glyph="≡+≡"
          label={lang === "fr" ? "glisser des PDF ici ou cliquer pour sélectionner" : "drag PDFs here or click to select"}
        />

        {/* File list */}
        {files.length > 0 ? (
          <div className="flex flex-col divide-y divide-line flex-1">
            {/* Column header */}
            <div className="flex items-center gap-3 px-4 py-2 font-mono text-[10px] text-dim-2 uppercase tracking-[0.08em] bg-bg-1">
              <span className="w-6">#</span>
              <span className="flex-1">filename</span>
              <span className="w-16 text-right">{lang === "fr" ? "pages" : "pages"}</span>
              <span className="w-20 text-right">size</span>
              <span className="w-16" />
            </div>
            {files.map((f, idx) => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-[11px] hover:bg-bg-2 transition-colors">
                <span className="w-6 font-mono text-[11px] text-dim-2 shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-mono text-[12px] text-fg truncate">{f.file.name}</span>
                <span className="w-16 font-mono text-[12px] text-dim text-right shrink-0">
                  {f.pages !== null ? `${f.pages}p` : "—"}
                </span>
                <span className="w-20 font-mono text-[11px] text-dim-2 text-right shrink-0">
                  {formatBytes(f.file.size)}
                </span>
                <div className="flex items-center gap-1 w-16 justify-end shrink-0">
                  <button
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    className="font-mono text-[12px] text-dim hover:text-fg transition-colors disabled:opacity-20 px-1"
                  >↑</button>
                  <button
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="font-mono text-[12px] text-dim hover:text-fg transition-colors disabled:opacity-20 px-1"
                  >↓</button>
                  <button
                    onClick={() => handleRemove(f.id)}
                    className="font-mono text-[12px] text-dim hover:text-danger transition-colors px-1"
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center font-mono text-[12px] text-dim-2">
            {"// "}{lang === "fr" ? "aucun fichier sélectionné" : "no files selected"}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-line bg-bg font-mono text-[11px]">
          {error && <span className="text-danger">✕ {error}</span>}
          {done && !error && (
            <span className="text-brand">
              ✓ {lang === "fr" ? "PDF fusionné téléchargé" : "merged PDF downloaded"}
            </span>
          )}
          {!error && !done && (
            <span className="text-dim">
              {files.length < 2
                ? (lang === "fr" ? "ajoutez au moins 2 fichiers" : "add at least 2 files")
                : (lang === "fr" ? "prêt à fusionner" : "ready to merge")}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
