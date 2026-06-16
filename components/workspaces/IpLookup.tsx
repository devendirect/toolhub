"use client";

import { useState } from "react";
import { useCopy } from "@/hooks/useCopy";
import { useLang } from "@/components/providers/I18nProvider";

interface IpData {
  query: string; country: string; countryCode: string;
  regionName: string; city: string; zip: string;
  lat: number; lon: number; timezone: string;
  isp: string; org: string; as: string;
}

const ROWS: { key: keyof IpData; label: Record<"fr" | "en", string> }[] = [
  { key: "query",       label: { fr: "IP",           en: "IP"           } },
  { key: "country",     label: { fr: "Pays",         en: "Country"      } },
  { key: "countryCode", label: { fr: "Code pays",    en: "Country code" } },
  { key: "regionName",  label: { fr: "Région",       en: "Region"       } },
  { key: "city",        label: { fr: "Ville",        en: "City"         } },
  { key: "zip",         label: { fr: "Code postal",  en: "ZIP"          } },
  { key: "timezone",    label: { fr: "Fuseau",       en: "Timezone"     } },
  { key: "lat",         label: { fr: "Latitude",     en: "Latitude"     } },
  { key: "lon",         label: { fr: "Longitude",    en: "Longitude"    } },
  { key: "isp",         label: { fr: "FAI",          en: "ISP"          } },
  { key: "org",         label: { fr: "Organisation", en: "Organization" } },
  { key: "as",          label: { fr: "AS",           en: "AS"           } },
];

export function IpLookup() {
  const { lang } = useLang();
  const [input, setInput] = useState("");
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { copy, copied } = useCopy();

  const lookup = async (ip?: string) => {
    setLoading(true); setError(null); setData(null);
    try {
      const params = ip ? `?ip=${encodeURIComponent(ip)}` : "";
      const res = await fetch(`/api/ip${params}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        const msg = json.error ?? "";
        // Traduit les messages d'erreur de l'API en français
        if (lang === "fr") {
          if (msg.includes("Too many requests"))   throw new Error("Trop de requêtes — attendez une minute.");
          if (msg.includes("Invalid IP"))          throw new Error("Format d'adresse IP invalide.");
          if (msg.includes("rate limit reached"))  throw new Error("Quota ip-api.com atteint — réessayez dans quelques secondes.");
          if (msg.includes("timeout"))             throw new Error("Délai d'attente dépassé.");
        }
        throw new Error(msg || (lang === "fr" ? "échec de la requête" : "lookup failed"));
      }
      setData(json);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (val: string) => copy(val);

  return (
    <section className="mb-10">
      {/* Input bar */}
      <div className="flex items-center gap-0 border border-line border-b-0">
        <span className="font-mono text-[12px] text-dim px-4 py-[11px] border-r border-line bg-bg-1 shrink-0">
          {lang === "fr" ? "adresse" : "address"}
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup(input || undefined)}
          placeholder={lang === "fr" ? "laisser vide pour votre IP…" : "leave empty for your IP…"}
          className="flex-1 bg-transparent font-mono text-[13px] text-fg px-4 py-[11px] outline-none placeholder:text-dim-2"
          spellCheck={false}
        />
        <button
          onClick={() => lookup(input || undefined)}
          disabled={loading}
          className="px-[18px] py-[11px] bg-brand text-bg font-mono text-[12px] font-semibold shrink-0 hover:brightness-110 transition-all disabled:opacity-50 border-l border-brand"
        >
          {loading ? "…" : (lang === "fr" ? "analyser ⏎" : "lookup ⏎")}
        </button>
      </div>

      <div className="border border-line">
        {/* Results */}
        {data && (
          <div className="divide-y divide-line">
            {ROWS.map(({ key, label }) => {
              const val = String(data[key]);
              return (
                <div
                  key={key}
                  className="group flex items-center gap-4 px-[14px] py-[11px] hover:bg-bg-2 transition-colors cursor-pointer"
                  onClick={() => handleCopy(val)}
                >
                  <span className="font-mono text-[11px] text-dim uppercase tracking-[0.08em] w-32 shrink-0">{label[lang]}</span>
                  <span className="font-mono text-[13px] text-fg flex-1">{val || "—"}</span>
                  {key === "countryCode" && val && (
                    <span className="text-[18px] shrink-0">{val.toUpperCase().replace(/./g, (c) => String.fromCodePoint(c.codePointAt(0)! + 127397))}</span>
                  )}
                  <span className="font-mono text-[11px] text-dim opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {copied === val ? "✓" : (lang === "fr" ? "copier" : "copy")}
                  </span>
                </div>
              );
            })}
            <div className="flex items-center gap-4 px-[14px] py-[9px] bg-bg-1">
              <a
                href={`https://www.openstreetmap.org/?mlat=${data.lat}&mlon=${data.lon}#map=10/${data.lat}/${data.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-dim hover:text-brand transition-colors"
              >
                {lang === "fr" ? "voir sur la carte →" : "view on map →"} ({data.lat}, {data.lon})
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 px-[14px] py-[14px]">
            <span className="font-mono text-[12px] text-danger">✕ {error}</span>
          </div>
        )}

        {!data && !error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <span className="font-mono text-[28px] text-dim">ip</span>
            <span className="font-mono text-[12px] text-dim">
              {lang === "fr"
                ? "entrez une IP ou laissez vide pour la vôtre"
                : "enter an IP or leave empty for yours"}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <span className="font-mono text-[12px] text-dim">
              {lang === "fr" ? "interrogation ip-api.com…" : "querying ip-api.com…"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 px-[14px] py-2 border-t border-line bg-bg font-mono text-[11px] text-dim">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-hot mr-1" />
          {lang === "fr"
            ? "récupération via proxy — résultat mis en cache 1h en mémoire, aucun log persistant"
            : "proxied fetch — result cached 1h in memory, no persistent log"}
          <span className="ml-auto">ip-api.com</span>
        </div>
      </div>
    </section>
  );
}
