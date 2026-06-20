"use client";

import { useState, useMemo } from "react";
import { useLang } from "@/components/providers/I18nProvider";
import { t } from "@/lib/i18n";
import { useCopy } from "@/hooks/useCopy";
import { OptionsBar, OptBlock, SegControl } from "@/components/workspace/OptionsBar";

const TR = {
  fr: {
    questionPlaceholder: "Question…",
    answerPlaceholder:   "Réponse…",
    addEntry:            "ajouter une entrée",
    addLevel:            "ajouter un niveau",
  },
  en: {
    questionPlaceholder: "Question…",
    answerPlaceholder:   "Answer…",
    addEntry:            "add entry",
    addLevel:            "add level",
  },
} as const;

type SchemaType = "Article" | "Product" | "FAQPage" | "BreadcrumbList";

interface FaqEntry { q: string; a: string; }
interface BreadcrumbEntry { name: string; url: string; }

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div className="flex items-center gap-0 border-b border-line">
      <span className="font-mono text-[11px] text-dim px-3 py-[9px] border-r border-line bg-bg w-40 shrink-0">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent font-mono text-[12px] text-fg px-3 py-[9px] outline-none placeholder:text-dim-2"
        spellCheck={false}
      />
    </div>
  );
}

export function SchemaGenerator() {
  const { lang } = useLang();
  const i = t(lang);
  const [type, setType] = useState<SchemaType>("Article");
  const { copy, copied } = useCopy();

  // Article fields
  const [artTitle, setArtTitle] = useState("");
  const [artDesc, setArtDesc] = useState("");
  const [artAuthor, setArtAuthor] = useState("");
  const [artDate, setArtDate] = useState(new Date().toISOString().slice(0, 10));
  const [artUrl, setArtUrl] = useState("");

  // Product fields
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCurrency, setProdCurrency] = useState("EUR");
  const [prodAvail, setProdAvail] = useState("InStock");

  // FAQ
  const [faqEntries, setFaqEntries] = useState<FaqEntry[]>([{ q: "", a: "" }]);
  const updateFaq = (i: number, patch: Partial<FaqEntry>) =>
    setFaqEntries((prev) => prev.map((e, idx) => idx === i ? { ...e, ...patch } : e));

  // BreadcrumbList
  const [crumbs, setCrumbs] = useState<BreadcrumbEntry[]>([
    { name: "Home", url: "https://example.com/" },
    { name: "Blog", url: "https://example.com/blog/" },
  ]);
  const updateCrumb = (i: number, patch: Partial<BreadcrumbEntry>) =>
    setCrumbs((prev) => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));

  const jsonld = useMemo(() => {
    const base = { "@context": "https://schema.org" };
    switch (type) {
      case "Article":
        return {
          ...base, "@type": "Article",
          headline: artTitle,
          description: artDesc,
          author: { "@type": "Person", name: artAuthor },
          datePublished: artDate,
          url: artUrl,
        };
      case "Product":
        return {
          ...base, "@type": "Product",
          name: prodName,
          description: prodDesc,
          offers: {
            "@type": "Offer",
            price: prodPrice,
            priceCurrency: prodCurrency,
            availability: `https://schema.org/${prodAvail}`,
          },
        };
      case "FAQPage":
        return {
          ...base, "@type": "FAQPage",
          mainEntity: faqEntries.map((e) => ({
            "@type": "Question",
            name: e.q,
            acceptedAnswer: { "@type": "Answer", text: e.a },
          })),
        };
      case "BreadcrumbList":
        return {
          ...base, "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: c.url,
          })),
        };
    }
  }, [type, artTitle, artDesc, artAuthor, artDate, artUrl, prodName, prodDesc, prodPrice, prodCurrency, prodAvail, faqEntries, crumbs]);

  const output = JSON.stringify(jsonld, null, 2);

  return (
    <section className="mb-10">
      <OptionsBar
        action={
          <button
            onClick={() => copy(output)}
            className="px-[18px] py-2 bg-brand text-bg font-mono text-[12px] font-semibold tracking-[0.04em] rounded-[3px] hover:brightness-110 transition-all"
          >
            {copied ? "✓" : "copy JSON-LD ⏎"}
          </button>
        }
      >
        <OptBlock label="type">
          <SegControl
            options={["Article", "Product", "FAQPage", "BreadcrumbList"]}
            value={type}
            onChange={(v) => setType(v as SchemaType)}
          />
        </OptBlock>
      </OptionsBar>

      <div className="border border-line">
        {type === "Article" && (
          <>
            <Field label="headline" value={artTitle} onChange={setArtTitle} placeholder="My article title" />
            <Field label="description" value={artDesc} onChange={setArtDesc} placeholder="Short description" />
            <Field label="author" value={artAuthor} onChange={setArtAuthor} placeholder="Jane Doe" />
            <Field label="datePublished" value={artDate} onChange={setArtDate} type="date" />
            <Field label="url" value={artUrl} onChange={setArtUrl} placeholder="https://example.com/article" />
          </>
        )}

        {type === "Product" && (
          <>
            <Field label="name" value={prodName} onChange={setProdName} placeholder="Product name" />
            <Field label="description" value={prodDesc} onChange={setProdDesc} placeholder="Short description" />
            <Field label="price" value={prodPrice} onChange={setProdPrice} placeholder="29.99" />
            <Field label="priceCurrency" value={prodCurrency} onChange={setProdCurrency} placeholder="EUR" />
            <Field label="availability" value={prodAvail} onChange={setProdAvail} placeholder="InStock" />
          </>
        )}

        {type === "FAQPage" && (
          <>
            {faqEntries.map((entry, i) => (
              <div key={i} className="border-b border-line">
                <Field label={`Q${i + 1}`} value={entry.q} onChange={(v) => updateFaq(i, { q: v })} placeholder={TR[lang].questionPlaceholder} />
                <Field label={`A${i + 1}`} value={entry.a} onChange={(v) => updateFaq(i, { a: v })} placeholder={TR[lang].answerPlaceholder} />
              </div>
            ))}
            <button
              onClick={() => setFaqEntries((prev) => [...prev, { q: "", a: "" }])}
              className="w-full text-left px-3 py-[9px] font-mono text-[11px] text-dim hover:text-brand transition-colors border-b border-line"
            >
              + {TR[lang].addEntry}
            </button>
          </>
        )}

        {type === "BreadcrumbList" && (
          <>
            {crumbs.map((crumb, i) => (
              <div key={i} className="border-b border-line">
                <Field label={`name ${i + 1}`} value={crumb.name} onChange={(v) => updateCrumb(i, { name: v })} placeholder="Page name" />
                <Field label={`url ${i + 1}`} value={crumb.url} onChange={(v) => updateCrumb(i, { url: v })} placeholder="https://example.com/page" />
              </div>
            ))}
            <button
              onClick={() => setCrumbs((prev) => [...prev, { name: "", url: "" }])}
              className="w-full text-left px-3 py-[9px] font-mono text-[11px] text-dim hover:text-brand transition-colors border-b border-line"
            >
              + {TR[lang].addLevel}
            </button>
          </>
        )}

        {/* Output */}
        <div className="bg-bg-code px-[14px] py-[12px] cursor-pointer" onClick={() => copy(output)}>
          <pre className="font-mono text-[11.5px] text-fg-1 leading-[1.6] whitespace-pre-wrap max-h-[320px] overflow-auto">{output}</pre>
        </div>
      </div>
    </section>
  );
}
