"use client";

import { useState, useCallback } from "react";
import { useCopy } from "@/hooks/useCopy";
import { useLang } from "@/components/providers/I18nProvider";
import { OptionsBar, OptBlock, SegControl, Toggle } from "@/components/workspace/OptionsBar";
import { t } from "@/lib/i18n";
import { useTrackRun } from "@/hooks/useTrackRun";
import type { Lang } from "@/lib/types";

const TR = {
  fr: {
    lengthLabel: "longueur",
    noAmbig:     "sans ambig.",
    passwords:   "mots de passe",
    weak:        "faible",
    fair:        "moyen",
    strong:      "fort",
    veryStrong:  "très fort",
  },
  en: {
    lengthLabel: "length",
    noAmbig:     "no ambig.",
    passwords:   "passwords",
    weak:        "weak",
    fair:        "fair",
    strong:      "strong",
    veryStrong:  "very strong",
  },
} as const;

type Length = 8 | 12 | 16 | 24 | 32;

const CHARS = {
  lower:   "abcdefghijklmnopqrstuvwxyz",
  upper:   "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits:  "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  ambiguous: "l1IO0B8",
};

function generate(length: number, opts: { upper: boolean; digits: boolean; symbols: boolean; noAmbiguous: boolean }): string {
  let charset = CHARS.lower;
  if (opts.upper) charset += CHARS.upper;
  if (opts.digits) charset += CHARS.digits;
  if (opts.symbols) charset += CHARS.symbols;
  if (opts.noAmbiguous) charset = charset.split("").filter((c) => !CHARS.ambiguous.includes(c)).join("");
  if (!charset) return "";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => charset[n % charset.length]).join("");
}

function entropy(pw: string): number {
  const charsets = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
  const pool = charsets.reduce((s, r) => s + (r.test(pw) ? (r === charsets[0] || r === charsets[1] ? 26 : r === charsets[2] ? 10 : 32) : 0), 0);
  return Math.floor(pw.length * Math.log2(pool || 1));
}

function strengthLabel(bits: number, lang: Lang): { label: string; color: string } {
  if (bits < 40) return { label: TR[lang].weak,      color: "text-danger" };
  if (bits < 60) return { label: TR[lang].fair,      color: "text-hot" };
  if (bits < 80) return { label: TR[lang].strong,    color: "text-brand" };
  return           { label: TR[lang].veryStrong,     color: "text-brand" };
}

const AFFILIATE_1PASSWORD = process.env.NEXT_PUBLIC_AFFILIATE_1PASSWORD;

const COUNT = 5;

export function PasswordGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const [length, setLength] = useState<Length>(16);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [passwords, setPasswords] = useState<string[]>(() =>
    Array.from({ length: COUNT }, () => generate(16, { upper: true, digits: true, symbols: false, noAmbiguous: false }))
  );
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("password-generator", "design");

  const regen = useCallback((l: Length, opts: { upper: boolean; digits: boolean; symbols: boolean; noAmbiguous: boolean }) => {
    setPasswords(Array.from({ length: COUNT }, () => generate(l, opts)));
  }, []);

  const opts = { upper, digits, symbols, noAmbiguous };

  const handleCopy = (pw: string, idx: number) => { trackRun(); copy(pw, String(idx)); };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => regen(length, opts)}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
          >
            {i.generateBtn}
          </button>
        }
      >
        <OptBlock label={TR[lang].lengthLabel}>
          <SegControl
            options={[8, 12, 16, 24, 32] as Length[]}
            value={length}
            onChange={(v) => { setLength(v as Length); regen(v as Length, opts); }}
          />
        </OptBlock>
        <OptBlock label="A-Z">
          <Toggle on={upper} onChange={(v) => { setUpper(v); regen(length, { ...opts, upper: v }); }} />
        </OptBlock>
        <OptBlock label="0-9">
          <Toggle on={digits} onChange={(v) => { setDigits(v); regen(length, { ...opts, digits: v }); }} />
        </OptBlock>
        <OptBlock label="!@#">
          <Toggle on={symbols} onChange={(v) => { setSymbols(v); regen(length, { ...opts, symbols: v }); }} />
        </OptBlock>
        <OptBlock label={TR[lang].noAmbig}>
          <Toggle on={noAmbiguous} onChange={(v) => { setNoAmbiguous(v); regen(length, { ...opts, noAmbiguous: v }); }} />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line">
        <div className="flex items-center gap-4 px-[14px] py-[10px] border-b border-line bg-bg text-[12px]">
          <span className="font-mono">
            <span className="text-dim">// </span>
            <span className="text-fg">{TR[lang].passwords}</span>
          </span>
          <span className="font-mono text-[11px] text-dim">{COUNT} suggestions</span>
        </div>

        <div className="bg-bg-code divide-y divide-line">
          {passwords.map((pw, idx) => {
            const bits = entropy(pw);
            const { label, color } = strengthLabel(bits, lang);
            return (
              <div
                key={idx}
                className="group flex items-center gap-4 px-[18px] py-[13px] hover:bg-bg-2 transition-colors cursor-pointer"
                onClick={() => handleCopy(pw, idx)}
              >
                <span className="font-mono text-[11px] text-dim-2 w-6 shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[13px] text-fg tracking-[0.06em] flex-1 break-all">{pw}</span>
                <span className={`font-mono text-[11px] ${color} shrink-0 w-16 text-right`}>{label}</span>
                <span className="font-mono text-[11px] text-dim shrink-0 w-12 text-right">{bits}b</span>
                <span className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 transition-opacity ml-1 w-12 text-right">
                  {copied === String(idx) ? "✓" : i.copy}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span>crypto.getRandomValues()</span>
          <span>{i.clickToCopy}</span>
        </div>
      </div>

      {AFFILIATE_1PASSWORD && (
        <div className="mt-4 p-4 border border-line bg-bg-1 flex items-start gap-4">
          <span className="font-mono text-[20px] shrink-0">🔑</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">
              {lang === "fr" ? "stocker en sécurité" : "store it safely"}
            </span>
            <p className="text-[13px] text-fg-1">
              {lang === "fr"
                ? "Un bon mot de passe ne sert à rien s'il est perdu. Stocke-le avec 1Password — essai gratuit 14 jours."
                : "A strong password means nothing if you lose it. Store it with 1Password — free 14-day trial."}
            </p>
            <a
              href={AFFILIATE_1PASSWORD}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-brand hover:underline"
            >
              {lang === "fr" ? "Essayer 1Password →" : "Try 1Password →"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
