"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { downloadBlob, downloadUrl } from "@/lib/download";
import { useTrackRun } from "@/hooks/useTrackRun";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

type Format = "svg" | "png";
type EC = "L" | "M" | "Q" | "H";
type Size = 128 | 256 | 512;

const TR = {
  fr: {
    errCorrection: "correction",
    qrPrompt:      "entrez un texte pour générer",
    qrPlaceholder: "URL, texte, contact…",
    plainText:     "texte brut",
  },
  en: {
    errCorrection: "error correction",
    qrPrompt:      "enter text to generate",
    qrPlaceholder: "URL, text, contact…",
    plainText:     "plain text",
  },
} as const;

export function QrGenerator() {
  const { lang } = useLang();
  const i = t(lang);

  const { copy } = useCopy();
  const trackRun = useTrackRun("qr-generator", "dev");
  const [text, setText] = useState("https://toolhub.io");
  const [format, setFormat] = useState<Format>("svg");
  const [ec, setEc] = useState<EC>("M");
  const [size, setSize] = useState<Size>(256);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text.trim()) { setOutput(""); setError(null); return; }
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled) return;
        if (format === "svg") {
          const svg = await QRCode.toString(text, { type: "svg", errorCorrectionLevel: ec, width: size, margin: 2 });
          if (!cancelled) { setOutput(svg); setError(null); }
        } else {
          const url = await QRCode.toDataURL(text, { errorCorrectionLevel: ec, width: size, margin: 2 });
          if (!cancelled) { setOutput(url); setError(null); }
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();
    return () => { cancelled = true; };
  }, [text, format, ec, size]);

  const handleDownload = () => {
    if (!output) return;
    trackRun();
    if (format === "svg") {
      downloadBlob(new Blob([output], { type: "image/svg+xml" }), "qrcode.svg");
    } else {
      downloadUrl(output, "qrcode.png");
    }
  };

  const handleCopy = async () => {
    if (format === "svg" && output) copy(output);
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
            onClick={() => setText(text)}
          >
            {i.generateBtn}
          </button>
        }
      >
        <OptBlock label="format">
          <SegControl options={["svg", "png"]} value={format} onChange={(v) => setFormat(v as Format)} />
        </OptBlock>
        <OptBlock label={TR[lang].errCorrection}>
          <SegControl options={["L", "M", "Q", "H"]} value={ec} onChange={(v) => setEc(v as EC)} />
        </OptBlock>
        <OptBlock label={i.sizeOpt}>
          <SegControl options={[128, 256, 512]} value={size} onChange={(v) => setSize(v as Size)} />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        {/* Input */}
        <Pane
          title={i.input}
          ext="txt"
          meta={`${text.length} chars`}
          actions={
            <PaneBtn onClick={() => setText("")}>{i.clear}</PaneBtn>
          }
          footer={
            <span className="text-fg-1">
              {text.startsWith("http") ? "URL" : text.startsWith("BEGIN:") ? "vCard" : TR[lang].plainText}
            </span>
          }
          className="border-r border-line"
        >
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={TR[lang].qrPlaceholder}
              className="w-full h-full min-h-[320px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
              spellCheck={false}
            />
          </div>
        </Pane>

        {/* Output */}
        <Pane
          title={i.output}
          ext={format}
          meta={output ? `${size}×${size}px · ${ec} correction` : undefined}
          actions={
            <>
              {format === "svg" && <PaneBtn onClick={handleCopy}>{i.copy} svg</PaneBtn>}
              <PaneBtn onClick={handleDownload}>{i.download}</PaneBtn>
            </>
          }
          footer={
            output
              ? <span>{format.toUpperCase()} · {size}px · EC={ec}</span>
              : undefined
          }
        >
          <div className="flex-1 flex items-center justify-center bg-bg-code p-6 min-h-[320px]">
            {error ? (
              <span className="font-mono text-[12px] text-danger">✕ {error}</span>
            ) : output && format === "svg" ? (
              <div
                className="rounded qr-preview"
                dangerouslySetInnerHTML={{ __html: output }}
                style={{ width: Math.min(size, 280), height: Math.min(size, 280) }}
              />
            ) : output && format === "png" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={output} alt="QR code" style={{ width: Math.min(size, 280), imageRendering: "pixelated" }} />
            ) : (
              <span className="font-mono text-[12px] text-dim">
                {"// "}{TR[lang].qrPrompt}
              </span>
            )}
          </div>
        </Pane>
      </div>
    </section>
  );
}
