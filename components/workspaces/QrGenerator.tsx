"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { downloadBlob, downloadUrl } from "@/lib/download";
import { useTrackRun } from "@/hooks/useTrackRun";
import { OptionsBar, OptBlock, SegControl, Toggle } from "@/components/workspace/OptionsBar";
import { Pane, PaneBtn } from "@/components/workspace/Pane";

type Format = "svg" | "png";
type EC = "L" | "M" | "Q" | "H";
type Size = 128 | 256 | 512;
type Mode = "text" | "wifi";
type WifiSec = "WPA" | "WEP" | "nopass";

/**
 * Chaîne Wi-Fi lue par les appareils photo d'iOS et d'Android :
 * WIFI:T:<sécurité>;S:<nom>;P:<mot de passe>;H:true;;
 * \ ; , : et " doivent être échappés par un antislash, sinon un « ; » dans le
 * mot de passe coupe le champ et le QR code donne un mot de passe tronqué.
 */
export function wifiPayload(ssid: string, password: string, sec: WifiSec, hidden: boolean): string {
  const esc = (v: string) => v.replace(/([\\;,:"])/g, "\\$1");
  return `WIFI:T:${sec};S:${esc(ssid)};${sec !== "nopass" ? `P:${esc(password)};` : ""}${hidden ? "H:true;" : ""};`;
}

const TR = {
  fr: {
    errCorrection: "correction",
    qrPrompt:      "entrez un texte pour générer",
    qrPlaceholder: "URL, texte, contact…",
    mode:          "contenu",
    modes:         { text: "texte / lien", wifi: "Wi-Fi" },
    ssid:          "nom du réseau (SSID)",
    password:      "mot de passe",
    security:      "sécurité",
    secs:          { WPA: "WPA/WPA2/WPA3", WEP: "WEP", nopass: "aucune" },
    hidden:        "réseau masqué",
    chars:         "caractères",
    tooBig:        "Trop de données pour un QR code : raccourcissez le texte ou baissez la correction d'erreur.",
  },
  en: {
    errCorrection: "error correction",
    qrPrompt:      "enter text to generate",
    qrPlaceholder: "URL, text, contact…",
    mode:          "content",
    modes:         { text: "text / link", wifi: "Wi-Fi" },
    ssid:          "network name (SSID)",
    password:      "password",
    security:      "security",
    secs:          { WPA: "WPA/WPA2/WPA3", WEP: "WEP", nopass: "none" },
    hidden:        "hidden network",
    chars:         "chars",
    tooBig:        "Too much data for a QR code: shorten the text or lower the error correction.",
  },
} as const;

export function QrGenerator() {
  const { lang } = useLang();
  const i = t(lang);

  const { copy } = useCopy();
  const trackRun = useTrackRun("qr-generator", "dev");
  const [text, setText] = useState("https://utilisio.com");
  const [format, setFormat] = useState<Format>("svg");
  const [ec, setEc] = useState<EC>("M");
  const [size, setSize] = useState<Size>(256);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("text");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSec, setWifiSec] = useState<WifiSec>("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const payload = mode === "wifi" ? (ssid ? wifiPayload(ssid, wifiPass, wifiSec, wifiHidden) : "") : text;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QRCode = (await import("qrcode")).default;
        if (cancelled) return;
        if (!payload.trim()) { setOutput(""); setError(null); return; }
        if (format === "svg") {
          const svg = await QRCode.toString(payload, { type: "svg", errorCorrectionLevel: ec, width: size, margin: 4 });
          if (!cancelled) { setOutput(svg); setError(null); }
        } else {
          const url = await QRCode.toDataURL(payload, { errorCorrectionLevel: ec, width: size, margin: 4 });
          if (!cancelled) { setOutput(url); setError(null); }
        }
      } catch (e) {
        const msg = (e as Error).message;
        if (!cancelled) setError(/too big/i.test(msg) ? TR[lang].tooBig : msg);
      }
    })();
    return () => { cancelled = true; };
  }, [payload, format, ec, size, lang]);

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
        <OptBlock label={TR[lang].mode}>
          <SegControl options={["text", "wifi"]} value={mode} onChange={(v) => setMode(v as Mode)} labels={TR[lang].modes} />
        </OptBlock>
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
          meta={`${payload.length} ${TR[lang].chars}`}
          actions={
            <PaneBtn onClick={() => setText("")}>{i.clear}</PaneBtn>
          }
          footer={
            <span className="text-fg-1">
              {mode === "wifi" ? "Wi-Fi" : text.startsWith("http") ? "URL" : text.startsWith("BEGIN:") ? "vCard" : i.plainText}
            </span>
          }
          className="border-r border-line"
        >
          {mode === "wifi" ? (
            <div className="flex-1 p-[14px] bg-bg-code flex flex-col gap-3 min-h-[320px]">
              {([["ssid", ssid, setSsid], ["password", wifiPass, setWifiPass]] as const).map(([k, v, set]) => (
                <label key={k} className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] text-dim">{TR[lang][k]}</span>
                  <input
                    value={v}
                    onChange={(e) => set(e.target.value)}
                    disabled={k === "password" && wifiSec === "nopass"}
                    className="bg-transparent border border-line px-3 py-2 font-mono text-[12.5px] text-fg outline-none focus:border-brand-mid disabled:opacity-40"
                    spellCheck={false}
                    autoComplete="off"
                  />
                </label>
              ))}
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[11px] text-dim">{TR[lang].security}</span>
                <SegControl options={["WPA", "WEP", "nopass"]} value={wifiSec} onChange={(v) => setWifiSec(v as WifiSec)} labels={TR[lang].secs} />
              </div>
              <label className="flex items-center gap-3">
                <Toggle on={wifiHidden} onChange={setWifiHidden} />
                <span className="font-mono text-[11px] text-dim">{TR[lang].hidden}</span>
              </label>
            </div>
          ) : (
          <div className="flex-1 p-[14px] bg-bg-code">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={TR[lang].qrPlaceholder}
              className="w-full h-full min-h-[320px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none placeholder:text-dim-2"
              spellCheck={false}
            />
          </div>
          )}
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
