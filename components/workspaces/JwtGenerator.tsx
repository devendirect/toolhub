"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { useTrackRun } from "@/hooks/useTrackRun";

const TR = {
  fr: {
    algorithm:    "algorithme",
    payloadLabel: "payload (JSON)",
    secretLabel:  "secret",
    tokenLabel:   "token JWT",
    invalidJson:  "JSON invalide dans le payload",
    signHint:     "remplissez le payload et le secret, puis signez",
    localCrypto:  "signature locale, Web Crypto API, clé jamais transmise",
  },
  en: {
    algorithm:    "algorithm",
    payloadLabel: "payload (JSON)",
    secretLabel:  "secret",
    tokenLabel:   "JWT token",
    invalidJson:  "invalid JSON in payload",
    signHint:     "fill the payload and secret, then sign",
    localCrypto:  "local signing, Web Crypto API, key never transmitted",
  },
} as const;

const DEFAULT_PAYLOAD = JSON.stringify(
  { sub: "1234567890", name: "John Doe", iat: 1516239022, exp: 1916239022 },
  null, 2
);

function b64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlStr(s: string): string {
  return b64url(new TextEncoder().encode(s).buffer as ArrayBuffer);
}

async function signHs256(payloadStr: string, secret: string): Promise<string> {
  const header = b64urlStr(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body   = b64urlStr(payloadStr);
  const input  = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
  return `${input}.${b64url(sig)}`;
}

export function JwtGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("jwt-generator", "dev");

  const [payload, setPayload] = useState(DEFAULT_PAYLOAD);
  const [secret,  setSecret]  = useState("your-256-bit-secret");
  const [token,   setToken]   = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  const sign = async () => {
    let parsed: unknown;
    try { parsed = JSON.parse(payload); } catch {
      setError(TR[lang].invalidJson);
      return;
    }
    trackRun();
    setSigning(true);
    setError(null);
    try {
      const tok = await signHs256(JSON.stringify(parsed), secret);
      setToken(tok);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSigning(false);
    }
  };

  const parts = token?.split(".") ?? [];

  return (
    <section className="mb-10">
      <div className="flex items-center gap-0 border border-line border-b-0 bg-bg-1">
        <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line shrink-0">
          {TR[lang].algorithm}
        </span>
        <span className="font-mono text-[12px] text-brand px-4 py-[11px] flex-1">HS256</span>
        <button
          onClick={sign}
          disabled={signing || !payload.trim() || !secret.trim()}
          className="px-[18px] py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold shrink-0 hover:brightness-110 transition-all disabled:opacity-50 border-l border-brand"
        >
          {signing ? "…" : i.signBtn}
        </button>
      </div>

      <div className="border border-line border-b-0">
        <div className="px-[14px] py-[9px] bg-bg border-b border-line">
          <span className="font-mono text-[11px] text-dim">// {TR[lang].payloadLabel}</span>
        </div>
        <textarea
          value={payload}
          onChange={(e) => { setPayload(e.target.value); setToken(null); setError(null); }}
          rows={8}
          className="w-full bg-bg-code font-mono text-[12.5px] text-fg px-[14px] py-[12px] outline-none resize-none leading-[1.65] block"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center gap-0 border border-line border-b-0">
        <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 w-40 shrink-0">
          {TR[lang].secretLabel}
        </span>
        <input
          value={secret}
          onChange={(e) => { setSecret(e.target.value); setToken(null); setError(null); }}
          onKeyDown={(e) => e.key === "Enter" && sign()}
          className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none"
          spellCheck={false}
        />
      </div>

      <div className="border border-line">
        <div className="flex items-center justify-between px-[14px] py-[9px] bg-bg-1 border-b border-line">
          <span className="font-mono text-[11px] text-dim">// {TR[lang].tokenLabel}</span>
          {token && (
            <button
              onClick={() => copy(token)}
              className="font-mono text-[11px] text-dim hover:text-brand transition-colors"
            >
              {copied ? "✓" : i.copy}
            </button>
          )}
        </div>
        <div className="p-[14px] bg-bg-code min-h-[72px]">
          {error && <p className="font-mono text-[12px] text-danger">✕ {error}</p>}
          {token && !error && (
            <p
              className="font-mono text-[12px] break-all leading-[1.7] cursor-pointer"
              onClick={() => copy(token)}
            >
              <span className="text-brand">{parts[0]}</span>
              <span className="text-dim">.</span>
              <span className="text-ok">{parts[1]}</span>
              <span className="text-dim">.</span>
              <span className="text-hot">{parts[2]}</span>
            </p>
          )}
          {!token && !error && (
            <p className="font-mono text-[12px] text-dim-2">{TR[lang].signHint}</p>
          )}
        </div>
        <div className="flex items-center gap-2 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-brand shrink-0" />
          {TR[lang].localCrypto}
        </div>
      </div>
    </section>
  );
}
