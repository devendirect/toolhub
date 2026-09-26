"use client";

import { useState, useRef } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { fmtSize } from "@/lib/format";
import { downloadBlob } from "@/lib/download";
import { useTrackRun } from "@/hooks/useTrackRun";

type ZipEntry = {
  name: string;
  size: number;
  compressedSize: number;
  isDir: boolean;
  data?: Uint8Array;
};

const TR = {
  fr: {
    dropZip: "déposer un .zip ou cliquez",
    change:  "changer",
  },
  en: {
    dropZip: "drop a .zip or click",
    change:  "change",
  },
} as const;

function extensionIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "▣";
  if (["json", "js", "ts", "tsx", "jsx"].includes(ext)) return "{}";
  if (["css", "scss"].includes(ext)) return "#";
  if (["html", "htm"].includes(ext)) return "<>";
  if (["pdf"].includes(ext)) return "Ȗ";
  if (["zip", "tar", "gz"].includes(ext)) return "⊞";
  if (["md", "txt"].includes(ext)) return "¶";
  return "·";
}

export function ZipExtractor() {
  const { lang } = useLang();
  const i = t(lang);
  const inputRef = useRef<HTMLInputElement>(null);
  const trackRun = useTrackRun("zip-extractor", "file");
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [archiveName, setArchiveName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    trackRun();
    setLoading(true);
    setError(null);
    setEntries([]);
    setArchiveName(file.name);
    try {
      const { unzip } = await import("fflate");
      const buffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      unzip(uint8, (err, files) => {
        if (err) { setError(err.message); setLoading(false); return; }
        const result: ZipEntry[] = Object.entries(files).map(([name, data]) => ({
          name,
          isDir: name.endsWith("/"),
          size: data.length,
          compressedSize: data.length,
          data,
        }));
        result.sort((a, b) => {
          if (a.isDir && !b.isDir) return -1;
          if (!a.isDir && b.isDir) return 1;
          return a.name.localeCompare(b.name);
        });
        setEntries(result);
        setLoading(false);
      });
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  const downloadEntry = (entry: ZipEntry) => {
    if (!entry.data) return;
    downloadBlob(new Blob([entry.data.buffer as ArrayBuffer]), entry.name.split("/").pop() ?? entry.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith(".zip")) handleFile(file);
  };

  const totalUncompressed = entries.filter((e) => !e.isDir).reduce((s, e) => s + e.size, 0);

  return (
    <section className="mb-10">
      <div className="border border-line">
        {/* Drop zone */}
        {entries.length === 0 && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 py-20 cursor-pointer hover:bg-bg-2 transition-colors"
          >
            <span className="font-mono text-[28px] text-dim">⊞↓</span>
            <span className="font-mono text-[13px] text-fg">
              {loading ? i.reading : TR[lang].dropZip}
            </span>
            {error && <span className="font-mono text-[12px] text-danger">✕ {error}</span>}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {/* File list */}
        {entries.length > 0 && (
          <>
            <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-line bg-bg-1">
              <span className="font-mono text-[12px] text-fg">{archiveName}</span>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] text-dim">
                  {entries.filter((e) => !e.isDir).length} {i.filesLabel}, {fmtSize(totalUncompressed)}
                </span>
                <button
                  onClick={() => { setEntries([]); setArchiveName(""); if (inputRef.current) inputRef.current.value = ""; }}
                  className="font-mono text-[11px] text-dim hover:text-danger transition-colors"
                >
                  {TR[lang].change}
                </button>
              </div>
            </div>

            <div className="divide-y divide-line max-h-[400px] overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.name}
                  className={`flex items-center gap-3 px-[14px] py-[9px] group ${entry.isDir ? "opacity-50" : "hover:bg-bg-2"}`}
                >
                  <span className="font-mono text-[11px] text-dim w-6 shrink-0 text-center">
                    {entry.isDir ? "▾" : extensionIcon(entry.name)}
                  </span>
                  <span
                    className="font-mono text-[12px] text-fg flex-1 truncate"
                    title={entry.name}
                    style={{ paddingLeft: `${(entry.name.split("/").length - 2) * 16}px` }}
                  >
                    {entry.name.split("/").filter(Boolean).pop() ?? entry.name}
                  </span>
                  {!entry.isDir && (
                    <>
                      <span className="font-mono text-[11px] text-dim shrink-0">{fmtSize(entry.size)}</span>
                      <button
                        onClick={() => downloadEntry(entry)}
                        className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 hover:text-brand transition-all shrink-0"
                      >
                        ↓
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="px-[14px] py-2 bg-bg font-mono text-[11px] text-dim border-t border-line">
          {i.localFflate}
        </div>
      </div>
    </section>
  );
}
