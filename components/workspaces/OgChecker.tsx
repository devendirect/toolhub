"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { useFetch } from "@/hooks/useFetch";
import type { MetaData } from "@/app/api/meta/route";

const GROUPS = [
  {
    label: "Open Graph",
    keys: ["ogTitle", "ogDescription", "ogImage", "ogUrl", "ogType", "ogSiteName"] as (keyof MetaData)[],
    prefix: "og:",
  },
  {
    label: "Twitter / X",
    keys: ["twitterCard", "twitterTitle", "twitterDesc", "twitterImage"] as (keyof MetaData)[],
    prefix: "twitter:",
  },
  {
    label: "Page",
    keys: ["title", "description", "canonical", "robots"] as (keyof MetaData)[],
    prefix: "",
  },
];

const TAG_NAMES: Partial<Record<keyof MetaData, string>> = {
  ogTitle: "og:title", ogDescription: "og:description", ogImage: "og:image",
  ogUrl: "og:url", ogType: "og:type", ogSiteName: "og:site_name",
  twitterCard: "twitter:card", twitterTitle: "twitter:title",
  twitterDesc: "twitter:description", twitterImage: "twitter:image",
  title: "title", description: "description", canonical: "canonical",
  robots: "robots",
};

export function OgChecker() {
  const { lang } = useLang();
  const i = t(lang);
  const [input, setInput] = useState("");
  const { loading, error, data: ogData, run } = useFetch<MetaData>();
  const { copy, copied } = useCopy();

  const check = () => {
    if (!input.trim()) return;
    run(`/api/meta?url=${encodeURIComponent(input.trim())}`);
  };

  return (
    <section className="mb-10">
      <div className="border border-line border-b-0 flex items-center gap-0">
        <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">URL</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="https://example.com/"
          className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
          spellCheck={false}
        />
        <button
          onClick={check}
          disabled={loading || !input.trim()}
          className="px-[18px] py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold shrink-0 hover:brightness-110 transition-all disabled:opacity-50 border-l border-brand"
        >
          {loading ? "…" : i.analyzeBtn}
        </button>
      </div>

      <div className="border border-line">
        {error && (
          <div className="flex items-center gap-3 px-[14px] py-[14px]">
            <span className="font-mono text-[12px] text-danger">✕ {error}</span>
            <button onClick={check} className="font-mono text-[11px] text-dim hover:text-brand transition-colors border border-line px-3 py-[5px]">
              {i.retry}
            </button>
          </div>
        )}

        {ogData && (
          <div className="divide-y divide-line">
            {ogData.ogImage && (
              <div className="p-4 bg-bg-1">
                <img src={ogData.ogImage} alt="og:image" className="max-h-[180px] object-contain rounded border border-line" />
              </div>
            )}

            {GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-[14px] py-[8px] bg-bg border-b border-line">
                  <span className="font-mono text-[11px] text-dim">// {group.label}</span>
                </div>
                {group.keys.map((key) => {
                  const val = ogData[key];
                  const tagName = TAG_NAMES[key] ?? key;
                  return (
                    <div
                      key={key}
                      className="group flex items-start gap-4 px-[14px] py-[10px] border-b border-line hover:bg-bg-2 transition-colors cursor-pointer"
                      onClick={() => val && copy(val, key)}
                    >
                      <span className="font-mono text-[11px] text-dim shrink-0 w-40 pt-[2px]">{tagName}</span>
                      <span className={`font-mono text-[12.5px] leading-[1.5] flex-1 break-all ${val ? "text-fg" : "text-dim-2"}`}>
                        {val || i.missing}
                      </span>
                      {val && (
                        <span className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {copied === key ? "✓" : i.copy}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            <div className="flex items-center gap-4 px-[14px] py-2 bg-bg font-mono text-[11px] text-dim">
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-hot mr-1" />
              {i.proxiedFetch}
            </div>
          </div>
        )}

        {!ogData && !error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="font-mono text-[28px] text-dim">og✓</span>
            <span className="font-mono text-[12px] text-dim">
              {i.enterUrlOg}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12px] text-dim">
              {i.fetchingPage}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
