import type { Lang } from "./types";

export interface ToolContent {
  desc: Record<Lang, string>;
  useCases: Record<Lang, string[]>;
}

export const TOOLS_CONTENT: Partial<Record<string, ToolContent>> = {
  "json-formatter": {
    desc: {
      en: "Format and validate JSON in one click — no login, no upload, works offline once loaded. Paste any raw JSON payload and get it back properly indented and validated. Whether you're reading a minified API response, cleaning up a config file, or inspecting a webhook body, syntax errors are flagged with the exact line number so you can fix them without hunting through minified output.",
      fr: "Formatez et validez du JSON en un clic — sans compte, sans envoi de données, fonctionne hors ligne une fois chargé. Collez n'importe quel JSON brut et récupérez-le correctement indenté et validé. Que vous lisiez une réponse d'API minifiée, nettoyiez un fichier de configuration ou inspectiez une charge utile de webhook, les erreurs de syntaxe sont signalées avec le numéro de ligne exact.",
    },
    useCases: {
      en: ["Debugging REST or GraphQL API responses", "Cleaning up minified JSON config files before editing", "Validating JSON before sending it to a webhook or database", "Inspecting a JWT payload mid-debug — without installing a library or opening a separate tool"],
      fr: ["Déboguer des réponses d'API REST ou GraphQL", "Nettoyer des fichiers de config JSON minifiés avant édition", "Valider du JSON avant de l'envoyer à un webhook ou une base de données", "Inspecter un payload JWT en cours de débogage — sans installer de bibliothèque ni ouvrir un outil séparé"],
    },
  },
  "image-converter": {
    desc: {
      en: "Convert images between JPG, PNG, WebP and AVIF directly in your browser — no upload required. Drop an image, pick a target format, and download the result. You can also resize and adjust export quality at the same time to hit the exact file size you need for web optimization, social media or email.",
      fr: "Convertissez des images entre JPG, PNG, WebP et AVIF directement dans votre navigateur, sans envoyer de fichier nulle part. Déposez une image, choisissez un format cible, et téléchargez le résultat. Redimensionnez et ajustez la qualité d'export en même temps pour atteindre exactement la taille de fichier voulue.",
    },
    useCases: {
      en: ["Converting PNG screenshots to WebP for faster web page loading", "Resizing and compressing images to meet social media upload limits", "Converting AVIF files to JPG for compatibility with older software", "Generating multiple format variants of the same image for a <picture> element"],
      fr: ["Convertir des captures d'écran PNG en WebP pour accélérer le chargement des pages", "Redimensionner et compresser des images pour les réseaux sociaux", "Convertir des fichiers AVIF en JPG pour la compatibilité avec des logiciels anciens", "Générer plusieurs variantes de format pour un élément <picture> HTML"],
    },
  },
  "pdf-converter": {
    desc: {
      en: "Convert each PDF page to PNG or JPG for presentations and websites, or export the full document to DOCX for editing in Word. Processing uses PDF.js and pdf-lib in your browser — no file leaves your machine.",
      fr: "Convertissez chaque page d'un PDF en PNG ou JPG pour vos présentations et sites web, ou exportez en DOCX pour l'éditer dans Word. Le traitement s'effectue via PDF.js et pdf-lib dans votre navigateur — aucun fichier ne quitte votre machine.",
    },
    useCases: {
      en: ["Extracting pages from a PDF as images for a slide deck", "Converting a scanned PDF to Word for text editing", "Creating image previews of PDF pages to embed on a website", "Archiving individual PDF pages as standalone image files"],
      fr: ["Extraire des pages d'un PDF en images pour une présentation", "Convertir un PDF scanné en Word pour l'édition de texte", "Créer des aperçus image de pages PDF à intégrer sur un site web", "Archiver des pages PDF individuelles en fichiers image autonomes"],
    },
  },
  "audio-converter": {
    desc: {
      en: "Convert between MP3, WAV, FLAC, AAC and OGG entirely in your browser using FFmpeg compiled to WebAssembly. No file size limits beyond your available RAM. The first conversion loads the FFmpeg engine (~20 MB) — subsequent conversions in the same session are near-instant.",
      fr: "Convertissez entre MP3, WAV, FLAC, AAC et OGG entièrement dans votre navigateur grâce à FFmpeg compilé en WebAssembly. Aucune limite de taille au-delà de votre RAM disponible. La première conversion charge le moteur FFmpeg (~20 Mo) — les suivantes dans la même session sont quasi instantanées.",
    },
    useCases: {
      en: ["Converting WAV recordings to MP3 for sharing or streaming", "Converting FLAC albums to AAC for Apple device compatibility", "Converting OGG audio from games or apps to a more portable format", "Preparing audio files for podcast upload platforms that require specific formats"],
      fr: ["Convertir des enregistrements WAV en MP3 pour le partage ou le streaming", "Convertir des albums FLAC en AAC pour la compatibilité avec les appareils Apple", "Convertir de l'audio OGG en format plus portable", "Préparer des fichiers audio pour des plateformes de podcast nécessitant un format spécifique"],
    },
  },
  "video-converter": {
    desc: {
      en: "The Video Converter re-encodes video files or extracts audio tracks — powered by FFmpeg WASM running entirely in your browser. Convert MP4 to WebM for HTML5 embeds, create animated GIFs from short clips, or rip the audio to MP3 from any video file. Processing stays on your device: no file size cap beyond your available RAM.",
      fr: "Le convertisseur vidéo ré-encode des fichiers vidéo ou extrait des pistes audio — propulsé par FFmpeg WASM s'exécutant entièrement dans votre navigateur. Convertissez MP4 en WebM pour le web, créez des GIF animés depuis des clips, ou extrayez l'audio en MP3. Le traitement reste sur votre appareil : aucune limite de taille au-delà de votre RAM disponible.",
    },
    useCases: {
      en: ["Converting MP4 to WebM for HTML5 <video> elements", "Creating GIFs from short video clips for documentation or social media", "Ripping the audio track from a recorded interview or lecture", "Converting MOV files from iPhone to MP4 for broader compatibility"],
      fr: ["Convertir MP4 en WebM pour les éléments <video> HTML5", "Créer des GIF depuis de courts clips vidéo pour de la documentation ou les réseaux sociaux", "Extraire la piste audio d'un entretien ou d'un cours enregistré", "Convertir des fichiers MOV depuis iPhone en MP4 pour une meilleure compatibilité"],
    },
  },
  "pdf-merge": {
    desc: {
      en: "Combine multiple PDF files without sending them to a server — drop your files, drag to reorder, and download the merged result. Processing runs locally in your browser using pdf-lib, making it safe for confidential documents like contracts, invoices or medical records.",
      fr: "Fusionnez plusieurs fichiers PDF sans les envoyer sur un serveur — déposez-les, réordonnez-les par glisser-déposer, et téléchargez le résultat fusionné. Le traitement s'effectue localement dans votre navigateur via pdf-lib, idéal pour les documents confidentiels comme des contrats, factures ou dossiers médicaux.",
    },
    useCases: {
      en: ["Combining monthly invoices into a single PDF for accounting", "Merging multiple contract pages or annexes into one document to sign", "Got the appendices as separate files? Drop them all at once and drag to set the order before merging", "Reordering pages by splitting PDFs and re-merging in the desired order"],
      fr: ["Regrouper les factures mensuelles en un seul PDF pour la comptabilité", "Fusionner plusieurs pages d'un contrat ou ses annexes en un document à signer", "Les annexes sont dans des fichiers séparés ? Déposez-les tous d'un coup et glissez-les dans l'ordre avant de fusionner", "Réordonner des pages en scindant des PDF et en les refusionnant dans l'ordre souhaité"],
    },
  },
  "qr-generator": {
    desc: {
      en: "Create a QR code from any URL or text in seconds — free, offline, no account required. The generator runs entirely in your browser so no QR code is ever stored or tracked. Export as SVG for crisp quality at any print size, or PNG for embedding in images and documents.",
      fr: "Créez un QR code depuis n'importe quelle URL ou texte en quelques secondes — gratuit, hors ligne, sans compte. Le générateur s'exécute entièrement dans votre navigateur, aucun QR code n'est stocké ni tracé. Exportez en SVG pour une qualité parfaite à n'importe quelle taille d'impression, ou en PNG pour l'intégration dans des images et des documents.",
    },
    useCases: {
      en: ["Creating QR codes for business cards, posters or product packaging", "Linking physical items to their online documentation or warranty page", "Generating a QR code to share Wi-Fi network credentials", "Adding a scannable link to a presentation slide or conference badge"],
      fr: ["Créer des QR codes pour des cartes de visite, affiches ou emballages produit", "Lier des objets physiques à leur documentation ou page de garantie en ligne", "Générer un QR code pour partager des identifiants Wi-Fi", "Ajouter un lien scannable à une diapositive ou un badge de conférence"],
    },
  },
  "base64": {
    desc: {
      en: "Encode text or binary files to Base64, or decode any Base64 string back to its original form. Supports both standard Base64 and URL-safe variants. Drop any file — image, PDF, archive — to get its Base64 representation. Commonly used for data URIs, JWT inspection and API payload debugging.",
      fr: "Encodez du texte ou des fichiers binaires en Base64, ou décodez n'importe quelle chaîne Base64 vers sa forme d'origine. Supporte le Base64 standard et la variante URL-safe. Déposez n'importe quel fichier — image, PDF, archive — pour obtenir sa représentation Base64.",
    },
    useCases: {
      en: ["Decoding a JWT token payload to inspect its claims and expiry", "Embedding a small image as a data URI in HTML, CSS or JSON", "Encoding binary file attachments for email or REST API transmission", "Debugging Base64-encoded values in API responses or config files"],
      fr: ["Décoder un payload JWT pour inspecter ses claims et sa date d'expiration", "Intégrer une petite image en data URI dans du HTML, CSS ou JSON", "Encoder des pièces jointes binaires pour une transmission par e-mail ou API REST", "Déboguer des valeurs Base64 dans des réponses d'API ou des fichiers de config"],
    },
  },
  "markdown-html": {
    desc: {
      en: "Write Markdown on the left, get clean semantic HTML on the right — rendered in real time. Supports CommonMark and GitHub Flavored Markdown including tables, strikethrough, task lists and fenced code blocks. Copy the output or download it as a file to paste into your CMS, email template or static site generator.",
      fr: "Rédigez du Markdown à gauche, obtenez du HTML propre et sémantique à droite — rendu en temps réel. Supporte CommonMark et GitHub Flavored Markdown (GFM) — tableaux, texte barré, listes de tâches et blocs de code. Copiez le HTML ou téléchargez-le pour l'utiliser dans votre CMS, modèle d'e-mail ou générateur de site statique.",
    },
    useCases: {
      en: ["Converting README files to HTML for embedding in documentation sites", "Previewing Markdown content before publishing to a CMS or blog platform", "Writing email newsletters in Markdown and exporting to HTML", "Generating HTML snippets from notes written in Markdown editors"],
      fr: ["Convertir des fichiers README en HTML pour des sites de documentation", "Prévisualiser du contenu Markdown avant publication sur un CMS ou blog", "Rédiger des newsletters en Markdown et les exporter en HTML", "Générer des fragments HTML depuis des notes rédigées en Markdown"],
    },
  },
  "hash-generator": {
    desc: {
      en: "Compute MD5, SHA-1 and SHA-256 fingerprints for any text or file — instantly, using the Web Crypto API in your browser. Use it to verify file integrity after a download, compare files without opening them, or generate content hashes for caching strategies.",
      fr: "Calculez les empreintes MD5, SHA-1 et SHA-256 pour n'importe quel texte ou fichier — instantanément, via la Web Crypto API dans votre navigateur. Vérifiez l'intégrité d'un fichier téléchargé, comparez des fichiers sans les ouvrir, ou générez des hashes de contenu pour la mise en cache.",
    },
    useCases: {
      en: ["Verifying a downloaded file against its published SHA-256 checksum", "Generating a content hash for cache-busting asset URLs", "Drop two versions of a file and compare their hashes — if they match, the files are byte-for-byte identical", "Computing MD5 checksums for legacy systems or upload verification"],
      fr: ["Vérifier un fichier téléchargé face à son checksum SHA-256 publié", "Générer un hash de contenu pour les URL d'assets avec cache-busting", "Déposez deux versions d'un fichier et comparez leurs hashes — s'ils correspondent, les fichiers sont identiques octet par octet", "Calculer des checksums MD5 pour des systèmes legacy ou la vérification d'upload"],
    },
  },
  "regex-tester": {
    desc: {
      en: "Pattern matches highlight in real time as you type. Supports all JavaScript regex flags (g, i, m, s, u) and displays named and unnamed capture groups separately. Useful for prototyping validation patterns before adding them to your codebase, testing parsing logic, or learning regular expressions interactively.",
      fr: "Les correspondances sont surlignées en temps réel à la saisie. Supporte tous les flags JavaScript (g, i, m, s, u) et affiche les groupes de capture nommés et non nommés séparément. Utile pour prototyper des patterns de validation, tester de la logique de parsing, ou apprendre les expressions régulières.",
    },
    useCases: {
      en: ["Prototyping an email, phone or postal code validation regex", "Extracting structured data from log lines using capture groups", "Testing regex patterns on real sample data before deploying to production", "Learning how quantifiers, anchors and lookaheads interact with text"],
      fr: ["Prototyper un regex de validation d'e-mail, téléphone ou code postal", "Extraire des données structurées de lignes de log via des groupes de capture", "Tester des patterns sur des données réelles avant déploiement en production", "Apprendre comment les quantificateurs, ancres et lookaheads interagissent avec le texte"],
    },
  },
  "ip-lookup": {
    desc: {
      en: "Enter any IPv4 or IPv6 address to get its country, region, city, ISP, ASN and timezone. Leave the field blank to look up your own public IP. Useful for diagnosing network routing issues, verifying VPN exit nodes, and auditing the geographic origin of traffic in your server logs.",
      fr: "Saisissez n'importe quelle adresse IPv4 ou IPv6 pour obtenir son pays, sa région, sa ville, son FAI, son ASN et son fuseau horaire. Laissez le champ vide pour consulter votre propre IP publique. Utile pour diagnostiquer des problèmes de routage, vérifier les nœuds de sortie VPN, ou auditer l'origine géographique du trafic dans vos logs serveur.",
    },
    useCases: {
      en: ["Finding the country and ISP behind an unfamiliar IP in your access logs", "Verifying that your VPN is correctly routing traffic through the expected country", "Checking your own public IP address from behind a NAT or corporate proxy", "Auditing the geographic distribution of bot traffic hitting your API"],
      fr: ["Identifier le pays et le FAI d'une IP inconnue dans vos logs d'accès", "Vérifier que votre VPN route correctement le trafic via le pays attendu", "Consulter votre IP publique depuis derrière un NAT ou proxy d'entreprise", "Auditer la distribution géographique des bots qui frappent votre API"],
    },
  },
  "uuid-generator": {
    desc: {
      en: "Generate universally unique identifiers in v1 (time-based), v4 (fully random) and v7 (time-ordered random) formats. One at a time or hundreds in a batch, copy individually or all at once. All generation runs in your browser using the Web Crypto API — no network request.",
      fr: "Générez des identifiants universellement uniques aux formats v1 (basé sur le temps), v4 (entièrement aléatoire) et v7 (aléatoire ordonné dans le temps). Un seul ou des centaines en lot, copiez individuellement ou en une fois. Tout se passe dans le navigateur via la Web Crypto API — aucune requête réseau.",
    },
    useCases: {
      en: ["Generating primary keys for database inserts in development or testing", "Seeding a local database with a batch of 50 UUIDs in one copy — no script needed", "Generating v7 UUIDs for time-sortable records in distributed systems", "Producing correlation IDs for distributed tracing across microservices"],
      fr: ["Générer des clés primaires pour des insertions en base de données en développement ou test", "Remplir une base de données locale avec un lot de 50 UUID en un seul copier-coller — sans script", "Générer des UUID v7 pour des enregistrements triables dans le temps en systèmes distribués", "Produire des correlation ID pour le tracing distribué entre microservices"],
    },
  },
  "cron-generator": {
    desc: {
      en: "Type any cron expression and get a plain-language explanation — or build one visually, field by field. Supports the standard 5-field format (minute, hour, day-of-month, month, day-of-week) plus shortcuts like @hourly and @weekly.",
      fr: "Tapez n'importe quelle expression cron et obtenez une explication en langage clair — ou construisez-en une visuellement, champ par champ. Supporte le format standard à 5 champs et les raccourcis comme @hourly et @weekly.",
    },
    useCases: {
      en: ["Building a cron expression for a daily database backup job", "Scheduling a weekly report to run every Monday at 8:00 AM", "Already have a cron string but not sure when it actually fires? Paste it in and read the plain-English explanation", "Learning cron syntax through the interactive field builder"],
      fr: ["Construire une expression cron pour une tâche de sauvegarde de base de données quotidienne", "Planifier un rapport hebdomadaire tous les lundis à 8h00", "Vous avez une expression cron mais vous ne savez pas exactement quand elle se déclenche ? Collez-la et lisez l'explication en langage clair", "Apprendre la syntaxe cron via le constructeur de champs interactif"],
    },
  },
  "case-converter": {
    desc: {
      en: "Switch text between eight case formats in a single click — from UPPER CASE and lower case to camelCase, PascalCase, snake_case and kebab-case. Handles Unicode and accented characters correctly, making it reliable for both code identifiers and natural-language content in any language.",
      fr: "Passez d'un format de casse à l'autre en un seul clic — de MAJUSCULE et minuscule à camelCase, PascalCase, snake_case et kebab-case. Gère correctement l'Unicode et les caractères accentués, fiable pour les identifiants de code comme pour le contenu en langage naturel.",
    },
    useCases: {
      en: ["Converting a list of column headers to snake_case for database field names", "Reformatting API response keys from camelCase to kebab-case for CSS custom properties", "Converting titles to Title Case for blog headlines or document headings", "Batch-converting variable names when migrating between coding conventions"],
      fr: ["Convertir une liste d'en-têtes de colonnes en snake_case pour des noms de champs de base de données", "Reformater des clés de réponse API de camelCase en kebab-case pour des propriétés CSS", "Convertir des titres en Titre pour des articles de blog ou des en-têtes de documents", "Convertir en lot des noms de variables lors d'une migration entre conventions de codage"],
    },
  },
  "word-counter": {
    desc: {
      en: "Paste or type any text to get a real-time breakdown of words, characters, sentences and paragraphs — plus an estimated reading time at 200 words per minute. Useful for blog posts, press releases, academic submissions and any content with length requirements.",
      fr: "Collez ou tapez n'importe quel texte pour obtenir une analyse en temps réel des mots, caractères, phrases et paragraphes — avec une estimation du temps de lecture à 200 mots par minute. Utile pour les articles de blog, communiqués de presse, soumissions académiques et tout contenu avec des contraintes de longueur.",
    },
    useCases: {
      en: ["Checking article length before submitting to a publication with strict word limits", "Estimating how long a speech or presentation script will take to deliver", "Counting characters for social media posts (Twitter, LinkedIn, meta descriptions)", "Verifying minimum word count targets for SEO content strategies"],
      fr: ["Vérifier la longueur d'un article avant soumission à une publication avec limite de mots", "Estimer la durée d'un discours ou d'un script de présentation", "Compter les caractères pour des publications sur les réseaux sociaux ou des meta descriptions", "Vérifier les cibles de nombre de mots minimum pour des stratégies de contenu SEO"],
    },
  },
  "remove-linebreaks": {
    desc: {
      en: "Clean up text copied from PDFs, emails or word processors where artificial line breaks were inserted at the column edge. Paste your text and get back a clean, flowing paragraph. You can preserve intentional paragraph breaks (double line breaks) while removing the unwanted single ones.",
      fr: "Nettoyez le texte copié depuis des PDF, e-mails ou traitements de texte où des sauts de ligne artificiels ont été insérés en fin de colonne. Collez votre texte et récupérez un paragraphe propre et fluide. Conservez les sauts de paragraphe intentionnels tout en supprimant les simples indésirables.",
    },
    useCases: {
      en: ["Cleaning up text copied from a PDF with hard-wrapped line breaks", "Removing formatting artifacts from copy-pasted email chains", "Preparing scraped or exported text for pasting into a rich-text CMS", "Normalizing text from OCR output before further processing"],
      fr: ["Nettoyer du texte copié depuis un PDF avec des sauts de ligne durs", "Supprimer les artefacts de formatage de chaînes d'e-mails copiées-collées", "Préparer du texte extrait ou exporté pour le coller dans un CMS rich-text", "Normaliser du texte issu d'OCR avant traitement ultérieur"],
    },
  },
  "text-reverser": {
    desc: {
      en: "The Text Reverser flips your text in three modes: character-by-character, word-by-word, or line-by-line. It correctly handles Unicode characters, emojis and combining characters — so you get accurate results regardless of the language or special characters in your text. Output updates as you type, with a one-click copy button.",
      fr: "L'inverseur de texte retourne votre texte selon trois modes : caractère par caractère, mot par mot ou ligne par ligne. Il gère correctement les caractères Unicode, les emojis et les caractères combinants — pour des résultats précis quelle que soit la langue ou les caractères spéciaux. Le résultat se met à jour à la saisie, avec un bouton de copie en un clic.",
    },
    useCases: {
      en: ["Creating mirror text for design, watermarks or social media posts", "Reversing word order to analyze or demonstrate sentence structure", "Generating reversed strings for simple text puzzles or games", "Testing string reversal logic in an application with real Unicode edge cases"],
      fr: ["Créer du texte miroir pour du design, des filigranes ou des publications sur les réseaux sociaux", "Inverser l'ordre des mots pour analyser ou illustrer la structure d'une phrase", "Générer des chaînes inversées pour des puzzles ou jeux de texte", "Tester la logique d'inversion de chaînes avec de vrais cas limites Unicode"],
    },
  },
  "url-encoder": {
    desc: {
      en: "Convert special characters to percent-encoded form for safe use in URLs, or decode them back to readable text. Handles both complete URLs (preserving slashes and structure) and individual components (encoding everything including slashes). Supports UTF-8 Unicode encoding per the HTML5 specification.",
      fr: "Convertissez les caractères spéciaux en forme percent-encodée pour une utilisation sûre dans les URL, ou décodez-les en texte lisible. Gère les URL complètes (en préservant les barres obliques et la structure) et les composants individuels (en encodant tout, y compris les barres obliques). Supporte l'encodage Unicode UTF-8 selon la spécification HTML5.",
    },
    useCases: {
      en: ["Encoding a query string containing spaces, accents or special characters", "Decoding a percent-encoded URL to make it human-readable", "Encoding a path segment that contains Unicode or slash characters", "Debugging URL encoding mismatches in API requests or redirects"],
      fr: ["Encoder une chaîne de requête contenant des espaces, accents ou caractères spéciaux", "Décoder une URL percent-encodée pour la rendre lisible", "Encoder un segment de chemin contenant des caractères Unicode ou des barres obliques", "Déboguer des décalages d'encodage URL dans des requêtes API ou des redirections"],
    },
  },
  "html-entities": {
    desc: {
      en: "Escape characters like <, >, &, \" and accented letters into their HTML entity equivalents — and decode them back. Essential for safely inserting user-generated content into HTML markup, displaying code examples in a <pre> block, or preparing text for legacy systems that require ASCII-safe HTML.",
      fr: "Échappez les caractères comme <, >, &, \" et les lettres accentuées en leurs équivalents d'entités HTML — et décodez-les. Essentiel pour insérer du contenu généré par l'utilisateur en toute sécurité dans du HTML, afficher des exemples de code dans un bloc <pre>, ou préparer du texte pour des systèmes legacy nécessitant du HTML ASCII-safe.",
    },
    useCases: {
      en: ["Escaping user input before rendering it in an HTML template", "Preparing code snippets for display in a <pre> or <code> block without browser interpretation", "Decoding HTML entities found in scraped or exported web content", "Converting accented characters to named entities for legacy email clients"],
      fr: ["Échapper la saisie utilisateur avant de la rendre dans un template HTML", "Préparer des extraits de code pour affichage dans <pre> ou <code> sans interprétation par le navigateur", "Décoder les entités HTML dans du contenu web extrait ou exporté", "Convertir les caractères accentués en entités nommées pour des clients e-mail legacy"],
    },
  },
  "palette-generator": {
    desc: {
      en: "Generate harmonious color palettes from any base color using established color theory. Choose from complementary, triadic, analogous or split-complementary harmony modes to get a balanced set of colors for UI design, brand identity or illustration. Input any color in HEX, RGB or HSL and get all format values for each generated color.",
      fr: "Générez des palettes de couleurs harmoniques depuis n'importe quelle couleur de base en appliquant la théorie des couleurs. Choisissez parmi les modes complémentaire, triadique, analogue ou complémentaire fractionnée pour obtenir un ensemble équilibré de couleurs pour votre interface, identité de marque ou illustration.",
    },
    useCases: {
      en: ["Generating a full color palette for a new website or brand identity", "Finding complementary accent colors for a UI design system", "Exploring different color harmonies to pick the most visually balanced set", "Getting precise HEX, RGB and HSL values for design token documentation"],
      fr: ["Générer une palette de couleurs complète pour un nouveau site ou une identité de marque", "Trouver des couleurs d'accent complémentaires pour un design system d'interface", "Explorer différentes harmonies chromatiques pour choisir l'ensemble le plus équilibré", "Obtenir les valeurs précises HEX, RGB et HSL pour la documentation des design tokens"],
    },
  },
  "password-generator": {
    desc: {
      en: "Generate a secure, random password on demand — runs entirely in your browser, never transmitted to any server. Uses the Web Crypto API to draw from your OS's cryptographically secure entropy source, not a predictable algorithm. Set the length and independently toggle uppercase, lowercase, numbers and symbols to match any password policy.",
      fr: "Générez un mot de passe sécurisé et aléatoire en un clic — s'exécute entièrement dans votre navigateur, jamais transmis à un serveur. Utilise la Web Crypto API pour s'appuyer sur la source d'entropie cryptographiquement sécurisée de votre système d'exploitation, pas sur un algorithme prédictible. Définissez la longueur et activez indépendamment majuscules, minuscules, chiffres et symboles.",
    },
    useCases: {
      en: ["Generating a strong, unique password for a new account or service", "Creating multiple secure passwords for a batch of test accounts", "Generating a random API key, secret token or session ID", "Verifying that a password meets specific complexity requirements by generating examples"],
      fr: ["Générer un mot de passe fort et unique pour un nouveau compte ou service", "Créer plusieurs mots de passe sécurisés pour un lot de comptes de test", "Générer une clé API aléatoire, un token secret ou un identifiant de session", "Vérifier qu'un mot de passe répond à des exigences de complexité spécifiques en générant des exemples"],
    },
  },
  "gradient-generator": {
    desc: {
      en: "Design CSS gradients visually and copy the result as ready-to-paste code. Add up to 5 color stops, drag them to reorder, adjust the angle, and switch between linear and radial modes. The live preview updates as you edit. One click copies the complete linear-gradient() or radial-gradient() CSS declaration.",
      fr: "Concevez des dégradés CSS visuellement et copiez le résultat en code prêt à utiliser. Ajoutez jusqu'à 5 arrêts de couleur, faites-les glisser pour les réordonner, ajustez l'angle et basculez entre mode linéaire et radial. L'aperçu se met à jour en temps réel.",
    },
    useCases: {
      en: ["Designing a background gradient for a hero section or landing page", "Building a gradient for a button, badge or card component", "Creating a radial spotlight or glow effect with a precise center", "Experimenting with multi-stop color transitions for a design system"],
      fr: ["Concevoir un dégradé de fond pour une section hero ou une landing page", "Créer un dégradé pour un bouton, badge ou composant carte", "Créer un effet de spot ou de halo radial avec un centre précis", "Expérimenter des transitions de couleurs multi-arrêts pour un design system"],
    },
  },
  "meta-preview": {
    desc: {
      en: "See how any URL will appear when shared on Google, Facebook and Twitter/X — before you post it publicly. Fetches the page via proxy and renders the title, description, image and URL display for all three platforms simultaneously. An essential check before publishing any page you plan to share on social media.",
      fr: "Voyez comment n'importe quelle URL apparaîtra lors du partage sur Google, Facebook et Twitter/X — avant de la publier. Récupère la page via proxy et affiche le titre, la description, l'image et l'URL pour les trois plateformes simultanément. Une vérification essentielle avant de publier toute page destinée à être partagée sur les réseaux sociaux.",
    },
    useCases: {
      en: ["Verifying that a blog post's Open Graph image appears correctly before sharing", "Checking Twitter Card metadata after adding twitter: tags to a page", "Debugging why a shared link shows an unexpected title or image on social media", "Previewing how a product page renders in Google's mobile search snippet"],
      fr: ["Vérifier qu'une image Open Graph de billet de blog s'affiche correctement avant le partage", "Contrôler les métadonnées Twitter Card après ajout des balises twitter: sur une page", "Déboguer pourquoi un lien partagé affiche un titre ou une image inattendu sur les réseaux sociaux", "Prévisualiser le rendu d'une page produit dans l'extrait de recherche mobile de Google"],
    },
  },
  "seo-analyzer": {
    desc: {
      en: "Fetch any public URL and evaluate its on-page SEO across key criteria: title length, meta description quality, H1–H6 heading structure, word count and image alt attributes. Each criterion comes with a score and specific, concrete feedback so you can act on the most impactful issues first.",
      fr: "Analysez n'importe quelle URL publique et évaluez son SEO on-page selon des critères clés : longueur du titre, qualité de la meta description, structure des titres H1–H6, nombre de mots et attributs alt des images. Chaque critère inclut un score et des retours précis et concrets pour agir en priorité sur les points les plus impactants.",
    },
    useCases: {
      en: ["Running a quick SEO audit on a newly published page before promoting it", "Comparing your page's on-page SEO against a competitor's equivalent page", "Identifying missing meta descriptions, duplicate H1 tags or empty alt attributes", "Checking minimum content requirements (word count, heading hierarchy) before indexing"],
      fr: ["Effectuer un audit SEO rapide d'une page nouvellement publiée avant de la promouvoir", "Comparer le SEO on-page de votre page face à une page équivalente d'un concurrent", "Identifier les meta descriptions manquantes, les H1 dupliqués ou les attributs alt vides", "Vérifier les exigences minimales de contenu (nombre de mots, hiérarchie des titres) avant indexation"],
    },
  },
  "utm-builder": {
    desc: {
      en: "Build campaign tracking URLs by appending UTM parameters (source, medium, campaign, term, content) to any base URL. Fill in the fields, click to copy — everything is built locally in your browser, no external service involved. Quick presets for Google Ads, Facebook, email newsletters and Twitter/X let you get to a valid tracking URL in seconds.",
      fr: "Construisez des URLs de suivi de campagne en ajoutant des paramètres UTM (source, canal, campagne, terme, contenu) à n'importe quelle URL de base. Remplissez les champs, cliquez pour copier — tout est construit localement dans votre navigateur, aucun service externe. Des préréglages rapides pour Google Ads, Facebook, les newsletters et Twitter/X permettent d'obtenir une URL valide en quelques secondes.",
    },
    useCases: {
      en: ["Tagging newsletter links before sending a campaign to track click-through in Google Analytics", "Creating separate UTM variants for A/B testing ad copy across Google and Facebook", "Building consistent UTM conventions across a marketing team with shared presets", "Tracking traffic sources for a product launch landing page across multiple channels"],
      fr: ["Taguer les liens d'une newsletter avant envoi pour suivre les clics dans Google Analytics", "Créer des variantes UTM distinctes pour un test A/B de visuels publicitaires sur Google et Facebook", "Établir des conventions UTM cohérentes dans une équipe marketing grâce aux préréglages partagés", "Suivre les sources de trafic d'une landing page de lancement produit sur plusieurs canaux"],
    },
  },
  "jwt-generator": {
    desc: {
      en: "Sign a JSON payload as an HS256 JWT token directly in your browser using the Web Crypto API. Enter any valid JSON object as the payload, set a secret key, and click sign. The resulting token is rendered with each part color-coded (header, payload, signature) so you can visually confirm the structure. The secret key never leaves your browser — no server involved.",
      fr: "Signez un payload JSON en token JWT HS256 directement dans votre navigateur via l'API Web Crypto. Entrez n'importe quel objet JSON valide en payload, définissez une clé secrète, et cliquez sur signer. Le token résultant est affiché avec chaque partie colorée (header, payload, signature) pour confirmer visuellement la structure. La clé secrète ne quitte jamais votre navigateur.",
    },
    useCases: {
      en: ["Generating test JWTs to validate your backend authentication middleware", "Creating short-lived tokens for local API testing without spinning up an auth server", "Understanding the JWT format by modifying claims and observing the output", "Quickly signing a payload during a demo or code review without installing a library"],
      fr: ["Générer des JWT de test pour valider votre middleware d'authentification backend", "Créer des tokens de courte durée pour des tests d'API locaux sans démarrer un serveur d'auth", "Comprendre le format JWT en modifiant les claims et en observant le résultat", "Signer rapidement un payload lors d'une démo ou d'une revue de code sans installer de bibliothèque"],
    },
  },
  "readability": {
    desc: {
      en: "Analyze any text and get two standard readability metrics: Flesch-Kincaid Reading Ease (0–100, higher is easier) and Gunning Fog Index (approximate school grade level needed to read the text). Also shows average sentence length, syllables per word and the percentage of complex words (3+ syllables). English and French use slightly different formulas, applied automatically based on your language setting.",
      fr: "Analysez n'importe quel texte et obtenez deux métriques de lisibilité standard : l'indice Flesch-Kincaid (0–100, plus c'est haut, plus c'est lisible) et l'indice Gunning Fog (niveau scolaire approximatif pour lire le texte). Affiche aussi la longueur moyenne des phrases, les syllabes par mot et le pourcentage de mots complexes (3 syllabes ou plus). Le français et l'anglais utilisent des formules légèrement différentes, appliquées automatiquement selon votre langue.",
    },
    useCases: {
      en: ["Simplifying landing page copy to reach a broader audience before publishing", "Checking that user-facing error messages and documentation are easy to understand", "Comparing the readability of two versions of the same article during editing", "Ensuring legal or compliance text meets accessibility readability guidelines"],
      fr: ["Simplifier le texte d'une landing page pour toucher un public plus large avant publication", "Vérifier que les messages d'erreur et la documentation sont compréhensibles par tous les utilisateurs", "Comparer la lisibilité de deux versions d'un même article lors de la révision", "S'assurer que des textes juridiques ou de conformité respectent les recommandations d'accessibilité"],
    },
  },
  "md-table": {
    desc: {
      en: "Build Markdown tables visually — click cells to edit, add or remove rows and columns with toolbar buttons, and toggle column alignment (left, center, right) in one click. The corresponding Markdown syntax updates in real time below the grid. Copy it directly into any Markdown file, README, GitHub issue or documentation site.",
      fr: "Construisez des tableaux Markdown visuellement — cliquez sur les cellules pour éditer, ajoutez ou supprimez des lignes et colonnes avec les boutons de la barre d'outils, et changez l'alignement par colonne (gauche, centré, droite) en un clic. La syntaxe Markdown correspondante se met à jour en temps réel sous la grille. Copiez-la dans n'importe quel fichier Markdown, README, issue GitHub ou site de documentation.",
    },
    useCases: {
      en: ["Building comparison tables for README files without remembering pipe syntax", "Creating feature matrices for a product documentation site", "Generating Markdown tables from manually typed data to paste into GitHub issues or PRs", "Formatting data tables for blog posts or technical articles written in Markdown"],
      fr: ["Créer des tableaux comparatifs pour des README sans mémoriser la syntaxe pipe", "Générer des matrices de fonctionnalités pour un site de documentation produit", "Créer des tableaux Markdown depuis des données saisies manuellement pour les coller dans des issues ou PR GitHub", "Formater des tableaux de données pour des articles de blog ou des articles techniques en Markdown"],
    },
  },
  "toml-json": {
    desc: {
      en: "TOML ↔ JSON converts between the two formats in one click using smol-toml, a modern parser that supports the full TOML 1.0 specification. Paste a TOML config file and get clean JSON, or go the other way to generate TOML from a JSON object. No upload, no server — the conversion runs entirely in your browser.",
      fr: "TOML ↔ JSON convertit entre les deux formats en un clic grâce à smol-toml, un parseur moderne supportant la spécification TOML 1.0 complète. Collez un fichier de configuration TOML et obtenez du JSON propre, ou faites l'inverse pour générer du TOML depuis un objet JSON. Aucun envoi, aucun serveur — la conversion s'effectue entièrement dans votre navigateur.",
    },
    useCases: {
      en: ["Converting a Cargo.toml or pyproject.toml to JSON for programmatic processing", "Translating a Hugo or Zola config file from TOML to JSON to use in a script", "Inspecting nested TOML structures in a familiar JSON format", "Generating a TOML config skeleton from an existing JSON settings file"],
      fr: ["Convertir un Cargo.toml ou pyproject.toml en JSON pour un traitement programmatique", "Traduire un fichier de config Hugo ou Zola de TOML en JSON pour l'utiliser dans un script", "Inspecter des structures TOML imbriquées dans un format JSON familier", "Générer un squelette de config TOML depuis un fichier de paramètres JSON existant"],
    },
  },
  "headers-checker": {
    desc: {
      en: "Fetch the security headers returned by any public URL and grade them from A (all critical headers present) to F (most missing). Evaluates Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy and Permissions-Policy — the headers most commonly checked in security audits. Each header shows its current value alongside a specific recommendation when it is missing or misconfigured.",
      fr: "Récupérez les headers de sécurité renvoyés par n'importe quelle URL publique et notez-les de A (tous les headers critiques présents) à F (la plupart absents). Évalue Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy et Permissions-Policy — les headers les plus souvent contrôlés lors d'audits de sécurité. Chaque header affiche sa valeur courante ainsi qu'une recommandation spécifique lorsqu'il est absent ou mal configuré.",
    },
    useCases: {
      en: ["Verifying that a newly deployed site has all required security headers before launch", "Comparing the security header configuration of your site against a competitor or benchmark", "Quickly checking whether a CSP or HSTS header was correctly deployed after a configuration change", "Auditing a client's website security posture as part of a web security review"],
      fr: ["Vérifier qu'un site nouvellement déployé possède tous les headers de sécurité requis avant le lancement", "Comparer la configuration des headers de sécurité de votre site par rapport à un concurrent ou à une référence", "Vérifier rapidement si un header CSP ou HSTS a été correctement déployé après un changement de configuration", "Auditer la posture de sécurité du site d'un client dans le cadre d'une revue de sécurité web"],
    },
  },
};
