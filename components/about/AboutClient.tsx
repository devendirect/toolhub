"use client";

import Link from "next/link";
import { useLang } from "@/components/providers/I18nProvider";
import { localePath } from "@/lib/localePath";
import { AboutStory } from "./AboutStory";
import { TOOLS, networkToolNames } from "@/lib/tools";

interface Lib {
  name: string;
  version: string;
  license: string;
  url: string;
  note?: string;
}

interface Section {
  titleFr: string;
  titleEn: string;
  libs: Lib[];
}

const SECTIONS: Section[] = [
  {
    titleFr: "Framework & runtime",
    titleEn: "Framework & runtime",
    libs: [
      { name: "Next.js",      version: "16",  license: "MIT",        url: "https://nextjs.org" },
      { name: "React",        version: "19",  license: "MIT",        url: "https://react.dev" },
      { name: "TypeScript",   version: "5",   license: "Apache 2.0", url: "https://www.typescriptlang.org" },
      { name: "Tailwind CSS", version: "4",   license: "MIT",        url: "https://tailwindcss.com" },
    ],
  },
  {
    titleFr: "Composants UI",
    titleEn: "UI components",
    libs: [
      { name: "shadcn/ui",    version: "—",   license: "MIT", url: "https://ui.shadcn.com" },
      { name: "Radix UI",     version: "—",   license: "MIT", url: "https://www.radix-ui.com" },
      { name: "cmdk",         version: "1.x", license: "MIT", url: "https://cmdk.paco.me" },
      { name: "Lucide React", version: "—",   license: "ISC", url: "https://lucide.dev" },
      { name: "Sonner",       version: "—",   license: "MIT", url: "https://sonner.emilkowal.ski" },
    ],
  },
  {
    titleFr: "Éditeur",
    titleEn: "Editor",
    libs: [
      { name: "CodeMirror 6",          version: "6.x", license: "MIT", url: "https://codemirror.net" },
      { name: "@uiw/react-codemirror", version: "4.x", license: "MIT", url: "https://github.com/uiwjs/react-codemirror" },
    ],
  },
  {
    titleFr: "Librairies outils",
    titleEn: "Tool libraries",
    libs: [
      { name: "qrcode",     version: "1.x", license: "MIT",        url: "https://github.com/soldair/node-qrcode" },
      { name: "pdf-lib",    version: "1.x", license: "MIT",        url: "https://pdf-lib.js.org" },
      { name: "pdfjs-dist", version: "—",   license: "Apache 2.0", url: "https://mozilla.github.io/pdf.js" },
      { name: "marked",     version: "—",   license: "MIT",        url: "https://marked.js.org" },
      { name: "spark-md5",  version: "3.x", license: "WTFPL",      url: "https://github.com/satazor/js-spark-md5" },
      { name: "cronstrue",  version: "3.x", license: "MIT",        url: "https://bradymholt.github.io/cron-expression-descriptor" },
      { name: "cheerio",    version: "1.x", license: "MIT",        url: "https://cheerio.js.org" },
      { name: "smol-toml",  version: "1.x", license: "MIT",        url: "https://github.com/nicolo-ribaudo/smol-toml" },
      {
        name: "heic-to (libheif WASM)",
        version: "1.5.x",
        license: "LGPL 3.0",
        url: "https://github.com/hoppergee/heic-to",
        note: "LGPL, source : github.com/strukturag/libheif",
      },
      {
        name: "@ffmpeg/ffmpeg",
        version: "0.12.x",
        license: "LGPL 2.1",
        url: "https://ffmpegwasm.netlify.app",
        note: "LGPL, source : ffmpeg.org",
      },
      {
        name: "FFmpeg core (WASM)",
        version: "0.12.6",
        license: "LGPL 2.1",
        url: "https://ffmpeg.org",
        note: "Chargé au runtime depuis unpkg.com / Loaded at runtime from unpkg.com",
      },
    ],
  },
  {
    titleFr: "Polices",
    titleEn: "Fonts",
    libs: [
      { name: "Geist",           version: "—", license: "OFL 1.1", url: "https://vercel.com/font" },
      { name: "JetBrains Mono",  version: "—", license: "OFL 1.1", url: "https://www.jetbrains.com/lp/mono" },
    ],
  },
];

const LICENSE_COLOR: Record<string, string> = {
  "MIT":         "text-brand",
  "ISC":         "text-brand",
  "WTFPL":       "text-brand",
  "OFL 1.1":     "text-brand",
  "Apache 2.0":  "text-hot",
  "LGPL 2.1":    "text-hot",
};

