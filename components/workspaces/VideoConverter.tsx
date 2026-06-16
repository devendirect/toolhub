"use client";

import { useState, useRef } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { DropZone } from "@/components/workspace/DropZone";

type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error";

const FORMATS = ["mp4", "webm", "mov", "avi", "mkv", "gif"] as const;
type Format = typeof FORMATS[number];

const RESOLUTIONS = ["original", "1080p", "720p", "480p", "360p"] as const;
type Resolution = typeof RESOLUTIONS[number];

const RES_MAP: Record<Resolution, string | null> = {
  original: null,
  "1080p": "1920:1080",
  "720p":  "1280:720",
  "480p":  "854:480",
  "360p":  "640:360",
};

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function VideoConverter() {
  const { lang } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("mp4");
  const [resolution, setResolution] = useState<Resolution>("original");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setOutputUrl(null);
    setStatus("idle"); setError(null); setProgress(0);
  };

  const convert = async () => {
    if (!file) return;
    setStatus("loading-ffmpeg"); setError(null);
    setProgress(0); setOutputUrl(null);

    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      const ffmpeg = new FFmpeg();
      ffmpeg.on("progress", ({ progress: p }) => setProgress(Math.round(p * 100)));

      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`,   "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      setStatus("converting");
      const ext = file.name.split(".").pop() ?? "mp4";
      const inputName  = `input.${ext}`;
      const outputName = `output.${format}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args = ["-i", inputName];

      if (format === "gif") {
        const vf = RES_MAP[resolution]
          ? `scale=${RES_MAP[resolution]?.replace(":", ",")}:flags=lanczos,fps=15,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`
          : "fps=15,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse";
        args.push("-vf", vf);
      } else {
        if (RES_MAP[resolution]) {
          args.push("-vf", `scale=${RES_MAP[resolution]?.replace(":", ",")}:force_original_aspect_ratio=decrease`);
        }
        if (format === "mp4") args.push("-c:v", "libx264", "-c:a", "aac", "-movflags", "+faststart");
        if (format === "webm") args.push("-c:v", "libvpx-vp9", "-c:a", "libopus");
      }

      args.push(outputName);
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const mime = format === "gif" ? "image/gif" : `video/${format}`;
      const blob = new Blob([data as unknown as BlobPart], { type: mime });
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
        accept="video/*"
        glyph="▶"
        label={lang === "fr" ? "déposer une vidéo ou cliquer" : "drop a video file or click"}
        current={file ? `${file.name} — ${fmtSize(file.size)}` : null}
      />

      {/* Format */}
      <div className="flex flex-wrap gap-0 border border-line border-t-0">
        <div className="flex items-center gap-0 border-r border-line">
          <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1">format</span>
          {FORMATS.map((f) => (
            <button key={f} onClick={() => setFormat(f)}
              className={`font-mono text-[11px] px-3 py-[10px] border-r border-line transition-colors ${format === f ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0">
          <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1">res</span>
          {RESOLUTIONS.map((r) => (
            <button key={r} onClick={() => setResolution(r)}
              className={`font-mono text-[11px] px-3 py-[10px] border-r border-line transition-colors ${resolution === r ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Action + result */}
      <div className="border border-line border-t-0 p-4 flex flex-col gap-4">
        {format === "gif" && (
          <p className="font-mono text-[11px] text-hot">
            ⚠ {lang === "fr" ? "GIF : limiter à de courtes séquences (< 10s), fichier souvent lourd" : "GIF: keep clips short (< 10s), output can be large"}
          </p>
        )}

        <button onClick={convert}
          disabled={!file || status === "loading-ffmpeg" || status === "converting"}
          className="w-full py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold hover:brightness-110 transition-all disabled:opacity-40">
          {status === "loading-ffmpeg"
            ? (lang === "fr" ? "chargement ffmpeg.wasm (~10 Mo)…" : "loading ffmpeg.wasm (~10 MB)…")
            : status === "converting"
            ? `${lang === "fr" ? "conversion" : "converting"} ${progress}%`
            : (lang === "fr" ? "convertir" : "convert")}
        </button>

        {(status === "loading-ffmpeg" || status === "converting") && (
          <div className="w-full h-1 bg-bg-2 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all"
              style={{ width: status === "loading-ffmpeg" ? "5%" : `${progress}%` }} />
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
                  <span className="text-brand ml-2">-{Math.round((1 - outputSize / file.size) * 100)}%</span>
                )}
              </span>
            </div>
            <button onClick={download}
              className="font-mono text-[12px] text-brand hover:brightness-110 transition-all px-4 py-2 border border-brand">
              {lang === "fr" ? "télécharger ↓" : "download ↓"}
            </button>
          </div>
        )}

        {status === "done" && outputUrl && format !== "gif" && (
          <video src={outputUrl} controls className="w-full max-h-[300px] border border-line" />
        )}
        {status === "done" && outputUrl && format === "gif" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={outputUrl} alt="converted gif" className="max-w-full border border-line" />
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
