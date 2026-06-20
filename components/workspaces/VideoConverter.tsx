"use client";

import { useState, useRef } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { DropZone } from "@/components/workspace/DropZone";
import { fmtSize } from "@/lib/format";
import { useConversionState } from "@/hooks/useConversionState";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { downloadUrl } from "@/lib/download";

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

const TR = {
  fr: {
    dropVideo:          "déposer une vidéo ou cliquer",
    gifWarning:         "GIF : limiter à de courtes séquences (< 10s), fichier souvent lourd",
    convertingProgress: "conversion",
    convert:            "convertir",
  },
  en: {
    dropVideo:          "drop a video file or click",
    gifWarning:         "GIF: keep clips short (< 10s), output can be large",
    convertingProgress: "converting",
    convert:            "convert",
  },
} as const;

export function VideoConverter() {
  const { lang } = useLang();
  const i = t(lang);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("mp4");
  const [resolution, setResolution] = useState<Resolution>("original");
  const [progress, setProgress] = useState(0);
  const { status, setStatus, error, outputUrl, outputSize, fail, succeed, reset } =
    useConversionState<Status>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    reset();
    setProgress(0);
  };

  const convert = async () => {
    if (!file) return;
    setStatus("loading-ffmpeg");
    setProgress(0);

    try {
      const ffmpeg = await loadFFmpeg((p) => setProgress(p));
      const { fetchFile } = await import("@ffmpeg/util");

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
      const blobPart = data instanceof Uint8Array
        ? data.buffer as ArrayBuffer
        : new TextEncoder().encode(data).buffer as ArrayBuffer;
      const mime = format === "gif" ? "image/gif" : `video/${format}`;
      const blob = new Blob([blobPart], { type: mime });
      succeed(URL.createObjectURL(blob), blob.size);
    } catch (e) {
      fail(e);
    }
  };

  const download = () => {
    if (!outputUrl || !file) return;
    downloadUrl(outputUrl, file.name.replace(/\.[^.]+$/, "") + "." + format);
  };

  return (
    <section className="mb-10">
      <DropZone
        onFile={handleFile}
        accept="video/*"
        glyph="▶"
        label={TR[lang].dropVideo}
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
            ⚠ {TR[lang].gifWarning}
          </p>
        )}

        <button onClick={convert}
          disabled={!file || status === "loading-ffmpeg" || status === "converting"}
          className="w-full py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold hover:brightness-110 transition-all disabled:opacity-40">
          {status === "loading-ffmpeg"
            ? i.ffmpegLoading
            : status === "converting"
            ? `${TR[lang].convertingProgress} ${progress}%`
            : TR[lang].convert}
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
              {i.download} ↓
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
          {i.localConversion}
          {" · "}Powered by <a href="https://ffmpeg.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">FFmpeg</a>
        </p>
      </div>
    </section>
  );
}