export function AboutClient() {
  const { lang } = useLang();
  const toolCount = TOOLS.filter((t) => !t.comingSoon).length;

  return (
    <main className="max-w-[860px] mx-auto px-6 py-12">
      {/* Qui, quoi, comment — la page qui répond à "qui est derrière ce site ?" */}
      <div className="mb-12">
        <h1 className="font-mono text-[22px] font-semibold text-fg mb-4">
          {lang === "fr" ? "// à propos d'utilisio" : "// about utilisio"}
        </h1>
        <div className="flex flex-col gap-3 font-mono text-[13px] text-fg-1 leading-relaxed">
          <p>
            {lang === "fr"
              ? `utilisio est une boîte à outils web gratuite : ${toolCount} outils pour développeurs, designers et rédacteurs (conversion de fichiers, formatage de code, générateurs, analyse SEO), sans compte, sans inscription et sans limite d'usage.`
              : `utilisio is a free web toolkit: ${toolCount} tools for developers, designers and writers (file conversion, code formatting, generators, SEO analysis), with no account, no signup and no usage limit.`}
          </p>
          <p>
            {lang === "fr"
              ? `C'est un projet indépendant, développé et maintenu activement : de nouveaux outils sont ajoutés régulièrement. La quasi-totalité des outils s'exécute directement dans votre navigateur, vos fichiers et vos textes ne quittent jamais votre appareil. Seuls quelques outils (${networkToolNames("fr").join(", ")}) passent par notre serveur pour interroger des données externes, sans rien conserver.`
              : `It is an independent project, actively developed and maintained: new tools are added regularly. Almost every tool runs directly in your browser, your files and text never leave your device. Only a few tools (${networkToolNames("en").join(", ")}) go through our server to fetch external data, and nothing is stored.`}
          </p>
          <p className="text-dim">
            {lang === "fr" ? (
              <>
                Le détail de ce qui est collecté (presque rien) est sur la page{" "}
                <Link href={localePath(lang, "/privacy")} className="underline hover:text-fg transition-colors">confidentialité</Link>
                {" "}; les questions fréquentes sont dans la{" "}
                <Link href={localePath(lang, "/faq")} className="underline hover:text-fg transition-colors">FAQ</Link>.
              </>
            ) : (
              <>
                Details on what we collect (almost nothing) are on the{" "}
                <Link href={localePath(lang, "/privacy")} className="underline hover:text-fg transition-colors">privacy page</Link>
                ; common questions are answered in the{" "}
                <Link href={localePath(lang, "/faq")} className="underline hover:text-fg transition-colors">FAQ</Link>.
              </>
            )}
          </p>
        </div>
      </div>

      <AboutStory lang={lang} />

      <div className="mb-10">
        <h2 className="font-mono text-[17px] font-semibold text-fg mb-2">
          {lang === "fr" ? "// crédits open-source" : "// open-source credits"}
        </h2>
        <p className="font-mono text-[13px] text-dim leading-relaxed">
          {lang === "fr"
            ? "utilisio repose sur d'excellentes librairies open-source. Les composants sous licence LGPL (FFmpeg) sont utilisés sans modification et peuvent être remplacés en changeant l'URL du WASM."
            : "utilisio is built on top of excellent open-source libraries. LGPL-licensed components (FFmpeg) are used unmodified and can be swapped by replacing the WASM URL."}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <div key={section.titleEn}>
            <h2 className="font-mono text-[11px] text-dim uppercase tracking-[0.1em] mb-3 border-b border-line pb-2">
              {lang === "fr" ? section.titleFr : section.titleEn}
            </h2>
            <div className="divide-y divide-line border border-line">
              {section.libs.map((lib) => (
                <div key={lib.name} className="flex items-start gap-4 px-4 py-3 hover:bg-bg-1 transition-colors">
                  <div className="flex-1 min-w-0">
                    <a
                      href={lib.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[13px] text-fg hover:text-brand transition-colors"
                    >
                      {lib.name}
                    </a>
                    {lib.note && (
                      <div className="font-mono text-[11px] text-dim-2 mt-[2px]">{lib.note}</div>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-dim-2 shrink-0">{lib.version}</span>
                  <span className={`font-mono text-[11px] shrink-0 ${LICENSE_COLOR[lib.license] ?? "text-dim"}`}>
                    {lib.license}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* LGPL notice */}
      <div className="mt-10 border border-line px-4 py-4 font-mono text-[11px] text-dim leading-relaxed">
        <span className="text-hot font-semibold">FFmpeg / LGPL</span>
        {" : "}
        {lang === "fr"
          ? <>
              Ce site utilise FFmpeg compilé en WebAssembly (
              <a href="https://ffmpegwasm.netlify.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">ffmpeg.wasm</a>
              ), sous licence GNU LGPL v2.1. Le binaire est chargé sans modification depuis unpkg.com.
              Code source disponible sur{" "}
              <a href="https://github.com/FFmpeg/FFmpeg" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">github.com/FFmpeg/FFmpeg</a>.
            </>
          : <>
              This site uses FFmpeg compiled to WebAssembly (
              <a href="https://ffmpegwasm.netlify.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">ffmpeg.wasm</a>
              ), licensed under GNU LGPL v2.1. The binary is loaded unmodified from unpkg.com.
              Source code available at{" "}
              <a href="https://github.com/FFmpeg/FFmpeg" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">github.com/FFmpeg/FFmpeg</a>.
            </>
        }
      </div>
    </main>
  );
}
