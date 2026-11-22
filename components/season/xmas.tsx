"use client";

import { useSyncExternalStore } from "react";
import { t } from "@/lib/i18n";
import { XMAS_TREE } from "@/lib/season";
import { useLang } from "@/components/providers/I18nProvider";

/**
 * Décors de Noël. Tout est rendu dans le DOM toute l'année mais masqué en CSS
 * (app/seasonal-xmas.css) tant que <html data-season="xmas"> n'est pas posé.
 * Tout est décoratif : aria-hidden, aucun lien, aucun impact sur le SEO.
 */

const BANNER_KEY = "xmas-2026-banner-closed";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const readClosed = () => {
  try { return localStorage.getItem(BANNER_KEY) === "1"; } catch { return false; }
};

export function XmasBanner() {
  const { lang } = useLang();
  const i = t(lang);
  // Lecture du stockage local sans setState dans un effet ; côté serveur : non fermé.
  const closed = useSyncExternalStore(subscribe, readClosed, () => false);

  if (closed) return null;

  return (
    <div className="xmas-banner relative z-[60] items-center justify-center gap-3 border-b border-brand-mid bg-brand-soft px-pad py-[7px] font-mono text-[12px] text-fg">
      <span aria-hidden>❄</span>
      <span>{i.xmasBanner}</span>
      <button
        type="button"
        aria-label={i.xmasClose}
        className="text-dim transition-colors hover:text-fg"
        onClick={() => {
          try { localStorage.setItem(BANNER_KEY, "1"); } catch { /* ignoré */ }
          listeners.forEach((l) => l());
        }}
      >
        ✕
      </button>
    </div>
  );
}

/** Fil festonné + ampoules, accroché sous le header (voir .xmas-garland). */
export function XmasGarland() {
  return (
    <div className="xmas-only xmas-garland" aria-hidden>
      <i className="w" />
      <i className="a" />
      <i className="b" />
    </div>
  );
}

/** Bonnet posé sur le coin du logo. */
export function XmasHat() {
  return (
    <svg
      className="xmas-only xmas-hat"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M3 18 Q6 4 16 3 Q15 8 21 17Z" fill="#ff4d5e" />
      <rect x="2" y="16" width="20" height="4.5" rx="2.2" fill="#fff" />
      <circle cx="18.5" cy="4" r="2.8" fill="#fff" />
    </svg>
  );
}

export function XmasSnow() {
  return <div className="xmas-only xmas-snow fixed inset-0 z-0 pointer-events-none" aria-hidden />;
}

/** Sapin ASCII : une couleur par type de caractère. */
export function XmasTree() {
  const cls: Record<string, string> = { "*": "s", o: "o", "^": "g", "|": "t" };
  return (
    <pre className="xmas-tree" aria-hidden>
      {XMAS_TREE.map((row, y) => (
        <span key={y}>
          {[...row].map((c, x) => (cls[c] ? <span key={x} className={cls[c]}>{c}</span> : c))}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}

/** Séquence « logs » au-dessus du hero. */
export function XmasLogs() {
  const { lang } = useLang();
  const i = t(lang);
  return (
    <div className="xmas-only mb-5 font-mono text-[12px] leading-[1.7] text-dim" aria-hidden>
      <div className="text-brand">$ noel --on</div>
      {[i.xmasLog1, i.xmasLog2, i.xmasLog3].map((l) => (
        <div key={l}><span className="text-ok">[ok]</span> {l}</div>
      ))}
    </div>
  );
}
