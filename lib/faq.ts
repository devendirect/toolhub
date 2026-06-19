import type { Tool } from "./types";

export type FaqItem = {
  q: Record<"en" | "fr", string>;
  a: Record<"en" | "fr", string>;
};

function universal(name: Record<"en" | "fr", string>, isNetwork: boolean): FaqItem[] {
  return [
    {
      q: { en: `Is ${name.en} free to use?`, fr: `${name.fr} est-il gratuit ?` },
      a: {
        en: "Yes, completely free — no account, no signup, no hidden fees.",
        fr: "Oui, entièrement gratuit — sans compte, sans inscription, sans frais cachés.",
      },
    },
    {
      q: {
        en: isNetwork ? "Is my data stored on your servers?" : "Are my files uploaded to a server?",
        fr: isNetwork ? "Mes données sont-elles stockées sur vos serveurs ?" : "Mes fichiers sont-ils téléchargés sur un serveur ?",
      },
      a: {
        en: isNetwork
          ? "A request passes through our proxy to fetch external data, but nothing you enter is stored or logged."
          : "No. All processing happens locally in your browser. Your files never leave your device.",
        fr: isNetwork
          ? "Une requête transite par notre proxy pour récupérer des données externes, mais rien de ce que vous saisissez n'est stocké ni journalisé."
          : "Non. Tout le traitement s'effectue localement dans votre navigateur. Vos fichiers ne quittent jamais votre appareil.",
      },
    },
    {
      q: {
        en: `Does ${name.en} work offline?`,
        fr: `${name.fr} fonctionne-t-il hors ligne ?`,
      },
      a: {
        en: isNetwork
          ? "No — an internet connection is required to fetch external data."
          : "Yes — once the page has loaded, the tool works entirely offline.",
        fr: isNetwork
          ? "Non — une connexion internet est requise pour récupérer les données externes."
          : "Oui — une fois la page chargée, l'outil fonctionne entièrement hors ligne.",
      },
    },
  ];
}

