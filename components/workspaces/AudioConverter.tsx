"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { DropZone } from "@/components/workspace/DropZone";
import { fmtSize } from "@/lib/format";
import { useConversionState } from "@/hooks/useConversionState";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { downloadUrl } from "@/lib/download";
import { useTrackRun } from "@/hooks/useTrackRun";

type Status = "idle" | "loading-ffmpeg" | "converting" | "done" | "error";

const FORMATS = ["mp3", "aac", "ogg", "wav", "flac", "m4a"] as const;
type Format = typeof FORMATS[number];

const BITRATES = ["64k", "128k", "192k", "256k", "320k"] as const;
type Bitrate = typeof BITRATES[number];

const TR = {
  fr: {
    dropAudio:          "déposer un fichier audio ou cliquer",
    bitrate:            "débit",
    convertingProgress: "conversion",
    convert:            "convertir",
  },
  en: {
    dropAudio:          "drop an audio file or click",
    bitrate:            "bitrate",
    convertingProgress: "converting",
    convert:            "convert",
  },
} as const;

export function AudioConverter() {
  const { lang } = useLang();
  const i = t(lang);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("mp3");
  const [bitrate, setBitrate] = useState<Bitrate>("192k");
  const [progress, setProgress] = useState(0);
  const { status, setStatus, error, outputUrl, outputSize, fail, succeed, reset } =
    useConversionState<Status>("idle");
  const trackRun = useTrackRun("audio-converter", "file");

  const handleFile = (f: File) => {
    setFile(f);
    reset();
    setProgress(0);
  };

  const convert = async () => {
    if (!file) return;
    trackRun();
    setStatus("loading-ffmpeg");
    setProgress(0);

    try {
      const ffmpeg = await loadFFmpeg((p) => setProgress(p));
      const { fetchFile } = await import("@ffmpeg/util");

      setStatus("converting");
      const inputName  = "input." + file.name.split(".").pop();
      const outputName = "output." + format;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args = ["-i", inputName];
      if (format !== "wav" && format !== "flac") args.push("-b:a", bitrate);
      args.push(outputName);

      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const blobPart = data instanceof Uint8Array
        ? data.buffer as ArrayBuffer
        : new TextEncoder().encode(data).buffer as ArrayBuffer;
      const blob = new Blob([blobPart], { type: `audio/${format}` });
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
        accept="audio/*"
        glyph="♪"
        label={TR[lang].dropAudio}
        current={file ? `${file.name} — ${fmtSize(file.size)}` : null}
      />

      <div className="flex flex-wrap gap-0 border border-line border-t-0">
        <div className="flex items-center gap-0 border-r border-line">
          <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1">
            format
          </span>
          {FORMATS.map((f) => (
            <button key={f} onClick={() => setFormat(f)}
              className={`font-mono text-[11px] px-3 py-[10px] border-r border-line transition-colors ${format === f ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0">
          <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1">
            {TR[lang].bitrate}
          </span>
          {BITRATES.map((b) => (
            <button key={b} onClick={() => setBitrate(b)}
              disabled={format === "wav" || format === "flac"}
              className={`font-mono text-[11px] px-3 py-[10px] border-r border-line transition-colors disabled:opacity-30 ${bitrate === b && format !== "wav" && format !== "flac" ? "bg-brand text-bg" : "text-dim hover:text-fg"}`}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-line border-t-0 p-4 flex flex-col gap-4">
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

        {status === "error" && <p className="font-mono text-[12px] text-danger">✕ {error}</p>}

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

        <p className="font-mono text-[11px] text-dim">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-brand mr-2" />
          {i.localConversion}
          {" · "}Powered by <a href="https://ffmpeg.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">FFmpeg</a>
        </p>
      </div>
    </section>
  );
}
