import type { Lang } from "./types";

// Pilote pSEO « paires PDF » (docs/seo-geo/seo-programmatique.md).
// Règles identiques au pilote paires image : uniquement des paires que le
// workspace PdfConverter sait vraiment faire (deux modes réels : PDF → images
// en PNG/JPEG, et images → PDF depuis JPG/PNG/WebP/AVIF), et uniquement des
// requêtes confirmées par Google Suggest (docs/seo-geo/suggest-2026-07-04.csv).
// "pdf to word/docx/excel/ppt" sont les requêtes les plus demandées de tout le
// scan mais l'outil ne fait AUCUNE conversion vers un document éditable — ces
// pages n'existent donc pas, garde-fou "l'outil fait vraiment le travail".

export type PdfPairMode = "pdf-to-images" | "images-to-pdf";
export type PdfImgFormat = "png" | "jpeg";

export interface PdfPairFaq {
  q: Record<Lang, string>;
  a: Record<Lang, string>;
}

export interface PdfPair {
  slug: string;
  from: string;
  to: string;
  mode: PdfPairMode;
  /** Uniquement pour mode "pdf-to-images" */
  imgFormat?: PdfImgFormat;
  /** Phrase-réponse d'ouverture — autonome, citable telle quelle */
  why: Record<Lang, string>;
  /** Points différenciants concrets (pas du remplissage) */
  points: Record<Lang, string[]>;
  faq: PdfPairFaq[];
}

