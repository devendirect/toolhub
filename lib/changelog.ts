import type { Lang } from "./types";

/**
 * Journal des changements visibles du site, affiché sur /[lang]/changelog
 * (« Nouveautés »). Règle : tout commit feat/fix visible par un visiteur ajoute
 * son entrée ici, dans le même commit, en FR et en EN. Plus récente en premier.
 * Dates = dates de commit. Pas de jargon interne, pas de tiret long, jamais
 * « no logs » sur un outil réseau (vérifié par __tests__/catalog/changelog.test.ts).
 */

export type ChangeKind = "new" | "improved" | "fixed" | "removed";

export interface ChangeLink {
  /** Chemin interne sans préfixe de langue (`/convert/heic-to-jpg`) ou URL absolue. */
  href: string;
  label: Record<Lang, string>;
}

export interface ChangeEntry {
  /** Ancre stable : ne jamais la modifier une fois publiée (des liens y pointent). */
  id: string;
  date: string; // AAAA-MM-JJ
  kind: ChangeKind;
  tools?: string[];  // slugs de lib/tools.ts
  guides?: string[]; // slugs de lib/guides.ts
  links?: ChangeLink[];
  text: Record<Lang, { title: string; body: string }>;
}

export const CHANGELOG: ChangeEntry[] = [
  {
    id: "2026-10-10-lighter-pages",
    date: "2026-10-10",
    kind: "improved",
    text: {
      fr: {
        title: "Des pages plus légères : environ 220 Ko de code en moins au chargement",
        body: "La recherche ⌘K et le panneau d'apparence ne se chargent plus qu'au moment où vous les ouvrez, et la bibliothèque qui affichait « Copié ! » a été remplacée par quelques lignes. Chaque page télécharge environ 220 Ko de JavaScript en moins, et s'affiche plus vite sur mobile.",
      },
      en: {
        title: "Lighter pages: about 220 KB less code on load",
        body: "The ⌘K search and the appearance panel now load only when you open them, and the library that showed \"Copied!\" was replaced by a few lines of code. Every page downloads about 220 KB less JavaScript and shows up faster on mobile.",
      },
    },
  },
  {
    id: "2026-10-10-json-highlighting",
    date: "2026-10-10",
    kind: "fixed",
    tools: ["json-formatter"],
    text: {
      fr: {
        title: "Formateur JSON : une coloration syntaxique enfin lisible",
        body: "Les couleurs prévues pour l'éditeur ne s'appliquaient pas : les chaînes s'affichaient en rouge sombre et les nombres en vert foncé, presque illisibles sur le fond noir. Les clés sont maintenant en bleu, les chaînes en vert, les nombres en ambre, et les numéros de ligne sont plus lisibles.",
      },
      en: {
        title: "JSON formatter: syntax colors you can actually read",
        body: "The colors meant for the editor weren't applied: strings showed in dark red and numbers in dark green, barely readable on the black background. Keys are now blue, strings green, numbers amber, and line numbers are easier to read.",
      },
    },
  },
  {
    id: "2026-10-10-guide-jpeg-xl",
    date: "2026-10-10",
    kind: "improved",
    guides: ["webp-avif-jpeg"],
    text: {
      fr: {
        title: "Guide des formats d'image : ajout du JPEG XL, que Chrome lit depuis le 6 octobre",
        body: "Chrome 155 lit le JPEG XL par défaut depuis le 6 octobre 2026. Le guide explique où en sont Chrome, Safari et Firefox, quand ce format est utile et comment le servir avec un repli. Chaque fait est daté et relié à sa source officielle, dans un bloc de vérification en fin de guide.",
      },
      en: {
        title: "Image format guide: JPEG XL added, now that Chrome reads it since 6 October",
        body: "Chrome 155 reads JPEG XL by default since 6 October 2026. The guide explains where Chrome, Safari and Firefox stand, when the format is useful and how to serve it with a fallback. Every fact is dated and linked to its official source, in a fact-check block at the end of the guide.",
      },
    },
  },
  {
    id: "2026-10-10-compressor-unreadable",
    date: "2026-10-10",
    kind: "fixed",
    tools: ["image-compressor"],
    text: {
      fr: {
        title: "Compresseur d'images : un message clair quand le navigateur ne sait pas lire l'image",
        body: "Une image que le navigateur ne sait pas décoder, comme un JPEG XL avant Chrome 155 ou un HEIC hors de Safari, laissait le compresseur bloqué sur « compression… ». Il affiche maintenant que ce navigateur ne connaît pas le format.",
      },
      en: {
        title: "Image compressor: a clear message when the browser can't read the image",
        body: "An image the browser can't decode, such as JPEG XL before Chrome 155 or HEIC outside Safari, left the compressor stuck on \"compressing\". It now says that this browser doesn't support the format.",
      },
    },
  },
  {
    id: "2026-10-10-schema-faq",
    date: "2026-10-10",
    kind: "fixed",
    tools: ["schema-generator"],
    text: {
      fr: {
        title: "Générateur Schema : la page tient compte de la fin des résultats enrichis FAQ",
        body: "Google n'affiche plus les résultats enrichis FAQ depuis le 7 mai 2026, alors que la page du générateur parlait encore d'éligibilité pour FAQPage. Elle explique maintenant ce changement : le balisage reste valide et peut rester en place, mais il ne modifie plus l'apparence de la page dans Google.",
      },
      en: {
        title: "Schema generator: the page now reflects the end of FAQ rich results",
        body: "Google has not shown FAQ rich results since 7 May 2026, yet the generator's page still talked about FAQPage eligibility. It now explains the change: the markup stays valid and can stay in place, but it no longer changes how the page looks in Google.",
      },
    },
  },
  {
    id: "2026-10-10-compressor-jpeg-white",
    date: "2026-10-10",
    kind: "fixed",
    tools: ["image-compressor"],
    text: {
      fr: {
        title: "Compresseur d'images : fond blanc pour les images transparentes en JPEG",
        body: "Un PNG transparent compressé en JPEG ressortait sur fond noir, alors que le convertisseur d'images et l'outil de réduction à X Ko posent un fond blanc. Le compresseur fait maintenant de même. Pour garder la transparence, choisissez le WebP ou le PNG.",
      },
      en: {
        title: "Image compressor: white background for transparent images saved as JPEG",
        body: "A transparent PNG compressed to JPEG came out on a black background, while the image converter and the compress-to-KB tool use white. The compressor now does the same. To keep transparency, choose WebP or PNG.",
      },
    },
  },
  {
    id: "2026-10-10-env-duplicates",
    date: "2026-10-10",
    kind: "fixed",
    tools: ["env-formatter"],
    text: {
      fr: {
        title: "Le formateur .env garde la bonne valeur en cas de doublon",
        body: "Quand une clé apparaît deux fois, dotenv et un shell qui exécute source .env lisent la dernière valeur. L'outil gardait la première : le fichier nettoyé perdait donc la valeur que l'application utilisait vraiment. Il garde désormais la dernière occurrence.",
      },
      en: {
        title: "The .env formatter keeps the right value when a key is repeated",
        body: "When a key appears twice, dotenv and a shell running source .env read the last value. The tool kept the first one, so the cleaned file lost the value the application actually used. It now keeps the last occurrence.",
      },
    },
  },
  {
    id: "2026-10-10-favicon-preview",
    date: "2026-10-10",
    kind: "fixed",
    tools: ["favicon-generator"],
    text: {
      fr: {
        title: "L'aperçu du favicon s'affiche dans les quatre tailles",
        body: "Seule la taille sélectionnée était dessinée : les autres aperçus restaient vides ou montraient un ancien réglage. Les aperçus 16, 32, 48 et 64 px se mettent maintenant à jour ensemble, ce qui permet de juger la lisibilité en 16 px pendant qu'on règle les couleurs.",
      },
      en: {
        title: "The favicon preview now shows all four sizes",
        body: "Only the selected size was drawn: the other previews stayed empty or showed an old setting. The 16, 32, 48 and 64 px previews now update together, so you can judge legibility at 16 px while adjusting the colors.",
      },
    },
  },
  {
    id: "2026-10-10-compressor-drop",
    date: "2026-10-10",
    kind: "fixed",
    tools: ["image-compressor"],
    text: {
      fr: {
        title: "Après un glisser-déposer, le curseur de qualité recompresse l'image",
        body: "Une image déposée par glisser-déposer était bien compressée une première fois, mais changer ensuite la qualité ou le format ne produisait plus rien. Chaque réglage repart maintenant du fichier d'origine, quelle que soit la façon dont il a été ajouté.",
      },
      en: {
        title: "After a drag and drop, the quality slider recompresses the image",
        body: "An image added by drag and drop was compressed once, but changing the quality or the format afterwards did nothing. Every setting now starts again from the original file, however it was added.",
      },
    },
  },
  {
    id: "2026-10-01-heic",
    date: "2026-10-01",
    kind: "new",
    tools: ["image-converter", "pdf-converter", "compress-to-kb"],
    links: [
      { href: "/convert/heic-to-jpg", label: { fr: "HEIC vers JPG", en: "HEIC to JPG" } },
      { href: "/convert/heic-to-pdf", label: { fr: "HEIC vers PDF", en: "HEIC to PDF" } },
    ],
    text: {
      fr: {
        title: "Photos iPhone : HEIC vers JPG, PNG ou PDF",
        body: "Les photos HEIC des iPhone s'ouvrent maintenant dans le convertisseur d'images, le convertisseur PDF et l'outil de réduction à X Ko. Elles sont décodées dans votre navigateur par libheif en WebAssembly, chargé seulement quand vous déposez un fichier HEIC. Rien n'est envoyé.",
      },
      en: {
        title: "iPhone photos: HEIC to JPG, PNG or PDF",
        body: "HEIC photos from iPhones now open in the image converter, the PDF converter and the compress-to-KB tool. They are decoded in your browser by libheif compiled to WebAssembly, loaded only when you drop a HEIC file. Nothing is uploaded.",
      },
    },
  },
  {
    id: "2026-10-01-batch-zip",
    date: "2026-10-01",
    kind: "new",
    tools: ["image-converter"],
    text: {
      fr: {
        title: "Convertir plusieurs images d'un coup, récupérées dans un ZIP",
        body: "Déposez plusieurs fichiers dans le convertisseur d'images : ils sont traités un par un, avec une barre de progression et un bouton pour annuler, puis rangés dans une archive ZIP. Deux fichiers de même nom ne s'écrasent pas, le second est renommé.",
      },
      en: {
        title: "Convert several images at once and get them in a ZIP",
        body: "Drop several files into the image converter: they are processed one at a time, with a progress bar and a cancel button, then packed into a ZIP archive. Two files with the same name don't overwrite each other; the second one is renamed.",
      },
    },
  },
  {
    id: "2026-10-01-compress-to-kb",
    date: "2026-10-01",
    kind: "new",
    tools: ["compress-to-kb"],
    text: {
      fr: {
        title: "Nouvel outil : réduire une image sous un poids cible",
        body: "Choisissez un poids, 20, 50 ou 100 Ko par exemple, et l'outil cherche la meilleure qualité qui passe dessous, puis réduit les dimensions si la qualité seule ne suffit pas. Pensé pour les formulaires en ligne qui refusent les fichiers trop lourds.",
      },
      en: {
        title: "New tool: compress an image under a target size",
        body: "Pick a size, such as 20, 50 or 100 KB, and the tool looks for the best quality that fits under it, then reduces the dimensions if quality alone isn't enough. Built for online forms that reject files over a size limit.",
      },
    },
  },
  {
    id: "2026-10-01-guide-markdown-tables",
    date: "2026-10-01",
    kind: "new",
    tools: ["md-table"],
    guides: ["markdown-tables"],
    text: {
      fr: {
        title: "Guide : les tableaux Markdown",
        body: "Un guide sur les tableaux Markdown : la syntaxe de base, l'alignement des colonnes, l'échappement de la barre verticale dans une cellule, les différences de rendu d'un README à l'autre, et quand passer au HTML.",
      },
      en: {
        title: "Guide: Markdown tables",
        body: "A guide to Markdown tables: the basic syntax, column alignment, escaping a pipe inside a cell, how rendering differs from one README host to another, and when to switch to HTML.",
      },
    },
  },
  {
    id: "2026-09-26-open-source",
    date: "2026-09-26",
    kind: "new",
    links: [
      { href: "https://github.com/devendirect/toolhub", label: { fr: "Dépôt GitHub", en: "GitHub repository" } },
      { href: "/about", label: { fr: "À propos", en: "About" } },
    ],
    text: {
      fr: {
        title: "Le code source du site est public, sous licence MIT",
        body: "Le code d'utilisio est publié sur GitHub sous licence MIT. Chacun peut vérifier ce que font les outils, et en particulier que les fichiers traités dans le navigateur ne partent nulle part. Les pages outils, le pied de page et la page À propos y renvoient.",
      },
      en: {
        title: "The site's source code is public, under the MIT license",
        body: "utilisio's code is published on GitHub under the MIT license. Anyone can check what the tools do, in particular that files processed in the browser go nowhere. Tool pages, the footer and the About page link to it.",
      },
    },
  },
  {
    id: "2026-09-25-guides",
    date: "2026-09-25",
    kind: "new",
    guides: ["webp-avif-jpeg", "jwt-explained", "http-security-headers", "open-graph-link-previews", "json-yaml-toml"],
    text: {
      fr: {
        title: "Une section Guides, avec cinq premiers guides",
        body: "Cinq guides en français et en anglais, écrits à partir de ce que font les outils : choisir entre WebP, AVIF et JPEG, comprendre un JWT, les en-têtes HTTP de sécurité, les aperçus de liens Open Graph, et JSON, YAML ou TOML pour un fichier de configuration.",
      },
      en: {
        title: "A Guides section, with five first guides",
        body: "Five guides in English and French, written from what the tools do: choosing between WebP, AVIF and JPEG, understanding a JWT, HTTP security headers, Open Graph link previews, and JSON, YAML or TOML for a config file.",
      },
    },
  },
  {
    id: "2026-09-25-qr-wifi",
    date: "2026-09-25",
    kind: "new",
    tools: ["qr-generator"],
    text: {
      fr: {
        title: "QR code Wi-Fi, et une marge conforme à la norme",
        body: "Le générateur de QR code a un mode Wi-Fi : nom du réseau et mot de passe, et vos invités se connectent en scannant. Les caractères spéciaux du mot de passe sont échappés correctement. La marge blanche passe aussi de 2 à 4 modules, comme le demande la norme ISO 18004, pour une lecture plus fiable.",
      },
      en: {
        title: "Wi-Fi QR codes, and a quiet zone that meets the standard",
        body: "The QR code generator has a Wi-Fi mode: network name and password, and guests connect by scanning. Special characters in the password are escaped correctly. The white margin also goes from 2 to 4 modules, as the ISO 18004 standard requires, for more reliable scanning.",
      },
    },
  },
  {
    id: "2026-09-25-json-big-integers",
    date: "2026-09-25",
    kind: "fixed",
    tools: ["json-formatter"],
    text: {
      fr: {
        title: "Les grands identifiants ne sont plus arrondis par le formateur JSON",
        body: "Un nombre comme 1234567890123456789 ressortait arrondi à 1234567890123456800, comme dans la plupart des formateurs en ligne. Ces grands entiers sont maintenant conservés au chiffre près. Les erreurs indiquent aussi la ligne, la colonne et la cause probable dans tous les navigateurs.",
      },
      en: {
        title: "The JSON formatter no longer rounds large IDs",
        body: "A number such as 1234567890123456789 came out rounded to 1234567890123456800, as in most online formatters. These large integers are now kept digit for digit. Errors also give the line, column and likely cause in every browser.",
      },
    },
  },
  {
    id: "2026-09-25-image-resize",
    date: "2026-09-25",
    kind: "improved",
    tools: ["image-converter"],
    text: {
      fr: {
        title: "Le convertisseur d'images réduit aussi les dimensions",
        body: "Vous pouvez limiter la largeur à 1920, 1280 ou 800 pixels pendant la conversion ; une image plus petite n'est jamais agrandie. La page annonçait aussi une sortie AVIF que l'outil ne produisait pas : cette mention a été retirée.",
      },
      en: {
        title: "The image converter can also reduce dimensions",
        body: "You can cap the width at 1920, 1280 or 800 pixels during conversion; a smaller image is never enlarged. The page also advertised AVIF output, which the tool didn't produce: that claim has been removed.",
      },
    },
  },
  {
    id: "2026-09-25-pdf-worker",
    date: "2026-09-25",
    kind: "improved",
    tools: ["pdf-converter"],
    text: {
      fr: {
        title: "La conversion PDF ne charge plus de script depuis un site tiers",
        body: "Le moteur PDF.js était téléchargé depuis un CDN externe à chaque conversion : une requête vers un autre site, et une panne possible si ce site tombait. Il est maintenant servi par utilisio. Les PDF protégés par mot de passe affichent aussi un message clair.",
      },
      en: {
        title: "PDF conversion no longer loads a script from a third-party site",
        body: "The PDF.js engine was downloaded from an external CDN on every conversion: a request to another site, and a possible failure if that site went down. It is now served by utilisio. Password-protected PDFs also show a clear message.",
      },
    },
  },
  {
    id: "2026-09-25-palette",
    date: "2026-09-25",
    kind: "fixed",
    tools: ["palette-generator"],
    text: {
      fr: {
        title: "Générateur de palette : champ HEX et nombre de couleurs corrigés",
        body: "On ne pouvait pas taper une couleur dans le champ HEX, et le nombre de couleurs demandé était ignoré. Les deux fonctionnent, la confirmation de l'export CSS s'affiche, et les noms d'harmonies sont traduits sur la page française.",
      },
      en: {
        title: "Palette generator: HEX field and color count fixed",
        body: "You couldn't type a color in the HEX field, and the requested number of colors was ignored. Both work now, the CSS export confirmation appears, and the harmony names are translated on the French page.",
      },
    },
  },
  {
    id: "2026-09-25-meta-preview",
    date: "2026-09-25",
    kind: "improved",
    tools: ["meta-preview"],
    text: {
      fr: {
        title: "L'aperçu des balises meta lit le vrai titre de la page",
        body: "L'aperçu Google affichait le titre Open Graph au lieu de la balise title, que Google utilise réellement. C'est corrigé. L'ancien vérificateur Open Graph est intégré à cet outil, avec la liste complète des balises et une alerte si l'image est donnée en chemin relatif.",
      },
      en: {
        title: "The meta tag preview reads the page's real title",
        body: "The Google preview showed the Open Graph title instead of the title tag, which is what Google actually uses. That's fixed. The former Open Graph checker is merged into this tool, with the full list of tags and a warning when the image uses a relative path.",
      },
    },
  },
  {
    id: "2026-09-24-ip-lookup",
    date: "2026-09-24",
    kind: "removed",
    text: {
      fr: {
        title: "Recherche d'adresse IP suspendue",
        body: "L'outil s'appuyait sur l'offre gratuite d'un service de géolocalisation dont les conditions interdisent l'usage commercial. Il est retiré tant qu'une source de données compatible n'est pas en place.",
      },
      en: {
        title: "IP address lookup suspended",
        body: "The tool relied on the free plan of a geolocation service whose terms forbid commercial use. It is withdrawn until a compatible data source is in place.",
      },
    },
  },
];

export function latestChangeDate(): string {
  return CHANGELOG[0]?.date ?? "";
}

/** Entrée la plus récente qui renvoie vers une page de conversion (`/convert/<slug>`). */
export function latestChangeForPath(href: string): ChangeEntry | undefined {
  return CHANGELOG.find((e) => e.links?.some((l) => l.href === href));
}

/** Entrée la plus récente qui cite l'outil (pour « dernière évolution » sur sa page). */
export function latestChangeForTool(slug: string): ChangeEntry | undefined {
  return CHANGELOG.find((e) => e.tools?.includes(slug));
}
