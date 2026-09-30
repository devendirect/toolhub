"use client";

import { useState, useRef, useEffect } from "react";
import type { Lang } from "@/lib/types";
import { fmtSize } from "@/lib/format";
import { downloadUrl } from "@/lib/download";
import { decodeIfHeic } from "@/lib/heic";
import { encodeImage, type ImageFormat } from "@/lib/image-encode";
import { uniqueName, runSequential, type ItemStatus } from "@/lib/batch";
import { createZipWriter } from "@/lib/zip-writer";

const EXT: Record<ImageFormat, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

const TR = {
  fr: {
    images:    "images",
    convert:   (n: number) => `convertir ${n} images`,
    cancel:    "annuler",
    zip:       "télécharger le ZIP",
    reset:     "recommencer",
    pending:   "en attente",
    working:   "conversion…",
    failed:    "illisible",
    summary:   (ok: number, ko: number) => `${ok} converties${ko ? `, ${ko} en échec` : ""}`,
    cancelled: "lot interrompu : le ZIP contient les images déjà converties",
    zipName:   "images-converties",
    hint:      "Les images sont traitées une par une dans votre navigateur ; rien n'est envoyé.",
  },
  en: {
    images:    "images",
    convert:   (n: number) => `convert ${n} images`,
    cancel:    "cancel",
    zip:       "download ZIP",
    reset:     "start over",
    pending:   "waiting",
    working:   "converting…",
    failed:    "unreadable",
    summary:   (ok: number, ko: number) => `${ok} converted${ko ? `, ${ko} failed` : ""}`,
    cancelled: "batch stopped: the ZIP holds the images converted so far",
    zipName:   "converted-images",
    hint:      "Images are processed one by one in your browser; nothing is uploaded.",
  },
} as const;

interface Props {
  files: File[];
  format: ImageFormat;
  quality: number;          // 0–1
  maxWidth: number;
  lang: Lang;
  onStart: () => void;
  onRunningChange: (running: boolean) => void;
  onReset: () => void;
}

type Phase = "idle" | "running" | "done";

export function ImageBatch({ files, format, quality, maxWidth, lang, onStart, onRunningChange, onReset }: Props) {
  const tr = TR[lang];
  const [statuses, setStatuses] = useState<ItemStatus[]>(() => files.map(() => "pending"));
  const [outSizes, setOutSizes] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [zip, setZip] = useState<{ url: string; size: number } | null>(null);
  const [wasCancelled, setWasCancelled] = useState(false);
  const cancelRef = useRef(false);

  // Le parent remonte le composant (key) quand les fichiers ou les réglages
  // changent : un ZIP ne peut pas survivre à des réglages qu'il ne reflète plus.
  // Démontage = lot arrêté, archive libérée.
  const zipUrlRef = useRef<string | null>(null);
  useEffect(() => { zipUrlRef.current = zip?.url ?? null; }, [zip]);
  useEffect(() => () => {
    cancelRef.current = true;
    if (zipUrlRef.current) URL.revokeObjectURL(zipUrlRef.current);
  }, []);

  const start = async () => {
    onStart();
    cancelRef.current = false;
    setWasCancelled(false);
    setPhase("running");
    onRunningChange(true);
    setStatuses(files.map(() => "pending"));
    setOutSizes([]);

    const writer = await createZipWriter();
    const used = new Set<string>();
    const ext = EXT[format];

    await runSequential(
      files,
      async (file, idx) => {
        // Laisse le navigateur afficher la progression entre deux images
        await new Promise((r) => setTimeout(r, 0));
        const readable = await decodeIfHeic(file);
        const { blob } = await encodeImage(readable, format, quality, maxWidth);
        await writer.add(uniqueName(file.name.replace(/\.[^.]+$/, "") + "." + ext, used), blob);
        setOutSizes((prev) => { const next = [...prev]; next[idx] = blob.size; return next; });
      },
      (idx, status) => setStatuses((prev) => { const next = [...prev]; next[idx] = status; return next; }),
      () => cancelRef.current,
    );

    const blob = await writer.finish();
    setWasCancelled(cancelRef.current);
    setZip({ url: URL.createObjectURL(blob), size: blob.size });
    setPhase("done");
    onRunningChange(false);
  };

  const processed = statuses.filter((s) => s === "done" || s === "error").length;
  const ok = statuses.filter((s) => s === "done").length;
  const ko = statuses.filter((s) => s === "error").length;
  const totalIn = files.reduce((n, f) => n + f.size, 0);

  const btn = "px-[14px] py-[6px] font-mono text-[12px] rounded-[3px] transition-all disabled:opacity-40";

  return (
    <div className="border border-line">
      <div className="flex flex-wrap items-center gap-3 px-[14px] py-[10px] bg-bg-1 border-b border-line">
        <span className="font-mono text-[12px] text-fg">
          {files.length} {tr.images} · <span className="text-dim">{fmtSize(totalIn)}</span>
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          {phase === "idle" && (
            <button onClick={start} className={`${btn} bg-brand text-bg font-semibold hover:brightness-110`}>
              {tr.convert(files.length)}
            </button>
          )}
          {phase === "running" && (
            <button onClick={() => { cancelRef.current = true; }} className={`${btn} border border-line text-dim hover:text-danger`}>
              {tr.cancel}
            </button>
          )}
          {phase === "done" && zip && ok > 0 && (
            <button
              onClick={() => downloadUrl(zip.url, `${tr.zipName}-${EXT[format]}.zip`)}
              className={`${btn} bg-brand text-bg font-semibold hover:brightness-110`}
            >
              {tr.zip} ({fmtSize(zip.size)}) ↓
            </button>
          )}
          <button onClick={onReset} disabled={phase === "running"} className={`${btn} border border-line text-dim hover:text-fg`}>
            {tr.reset}
          </button>
        </div>
      </div>

      {phase !== "idle" && (
        <div className="px-[14px] py-[10px] border-b border-line">
          <div className="flex justify-between font-mono text-[11px] text-dim mb-2">
            <span>
              {phase === "done" ? tr.summary(ok, ko) : `${processed} / ${files.length}`}
            </span>
            {phase === "done" && wasCancelled && <span className="text-hot">{tr.cancelled}</span>}
          </div>
          <div className="h-[3px] bg-bg-2">
            <div className="h-full bg-brand transition-[width]" style={{ width: `${(processed / files.length) * 100}%` }} />
          </div>
        </div>
      )}

      <ul className="max-h-[320px] overflow-y-auto divide-y divide-line">
        {files.map((f, idx) => {
          const s = statuses[idx] ?? "pending";
          return (
            <li key={idx} className="flex items-center gap-3 px-[14px] py-[7px] font-mono text-[11px]">
              <span className="text-dim-2 w-7 shrink-0 text-right">{idx + 1}</span>
              <span className="text-fg flex-1 truncate">{f.name}</span>
              <span className="text-dim-2 shrink-0">{fmtSize(f.size)}</span>
              <span className={`w-[110px] shrink-0 text-right ${s === "done" ? "text-ok" : s === "error" ? "text-danger" : "text-dim"}`}>
                {s === "done" ? `✓ ${fmtSize(outSizes[idx] ?? 0)}` : s === "error" ? `✕ ${tr.failed}` : s === "working" ? tr.working : tr.pending}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="px-[14px] py-2 font-mono text-[11px] text-dim border-t border-line">{tr.hint}</div>
    </div>
  );
}
