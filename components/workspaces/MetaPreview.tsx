"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";

type Tab = "google" | "facebook" | "twitter";

interface MetaData {
  url: string; title: string; description: string;
  ogTitle: string; ogDescription: string; ogImage: string; ogSiteName: string; ogUrl: string; ogType: string;
  twitterCard: string; twitterTitle: string; twitterDesc: string; twitterImage: string;
  canonical: string; favicon: string;
}

function hostname(url: string) { try { return new URL(url).hostname; } catch { return url; } }
function truncate(s: string, n: number) { return s.length > n ? s.slice(0, n) + "…" : s; }

export function MetaPreview() {
  const { lang } = useLang();
  const [url, setUrl] = useState("https://nextjs.org");
  const [tab, setTab] = useState<Tab>("google");
  const [data, setData] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = async () => {
    if (!url) return;
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch(`/api/meta?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error);
      setData(json);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const googleTitle = data?.ogTitle || data?.title || "";
  const googleDesc  = data?.ogDescription || data?.description || "";
  const fbTitle     = data?.ogTitle || data?.title || "";
  const fbDesc      = data?.ogDescription || data?.description || "";
  const twTitle     = data?.twitterTitle || data?.ogTitle || data?.title || "";
  const twDesc      = data?.twitterDesc || data?.ogDescription || data?.description || "";

  return (
    <section className="mb-10">
      {/* URL bar */}
      <div className="flex items-center gap-0 border border-line border-b-0">
        <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetch_()}
          placeholder="https://example.com"
          className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
          spellCheck={false}
        />
        <button
          onClick={fetch_}
          disabled={loading || !url}
          className="px-[18px] py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold shrink-0 hover:brightness-110 transition-all disabled:opacity-50 border-l border-brand"
        >
          {loading ? "…" : (lang === "fr" ? "prévisualiser ⏎" : "preview ⏎")}
        </button>
      </div>

      <OptionsBar>
        <OptBlock label={lang === "fr" ? "aperçu" : "preview"}>
          <SegControl
            options={["google", "facebook", "twitter"] as Tab[]}
            value={tab}
            onChange={(v) => setTab(v as Tab)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line border-t-0 bg-bg-1 min-h-[340px]">
        {error && (
          <div className="flex items-center gap-3 p-6">
            <span className="font-mono text-[12px] text-danger">✕ {error}</span>
          </div>
        )}

        {!data && !error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="font-mono text-[28px] text-dim">↗▭</span>
            <span className="font-mono text-[12px] text-dim">
              {lang === "fr" ? "entrez une URL et cliquez prévisualiser" : "enter a URL and click preview"}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12px] text-dim">
              {lang === "fr" ? "récupération via proxy…" : "fetching via proxy…"}
            </span>
          </div>
        )}

        {data && (
          <div className="p-6">
            {/* Google */}
            {tab === "google" && (
              <div className="max-w-[600px] font-sans">
                <div className="text-[12px] text-[#202124] mb-1 flex items-center gap-2">
                  {data.favicon && <img src={data.favicon.startsWith("http") ? data.favicon : `${new URL(url).origin}${data.favicon}`} alt="" className="w-4 h-4 rounded-full" onError={(e) => (e.currentTarget.style.display = "none")} />}
                  <span className="text-[#202124]">{data.ogSiteName || hostname(url)}</span>
                  <span className="text-[#4d5156]">› {hostname(url)}</span>
                </div>
                <div className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-snug mb-1">
                  {truncate(googleTitle || hostname(url), 65)}
                </div>
                <div className="text-[14px] text-[#4d5156] leading-[1.58]">
                  {truncate(googleDesc, 165) || <span className="italic text-[#70757a]">{lang === "fr" ? "Aucune description" : "No description"}</span>}
                </div>
              </div>
            )}

            {/* Facebook */}
            {tab === "facebook" && (
              <div className="max-w-[500px] border border-[#dddfe2] overflow-hidden font-sans">
                {data.ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.ogImage} alt="" className="w-full h-[260px] object-cover bg-bg-2" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="w-full h-[180px] bg-bg-2 flex items-center justify-center font-mono text-dim text-[12px]">{lang === "fr" ? "pas d'og:image" : "no og:image"}</div>
                )}
                <div className="bg-[#f2f3f5] px-3 py-[10px]">
                  <div className="text-[11px] text-[#606770] uppercase tracking-[0.04em] mb-1">{hostname(url)}</div>
                  <div className="text-[16px] font-semibold text-[#1d2129] leading-snug mb-1">{truncate(fbTitle, 88) || (lang === "fr" ? "Sans titre" : "No title")}</div>
                  <div className="text-[14px] text-[#606770] leading-[1.4]">{truncate(fbDesc, 110) || ""}</div>
                </div>
              </div>
            )}

            {/* Twitter */}
            {tab === "twitter" && (
              <div className="max-w-[500px] border border-[#cfd9de] rounded-[16px] overflow-hidden font-sans">
                {data.twitterImage || data.ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.twitterImage || data.ogImage} alt="" className="w-full h-[250px] object-cover bg-bg-2" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="w-full h-[160px] bg-bg-2 flex items-center justify-center font-mono text-dim text-[12px]">{lang === "fr" ? "pas de twitter:image" : "no twitter:image"}</div>
                )}
                <div className="px-3 py-[10px]">
                  <div className="text-[15px] font-semibold text-[#0f1419] leading-snug mb-1">{truncate(twTitle, 70) || (lang === "fr" ? "Sans titre" : "No title")}</div>
                  <div className="text-[13px] text-[#536471] leading-[1.4] mb-2">{truncate(twDesc, 125) || ""}</div>
                  <div className="text-[13px] text-[#536471]">{hostname(url)}</div>
                </div>
              </div>
            )}

            {/* Meta table */}
            <div className="mt-6 border border-line divide-y divide-line">
              <div className="px-3 py-2 font-mono text-[10px] text-dim uppercase tracking-[0.1em] bg-bg">
                {lang === "fr" ? "// balises brutes" : "// raw tags"}
              </div>
              {[
                ["title",         data.title],
                ["description",   data.description],
                ["og:title",      data.ogTitle],
                ["og:description",data.ogDescription],
                ["og:image",      data.ogImage],
                ["og:type",       data.ogType],
                ["twitter:card",  data.twitterCard],
                ["canonical",     data.canonical],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex gap-3 px-3 py-[7px] text-[12px]">
                  <span className="font-mono text-dim w-36 shrink-0">{k}</span>
                  <span className="font-mono text-fg-1 break-all">{truncate(v!, 120)}</span>
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
