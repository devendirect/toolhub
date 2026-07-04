"use client";

import { useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { TOOLS, CATEGORIES } from "@/lib/tools";
import type { Tool, Lang } from "@/lib/types";
import { useLang } from "@/components/providers/I18nProvider";
import { usePalette } from "@/components/providers/PaletteProvider";
import { track } from "@/lib/analytics";

function scoreTool(tool: Tool, q: string, lang: Lang): number {
  const name = tool.name[lang].toLowerCase();
  const tags = tool.tags.join(" ");
  const cat = CATEGORIES.find((c) => c.id === tool.cat)?.label[lang]?.toLowerCase() ?? "";
  const hay = `${name} ${tags} ${cat} ${tool.slug}`;
  if (!hay.includes(q)) {
    let i = 0;
    for (const ch of hay) if (ch === q[i]) i++;
    return i === q.length ? 1 : -1;
  }
  let s = 10;
  if (name.startsWith(q)) s += 100;
  else if (name.includes(q)) s += 50;
  if (tags.includes(q)) s += 20;
  s += Math.min(tool.runs / 5000, 15);
  return s;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-block px-[5px] py-[1px] font-mono text-[10px] border border-line-2 rounded-[3px] text-dim bg-bg">
      {children}
    </kbd>
  );
}

function ToolRow({ tool, lang, onSelect }: { tool: Tool; lang: Lang; onSelect: () => void }) {
  const catLabel = CATEGORIES.find((c) => c.id === tool.cat)?.label[lang] ?? "";
  return (
    <Command.Item value={`${tool.slug}-${tool.cat}`} onSelect={onSelect}>
      <span className="font-mono text-[12px] text-dim w-8 shrink-0 select-none">{tool.glyph}</span>
      <span className="flex-1 text-[14px] text-fg">{tool.name[lang]}</span>
      <span className="font-mono text-[11px] text-dim hidden sm:block">{catLabel}</span>
      <span className="font-mono text-[11px] text-dim-2 hidden md:block">
        {tool.tags.slice(0, 2).map((t) => `#${t}`).join(" ")}
      </span>
      <span className="cp-arrow font-mono text-[11px] text-brand opacity-0 transition-opacity">↵</span>
    </Command.Item>
  );
}

function GroupHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-[6px] font-mono text-[11px] text-dim border-b border-line bg-bg">
      {children}
    </div>
  );
}

export function CommandPalette() {
  const { open, setOpen } = usePalette();
  const { lang } = useLang();
  const router = useRouter();
  const [q, setQ] = useState("");
  const ql = q.trim().toLowerCase();

  useEffect(() => { if (open) setQ(""); }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const { flat, groups } = useMemo(() => {
    if (ql) {
      const ranked = TOOLS
        .map((tool) => ({ tool, s: scoreTool(tool, ql, lang) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.tool);
      return { flat: ranked, groups: null };
    }
    const popular = [...TOOLS].sort((a, b) => b.runs - a.runs).slice(0, 4);
    const byCat = CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
      cat: c,
      tools: TOOLS.filter((t) => t.cat === c.id),
    }));
    return { flat: [...popular, ...byCat.flatMap((g) => g.tools)], groups: { popular, byCat } };
  }, [ql, lang]);

  const navigate = (tool: Tool) => {
    // Événement standard GA4 : dit quels outils les gens cherchent (et lesquels manquent)
    if (ql) track("search", { search_term: ql, tool_slug: tool.slug });
    router.push(`/${lang}/t/${tool.slug}`);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] animate-cp-fade"
      style={{ backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onMouseDown={() => setOpen(false)}
      onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
    >
      <div
        className="w-full max-w-[620px] mx-4 rounded bg-bg-1 border border-line overflow-hidden animate-cp-pop"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px var(--line)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false} loop>

          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
            <span className="font-mono text-[14px] text-brand shrink-0">{">"}</span>
            <Command.Input
              value={q}
              onValueChange={(v) => setQ(v)}
              placeholder={lang === "fr"
                ? "rechercher un outil, un tag, une catégorie…"
                : "search a tool, tag, category…"}
              className="flex-1 bg-transparent font-mono text-[14px] text-fg placeholder:text-dim outline-none"
              autoFocus
            />
            <Kbd>esc</Kbd>
          </div>

          {/* Results */}
          <Command.List className="max-h-[400px] overflow-y-auto overscroll-contain">
            <Command.Empty className="px-4 py-10 font-mono text-[13px] text-dim text-center">
              {"// "}{lang === "fr" ? `aucun résultat pour "${q}"` : `no results for "${q}"`}
            </Command.Empty>

            {groups ? (
              <>
                <Command.Group
                  heading={lang === "fr" ? "populaires" : "popular"}
                  className="[&>[cmdk-group-heading]]:block"
                >
                  <GroupHead>{"// "}{lang === "fr" ? "populaires" : "popular"}</GroupHead>
                  {groups.popular.map((tool) => (
                    <ToolRow key={`pop-${tool.slug}`} tool={tool} lang={lang} onSelect={() => navigate(tool)} />
                  ))}
                </Command.Group>

                {groups.byCat.map((g) => (
                  <Command.Group key={g.cat.id} heading={g.cat.label[lang]}>
                    <GroupHead>
                      <span>{g.cat.glyph}</span>
                      <span className="ml-2">{"// "}{g.cat.label[lang].toLowerCase()}</span>
                      <span className="ml-auto float-right text-dim-2">{g.tools.length}</span>
                    </GroupHead>
                    {g.tools.map((tool) => (
                      <ToolRow key={`cat-${tool.slug}`} tool={tool} lang={lang} onSelect={() => navigate(tool)} />
                    ))}
                  </Command.Group>
                ))}
              </>
            ) : (
              <Command.Group>
                {flat.map((tool) => (
                  <ToolRow key={tool.slug} tool={tool} lang={lang} onSelect={() => navigate(tool)} />
                ))}
              </Command.Group>
            )}
          </Command.List>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-line font-mono text-[11px] text-dim">
            <span className="flex items-center gap-1">
              <Kbd>↑</Kbd><Kbd>↓</Kbd>
              <span className="ml-1">{lang === "fr" ? "naviguer" : "navigate"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Kbd>↵</Kbd>
              <span className="ml-1">{lang === "fr" ? "ouvrir" : "open"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Kbd>esc</Kbd>
              <span className="ml-1">{lang === "fr" ? "fermer" : "close"}</span>
            </span>
            <span className="ml-auto">{flat.length} {lang === "fr" ? "résultats" : "results"}</span>
          </div>

        </Command>
      </div>
    </div>
  );
}
