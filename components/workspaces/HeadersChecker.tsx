"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useFetch } from "@/hooks/useFetch";
import type { HeaderCheck, HeadersData } from "@/app/api/headers/route";

const TR = {
  fr: {
    gradeLabel: "note globale",
    server:     "serveur",
    enterUrl:   "entrez une URL et cliquez analyser",
    present:    "présent",
    warn:       "attention",
    missing:    "absent",
    errors: {
      rate_limit:    { msg: "Trop de requêtes",                       action: "Réessayez dans 1 minute" },
      invalid_url:   { msg: "URL invalide",                           action: "Vérifiez le format — ex : https://example.com" },
      private_url:   { msg: "Adresse privée ou locale non autorisée", action: "Utilisez une URL publiquement accessible" },
      timeout:       { msg: "Délai dépassé (10 s)",                   action: "Le serveur est trop lent ou inaccessible — vérifiez l'URL et réessayez" },
      network_error: { msg: "Erreur réseau",                          action: "Vérifiez que l'URL est accessible publiquement, puis réessayez" },
    },
  },
  en: {
    gradeLabel: "overall grade",
    server:     "server",
    enterUrl:   "enter a URL and click analyze",
    present:    "present",
    warn:       "warning",
    missing:    "missing",
    errors: {
      rate_limit:    { msg: "Too many requests",                      action: "Try again in 1 minute" },
      invalid_url:   { msg: "Invalid URL",                            action: "Check the format — e.g. https://example.com" },
      private_url:   { msg: "Private or local address not allowed",   action: "Use a publicly accessible URL" },
      timeout:       { msg: "Request timed out (10s)",                action: "The server is too slow or unreachable — check the URL and try again" },
      network_error: { msg: "Network error",                          action: "Make sure the URL is publicly accessible, then try again" },
    },
  },
} as const;

const STATUS_COLOR: Record<HeaderCheck["status"], string> = {
  present: "text-brand",
  warn:    "text-hot",
  missing: "text-danger",
};

const STATUS_ICON: Record<HeaderCheck["status"], string> = {
  present: "✓",
  warn:    "⚠",
  missing: "✕",
};

const GRADE_COLOR: Record<HeadersData["grade"], string> = {
  A: "text-brand",
  B: "text-ok",
  C: "text-hot",
  D: "text-danger",
  F: "text-danger",
};

export function HeadersChecker() {
  const { lang } = useLang();
  const i = t(lang);
  const [url, setUrl] = useState("https://nextjs.org");
  const { loading, error, data, run } = useFetch<HeadersData>();

  const analyze = () => {
    if (!url.trim()) return;
    run(`/api/headers?url=${encodeURIComponent(url.trim())}&lang=${lang}`);
  };

  const statusLabel = useMemo<Record<HeaderCheck["status"], string>>(
    () => ({
      present: TR[lang].present,
      warn:    TR[lang].warn,
      missing: TR[lang].missing,
    }),
    [lang]
  );

  const errMap = TR[lang].errors as Record<string, { msg: string; action: string } | undefined>;
  const errInfo = error ? errMap[error] : null;

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
          disabled={loading || !url.trim()}
          className="px-[18px] py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold shrink-0 hover:brightness-110 transition-all disabled:opacity-50 border-l border-brand"
        >
          {loading ? "…" : i.analyzeBtn}
        </button>
      </div>

      <div className="border border-line border-t-0 min-h-[320px]">
        {error && (
          <div className="p-6 flex flex-col gap-[6px]">
            <p className="font-mono text-[12px] text-danger">✕ {errInfo?.msg ?? error}</p>
            {errInfo?.action && (
              <p className="font-mono text-[11px] text-dim">{errInfo.action}</p>
            )}
            <button
              onClick={analyze}
              className="self-start font-mono text-[11px] text-dim hover:text-brand transition-colors border border-line px-3 py-[5px] mt-1"
            >
              {i.retry}
            </button>
          </div>
        )}

        {!data && !error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="font-mono text-[28px] text-dim">H:✓</span>
            <span className="font-mono text-[12px] text-dim">{TR[lang].enterUrl}</span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12px] text-dim">{i.analyzing}</span>
          </div>
        )}

        {data && (
          <div>
            <div className="flex items-center gap-6 px-6 py-5 border-b border-line">
              <div className="flex flex-col items-center shrink-0">
                <span className={`font-mono text-[48px] font-bold leading-none ${GRADE_COLOR[data.grade]}`}>
                  {data.grade}
                </span>
                <span className="font-mono text-[10px] text-dim mt-1">{TR[lang].gradeLabel}</span>
              </div>
              <div className="flex flex-col gap-1 font-mono text-[11px] min-w-0">
                <span className="text-dim truncate">{data.url}</span>
                {data.server && (
                  <span className="text-dim-2">{TR[lang].server}: {data.server}</span>
                )}
              </div>
            </div>

            <div className="divide-y divide-line">
              {data.checks.map((check) => (
                <div key={check.name} className="flex items-start gap-4 px-[14px] py-[11px]">
                  <span className={`font-mono text-[13px] w-4 shrink-0 mt-[1px] ${STATUS_COLOR[check.status]}`}>
                    {STATUS_ICON[check.status]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-[12.5px] font-medium text-fg">{check.name}</span>
                      <span className={`font-mono text-[10px] ${STATUS_COLOR[check.status]}`}>
                        {statusLabel[check.status]}
                      </span>
                    </div>
                    {check.value && (
                      <p className="font-mono text-[11px] text-dim-2 mt-[2px] truncate">{check.value}</p>
                    )}
                    {check.note && (
                      <p className="font-mono text-[11px] text-dim mt-[2px]">{check.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-hot shrink-0" />
          {i.proxied30min}
        </div>
      </div>
    </section>
  );
}
