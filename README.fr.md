# utilisio

🇬🇧 [English version](README.md)

**Des outils web gratuits qui tournent dans votre navigateur.** Une cinquantaine d'utilitaires à usage unique pour les développeurs, les designers et tous ceux qui doivent convertir un fichier : mise en forme de JSON, conversion d'images et de PDF, décodage de JWT, génération de mots de passe et de QR codes, vérification des en-têtes de sécurité HTTP, et d'autres. Sans compte, sans envoi de fichier pour les outils locaux, en français et en anglais.

[![Licence : MIT](https://img.shields.io/badge/licence-MIT-green.svg)](LICENSE)

- Site : **[utilisio.com](https://utilisio.com/fr)**
- Guides : [utilisio.com/fr/guides](https://utilisio.com/fr/guides)

---

## Pourquoi ce projet

La plupart des sites de « conversion en ligne » envoient vos fichiers sur leurs serveurs, limitent leur taille ou cachent ce que fait vraiment l'outil. utilisio prend le contre-pied :

- **Le local d'abord.** La plupart des outils traitent fichiers et textes entièrement dans l'onglet du navigateur (API Canvas, Web Crypto, pdf-lib, PDF.js, FFmpeg compilé en WebAssembly). Rien n'est envoyé à un serveur.
- **L'honnêteté sur les limites.** Chaque page outil explique ce que fait l'outil, ce qu'il ne fait pas et les pièges courants de la tâche, à partir de tests sur de vraies données.
- **La transparence sur les exceptions.** Trois outils ont besoin d'un serveur, parce qu'un navigateur ne peut pas lire directement un autre site (CORS) : le vérificateur d'en-têtes HTTP, l'analyseur SEO et l'aperçu des balises meta. Ils sont signalés comme outils réseau dans l'interface, et leurs résultats restent au plus une minute en mémoire.

## Fonctionnalités

| Catégorie | Exemples |
|---|---|
| Fichiers | Convertisseur et compresseur d'images, fusion de PDF, PDF ↔ images, convertisseurs audio et vidéo (FFmpeg.wasm), optimiseur SVG, extracteur ZIP |
| Développeur | Décodeur JWT et signature HS256, convertisseur de timestamp, testeur de regex, traducteur d'expressions cron, générateur de hash, générateurs d'UUID et de mots de passe, comparateur de texte, formateur `.env`, TOML ↔ JSON, vérificateur d'en-têtes de sécurité HTTP |
| Texte | Formateur JSON (conserve les entiers au-delà de 2^53, indique la ligne et la colonne de l'erreur dans tous les navigateurs), CSV ↔ JSON, compteur de mots, changement de casse, échappement pour URL et HTML, générateur de slug, score de lisibilité |
| Design | Sélecteur de couleur, générateur de palette, vérificateur de contraste WCAG, générateurs de dégradé CSS, d'ombre, d'arrondi et de grille, générateur de favicon |
| SEO | Aperçu des balises meta et Open Graph, analyseur SEO on-page, générateurs de robots.txt, de sitemap XML et de JSON-LD, générateur d'URL UTM |

Le catalogue complet se trouve dans [`lib/tools.ts`](lib/tools.ts).

## Pile technique

- [Next.js](https://nextjs.org) (App Router, génération statique, `output: "standalone"`) et TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4 (design tokens dans `app/globals.css`) et composants de base [shadcn/ui](https://ui.shadcn.com)
- [CodeMirror 6](https://codemirror.net) pour les éditeurs, [cmdk](https://cmdk.paco.me) pour la palette de commandes ⌘K
- [pdf-lib](https://pdf-lib.js.org), [PDF.js](https://mozilla.github.io/pdf.js/), [FFmpeg.wasm](https://ffmpegwasm.netlify.app), [qrcode](https://github.com/soldair/node-qrcode), [smol-toml](https://github.com/squirrelchat/smol-toml), [cheerio](https://cheerio.js.org) (analyse HTML côté serveur pour les outils réseau)
- [Vitest](https://vitest.dev) pour les tests

## Démarrage

Prérequis : **Node.js 20 ou plus récent** (22 recommandé) et npm.

```bash
git clone https://github.com/devendirect/toolhub.git
cd toolhub
npm ci
cp .env.example .env.local   # puis définir NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm run dev                  # http://localhost:3000
```

`npm run dev` et `npm run build` copient d'abord le worker PDF.js de `node_modules` vers `public/` (`scripts/copy-pdf-worker.mjs`) : les outils PDF ne chargent ainsi jamais de code depuis un CDN tiers. Le fichier copié est ignoré par git.

### Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (pages statiques + serveur autonome) |
| `npm run start` | Sert le build de production |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:run` | Vitest en mode surveillance / exécution unique |
| `npx tsc --noEmit` | Vérification des types sans build |

### Variables d'environnement

Voir [`.env.example`](.env.example). Toutes sont facultatives en développement.

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canonique du site : métadonnées, sitemap, hreflang, JSON-LD |
| `INDEXING_ENABLED` | Mettre `true` pour autoriser l'indexation par les moteurs (meta robots) |
| `NEXT_PUBLIC_GA_ID` | Identifiant Google Analytics 4, chargé seulement après consentement |
| `NEXT_PUBLIC_AFFILIATE_*` | Liens d'affiliation facultatifs sur quelques pages outils (marqués `rel="sponsored"`) |

Les variables `NEXT_PUBLIC_*` sont intégrées au moment du build : il faut reconstruire après les avoir modifiées.

## Structure du projet

```
app/[lang]/            Pages, une arborescence par langue (en, fr)
  t/[slug]/            Pages outils
  tools/[category]/    Pages catégories
  convert/[pair]/      Pages de conversion par format (ex. jpg-to-webp)
  guides/[slug]/       Guides approfondis
app/api/               Routes serveur des outils réseau (headers, seo, meta)
components/workspaces/ Un composant par outil, chargé à la demande
lib/tools.ts           Catalogue des outils, source de vérité unique
lib/tools-content.ts   Explications par outil ; lib/faq.ts pour les FAQ
lib/guides/            Contenu des guides
lib/json-format.ts     Analyseur JSON (position des erreurs, grands entiers, clés en double)
proxy.ts               Détection de la langue et redirections
scripts/               Scripts de build et de maintenance (copie du worker PDF.js, ping IndexNow)
__tests__/             Suites Vitest
```

Quelques conventions utiles :

- **Le catalogue pilote tout.** Le sitemap, `llms.txt`, `llms-full.txt` et les compteurs par catégorie sont générés depuis `lib/tools.ts`. Aucun nombre d'outils n'est écrit en dur dans l'interface.
- **Une i18n sans framework.** Un petit dictionnaire FR/EN (`lib/i18n.ts`) et un hook `useLang()` ; tous les textes de l'interface passent par lui.
- **Les couleurs viennent des design tokens**, jamais de valeurs écrites en dur.
- **Aucun aléatoire au rendu.** Les pages sont générées statiquement : tout ce qui est aléatoire (mots de passe, UUID) est produit dans le navigateur, une fois la page chargée.

## Déploiement

L'application se construit sous forme de serveur Node.js autonome :

```bash
npm ci
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
node .next/standalone/server.js
```

Les pages des outils audio et vidéo envoient les en-têtes `Cross-Origin-Opener-Policy` et `Cross-Origin-Embedder-Policy`, nécessaires à FFmpeg.wasm pour `SharedArrayBuffer` : voir `next.config.ts`.

## Contribuer

Les signalements de bugs et les idées d'outils sont les bienvenus : ouvrez une [issue](https://github.com/devendirect/toolhub/issues) en précisant l'outil, votre navigateur et les étapes pour reproduire. Pour tout ce qui dépasse la correction d'un bug, ouvrez une issue avant de commencer une pull request.

Avant de proposer une modification, lancez `npm run lint`, `npx tsc --noEmit` et `npm run test:run`.

## Sécurité

Merci de ne pas signaler de faille dans une issue publique. Écrivez à **contact@utilisio.com** en décrivant le problème et les étapes pour le reproduire, et laissez le temps de le corriger avant toute publication.

## Comment le projet est fait

utilisio est développé par un développeur web indépendant, avec l'aide de Claude, l'assistant d'IA d'Anthropic, utilisé comme binôme pour le code, les tests et les premières versions de la documentation. Chaque affirmation d'une page outil est vérifiée contre le comportement réel de l'outil avant publication.

## Licence

Code publié sous [licence MIT](LICENSE). Le nom et le logo utilisio ne sont pas couverts par la licence.

Les composants tiers conservent leur propre licence. En particulier, FFmpeg.wasm (LGPL 2.1) est chargé sans modification à l'exécution ; la liste complète des crédits open source figure sur la [page à propos](https://utilisio.com/fr/about).
