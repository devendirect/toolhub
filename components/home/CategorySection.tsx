import Link from "next/link";
import type { Tool, Category, Lang } from "@/lib/types";
import { localePath } from "@/lib/localePath";
import { SectionHead } from "./SectionHead";
import { ToolCard } from "./ToolCard";

interface CategorySectionProps {
  cat: Category;
  tools: Tool[];
  lang: Lang;
  density: "compact" | "regular" | "comfy";
  viewAllLabel: string;
}

const COLS: Record<string, string> = {
  compact: "grid-cols-4",
  regular: "grid-cols-3",
  comfy:   "grid-cols-2",
};

export function CategorySection({ cat, tools, lang, density, viewAllLabel }: CategorySectionProps) {
  const cols = COLS[density] ?? COLS.regular;
  const catLabel = cat.label[lang];

  return (
    <section className="mb-16">
      <SectionHead
        label={
          <>
            <span className="text-brand mr-1">{cat.glyph}</span>
            {`// ${catLabel.toLowerCase()} `}
            <span className="text-hot">{tools.length}</span>
          </>
        }
        action={
          <Link
            href={localePath(lang, `/tools/${cat.id}`)}
            className="font-mono text-[12px] text-dim hover:text-brand transition-colors duration-150"
          >
            {viewAllLabel} →
          </Link>
        }
      />

      <div className={`grid ${cols} border border-line`}>
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} lang={lang} catLabel={catLabel} />
        ))}
      </div>
    </section>
  );
}
