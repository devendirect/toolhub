import Link from "next/link";
import { SectionHead } from "@/components/home/SectionHead";
import { CATEGORIES, TOOLS, networkToolNames } from "@/lib/tools";
import type { Lang } from "@/lib/types";

// Une phrase par catégorie, orientée besoin (différente des descriptions de hub)
const HUB_LINES: Record<string, { en: string; fr: string }> = {
  file:   { en: "images, PDFs, audio and video, converted without uploading them", fr: "images, PDF, audio et vidéo, convertis sans les envoyer" },
  dev:    { en: "JWTs, timestamps, regex, hashes, UUIDs, passwords, HTTP headers", fr: "JWT, timestamps, regex, hash, UUID, mots de passe, en-têtes HTTP" },
  text:   { en: "JSON, CSV, word counts, case, escaping for URLs, HTML and code", fr: "JSON, CSV, comptage de mots, casse, échappement pour URL, HTML et code" },
  design: { en: "colors, palettes, contrast and CSS generators with code to copy", fr: "couleurs, palettes, contraste et générateurs CSS avec le code à copier" },
  seo:    { en: "meta tag previews, on-page checks, robots.txt, sitemaps, structured data", fr: "aperçus des balises meta, contrôle on-page, robots.txt, sitemaps, données structurées" },
};

/**
 * Texte éditorial de l'accueil, rendu côté serveur sous les listes d'outils :
 * ce qu'est le site, où tournent les outils, et par où commencer. Tous les
 * nombres et noms d'outils sont calculés depuis TOOLS (règle CLAUDE.md).
 */
export function HomeAbout({ lang }: { lang: Lang }) {
  const live = TOOLS.filter((t) => !t.comingSoon);
  const local = live.filter((t) => t.privacy !== "network").length;
  const network = networkToolNames(lang);
  const cats = CATEGORIES.filter((c) => c.id !== "all");

  const text = lang === "fr"
    ? {
        head: "// comment fonctionne utilisio",
        h: "Des outils qui font une chose, et qui disent comment",
        p: [
          `utilisio rassemble ${live.length} outils à usage unique pour les développeurs, les designers, celles et ceux qui écrivent pour le web, et quiconque doit convertir un fichier sans installer de logiciel. Chaque page s'ouvre directement sur l'outil. En dessous, elle explique ce qu'il fait vraiment, ses limites et les pièges courants de la tâche, écrits à partir du comportement réel de l'outil testé sur de vraies données, y compris ce qu'il ne fait pas.`,
          `${local} de ces outils tournent entièrement dans votre navigateur : vos fichiers et vos textes ne quittent pas l'onglet, ce qui permet d'y passer des contrats, des jetons d'API ou des exports clients. Les ${network.length} autres (${network.join(", ")}) doivent lire une page web que vous voulez contrôler, et passent donc par notre serveur. Chaque page outil l'indique par un point : vert pour local, orange pour réseau.`,
          "Pas de compte, pas d'inscription, pas de limite d'utilisation. Les outils favoris que vous marquez d'une étoile sont gardés dans votre navigateur, pas chez nous.",
        ],
        start: "// par où commencer",
      }
    : {
        head: "// how utilisio works",
        h: "Tools that do one thing, and explain how",
        p: [
          `utilisio brings together ${live.length} single-purpose tools for developers, designers, people who write for the web, and anyone who needs to convert a file without installing software. Each page opens straight on the tool. Below it, the page explains what the tool really does, its limits and the usual traps of the task, written from the tool's actual behaviour on real input, including what it doesn't do.`,
          `${local} of these tools run entirely in your browser: your files and text never leave the tab, so you can use them with contracts, API tokens or client exports. The other ${network.length} (${network.join(", ")}) have to read a web page you want to check, so they go through our server. Every tool page says which is which with a dot: green for local, orange for network.`,
          "No account, no signup, no usage limit. The tools you star as favorites are kept in your browser, not on our side.",
        ],
        start: "// where to start",
      };

  return (
    <div className="pb-12">
      <section className="mb-10">
        <SectionHead label={text.head} />
        <article className="bg-bg-1 border border-line p-6">
          <h3 className="font-mono text-[13px] text-fg font-medium mb-3">
            <span className="text-brand mr-2">{"#"}</span>
            {text.h}
          </h3>
          <div className="flex flex-col gap-3 max-w-[75ch]">
            {text.p.map((para) => (
              <p key={para} className="text-[13px] text-fg-1 leading-relaxed">{para}</p>
            ))}
            <p className="text-[13px] text-fg-1 leading-relaxed">
              {lang === "fr" ? "Qui est derrière ? Un développeur indépendant, qui explique " : "Who's behind it? An independent developer, who explains "}
              <Link href={`/${lang}/about#who`} className="text-brand underline hover:no-underline">
                {lang === "fr" ? "comment les outils sont testés et comment le site est financé" : "how the tools are tested and how the site is funded"}
              </Link>
              {lang === "fr" ? ". Une question ou un bug : " : ". A question or a bug: "}
              <Link href={`/${lang}/contact`} className="text-brand underline hover:no-underline">{lang === "fr" ? "écrivez-nous" : "write to us"}</Link>.
            </p>
          </div>
        </article>
      </section>

      <section>
        <SectionHead label={text.start} />
        <ul className="flex flex-col divide-y divide-line border border-line">
          {cats.map((c) => (
            <li key={c.id}>
              <Link href={`/${lang}/tools/${c.id}`} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-4 py-3 hover:bg-bg-2 transition-colors">
                <span className="font-mono text-[13px] text-brand w-7 shrink-0">{c.glyph}</span>
                <span className="text-[13px] text-fg font-medium sm:w-32 shrink-0">{c.label[lang]}</span>
                <span className="flex-1 text-[13px] text-fg-1">{HUB_LINES[c.id]?.[lang]}</span>
                <span className="font-mono text-[11px] text-dim-2 shrink-0">
                  {live.filter((t) => t.cat === c.id).length} {lang === "fr" ? "outils" : "tools"} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
