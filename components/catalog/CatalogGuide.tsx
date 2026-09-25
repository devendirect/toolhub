import { SectionHead } from "@/components/home/SectionHead";
import { TOOLS } from "@/lib/tools";
import type { Lang } from "@/lib/types";

/**
 * Mode d'emploi du catalogue complet (/tools), rendu côté serveur sous la
 * liste : comment il est rangé, trié, et ce que signifient les repères
 * (points vert/orange, badge « à venir », étoile). Nombres calculés depuis TOOLS.
 */
export function CatalogGuide({ lang }: { lang: Lang }) {
  const live = TOOLS.filter((t) => !t.comingSoon);
  const soon = TOOLS.length - live.length;
  const network = live.filter((t) => t.privacy === "network").length;

  const items = lang === "fr"
    ? [
        { h: "Cinq catégories", p: `Les ${live.length} outils disponibles sont rangés par usage : fichiers (convertir et assembler), développeur (jetons, dates, regex, hash, en-têtes), texte (données et prose), design (couleurs et CSS) et marketing (SEO et suivi de campagnes). Chaque catégorie a sa propre page, avec un guide « quel outil pour quel besoin ».` },
        { h: "Tri et recherche", p: "Le catalogue est trié par défaut selon l'utilisation, les outils les plus utilisés en premier ; vous pouvez le trier par nom. La recherche porte sur le nom de l'outil et sur ses mots-clés : taper « pdf », « jwt » ou « webp » suffit à retrouver l'outil concerné." },
        { h: "Local ou réseau", p: `Sur chaque page outil, un point vert signifie que tout se passe dans votre navigateur. Un point orange signale l'un des ${network} outils réseau, qui doivent lire une page web à votre demande et passent par notre serveur, sans rien conserver durablement.` },
        { h: "Badges et favoris", p: `${soon > 0 ? `Le badge « à venir » marque ${soon === 1 ? "un outil désactivé" : `${soon} outils désactivés`} pour le moment, en attente d'une solution conforme. ` : ""}L'étoile d'une page outil l'ajoute à vos favoris, affichés en tête de l'accueil et disponibles comme filtre dans la barre latérale du catalogue. Ils sont enregistrés dans votre navigateur, sans compte.` },
      ]
    : [
        { h: "Five categories", p: `The ${live.length} available tools are grouped by use: file (convert and assemble), developer (tokens, dates, regex, hashes, headers), text (data and prose), design (colors and CSS) and marketing (SEO and campaign tracking). Each category has its own page, with a which-tool-for-which-job guide.` },
        { h: "Sorting and search", p: "The catalog is sorted by usage by default, most used tools first; you can sort it by name instead. Search looks at tool names and keywords, so typing pdf, jwt or webp is enough to find the right tool." },
        { h: "Local or network", p: `On every tool page, a green dot means everything happens in your browser. An orange dot marks one of the ${network} network tools, which have to read a web page for you and go through our server, keeping nothing beyond a short in-memory cache.` },
        { h: "Badges and favorites", p: `${soon > 0 ? `The coming soon badge marks ${soon === 1 ? "a tool that is disabled" : `${soon} tools that are disabled`} for now, until a compliant solution is in place. ` : ""}The star on a tool page adds it to your favorites, shown at the top of the home page and available as a filter in the catalog sidebar. They're saved in your browser, with no account.` },
      ];

  return (
    <section className="pb-12">
      <SectionHead label={lang === "fr" ? "// comment lire ce catalogue" : "// how to read this catalog"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
        {items.map((it) => (
          <article key={it.h} className="bg-bg-1 p-6">
            <h3 className="font-mono text-[13px] text-fg font-medium mb-3">
              <span className="text-brand mr-2">{"#"}</span>
              {it.h}
            </h3>
            <p className="text-[13px] text-fg-1 leading-relaxed">{it.p}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