const SPECIFIC: Partial<Record<string, FaqItem[]>> = {
  "json-formatter": [
    { q: { en: "Does it validate JSON strictly?", fr: "Valide-t-il le JSON strictement ?" }, a: { en: "Yes — it follows RFC 8259 and flags any syntax error with the exact line number.", fr: "Oui — il suit la norme RFC 8259 et signale toute erreur de syntaxe avec le numéro de ligne exact." } },
    { q: { en: "Can it handle large or deeply nested JSON?", fr: "Peut-il gérer du JSON volumineux ou profondément imbriqué ?" }, a: { en: "Yes. The formatter handles arbitrarily large and deeply nested JSON. Performance depends on your device, but files up to several megabytes format instantly in most modern browsers.", fr: "Oui. Le formateur gère des JSON arbitrairement grands et profondément imbriqués. Les performances dépendent de votre appareil, mais des fichiers de plusieurs mégaoctets se formatent instantanément dans la plupart des navigateurs modernes." } },
  ],
  "image-converter": [
    { q: { en: "What image formats are supported?", fr: "Quels formats d'image sont supportés ?" }, a: { en: "JPG, PNG, WebP and AVIF — with optional resize and quality control for each export.", fr: "JPG, PNG, WebP et AVIF — avec redimensionnement et contrôle qualité optionnels à l'export." } },
    { q: { en: "Can I resize the image at the same time as converting it?", fr: "Puis-je redimensionner l'image en même temps que la conversion ?" }, a: { en: "Yes. Before downloading, you can set a target width or height and adjust the export quality. The aspect ratio is preserved by default.", fr: "Oui. Avant le téléchargement, vous pouvez définir une largeur ou hauteur cible et ajuster la qualité d'export. Le ratio d'aspect est conservé par défaut." } },
  ],
  "pdf-converter": [{ q: { en: "What can I convert a PDF to?", fr: "En quoi puis-je convertir un PDF ?" }, a: { en: "You can export each page as a PNG or JPG image, or convert the entire document to a DOCX Word file.", fr: "Vous pouvez exporter chaque page en image PNG ou JPG, ou convertir l'intégralité du document en fichier Word DOCX." } }],
  "audio-converter": [{ q: { en: "Why does the first conversion take longer?", fr: "Pourquoi la première conversion prend-elle plus de temps ?" }, a: { en: "The FFmpeg WebAssembly engine (~20 MB) needs to load once. Subsequent conversions are instant.", fr: "Le moteur FFmpeg WebAssembly (~20 Mo) doit se charger une fois. Les conversions suivantes sont instantanées." } }],
  "video-converter": [{ q: { en: "Can I extract audio from a video?", fr: "Puis-je extraire l'audio d'une vidéo ?" }, a: { en: "Yes — choose MP3 or WAV as the output format and the tool will extract the audio track.", fr: "Oui — choisissez MP3 ou WAV comme format de sortie et l'outil extraira la piste audio." } }],
  "pdf-merge": [
    { q: { en: "Is there a limit on the number of PDFs I can merge?", fr: "Y a-t-il une limite sur le nombre de PDF à fusionner ?" }, a: { en: "No hard limit — merge as many PDFs as your browser memory allows.", fr: "Aucune limite stricte — fusionnez autant de PDF que la mémoire de votre navigateur le permet." } },
    { q: { en: "Can I reorder the PDFs before merging?", fr: "Puis-je réordonner les PDF avant de les fusionner ?" }, a: { en: "Yes. After adding your files, drag and drop them to set the order before generating the merged document.", fr: "Oui. Après avoir ajouté vos fichiers, glissez-déposez-les pour définir l'ordre avant de générer le document fusionné." } },
  ],
  "qr-generator": [
    { q: { en: "What types of content can I encode in a QR code?", fr: "Quels types de contenu puis-je encoder dans un QR code ?" }, a: { en: "URLs, plain text, email addresses and phone numbers — any of these can be encoded into a scannable QR code instantly.", fr: "URL, texte brut, adresses e-mail et numéros de téléphone — n'importe lequel de ces contenus peut être encodé en un QR code scannable instantanément." } },
    { q: { en: "What formats can I download the QR code in?", fr: "Dans quels formats puis-je télécharger le QR code ?" }, a: { en: "SVG (vector, scales to any size) or PNG (raster, for embedding in images and documents).", fr: "SVG (vectoriel, s'adapte à n'importe quelle taille) ou PNG (matriciel, pour intégration dans des images et des documents)." } },
    { q: { en: "Do QR codes generated here expire?", fr: "Les QR codes générés ici expirent-ils ?" }, a: { en: "No. QR codes are a static encoding of your content — no expiry date, no server required to stay active. A QR code generated today will still work in ten years.", fr: "Non. Un QR code est un encodage statique de votre contenu — aucune date d'expiration, aucun serveur requis pour rester actif. Un QR code généré aujourd'hui fonctionnera encore dans dix ans." } },
  ],
  "base64": [{ q: { en: "Can I encode binary files, not just text?", fr: "Puis-je encoder des fichiers binaires, pas seulement du texte ?" }, a: { en: "Yes — drop any file (image, PDF, archive…) and get its Base64 representation.", fr: "Oui — déposez n'importe quel fichier (image, PDF, archive…) et obtenez sa représentation Base64." } }],
  "markdown-html": [{ q: { en: "Which Markdown flavour is supported?", fr: "Quelle variante de Markdown est supportée ?" }, a: { en: "CommonMark and GitHub Flavored Markdown (GFM) — including tables, task lists and strikethrough.", fr: "CommonMark et GitHub Flavored Markdown (GFM) — y compris les tableaux, les listes de tâches et le texte barré." } }],
  "hash-generator": [{ q: { en: "Can I hash a file, not just text?", fr: "Puis-je hasher un fichier, pas seulement du texte ?" }, a: { en: "Yes — drag and drop any file to compute its MD5, SHA-1 and SHA-256 fingerprints simultaneously.", fr: "Oui — glissez-déposez n'importe quel fichier pour calculer simultanément ses empreintes MD5, SHA-1 et SHA-256." } }],
  "regex-tester": [{ q: { en: "Which regex flags are supported?", fr: "Quels flags regex sont supportés ?" }, a: { en: "g (global), i (case-insensitive), m (multiline), s (dotAll) and u (unicode) — plus named capture groups.", fr: "g (global), i (insensible à la casse), m (multilignes), s (dotAll) et u (unicode) — ainsi que les groupes de capture nommés." } }],
  "ip-lookup": [{ q: { en: "Why might the location be inaccurate?", fr: "Pourquoi la localisation peut-elle être imprécise ?" }, a: { en: "GeoIP databases have a natural margin of error, especially for mobile networks and VPN exit nodes.", fr: "Les bases de données GeoIP ont une marge d'erreur naturelle, notamment pour les réseaux mobiles et les nœuds de sortie VPN." } }],
  "uuid-generator": [{ q: { en: "What is the difference between UUID v1, v4 and v7?", fr: "Quelle est la différence entre UUID v1, v4 et v7 ?" }, a: { en: "v1 embeds a timestamp and MAC address; v4 is fully random; v7 is time-ordered random — ideal for sortable primary keys.", fr: "v1 intègre un horodatage et une adresse MAC ; v4 est entièrement aléatoire ; v7 est ordonné dans le temps et aléatoire — idéal pour les clés primaires triables." } }],
  "cron-generator": [{ q: { en: "Does it support non-standard cron shortcuts?", fr: "Supporte-t-il les raccourcis cron non standards ?" }, a: { en: "Yes — @hourly, @daily, @weekly, @monthly and @yearly are all supported alongside standard 5-field syntax.", fr: "Oui — @hourly, @daily, @weekly, @monthly et @yearly sont tous supportés en plus de la syntaxe standard à 5 champs." } }],
  "case-converter": [{ q: { en: "What case formats are available?", fr: "Quels formats de casse sont disponibles ?" }, a: { en: "UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case and kebab-case.", fr: "MAJUSCULE, minuscule, Titre, Phrase, camelCase, PascalCase, snake_case et kebab-case." } }],
  "word-counter": [{ q: { en: "How is reading time estimated?", fr: "Comment le temps de lecture est-il estimé ?" }, a: { en: "Based on an average adult reading speed of 200 words per minute.", fr: "Sur la base d'une vitesse de lecture adulte moyenne de 200 mots par minute." } }],
  "remove-linebreaks": [{ q: { en: "Can I preserve paragraph breaks while removing single line breaks?", fr: "Puis-je conserver les sauts de paragraphe tout en supprimant les sauts de ligne simples ?" }, a: { en: "Yes — the tool preserves double line breaks (paragraph separators) while removing single ones.", fr: "Oui — l'outil conserve les doubles sauts de ligne (séparateurs de paragraphe) tout en supprimant les simples." } }],
  "text-reverser": [{ q: { en: "Does it handle emojis and Unicode correctly?", fr: "Gère-t-il correctement les emojis et l'Unicode ?" }, a: { en: "Yes — it uses proper Unicode segmentation so emojis and combining characters are treated as single units.", fr: "Oui — il utilise une segmentation Unicode correcte pour que les emojis et les caractères combinants soient traités comme des unités simples." } }],
  "url-encoder": [{ q: { en: "What is the difference between encoding a full URL and a component?", fr: "Quelle est la différence entre l'encodage d'une URL complète et d'un composant ?" }, a: { en: "Full URL encoding preserves slashes and structure; component encoding treats the entire string as a value and encodes everything including slashes.", fr: "L'encodage d'URL complète préserve les barres obliques et la structure ; l'encodage de composant encode tout, y compris les barres obliques." } }],
  "html-entities": [{ q: { en: "Which characters get encoded?", fr: "Quels caractères sont encodés ?" }, a: { en: "< > & \" ' and accented or special characters — using named entities where available, numeric entities otherwise.", fr: "< > & \" ' et les caractères accentués ou spéciaux — en utilisant des entités nommées lorsqu'elles sont disponibles, des entités numériques sinon." } }],
  "palette-generator": [{ q: { en: "What harmony modes are available?", fr: "Quels modes d'harmonie sont disponibles ?" }, a: { en: "Complementary, triadic, analogous and split-complementary — each producing a different balanced color set.", fr: "Complémentaire, triadique, analogue et complémentaire fractionnée — chacun produisant un ensemble de couleurs équilibré différent." } }],
  "password-generator": [
    { q: { en: "Is the generated password truly random?", fr: "Le mot de passe généré est-il vraiment aléatoire ?" }, a: { en: "Yes — it uses the Web Crypto API which draws from your OS's cryptographically secure random number generator.", fr: "Oui — il utilise la Web Crypto API qui s'appuie sur le générateur de nombres aléatoires cryptographiquement sécurisé de votre système d'exploitation." } },
    { q: { en: "Can I generate passwords that meet specific complexity requirements?", fr: "Puis-je générer des mots de passe répondant à des exigences de complexité spécifiques ?" }, a: { en: "Yes. Set the length and independently toggle uppercase, lowercase, numbers and symbols to match any password policy — for example, 16 characters with at least one symbol and one number.", fr: "Oui. Définissez la longueur et activez indépendamment majuscules, minuscules, chiffres et symboles pour correspondre à n'importe quelle politique de mot de passe — par exemple, 16 caractères avec au moins un symbole et un chiffre." } },
  ],
  "gradient-generator": [{ q: { en: "How many color stops can I add?", fr: "Combien d'arrêts de couleur puis-je ajouter ?" }, a: { en: "Up to 5 color stops — enough to create rich, multi-tone gradients.", fr: "Jusqu'à 5 arrêts de couleur — suffisant pour créer des dégradés riches à plusieurs tons." } }],
  "meta-preview": [{ q: { en: "Which platforms does the preview simulate?", fr: "Quelles plateformes la prévisualisation simule-t-elle ?" }, a: { en: "Google search snippet, Facebook Open Graph card and Twitter/X card — all rendered simultaneously.", fr: "L'extrait de recherche Google, la carte Open Graph Facebook et la carte Twitter/X — tous rendus simultanément." } }],
  "seo-analyzer": [{ q: { en: "What criteria does the SEO score cover?", fr: "Quels critères le score SEO couvre-t-il ?" }, a: { en: "Title length and keywords, meta description quality, H1–H6 heading structure, word count and image alt attributes.", fr: "Longueur et mots-clés du titre, qualité de la meta description, structure des titres H1–H6, nombre de mots et attributs alt des images." } }],
};

export function toolFaqItems(tool: Tool): FaqItem[] {
  const isNetwork = tool.privacy === "network";
  return [
    ...universal(tool.name, isNetwork),
    ...(SPECIFIC[tool.slug] ?? []),
  ];
}
