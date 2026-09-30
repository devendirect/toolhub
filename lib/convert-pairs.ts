import type { Lang } from "./types";
import type { ContentSection } from "./tools-content";

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
  /**
   * Sections de fond propres à la paire. Sans elles, ces pages ne se
   * distinguaient que par une phrase et trois puces — la définition même
   * d'une page satellite aux yeux de Google.
   */
  deepDive?: ContentSection[];
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
      en: "Converting a JPG photo to WebP typically reduces file size by 25–35% at comparable visual quality, and WebP has been supported by every major browser since 2020: it is the standard choice for faster-loading web pages.",
      fr: "Convertir une photo JPG en WebP réduit généralement le poids du fichier de 25 à 35 % à qualité visuelle comparable, et le WebP est supporté par tous les navigateurs majeurs depuis 2020 : c'est le format standard pour des pages web plus rapides.",
    },
    points: {
      en: [
        "Smaller images mean a faster Largest Contentful Paint, a direct Core Web Vitals win for your pages.",
        "The conversion happens in your browser via the Canvas API: the photo is never uploaded anywhere.",
        "Start at quality 80 (the default): for photos it is visually indistinguishable from the original in most cases.",
      ],
      fr: [
        "Des images plus légères accélèrent le Largest Contentful Paint, un gain direct sur les Core Web Vitals.",
        "La conversion se fait dans votre navigateur via l'API Canvas : la photo n'est envoyée nulle part.",
        "Commencez à qualité 80 (le défaut) : pour des photos, le résultat est visuellement identique à l'original dans la plupart des cas.",
      ],
    },
    faq: [
      {
        q: { en: "Does converting JPG to WebP lose quality?", fr: "Convertir un JPG en WebP fait-il perdre en qualité ?" },
        a: {
          en: "WebP is a lossy format like JPG, so re-encoding always involves some loss, but at quality 80–90 it is not visible on photos. Choose 100 for the highest setting if the image will be edited again.",
          fr: "Le WebP est un format avec perte, comme le JPG : tout ré-encodage implique une légère perte, invisible sur des photos à qualité 80–90. Choisissez 100 si l'image doit être retravaillée ensuite.",
        },
      },
      {
        q: { en: "Is WebP supported everywhere?", fr: "Le WebP est-il supporté partout ?" },
        a: {
          en: "All browsers released since 2020 display WebP (Chrome, Firefox, Edge, Safari 14+). Some older desktop applications and e-mail clients still can't open it, keep a JPG copy if you need universal compatibility.",
          fr: "Tous les navigateurs sortis depuis 2020 affichent le WebP (Chrome, Firefox, Edge, Safari 14+). Certains logiciels de bureau et clients e-mail anciens ne l'ouvrent pas, gardez une copie JPG si vous visez une compatibilité universelle.",
        },
      },
    ],
    deepDive: [
      {
        h: { en: "Where the 25–35% saving comes from", fr: "D'où viennent les 25 à 35 % d'économie" },
        p: {
          en: [
          "WebP's lossy mode reuses the prediction machinery of the VP8 video codec. Where JPEG compresses each 8×8 block largely on its own, WebP predicts a block from its already-decoded neighbours and stores only the difference. Photographs have a lot of local similarity, so there is much less left to encode.",
          "The saving is therefore largest on smooth material (skies, skin, out-of-focus backgrounds) and smallest on noisy or highly detailed images, where prediction has little to work with. A grainy photo may only shrink by ten percent.",
          ],
          fr: [
          "Le mode avec perte du WebP réutilise la machinerie de prédiction du codec vidéo VP8. Là où le JPEG compresse chaque bloc de 8×8 largement pour lui-même, le WebP prédit un bloc à partir de ses voisins déjà décodés et ne stocke que la différence. Les photographies présentent beaucoup de similarité locale : il reste donc bien moins à encoder.",
          "L'économie est maximale sur des matériaux lisses (ciels, peaux, arrière-plans flous) et minimale sur des images bruitées ou très détaillées, où la prédiction n'a pas grand-chose à exploiter. Une photo granuleuse ne perdra parfois que dix pour cent.",
          ],
        },
      },
      {
        h: { en: "You are re-encoding, not repackaging", fr: "Vous ré-encodez, vous ne réemballez pas" },
        p: {
          en: [
          "A JPEG has already thrown away detail. Converting it decodes that approximation and compresses it again, so the WebP inherits the original's losses plus whatever the second pass discards. At quality 80 the added damage is invisible on a photograph, but it is not zero, and it accumulates if you convert repeatedly.",
          "This matters most for images that will be edited later. If you still hold the original from the camera or the design file, export WebP from that instead, the result is both smaller and cleaner than a conversion of the JPEG.",
          ],
          fr: [
          "Un JPEG a déjà écarté du détail. Le convertir décode cette approximation puis la compresse à nouveau : le WebP hérite donc des pertes de l'original, augmentées de ce que la seconde passe écarte. À qualité 80, le dommage ajouté est invisible sur une photographie, mais il n'est pas nul, et il s'accumule si vous convertissez à répétition.",
          "Cela compte surtout pour des images destinées à être retouchées plus tard. Si vous détenez encore l'original de l'appareil photo ou le fichier de création, exportez le WebP depuis celui-ci : le résultat sera à la fois plus léger et plus propre qu'une conversion du JPEG.",
          ],
        },
      },
      {
        h: { en: "Serving both formats without breaking anything", fr: "Servir les deux formats sans rien casser" },
        p: {
          en: [
          "Every browser released since 2020 displays WebP, so a modern site can ship it directly. What still lags is everything outside the browser: some email clients, older desktop software, and a few social platforms that re-encode or reject uploads.",
          "For a web page, the picture element with a WebP source and a JPEG fallback covers both worlds, the browser picks the first format it understands, and no JavaScript is involved. Keep the JPEG for anything a visitor might download and open in another application.",
          ],
          fr: [
          "Tous les navigateurs sortis depuis 2020 affichent le WebP : un site moderne peut donc le servir directement. Ce qui traîne encore, c'est tout ce qui vit hors du navigateur, certains clients de messagerie, des logiciels de bureau anciens, et quelques plateformes sociales qui ré-encodent ou refusent les envois.",
          "Pour une page web, l'élément picture avec une source WebP et un repli JPEG couvre les deux mondes : le navigateur retient le premier format qu'il comprend, sans le moindre JavaScript. Gardez le JPEG pour tout ce qu'un visiteur pourrait télécharger et ouvrir dans une autre application.",
          ],
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
        "PNG is accepted by every tool that exists, office suites, print workflows, old software, upload forms.",
        "Honest caveat: the conversion cannot restore detail the JPG compression already discarded: it only prevents new loss.",
        "Expect a larger file: lossless storage of photographic content costs several times the JPG size.",
      ],
      fr: [
        "Le PNG est accepté absolument partout, suites bureautiques, chaînes d'impression, vieux logiciels, formulaires d'upload.",
        "Limite honnête : la conversion ne restaure pas les détails déjà perdus par la compression JPG : elle empêche seulement toute nouvelle perte.",
        "Attendez-vous à un fichier plus lourd : stocker une photo sans perte coûte plusieurs fois la taille du JPG.",
      ],
    },
    faq: [
      {
        q: { en: "Will converting JPG to PNG improve the image quality?", fr: "Convertir un JPG en PNG améliore-t-il la qualité de l'image ?" },
        a: {
          en: "No. What the JPG compression discarded is gone permanently. PNG guarantees that nothing more is lost from this point on, useful before editing or archiving.",
          fr: "Non. Ce que la compression JPG a supprimé est perdu définitivement. Le PNG garantit seulement qu'aucune perte supplémentaire ne s'ajoutera, utile avant retouche ou archivage.",
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
    deepDive: [
      {
        h: { en: "Converting to PNG does not restore quality", fr: "Convertir en PNG ne restaure pas la qualité" },
        p: {
          en: [
          "PNG is lossless, which means it preserves exactly what you give it, not that it recovers what was already lost. The compression artefacts baked into a JPEG, the softened edges and the blocky patches around high contrast, are part of the image now. PNG stores them faithfully rather than removing them.",
          "So the resulting file is bigger without being better. Expect a photograph to grow several times over, because PNG's compression is designed for flat colour and repetition, not for the continuous tone that JPEG handles well.",
          ],
          fr: [
          "Le PNG est sans perte, ce qui signifie qu'il préserve exactement ce qu'on lui donne, pas qu'il récupère ce qui a déjà été perdu. Les artefacts de compression incrustés dans un JPEG, les contours adoucis et les pâtés autour des forts contrastes, font désormais partie de l'image. Le PNG les stocke fidèlement plutôt que de les supprimer.",
          "Le fichier obtenu est donc plus lourd sans être meilleur. Attendez-vous à ce qu'une photographie grossisse plusieurs fois, la compression du PNG étant conçue pour les aplats et la répétition, pas pour le ton continu que le JPEG traite bien.",
          ],
        },
      },
      {
        h: { en: "When the conversion is nevertheless the right move", fr: "Quand la conversion reste malgré tout le bon choix" },
        p: {
          en: [
          "Two cases justify it. The first is editing: if you are about to crop, annotate or composite the image and save it several times, working in PNG stops each save from adding a fresh round of JPEG loss. Convert once, work, then export back to JPEG at the end.",
          "The second is a tool that simply requires PNG, some icon pipelines, certain print workflows, and a few APIs accept nothing else. Outside those, a JPEG that is already fine is best left alone.",
          ],
          fr: [
          "Deux cas le justifient. Le premier est la retouche : si vous vous apprêtez à recadrer, annoter ou composer l'image en l'enregistrant plusieurs fois, travailler en PNG évite que chaque enregistrement n'ajoute une nouvelle passe de perte JPEG. Convertissez une fois, travaillez, puis réexportez en JPEG à la fin.",
          "Le second est un outil qui exige simplement du PNG, certaines chaînes de production d'icônes, des flux d'impression, quelques API n'acceptent rien d'autre. En dehors de ces cas, un JPEG déjà satisfaisant gagne à être laissé tel quel.",
          ],
        },
      },
      {
        h: { en: "No transparency appears out of nowhere", fr: "Aucune transparence n'apparaît par magie" },
        p: {
          en: [
          "PNG supports an alpha channel, JPEG does not. Converting adds the capability but not the content: the image arrives fully opaque, and any background you wanted removed is still there as ordinary pixels. Making it transparent is a separate editing step, not a side effect of the format change.",
          "That distinction catches people out when a logo saved as JPEG shows a white square behind it. The white is part of the picture; a converter cannot know it was meant to be background rather than subject.",
          ],
          fr: [
          "Le PNG gère un canal alpha, le JPEG non. La conversion ajoute la capacité, pas le contenu : l'image arrive entièrement opaque, et l'arrière-plan que vous vouliez retirer s'y trouve toujours sous forme de pixels ordinaires. Le rendre transparent est une étape de retouche distincte, pas un effet secondaire du changement de format.",
          "Cette distinction surprend quand un logo enregistré en JPEG affiche un carré blanc derrière lui. Le blanc fait partie de l'image ; un convertisseur ne peut pas deviner qu'il était censé être du fond plutôt que du sujet.",
          ],
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
        "Transparency (alpha channel) survives the conversion, unlike converting to JPG.",
        "Screenshots and UI graphics often shrink by 50% or more compared to the original PNG.",
        "Everything runs locally in your browser, screenshots that may contain sensitive information never leave your device.",
      ],
      fr: [
        "La transparence (couche alpha) survit à la conversion, contrairement à un passage en JPG.",
        "Les captures d'écran et graphiques d'interface perdent souvent 50 % de poids ou plus par rapport au PNG d'origine.",
        "Tout s'exécute localement dans votre navigateur, des captures potentiellement sensibles ne quittent jamais votre appareil.",
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
          en: "For screenshots with text, use 90 or 100, lossy compression at 80 can slightly blur small text. For photos inside the PNG, 80 is usually enough.",
          fr: "Pour des captures contenant du texte, choisissez 90 ou 100, la compression à 80 peut légèrement flouter les petits caractères. Pour des photos, 80 suffit généralement.",
        },
      },
      {
        q: { en: "Can I upload WebP images to WordPress?", fr: "Peut-on envoyer des images WebP dans WordPress ?" },
        a: {
          en: "Yes, the media library has accepted WebP since WordPress 5.8 (2021), as long as the server's image library supports it. Converting before upload also means the site stores the lighter file from the start instead of relying on a plugin.",
          fr: "Oui, la médiathèque accepte le WebP depuis WordPress 5.8 (2021), à condition que la bibliothèque d'images du serveur le gère. Convertir avant l'envoi permet aussi au site de stocker directement le fichier léger, sans dépendre d'une extension.",
        },
      },
    ],
    deepDive: [
      {
        h: { en: "The PageSpeed warning behind most conversions", fr: "L'alerte PageSpeed derrière la plupart des conversions" },
        p: {
          en: [
          "Most PNGs converted to WebP come from a performance report. PageSpeed Insights and Lighthouse flag heavy images with an audit asking you to serve them in a modern format, and the PNG screenshots, illustrations and logos on a page are usually the first candidates: they weigh the most for what they show.",
          "Converting fixes the format, not the dimensions. A 2,400-pixel screenshot displayed 800 pixels wide stays oversized in any format, and the same report will flag it again under image sizing. Resize first, around twice the displayed width, then convert: the full image converter does both in one pass.",
          ],
          fr: [
          "La plupart des PNG convertis en WebP viennent d'un rapport de performance. PageSpeed Insights et Lighthouse signalent les images lourdes avec un audit qui demande de les servir dans un format moderne, et les captures, illustrations et logos en PNG d'une page sont en général les premiers visés : ce sont eux qui pèsent le plus pour ce qu'ils montrent.",
          "Convertir règle le format, pas les dimensions. Une capture de 2 400 pixels affichée sur 800 reste surdimensionnée quel que soit le format, et le même rapport la signalera à nouveau au titre du dimensionnement des images. Redimensionnez d'abord, autour de deux fois la largeur affichée, puis convertissez : le convertisseur d'images complet fait les deux d'un coup.",
          ],
        },
      },
      {
        h: { en: "Two different WebP modes, one big decision", fr: "Deux modes WebP différents, une décision importante" },
        p: {
          en: [
          "WebP has a lossless mode as well as a lossy one, and the choice matters far more here than it does when converting a photograph. Lossless WebP typically beats PNG by twenty to thirty percent on the same image while remaining pixel-identical, the safe default for logos, icons and interface screenshots.",
          "Lossy WebP goes much further on file size but introduces the same class of artefact as JPEG, which is highly visible on sharp edges and flat colour. A screenshot of text compressed lossily develops fuzzy halos around the letters.",
          ],
          fr: [
          "Le WebP possède un mode sans perte en plus du mode avec perte, et le choix compte bien davantage ici que pour une photographie. Le WebP sans perte devance typiquement le PNG de vingt à trente pour cent sur la même image tout en restant identique au pixel près, le défaut sûr pour des logos, des icônes et des captures d'interface.",
          "Le WebP avec perte va bien plus loin sur le poids mais introduit la même classe d'artefacts que le JPEG, très visible sur les contours nets et les aplats. Une capture de texte compressée avec perte développe des halos flous autour des lettres.",
          ],
        },
      },
      {
        h: { en: "Transparency survives, and compresses better", fr: "La transparence survit, et compresse mieux" },
        p: {
          en: [
          "WebP keeps a full 8-bit alpha channel, so semi-transparent shadows and antialiased edges come through unchanged. That is the practical advantage over JPEG, which has no alpha at all and forces you to flatten onto a background colour.",
          "It also stores that channel more efficiently than PNG does. An icon set with soft shadows is where the saving is most obvious, because PNG pays a high price for the gradual alpha values that make the shadow look natural.",
          ],
          fr: [
          "Le WebP conserve un canal alpha complet sur 8 bits : ombres semi-transparentes et contours lissés passent donc inchangés. C'est l'avantage pratique sur le JPEG, dépourvu d'alpha, qui oblige à aplatir sur une couleur de fond.",
          "Il stocke aussi ce canal plus efficacement que le PNG. Un jeu d'icônes à ombres douces est l'endroit où l'économie saute le plus aux yeux, le PNG payant cher les valeurs d'alpha progressives qui rendent l'ombre naturelle.",
          ],
        },
      },
      {
        h: { en: "The images where PNG still wins", fr: "Les images où le PNG l'emporte encore" },
        p: {
          en: [
          "Very small graphics are the exception. A 16-pixel icon or a simple two-colour sprite can end up larger as WebP than as PNG, because the container overhead outweighs any compression gain at that size. It is worth checking rather than assuming.",
          "PNG also remains the safer choice for anything leaving the web, an image destined for a print workflow, an older desktop application or a document template, where WebP support is still patchy in a way it no longer is in browsers.",
          ],
          fr: [
          "Les très petites images font exception. Une icône de 16 pixels ou un sprite bicolore simple peut finir plus lourd en WebP qu'en PNG, le surcoût du conteneur l'emportant à cette taille sur tout gain de compression. Mieux vaut vérifier que présumer.",
          "Le PNG reste aussi le choix le plus sûr pour tout ce qui quitte le web, une image destinée à une chaîne d'impression, à une application de bureau ancienne ou à un modèle de document, où le support du WebP demeure inégal, contrairement aux navigateurs.",
          ],
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
        "Transparency notice: JPG has no alpha channel, transparent areas are filled with a white background during conversion.",
        "Use quality 90 for prints and archives, 80 for web and e-mail.",
      ],
      fr: [
        "Idéal avant d'envoyer des photos par e-mail ou vers des services avec limite de taille.",
        "Attention transparence : le JPG n'a pas de couche alpha, les zones transparentes sont remplies en blanc lors de la conversion.",
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
    deepDive: [
      {
        h: { en: "Transparency has to become something", fr: "La transparence doit bien devenir quelque chose" },
        p: {
          en: [
          "JPEG has no alpha channel, so every transparent pixel must be replaced by an actual colour. The conversion flattens the image onto a background, white here, which is invisible on a page that is already white and glaringly obvious on a dark one.",
          "Semi-transparent pixels are the ones that give it away. A soft drop shadow or an antialiased edge blends into the flattening colour, so a logo that looked clean over any background arrives with a pale fringe once placed somewhere darker. If the image needs to sit on more than one background, JPEG is the wrong target.",
          ],
          fr: [
          "Le JPEG n'a pas de canal alpha : chaque pixel transparent doit donc être remplacé par une vraie couleur. La conversion aplatit l'image sur un fond, blanc ici, invisible sur une page déjà blanche et criant sur une page sombre.",
          "Ce sont les pixels semi-transparents qui trahissent l'opération. Une ombre portée douce ou un contour lissé se fond dans la couleur d'aplatissement : un logo qui paraissait net sur n'importe quel fond arrive avec un liseré pâle dès qu'on le place sur plus sombre. Si l'image doit reposer sur plusieurs fonds, le JPEG est la mauvaise cible.",
          ],
        },
      },
      {
        h: { en: "The saving depends entirely on the picture", fr: "L'économie dépend entièrement de l'image" },
        p: {
          en: [
          "On a photograph the reduction is dramatic, often ten to one, because JPEG was built for continuous tone and PNG is poor at it. That is the case where this conversion earns its keep, typically a photo that was exported as PNG by a screenshot tool or an export preset.",
          "On flat graphics the picture reverses. A chart, a logo or an interface screenshot compresses beautifully in PNG, and JPEG may produce a file that is no smaller while adding visible ringing around every hard edge. Check the result rather than assuming the format change helped.",
          ],
          fr: [
          "Sur une photographie, la réduction est spectaculaire, souvent d'un facteur dix, parce que le JPEG a été conçu pour le ton continu et que le PNG y est mauvais. C'est le cas où cette conversion vaut le détour, typiquement une photo exportée en PNG par un outil de capture ou un préréglage d'export.",
          "Sur des images plates, la situation s'inverse. Un graphique, un logo ou une capture d'interface se compriment très bien en PNG, et le JPEG peut produire un fichier qui n'est pas plus léger tout en ajoutant un halo visible autour de chaque contour franc. Vérifiez le résultat plutôt que de présumer que le changement de format a aidé.",
          ],
        },
      },
      {
        h: { en: "Why text looks worse afterwards", fr: "Pourquoi le texte paraît moins net ensuite" },
        p: {
          en: [
          "JPEG stores colour at reduced resolution and discards high-frequency detail first. Text is nothing but high-frequency detail, abrupt transitions between two colours, so letters are exactly what the format handles worst. The result is a soft halo along the strokes, most visible on small type and on coloured backgrounds.",
          "Screenshots containing an interface therefore belong in PNG or lossless WebP. If a JPEG is unavoidable, a high quality setting reduces the effect but never removes it, because the loss happens in the frequency domain rather than at a threshold you can raise.",
          ],
          fr: [
          "Le JPEG stocke la couleur à résolution réduite et écarte d'abord les détails de haute fréquence. Or le texte n'est que cela, des transitions abruptes entre deux couleurs : les lettres sont donc exactement ce que le format traite le plus mal. Il en résulte un halo diffus le long des traits, surtout visible sur les petits corps et sur fond coloré.",
          "Les captures d'écran contenant une interface relèvent donc du PNG ou du WebP sans perte. Si un JPEG est inévitable, un réglage de qualité élevé atténue l'effet sans jamais le supprimer, la perte se produisant dans le domaine fréquentiel et non à un seuil qu'on pourrait relever.",
          ],
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
        "The most common case: an image saved from a website won't open in your editing or office software, convert it once, use it anywhere.",
        "Your browser already decodes WebP natively, so the conversion is instant and local, no upload.",
        "Transparent WebP areas become white in the JPG (JPG has no transparency).",
      ],
      fr: [
        "Le cas le plus courant : une image enregistrée depuis un site web refuse de s'ouvrir dans votre logiciel de retouche ou bureautique, convertissez-la une fois, utilisez-la partout.",
        "Votre navigateur décode déjà le WebP nativement : la conversion est instantanée et locale, aucun envoi.",
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
    deepDive: [
      {
        h: { en: "A compatibility move, not a quality one", fr: "Une démarche de compatibilité, pas de qualité" },
        p: {
          en: [
          "Browsers have supported WebP since 2020, so converting back is rarely about the web. It is about everything else: an email client that shows a broken image, a print shop that refuses the file, an older application that cannot open it, or a platform that rejects the upload.",
          "In every one of those cases JPEG is the universal answer, no format is more widely readable. Just be clear that you are trading file size for reach: the JPEG will usually be noticeably larger for the same visual quality.",
          ],
          fr: [
          "Les navigateurs gèrent le WebP depuis 2020 : reconvertir concerne donc rarement le web. Cela concerne tout le reste, un client de messagerie qui affiche une image cassée, un imprimeur qui refuse le fichier, une application ancienne incapable de l'ouvrir, ou une plateforme qui rejette l'envoi.",
          "Dans chacun de ces cas, le JPEG est la réponse universelle : aucun format n'est plus largement lisible. Sachez simplement que vous échangez du poids contre de la portée, le JPEG sera généralement sensiblement plus lourd à qualité visuelle égale.",
          ],
        },
      },
      {
        h: { en: "Two lossy passes on the same image", fr: "Deux passes avec perte sur la même image" },
        p: {
          en: [
          "If the WebP was itself encoded lossily, this is a second round of loss on top of the first. The two formats discard different things, so the JPEG cannot simply reproduce what the WebP kept: it approximates an approximation. Setting a high quality limits the damage without preventing it.",
          "A losslessly encoded WebP is a different story: there is nothing lost to compound, and the JPEG is a normal first-generation encode. You cannot tell which kind you have by looking at the file name, only by the image's history.",
          ],
          fr: [
          "Si le WebP a lui-même été encodé avec perte, il s'agit d'une seconde perte par-dessus la première. Les deux formats n'écartent pas les mêmes choses : le JPEG ne peut donc pas simplement reproduire ce que le WebP avait conservé : il approxime une approximation. Régler une qualité élevée limite le dommage sans l'empêcher.",
          "Un WebP encodé sans perte change la donne : il n'y a rien de perdu à cumuler, et le JPEG constitue un encodage de première génération ordinaire. Rien dans le nom du fichier ne dit de quel cas il s'agit, seul l'historique de l'image le révèle.",
          ],
        },
      },
      {
        h: { en: "Check the image for transparency first", fr: "Vérifiez d'abord si l'image a de la transparence" },
        p: {
          en: [
          "WebP supports an alpha channel and JPEG does not, so any transparent area is flattened onto a solid background during the conversion. Unlike a PNG, a WebP gives no visual hint in most file browsers that it carries transparency, which makes the surprise more common here.",
          "The symptom is a white box appearing behind a logo or an icon that previously sat cleanly on any colour. When that matters, convert to PNG instead: it keeps the alpha channel and is nearly as widely supported as JPEG outside the browser.",
          ],
          fr: [
          "Le WebP gère un canal alpha, le JPEG non : toute zone transparente est donc aplatie sur un fond uni lors de la conversion. Contrairement à un PNG, un WebP ne donne dans la plupart des explorateurs de fichiers aucun indice visuel qu'il porte de la transparence, ce qui rend la surprise plus fréquente ici.",
          "Le symptôme est un carré blanc apparaissant derrière un logo ou une icône qui reposait auparavant proprement sur n'importe quelle couleur. Quand cela compte, convertissez plutôt en PNG : il conserve le canal alpha et se lit presque aussi largement que le JPEG hors du navigateur.",
          ],
        },
      },
    ],
  },
  {
    slug: "webp-to-png",
    from: "webp",
    to: "png",
    why: {
      en: "Converting WebP to PNG gives you a lossless, universally supported file that keeps transparency, the right choice when the image needs to go into an editor, a document or a print workflow that doesn't accept WebP.",
      fr: "Convertir un WebP en PNG produit un fichier sans perte, lisible partout et qui conserve la transparence, le bon choix quand l'image doit entrer dans un éditeur, un document ou une chaîne d'impression qui n'accepte pas le WebP.",
    },
    points: {
      en: [
        "Unlike WebP → JPG, transparency is preserved, logos and cutout images stay usable.",
        "PNG is lossless: no additional quality is lost in the conversion itself.",
        "The PNG will be larger than the WebP: that's the price of lossless universal compatibility.",
      ],
      fr: [
        "Contrairement au passage WebP → JPG, la transparence est conservée, logos et images détourées restent exploitables.",
        "Le PNG est sans perte : la conversion elle-même ne dégrade pas l'image.",
        "Le PNG sera plus lourd que le WebP : c'est le prix d'une compatibilité universelle sans perte.",
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
          en: "No, PNG is lossless, so the PNG contains exactly what your browser decoded from the WebP. Any loss already baked into the WebP obviously remains.",
          fr: "Non, le PNG est sans perte : il contient exactement ce que votre navigateur a décodé du WebP. La perte déjà présente dans le WebP, elle, reste évidemment.",
        },
      },
      {
        q: { en: "How do I convert WebP to PNG on Windows or Mac without installing anything?", fr: "Comment convertir un WebP en PNG sur Windows ou Mac sans rien installer ?" },
        a: {
          en: "This page is the quickest route: drop the file, download the PNG, nothing is uploaded. Recent systems can also do it on their own: on Windows 11, open the image in Paint and choose Save as › PNG; on a Mac, open it in Preview and use File › Export with PNG as the format.",
          fr: "Cette page est le chemin le plus court : déposez le fichier, téléchargez le PNG, rien n'est envoyé. Les systèmes récents savent aussi le faire seuls : sur Windows 11, ouvrez l'image dans Paint puis Enregistrer sous › PNG ; sur Mac, ouvrez-la dans Aperçu puis Fichier › Exporter, format PNG.",
        },
      },
      {
        q: { en: "Why did my image download as a .webp file?", fr: "Pourquoi mon image s'est-elle téléchargée en .webp ?" },
        a: {
          en: "Because the site served it that way. Most large sites and image CDNs send WebP to browsers that support it, so \"Save image as\" keeps the format the browser received, even when the original on the server was a JPG or PNG.",
          fr: "Parce que le site l'a servie ainsi. La plupart des grands sites et des CDN d'images envoient du WebP aux navigateurs qui le gèrent : « Enregistrer l'image sous » garde donc le format reçu par le navigateur, même si l'original sur le serveur était un JPG ou un PNG.",
        },
      },
    ],
    deepDive: [
      {
        h: { en: "Where all these WebP files come from", fr: "D'où viennent tous ces fichiers WebP" },
        p: {
          en: [
          "Most people looking to convert WebP to PNG didn't choose WebP in the first place. Images saved from a website, a Google Images result or a social network increasingly arrive as .webp because the server picks that format for any browser able to display it. The file on your disk is simply what the browser received.",
          "Browsers open it without a second thought; the trouble starts afterwards. An older image editor, a slide deck, a form that only accepts JPG or PNG, a print shop: that's when the file needs converting, and when keeping transparency and avoiding a second round of compression matters, PNG is the format to ask for.",
          ],
          fr: [
          "La plupart des gens qui cherchent à convertir un WebP en PNG n'ont jamais choisi le WebP. Une image enregistrée depuis un site, un résultat Google Images ou un réseau social arrive de plus en plus souvent en .webp, parce que le serveur choisit ce format pour tout navigateur capable de l'afficher. Le fichier sur votre disque est simplement ce que le navigateur a reçu.",
          "Le navigateur l'ouvre sans broncher ; c'est après que les ennuis commencent. Un ancien logiciel de retouche, une présentation, un formulaire qui n'accepte que JPG ou PNG, un imprimeur : c'est là qu'il faut convertir, et quand il s'agit de garder la transparence et d'éviter une nouvelle compression, c'est le PNG qu'il faut demander.",
          ],
        },
      },
      {
        h: { en: "Lossless in, lossless out, with a caveat", fr: "Sans perte en entrée, sans perte en sortie, avec une réserve" },
        p: {
          en: [
          "PNG stores exactly the pixels it is given, so this conversion adds no compression damage of its own. What it cannot do is undo damage already present: a WebP that was encoded lossily arrives with its artefacts intact, and PNG preserves them faithfully rather than cleaning them up.",
          "The practical consequence is that the output is only as good as the input, while being considerably heavier. Converting a lossy WebP to PNG produces a large file containing a compressed image, the worst of both approaches, unless you specifically need the format.",
          ],
          fr: [
          "Le PNG stocke exactement les pixels qu'on lui donne : cette conversion n'ajoute donc aucun dommage de compression. Ce qu'elle ne peut pas faire, c'est défaire un dommage déjà présent, un WebP encodé avec perte arrive avec ses artefacts intacts, et le PNG les préserve fidèlement plutôt que de les nettoyer.",
          "La conséquence pratique est que la sortie ne vaut que ce que vaut l'entrée, tout en étant nettement plus lourde. Convertir un WebP avec perte en PNG produit un gros fichier contenant une image compressée, le pire des deux approches, sauf si le format vous est spécifiquement nécessaire.",
          ],
        },
      },
      {
        h: { en: "Transparency comes through untouched", fr: "La transparence passe intacte" },
        p: {
          en: [
          "Both formats carry a full 8-bit alpha channel, so this is one of the few conversions where nothing about transparency needs a decision. Soft shadows, antialiased edges and partially transparent overlays arrive exactly as they were, with no background colour to choose and no fringing to inspect afterwards.",
          "That makes PNG the right target whenever a WebP with transparency has to leave the browser, a design tool, a document, a print workflow. JPEG would force you to flatten the image and lose the ability to place it on different backgrounds.",
          ],
          fr: [
          "Les deux formats portent un canal alpha complet sur 8 bits : c'est donc l'une des rares conversions où la transparence n'appelle aucune décision. Ombres douces, contours lissés et calques partiellement transparents arrivent exactement tels quels, sans couleur de fond à choisir ni liseré à inspecter ensuite.",
          "Cela fait du PNG la bonne cible chaque fois qu'un WebP avec transparence doit quitter le navigateur, un outil de design, un document, une chaîne d'impression. Le JPEG obligerait à aplatir l'image et ferait perdre la possibilité de la poser sur différents fonds.",
          ],
        },
      },
      {
        h: { en: "Expect the file to grow", fr: "Attendez-vous à un fichier plus lourd" },
        p: {
          en: [
          "Lossless WebP generally beats PNG by twenty to thirty percent on the same content, so going the other way costs roughly that much in size. On a photograph converted from a lossy WebP the increase is far larger, several times over, because PNG has no way to compress continuous tone efficiently.",
          "If the goal is simply a smaller file rather than a specific format, this is the wrong direction entirely. Keep the WebP, or move to a lossy format if the image is photographic and its final destination accepts one.",
          ],
          fr: [
          "Le WebP sans perte devance généralement le PNG de vingt à trente pour cent sur un même contenu : faire le chemin inverse coûte donc à peu près autant en poids. Sur une photographie issue d'un WebP avec perte, l'augmentation est bien supérieure, plusieurs fois, le PNG n'ayant aucun moyen de compresser efficacement le ton continu.",
          "Si l'objectif est simplement un fichier plus léger et non un format précis, c'est exactement la mauvaise direction. Gardez le WebP, ou passez à un format avec perte si l'image est photographique et que sa destination finale en accepte un.",
          ],
        },
      },
    ],
  },
  {
    slug: "avif-to-jpg",
    from: "avif",
    to: "jpg",
    why: {
      en: "AVIF is the newest web image format and many applications still can't open it, converting AVIF to JPG in your browser produces a file that works everywhere, without installing anything.",
      fr: "L'AVIF est le format d'image web le plus récent et beaucoup d'applications ne savent toujours pas l'ouvrir, le convertir en JPG dans votre navigateur produit un fichier lisible partout, sans rien installer.",
    },
    points: {
      en: [
        "Your browser does the AVIF decoding natively (all major browsers since 2024), no codec or software needed.",
        "The file never leaves your device: decoding and re-encoding both happen locally.",
        "Pick quality 90+, the AVIF was already heavily compressed, a low JPG quality would stack visible artifacts.",
      ],
      fr: [
        "Votre navigateur décode l'AVIF nativement (tous les navigateurs majeurs depuis 2024), aucun codec ni logiciel à installer.",
        "Le fichier ne quitte jamais votre appareil : décodage et ré-encodage se font localement.",
        "Choisissez qualité 90+, l'AVIF étant déjà fortement compressé, une qualité JPG basse empilerait des artefacts visibles.",
      ],
    },
    faq: [
      {
        q: { en: "Why do I have AVIF files I can't open?", fr: "Pourquoi ai-je des fichiers AVIF impossibles à ouvrir ?" },
        a: {
          en: "More and more websites serve AVIF because it compresses better than JPG and WebP. When you save such an image, you get an .avif file, which photo viewers, office suites and older editors often don't support yet.",
          fr: "De plus en plus de sites servent de l'AVIF car il compresse mieux que le JPG et le WebP. En enregistrant une image de ce type, vous obtenez un fichier .avif, que les visionneuses, suites bureautiques et éditeurs anciens ne gèrent souvent pas encore.",
        },
      },
      {
        q: { en: "My AVIF won't load in the tool, why?", fr: "Mon AVIF ne se charge pas dans l'outil, pourquoi ?" },
        a: {
          en: "The tool relies on your browser's native AVIF decoder. Update to a recent Chrome, Firefox, Edge or Safari (16+) and it will load.",
          fr: "L'outil s'appuie sur le décodeur AVIF natif de votre navigateur. Mettez à jour vers un Chrome, Firefox, Edge ou Safari (16+) récent et le fichier se chargera.",
        },
      },
    ],
    deepDive: [
      {
        h: { en: "Why you would leave the better format", fr: "Pourquoi quitter le meilleur format" },
        p: {
          en: [
          "AVIF compresses better than anything else in general use, often half the size of a JPEG at matching quality, so converting away from it is never about efficiency. It is about the places AVIF still cannot go: email clients, print workflows, older operating systems, design software that has not caught up, and platforms that reject the upload outright.",
          "Browser support arrived later than WebP's and is now broad, but the surrounding ecosystem lags further behind. JPEG remains the format nothing refuses, which is exactly why this conversion exists.",
          ],
          fr: [
          "L'AVIF compresse mieux que tout autre format d'usage courant, souvent moitié moins lourd qu'un JPEG à qualité comparable : le quitter n'est donc jamais une question d'efficacité. C'est une question de lieux où l'AVIF ne passe toujours pas, clients de messagerie, chaînes d'impression, systèmes d'exploitation anciens, logiciels de création en retard, et plateformes qui refusent l'envoi.",
          "Le support navigateur est arrivé plus tard que celui du WebP et il est désormais large, mais l'écosystème alentour accuse un retard plus marqué. Le JPEG reste le format que rien ne refuse : c'est précisément la raison d'être de cette conversion.",
          ],
        },
      },
      {
        h: { en: "Ten bits of colour into eight", fr: "Dix bits de couleur ramenés à huit" },
        p: {
          en: [
          "AVIF can store 10 or 12 bits per colour channel; JPEG stores 8. When the source uses the extra depth (a photograph with a wide gradient sky, or an image graded in HDR) the conversion has to discard those intermediate values, and smooth gradients can develop visible banding as a result.",
          "Most AVIF files on the web are 8-bit and convert with no such issue. The risk concerns images that came out of a modern phone camera or a colour-graded workflow, where the depth was there for a reason.",
          ],
          fr: [
          "L'AVIF peut stocker 10 ou 12 bits par canal de couleur ; le JPEG en stocke 8. Quand la source exploite cette profondeur supplémentaire (une photographie au ciel largement dégradé, ou une image étalonnée en HDR) la conversion doit écarter ces valeurs intermédiaires, et des dégradés lisses peuvent en conséquence développer des bandes visibles.",
          "La plupart des fichiers AVIF du web sont en 8 bits et se convertissent sans ce souci. Le risque concerne les images issues d'un appareil photo de téléphone récent ou d'un flux étalonné, où la profondeur était présente pour une raison.",
          ],
        },
      },
      {
        h: { en: "The file will get bigger, and that is expected", fr: "Le fichier va grossir, et c'est normal" },
        p: {
          en: [
          "Expect the JPEG to be roughly twice the size for comparable quality, sometimes more on images with fine detail. Raising the JPEG quality narrows the visual gap but widens the size one; lowering it does the reverse. There is no setting that gives you AVIF's efficiency in a JPEG container.",
          "Because both formats are lossy, this is also a second encode. Keep the AVIF as your master and treat the JPEG as an export for a specific destination rather than a replacement.",
          ],
          fr: [
          "Attendez-vous à un JPEG environ deux fois plus lourd à qualité comparable, parfois davantage sur des images très détaillées. Monter la qualité du JPEG réduit l'écart visuel mais creuse l'écart de poids ; la baisser fait l'inverse. Aucun réglage ne donnera l'efficacité de l'AVIF dans un conteneur JPEG.",
          "Les deux formats étant avec perte, il s'agit par ailleurs d'un second encodage. Conservez l'AVIF comme master et traitez le JPEG comme un export vers une destination précise plutôt que comme un remplaçant.",
          ],
        },
      },
    ],
  },
  {
    slug: "avif-to-png",
    from: "avif",
    to: "png",
    why: {
      en: "Converting AVIF to PNG produces a lossless, universally readable copy that preserves transparency, the safest format to bring a downloaded AVIF into any editor or document.",
      fr: "Convertir un AVIF en PNG produit une copie sans perte, lisible partout et qui préserve la transparence, le format le plus sûr pour amener un AVIF téléchargé dans n'importe quel éditeur ou document.",
    },
    points: {
      en: [
        "Transparency in the AVIF is kept in the PNG, choose JPG instead only for photos without transparency.",
        "PNG adds no further compression loss on top of the AVIF's.",
        "Decoding happens in your browser (all major browsers since 2024) and the file stays on your device.",
      ],
      fr: [
        "La transparence de l'AVIF est conservée dans le PNG, ne préférez le JPG que pour des photos sans transparence.",
        "Le PNG n'ajoute aucune perte de compression par-dessus celle de l'AVIF.",
        "Le décodage se fait dans votre navigateur (tous les navigateurs majeurs depuis 2024) et le fichier reste sur votre appareil.",
      ],
    },
    faq: [
      {
        q: { en: "AVIF to PNG or AVIF to JPG, which should I pick?", fr: "AVIF vers PNG ou AVIF vers JPG, que choisir ?" },
        a: {
          en: "PNG for lossless quality, transparency, or if the image will be edited; JPG for the smallest universally compatible file when it's a plain photo.",
          fr: "PNG pour la qualité sans perte, la transparence, ou si l'image sera retouchée ; JPG pour le fichier compatible le plus léger s'il s'agit d'une simple photo.",
        },
      },
      {
        q: { en: "Will the PNG be bigger than the AVIF?", fr: "Le PNG sera-t-il plus lourd que l'AVIF ?" },
        a: {
          en: "Yes, usually much bigger, AVIF is one of the most efficient compressed formats and PNG is lossless. You're trading size for universal compatibility and editability.",
          fr: "Oui, souvent beaucoup plus, l'AVIF est l'un des formats compressés les plus efficaces et le PNG est sans perte. Vous échangez du poids contre une compatibilité et une éditabilité universelles.",
        },
      },
    ],
    deepDive: [
      {
        h: { en: "Choosing PNG over JPEG as the exit route", fr: "Choisir le PNG plutôt que le JPEG comme porte de sortie" },
        p: {
          en: [
          "Both are ways out of AVIF into something universally readable, but they behave differently. PNG is lossless, so it adds no second round of compression damage and keeps any transparency the AVIF carried. JPEG is smaller but lossy and has no alpha channel at all.",
          "PNG is therefore the right choice when the image has transparency, when it contains text or flat graphics, or when it is going to be edited further. JPEG is the better choice for a photograph headed straight for a page or an email.",
          ],
          fr: [
          "Les deux sont des sorties de l'AVIF vers un format universellement lisible, mais ils se comportent différemment. Le PNG est sans perte : il n'ajoute aucun second dommage de compression et conserve la transparence que portait l'AVIF. Le JPEG est plus léger mais avec perte, et totalement dépourvu de canal alpha.",
          "Le PNG est donc le bon choix quand l'image a de la transparence, quand elle contient du texte ou des aplats, ou quand elle sera encore retouchée. Le JPEG convient mieux à une photographie destinée directement à une page ou à un e-mail.",
          ],
        },
      },
      {
        h: { en: "Lossless does not mean restored", fr: "Sans perte ne veut pas dire restauré" },
        p: {
          en: [
          "Most AVIF files are encoded lossily, and PNG preserves exactly what it receives. The artefacts already present in the source are carried over pixel for pixel, the format change protects the image from further degradation but cannot repair what the AVIF encoder discarded.",
          "AVIF also has a lossless mode, though it is used rarely. When the source was encoded that way, the PNG is a genuinely exact copy of the original pixels, just in a much larger file.",
          ],
          fr: [
          "La plupart des fichiers AVIF sont encodés avec perte, et le PNG préserve exactement ce qu'il reçoit. Les artefacts déjà présents dans la source sont repris pixel pour pixel : le changement de format protège l'image d'une dégradation supplémentaire mais ne peut pas réparer ce que l'encodeur AVIF a écarté.",
          "L'AVIF dispose aussi d'un mode sans perte, rarement employé. Quand la source a été encodée ainsi, le PNG est une copie réellement exacte des pixels d'origine, simplement dans un fichier bien plus volumineux.",
          ],
        },
      },
      {
        h: { en: "Prepare for a large file", fr: "Préparez-vous à un fichier volumineux" },
        p: {
          en: [
          "The size increase here is the steepest of any conversion on this site. AVIF is the most efficient format in common use and PNG is among the least efficient for photographic content, so a photograph can grow by a factor of ten or more. A two-hundred-kilobyte AVIF becoming a three-megabyte PNG is unremarkable.",
          "That is acceptable for an image you are about to edit or hand to another application, and unacceptable for anything you intend to publish. If the destination is a web page, keep the AVIF and add a JPEG fallback rather than shipping the PNG.",
          ],
          fr: [
          "L'augmentation de poids est ici la plus forte de toutes les conversions de ce site. L'AVIF est le format le plus efficace d'usage courant et le PNG l'un des moins efficaces pour du contenu photographique : une photographie peut grossir d'un facteur dix ou davantage. Un AVIF de deux cents kilo-octets devenant un PNG de trois mégaoctets n'a rien d'anormal.",
          "C'est acceptable pour une image que vous allez retoucher ou confier à une autre application, et inacceptable pour une image destinée à la publication. Si la destination est une page web, gardez l'AVIF et ajoutez un repli JPEG plutôt que de livrer le PNG.",
          ],
        },
      },
    ],
  },
];

export function findPair(slug: string): ConvertPair | undefined {
  return CONVERT_PAIRS.find((p) => p.slug === slug);
}
