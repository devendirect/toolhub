import type { Lang } from "./types";
import type { ContentSection } from "./tools-content";

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
  /**
   * Sections de fond propres à la paire. Sans elles, ces pages ne se
   * distinguaient que par une phrase et trois puces — la définition même
   * d'une page satellite aux yeux de Google.
   */
  deepDive?: ContentSection[];
}

export const PDF_PAIRS: PdfPair[] = [
  {
    slug: "pdf-to-png",
    from: "pdf",
    to: "png",
    mode: "pdf-to-images",
    imgFormat: "png",
    why: {
      en: "Converting each page of a PDF to PNG produces a lossless, sharp image of every page, the right choice when a page contains diagrams, screenshots or text that needs to stay perfectly crisp, since PNG doesn't introduce the compression artifacts JPG does.",
      fr: "Convertir chaque page d'un PDF en PNG produit une image sans perte et nette de chaque page, le bon choix quand une page contient des diagrammes, captures d'écran ou du texte qui doit rester parfaitement net, le PNG n'introduisant pas les artefacts de compression du JPG.",
    },
    points: {
      en: [
        "Rendering happens through PDF.js, the same engine Firefox uses for its built-in PDF viewer, the actual page content is redrawn at the resolution you choose, not a screenshot of a preview.",
        "Pick 2× or 3× scale for pages headed to print or a large screen; 1× is enough for a quick web thumbnail and keeps file size down.",
        "Every page becomes a separate PNG file, downloaded individually or all at once: there's no combined multi-page PNG format, each page stays its own image.",
      ],
      fr: [
        "Le rendu passe par PDF.js, le même moteur que celui utilisé par Firefox pour sa visionneuse PDF intégrée, le contenu réel de la page est redessiné à la résolution choisie, pas une capture d'un aperçu.",
        "Choisissez une échelle 2× ou 3× pour des pages destinées à l'impression ou un grand écran ; 1× suffit pour une miniature web rapide et garde un poids de fichier réduit.",
        "Chaque page devient un fichier PNG séparé, téléchargeable individuellement ou en une fois : il n'existe pas de format PNG multi-page combiné, chaque page reste sa propre image.",
      ],
    },
    faq: [
      {
        q: { en: "Will text in the PDF stay sharp after converting to PNG?", fr: "Le texte du PDF reste-t-il net après conversion en PNG ?" },
        a: {
          en: "Yes, PNG is lossless, so whatever PDF.js renders at your chosen scale is preserved exactly, with no compression blur. Pick a higher scale (2× or 3×) if the page will be zoomed in or printed.",
          fr: "Oui, le PNG est sans perte, donc ce que PDF.js restitue à l'échelle choisie est préservé exactement, sans flou de compression. Choisissez une échelle plus élevée (2× ou 3×) si la page sera zoomée ou imprimée.",
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
    deepDive: [
      {
        h: { en: "Rasterising turns text into pixels", fr: "La rastérisation transforme le texte en pixels" },
        p: {
          en: [
          "A PDF describes a page as instructions: draw this glyph at this position in this font, stroke this vector path. Rendering produces an image by executing those instructions at a chosen resolution. What comes out is a grid of pixels with no memory of the text that produced it.",
          "That is the whole point when you need an image, and a real loss otherwise. The result cannot be searched, selected, copied or reflowed, and screen readers see nothing. If you need the text rather than a picture of it, extract it from the PDF instead of rendering the page.",
          ],
          fr: [
          "Un PDF décrit une page sous forme d'instructions : dessine ce glyphe à cette position dans cette police, trace ce chemin vectoriel. Le rendu produit une image en exécutant ces instructions à une résolution choisie. Ce qui en sort est une grille de pixels sans aucun souvenir du texte qui l'a produite.",
          "C'est exactement le but quand on veut une image, et une vraie perte sinon. Le résultat ne peut être ni recherché, ni sélectionné, ni copié, ni recomposé, et les lecteurs d'écran n'y voient rien. Si c'est le texte qu'il vous faut et non sa photographie, extrayez-le du PDF plutôt que de rendre la page.",
          ],
        },
      },
      {
        h: { en: "What the scale factor really controls", fr: "Ce que contrôle réellement le facteur d'échelle" },
        p: {
          en: [
          "A PDF page has a physical size in points, 72 to the inch. Rendering at 1× produces roughly 72 pixels per inch, which is fine for a thumbnail and too coarse for anything else, body text becomes hard to read. At 2× you get about 144, and at 3× about 216.",
          "Pick the scale from the destination, not from a wish for quality. A slide or a web page rarely needs more than 2×. Print wants far more, and an A4 page at 3× is still only about 2500 pixels wide, which is below what a printer would want at 300 dpi.",
          ],
          fr: [
          "Une page PDF a une taille physique en points, 72 par pouce. Un rendu à 1× produit environ 72 pixels par pouce, ce qui convient à une vignette et reste trop grossier pour le reste, le texte courant devient difficile à lire. À 2×, on obtient environ 144, et à 3× environ 216.",
          "Choisissez l'échelle d'après la destination, pas par désir de qualité. Une diapositive ou une page web dépasse rarement le besoin de 2×. L'impression en réclame bien plus : une page A4 à 3× ne fait encore qu'environ 2500 pixels de large, en dessous de ce qu'un imprimeur attendrait à 300 ppp.",
          ],
        },
      },
      {
        h: { en: "Why PNG rather than JPEG for pages", fr: "Pourquoi le PNG plutôt que le JPEG pour des pages" },
        p: {
          en: [
          "A rendered page is mostly flat white with sharp black glyphs and crisp vector lines, precisely the content PNG compresses well and JPEG handles badly. JPEG's artefacts cluster around high-contrast edges, so letters acquire a grey halo that is obvious at any realistic zoom.",
          "The exception is a page that is essentially one large photograph, a scanned document or a full-bleed image. There PNG produces a very heavy file for no benefit, and JPEG is the better target.",
          ],
          fr: [
          "Une page rendue est essentiellement du blanc uni avec des glyphes noirs nets et des traits vectoriels francs, précisément le contenu que le PNG compresse bien et que le JPEG traite mal. Les artefacts du JPEG se concentrent autour des contours à fort contraste : les lettres acquièrent un halo gris, évident à n'importe quel zoom réaliste.",
          "L'exception est une page constituée pour l'essentiel d'une grande photographie, d'un document scanné ou d'une image pleine page. Là, le PNG produit un fichier très lourd sans bénéfice, et le JPEG est la meilleure cible.",
          ],
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
      en: "Converting PDF pages to JPG is the right call when you need small, universally compatible image files (for a slide deck, a web gallery, or attaching pages to an email) and don't need pixel-perfect sharpness on fine text.",
      fr: "Convertir des pages PDF en JPG est le bon choix quand il faut des fichiers image légers et universellement compatibles (pour une présentation, une galerie web, ou joindre des pages à un e-mail) sans avoir besoin d'une netteté parfaite sur du texte fin.",
    },
    points: {
      en: [
        "JPG has no transparency channel, so PDF.js renders each page onto a solid white background before exporting, matches how a printed page looks, but a PDF designed with a non-white canvas won't come through as expected.",
        "File size stays much smaller than the PNG equivalent, particularly for pages with photos or gradients, at the cost of some compression softening on small text at 1× scale.",
        "Use 2× or 3× scale specifically to keep small text legible, JPG compression artifacts are far more noticeable on fine detail rendered at low resolution.",
      ],
      fr: [
        "Le JPG n'a pas de canal de transparence, donc PDF.js restitue chaque page sur un fond blanc uni avant l'export, correspond à l'apparence d'une page imprimée, mais un PDF conçu avec un fond non blanc ne rendra pas comme attendu.",
        "Le poids du fichier reste bien plus faible que l'équivalent PNG, en particulier pour des pages avec photos ou dégradés, au prix d'un léger adoucissement de compression sur du petit texte à l'échelle 1×.",
        "Utilisez l'échelle 2× ou 3× spécifiquement pour garder le petit texte lisible, les artefacts de compression JPG sont bien plus visibles sur du détail fin restitué à basse résolution.",
      ],
    },
    faq: [
      {
        q: { en: "Why does small text look blurry in my JPG export?", fr: "Pourquoi le petit texte paraît-il flou dans mon export JPG ?" },
        a: {
          en: "JPG compression targets photographic detail and is less forgiving of sharp edges like text. At 1× scale, small text can pick up visible softening, re-export at 2× or 3× scale, the extra resolution gives the compression more detail to work with before it becomes visible.",
          fr: "La compression JPG cible le détail photographique et pardonne moins les bords nets comme le texte. À l'échelle 1×, le petit texte peut s'adoucir visiblement, réexportez à l'échelle 2× ou 3×, la résolution supplémentaire donne plus de détail à la compression avant que ça ne devienne visible.",
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
    deepDive: [
      {
        h: { en: "The trade-off against PNG", fr: "L'arbitrage face au PNG" },
        p: {
          en: [
          "JPEG produces much smaller files than PNG on photographic content and much worse results on text. Since most PDF pages are mainly text, PNG is usually the better default, but a page dominated by a photograph, or a scanned document, reverses that entirely.",
          "Judge by what is actually on the page rather than by the fact that it is a PDF. A twenty-page report of tables belongs in PNG; a scanned brochure belongs in JPEG, where the size difference can be a factor of ten.",
          ],
          fr: [
          "Le JPEG produit des fichiers bien plus légers que le PNG sur du contenu photographique, et des résultats bien moins bons sur du texte. La plupart des pages PDF étant essentiellement textuelles, le PNG constitue généralement le meilleur défaut, mais une page dominée par une photographie, ou un document scanné, inverse complètement l'arbitrage.",
          "Jugez d'après ce que contient réellement la page, pas d'après le fait qu'il s'agisse d'un PDF. Un rapport de vingt pages de tableaux relève du PNG ; une brochure scannée relève du JPEG, où l'écart de poids peut atteindre un facteur dix.",
          ],
        },
      },
      {
        h: { en: "Where the halo around letters comes from", fr: "D'où vient le halo autour des lettres" },
        p: {
          en: [
          "JPEG works in the frequency domain and discards high-frequency information first. A letter is an abrupt transition between two colours, which is high frequency by definition, so the edges are exactly what the format degrades. The visible symptom is a faint grey mist along every stroke, worst on small type.",
          "Raising the quality reduces the effect without removing it, the loss happens by design rather than at a threshold. If text sharpness matters, render to PNG instead; there is no JPEG setting that matches it.",
          ],
          fr: [
          "Le JPEG travaille dans le domaine fréquentiel et écarte d'abord l'information de haute fréquence. Une lettre est une transition abrupte entre deux couleurs, donc de la haute fréquence par définition : les contours sont exactement ce que le format dégrade. Le symptôme visible est une brume grise le long de chaque trait, pire sur les petits corps.",
          "Monter la qualité atténue l'effet sans le supprimer, la perte est structurelle, pas liée à un seuil qu'on pourrait relever. Si la netteté du texte compte, rendez plutôt en PNG : aucun réglage JPEG ne l'égalera.",
          ],
        },
      },
      {
        h: { en: "Transparency and page backgrounds", fr: "Transparence et fond de page" },
        p: {
          en: [
          "JPEG has no alpha channel, so a page with a transparent background is flattened onto white. PDF pages almost always have an opaque background already, which makes this a non-issue for ordinary documents.",
          "It becomes visible with pages exported from design tools, where a logo or an element may sit on nothing. Those arrive with a white rectangle behind them. Rendering to PNG preserves the transparency if you need to composite the result onto another background.",
          ],
          fr: [
          "Le JPEG n'a pas de canal alpha : une page au fond transparent est donc aplatie sur du blanc. Les pages PDF ont presque toujours un fond opaque, ce qui rend le point sans objet pour des documents ordinaires.",
          "Cela se voit avec des pages exportées depuis des outils de création, où un logo ou un élément peut reposer sur rien. Ceux-là arrivent avec un rectangle blanc derrière eux. Un rendu en PNG préserve la transparence si vous devez composer le résultat sur un autre fond.",
          ],
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
        "Each image becomes exactly one page, sized to match that image's own dimensions, a mix of portrait and landscape photos produces a PDF with differently sized pages, not a forced uniform page size.",
        "Pages are added in the order you selected or dropped the files, so name your files so they sort correctly (page-01.jpg, page-02.jpg…) before uploading if order matters.",
        "The JPG compression already applied to your photos is kept as-is: this tool embeds the image bytes into the PDF, it doesn't re-encode or re-compress them further.",
      ],
      fr: [
        "Chaque image devient exactement une page, dimensionnée selon les dimensions propres de cette image, un mélange de photos portrait et paysage produit un PDF avec des pages de tailles différentes, pas une taille de page uniforme forcée.",
        "Les pages sont ajoutées dans l'ordre où les fichiers ont été sélectionnés ou déposés, donc nommez vos fichiers pour qu'ils se trient correctement (page-01.jpg, page-02.jpg…) avant l'envoi si l'ordre compte.",
        "La compression JPG déjà appliquée à vos photos est conservée telle quelle, cet outil intègre les octets de l'image dans le PDF, il ne les ré-encode ni ne les recompresse.",
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
          en: "Only slightly, the JPG data is embedded as-is, not re-compressed, so the PDF's size is roughly the sum of your source images plus a small amount of PDF structure overhead.",
          fr: "Seulement légèrement, les données JPG sont intégrées telles quelles, sans recompression, donc le poids du PDF correspond à peu près à la somme de vos images source plus une petite charge de structure PDF.",
        },
      },
    ],
    deepDive: [
      {
        h: { en: "One image becomes one page", fr: "Une image devient une page" },
        p: {
          en: [
          "Assembly is deliberately literal: each image you add becomes a single page, in the order you added them, and the page takes the dimensions of the image. There is no margin, no scaling to a paper size and no layout engine deciding anything on your behalf.",
          "That predictability is the point. It also means a set of photos with different dimensions produces a PDF whose pages differ in size, perfectly valid, and occasionally surprising in a viewer that shows pages side by side. Resize the images beforehand if you want a uniform document.",
          ],
          fr: [
          "L'assemblage est volontairement littéral : chaque image ajoutée devient une page unique, dans l'ordre d'ajout, et la page prend les dimensions de l'image. Aucune marge, aucune mise à l'échelle vers un format papier, aucun moteur de mise en page ne décide à votre place.",
          "Cette prévisibilité est le but recherché. Elle implique aussi qu'un ensemble de photos aux dimensions variées produise un PDF dont les pages diffèrent en taille, parfaitement valide, et parfois surprenant dans une visionneuse affichant les pages côte à côte. Redimensionnez les images au préalable si vous voulez un document uniforme.",
          ],
        },
      },
      {
        h: { en: "The text stays a picture", fr: "Le texte reste une image" },
        p: {
          en: [
          "Wrapping photographs of documents in a PDF does not make them a document. The result is a container holding pictures: the text inside cannot be searched, selected or copied, and assistive technology finds nothing to read. That is often a surprise for someone photographing receipts or a signed contract.",
          "Turning those pixels back into text requires optical character recognition, which is a different operation entirely and is not performed here. If searchable output matters, run the images through an OCR tool before or instead of this assembly.",
          ],
          fr: [
          "Emballer des photographies de documents dans un PDF n'en fait pas un document. Le résultat est un conteneur contenant des images : le texte qui s'y trouve ne peut être ni recherché, ni sélectionné, ni copié, et les technologies d'assistance n'y trouvent rien à lire. C'est souvent une surprise pour qui photographie des reçus ou un contrat signé.",
          "Retransformer ces pixels en texte exige une reconnaissance optique de caractères, opération entièrement différente qui n'est pas réalisée ici. Si un résultat interrogeable compte, passez les images dans un outil d'OCR avant cet assemblage, ou à sa place.",
          ],
        },
      },
      {
        h: { en: "Why the PDF is not much smaller than the photos", fr: "Pourquoi le PDF n'est guère plus léger que les photos" },
        p: {
          en: [
          "JPEG data is embedded as it is, without being re-encoded, so the PDF weighs roughly the sum of the images plus a small structural overhead. Assembling twenty five-megabyte phone photos produces a file of about a hundred megabytes, which many mail servers will refuse.",
          "Since the images are not recompressed, the only way to a lighter PDF is to compress them first. Reducing the resolution and quality before assembly is far more effective than anything that can be done to the PDF afterwards.",
          ],
          fr: [
          "Les données JPEG sont intégrées telles quelles, sans ré-encodage : le PDF pèse donc à peu près la somme des images, plus un petit surcoût de structure. Assembler vingt photos de téléphone de cinq mégaoctets produit un fichier d'une centaine de mégaoctets, que bien des serveurs de messagerie refuseront.",
          "Les images n'étant pas recompressées, le seul chemin vers un PDF plus léger passe par leur compression préalable. Réduire la résolution et la qualité avant l'assemblage est bien plus efficace que tout ce qu'on pourrait tenter sur le PDF ensuite.",
          ],
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
      en: "Converting PNG images to a single PDF keeps lossless quality intact while producing one file to send instead of several, a common need for screenshots, diagrams or scanned pages saved as PNG.",
      fr: "Convertir des images PNG en un seul PDF conserve la qualité sans perte tout en produisant un seul fichier à envoyer plutôt que plusieurs, un besoin courant pour des captures d'écran, diagrammes ou pages scannées enregistrées en PNG.",
    },
    points: {
      en: [
        "Because PNG is lossless, nothing is degraded when the image is embedded into the PDF, the page looks exactly as sharp as the source PNG at its native resolution.",
        "PNG files are typically heavier than JPG for photographic content, so a multi-page PDF built entirely from photo PNGs can end up considerably larger than the equivalent JPG-based PDF, worth converting genuinely photographic PNGs to JPG first if file size matters more than pixel-perfect quality.",
        "Transparency in a source PNG isn't preserved once placed on a PDF page, a page has no transparency concept of its own, so a transparent PNG renders against whatever background the PDF viewer shows.",
      ],
      fr: [
        "Le PNG étant sans perte, rien n'est dégradé lorsque l'image est intégrée au PDF, la page reste exactement aussi nette que le PNG source à sa résolution native.",
        "Les fichiers PNG sont généralement plus lourds que le JPG pour du contenu photographique, donc un PDF multi-page construit entièrement à partir de PNG photographiques peut devenir bien plus volumineux que l'équivalent basé sur du JPG, mieux vaut convertir d'abord en JPG les PNG réellement photographiques si le poids compte plus qu'une qualité parfaite.",
        "La transparence d'un PNG source n'est pas préservée une fois placée sur une page PDF, une page n'a pas de notion de transparence propre, donc un PNG transparent s'affiche sur le fond que montre la visionneuse PDF.",
      ],
    },
    faq: [
      {
        q: { en: "Should I use PNG or JPG when building a PDF from photos?", fr: "Faut-il utiliser PNG ou JPG pour construire un PDF à partir de photos ?" },
        a: {
          en: "JPG, in most cases, it's built for photographic compression and keeps the resulting PDF much smaller. Reach for PNG here only when the source images are screenshots, diagrams or scanned text where lossless quality actually matters.",
          fr: "Le JPG, dans la plupart des cas, il est conçu pour la compression photographique et garde le PDF résultant bien plus léger. Ne préférez le PNG ici que lorsque les images source sont des captures d'écran, diagrammes ou texte scanné où la qualité sans perte compte réellement.",
        },
      },
      {
        q: { en: "What happens to a PNG's transparency in the resulting PDF page?", fr: "Que devient la transparence d'un PNG dans la page PDF résultante ?" },
        a: {
          en: "It isn't preserved meaningfully, a PDF page doesn't have a transparency channel, so transparent areas of the source PNG show through as whatever background the PDF viewer displays, not as true transparency in the file.",
          fr: "Elle n'est pas préservée de façon utile, une page PDF n'a pas de canal de transparence, donc les zones transparentes du PNG source apparaissent avec le fond qu'affiche la visionneuse PDF, pas comme une vraie transparence dans le fichier.",
        },
      },
    ],
    deepDive: [
      {
        h: { en: "Transparency has to be resolved", fr: "La transparence doit être tranchée" },
        p: {
          en: [
          "A PNG can have transparent areas; a printed page cannot. When a transparent image is placed into a PDF, those pixels have to become something, and the practical answer is the white of the page showing through. On screen that usually looks correct, because most viewers display pages on white.",
          "The surprise comes with a white or pale logo, which was designed to sit on a dark background and now disappears against the page. Flatten such images onto their intended background colour before assembling, rather than after.",
          ],
          fr: [
          "Un PNG peut comporter des zones transparentes ; une page imprimée non. Quand une image transparente est placée dans un PDF, ces pixels doivent devenir quelque chose, et la réponse pratique est le blanc de la page apparaissant au travers. À l'écran, le rendu paraît généralement correct, la plupart des visionneuses affichant les pages sur blanc.",
          "La surprise vient d'un logo blanc ou clair, conçu pour reposer sur un fond sombre et qui disparaît désormais sur la page. Aplatissez ces images sur leur couleur de fond prévue avant l'assemblage, plutôt qu'après.",
          ],
        },
      },
      {
        h: { en: "PNG is the right source for text and diagrams", fr: "Le PNG est la bonne source pour du texte et des schémas" },
        p: {
          en: [
          "Because PNG is lossless, screenshots, charts and diagrams arrive in the PDF exactly as they were captured, no compression halo around the letters, no smeared thin lines. That makes this the better route than JPEG whenever the images contain an interface, a table or line art.",
          "The trade-off is weight. A page of flat colour compresses well in PNG, but a full-page screenshot at a high resolution is still a large object, and a document made of many of them adds up quickly.",
          ],
          fr: [
          "Le PNG étant sans perte, captures d'écran, graphiques et schémas arrivent dans le PDF exactement tels qu'ils ont été capturés, pas de halo de compression autour des lettres, pas de traits fins bavés. C'est donc une meilleure voie que le JPEG dès que les images contiennent une interface, un tableau ou du dessin au trait.",
          "La contrepartie est le poids. Une page en aplats se compresse bien en PNG, mais une capture pleine page en haute résolution reste un objet volumineux, et un document qui en compte beaucoup grimpe vite.",
          ],
        },
      },
      {
        h: { en: "Page size follows the image, not a paper format", fr: "La taille de page suit l'image, pas un format papier" },
        p: {
          en: [
          "Each image becomes one page whose dimensions match the image itself. Nothing is scaled to A4 or Letter, and no margin is added, a 1920 by 1080 screenshot produces a wide landscape page rather than a screenshot centred on a portrait sheet.",
          "That is usually what you want for on-screen reading and rarely what you want for printing. If the document is destined for paper, place the images into a page of the right proportions in another tool first; this one deliberately does no layout.",
          ],
          fr: [
          "Chaque image devient une page dont les dimensions correspondent à l'image elle-même. Rien n'est mis à l'échelle d'un A4 ou d'un Letter, et aucune marge n'est ajoutée, une capture de 1920 par 1080 produit une page large au format paysage, et non une capture centrée sur une feuille portrait.",
          "C'est généralement ce qu'on veut pour une lecture à l'écran, et rarement pour une impression. Si le document est destiné au papier, placez d'abord les images dans une page aux bonnes proportions avec un autre outil : celui-ci ne fait délibérément aucune mise en page.",
          ],
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
      en: "WebP images downloaded from the web often need to end up in a PDF for a report, an application, or an archive: this converts them directly, decoding WebP with the browser's native support before embedding each one as a PDF page.",
      fr: "Les images WebP téléchargées depuis le web doivent souvent finir dans un PDF pour un rapport, un dossier de candidature, ou une archive, ceci les convertit directement, en décodant le WebP grâce au support natif du navigateur avant d'intégrer chacune comme page PDF.",
    },
    points: {
      en: [
        "The browser decodes the WebP internally before it's embedded, so there's no separate conversion step to run first, drop the WebP files in directly.",
        "Because WebP is usually more compressed than an equivalent JPG or PNG, expect the resulting PDF to be noticeably lighter than one built from the same images re-saved as PNG.",
        "Transparency in a WebP source isn't preserved on the PDF page, the same limitation as PNG, a PDF page has no transparency channel of its own.",
      ],
      fr: [
        "Le navigateur décode le WebP en interne avant son intégration, donc pas d'étape de conversion séparée à faire d'abord, déposez directement les fichiers WebP.",
        "Le WebP étant généralement plus compressé qu'un JPG ou PNG équivalent, attendez-vous à un PDF résultant nettement plus léger qu'un PDF construit à partir des mêmes images réenregistrées en PNG.",
        "La transparence d'un WebP source n'est pas préservée sur la page PDF, la même limite que pour le PNG, une page PDF n'a pas de canal de transparence propre.",
      ],
    },
    faq: [
      {
        q: { en: "Do I need to convert my WebP files to JPG or PNG first?", fr: "Faut-il d'abord convertir mes fichiers WebP en JPG ou PNG ?" },
        a: {
          en: "No, the browser decodes WebP natively, so this tool accepts WebP files directly and embeds them into the PDF without a separate conversion step.",
          fr: "Non, le navigateur décode le WebP nativement, donc cet outil accepte directement les fichiers WebP et les intègre dans le PDF sans étape de conversion séparée.",
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
    deepDive: [
      {
        h: { en: "WebP is converted to PNG on the way in", fr: "Le WebP est converti en PNG au passage" },
        p: {
          en: [
          "The PDF specification has no native support for WebP. Only a handful of image encodings can be embedded directly, essentially JPEG and a couple of lossless schemes, so a WebP has to be decoded by the browser and re-encoded before it can be placed in the document.",
          "Here that intermediate format is PNG, which is lossless, so nothing further is lost beyond what the WebP had already discarded. The visible consequence is size: the object stored in the PDF is a PNG, not the compact WebP you started from.",
          ],
          fr: [
          "La spécification PDF ne gère pas nativement le WebP. Seule une poignée d'encodages d'image peut être intégrée directement, essentiellement le JPEG et deux schémas sans perte : un WebP doit donc être décodé par le navigateur puis ré-encodé avant de pouvoir être placé dans le document.",
          "Ici, ce format intermédiaire est le PNG, qui est sans perte, rien n'est donc perdu au-delà de ce que le WebP avait déjà écarté. La conséquence visible est le poids : l'objet stocké dans le PDF est un PNG, et non le WebP compact dont vous êtes parti.",
          ],
        },
      },
      {
        h: { en: "Expect the PDF to be larger than the sources", fr: "Attendez-vous à un PDF plus lourd que les sources" },
        p: {
          en: [
          "This is the counter-intuitive part. WebP is efficient precisely because of its compression, and that compression does not survive the trip into the PDF. A set of WebP images totalling two megabytes can produce a document several times that size once each one has been re-encoded as PNG.",
          "If the final size matters more than fidelity, convert the images to JPEG first and assemble from those instead. JPEG data can be embedded without re-encoding, so the document stays close to the sum of its inputs.",
          ],
          fr: [
          "C'est la partie contre-intuitive. Le WebP est efficace précisément grâce à sa compression, et cette compression ne survit pas au passage dans le PDF. Un lot d'images WebP totalisant deux mégaoctets peut produire un document plusieurs fois plus lourd une fois chacune ré-encodée en PNG.",
          "Si le poids final compte davantage que la fidélité, convertissez d'abord les images en JPEG et assemblez à partir de celles-là. Les données JPEG s'intègrent sans ré-encodage, et le document reste proche de la somme de ses entrées.",
          ],
        },
      },
      {
        h: { en: "Transparency and animation", fr: "Transparence et animation" },
        p: {
          en: [
          "A WebP with an alpha channel keeps it through the PNG step, so semi-transparent areas let the white of the page show through rather than being flattened onto a colour of the tool's choosing. The result is the same as converting a transparent PNG.",
          "Animated WebP is a different matter. A PDF page is static, so only the first frame is placed; the rest is discarded silently. If the animation carried the meaning, the PDF will not convey it.",
          ],
          fr: [
          "Un WebP doté d'un canal alpha le conserve à travers l'étape PNG : les zones semi-transparentes laissent donc apparaître le blanc de la page au lieu d'être aplaties sur une couleur choisie par l'outil. Le résultat est identique à la conversion d'un PNG transparent.",
          "Le WebP animé est un autre sujet. Une page PDF est statique : seule la première image est placée, le reste est écarté silencieusement. Si l'animation portait le sens, le PDF ne le transmettra pas.",
          ],
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
      en: "AVIF is the most heavily compressed common web image format, and this converts AVIF files straight into a PDF using the browser's native AVIF decoder, useful when you've saved AVIF images from the web and need them in one shareable document.",
      fr: "L'AVIF est le format d'image web courant le plus fortement compressé, et ceci convertit des fichiers AVIF directement en PDF grâce au décodeur AVIF natif du navigateur, utile quand vous avez enregistré des images AVIF depuis le web et devez les regrouper dans un seul document partageable.",
    },
    points: {
      en: [
        "Requires a browser with native AVIF decoding (every major browser since 2024), the decoding happens locally before the image is embedded into the PDF.",
        "AVIF's strong compression means the resulting PDF can end up noticeably smaller than the same page count built from JPG or PNG sources.",
        "As with the other image-to-PDF conversions here, transparency isn't preserved on the page, a PDF page has no transparency channel.",
      ],
      fr: [
        "Nécessite un navigateur avec décodage AVIF natif (tous les navigateurs majeurs depuis 2024), le décodage se fait localement avant que l'image ne soit intégrée au PDF.",
        "La forte compression de l'AVIF fait que le PDF résultant peut être nettement plus léger que le même nombre de pages construit depuis des sources JPG ou PNG.",
        "Comme pour les autres conversions image vers PDF ici, la transparence n'est pas préservée sur la page, une page PDF n'a pas de canal de transparence.",
      ],
    },
    faq: [
      {
        q: { en: "Why would I need to convert AVIF to PDF instead of just keeping the images?", fr: "Pourquoi convertir de l'AVIF en PDF plutôt que de garder les images ?" },
        a: {
          en: "Mainly for bundling, turning several separate AVIF files into one PDF makes them easier to send, print or archive as a single document instead of a folder of individual image files.",
          fr: "Principalement pour regrouper, transformer plusieurs fichiers AVIF séparés en un seul PDF les rend plus faciles à envoyer, imprimer ou archiver comme un document unique plutôt qu'un dossier de fichiers image individuels.",
        },
      },
      {
        q: { en: "Does converting AVIF to PDF lose any image quality?", fr: "Convertir de l'AVIF en PDF fait-il perdre en qualité d'image ?" },
        a: {
          en: "No additional loss is introduced by this tool, the already-decoded AVIF image data is embedded into the PDF page as-is. Whatever compression the AVIF already applied remains, but nothing further degrades it.",
          fr: "Aucune perte supplémentaire n'est introduite par cet outil, les données d'image AVIF déjà décodées sont intégrées telles quelles dans la page PDF. La compression déjà appliquée par l'AVIF reste, mais rien ne la dégrade davantage.",
        },
      },
    ],
    deepDive: [
      {
        h: { en: "Two re-encodings stand between AVIF and the page", fr: "Deux ré-encodages séparent l'AVIF de la page" },
        p: {
          en: [
          "Like WebP, AVIF cannot be embedded in a PDF directly, the specification predates it and supports only a small set of image encodings. The browser decodes the AVIF, the image is re-encoded as PNG, and that PNG is what ends up inside the document.",
          "PNG being lossless, no additional visual damage occurs. But every advantage AVIF had is spent at that point: the format's efficiency lives in its compression, and the compression is exactly what the intermediate step throws away.",
          ],
          fr: [
          "Comme le WebP, l'AVIF ne peut pas être intégré directement dans un PDF, la spécification lui est antérieure et ne gère qu'un petit ensemble d'encodages d'image. Le navigateur décode l'AVIF, l'image est ré-encodée en PNG, et c'est ce PNG qui se retrouve dans le document.",
          "Le PNG étant sans perte, aucun dommage visuel supplémentaire ne survient. Mais tout l'avantage de l'AVIF est dépensé à cet instant : l'efficacité du format réside dans sa compression, et cette compression est précisément ce que l'étape intermédiaire jette.",
          ],
        },
      },
      {
        h: { en: "The size increase is the steepest here", fr: "L'augmentation de poids est ici la plus forte" },
        p: {
          en: [
          "AVIF is the most efficient of the formats this tool accepts, so the gap between source and result is at its widest on this route. A photograph of a few hundred kilobytes routinely becomes several megabytes of PNG data inside the PDF, and a document of twenty such images becomes unwieldy.",
          "For a photo album or a portfolio headed for email, convert the AVIF files to JPEG first and assemble from those. JPEG is embedded without re-encoding, which keeps the document roughly the size of its inputs instead of multiplying it.",
          ],
          fr: [
          "L'AVIF est le plus efficace des formats acceptés par cet outil : l'écart entre la source et le résultat est donc maximal sur ce chemin. Une photographie de quelques centaines de kilo-octets devient couramment plusieurs mégaoctets de données PNG dans le PDF, et un document de vingt images de ce type devient ingérable.",
          "Pour un album photo ou un portfolio destiné à un e-mail, convertissez d'abord les fichiers AVIF en JPEG et assemblez à partir de ceux-là. Le JPEG s'intègre sans ré-encodage, ce qui maintient le document à peu près à la taille de ses entrées au lieu de la multiplier.",
          ],
        },
      },
      {
        h: { en: "Decoding depends on the browser, not on us", fr: "Le décodage dépend du navigateur, pas de nous" },
        p: {
          en: [
          "Everything happens on your machine, which means the AVIF is decoded by the browser you are using. Support has been broad since 2024, but a browser too old to decode AVIF simply cannot open the file, and the tool has no way to work around it: there is no server doing the decoding.",
          "The same dependency has an upside worth stating: no file is uploaded anywhere, no queue is involved, and nothing remains on a server afterwards. The limit is your browser and your available memory rather than someone else's quota.",
          ],
          fr: [
          "Tout se déroule sur votre machine, ce qui signifie que l'AVIF est décodé par le navigateur que vous utilisez. Le support est large depuis 2024, mais un navigateur trop ancien pour décoder l'AVIF ne peut tout simplement pas ouvrir le fichier, et l'outil n'a aucun moyen de contourner cela, aucun serveur n'effectue le décodage.",
          "Cette même dépendance a une contrepartie qui mérite d'être dite : aucun fichier n'est envoyé nulle part, aucune file d'attente n'intervient, et rien ne subsiste ensuite sur un serveur. La limite est votre navigateur et votre mémoire disponible, pas le quota d'un tiers.",
          ],
        },
      },
    ],
  },
];

export function findPdfPair(slug: string): PdfPair | undefined {
  return PDF_PAIRS.find((p) => p.slug === slug);
}
