import type { Guide } from "../guides";

export const GUIDE_WEBP_AVIF_JPEG: Guide = {
  slug: "webp-avif-jpeg",
  published: "2026-09-25",
  updated: "2026-10-27",
  tools: ["image-converter", "image-compressor", "compress-to-kb", "svg-optimizer"],
  verified: "2026-10-27",
  sources: [
    { id: "chrome-jxl", title: "Shipping JPEG XL in Chrome", publisher: "Chrome for Developers", url: "https://developer.chrome.com/blog/jpeg-xl-in-chrome", official: true },
    { id: "chrome-155", title: "Chrome 155 release notes", publisher: "Chrome Platform Status", url: "https://chromestatus.com/release-notes/155", official: true },
    { id: "mozilla-jxl", title: "Intent to ship: JPEG XL", publisher: "Mozilla dev-platform", url: "https://groups.google.com/a/mozilla.org/g/dev-platform/c/3YMV4MS34KA", official: true },
    { id: "firefox-158", title: "Firefox 158 release notes for developers", publisher: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/158", official: true },
    { id: "webkit-17", title: "WebKit Features in Safari 17.0", publisher: "WebKit", url: "https://webkit.org/blog/14445/webkit-features-in-safari-17-0/", official: true },
  ],
  claims: [
    { text: { fr: "Chrome 155, sorti le 6 octobre 2026, décode le JPEG XL", en: "Chrome 155, released on 6 October 2026, decodes JPEG XL" }, source: "chrome-155" },
    { text: { fr: "Firefox 158, sorti le 13 octobre 2026, active le JPEG XL par défaut", en: "Firefox 158, released on 13 October 2026, enables JPEG XL by default" }, source: "firefox-158" },
    { text: { fr: "Avant la 158, Firefox proposait le JPEG XL en option (Firefox Labs) depuis la version 152", en: "Before 158, Firefox offered JPEG XL as an option (Firefox Labs) since version 152" }, source: "mozilla-jxl" },
    { text: { fr: "Safari lit le JPEG XL depuis la version 17.0, en septembre 2023", en: "Safari has read JPEG XL since version 17.0, in September 2023" }, source: "webkit-17" },
    { text: { fr: "Un JPEG recompressé en JPEG XL sans perte pèse en moyenne 20 % de moins", en: "A JPEG recompressed to JPEG XL without loss is 20% smaller on average" }, source: "webkit-17" },
    { text: { fr: "Nos outils images lisent un .jxl dans Chrome 155 (photo et image transparente) et le convertissent en JPG, PNG ou WebP ; Chrome 154 ne le lit pas", en: "Our image tools read a .jxl in Chrome 155 (photo and transparent image) and convert it to JPG, PNG or WebP; Chrome 154 can't read it" }, source: "test" },
  ],
  en: {
    title: "WebP, AVIF, JPEG XL or JPEG: picking a web image format",
    description: "WebP, AVIF, JPEG XL or JPEG for your website? When each format wins, which browsers read it, and why width matters more than the format you pick.",
    lead: "For photos on a website, WebP is the safe default: every current browser displays it and it's typically 25 to 35% lighter than a JPEG of the same visual quality. AVIF goes further but encodes slowly and needs a fallback on older devices. JPEG XL now opens in Chrome, Firefox and Safari, but only in their latest versions, so it still needs a fallback. Keep JPEG for files that leave the web, PNG for screenshots and logos. And before any of that, reduce the image to the width it's actually displayed at.",
    sections: [
      {
        h: "The short answer, format by format",
        blocks: [
          { table: {
            head: ["Format", "Use it for", "Watch out for"],
            rows: [
              ["WebP", "Photos and graphics on web pages, the default choice", "Some email clients and older desktop software still refuse it"],
              ["AVIF", "Large photos on high-traffic pages, with a WebP or JPEG fallback", "Slow to encode, and many apps still can't open it"],
              ["JPEG XL", "Photos, and lossless recompression of existing JPEGs, with a fallback", "Only read by browsers updated since October 2026 (Safari since 2023)"],
              ["JPEG", "Anything that leaves the web: email, office documents, print shops", "No transparency, and visible artefacts around text"],
              ["PNG", "Screenshots, logos, diagrams, anything with sharp edges or transparency", "Photos saved as PNG are several times heavier than they need to be"],
              ["SVG", "Icons and logos drawn as vectors", "Exports from design tools carry editor data worth stripping"],
            ],
          } },
          { p: "Notice that no format wins everywhere. The question isn't which one is best, but where the image is going." },
        ],
      },
      {
        h: "Width first: the saving no format can match",
        blocks: [
          { p: "Picture a 4000-pixel photo straight from a phone, placed in a column 800 pixels wide. The browser downloads every one of those pixels, then throws most of them away. That's about 25 times more pixels than the page shows, and switching from JPEG to AVIF won't recover that waste." },
          { p: "So the first step is always the same: resize to about twice the width the image is displayed at, which keeps it sharp on high-density screens. 1280 pixels for an image shown around 640 pixels wide, 1920 for a full-width banner. Only then does the format decision start to count. Our [image converter](/t/image-converter) does both in one pass: a maximum width of 1920, 1280 or 800 pixels, then WebP, JPEG or PNG." },
        ],
      },
      {
        h: "WebP: the default that works everywhere",
        blocks: [
          { p: "WebP has been displayed by every major browser since Safari added it in 2020. For photos, it's typically 25 to 35% lighter than a JPEG of comparable quality, it handles transparency (which JPEG can't), and it encodes fast enough to convert images in the browser, as our converter does." },
          { p: "Quality 80 is a good starting point for photos: in most cases you won't see the difference with the original, and the file is a fraction of the size. Go to 90 for images with smooth gradients, like skies or studio backgrounds, where lower settings can make visible bands appear." },
          { p: "Its weak spot is outside the browser. Some email clients, older office suites and upload forms still reject .webp files, which is why a WebP downloaded from a site sometimes has to be converted before it can be attached somewhere: [WebP to JPG](/convert/webp-to-jpg) for a photo, [WebP to PNG](/convert/webp-to-png) when it has transparency or will be edited again." },
        ],
      },
      {
        h: "AVIF: smaller still, with strings attached",
        blocks: [
          { p: "AVIF compresses photos harder than WebP, and the gap is largest at low file sizes, which is exactly where a web page wants to be. The reported savings vary a lot with the image and the settings, so test on your own photos rather than trusting a single percentage." },
          { p: "Support arrived in stages: Chrome 85 in 2020, Firefox 93 in 2021, Safari 16 in 2022, Edge 121 in 2024. Current devices are covered, but a phone that stopped receiving updates a few years ago may not be, so AVIF belongs inside a `<picture>` element with a WebP or JPEG fallback:" },
          { code: "<picture>\n  <source srcset=\"photo.avif\" type=\"image/avif\">\n  <source srcset=\"photo.webp\" type=\"image/webp\">\n  <img src=\"photo.jpg\" alt=\"...\" width=\"1280\" height=\"853\">\n</picture>" },
          { p: "The other cost is encoding. AVIF takes much longer to produce than WebP, which is fine in a build pipeline or an image CDN, and less fine when you convert by hand. It's also why browsers don't offer AVIF as an output format to web pages: our converter reads AVIF but can only write WebP, JPEG or PNG." },
        ],
      },
      {
        h: "JPEG XL: now readable in every major browser",
        blocks: [
          { p: "JPEG XL is a newer format, standardized as ISO/IEC 18181. Chrome reads it by default since version 155, released on 6 October 2026.[^chrome-155][^chrome-jxl] Safari has read it since version 17.0 in September 2023.[^webkit-17] Firefox followed with version 158, released on 13 October 2026, which turns it on by default[^firefox-158] after offering it as a Firefox Labs option since version 152.[^mozilla-jxl]" },
          { support: { query: "image/jxl", rows: [
            { label: "chrome 155+", state: "yes", note: "on by default · Oct 2026" },
            { label: "safari 17+", state: "yes", note: "on by default · Sept 2023" },
            { label: "firefox 158+", state: "yes", note: "on by default · Oct 2026" },
          ] } },
          { p: "Its most concrete advantage is with existing JPEGs: they can be recompressed into JPEG XL without any loss, and come out 20% smaller on average according to WebKit.[^webkit-17] For new photos, Chrome's advice is to try both AVIF and JPEG XL and compare on your own images.[^chrome-jxl]" },
          { p: "Support in Chrome and Firefox is only a few weeks old: browsers that haven't updated yet, and devices that no longer receive updates, can't read it. So JPEG XL still goes in a `<picture>` element, before the other formats, with a WebP or JPEG fallback that every browser can read:" },
          { code: "<picture>\n  <source srcset=\"photo.jxl\" type=\"image/jxl\">\n  <source srcset=\"photo.webp\" type=\"image/webp\">\n  <img src=\"photo.jpg\" alt=\"...\" width=\"1280\" height=\"853\">\n</picture>" },
          { p: "Our image tools read a .jxl file in browsers that can decode it: we tested a photo and a transparent image in Chrome 155, in the [image converter](/t/image-converter), the [image compressor](/t/image-compressor) and the [compress to KB tool](/t/compress-to-kb). They write JPG, PNG or WebP, not JPEG XL: to turn a .jxl into a file any app can open, see [JXL to JPG](/convert/jxl-to-jpg) or, to keep transparency, [JXL to PNG](/convert/jxl-to-png). In a browser that can't read the file, the tool says so instead of producing an empty image." },
        ],
      },
      {
        h: "JPEG and PNG: still the right answer, in their place",
        blocks: [
          { p: "JPEG opens everywhere, in every piece of software written in the last thirty years. That makes it the right format for anything that leaves the web: a photo attached to an email, inserted into a Word document, sent to a print shop. Its weakness is text and sharp lines, which pick up a faint halo of artefacts." },
          { p: "PNG is lossless. For a screenshot, a logo or a diagram, that's perfect: every pixel stays exactly as captured. For a photo, it's the wrong tool. Converting a photographic JPEG to PNG routinely makes the file several times heavier with no visible gain, and our converter shows that honestly as a +% in orange rather than a saving. The reverse trip is the useful one on a website: a screenshot or logo usually gets much lighter as WebP and keeps its transparency, see [PNG to WebP](/convert/png-to-webp)." },
          { p: "For icons and logos, the best format is often no bitmap at all. An SVG stays sharp at any size; just strip the editor data that Figma or Illustrator leave in the file with the [SVG optimizer](/t/svg-optimizer)." },
        ],
      },
      {
        h: "What converting does to your photos",
        blocks: [
          { p: "Converting in the browser redraws the image from its pixels, so everything that isn't a pixel stays behind. That includes EXIF metadata: GPS position, phone model, date taken. Before publishing a photo, that's a feature. If you need the location or the date later, keep the original." },
          { p: "Two more details. Transparent areas turn white when you export to JPEG, since JPEG has no alpha channel. And iPhone photos in HEIC can only be decoded by Safari among browsers; elsewhere, our [HEIC to JPG](/convert/heic-to-jpg) page brings its own decoder and converts them in the tab." },
          { p: "When you only want a lighter file in the same format, use the [image compressor](/t/image-compressor) instead: it keeps the format, lets you set the quality from 10 to 100, and shows the exact number of bytes saved. If a form imposes a limit such as 100 KB, let the [compress to KB tool](/t/compress-to-kb) find the setting for you." },
        ],
      },
    ],
    faq: [
      { q: "Is WebP better than JPEG for SEO?", a: "Indirectly. Search engines don't rank a format, but lighter images load faster, which improves Largest Contentful Paint, one of the Core Web Vitals. Resizing to the display width usually saves even more than the format change." },
      { q: "Should I use AVIF instead of WebP?", a: "Use AVIF in addition to WebP, not instead of it. Serve AVIF first in a picture element, with WebP or JPEG as the fallback, so older devices still get an image. If you can only produce one format, WebP is the safer choice." },
      { q: "What quality setting should I use for WebP?", a: "80 for most photos, which is visually very close to the original. Go to 90 for images with smooth gradients or fine texture, and keep 100 for files you'll edit again rather than publish." },
      { q: "Can I use JPEG XL on my website?", a: "Yes, inside a picture element with a WebP or JPEG fallback. Chrome reads it since version 155, Firefox since version 158 and Safari since version 17, but browsers that haven't updated yet can't, so the fallback is still needed." },
      { q: "Why is my PNG bigger than the JPEG it came from?", a: "Because PNG is lossless and can't compress photographic detail the way JPEG does. Converting a photo to PNG adds weight without restoring any quality the JPEG already lost. Use PNG for screenshots and graphics, not photos." },
    ],
  },
  fr: {
    title: "WebP, AVIF, JPEG XL ou JPEG : quel format d'image web ?",
    description: "WebP, AVIF, JPEG XL ou JPEG pour votre site ? Quand chaque format l'emporte, ce que lisent les navigateurs, et pourquoi la largeur compte plus.",
    lead: "Pour les photos d'un site web, le WebP est le choix sûr par défaut : tous les navigateurs actuels l'affichent et il pèse en général 25 à 35 % de moins qu'un JPEG de qualité visuelle équivalente. L'AVIF va plus loin mais s'encode lentement et demande une solution de repli sur les appareils anciens. Le JPEG XL s'ouvre désormais dans Chrome, Firefox et Safari, mais seulement dans leurs dernières versions : il lui faut encore un repli. Gardez le JPEG pour les fichiers qui quittent le web, le PNG pour les captures et les logos. Et avant tout cela, réduisez l'image à la largeur à laquelle elle s'affiche vraiment.",
    sections: [
      {
        h: "La réponse courte, format par format",
        blocks: [
          { table: {
            head: ["Format", "À utiliser pour", "À surveiller"],
            rows: [
              ["WebP", "Photos et graphismes des pages web, le choix par défaut", "Certains clients mail et vieux logiciels le refusent encore"],
              ["AVIF", "Grandes photos sur des pages très visitées, avec repli WebP ou JPEG", "Lent à encoder, et beaucoup d'applications ne l'ouvrent pas encore"],
              ["JPEG XL", "Photos, et recompression sans perte de JPEG existants, avec un repli", "Lu seulement par les navigateurs à jour depuis octobre 2026 (Safari depuis 2023)"],
              ["JPEG", "Tout ce qui quitte le web : e-mail, documents bureautiques, imprimeurs", "Pas de transparence, et des artefacts visibles autour du texte"],
              ["PNG", "Captures d'écran, logos, schémas, tout ce qui a des bords nets ou de la transparence", "Une photo enregistrée en PNG pèse plusieurs fois ce qu'elle devrait"],
              ["SVG", "Icônes et logos dessinés en vectoriel", "Les exports des logiciels de design contiennent des données à retirer"],
            ],
          } },
          { p: "Aucun format ne gagne partout. La question n'est pas de savoir lequel est le meilleur, mais où l'image va." },
        ],
      },
      {
        h: "La largeur d'abord : le gain qu'aucun format n'égale",
        blocks: [
          { p: "Imaginez une photo de 4000 pixels sortie d'un téléphone, placée dans une colonne de 800 pixels. Le navigateur télécharge chacun de ces pixels, puis en jette la plupart. C'est environ 25 fois plus de pixels que ce que la page affiche, et passer du JPEG à l'AVIF ne rattrapera pas ce gaspillage." },
          { p: "La première étape est donc toujours la même : réduire l'image à environ deux fois sa largeur d'affichage, ce qui la garde nette sur les écrans haute densité. 1280 pixels pour une image affichée sur environ 640, 1920 pour un bandeau pleine largeur. Ce n'est qu'ensuite que le choix du format commence à compter. Notre [convertisseur d'images](/t/image-converter) fait les deux d'un coup : une largeur maximale de 1920, 1280 ou 800 pixels, puis WebP, JPEG ou PNG." },
        ],
      },
      {
        h: "WebP : le choix par défaut qui marche partout",
        blocks: [
          { p: "Le WebP est affiché par tous les grands navigateurs depuis que Safari l'a ajouté en 2020. Pour des photos, il pèse en général 25 à 35 % de moins qu'un JPEG de qualité comparable, il gère la transparence (ce que le JPEG ne sait pas faire), et il s'encode assez vite pour convertir des images directement dans le navigateur, comme le fait notre convertisseur." },
          { p: "La qualité 80 est un bon point de départ pour des photos : la plupart du temps, on ne voit pas la différence avec l'original, et le fichier ne pèse qu'une fraction de sa taille. Montez à 90 pour les images à dégradés doux, comme un ciel ou un fond de studio, où les réglages plus bas peuvent faire apparaître des bandes." },
          { p: "Son point faible est hors du navigateur. Certains clients mail, de vieilles suites bureautiques et des formulaires d'envoi refusent encore les fichiers .webp : c'est pourquoi un WebP téléchargé sur un site doit parfois être converti avant de pouvoir être joint quelque part : [WebP en JPG](/convert/webp-to-jpg) pour une photo, [WebP en PNG](/convert/webp-to-png) si l'image a de la transparence ou doit être retouchée." },
        ],
      },
      {
        h: "AVIF : encore plus léger, sous conditions",
        blocks: [
          { p: "L'AVIF compresse les photos plus fort que le WebP, et l'écart est le plus grand aux petites tailles de fichier, précisément là où une page web veut se trouver. Les gains annoncés varient beaucoup selon l'image et les réglages : testez sur vos propres photos plutôt que de vous fier à un pourcentage unique." },
          { p: "La prise en charge est arrivée par étapes : Chrome 85 en 2020, Firefox 93 en 2021, Safari 16 en 2022, Edge 121 en 2024. Les appareils actuels sont couverts, mais un téléphone qui ne reçoit plus de mises à jour depuis quelques années peut ne pas l'être. L'AVIF se place donc dans un élément `<picture>`, avec un repli en WebP ou en JPEG :" },
          { code: "<picture>\n  <source srcset=\"photo.avif\" type=\"image/avif\">\n  <source srcset=\"photo.webp\" type=\"image/webp\">\n  <img src=\"photo.jpg\" alt=\"...\" width=\"1280\" height=\"853\">\n</picture>" },
          { p: "L'autre coût, c'est l'encodage. Produire un AVIF prend bien plus longtemps qu'un WebP : aucun souci dans une chaîne de build ou un CDN d'images, davantage quand on convertit à la main. C'est aussi pour ça que les navigateurs ne proposent pas l'AVIF comme format de sortie aux pages web : notre convertisseur lit l'AVIF mais ne sait écrire que du WebP, du JPEG ou du PNG." },
        ],
      },
      {
        h: "JPEG XL : désormais lisible dans tous les grands navigateurs",
        blocks: [
          { p: "Le JPEG XL est un format plus récent, normalisé sous la référence ISO/IEC 18181. Chrome le lit par défaut depuis la version 155, sortie le 6 octobre 2026.[^chrome-155][^chrome-jxl] Safari le lit depuis sa version 17.0, en septembre 2023.[^webkit-17] Firefox a suivi avec la version 158, sortie le 13 octobre 2026, qui l'active par défaut[^firefox-158] après l'avoir proposé en option dans Firefox Labs depuis la version 152.[^mozilla-jxl]" },
          { support: { query: "image/jxl", rows: [
            { label: "chrome 155+", state: "yes", note: "par défaut · oct. 2026" },
            { label: "safari 17+", state: "yes", note: "par défaut · sept. 2023" },
            { label: "firefox 158+", state: "yes", note: "par défaut · oct. 2026" },
          ] } },
          { p: "Son atout le plus concret concerne les JPEG existants : ils peuvent être recompressés en JPEG XL sans aucune perte, et ressortent en moyenne 20 % plus légers d'après WebKit.[^webkit-17] Pour de nouvelles photos, Chrome conseille d'essayer l'AVIF et le JPEG XL et de comparer sur vos propres images.[^chrome-jxl]" },
          { p: "La prise en charge par Chrome et Firefox n'a que quelques semaines : les navigateurs pas encore mis à jour, et les appareils qui ne reçoivent plus de mises à jour, ne le lisent pas. Le JPEG XL se place donc toujours dans un élément `<picture>`, avant les autres formats, avec un repli en WebP ou en JPEG que tous les navigateurs savent lire :" },
          { code: "<picture>\n  <source srcset=\"photo.jxl\" type=\"image/jxl\">\n  <source srcset=\"photo.webp\" type=\"image/webp\">\n  <img src=\"photo.jpg\" alt=\"...\" width=\"1280\" height=\"853\">\n</picture>" },
          { p: "Nos outils images lisent un fichier .jxl dans les navigateurs qui savent le décoder : nous avons testé une photo et une image transparente dans Chrome 155, avec le [convertisseur d'images](/t/image-converter), le [compresseur d'images](/t/image-compressor) et l'outil [réduire une image à X Ko](/t/compress-to-kb). Ils produisent du JPG, du PNG ou du WebP, pas du JPEG XL : pour transformer un .jxl en fichier que tout logiciel sait ouvrir, voir [JXL en JPG](/convert/jxl-to-jpg) ou, pour garder la transparence, [JXL en PNG](/convert/jxl-to-png). Dans un navigateur qui ne sait pas lire le fichier, l'outil le signale au lieu de produire une image vide." },
        ],
      },
      {
        h: "JPEG et PNG : toujours la bonne réponse, à leur place",
        blocks: [
          { p: "Le JPEG s'ouvre partout, dans tous les logiciels écrits depuis trente ans. C'est donc le bon format pour tout ce qui quitte le web : une photo jointe à un e-mail, insérée dans un document Word, envoyée à un imprimeur. Son point faible, c'est le texte et les traits fins, qui se couvrent d'un léger halo d'artefacts." },
          { p: "Le PNG est sans perte. Pour une capture d'écran, un logo ou un schéma, c'est parfait : chaque pixel reste tel qu'il a été capturé. Pour une photo, c'est le mauvais outil. Convertir un JPEG photographique en PNG rend couramment le fichier plusieurs fois plus lourd, sans gain visible, et notre convertisseur l'affiche franchement, avec un +% en orange plutôt qu'un gain. Le chemin inverse est celui qui sert sur un site : une capture ou un logo s'allège en général nettement en WebP et garde sa transparence, voir [PNG en WebP](/convert/png-to-webp)." },
          { p: "Pour les icônes et les logos, le meilleur format n'est souvent pas une image matricielle du tout. Un SVG reste net à toutes les tailles ; retirez simplement les données d'éditeur que Figma ou Illustrator laissent dans le fichier, avec l'[optimiseur SVG](/t/svg-optimizer)." },
        ],
      },
      {
        h: "Ce que la conversion fait à vos photos",
        blocks: [
          { p: "Convertir dans le navigateur redessine l'image à partir de ses pixels : tout ce qui n'est pas pixel reste en route. Y compris les métadonnées EXIF : position GPS, modèle de téléphone, date de prise de vue. Avant de publier une photo, c'est un avantage. Si vous avez besoin plus tard du lieu ou de la date, gardez l'original." },
          { p: "Deux détails encore. Les zones transparentes deviennent blanches à l'export en JPEG, puisque le JPEG n'a pas de couche alpha. Et parmi les navigateurs, seul Safari sait décoder les photos d'iPhone en HEIC ; ailleurs, notre page [HEIC en JPG](/convert/heic-to-jpg) apporte son propre décodeur et les convertit dans l'onglet." },
          { p: "Quand vous voulez seulement un fichier plus léger dans le même format, utilisez plutôt le [compresseur d'images](/t/image-compressor) : il garde le format, règle la qualité de 10 à 100 et affiche le nombre exact d'octets gagnés. Si un formulaire impose une limite comme 100 Ko, laissez l'outil [réduire une image à X Ko](/t/compress-to-kb) trouver le réglage à votre place." },
        ],
      },
    ],
    faq: [
      { q: "Le WebP est-il meilleur que le JPEG pour le SEO ?", a: "Indirectement. Les moteurs ne classent pas un format, mais des images plus légères se chargent plus vite, ce qui améliore le Largest Contentful Paint, l'un des Core Web Vitals. Réduire à la largeur d'affichage fait en général gagner encore plus que le changement de format." },
      { q: "Faut-il utiliser l'AVIF à la place du WebP ?", a: "En plus du WebP, pas à sa place. Servez l'AVIF en premier dans un élément picture, avec le WebP ou le JPEG en repli, pour que les appareils anciens reçoivent quand même une image. Si vous ne pouvez produire qu'un format, le WebP est le choix le plus sûr." },
      { q: "Quelle qualité choisir pour le WebP ?", a: "80 pour la plupart des photos, visuellement très proche de l'original. Montez à 90 pour les images à dégradés doux ou à texture fine, et gardez 100 pour des fichiers à retoucher plutôt qu'à publier." },
      { q: "Puis-je utiliser le JPEG XL sur mon site ?", a: "Oui, dans un élément picture avec un repli en WebP ou en JPEG. Chrome le lit depuis la version 155, Firefox depuis la version 158 et Safari depuis la version 17, mais les navigateurs pas encore mis à jour ne le lisent pas : le repli reste nécessaire." },
      { q: "Pourquoi mon PNG est-il plus lourd que le JPEG d'origine ?", a: "Parce que le PNG est sans perte et ne sait pas compresser le détail photographique comme le JPEG. Convertir une photo en PNG ajoute du poids sans rendre la qualité que le JPEG avait déjà perdue. Réservez le PNG aux captures et aux graphismes." },
    ],
  },
};
