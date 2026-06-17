import type { Lang } from "./types";

interface ToolContent {
  desc: Record<Lang, string>;
  useCases: Record<Lang, string[]>;
}

export const TOOLS_CONTENT: Partial<Record<string, ToolContent>> = {
  "json-formatter": {
    desc: {
      en: "The JSON Formatter instantly parses, indents and validates any JSON payload. Whether you're debugging an API response, cleaning up a config file, or inspecting a webhook body, paste your raw JSON and get a properly formatted, human-readable result in one click. Syntax errors are flagged with the exact line number so you can fix them without hunting through minified output.",
      fr: "Le formateur JSON analyse, indente et valide instantanément n'importe quelle donnée JSON. Que vous déboguiez une réponse d'API, nettoyiez un fichier de configuration ou inspectiez une charge utile de webhook, collez votre JSON brut et obtenez une version lisible et correctement formatée en un clic. Les erreurs de syntaxe sont signalées avec le numéro de ligne exact.",
    },
    useCases: {
      en: ["Debugging REST or GraphQL API responses", "Cleaning up minified JSON config files before editing", "Validating JSON before sending it to a webhook or database", "Reading JWT payloads without a dedicated decoder"],
      fr: ["Déboguer des réponses d'API REST ou GraphQL", "Nettoyer des fichiers de config JSON minifiés avant édition", "Valider du JSON avant de l'envoyer à un webhook ou une base de données", "Lire des payloads JWT sans décodeur dédié"],
    },
  },
  "image-converter": {
    desc: {
      en: "The Image Converter lets you change image formats directly in your browser — no software to install, no file upload required. Convert JPG to WebP, PNG to AVIF, or any combination of the four supported formats. You can also resize and adjust quality on export to hit the exact file size you need for web optimization, social media or email.",
      fr: "Le convertisseur d'images vous permet de changer de format directement dans votre navigateur — sans logiciel à installer, sans envoi sur un serveur. Convertissez JPG en WebP, PNG en AVIF, ou n'importe quelle combinaison des quatre formats supportés. Vous pouvez également redimensionner et ajuster la qualité à l'export.",
    },
    useCases: {
      en: ["Converting PNG screenshots to WebP for faster web page loading", "Resizing and compressing images to meet social media upload limits", "Converting AVIF files to JPG for compatibility with older software", "Generating multiple format variants of the same image for a <picture> element"],
      fr: ["Convertir des captures d'écran PNG en WebP pour accélérer le chargement des pages", "Redimensionner et compresser des images pour les réseaux sociaux", "Convertir des fichiers AVIF en JPG pour la compatibilité avec des logiciels anciens", "Générer plusieurs variantes de format pour un élément <picture> HTML"],
    },
  },
  "pdf-converter": {
    desc: {
      en: "The PDF Converter transforms PDF files into images or Word documents without sending your files anywhere. Convert each page to PNG or JPG for use in presentations and websites, or export to DOCX to edit the content in Microsoft Word. All processing happens locally in your browser using PDF.js and pdf-lib — your documents stay private.",
      fr: "Le convertisseur PDF transforme des fichiers PDF en images ou en documents Word sans envoyer vos fichiers nulle part. Convertissez chaque page en PNG ou JPG pour des présentations ou des sites web, ou exportez en DOCX pour éditer le contenu dans Microsoft Word. Tout le traitement s'effectue localement dans votre navigateur.",
    },
    useCases: {
      en: ["Extracting pages from a PDF as images for a slide deck", "Converting a scanned PDF to Word for text editing", "Creating image previews of PDF pages to embed on a website", "Archiving individual PDF pages as standalone image files"],
      fr: ["Extraire des pages d'un PDF en images pour une présentation", "Convertir un PDF scanné en Word pour l'édition de texte", "Créer des aperçus image de pages PDF à intégrer sur un site web", "Archiver des pages PDF individuelles en fichiers image autonomes"],
    },
  },
  "audio-converter": {
    desc: {
      en: "The Audio Converter converts between MP3, WAV, FLAC, AAC and OGG entirely in your browser using FFmpeg compiled to WebAssembly. There are no file size limits beyond your available RAM. Note that the first conversion takes a moment to load the FFmpeg engine (~20 MB), but subsequent conversions within the same session are near-instant.",
      fr: "Le convertisseur audio convertit entre MP3, WAV, FLAC, AAC et OGG entièrement dans votre navigateur grâce à FFmpeg compilé en WebAssembly. Aucune limite de taille au-delà de votre RAM disponible. La première conversion peut prendre un moment le temps de charger le moteur FFmpeg (~20 Mo), mais les suivantes sont quasi instantanées.",
    },
    useCases: {
      en: ["Converting WAV recordings to MP3 for sharing or streaming", "Converting FLAC albums to AAC for Apple device compatibility", "Converting OGG audio from games or apps to a more portable format", "Preparing audio files for podcast upload platforms that require specific formats"],
      fr: ["Convertir des enregistrements WAV en MP3 pour le partage ou le streaming", "Convertir des albums FLAC en AAC pour la compatibilité avec les appareils Apple", "Convertir de l'audio OGG en format plus portable", "Préparer des fichiers audio pour des plateformes de podcast nécessitant un format spécifique"],
    },
  },
  "video-converter": {
    desc: {
      en: "The Video Converter re-encodes video files or extracts audio tracks — powered by FFmpeg WASM running entirely in your browser. Convert MP4 to WebM for HTML5 embeds, create animated GIFs from short clips, or rip the audio to MP3 from any video file. No upload, no waiting for a server, no file size cap beyond your RAM.",
      fr: "Le convertisseur vidéo ré-encode des fichiers vidéo ou extrait des pistes audio — propulsé par FFmpeg WASM s'exécutant entièrement dans votre navigateur. Convertissez MP4 en WebM pour le web, créez des GIF animés depuis des clips, ou extrayez l'audio en MP3. Sans envoi sur un serveur, sans limite de taille au-delà de votre RAM.",
    },
    useCases: {
      en: ["Converting MP4 to WebM for HTML5 <video> elements", "Creating GIFs from short video clips for documentation or social media", "Ripping the audio track from a recorded interview or lecture", "Converting MOV files from iPhone to MP4 for broader compatibility"],
      fr: ["Convertir MP4 en WebM pour les éléments <video> HTML5", "Créer des GIF depuis de courts clips vidéo pour de la documentation ou les réseaux sociaux", "Extraire la piste audio d'un entretien ou d'un cours enregistré", "Convertir des fichiers MOV depuis iPhone en MP4 pour une meilleure compatibilité"],
    },
  },
  "pdf-merge": {
    desc: {
      en: "PDF Merge combines multiple PDF files into a single document in seconds. Drop your PDFs, drag to reorder them, and download the merged result — all without any file leaving your browser. Useful for assembling invoices, contracts, reports or any collection of documents that needs to be sent as one coherent file.",
      fr: "Fusion de PDF combine plusieurs fichiers PDF en un seul document en quelques secondes. Déposez vos PDF, faites glisser pour les réordonner, et téléchargez le résultat — sans qu'aucun fichier ne quitte votre navigateur. Utile pour assembler des factures, des contrats, des rapports ou tout ensemble de documents à envoyer en un seul fichier.",
    },
    useCases: {
      en: ["Combining monthly invoices into a single PDF for accounting", "Merging multiple contract pages or annexes into one document to sign", "Assembling a portfolio or project report from separate PDF sections", "Reordering pages by splitting PDFs and re-merging in the desired order"],
      fr: ["Regrouper les factures mensuelles en un seul PDF pour la comptabilité", "Fusionner plusieurs pages d'un contrat ou ses annexes en un document à signer", "Assembler un portfolio ou un rapport de projet depuis des sections PDF séparées", "Réordonner des pages en scindant des PDF et en les refusionnant dans l'ordre souhaité"],
    },
  },
  "qr-generator": {
    desc: {
      en: "The QR Code Generator creates scannable QR codes from any URL, plain text, email address or phone number — instantly, in your browser. Export as SVG for crisp quality at any print size, or as PNG for embedding in images and documents. No server, no API key, no usage limits.",
      fr: "Le générateur de QR code crée des codes QR scannables depuis n'importe quelle URL, texte, adresse e-mail ou numéro de téléphone — instantanément, dans votre navigateur. Exportez en SVG pour une qualité parfaite quelle que soit la taille d'impression, ou en PNG pour l'intégration dans des images et des documents.",
    },
    useCases: {
      en: ["Creating QR codes for business cards, posters or product packaging", "Linking physical items to their online documentation or warranty page", "Generating a QR code to share Wi-Fi network credentials", "Adding a scannable link to a presentation slide or conference badge"],
      fr: ["Créer des QR codes pour des cartes de visite, affiches ou emballages produit", "Lier des objets physiques à leur documentation ou page de garantie en ligne", "Générer un QR code pour partager des identifiants Wi-Fi", "Ajouter un lien scannable à une diapositive ou un badge de conférence"],
    },
  },
  "base64": {
    desc: {
      en: "The Base64 Encoder converts text or binary files to Base64 and decodes Base64 strings back to their original form. It supports both standard Base64 and URL-safe Base64 variants. Drop any file — image, PDF, archive — to get its Base64 representation. Commonly used for data URIs, JWT inspection and API payload debugging.",
      fr: "L'encodeur Base64 convertit du texte ou des fichiers binaires en Base64 et décode des chaînes Base64 vers leur forme d'origine. Supporte le Base64 standard et la variante URL-safe. Déposez n'importe quel fichier — image, PDF, archive — pour obtenir sa représentation Base64.",
    },
    useCases: {
      en: ["Decoding a JWT token payload to inspect its claims and expiry", "Embedding a small image as a data URI in HTML, CSS or JSON", "Encoding binary file attachments for email or REST API transmission", "Debugging Base64-encoded values in API responses or config files"],
      fr: ["Décoder un payload JWT pour inspecter ses claims et sa date d'expiration", "Intégrer une petite image en data URI dans du HTML, CSS ou JSON", "Encoder des pièces jointes binaires pour une transmission par e-mail ou API REST", "Déboguer des valeurs Base64 dans des réponses d'API ou des fichiers de config"],
    },
  },
  "markdown-html": {
    desc: {
      en: "The Markdown to HTML converter renders your Markdown in real time and outputs clean, semantic HTML. Supports CommonMark and GitHub Flavored Markdown including tables, strikethrough, task lists and fenced code blocks. Copy the HTML output or download it as a file to paste into your CMS, email template or static site generator.",
      fr: "Le convertisseur Markdown vers HTML rend votre Markdown en temps réel et produit du HTML propre et sémantique. Supporte CommonMark et GitHub Flavored Markdown (GFM) — tableaux, texte barré, listes de tâches et blocs de code. Copiez le HTML ou téléchargez-le pour l'utiliser dans votre CMS, modèle d'e-mail ou générateur de site statique.",
    },
    useCases: {
      en: ["Converting README files to HTML for embedding in documentation sites", "Previewing Markdown content before publishing to a CMS or blog platform", "Writing email newsletters in Markdown and exporting to HTML", "Generating HTML snippets from notes written in Markdown editors"],
      fr: ["Convertir des fichiers README en HTML pour des sites de documentation", "Prévisualiser du contenu Markdown avant publication sur un CMS ou blog", "Rédiger des newsletters en Markdown et les exporter en HTML", "Générer des fragments HTML depuis des notes rédigées en Markdown"],
    },
  },
  "hash-generator": {
    desc: {
      en: "The Hash Generator computes MD5, SHA-1 and SHA-256 fingerprints for any text string or file — instantly, using the Web Crypto API in your browser. Use it to verify file integrity after a download, compare files without opening them, or generate content hashes for caching strategies.",
      fr: "Le générateur de hash calcule les empreintes MD5, SHA-1 et SHA-256 pour n'importe quel texte ou fichier — instantanément, via la Web Crypto API dans votre navigateur. Utilisez-le pour vérifier l'intégrité d'un fichier téléchargé, comparer des fichiers sans les ouvrir, ou générer des hashes de contenu pour la mise en cache.",
    },
    useCases: {
      en: ["Verifying a downloaded file against its published SHA-256 checksum", "Generating a content hash for cache-busting asset URLs", "Checking whether two files are identical without comparing byte-by-byte", "Computing MD5 checksums for legacy systems or upload verification"],
      fr: ["Vérifier un fichier téléchargé face à son checksum SHA-256 publié", "Générer un hash de contenu pour les URL d'assets avec cache-busting", "Vérifier si deux fichiers sont identiques sans comparaison octet par octet", "Calculer des checksums MD5 pour des systèmes legacy ou la vérification d'upload"],
    },
  },
  "regex-tester": {
    desc: {
      en: "The Regex Tester highlights pattern matches in real time as you type. It supports all JavaScript regex flags (g, i, m, s, u) and displays named and unnamed capture groups separately. Useful for prototyping validation patterns before adding them to your codebase, testing parsing logic, or learning regular expressions interactively.",
      fr: "Le testeur de regex surligne les correspondances en temps réel au fur et à mesure de la saisie. Supporte tous les flags JavaScript (g, i, m, s, u) et affiche les groupes de capture nommés et non nommés séparément. Utile pour prototyper des patterns de validation, tester de la logique de parsing, ou apprendre les expressions régulières.",
    },
    useCases: {
      en: ["Prototyping an email, phone or postal code validation regex", "Extracting structured data from log lines using capture groups", "Testing regex patterns on real sample data before deploying to production", "Learning how quantifiers, anchors and lookaheads interact with text"],
      fr: ["Prototyper un regex de validation d'e-mail, téléphone ou code postal", "Extraire des données structurées de lignes de log via des groupes de capture", "Tester des patterns sur des données réelles avant déploiement en production", "Apprendre comment les quantificateurs, ancres et lookaheads interagissent avec le texte"],
    },
  },
  "ip-lookup": {
    desc: {
      en: "The IP Lookup tool returns the country, region, city, ISP, ASN and timezone for any IPv4 or IPv6 address. Leave the field blank to look up your own public IP. Useful for diagnosing network routing issues, verifying VPN exit nodes, and auditing the geographic origin of traffic in your server logs.",
      fr: "L'outil de recherche d'adresse IP renvoie le pays, la région, la ville, le FAI, l'ASN et le fuseau horaire de n'importe quelle adresse IPv4 ou IPv6. Laissez le champ vide pour consulter votre propre IP publique. Utile pour diagnostiquer des problèmes de routage, vérifier les nœuds de sortie VPN, ou auditer l'origine géographique du trafic dans vos logs serveur.",
    },
    useCases: {
      en: ["Finding the country and ISP behind an unfamiliar IP in your access logs", "Verifying that your VPN is correctly routing traffic through the expected country", "Checking your own public IP address from behind a NAT or corporate proxy", "Auditing the geographic distribution of bot traffic hitting your API"],
      fr: ["Identifier le pays et le FAI d'une IP inconnue dans vos logs d'accès", "Vérifier que votre VPN route correctement le trafic via le pays attendu", "Consulter votre IP publique depuis derrière un NAT ou proxy d'entreprise", "Auditer la distribution géographique des bots qui frappent votre API"],
    },
  },
  "uuid-generator": {
    desc: {
      en: "The UUID Generator produces universally unique identifiers in v1 (time-based), v4 (fully random) and v7 (time-ordered random) formats. Generate one or hundreds at a time, copy individually or as a batch. All generation happens in your browser using the Web Crypto API — no network request required.",
      fr: "Le générateur UUID produit des identifiants universellement uniques aux formats v1 (basé sur le temps), v4 (entièrement aléatoire) et v7 (aléatoire ordonné dans le temps). Générez-en un ou des centaines à la fois, copiez-les individuellement ou en lot. Tout se passe dans le navigateur via la Web Crypto API.",
    },
    useCases: {
      en: ["Generating primary keys for database inserts in development or testing", "Creating unique IDs for test fixtures, mock data or seed files", "Generating v7 UUIDs for time-sortable records in distributed systems", "Producing correlation IDs for distributed tracing across microservices"],
      fr: ["Générer des clés primaires pour des insertions en base de données en développement ou test", "Créer des ID uniques pour des fixtures de test, des données mock ou des fichiers de seed", "Générer des UUID v7 pour des enregistrements triables dans le temps en systèmes distribués", "Produire des correlation ID pour le tracing distribué entre microservices"],
    },
  },
  "cron-generator": {
    desc: {
      en: "The Cron Expression Generator translates cron syntax into plain-language explanations and lets you build expressions visually, field by field. Supports the standard 5-field format (minute, hour, day-of-month, month, day-of-week) plus shortcuts like @hourly and @weekly. Eliminates the need to memorize cron syntax for common scheduling tasks.",
      fr: "Le générateur d'expressions cron traduit la syntaxe cron en explications en langage clair et permet de construire des expressions visuellement, champ par champ. Supporte le format standard à 5 champs et les raccourcis comme @hourly et @weekly. Élimine la nécessité de mémoriser la syntaxe cron pour les tâches de planification courantes.",
    },
    useCases: {
      en: ["Building a cron expression for a daily database backup job", "Scheduling a weekly report to run every Monday at 8:00 AM", "Verifying that an existing cron expression fires when you expect it to", "Learning cron syntax through the interactive field builder"],
      fr: ["Construire une expression cron pour une tâche de sauvegarde de base de données quotidienne", "Planifier un rapport hebdomadaire tous les lundis à 8h00", "Vérifier qu'une expression cron existante se déclenche quand vous l'attendez", "Apprendre la syntaxe cron via le constructeur de champs interactif"],
    },
  },
  "case-converter": {
    desc: {
      en: "The Case Converter transforms text between eight different case formats in a single click. From UPPER CASE and lower case to camelCase, PascalCase, snake_case and kebab-case — it handles Unicode and accented characters correctly, making it reliable for both code identifiers and natural-language content in any language.",
      fr: "Le convertisseur de casse transforme du texte entre huit formats différents en un seul clic. De MAJUSCULE et minuscule à camelCase, PascalCase, snake_case et kebab-case — il gère correctement l'Unicode et les caractères accentués, fiable pour les identifiants de code comme pour le contenu en langage naturel.",
    },
    useCases: {
      en: ["Converting a list of column headers to snake_case for database field names", "Reformatting API response keys from camelCase to kebab-case for CSS custom properties", "Converting titles to Title Case for blog headlines or document headings", "Batch-converting variable names when migrating between coding conventions"],
      fr: ["Convertir une liste d'en-têtes de colonnes en snake_case pour des noms de champs de base de données", "Reformater des clés de réponse API de camelCase en kebab-case pour des propriétés CSS", "Convertir des titres en Titre pour des articles de blog ou des en-têtes de documents", "Convertir en lot des noms de variables lors d'une migration entre conventions de codage"],
    },
  },
  "word-counter": {
    desc: {
      en: "The Word Counter provides a real-time breakdown of words, characters, sentences and paragraphs as you type or paste. It also estimates reading time based on an average reading speed of 200 words per minute. Useful for blog posts, press releases, academic submissions and any content with length requirements.",
      fr: "Le compteur de mots fournit une analyse en temps réel des mots, caractères, phrases et paragraphes pendant que vous tapez ou collez. Il estime également le temps de lecture sur la base d'une vitesse moyenne de 200 mots par minute. Utile pour les articles de blog, communiqués de presse, soumissions académiques et tout contenu avec des contraintes de longueur.",
    },
    useCases: {
      en: ["Checking article length before submitting to a publication with strict word limits", "Estimating how long a speech or presentation script will take to deliver", "Counting characters for social media posts (Twitter, LinkedIn, meta descriptions)", "Verifying minimum word count targets for SEO content strategies"],
      fr: ["Vérifier la longueur d'un article avant soumission à une publication avec limite de mots", "Estimer la durée d'un discours ou d'un script de présentation", "Compter les caractères pour des publications sur les réseaux sociaux ou des meta descriptions", "Vérifier les cibles de nombre de mots minimum pour des stratégies de contenu SEO"],
    },
  },
  "remove-linebreaks": {
    desc: {
      en: "Remove Line Breaks cleans up text copied from PDFs, emails or word processors where artificial line breaks were inserted at the column edge. Paste your text and get back a clean, flowing paragraph. You can preserve intentional paragraph breaks (double line breaks) while removing the unwanted single ones.",
      fr: "Suppression de sauts de ligne nettoie le texte copié depuis des PDF, e-mails ou traitements de texte où des sauts de ligne artificiels ont été insérés en fin de colonne. Collez votre texte et récupérez un paragraphe propre et fluide. Vous pouvez conserver les sauts de paragraphe intentionnels tout en supprimant les simples indésirables.",
    },
    useCases: {
      en: ["Cleaning up text copied from a PDF with hard-wrapped line breaks", "Removing formatting artifacts from copy-pasted email chains", "Preparing scraped or exported text for pasting into a rich-text CMS", "Normalizing text from OCR output before further processing"],
      fr: ["Nettoyer du texte copié depuis un PDF avec des sauts de ligne durs", "Supprimer les artefacts de formatage de chaînes d'e-mails copiées-collées", "Préparer du texte extrait ou exporté pour le coller dans un CMS rich-text", "Normaliser du texte issu d'OCR avant traitement ultérieur"],
    },
  },
  "text-reverser": {
    desc: {
      en: "The Text Reverser flips your text in three modes: character-by-character, word-by-word, or line-by-line. It correctly handles Unicode characters, emojis and combining characters — so you get accurate results regardless of the language or special characters in your text. Output is instant with a one-click copy button.",
      fr: "L'inverseur de texte retourne votre texte selon trois modes : caractère par caractère, mot par mot ou ligne par ligne. Il gère correctement les caractères Unicode, les emojis et les caractères combinants — pour des résultats précis quelle que soit la langue ou les caractères spéciaux. Résultat instantané avec un bouton de copie en un clic.",
    },
    useCases: {
      en: ["Creating mirror text for design, watermarks or social media posts", "Reversing word order to analyze or demonstrate sentence structure", "Generating reversed strings for simple text puzzles or games", "Testing string reversal logic in an application with real Unicode edge cases"],
      fr: ["Créer du texte miroir pour du design, des filigranes ou des publications sur les réseaux sociaux", "Inverser l'ordre des mots pour analyser ou illustrer la structure d'une phrase", "Générer des chaînes inversées pour des puzzles ou jeux de texte", "Tester la logique d'inversion de chaînes avec de vrais cas limites Unicode"],
    },
  },
  "url-encoder": {
    desc: {
      en: "The URL Encoder converts special characters to percent-encoded form for safe use in URLs, and decodes them back to readable text. It handles both complete URLs (preserving slashes and structure) and individual components (encoding everything including slashes). Supports UTF-8 Unicode encoding per the HTML5 specification.",
      fr: "L'encodeur URL convertit les caractères spéciaux en forme percent-encodée pour une utilisation sûre dans les URL, et les décode en texte lisible. Gère les URL complètes (en préservant les barres obliques et la structure) et les composants individuels (en encodant tout, y compris les barres obliques). Supporte l'encodage Unicode UTF-8 selon la spécification HTML5.",
    },
    useCases: {
      en: ["Encoding a query string containing spaces, accents or special characters", "Decoding a percent-encoded URL to make it human-readable", "Encoding a path segment that contains Unicode or slash characters", "Debugging URL encoding mismatches in API requests or redirects"],
      fr: ["Encoder une chaîne de requête contenant des espaces, accents ou caractères spéciaux", "Décoder une URL percent-encodée pour la rendre lisible", "Encoder un segment de chemin contenant des caractères Unicode ou des barres obliques", "Déboguer des décalages d'encodage URL dans des requêtes API ou des redirections"],
    },
  },
  "html-entities": {
    desc: {
      en: "The HTML Entity Encoder converts characters like <, >, &, \" and accented letters into their HTML entity equivalents — and back. Essential for safely inserting user-generated content into HTML markup, displaying code examples in a <pre> block, or preparing text for legacy systems that require ASCII-safe HTML.",
      fr: "L'encodeur d'entités HTML convertit les caractères comme <, >, &, \" et les lettres accentuées en leurs équivalents d'entités HTML — et inversement. Essentiel pour insérer du contenu généré par l'utilisateur en toute sécurité dans du HTML, afficher des exemples de code dans un bloc <pre>, ou préparer du texte pour des systèmes legacy nécessitant du HTML ASCII-safe.",
    },
    useCases: {
      en: ["Escaping user input before rendering it in an HTML template", "Preparing code snippets for display in a <pre> or <code> block without browser interpretation", "Decoding HTML entities found in scraped or exported web content", "Converting accented characters to named entities for legacy email clients"],
      fr: ["Échapper la saisie utilisateur avant de la rendre dans un template HTML", "Préparer des extraits de code pour affichage dans <pre> ou <code> sans interprétation par le navigateur", "Décoder les entités HTML dans du contenu web extrait ou exporté", "Convertir les caractères accentués en entités nommées pour des clients e-mail legacy"],
    },
  },
  "palette-generator": {
    desc: {
      en: "The Palette Generator creates harmonious color palettes from any base color using established color theory. Choose from complementary, triadic, analogous or split-complementary harmony modes to get a balanced set of colors for UI design, brand identity or illustration. Input any color in HEX, RGB or HSL and get all format values for each generated color.",
      fr: "Le générateur de palette crée des palettes de couleurs harmoniques depuis n'importe quelle couleur de base en appliquant la théorie des couleurs. Choisissez parmi les modes complémentaire, triadique, analogue ou complémentaire fractionnée pour obtenir un ensemble équilibré de couleurs pour votre interface, identité de marque ou illustration.",
    },
    useCases: {
      en: ["Generating a full color palette for a new website or brand identity", "Finding complementary accent colors for a UI design system", "Exploring different color harmonies to pick the most visually balanced set", "Getting precise HEX, RGB and HSL values for design token documentation"],
      fr: ["Générer une palette de couleurs complète pour un nouveau site ou une identité de marque", "Trouver des couleurs d'accent complémentaires pour un design system d'interface", "Explorer différentes harmonies chromatiques pour choisir l'ensemble le plus équilibré", "Obtenir les valeurs précises HEX, RGB et HSL pour la documentation des design tokens"],
    },
  },
  "password-generator": {
    desc: {
      en: "The Password Generator creates cryptographically secure passwords using the Web Crypto API — drawing from your operating system's secure entropy source, not a predictable algorithm. Customize the length and toggle uppercase, lowercase, numbers and symbols to meet any password policy. Nothing is transmitted; everything stays in your browser.",
      fr: "Le générateur de mot de passe crée des mots de passe cryptographiquement sécurisés via la Web Crypto API — en s'appuyant sur la source d'entropie sécurisée de votre système d'exploitation, pas sur un algorithme prédictible. Personnalisez la longueur et activez majuscules, minuscules, chiffres et symboles. Rien n'est transmis ; tout reste dans votre navigateur.",
    },
    useCases: {
      en: ["Generating a strong, unique password for a new account or service", "Creating multiple secure passwords for a batch of test accounts", "Generating a random API key, secret token or session ID", "Verifying that a password meets specific complexity requirements by generating examples"],
      fr: ["Générer un mot de passe fort et unique pour un nouveau compte ou service", "Créer plusieurs mots de passe sécurisés pour un lot de comptes de test", "Générer une clé API aléatoire, un token secret ou un identifiant de session", "Vérifier qu'un mot de passe répond à des exigences de complexité spécifiques en générant des exemples"],
    },
  },
  "gradient-generator": {
    desc: {
      en: "The Gradient Generator lets you design CSS gradients visually and copy the result as ready-to-paste code. Add up to 5 color stops, drag them to reorder, adjust the angle, and switch between linear and radial modes. The live preview updates instantly. One click copies the complete linear-gradient() or radial-gradient() CSS declaration.",
      fr: "Le générateur de dégradé vous permet de concevoir des dégradés CSS visuellement et de copier le résultat en code prêt à utiliser. Ajoutez jusqu'à 5 arrêts de couleur, faites-les glisser pour les réordonner, ajustez l'angle et basculez entre mode linéaire et radial. L'aperçu se met à jour instantanément.",
    },
    useCases: {
      en: ["Designing a background gradient for a hero section or landing page", "Building a gradient for a button, badge or card component", "Creating a radial spotlight or glow effect with a precise center", "Experimenting with multi-stop color transitions for a design system"],
      fr: ["Concevoir un dégradé de fond pour une section hero ou une landing page", "Créer un dégradé pour un bouton, badge ou composant carte", "Créer un effet de spot ou de halo radial avec un centre précis", "Expérimenter des transitions de couleurs multi-arrêts pour un design system"],
    },
  },
  "meta-preview": {
    desc: {
      en: "The Meta Tag Preview fetches a URL and simulates how it will appear when shared on Google, Facebook and Twitter/X — before you post it publicly. See the title, description, image and URL display for all three platforms simultaneously. An essential check before publishing any page you plan to share on social media.",
      fr: "L'aperçu des balises meta récupère une URL et simule son apparence lors du partage sur Google, Facebook et Twitter/X — avant de la publier. Voyez le titre, la description, l'image et l'URL pour les trois plateformes simultanément. Une vérification essentielle avant de publier toute page destinée à être partagée sur les réseaux sociaux.",
    },
    useCases: {
      en: ["Verifying that a blog post's Open Graph image appears correctly before sharing", "Checking Twitter Card metadata after adding twitter: tags to a page", "Debugging why a shared link shows an unexpected title or image on social media", "Previewing how a product page renders in Google's mobile search snippet"],
      fr: ["Vérifier qu'une image Open Graph de billet de blog s'affiche correctement avant le partage", "Contrôler les métadonnées Twitter Card après ajout des balises twitter: sur une page", "Déboguer pourquoi un lien partagé affiche un titre ou une image inattendu sur les réseaux sociaux", "Prévisualiser le rendu d'une page produit dans l'extrait de recherche mobile de Google"],
    },
  },
  "seo-analyzer": {
    desc: {
      en: "The SEO Analyzer fetches any public URL and evaluates its on-page SEO across key criteria: title length, meta description quality, H1–H6 heading structure, word count and image alt attributes. You receive a score with detailed, actionable feedback for each criterion — enough to identify the most impactful improvements without a paid SEO subscription.",
      fr: "L'analyseur SEO récupère n'importe quelle URL publique et évalue son SEO on-page selon des critères clés : longueur du titre, qualité de la meta description, structure des titres H1–H6, nombre de mots et attributs alt des images. Vous recevez un score avec des retours détaillés et actionnables pour chaque critère.",
    },
    useCases: {
      en: ["Running a quick SEO audit on a newly published page before promoting it", "Comparing your page's on-page SEO against a competitor's equivalent page", "Identifying missing meta descriptions, duplicate H1 tags or empty alt attributes", "Checking minimum content requirements (word count, heading hierarchy) before indexing"],
      fr: ["Effectuer un audit SEO rapide d'une page nouvellement publiée avant de la promouvoir", "Comparer le SEO on-page de votre page face à une page équivalente d'un concurrent", "Identifier les meta descriptions manquantes, les H1 dupliqués ou les attributs alt vides", "Vérifier les exigences minimales de contenu (nombre de mots, hiérarchie des titres) avant indexation"],
    },
  },
};
