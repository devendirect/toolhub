"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { downloadBlob } from "@/lib/download";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

const FREQ_OPTIONS: Freq[] = ["daily", "weekly", "monthly", "yearly"];

const TR = {
  fr: {
    urlsPerLine: "URLs (une par ligne)",
  },
  en: {
    urlsPerLine: "URLs (one per line)",
  },
} as const;

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function SitemapGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const [urlInput, setUrlInput] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/contact");
  const [freq, setFreq] = useState<Freq>("monthly");
  const [priority, setPriority] = useState("0.8");
  const [lastmod, setLastmod] = useState(new Date().toISOString().slice(0, 10));
  const { copy, copied } = useCopy();

  const urls = useMemo(() =>
    urlInput.split(/\r?\n/).map((u) => u.trim()).filter((u) => u.length > 0),
    [urlInput]
  );

  const xml = useMemo(() => {
    const items = urls.map((url) =>
      `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    ).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [urls, freq, priority, lastmod]);

  const download = () => {
    downloadBlob(new Blob([xml], { type: "application/xml" }), "sitemap.xml");
  };

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <div className="flex gap-2">
            <button onClick={download} className="px-[14px] py-2 font-mono text-[12px] text-dim border border-line rounded-[3px] hover:text-brand hover:border-brand-mid transition-colors">
              {i.download}
            </button>
            <button onClick={() => copy(xml)} className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all">
              {copied ? "✓" : "copy XML ⏎"}
            </button>
          </div>
        }
      >
        <OptBlock label="changefreq">
          <SegControl options={FREQ_OPTIONS} value={freq} onChange={(v) => setFreq(v as Freq)} />
        </OptBlock>
        <OptBlock label="priority">
          <SegControl options={["0.5", "0.8", "1.0"]} value={priority} onChange={(v) => setPriority(v as string)} />
        </OptBlock>
      </OptionsBar>

      <div className="grid grid-cols-1 md:grid-cols-2 border border-line">
        {/* URLs input */}
        <div className="border-r border-line">
          <div className="flex items-center gap-2 px-[14px] py-[9px] border-b border-line">
            <span className="font-mono text-[11px] text-dim">
              // {TR[lang].urlsPerLine}
            </span>
            <span className="font-mono text-[11px] text-dim ml-auto">{urls.length}</span>
          </div>
          <div className="p-[14px] bg-bg-code">
            <textarea
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full min-h-[280px] bg-transparent font-mono text-[12.5px] text-fg leading-[1.65] outline-none resize-none"
              spellCheck={false}
            />
          </div>
          <div className="flex items-center gap-3 px-[14px] py-[9px] border-t border-line">
            <span className="font-mono text-[11px] text-dim">lastmod</span>
            <input
              type="date"
              value={lastmod}
              onChange={(e) => setLastmod(e.target.value)}
              className="font-mono text-[12px] bg-transparent text-fg outline-none"
            />
          </div>
        </div>

        {/* XML output */}
        <div>
          <div className="flex items-center gap-2 px-[14px] py-[9px] border-b border-line">
            <span className="font-mono text-[11px] text-dim">// sitemap.xml</span>
          </div>
          <div className="p-[14px] bg-bg-code">
            <pre className="font-mono text-[11px] text-fg-1 leading-[1.65] whitespace-pre-wrap min-h-[280px] overflow-auto">{xml}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