export const PDF_PAIRS: PdfPair[] = [
  {
    slug: "pdf-to-png",
    from: "pdf",
    to: "png",
    mode: "pdf-to-images",
    imgFormat: "png",
    why: {
      en: "Converting each page of a PDF to PNG produces a lossless, sharp image of every page — the right choice when a page contains diagrams, screenshots or text that needs to stay perfectly crisp, since PNG doesn't introduce the compression artifacts JPG does.",
      fr: "Convertir chaque page d'un PDF en PNG produit une image sans perte et nette de chaque page — le bon choix quand une page contient des diagrammes, captures d'écran ou du texte qui doit rester parfaitement net, le PNG n'introduisant pas les artefacts de compression du JPG.",
    },
    points: {
      en: [
        "Rendering happens through PDF.js, the same engine Firefox uses for its built-in PDF viewer — the actual page content is redrawn at the resolution you choose, not a screenshot of a preview.",
        "Pick 2× or 3× scale for pages headed to print or a large screen; 1× is enough for a quick web thumbnail and keeps file size down.",
        "Every page becomes a separate PNG file, downloaded individually or all at once — there's no combined multi-page PNG format, each page stays its own image.",
      ],
      fr: [
        "Le rendu passe par PDF.js, le même moteur que celui utilisé par Firefox pour sa visionneuse PDF intégrée — le contenu réel de la page est redessiné à la résolution choisie, pas une capture d'un aperçu.",
        "Choisissez une échelle 2× ou 3× pour des pages destinées à l'impression ou un grand écran ; 1× suffit pour une miniature web rapide et garde un poids de fichier réduit.",
        "Chaque page devient un fichier PNG séparé, téléchargeable individuellement ou en une fois — il n'existe pas de format PNG multi-page combiné, chaque page reste sa propre image.",
      ],
    },
    faq: [
      {
        q: { en: "Will text in the PDF stay sharp after converting to PNG?", fr: "Le texte du PDF reste-t-il net après conversion en PNG ?" },
        a: {
          en: "Yes — PNG is lossless, so whatever PDF.js renders at your chosen scale is preserved exactly, with no compression blur. Pick a higher scale (2× or 3×) if the page will be zoomed in or printed.",
          fr: "Oui — le PNG est sans perte, donc ce que PDF.js restitue à l'échelle choisie est préservé exactement, sans flou de compression. Choisissez une échelle plus élevée (2× ou 3×) si la page sera zoomée ou imprimée.",
        },
      },
      {
        q: { en: "Why is my PNG file so much larger than the original PDF page?", fr: "Pourquoi mon fichier PNG est-il tellement plus lourd que la page PDF d'origine ?" },
        a: {
          en: "A PDF page stores compact vector instructions (draw this line, place this text); a PNG stores every pixel. Rendering even one page at 2× scale can produce a file several times heavier than the whole source PDF, especially for text-heavy pages.",
          fr: "Une page PDF stocke des instructions vectorielles compactes (tracer cette ligne, placer ce texte) ; un PNG stocke chaque pixel. Restituer même une seule page à l'échelle 2× peut produire un fichier plusieurs fois plus lourd que le PDF source entier, surtout pour des pages riches en texte.",
        },
      },
    ],
  },
  {
    slug: "pdf-to-jpg",
    from: "pdf",
    to: "jpg",
    mode: "pdf-to-images",
    imgFormat: "jpeg",
    why: {
      en: "Converting PDF pages to JPG is the right call when you need small, universally compatible image files — for a slide deck, a web gallery, or attaching pages to an email — and don't need pixel-perfect sharpness on fine text.",
      fr: "Convertir des pages PDF en JPG est le bon choix quand il faut des fichiers image légers et universellement compatibles — pour une présentation, une galerie web, ou joindre des pages à un e-mail — sans avoir besoin d'une netteté parfaite sur du texte fin.",
    },
    points: {
      en: [
        "JPG has no transparency channel, so PDF.js renders each page onto a solid white background before exporting — matches how a printed page looks, but a PDF designed with a non-white canvas won't come through as expected.",
        "File size stays much smaller than the PNG equivalent, particularly for pages with photos or gradients, at the cost of some compression softening on small text at 1× scale.",
        "Use 2× or 3× scale specifically to keep small text legible — JPG compression artifacts are far more noticeable on fine detail rendered at low resolution.",
      ],
      fr: [
        "Le JPG n'a pas de canal de transparence, donc PDF.js restitue chaque page sur un fond blanc uni avant l'export — correspond à l'apparence d'une page imprimée, mais un PDF conçu avec un fond non blanc ne rendra pas comme attendu.",
        "Le poids du fichier reste bien plus faible que l'équivalent PNG, en particulier pour des pages avec photos ou dégradés, au prix d'un léger adoucissement de compression sur du petit texte à l'échelle 1×.",
        "Utilisez l'échelle 2× ou 3× spécifiquement pour garder le petit texte lisible — les artefacts de compression JPG sont bien plus visibles sur du détail fin restitué à basse résolution.",
      ],
    },
    faq: [
      {
        q: { en: "Why does small text look blurry in my JPG export?", fr: "Pourquoi le petit texte paraît-il flou dans mon export JPG ?" },
        a: {
          en: "JPG compression targets photographic detail and is less forgiving of sharp edges like text. At 1× scale, small text can pick up visible softening — re-export at 2× or 3× scale, the extra resolution gives the compression more detail to work with before it becomes visible.",
          fr: "La compression JPG cible le détail photographique et pardonne moins les bords nets comme le texte. À l'échelle 1×, le petit texte peut s'adoucir visiblement — réexportez à l'échelle 2× ou 3×, la résolution supplémentaire donne plus de détail à la compression avant que ça ne devienne visible.",
        },
      },
      {
        q: { en: "What happens to a PDF page with a transparent or colored background?", fr: "Que devient une page PDF avec un fond transparent ou coloré ?" },
        a: {
          en: "JPG doesn't support transparency, so any transparent area is filled with white during rendering, the same way it would look printed on paper.",
          fr: "Le JPG ne gère pas la transparence, donc toute zone transparente est remplie en blanc lors du rendu, comme elle apparaîtrait imprimée sur papier.",
        },
      },
    ],
  },
  {
    slug: "jpg-to-pdf",
    from: "jpg",
    to: "pdf",
    mode: "images-to-pdf",
    why: {
      en: "Turning one or more JPG photos into a single PDF is the standard way to bundle scanned documents or photographed pages into one file that opens identically everywhere, instead of sending a folder of separate images.",
      fr: "Transformer une ou plusieurs photos JPG en un seul PDF est la façon standard de regrouper des documents scannés ou des pages photographiées en un seul fichier qui s'ouvre à l'identique partout, plutôt que d'envoyer un dossier d'images séparées.",
    },
    points: {
      en: [
        "Each image becomes exactly one page, sized to match that image's own dimensions — a mix of portrait and landscape photos produces a PDF with differently sized pages, not a forced uniform page size.",
        "Pages are added in the order you selected or dropped the files, so name your files so they sort correctly (page-01.jpg, page-02.jpg…) before uploading if order matters.",
        "The JPG compression already applied to your photos is kept as-is — this tool embeds the image bytes into the PDF, it doesn't re-encode or re-compress them further.",
      ],
      fr: [
        "Chaque image devient exactement une page, dimensionnée selon les dimensions propres de cette image — un mélange de photos portrait et paysage produit un PDF avec des pages de tailles différentes, pas une taille de page uniforme forcée.",
        "Les pages sont ajoutées dans l'ordre où les fichiers ont été sélectionnés ou déposés, donc nommez vos fichiers pour qu'ils se trient correctement (page-01.jpg, page-02.jpg…) avant l'envoi si l'ordre compte.",
        "La compression JPG déjà appliquée à vos photos est conservée telle quelle — cet outil intègre les octets de l'image dans le PDF, il ne les ré-encode ni ne les recompresse.",
      ],
    },
    faq: [
      {
        q: { en: "Can I control the order of pages in the final PDF?", fr: "Puis-je contrôler l'ordre des pages dans le PDF final ?" },
        a: {
          en: "Pages follow the order the images were added in. If your files aren't already named so they sort correctly, rename them (page-01.jpg, page-02.jpg, etc.) before selecting them, since there's no drag-to-reorder step after upload.",
          fr: "Les pages suivent l'ordre dans lequel les images ont été ajoutées. Si vos fichiers ne sont pas déjà nommés pour se trier correctement, renommez-les (page-01.jpg, page-02.jpg, etc.) avant de les sélectionner, car il n'y a pas d'étape de réordonnancement par glisser-déposer après l'envoi.",
        },
      },
      {
        q: { en: "Will combining photos into a PDF make the file bigger than the photos themselves?", fr: "Combiner des photos en PDF rend-il le fichier plus lourd que les photos elles-mêmes ?" },
        a: {
          en: "Only slightly — the JPG data is embedded as-is, not re-compressed, so the PDF's size is roughly the sum of your source images plus a small amount of PDF structure overhead.",
          fr: "Seulement légèrement — les données JPG sont intégrées telles quelles, sans recompression, donc le poids du PDF correspond à peu près à la somme de vos images source plus une petite charge de structure PDF.",
        },
      },
    ],
  },
  {
    slug: "png-to-pdf",
    from: "png",
    to: "pdf",
    mode: "images-to-pdf",
    why: {
      en: "Converting PNG images to a single PDF keeps lossless quality intact while producing one file to send instead of several — a common need for screenshots, diagrams or scanned pages saved as PNG.",
      fr: "Convertir des images PNG en un seul PDF conserve la qualité sans perte tout en produisant un seul fichier à envoyer plutôt que plusieurs — un besoin courant pour des captures d'écran, diagrammes ou pages scannées enregistrées en PNG.",
    },
    points: {
      en: [
        "Because PNG is lossless, nothing is degraded when the image is embedded into the PDF — the page looks exactly as sharp as the source PNG at its native resolution.",
        "PNG files are typically heavier than JPG for photographic content, so a multi-page PDF built entirely from photo PNGs can end up considerably larger than the equivalent JPG-based PDF — worth converting genuinely photographic PNGs to JPG first if file size matters more than pixel-perfect quality.",
        "Transparency in a source PNG isn't preserved once placed on a PDF page — a page has no transparency concept of its own, so a transparent PNG renders against whatever background the PDF viewer shows.",
      ],
      fr: [
        "Le PNG étant sans perte, rien n'est dégradé lorsque l'image est intégrée au PDF — la page reste exactement aussi nette que le PNG source à sa résolution native.",
        "Les fichiers PNG sont généralement plus lourds que le JPG pour du contenu photographique, donc un PDF multi-page construit entièrement à partir de PNG photographiques peut devenir bien plus volumineux que l'équivalent basé sur du JPG — mieux vaut convertir d'abord en JPG les PNG réellement photographiques si le poids compte plus qu'une qualité parfaite.",
        "La transparence d'un PNG source n'est pas préservée une fois placée sur une page PDF — une page n'a pas de notion de transparence propre, donc un PNG transparent s'affiche sur le fond que montre la visionneuse PDF.",
      ],
    },
    faq: [
      {
        q: { en: "Should I use PNG or JPG when building a PDF from photos?", fr: "Faut-il utiliser PNG ou JPG pour construire un PDF à partir de photos ?" },
        a: {
          en: "JPG, in most cases — it's built for photographic compression and keeps the resulting PDF much smaller. Reach for PNG here only when the source images are screenshots, diagrams or scanned text where lossless quality actually matters.",
          fr: "Le JPG, dans la plupart des cas — il est conçu pour la compression photographique et garde le PDF résultant bien plus léger. Ne préférez le PNG ici que lorsque les images source sont des captures d'écran, diagrammes ou texte scanné où la qualité sans perte compte réellement.",
        },
      },
      {
        q: { en: "What happens to a PNG's transparency in the resulting PDF page?", fr: "Que devient la transparence d'un PNG dans la page PDF résultante ?" },
        a: {
          en: "It isn't preserved meaningfully — a PDF page doesn't have a transparency channel, so transparent areas of the source PNG show through as whatever background the PDF viewer displays, not as true transparency in the file.",
          fr: "Elle n'est pas préservée de façon utile — une page PDF n'a pas de canal de transparence, donc les zones transparentes du PNG source apparaissent avec le fond qu'affiche la visionneuse PDF, pas comme une vraie transparence dans le fichier.",
        },
      },
    ],
  },
  {
    slug: "webp-to-pdf",
    from: "webp",
    to: "pdf",
    mode: "images-to-pdf",
    why: {
      en: "WebP images downloaded from the web often need to end up in a PDF for a report, an application, or an archive — this converts them directly, decoding WebP with the browser's native support before embedding each one as a PDF page.",
      fr: "Les images WebP téléchargées depuis le web doivent souvent finir dans un PDF pour un rapport, un dossier de candidature, ou une archive — ceci les convertit directement, en décodant le WebP grâce au support natif du navigateur avant d'intégrer chacune comme page PDF.",
    },
    points: {
      en: [
        "The browser decodes the WebP internally before it's embedded, so there's no separate conversion step to run first — drop the WebP files in directly.",
        "Because WebP is usually more compressed than an equivalent JPG or PNG, expect the resulting PDF to be noticeably lighter than one built from the same images re-saved as PNG.",
        "Transparency in a WebP source isn't preserved on the PDF page, the same limitation as PNG — a PDF page has no transparency channel of its own.",
      ],
      fr: [
        "Le navigateur décode le WebP en interne avant son intégration, donc pas d'étape de conversion séparée à faire d'abord — déposez directement les fichiers WebP.",
        "Le WebP étant généralement plus compressé qu'un JPG ou PNG équivalent, attendez-vous à un PDF résultant nettement plus léger qu'un PDF construit à partir des mêmes images réenregistrées en PNG.",
        "La transparence d'un WebP source n'est pas préservée sur la page PDF, la même limite que pour le PNG — une page PDF n'a pas de canal de transparence propre.",
      ],
    },
    faq: [
      {
        q: { en: "Do I need to convert my WebP files to JPG or PNG first?", fr: "Faut-il d'abord convertir mes fichiers WebP en JPG ou PNG ?" },
        a: {
          en: "No — the browser decodes WebP natively, so this tool accepts WebP files directly and embeds them into the PDF without a separate conversion step.",
          fr: "Non — le navigateur décode le WebP nativement, donc cet outil accepte directement les fichiers WebP et les intègre dans le PDF sans étape de conversion séparée.",
        },
      },
      {
        q: { en: "Will the resulting PDF be smaller than one built from PNG versions of the same images?", fr: "Le PDF résultant sera-t-il plus léger qu'un PDF construit à partir des versions PNG des mêmes images ?" },
        a: {
          en: "Usually, yes. WebP typically compresses more efficiently than PNG for the same visual content, and that smaller size carries through to the embedded PDF pages.",
          fr: "Généralement oui. Le WebP compresse habituellement plus efficacement que le PNG pour un même contenu visuel, et ce poids réduit se répercute sur les pages PDF intégrées.",
        },
      },
    ],
  },
  {
    slug: "avif-to-pdf",
    from: "avif",
    to: "pdf",
    mode: "images-to-pdf",
    why: {
      en: "AVIF is the most heavily compressed common web image format, and this converts AVIF files straight into a PDF using the browser's native AVIF decoder — useful when you've saved AVIF images from the web and need them in one shareable document.",
      fr: "L'AVIF est le format d'image web courant le plus fortement compressé, et ceci convertit des fichiers AVIF directement en PDF grâce au décodeur AVIF natif du navigateur — utile quand vous avez enregistré des images AVIF depuis le web et devez les regrouper dans un seul document partageable.",
    },
    points: {
      en: [
        "Requires a browser with native AVIF decoding (every major browser since 2024) — the decoding happens locally before the image is embedded into the PDF.",
        "AVIF's strong compression means the resulting PDF can end up noticeably smaller than the same page count built from JPG or PNG sources.",
        "As with the other image-to-PDF conversions here, transparency isn't preserved on the page — a PDF page has no transparency channel.",
      ],
      fr: [
        "Nécessite un navigateur avec décodage AVIF natif (tous les navigateurs majeurs depuis 2024) — le décodage se fait localement avant que l'image ne soit intégrée au PDF.",
        "La forte compression de l'AVIF fait que le PDF résultant peut être nettement plus léger que le même nombre de pages construit depuis des sources JPG ou PNG.",
        "Comme pour les autres conversions image vers PDF ici, la transparence n'est pas préservée sur la page — une page PDF n'a pas de canal de transparence.",
      ],
    },
    faq: [
      {
        q: { en: "Why would I need to convert AVIF to PDF instead of just keeping the images?", fr: "Pourquoi convertir de l'AVIF en PDF plutôt que de garder les images ?" },
        a: {
          en: "Mainly for bundling — turning several separate AVIF files into one PDF makes them easier to send, print or archive as a single document instead of a folder of individual image files.",
          fr: "Principalement pour regrouper — transformer plusieurs fichiers AVIF séparés en un seul PDF les rend plus faciles à envoyer, imprimer ou archiver comme un document unique plutôt qu'un dossier de fichiers image individuels.",
        },
      },
      {
        q: { en: "Does converting AVIF to PDF lose any image quality?", fr: "Convertir de l'AVIF en PDF fait-il perdre en qualité d'image ?" },
        a: {
          en: "No additional loss is introduced by this tool — the already-decoded AVIF image data is embedded into the PDF page as-is. Whatever compression the AVIF already applied remains, but nothing further degrades it.",
          fr: "Aucune perte supplémentaire n'est introduite par cet outil — les données d'image AVIF déjà décodées sont intégrées telles quelles dans la page PDF. La compression déjà appliquée par l'AVIF reste, mais rien ne la dégrade davantage.",
        },
      },
    ],
  },
];

export function findPdfPair(slug: string): PdfPair | undefined {
  return PDF_PAIRS.find((p) => p.slug === slug);
}
