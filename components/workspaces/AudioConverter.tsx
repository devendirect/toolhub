"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { DropZone } from "@/components/workspace/DropZone";

type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error";

const FORMATS = ["mp3", "aac", "ogg", "wav", "flac", "m4a"] as const;
type Format = typeof FORMATS[number];

const BITRATES = ["64k", "128k", "192k", "256k", "320k"] as const;
type Bitrate = typeof BITRATES[number];

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function AudioConverter() {
  const { lang } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("mp3");
  const [bitrate, setBitrate] = useState<Bitrate>("192k");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setOutputUrl(null);
    setStatus("idle");
    setError(null);
    setProgress(0);
  };

  const convert = async () => {
    if (!file) return;
    setStatus("loading-ffmpeg");
    setError(null);
    setProgress(0);
    setOutputUrl(null);

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.round(p * 100));
      });

      setStatus("loading-ffmpeg");
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL:   await toBlobURL(`${baseURL}/ffmpeg-core.js`,   "text/javascript"),
        wasmURL:   await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      setStatus("converting");
      const inputName  = "input." + file.name.split(".").pop();
      const outputName = "output." + format;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args = ["-i", inputName];
      if (format !== "wav" && format !== "flac") {
        args.push("-b:a", bitrate);
      }
      args.push(outputName);

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data as unknown as BlobPart], { type: `audio/${format}` });
      setOutputUrl(URL.createObjectURL(blob));
      setOutputSize(blob.size);
      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  const download = () => {
    if (!outputUrl || !file) return;
    const a = document.createElement("a");
    a.href = outputUrl;
    a.download = file.name.replace(/\.[^.]+$/, "") + "." + format;
    a.click();
  };

  return (
    <section className="mb-10">
      <DropZone
        onFile={handleFile}
        accept="audio/*"
        glyph="♪"
        label={lang === "fr" ? "déposer un fichier audio ou cliquer" : "drop an audio file or click"}
        current={file ? `${file.name} — ${fmtSize(file.size)}` : null}
      />

      {/* Options */}
      <div className="flex flex-wrap gap-0 border border-line border-t-0">
        <div className="flex items-center gap-0 border-r border-line">
          <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1">
            {lang === "fr" ? "format" : "format"}
          </span>
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`font-mono text-[11px] px-3 py-[10px] border-r border-line transition-colors ${format === f ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0">
          <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1">
            {lang === "fr" ? "débit" : "bitrate"}
          </span>
          {BITRATES.map((b) => (
            <button
              key={b}
              onClick={() => setBitrate(b)}
              disabled={format === "wav" || format === "flac"}
              className={`font-mono text-[11px] px-3 py-[10px] border-r border-line transition-colors disabled:opacity-30 ${bitrate === b && format !== "wav" && format !== "flac" ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Action + result */}
      <div className="border border-line border-t-0 p-4 flex flex-col gap-4">
        <button
          onClick={convert}
          disabled={!file || status === "loading-ffmpeg" || status === "converting"}
          className="w-full py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold hover:brightness-110 transition-all disabled:opacity-40"
        >
          {status === "loading-ffmpeg"
            ? (lang === "fr" ? "chargement ffmpeg.wasm (~10 Mo)…" : "loading ffmpeg.wasm (~10 MB)…")
            : status === "converting"
            ? `${lang === "fr" ? "conversion" : "converting"} ${progress}%`
            : (lang === "fr" ? "convertir" : "convert")}
        </button>

        {(status === "loading-ffmpeg" || status === "converting") && (
          <div className="w-full h-1 bg-bg-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: status === "loading-ffmpeg" ? "5%" : `${progress}%` }}
            />
          </div>
        )}

        {status === "error" && (
          <p className="font-mono text-[12px] text-danger">✕ {error}</p>
        )}

        {status === "done" && outputUrl && (
          <div className="flex items-center justify-between border border-line px-4 py-3">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[12px] text-fg">
                {file?.name.replace(/\.[^.]+$/, "")}.{format}
              </span>
              <span className="font-mono text-[11px] text-dim">
                {fmtSize(outputSize)}
                {file && outputSize < file.size && (
                  <span className="text-brand ml-2">
                    -{Math.round((1 - outputSize / file.size) * 100)}%
                  </span>
                )}
              </span>
            </div>
            <button
              onClick={download}
              className="font-mono text-[12px] text-brand hover:brightness-110 transition-all px-4 py-2 border border-brand"
            >
              {lang === "fr" ? "télécharger ↓" : "download ↓"}
            </button>
          </div>
        )}

        <p className="font-mono text-[11px] text-dim">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-brand mr-2" />
          {lang === "fr"
            ? "conversion locale — aucun fichier envoyé au serveur"
            : "local conversion — no file sent to server"}
          {" · "}Powered by <a href="https://ffmpeg.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">FFmpeg</a>
        </p>
      </div>
    </section>
  );
}
