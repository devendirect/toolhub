"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { t } from "@/lib/i18n";
import { SEASON_IDS, type SeasonId } from "@/lib/season";
import { DECOR } from "@/lib/season-decor";
import { useLang } from "@/components/providers/I18nProvider";

/**
 * Décors saisonniers. La saison active est lue sur <html data-season> (posé par
 * le script inline de lib/season-script.ts avant le premier rendu). Côté serveur
 * elle vaut null : rien n'est écrit dans le HTML hors saison, les décors
 * apparaissent à l'hydratation. Des « slots » CSS réservent la place du bandeau
 * et des logs pour éviter tout décalage de mise en page.
 * Tout est décoratif : aria-hidden, aucun lien, aucun impact sur le SEO.
 */

const noop = () => () => {};

function readSeason(): SeasonId | null {
  const v = document.documentElement.getAttribute("data-season");
  return (SEASON_IDS as readonly string[]).includes(v ?? "") ? (v as SeasonId) : null;
}

export function useSeason(): SeasonId | null {
  return useSyncExternalStore(noop, readSeason, () => null);
}

/** Horloge à la seconde, active seulement si `on` (compte à rebours du Nouvel An). */
function useSecond(on: boolean): number {
  return useSyncExternalStore(
    on ? (cb) => { const id = setInterval(cb, 1000); return () => clearInterval(id); } : noop,
    () => Math.floor(Date.now() / 1000),
    () => 0,
  );
}

/** Année à venir : en décembre, l'année suivante ; en janvier, l'année en cours. */
const newYear = (now: Date) => (now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear());

/** Rand déterministe (évite Math.random au rendu) : 0..1 */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ── Bandeau fermable (un par saison, mémorisé) ─────────────────────────── */
export function SeasonBanner() {
  const id = useSeason();
  const { lang } = useLang();
  const i = t(lang);
  const now = new Date(useSecond(false) * 1000);

  return (
    <div className="season-banner-slot">
      {id && (
        <div className="season-banner relative z-[60] flex items-center justify-center gap-3 border-b border-brand-mid bg-brand-soft px-pad py-[7px] font-mono text-[12px] text-fg">
          <span>{DECOR[id].banner[lang].replace("{year}", String(newYear(now)))}</span>
          <button
            type="button"
            aria-label={i.seasonClose}
            className="text-dim transition-colors hover:text-fg"
            onClick={() => {
              document.documentElement.setAttribute("data-season-banner", "closed");
              try { localStorage.setItem("season-banner-closed", id); } catch { /* ignoré */ }
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Calques fixes : lueur + particules ─────────────────────────────────── */
export function SeasonDecor() {
  const id = useSeason();
  if (!id) return null;
  const p = DECOR[id].particles;
  return (
    <>
      <div className="season-glow" aria-hidden />
      {p && (
        <div className={`season-parts${p.up ? " up" : ""}`} aria-hidden>
          {Array.from({ length: p.n }, (_, k) => (
            <span
              key={k}
              style={{
                "--l": `${rnd(k, 1) * 98}%`,
                "--s": `${p.size[0] + rnd(k, 2) * (p.size[1] - p.size[0])}px`,
                "--c": p.colors[k % p.colors.length],
                "--d": `${9 + rnd(k, 3) * 10}s`,
                "--dl": `${-rnd(k, 4) * 16}s`,
              } as CSSProperties}
            >
              {p.chars[k % p.chars.length]}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

/* ── Sur le coin du logo : bonnet (Noël) ou petit symbole ───────────────── */
export function SeasonSym() {
  const id = useSeason();
  if (!id) return null;
  if (id === "xmas") {
    return (
      <svg className="xmas-hat" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path d="M3 18 Q6 4 16 3 Q15 8 21 17Z" fill="#ff4d5e" />
        <rect x="2" y="16" width="20" height="4.5" rx="2.2" fill="#fff" />
        <circle cx="18.5" cy="4" r="2.8" fill="#fff" />
      </svg>
    );
  }
  const sym = DECOR[id].sym;
  return sym ? <span className="season-sym" aria-hidden>{sym}</span> : null;
}

/* ── Guirlande (Noël) accrochée sous le header ──────────────────────────── */
export function SeasonGarland() {
  if (useSeason() !== "xmas") return null;
  return (
    <div className="xmas-garland" aria-hidden>
      <i className="w" />
      <i className="a" />
      <i className="b" />
    </div>
  );
}

/* ── Accueil : logs sous le prompt ──────────────────────────────────────── */
export function SeasonLogs() {
  const id = useSeason();
  const { lang } = useLang();
  const sec = useSecond(id === "newyear");

  let prompt = "";
  let lines: string[] = [];
  if (id) {
    const now = new Date(sec * 1000);
    const year = newYear(now);
    prompt = DECOR[id].prompt[lang].replace("{year}", String(year));
    lines = DECOR[id].logs[lang];
    if (id === "newyear") {
      const left = Math.max(0, new Date(year, 0, 1).getTime() - now.getTime());
      const dd = Math.floor(left / 864e5);
      const hms = [Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60]
        .map((n) => String(n).padStart(2, "0")).join(":");
      const archived = lang === "fr" ? `[ok] ${year - 1} archivée` : `[ok] ${year - 1} archived`;
      lines = now.getMonth() === 11
        ? [archived, `[run] t-minus ${dd}j ${hms}`]
        : [archived, lang === "fr" ? `[ok] ${year} chargée` : `[ok] ${year} loaded`];
    }
  }

  return (
    <div className="season-logs-slot">
      {id && (
        <div className="pb-5 font-mono text-[12px] leading-[1.7] text-dim" aria-hidden>
          <div className="text-brand">{prompt}</div>
          {lines.map((l) => {
            const m = /^\[(\w+)\](.*)$/.exec(l);
            return m
              ? <div key={l}><span className={m[1] === "run" ? "text-brand" : "text-ok"}>[{m[1]}]</span>{m[2]}</div>
              : <div key={l}>{l}</div>;
          })}
        </div>
      )}
    </div>
  );
}

/* ── Accueil : dessin ASCII à droite du hero (grands écrans) ────────────── */
const DIGITS: Record<string, string[]> = {
  "0": ["111", "101", "101", "101", "111"], "1": ["010", "110", "010", "010", "111"],
  "2": ["111", "001", "111", "100", "111"], "3": ["111", "001", "111", "001", "111"],
  "4": ["101", "101", "111", "001", "001"], "5": ["111", "100", "111", "001", "111"],
  "6": ["111", "100", "111", "101", "111"], "7": ["111", "001", "001", "001", "001"],
  "8": ["111", "101", "111", "101", "111"], "9": ["111", "101", "111", "001", "111"],
};

function yearArt(year: number): string[] {
  return Array.from({ length: 5 }, (_, r) =>
    [...String(year)]
      .map((ch) => [...(DIGITS[ch]?.[r] ?? "000")].map((b) => (b === "1" ? "██" : "  ")).join(""))
      .join("  "),
  );
}

export function SeasonArt() {
  const id = useSeason();
  const sec = useSecond(false);
  if (!id) return null;
  const d = DECOR[id];
  if (!d.art) return null;
  const rows = d.art === "year" ? yearArt(newYear(new Date(sec * 1000))) : d.art;
  return (
    <pre className="season-art" style={{ color: d.artFallback }} aria-hidden>
      {rows.map((row, y) => (
        <span key={y}>
          {[...row].map((c, x) => (d.artColors?.[c] ? <span key={x} style={{ color: d.artColors[c] }}>{c}</span> : c))}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}
