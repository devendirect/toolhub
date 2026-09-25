import type { Localized } from "./types";

/**
 * Contenu éditorial des pages catégories (/tools/[category]) : ce qui en fait
 * des hubs et non de simples listes. Rendu côté serveur par CategoryHub, sous
 * le catalogue. Les liens vers les outils sont générés depuis `guide.slug` —
 * un slug inconnu fait échouer __tests__/catalog/category-content.test.ts.
 */
export interface CategoryHubContent {
  intro: { h: Localized; p: { en: string[]; fr: string[] } };
  guide: { need: Localized; slug: string }[];
  faq: { q: Localized; a: Localized }[];
}

export const CATEGORY_CONTENT: Record<"file" | "dev" | "text" | "design" | "seo", CategoryHubContent> = {
  file: {
    intro: {
      h: { en: "Converting files without uploading them", fr: "Convertir des fichiers sans les envoyer" },
      p: {
        en: [
          "Every tool in this category works on your files inside the browser tab. Images are redrawn on a canvas, PDFs are read and assembled with PDF.js and pdf-lib, audio and video go through FFmpeg compiled to WebAssembly. Nothing is sent to a server, which is what makes these tools usable for payslips, contracts, ID scans or unreleased client work.",
          "The price of working locally is paid once, and only by the tools that need it. The audio and video converters download the FFmpeg engine, about 20 MB, the first time you use them; the other tools start instantly. The limit is your device's memory rather than an upload cap, so a long 4K video is better handled by desktop software, while everyday images, PDFs and audio files convert in seconds.",
        ],
        fr: [
          "Chaque outil de cette catégorie travaille sur vos fichiers dans l'onglet du navigateur. Les images sont redessinées sur un canvas, les PDF lus et assemblés avec PDF.js et pdf-lib, l'audio et la vidéo passent par FFmpeg compilé en WebAssembly. Rien n'est envoyé à un serveur : c'est ce qui rend ces outils utilisables pour des fiches de paie, des contrats, des scans de pièces d'identité ou des travaux clients non publiés.",
          "Le prix du travail en local se paie une fois, et seulement pour les outils qui en ont besoin. Les convertisseurs audio et vidéo téléchargent le moteur FFmpeg, environ 20 Mo, à leur première utilisation ; les autres outils démarrent tout de suite. La limite est la mémoire de votre appareil plutôt qu'un plafond d'envoi : une longue vidéo 4K se traite mieux avec un logiciel installé, tandis que les images, PDF et fichiers audio du quotidien se convertissent en quelques secondes.",
        ],
      },
    },
    guide: [
      { need: { en: "Make a photo lighter for a website, or change its format", fr: "Alléger une photo pour un site, ou changer son format" }, slug: "image-converter" },
      { need: { en: "Shrink an image while keeping its format, and see the bytes saved", fr: "Réduire le poids d'une image en gardant son format, et voir le gain" }, slug: "image-compressor" },
      { need: { en: "Clean up an SVG exported from Figma or Illustrator", fr: "Nettoyer un SVG exporté de Figma ou d'Illustrator" }, slug: "svg-optimizer" },
      { need: { en: "Combine several PDFs into one file", fr: "Réunir plusieurs PDF en un seul fichier" }, slug: "pdf-merge" },
      { need: { en: "Turn PDF pages into images, or photos of documents into a PDF", fr: "Transformer des pages PDF en images, ou des photos de documents en PDF" }, slug: "pdf-converter" },
      { need: { en: "Convert an audio file between MP3, WAV, FLAC, AAC or OGG", fr: "Convertir un fichier audio entre MP3, WAV, FLAC, AAC ou OGG" }, slug: "audio-converter" },
      { need: { en: "Re-encode a video, shrink its resolution or make a GIF", fr: "Réencoder une vidéo, réduire sa résolution ou en faire un GIF" }, slug: "video-converter" },
      { need: { en: "See what's inside a ZIP and extract a single file", fr: "Voir le contenu d'un ZIP et en extraire un seul fichier" }, slug: "zip-extractor" },
    ],
    faq: [
      { q: { en: "Are my files uploaded anywhere?", fr: "Mes fichiers sont-ils envoyés quelque part ?" },
        a: { en: "No. Every file tool here reads and writes files inside your browser tab. The only downloads are the tools' own engines, such as FFmpeg for audio and video; your files never leave your computer.",
             fr: "Non. Chaque outil fichiers lit et écrit les fichiers dans votre onglet. Les seuls téléchargements concernent les moteurs des outils eux-mêmes, comme FFmpeg pour l'audio et la vidéo ; vos fichiers ne quittent jamais votre ordinateur." } },
      { q: { en: "Is there a file size limit?", fr: "Y a-t-il une limite de taille ?" },
        a: { en: "There's no upload limit, since nothing is uploaded. The practical limit is your device's memory: everyday images, PDFs and audio are fine, while very long high-resolution videos can make the tab slow on a modest computer.",
             fr: "Pas de limite d'envoi, puisque rien n'est envoyé. La limite pratique est la mémoire de votre appareil : images, PDF et audio du quotidien passent sans souci, alors que de très longues vidéos haute résolution peuvent ralentir l'onglet sur un ordinateur modeste." } },
      { q: { en: "Image converter or image compressor: which one?", fr: "Convertisseur ou compresseur d'images : lequel choisir ?" },
        a: { en: "Use the converter to change format (to WebP, for example) or to reduce the width in pixels, which saves the most weight. Use the compressor to keep the format and tune the quality precisely, while watching the exact size gained.",
             fr: "Le convertisseur sert à changer de format (vers le WebP, par exemple) ou à réduire la largeur en pixels, ce qui fait gagner le plus de poids. Le compresseur sert à garder le format et à régler finement la qualité, en suivant le gain exact." } },
    ],
  },

  dev: {
    intro: {
      h: { en: "Small tools for the moments between two commands", fr: "De petits outils pour les moments entre deux commandes" },
      p: {
        en: [
          "These are the checks you'd otherwise do with a one-off script or a search: decoding a JWT to read its expiry, turning a Unix timestamp into a date, testing a regex against real input, hashing a file to verify a download, reading a cron expression before committing it. Each tool does one of those jobs and shows exactly what it did.",
          "Most of them run entirely in your browser, which matters here more than anywhere: developers paste tokens, secrets, .env files and production payloads. A JWT pasted into the decoder, a key used by the JWT generator or a password produced by the password generator never leaves the tab. The exception is the HTTP headers checker, which has to request the site you want to test, so it goes through our server; it's marked as a network tool.",
        ],
        fr: [
          "Ce sont les vérifications qu'on ferait sinon avec un script jetable ou une recherche : décoder un JWT pour lire son expiration, transformer un timestamp Unix en date, tester une regex sur de vraies données, hasher un fichier pour vérifier un téléchargement, lire une expression cron avant de la commiter. Chaque outil fait un de ces travaux et montre exactement ce qu'il a fait.",
          "La plupart tournent entièrement dans votre navigateur, ce qui compte ici plus qu'ailleurs : on y colle des jetons, des secrets, des fichiers .env et des payloads de production. Un JWT collé dans le décodeur, une clé utilisée par le générateur de JWT ou un mot de passe produit par le générateur ne quittent jamais l'onglet. L'exception est le vérificateur d'en-têtes HTTP, qui doit interroger le site à tester et passe donc par notre serveur ; il est signalé comme outil réseau.",
        ],
      },
    },
    guide: [
      { need: { en: "Read the claims and expiry of a JWT", fr: "Lire le contenu et l'expiration d'un JWT" }, slug: "jwt-decoder" },
      { need: { en: "Sign a test token with an HS256 secret", fr: "Signer un jeton de test avec un secret HS256" }, slug: "jwt-generator" },
      { need: { en: "Turn a Unix timestamp into a date, and spot a seconds/milliseconds mix-up", fr: "Transformer un timestamp Unix en date, et repérer une confusion secondes/millisecondes" }, slug: "timestamp" },
      { need: { en: "Test a regular expression on real input", fr: "Tester une expression régulière sur de vraies données" }, slug: "regex-tester" },
      { need: { en: "Understand or build a cron schedule", fr: "Comprendre ou construire une planification cron" }, slug: "cron-generator" },
      { need: { en: "Verify a download with MD5, SHA-1 or SHA-256", fr: "Vérifier un téléchargement en MD5, SHA-1 ou SHA-256" }, slug: "hash-generator" },
      { need: { en: "Generate random v4 UUIDs", fr: "Générer des UUID v4 aléatoires" }, slug: "uuid-generator" },
      { need: { en: "Create a strong password for a database, an FTP account or an app secret", fr: "Créer un mot de passe fort pour une base de données, un compte FTP ou un secret d'application" }, slug: "password-generator" },
      { need: { en: "Compare two versions of a config file or a function", fr: "Comparer deux versions d'un fichier de config ou d'une fonction" }, slug: "diff-viewer" },
      { need: { en: "Sort and clean a .env file", fr: "Trier et nettoyer un fichier .env" }, slug: "env-formatter" },
      { need: { en: "Read a Cargo.toml or pyproject.toml as JSON", fr: "Lire un Cargo.toml ou un pyproject.toml en JSON" }, slug: "toml-json" },
      { need: { en: "Check a site's security headers after a deploy", fr: "Vérifier les en-têtes de sécurité d'un site après une mise en production" }, slug: "headers-checker" },
    ],
    faq: [
      { q: { en: "Is it safe to paste tokens and secrets into these tools?", fr: "Puis-je coller des jetons et des secrets dans ces outils ?" },
        a: { en: "For the local tools, yes: the text is processed in your browser and never sent anywhere. Only the tools marked as network tools, such as the HTTP headers checker, make a request through our server, and they send the URL you test, not your secrets.",
             fr: "Pour les outils locaux, oui : le texte est traité dans votre navigateur et n'est envoyé nulle part. Seuls les outils signalés comme outils réseau, comme le vérificateur d'en-têtes HTTP, font une requête par notre serveur, et ils envoient l'URL testée, pas vos secrets." } },
      { q: { en: "Which JavaScript features do the regex tester and the other tools use?", fr: "Sur quelles fonctions JavaScript s'appuient le testeur de regex et les autres outils ?" },
        a: { en: "The browser's own: the regex tester uses JavaScript's RegExp with the g, i, m, s and u flags, hashes come from the Web Crypto API, UUIDs from crypto.randomUUID. Results match what your own JavaScript code would produce with the same functions.",
             fr: "Celles du navigateur : le testeur de regex utilise RegExp de JavaScript avec les flags g, i, m, s et u, les hash viennent de la Web Crypto API, les UUID de crypto.randomUUID. Les résultats correspondent à ce que votre propre code JavaScript produirait avec les mêmes fonctions." } },
      { q: { en: "Why is the JSON formatter in the Text category?", fr: "Pourquoi le formateur JSON est-il dans la catégorie Texte ?" },
        a: { en: "Because it's used as much for reading data as for coding: API responses, exports, config files. You'll find it with the other data tools, CSV to JSON and URL encoding, in the Text category.",
             fr: "Parce qu'il sert autant à lire des données qu'à coder : réponses d'API, exports, fichiers de config. Vous le trouverez avec les autres outils de données, CSV vers JSON et encodage d'URL, dans la catégorie Texte." } },
    ],
  },

  text: {
    intro: {
      h: { en: "Text and data, cleaned up in one paste", fr: "Du texte et des données, nettoyés en un collage" },
      p: {
        en: [
          "Two families live here. The first works on data: formatting and validating JSON, converting CSV to JSON and back, removing duplicate lines from a list. The second works on prose: counting words against a limit, changing case, fixing text copied from a PDF that breaks at every line, measuring how easy a text is to read.",
          "A third group is easy to mix up: escaping. URL encoding, HTML entities and string escaping all turn special characters into safe sequences, but for three different destinations. Percent-encoding is for a value placed in a URL, HTML entities for text inserted into a web page, string escaping for a value placed inside JavaScript, SQL or a shell command. Using the wrong one produces text that looks escaped and still breaks, so pick by where the text is going.",
        ],
        fr: [
          "Deux familles se partagent cette catégorie. La première travaille sur des données : formater et valider du JSON, convertir un CSV en JSON et inversement, supprimer les doublons d'une liste. La seconde travaille sur la prose : compter les mots face à une limite, changer la casse, réparer un texte copié d'un PDF coupé à chaque ligne, mesurer la facilité de lecture d'un texte.",
          "Un troisième groupe est facile à confondre : l'échappement. L'encodage d'URL, les entités HTML et l'échappement de chaînes transforment tous des caractères spéciaux en séquences sûres, mais pour trois destinations différentes. L'encodage en pourcentage sert à une valeur placée dans une URL, les entités HTML à un texte inséré dans une page web, l'échappement de chaînes à une valeur placée dans du JavaScript, du SQL ou une commande shell. Se tromper donne un texte qui paraît échappé et casse quand même : choisissez selon l'endroit où le texte va.",
        ],
      },
    },
    guide: [
      { need: { en: "Read or fix a JSON file, and find the character that breaks it", fr: "Lire ou réparer un JSON, et trouver le caractère qui le casse" }, slug: "json-formatter" },
      { need: { en: "Turn a spreadsheet export into JSON, or JSON into CSV", fr: "Transformer un export de tableur en JSON, ou un JSON en CSV" }, slug: "csv-json" },
      { need: { en: "Remove duplicate lines from a list of emails, URLs or tags", fr: "Supprimer les lignes en double d'une liste d'e-mails, d'URL ou de tags" }, slug: "deduplicate-lines" },
      { need: { en: "Count words and characters against a limit", fr: "Compter mots et caractères face à une limite" }, slug: "word-counter" },
      { need: { en: "Fix text copied from a PDF that breaks at every line", fr: "Réparer un texte copié d'un PDF coupé à chaque ligne" }, slug: "remove-linebreaks" },
      { need: { en: "Put a value in a URL query string", fr: "Placer une valeur dans les paramètres d'une URL" }, slug: "url-encoder" },
      { need: { en: "Show code or user text safely inside HTML", fr: "Afficher du code ou un texte utilisateur sans risque dans du HTML" }, slug: "html-entities" },
      { need: { en: "Escape a string for JavaScript, SQL or Bash", fr: "Échapper une chaîne pour JavaScript, SQL ou Bash" }, slug: "string-escape" },
      { need: { en: "Turn a title into a clean URL slug", fr: "Transformer un titre en slug d'URL propre" }, slug: "slug-generator" },
      { need: { en: "Check whether a text is easy to read", fr: "Vérifier si un texte se lit facilement" }, slug: "readability" },
    ],
    faq: [
      { q: { en: "URL encoding, HTML entities or string escaping: which one do I need?", fr: "Encodage d'URL, entités HTML ou échappement de chaînes : lequel choisir ?" },
        a: { en: "It depends on where the text goes. Inside a URL, use URL encoding. Inside a web page, use HTML entities. Inside JavaScript, SQL or a shell command, use string escaping for that language. Each one protects against a different kind of break.",
             fr: "Cela dépend de l'endroit où va le texte. Dans une URL, l'encodage d'URL. Dans une page web, les entités HTML. Dans du JavaScript, du SQL ou une commande shell, l'échappement propre à ce langage. Chacun protège d'un type de casse différent." } },
      { q: { en: "Is the text I paste stored?", fr: "Le texte que je colle est-il conservé ?" },
        a: { en: "No. Every text tool in this category works in your browser: nothing is sent to a server or saved. You can paste customer lists or internal documents.",
             fr: "Non. Chaque outil texte de cette catégorie fonctionne dans votre navigateur : rien n'est envoyé à un serveur ni enregistré. Vous pouvez coller des listes de clients ou des documents internes." } },
      { q: { en: "Can these tools handle accents and emojis?", fr: "Ces outils gèrent-ils les accents et les emojis ?" },
        a: { en: "Yes. The case converter, the text reverser and the slug generator handle accented letters, and the reverser keeps emojis intact. The slug generator removes accents on purpose, since URLs are safer in plain ASCII.",
             fr: "Oui. Le convertisseur de casse, l'inverseur de texte et le générateur de slug gèrent les lettres accentuées, et l'inverseur garde les emojis intacts. Le générateur de slug retire volontairement les accents, les URL étant plus sûres en ASCII simple." } },
    ],
  },

  design: {
    intro: {
      h: { en: "CSS and color, with the code ready to paste", fr: "CSS et couleurs, avec le code prêt à coller" },
      p: {
        en: [
          "The CSS generators here share one principle: you adjust with sliders, you see the result live, and you copy a declaration you can paste as is. Gradients, box shadows, border radius and grid layouts are properties you can write by hand, but tuning a shadow's blur and spread or a grid's column sizes is faster when you see each change.",
          "The color tools go together. The color picker gives every format of one color, the palette generator builds harmonies around it, and the contrast checker tells you whether text on that color is readable. That last step is the one people skip. Two colors with the same lightness in HSL can differ a lot to the eye, so a palette that looks balanced can still fail the WCAG contrast ratios for text.",
        ],
        fr: [
          "Les générateurs CSS de cette catégorie suivent un même principe : vous réglez avec des curseurs, vous voyez le résultat en direct, et vous copiez une déclaration à coller telle quelle. Dégradés, ombres, arrondis et grilles s'écrivent à la main, mais régler le flou et l'étalement d'une ombre ou la taille des colonnes d'une grille va plus vite quand on voit chaque changement.",
          "Les outils de couleur vont ensemble. Le sélecteur de couleur donne tous les formats d'une couleur, le générateur de palette construit des harmonies autour d'elle, et le vérificateur de contraste dit si un texte posé dessus reste lisible. Cette dernière étape est celle qu'on saute. Deux couleurs de même luminosité HSL peuvent être très différentes pour l'œil : une palette qui paraît équilibrée peut quand même échouer aux ratios de contraste WCAG pour le texte.",
        ],
      },
    },
    guide: [
      { need: { en: "Get the HEX, RGB, HSL and HSV values of a color", fr: "Obtenir les valeurs HEX, RGB, HSL et HSV d'une couleur" }, slug: "color-picker" },
      { need: { en: "Build a palette around a brand color", fr: "Construire une palette autour d'une couleur de marque" }, slug: "palette-generator" },
      { need: { en: "Check that text is readable on its background (WCAG AA and AAA)", fr: "Vérifier qu'un texte est lisible sur son fond (WCAG AA et AAA)" }, slug: "contrast-checker" },
      { need: { en: "Design a linear or radial CSS gradient", fr: "Créer un dégradé CSS linéaire ou radial" }, slug: "gradient-generator" },
      { need: { en: "Tune a box shadow, including inset shadows", fr: "Régler une ombre portée, y compris intérieure" }, slug: "box-shadow" },
      { need: { en: "Round corners separately, in px or %", fr: "Arrondir les coins séparément, en px ou en %" }, slug: "border-radius" },
      { need: { en: "Lay out a CSS grid visually", fr: "Construire visuellement une grille CSS" }, slug: "css-grid" },
      { need: { en: "Make a favicon from one or two letters", fr: "Créer un favicon à partir d'une ou deux lettres" }, slug: "favicon-generator" },
    ],
    faq: [
      { q: { en: "Can I paste the generated CSS directly into my project?", fr: "Puis-je coller le CSS généré directement dans mon projet ?" },
        a: { en: "Yes. The generators output standard CSS declarations, such as linear-gradient(), box-shadow or grid-template-columns with repeat(), that work in every current browser without prefixes.",
             fr: "Oui. Les générateurs produisent des déclarations CSS standard, comme linear-gradient(), box-shadow ou grid-template-columns avec repeat(), qui fonctionnent dans tous les navigateurs actuels sans préfixe." } },
      { q: { en: "Why check contrast if my palette already looks balanced?", fr: "Pourquoi vérifier le contraste si ma palette paraît équilibrée ?" },
        a: { en: "Because colors with the same HSL lightness don't look equally bright: yellows and greens appear much lighter than blues and violets. The contrast checker uses the WCAG luminance formula, which follows what the eye perceives.",
             fr: "Parce que des couleurs de même luminosité HSL ne paraissent pas aussi claires : les jaunes et les verts semblent bien plus clairs que les bleus et les violets. Le vérificateur de contraste utilise la formule de luminance WCAG, qui suit ce que perçoit l'œil." } },
      { q: { en: "Where did the password generator go?", fr: "Où est passé le générateur de mots de passe ?" },
        a: { en: "It's in the Developer category, next to the UUID and hash generators, since it's mostly used for accounts, servers and application secrets.",
             fr: "Il est dans la catégorie Développeur, à côté des générateurs d'UUID et de hash, puisqu'il sert surtout pour des comptes, des serveurs et des secrets d'application." } },
    ],
  },

  seo: {
    intro: {
      h: { en: "Two kinds of SEO tools: generators and checkers", fr: "Deux sortes d'outils SEO : générateurs et vérificateurs" },
      p: {
        en: [
          "The generators produce files and tags you add to your site: a robots.txt with rules per crawler, including AI crawlers such as GPTBot, an XML sitemap from a list of URLs, JSON-LD structured data for articles, products, FAQs or breadcrumbs, and campaign links with UTM parameters. They run in your browser and send nothing.",
          "The checkers look at a live page: the meta tag preview shows how a URL will appear on Google, Facebook and X, and the SEO analyzer scores its title, description, headings, word count and image alt text. To read another site's page they have to fetch it, so they go through our server; the result is kept in memory for a minute at most, then discarded. Both read the HTML the server sends, without running JavaScript, which is also how the link-preview crawlers of social networks see your page.",
        ],
        fr: [
          "Les générateurs produisent des fichiers et des balises à ajouter à votre site : un robots.txt avec des règles par robot, y compris pour les robots IA comme GPTBot, un sitemap XML à partir d'une liste d'URL, des données structurées JSON-LD pour articles, produits, FAQ ou fils d'Ariane, et des liens de campagne avec paramètres UTM. Ils tournent dans votre navigateur et n'envoient rien.",
          "Les vérificateurs regardent une page en ligne : l'aperçu des balises meta montre comment une URL apparaîtra sur Google, Facebook et X, et l'analyseur SEO note son titre, sa description, ses titres, son nombre de mots et les attributs alt de ses images. Pour lire la page d'un autre site, ils doivent la télécharger et passent donc par notre serveur ; le résultat est gardé une minute au plus en mémoire, puis effacé. Tous deux lisent le HTML envoyé par le serveur, sans exécuter de JavaScript, ce qui est aussi la façon dont les robots d'aperçu des réseaux sociaux voient votre page.",
        ],
      },
    },
    guide: [
      { need: { en: "See how a link will look on Google, Facebook and X, and check Open Graph tags", fr: "Voir l'aspect d'un lien sur Google, Facebook et X, et vérifier les balises Open Graph" }, slug: "meta-preview" },
      { need: { en: "Check a page's title, description, headings and alt text", fr: "Contrôler le titre, la description, les titres et les alt d'une page" }, slug: "seo-analyzer" },
      { need: { en: "Write a robots.txt, including rules for AI crawlers", fr: "Écrire un robots.txt, y compris des règles pour les robots IA" }, slug: "robots-txt" },
      { need: { en: "Generate an XML sitemap from a list of URLs", fr: "Générer un sitemap XML à partir d'une liste d'URL" }, slug: "sitemap-generator" },
      { need: { en: "Add structured data for articles, products, FAQs or breadcrumbs", fr: "Ajouter des données structurées pour articles, produits, FAQ ou fils d'Ariane" }, slug: "schema-generator" },
      { need: { en: "Tag campaign links so analytics knows where visits come from", fr: "Baliser des liens de campagne pour savoir d'où viennent les visites" }, slug: "utm-builder" },
    ],
    faq: [
      { q: { en: "Which of these tools send data to a server?", fr: "Lesquels de ces outils envoient des données à un serveur ?" },
        a: { en: "Only the two checkers, the meta tag preview and the SEO analyzer, because they must download the page you want to test. They send that URL to our server, which fetches it; the result is kept in memory for a minute at most, and the request appears only in the standard server access logs. The generators run entirely in your browser.",
             fr: "Seulement les deux vérificateurs, l'aperçu des balises meta et l'analyseur SEO, parce qu'ils doivent télécharger la page à tester. Ils envoient cette URL à notre serveur, qui la récupère ; le résultat est gardé une minute au plus en mémoire, et la requête n'apparaît que dans les journaux d'accès standard du serveur. Les générateurs tournent entièrement dans votre navigateur." } },
      { q: { en: "Why do the checkers miss content I can see on my page?", fr: "Pourquoi les vérificateurs ne voient-ils pas un contenu visible sur ma page ?" },
        a: { en: "Because they read the HTML without running JavaScript. If your titles or tags are added by a script after the page loads, they're missing from that HTML, and link-preview crawlers won't see them either. Render them on the server.",
             fr: "Parce qu'ils lisent le HTML sans exécuter de JavaScript. Si vos titres ou vos balises sont ajoutés par un script après le chargement, ils manquent dans ce HTML, et les robots d'aperçu de liens ne les verront pas non plus. Générez-les côté serveur." } },
      { q: { en: "Does a perfect score in the SEO analyzer guarantee rankings?", fr: "Un score parfait dans l'analyseur SEO garantit-il un bon classement ?" },
        a: { en: "No. It confirms that the basic on-page tags are present and within range. Rankings depend on how well the content answers the search and on the site's authority, which no single-page check can measure.",
             fr: "Non. Il confirme que les balises on-page de base sont présentes et dans les bonnes plages. Le classement dépend de la façon dont le contenu répond à la recherche et de l'autorité du site, ce qu'aucun contrôle d'une seule page ne peut mesurer." } },
    ],
  },
};
