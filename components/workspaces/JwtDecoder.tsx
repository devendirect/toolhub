"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { useCopy } from "@/hooks/useCopy";
import { t } from "@/lib/i18n";

const TR = {
  fr: {
    placeholder:    "collez un token JWT…",
    pasteAbove:     "collez un token ci-dessus",
    expiredOn:      (date: string) => `expiré le ${date}`,
    expiresOn:      (date: string) => `expire le ${date}`,
  },
  en: {
    placeholder:    "paste a JWT token…",
    pasteAbove:     "paste a token above",
    expiredOn:      (date: string) => `expired ${date}`,
    expiresOn:      (date: string) => `expires ${date}`,
  },
} as const;

const TIMESTAMP_CLAIMS = new Set(["exp", "iat", "nbf"]);
const formatClaim = (k: string, v: unknown) =>
  TIMESTAMP_CLAIMS.has(k)
    ? `${v} (${new Date((v as number) * 1000).toISOString()})`
    : JSON.stringify(v);

function b64decode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
}

function decodeJwt(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Not a valid JWT — expected 3 parts separated by '.'");
  const header = JSON.parse(b64decode(parts[0]!));
  const payload = JSON.parse(b64decode(parts[1]!));
  return { header, payload, signature: parts[2]! };
}

const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoder() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState(SAMPLE);
  const { copy, copied } = useCopy();

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return { data: decodeJwt(input), error: null };
    } catch (e) {
      return { data: null, error: (e as Error).message };
    }
  }, [input]);

  const expiry = useMemo(() => {
    const exp = result?.data?.payload?.exp;
    if (!exp) return null;
    const date = new Date(exp * 1000);
    const expired = date < new Date();
    return { date: date.toISOString(), expired };
  }, [result]);

  return (
    <section className="mb-10">
      <div className="border border-line border-b-0">
        <div className="flex items-center gap-0">
          <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">JWT</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder={TR[lang].placeholder}
            className="flex-1 bg-transparent font-mono text-[11.5px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2 resize-none leading-[1.6]"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="border border-line">
        {result?.error && (
          <div className="px-[14px] py-[14px]">
            <span className="font-mono text-[12px] text-danger">✕ {result.error}</span>
          </div>
        )}

        {result?.data && (
          <div className="divide-y divide-line">
            {/* Header */}
            {(["header", "payload"] as const).map((part) => (
              <div key={part}>
                <div className="flex items-center justify-between px-[14px] py-[9px] bg-bg border-b border-line">
                  <span className="font-mono text-[11px] text-dim">// {part}</span>
                  <button
                    onClick={() => copy(JSON.stringify(result.data![part], null, 2), part)}
                    className="font-mono text-[11px] text-dim hover:text-brand transition-colors"
                  >
                    {copied === part ? "✓" : i.copy}
                  </button>
                </div>
                <div className="bg-bg-code px-[14px] py-[12px]">
                  {Object.entries(result.data![part]).map(([k, v]) => (
                    <div key={k} className="flex gap-4 font-mono text-[12.5px] leading-[1.8]">
                      <span className="text-brand w-32 shrink-0">{k}</span>
                      <span className="text-fg-1 break-all">{formatClaim(k, v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Signature */}
            <div>
              <div className="px-[14px] py-[9px] bg-bg border-b border-line">
                <span className="font-mono text-[11px] text-dim">// signature</span>
              </div>
              <div className="bg-bg-code px-[14px] py-[12px]">
                <p className="font-mono text-[11px] text-dim-2 break-all">{result.data.signature}</p>
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center gap-4 px-[14px] py-2 bg-bg font-mono text-[11px] text-dim">
              <span>{result.data.header.alg ?? "—"}</span>
              {expiry && (
                <span className={expiry.expired ? "text-danger" : "text-ok"}>
                  {expiry.expired
                    ? TR[lang].expiredOn(expiry.date)
                    : TR[lang].expiresOn(expiry.date)}
                </span>
              )}
            </div>
          </div>
        )}

        {!input.trim() && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="font-mono text-[28px] text-dim">jwt</span>
            <span className="font-mono text-[12px] text-dim">
              {TR[lang].pasteAbove}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
