import type { Lang } from "./types";

/** Section de fond : un sous-titre et ses paragraphes. */
export interface ContentSection {
  h: Record<Lang, string>;
  p: Record<Lang, string[]>;
}

export interface ToolContent {
  desc: Record<Lang, string>;
  useCases: Record<Lang, string[]>;
  /**
   * Contenu de fond : fonctionnement réel, référence de format, pièges courants,
   * limites assumées. C'est la partie qui distingue une page outil d'une simple
   * fiche produit — et ce que Google attend d'une page qui affiche de la
   * publicité. Optionnel : les outils qui n'en ont pas encore gardent l'ancienne
   * structure.
   */
  deepDive?: ContentSection[];
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
      en: "Two independent modes, both running entirely in your browser: PDF → images renders each page of a PDF to a standalone PNG or JPEG file, with a choice of 1×, 2× or 3× scale for resolution; images → PDF does the reverse, assembling any number of JPG, PNG or other browser-decodable images into a single downloadable PDF, one image per page. Page rendering uses PDF.js (the same engine behind Firefox's built-in PDF viewer); PDF assembly uses pdf-lib. One honest limit: there's no document-editing conversion here — this tool produces page images and PDFs, never an editable Word or Excel file. For extracting text you can actually edit, you need a dedicated PDF-to-Word converter that performs OCR or text extraction, which this isn't.",
      fr: "Deux modes indépendants, tous deux exécutés entièrement dans votre navigateur : PDF → images restitue chaque page d'un PDF en fichier PNG ou JPEG autonome, avec un choix d'échelle 1×, 2× ou 3× pour la résolution ; images → PDF fait l'inverse, en assemblant n'importe quel nombre d'images JPG, PNG ou autres formats décodables par le navigateur en un seul PDF téléchargeable, une image par page. Le rendu des pages utilise PDF.js (le même moteur que la visionneuse PDF intégrée à Firefox) ; l'assemblage PDF utilise pdf-lib. Une limite honnête : il n'y a pas de conversion vers un document éditable ici — cet outil produit des images de page et des PDF, jamais un fichier Word ou Excel éditable. Pour extraire un texte réellement modifiable, il faut un convertisseur PDF vers Word dédié effectuant de l'OCR ou de l'extraction de texte, ce que cet outil n'est pas.",
    },
    useCases: {
      en: ["Extracting pages from a PDF as images for a slide deck or website", "Turning a folder of scanned photo pages into a single shareable PDF", "Creating high-resolution page previews of a PDF for print or archival", "Assembling multiple JPG or PNG images into one PDF document to send as a single file"],
      fr: ["Extraire des pages d'un PDF en images pour une présentation ou un site web", "Transformer un dossier de photos de pages scannées en un seul PDF partageable", "Créer des aperçus de page haute résolution d'un PDF pour l'impression ou l'archivage", "Assembler plusieurs images JPG ou PNG en un seul document PDF à envoyer en un seul fichier"],
    },
  },
  "audio-converter": {
    desc: {
      en: "Convert between MP3, AAC, OGG, WAV, FLAC and M4A entirely in your browser using FFmpeg compiled to WebAssembly, with a target bitrate from 64 kbps to 320 kbps for the lossy formats. No file size limits beyond your available RAM. The first conversion loads the FFmpeg engine (~20 MB) — subsequent conversions in the same session are near-instant.",
      fr: "Convertissez entre MP3, AAC, OGG, WAV, FLAC et M4A entièrement dans votre navigateur grâce à FFmpeg compilé en WebAssembly, avec un débit cible de 64 à 320 kbps pour les formats avec perte. Aucune limite de taille au-delà de votre RAM disponible. La première conversion charge le moteur FFmpeg (~20 Mo) — les suivantes dans la même session sont quasi instantanées.",
    },
    useCases: {
      en: ["Converting WAV recordings to MP3 for sharing or streaming", "Converting FLAC albums to AAC for Apple device compatibility", "Converting OGG audio from games or apps to a more portable format", "Preparing audio files for podcast upload platforms that require specific formats"],
      fr: ["Convertir des enregistrements WAV en MP3 pour le partage ou le streaming", "Convertir des albums FLAC en AAC pour la compatibilité avec les appareils Apple", "Convertir de l'audio OGG en format plus portable", "Préparer des fichiers audio pour des plateformes de podcast nécessitant un format spécifique"],
    },
    deepDive: [
      {
        h: { en: "Why the first conversion is slow and the rest are not", fr: "Pourquoi la première conversion est lente et les suivantes non" },
        p: {
          en: [
          "The conversion runs FFmpeg compiled to WebAssembly, which means the entire engine — around twenty megabytes — has to be downloaded and instantiated before the first file can be processed. Once it is in memory it stays there for the session, so subsequent conversions start immediately.",
          "The upside of that cost is that nothing is uploaded. Your file never leaves the machine, there is no queue, no size limit imposed by a server, and no copy sitting in someone else's storage afterwards. The ceiling is your available memory rather than an upload quota.",
          ],
          fr: [
          "La conversion fait tourner FFmpeg compilé en WebAssembly : le moteur entier — une vingtaine de mégaoctets — doit donc être téléchargé et instancié avant que le premier fichier puisse être traité. Une fois en mémoire, il y reste pour la session, et les conversions suivantes démarrent immédiatement.",
          "La contrepartie de ce coût, c'est qu'aucun envoi n'a lieu. Votre fichier ne quitte jamais la machine, il n'y a ni file d'attente, ni limite de taille imposée par un serveur, ni copie qui subsiste ensuite dans le stockage d'un tiers. Le plafond est votre mémoire disponible plutôt qu'un quota d'envoi.",
          ],
        },
      },
      {
        h: { en: "Every lossy re-encode costs quality", fr: "Chaque ré-encodage avec perte coûte de la qualité" },
        p: {
          en: [
          "MP3, AAC and OGG are lossy: they discard detail judged inaudible and cannot get it back. Converting from one to another decodes the first approximation and throws away more on top of it, so quality degrades even when you raise the bitrate — a 320 kbps file made from a 128 kbps source is a larger file, not a better one.",
          "WAV and FLAC are the exception. WAV stores the samples uncompressed and FLAC compresses them without loss, so converting between those two, or from either into a lossy format, loses nothing beyond what the target format inherently discards. Whenever you have the lossless original, convert from it rather than from an intermediate.",
          ],
          fr: [
          "Le MP3, l'AAC et l'OGG sont des formats avec perte : ils écartent des détails jugés inaudibles et ne peuvent pas les restituer. Convertir de l'un vers l'autre décode la première approximation puis en écarte davantage : la qualité se dégrade même en augmentant le débit — un fichier à 320 kbps issu d'une source à 128 kbps est un fichier plus lourd, pas meilleur.",
          "Le WAV et le FLAC font exception. Le WAV stocke les échantillons sans compression et le FLAC les compresse sans perte : convertir entre ces deux-là, ou de l'un vers un format avec perte, ne coûte rien au-delà de ce que le format cible écarte par nature. Chaque fois que vous disposez de l'original sans perte, partez de lui plutôt que d'un intermédiaire.",
          ],
        },
      },
      {
        h: { en: "Choosing a bitrate", fr: "Choisir un débit" },
        p: {
          en: [
          "For music, 192 kbps is where most listeners stop hearing a difference from the source on ordinary equipment, and 256 or 320 kbps buys headroom for archiving or for material you may re-encode later. Below 128 kbps, artefacts become audible on cymbals and applause first.",
          "Speech is far more forgiving: a podcast or a voice memo remains perfectly clear at 64 to 96 kbps, and the smaller file is worth more than the inaudible difference. The bitrate setting applies to the lossy formats only — WAV ignores it entirely, and FLAC determines its own size from the content.",
          ],
          fr: [
          "Pour de la musique, 192 kbps est le point où la plupart des auditeurs cessent d'entendre une différence avec la source sur un équipement ordinaire, et 256 ou 320 kbps offrent une marge pour l'archivage ou pour un matériau que vous pourriez ré-encoder plus tard. En dessous de 128 kbps, les artefacts s'entendent d'abord sur les cymbales et les applaudissements.",
          "La parole est bien plus tolérante : un podcast ou un mémo vocal reste parfaitement clair entre 64 et 96 kbps, et le fichier plus léger vaut mieux que la différence inaudible. Le réglage de débit ne concerne que les formats avec perte — le WAV l'ignore entièrement, et le FLAC détermine sa taille d'après le contenu.",
          ],
        },
      },
    ],
  },
  "video-converter": {
    desc: {
      en: "The Video Converter re-encodes video between MP4, WebM, MOV, AVI and MKV, and turns short clips into animated GIFs — powered by FFmpeg compiled to WebAssembly and running entirely in your browser. Output resolution can be scaled down to 1080p, 720p, 480p or 360p, or left at the source size. Processing stays on your device, with no file size cap beyond your available RAM.",
      fr: "Le convertisseur vidéo ré-encode des vidéos entre MP4, WebM, MOV, AVI et MKV, et transforme de courts clips en GIF animés — propulsé par FFmpeg compilé en WebAssembly et s'exécutant entièrement dans votre navigateur. La résolution de sortie peut être réduite à 1080p, 720p, 480p ou 360p, ou conservée telle quelle. Le traitement reste sur votre appareil, sans limite de taille au-delà de votre RAM disponible.",
    },
    useCases: {
      en: ["Converting MP4 to WebM for HTML5 <video> elements", "Creating GIFs from short video clips for documentation or social media", "Shrinking a screen recording to 720p before attaching it to a ticket", "Converting MOV files from iPhone to MP4 for broader compatibility"],
      fr: ["Convertir MP4 en WebM pour les éléments <video> HTML5", "Créer des GIF depuis de courts clips vidéo pour de la documentation ou les réseaux sociaux", "Réduire une capture d'écran vidéo en 720p avant de la joindre à un ticket", "Convertir des fichiers MOV depuis iPhone en MP4 pour une meilleure compatibilité"],
    },
    deepDive: [
      {
        h: { en: "Container and codec are not the same thing", fr: "Le conteneur et le codec ne sont pas la même chose" },
        p: {
          en: [
          "MP4, WebM, MOV, AVI and MKV are containers: envelopes holding a video stream, one or more audio streams and metadata. The codec is what actually compresses the picture inside. That distinction explains why a file plays on one device and not another even though the extension is familiar — the container opened, the codec was unsupported.",
          "It also explains why changing container is sometimes nearly free and sometimes expensive. Moving the same streams into a different envelope is quick; re-encoding the picture for a codec the target container supports is where the time goes.",
          ],
          fr: [
          "MP4, WebM, MOV, AVI et MKV sont des conteneurs : des enveloppes contenant un flux vidéo, un ou plusieurs flux audio et des métadonnées. Le codec, lui, est ce qui compresse effectivement l'image à l'intérieur. Cette distinction explique qu'un fichier se lise sur un appareil et pas sur un autre malgré une extension familière — le conteneur s'est ouvert, le codec n'était pas supporté.",
          "Elle explique aussi qu'un changement de conteneur soit tantôt quasi gratuit, tantôt coûteux. Déplacer les mêmes flux dans une autre enveloppe est rapide ; ré-encoder l'image pour un codec que le conteneur cible accepte est ce qui prend du temps.",
          ],
        },
      },
      {
        h: { en: "GIF is a terrible video format, and sometimes the right one", fr: "Le GIF est un mauvais format vidéo, et parfois le bon" },
        p: {
          en: [
          "A GIF has no audio, is limited to 256 colours per frame, and compresses far worse than any video codec — a three-second clip that weighs 200 kB as MP4 routinely exceeds several megabytes as GIF. On gradients and film footage the colour limit shows as visible banding.",
          "It survives because it plays everywhere without a player, loops on its own, and can be pasted into contexts that reject video outright: issue trackers, chat clients, email. For a short interface demonstration those properties usually outweigh the file size. For anything longer than a few seconds, a muted looping video is the better answer.",
          ],
          fr: [
          "Un GIF n'a pas de son, se limite à 256 couleurs par image, et compresse bien plus mal que n'importe quel codec vidéo — un clip de trois secondes pesant 200 ko en MP4 dépasse couramment plusieurs mégaoctets en GIF. Sur des dégradés ou des prises de vue réelles, la limite de couleurs se voit sous forme de bandes.",
          "Il survit parce qu'il se lit partout sans lecteur, boucle tout seul, et se colle dans des contextes qui refusent la vidéo : gestionnaires de tickets, messageries, e-mails. Pour une courte démonstration d'interface, ces propriétés l'emportent généralement sur le poids. Au-delà de quelques secondes, une vidéo muette en boucle reste la meilleure réponse.",
          ],
        },
      },
      {
        h: { en: "What running in the browser costs", fr: "Ce que coûte l'exécution dans le navigateur" },
        p: {
          en: [
          "Video encoding is the heaviest thing this site does. FFmpeg runs here as WebAssembly on the CPU, without the hardware acceleration a desktop application would use, so expect a long clip to take minutes rather than seconds, and expect a laptop fan to notice.",
          "Memory is the real limit: the file is held in RAM rather than streamed from disk, so a large source can exhaust the tab on a modest machine. Reducing the output resolution before converting helps on both counts, and a file of more than a few hundred megabytes is better handled by a desktop tool.",
          ],
          fr: [
          "L'encodage vidéo est l'opération la plus lourde de ce site. FFmpeg s'exécute ici en WebAssembly sur le processeur, sans l'accélération matérielle qu'utiliserait une application de bureau : attendez-vous à des minutes plutôt qu'à des secondes sur un long clip, et à ce que le ventilateur d'un portable s'en aperçoive.",
          "La mémoire est la vraie limite : le fichier est gardé en RAM plutôt que lu en flux depuis le disque, si bien qu'une source volumineuse peut épuiser l'onglet sur une machine modeste. Réduire la résolution de sortie avant de convertir aide sur les deux plans, et un fichier de plusieurs centaines de mégaoctets se traite mieux avec un outil de bureau.",
          ],
        },
      },
    ],
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
      en: "Encode text or binary files to Base64, or decode any Base64 string back to its original form. It handles standard Base64 — the alphabet ending in + and / — which is what data URIs, HTTP Basic auth headers and most API payloads use. Text in, text out: paste a string to encode it, or paste a Base64 string to read what it contains.",
      fr: "Encodez du texte ou des fichiers binaires en Base64, ou décodez n'importe quelle chaîne Base64 vers sa forme d'origine. Il gère le Base64 standard — l'alphabet se terminant par + et / — celui qu'utilisent les data URI, les en-têtes d'authentification HTTP Basic et la plupart des charges utiles d'API. Du texte en entrée, du texte en sortie : collez une chaîne pour l'encoder, ou une chaîne Base64 pour lire ce qu'elle contient.",
    },
    useCases: {
      en: ["Decoding a JWT token payload to inspect its claims and expiry", "Embedding a small image as a data URI in HTML, CSS or JSON", "Encoding binary file attachments for email or REST API transmission", "Debugging Base64-encoded values in API responses or config files"],
      fr: ["Décoder un payload JWT pour inspecter ses claims et sa date d'expiration", "Intégrer une petite image en data URI dans du HTML, CSS ou JSON", "Encoder des pièces jointes binaires pour une transmission par e-mail ou API REST", "Déboguer des valeurs Base64 dans des réponses d'API ou des fichiers de config"],
    },
    deepDive: [
      {
        h: { en: "Three bytes in, four characters out", fr: "Trois octets en entrée, quatre caractères en sortie" },
        p: {
          en: [
          "Base64 rewrites arbitrary bytes using only 64 printable characters, so binary data can travel through channels that expect text. It reads the input three bytes at a time — 24 bits — and re-splits those bits into four groups of six, each group naming one character in the alphabet A–Z, a–z, 0–9, plus and slash.",
          "Because four characters carry three bytes, the output is always about 33% larger than the input. When the length is not a multiple of three, the last group is padded with one or two equals signs, which is why so many Base64 strings end that way.",
          ],
          fr: [
          "Le Base64 réécrit des octets quelconques avec seulement 64 caractères imprimables, pour que des données binaires puissent traverser des canaux qui attendent du texte. Il lit l'entrée par groupes de trois octets — 24 bits — et redécoupe ces bits en quatre groupes de six, chaque groupe désignant un caractère de l'alphabet A–Z, a–z, 0–9, plus et barre oblique.",
          "Puisque quatre caractères transportent trois octets, la sortie est toujours environ 33 % plus volumineuse que l'entrée. Quand la longueur n'est pas un multiple de trois, le dernier groupe est complété par un ou deux signes égal — d'où la terminaison si fréquente des chaînes Base64.",
          ],
        },
      },
      {
        h: { en: "Encoding is not encryption", fr: "Encoder n'est pas chiffrer" },
        p: {
          en: [
          "Base64 hides nothing. It is a reversible transformation with no key, and anyone can decode it in a second — including with this page. Treating it as a security measure is a recurring and costly mistake: a password or an API key placed in a Base64 string is exactly as exposed as if it were written in plain text.",
          "Its legitimate purpose is transport. Embedding a small image in a data URI, carrying an attachment through an email protocol designed for text, or fitting a binary payload into a JSON field are all good reasons. Protecting a secret is not one of them.",
          ],
          fr: [
          "Le Base64 ne cache rien. C'est une transformation réversible sans clé, que n'importe qui peut défaire en une seconde — y compris avec cette page. Le prendre pour une mesure de sécurité est une erreur récurrente et coûteuse : un mot de passe ou une clé d'API placés dans une chaîne Base64 sont exactement aussi exposés que s'ils étaient écrits en clair.",
          "Sa vraie raison d'être est le transport. Intégrer une petite image dans un data URI, faire passer une pièce jointe par un protocole de messagerie conçu pour du texte, ou loger une charge binaire dans un champ JSON sont de bons motifs. Protéger un secret n'en est pas un.",
          ],
        },
      },
      {
        h: { en: "The URL-safe variant, and why decoding sometimes fails", fr: "La variante URL-safe, et pourquoi le décodage échoue parfois" },
        p: {
          en: [
          "Standard Base64 uses plus and slash, both of which have a meaning inside a URL. A separate variant replaces them with minus and underscore, and usually drops the padding. JSON Web Tokens use that variant, which is why the three segments of a JWT are not standard Base64.",
          "This tool reads and writes the standard alphabet only. If decoding a token or a URL fragment fails here, that is normally the reason: swap minus back to plus and underscore back to slash first, and the string will decode.",
          ],
          fr: [
          "Le Base64 standard utilise le plus et la barre oblique, deux caractères qui ont un sens dans une URL. Une variante distincte les remplace par le moins et le tiret bas, et supprime généralement le remplissage. Les JSON Web Tokens emploient cette variante — c'est pourquoi les trois segments d'un JWT ne sont pas du Base64 standard.",
          "Cet outil lit et écrit uniquement l'alphabet standard. Si le décodage d'un token ou d'un fragment d'URL échoue ici, c'est normalement la raison : remplacez d'abord les moins par des plus et les tirets bas par des barres obliques, et la chaîne se décodera.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "Which flavour of Markdown this is", fr: "De quelle variante de Markdown il s'agit" },
        p: {
          en: [
          "Conversion runs through marked, which implements CommonMark plus the GitHub extensions: tables, task lists, strikethrough and automatic links. That combination is what most people mean by Markdown today, and it matches what GitHub, GitLab and most documentation generators render.",
          "It is worth knowing that the original 2004 Markdown had no specification, which is why renderers disagreed for a decade on edge cases like nested lists and emphasis inside words. CommonMark exists to settle exactly those, so a document that renders here renders the same way in any CommonMark-compliant tool.",
          ],
          fr: [
          "La conversion passe par marked, qui implémente CommonMark plus les extensions GitHub : tableaux, listes de tâches, texte barré et liens automatiques. Cette combinaison correspond à ce que la plupart des gens appellent aujourd'hui Markdown, et à ce que rendent GitHub, GitLab et la plupart des générateurs de documentation.",
          "Il est utile de savoir que le Markdown d'origine, en 2004, n'avait aucune spécification : c'est pourquoi les moteurs de rendu ont divergé pendant une décennie sur des cas limites comme les listes imbriquées ou l'emphase à l'intérieur d'un mot. CommonMark existe précisément pour trancher ceux-là, si bien qu'un document rendu ici se rendra à l'identique dans tout outil conforme.",
          ],
        },
      },
      {
        h: { en: "Raw HTML passes straight through", fr: "Le HTML brut passe tel quel" },
        p: {
          en: [
          "Markdown deliberately allows HTML inline, and it is not filtered on the way out. That is what lets you drop a break tag inside a table cell or wrap a section in a div that Markdown syntax cannot express — but it also means the output is only as safe as the input.",
          "So never render Markdown written by someone else without sanitizing the resulting HTML first. Converting your own README carries no risk; converting a user-submitted comment and injecting the result into a page is a straightforward way to ship a cross-site scripting hole.",
          ],
          fr: [
          "Markdown autorise délibérément le HTML en ligne, et celui-ci n'est pas filtré en sortie. C'est ce qui permet de glisser une balise de saut dans une cellule de tableau ou d'entourer une section d'un div que la syntaxe Markdown ne sait pas exprimer — mais cela signifie aussi que la sortie n'est sûre que dans la mesure où l'entrée l'est.",
          "N'affichez donc jamais du Markdown écrit par un tiers sans assainir au préalable le HTML produit. Convertir votre propre README ne présente aucun risque ; convertir un commentaire soumis par un utilisateur et injecter le résultat dans une page est un moyen direct de livrer une faille de cross-site scripting.",
          ],
        },
      },
      {
        h: { en: "The line-break rule that surprises everyone", fr: "La règle de saut de ligne qui surprend tout le monde" },
        p: {
          en: [
          "A single newline inside a paragraph does not produce a line break in the output. Markdown joins those lines into one paragraph, which is deliberate — it lets you wrap your source at a comfortable width without affecting the rendering. A blank line starts a new paragraph.",
          "To force a break without starting a paragraph, end the line with two spaces, or use a backslash. The two-space convention is invisible in most editors and gets stripped by trailing-whitespace tooling, which is why so many line breaks disappear between writing and publishing.",
          ],
          fr: [
          "Un simple retour à la ligne dans un paragraphe ne produit pas de saut de ligne en sortie. Markdown fusionne ces lignes en un seul paragraphe, et c'est délibéré : cela permet de replier son source à une largeur confortable sans influer sur le rendu. Une ligne vide, elle, démarre un nouveau paragraphe.",
          "Pour forcer un saut sans ouvrir de paragraphe, terminez la ligne par deux espaces, ou utilisez un antislash. La convention des deux espaces est invisible dans la plupart des éditeurs et se fait supprimer par les outils de nettoyage d'espaces en fin de ligne — d'où tant de sauts de ligne qui disparaissent entre l'écriture et la publication.",
          ],
        },
      },
    ],
  },
  "hash-generator": {
    desc: {
      en: "Compute MD5, SHA-1, SHA-256 and SHA-512 fingerprints for any text or file — instantly, using the Web Crypto API in your browser. Use it to verify file integrity after a download, compare files without opening them, or generate content hashes for caching strategies.",
      fr: "Calculez les empreintes MD5, SHA-1, SHA-256 et SHA-512 pour n'importe quel texte ou fichier — instantanément, via la Web Crypto API dans votre navigateur. Vérifiez l'intégrité d'un fichier téléchargé, comparez des fichiers sans les ouvrir, ou générez des hashes de contenu pour la mise en cache.",
    },
    useCases: {
      en: ["Verifying a downloaded file against its published SHA-256 checksum", "Generating a content hash for cache-busting asset URLs", "Drop two versions of a file and compare their hashes — if they match, the files are byte-for-byte identical", "Computing MD5 checksums for legacy systems or upload verification"],
      fr: ["Vérifier un fichier téléchargé face à son checksum SHA-256 publié", "Générer un hash de contenu pour les URL d'assets avec cache-busting", "Déposez deux versions d'un fichier et comparez leurs hashes — s'ils correspondent, les fichiers sont identiques octet par octet", "Calculer des checksums MD5 pour des systèmes legacy ou la vérification d'upload"],
    },
    deepDive: [
      {
        h: { en: "What a hash actually proves", fr: "Ce qu'une empreinte prouve réellement" },
        p: {
          en: [
          "A hash is a one-way fingerprint: the same input always yields the same digest, and changing a single bit changes that digest completely. It proves two pieces of data are identical, which is why checksums sit next to published downloads.",
          "What it does not prove is where the data came from. An attacker able to replace a file can usually replace the checksum published beside it. A hash detects accidental corruption reliably; against deliberate substitution you need a signature, not a digest.",
          ],
          fr: [
          "Une empreinte est une signature à sens unique : la même entrée produit toujours le même condensat, et changer un seul bit le change entièrement. Elle prouve que deux données sont identiques — d'où les checksums publiés à côté des téléchargements.",
          "Ce qu'elle ne prouve pas, c'est l'origine des données. Un attaquant capable de remplacer un fichier peut généralement remplacer aussi le checksum publié à côté. Une empreinte détecte de façon fiable une corruption accidentelle ; contre une substitution délibérée, il faut une signature, pas un condensat.",
          ],
        },
      },
      {
        h: { en: "Choosing between the four algorithms", fr: "Choisir parmi les quatre algorithmes" },
        p: {
          en: [
          "MD5 and SHA-1 are both cryptographically broken: constructing two different files that share a digest is practical, not theoretical. They remain available because you still meet them — verifying a legacy vendor checksum, matching an existing database column, deduplicating files where nobody is trying to fool you.",
          "Wherever an adversary might be involved, use SHA-256, or SHA-512 for a wider margin. None of the four is suitable for storing passwords: they are built to be fast, which is exactly the wrong property there. Password storage needs a deliberately slow function such as bcrypt, scrypt or Argon2.",
          ],
          fr: [
          "MD5 et SHA-1 sont tous deux cryptographiquement cassés : construire deux fichiers différents partageant un même condensat est réaliste, pas théorique. Ils restent proposés parce qu'on les rencontre encore — vérifier le checksum d'un éditeur ancien, correspondre à une colonne existante en base, dédupliquer des fichiers là où personne ne cherche à vous tromper.",
          "Dès qu'un adversaire peut être impliqué, utilisez SHA-256, ou SHA-512 pour une marge plus large. Aucun des quatre ne convient au stockage de mots de passe : ils sont conçus pour être rapides, ce qui est précisément la mauvaise propriété dans ce cas. Un mot de passe demande une fonction volontairement lente comme bcrypt, scrypt ou Argon2.",
          ],
        },
      },
      {
        h: { en: "Why your digest does not match theirs", fr: "Pourquoi votre empreinte ne correspond pas à la leur" },
        p: {
          en: [
          "When a file hashes correctly but a piece of text does not, the cause is almost always invisible. Text mode hashes the exact bytes of what you paste, encoded as UTF-8 — so a trailing newline, a Windows CRLF line ending instead of a bare LF, or a byte-order mark at the start each produce a completely different digest.",
          "The other frequent culprit is a paste that silently altered characters: an editor turning straight quotes into typographic ones, or a non-breaking space swapped for a regular one. When a text comparison disagrees, hash the file itself rather than its contents pasted into a field.",
          ],
          fr: [
          "Quand un fichier donne la bonne empreinte mais qu'un texte non, la cause est presque toujours invisible. Le mode texte calcule l'empreinte des octets exacts de ce que vous collez, encodés en UTF-8 — un saut de ligne final, une fin de ligne CRLF Windows au lieu d'un simple LF, ou une marque d'ordre des octets en tête suffisent chacun à produire un condensat entièrement différent.",
          "L'autre coupable fréquent est un collage qui a modifié des caractères en silence : un éditeur transformant les guillemets droits en guillemets typographiques, ou une espace insécable échangée contre une espace ordinaire. Quand une comparaison de texte échoue, calculez l'empreinte du fichier lui-même plutôt que de son contenu collé dans un champ.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "Why the global flag is always on", fr: "Pourquoi le flag global est toujours actif" },
        p: {
          en: [
          "A regular expression carrying the g flag keeps an internal position between calls, so testing the same pattern twice can return different answers. That statefulness is a classic source of bugs in application code, but a tester needs it: without g you would only ever see the first match.",
          "The flag is therefore forced on here, and the three you can toggle are the ones that genuinely change matching. Remember the difference when you copy a pattern into your own code — a global regex reused across iterations must have its lastIndex reset, or use matchAll, which handles it for you.",
          ],
          fr: [
          "Une expression régulière portant le flag g conserve une position interne entre les appels : tester deux fois le même motif peut donc donner deux réponses différentes. Cet état est une source classique de bugs dans du code applicatif, mais un testeur en a besoin — sans g, vous ne verriez jamais que la première correspondance.",
          "Le flag est donc forcé ici, et les trois que vous pouvez activer sont ceux qui modifient réellement la correspondance. Gardez la différence en tête au moment de recopier un motif dans votre code : une regex globale réutilisée dans une boucle doit voir son lastIndex réinitialisé, ou passer par matchAll, qui s'en charge.",
          ],
        },
      },
      {
        h: { en: "What the three toggles actually change", fr: "Ce que changent réellement les trois interrupteurs" },
        p: {
          en: [
          "The i flag makes matching case-insensitive. The m flag changes the meaning of the anchors: with it, the start and end markers match at every line break rather than only at the boundaries of the whole string — which is what you want when testing against a multi-line block.",
          "The s flag, often called dotAll, lets the dot match a newline. Without it the dot stops at the end of a line, which is why a pattern meant to capture a block spanning several lines silently returns nothing. Those two are the usual explanation for a regex that works in a one-line test and fails on real input.",
          ],
          fr: [
          "Le flag i rend la correspondance insensible à la casse. Le flag m change le sens des ancres : avec lui, les marqueurs de début et de fin correspondent à chaque saut de ligne plutôt qu'aux seules bornes de la chaîne entière — ce qu'on veut quand on teste sur un bloc multiligne.",
          "Le flag s, souvent appelé dotAll, autorise le point à correspondre à un saut de ligne. Sans lui, le point s'arrête en fin de ligne : c'est pourquoi un motif censé capturer un bloc réparti sur plusieurs lignes ne renvoie silencieusement rien. Ces deux-là expliquent la plupart des regex qui fonctionnent sur un test d'une ligne et échouent sur des données réelles.",
          ],
        },
      },
      {
        h: { en: "Catastrophic backtracking, and how to spot it", fr: "Le retour arrière catastrophique, et comment le repérer" },
        p: {
          en: [
          "Some patterns take exponential time on inputs that do not match. Nested quantifiers are the usual shape — a group that can repeat, itself inside something that repeats. On a short test string the cost is invisible; on a longer one the same pattern can hang the page outright.",
          "If the highlighting stalls after you paste a larger sample, that is what you are seeing, and the pattern is not safe to deploy against user input. Rewriting the inner quantifier to be more specific, or anchoring the expression, usually removes the ambiguity that causes the engine to explore so many paths.",
          ],
          fr: [
          "Certains motifs demandent un temps exponentiel sur des entrées qui ne correspondent pas. Les quantificateurs imbriqués en sont la forme habituelle — un groupe répétable, lui-même à l'intérieur de quelque chose de répétable. Sur une courte chaîne de test, le coût est invisible ; sur une plus longue, le même motif peut figer la page.",
          "Si la coloration se bloque après avoir collé un échantillon plus volumineux, c'est de cela qu'il s'agit, et le motif n'est pas déployable sur des saisies utilisateur. Rendre le quantificateur interne plus spécifique, ou ancrer l'expression, lève généralement l'ambiguïté qui pousse le moteur à explorer autant de chemins.",
          ],
        },
      },
    ],
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
      en: "Generate version 4 UUIDs — the fully random variant, and the one you want in almost every situation. Produce 1, 5, 10 or 25 at a time, copy them one by one or the whole batch in a single click. Generation uses crypto.randomUUID() from the Web Crypto API, so the values come from your operating system's cryptographic random source and never touch a network.",
      fr: "Générez des UUID version 4 — la variante entièrement aléatoire, celle qui convient dans la quasi-totalité des cas. Produisez-en 1, 5, 10 ou 25 d'un coup, copiez-les un par un ou le lot entier en un clic. La génération utilise crypto.randomUUID() de la Web Crypto API : les valeurs proviennent de la source aléatoire cryptographique de votre système d'exploitation et ne transitent par aucun réseau.",
    },
    useCases: {
      en: ["Generating primary keys for database inserts in development or testing", "Seeding a local database with a batch of 25 UUIDs in one copy — no script needed", "Producing throwaway identifiers for fixtures, mock payloads and API test data", "Producing correlation IDs for distributed tracing across microservices"],
      fr: ["Générer des clés primaires pour des insertions en base de données en développement ou test", "Remplir une base de données locale avec un lot de 25 UUID en un seul copier-coller — sans script", "Générer des UUID v7 pour des enregistrements triables dans le temps en systèmes distribués", "Produire des correlation ID pour le tracing distribué entre microservices"],
    },
    deepDive: [
      {
        h: { en: "What version 4 actually contains", fr: "Ce que contient réellement la version 4" },
        p: {
          en: [
          "A UUID is 128 bits shown as 32 hexadecimal digits in five dash-separated groups. In version 4, four of those bits identify the version and two more mark the variant, which leaves 122 bits drawn at random. That is what the fixed 4 at the start of the third group tells you.",
          "The randomness here comes from crypto.randomUUID(), which draws on the operating system's cryptographic generator rather than Math.random(). The distinction matters: Math.random() is fast but predictable enough that sequences can be reconstructed, which would make identifiers guessable.",
          ],
          fr: [
          "Un UUID fait 128 bits, présentés en 32 chiffres hexadécimaux répartis en cinq groupes séparés par des tirets. En version 4, quatre de ces bits identifient la version et deux autres marquent la variante, ce qui laisse 122 bits tirés au hasard. C'est ce qu'indique le 4 fixe en tête du troisième groupe.",
          "L'aléa provient ici de crypto.randomUUID(), qui s'appuie sur le générateur cryptographique du système d'exploitation plutôt que sur Math.random(). La distinction compte : Math.random() est rapide mais suffisamment prévisible pour qu'on puisse reconstituer des séquences, ce qui rendrait les identifiants devinables.",
          ],
        },
      },
      {
        h: { en: "Collisions, in practice", fr: "Les collisions, en pratique" },
        p: {
          en: [
          "With 122 random bits, the number of possible values is around 5.3 undecillion. Generating a billion UUIDs per second for a century would still leave the probability of a single duplicate negligible — far below the odds of the storage silently corrupting a row.",
          "This holds only when the randomness is genuinely random. Documented collisions in the wild almost always trace back to a weak generator, or to virtual machines cloned from a snapshot that resumed with an identical entropy pool, rather than to the format running out of room.",
          ],
          fr: [
          "Avec 122 bits aléatoires, le nombre de valeurs possibles avoisine 5,3 undécillions. Générer un milliard d'UUID par seconde pendant un siècle laisserait encore la probabilité d'un seul doublon négligeable — très en dessous du risque que le stockage corrompe silencieusement une ligne.",
          "Cela ne vaut que si l'aléa est réellement aléatoire. Les collisions documentées en production remontent presque toujours à un générateur faible, ou à des machines virtuelles clonées depuis un instantané et reprises avec un pool d'entropie identique, plutôt qu'à un format à court de place.",
          ],
        },
      },
      {
        h: { en: "The cost of a random primary key", fr: "Le coût d'une clé primaire aléatoire" },
        p: {
          en: [
          "Version 4 has one real drawback as a database key: it is random, so consecutive inserts land at unrelated positions in the index. On a clustered index — the default for InnoDB and SQL Server — that fragments pages and slows down bulk insertion noticeably compared with a sequential integer.",
          "This is what versions 1 and 7 address by putting a timestamp in the high bits, making identifiers roughly sortable by creation time. If insertion throughput is your bottleneck, that is the trade-off to look at; for the vast majority of applications, version 4 is the right default.",
          ],
          fr: [
          "La version 4 a un vrai inconvénient comme clé de base de données : elle est aléatoire, donc des insertions consécutives atterrissent à des positions sans rapport dans l'index. Sur un index clusterisé — le défaut d'InnoDB et de SQL Server — cela fragmente les pages et ralentit sensiblement l'insertion en masse par rapport à un entier séquentiel.",
          "C'est ce que corrigent les versions 1 et 7 en plaçant un horodatage dans les bits de poids fort, rendant les identifiants à peu près triables par date de création. Si le débit d'insertion est votre goulot d'étranglement, c'est l'arbitrage à examiner ; pour l'immense majorité des applications, la version 4 reste le bon défaut.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "The five fields, in order", fr: "Les cinq champs, dans l'ordre" },
        p: {
          en: [
          "A cron expression is five space-separated fields: minute, hour, day of month, month, and day of week. An asterisk means every value, a comma lists several, a hyphen gives a range, and a slash sets a step — so */15 in the minute field means every fifteen minutes.",
          "Day of week counts from 0 for Sunday. This builder validates that exactly five fields are present and describes the result in plain language as you type, which is the fastest way to catch a field written in the wrong position.",
          ],
          fr: [
          "Une expression cron est faite de cinq champs séparés par des espaces : minute, heure, jour du mois, mois, jour de la semaine. Un astérisque signifie toutes les valeurs, une virgule en énumère plusieurs, un tiret donne un intervalle, et une barre oblique définit un pas — ainsi */15 dans le champ des minutes signifie toutes les quinze minutes.",
          "Le jour de la semaine se compte à partir de 0 pour dimanche. Ce générateur vérifie que cinq champs exactement sont présents et décrit le résultat en langage courant au fil de la saisie, ce qui reste le moyen le plus rapide de repérer un champ écrit à la mauvaise position.",
          ],
        },
      },
      {
        h: { en: "The day-of-month and day-of-week trap", fr: "Le piège du jour du mois et du jour de la semaine" },
        p: {
          en: [
          "These two fields do not combine the way the others do. When both are set to something other than an asterisk, most cron implementations run the job when either matches, not when both do — so a schedule meant for the first of the month when it falls on a Monday will instead run on every first and every Monday.",
          "The safe habit is to constrain one of the two and leave the other as an asterisk. If you genuinely need both conditions, the check belongs at the start of your script rather than in the expression.",
          ],
          fr: [
          "Ces deux champs ne se combinent pas comme les autres. Quand tous deux valent autre chose qu'un astérisque, la plupart des implémentations de cron exécutent la tâche dès que l'un correspond, et non quand les deux correspondent — une planification censée viser le premier du mois lorsqu'il tombe un lundi s'exécutera donc chaque premier du mois et chaque lundi.",
          "La bonne habitude est de contraindre l'un des deux et de laisser l'autre à l'astérisque. Si vous avez réellement besoin des deux conditions, le contrôle a sa place au début de votre script plutôt que dans l'expression.",
          ],
        },
      },
      {
        h: { en: "Time zones and missing hours", fr: "Fuseaux horaires et heures manquantes" },
        p: {
          en: [
          "A cron expression carries no time zone. It is interpreted in whatever zone the running system uses, which is why the same line fires at different moments on a laptop set to local time and on a server left in UTC. Setting the zone explicitly in the scheduler, when it allows it, removes the ambiguity.",
          "Daylight saving makes this concrete twice a year: a job scheduled at 2:30 in a zone that skips that hour in spring simply does not run, and runs twice in autumn when the hour repeats. Scheduling outside the transition window, or working in UTC, avoids both.",
          ],
          fr: [
          "Une expression cron ne porte aucun fuseau horaire. Elle est interprétée dans celui du système qui l'exécute — d'où le fait qu'une même ligne se déclenche à des moments différents sur un portable réglé en heure locale et sur un serveur laissé en UTC. Définir le fuseau explicitement dans le planificateur, quand il le permet, lève l'ambiguïté.",
          "L'heure d'été rend cela concret deux fois par an : une tâche planifiée à 2h30 dans un fuseau qui saute cette heure au printemps ne s'exécute tout simplement pas, et s'exécute deux fois à l'automne quand l'heure se répète. Planifier hors de la fenêtre de transition, ou travailler en UTC, évite les deux.",
          ],
        },
      },
    ],
  },
  "case-converter": {
    desc: {
      en: "Switch text between seven case formats in a single click: UPPER CASE, lower case, Title Case, camelCase, PascalCase, snake_case and kebab-case. Handles Unicode and accented characters correctly, making it reliable for both code identifiers and natural-language content in any language.",
      fr: "Passez d'un format de casse à l'autre en un seul clic : MAJUSCULE, minuscule, Titre, camelCase, PascalCase, snake_case et kebab-case. Gère correctement l'Unicode et les caractères accentués, fiable pour les identifiants de code comme pour le contenu en langage naturel.",
    },
    useCases: {
      en: ["Converting a list of column headers to snake_case for database field names", "Reformatting API response keys from camelCase to kebab-case for CSS custom properties", "Converting titles to Title Case for blog headlines or document headings", "Batch-converting variable names when migrating between coding conventions"],
      fr: ["Convertir une liste d'en-têtes de colonnes en snake_case pour des noms de champs de base de données", "Reformater des clés de réponse API de camelCase en kebab-case pour des propriétés CSS", "Convertir des titres en Titre pour des articles de blog ou des en-têtes de documents", "Convertir en lot des noms de variables lors d'une migration entre conventions de codage"],
    },
    deepDive: [
      {
        h: { en: "How the text is cut into words", fr: "Comment le texte est découpé en mots" },
        p: {
          en: [
          "Every format except UPPER CASE and lower case needs to know where the words are. The splitting works on three signals: a lowercase letter immediately followed by an uppercase one, any run of underscores or hyphens, and whitespace. That is what lets the same input arrive as camelCase, snake_case or a plain sentence and still convert correctly.",
          "UPPER CASE and lower case skip that step entirely and transform the string as it stands, which is why they are the only two formats that preserve your punctuation and spacing untouched.",
          ],
          fr: [
          "Tous les formats sauf MAJUSCULE et minuscule ont besoin de savoir où sont les mots. Le découpage s'appuie sur trois signaux : une minuscule immédiatement suivie d'une majuscule, toute suite de tirets bas ou de traits d'union, et les espaces. C'est ce qui permet à une même entrée d'arriver en camelCase, en snake_case ou en phrase ordinaire et d'être malgré tout convertie correctement.",
          "MAJUSCULE et minuscule sautent cette étape et transforment la chaîne telle quelle — d'où le fait que ce soient les deux seuls formats à préserver intacts votre ponctuation et vos espaces.",
          ],
        },
      },
      {
        h: { en: "Acronyms are the known weak spot", fr: "Les acronymes sont le point faible connu" },
        p: {
          en: [
          "Consecutive capitals carry no boundary signal, so an acronym is read as a single word. HTTPResponse splits after the P — where a lowercase letter meets an uppercase one — giving httpResponse in camelCase, which is usually what you want. But APIKey behaves the same way and yields apikey rather than apiKey.",
          "Once words are identified, each is lowercased before being recapitalised, so an acronym never survives in capitals: converting an identifier containing URL to Title Case produces Url. When acronym casing matters, check the result rather than assuming it.",
          ],
          fr: [
          "Des majuscules consécutives ne portent aucun signal de frontière : un acronyme est donc lu comme un seul mot. HTTPResponse se découpe après le P — là où une minuscule rencontre une majuscule — ce qui donne httpResponse en camelCase, généralement le résultat voulu. Mais APIKey se comporte pareil et produit apikey plutôt que apiKey.",
          "Une fois les mots identifiés, chacun est mis en minuscules avant d'être recapitalisé : un acronyme ne survit donc jamais en capitales, et convertir un identifiant contenant URL en Titre produit Url. Quand la casse des acronymes compte, vérifiez le résultat plutôt que de le supposer.",
          ],
        },
      },
      {
        h: { en: "Which conversions are reversible", fr: "Quelles conversions sont réversibles" },
        p: {
          en: [
          "Going from snake_case to camelCase and back returns the original, because both formats mark their boundaries unambiguously. The same is true between kebab-case, snake_case and PascalCase: the separators differ, the word boundaries survive.",
          "Anything passing through Title Case or a plain sentence loses information, since spaces cannot be told apart from separators that were originally underscores. Accented letters are handled correctly throughout — lowercase and uppercase mappings apply to them as they do to plain ASCII — but a script without letter case, such as Chinese or Arabic, comes back unchanged.",
          ],
          fr: [
          "Passer de snake_case à camelCase puis revenir restitue l'original, parce que les deux formats marquent leurs frontières sans ambiguïté. Il en va de même entre kebab-case, snake_case et PascalCase : les séparateurs diffèrent, les frontières de mots survivent.",
          "Tout ce qui transite par le format Titre ou par une phrase ordinaire perd de l'information, puisqu'on ne peut plus distinguer les espaces des séparateurs qui étaient à l'origine des tirets bas. Les lettres accentuées sont correctement traitées de bout en bout — les correspondances minuscule/majuscule s'y appliquent comme à l'ASCII — mais une écriture sans casse, comme le chinois ou l'arabe, ressort inchangée.",
          ],
        },
      },
    ],
  },
  "word-counter": {
    desc: {
      en: "Paste or type any text to get a real-time breakdown of words, characters, sentences and paragraphs — plus an estimated reading time at 238 words per minute. Useful for blog posts, press releases, academic submissions and any content with length requirements.",
      fr: "Collez ou tapez n'importe quel texte pour obtenir une analyse en temps réel des mots, caractères, phrases et paragraphes — avec une estimation du temps de lecture à 238 mots par minute. Utile pour les articles de blog, communiqués de presse, soumissions académiques et tout contenu avec des contraintes de longueur.",
    },
    useCases: {
      en: ["Checking article length before submitting to a publication with strict word limits", "Estimating how long a speech or presentation script will take to deliver", "Counting characters for social media posts (Twitter, LinkedIn, meta descriptions)", "Verifying minimum word count targets for SEO content strategies"],
      fr: ["Vérifier la longueur d'un article avant soumission à une publication avec limite de mots", "Estimer la durée d'un discours ou d'un script de présentation", "Compter les caractères pour des publications sur les réseaux sociaux ou des meta descriptions", "Vérifier les cibles de nombre de mots minimum pour des stratégies de contenu SEO"],
    },
    deepDive: [
      {
        h: { en: "What counts as a word", fr: "Ce qui compte comme un mot" },
        p: {
          en: [
          "Splitting on spaces is the obvious approach and the wrong one for anything but English prose. It miscounts hyphenated compounds, breaks on apostrophes inconsistently, and fails completely for Chinese, Japanese and Thai, which do not separate words with spaces at all.",
          "This counter uses the browser's own Unicode segmentation instead, the same machinery that decides what a double-click selects. It applies the locale-aware word boundary rules of the Unicode standard, so a Japanese sentence yields a meaningful count rather than one.",
          ],
          fr: [
          "Découper sur les espaces est l'approche évidente, et la mauvaise pour autre chose que de la prose anglaise. Elle compte mal les composés à trait d'union, se comporte de façon incohérente sur les apostrophes, et échoue complètement pour le chinois, le japonais et le thaï, qui ne séparent pas les mots par des espaces.",
          "Ce compteur s'appuie plutôt sur la segmentation Unicode du navigateur, la même mécanique qui décide de ce qu'un double-clic sélectionne. Elle applique les règles de frontière de mot du standard Unicode selon la locale : une phrase japonaise donne donc un compte pertinent, et non un seul mot.",
          ],
        },
      },
      {
        h: { en: "Where the reading time comes from", fr: "D'où vient le temps de lecture" },
        p: {
          en: [
          "The estimate uses 238 words per minute, a figure from a 2019 meta-analysis by Brysbaert covering more than a hundred studies of silent reading in adults. Round numbers like 200 or 250 circulate widely but are conventions rather than measurements.",
          "Treat it as an order of magnitude. Reading speed varies enormously with the material: dense technical documentation is read far more slowly than a news article, reading aloud runs closer to 150 words per minute, and a text skimmed for a single fact is not read at all in the sense the figure assumes.",
          ],
          fr: [
          "L'estimation retient 238 mots par minute, un chiffre issu d'une méta-analyse de Brysbaert publiée en 2019 et couvrant plus d'une centaine d'études sur la lecture silencieuse chez l'adulte. Les nombres ronds comme 200 ou 250 circulent largement mais relèvent de la convention plutôt que de la mesure.",
          "Prenez-le comme un ordre de grandeur. La vitesse de lecture varie énormément selon le matériau : une documentation technique dense se lit bien plus lentement qu'un article de presse, la lecture à voix haute tourne plutôt autour de 150 mots par minute, et un texte parcouru pour y trouver un fait précis n'est pas lu au sens que suppose le chiffre.",
          ],
        },
      },
      {
        h: { en: "Sentences and paragraphs are approximations", fr: "Phrases et paragraphes sont des approximations" },
        p: {
          en: [
          "Sentences are counted by looking for runs of full stops, exclamation marks and question marks. That heuristic is right most of the time and wrong in predictable places: abbreviations, decimal numbers, ellipses and domain names each add a sentence that is not there.",
          "Character counts are exact by comparison, and both variants are shown because platforms disagree on which they enforce. If you are checking a meta description or a social post against a limit, use the character count rather than the word count, since that is what the limit is actually expressed in.",
          ],
          fr: [
          "Les phrases sont comptées en repérant les suites de points, points d'exclamation et points d'interrogation. Cette heuristique est juste la plupart du temps et fausse à des endroits prévisibles : abréviations, nombres décimaux, points de suspension et noms de domaine ajoutent chacun une phrase qui n'existe pas.",
          "Le compte de caractères est exact en comparaison, et les deux variantes sont affichées parce que les plateformes ne s'accordent pas sur celle qu'elles appliquent. Pour vérifier une meta description ou un post face à une limite, fiez-vous au compte de caractères plutôt qu'à celui des mots : c'est dans cette unité que la limite est réellement exprimée.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "Three modes for three different messes", fr: "Trois modes pour trois désordres différents" },
        p: {
          en: [
          "Join replaces every run of line breaks with a single space and collapses repeated spaces, giving one continuous block. Strip removes the breaks without putting anything in their place, which is what you want when the break falls inside a word — the usual result of a hyphenated line wrap in a PDF.",
          "Normalize is the one to reach for on real documents: it treats a blank line as a paragraph separator, unwraps the lines inside each paragraph, and keeps the paragraphs apart. You get readable prose instead of a single undifferentiated wall of text.",
          ],
          fr: [
          "Le mode espace remplace chaque suite de sauts de ligne par une seule espace et fusionne les espaces répétées, donnant un bloc continu. Le mode suppression retire les sauts sans rien mettre à la place, ce qu'on veut quand le saut tombe au milieu d'un mot — le résultat habituel d'une césure de fin de ligne dans un PDF.",
          "Le mode normalisation est celui à privilégier sur de vrais documents : il traite une ligne vide comme un séparateur de paragraphe, déplie les lignes à l'intérieur de chaque paragraphe, et conserve les paragraphes distincts. On obtient une prose lisible plutôt qu'un mur de texte indifférencié.",
          ],
        },
      },
      {
        h: { en: "Where the stray breaks come from", fr: "D'où viennent les sauts parasites" },
        p: {
          en: [
          "Text copied from a PDF arrives broken at every visual line because a PDF stores positioned glyphs, not paragraphs — the line ends are an artefact of the page layout, not of the writing. Email clients produce the same effect by hard-wrapping at 72 or 78 columns, a convention inherited from terminals.",
          "In both cases the breaks carry no meaning and removing them restores the original text. That is not true of code, verse, or anything where the line is significant, so those need the paragraph-preserving mode at most.",
          ],
          fr: [
          "Un texte copié depuis un PDF arrive coupé à chaque ligne visuelle, parce qu'un PDF stocke des glyphes positionnés et non des paragraphes — les fins de ligne sont un artefact de la mise en page, pas de l'écriture. Les clients de messagerie produisent le même effet en repliant durement à 72 ou 78 colonnes, une convention héritée des terminaux.",
          "Dans les deux cas les sauts ne portent aucun sens et les retirer restitue le texte d'origine. Ce n'est pas vrai du code, de la poésie, ni de tout ce où la ligne est signifiante : ceux-là demandent au mieux le mode qui préserve les paragraphes.",
          ],
        },
      },
      {
        h: { en: "What it does not repair", fr: "Ce qu'il ne répare pas" },
        p: {
          en: [
          "Only line breaks are touched. A word split by a hyphen at the end of a PDF line keeps its hyphen once the break is removed, so a manual pass is still needed for those. Tabs, non-breaking spaces and other invisible characters are left as they are.",
          "Carriage returns are handled alongside newlines, so text pasted from Windows behaves the same as text from macOS or Linux — a detail that otherwise leaves stray characters behind when only the newline is matched.",
          ],
          fr: [
          "Seuls les sauts de ligne sont touchés. Un mot coupé par un trait d'union en fin de ligne de PDF conserve son trait d'union une fois le saut retiré : une passe manuelle reste nécessaire pour ceux-là. Tabulations, espaces insécables et autres caractères invisibles sont laissés tels quels.",
          "Les retours chariot sont traités en même temps que les sauts de ligne, si bien qu'un texte collé depuis Windows se comporte comme un texte venu de macOS ou de Linux — un détail qui laisse sinon des caractères parasites quand on ne cherche que le saut de ligne.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "Code points are not characters", fr: "Les points de code ne sont pas des caractères" },
        p: {
          en: [
          "Reversing text looks trivial until Unicode is involved. Splitting a string the naive way cuts it into code points, and several code points often combine into what a reader sees as one character: a letter plus a combining accent, a family emoji joined by zero-width joiners, a regional-indicator pair forming a flag.",
          "Reverse by code point and those units come apart — the accent lands on the neighbouring letter, the family becomes three separate people, the flag turns into two unrelated letters. This tool segments by grapheme cluster instead, so what you see as one character moves as one character.",
          ],
          fr: [
          "Inverser du texte paraît trivial jusqu'à ce qu'Unicode s'en mêle. Découper une chaîne naïvement la coupe en points de code, et plusieurs points de code forment souvent ce qu'un lecteur perçoit comme un seul caractère : une lettre plus un accent combinant, un emoji famille assemblé par liaisons de largeur nulle, une paire d'indicateurs régionaux formant un drapeau.",
          "Inversez par point de code et ces unités se disloquent — l'accent atterrit sur la lettre voisine, la famille devient trois personnages distincts, le drapeau se transforme en deux lettres sans rapport. Cet outil segmente par groupe de graphèmes : ce que vous voyez comme un caractère se déplace comme un caractère.",
          ],
        },
      },
      {
        h: { en: "Right-to-left scripts will still look wrong", fr: "Les écritures de droite à gauche paraîtront tout de même fausses" },
        p: {
          en: [
          "Arabic and Hebrew are stored in logical order — the order in which the letters are read — and reordered for display by the browser's bidirectional algorithm. Reversing the stored string therefore produces something that renders unpredictably, because the display algorithm runs again over your reversed sequence.",
          "There is no correct way to reverse bidirectional text in the abstract: the answer depends on whether you mean the reading order or the visual order. If you need mirrored display for a design, use a CSS transform rather than reversing the underlying string.",
          ],
          fr: [
          "L'arabe et l'hébreu sont stockés en ordre logique — celui dans lequel les lettres se lisent — puis réordonnés à l'affichage par l'algorithme bidirectionnel du navigateur. Inverser la chaîne stockée produit donc un rendu imprévisible, puisque l'algorithme d'affichage repasse ensuite sur votre séquence inversée.",
          "Il n'existe pas de façon correcte d'inverser du texte bidirectionnel dans l'absolu : la réponse dépend de si vous parlez de l'ordre de lecture ou de l'ordre visuel. Si vous cherchez un affichage en miroir pour du design, utilisez une transformation CSS plutôt que d'inverser la chaîne sous-jacente.",
          ],
        },
      },
      {
        h: { en: "Three modes, three different operations", fr: "Trois modes, trois opérations différentes" },
        p: {
          en: [
          "Character mode reverses the whole text end to end, lines included, so the last line becomes the first. Word mode reverses the order of words within each line and leaves the lines where they are. Line mode reverses the order of the lines and leaves each line's contents intact.",
          "Word mode splits on single spaces, which keeps punctuation attached to its word: reversing a sentence moves the full stop with the word it follows rather than to the end. Applying any mode twice returns the original text exactly.",
          ],
          fr: [
          "Le mode caractère inverse l'ensemble du texte de bout en bout, sauts de ligne compris : la dernière ligne devient donc la première. Le mode mot inverse l'ordre des mots à l'intérieur de chaque ligne et laisse les lignes en place. Le mode ligne inverse l'ordre des lignes et laisse le contenu de chacune intact.",
          "Le mode mot découpe sur les espaces simples, ce qui garde la ponctuation attachée à son mot : inverser une phrase déplace le point avec le mot qu'il suit plutôt que de l'envoyer à la fin. Appliquer deux fois n'importe quel mode restitue exactement le texte d'origine.",
          ],
        },
      },
    ],
  },
  "url-encoder": {
    desc: {
      en: "Convert special characters to percent-encoded form for safe use in URLs, or decode them back to readable text. It applies component encoding: every reserved character is escaped, slashes included. That is what you want for a query-string value, a path segment or a form field — and precisely what you must not run a whole URL through, since it would escape the separators that give the URL its structure. Non-ASCII input is encoded as UTF-8 bytes.",
      fr: "Convertissez les caractères spéciaux en forme percent-encodée pour une utilisation sûre dans les URL, ou décodez-les en texte lisible. Il applique un encodage de composant : tout caractère réservé est échappé, barres obliques comprises. C'est ce qu'il faut pour une valeur de query string, un segment de chemin ou un champ de formulaire — et précisément ce qu'il ne faut pas appliquer à une URL entière, puisque cela échapperait les séparateurs qui lui donnent sa structure. Les caractères non ASCII sont encodés en octets UTF-8.",
    },
    useCases: {
      en: ["Encoding a query string containing spaces, accents or special characters", "Decoding a percent-encoded URL to make it human-readable", "Escaping a value that itself contains a slash, so it survives inside a path segment", "Debugging URL encoding mismatches in API requests or redirects"],
      fr: ["Encoder une chaîne de requête contenant des espaces, accents ou caractères spéciaux", "Décoder une URL percent-encodée pour la rendre lisible", "Encoder un segment de chemin contenant des caractères Unicode ou des barres obliques", "Déboguer des décalages d'encodage URL dans des requêtes API ou des redirections"],
    },
    deepDive: [
      {
        h: { en: "Percent-encoding, byte by byte", fr: "Le percent-encoding, octet par octet" },
        p: {
          en: [
          "Percent-encoding replaces a character with a percent sign followed by the hexadecimal value of each of its bytes. A space becomes %20. Non-ASCII characters are first encoded as UTF-8, which is why an accented letter produces two groups and an emoji four: é is %C3%A9, and a rocket is %F0%9F%9A%80.",
          "A small set of characters is deliberately left alone — letters, digits, and the marks minus, underscore, dot, exclamation, tilde, asterisk, apostrophe and parentheses. They are safe everywhere in a URL, so encoding them would only add noise.",
          ],
          fr: [
          "Le percent-encoding remplace un caractère par un signe pourcent suivi de la valeur hexadécimale de chacun de ses octets. Une espace devient %20. Les caractères non ASCII sont d'abord encodés en UTF-8, ce qui explique qu'une lettre accentuée produise deux groupes et un emoji quatre : é donne %C3%A9, et une fusée %F0%9F%9A%80.",
          "Un petit ensemble de caractères est volontairement laissé intact — lettres, chiffres, et les signes moins, tiret bas, point, point d'exclamation, tilde, astérisque, apostrophe et parenthèses. Ils sont sûrs partout dans une URL : les encoder n'ajouterait que du bruit.",
          ],
        },
      },
      {
        h: { en: "Never run a whole URL through this", fr: "N'y passez jamais une URL entière" },
        p: {
          en: [
          "This tool encodes a component, meaning it escapes every reserved character including the slash, the question mark, the ampersand and the colon. Feed it a complete address and the result is a single opaque string in which the scheme, host and path separators have all been escaped — valid as a value, useless as a link.",
          "That behaviour is the correct one for the job it is meant for: taking a value that may itself contain slashes or ampersands and making it survive inside a query parameter or a path segment. Encode the parts, then assemble the URL — not the other way round.",
          ],
          fr: [
          "Cet outil encode un composant : il échappe donc tout caractère réservé, y compris la barre oblique, le point d'interrogation, l'esperluette et les deux-points. Donnez-lui une adresse complète et le résultat est une chaîne opaque unique où le schéma, l'hôte et les séparateurs de chemin ont tous été échappés — valide comme valeur, inutilisable comme lien.",
          "Ce comportement est le bon pour l'usage visé : prendre une valeur pouvant elle-même contenir des barres obliques ou des esperluettes et la faire survivre dans un paramètre de requête ou un segment de chemin. Encodez les morceaux, puis assemblez l'URL — pas l'inverse.",
          ],
        },
      },
      {
        h: { en: "Why a space is sometimes a plus sign", fr: "Pourquoi une espace devient parfois un plus" },
        p: {
          en: [
          "You will meet spaces written both as %20 and as a plus sign. The plus form comes from HTML form submission, whose media type predates the modern URL specification and encodes spaces that way in a query string. It is valid there, and only there.",
          "In a path segment a plus sign is a literal plus, not a space. Decoding a query string with a decoder that does not know the form convention therefore leaves stray plus signs in the text — and encoding a path with a form encoder corrupts any genuine plus it contains.",
          ],
          fr: [
          "On rencontre les espaces écrites tantôt %20, tantôt sous forme de signe plus. La forme plus vient de la soumission de formulaire HTML, dont le type de média est antérieur à la spécification moderne des URL et qui encode ainsi les espaces dans une query string. Elle est valide là, et seulement là.",
          "Dans un segment de chemin, un signe plus est un vrai plus, pas une espace. Décoder une query string avec un décodeur ignorant la convention des formulaires laisse donc des plus parasites dans le texte — et encoder un chemin avec un encodeur de formulaire corrompt tout plus légitime qu'il contient.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "Named references or numeric references?", fr: "Références nommées ou numériques ?" },
        p: {
          en: [
          "Every character can be written two ways: by name (&eacute;) or by code point (&#233; in decimal, &#xE9; in hexadecimal). Both produce the same é. Named references stay readable for a human editing the source; numeric references always work, because they depend on no lookup table.",
          "This tool prefers the named form whenever HTML 4 defines one — the Latin-1 range, common punctuation, currency symbols and the Greek alphabet — and falls back to a decimal reference for everything else. That is why an emoji comes out as &#128512;: it simply has no name to use.",
          ],
          fr: [
          "Chaque caractère peut s'écrire de deux façons : par son nom (&eacute;) ou par son point de code (&#233; en décimal, &#xE9; en hexadécimal). Les deux produisent le même é. La forme nommée reste lisible à l'œil nu dans le source ; la forme numérique fonctionne toujours, car elle ne dépend d'aucune table de correspondance.",
          "Cet outil privilégie la forme nommée chaque fois que HTML 4 en définit une — plage Latin-1, ponctuation courante, symboles monétaires et alphabet grec — et bascule sur une référence décimale pour tout le reste. C'est pourquoi un emoji ressort en &#128512; : il n'a tout simplement pas de nom.",
          ],
        },
      },
      {
        h: { en: "Escaping depends on where the text lands", fr: "L'échappement dépend de l'endroit où le texte atterrit" },
        p: {
          en: [
          "HTML escaping is not a universal sanitizer. It is correct for text placed between tags, and for attribute values provided those values are quoted. It is the wrong tool everywhere else: inside a script block you need JavaScript string escaping, inside a URL percent-encoding, inside a CSS rule CSS escaping.",
          "The classic failure is the unquoted attribute. When a value is dropped into markup without surrounding quotes, escaping angle brackets changes nothing — a single space is enough to append an attribute of one's choosing. Escaping protects you only when the surrounding syntax already delimits the value.",
          ],
          fr: [
          "L'échappement HTML n'est pas un désinfectant universel. Il est correct pour du texte placé entre des balises, et pour des valeurs d'attribut à condition que ces valeurs soient entre guillemets. Il est inadapté partout ailleurs : dans un bloc script il faut un échappement de chaîne JavaScript, dans une URL un percent-encoding, dans une règle CSS un échappement CSS.",
          "L'échec classique est l'attribut sans guillemets. Quand une valeur est insérée dans le balisage sans guillemets autour, échapper les chevrons ne change rien — une simple espace suffit à ajouter l'attribut de son choix. L'échappement ne vous protège que si la syntaxe environnante délimite déjà la valeur.",
          ],
        },
      },
      {
        h: { en: "Where this tool stops", fr: "Où cet outil s'arrête" },
        p: {
          en: [
          "Decoding covers the HTML 4 named references plus every numeric reference, decimal or hexadecimal. HTML 5 added around two thousand further names, many of them aliases; those are left untouched rather than mangled, so an unrecognised reference comes back exactly as you typed it.",
          "A reference pointing outside the Unicode range, or at an unpaired surrogate, is returned as-is for the same reason. Silently emitting a replacement character would hide a real problem in your source data instead of surfacing it.",
          ],
          fr: [
          "Le décodage couvre les références nommées de HTML 4 ainsi que toutes les références numériques, décimales ou hexadécimales. HTML 5 en a ajouté environ deux mille, souvent des alias ; celles-là sont laissées intactes plutôt que déformées, si bien qu'une référence non reconnue ressort exactement telle que saisie.",
          "Une référence pointant hors de la plage Unicode, ou vers un substitut isolé, est restituée telle quelle pour la même raison. Émettre silencieusement un caractère de remplacement masquerait un vrai problème dans vos données source au lieu de le révéler.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "What the angle actually measures", fr: "Ce que mesure réellement l'angle" },
        p: {
          en: [
          "In CSS a linear gradient angle points in the direction the gradient travels, measured clockwise from straight up. So 0 degrees runs bottom to top, 90 degrees runs left to right, and 180 degrees runs top to bottom. That clockwise-from-north convention trips people up, because most maths starts from the horizontal and turns the other way.",
          "The gradient line is also sized so the corners of the box land exactly on its ends, which means the same angle produces a visibly different result on a wide banner and on a square tile.",
          ],
          fr: [
          "En CSS, l'angle d'un dégradé linéaire pointe dans la direction que suit le dégradé, mesurée dans le sens horaire depuis la verticale vers le haut. Ainsi 0 degré va de bas en haut, 90 degrés de gauche à droite, et 180 degrés de haut en bas. Cette convention horaire depuis le nord déroute, parce que la plupart des repères mathématiques partent de l'horizontale et tournent dans l'autre sens.",
          "La ligne de dégradé est en outre dimensionnée pour que les coins de la boîte tombent exactement sur ses extrémités : un même angle produit donc un résultat visiblement différent sur une bannière large et sur une tuile carrée.",
          ],
        },
      },
      {
        h: { en: "Why gradients between saturated colours look muddy", fr: "Pourquoi un dégradé entre couleurs saturées paraît terne" },
        p: {
          en: [
          "Browsers interpolate in sRGB by default, channel by channel. Between two colours sitting opposite each other on the colour wheel, the midpoint of that arithmetic lands near grey — which is why a blue-to-yellow gradient develops a dull band in the middle rather than passing through a vivid green.",
          "Adding a third stop in the middle, in the hue you actually want, is the fix that works everywhere. Modern CSS also lets you name a different interpolation space, such as Oklab, which keeps the midpoint saturated, though support is more recent than the syntax this tool produces.",
          ],
          fr: [
          "Les navigateurs interpolent par défaut en sRGB, canal par canal. Entre deux couleurs opposées sur la roue chromatique, le milieu de cette moyenne arithmétique tombe près du gris — d'où la bande terne au centre d'un dégradé bleu vers jaune, au lieu d'un passage par un vert franc.",
          "Ajouter un troisième arrêt au milieu, dans la teinte réellement voulue, est le correctif qui fonctionne partout. Le CSS moderne permet aussi de nommer un autre espace d'interpolation, comme Oklab, qui garde le milieu saturé — mais son support est plus récent que la syntaxe produite par cet outil.",
          ],
        },
      },
      {
        h: { en: "Three shapes, three behaviours", fr: "Trois formes, trois comportements" },
        p: {
          en: [
          "A linear gradient runs along a straight line at the angle you set. A radial gradient spreads outward from a centre point, useful for spotlights and soft vignettes. A conic gradient sweeps around a centre like a clock hand, which is what makes pie charts and colour wheels possible in pure CSS.",
          "Up to five colour stops are available, which is more than most designs need: gradients with many stops tend to read as banded rather than smooth. Two or three well-chosen stops almost always look better than five.",
          ],
          fr: [
          "Un dégradé linéaire suit une droite selon l'angle défini. Un dégradé radial se diffuse depuis un point central, utile pour des halos et des vignettages doux. Un dégradé conique balaie autour d'un centre comme une aiguille d'horloge, ce qui rend possibles camemberts et roues chromatiques en CSS pur.",
          "Jusqu'à cinq arrêts de couleur sont disponibles, ce qui dépasse le besoin de la plupart des designs : les dégradés à nombreux arrêts se lisent plutôt comme des bandes que comme une transition douce. Deux ou trois arrêts bien choisis rendent presque toujours mieux que cinq.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "The five parameters, and the three that matter", fr: "Les cinq paramètres, et les trois qui comptent" },
        p: {
          en: [
          "Source names where the traffic came from, medium names the kind of channel, and campaign names the initiative. Those three are what analytics tools group by, and omitting any of them leaves the visit sitting in an unhelpful bucket. Term and content are optional refinements, originally for paid keywords and for telling two variants of the same ad apart.",
          "The convention that matters most is consistency of vocabulary: newsletter and email describe the same medium, but analytics will report them as two separate channels forever. Agreeing on the words before the first campaign is worth more than any tooling.",
          ],
          fr: [
          "La source nomme la provenance du trafic, le medium le type de canal, et la campagne l'opération. Ces trois-là sont ce sur quoi les outils d'analyse regroupent, et en omettre un laisse la visite dans une catégorie inexploitable. Le terme et le contenu sont des raffinements facultatifs, prévus à l'origine pour les mots-clés payants et pour distinguer deux variantes d'une même annonce.",
          "La convention la plus importante est la constance du vocabulaire : newsletter et email désignent le même medium, mais l'outil d'analyse les rapportera comme deux canaux distincts pour toujours. S'accorder sur les mots avant la première campagne vaut mieux que n'importe quel outillage.",
          ],
        },
      },
      {
        h: { en: "Case sensitivity is the usual silent failure", fr: "La casse est le piège silencieux habituel" },
        p: {
          en: [
          "UTM values are case-sensitive in most analytics platforms, so Newsletter and newsletter become two separate rows in the report. The same goes for trailing spaces picked up when pasting from a spreadsheet. Neither produces an error; the data simply fragments, and the split is often noticed only weeks later.",
          "Sticking to lowercase throughout, with hyphens instead of spaces, removes the whole class of problem. Avoid characters that need encoding as well: a space becomes %20 in the URL and is easy to mistake for part of the value.",
          ],
          fr: [
          "Les valeurs UTM sont sensibles à la casse dans la plupart des plateformes d'analyse : Newsletter et newsletter deviennent donc deux lignes distinctes du rapport. Il en va de même des espaces finales récupérées en collant depuis un tableur. Ni l'un ni l'autre ne produit d'erreur ; les données se fragmentent simplement, et l'on s'en aperçoit souvent des semaines plus tard.",
          "S'en tenir aux minuscules de bout en bout, avec des traits d'union plutôt que des espaces, élimine toute cette classe de problèmes. Évitez aussi les caractères nécessitant un encodage : une espace devient %20 dans l'URL et se confond aisément avec la valeur.",
          ],
        },
      },
      {
        h: { en: "Where tagged links do not belong", fr: "Où les liens balisés n'ont pas leur place" },
        p: {
          en: [
          "Tag outbound links only — those you place on someone else's property, in an email or in an ad. Putting UTM parameters on internal links restarts the session attribution inside your own analytics, overwriting the real acquisition source with your own page and making the original channel disappear from the report.",
          "Tagged URLs are also public: they show up in address bars, get shared, and end up indexed. Campaign names that are internal shorthand, or that reveal an unannounced launch, are best avoided for that reason alone.",
          ],
          fr: [
          "Ne balisez que les liens sortants — ceux que vous placez sur une propriété qui n'est pas la vôtre, dans un e-mail ou dans une annonce. Poser des paramètres UTM sur des liens internes réamorce l'attribution de session dans votre propre outil d'analyse : la source d'acquisition réelle est écrasée par votre propre page, et le canal d'origine disparaît du rapport.",
          "Les URL balisées sont par ailleurs publiques : elles apparaissent dans les barres d'adresse, se partagent, et finissent indexées. Les noms de campagne relevant du jargon interne, ou révélant un lancement non annoncé, sont à éviter pour cette seule raison.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "Three parts, only one of them secret", fr: "Trois parties, une seule secrète" },
        p: {
          en: [
          "A JWT is three Base64url segments joined by dots. The first is a header naming the algorithm, the second is the payload holding your claims, and the third is a signature over the first two. Header and payload are encoded, not encrypted: anyone holding the token can read them, so a JWT is never a place for confidential data.",
          "The signature is what makes the token trustworthy. It proves the payload has not been altered since it was signed, and that whoever signed it held the key. Change a single character of the payload and the signature no longer matches.",
          ],
          fr: [
          "Un JWT est fait de trois segments Base64url reliés par des points. Le premier est un en-tête nommant l'algorithme, le deuxième la charge utile contenant vos claims, le troisième une signature portant sur les deux premiers. En-tête et charge utile sont encodés, pas chiffrés : quiconque détient le token peut les lire, un JWT n'est donc jamais l'endroit où loger des données confidentielles.",
          "C'est la signature qui rend le token digne de confiance. Elle prouve que la charge utile n'a pas été modifiée depuis sa signature, et que le signataire détenait la clé. Changez un seul caractère de la charge utile et la signature ne correspond plus.",
          ],
        },
      },
      {
        h: { en: "HS256, and when it is the wrong choice", fr: "HS256, et quand c'est le mauvais choix" },
        p: {
          en: [
          "HS256 is symmetric: the same secret both signs and verifies. That is simple and fast, and it fits a system where one service issues tokens and verifies them itself. It stops fitting as soon as a second party needs to verify, because verifying requires the very key that allows forging.",
          "That is where the asymmetric algorithms come in — RS256 and ES256 sign with a private key and verify with a public one, so a token can be checked by services that could never mint it. This tool implements HS256 only, which covers local testing but not a multi-service architecture.",
          ],
          fr: [
          "HS256 est symétrique : le même secret signe et vérifie. C'est simple et rapide, et cela convient à un système où un seul service émet les tokens et les vérifie lui-même. Cela cesse de convenir dès qu'un tiers doit vérifier, puisque vérifier exige la clé même qui permet de forger.",
          "C'est là qu'interviennent les algorithmes asymétriques — RS256 et ES256 signent avec une clé privée et vérifient avec une clé publique, si bien qu'un token peut être contrôlé par des services incapables de l'émettre. Cet outil n'implémente que HS256, ce qui couvre les tests locaux mais pas une architecture multi-services.",
          ],
        },
      },
      {
        h: { en: "The claims that decide whether a token is accepted", fr: "Les claims qui décident de l'acceptation d'un token" },
        p: {
          en: [
          "Several payload fields have a standard meaning that libraries enforce automatically. The most common source of a token rejected as expired is exp: it is a Unix timestamp in seconds, and writing it in milliseconds — the unit JavaScript hands you — yields a date far enough in the future that some validators reject it outright.",
          "Alongside it, iat records when the token was issued, nbf the moment before which it must not be accepted, and sub identifies the subject. A payload with no exp at all produces a token that never expires, which is rarely what you want outside a test.",
          ],
          fr: [
          "Plusieurs champs de la charge utile ont une signification normalisée que les bibliothèques appliquent automatiquement. La cause la plus fréquente d'un token rejeté comme expiré est exp : c'est un timestamp Unix en secondes, et l'écrire en millisecondes — l'unité que JavaScript vous donne — produit une date assez lointaine pour que certains validateurs la refusent d'emblée.",
          "À ses côtés, iat enregistre la date d'émission, nbf le moment avant lequel le token ne doit pas être accepté, et sub identifie le sujet. Une charge utile sans exp du tout produit un token qui n'expire jamais, ce qui est rarement souhaitable en dehors d'un test.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "What the Flesch score measures, and what it ignores", fr: "Ce que mesure le score Flesch, et ce qu'il ignore" },
        p: {
          en: [
          "The formula combines two ratios: average sentence length in words, and average word length in syllables. Shorter sentences and shorter words push the score up. That is the whole model — it has no notion of vocabulary difficulty, logical structure, or whether the text makes sense at all.",
          "So a passage of short nonsense words scores as highly readable, and a clear sentence built from long technical terms scores as difficult even when its audience finds it obvious. Treat the number as a rough measure of surface complexity, useful for comparing two drafts of the same text, not as a verdict on quality.",
          ],
          fr: [
          "La formule combine deux rapports : la longueur moyenne des phrases en mots, et la longueur moyenne des mots en syllabes. Des phrases et des mots plus courts font monter le score. C'est tout le modèle — il n'a aucune notion de difficulté du vocabulaire, de structure logique, ni du fait que le texte ait un sens.",
          "Un passage fait de mots courts et absurdes obtient donc un excellent score, et une phrase claire bâtie sur des termes techniques longs est jugée difficile même si son public la trouve évidente. Prenez le nombre comme une mesure grossière de complexité de surface, utile pour comparer deux versions d'un même texte, pas comme un verdict sur la qualité.",
          ],
        },
      },
      {
        h: { en: "Counting syllables is an approximation", fr: "Compter les syllabes est une approximation" },
        p: {
          en: [
          "No formula counts syllables exactly. The usual approach groups consecutive vowels and applies corrections — the silent e at the end of an English word being the best known. It gets the common cases right and misses on names, borrowed words and irregular spellings.",
          "French needs different rules from English, so the two languages are handled separately here rather than running English heuristics over French text. Running a French passage through an English-only readability tool inflates the syllable count and reports the text as far harder than it is.",
          ],
          fr: [
          "Aucune formule ne compte les syllabes exactement. L'approche habituelle regroupe les voyelles consécutives et applique des corrections — le e muet en fin de mot anglais étant la plus connue. Elle traite correctement les cas courants et échoue sur les noms propres, les emprunts et les orthographes irrégulières.",
          "Le français réclame des règles différentes de l'anglais : les deux langues sont donc traitées séparément ici, plutôt qu'en appliquant des heuristiques anglaises à du texte français. Passer un texte français dans un outil de lisibilité conçu pour l'anglais gonfle le compte de syllabes et rapporte un texte bien plus difficile qu'il ne l'est.",
          ],
        },
      },
      {
        h: { en: "Using the score without letting it write for you", fr: "Se servir du score sans le laisser écrire à votre place" },
        p: {
          en: [
          "Because the formula only rewards brevity, it is trivially gamed: split every sentence in two and the score climbs without the text becoming clearer. Chopping a well-built sentence at its logical joint usually makes it harder to follow, not easier, even as the number improves.",
          "The score earns its keep as a flag rather than a target. A section scoring far worse than the rest of a document is worth rereading — it often turns out to contain one sentence that ran away with three subordinate clauses. Fix that sentence, and ignore the number afterwards.",
          ],
          fr: [
          "Comme la formule ne récompense que la brièveté, elle se contourne trivialement : coupez chaque phrase en deux et le score grimpe sans que le texte gagne en clarté. Sectionner une phrase bien construite à son articulation logique la rend généralement plus difficile à suivre, pas plus facile, alors même que le nombre s'améliore.",
          "Le score vaut comme signal d'alerte, pas comme objectif. Une section notée bien plus mal que le reste d'un document mérite une relecture — il s'y trouve souvent une phrase partie en vrille avec trois subordonnées. Corrigez cette phrase, puis oubliez le nombre.",
          ],
        },
      },
    ],
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
    deepDive: [
      {
        h: { en: "Only the separator row is load-bearing", fr: "Seule la ligne de séparation porte le sens" },
        p: {
          en: [
          "A Markdown table needs a header row, a separator row of dashes, and any number of body rows. Only the separator row carries structure: the number of segments it contains fixes the number of columns, and the colons placed inside it set each column's alignment.",
          "Everything else is cosmetic. Pipes do not need to line up, cells do not need equal widths, and leading or trailing pipes are optional. Aligned source is pleasant to read in a diff, and this tool produces it, but a table with ragged pipes renders identically.",
          ],
          fr: [
          "Un tableau Markdown demande une ligne d'en-tête, une ligne de séparation faite de tirets, et un nombre quelconque de lignes de corps. Seule la ligne de séparation porte la structure : le nombre de segments qu'elle contient fixe le nombre de colonnes, et les deux-points qu'on y place définissent l'alignement de chaque colonne.",
          "Tout le reste est cosmétique. Les barres verticales n'ont pas besoin d'être alignées, les cellules pas besoin d'être de largeur égale, et les barres en début et fin de ligne sont facultatives. Un source aligné se lit agréablement dans un diff, et cet outil en produit un, mais un tableau aux barres irrégulières s'affiche à l'identique.",
          ],
        },
      },
      {
        h: { en: "What a cell cannot contain", fr: "Ce qu'une cellule ne peut pas contenir" },
        p: {
          en: [
          "A cell holds a single line. There is no syntax for a real line break inside one, and pressing return breaks the table apart — the usual workaround is an inline HTML break tag, which most renderers accept. Lists and code blocks are unavailable for the same reason; inline code spans work fine.",
          "A pipe character inside a cell must be escaped with a backslash, otherwise it is read as a column separator and shifts every following cell by one. That single unescaped pipe is the most common cause of a table that renders with the wrong number of columns.",
          ],
          fr: [
          "Une cellule tient sur une seule ligne. Il n'existe pas de syntaxe pour un vrai saut de ligne à l'intérieur, et appuyer sur entrée casse le tableau — le contournement habituel est une balise de saut HTML en ligne, que la plupart des moteurs de rendu acceptent. Listes et blocs de code sont indisponibles pour la même raison ; le code en ligne, lui, fonctionne.",
          "Une barre verticale dans une cellule doit être échappée par un antislash, faute de quoi elle est lue comme un séparateur de colonne et décale d'un cran toutes les cellules suivantes. Cette unique barre non échappée est la cause la plus fréquente d'un tableau affiché avec le mauvais nombre de colonnes.",
          ],
        },
      },
      {
        h: { en: "Tables are an extension, not core Markdown", fr: "Les tableaux sont une extension, pas du Markdown de base" },
        p: {
          en: [
          "Tables are absent from the original Markdown specification and from CommonMark. They come from GitHub Flavored Markdown, which is why they work on GitHub, GitLab, Obsidian, Notion and most static site generators — but not in every renderer.",
          "If a table shows up as raw pipes and dashes, the renderer is running plain CommonMark without the extension enabled. Most libraries offer it as a flag rather than a default, so the fix is usually configuration rather than a change to the table itself.",
          ],
          fr: [
          "Les tableaux sont absents de la spécification Markdown d'origine comme de CommonMark. Ils viennent du GitHub Flavored Markdown — d'où leur fonctionnement sur GitHub, GitLab, Obsidian, Notion et la plupart des générateurs de sites statiques, mais pas dans tous les moteurs de rendu.",
          "Si un tableau apparaît sous forme de barres et de tirets bruts, le moteur applique du CommonMark simple sans l'extension activée. La plupart des bibliothèques la proposent en option plutôt que par défaut : le correctif relève donc de la configuration, pas d'une modification du tableau.",
          ],
        },
      },
    ],
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
  "border-radius": {
    desc: {
      en: "This generator exposes all four corners of border-radius independently — top-left, top-right, bottom-right, bottom-left, in that exact CSS shorthand order — with a link toggle to move them together or a slider per corner to break the symmetry. Switch the unit between px (0–200) and % before you start: percentage values are calculated separately against the element's width and height, so on a non-square box a 50% radius produces elliptical corners, not circles — a detail that trips people up when they copy a percentage value from a square swatch onto a wide button. For a true circle, radius must be 50% on an element where width equals height; for a pill-shaped button, set the radius to at least half the element's height rather than an arbitrary large px number. The CSS is generated live below the preview and copies as a single value when all four corners match, or the four-value shorthand when they don't.",
      fr: "Ce générateur expose les quatre coins de border-radius indépendamment — haut-gauche, haut-droite, bas-droite, bas-gauche, dans l'ordre exact du raccourci CSS — avec un bouton de liaison pour les faire varier ensemble, ou un curseur par coin pour casser la symétrie. Choisissez l'unité avant de commencer, px (0 à 200) ou % : les valeurs en pourcentage se calculent séparément par rapport à la largeur et à la hauteur de l'élément, donc sur un bloc non carré, un rayon à 50% produit des coins elliptiques, pas des cercles — un détail qui piège souvent quand on recopie une valeur testée sur un carré vers un bouton large. Pour un cercle parfait, il faut 50% sur un élément dont la largeur égale la hauteur ; pour un bouton en pilule, réglez le rayon à au moins la moitié de la hauteur de l'élément plutôt qu'une valeur en px choisie au hasard. Le CSS se génère en temps réel sous l'aperçu et se copie en une seule valeur quand les quatre coins sont identiques, ou en raccourci à quatre valeurs sinon.",
    },
    useCases: {
      en: ["Pill-shaped buttons and tags — set the radius to half the button's height, not a fixed px guess", "Chat bubbles or notification badges with one flattened corner (e.g. bottom-left at 4px, others at 16px) to point toward the sender", "Card UI where only the top two corners are rounded (modals, bottom sheets, image headers)", "Approximating an iOS-style app icon — note this is a visual approximation, not a true squircle superellipse curve"],
      fr: ["Boutons et tags en forme de pilule — réglez le rayon à la moitié de la hauteur du bouton, pas une valeur en px au hasard", "Bulles de discussion ou badges de notification avec un coin aplati (ex. bas-gauche à 4px, les autres à 16px) pour pointer vers l'expéditeur", "Cartes UI dont seuls les deux coins du haut sont arrondis (modales, bottom sheets, en-têtes d'image)", "Approximer une icône d'app style iOS — attention, c'est une approximation visuelle, pas une vraie courbe superellipse (squircle)"],
    },
  },
  "timestamp": {
    desc: {
      en: "Paste a Unix timestamp in seconds and get six representations at once: seconds, milliseconds, ISO 8601, the UTC string, your browser's local time, and a plain YYYY-MM-DD date. The most common error with this kind of tool isn't a bug, it's the input: a 13-digit millisecond timestamp (the kind Date.now() or many JSON APIs return) pasted into a field expecting 10-digit seconds lands somewhere around the year 5138, not next Tuesday — multiply or divide by 1000 depending on which direction you're converting. The 'Local' row reflects the timezone of whoever's browser is open, not a fixed server timezone, so the same timestamp will show a different local time to a colleague in another country — only the UTC and ISO rows are timezone-independent and safe to paste into a bug report. Converting the other direction, from a date picker back to Unix seconds, is also timezone-sensitive: midnight in your local time is not midnight UTC.",
      fr: "Collez un timestamp Unix en secondes et obtenez six représentations en même temps : secondes, millisecondes, ISO 8601, la chaîne UTC, l'heure locale de votre navigateur, et une date simple au format YYYY-MM-DD. L'erreur la plus fréquente avec ce genre d'outil n'est pas un bug, c'est la saisie : un timestamp en millisecondes à 13 chiffres (celui que renvoie Date.now() ou beaucoup d'API JSON) collé dans un champ qui attend des secondes à 10 chiffres atterrit vers l'an 5138, pas mardi prochain — il faut multiplier ou diviser par 1000 selon le sens de la conversion. La ligne « Local » reflète le fuseau horaire du navigateur ouvert, pas un fuseau serveur fixe : le même timestamp affichera une heure locale différente à un collègue dans un autre pays — seules les lignes UTC et ISO sont indépendantes du fuseau et sûres à coller dans un rapport de bug. La conversion dans l'autre sens, d'un sélecteur de date vers un timestamp Unix, est aussi sensible au fuseau : minuit en heure locale n'est pas minuit UTC.",
    },
    useCases: {
      en: ["Debugging why a JWT 'exp' claim or database timestamp column looks wrong — check whether it's seconds or milliseconds first", "Converting an API response timestamp into a readable date for a support ticket or bug report", "Checking if a scheduled job's Unix time actually falls where you expect once timezone is accounted for", "Quickly generating 'now' as a Unix timestamp to paste into a test fixture or cURL request"],
      fr: ["Déboguer pourquoi un claim 'exp' de JWT ou une colonne timestamp en base semble faux — vérifier d'abord si c'est en secondes ou en millisecondes", "Convertir le timestamp d'une réponse API en date lisible pour un ticket support ou un rapport de bug", "Vérifier que l'heure Unix d'une tâche planifiée tombe bien où on l'attend une fois le fuseau pris en compte", "Générer rapidement 'maintenant' en timestamp Unix à coller dans un fixture de test ou une requête cURL"],
    },
  },
  "favicon-generator": {
    desc: {
      en: "Type one or two characters, pick a background and text color (or one of six presets), and the canvas renders a live preview at 16, 32, 48 and 64px simultaneously — useful for checking legibility at browser-tab size before committing to a design. One honest limitation: the '.ico' download in this tool is a PNG image saved with an .ico file extension, not a true multi-resolution ICO container. Every current browser (Chrome, Firefox, Edge, Safari) accepts this without complaint when referenced via a standard <link rel=\"icon\"> tag, but software that inspects the actual file signature — some older build tools or strict validators — will flag it as a mismatched format. This tool also tops out at 64px, which covers browser tabs and bookmarks but not the larger icons modern platforms expect: a 180×180 apple-touch-icon for iOS home screens or a 512×512 icon for a PWA manifest need to be generated separately at full size, ideally from a vector source rather than upscaled from a 64px canvas.",
      fr: "Tapez un ou deux caractères, choisissez une couleur de fond et de texte (ou l'un des six presets), et le canvas affiche un aperçu en direct à 16, 32, 48 et 64px simultanément — utile pour vérifier la lisibilité à la taille d'un onglet de navigateur avant de valider un design. Une limite honnête : le téléchargement « .ico » de cet outil est en réalité une image PNG enregistrée avec l'extension .ico, pas un vrai conteneur ICO multi-résolution. Tous les navigateurs actuels (Chrome, Firefox, Edge, Safari) l'acceptent sans problème via une balise standard <link rel=\"icon\">, mais un logiciel qui inspecte la signature réelle du fichier — certains outils de build anciens ou validateurs stricts — le signalera comme un format incohérent. L'outil plafonne aussi à 64px, ce qui couvre les onglets et favoris de navigateur mais pas les icônes plus grandes attendues par les plateformes modernes : un apple-touch-icon 180×180 pour l'écran d'accueil iOS ou une icône 512×512 pour un manifest PWA doivent être générés séparément en pleine taille, idéalement depuis une source vectorielle plutôt qu'agrandis depuis un canvas de 64px.",
    },
    useCases: {
      en: ["Quick placeholder favicon for a side project or local dev environment before a real logo exists", "Testing whether a two-letter monogram stays legible at 16px before finalizing brand colors", "Generating a favicon that matches an exact brand hex color without opening a design tool", "Producing the small browser-tab sizes only — pair with a separate 512px export for app icons and PWA manifests"],
      fr: ["Favicon provisoire rapide pour un projet perso ou un environnement de dev local avant qu'un vrai logo existe", "Tester si un monogramme à deux lettres reste lisible à 16px avant de figer les couleurs de marque", "Générer un favicon qui correspond exactement à une couleur hexadécimale de marque sans ouvrir d'outil de design", "Produire uniquement les petites tailles d'onglet — à compléter par un export 512px séparé pour les icônes d'app et manifests PWA"],
    },
  },
  "jwt-decoder": {
    desc: {
      en: "Paste a JWT and the tool splits it on the two dots into header, payload and signature, base64url-decodes the first two parts, and pretty-prints the JSON — no library, no server round-trip, decoding happens with a few lines of atob() in your browser. It automatically converts the exp, iat and nbf claims from raw Unix seconds into a readable ISO date next to the number, and marks the token as expired or valid by comparing exp against your current system clock. The one thing this tool deliberately does not do is verify the signature: decoding a JWT only tells you what the token claims, not whether whoever issued it actually holds the matching secret or private key. A token can decode perfectly and still be forged, expired-but-accepted by a buggy server, or signed with an algorithm the server never checks — the historical 'alg: none' vulnerability class exploited exactly that gap between decoding and verifying. Treat this as a debugging aid, never as proof that a token is authentic.",
      fr: "Collez un JWT et l'outil le découpe sur les deux points en header, payload et signature, décode les deux premières parties en base64url, et affiche le JSON formaté — aucune bibliothèque, aucun aller-retour serveur, le décodage tient en quelques lignes d'atob() dans votre navigateur. Il convertit automatiquement les claims exp, iat et nbf, exprimés en secondes Unix brutes, en date ISO lisible juste à côté du nombre, et marque le token comme expiré ou valide en comparant exp à l'horloge système actuelle. La seule chose que cet outil ne fait volontairement pas, c'est vérifier la signature : décoder un JWT indique seulement ce que le token prétend, pas si celui qui l'a émis détient réellement le secret ou la clé privée correspondante. Un token peut se décoder parfaitement et être quand même forgé, expiré-mais-accepté par un serveur bugué, ou signé avec un algorithme que le serveur ne vérifie jamais — la vulnérabilité historique « alg: none » exploitait exactement cet écart entre décoder et vérifier. Considérez cet outil comme une aide au débogage, jamais comme une preuve d'authenticité.",
    },
    useCases: {
      en: ["Inspecting what claims are actually inside a JWT your app just received, without adding a console.log to backend code", "Checking whether an access token has actually expired when a user reports being logged out unexpectedly", "Verifying the payload shape matches what your auth provider's docs describe before writing integration code", "Confirming which signing algorithm (HS256, RS256…) a third-party token uses before configuring your verifier"],
      fr: ["Inspecter les claims réellement présents dans un JWT que votre app vient de recevoir, sans ajouter de console.log côté backend", "Vérifier si un access token est réellement expiré quand un utilisateur signale une déconnexion inattendue", "Vérifier que la forme du payload correspond à ce que décrit la doc de votre fournisseur d'auth avant d'écrire le code d'intégration", "Confirmer quel algorithme de signature (HS256, RS256…) utilise un token tiers avant de configurer votre vérificateur"],
    },
  },
  "robots-txt": {
    desc: {
      en: "Build a robots.txt file from as many User-agent blocks as you need — each with its own Disallow and Allow paths — plus a Sitemap line, then copy the result or download it as a plain .txt file. Separate blocks matter more than they used to: you can now write one rule set for Googlebot and a stricter one for AI training crawlers like GPTBot or CCBot, since more sites are opting specific bots out while leaving search indexing untouched. The mistake this tool won't stop you from making: robots.txt is a public file and a request, not a lock. Every crawler that respects it (and plenty don't) can still read the exact paths you listed under Disallow before deciding not to index them — so putting /admin/ or /internal-api/ in a Disallow rule announces that path to anyone who fetches /robots.txt, it doesn't hide it. Sensitive paths need actual authentication, not a crawling directive. The Sitemap field also accepts one absolute URL at a time; a site with multiple sitemap files (a sitemap index setup) needs one Sitemap: line per file, added by hand after generating the base rules here.",
      fr: "Construisez un fichier robots.txt à partir d'autant de blocs User-agent que nécessaire — chacun avec ses propres chemins Disallow et Allow — plus une ligne Sitemap, puis copiez le résultat ou téléchargez-le en fichier .txt brut. Séparer les blocs compte plus qu'avant : vous pouvez désormais écrire une règle pour Googlebot et une règle plus stricte pour les crawlers d'entraînement IA comme GPTBot ou CCBot, de plus en plus de sites excluant des bots spécifiques tout en laissant l'indexation de recherche intacte. L'erreur que cet outil ne vous empêchera pas de commettre : robots.txt est un fichier public et une demande, pas un verrou. Tout crawler qui le respecte (et beaucoup ne le font pas) peut quand même lire les chemins exacts listés sous Disallow avant de décider de ne pas les indexer — donc mettre /admin/ ou /internal-api/ dans une règle Disallow annonce ce chemin à quiconque récupère /robots.txt, ça ne le cache pas. Les chemins sensibles ont besoin d'une vraie authentification, pas d'une directive de crawl. Le champ Sitemap n'accepte qu'une seule URL absolue à la fois ; un site avec plusieurs fichiers sitemap (configuration en index de sitemaps) nécessite une ligne Sitemap: par fichier, à ajouter à la main après avoir généré les règles de base ici.",
    },
    useCases: {
      en: ["Blocking a staging or admin subdirectory from search engines while keeping the rest of the site crawlable", "Writing a separate rule to opt specific AI crawlers (GPTBot, CCBot, Google-Extended) out of training-data scraping", "Generating a clean robots.txt for a new site launch, including the sitemap reference in the same file", "Quickly checking what a proposed robots.txt would look like before pasting it into production and breaking indexing"],
      fr: ["Bloquer un sous-répertoire de staging ou d'admin aux moteurs de recherche tout en gardant le reste du site indexable", "Écrire une règle séparée pour exclure des crawlers IA spécifiques (GPTBot, CCBot, Google-Extended) du scraping pour l'entraînement", "Générer un robots.txt propre pour le lancement d'un nouveau site, en incluant la référence au sitemap dans le même fichier", "Vérifier rapidement à quoi ressemblerait un robots.txt proposé avant de le coller en production et de casser l'indexation"],
    },
  },
  "base-converter": {
    desc: {
      en: "Type a number in one base — decimal, hexadecimal, octal or binary — and this converts it to all four simultaneously, using JavaScript's native parseInt/toString rather than a hand-rolled parser, so results match exactly what a script using the same functions would produce. Hex is the one you'll reach for most: colors (#00e08a), memory addresses, and MAC/UUID fragments are conventionally written in hex because two hex digits map cleanly onto one byte (00–FF). Binary matters when you're reading bitwise flags or subnet masks, where each digit corresponds to one bit rather than needing mental math from decimal. One limitation to know: the input is treated as an unsigned integer — there's no support for negative numbers or fractional values, so a two's-complement negative binary value won't convert the way it would in a language-specific integer type.",
      fr: "Tapez un nombre dans une base — décimal, hexadécimal, octal ou binaire — et il se convertit simultanément dans les quatre, en utilisant parseInt/toString natifs de JavaScript plutôt qu'un parseur maison, donc les résultats correspondent exactement à ce que produirait un script utilisant les mêmes fonctions. Le hexadécimal est celui que vous utiliserez le plus souvent : couleurs (#00e08a), adresses mémoire, fragments de MAC/UUID s'écrivent conventionnellement en hexadécimal car deux chiffres hexadécimaux correspondent exactement à un octet (00 à FF). Le binaire compte quand vous lisez des flags bit à bit ou des masques de sous-réseau, où chaque chiffre correspond à un bit plutôt que de demander un calcul mental depuis le décimal. Une limite à connaître : la saisie est traitée comme un entier non signé — pas de support pour les nombres négatifs ou les valeurs à virgule, donc une valeur binaire négative en complément à deux ne se convertira pas comme elle le ferait dans un type entier spécifique à un langage.",
    },
    useCases: {
      en: ["Converting a hex color code to its decimal RGB components for a config file that doesn't accept hex", "Reading bitwise permission flags or feature flags written in binary", "Translating old Unix file permission octal notation (like 755) to understand what it actually grants", "Checking a memory address or byte value across bases while debugging low-level code"],
      fr: ["Convertir un code couleur hexadécimal en ses composantes RGB décimales pour un fichier de config qui n'accepte pas le hexadécimal", "Lire des flags de permission ou des feature flags écrits en binaire", "Traduire l'ancienne notation octale des permissions Unix (comme 755) pour comprendre ce qu'elle accorde réellement", "Vérifier une adresse mémoire ou une valeur d'octet dans différentes bases en déboguant du code bas niveau"],
    },
  },
  "box-shadow": {
    desc: {
      en: "Five independent sliders — offset X, offset Y, blur, spread, and alpha — plus an inset toggle build a box-shadow value and preview it live against the panel background. Spread is the one people misunderstand: a positive value grows the shadow's box in every direction before blur softens the edges, while a negative spread shrinks it — useful for a tight shadow that hugs the element instead of ballooning past its edges. This generator produces one shadow at a time; layering multiple shadows (a common technique for a soft ambient shadow plus a sharp contact shadow underneath it) means generating each one separately here and combining them by hand with commas in your CSS. The alpha slider is what actually makes a shadow look natural — a shadow at 100% opacity black reads as a hard silhouette, while real-world shadows this tool defaults toward 25% alpha, closer to how light actually falls.",
      fr: "Cinq curseurs indépendants — décalage X, décalage Y, flou, extension (spread), et alpha — plus un bouton inset construisent une valeur box-shadow et l'aperçoivent en direct sur le fond du panneau. Le spread est celui qu'on comprend souvent mal : une valeur positive agrandit la boîte de l'ombre dans toutes les directions avant que le flou n'adoucisse les bords, tandis qu'un spread négatif la réduit — utile pour une ombre resserrée qui colle à l'élément au lieu de déborder largement de ses bords. Ce générateur produit une seule ombre à la fois ; superposer plusieurs ombres (une technique courante pour une ombre ambiante douce plus une ombre de contact nette en dessous) demande de générer chacune séparément ici et de les combiner à la main avec des virgules dans votre CSS. Le curseur alpha est ce qui rend vraiment une ombre naturelle — une ombre noire à 100% d'opacité se lit comme une silhouette dure, alors que cet outil part par défaut sur 25% d'alpha, plus proche de la façon dont la lumière tombe réellement.",
    },
    useCases: {
      en: ["Building a soft elevated-card shadow for a design system without guessing blur/spread values by hand", "Creating a tight 'contact shadow' with negative spread that hugs a button instead of ballooning outward", "Prototyping an inset shadow for a pressed-button or input-field state", "Fine-tuning shadow alpha to match a specific dark or light theme instead of reusing a default black"],
      fr: ["Construire une ombre douce de carte surélevée pour un design system sans deviner les valeurs de flou/spread à la main", "Créer une « ombre de contact » resserrée avec un spread négatif qui colle à un bouton au lieu de déborder", "Prototyper une ombre inset pour un état de bouton pressé ou de champ de saisie", "Affiner l'alpha de l'ombre pour correspondre à un thème sombre ou clair spécifique plutôt que de réutiliser un noir par défaut"],
    },
  },
  "color-picker": {
    desc: {
      en: "Pick a color with the native browser picker or type a hex value directly, and every common format appears at once: HEX, RGB, HSL, HSV, plus the individual R/G/B channel values — click any row to copy just that one. HSL and HSV look similar but solve different problems: HSL's lightness runs from black through the pure hue to white, which is what CSS animations and design tokens usually want, while HSV's value/brightness axis (closer to how paint mixing or Photoshop's picker behaves) makes it easier to darken a color without washing it toward gray. One real constraint: the native <input type=\"color\"> this tool wraps doesn't support alpha/transparency — if you need a semi-transparent color, get the HEX or RGB here and add the alpha channel by hand (an 8-digit hex like #00e08a80, or rgba()).",
      fr: "Choisissez une couleur avec le sélecteur natif du navigateur ou tapez directement une valeur hexadécimale, et tous les formats courants apparaissent en même temps : HEX, RGB, HSL, HSV, plus les valeurs individuelles des canaux R/G/B — cliquez sur une ligne pour ne copier que celle-ci. HSL et HSV se ressemblent mais résolvent des problèmes différents : la luminosité (lightness) de HSL va du noir à la teinte pure jusqu'au blanc, ce que les animations CSS et les tokens de design veulent généralement, tandis que l'axe valeur/luminosité de HSV (plus proche du mélange de peinture ou du sélecteur de Photoshop) facilite l'assombrissement d'une couleur sans la délaver vers le gris. Une vraie contrainte : le <input type=\"color\"> natif que cet outil encapsule ne supporte pas l'alpha/la transparence — si vous avez besoin d'une couleur semi-transparente, récupérez le HEX ou le RGB ici et ajoutez le canal alpha à la main (un hexadécimal à 8 chiffres comme #00e08a80, ou rgba()).",
    },
    useCases: {
      en: ["Converting a design tool's HEX swatch into the RGB or HSL syntax a specific CSS property expects", "Grabbing the individual R, G, B channel values needed for a canvas or shader calculation", "Understanding why an HSL lightness tweak looks duller than expected — compare it against the HSV value axis", "Quickly reading off a brand color's exact values to hand to a developer or design tool"],
      fr: ["Convertir une teinte HEX d'un outil de design vers la syntaxe RGB ou HSL attendue par une propriété CSS spécifique", "Récupérer les valeurs individuelles des canaux R, G, B nécessaires pour un calcul canvas ou shader", "Comprendre pourquoi un ajustement de luminosité HSL paraît plus terne que prévu — comparer avec l'axe valeur de HSV", "Relever rapidement les valeurs exactes d'une couleur de marque à transmettre à un développeur ou un outil de design"],
    },
  },
  "contrast-checker": {
    desc: {
      en: "Pick a text color and a background color and this computes the WCAG 2.1 contrast ratio using the actual spec formula — sRGB channels linearized with the standard gamma curve, relative luminance weighted 0.2126/0.7152/0.0722 for red/green/blue, then (L1+0.05)/(L2+0.05) between the lighter and darker color. The ratio is graded against all four WCAG thresholds at once: AA requires 4.5:1 for normal text and only 3:1 for large text, AAA requires 7:1 and 4.5:1 respectively. 'Large text' has a precise legal definition that trips people up — 18pt (24px) regular weight, or 14pt (roughly 18.66px) bold — not a vague 'looks big' judgment, so a 20px bold heading qualifies for the relaxed threshold but a 20px regular-weight one does not. A ratio can pass AA and still be genuinely hard to read for someone with low vision in bright sunlight; treat these thresholds as a legal minimum, not a design target to hit exactly.",
      fr: "Choisissez une couleur de texte et une couleur de fond, et l'outil calcule le ratio de contraste WCAG 2.1 avec la formule exacte de la spec — canaux sRGB linéarisés selon la courbe gamma standard, luminance relative pondérée à 0,2126/0,7152/0,0722 pour rouge/vert/bleu, puis (L1+0,05)/(L2+0,05) entre la couleur claire et la couleur foncée. Le ratio est noté sur les quatre seuils WCAG à la fois : AA exige 4,5:1 pour le texte normal et seulement 3:1 pour le grand texte, AAA exige respectivement 7:1 et 4,5:1. Le « grand texte » a une définition légale précise qui piège souvent : 18pt (24px) en graisse normale, ou 14pt (environ 18,66px) en gras — pas un jugement vague de « ça paraît grand » — donc un titre en 20px gras est éligible au seuil allégé, mais le même en 20px normal ne l'est pas. Un ratio peut passer AA et rester réellement difficile à lire pour une personne malvoyante en plein soleil ; considérez ces seuils comme un minimum légal, pas un objectif de design à viser exactement.",
    },
    useCases: {
      en: ["Verifying a brand color pairing meets WCAG AA before it becomes the default text/background combo in a design system", "Checking whether a heading can drop to the relaxed 'large text' threshold because of its exact font size and weight", "Auditing an existing site's color pairs for an accessibility compliance review", "Testing a color choice against both AA and AAA at once instead of looking up thresholds separately"],
      fr: ["Vérifier qu'une association de couleurs de marque respecte le WCAG AA avant qu'elle ne devienne la combinaison texte/fond par défaut d'un design system", "Vérifier si un titre peut bénéficier du seuil allégé « grand texte » grâce à sa taille et sa graisse exactes", "Auditer les paires de couleurs d'un site existant dans le cadre d'une revue de conformité accessibilité", "Tester un choix de couleur contre AA et AAA en même temps plutôt que de chercher les seuils séparément"],
    },
  },
  "css-grid": {
    desc: {
      en: "Set column count, row count and gap with sliders (up to 12 columns, 8 rows), pick a column sizing unit — fr, px or % — and watch the grid preview update live while the CSS generates below using repeat() shorthand for both axes. Fr units are the one worth understanding if you're new to Grid: 1fr means 'one share of whatever space is left after fixed-size tracks are subtracted,' not a fixed size, which is why a 3-column grid at 1fr each stays perfectly equal no matter how wide the container gets — px columns won't. This tool always generates uniform tracks through repeat(count, size), so every column shares the same size and every row shares the same size; a real-world layout with a fixed sidebar next to a flexible content area (grid-template-columns: 240px 1fr) needs mixed track sizes that you'll have to write by hand after copying the base output here.",
      fr: "Réglez le nombre de colonnes, de lignes et l'espacement (gap) avec des curseurs (jusqu'à 12 colonnes, 8 lignes), choisissez une unité de dimensionnement des colonnes — fr, px ou % — et observez l'aperçu de la grille se mettre à jour en direct pendant que le CSS se génère en dessous, en utilisant le raccourci repeat() sur les deux axes. L'unité fr est celle qu'il faut vraiment comprendre si vous débutez avec Grid : 1fr signifie « une part de l'espace restant une fois les pistes de taille fixe soustraites », pas une taille fixe — c'est pourquoi une grille à 3 colonnes en 1fr chacune reste parfaitement égale quelle que soit la largeur du conteneur, contrairement à des colonnes en px. Cet outil génère toujours des pistes uniformes via repeat(count, size), donc chaque colonne partage la même taille et chaque ligne partage la même taille ; une mise en page réelle avec une barre latérale fixe à côté d'une zone de contenu flexible (grid-template-columns: 240px 1fr) demande des tailles de piste mixtes que vous devrez écrire à la main après avoir copié le résultat de base ici.",
    },
    useCases: {
      en: ["Prototyping a uniform photo gallery or card grid before writing the final CSS by hand", "Understanding visually why fr units behave differently from px when the container resizes", "Generating the base grid-template-columns/rows syntax to then customize with mixed track sizes", "Testing how gap size changes the visual density of a grid layout before committing to a value"],
      fr: ["Prototyper une galerie photo ou une grille de cartes uniforme avant d'écrire le CSS final à la main", "Comprendre visuellement pourquoi les unités fr se comportent différemment des px quand le conteneur change de taille", "Générer la syntaxe de base grid-template-columns/rows pour ensuite la personnaliser avec des tailles de piste mixtes", "Tester comment la taille du gap change la densité visuelle d'une grille avant de valider une valeur"],
    },
  },
  "css-minifier": {
    desc: {
      en: "Strips comments, collapses whitespace, tightens the spacing around braces/colons/semicolons and removes the final semicolon before each closing brace — the same category of transform tools like cssnano perform, but done here with a fixed set of regular expressions rather than a full CSS parser. That distinction matters in one specific edge case: because the minifier works on text patterns, not a parsed syntax tree, a literal semicolon or brace character sitting inside a quoted string value (content: \";\"; for instance) can be mangled the same as real CSS syntax would be. For everyday stylesheets — layout rules, typography, media queries — this doesn't come up, and the character-count savings shown below the output (usually 20–40% depending on how much whitespace and how many comments the source had) are a reasonably accurate preview of what a build-tool minifier would achieve.",
      fr: "Supprime les commentaires, réduit les espaces, resserre l'espacement autour des accolades/deux-points/points-virgules et retire le point-virgule final avant chaque accolade fermante — le même type de transformation qu'un outil comme cssnano, mais réalisé ici avec un jeu fixe d'expressions régulières plutôt qu'un parseur CSS complet. Cette distinction compte dans un cas précis : comme le minificateur travaille sur des motifs de texte, pas sur un arbre syntaxique analysé, un point-virgule ou une accolade littéral présent dans une valeur de chaîne entre guillemets (content: \";\"; par exemple) peut être altéré comme le serait une vraie syntaxe CSS. Pour les feuilles de style courantes — règles de mise en page, typographie, media queries — ce cas ne se présente pas, et le gain en nombre de caractères affiché sous le résultat (généralement 20 à 40% selon la quantité d'espaces et de commentaires de la source) donne un aperçu raisonnablement fiable de ce qu'obtiendrait un minificateur intégré à un build.",
    },
    useCases: {
      en: ["Shrinking a stylesheet before pasting it into a CodePen, email template, or anywhere a build step isn't available", "Quickly checking how much dead weight comments and formatting add to a CSS file", "Preparing CSS for inline use in an HTML <style> tag where every byte counts", "Cleaning up CSS copied from a design tool or browser inspector before reusing it"],
      fr: ["Réduire une feuille de style avant de la coller dans un CodePen, un email template, ou partout où une étape de build n'est pas disponible", "Vérifier rapidement combien de poids mort les commentaires et le formatage ajoutent à un fichier CSS", "Préparer du CSS pour un usage inline dans une balise <style> HTML où chaque octet compte", "Nettoyer du CSS copié depuis un outil de design ou l'inspecteur du navigateur avant de le réutiliser"],
    },
  },
  "csv-json": {
    desc: {
      en: "Switch direction with one toggle: paste CSV and get a JSON array of objects keyed by the header row, or paste a JSON array and get CSV back with values containing commas or quotes automatically wrapped and escaped. The CSV-to-JSON side is intentionally simple — it splits each line on commas, which handles typical exports fine but will misread a quoted field that itself contains a comma, like \"Doe, John\" in a name column: that value will split into two columns instead of staying together. For CSV that only ever came from a spreadsheet export with commas inside quoted text fields, double-check the header count in the output matches what you expect before trusting it for anything beyond a quick look. The JSON-to-CSV direction is more robust, since it controls the escaping itself.",
      fr: "Changez de sens en un clic : collez du CSV et obtenez un tableau JSON d'objets avec les clés de la ligne d'en-tête, ou collez un tableau JSON et récupérez du CSV avec les valeurs contenant des virgules ou des guillemets automatiquement entourées et échappées. Le sens CSV vers JSON est volontairement simple — il découpe chaque ligne sur les virgules, ce qui fonctionne bien pour des exports classiques mais interprétera mal un champ entre guillemets contenant lui-même une virgule, comme \"Doe, John\" dans une colonne nom : cette valeur se scindera en deux colonnes au lieu de rester ensemble. Pour du CSV provenant d'un export tableur avec des virgules à l'intérieur de champs texte entre guillemets, vérifiez que le nombre de colonnes du résultat correspond à ce que vous attendez avant de vous y fier au-delà d'un coup d'œil rapide. Le sens JSON vers CSV est plus robuste, car il contrôle lui-même l'échappement.",
    },
    useCases: {
      en: ["Turning a small CSV export into JSON to paste into a script or test fixture", "Converting a JSON API response array into a CSV a non-technical colleague can open in a spreadsheet", "Quickly inspecting the shape of tabular data without writing a parsing script for a one-off task", "Reformatting sample data for documentation examples that need both CSV and JSON versions"],
      fr: ["Transformer un petit export CSV en JSON à coller dans un script ou un fixture de test", "Convertir un tableau de réponse d'API JSON en CSV qu'un collègue non technique peut ouvrir dans un tableur", "Inspecter rapidement la forme de données tabulaires sans écrire de script de parsing pour une tâche ponctuelle", "Reformater des données d'exemple pour une documentation qui a besoin des deux versions CSV et JSON"],
    },
  },
  "deduplicate-lines": {
    desc: {
      en: "Paste a list and get back only the first occurrence of each line, in its original order — duplicates found later in the list are dropped, not the earlier ones, so the order you see in the output matches the order things first appeared in the input. The case-sensitive/insensitive toggle matters more than it looks: with case-sensitive matching on, \"Apple\" and \"apple\" count as two different lines and both survive, which is correct for things like variable names but usually wrong for a list of email addresses or tags where casing is incidental. One thing this tool won't catch: it compares lines exactly as typed, so \"apple\" and \"apple \" (with a trailing space) are treated as different lines and neither gets removed — trim trailing whitespace first if your source data has inconsistent spacing, which is common in copy-pasted spreadsheet columns.",
      fr: "Collez une liste et récupérez uniquement la première occurrence de chaque ligne, dans son ordre d'origine — les doublons trouvés plus loin dans la liste sont supprimés, pas les premiers, donc l'ordre du résultat correspond à l'ordre d'apparition initial dans la saisie. Le bouton sensible/insensible à la casse compte plus qu'il n'y paraît : avec la casse sensible activée, \"Apple\" et \"apple\" comptent comme deux lignes différentes et survivent toutes les deux, ce qui est correct pour des noms de variables mais généralement faux pour une liste d'adresses e-mail ou de tags où la casse est accessoire. Une chose que cet outil ne détecte pas : il compare les lignes exactement telles que saisies, donc \"apple\" et \"apple \" (avec une espace en fin) sont traitées comme des lignes différentes et aucune n'est supprimée — retirez les espaces de fin d'abord si votre source a un espacement incohérent, ce qui arrive souvent avec des colonnes de tableur copiées-collées.",
    },
    useCases: {
      en: ["Cleaning a mailing list or contact export that accumulated duplicate entries over time", "Deduplicating a list of URLs or file paths before running a batch script against them", "Merging two lists of tags or categories without ending up with repeated entries", "Checking how many genuinely unique values a messy dataset actually contains"],
      fr: ["Nettoyer une liste de diffusion ou un export de contacts qui a accumulé des doublons avec le temps", "Dédupliquer une liste d'URLs ou de chemins de fichiers avant de lancer un script batch dessus", "Fusionner deux listes de tags ou de catégories sans se retrouver avec des entrées répétées", "Vérifier combien de valeurs réellement uniques contient un jeu de données désordonné"],
    },
  },
  "diff-viewer": {
    desc: {
      en: "Paste two versions of code or config into the two panes and the tool runs a classic longest-common-subsequence diff — the same family of algorithm behind `git diff` — to work out the minimal set of added and removed lines rather than treating the whole file as changed. Comparison is line-by-line, not character-by-character: adding a single argument to a function signature marks that whole line as removed-and-re-added (shown in red/green) rather than highlighting just the inserted characters within it, which is normal for line-oriented diff tools but different from what an IDE's inline word-diff view shows. It's useful for exactly what it's built for — comparing two versions of a config file, a function before and after a refactor, or output from two runs of a script — without needing git history or a local diff tool installed.",
      fr: "Collez deux versions de code ou de config dans les deux volets, et l'outil exécute un diff classique par plus longue sous-séquence commune — la même famille d'algorithme derrière `git diff` — pour déterminer l'ensemble minimal de lignes ajoutées et supprimées plutôt que de traiter tout le fichier comme modifié. La comparaison est ligne par ligne, pas caractère par caractère : ajouter un seul argument à une signature de fonction marque toute la ligne comme supprimée-puis-rajoutée (affichée en rouge/vert) plutôt que de surligner uniquement les caractères insérés à l'intérieur — normal pour un outil de diff orienté lignes, mais différent de ce qu'affiche la vue de diff mot à mot intégrée à un IDE. C'est utile exactement pour ce à quoi c'est destiné — comparer deux versions d'un fichier de config, une fonction avant et après un refactor, ou la sortie de deux exécutions d'un script — sans avoir besoin de l'historique git ni d'un outil de diff installé localement.",
    },
    useCases: {
      en: ["Comparing a config file before and after a deployment to spot an unintended change", "Reviewing a function's before/after state during a refactor without committing to git first", "Checking whether two versions of a generated file (build output, lockfile) actually differ", "Spotting exactly which line changed between two API response samples during debugging"],
      fr: ["Comparer un fichier de config avant et après un déploiement pour repérer un changement non voulu", "Revoir l'état avant/après d'une fonction pendant un refactor sans passer par un commit git", "Vérifier si deux versions d'un fichier généré (sortie de build, lockfile) diffèrent réellement", "Repérer exactement quelle ligne a changé entre deux échantillons de réponse API en déboguant"],
    },
  },
  "text-diff": {
    desc: {
      en: "The same line-by-line comparison engine as the code diff tool, framed for prose instead of source files: paste an original paragraph and a revised one, and see exactly which lines were added, removed, or left untouched. Because comparison happens per line rather than per word, this works best when each sentence or list item is on its own line — a whole paragraph typed as one unbroken line will show as fully removed and fully re-added the moment a single word changes inside it, which reads as far noisier than the actual edit. If you're comparing contract redlines, essay drafts, or translated text where a word-level 'track changes' view matters more than line-level, break the text into shorter lines first (one sentence per line works well) before pasting it in, so the diff can actually isolate the sentence that changed.",
      fr: "Le même moteur de comparaison ligne par ligne que l'outil de diff pour le code, mais pensé pour de la prose plutôt que du code source : collez un paragraphe original et une version révisée, et voyez exactement quelles lignes ont été ajoutées, supprimées ou laissées intactes. Comme la comparaison se fait par ligne et non par mot, ça fonctionne mieux quand chaque phrase ou élément de liste est sur sa propre ligne — un paragraphe entier tapé sur une seule ligne s'affichera comme entièrement supprimé et entièrement rajouté dès qu'un seul mot change à l'intérieur, ce qui paraît bien plus bruyant que la modification réelle. Si vous comparez des redlines de contrat, des brouillons de dissertation, ou du texte traduit où une vue « suivi des modifications » au niveau du mot compte plus qu'au niveau de la ligne, découpez d'abord le texte en lignes plus courtes (une phrase par ligne fonctionne bien) avant de le coller, pour que le diff puisse réellement isoler la phrase qui a changé.",
    },
    useCases: {
      en: ["Comparing two drafts of an article or email to see exactly which sentences changed between revisions", "Reviewing a translated document against the source structure, line by line", "Spotting what changed between two versions of terms of service or a policy document", "Checking a co-writer's edits to a shared document without a full track-changes history"],
      fr: ["Comparer deux versions d'un article ou d'un e-mail pour voir exactement quelles phrases ont changé entre les révisions", "Vérifier un document traduit par rapport à la structure source, ligne par ligne", "Repérer ce qui a changé entre deux versions de conditions d'utilisation ou d'un document de politique", "Vérifier les modifications d'un co-rédacteur sur un document partagé sans historique complet de suivi"],
    },
  },
  "env-formatter": {
    desc: {
      en: "Paste a .env file and sort keys alphabetically, remove duplicate keys (keeping the first occurrence, matching how most dotenv loaders resolve conflicts), and strip entries with empty values — each as an independent toggle. The one behavior worth knowing before you rely on this for a real project file: comments and blank lines are not preserved in the output. If your .env is organized into sections with # Database, # App-level config style headers, formatting it here will produce a flat list of KEY=value lines with those section comments gone, not reorganized underneath their original headers. For a file with meaningful comments you want to keep, sort and dedupe a copy here, then manually merge the reordered keys back into your commented original rather than replacing it outright.",
      fr: "Collez un fichier .env pour trier les clés par ordre alphabétique, supprimer les clés en double (en gardant la première occurrence, comme la plupart des chargeurs dotenv résolvent les conflits), et retirer les entrées à valeur vide — chacun étant un bouton indépendant. Le comportement à connaître avant de s'en servir sur un vrai fichier de projet : les commentaires et lignes vides ne sont pas conservés dans le résultat. Si votre .env est organisé en sections avec des en-têtes style # Database, # App, le formater ici produira une liste plate de lignes KEY=valeur, ces commentaires de section ayant disparu, pas réorganisés sous leurs en-têtes d'origine. Pour un fichier avec des commentaires que vous voulez garder, triez et dédupliquez une copie ici, puis fusionnez manuellement les clés réordonnées dans votre original commenté plutôt que de le remplacer directement.",
    },
    useCases: {
      en: ["Spotting duplicate environment variable keys that accumulated after merging branches with conflicting .env changes", "Alphabetizing a growing .env file to make a specific key faster to find during debugging", "Stripping placeholder empty-value entries left over from a .env.example before committing a real config", "Quickly comparing which keys exist across two .env files by sorting both the same way first"],
      fr: ["Repérer des clés de variables d'environnement en double accumulées après avoir fusionné des branches avec des changements .env conflictuels", "Trier alphabétiquement un fichier .env qui a grossi pour retrouver plus vite une clé précise en déboguant", "Retirer les entrées à valeur vide laissées par un .env.example avant de committer une vraie config", "Comparer rapidement quelles clés existent entre deux fichiers .env en les triant de la même façon d'abord"],
    },
  },
  "image-compressor": {
    desc: {
      en: "Drop a JPG, PNG, WebP or AVIF image, pick an output format, and adjust the quality slider (10–100) to see the compressed result and the exact size saved compared to the original — everything runs through the Canvas API in your browser. The quality slider only applies to WebP and JPEG output: PNG is a lossless format, so there's no quality dial for it, and choosing PNG for a photo is usually the wrong move for file size — re-encoding a photographic JPG or WebP into lossless PNG can produce a larger file than the original, which shows up here as a red '+X% larger' result instead of the green savings you'd expect. WebP at quality 75–85 is the sweet spot for most web use: visually close to the original, with meaningfully smaller output than an equivalent-quality JPEG.",
      fr: "Déposez une image JPG, PNG, WebP ou AVIF, choisissez un format de sortie, et ajustez le curseur de qualité (10 à 100) pour voir le résultat compressé et le poids exact économisé par rapport à l'original — tout passe par l'API Canvas dans votre navigateur. Le curseur de qualité ne s'applique qu'aux sorties WebP et JPEG : le PNG est un format sans perte, donc pas de réglage de qualité pour lui, et choisir le PNG pour une photo est généralement le mauvais choix côté poids de fichier — réencoder un JPG ou WebP photographique en PNG sans perte peut produire un fichier plus lourd que l'original, ce qui s'affiche ici en rouge « +X% plus lourd » au lieu de l'économie verte attendue. Le WebP à qualité 75-85 est le point d'équilibre pour la plupart des usages web : visuellement proche de l'original, avec un résultat nettement plus léger qu'un JPEG de qualité équivalente.",
    },
    useCases: {
      en: ["Shrinking a photo before uploading it somewhere with a strict file-size limit", "Comparing how much smaller WebP is than the original JPG at the same visual quality", "Preparing images for a web page where load time and Core Web Vitals matter", "Checking honestly whether converting to PNG actually helps or hurts a photo's file size before committing to it"],
      fr: ["Réduire une photo avant de l'envoyer quelque part avec une limite de taille de fichier stricte", "Comparer à quel point le WebP est plus léger que le JPG d'origine à qualité visuelle équivalente", "Préparer des images pour une page web où le temps de chargement et les Core Web Vitals comptent", "Vérifier honnêtement si convertir en PNG aide ou nuit réellement au poids d'une photo avant de s'y engager"],
    },
  },
  "lorem-ipsum": {
    desc: {
      en: "Generate placeholder text by word count, sentence count, or paragraph count, pulled from the classical Lorem Ipsum word list (the scrambled Latin passage that's been the default filler text in publishing since the 1960s, derived from Cicero's De Finibus). One thing worth knowing: the output is deterministic, not random — asking for '3 paragraphs' twice in a row produces the exact same text both times, because words are cycled through the source list in a fixed pattern rather than picked randomly. That's actually useful for reproducible mockups you'll revisit later, but it means this isn't the right tool if you need visibly varied dummy text across many separate elements on the same page — for that, you'd need to vary the count or paragraph type per element to get different output.",
      fr: "Générez du texte de remplissage par nombre de mots, de phrases, ou de paragraphes, tiré de la liste de mots classique du Lorem Ipsum (ce passage latin brouillé qui sert de texte de substitution par défaut dans l'édition depuis les années 1960, dérivé du De Finibus de Cicéron). Une chose à savoir : le résultat est déterministe, pas aléatoire — demander « 3 paragraphes » deux fois de suite produit exactement le même texte à chaque fois, car les mots sont parcourus dans la liste source selon un motif fixe plutôt que tirés au hasard. C'est en fait utile pour des maquettes reproductibles que vous reviendrez consulter plus tard, mais ça signifie que ce n'est pas le bon outil s'il vous faut du texte factice visiblement varié sur plusieurs éléments distincts d'une même page — pour ça, il faudrait varier le nombre ou le type de paragraphe par élément pour obtenir un résultat différent.",
    },
    useCases: {
      en: ["Filling a design mockup with realistic-length text before real copy is written", "Testing how a layout handles long vs short paragraphs by switching between word/sentence/paragraph modes", "Generating consistent placeholder text you can regenerate identically later for a style guide", "Quickly padding a component in development to check text overflow and wrapping behavior"],
      fr: ["Remplir une maquette de design avec du texte de longueur réaliste avant que le vrai contenu ne soit écrit", "Tester comment une mise en page gère des paragraphes longs ou courts en changeant entre les modes mot/phrase/paragraphe", "Générer un texte de remplissage cohérent, régénérable à l'identique plus tard pour un guide de style", "Remplir rapidement un composant en développement pour vérifier le débordement de texte et le retour à la ligne"],
    },
  },
  "og-checker": {
    desc: {
      en: "Enter a URL and this fetches the page through a server-side proxy (necessary because browsers block cross-origin reads of another site's HTML) to pull every Open Graph tag, Twitter Card tag, and standard SEO tag — title, description, canonical, robots — into one readable list, with the og:image itself rendered so you can see exactly what a shared link preview will look like. This is a network tool, not a local one: the target URL is sent to our server to fetch, though nothing about the URL or the result is logged or stored afterward. The most common thing this catches: a site with correct <title> and meta description but a missing or relative og:image path, which silently breaks the preview image on Slack, Discord, and social shares even though the page itself looks completely normal in a browser.",
      fr: "Entrez une URL et l'outil récupère la page via un proxy côté serveur (nécessaire car les navigateurs bloquent la lecture cross-origin du HTML d'un autre site) pour extraire chaque balise Open Graph, balise Twitter Card, et balise SEO standard — title, description, canonical, robots — dans une liste lisible, avec l'og:image lui-même affiché pour voir exactement à quoi ressemblera un aperçu de lien partagé. C'est un outil réseau, pas local : l'URL cible est envoyée à notre serveur pour être récupérée, même si rien concernant l'URL ou le résultat n'est journalisé ni stocké ensuite. Le cas le plus fréquent que ça détecte : un site avec un <title> et une meta description corrects mais un chemin og:image manquant ou relatif, ce qui casse silencieusement l'image d'aperçu sur Slack, Discord et les partages sociaux alors que la page elle-même paraît parfaitement normale dans un navigateur.",
    },
    useCases: {
      en: ["Checking why a link preview looks broken or blank when shared on Slack, Discord or social media", "Verifying Open Graph tags were correctly deployed after a CMS or template change", "Auditing a competitor's or client's page for missing social sharing metadata", "Confirming the exact title and description Google or a chat app will pull for a page before it goes live"],
      fr: ["Vérifier pourquoi un aperçu de lien apparaît cassé ou vide en partage sur Slack, Discord ou les réseaux sociaux", "Vérifier que les balises Open Graph ont été correctement déployées après un changement de CMS ou de template", "Auditer une page concurrente ou client pour des métadonnées de partage social manquantes", "Confirmer le titre et la description exacts que Google ou une app de chat récupéreront pour une page avant sa mise en ligne"],
    },
  },
  "schema-generator": {
    desc: {
      en: "Fill in a form for one of four schema types — Article, Product, FAQPage, or BreadcrumbList — and get valid JSON-LD structured data back, ready to paste into a <script type=\"application/ld+json\"> tag. What this tool guarantees is syntactic correctness: the output is always valid JSON matching schema.org's vocabulary for that type. What it can't guarantee is rich-result eligibility, which is a separate, stricter bar Google sets per type — a Product schema here covers name, description and price/availability, but Google's Merchant rich snippet guidelines often also expect fields like aggregateRating or review to actually trigger a star-rating rich result in search. Always run the generated markup through Google's Rich Results Test before deploying it; valid JSON-LD and an eligible rich result are two different things, and only the second one changes how your page looks in search.",
      fr: "Remplissez un formulaire pour l'un des quatre types de schema — Article, Product, FAQPage, ou BreadcrumbList — et récupérez des données structurées JSON-LD valides, prêtes à coller dans une balise <script type=\"application/ld+json\">. Ce que cet outil garantit, c'est la correction syntaxique : le résultat est toujours du JSON valide respectant le vocabulaire schema.org pour ce type. Ce qu'il ne peut pas garantir, c'est l'éligibilité aux résultats enrichis, une barre séparée et plus stricte que Google fixe par type — un schema Product ici couvre nom, description et prix/disponibilité, mais les consignes Google Merchant pour les extraits enrichis attendent souvent aussi des champs comme aggregateRating ou review pour réellement déclencher un résultat enrichi avec étoiles dans la recherche. Testez toujours le balisage généré avec le Rich Results Test de Google avant de le déployer ; un JSON-LD valide et un résultat enrichi éligible sont deux choses différentes, et seule la seconde change l'apparence de votre page dans les résultats de recherche.",
    },
    useCases: {
      en: ["Generating FAQPage JSON-LD from an existing list of questions and answers without hand-writing the nesting", "Building BreadcrumbList markup that matches a site's actual navigation hierarchy", "Creating a starting Article schema for a blog post, then extending it with fields this form doesn't cover", "Producing syntactically correct Product JSON-LD to test in Google's Rich Results Test before adding the extra fields it flags as missing"],
      fr: ["Générer du JSON-LD FAQPage à partir d'une liste existante de questions-réponses sans écrire l'imbrication à la main", "Construire un balisage BreadcrumbList qui correspond à la hiérarchie de navigation réelle d'un site", "Créer un schema Article de départ pour un article de blog, puis l'étendre avec des champs que ce formulaire ne couvre pas", "Produire du JSON-LD Product syntaxiquement correct à tester dans le Rich Results Test de Google avant d'ajouter les champs manquants qu'il signale"],
    },
  },
  "sitemap-generator": {
    desc: {
      en: "Paste one URL per line and this wraps each one in valid sitemap XML with a shared lastmod date, changefreq and priority applied uniformly across every URL in the batch — there's no per-URL override, so a homepage and a rarely updated legal page both get the same priority value unless you generate them in separate batches and merge the files by hand. Worth knowing before you spend time fine-tuning priority values: Google has stated for years that it largely ignores changefreq and priority as ranking or crawling signals, treating them as weak hints at best — lastmod is the one field that's still genuinely useful, and only when it's accurate, since Google uses it to decide whether a URL is worth recrawling. A sitemap with a fake or copy-pasted lastmod on every URL is arguably worse than omitting the field entirely.",
      fr: "Collez une URL par ligne et l'outil enveloppe chacune dans un XML de sitemap valide avec une date lastmod, un changefreq et une priorité partagés, appliqués uniformément à toutes les URLs du lot — pas de surcharge par URL, donc une page d'accueil et une page légale rarement mise à jour reçoivent la même valeur de priorité, sauf à générer des lots séparés et fusionner les fichiers à la main. Bon à savoir avant de passer du temps à peaufiner les valeurs de priorité : Google déclare depuis des années qu'il ignore largement changefreq et priority comme signaux de classement ou de crawl, les traitant au mieux comme des indices faibles — lastmod reste le seul champ réellement utile, et seulement s'il est exact, puisque Google s'en sert pour décider si une URL mérite d'être recrawlée. Un sitemap avec un lastmod inventé ou copié-collé sur toutes les URLs est sans doute pire que d'omettre complètement ce champ.",
    },
    useCases: {
      en: ["Generating a first sitemap.xml for a new site launch from a manually compiled URL list", "Producing a supplementary sitemap for a set of URLs a CMS-generated sitemap missed", "Quickly checking what valid sitemap XML syntax looks like before writing a script to generate one dynamically", "Creating a small sitemap for a static site or landing page that doesn't have a build-time sitemap generator"],
      fr: ["Générer un premier sitemap.xml pour le lancement d'un nouveau site à partir d'une liste d'URLs compilée manuellement", "Produire un sitemap complémentaire pour un ensemble d'URLs qu'un sitemap généré par CMS aurait manqué", "Vérifier rapidement à quoi ressemble une syntaxe XML de sitemap valide avant d'écrire un script pour en générer un dynamiquement", "Créer un petit sitemap pour un site statique ou une landing page sans générateur de sitemap au build"],
    },
  },
  "slug-generator": {
    desc: {
      en: "Type a title and get a URL-safe slug back instantly: accented Latin characters are normalized and stripped (é, à, ü, ñ all convert to their plain-ASCII base letter), everything is lowercased, and any character that isn't a letter, number or your chosen separator gets removed before spaces collapse into hyphens or underscores. This handles Latin-alphabet diacritics well — French, Spanish, German, Portuguese titles convert cleanly — but it isn't a transliteration engine: a title written in Cyrillic, Arabic, Greek or CJK characters falls outside the regex's allowed range entirely and gets stripped rather than converted to a Latin equivalent, which can leave you with an empty or near-empty slug. For non-Latin-script content, a proper transliteration library (not simple character filtering) is the right tool, not this one.",
      fr: "Tapez un titre et récupérez instantanément un slug compatible URL : les caractères latins accentués sont normalisés et retirés (é, à, ü, ñ se convertissent tous vers leur lettre ASCII de base), tout est mis en minuscules, et tout caractère qui n'est ni une lettre, ni un chiffre, ni le séparateur choisi est supprimé avant que les espaces ne se transforment en tirets ou underscores. Ça gère bien les diacritiques de l'alphabet latin — les titres français, espagnols, allemands, portugais se convertissent proprement — mais ce n'est pas un moteur de translittération : un titre écrit en cyrillique, arabe, grec ou caractères CJK sort entièrement de la plage autorisée par l'expression régulière et se voit supprimé plutôt que converti vers un équivalent latin, ce qui peut laisser un slug vide ou quasi vide. Pour du contenu en écriture non latine, une vraie bibliothèque de translittération (pas un simple filtrage de caractères) est le bon outil, pas celui-ci.",
    },
    useCases: {
      en: ["Generating a clean URL slug from a blog post title before publishing", "Converting a French or Spanish title with accents into an ASCII-safe URL path", "Creating consistent file names or IDs from user-submitted titles", "Quickly checking what a title will look like as a URL before committing to it in a CMS"],
      fr: ["Générer un slug d'URL propre à partir d'un titre d'article de blog avant publication", "Convertir un titre français ou espagnol avec accents en chemin d'URL compatible ASCII", "Créer des noms de fichiers ou des IDs cohérents à partir de titres saisis par des utilisateurs", "Vérifier rapidement à quoi ressemblera un titre en URL avant de le valider dans un CMS"],
    },
  },
  "string-escape": {
    desc: {
      en: "Three languages (JavaScript, SQL, Bash), each direction (escape or unescape), each with rules specific to that context rather than one generic escaping scheme: JS mode handles backslashes, quotes, and \\n/\\r/\\t control characters; SQL mode doubles single quotes ('') per the ANSI-SQL standard that MySQL, PostgreSQL and SQLite all honor; Bash mode escapes backslashes, double quotes, $ and backticks, the characters that trigger variable expansion or command substitution inside a double-quoted shell string. One important boundary: SQL escaping here makes a string literal safe to drop into a query you're writing by hand — it is not a substitute for parameterized queries or prepared statements in application code. Manual string escaping is a known-fragile defense against SQL injection precisely because it's easy to miss an edge case; use it for one-off scripts and ad hoc queries, never as the injection defense in a production codebase.",
      fr: "Trois langages (JavaScript, SQL, Bash), chaque sens (échapper ou dé-échapper), chacun avec des règles spécifiques à son contexte plutôt qu'un schéma d'échappement générique unique : le mode JS gère les antislashs, les guillemets, et les caractères de contrôle \\n/\\r/\\t ; le mode SQL double les guillemets simples ('') selon le standard ANSI-SQL que respectent MySQL, PostgreSQL et SQLite ; le mode Bash échappe les antislashs, les guillemets doubles, le $ et les backticks, les caractères qui déclenchent l'expansion de variable ou la substitution de commande dans une chaîne shell entre guillemets doubles. Une frontière importante : l'échappement SQL ici rend une chaîne littérale sûre à insérer dans une requête écrite à la main — ce n'est pas un substitut aux requêtes paramétrées ou aux instructions préparées dans du code applicatif. L'échappement manuel de chaînes est une défense reconnue comme fragile contre l'injection SQL, précisément parce qu'il est facile de manquer un cas limite ; utilisez-le pour des scripts ponctuels et des requêtes ad hoc, jamais comme défense contre l'injection dans une base de code de production.",
    },
    useCases: {
      en: ["Safely embedding a string containing quotes into a one-off SQL query run manually in a database console", "Escaping a variable value before dropping it into a bash script that shouldn't break on special characters", "Preparing a JSON string value that contains quotes and newlines for a JS source file or config", "Unescaping a string copied from a log file back into its original readable form"],
      fr: ["Insérer en toute sécurité une chaîne contenant des guillemets dans une requête SQL ponctuelle exécutée manuellement dans une console de base de données", "Échapper une valeur de variable avant de l'insérer dans un script bash qui ne doit pas casser sur des caractères spéciaux", "Préparer une valeur de chaîne JSON contenant des guillemets et des sauts de ligne pour un fichier source JS ou une config", "Dé-échapper une chaîne copiée depuis un fichier de log pour retrouver sa forme lisible d'origine"],
    },
  },
  "svg-optimizer": {
    desc: {
      en: "Runs SVGO — the same optimization engine used by build tools like vite-imagetools and many icon pipelines — entirely in your browser via preset-default, with optional toggles to also strip comments, metadata and editor-specific namespace data (the <!-- Generated by Figma --> and data-name=\"Layer_1\" cruft design tools leave behind). The size reduction shown (often 30–60% on icons exported from Figma or Illustrator) mostly comes from removing exactly that kind of unused markup, not from degrading the image. One thing to actually verify rather than assume: SVGO's preset-default is intentionally aggressive — it can merge paths, drop attributes it judges redundant, or convert shapes to path data, and in edge cases (very precise strokes, specific fill-rule behavior) that rewriting can shift how the SVG renders. Always look at the optimized output before shipping it, especially for icons where a pixel of stroke width actually matters.",
      fr: "Exécute SVGO — le même moteur d'optimisation utilisé par des outils de build comme vite-imagetools et de nombreux pipelines d'icônes — entièrement dans votre navigateur via preset-default, avec des options pour aussi retirer les commentaires, les métadonnées et les données de namespace spécifiques aux éditeurs (le <!-- Generated by Figma --> et le data-name=\"Layer_1\" que laissent les outils de design). La réduction de poids affichée (souvent 30 à 60% sur des icônes exportées de Figma ou Illustrator) vient surtout de la suppression de ce type de balisage inutile, pas d'une dégradation de l'image. Une chose à vérifier réellement plutôt qu'à supposer : le preset-default de SVGO est volontairement agressif — il peut fusionner des chemins, retirer des attributs qu'il juge redondants, ou convertir des formes en données de chemin, et dans des cas limites (traits très précis, comportement spécifique de fill-rule), cette réécriture peut modifier le rendu du SVG. Regardez toujours le résultat optimisé avant de le déployer, surtout pour des icônes où un pixel d'épaisseur de trait compte vraiment.",
    },
    useCases: {
      en: ["Cleaning up an icon exported from Figma or Illustrator before adding it to a component library", "Reducing the file size of SVG assets bundled into a web app to improve load time", "Stripping editor metadata and comments from SVGs before committing them to version control", "Checking exactly how much of an SVG's file size was unused design-tool cruft versus actual path data"],
      fr: ["Nettoyer une icône exportée de Figma ou Illustrator avant de l'ajouter à une bibliothèque de composants", "Réduire le poids de fichiers SVG intégrés à une app web pour améliorer le temps de chargement", "Retirer les métadonnées et commentaires d'éditeur des SVG avant de les committer dans le contrôle de version", "Vérifier exactement quelle part du poids d'un fichier SVG était du superflu d'outil de design plutôt que de vraies données de chemin"],
    },
  },
  "zip-extractor": {
    desc: {
      en: "Drop a .zip file and it's unpacked entirely in your browser using fflate, a WebAssembly-adjacent decompression library — no upload, and the archive is read into memory via the File API rather than sent anywhere. Folders sort to the top, each file shows its uncompressed size, and any entry can be downloaded individually without extracting the whole archive first. Two real constraints worth knowing before you rely on this for something important: it doesn't support password-protected or encrypted zip entries (fflate's unzip has no AES or ZipCrypto decryption), so an encrypted archive will fail to read rather than prompt for a password; and because the whole file is loaded into memory at once rather than streamed, a multi-gigabyte archive can hit your browser's memory limit on lower-end devices even though it would extract fine with a desktop archive manager.",
      fr: "Déposez un fichier .zip et il est décompressé entièrement dans votre navigateur via fflate, une bibliothèque de décompression proche du WebAssembly — aucun envoi, l'archive est lue en mémoire via l'API File plutôt qu'envoyée où que ce soit. Les dossiers remontent en haut, chaque fichier affiche sa taille décompressée, et n'importe quelle entrée peut être téléchargée individuellement sans extraire toute l'archive d'abord. Deux vraies contraintes à connaître avant de s'y fier pour quelque chose d'important : pas de support des entrées zip protégées par mot de passe ou chiffrées (l'unzip de fflate n'a pas de déchiffrement AES ou ZipCrypto), donc une archive chiffrée échouera à la lecture plutôt que de demander un mot de passe ; et comme tout le fichier est chargé en mémoire d'un coup plutôt qu'en streaming, une archive de plusieurs gigaoctets peut atteindre la limite mémoire du navigateur sur des appareils moins puissants, même si elle s'extrairait sans problème avec un gestionnaire d'archives de bureau.",
    },
    useCases: {
      en: ["Peeking inside a .zip attachment or download without installing an archive manager", "Grabbing a single file out of a large archive without extracting everything to disk", "Checking the contents and folder structure of an archive before deciding whether to download it fully", "Quickly inspecting a zipped project export or backup on a machine without extraction software"],
      fr: ["Jeter un œil dans une pièce jointe ou un téléchargement .zip sans installer de gestionnaire d'archives", "Récupérer un seul fichier dans une grosse archive sans tout extraire sur le disque", "Vérifier le contenu et la structure de dossiers d'une archive avant de décider de la télécharger en entier", "Inspecter rapidement un export de projet ou une sauvegarde zippée sur une machine sans logiciel d'extraction"],
    },
  },
};
