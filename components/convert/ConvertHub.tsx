import Link from "next/link";
import { CONVERT_PAIRS, FORMAT_LABEL } from "@/lib/convert-pairs";
import type { Lang } from "@/lib/types";

interface ConvertHubProps {
  lang: Lang;
  /** Paire à exclure (la page courante) */
  currentSlug?: string;
}

// Maillage interne du pilote pSEO : chaque page paire lie ses voisines,
// et la page outil mère (/t/image-converter) liste toutes les paires
export function ConvertHub({ lang, currentSlug }: ConvertHubProps) {
  const pairs = CONVERT_PAIRS.filter((p) => p.slug !== currentSlug);
  if (pairs.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="font-mono text-[11px] text-dim mb-3">
        {"// "}{lang === "fr" ? "conversions populaires" : "popular conversions"}
      </div>
      <div className="flex flex-wrap gap-2">
        {pairs.map((p) => (
          <Link
            key={p.slug}
            href={`/${lang}/convert/${p.slug}`}
            className="px-3 py-[6px] border border-line bg-bg-1 font-mono text-[12px] text-fg-1 hover:text-fg hover:border-brand-mid transition-colors"
          >
            {FORMAT_LABEL[p.from]} → {FORMAT_LABEL[p.to]}
          </Link>
        ))}
      </div>
    </section>
  );
}
