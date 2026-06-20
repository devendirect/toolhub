"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";

const PRESETS = [
  { label: "Google CPC",  source: "google",     medium: "cpc"    },
  { label: "Facebook",    source: "facebook",   medium: "social" },
  { label: "Email",       source: "newsletter", medium: "email"  },
  { label: "Twitter / X", source: "twitter",    medium: "social" },
] as const;

const TR = {
  fr: {
    baseUrl:    "URL de base",
    source:     "source",
    medium:     "canal",
    campaign:   "campagne",
    term:       "terme (optionnel)",
    content:    "contenu (optionnel)",
    result:     "URL construite",
    fillFields: "remplissez URL, source, canal et campagne",
    presets:    "exemples",
  },
  en: {
    baseUrl:    "base URL",
    source:     "source",
    medium:     "medium",
    campaign:   "campaign",
    term:       "term (optional)",
    content:    "content (optional)",
    result:     "built URL",
    fillFields: "fill URL, source, medium and campaign",
    presets:    "presets",
  },
} as const;

interface FieldRowProps {
  label:     string;
  value:     string;
  onChange:  (v: string) => void;
  placeholder?: string;
}

function FieldRow({ label, value, onChange, placeholder }: FieldRowProps) {
  return (
    <div className="flex items-center gap-0 border-b border-line last:border-b-0">
      <span className="font-mono text-[11px] text-dim px-4 py-[11px] w-48 shrink-0 bg-bg-1 border-r border-line">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
        spellCheck={false}
      />
    </div>
  );
}

function buildUtm(
  url: string, source: string, medium: string, campaign: string,
  term: string, content: string
): string | null {
  if (!url.trim() || !source.trim() || !medium.trim() || !campaign.trim()) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    u.searchParams.set("utm_source",   source.trim());
    u.searchParams.set("utm_medium",   medium.trim());
    u.searchParams.set("utm_campaign", campaign.trim());
    if (term.trim())    u.searchParams.set("utm_term",    term.trim());
    if (content.trim()) u.searchParams.set("utm_content", content.trim());
    return u.toString();
  } catch {
    return null;
  }
}

export function UtmBuilder() {
  const { lang } = useLang();
  const i = t(lang);
  const { copy, copied } = useCopy();

  const [url,      setUrl]      = useState("https://example.com");
  const [source,   setSource]   = useState("google");
  const [medium,   setMedium]   = useState("cpc");
  const [campaign, setCampaign] = useState("spring_sale_2026");
  const [term,     setTerm]     = useState("");
  const [content,  setContent]  = useState("");

  const result = useMemo(
    () => buildUtm(url, source, medium, campaign, term, content),
    [url, source, medium, campaign, term, content]
  );

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 px-[14px] py-[9px] border border-line border-b-0 bg-bg">
        <span className="font-mono text-[10px] text-dim-2 uppercase tracking-[0.1em] mr-1">
          {TR[lang].presets}
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => { setSource(p.source); setMedium(p.medium); }}
            className="font-mono text-[11px] px-[8px] py-[3px] border border-line text-dim hover:border-brand-mid hover:text-brand transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="border border-line">
        <FieldRow label={TR[lang].baseUrl}  value={url}      onChange={setUrl}      placeholder="https://example.com" />
        <FieldRow label={TR[lang].source}   value={source}   onChange={setSource}   placeholder="google" />
        <FieldRow label={TR[lang].medium}   value={medium}   onChange={setMedium}   placeholder="cpc" />
        <FieldRow label={TR[lang].campaign} value={campaign} onChange={setCampaign} placeholder="spring_sale" />
        <FieldRow label={TR[lang].term}     value={term}     onChange={setTerm}     />
        <FieldRow label={TR[lang].content}  value={content}  onChange={setContent}  />
      </div>

      <div className="border border-line border-t-0">
        <div className="flex items-center justify-between px-[14px] py-[9px] bg-bg-1 border-b border-line">
          <span className="font-mono text-[11px] text-dim">// {TR[lang].result}</span>
          <button
            onClick={() => result && copy(result)}
            disabled={!result}
            className="font-mono text-[11px] text-dim hover:text-brand transition-colors disabled:opacity-30"
          >
            {copied ? "✓" : i.copy}
          </button>
        </div>
        <div
          className="p-[14px] bg-bg-code min-h-[64px] cursor-pointer"
          onClick={() => result && copy(result)}
        >
          {result ? (
            <p className="font-mono text-[12.5px] text-brand leading-[1.6] break-all">{result}</p>
          ) : (
            <p className="font-mono text-[12px] text-dim-2">{TR[lang].fillFields}</p>
          )}
        </div>
      </div>
    </section>
  );
}
