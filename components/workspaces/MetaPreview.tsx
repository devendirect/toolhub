"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";
import { useFetch } from "@/hooks/useFetch";
import { useCopy } from "@/hooks/useCopy";
import { useTrackRun } from "@/hooks/useTrackRun";
import { truncate } from "@/lib/format";
import type { MetaData } from "@/app/api/meta/route";

const TR = {
  fr: {
    preview:        "aperçu",
    noDesc:         "Aucune description",
    noOgImage:      "pas d'og:image",
    noTitle:        "Sans titre",
    noTwitterImage: "pas de twitter:image",
    rawTags:        "// toutes les balises — clic pour copier",
    missing:        "absente",
    relativeImage:  "URL relative : Facebook, LinkedIn ou Slack ne l'afficheront pas. Utilisez une URL absolue (https://…).",
    affLabel:       "votre site, votre domaine",
    affText:        "Prêt à mettre votre site en ligne ? Enregistrez votre domaine chez Strato.",
    affCta:         "Trouver mon domaine →",
  },
  en: {
    preview:        "preview",
    noDesc:         "No description",
    noOgImage:      "no og:image",
    noTitle:        "No title",
    noTwitterImage: "no twitter:image",
    rawTags:        "// all tags — click to copy",
    missing:        "missing",
    relativeImage:  "Relative URL: Facebook, LinkedIn or Slack won't display it. Use an absolute URL (https://…).",
    affLabel:       "your site, your domain",
    affText:        "Ready to put your site online? Register your domain with Namecheap.",
    affCta:         "Find my domain →",
  },
} as const;

type Tab = "google" | "facebook" | "twitter";

const AFFILIATE_STRATO    = process.env.NEXT_PUBLIC_AFFILIATE_STRATO;
const AFFILIATE_NAMECHEAP = process.env.NEXT_PUBLIC_AFFILIATE_NAMECHEAP;

// Liste complète (reprise de l'ancien og-checker) ; les balises marquées `key`
// sont signalées « absente » quand elles manquent, les autres simplement omises
const TAGS: { name: string; field: keyof MetaData; key?: boolean }[] = [
  { name: "title",               field: "title",         key: true },
  { name: "description",         field: "description",   key: true },
  { name: "canonical",           field: "canonical" },
  { name: "robots",              field: "robots" },
  { name: "og:title",            field: "ogTitle",       key: true },
  { name: "og:description",      field: "ogDescription", key: true },
  { name: "og:image",            field: "ogImage",       key: true },
  { name: "og:url",              field: "ogUrl" },
  { name: "og:type",             field: "ogType" },
  { name: "og:site_name",        field: "ogSiteName" },
  { name: "twitter:card",        field: "twitterCard",   key: true },
  { name: "twitter:title",       field: "twitterTitle" },
  { name: "twitter:description", field: "twitterDesc" },
  { name: "twitter:image",       field: "twitterImage" },
];

// Les réseaux sociaux ne résolvent pas un og:image relatif : le signaler plutôt que de l'afficher
const isAbsolute = (u: string) => /^https?:\/\//i.test(u);

function hostname(url: string) { try { return new URL(url).hostname; } catch { return ""; } }
function origin(url: string)   { try { return new URL(url).origin;   } catch { return ""; } }

