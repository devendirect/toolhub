"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useFetch } from "@/hooks/useFetch";
import { useTrackRun } from "@/hooks/useTrackRun";
import type { SeoCheck, SeoData } from "@/app/api/seo/route";

const TR = {
  fr: {
    seoPass:    "ok",
    seoWarning: "avertissement(s)",
    seoError:   "erreur(s)",
  },
  en: {
    seoPass:    "pass",
    seoWarning: "warning(s)",
    seoError:   "error(s)",
  },
} as const;

const AFFILIATE_SEMRUSH = process.env.NEXT_PUBLIC_AFFILIATE_SEMRUSH;

const STATUS_COLOR: Record<SeoCheck["status"], string> = {
  pass: "text-brand",
  warn: "text-hot",
  fail: "text-danger",
};
const STATUS_ICON: Record<SeoCheck["status"], string> = { pass: "✓", warn: "⚠", fail: "✕" };

function ScoreRing({ score }: { score: number }) {
  const r = 40; const circ = 2 * Math.PI * r;
  const color = score >= 80 ? "var(--brand)" : score >= 50 ? "var(--hot)" : "var(--danger)";
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={r} fill="none" stroke="var(--line)" strokeWidth={8} />
      <circle
        cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={8}
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={circ * (1 - score / 100)}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
      <text x={50} y={55} textAnchor="middle" fontSize={20} fontWeight={600} fontFamily="var(--font-mono)" fill={color}>
        {score}
      </text>
    </svg>
  );
}

export function SeoAnalyzer() {
  const { lang } = useLang();
  const i = t(lang);
  const [url, setUrl] = useState("https://nextjs.org");
  const { loading, error, data: seoData, run } = useFetch<SeoData>();
  const trackRun = useTrackRun("seo-analyzer", "seo");

  const analyze = () => {
    if (!url) return;
    trackRun();
    run(`/api/seo?url=${encodeURIComponent(url)}`);
  };

  const { pass: passCount, warn: warnCount, fail: failCount } = seoData?.checks.reduce(
    (acc, c) => { acc[c.status]++; return acc; },
    { pass: 0, warn: 0, fail: 0 }
  ) ?? { pass: 0, warn: 0, fail: 0 };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-0 border border-line border-b-0">
        <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
          placeholder="https://example.com"
          className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
          spellCheck={false}
        />
        <button
          onClick={analyze}
          disabled={loading || !url}
          className="px-[18px] py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold shrink-0 hover:brightness-110 transition-all disabled:opacity-50 border-l border-brand"
        >
          {loading ? "…" : i.analyzeBtn}
        </button>
      </div>

      <div className="border border-line border-t-0 min-h-[340px]">
        {error && (
          <div className="flex items-center gap-3 p-6">
            <span className="font-mono text-[12px] text-danger">✕ {error}</span>
            <button onClick={analyze} className="font-mono text-[11px] text-dim hover:text-brand transition-colors border border-line px-3 py-[5px]">
              {i.retry}
            </button>
          </div>
        )}

        {!seoData && !error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="font-mono text-[28px] text-dim">✓↗</span>
            <span className="font-mono text-[12px] text-dim">
              {i.enterUrlSeo}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12px] text-dim">
              {i.analyzing}
            </span>
          </div>
        )}

        {seoData && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] border-b border-line">
              <div className="flex items-center justify-center p-6 border-r border-line">
                <ScoreRing score={seoData.score} />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <div className="font-mono text-[11px] text-dim">{seoData.url}</div>
                <div className="flex gap-6">
                  <span className="font-mono text-[13px] text-brand">✓ {passCount} {TR[lang].seoPass}</span>
                  <span className="font-mono text-[13px] text-hot">⚠ {warnCount} {TR[lang].seoWarning}</span>
                  <span className="font-mono text-[13px] text-danger">✕ {failCount} {TR[lang].seoError}</span>
                </div>
                <div className="flex gap-6 font-mono text-[11px] text-dim">
                  {seoData.wordCount > 0 && <span>{seoData.wordCount} {i.wordsLabel}</span>}
                  {seoData.h1 && <span>H1: {seoData.h1.slice(0, 40)}</span>}
                </div>
              </div>
            </div>

            <div className="divide-y divide-line">
              {seoData.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-4 px-[14px] py-[11px]">
                  <span className={`font-mono text-[13px] w-4 shrink-0 ${STATUS_COLOR[check.status]}`}>
                    {STATUS_ICON[check.status]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-medium">{check.label}</span>
                      <span className="font-mono text-[10px] text-dim">
                        {check.points}/{check.max}pts
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-dim-2 mt-[2px] truncate">{check.detail}</div>
                  </div>
                  <div className="w-20 h-1 bg-bg-2 rounded-full mt-2 shrink-0">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(check.points / check.max) * 100}%`,
                        background: check.status === "pass" ? "var(--brand)" : check.status === "warn" ? "var(--hot)" : "var(--danger)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-hot mr-1" />
          {i.proxied30min}
        </div>
      </div>

      {AFFILIATE_SEMRUSH && seoData && seoData.score < 100 && (
        <div className="mt-4 p-4 border border-line bg-bg-1 flex items-start gap-4">
          <span className="font-mono text-[20px] shrink-0">↗</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">
              {lang === "fr" ? "aller plus loin" : "go further"}
            </span>
            <p className="text-[13px] text-fg-1">
              {lang === "fr"
                ? "Analyse complète : mots-clés, backlinks, concurrents — avec Semrush."
                : "Full audit: keywords, backlinks, competitors — with Semrush."}
            </p>
            <a
              href={AFFILIATE_SEMRUSH}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-brand hover:underline"
            >
              {lang === "fr" ? "Essayer Semrush gratuitement →" : "Try Semrush for free →"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
