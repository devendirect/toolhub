# utilisio

🇫🇷 [Version française](README.fr.md)

**Free web tools that run in your browser.** About fifty single-purpose utilities for developers, designers and anyone who needs to convert a file: JSON formatting, image and PDF conversion, JWT decoding, password and QR code generation, HTTP security header checks, and more. No account, no upload for the local tools, available in English and French.

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

- Website: **[utilisio.com](https://utilisio.com)**
- Guides: [utilisio.com/en/guides](https://utilisio.com/en/guides)

---

## Why this project exists

Most "online converter" sites upload your files, cap their size, or hide what the tool actually does. utilisio takes the opposite approach:

- **Local first.** Most tools process files and text entirely in the browser tab (Canvas API, Web Crypto, pdf-lib, PDF.js, FFmpeg compiled to WebAssembly). Nothing is sent to a server.
- **Honest about limits.** Every tool page explains what the tool does, what it doesn't, and the usual traps of the task, written from tests on real input.
- **Transparent about the exceptions.** Three tools need a server because a browser can't read another site directly (CORS): the HTTP headers checker, the SEO analyzer and the meta tag preview. They are marked as network tools in the UI; results are kept in memory for one minute at most.

## Features

| Category | Examples |
|---|---|
| File | Image converter and compressor, PDF merge, PDF ↔ images, audio and video converters (FFmpeg.wasm), SVG optimizer, ZIP extractor |
| Developer | JWT decoder and HS256 signer, timestamp converter, regex tester, cron explainer, hash generator, UUID and password generators, diff viewer, `.env` formatter, TOML ↔ JSON, HTTP security headers checker |
| Text | JSON formatter (keeps integers beyond 2^53, reports error line and column in every browser), CSV ↔ JSON, word counter, case converter, URL and HTML escaping, slug generator, readability score |
| Design | Color picker, palette generator, WCAG contrast checker, CSS gradient, box shadow, border radius and grid generators, favicon generator |
| SEO | Meta tag and Open Graph preview, on-page SEO analyzer, robots.txt, XML sitemap and JSON-LD generators, UTM builder |

The full catalog lives in [`lib/tools.ts`](lib/tools.ts).

## Tech stack

- [Next.js](https://nextjs.org) (App Router, static generation, `output: "standalone"`) and TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 (design tokens in `app/globals.css`) and [shadcn/ui](https://ui.shadcn.com) primitives
- [CodeMirror 6](https://codemirror.net) for editors, [cmdk](https://cmdk.paco.me) for the ⌘K command palette
- [pdf-lib](https://pdf-lib.js.org), [PDF.js](https://mozilla.github.io/pdf.js/), [FFmpeg.wasm](https://ffmpegwasm.netlify.app), [qrcode](https://github.com/soldair/node-qrcode), [smol-toml](https://github.com/squirrelchat/smol-toml), [cheerio](https://cheerio.js.org) (server-side HTML parsing for the network tools)
- [Vitest](https://vitest.dev) for tests

## Getting started

Requirements: **Node.js 20 or later** (22 recommended) and npm.

```bash
git clone https://github.com/devendirect/toolhub.git
cd toolhub
npm ci
cp .env.example .env.local   # then set NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run dev                  # http://localhost:3000
```

`npm run dev` and `npm run build` first copy the PDF.js worker from `node_modules` into `public/` (`scripts/copy-pdf-worker.mjs`), so the PDF tools never load code from a third-party CDN. The copied file is git-ignored.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (static pages + standalone server) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:run` | Vitest in watch mode / single run |
| `npx tsc --noEmit` | Type-check without building |

### Environment variables

See [`.env.example`](.env.example). All of them are optional in development.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used for metadata, sitemap, hreflang and JSON-LD |
| `INDEXING_ENABLED` | Set to `true` to allow search engine indexing (robots meta) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 ID, loaded only after consent |
| `NEXT_PUBLIC_AFFILIATE_*` | Optional affiliate links shown on a few tool pages (marked `rel="sponsored"`) |

`NEXT_PUBLIC_*` variables are inlined at build time: rebuild after changing them.

## Project structure

```
app/[lang]/            Pages, one tree per language (en, fr)
  t/[slug]/            Tool pages
  tools/[category]/    Category hubs
  convert/[pair]/      Format-pair landing pages (e.g. jpg-to-webp)
  guides/[slug]/       Long-form guides
app/api/               Server routes for the network tools (headers, seo, meta)
components/workspaces/ One component per tool, lazy-loaded
lib/tools.ts           Tool catalog, the single source of truth
lib/tools-content.ts   Per-tool explanations; lib/faq.ts for FAQs
lib/guides/            Guide content
lib/json-format.ts     JSON scanner (error location, big integers, duplicate keys)
proxy.ts               Language detection and redirects
scripts/               Build and maintenance scripts (PDF.js worker copy, IndexNow ping)
__tests__/             Vitest suites
```

A few conventions worth knowing:

- **The catalog drives everything.** The sitemap, `llms.txt`, `llms-full.txt` and category counts are generated from `lib/tools.ts`. Tool counts are never hard-coded in the UI.
- **i18n without a framework.** A small FR/EN dictionary (`lib/i18n.ts`) and a `useLang()` hook; every UI string goes through it.
- **Colors come from design tokens**, never hard-coded values.
- **No randomness at render time.** Pages are statically generated, so anything random (passwords, UUIDs) is produced in the browser after mount.

## Deployment

The app builds as a standalone Node.js server:

```bash
npm ci
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
node .next/standalone/server.js
```

The audio and video tool pages send `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` headers (required by FFmpeg.wasm for `SharedArrayBuffer`); see `next.config.ts`.

## Contributing

Bug reports and tool suggestions are welcome: open an [issue](https://github.com/devendirect/toolhub/issues) describing the tool, your browser and the steps to reproduce. For anything larger than a bug fix, please open an issue before starting a pull request.

Please run `npm run lint`, `npx tsc --noEmit` and `npm run test:run` before submitting.

## Security

Please don't report vulnerabilities in public issues. Email **contact@utilisio.com** with a description and the steps to reproduce, and allow time for a fix before disclosure.

## How it's built

utilisio is developed by an independent web developer, with the help of Claude (Anthropic's AI assistant) as a pair-programming partner for code, tests and first drafts of the documentation. Every claim on a tool page is checked against the tool's actual behaviour before publication.

## License

Code released under the [MIT License](LICENSE). The utilisio name and logo are not covered by the license.

Third-party components keep their own licenses. In particular, FFmpeg.wasm (LGPL 2.1) is loaded unmodified at runtime; see the [about page](https://utilisio.com/en/about) for the full list of open-source credits.