export function MetaPreview() {
  const { lang } = useLang();
  const i = t(lang);
  const [url, setUrl] = useState("https://nextjs.org");
  const [tab, setTab] = useState<Tab>("google");
  const { loading, error, data: metaData, run: fetchMeta } = useFetch<MetaData>();
  const trackRun = useTrackRun("meta-preview", "seo");
  const { copy, copied } = useCopy();
  const affiliateUrl = lang === "fr" ? AFFILIATE_STRATO : AFFILIATE_NAMECHEAP;

  const preview = () => { if (url) { trackRun(); fetchMeta(`/api/meta?url=${encodeURIComponent(url)}`); } };

  // Google affiche <title> et la meta description ; les réseaux sociaux lisent d'abord Open Graph
  const gTitle      = metaData?.title || metaData?.ogTitle || "";
  const gDesc       = metaData?.description || metaData?.ogDescription || "";
  const ogTitle     = metaData?.ogTitle || metaData?.title || "";
  const ogDesc      = metaData?.ogDescription || metaData?.description || "";
  const twTitle     = metaData?.twitterTitle || metaData?.ogTitle || metaData?.title || "";
  const twDesc      = metaData?.twitterDesc || metaData?.ogDescription || metaData?.description || "";

  return (
    <section className="mb-10">
      <div className="flex items-center gap-0 border border-line border-b-0">
        <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">URL</span>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && preview()}
          placeholder="https://example.com"
          className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
          spellCheck={false}
        />
        <button
          onClick={preview}
          disabled={loading || !url}
          className="px-[18px] py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold shrink-0 hover:brightness-110 transition-all disabled:opacity-50 border-l border-brand"
        >
          {loading ? "…" : i.previewBtn}
        </button>
      </div>

      <OptionsBar>
        <OptBlock label={TR[lang].preview}>
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
            <button onClick={preview} className="font-mono text-[11px] text-dim hover:text-brand transition-colors border border-line px-3 py-[5px]">
              {i.retry}
            </button>
          </div>
        )}

        {!metaData && !error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="font-mono text-[28px] text-dim">↗▭</span>
            <span className="font-mono text-[12px] text-dim">
              {i.enterUrlPreview}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12px] text-dim">
              {i.fetchingProxy}
            </span>
          </div>
        )}

        {metaData && (
          <div className="p-6">
            {tab === "google" && (
              <div className="max-w-[600px] font-sans">
                <div className="text-[12px] text-[#202124] mb-1 flex items-center gap-2">
                  {metaData.favicon && <img src={metaData.favicon.startsWith("http") ? metaData.favicon : `${origin(url)}${metaData.favicon}`} alt="" className="w-4 h-4 rounded-full" onError={(e) => (e.currentTarget.style.display = "none")} />}
                  <span className="text-[#202124]">{metaData.ogSiteName || hostname(url)}</span>
                  <span className="text-[#4d5156]">› {hostname(url)}</span>
                </div>
                <div className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-snug mb-1">
                  {truncate(gTitle || hostname(url), 65)}
                </div>
                <div className="text-[14px] text-[#4d5156] leading-[1.58]">
                  {truncate(gDesc, 165) || <span className="italic text-[#70757a]">{TR[lang].noDesc}</span>}
                </div>
              </div>
            )}

            {tab === "facebook" && (
              <div className="max-w-[500px] border border-[#dddfe2] overflow-hidden font-sans">
                {metaData.ogImage && !isAbsolute(metaData.ogImage) ? (
                  <div className="w-full h-[180px] bg-bg-2 flex items-center justify-center px-6 text-center font-mono text-hot text-[12px]">{TR[lang].relativeImage}</div>
                ) : metaData.ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={metaData.ogImage} alt="" className="w-full h-[260px] object-cover bg-bg-2" onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <div className="w-full h-[180px] bg-bg-2 flex items-center justify-center font-mono text-dim text-[12px]">{TR[lang].noOgImage}</div>
                )}
                <div className="bg-[#f2f3f5] px-3 py-[10px]">
                  <div className="text-[11px] text-[#606770] uppercase tracking-[0.04em] mb-1">{hostname(url)}</div>
                  <div className="text-[16px] font-semibold text-[#1d2129] leading-snug mb-1">{truncate(ogTitle, 88) || TR[lang].noTitle}</div>
                  <div className="text-[14px] text-[#606770] leading-[1.4]">{truncate(ogDesc, 110) || ""}</div>
                </div>
              </div>
            )}

            {tab === "twitter" && (
              <div className="max-w-[500px] border border-[#cfd9de] rounded-[16px] overflow-hidden font-sans">
                {(metaData.twitterImage || metaData.ogImage) && !isAbsolute(metaData.twitterImage || metaData.ogImage) ? (
                  <div className="w-full h-[160px] bg-bg-2 flex items-center justify-center px-6 text-center font-mono text-hot text-[12px]">{TR[lang].relativeImage}</div>
                ) : metaData.twitterImage || metaData.ogImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={metaData.twitterImage || metaData.ogImage} alt="" className="w-full h-[250px] object-cover bg-bg-2" onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <div className="w-full h-[160px] bg-bg-2 flex items-center justify-center font-mono text-dim text-[12px]">{TR[lang].noTwitterImage}</div>
                )}
                <div className="px-3 py-[10px]">
                  <div className="text-[15px] font-semibold text-[#0f1419] leading-snug mb-1">{truncate(twTitle, 70) || TR[lang].noTitle}</div>
                  <div className="text-[13px] text-[#536471] leading-[1.4] mb-2">{truncate(twDesc, 125) || ""}</div>
                  <div className="text-[13px] text-[#536471]">{hostname(url)}</div>
                </div>
              </div>
            )}

            <div className="mt-6 border border-line divide-y divide-line">
              <div className="px-3 py-2 font-mono text-[10px] text-dim uppercase tracking-[0.1em] bg-bg">
                {TR[lang].rawTags}
              </div>
              {TAGS.filter(({ field, key }) => key || metaData[field]).map(({ name, field }) => {
                const v = metaData[field];
                return (
                  <div
                    key={name}
                    className={`group flex gap-3 px-3 py-[7px] text-[12px] ${v ? "cursor-pointer hover:bg-bg-2" : ""}`}
                    onClick={() => v && copy(v, name)}
                  >
                    <span className="font-mono text-dim w-36 shrink-0">{name}</span>
                    <span className={`font-mono break-all flex-1 ${v ? "text-fg-1" : "text-dim-2"}`}>{v ? truncate(v, 120) : TR[lang].missing}</span>
                    {v && (
                      <span className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {copied === name ? "✓" : i.copy}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-hot mr-1" />
          {i.proxiedCached}
        </div>
      </div>

      {affiliateUrl && metaData && (
        <div className="mt-4 p-4 border border-line bg-bg-1 flex items-start gap-4">
          <span className="font-mono text-[20px] shrink-0">↗</span>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[11px] text-dim uppercase tracking-[0.1em]">{TR[lang].affLabel}</span>
            <p className="text-[13px] text-fg-1">{TR[lang].affText}</p>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 font-mono text-[12px] text-brand hover:underline"
            >
              {TR[lang].affCta}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
