"use client";

import { useState, useCallback, useEffect } from "react";
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

export interface PwOptions { upper: boolean; digits: boolean; symbols: boolean; noAmbiguous: boolean }

/** Familles de caractères actives, déjà privées des caractères ambigus si demandé. */
function groups(opts: PwOptions): string[] {
  const g = [CHARS.lower];
  if (opts.upper) g.push(CHARS.upper);
  if (opts.digits) g.push(CHARS.digits);
  if (opts.symbols) g.push(CHARS.symbols);
  return opts.noAmbiguous ? g.map((set) => [...set].filter((c) => !CHARS.ambiguous.includes(c)).join("")) : g;
}

/**
 * Index uniforme dans [0, max) : tirage avec rejet. Un simple « n % max »
 * favorisait légèrement les premiers caractères de l'alphabet.
 */
function randomIndex(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf); while (buf[0]! >= limit);
  return buf[0]! % max;
}

export function generate(length: number, opts: PwOptions): string {
  const sets = groups(opts);
  const charset = sets.join("");
  if (!charset) return "";
  // Chaque famille cochée doit apparaître (sinon « chiffres activés » pouvait
  // donner un mot de passe sans chiffre, refusé par les formulaires). On retire
  // jusqu'à obtenir un tirage conforme : la distribution reste uniforme parmi
  // les mots de passe valides.
  for (let attempt = 0; attempt < 1000; attempt++) {
    const pw = Array.from({ length }, () => charset[randomIndex(charset.length)]).join("");
    if (length < sets.length || sets.every((set) => [...pw].some((c) => set.includes(c)))) return pw;
  }
  return Array.from({ length }, () => charset[randomIndex(charset.length)]).join("");
}

/** Entropie réelle du générateur : longueur × log2(taille de l'alphabet utilisé). */
export function entropyBits(length: number, opts: PwOptions): number {
  const size = groups(opts).join("").length;
  return size ? Math.floor(length * Math.log2(size)) : 0;
}

function strengthLabel(bits: number, lang: Lang): { label: string; color: string } {
  if (bits < 40) return { label: TR[lang].weak,      color: "text-danger" };
  if (bits < 60) return { label: TR[lang].fair,      color: "text-hot" };
  if (bits < 80) return { label: TR[lang].strong,    color: "text-brand" };
  return           { label: TR[lang].veryStrong,     color: "text-brand" };
}

const AFFILIATE_NORDPASS = process.env.NEXT_PUBLIC_AFFILIATE_NORDPASS;

const COUNT = 5;

export function PasswordGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const [length, setLength] = useState<Length>(16);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  // Jamais de tirage pendant le rendu : la page est prérendue au build, et des
  // mots de passe générés côté serveur étaient figés dans le HTML en cache,
  // identiques pour tous les visiteurs et lisibles dans le code source.
  // Même schéma que UuidGenerator : liste vide, puis tirage une fois monté.
  const [passwords, setPasswords] = useState<string[]>([]);
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("password-generator", "design");

  const regen = useCallback((l: Length, opts: PwOptions) => {
    setPasswords(Array.from({ length: COUNT }, () => generate(l, opts)));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    regen(16, { upper: true, digits: true, symbols: false, noAmbiguous: false });
  }, [regen]);

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
            <span className="text-dim">{"// "}</span>
            <span className="text-fg">{TR[lang].passwords}</span>
          </span>
          <span className="font-mono text-[11px] text-dim">{COUNT} suggestions</span>
        </div>

        <div className="bg-bg-code divide-y divide-line">
          {passwords.map((pw, idx) => {
            const bits = entropyBits(pw.length, opts);
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
      {AFFILIATE_NORDPASS && (
        <div className="mt-4 p-4 border border-line bg-bg-1 flex items-start gap-4">
          <span className="font-mono text-[20px] text-brand shrink-0">🔑</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">
              {lang === "fr" ? "stocker vos mots de passe" : "store your passwords"}
            </span>
            <p className="text-[13px] text-fg-1">
              {lang === "fr"
                ? "Un bon mot de passe ne sert à rien s'il est dans un post-it. NordPass le stocke et le remplit automatiquement."
                : "A strong password is useless on a sticky note. NordPass stores and autofills it for you."}
            </p>
            <a
              href={AFFILIATE_NORDPASS}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-brand hover:underline"
            >
              {lang === "fr" ? "Essayer NordPass →" : "Try NordPass →"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
