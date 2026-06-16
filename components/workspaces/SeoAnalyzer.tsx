"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import type { SeoCheck } from "@/app/api/seo/route";

interface SeoResult {
  url: string; score: number; title: string;
  description: string; wordCount: number; h1: string;
  checks: SeoCheck[];
}

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
  const [url, setUrl] = useState("https://nextjs.org");
  const [result, setResult] = useState<SeoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!url) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`/api/seo?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error);
      setResult(json);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const passCount = result?.checks.filter((c) => c.status === "pass").length ?? 0;
  const warnCount = result?.checks.filter((c) => c.status === "warn").length ?? 0;
  const failCount = result?.checks.filter((c) => c.status === "fail").length ?? 0;

  return (
    <section className="mb-10">
      {/* URL bar */}
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
          {loading ? "…" : (lang === "fr" ? "analyser ⏎" : "analyze ⏎")}
        </button>
      </div>

      <div className="border border-line border-t-0 min-h-[340px]">
        {error && <div className="p-6 font-mono text-[12px] text-danger">✕ {error}</div>}

        {!result && !error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="font-mono text-[28px] text-dim">✓↗</span>
            <span className="font-mono text-[12px] text-dim">
              {lang === "fr" ? "entrez une URL et cliquez analyser" : "enter a URL and click analyze"}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12px] text-dim">
              {lang === "fr" ? "analyse en cours…" : "analyzing…"}
            </span>
          </div>
        )}

        {result && (
          <div>
            {/* Score header */}
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] border-b border-line">
              <div className="flex items-center justify-center p-6 border-r border-line">
                <ScoreRing score={result.score} />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <div className="font-mono text-[11px] text-dim">{result.url}</div>
                <div className="flex gap-6">
                  <span className="font-mono text-[13px] text-brand">✓ {passCount} {lang === "fr" ? "ok" : "pass"}</span>
                  <span className="font-mono text-[13px] text-hot">⚠ {warnCount} {lang === "fr" ? "avertissement(s)" : "warning(s)"}</span>
                  <span className="font-mono text-[13px] text-danger">✕ {failCount} {lang === "fr" ? "erreur(s)" : "error(s)"}</span>
                </div>
                <div className="flex gap-6 font-mono text-[11px] text-dim">
                  {result.wordCount > 0 && <span>{result.wordCount} {lang === "fr" ? "mots" : "words"}</span>}
                  {result.h1 && <span>H1: {result.h1.slice(0, 40)}</span>}
                </div>
              </div>
            </div>

            {/* Checks */}
            <div className="divide-y divide-line">
              {result.checks.map((check) => (
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
                  {/* Points bar */}
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
          {lang === "fr" ? "récupération via proxy — résultat mis en cache 30 min en mémoire, aucun log persistant" : "proxied fetch — result cached 30 min in memory, no persistent log"}
        </div>
      </div>
    </section>
  );
}
