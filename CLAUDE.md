# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**utilisio** (`BRAND_NAME` dans `lib/brand.ts`) est une boîte à outils web tout-en-un (~25 micro-outils, gratuits, sans inscription). Stack : **Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui**.

Le prototype de référence visuelle est dans `docs/design/` (HTML standalone, ne pas modifier). Le brief complet est dans `docs/BRIEF.md`.

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
npx tsc --noEmit # type-check sans build
```

## Architecture

### Routing (App Router)
- `/` — home, sections par catégorie
- `/tools` — catalogue complet (sidebar + liste)
- `/tools/[category]` — catégorie filtrée
- `/t/[slug]` — page outil + workspace (workspaces en **lazy-load**)

### Règle de synchronisation SEO/GEO (critique)
`llms.txt`, `llms-full.txt` (routes `app/llms.txt/`, `app/llms-full.txt/`) et le
sitemap (`app/sitemap.ts`) sont **générés depuis `lib/tools.ts`** — un nouvel outil
s'y propage tout seul. En revanche, **toute nouvelle page transverse** (À propos,
FAQ, hub…) doit être ajoutée à la main dans le même commit : sections « Key URLs »
des deux routes llms + `staticRoutes` du sitemap. Jamais de compteur d'outils en dur
dans l'UI ou les metadata : toujours calculé depuis `TOOLS` (cf. FAQ, home, About).

### Design tokens → Tailwind
Les tokens CSS vivent dans `app/globals.css`. Stack : Tailwind v4 — pas de `tailwind.config.ts`, tout est en CSS via `@theme inline`. **Les couleurs ne sont jamais écrites en dur**, toujours via les classes utilitaires (`bg-bg`, `text-fg`, `border-line`, `text-brand`, etc.).

> **Note de nommage** : la couleur de marque est `--brand` en CSS (variable) et `text-brand` / `bg-brand` en Tailwind — pas `--accent`, qui est réservé aux tokens sémantiques shadcn (hover states). Les data-tweaks utilisent `data-accent` sur `<html>` mais modifient `--brand`.

Le thème dynamique (Tweaks) fonctionne par attributs `data-*` sur `<html>` (défauts dans `layout.tsx`) :
- `data-accent="green|amber|violet|cyan"` → modifie `--brand`, `--brand-soft`, `--brand-mid`
- `data-density="compact|regular|comfy"` → pilote `--pad` et `--gap`
- `data-font="geist|inter|ibm"`

### Composants — hiérarchie
```
AppShell (fond dot-grid + scanline)
└── Header (nav, lang switch fr/en, trigger ⌘K, statut "operational")
└── [page content]
    └── WorkspaceLayout → OptionsBar + Pane (input) + Pane (output)
        └── Editor (CodeMirror 6 ou Shiki — pas de highlighter regex maison)
└── Footer
└── CommandPalette (cmdk — brique de trouvabilité principale, ⌘K)
```

**shadcn pour les primitives** (Button, Input, Tabs, Dialog, Command, Sonner…), **wrappers maison fins** pour tout ce qui porte l'identité visuelle : `TerminalFrame`, `PromptBar`, `SectionHead`, `Cursor`, `Mono`, `Dim`, `LogoMark`.

### Données (`lib/tools.ts`)
```ts
interface Tool {
  slug: string;
  cat: 'file' | 'dev' | 'text' | 'design' | 'seo';
  glyph: string;            // "icône" ASCII
  name: Record<'fr'|'en', string>;
  desc: Record<'fr'|'en', string>;
  tags: string[];
  runs: number;             // utilisé pour le tri popularité uniquement (non affiché)
  privacy?: 'local' | 'network'; // défaut 'local'
  comingSoon?: boolean;     // désactive le lien, affiche badge "bientôt"
}
```

La source de vérité du catalogue est `docs/design/src/data.js` (25 outils). Les slugs et glyphes ASCII sont à reproduire à l'identique.

### Trust signals (règle critique)
`TrustSignals` adapte son message au champ `privacy` de l'outil :
- `local` → point **vert**, "runs in your browser / no upload, no logs"
- `network` → point **orange**, "proxied fetch / request not stored"

**Ne jamais afficher "no logs" sur un outil `privacy: 'network'`** (IP lookup, SEO analyzer, Meta preview).

### i18n
Dictionnaire FR/EN léger, pas d'i18next. Provider React context + hook `useLang()`. Toutes les strings UI passent par le dictionnaire — voir `docs/design/src/data.js` (`window.I18N`) pour la liste complète des clés.

## Ordre de build (phases)

**Phase 1 (périmètre serré)** :
1. Setup Next + TS + Tailwind + shadcn + tokens
2. App shell (AppShell, Header, Footer, ThemeProvider, I18nProvider)
3. CommandPalette (cmdk)
4. ToolCard + CategorySection → home
5. Workspace `JsonFormatter` (banc d'essai : split panes + Editor)

**Ne pas générer les 25 workspaces d'un coup.** Un workspace à la fois, vérifié avant le suivant.

## Skills disponibles (`.claude/skills/`)

Invoquer avec `/nom-du-skill` dans le chat.

| Skill | Chemin | Usage |
|-------|--------|-------|
| `security-audit-nextjs` | `.claude/skills/react/security-audit/SKILL.md` | Audit sécurité Route Handlers, XSS, env vars |
| `performance-audit-nextjs` | `.claude/skills/react/performance-audit-nextjs/SKILL.md` | Bundle, Core Web Vitals, lazy-load, cache |
| `code-review-nextjs` | `.claude/skills/react/code-review-nextjs/SKILL.md` | Review Server/Client Components, API routes |
| `error-handling` | `.claude/skills/react/error-handling/SKILL.md` | Error boundaries, gestion des erreurs workspaces |
| `typescript-conventions` | `.claude/skills/transversal/typescript-conventions/SKILL.md` | Cohérence des types TS |
| `l10n-formatting` | `.claude/skills/transversal/l10n-formatting/SKILL.md` | Vérification i18n FR/EN |
| `code-simplification` | `.claude/skills/transversal/code-simplification/SKILL.md` | Nettoyage patterns répétés |
| `seo-nextjs` | `.claude/skills/react/seo-nextjs/SKILL.md` | Audit SEO, generateMetadata, sitemap |
| `css-review` | `.claude/skills/css/review/SKILL.md` | Revue CSS / Tailwind |
| `api-consumption` | `.claude/skills/react/api-consumption/SKILL.md` | Patterns fetch, Route Handlers |

> Skills non pertinents pour ce projet : `auth-nextjs`, `forms`, `env-config`, `git-conventions`, `php-conventions`, `code-review-spa`, `performance-audit-spa`, `seo-react-spa`.

## Libs moteurs (hors UI)
- `cmdk` — palette de commandes
- `CodeMirror 6` ou `Shiki` — éditeur/highlighting (pas de regex maison)
- Web Crypto API + lib MD5 — hashes
- `pdf-lib` / `pdf.js` — PDF
- `ffmpeg.wasm` — audio/vidéo (lourd, ~25 Mo, lazy-load obligatoire)
- lib `qrcode` — QR codes
- `canvas toBlob` — Image converter
