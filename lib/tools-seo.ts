import type { Localized } from "./types";

/**
 * Balises <title> et meta description des pages outils — distinctes de
 * `tool.name` / `tool.desc`, qui restent calibrés pour les cartes du catalogue.
 *
 * Contraintes (vérifiées par __tests__/catalog/tools-seo.test.ts) :
 * - title ≤ 50 caractères (le layout ajoute « — utilisio ») ;
 * - description entre 120 et 155 caractères ;
 * - tout unique, FR ≠ EN ;
 * - jamais « no logs / sans logs » sur un outil `privacy: 'network'`.
 */
export interface ToolSeo {
  title: Localized;
  description: Localized;
}

export const TOOLS_SEO: Record<string, ToolSeo> = {
  /* ── FILE ── */
  "image-converter": {
    title: { en: "Image Converter to WebP, JPG or PNG", fr: "Convertir une image en WebP, JPG ou PNG" },
    description: {
      en: "Convert JPG, PNG, WebP or AVIF images to WebP, JPG or PNG in your browser, resize them and set the quality in the same step. Free, nothing uploaded.",
      fr: "Convertissez vos images JPG, PNG, WebP ou AVIF en WebP, JPG ou PNG dans le navigateur, redimensionnez-les et réglez la qualité. Gratuit, sans envoi.",
    },
  },
  "pdf-converter": {
    title: { en: "PDF to Image & Image to PDF Converter", fr: "Convertir un PDF en images (et l'inverse)" },
    description: {
      en: "Turn each PDF page into a PNG or JPEG at 1×, 2× or 3× scale, or assemble images into one PDF. Runs locally with PDF.js and pdf-lib.",
      fr: "Transformez chaque page d'un PDF en PNG ou JPEG (échelle 1×, 2× ou 3×), ou assemblez des images en un seul PDF. Traitement local avec PDF.js.",
    },
  },
  "audio-converter": {
    title: { en: "Audio Converter: MP3, WAV, FLAC, AAC, OGG", fr: "Convertisseur audio MP3, WAV, FLAC, AAC, OGG" },
    description: {
      en: "Convert between MP3, AAC, OGG, WAV, FLAC and M4A with FFmpeg running in your browser. Pick a bitrate from 64 to 320 kbps. Your files stay local.",
      fr: "Convertissez entre MP3, AAC, OGG, WAV, FLAC et M4A grâce à FFmpeg dans le navigateur. Débit réglable de 64 à 320 kbps. Vos fichiers restent chez vous.",
    },
  },
  "video-converter": {
    title: { en: "Video Converter: MP4, WebM, MOV, GIF", fr: "Convertisseur vidéo MP4, WebM, MOV et GIF" },
    description: {
      en: "Re-encode video between MP4, WebM, MOV, AVI and MKV, scale it down to 1080p–360p or turn a clip into a GIF. FFmpeg runs in your browser.",
      fr: "Ré-encodez une vidéo en MP4, WebM, MOV, AVI ou MKV, réduisez-la de 1080p à 360p ou transformez un extrait en GIF. FFmpeg tourne dans le navigateur.",
    },
  },
  "pdf-merge": {
    title: { en: "Merge PDF Files Online, Without Uploading", fr: "Fusionner des PDF en ligne, sans envoi" },
    description: {
      en: "Combine several PDFs into one: drop the files, set the order, download. Merging runs in your browser with pdf-lib, so contracts stay private.",
      fr: "Combinez plusieurs PDF en un seul : déposez, réglez l'ordre des fichiers, téléchargez. Fusion dans le navigateur : vos contrats restent privés.",
    },
  },
  "image-compressor": {
    title: { en: "Image Compressor: Shrink JPG, PNG, WebP", fr: "Compresser une image JPG, PNG ou WebP" },
    description: {
      en: "Reduce image file size with a 10–100 quality slider and see exactly how many bytes you saved. Exports JPEG, WebP or PNG, all in your browser.",
      fr: "Réduisez le poids d'une image avec un curseur de qualité de 10 à 100 et voyez le gain exact en octets. Export JPEG, WebP ou PNG, dans le navigateur.",
    },
  },
  "svg-optimizer": {
    title: { en: "SVG Optimizer: Minify SVG with SVGO", fr: "Optimiseur SVG : minifier un SVG avec SVGO" },
    description: {
      en: "Minify SVG files with SVGO in your browser and strip the comments, metadata and editor cruft Figma or Illustrator leave behind. See the size saved.",
      fr: "Minifiez vos SVG avec SVGO dans le navigateur et retirez commentaires, métadonnées et résidus laissés par Figma ou Illustrator. Gain de poids affiché.",
    },
  },
  "zip-extractor": {
    title: { en: "ZIP Extractor: Open ZIP Files Online", fr: "Ouvrir et extraire un fichier ZIP en ligne" },
    description: {
      en: "Open a .zip archive in your browser, browse its folders, check each file's size and download files one by one. Nothing is uploaded to a server.",
      fr: "Ouvrez une archive .zip dans le navigateur, parcourez ses dossiers, voyez la taille de chaque fichier et téléchargez-les un par un. Rien n'est envoyé.",
    },
  },

  /* ── DEVELOPER ── */
  "qr-generator": {
    title: { en: "QR Code Generator for Links and Wi-Fi", fr: "Générateur de QR code : lien, Wi-Fi, SVG, PNG" },
    description: {
      en: "Create a QR code from a URL, some text or your Wi-Fi details and download it as SVG for print or PNG for screens. Free, no account, no expiry.",
      fr: "Créez un QR code à partir d'une URL, d'un texte ou de votre Wi-Fi, puis téléchargez-le en SVG pour l'impression ou en PNG. Gratuit, sans expiration.",
    },
  },
  base64: {
    title: { en: "Base64 Encode & Decode Online", fr: "Encoder et décoder du Base64 en ligne" },
    description: {
      en: "Encode text or files to Base64 and decode Base64 back to its original form. Useful for data URIs, Basic auth headers and API payloads.",
      fr: "Encodez du texte ou des fichiers en Base64 et décodez une chaîne Base64 vers sa forme d'origine. Utile pour les data URI, l'auth Basic et les API.",
    },
  },
  "markdown-html": {
    title: { en: "Markdown to HTML Converter, Live Preview", fr: "Convertir du Markdown en HTML, aperçu en direct" },
    description: {
      en: "Write Markdown and get clean HTML as you type. Supports GitHub Flavored Markdown: tables, task lists, code blocks. Copy or download the result.",
      fr: "Écrivez du Markdown et obtenez du HTML propre en temps réel. GitHub Flavored Markdown pris en charge : tableaux, listes de tâches, blocs de code.",
    },
  },
  "hash-generator": {
    title: { en: "Hash Generator: MD5, SHA-1, SHA-256", fr: "Générateur de hash MD5, SHA-1 et SHA-256" },
    description: {
      en: "Compute MD5, SHA-1, SHA-256 and SHA-512 hashes of any text or file with the Web Crypto API. Check a download's integrity without leaving the browser.",
      fr: "Calculez les empreintes MD5, SHA-1, SHA-256 et SHA-512 d'un texte ou d'un fichier via la Web Crypto API. Vérifiez l'intégrité d'un téléchargement.",
    },
  },
  "regex-tester": {
    title: { en: "Regex Tester: Test JavaScript Regex Live", fr: "Testeur de regex JavaScript en temps réel" },
    description: {
      en: "Test a regular expression and see matches highlighted as you type. Supports the g, i, m, s and u flags and lists named capture groups separately.",
      fr: "Testez une expression régulière et voyez les correspondances surlignées à la frappe. Flags g, i, m, s et u pris en charge, groupes nommés affichés.",
    },
  },
  "ip-lookup": {
    title: { en: "IP Address Lookup: Location, ISP, ASN", fr: "Localiser une adresse IP : pays, FAI, ASN" },
    description: {
      en: "Look up any IPv4 or IPv6 address to see its country, city, ISP, ASN and timezone, or leave it blank to check your own public IP. Free, no signup.",
      fr: "Recherchez une adresse IPv4 ou IPv6 pour voir son pays, sa ville, son FAI, son ASN et son fuseau horaire, ou laissez vide pour voir votre IP publique.",
    },
  },
  "uuid-generator": {
    title: { en: "UUID Generator: Random v4 UUIDs", fr: "Générateur d'UUID v4 aléatoires" },
    description: {
      en: "Generate random version 4 UUIDs, up to 25 at a time, with crypto.randomUUID(). Copy one or the whole batch in a click. Nothing leaves your browser.",
      fr: "Générez des UUID version 4 aléatoires, jusqu'à 25 à la fois, via crypto.randomUUID(). Copiez-en un ou tout le lot en un clic. Rien ne quitte le navigateur.",
    },
  },
  "cron-generator": {
    title: { en: "Cron Expression Generator & Explainer", fr: "Générateur et traducteur d'expressions cron" },
    description: {
      en: "Paste a cron expression and read what it means in plain English, or build one field by field. Handles the 5-field format and @hourly-style shortcuts.",
      fr: "Collez une expression cron et lisez sa signification en clair, ou construisez-la champ par champ. Format à 5 champs et raccourcis type @hourly gérés.",
    },
  },
  "jwt-decoder": {
    title: { en: "JWT Decoder: Read Header & Payload", fr: "Décoder un JWT : header, payload, expiration" },
    description: {
      en: "Paste a JWT to see its decoded header and payload as formatted JSON. exp, iat and nbf dates are shown in readable form, with an expired or valid flag.",
      fr: "Collez un JWT pour lire son header et son payload en JSON formaté. Les dates exp, iat et nbf sont converties en clair, avec l'état expiré ou valide.",
    },
  },
  "jwt-generator": {
    title: { en: "JWT Generator: Sign HS256 Tokens", fr: "Générateur de JWT signé en HS256" },
    description: {
      en: "Sign a JSON payload as an HS256 JWT with the Web Crypto API. Header, payload and signature are color-coded. Your secret key never leaves the browser.",
      fr: "Signez un payload JSON en JWT HS256 via la Web Crypto API. Header, payload et signature sont colorés à part. Votre clé secrète ne quitte pas le navigateur.",
    },
  },
  timestamp: {
    title: { en: "Unix Timestamp Converter to Date", fr: "Convertir un timestamp Unix en date" },
    description: {
      en: "Convert a Unix timestamp into six formats at once: seconds, milliseconds, ISO 8601, UTC, your local time and YYYY-MM-DD. Spot seconds/ms mix-ups fast.",
      fr: "Convertissez un timestamp Unix en six formats d'un coup : secondes, millisecondes, ISO 8601, UTC, heure locale et AAAA-MM-JJ. Repérez vite l'erreur s/ms.",
    },
  },
  "base-converter": {
    title: { en: "Number Base Converter: Hex, Binary, Octal", fr: "Convertir un nombre en hexa, binaire, octal" },
    description: {
      en: "Type a number in decimal, hexadecimal, octal or binary and see it in all four bases at once. Results match JavaScript's own parseInt and toString.",
      fr: "Saisissez un nombre en décimal, hexadécimal, octal ou binaire et voyez-le dans les quatre bases à la fois. Résultats identiques à parseInt en JavaScript.",
    },
  },
  "diff-viewer": {
    title: { en: "Diff Checker: Compare Two Texts or Code", fr: "Comparer deux textes ou deux fichiers de code" },
    description: {
      en: "Paste two versions of code, config or prose and see which lines were added or removed. Uses the same LCS approach as git diff, right in your browser.",
      fr: "Collez deux versions d'un code, d'une config ou d'un texte et voyez les lignes ajoutées ou supprimées. Même approche que git diff, dans le navigateur.",
    },
  },
  "css-minifier": {
    title: { en: "CSS Minifier: Compress CSS Online", fr: "Minifier du CSS en ligne" },
    description: {
      en: "Minify CSS by stripping comments, collapsing whitespace and tightening braces and semicolons. Paste your stylesheet, copy the compact version.",
      fr: "Minifiez votre CSS : commentaires retirés, espaces compactés, accolades et points-virgules resserrés. Collez la feuille de style, copiez le résultat.",
    },
  },
  "env-formatter": {
    title: { en: ".env File Formatter: Sort & Deduplicate", fr: "Formater un fichier .env : trier, dédoublonner" },
    description: {
      en: "Clean a .env file: sort keys alphabetically, drop duplicate keys the way dotenv does (first wins) and remove empty values. Each option toggles on its own.",
      fr: "Nettoyez un fichier .env : tri alphabétique des clés, doublons retirés comme le fait dotenv (la première l'emporte), valeurs vides retirées.",
    },
  },
  "color-picker": {
    title: { en: "Color Picker: HEX, RGB, HSL, HSV Values", fr: "Sélecteur de couleur : HEX, RGB, HSL, HSV" },
    description: {
      en: "Pick a color or type a hex code and get its HEX, RGB, HSL and HSV values plus each R/G/B channel. Click any row to copy just that format.",
      fr: "Choisissez une couleur ou saisissez un code hex pour obtenir ses valeurs HEX, RGB, HSL et HSV, ainsi que chaque canal R/V/B. Un clic copie le format voulu.",
    },
  },
  "md-table": {
    title: { en: "Markdown Table Generator", fr: "Générateur de tableau Markdown" },
    description: {
      en: "Build a Markdown table visually: edit cells, add rows and columns, set left, center or right alignment. Copy the syntax into a README or GitHub issue.",
      fr: "Construisez un tableau Markdown visuellement : cellules éditables, lignes et colonnes à ajouter, alignement par colonne. Copiez la syntaxe dans un README.",
    },
  },
  "toml-json": {
    title: { en: "TOML to JSON Converter (and Back)", fr: "Convertir du TOML en JSON (et l'inverse)" },
    description: {
      en: "Convert TOML config files to JSON, or JSON back to TOML, in one click. Built on smol-toml with full TOML 1.0 support, for Cargo, Hugo or pyproject files.",
      fr: "Convertissez un fichier de config TOML en JSON, ou du JSON en TOML, en un clic. Basé sur smol-toml (TOML 1.0 complet), pour Cargo, Hugo ou pyproject.",
    },
  },
  "headers-checker": {
    title: { en: "Security Headers Checker, Graded A to F", fr: "Tester les en-têtes de sécurité HTTP (A à F)" },
    description: {
      en: "Check a site's HTTP security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy and more) and get an A–F grade with a fix for each missing one.",
      fr: "Analysez les en-têtes de sécurité HTTP d'un site (CSP, HSTS, X-Frame-Options, Referrer-Policy…) et obtenez une note de A à F avec un correctif pour chacun.",
    },
  },

  /* ── TEXT ── */
  "json-formatter": {
    title: { en: "JSON Formatter & Validator Online", fr: "Formateur et validateur JSON en ligne" },
    description: {
      en: "Paste raw or minified JSON and get it indented and validated in one click. Syntax errors point to the exact line. No upload, works offline once loaded.",
      fr: "Collez du JSON brut ou minifié et récupérez-le indenté et validé en un clic. Les erreurs sont signalées à la ligne près. Sans envoi, fonctionne hors ligne.",
    },
  },
  "case-converter": {
    title: { en: "Case Converter: camelCase, snake_case & More", fr: "Changer la casse : MAJUSCULES, camelCase…" },
    description: {
      en: "Switch text between UPPER, lower, Title, camelCase, PascalCase, snake_case and kebab-case in one click. Accented and Unicode characters handled.",
      fr: "Passez un texte en MAJUSCULE, minuscule, Titre, camelCase, PascalCase, snake_case ou kebab-case en un clic. Accents et caractères Unicode bien gérés.",
    },
  },
  "word-counter": {
    title: { en: "Word Counter & Character Count", fr: "Compteur de mots et de caractères" },
    description: {
      en: "Count words, characters, sentences and paragraphs as you type, with an estimated reading time. Handy for essays, articles and length-limited fields.",
      fr: "Comptez mots, caractères, phrases et paragraphes à la frappe, avec une estimation du temps de lecture. Utile pour un devoir, un article, un champ limité.",
    },
  },
  "remove-linebreaks": {
    title: { en: "Remove Line Breaks from Text", fr: "Supprimer les sauts de ligne d'un texte" },
    description: {
      en: "Fix text copied from a PDF or email that breaks at every line. Remove the unwanted line breaks while keeping real paragraph breaks if you want.",
      fr: "Réparez un texte copié d'un PDF ou d'un e-mail coupé à chaque ligne. Retirez les sauts de ligne parasites en gardant, au choix, les paragraphes.",
    },
  },
  "text-reverser": {
    title: { en: "Reverse Text: Letters, Words or Lines", fr: "Inverser un texte : lettres, mots ou lignes" },
    description: {
      en: "Reverse text character by character, word by word or line by line. Emojis and accented characters stay intact. Updates as you type, copy in one click.",
      fr: "Inversez un texte caractère par caractère, mot par mot ou ligne par ligne. Emojis et accents restent intacts. Résultat à la frappe, copie en un clic.",
    },
  },
  "url-encoder": {
    title: { en: "URL Encode & Decode Online", fr: "Encoder et décoder une URL en ligne" },
    description: {
      en: "Percent-encode text for a query string or path segment, or decode an encoded URL back to readable text. Non-ASCII characters are encoded as UTF-8.",
      fr: "Encodez un texte en pourcentage pour un paramètre ou un chemin d'URL, ou décodez une URL encodée en texte lisible. Non-ASCII encodé en UTF-8.",
    },
  },
  "html-entities": {
    title: { en: "HTML Entity Encoder & Decoder", fr: "Encoder et décoder les entités HTML" },
    description: {
      en: "Escape <, >, &, quotes and accented letters into HTML entities, or decode entities back to text. Safe for code samples and user-generated content.",
      fr: "Échappez <, >, &, les guillemets et les lettres accentuées en entités HTML, ou décodez-les en texte. Idéal pour afficher du code ou du contenu utilisateur.",
    },
  },
  "lorem-ipsum": {
    title: { en: "Lorem Ipsum Generator", fr: "Générateur de faux texte Lorem Ipsum" },
    description: {
      en: "Generate Lorem Ipsum placeholder text by words, sentences or paragraphs for mockups and prototypes. Output is deterministic, so layouts stay stable.",
      fr: "Générez du faux texte Lorem Ipsum en mots, phrases ou paragraphes pour vos maquettes. Résultat identique à chaque fois : mises en page stables.",
    },
  },
  "deduplicate-lines": {
    title: { en: "Remove Duplicate Lines from a List", fr: "Supprimer les lignes en double d'une liste" },
    description: {
      en: "Paste a list and keep only the first occurrence of each line, in the original order. Choose case-sensitive or case-insensitive matching for emails or tags.",
      fr: "Collez une liste et gardez seulement la première occurrence de chaque ligne, dans l'ordre d'origine. Casse prise en compte ou non, au choix.",
    },
  },
  "csv-json": {
    title: { en: "CSV to JSON Converter (and JSON to CSV)", fr: "Convertir un CSV en JSON (et un JSON en CSV)" },
    description: {
      en: "Turn CSV into a JSON array keyed by the header row, or flip a JSON array back to CSV with commas and quotes escaped for you. One toggle switches direction.",
      fr: "Transformez un CSV en tableau JSON indexé par l'en-tête, ou un tableau JSON en CSV avec virgules et guillemets échappés. Un bouton inverse le sens.",
    },
  },
  "string-escape": {
    title: { en: "Escape Strings for JavaScript, SQL, Bash", fr: "Échapper une chaîne pour JavaScript, SQL, Bash" },
    description: {
      en: "Escape or unescape a string with the rules of each language: backslashes and \\n in JavaScript, doubled quotes in SQL, $ and backticks in Bash.",
      fr: "Échappez ou déséchappez une chaîne selon les règles de chaque langage : antislash et \\n en JavaScript, apostrophes doublées en SQL, $ et backticks en Bash.",
    },
  },
  "slug-generator": {
    title: { en: "Slug Generator: Title to Clean URL", fr: "Générateur de slug : un titre en URL propre" },
    description: {
      en: "Turn a title into a URL-safe slug: accents stripped, lowercase, spaces turned into hyphens or underscores. Works well for French, Spanish or German titles.",
      fr: "Transformez un titre en slug d'URL propre : accents supprimés, minuscules, espaces en tirets ou underscores. Idéal pour des titres en français.",
    },
  },
  readability: {
    title: { en: "Readability Checker: Flesch & Gunning Fog", fr: "Tester la lisibilité d'un texte (Flesch, Fog)" },
    description: {
      en: "Score your text with Flesch Reading Ease and the Gunning Fog index, plus sentence length, syllables per word and share of complex words.",
      fr: "Mesurez la lisibilité d'un texte avec le score de Flesch et l'indice Gunning Fog, plus la longueur des phrases et la part de mots complexes.",
    },
  },

  /* ── DESIGN ── */
  "palette-generator": {
    title: { en: "Color Palette Generator from One Color", fr: "Générer une palette de couleurs harmonieuse" },
    description: {
      en: "Start from one color and get a complementary, triadic, analogous or split-complementary palette, with HEX, RGB and HSL values for every swatch.",
      fr: "Partez d'une couleur et obtenez une palette complémentaire, triadique, analogue ou complémentaire divisée, avec les codes HEX, RGB et HSL de chaque teinte.",
    },
  },
  "password-generator": {
    title: { en: "Strong Password Generator", fr: "Générateur de mot de passe fort et aléatoire" },
    description: {
      en: "Generate a strong random password using the Web Crypto API. Set the length and toggle uppercase, numbers and symbols. It is never sent to a server.",
      fr: "Générez un mot de passe fort et aléatoire via la Web Crypto API. Longueur, majuscules, chiffres et symboles au choix. Il n'est jamais envoyé à un serveur.",
    },
  },
  "gradient-generator": {
    title: { en: "CSS Gradient Generator: Linear & Radial", fr: "Générateur de dégradé CSS linéaire et radial" },
    description: {
      en: "Design a CSS gradient with up to 5 color stops, set the angle, switch between linear and radial, and copy the ready-to-paste CSS declaration.",
      fr: "Créez un dégradé CSS avec jusqu'à 5 couleurs, réglez l'angle, passez du linéaire au radial et copiez la déclaration CSS prête à coller dans votre code.",
    },
  },
  "box-shadow": {
    title: { en: "CSS Box Shadow Generator", fr: "Générateur de box-shadow CSS" },
    description: {
      en: "Build a CSS box-shadow with sliders for offset, blur, spread and opacity, plus an inset toggle. Preview it live and copy the generated CSS line.",
      fr: "Construisez une box-shadow CSS avec des curseurs pour le décalage, le flou, l'étalement et l'opacité, plus l'option inset. Aperçu en direct, CSS à copier.",
    },
  },
  "border-radius": {
    title: { en: "CSS Border Radius Generator", fr: "Générateur de border-radius CSS" },
    description: {
      en: "Set each corner's border-radius separately or link them, in px or %, and preview the shape live. Copy the CSS shorthand in the right corner order.",
      fr: "Réglez l'arrondi de chaque coin séparément ou ensemble, en px ou en %, et voyez la forme en direct. Copiez le raccourci CSS dans le bon ordre des coins.",
    },
  },
  "favicon-generator": {
    title: { en: "Favicon Generator from Text or Letters", fr: "Créer un favicon à partir d'une lettre" },
    description: {
      en: "Make a favicon from one or two characters: pick colors, preview it at 16, 32, 48 and 64 px side by side, then download it as PNG or .ico.",
      fr: "Créez un favicon à partir d'un ou deux caractères : choisissez les couleurs, prévisualisez-le en 16, 32, 48 et 64 px, puis téléchargez-le en PNG ou .ico.",
    },
  },
  "contrast-checker": {
    title: { en: "WCAG Color Contrast Checker (AA, AAA)", fr: "Vérifier le contraste des couleurs (WCAG)" },
    description: {
      en: "Check the WCAG 2.1 contrast ratio between text and background colors and see at a glance whether it passes AA and AAA for normal and large text.",
      fr: "Calculez le ratio de contraste WCAG 2.1 entre la couleur du texte et du fond, et voyez s'il passe les niveaux AA et AAA pour le texte normal et large.",
    },
  },
  "css-grid": {
    title: { en: "CSS Grid Generator: Visual Layout Builder", fr: "Générateur de grille CSS Grid visuel" },
    description: {
      en: "Set columns, rows and gap with sliders, choose fr, px or % sizing and watch the grid update live. Copy the generated CSS using repeat() shorthand.",
      fr: "Réglez colonnes, lignes et espacement avec des curseurs, choisissez fr, px ou %, et voyez la grille évoluer en direct. Copiez le CSS généré avec repeat().",
    },
  },

  /* ── SEO / MARKETING ── */
  "meta-preview": {
    title: { en: "Meta Tag & Open Graph Preview and Checker", fr: "Aperçu et test des balises meta et Open Graph" },
    description: {
      en: "Enter a URL and preview how its title, description and image will look on Google, Facebook and X before you share it. Checked in real time via our server.",
      fr: "Entrez une URL et voyez le rendu de son titre, sa description et son image sur Google, Facebook et X avant de partager. Vérifié en direct.",
    },
  },
  "seo-analyzer": {
    title: { en: "Free On-Page SEO Analyzer", fr: "Analyseur SEO on-page gratuit" },
    description: {
      en: "Analyze any public page's on-page SEO: title, meta description, heading structure, word count and image alt text, each with a score and a concrete fix.",
      fr: "Analysez le SEO on-page d'une page publique : titre, meta description, structure Hn, nombre de mots et attributs alt, avec un score et un conseil précis.",
    },
  },
  "utm-builder": {
    title: { en: "UTM Builder: Campaign URL Generator", fr: "Générateur d'URL UTM pour vos campagnes" },
    description: {
      en: "Add UTM source, medium, campaign, term and content to any URL, with presets for Google Ads, Facebook, newsletters and X. Copy the link in one click.",
      fr: "Ajoutez les UTM source, medium, campaign, term et content à une URL, avec des préréglages Google Ads, Facebook, newsletter et X. Copie en un clic.",
    },
  },
  "robots-txt": {
    title: { en: "Robots.txt Generator with AI Bot Rules", fr: "Générateur de robots.txt (dont robots IA)" },
    description: {
      en: "Build a robots.txt with separate rules per user-agent, including AI crawlers like GPTBot, plus a Sitemap line. Copy it or download it as a .txt file.",
      fr: "Créez un robots.txt avec des règles par user-agent, y compris les robots IA comme GPTBot, et une ligne Sitemap. Copiez-le ou téléchargez le fichier .txt.",
    },
  },
  "sitemap-generator": {
    title: { en: "XML Sitemap Generator from a URL List", fr: "Générer un sitemap XML depuis une liste d'URL" },
    description: {
      en: "Paste one URL per line and get a valid XML sitemap with lastmod, changefreq and priority applied to the batch. Ready to upload to your site root.",
      fr: "Collez une URL par ligne et obtenez un sitemap XML valide, avec lastmod, changefreq et priority appliqués au lot. Prêt à déposer à la racine de votre site.",
    },
  },
  "schema-generator": {
    title: { en: "Schema Markup Generator: JSON-LD", fr: "Générateur de données structurées JSON-LD" },
    description: {
      en: "Generate valid JSON-LD for Article, Product, FAQPage or BreadcrumbList from a simple form, ready to paste into a script tag on your page.",
      fr: "Générez un JSON-LD valide pour Article, Product, FAQPage ou BreadcrumbList à partir d'un formulaire simple, prêt à coller dans une balise script.",
    },
  },
};
