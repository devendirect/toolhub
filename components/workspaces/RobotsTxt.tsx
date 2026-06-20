"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { downloadBlob } from "@/lib/download";
import { useTrackRun } from "@/hooks/useTrackRun";

const AFFILIATE_IONOS     = process.env.NEXT_PUBLIC_AFFILIATE_IONOS;
const AFFILIATE_NAMECHEAP = process.env.NEXT_PUBLIC_AFFILIATE_NAMECHEAP;

interface Rule { agent: string; disallow: string; allow: string; }

const DEFAULT_RULES: Rule[] = [{ agent: "*", disallow: "/admin/", allow: "" }];

const TR = {
  fr: {
    addRule: "ajouter une règle",
  },
  en: {
    addRule: "add rule",
  },
} as const;

export function RobotsTxt() {
  const { lang } = useLang();
  const i = t(lang);
  const [rules, setRules] = useState<Rule[]>(DEFAULT_RULES);
  const [sitemap, setSitemap] = useState("");
  const { copy, copied } = useCopy();
  const trackRun = useTrackRun("robots-txt", "seo");
  const affiliateUrl = lang === "fr" ? AFFILIATE_IONOS : AFFILIATE_NAMECHEAP;

  const updateRule = (idx: number, patch: Partial<Rule>) =>
    setRules((prev) => prev.map((r, j) => (j === idx ? { ...r, ...patch } : r)));

  const addRule = () => setRules((prev) => [...prev, { agent: "*", disallow: "", allow: "" }]);
  const removeRule = (idx: number) => setRules((prev) => prev.filter((_, j) => j !== idx));

  const output = useMemo(() => {
    const lines: string[] = [];
    for (const rule of rules) {
      lines.push(`User-agent: ${rule.agent || "*"}`);
      if (rule.disallow) lines.push(`Disallow: ${rule.disallow}`);
      if (rule.allow) lines.push(`Allow: ${rule.allow}`);
      lines.push("");
    }
    if (sitemap.trim()) lines.push(`Sitemap: ${sitemap.trim()}`);
    return lines.join("\n").trim();
  }, [rules, sitemap]);

  const download = () => {
    downloadBlob(new Blob([output], { type: "text/plain" }), "robots.txt");
  };

  const field = (label: string, value: string, onChange: (v: string) => void, placeholder?: string) => (
    <div className="flex items-center gap-0 flex-1">
      <span className="font-mono text-[11px] text-dim px-3 py-[8px] border-r border-line bg-bg shrink-0">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent font-mono text-[12px] text-fg px-3 py-[8px] outline-none placeholder:text-dim-2"
        spellCheck={false}
      />
    </div>
  );

  return (
    <section className="mb-10">
      <div className="border border-line">
        {/* Rules */}
        <div className="divide-y divide-line">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex items-stretch gap-0 flex-wrap md:flex-nowrap">
              {field("User-agent", rule.agent, (v) => updateRule(idx, { agent: v }), "*")}
              <div className="border-l border-line" />
              {field("Disallow", rule.disallow, (v) => updateRule(idx, { disallow: v }), "/private/")}
              <div className="border-l border-line" />
              {field("Allow", rule.allow, (v) => updateRule(idx, { allow: v }), "/public/")}
              <div className="border-l border-line" />
              <button
                onClick={() => removeRule(idx)}
                disabled={rules.length <= 1}
                className="px-3 font-mono text-[12px] text-dim hover:text-danger transition-colors disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
              >✕</button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-[14px] py-[10px] border-t border-line bg-bg-1">
          <button onClick={addRule} className="font-mono text-[11px] text-dim hover:text-brand transition-colors">
            + {TR[lang].addRule}
          </button>
        </div>

        {/* Sitemap */}
        <div className="flex items-center gap-0 border-t border-line">
          <span className="font-mono text-[11px] text-dim px-3 py-[10px] border-r border-line bg-bg-1 shrink-0">Sitemap</span>
          <input
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            className="flex-1 bg-transparent font-mono text-[12px] text-fg px-4 py-[10px] outline-none placeholder:text-dim-2"
          />
        </div>

        {/* Output */}
        <div className="border-t border-line bg-bg-code">
          <div className="flex items-center justify-between px-[14px] py-[9px] border-b border-line">
            <span className="font-mono text-[11px] text-dim">// robots.txt</span>
            <div className="flex gap-2">
              <button onClick={download} className="font-mono text-[11px] text-dim hover:text-brand transition-colors">
                {i.download}
              </button>
              <button onClick={() => { trackRun(); copy(output); }} className="font-mono text-[11px] text-dim hover:text-brand transition-colors">
                {copied ? "✓" : i.copy}
              </button>
            </div>
          </div>
          <pre className="font-mono text-[12.5px] text-fg-1 leading-[1.65] p-[14px] whitespace-pre-wrap">{output}</pre>
        </div>
      </div>

      {affiliateUrl && (
        <div className="mt-4 p-4 border border-line bg-bg-1 flex items-start gap-4">
          <span className="font-mono text-[20px] shrink-0">↗</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">
              {lang === "fr" ? "votre site, votre domaine" : "your site, your domain"}
            </span>
            <p className="text-[13px] text-fg-1">
              {lang === "fr"
                ? "Prêt à mettre votre site en ligne ? Enregistrez votre domaine chez IONOS."
                : "Ready to put your site online? Register your domain with Namecheap."}
            </p>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-brand hover:underline"
            >
              {lang === "fr" ? "Trouver mon domaine →" : "Find my domain →"}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
