import type { Lang } from "./types";

// Pilote pSEO « paires image » (docs/seo-geo/seo-programmatique.md).
// Règles : uniquement des paires que le workspace ImageConverter sait vraiment
// faire (sorties jpg/png/webp via canvas.toBlob — pas d'AVIF en sortie), et
// uniquement des requêtes confirmées par Google Suggest (scan du 2026-07-04).
// Le contenu de chaque paire est spécifique (faits sur les formats), pas un
// gabarit répété — c'est la condition pour que ces pages méritent d'exister.

export type TargetFormat = "jpg" | "png" | "webp";

export interface ConvertPairFaq {
  q: Record<Lang, string>;
  a: Record<Lang, string>;
}

export interface ConvertPair {
  slug: string;
  from: string;
  to: TargetFormat;
  /** Phrase-réponse d'ouverture — autonome, citable telle quelle */
  why: Record<Lang, string>;
  /** Points différenciants concrets (pas du remplissage) */
  points: Record<Lang, string[]>;
  faq: ConvertPairFaq[];
}

export const FORMAT_LABEL: Record<string, string> = {
  jpg: "JPG",
  png: "PNG",
  webp: "WebP",
  avif: "AVIF",
  pdf: "PDF",
};

export const CONVERT_PAIRS: ConvertPair[] = [
  {
    slug: "jpg-to-webp",
    from: "jpg",
    to: "webp",
    why: {
      en: "Converting a JPG photo to WebP typically reduces file size by 25–35% at comparable visual quality, and WebP has been supported by every major browser since 2020 — it is the standard choice for faster-loading web pages.",
      fr: "Convertir une photo JPG en WebP réduit généralement le poids du fichier de 25 à 35 % à qualité visuelle comparable, et le WebP est supporté par tous les navigateurs majeurs depuis 2020 — c'est le format standard pour des pages web plus rapides.",
    },
    points: {
      en: [
        "Smaller images mean a faster Largest Contentful Paint — a direct Core Web Vitals win for your pages.",
        "The conversion happens in your browser via the Canvas API: the photo is never uploaded anywhere.",
        "Start at quality 80 (the default): for photos it is visually indistinguishable from the original in most cases.",
      ],
      fr: [
        "Des images plus légères accélèrent le Largest Contentful Paint — un gain direct sur les Core Web Vitals.",
        "La conversion se fait dans votre navigateur via l'API Canvas : la photo n'est envoyée nulle part.",
        "Commencez à qualité 80 (le défaut) : pour des photos, le résultat est visuellement identique à l'original dans la plupart des cas.",
      ],
    },
    faq: [
      {
        q: { en: "Does converting JPG to WebP lose quality?", fr: "Convertir un JPG en WebP fait-il perdre en qualité ?" },
        a: {
          en: "WebP is a lossy format like JPG, so re-encoding always involves some loss — but at quality 80–90 it is not visible on photos. Choose 100 for the highest setting if the image will be edited again.",
          fr: "Le WebP est un format avec perte, comme le JPG : tout ré-encodage implique une légère perte — invisible sur des photos à qualité 80–90. Choisissez 100 si l'image doit être retravaillée ensuite.",
        },
      },
      {
        q: { en: "Is WebP supported everywhere?", fr: "Le WebP est-il supporté partout ?" },
        a: {
          en: "All browsers released since 2020 display WebP (Chrome, Firefox, Edge, Safari 14+). Some older desktop applications and e-mail clients still can't open it — keep a JPG copy if you need universal compatibility.",
          fr: "Tous les navigateurs sortis depuis 2020 affichent le WebP (Chrome, Firefox, Edge, Safari 14+). Certains logiciels de bureau et clients e-mail anciens ne l'ouvrent pas — gardez une copie JPG si vous visez une compatibilité universelle.",
        },
      },
    ],
  },
  {
    slug: "jpg-to-png",
    from: "jpg",
    to: "png",
    why: {
      en: "Converting a JPG to PNG stops any further quality degradation: PNG is lossless, so the image can be edited and re-saved as many times as needed without accumulating compression artifacts.",
      fr: "Convertir un JPG en PNG stoppe toute dégradation ultérieure : le PNG est un format sans perte, l'image peut être retouchée et réenregistrée autant de fois que nécessaire sans accumuler d'artefacts de compression.",
    },
    points: {
      en: [
        "PNG is accepted by every tool that exists — office suites, print workflows, old software, upload forms.",
        "Honest caveat: the conversion cannot restore detail the JPG compression already discarded — it only prevents new loss.",
        "Expect a larger file: lossless storage of photographic content costs several times the JPG size.",
      ],
      fr: [
        "Le PNG est accepté absolument partout — suites bureautiques, chaînes d'impression, vieux logiciels, formulaires d'upload.",
        "Limite honnête : la conversion ne restaure pas les détails déjà perdus par la compression JPG — elle empêche seulement toute nouvelle perte.",
        "Attendez-vous à un fichier plus lourd : stocker une photo sans perte coûte plusieurs fois la taille du JPG.",
      ],
    },
    faq: [
      {
        q: { en: "Will converting JPG to PNG improve the image quality?", fr: "Convertir un JPG en PNG améliore-t-il la qualité de l'image ?" },
        a: {
          en: "No. What the JPG compression discarded is gone permanently. PNG guarantees that nothing more is lost from this point on — useful before editing or archiving.",
          fr: "Non. Ce que la compression JPG a supprimé est perdu définitivement. Le PNG garantit seulement qu'aucune perte supplémentaire ne s'ajoutera — utile avant retouche ou archivage.",
        },
      },
      {
        q: { en: "Why is my PNG so much bigger than the JPG?", fr: "Pourquoi mon PNG est-il tellement plus lourd que le JPG ?" },
        a: {
          en: "PNG stores every pixel losslessly, which is inefficient for photos. That's the trade-off: bigger file, zero further degradation. For graphics, logos and screenshots the difference is much smaller.",
          fr: "Le PNG stocke chaque pixel sans perte, ce qui est inefficace pour des photos. C'est le compromis : fichier plus lourd, zéro dégradation future. Pour des graphiques, logos et captures d'écran, l'écart est bien plus faible.",
        },
      },
    ],
  },
  {
    slug: "png-to-webp",
    from: "png",
    to: "webp",
    why: {
      en: "Converting PNG screenshots and graphics to WebP is one of the easiest page-weight wins: WebP compresses this kind of image far more efficiently than PNG while keeping transparency.",
      fr: "Convertir des captures d'écran et graphiques PNG en WebP est l'un des gains de poids les plus faciles pour une page web : le WebP compresse ce type d'image bien plus efficacement que le PNG, tout en conservant la transparence.",
    },
    points: {
      en: [
        "Transparency (alpha channel) survives the conversion — unlike converting to JPG.",
        "Screenshots and UI graphics often shrink by 50% or more compared to the original PNG.",
        "Everything runs locally in your browser — screenshots that may contain sensitive information never leave your device.",
      ],
      fr: [
        "La transparence (couche alpha) survit à la conversion — contrairement à un passage en JPG.",
        "Les captures d'écran et graphiques d'interface perdent souvent 50 % de poids ou plus par rapport au PNG d'origine.",
        "Tout s'exécute localement dans votre navigateur — des captures potentiellement sensibles ne quittent jamais votre appareil.",
      ],
    },
    faq: [
      {
        q: { en: "Does WebP keep the PNG's transparency?", fr: "Le WebP conserve-t-il la transparence du PNG ?" },
        a: {
          en: "Yes. WebP supports an alpha channel, so transparent areas stay transparent after conversion.",
          fr: "Oui. Le WebP gère la couche alpha : les zones transparentes restent transparentes après conversion.",
        },
      },
      {
        q: { en: "What quality setting should I use for screenshots?", fr: "Quelle qualité choisir pour des captures d'écran ?" },
        a: {
          en: "For screenshots with text, use 90 or 100 — lossy compression at 80 can slightly blur small text. For photos inside the PNG, 80 is usually enough.",
          fr: "Pour des captures contenant du texte, choisissez 90 ou 100 — la compression à 80 peut légèrement flouter les petits caractères. Pour des photos, 80 suffit généralement.",
        },
      },
    ],
  },
  {
    slug: "png-to-jpg",
    from: "png",
    to: "jpg",
    why: {
      en: "Converting a photographic PNG to JPG typically divides the file size by several times: JPG compression is built for photos, and most PNG photos carry lossless weight that nobody actually needs.",
      fr: "Convertir une photo enregistrée en PNG vers le JPG divise généralement le poids du fichier par plusieurs fois : la compression JPG est conçue pour la photo, et la plupart des photos en PNG portent un surpoids sans perte dont personne n'a réellement besoin.",
    },
    points: {
      en: [
        "Ideal before e-mailing photos or uploading them to services with size limits.",
        "Transparency notice: JPG has no alpha channel — transparent areas are filled with a white background during conversion.",
        "Use quality 90 for prints and archives, 80 for web and e-mail.",
      ],
      fr: [
        "Idéal avant d'envoyer des photos par e-mail ou vers des services avec limite de taille.",
        "Attention transparence : le JPG n'a pas de couche alpha — les zones transparentes sont remplies en blanc lors de la conversion.",
        "Choisissez qualité 90 pour l'impression et l'archivage, 80 pour le web et l'e-mail.",
      ],
    },
    faq: [
      {
        q: { en: "What happens to transparent areas when converting PNG to JPG?", fr: "Que deviennent les zones transparentes en convertissant un PNG en JPG ?" },
        a: {
          en: "JPG doesn't support transparency, so this tool fills transparent areas with white. If you need transparency preserved, convert to WebP instead.",
          fr: "Le JPG ne gère pas la transparence : l'outil remplit les zones transparentes en blanc. Si la transparence doit être conservée, convertissez plutôt vers WebP.",
        },
      },
      {
        q: { en: "How much smaller will the JPG be?", fr: "Le JPG sera-t-il beaucoup plus léger ?" },
        a: {
          en: "For photographic content, expect the JPG to be several times smaller than the PNG at quality 80–90. For flat graphics with few colors, the gain is smaller and PNG or WebP may compress better.",
          fr: "Pour du contenu photographique, comptez un JPG plusieurs fois plus léger que le PNG à qualité 80–90. Pour des graphiques en aplats, le gain est moindre et le PNG ou le WebP peuvent compresser mieux.",
        },
      },
    ],
  },
  {
    slug: "webp-to-jpg",
    from: "webp",
    to: "jpg",
    why: {
      en: "Converting WebP to JPG solves one problem: compatibility. JPG opens in every application ever made, while WebP files downloaded from the web are still rejected by many older programs, e-mail clients and upload forms.",
      fr: "Convertir un WebP en JPG règle un seul problème, mais il est fréquent : la compatibilité. Le JPG s'ouvre dans tous les logiciels existants, alors que les fichiers WebP téléchargés depuis le web sont encore refusés par de nombreux programmes anciens, clients e-mail et formulaires d'upload.",
    },
    points: {
      en: [
        "The most common case: an image saved from a website won't open in your editing or office software — convert it once, use it anywhere.",
        "Your browser already decodes WebP natively, so the conversion is instant and local — no upload.",
        "Transparent WebP areas become white in the JPG (JPG has no transparency).",
      ],
      fr: [
        "Le cas le plus courant : une image enregistrée depuis un site web refuse de s'ouvrir dans votre logiciel de retouche ou bureautique — convertissez-la une fois, utilisez-la partout.",
        "Votre navigateur décode déjà le WebP nativement : la conversion est instantanée et locale — aucun envoi.",
        "Les zones transparentes du WebP deviennent blanches dans le JPG (le JPG n'a pas de transparence).",
      ],
    },
    faq: [
      {
        q: { en: "Why won't my program open WebP files?", fr: "Pourquoi mon logiciel n'ouvre-t-il pas les fichiers WebP ?" },
        a: {
          en: "WebP became common on the web around 2020, but many desktop applications, older office suites and e-mail clients never added support for it. Converting to JPG (or PNG) makes the image universally readable.",
          fr: "Le WebP s'est généralisé sur le web vers 2020, mais beaucoup d'applications de bureau, de suites bureautiques anciennes et de clients e-mail ne l'ont jamais pris en charge. Le convertir en JPG (ou PNG) rend l'image lisible partout.",
        },
      },
      {
        q: { en: "Which quality should I pick for the JPG?", fr: "Quelle qualité choisir pour le JPG ?" },
        a: {
          en: "The WebP was already lossy-compressed, so pick 90 or 100 to avoid stacking a second visible compression pass on top of it.",
          fr: "Le WebP a déjà subi une compression avec perte : choisissez 90 ou 100 pour éviter d'empiler une seconde compression visible par-dessus.",
        },
      },
    ],
  },
  {
    slug: "webp-to-png",
    from: "webp",
    to: "png",
    why: {
      en: "Converting WebP to PNG gives you a lossless, universally supported file that keeps transparency — the right choice when the image needs to go into an editor, a document or a print workflow that doesn't accept WebP.",
      fr: "Convertir un WebP en PNG produit un fichier sans perte, lisible partout et qui conserve la transparence — le bon choix quand l'image doit entrer dans un éditeur, un document ou une chaîne d'impression qui n'accepte pas le WebP.",
    },
    points: {
      en: [
        "Unlike WebP → JPG, transparency is preserved — logos and cutout images stay usable.",
        "PNG is lossless: no additional quality is lost in the conversion itself.",
        "The PNG will be larger than the WebP — that's the price of lossless universal compatibility.",
      ],
      fr: [
        "Contrairement au passage WebP → JPG, la transparence est conservée — logos et images détourées restent exploitables.",
        "Le PNG est sans perte : la conversion elle-même ne dégrade pas l'image.",
        "Le PNG sera plus lourd que le WebP — c'est le prix d'une compatibilité universelle sans perte.",
      ],
    },
    faq: [
      {
        q: { en: "Should I convert WebP to PNG or to JPG?", fr: "Convertir un WebP en PNG ou en JPG ?" },
        a: {
          en: "PNG if the image has transparency or will be edited again (lossless); JPG if it's a photo and you want the smallest universally compatible file.",
          fr: "PNG si l'image a de la transparence ou doit être retouchée (sans perte) ; JPG s'il s'agit d'une photo et que vous voulez le fichier compatible le plus léger.",
        },
      },
      {
        q: { en: "Does the conversion lose quality?", fr: "La conversion fait-elle perdre en qualité ?" },
        a: {
          en: "No — PNG is lossless, so the PNG contains exactly what your browser decoded from the WebP. Any loss already baked into the WebP obviously remains.",
          fr: "Non — le PNG est sans perte : il contient exactement ce que votre navigateur a décodé du WebP. La perte déjà présente dans le WebP, elle, reste évidemment.",
        },
      },
    ],
  },
  {
    slug: "avif-to-jpg",
    from: "avif",
    to: "jpg",
    why: {
      en: "AVIF is the newest web image format and many applications still can't open it — converting AVIF to JPG in your browser produces a file that works everywhere, without installing anything.",
      fr: "L'AVIF est le format d'image web le plus récent et beaucoup d'applications ne savent toujours pas l'ouvrir — le convertir en JPG dans votre navigateur produit un fichier lisible partout, sans rien installer.",
    },
    points: {
      en: [
        "Your browser does the AVIF decoding natively (all major browsers since 2024) — no codec or software needed.",
        "The file never leaves your device: decoding and re-encoding both happen locally.",
        "Pick quality 90+ — the AVIF was already heavily compressed, a low JPG quality would stack visible artifacts.",
      ],
      fr: [
        "Votre navigateur décode l'AVIF nativement (tous les navigateurs majeurs depuis 2024) — aucun codec ni logiciel à installer.",
        "Le fichier ne quitte jamais votre appareil : décodage et ré-encodage se font localement.",
        "Choisissez qualité 90+ — l'AVIF étant déjà fortement compressé, une qualité JPG basse empilerait des artefacts visibles.",
      ],
    },
    faq: [
      {
        q: { en: "Why do I have AVIF files I can't open?", fr: "Pourquoi ai-je des fichiers AVIF impossibles à ouvrir ?" },
        a: {
          en: "More and more websites serve AVIF because it compresses better than JPG and WebP. When you save such an image, you get an .avif file — which photo viewers, office suites and older editors often don't support yet.",
          fr: "De plus en plus de sites servent de l'AVIF car il compresse mieux que le JPG et le WebP. En enregistrant une image de ce type, vous obtenez un fichier .avif — que les visionneuses, suites bureautiques et éditeurs anciens ne gèrent souvent pas encore.",
        },
      },
      {
        q: { en: "My AVIF won't load in the tool — why?", fr: "Mon AVIF ne se charge pas dans l'outil — pourquoi ?" },
        a: {
          en: "The tool relies on your browser's native AVIF decoder. Update to a recent Chrome, Firefox, Edge or Safari (16+) and it will load.",
          fr: "L'outil s'appuie sur le décodeur AVIF natif de votre navigateur. Mettez à jour vers un Chrome, Firefox, Edge ou Safari (16+) récent et le fichier se chargera.",
        },
      },
    ],
  },
  {
    slug: "avif-to-png",
    from: "avif",
    to: "png",
    why: {
      en: "Converting AVIF to PNG produces a lossless, universally readable copy that preserves transparency — the safest format to bring a downloaded AVIF into any editor or document.",
      fr: "Convertir un AVIF en PNG produit une copie sans perte, lisible partout et qui préserve la transparence — le format le plus sûr pour amener un AVIF téléchargé dans n'importe quel éditeur ou document.",
    },
    points: {
      en: [
        "Transparency in the AVIF is kept in the PNG — choose JPG instead only for photos without transparency.",
        "PNG adds no further compression loss on top of the AVIF's.",
        "Decoding happens in your browser (all major browsers since 2024) and the file stays on your device.",
      ],
      fr: [
        "La transparence de l'AVIF est conservée dans le PNG — ne préférez le JPG que pour des photos sans transparence.",
        "Le PNG n'ajoute aucune perte de compression par-dessus celle de l'AVIF.",
        "Le décodage se fait dans votre navigateur (tous les navigateurs majeurs depuis 2024) et le fichier reste sur votre appareil.",
      ],
    },
    faq: [
      {
        q: { en: "AVIF to PNG or AVIF to JPG — which should I pick?", fr: "AVIF vers PNG ou AVIF vers JPG — que choisir ?" },
        a: {
          en: "PNG for lossless quality, transparency, or if the image will be edited; JPG for the smallest universally compatible file when it's a plain photo.",
          fr: "PNG pour la qualité sans perte, la transparence, ou si l'image sera retouchée ; JPG pour le fichier compatible le plus léger s'il s'agit d'une simple photo.",
        },
      },
      {
        q: { en: "Will the PNG be bigger than the AVIF?", fr: "Le PNG sera-t-il plus lourd que l'AVIF ?" },
        a: {
          en: "Yes, usually much bigger — AVIF is one of the most efficient compressed formats and PNG is lossless. You're trading size for universal compatibility and editability.",
          fr: "Oui, souvent beaucoup plus — l'AVIF est l'un des formats compressés les plus efficaces et le PNG est sans perte. Vous échangez du poids contre une compatibilité et une éditabilité universelles.",
        },
      },
    ],
  },
];

export function findPair(slug: string): ConvertPair | undefined {
  return CONVERT_PAIRS.find((p) => p.slug === slug);
}
